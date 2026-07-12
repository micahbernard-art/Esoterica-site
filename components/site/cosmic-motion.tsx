"use client";

import { useEffect } from "react";

const SCENE_SELECTOR = "main > section, .site-footer";

const REVEAL_SELECTOR = [
  "[data-reveal]",
  ".hero-copy > *",
  ".hero-feature",
  ".section-heading > *",
  ".catalog-card",
  ".category-card",
  ".readings-highlight > *",
  ".process-card",
  ".about-copy > *",
  ".about-principles > *",
  ".contact-banner > *",
  ".page-hero-copy > *",
  ".book-cover",
  ".book-copy > *",
  ".reading-tier",
  ".booking-note > *",
  ".footer-main > *",
  ".footer-bottom > *",
].join(",");

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

export function CosmicMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>(SCENE_SELECTOR),
    );
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );
    const visibleScenes = new Set<HTMLElement>();

    let frameId: number | null = null;
    let reducedMotion = motionPreference.matches;

    scenes.forEach((scene) => {
      scene.dataset.cosmicScene = "";
      scene.style.setProperty("--scene-p", "0.5");
      scene.style.setProperty("--scene-shift", "0px");
      scene.style.setProperty("--scene-shift-soft", "0px");
      scene.style.setProperty("--scene-shift-reverse", "0px");

      const rect = scene.getBoundingClientRect();
      if (rect.bottom > -window.innerHeight * 0.3 && rect.top < window.innerHeight * 1.3) {
        visibleScenes.add(scene);
      }
    });

    revealTargets.forEach((target, index) => {
      target.dataset.cosmicReveal = "";
      target.style.setProperty("--reveal-delay", `${(index % 6) * 65}ms`);

      const rect = target.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight * 0.96) {
        target.classList.add("is-revealed");
      }
    });

    if (reducedMotion) {
      root.classList.add("motion-reduced");
      root.style.setProperty("--scroll-p", "0");
      revealTargets.forEach((target) => target.classList.add("is-revealed"));

      return () => {
        root.classList.remove("motion-reduced");
        root.style.removeProperty("--scroll-p");

        scenes.forEach((scene) => {
          delete scene.dataset.cosmicScene;
          scene.style.removeProperty("--scene-p");
          scene.style.removeProperty("--scene-shift");
          scene.style.removeProperty("--scene-shift-soft");
          scene.style.removeProperty("--scene-shift-reverse");
        });

        revealTargets.forEach((target) => {
          delete target.dataset.cosmicReveal;
          target.classList.remove("is-revealed");
          target.style.removeProperty("--reveal-delay");
        });
      };
    }

    const updateSceneProgress = (scene: HTMLElement) => {
      const rect = scene.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / Math.max(travel, 1));

      scene.style.setProperty("--scene-p", progress.toFixed(4));
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

      const maximumScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const scrollProgress = reducedMotion
        ? 0
        : clamp(window.scrollY / maximumScroll);

      root.style.setProperty("--scroll-p", scrollProgress.toFixed(4));

      visibleScenes.forEach((scene) => {
        if (reducedMotion) {
          scene.style.setProperty("--scene-p", "0.5");
          scene.style.setProperty("--scene-shift", "0px");
          scene.style.setProperty("--scene-shift-soft", "0px");
          scene.style.setProperty("--scene-shift-reverse", "0px");
          return;
        }

        updateSceneProgress(scene);
      });
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
          } else {
            visibleScenes.delete(scene);
          }
        });
        requestMotionFrame();
      },
      { rootMargin: "35% 0px 35% 0px", threshold: 0 },
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const target = entry.target as HTMLElement;
          target.classList.add("is-revealed");
          revealObserver.unobserve(target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    scenes.forEach((scene) => sceneObserver.observe(scene));
    revealTargets.forEach((target) => revealObserver.observe(target));

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      root.classList.toggle("motion-reduced", reducedMotion);

      if (reducedMotion) {
        revealTargets.forEach((target) => target.classList.add("is-revealed"));
      }

      requestMotionFrame();
    };

    const handleVisibility = () => {
      root.classList.toggle("motion-paused", document.hidden);

      if (document.hidden) {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
          frameId = null;
        }
        return;
      }

      requestMotionFrame();
    };

    root.classList.toggle("motion-reduced", reducedMotion);
    root.classList.toggle("motion-paused", document.hidden);
    root.style.setProperty("--scroll-p", "0");
    writeMotionFrame();

    const readyFrame = window.requestAnimationFrame(() => {
      root.classList.add("motion-ready");
    });

    window.addEventListener("scroll", requestMotionFrame, { passive: true });
    window.addEventListener("resize", requestMotionFrame, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    motionPreference.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(readyFrame);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestMotionFrame);
      window.removeEventListener("resize", requestMotionFrame);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionPreference.removeEventListener("change", handleMotionPreference);
      sceneObserver.disconnect();
      revealObserver.disconnect();

      root.classList.remove("motion-ready", "motion-reduced", "motion-paused");
      root.style.removeProperty("--scroll-p");

      scenes.forEach((scene) => {
        delete scene.dataset.cosmicScene;
        scene.style.removeProperty("--scene-p");
        scene.style.removeProperty("--scene-shift");
        scene.style.removeProperty("--scene-shift-soft");
        scene.style.removeProperty("--scene-shift-reverse");
      });

      revealTargets.forEach((target) => {
        delete target.dataset.cosmicReveal;
        target.classList.remove("is-revealed");
        target.style.removeProperty("--reveal-delay");
      });
    };
  }, []);

  return null;
}
