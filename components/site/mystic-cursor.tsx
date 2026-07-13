"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "@/app/mystic-cursor.css";

export type MysticCursorPath = "/" | "/tarot" | "/libros" | "/lecturas";

type CursorMode = "default" | "link" | "card" | "text" | "drag";
type JourneyPhase = "closing" | "covered" | "opening" | "idle";

const VALID_MODES = new Set<CursorMode>([
  "default",
  "link",
  "card",
  "text",
  "drag",
]);

const CARD_SELECTOR = [
  "[data-cursor-card]",
  ".catalog-card",
  ".category-card",
  ".reading-tier",
  ".process-card",
  ".book-cover",
  ".hero-feature",
].join(",");

const TEXT_SELECTOR = [
  "input:not([type='button']):not([type='submit']):not([type='reset'])",
  "textarea",
  "[contenteditable='true']",
  "p",
  "blockquote",
].join(",");

const LINK_SELECTOR = "a[href], button:not([disabled]), [role='button']";
const DRAG_SELECTOR = "[draggable='true'], [data-cursor-drag]";

const modeForTarget = (target: Element | null): CursorMode => {
  if (!target) return "default";

  const override = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
  if (override && VALID_MODES.has(override as CursorMode)) {
    return override as CursorMode;
  }

  if (target.closest(DRAG_SELECTOR)) return "drag";
  if (target.closest(CARD_SELECTOR)) return "card";
  if (target.closest(LINK_SELECTOR)) return "link";
  if (target.closest(TEXT_SELECTOR)) return "text";
  return "default";
};

const labelForTarget = (target: Element | null, mode: CursorMode) => {
  const override = target
    ?.closest<HTMLElement>("[data-cursor-label]")
    ?.dataset.cursorLabel?.trim();

  if (override) return override.slice(0, 18);
  if (mode === "card") return "Explorar";
  if (mode === "drag") return "Mover";
  return "";
};

function routeFromPathname(pathname: string | null): MysticCursorPath {
  if (pathname?.startsWith("/tarot")) return "/tarot";
  if (pathname?.startsWith("/libros")) return "/libros";
  if (pathname?.startsWith("/lecturas")) return "/lecturas";
  return "/";
}

