"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePerformanceMode } from "@/components/providers/performance-provider";
import "@/app/kinetic-ui.css";
import "@/app/galaxy-choreography.css";

const SCENE_SELECTOR = "main > section, .site-footer";
const CHAPTERS = ["threshold", "orbit", "eclipse", "archive", "finale"] as const;

const REVEAL_SELECTOR = "[data-reveal]";

const KINETIC_CARD_SELECTOR = [
  ".catalog-card",
  ".category-card",
  ".reading-tier",
].join(",");

const KINETIC_CONTROL_SELECTOR =
  "[data-ui-action]:not([aria-disabled='true']):not(:disabled)";
const KINETIC_GLYPH_SELECTOR = ".celestial-glyph";
const KINETIC_SELECTOR = [
  KINETIC_GLYPH_SELECTOR,
  KINETIC_CONTROL_SELECTOR,
  KINETIC_CARD_SELECTOR,
].join(",");

const KINETIC_PROPERTIES = [
  "--kinetic-x",
  "--kinetic-y",
  "--kinetic-rotate",
  "--kinetic-card-rx",
  "--kinetic-card-ry",
  "--kinetic-highlight-x",
  "--kinetic-highlight-y",
  "--kinetic-highlight-alpha",
] as const;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const CHAPTER_SCENES: Record<(typeof CHAPTERS)[number], string[]> = {
  threshold: ["entry", "hero"],
  orbit: ["catalog", "category", "constellation", "recommendation"],
  eclipse: ["reading", "eclipse", "question"],
  archive: ["book", "artifact", "path", "about", "wayfinding", "chambers"],
  finale: ["close", "portal", "footer"],
};

const getChapter = (scene: HTMLElement, index: number, total: number) => {
  if (index === 0) return CHAPTERS[0];
  if (index === total - 1) return CHAPTERS[4];

  const sceneName = scene.dataset.scrollScene?.toLowerCase() ?? "";
  return (
    CHAPTERS.find((chapter) =>
      CHAPTER_SCENES[chapter].some((word) => sceneName.includes(word)),
    ) ?? CHAPTERS[Math.min(index, CHAPTERS.length - 1)]
  );
};

const getRevealRole = (target: HTMLElement) => {
  if (
    target.matches("h1, h2, h3") ||
    target.querySelector(":scope > h1, :scope > h2, :scope > h3")
  ) {
    return "heading";
  }
  if (target.matches(KINETIC_GLYPH_SELECTOR)) return "glyph";
  if (target.matches(KINETIC_CARD_SELECTOR)) return "card";
  if (target.matches("p, li, dd, dt")) return "body";
  return "focal";
};

