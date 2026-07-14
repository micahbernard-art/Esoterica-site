"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePerformanceMode } from "@/components/providers/performance-provider";
import "@/app/kinetic-ui.css";

type JourneyAct =
  | "thesis"
  | "specimen"
  | "matrix"
  | "evidence"
  | "portal"
  | "quiet";

type NavigatorConnection = EventTarget & {
  saveData?: boolean;
};

const JOURNEY_SCENE_SELECTOR = "[data-journey-scene]";
const JOURNEY_VARIABLES = [
  "--journey-p",
  "--chapter-p",
  "--act-p",
  "--act-focus",
  "--journey-velocity",
  "--portal-p",
] as const;
const ACTIVE_HYSTERESIS_RATIO = 0.08;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const connection = () =>
  (
    navigator as Navigator & {
      connection?: NavigatorConnection;
    }
  ).connection;

const sceneAct = (scene: HTMLElement): JourneyAct => {
  const act = scene.dataset.journeyAct;
  return act === "thesis" ||
    act === "specimen" ||
    act === "matrix" ||
    act === "evidence" ||
    act === "portal" ||
    act === "quiet"
    ? act
    : "evidence";
};

export function CosmicMotion() {
  const pathname = usePathname();
  const { mode, ready } = usePerformanceMode();
  const [capabilityVersion, setCapabilityVersion] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>(JOURNEY_SCENE_SELECTOR),
    );
    if (scenes.length === 0) return;

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = matchMedia("(forced-colors: active)");
    const dataConnection = connection();
    const staticExperience =
      !ready ||
      mode === "lite" ||
      reducedMotion.matches ||
      forcedColors.matches ||
      dataConnection?.saveData === true;
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-journey-anchor]"),
    );

    let frameId: number | null = null;
    let activeScene: HTMLElement | null = null;
    let activeIndex = 0;
    let previousScrollY = window.scrollY;
    let previousFrameTime = performance.now();

    const writeVariables = (
      journeyProgress: number,
      chapterProgress: number,
      actProgress: number,
      actFocus: number,
      velocity: number,
      portalProgress: number,
    ) => {
      root.style.setProperty("--journey-p", journeyProgress.toFixed(4));
      root.style.setProperty("--chapter-p", chapterProgress.toFixed(4));
      root.style.setProperty("--act-p", actProgress.toFixed(4));
      root.style.setProperty("--act-focus", actFocus.toFixed(4));
      root.style.setProperty("--journey-velocity", velocity.toFixed(3));
      root.style.setProperty("--portal-p", portalProgress.toFixed(4));
    };

    const commitScene = (scene: HTMLElement, index: number) => {
      if (scene === activeScene) return;

      activeScene?.setAttribute("data-journey-state", "idle");
      activeScene = scene;
      activeIndex = index;
      scene.setAttribute("data-journey-state", "active");

      const sceneId = scene.dataset.journeyScene ?? scene.id;
      const act = sceneAct(scene);
      root.dataset.journeyScene = sceneId;
      root.dataset.journeyAct = act;
      root.dataset.stagePreset = scene.dataset.stagePreset ?? "clarity";

      if (scene.dataset.specimenIndex !== undefined) {
        root.dataset.specimenIndex = scene.dataset.specimenIndex;
      } else {
        delete root.dataset.specimenIndex;
      }

      anchors.forEach((anchor) => {
        const current = anchor.dataset.journeyAnchor === sceneId;
        anchor.dataset.journeyAnchorState = current ? "active" : "idle";
        if (current) anchor.setAttribute("aria-current", "location");
        else anchor.removeAttribute("aria-current");
      });
    };

    const scoreScene = (scene: HTMLElement) => {
      const rect = scene.getBoundingClientRect();
      const viewportHeight = Math.max(window.innerHeight, 1);
      const travel = viewportHeight + rect.height;
      const progress = clamp((viewportHeight - rect.top) / Math.max(travel, 1));
      const centerDistance = Math.abs(
        rect.top + rect.height / 2 - viewportHeight / 2,
      );
      const focus = clamp(1 - centerDistance / (viewportHeight * 0.78));
      return { centerDistance, focus, progress, rect };
    };

    const selectActiveScene = () => {
      let candidate = activeScene ?? scenes[0];
      let candidateIndex = activeScene ? activeIndex : 0;
      let candidateScore = scoreScene(candidate);

      scenes.forEach((scene, index) => {
        const score = scoreScene(scene);
        const intersectsJourneyBand =
          score.rect.bottom > window.innerHeight * 0.08 &&
          score.rect.top < window.innerHeight * 0.92;
        if (!intersectsJourneyBand) return;
        if (score.centerDistance < candidateScore.centerDistance) {
          candidate = scene;
          candidateIndex = index;
          candidateScore = score;
        }
      });

      if (activeScene && candidate !== activeScene) {
        const activeScore = scoreScene(activeScene);
        const hysteresis = window.innerHeight * ACTIVE_HYSTERESIS_RATIO;
        const activeStillVisible =
          activeScore.rect.bottom > 0 && activeScore.rect.top < window.innerHeight;
        if (
          activeStillVisible &&
          candidateScore.centerDistance + hysteresis >= activeScore.centerDistance
        ) {
          candidate = activeScene;
          candidateIndex = activeIndex;
          candidateScore = activeScore;
        }
      }

      commitScene(candidate, candidateIndex);
      return candidateScore;
    };

    const writeFrame = (time = performance.now()) => {
      frameId = null;
      if (document.hidden) return;

      const score = selectActiveScene();
      const scrollY = window.scrollY;
      const maximumScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const elapsed = Math.max(time - previousFrameTime, 16);
      const velocity = clamp((scrollY - previousScrollY) / elapsed / 1.35, -1, 1);
      const journeyProgress = clamp(scrollY / maximumScroll);
      const chapterProgress = clamp(
        (activeIndex + score.progress) / Math.max(scenes.length, 1),
      );
      const act = activeScene ? sceneAct(activeScene) : "evidence";
      const portalProgress =
        act === "portal" ? score.progress : act === "quiet" ? 0.12 : 0;

      writeVariables(
        journeyProgress,
        chapterProgress,
        score.progress,
        score.focus,
        velocity,
        portalProgress,
      );
      previousScrollY = scrollY;
      previousFrameTime = time;
    };

    const requestJourneyFrame = () => {
      if (frameId === null && !document.hidden) {
        frameId = requestAnimationFrame(writeFrame);
      }
    };

    const handleVisibility = () => {
      root.classList.toggle("journey-paused", document.hidden);
      if (document.hidden && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      } else if (!document.hidden) {
        previousScrollY = window.scrollY;
        previousFrameTime = performance.now();
        requestJourneyFrame();
      }
    };

    const handleCapabilityChange = () => {
      setCapabilityVersion((version) => version + 1);
    };

    scenes.forEach((scene) => scene.setAttribute("data-journey-state", "idle"));
    root.classList.toggle("journey-static", staticExperience);
    root.classList.toggle("journey-cinematic", !staticExperience);
    reducedMotion.addEventListener("change", handleCapabilityChange);
    forcedColors.addEventListener("change", handleCapabilityChange);
    dataConnection?.addEventListener("change", handleCapabilityChange);

    if (staticExperience) {
      const firstScene = scenes[0];
      commitScene(firstScene, 0);
      scenes.forEach((scene) => scene.setAttribute("data-journey-state", "static"));
      writeVariables(0, 0, 0.5, 1, 0, 0);

      return () => {
        reducedMotion.removeEventListener("change", handleCapabilityChange);
        forcedColors.removeEventListener("change", handleCapabilityChange);
        dataConnection?.removeEventListener("change", handleCapabilityChange);
        scenes.forEach((scene) => scene.removeAttribute("data-journey-state"));
        root.classList.remove("journey-static", "journey-cinematic");
        delete root.dataset.journeyScene;
        delete root.dataset.journeyAct;
        delete root.dataset.stagePreset;
        delete root.dataset.specimenIndex;
        JOURNEY_VARIABLES.forEach((variable) => root.style.removeProperty(variable));
      };
    }

    writeFrame();
    root.classList.add("journey-ready");
    window.addEventListener("scroll", requestJourneyFrame, { passive: true });
    window.addEventListener("resize", requestJourneyFrame, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestJourneyFrame);
      window.removeEventListener("resize", requestJourneyFrame);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", handleCapabilityChange);
      forcedColors.removeEventListener("change", handleCapabilityChange);
      dataConnection?.removeEventListener("change", handleCapabilityChange);
      scenes.forEach((scene) => scene.removeAttribute("data-journey-state"));
      anchors.forEach((anchor) => {
        anchor.dataset.journeyAnchorState = "idle";
        anchor.removeAttribute("aria-current");
      });
      root.classList.remove(
        "journey-ready",
        "journey-paused",
        "journey-static",
        "journey-cinematic",
      );
      delete root.dataset.journeyScene;
      delete root.dataset.journeyAct;
      delete root.dataset.stagePreset;
      delete root.dataset.specimenIndex;
      JOURNEY_VARIABLES.forEach((variable) => root.style.removeProperty(variable));
    };
  }, [capabilityVersion, mode, pathname, ready]);

  return null;
}
