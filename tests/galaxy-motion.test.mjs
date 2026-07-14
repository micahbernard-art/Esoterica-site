import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(path, "utf8");

test("one persistent decorative galaxy stage is mounted and lazy loaded at root", async () => {
  const [layout, frame, stage, galaxy, styles] = await Promise.all([
    read("app/layout.tsx"),
    read("components/site/site-frame.tsx"),
    read("components/site/galaxy-stage.tsx"),
    read("components/site/galaxy-experience.tsx"),
    read("app/galaxy-experience.css"),
  ]);

  assert.equal((layout.match(/<GalaxyStage\b/g) ?? []).length, 1);
  assert.match(stage, /dynamic\(/);
  assert.match(stage, /ssr:\s*false/);
  assert.doesNotMatch(frame, /AstralFluidCanvas/);
  assert.match(galaxy, /aria-hidden=["']true["']/);
  assert.match(styles, /pointer-events:\s*none/);
});

test("galaxy quality stays inside approved rendering budgets", async () => {
  const quality = await read("lib/galaxy/quality.ts");

  assert.match(quality, /constrained\s*\?\s*1\s*:\s*Math\.min\(devicePixelRatio\s*\|\|\s*1,\s*1\.35\)/);
  assert.match(quality, /constrained\s*\?\s*45\s*:\s*60/);
  assert.match(quality, /constrained\s*\?\s*520\s*:\s*1050/);
  assert.doesNotMatch(quality, /bloom|postprocessing|preserveDrawingBuffer/i);
});

test("all public routes have distinct galaxy palettes and camera waypoints", async () => {
  const galaxy = await read("components/site/galaxy-experience.tsx");

  for (const route of ["/", "/tarot", "/libros", "/lecturas"]) {
    assert.match(
      galaxy,
      new RegExp(`(?:["']${route === "/" ? "\\/" : route}["']):\\s*\\{`),
    );
  }
  assert.equal((galaxy.match(/^\s{4}colors:\s*\[/gm) ?? []).length, 4);
  assert.equal((galaxy.match(/^\s{4}camera:\s*\[/gm) ?? []).length, 4);
});

test("motion layers expose accessibility and device fallbacks", async () => {
  const [quality, galaxyStyles, choreography, cursor] = await Promise.all([
    read("lib/galaxy/quality.ts"),
    read("app/galaxy-experience.css"),
    read("app/galaxy-choreography.css"),
    read("components/site/mystic-cursor.tsx"),
  ]);

  assert.match(quality, /prefers-reduced-motion:\s*reduce/);
  assert.match(quality, /saveData/);
  assert.match(quality, /forced-colors:\s*active/);
  assert.match(galaxyStyles, /forced-colors:\s*active/);
  assert.match(choreography, /prefers-reduced-motion:\s*reduce/);
  assert.match(cursor, /pointer:\s*fine/);
  assert.match(cursor, /hardwareConcurrency/);
});

test("hidden tabs stop the refresh-synchronized galaxy scheduler", async () => {
  const galaxy = await read("components/site/galaxy-experience.tsx");
  const scheduler = galaxy.match(/function FrameScheduler[\s\S]*?return null;/)?.[0] ?? "";

  assert.match(scheduler, /visibilitychange/);
  assert.match(scheduler, /cancelAnimationFrame/);
  assert.match(scheduler, /document\.hidden/);
});

test("one hysteretic scene score drives the six-variable Atlas journey", async () => {
  const [motion, stageCss, galaxy] = await Promise.all([
    read("components/site/cosmic-motion.tsx"),
    read("app/cinematic-stage.css"),
    read("components/site/galaxy-experience.tsx"),
  ]);

  for (const property of [
    "--journey-p",
    "--chapter-p",
    "--act-p",
    "--act-focus",
    "--journey-velocity",
    "--portal-p",
  ]) {
    assert.match(motion, new RegExp(`["']${property}["']`));
  }

  assert.equal((motion.match(/root\.style\.setProperty/g) ?? []).length, 6);
  assert.match(motion, /ACTIVE_HYSTERESIS_RATIO = 0\.08/);
  assert.match(motion, /root\.dataset\.journeyScene/);
  assert.match(motion, /root\.dataset\.journeyAct/);
  assert.match(motion, /root\.dataset\.stagePreset/);
  assert.match(motion, /root\.dataset\.specimenIndex/);
  assert.match(motion, /dataConnection\?\.saveData === true/);
  assert.match(motion, /mode === "lite"/);
  assert.doesNotMatch(motion, /IntersectionObserver|setInterval|setTimeout|cosmicBeat/);
  assert.match(stageCss, /\.cinematic-stage[\s\S]*position:\s*fixed/);
  assert.match(stageCss, /html\[data-stage-preset="portal"\][\s\S]*var\(--portal-p/);
  assert.match(stageCss, /data-performance-mode="lite"[\s\S]*\.journey-scene/);
  assert.match(stageCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(stageCss, /forced-colors:\s*active/);

  assert.match(galaxy, /const JOURNEY_CAMERA/);
  assert.match(galaxy, /quality\.constrained \? 0\.5 : 1/);
  assert.match(galaxy, /readJourneyCameraPreset/);
  assert.doesNotMatch(galaxy, /torusGeometry|sphereGeometry|icosahedronGeometry|postprocessing/i);
});

test("custom cursor remains semantic, decorative, and bounded", async () => {
  const [layout, cursor, styles] = await Promise.all([
    read("app/layout.tsx"),
    read("components/site/mystic-cursor.tsx"),
    read("app/mystic-cursor.css"),
  ]);

  assert.equal((layout.match(/<MysticCursor\b/g) ?? []).length, 1);
  assert.match(cursor, /aria-hidden=["']true["']/);
  assert.match(cursor, /requestAnimationFrame/);
  assert.match(cursor, /cancelAnimationFrame/);
  assert.match(styles, /pointer-events:\s*none/);
  assert.match(styles, /html\.mystic-cursor-enabled/);
});

test("Basement Grotesque ships with its complete OFL license", async () => {
  await access("public/fonts/BasementGrotesque-Black.woff2");
  const [notice, license, styles] = await Promise.all([
    read("THIRD_PARTY_NOTICES.md"),
    read("public/fonts/OFL-Basement-Grotesque.txt"),
    read("app/globals.css"),
  ]);

  assert.match(notice, /Basement Grotesque/);
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(license, /Copyright 2021 basement grotesque/);
  assert.match(styles, /BasementGrotesque-Black\.woff2/);
});

test("Atlas thresholds keep one readable H1 and explicit journey contracts", async () => {
  const [title, stageCss, home, pageHero, tarot, books, readings] = await Promise.all([
    read("components/site/astral-title.tsx"),
    read("app/cinematic-stage.css"),
    read("app/page.tsx"),
    read("components/site/page-hero.tsx"),
    read("app/tarot/page.tsx"),
    read("app/libros/page.tsx"),
    read("app/lecturas/page.tsx"),
  ]);

  assert.equal((title.match(/<h1\b/g) ?? []).length, 1);
  assert.match(title, /className="sr-only"/);
  assert.match(title, /aria-hidden="true"/);
  assert.match(title, /data-astral-arrival="constellation"/);
  assert.match(home, /data-journey-scene="home-threshold"/);
  assert.match(home, /data-stage-preset="threshold"/);
  for (const route of [tarot, books, readings]) {
    assert.equal((route.match(/<PageHero\b/g) ?? []).length, 1);
    assert.match(route, /data-stage-preset="threshold"/);
  }
  assert.match(pageHero, /data-galaxy-anchor=\{`\$\{variant\}-threshold`\}/);
  assert.match(stageCss, /\.journey-scene \[data-reveal\][\s\S]*opacity:\s*1 !important/);
  assert.match(stageCss, /\.journey-first-fold[\s\S]*min-height:\s*78svh/);
});

test("cinematic journey exposes one root mount and opening phase contract", async () => {
  const [layout, journey, journeyCss] = await Promise.all([
    read("app/layout.tsx"),
    read("components/site/cinematic-journey.tsx"),
    read("app/cinematic-journey.css"),
  ]);

  assert.equal((layout.match(/<CinematicJourney\b/g) ?? []).length, 1);
  assert.match(journey, /dataset\.journeyPhase/);
  assert.match(journey, /["']esoterica:journey["']/);
  assert.match(journey, /["']opening["']/);
  assert.match(journey, /addEventListener\(["']popstate["']/);
  assert.match(journey, /connection\?\.saveData/);
  assert.match(journeyCss, /data-journey-phase="covered"[\s\S]*pointer-events:\s*auto/);
});