export function CosmicMotion() {
  const pathname = usePathname();
  const { mode, ready } = usePerformanceMode();

  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColorsPreference = window.matchMedia("(forced-colors: active)");
    const coarsePointerPreference = window.matchMedia("(pointer: coarse)");
    const hoverPreference = window.matchMedia("(hover: hover)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>(SCENE_SELECTOR),
    );
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const pendingRevealTargets = new Set<HTMLElement>();
    const visibleScenes = new Set<HTMLElement>();
    const kineticTargets = Array.from(
      document.querySelectorAll<HTMLElement>(KINETIC_SELECTOR),
    );
    const glyphTargets = kineticTargets.filter((target) =>
      target.matches(KINETIC_GLYPH_SELECTOR),
    );
    const cardTargets = kineticTargets.filter((target) =>
      target.matches(KINETIC_CARD_SELECTOR),
    );
    const controlTargets = kineticTargets.filter(
      (target) =>
        target.matches(KINETIC_CONTROL_SELECTOR) &&
        !target.matches(KINETIC_CARD_SELECTOR),
    );

    if (!ready || mode === "lite") {
      root.classList.add(
        "motion-ready",
        "motion-reduced",
        "kinetic-constrained",
      );
      root.classList.remove("motion-paused", "kinetic-enabled");
      root.style.setProperty("--scroll-p", "0");

      scenes.forEach((scene, index) => {
        scene.dataset.cosmicScene = "";
        scene.dataset.cosmicChapter = getChapter(scene, index, scenes.length);
        scene.classList.add("is-cosmic-visible", "is-cosmic-focus");
        scene.style.setProperty("--scene-p", "0.5");
        scene.style.setProperty("--scene-focus", "1");
        scene.style.setProperty("--scene-velocity", "0");
        scene.style.setProperty("--scene-direction", "1");
        scene.style.setProperty("--scene-shift", "0px");
        scene.style.setProperty("--scene-shift-soft", "0px");
        scene.style.setProperty("--scene-shift-reverse", "0px");
      });

      revealTargets.forEach((target) => {
        target.dataset.cosmicReveal = "";
        target.dataset.cosmicRole = getRevealRole(target);
        target.classList.add("is-revealed");
        target.style.setProperty("--reveal-delay", "0ms");
        target.style.setProperty("--reveal-order", "0");
      });

      glyphTargets.forEach((target) => target.classList.add("is-kinetic-glyph"));
      controlTargets.forEach((target) =>
        target.classList.add("is-kinetic-control"),
      );
      cardTargets.forEach((target) => target.classList.add("is-kinetic-card"));

      return () => {
        root.classList.remove(
          "motion-ready",
          "motion-reduced",
          "motion-paused",
          "kinetic-enabled",
          "kinetic-constrained",
          "kinetic-save-data",
        );
        root.style.removeProperty("--scroll-p");

        scenes.forEach((scene) => {
          delete scene.dataset.cosmicScene;
          delete scene.dataset.cosmicChapter;
          scene.classList.remove("is-cosmic-visible", "is-cosmic-focus");
          scene.style.removeProperty("--scene-p");
          scene.style.removeProperty("--scene-focus");
          scene.style.removeProperty("--scene-velocity");
          scene.style.removeProperty("--scene-direction");
          scene.style.removeProperty("--scene-shift");
          scene.style.removeProperty("--scene-shift-soft");
          scene.style.removeProperty("--scene-shift-reverse");
        });

        revealTargets.forEach((target) => {
          delete target.dataset.cosmicReveal;
          delete target.dataset.cosmicRole;
          target.classList.remove("is-revealed");
          target.style.removeProperty("--reveal-delay");
          target.style.removeProperty("--reveal-order");
        });

        kineticTargets.forEach((target) => {
          target.classList.remove(
            "is-kinetic-glyph",
            "is-kinetic-control",
            "is-kinetic-card",
            "is-kinetic-active",
            "is-kinetic-pressed",
          );
          KINETIC_PROPERTIES.forEach((property) =>
            target.style.removeProperty(property),
          );
        });
      };
    }

    const visibleGlyphs = new Set<HTMLElement>();
    const visibleCards = new Set<HTMLElement>();
    const visibleControls = new Set<HTMLElement>();
    const journeyRail = document.createElement("div");
    const journeyPoints: HTMLSpanElement[] = [];

    let frameId: number | null = null;
    let velocityResetId: number | null = null;
    let lastScrollProgress = -1;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let scrollVelocity = 0;
    let scrollDirection = 1;
    let reducedMotion = motionPreference.matches;
    let forcedColors = forcedColorsPreference.matches;
    let coarsePointer =
      coarsePointerPreference.matches || !hoverPreference.matches;
    let pointerDirty = false;
    let pointerAvailable = false;
    let pointerX = 0;
    let pointerY = 0;
    let revealObserver: IntersectionObserver | null = null;

    const saveData = connection?.saveData === true;

    journeyRail.className = "cosmic-journey-rail";
    journeyRail.setAttribute("aria-hidden", "true");
    scenes.forEach((_, index) => {
      const point = document.createElement("span");
      point.style.setProperty("--journey-index", `${index}`);
      journeyRail.append(point);
      journeyPoints.push(point);
    });
    document.body.append(journeyRail);

    const canUseKinetics = () =>
      !reducedMotion && !forcedColors && !coarsePointer && !saveData;

    const clearKineticProperties = (target: HTMLElement) => {
      target.classList.remove("is-kinetic-active");
      KINETIC_PROPERTIES.forEach((property) =>
        target.style.removeProperty(property),
      );
    };

    const clearAllKinetics = () => {
      glyphTargets.forEach(clearKineticProperties);
      controlTargets.forEach(clearKineticProperties);
      cardTargets.forEach(clearKineticProperties);
    };

    const syncKineticMode = () => {
      const enabled = canUseKinetics();
      root.classList.toggle("kinetic-enabled", enabled);
      root.classList.toggle("kinetic-constrained", !enabled);
      root.classList.toggle("kinetic-save-data", saveData);

      if (!enabled) {
        pointerAvailable = false;
        clearAllKinetics();
      }
    };

    glyphTargets.forEach((target) => target.classList.add("is-kinetic-glyph"));
    controlTargets.forEach((target) =>
      target.classList.add("is-kinetic-control"),
    );
    cardTargets.forEach((target) => target.classList.add("is-kinetic-card"));
    syncKineticMode();

    scenes.forEach((scene, index) => {
      scene.dataset.cosmicScene = "";
      scene.dataset.cosmicChapter = getChapter(scene, index, scenes.length);
      scene.style.setProperty("--chapter-index", `${index}`);
      scene.style.setProperty("--chapter-count", `${scenes.length}`);
      scene.style.setProperty("--scene-p", "0.5");
      scene.style.setProperty("--scene-focus", "0");
      scene.style.setProperty("--scene-velocity", "0");
      scene.style.setProperty("--scene-direction", "1");
      scene.style.setProperty("--scene-shift", "0px");
      scene.style.setProperty("--scene-shift-soft", "0px");
      scene.style.setProperty("--scene-shift-reverse", "0px");

      const rect = scene.getBoundingClientRect();
      if (rect.bottom > -window.innerHeight * 0.3 && rect.top < window.innerHeight * 1.3) {
        visibleScenes.add(scene);
      }
    });

    const revealTarget = (target: HTMLElement) => {
      target.classList.add("is-revealed");
      pendingRevealTargets.delete(target);
      revealObserver?.unobserve(target);
    };

    const revealSequence = new Map<HTMLElement, number>();
    revealTargets.forEach((target) => {
      target.dataset.cosmicReveal = "";
      target.dataset.cosmicRole = getRevealRole(target);
      const scene = target.closest<HTMLElement>(SCENE_SELECTOR);
      const sequence = scene ? revealSequence.get(scene) ?? 0 : 0;
      target.style.setProperty("--reveal-order", `${sequence}`);
      target.style.setProperty(
        "--reveal-delay",
        `${Math.min(sequence, 8) * 54}ms`,
      );
      if (scene) revealSequence.set(scene, sequence + 1);

      const rect = target.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight * 0.96) {
        revealTarget(target);
      } else {
        pendingRevealTargets.add(target);
      }
    });

    if (reducedMotion) {
      root.classList.add("motion-reduced");
      root.style.setProperty("--scroll-p", "0");
      revealTargets.forEach(revealTarget);
    }

    const updateSceneProgress = (scene: HTMLElement) => {
      const rect = scene.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / Math.max(travel, 1));

      scene.style.setProperty("--scene-p", progress.toFixed(4));
      scene.style.setProperty(
        "--scene-focus",
        clamp(1 - Math.abs(0.5 - progress) * 2).toFixed(4),
      );
      scene.style.setProperty("--scene-velocity", scrollVelocity.toFixed(3));
      scene.style.setProperty("--scene-direction", `${scrollDirection}`);
      scene.style.setProperty(
        "--scene-shift",
        `${((0.5 - progress) * 84).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--scene-shift-soft",
        `${((0.5 - progress) * 38).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--scene-shift-reverse",
        `${((progress - 0.5) * 52).toFixed(2)}px`,
      );
    };

    const writeMotionFrame = () => {
      frameId = null;

      if (document.hidden) {
        return;
      }

      pendingRevealTargets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight * 0.98) {
          revealTarget(target);
        }
      });

      const maximumScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const scrollProgress = reducedMotion
        ? 0
        : clamp(window.scrollY / maximumScroll);

      if (Math.abs(scrollProgress - lastScrollProgress) >= 0.001) {
        root.style.setProperty("--scroll-p", scrollProgress.toFixed(4));
        lastScrollProgress = scrollProgress;
      }

      visibleScenes.forEach((scene) => {
        if (reducedMotion) {
          scene.style.setProperty("--scene-p", "0.5");
          scene.style.setProperty("--scene-shift", "0px");
          scene.style.setProperty("--scene-shift-soft", "0px");
          scene.style.setProperty("--scene-shift-reverse", "0px");
          scene.style.setProperty("--scene-focus", "1");
          scene.style.setProperty("--scene-velocity", "0");
          return;
        }

        updateSceneProgress(scene);
      });

      if (!reducedMotion && visibleScenes.size > 0) {
        let activeScene: HTMLElement | null = null;
        let activeDistance = Number.POSITIVE_INFINITY;
        visibleScenes.forEach((scene) => {
          const rect = scene.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < activeDistance) {
            activeDistance = distance;
            activeScene = scene;
          }
        });
        scenes.forEach((scene, index) => {
          const active = scene === activeScene;
          scene.classList.toggle("is-cosmic-focus", active);
          journeyPoints[index]?.classList.toggle("is-active", active);
        });
      }

      if (pointerDirty) {
        pointerDirty = false;

        if (!pointerAvailable || !canUseKinetics()) {
          clearAllKinetics();
          return;
        }

        visibleGlyphs.forEach((glyph) => {
          const focusedControl = glyph.closest<HTMLElement>(
            "a:focus-visible, button:focus-visible",
          );

          if (focusedControl || glyph.closest(".tarot-fan")) {
            clearKineticProperties(glyph);
            return;
          }

          const rect = glyph.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = pointerX - centerX;
          const deltaY = pointerY - centerY;
          const distance = Math.hypot(deltaX, deltaY);
          const radius = Math.min(190, Math.max(110, rect.width * 5));

          if (distance >= radius) {
            clearKineticProperties(glyph);
            return;
          }

          const personality = glyph.dataset.kineticPersonality ?? "star";
          const personalityStrength =
            personality === "orbit"
              ? 1
              : personality === "sun"
                ? 0.88
                : personality === "moon"
                  ? 0.72
                  : personality === "eclipse"
                    ? 0.82
                    : 0.62;
          const proximity = 1 - distance / radius;
          const strength = (1 + proximity * 2) * personalityStrength;
          const directionX = distance > 0 ? deltaX / distance : 0;
          const directionY = distance > 0 ? deltaY / distance : 0;
          const rotation =
            (directionX * 2.4 + directionY * 0.8) * personalityStrength;

          glyph.style.setProperty(
            "--kinetic-x",
            `${(directionX * strength).toFixed(2)}px`,
          );
          glyph.style.setProperty(
            "--kinetic-y",
            `${(directionY * strength).toFixed(2)}px`,
          );
          glyph.style.setProperty(
            "--kinetic-rotate",
            `${rotation.toFixed(2)}deg`,
          );
          glyph.classList.add("is-kinetic-active");
        });

        visibleControls.forEach((control) => {
          if (control.matches(":focus-visible")) {
            clearKineticProperties(control);
            return;
          }

          const rect = control.getBoundingClientRect();
          const reach = 18;
          const isNear =
            pointerX >= rect.left - reach &&
            pointerX <= rect.right + reach &&
            pointerY >= rect.top - reach &&
            pointerY <= rect.bottom + reach;

          if (!isNear) {
            clearKineticProperties(control);
            return;
          }

          const normalizedX = clamp(
            (pointerX - (rect.left + rect.width / 2)) /
              Math.max(rect.width / 2, 1),
            -1,
            1,
          );
          const normalizedY = clamp(
            (pointerY - (rect.top + rect.height / 2)) /
              Math.max(rect.height / 2, 1),
            -1,
            1,
          );

          control.style.setProperty(
            "--kinetic-x",
            `${(normalizedX * 5).toFixed(2)}px`,
          );
          control.style.setProperty(
            "--kinetic-y",
            `${(normalizedY * 5).toFixed(2)}px`,
          );
          control.classList.add("is-kinetic-active");
        });

        visibleCards.forEach((card) => {
          if (card.matches(":focus-visible, :focus-within")) {
            clearKineticProperties(card);
            return;
          }

          const rect = card.getBoundingClientRect();
          const isInside =
            pointerX >= rect.left &&
            pointerX <= rect.right &&
            pointerY >= rect.top &&
            pointerY <= rect.bottom;

          if (!isInside) {
            clearKineticProperties(card);
            return;
          }

          const normalizedX = clamp(
            (pointerX - rect.left) / Math.max(rect.width, 1),
          );
          const normalizedY = clamp(
            (pointerY - rect.top) / Math.max(rect.height, 1),
          );

          card.style.setProperty(
            "--kinetic-card-rx",
            `${((0.5 - normalizedY) * 5).toFixed(2)}deg`,
          );
          card.style.setProperty(
            "--kinetic-card-ry",
            `${((normalizedX - 0.5) * 5).toFixed(2)}deg`,
          );
          card.style.setProperty(
            "--kinetic-highlight-x",
            `${(normalizedX * 100).toFixed(1)}%`,
          );
          card.style.setProperty(
            "--kinetic-highlight-y",
            `${(normalizedY * 100).toFixed(1)}%`,
          );
          card.style.setProperty("--kinetic-highlight-alpha", "13%");
          card.classList.add("is-kinetic-active");
        });
      }
    };

    const requestMotionFrame = () => {
      if (frameId === null && !document.hidden) {
        frameId = window.requestAnimationFrame(writeMotionFrame);
      }
    };

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scene = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visibleScenes.add(scene);
            scene.classList.add("is-cosmic-visible");
          } else {
            visibleScenes.delete(scene);
            scene.classList.remove("is-cosmic-visible", "is-cosmic-focus");
          }
        });
        requestMotionFrame();
      },
      { rootMargin: "15% 0px 15% 0px", threshold: 0 },
    );

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealTarget(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px 12% 0px", threshold: 0.01 },
    );

    const kineticObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const targetSet = target.matches(KINETIC_CARD_SELECTOR)
            ? visibleCards
            : target.matches(KINETIC_GLYPH_SELECTOR)
              ? visibleGlyphs
              : visibleControls;

          if (entry.isIntersecting) {
            targetSet.add(target);
          } else {
            targetSet.delete(target);
            clearKineticProperties(target);
          }
        });
      },
      { rootMargin: "12% 8% 12% 8%", threshold: 0 },
    );

    scenes.forEach((scene) => sceneObserver.observe(scene));
    pendingRevealTargets.forEach((target) => revealObserver?.observe(target));
    kineticTargets.forEach((target) => kineticObserver.observe(target));

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      root.classList.toggle("motion-reduced", reducedMotion);

      if (reducedMotion) {
        revealTargets.forEach(revealTarget);
      }

      syncKineticMode();
      pointerDirty = true;
      requestMotionFrame();
    };

    const handleKineticPreference = () => {
      forcedColors = forcedColorsPreference.matches;
      coarsePointer =
        coarsePointerPreference.matches || !hoverPreference.matches;
      syncKineticMode();
      pointerDirty = true;
      requestMotionFrame();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canUseKinetics() || event.pointerType === "touch") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerAvailable = true;
      pointerDirty = true;
      requestMotionFrame();
    };

    const handlePointerLeave = () => {
      pointerAvailable = false;
      pointerDirty = true;
      requestMotionFrame();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && !coarsePointer) {
        return;
      }

      const origin = event.target;
      if (!(origin instanceof Element)) {
        return;
      }

      const pressedTarget = origin.closest<HTMLElement>(
        `${KINETIC_CARD_SELECTOR}, ${KINETIC_CONTROL_SELECTOR}`,
      );
      pressedTarget?.classList.add("is-kinetic-pressed");
    };

    const releasePressedTargets = () => {
      kineticTargets.forEach((target) =>
        target.classList.remove("is-kinetic-pressed"),
      );
    };

    const handleFocusIn = (event: FocusEvent) => {
      const origin = event.target;
      if (!(origin instanceof HTMLElement)) {
        return;
      }

      const focusedCard = origin.closest<HTMLElement>(KINETIC_CARD_SELECTOR);
      const focusedControl = origin.closest<HTMLElement>(
        KINETIC_CONTROL_SELECTOR,
      );
      if (focusedCard) {
        clearKineticProperties(focusedCard);
      }
      if (focusedControl) {
        clearKineticProperties(focusedControl);
      }
      origin
        .querySelectorAll<HTMLElement>(KINETIC_GLYPH_SELECTOR)
        .forEach(clearKineticProperties);
    };

    const handleResize = () => {
      pointerDirty = true;
      requestMotionFrame();
    };

    const handleScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastScrollTime, 16);
      const delta = window.scrollY - lastScrollY;
      scrollVelocity = clamp(delta / elapsed / 1.25, -1, 1);
      if (Math.abs(delta) > 0.5) scrollDirection = delta > 0 ? 1 : -1;
      lastScrollY = window.scrollY;
      lastScrollTime = now;

      if (velocityResetId !== null) window.clearTimeout(velocityResetId);
      velocityResetId = window.setTimeout(() => {
        scrollVelocity = 0;
        requestMotionFrame();
      }, 120);
      pointerDirty = pointerAvailable;
      requestMotionFrame();
    };

    const handleVisibility = () => {
      root.classList.toggle("motion-paused", document.hidden);

      if (document.hidden) {
        pointerAvailable = false;
        clearAllKinetics();
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
        return;
      }

      pointerDirty = true;
      requestMotionFrame();
    };

    root.classList.toggle("motion-reduced", reducedMotion);
    root.classList.toggle("motion-paused", document.hidden);
    root.style.setProperty("--scroll-p", "0");
    writeMotionFrame();

    const readyFrame = window.requestAnimationFrame(() => {
      root.classList.add("motion-ready");
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerup", releasePressedTargets, { passive: true });
    document.addEventListener("pointercancel", releasePressedTargets, {
      passive: true,
    });
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("visibilitychange", handleVisibility);
    motionPreference.addEventListener("change", handleMotionPreference);
    forcedColorsPreference.addEventListener("change", handleKineticPreference);
    coarsePointerPreference.addEventListener("change", handleKineticPreference);
    hoverPreference.addEventListener("change", handleKineticPreference);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (velocityResetId !== null) {
        window.clearTimeout(velocityResetId);
      }

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", releasePressedTargets);
      document.removeEventListener("pointercancel", releasePressedTargets);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionPreference.removeEventListener("change", handleMotionPreference);
      forcedColorsPreference.removeEventListener(
        "change",
        handleKineticPreference,
      );
      coarsePointerPreference.removeEventListener(
        "change",
        handleKineticPreference,
      );
      hoverPreference.removeEventListener("change", handleKineticPreference);
      sceneObserver.disconnect();
      revealObserver?.disconnect();
      kineticObserver.disconnect();
      pendingRevealTargets.clear();

      root.classList.remove(
        "motion-ready",
        "motion-reduced",
        "motion-paused",
        "kinetic-enabled",
        "kinetic-constrained",
        "kinetic-save-data",
      );
      root.style.removeProperty("--scroll-p");
      journeyRail.remove();

      scenes.forEach((scene) => {
        delete scene.dataset.cosmicScene;
        delete scene.dataset.cosmicChapter;
        scene.classList.remove("is-cosmic-visible", "is-cosmic-focus");
        scene.style.removeProperty("--chapter-index");
        scene.style.removeProperty("--chapter-count");
        scene.style.removeProperty("--scene-p");
        scene.style.removeProperty("--scene-focus");
        scene.style.removeProperty("--scene-velocity");
        scene.style.removeProperty("--scene-direction");
        scene.style.removeProperty("--scene-shift");
        scene.style.removeProperty("--scene-shift-soft");
        scene.style.removeProperty("--scene-shift-reverse");
      });

      revealTargets.forEach((target) => {
        delete target.dataset.cosmicReveal;
        delete target.dataset.cosmicRole;
        target.classList.remove("is-revealed");
        target.style.removeProperty("--reveal-delay");
        target.style.removeProperty("--reveal-order");
      });

      kineticTargets.forEach((target) => {
        target.classList.remove(
          "is-kinetic-glyph",
          "is-kinetic-control",
          "is-kinetic-card",
          "is-kinetic-active",
          "is-kinetic-pressed",
        );
        clearKineticProperties(target);
      });
    };
  }, [mode, pathname, ready]);

  return null;
}