export function MysticCursor({ activePath }: { activePath?: MysticCursorPath } = {}) {
  const pathname = usePathname();
  const resolvedPath = activePath ?? routeFromPathname(pathname);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const cursorLabel = cursor.querySelector<HTMLElement>(
      ".mystic-cursor__label",
    );

    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    const hoverPointer = window.matchMedia("(hover: hover)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const device = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };

    const lowHardware =
      (device.hardwareConcurrency ?? 8) <= 2 || (device.deviceMemory ?? 8) <= 2;
    const saveData = connection?.saveData === true;

    let enabled = false;
    let activated = false;
    let inViewport = false;
    let frameId: number | null = null;
    let pulseTimer: ReturnType<typeof setTimeout> | null = null;
    let hasPosition = false;
    let dirty = false;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let velocityX = 0;
    let velocityY = 0;
    let previousTime = performance.now();
    let currentMode: CursorMode = "default";
    let currentLabel = "";

    const onJourney = (event: Event) => {
      const journey = event as CustomEvent<{ phase?: JourneyPhase }>;
      const journeyPhase = journey.detail?.phase ?? "idle";
      cursor.dataset.journeyPhase = journeyPhase;
      cursor.classList.remove("is-pressed");

      if (journeyPhase === "closing" || journeyPhase === "opening") {
        cursor.classList.remove("is-pulsing");
        void cursor.offsetWidth;
        cursor.classList.add("is-pulsing");
      }
    };

    const canRun = () =>
      finePointer.matches &&
      hoverPointer.matches &&
      !reducedMotion.matches &&
      !forcedColors.matches &&
      !saveData &&
      !lowHardware;

    const removeNativeCursorOverride = () => {
      activated = false;
      root.classList.remove("mystic-cursor-enabled");
      cursor.classList.remove("is-visible", "is-pressed", "is-pulsing");
    };

    const cancelFrame = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const writeFrame = (time: number) => {
      frameId = null;
      if (!enabled || document.hidden) return;

      const timeScale = Math.min(Math.max((time - previousTime) / 16.67, 0.5), 2);
      previousTime = time;

      const deltaX = targetX - currentX;
      const deltaY = targetY - currentY;
      const spring = 0.16 * timeScale;
      const friction = Math.pow(0.7, timeScale);

      velocityX = (velocityX + deltaX * spring) * friction;
      velocityY = (velocityY + deltaY * spring) * friction;

      const velocity = Math.hypot(velocityX, velocityY);
      if (velocity > 70) {
        const limit = 70 / velocity;
        velocityX *= limit;
        velocityY *= limit;
      }

      currentX += velocityX * timeScale;
      currentY += velocityY * timeScale;

      const speed = Math.min(Math.hypot(velocityX, velocityY), 22);
      const stretch = 1 + speed / 100;
      const squash = 1 - Math.min(speed / 180, 0.1);
      const angle =
        speed > 0.12 ? (Math.atan2(velocityY, velocityX) * 180) / Math.PI : 0;

      cursor.style.setProperty("--cursor-x", `${currentX.toFixed(2)}px`);
      cursor.style.setProperty("--cursor-y", `${currentY.toFixed(2)}px`);
      cursor.style.setProperty("--cursor-angle", `${angle.toFixed(2)}deg`);
      cursor.style.setProperty("--cursor-stretch", stretch.toFixed(3));
      cursor.style.setProperty("--cursor-squash", squash.toFixed(3));
      cursor.style.setProperty(
        "--cursor-orbit-shift",
        `${Math.min(speed * 0.16, 3).toFixed(2)}px`,
      );

      const wasDirty = dirty;
      dirty = false;
      const settling =
        wasDirty ||
        Math.abs(deltaX) > 0.08 ||
        Math.abs(deltaY) > 0.08 ||
        Math.abs(velocityX) > 0.08 ||
        Math.abs(velocityY) > 0.08;

      if (settling) frameId = requestAnimationFrame(writeFrame);
    };

    const scheduleFrame = () => {
      if (frameId === null && enabled && !document.hidden) {
        previousTime = performance.now();
        frameId = requestAnimationFrame(writeFrame);
      }
    };

    const syncCapability = () => {
      enabled = canRun();
      cursor.dataset.cursorReady = enabled ? "true" : "false";

      if (!enabled) {
        cancelFrame();
        removeNativeCursorOverride();
        hasPosition = false;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;

      targetX = event.clientX;
      targetY = event.clientY;
      inViewport = true;
      dirty = true;

      if (!hasPosition) {
        currentX = targetX;
        currentY = targetY;
        velocityX = 0;
        velocityY = 0;
        hasPosition = true;
      }

      if (!activated) {
        activated = true;
        root.classList.add("mystic-cursor-enabled");
      }

      const eventTarget = event.target instanceof Element ? event.target : null;
      const mode = modeForTarget(eventTarget);
      const label = labelForTarget(eventTarget, mode);

      if (mode !== currentMode) {
        currentMode = mode;
        cursor.dataset.mode = mode;
      }
      if (label !== currentLabel) {
        currentLabel = label;
        if (cursorLabel) cursorLabel.textContent = label;
        cursor.classList.toggle("has-label", Boolean(label));
      }
      cursor.classList.toggle("is-visible", inViewport);
      scheduleFrame();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;
      cursor.classList.add("is-pressed");
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return;
      cursor.classList.remove("is-pressed");
      cursor.classList.remove("is-pulsing");
      // Restart the short compositor pulse even for rapid consecutive clicks.
      void cursor.offsetWidth;
      cursor.classList.add("is-pulsing");

      if (pulseTimer) clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => {
        cursor.classList.remove("is-pulsing");
        pulseTimer = null;
      }, 420);
    };

    const onPointerCancel = () => {
      cursor.classList.remove("is-pressed");
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      inViewport = false;
      cursor.classList.remove("is-visible", "is-pressed");
    };

    const onWindowBlur = () => {
      inViewport = false;
      cursor.classList.remove("is-visible", "is-pressed");
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelFrame();
        cursor.classList.remove("is-visible", "is-pressed");
        return;
      }

      if (enabled && inViewport && hasPosition) {
        cursor.classList.add("is-visible");
        dirty = true;
        scheduleFrame();
      }
    };

    const capabilityQueries = [
      finePointer,
      hoverPointer,
      reducedMotion,
      forcedColors,
    ];

    capabilityQueries.forEach((query) =>
      query.addEventListener("change", syncCapability),
    );
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointercancel", onPointerCancel, {
      passive: true,
    });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("esoterica:journey", onJourney);

    syncCapability();

    return () => {
      cancelFrame();
      if (pulseTimer) clearTimeout(pulseTimer);
      capabilityQueries.forEach((query) =>
        query.removeEventListener("change", syncCapability),
      );
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("esoterica:journey", onJourney);
      removeNativeCursorOverride();
      cursor.removeAttribute("style");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="mystic-cursor"
      data-mode="default"
      data-route={resolvedPath}
      data-cursor-ready="false"
      data-journey-phase="idle"
      aria-hidden="true"
    >
      <span className="mystic-cursor__field">
        <span className="mystic-cursor__orbit mystic-cursor__orbit--outer" />
        <span className="mystic-cursor__orbit mystic-cursor__orbit--inner" />
        <span className="mystic-cursor__core" />
        <span className="mystic-cursor__pulse" />
      </span>
      <span className="mystic-cursor__label" />
    </div>
  );
}
