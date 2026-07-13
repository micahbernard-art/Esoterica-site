"use client";

import {
  assessPerformanceCapabilities,
  type PerformanceRecommendationReason,
} from "@/lib/galaxy/quality";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PerformancePreference = "auto" | "full" | "lite";
export type PerformanceMode = Exclude<PerformancePreference, "auto">;

type PerformanceModeContextValue = {
  mode: PerformanceMode;
  preference: PerformancePreference;
  ready: boolean;
  recommendationReason: PerformanceRecommendationReason;
  setPreference: (preference: PerformancePreference) => void;
};

type PerformancePressureDetail = {
  reason?: "webgl-context-loss" | string;
};

export const PERFORMANCE_PREFERENCE_KEY = "esoterica:performance-mode:v1";
export const PERFORMANCE_PRESSURE_EVENT = "esoterica:performance-pressure";

const STABILIZATION_DELAY_MS = 1_800;
const SAMPLE_WINDOW_MS = 1_900;
const SAMPLE_WINDOW_GAP_MS = 700;
const IGNORED_FRAME_GAP_MS = 250;
const SLOW_FRAME_MS = 28;
const MINIMUM_SUSTAINED_FPS = 38;
const MINIMUM_SLOW_FRAME_RATIO = 0.35;
const REQUIRED_SLOW_WINDOWS = 2;

const PerformanceModeContext = createContext<PerformanceModeContextValue | null>(null);

function isPerformancePreference(value: string | null): value is PerformancePreference {
  return value === "auto" || value === "full" || value === "lite";
}

function recommendationCopy(reason: Exclude<PerformanceRecommendationReason, null>) {
  switch (reason) {
    case "webgl-unavailable":
      return "Este navegador no puede sostener la capa gráfica completa con fiabilidad.";
    case "gpu-limits":
      return "La capacidad gráfica disponible es más cómoda con una escena simplificada.";
    case "low-hardware":
      return "Detectamos recursos limitados para mantener toda la experiencia en movimiento.";
    case "device-pressure":
      return "Varias señales del dispositivo indican que una versión más ligera navegará mejor.";
    case "sustained-frame-pressure":
      return "La animación perdió fluidez de forma sostenida durante la navegación.";
    case "webgl-context-loss":
      return "La capa gráfica se reinició. La versión ligera puede darte una experiencia más estable.";
  }
}

