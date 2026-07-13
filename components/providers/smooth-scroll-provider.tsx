"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type JourneyPhase = "closing" | "covered" | "opening" | "idle";

type NavigatorConnection = EventTarget & {
  saveData?: boolean;
};

const JOURNEY_RESUME_TIMEOUT_MS = 2_200;

const mediaQueries = [
  "(hover: hover) and (pointer: fine)",
  "(prefers-reduced-motion: reduce)",
  "(forced-colors: active)",
] as const;

function connection(): NavigatorConnection | undefined {
  return (
    navigator as Navigator & {
      connection?: NavigatorConnection;
    }
  ).connection;
}

function allowsSmoothWheel() {
  const [finePointer, reducedMotion, forcedColors] = mediaQueries.map((query) =>
    window.matchMedia(query),
  );

  return Boolean(
    finePointer?.matches &&
      !reducedMotion?.matches &&
      !forcedColors?.matches &&
      !connection()?.saveData,
  );
}

function journeyPhase(event: Event): JourneyPhase | null {
  const detail = (event as CustomEvent<{ phase?: unknown }>).detail;
  const phase = detail?.phase;

  return phase === "closing" ||
    phase === "covered" ||
    phase === "opening" ||
    phase === "idle"
    ? phase
    : null;
}

function JourneyScrollControl({ enabled }: { enabled: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!enabled || !lenis) return;

    let resumeTimer = 0;
    const resume = () => {
      window.clearTimeout(resumeTimer);
      lenis.start();
    };
    const onJourney = (event: Event) => {
      const phase = journeyPhase(event);

      if (phase === "closing" || phase === "covered") {
        lenis.stop();
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(resume, JOURNEY_RESUME_TIMEOUT_MS);
        return;
      }

      if (phase === "opening" || phase === "idle") resume();
    };

    window.addEventListener("esoterica:journey", onJourney);

    return () => {
      window.removeEventListener("esoterica:journey", onJourney);
      window.clearTimeout(resumeTimer);
      lenis.start();
    };
  }, [enabled, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const queries = mediaQueries.map((query) => window.matchMedia(query));
    const dataConnection = connection();
    const update = () => setEnabled(allowsSmoothWheel());

    update();
    queries.forEach((query) => query.addEventListener("change", update));
    dataConnection?.addEventListener("change", update);

    return () => {
      queries.forEach((query) => query.removeEventListener("change", update));
      dataConnection?.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.scrollEngine = enabled ? "lenis" : "native";

    return () => {
      delete root.dataset.scrollEngine;
    };
  }, [enabled]);

  const options = useMemo(
    () => ({
      autoRaf: enabled,
      lerp: 0.085,
      smoothWheel: enabled,
      syncTouch: false,
      wheelMultiplier: 0.88,
      overscroll: true,
      anchors: enabled,
      stopInertiaOnNavigate: enabled,
    }),
    [enabled],
  );

  return (
    <ReactLenis root options={options}>
      <JourneyScrollControl enabled={enabled} />
      {children}
    </ReactLenis>
  );
}
