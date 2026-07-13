"use client";

import { useEffect, useRef } from "react";
import {
  createAstralFluidEngine,
  type AstralFluidEngine,
} from "@/lib/fluid/engine";
import type { FluidRoute } from "@/lib/fluid/palettes";

type NetworkInformation = {
  saveData?: boolean;
};

type NavigatorWithSignals = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

export function AstralFluidCanvas({ activePath }: { activePath: FluidRoute }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AstralFluidEngine | null>(null);
  const activePathRef = useRef(activePath);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColorsQuery = window.matchMedia("(forced-colors: active)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const signals = navigator as NavigatorWithSignals;
    const lowHardware =
      (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) ||
      (signals.deviceMemory !== undefined && signals.deviceMemory <= 2);
    const constrained =
      lowHardware ||
      navigator.hardwareConcurrency <= 4 ||
      (signals.deviceMemory !== undefined && signals.deviceMemory <= 4) ||
      coarseQuery.matches ||
      window.innerWidth < 720;
    const permanentlyStatic = Boolean(signals.connection?.saveData || lowHardware);
    let restoredContexts = 0;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;
    let lastScrollY = window.scrollY;

    const setStatic = () => {
      engineRef.current?.dispose();
      engineRef.current = null;
      canvas.dataset.fluidState = "static";
    };

    const boot = () => {
      if (permanentlyStatic || motionQuery.matches || forcedColorsQuery.matches) {
        setStatic();
        return;
      }
      if (engineRef.current) return;
      const engine = createAstralFluidEngine(canvas, {
        constrained,
        initialRoute: activePathRef.current,
      });
      if (!engine) {
        setStatic();
        return;
      }
      engineRef.current = engine;
      canvas.dataset.fluidState = "running";
      if (document.hidden) engine.pause();
    };

    const handleVisibility = () => {
      if (
        document.hidden ||
        motionQuery.matches ||
        forcedColorsQuery.matches ||
        permanentlyStatic
      ) {
        engineRef.current?.pause();
      } else {
        engineRef.current?.resume();
      }
    };

    const handleVisualPreference = () => {
      if (motionQuery.matches || forcedColorsQuery.matches) {
        setStatic();
      } else if (!permanentlyStatic) {
        if (!engineRef.current) boot();
        engineRef.current?.resume();
        canvas.dataset.fluidState = "running";
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const x = event.clientX / Math.max(window.innerWidth, 1);
      const y = event.clientY / Math.max(window.innerHeight, 1);
      const dx = lastPointerX === null ? 0 : event.clientX - lastPointerX;
      const dy = lastPointerY === null ? 0 : event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 1) {
        engineRef.current?.queuePointer(x, y, dx, dy);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const dx = lastPointerX === null ? 0 : touch.clientX - lastPointerX;
      const dy = lastPointerY === null ? 0 : touch.clientY - lastPointerY;
      lastPointerX = touch.clientX;
      lastPointerY = touch.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 1) {
        engineRef.current?.queuePointer(
          touch.clientX / Math.max(window.innerWidth, 1),
          touch.clientY / Math.max(window.innerHeight, 1),
          dx,
          dy,
        );
      }
    };

    const resetPointer = () => {
      lastPointerX = null;
      lastPointerY = null;
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      engineRef.current?.queueScroll(nextScrollY - lastScrollY);
      lastScrollY = nextScrollY;
    };

    const handleResize = () => engineRef.current?.requestResize();

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      engineRef.current?.pause();
      canvas.dataset.fluidState = "static";
    };

    const handleContextRestored = () => {
      if (
        restoredContexts >= 1 ||
        permanentlyStatic ||
        motionQuery.matches ||
        forcedColorsQuery.matches
      ) {
        return;
      }
      restoredContexts += 1;
      engineRef.current?.dispose();
      engineRef.current = null;
      boot();
    };

    boot();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", resetPointer, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetPointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    motionQuery.addEventListener("change", handleVisualPreference);
    forcedColorsQuery.addEventListener("change", handleVisualPreference);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetPointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      motionQuery.removeEventListener("change", handleVisualPreference);
      forcedColorsQuery.removeEventListener("change", handleVisualPreference);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    activePathRef.current = activePath;
    engineRef.current?.setRoute(activePath);
  }, [activePath]);

  return (
    <canvas
      ref={canvasRef}
      className="astral-fluid-canvas"
      aria-hidden="true"
      data-fluid-state="loading"
      data-fluid-route={activePath}
    />
  );
}
