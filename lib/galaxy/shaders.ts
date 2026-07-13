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
  uniform float uJourney;
  uniform vec2 uJourneyOrigin;
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
    vec2 portalOrigin = vec2(
      (uJourneyOrigin.x - 0.5) * 1.45,
      0.5 - uJourneyOrigin.y
    );
    vec2 portalDelta = uv - portalOrigin;
    float portalDistance = length(portalDelta);
    float aperture = mix(0.025, 1.28, smoothstep(0.0, 1.0, uJourney));
    float portalRing = exp(-abs(portalDistance - aperture) * 28.0)
      * (sin(uTime * 2.6 + portalDistance * 19.0) * 0.5 + 0.5);
    float portalCore = 1.0 - smoothstep(aperture * 0.1, aperture, portalDistance);
    vec2 portalDirection = portalDelta / max(portalDistance, 0.001);
    float lensStrength = uJourney * (1.0 - uJourney * 0.42);
    uv -= portalDirection
      * (portalRing * 0.038 + portalCore * 0.022)
      * lensStrength;
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
    color = mix(color, uColorC, portalRing * uJourney * 0.32);
    color += mix(uColorB, uColorC, 0.62) * portalCore * uJourney * 0.08;
    float vignette = smoothstep(0.82, 0.16, length(uv));
    float energy = min(abs(uVelocity) * 0.025, 0.16);
    float portalLight = (portalRing * 0.12 + portalCore * 0.035) * uJourney;
    float alpha = (0.035 + cloud * 0.15 + ribbon * 0.08 + energy + abs(pointerWake) * 0.08 + portalLight) * vignette;

    gl_FragColor = vec4(color, alpha);
  }
`;

export const PASSAGE_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uOrigin;
  varying float vAngle;
  varying float vBrightness;

  void main() {
    float travel = fract(position.z + uTime * (0.42 + position.z * 0.12));
    float approach = smoothstep(0.02, 1.0, travel);
    vec2 ray = normalize(position.xy + vec2(0.0001));
    float spread = mix(0.08, 4.8, approach * approach);
    vec2 originOffset = vec2(
      (uOrigin.x - 0.5) * 3.2,
      (0.5 - uOrigin.y) * 2.2
    );
    vec3 transformed = vec3(
      originOffset + ray * spread * (0.65 + length(position.xy) * 0.5),
      mix(-8.0, 1.8, approach)
    );
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = mix(3.0, 24.0, approach) * uStrength;
    vAngle = atan(ray.y, ray.x);
    vBrightness = (0.25 + approach * 0.75) * uStrength;
  }
`;

export const PASSAGE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  varying float vAngle;
  varying float vBrightness;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float cosine = cos(vAngle);
    float sine = sin(vAngle);
    vec2 aligned = mat2(cosine, -sine, sine, cosine) * point;
    float spine = exp(-abs(aligned.y) * 35.0);
    float taper = smoothstep(0.5, 0.02, abs(aligned.x));
    float glow = exp(-length(point) * 7.0) * 0.22;
    float alpha = (spine * taper + glow) * vBrightness;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
