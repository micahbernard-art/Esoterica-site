export type GalaxyRoute = "/" | "/tarot" | "/libros" | "/lecturas";

export type GalaxyStaticReason =
  | "forced-colors"
  | "low-hardware"
  | "reduced-motion"
  | "save-data"
  | "user-lite"
  | "webgl"
  | null;

export type GalaxyQuality = {
  constrained: boolean;
  dpr: number;
  fps: number;
  staticReason: GalaxyStaticReason;
  starCount: number;
};

export type PerformanceRecommendationReason =
  | "device-pressure"
  | "gpu-limits"
  | "low-hardware"
  | "sustained-frame-pressure"
  | "webgl-context-loss"
  | "webgl-unavailable"
  | null;

export type WebGLCapabilities = {
  maxRenderbufferSize: number;
  maxTextureSize: number;
  supported: boolean;
  webgl2: boolean;
};

export type PerformanceCapabilityAssessment = {
  capabilities: WebGLCapabilities;
  cores: number;
  memory: number | null;
  moderateSignalCount: number;
  recommendationReason: PerformanceRecommendationReason;
};

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let cachedWebGLCapabilities: WebGLCapabilities | null = null;

/**
 * Deliberately reads only coarse numeric limits. Device-identifying strings
 * would add fingerprinting surface without making this fallback meaningfully
 * safer.
 */
export function readWebGLCapabilities(): WebGLCapabilities {
  if (cachedWebGLCapabilities) return cachedWebGLCapabilities;

  const probe = document.createElement("canvas");
  const contextAttributes: WebGLContextAttributes = {
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: "low-power",
    stencil: false,
  };
  const webgl2 = probe.getContext("webgl2", contextAttributes);
  const gl = webgl2 ?? probe.getContext("webgl", contextAttributes);

  if (!gl) {
    cachedWebGLCapabilities = {
      maxRenderbufferSize: 0,
      maxTextureSize: 0,
      supported: false,
      webgl2: false,
    };
    return cachedWebGLCapabilities;
  }

  cachedWebGLCapabilities = {
    maxRenderbufferSize: Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)) || 0,
    maxTextureSize: Number(gl.getParameter(gl.MAX_TEXTURE_SIZE)) || 0,
    supported: true,
    webgl2: Boolean(webgl2),
  };

  gl.getExtension("WEBGL_lose_context")?.loseContext();
  probe.width = 1;
  probe.height = 1;
  return cachedWebGLCapabilities;
}

/**
 * Produces a recommendation, never a mode change. One hard limit is enough;
 * softer signals must corroborate each other to avoid penalizing touch/mobile
 * devices merely for their form factor.
 */
export function assessPerformanceCapabilities(): PerformanceCapabilityAssessment {
  const signals = navigator as NavigatorSignals;
  const capabilities = readWebGLCapabilities();
  const cores = navigator.hardwareConcurrency || 4;
  const memory = signals.deviceMemory ?? null;
  const lowHardware = cores <= 2 || (memory !== null && memory <= 2);
  const gpuLimits =
    capabilities.supported &&
    (capabilities.maxTextureSize < 4096 || capabilities.maxRenderbufferSize < 4096);

  const moderateSignalCount = [
    capabilities.supported && !capabilities.webgl2,
    cores <= 4,
    memory !== null && memory <= 4,
  ].filter(Boolean).length;

  let recommendationReason: PerformanceRecommendationReason = null;
  if (!capabilities.supported) recommendationReason = "webgl-unavailable";
  else if (gpuLimits) recommendationReason = "gpu-limits";
  else if (lowHardware) recommendationReason = "low-hardware";
  else if (!capabilities.webgl2 && moderateSignalCount >= 2) {
    recommendationReason = "device-pressure";
  }

  return {
    capabilities,
    cores,
    memory,
    moderateSignalCount,
    recommendationReason,
  };
}

export function readGalaxyQuality(
  options: { forceStatic?: boolean } = {},
): GalaxyQuality {
  const signals = navigator as NavigatorSignals;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forcedColors = matchMedia("(forced-colors: active)").matches;
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = signals.deviceMemory;
  const lowHardware = cores <= 2 || (memory !== undefined && memory <= 2);
  const capabilities = readWebGLCapabilities();
  const constrained =
    lowHardware ||
    cores <= 4 ||
    (memory !== undefined && memory <= 4) ||
    coarsePointer ||
    innerWidth < 800;

  let staticReason: GalaxyQuality["staticReason"] = null;
  if (options.forceStatic) staticReason = "user-lite";
  else if (forcedColors) staticReason = "forced-colors";
  else if (reducedMotion) staticReason = "reduced-motion";
  else if (signals.connection?.saveData) staticReason = "save-data";
  else if (lowHardware) staticReason = "low-hardware";
  else if (!capabilities.supported) staticReason = "webgl";

  return {
    constrained,
    dpr: constrained ? 1 : Math.min(devicePixelRatio || 1, 1.35),
    fps: constrained ? 45 : 60,
    staticReason,
    starCount: constrained ? 520 : 1050,
  };
}

export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
