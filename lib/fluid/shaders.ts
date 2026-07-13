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

export function fluidShaderSources(webgl2: boolean, manualFiltering: boolean) {
  const version = webgl2 ? "#version 300 es\n" : "";
  const attribute = webgl2 ? "in" : "attribute";
  const varyingOut = webgl2 ? "out" : "varying";
  const varyingIn = webgl2 ? "in" : "varying";
  const sample = webgl2 ? "texture" : "texture2D";
  const outputDeclaration = webgl2 ? "out vec4 fragColor;" : "";
  const output = webgl2 ? "fragColor" : "gl_FragColor";

  const vertex = `${version}precision highp float;
${attribute} vec2 aPosition;
${varyingOut} vec2 vUv;
${varyingOut} vec2 vL;
${varyingOut} vec2 vR;
${varyingOut} vec2 vT;
${varyingOut} vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

  const fragment = (body: string, precision = "highp") =>
    `${version}precision ${precision} float;
precision ${precision} sampler2D;
${varyingIn} vec2 vUv;
${varyingIn} vec2 vL;
${varyingIn} vec2 vR;
${varyingIn} vec2 vT;
${varyingIn} vec2 vB;
${outputDeclaration}
${body}`;

  return {
    vertex,
    clear: fragment(`uniform sampler2D uTexture;
uniform float value;
void main () { ${output} = value * ${sample}(uTexture, vUv); }`, "mediump"),
    display: fragment(`uniform sampler2D uTexture;
uniform float opacity;
void main () {
  vec3 color = ${sample}(uTexture, vUv).rgb;
  float alpha = clamp(max(color.r, max(color.g, color.b)) * opacity, 0.0, 0.56);
  ${output} = vec4(color * opacity, alpha);
}`),
    splat: fragment(`uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
void main () {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 bloom = exp(-dot(p, p) / radius) * color;
  ${output} = vec4(${sample}(uTarget, vUv).xyz + bloom, 1.0);
}`),
    advection: fragment(`${manualFiltering ? "#define MANUAL_FILTERING" : ""}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 size) {
  vec2 st = uv / size - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = ${sample}(sam, (iuv + vec2(0.5, 0.5)) * size);
  vec4 b = ${sample}(sam, (iuv + vec2(1.5, 0.5)) * size);
  vec4 c = ${sample}(sam, (iuv + vec2(0.5, 1.5)) * size);
  vec4 d = ${sample}(sam, (iuv + vec2(1.5, 1.5)) * size);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
#ifdef MANUAL_FILTERING
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
  vec2 coord = vUv - dt * ${sample}(uVelocity, vUv).xy * texelSize;
  vec4 result = ${sample}(uSource, coord);
#endif
  ${output} = result / (1.0 + dissipation * dt);
}`),
    divergence: fragment(`uniform sampler2D uVelocity;
void main () {
  float L = ${sample}(uVelocity, vL).x;
  float R = ${sample}(uVelocity, vR).x;
  float T = ${sample}(uVelocity, vT).y;
  float B = ${sample}(uVelocity, vB).y;
  vec2 C = ${sample}(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  ${output} = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`, "mediump"),
    curl: fragment(`uniform sampler2D uVelocity;
void main () {
  float L = ${sample}(uVelocity, vL).y;
  float R = ${sample}(uVelocity, vR).y;
  float T = ${sample}(uVelocity, vT).x;
  float B = ${sample}(uVelocity, vB).x;
  ${output} = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`, "mediump"),
    vorticity: fragment(`uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main () {
  float L = ${sample}(uCurl, vL).x;
  float R = ${sample}(uCurl, vR).x;
  float T = ${sample}(uCurl, vT).x;
  float B = ${sample}(uCurl, vB).x;
  float C = ${sample}(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = ${sample}(uVelocity, vUv).xy + force * dt;
  ${output} = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`),
    pressure: fragment(`uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main () {
  float L = ${sample}(uPressure, vL).x;
  float R = ${sample}(uPressure, vR).x;
  float T = ${sample}(uPressure, vT).x;
  float B = ${sample}(uPressure, vB).x;
  float divergence = ${sample}(uDivergence, vUv).x;
  ${output} = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`, "mediump"),
    gradientSubtract: fragment(`uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main () {
  float L = ${sample}(uPressure, vL).x;
  float R = ${sample}(uPressure, vR).x;
  float T = ${sample}(uPressure, vT).x;
  float B = ${sample}(uPressure, vB).x;
  vec2 velocity = ${sample}(uVelocity, vUv).xy - vec2(R - L, T - B);
  ${output} = vec4(velocity, 0.0, 1.0);
}`, "mediump"),
  };
}
