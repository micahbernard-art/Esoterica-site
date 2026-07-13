// Original shader treatment for Esoterica. The scene architecture is inspired by
// pmndrs/react-three-next's separation of route UI and persistent R3F world; no
// source code, shaders, assets, or examples from that project are reproduced.

export const NEBULA_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const NEBULA_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform float uVelocity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec2 uPointer;
  uniform float uPointerEnergy;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.52;
    mat2 turn = mat2(0.82, -0.57, 0.57, 0.82);
    for (int i = 0; i < 4; i++) {
      sum += amplitude * noise(p);
      p = turn * p * 2.03 + 11.7;
      amplitude *= 0.48;
    }
    return sum;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= 1.45;
    float travel = uScroll * 1.8;
    float drift = uTime * 0.018 + travel;
    float warp = fbm(uv * 2.2 + vec2(drift, -drift * 0.42));
    vec2 pointerUv = vec2(uPointer.x * 0.5, -uPointer.y * 0.5);
    float pointerDistance = length(uv - pointerUv);
    float pointerWake = exp(-pointerDistance * 7.5)
      * sin(pointerDistance * 30.0 - uTime * 4.2)
      * uPointerEnergy;
    warp += pointerWake * 0.22;
    float cloud = fbm(uv * 3.25 + vec2(warp * 1.8, drift * 0.28));
    float ribbon = sin((uv.x + uv.y * 0.36 + warp * 0.42) * 7.4 - drift * 2.0);
    ribbon = smoothstep(0.16, 0.96, ribbon * 0.5 + 0.5);

    vec3 color = mix(uColorA, uColorB, smoothstep(0.16, 0.86, cloud));
    color = mix(color, uColorC, ribbon * (0.2 + cloud * 0.42));
    float vignette = smoothstep(0.82, 0.16, length(uv));
    float energy = min(abs(uVelocity) * 0.025, 0.16);
    float alpha = (0.035 + cloud * 0.15 + ribbon * 0.08 + energy + abs(pointerWake) * 0.08) * vignette;

    gl_FragColor = vec4(color, alpha);
  }
`;
