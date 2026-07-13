"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePerformanceMode } from "@/components/providers/performance-provider";
import {
  RoutePortalOverlay,
  type JourneyDetail,
  type JourneyPhase,
} from "@/components/site/route-portal-overlay";

const COVER_DELAY_MS = 640;
const OPEN_DELAY_MS = 680;
const HARD_UNLOCK_MS = 1_800;

type ActiveJourney = Omit<JourneyDetail, "phase"> & {
  destinationPath: string;
  committed: boolean;
};

function routeValue(url: URL) {
  return `${url.pathname}${url.search}`;
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function CinematicJourney() {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, ready } = usePerformanceMode();
  const [phase, setPhase] = useState<JourneyPhase>("idle");
  const phaseRef = useRef<JourneyPhase>("idle");
  const previousPathRef = useRef(pathname);
  const activeRef = useRef<ActiveJourney | null>(null);
  const coverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hardUnlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = (timer: typeof coverTimerRef) => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const clearAllTimers = useCallback(() => {
    clearTimer(coverTimerRef);
    clearTimer(openTimerRef);
    clearTimer(hardUnlockTimerRef);
  }, []);

  const publishPhase = useCallback((nextPhase: JourneyPhase) => {
    const active = activeRef.current;
    const root = document.documentElement;
    const fallbackPath = `${window.location.pathname}${window.location.search}`;
    const detail: JourneyDetail = {
      phase: nextPhase,
      from: active?.from ?? fallbackPath,
      to: active?.to ?? fallbackPath,
      originX: active?.originX ?? window.innerWidth / 2,
      originY: active?.originY ?? window.innerHeight / 2,
    };

    phaseRef.current = nextPhase;
    setPhase(nextPhase);
    root.dataset.journeyPhase = nextPhase;
    root.style.setProperty("--journey-origin-x", `${detail.originX}px`);
    root.style.setProperty("--journey-origin-y", `${detail.originY}px`);
    window.dispatchEvent(
      new CustomEvent<JourneyDetail>("esoterica:journey", { detail }),
    );
  }, []);

  const finishJourney = useCallback(() => {
    clearAllTimers();
    publishPhase("idle");
    activeRef.current = null;
  }, [clearAllTimers, publishPhase]);

  const openPortal = useCallback(
    (delay = OPEN_DELAY_MS) => {
      clearTimer(coverTimerRef);
      clearTimer(openTimerRef);
      publishPhase("opening");
      openTimerRef.current = setTimeout(finishJourney, delay);
    },
    [finishJourney, publishPhase],
  );

  useEffect(() => {
    document.documentElement.dataset.journeyPhase = "idle";

    return () => {
      clearAllTimers();
      delete document.documentElement.dataset.journeyPhase;
      document.documentElement.style.removeProperty("--journey-origin-x");
      document.documentElement.style.removeProperty("--journey-origin-y");
    };
  }, [clearAllTimers]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    if (!ready || mode === "lite") {
      previousPathRef.current = pathname;
      return;
    }
    if (pathname === previousPath) return;

    previousPathRef.current = pathname;
    const active = activeRef.current;
    if (active?.committed && pathname === active.destinationPath) {
      openPortal();
      return;
    }

    if (
      phaseRef.current !== "idle" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(forced-colors: active)").matches
    ) {
      return;
    }

    activeRef.current = {
      from: previousPath,
      to: pathname,
      destinationPath: pathname,
      originX: window.innerWidth / 2,
      originY: window.innerHeight / 2,
      committed: true,
    };
    openPortal();
  }, [mode, openPortal, pathname, ready]);

  useEffect(() => {
    if (!ready || mode !== "lite") return;

    previousPathRef.current = pathname;
    if (phaseRef.current !== "idle" || activeRef.current) finishJourney();
  }, [finishJourney, mode, pathname, ready]);

  useEffect(() => {
    if (!ready || mode === "lite") return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const device = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };

    const beginJourney = (event: MouseEvent, anchor: HTMLAnchorElement, url: URL) => {
      event.preventDefault();

      if (phaseRef.current !== "idle") return;

      const lowHardware =
        (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) ||
        (device.deviceMemory !== undefined && device.deviceMemory <= 2);

      if (
        reducedMotion.matches ||
        forcedColors.matches ||
        device.connection?.saveData === true ||
        lowHardware
      ) {
        router.push(routeValue(url));
        return;
      }

      const coarseOrigin = !finePointer.matches || event.detail === 0;
      const originX = coarseOrigin ? window.innerWidth / 2 : event.clientX;
      const originY = coarseOrigin ? window.innerHeight / 2 : event.clientY;
      const current = `${window.location.pathname}${window.location.search}`;

      activeRef.current = {
        from: current,
        to: routeValue(url),
        destinationPath: url.pathname,
        originX,
        originY,
        committed: false,
      };

      anchor.blur();
      publishPhase("closing");

      coverTimerRef.current = setTimeout(() => {
        const active = activeRef.current;
        if (!active || phaseRef.current !== "closing") return;

        active.committed = true;
        publishPhase("covered");
        router.push(active.to);
      }, COVER_DELAY_MS);

      hardUnlockTimerRef.current = setTimeout(() => {
        if (phaseRef.current !== "idle") finishJourney();
      }, HARD_UNLOCK_MS);
    };

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        isModifiedClick(event)
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download")) return;

      const targetName = anchor.getAttribute("target")?.trim().toLowerCase();
      const relTokens = anchor.rel.toLowerCase().split(/\s+/);
      if (
        (targetName && targetName !== "_self") ||
        relTokens.includes("external")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (
        url.origin !== window.location.origin ||
        (url.protocol !== "http:" && url.protocol !== "https:") ||
        url.hash ||
        url.pathname === window.location.pathname
      ) {
        return;
      }

      beginJourney(event, anchor, url);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const active = activeRef.current;
      if (
        event.key !== "Escape" ||
        phaseRef.current !== "closing" ||
        !active ||
        active.committed
      ) {
        return;
      }

      event.preventDefault();
      clearTimer(coverTimerRef);
      clearTimer(hardUnlockTimerRef);
      openPortal();
    };

    const onPopState = () => {
      if (phaseRef.current === "closing") finishJourney();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [finishJourney, mode, openPortal, publishPhase, ready, router]);

  return ready && mode === "full" ? <RoutePortalOverlay phase={phase} /> : null;
}