function PerformanceGuardianControls({
  mode,
  preference,
  ready,
  recommendationReason,
  setPreference,
}: PerformanceModeContextValue) {
  if (!ready) return null;

  if (preference === "auto" && recommendationReason) {
    return (
      <div className="performance-guardian-layer">
        <section
          className="performance-guardian-offer"
          role="region"
          aria-labelledby="performance-guardian-title"
          aria-live="polite"
          data-performance-offer={recommendationReason}
        >
          <span className="performance-guardian-orbit" aria-hidden="true" />
          <p className="performance-guardian-kicker">Navegación adaptativa</p>
          <h2 id="performance-guardian-title">Podemos aligerar el viaje</h2>
          <p className="performance-guardian-copy">
            {recommendationCopy(recommendationReason)} Mantendremos todo el contenido, las
            rutas y las acciones, reduciendo solo los efectos más exigentes.
          </p>
          <div className="performance-guardian-actions">
            <button
              className="performance-guardian-button performance-guardian-button--primary"
              type="button"
              onClick={() => setPreference("lite")}
            >
              Activar modo ligero
            </button>
            <button
              className="performance-guardian-button performance-guardian-button--secondary"
              type="button"
              onClick={() => setPreference("full")}
            >
              Mantener experiencia visual
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (preference === "auto") return null;

  const switchTo: PerformanceMode = mode === "lite" ? "full" : "lite";
  const switchLabel = mode === "lite" ? "Restaurar efectos" : "Usar modo ligero";

  return (
    <div className="performance-guardian-switch-layer">
      <div
        className="performance-guardian-switch"
        role="group"
        aria-label="Preferencia de rendimiento"
      >
        <button
          className="performance-guardian-switch-button"
          type="button"
          onClick={() => setPreference(switchTo)}
          aria-label={switchLabel}
        >
          <span className="performance-guardian-switch-star" aria-hidden="true" />
          <span>{switchLabel}</span>
        </button>
        <button
          className="performance-guardian-auto-button"
          type="button"
          onClick={() => setPreference("auto")}
        >
          Automático
        </button>
      </div>
    </div>
  );
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<PerformancePreference>("auto");
  const [ready, setReady] = useState(false);
  const [recommendationReason, setRecommendationReason] =
    useState<PerformanceRecommendationReason>(null);
  const mode: PerformanceMode = preference === "lite" ? "lite" : "full";

  useEffect(() => {
    let disposed = false;
    let storedPreference: string | null = null;
    try {
      storedPreference = window.localStorage.getItem(PERFORMANCE_PREFERENCE_KEY);
    } catch {
      // Storage can be unavailable in privacy-focused browsing contexts.
    }

    const hydratePreference = () => {
      if (disposed) return;
      if (isPerformancePreference(storedPreference)) {
        setPreferenceState(storedPreference);
      }
      setReady(true);
    };
    queueMicrotask(hydratePreference);

    return () => {
      disposed = true;
    };
  }, []);

  const setPreference = useCallback((nextPreference: PerformancePreference) => {
    try {
      window.localStorage.setItem(PERFORMANCE_PREFERENCE_KEY, nextPreference);
    } catch {
      // The in-memory choice still works for the current visit.
    }

    setRecommendationReason(null);
    setPreferenceState(nextPreference);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.performanceMode = mode;
    root.dataset.performancePreference = preference;
    root.dataset.performanceReady = ready ? "true" : "false";

    if (recommendationReason) {
      root.dataset.performanceRecommendation = recommendationReason;
    } else {
      delete root.dataset.performanceRecommendation;
    }

    return () => {
      delete root.dataset.performanceMode;
      delete root.dataset.performancePreference;
      delete root.dataset.performanceReady;
      delete root.dataset.performanceRecommendation;
    };
  }, [mode, preference, ready, recommendationReason]);

  useEffect(() => {
    if (!ready || preference !== "auto") return;

    let animationFrameId = 0;
    let sampleTimerId = 0;
    let disposed = false;
    let samplingComplete = false;
    let slowWindowCount = 0;

    const cancelSampling = () => {
      window.clearTimeout(sampleTimerId);
      cancelAnimationFrame(animationFrameId);
      sampleTimerId = 0;
      animationFrameId = 0;
    };

    const recommendForPressure = () => {
      samplingComplete = true;
      cancelSampling();
      setRecommendationReason("webgl-context-loss");
    };

    const onPerformancePressure = (event: Event) => {
      const detail = (event as CustomEvent<PerformancePressureDetail>).detail;
      if (!detail || typeof detail.reason === "string") recommendForPressure();
    };

    const scheduleSampleWindow = (delay: number) => {
      if (disposed || document.hidden) return;
      window.clearTimeout(sampleTimerId);
      sampleTimerId = window.setTimeout(startSampleWindow, delay);
    };

    function startSampleWindow() {
      if (disposed || document.hidden) return;

      let previousTimestamp: number | null = null;
      let sampledDuration = 0;
      let sampledFrames = 0;
      let slowFrames = 0;

      const sampleFrame = (timestamp: number) => {
        if (disposed || document.hidden) return;

        if (previousTimestamp !== null) {
          const frameGap = timestamp - previousTimestamp;
          if (frameGap > 0 && frameGap <= IGNORED_FRAME_GAP_MS) {
            sampledDuration += frameGap;
            sampledFrames += 1;
            if (frameGap >= SLOW_FRAME_MS) slowFrames += 1;
          }
        }
        previousTimestamp = timestamp;

        if (sampledDuration >= SAMPLE_WINDOW_MS && sampledFrames > 0) {
          const sustainedFps = (sampledFrames * 1_000) / sampledDuration;
          const slowFrameRatio = slowFrames / sampledFrames;
          const slowWindow =
            sustainedFps < MINIMUM_SUSTAINED_FPS &&
            slowFrameRatio >= MINIMUM_SLOW_FRAME_RATIO;

          if (!slowWindow) {
            samplingComplete = true;
            return;
          }

          slowWindowCount += 1;
          if (slowWindowCount >= REQUIRED_SLOW_WINDOWS) {
            samplingComplete = true;
            setRecommendationReason("sustained-frame-pressure");
            return;
          }

          scheduleSampleWindow(SAMPLE_WINDOW_GAP_MS);
          return;
        }

        animationFrameId = requestAnimationFrame(sampleFrame);
      };

      animationFrameId = requestAnimationFrame(sampleFrame);
    }

    const onVisibilityChange = () => {
      cancelSampling();
      if (!document.hidden && !samplingComplete) {
        slowWindowCount = 0;
        scheduleSampleWindow(STABILIZATION_DELAY_MS);
      }
    };

    window.addEventListener(PERFORMANCE_PRESSURE_EVENT, onPerformancePressure);
    document.addEventListener("visibilitychange", onVisibilityChange);

    let staticRecommendation: PerformanceRecommendationReason = null;
    try {
      staticRecommendation = assessPerformanceCapabilities().recommendationReason;
    } catch {
      staticRecommendation = "webgl-unavailable";
    }

    if (staticRecommendation) {
      sampleTimerId = window.setTimeout(() => {
        if (!disposed) setRecommendationReason(staticRecommendation);
      }, 0);
    } else {
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const forcedColors = matchMedia("(forced-colors: active)").matches;
      if (!reducedMotion && !forcedColors) {
        scheduleSampleWindow(STABILIZATION_DELAY_MS);
      }
    }

    return () => {
      disposed = true;
      cancelSampling();
      window.removeEventListener(PERFORMANCE_PRESSURE_EVENT, onPerformancePressure);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [preference, ready]);

  const contextValue = useMemo<PerformanceModeContextValue>(
    () => ({
      mode,
      preference,
      ready,
      recommendationReason,
      setPreference,
    }),
    [mode, preference, ready, recommendationReason, setPreference],
  );

  return (
    <PerformanceModeContext.Provider value={contextValue}>
      {children}
      <PerformanceGuardianControls {...contextValue} />
    </PerformanceModeContext.Provider>
  );
}

export function usePerformanceMode() {
  const context = useContext(PerformanceModeContext);
  if (!context) {
    throw new Error("usePerformanceMode must be used within PerformanceProvider");
  }
  return context;
}
