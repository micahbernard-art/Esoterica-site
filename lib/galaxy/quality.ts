export type GalaxyRoute = "/" | "/tarot" | "/libros" | "/lecturas";

export type GalaxyQuality = {
  constrained: boolean;
  dpr: number;
  fps: number;
  staticReason: "forced-colors" | "low-hardware" | "reduced-motion" | "save-data" | "webgl" | null;
  starCount: number;
};

type NavigatorSignals = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

let cachedWebGLSupport: boolean | null = null;

function supportsWebGL() {
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  const probe = document.createElement("canvas");
  const gl =
    probe.getContext("webgl2", { powerPreference: "low-power" }) ??
    probe.getContext("webgl", { powerPreference: "low-power" });

  if (!gl) {
    cachedWebGLSupport = false;
    return false;
  }
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  probe.width = 1;
  probe.height = 1;
  cachedWebGLSupport = true;
  return true;
}

export function readGalaxyQuality(): GalaxyQuality {
  const signals = navigator as NavigatorSignals;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forcedColors = matchMedia("(forced-colors: active)").matches;
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = signals.deviceMemory;
  const lowHardware = cores <= 2 || (memory !== undefined && memory <= 2);
  const constrained =
    lowHardware ||
    cores <= 4 ||
    (memory !== undefined && memory <= 4) ||
    coarsePointer ||
    innerWidth < 800;

  let staticReason: GalaxyQuality["staticReason"] = null;
  if (forcedColors) staticReason = "forced-colors";
  else if (reducedMotion) staticReason = "reduced-motion";
  else if (signals.connection?.saveData) staticReason = "save-data";
  else if (lowHardware) staticReason = "low-hardware";
  else if (!supportsWebGL()) staticReason = "webgl";

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
