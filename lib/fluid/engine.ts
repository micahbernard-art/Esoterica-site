/*
MIT License

Copyright (c) 2017 Pavel Dobryakov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { FLUID_PALETTES, type FluidColor, type FluidRoute } from "./palettes";
import { fluidShaderSources } from "./shaders";

type GL = WebGLRenderingContext | WebGL2RenderingContext;

type TextureFormat = {
  internalFormat: number;
  format: number;
  type: number;
  filtering: number;
};

type Target = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
  texelX: number;
  texelY: number;
};

type DoubleTarget = {
  read: Target;
  write: Target;
  swap: () => void;
};

type ProgramInfo = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

type PendingSplat = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: FluidColor;
};

export type AstralFluidOptions = {
  constrained: boolean;
  initialRoute: FluidRoute;
};

export type AstralFluidEngine = {
  dispose: () => void;
  pause: () => void;
  queuePointer: (x: number, y: number, dx: number, dy: number) => void;
  queueScroll: (deltaY: number) => void;
  requestResize: () => void;
  resume: () => void;
  setRoute: (route: FluidRoute) => void;
};

const CONTEXT_OPTIONS: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: false,
  desynchronized: true,
  powerPreference: "low-power",
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  stencil: false,
};

export function createAstralFluidEngine(
  canvas: HTMLCanvasElement,
  options: AstralFluidOptions,
): AstralFluidEngine | null {
  const webgl2 = canvas.getContext("webgl2", CONTEXT_OPTIONS);
  const gl = (webgl2 ??
    canvas.getContext("webgl", CONTEXT_OPTIONS) ??
    canvas.getContext(
      "experimental-webgl",
      CONTEXT_OPTIONS,
    )) as GL | null;

  if (!gl) return null;

  const isWebGL2 = Boolean(webgl2);
  const textureFormat = resolveTextureFormat(gl, isWebGL2);
  if (!textureFormat) return null;

  const manualFiltering = textureFormat.filtering === gl.NEAREST;
  const shaderSources = fluidShaderSources(isWebGL2, manualFiltering);
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, shaderSources.vertex);
  if (!vertexShader) return null;

  const programs = {
    clear: createProgram(gl, vertexShader, shaderSources.clear),
    display: createProgram(gl, vertexShader, shaderSources.display),
    splat: createProgram(gl, vertexShader, shaderSources.splat),
    advection: createProgram(gl, vertexShader, shaderSources.advection),
    divergence: createProgram(gl, vertexShader, shaderSources.divergence),
    curl: createProgram(gl, vertexShader, shaderSources.curl),
    vorticity: createProgram(gl, vertexShader, shaderSources.vorticity),
    pressure: createProgram(gl, vertexShader, shaderSources.pressure),
    gradientSubtract: createProgram(
      gl,
      vertexShader,
      shaderSources.gradientSubtract,
    ),
  };

  if (Object.values(programs).some((program) => program === null)) {
    for (const program of Object.values(programs)) {
      if (program) gl.deleteProgram(program.program);
    }
    gl.deleteShader(vertexShader);
    return null;
  }
  const fluidPrograms = programs as Record<keyof typeof programs, ProgramInfo>;

  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  if (!positionBuffer || !indexBuffer) {
    if (positionBuffer) gl.deleteBuffer(positionBuffer);
    if (indexBuffer) gl.deleteBuffer(indexBuffer);
    gl.deleteShader(vertexShader);
    for (const info of Object.values(fluidPrograms)) {
      gl.deleteProgram(info.program);
    }
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  );
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const simBase = options.constrained ? 48 : 64;
  const dyeBase = options.constrained ? 128 : 256;
  const pressureIterations = options.constrained ? 6 : 8;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, options.constrained ? 1 : 1.25);
  const frameInterval = 1000 / (options.constrained ? 24 : 30);

  let velocity: DoubleTarget | null = null;
  let dye: DoubleTarget | null = null;
  let divergence: Target | null = null;
  let curl: Target | null = null;
  let pressure: DoubleTarget | null = null;
  let route = options.initialRoute;
  let paletteIndex = 0;
  let pendingPointer: PendingSplat | null = null;
  let pendingScroll = 0;
  let resizePending = false;
  let disposed = false;
  let paused = false;
  let animationFrame: number | null = null;
  let previousFrameTime = performance.now();
  let lastRenderTime = 0;
  let lastAmbientTime = 0;

  const bind = (info: ProgramInfo) => gl.useProgram(info.program);
  const attach = (target: Target, unit: number) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);
    return unit;
  };
  const blit = (target: Target | null) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  const deleteTarget = (target: Target | null | undefined) => {
    if (!target) return;
    gl.deleteTexture(target.texture);
    gl.deleteFramebuffer(target.framebuffer);
  };

  const destroyTargets = () => {
    const targets = [
      velocity?.read,
      velocity?.write,
      dye?.read,
      dye?.write,
      divergence,
      curl,
      pressure?.read,
      pressure?.write,
    ];
    for (const target of targets) {
      deleteTarget(target);
    }
    velocity = null;
    dye = null;
    divergence = null;
    curl = null;
    pressure = null;
  };

  const makeTarget = (width: number, height: number): Target | null => {
    const texture = gl.createTexture();
    const framebuffer = gl.createFramebuffer();
    if (!texture || !framebuffer) {
      if (texture) gl.deleteTexture(texture);
      if (framebuffer) gl.deleteFramebuffer(framebuffer);
      return null;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, textureFormat.filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, textureFormat.filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      textureFormat.internalFormat,
      width,
      height,
      0,
      textureFormat.format,
      textureFormat.type,
      null,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.deleteTexture(texture);
      gl.deleteFramebuffer(framebuffer);
      return null;
    }
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture,
      framebuffer,
      width,
      height,
      texelX: 1 / width,
      texelY: 1 / height,
    };
  };

  const makeDoubleTarget = (
    width: number,
    height: number,
  ): DoubleTarget | null => {
    const first = makeTarget(width, height);
    if (!first) return null;
    const second = makeTarget(width, height);
    if (!second) {
      deleteTarget(first);
      return null;
    }
    const pair: DoubleTarget = {
      read: first,
      write: second,
      swap() {
        const next = pair.read;
        pair.read = pair.write;
        pair.write = next;
      },
    };
    return pair;
  };

  const resolution = (base: number) => {
    const aspect = canvas.width / Math.max(canvas.height, 1);
    return aspect >= 1
      ? { width: Math.round(base * aspect), height: base }
      : { width: base, height: Math.round(base / aspect) };
  };

  const initializeTargets = () => {
    destroyTargets();
    const sim = resolution(simBase);
    const dyeResolution = resolution(dyeBase);
    velocity = makeDoubleTarget(sim.width, sim.height);
    dye = makeDoubleTarget(dyeResolution.width, dyeResolution.height);
    divergence = makeTarget(sim.width, sim.height);
    curl = makeTarget(sim.width, sim.height);
    pressure = makeDoubleTarget(sim.width, sim.height);
    if (!velocity || !dye || !divergence || !curl || !pressure) {
      destroyTargets();
      return false;
    }
    seedRoute();
    return true;
  };

  const resize = () => {
    const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
    const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
    if (canvas.width === width && canvas.height === height && velocity) return true;
    canvas.width = width;
    canvas.height = height;
    return initializeTargets();
  };

  const nextColor = (): FluidColor => {
    const palette = FLUID_PALETTES[route];
    const color = palette[paletteIndex % palette.length];
    paletteIndex += 1;
    return color;
  };

  const splat = (input: PendingSplat) => {
    if (!velocity || !dye) return;
    const info = fluidPrograms.splat;
    bind(info);
    gl.uniform1f(info.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(info.uniforms.point, input.x, 1 - input.y);
    gl.uniform1f(
      info.uniforms.radius,
      0.0018 * Math.max(1, canvas.width / canvas.height),
    );
    gl.uniform1i(info.uniforms.uTarget, attach(velocity.read, 0));
    gl.uniform3f(info.uniforms.color, input.dx, -input.dy, 0);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(info.uniforms.uTarget, attach(dye.read, 0));
    gl.uniform3f(
      info.uniforms.color,
      input.color[0] * 0.72,
      input.color[1] * 0.72,
      input.color[2] * 0.72,
    );
    blit(dye.write);
    dye.swap();
  };

  function seedRoute() {
    const seeds = options.constrained ? 2 : 3;
    for (let index = 0; index < seeds; index += 1) {
      const phase = index / seeds;
      splat({
        x: 0.2 + phase * 0.62,
        y: 0.28 + (index % 2) * 0.44,
        dx: (index % 2 ? -1 : 1) * 12,
        dy: (0.5 - phase) * 18,
        color: nextColor(),
      });
    }
  }

  const simulate = (dt: number) => {
    if (!velocity || !dye || !divergence || !curl || !pressure) return;
    gl.disable(gl.BLEND);

    let info = fluidPrograms.curl;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(info.uniforms.uVelocity, attach(velocity.read, 0));
    blit(curl);

    info = fluidPrograms.vorticity;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(info.uniforms.uVelocity, attach(velocity.read, 0));
    gl.uniform1i(info.uniforms.uCurl, attach(curl, 1));
    gl.uniform1f(info.uniforms.curl, 16);
    gl.uniform1f(info.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    info = fluidPrograms.divergence;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(info.uniforms.uVelocity, attach(velocity.read, 0));
    blit(divergence);

    info = fluidPrograms.clear;
    bind(info);
    gl.uniform1i(info.uniforms.uTexture, attach(pressure.read, 0));
    gl.uniform1f(info.uniforms.value, 0.78);
    blit(pressure.write);
    pressure.swap();

    info = fluidPrograms.pressure;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(info.uniforms.uDivergence, attach(divergence, 0));
    for (let index = 0; index < pressureIterations; index += 1) {
      gl.uniform1i(info.uniforms.uPressure, attach(pressure.read, 1));
      blit(pressure.write);
      pressure.swap();
    }

    info = fluidPrograms.gradientSubtract;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    gl.uniform1i(info.uniforms.uPressure, attach(pressure.read, 0));
    gl.uniform1i(info.uniforms.uVelocity, attach(velocity.read, 1));
    blit(velocity.write);
    velocity.swap();

    info = fluidPrograms.advection;
    bind(info);
    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    if (manualFiltering) {
      gl.uniform2f(
        info.uniforms.dyeTexelSize,
        velocity.read.texelX,
        velocity.read.texelY,
      );
    }
    const velocityUnit = attach(velocity.read, 0);
    gl.uniform1i(info.uniforms.uVelocity, velocityUnit);
    gl.uniform1i(info.uniforms.uSource, velocityUnit);
    gl.uniform1f(info.uniforms.dt, dt);
    gl.uniform1f(info.uniforms.dissipation, 0.22);
    blit(velocity.write);
    velocity.swap();

    gl.uniform2f(info.uniforms.texelSize, velocity.read.texelX, velocity.read.texelY);
    if (manualFiltering) {
      gl.uniform2f(info.uniforms.dyeTexelSize, dye.read.texelX, dye.read.texelY);
    }
    gl.uniform1i(info.uniforms.uVelocity, attach(velocity.read, 0));
    gl.uniform1i(info.uniforms.uSource, attach(dye.read, 1));
    gl.uniform1f(info.uniforms.dissipation, 0.075);
    blit(dye.write);
    dye.swap();
  };

  const render = () => {
    if (!dye) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const info = fluidPrograms.display;
    bind(info);
    gl.uniform1i(info.uniforms.uTexture, attach(dye.read, 0));
    gl.uniform1f(info.uniforms.opacity, options.constrained ? 0.3 : 0.38);
    blit(null);
    gl.disable(gl.BLEND);
  };

  const consumeInputs = (time: number) => {
    if (pendingPointer) {
      splat(pendingPointer);
      pendingPointer = null;
    }
    if (Math.abs(pendingScroll) > 0.5) {
      const direction = Math.sign(pendingScroll);
      const phase = (time * 0.00009) % 1;
      splat({
        x: 0.16 + phase * 0.68,
        y: 0.5 + Math.sin(time * 0.0007) * 0.22,
        dx: direction * Math.min(22, Math.abs(pendingScroll) * 0.08),
        dy: direction * 8,
        color: nextColor(),
      });
      pendingScroll = 0;
    }
    if (time - lastAmbientTime > (options.constrained ? 5200 : 3600)) {
      lastAmbientTime = time;
      const phase = (time * 0.00004) % 1;
      splat({
        x: 0.18 + phase * 0.64,
        y: 0.5 + Math.sin(time * 0.0003) * 0.28,
        dx: Math.cos(time * 0.0004) * 7,
        dy: Math.sin(time * 0.0004) * 7,
        color: nextColor(),
      });
    }
  };

  const requestFrame = () => {
    if (!disposed && !paused && animationFrame === null) {
      animationFrame = window.requestAnimationFrame(frame);
    }
  };

  const frame = (time: number) => {
    animationFrame = null;
    if (disposed || paused) return;
    if (time - lastRenderTime < frameInterval) {
      requestFrame();
      return;
    }
    const dt = Math.min(0.034, Math.max(0.001, (time - previousFrameTime) / 1000));
    previousFrameTime = time;
    lastRenderTime = time;
    if (resizePending) {
      resizePending = false;
      if (!resize()) {
        paused = true;
        return;
      }
    }
    consumeInputs(time);
    simulate(dt);
    render();
    requestFrame();
  };

  if (!resize()) {
    destroyTargets();
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(indexBuffer);
    gl.deleteShader(vertexShader);
    for (const info of Object.values(fluidPrograms)) {
      gl.deleteProgram(info.program);
    }
    return null;
  }
  requestFrame();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      destroyTargets();
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteShader(vertexShader);
      for (const info of Object.values(fluidPrograms)) gl.deleteProgram(info.program);
    },
    pause() {
      paused = true;
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    },
    queuePointer(x, y, dx, dy) {
      pendingPointer = {
        x,
        y,
        dx: Math.max(-28, Math.min(28, dx * 0.08)),
        dy: Math.max(-28, Math.min(28, dy * 0.08)),
        color: nextColor(),
      };
    },
    queueScroll(deltaY) {
      pendingScroll = Math.max(-240, Math.min(240, pendingScroll + deltaY));
    },
    requestResize() {
      resizePending = true;
    },
    resume() {
      if (disposed || !paused) return;
      previousFrameTime = performance.now();
      paused = false;
      requestFrame();
    },
    setRoute(nextRoute) {
      if (route === nextRoute) return;
      route = nextRoute;
      paletteIndex = 0;
      if (dye && velocity) seedRoute();
    },
  };
}

function compileShader(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: GL,
  vertexShader: WebGLShader,
  fragmentSource: string,
): ProgramInfo | null {
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!fragmentShader || !program) {
    if (fragmentShader) gl.deleteShader(fragmentShader);
    if (program) gl.deleteProgram(program);
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let index = 0; index < count; index += 1) {
    const activeUniform = gl.getActiveUniform(program, index);
    if (activeUniform) {
      uniforms[activeUniform.name] = gl.getUniformLocation(program, activeUniform.name);
    }
  }
  return { program, uniforms };
}

function resolveTextureFormat(gl: GL, webgl2: boolean): TextureFormat | null {
  if (webgl2) {
    const gl2 = gl as WebGL2RenderingContext;
    if (!gl2.getExtension("EXT_color_buffer_float")) return null;
    const linear = gl2.getExtension("OES_texture_float_linear");
    return {
      internalFormat: gl2.RGBA16F,
      format: gl2.RGBA,
      type: gl2.HALF_FLOAT,
      filtering: linear ? gl2.LINEAR : gl2.NEAREST,
    };
  }
  const halfFloat = gl.getExtension("OES_texture_half_float") as
    | { HALF_FLOAT_OES: number }
    | null;
  if (!halfFloat) return null;
  return {
    internalFormat: gl.RGBA,
    format: gl.RGBA,
    type: halfFloat.HALF_FLOAT_OES,
    filtering: gl.getExtension("OES_texture_half_float_linear")
      ? gl.LINEAR
      : gl.NEAREST,
  };
}
