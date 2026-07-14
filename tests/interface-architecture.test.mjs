import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(path, "utf8");

test("foreground uses Geist inside a global adaptive Lenis provider", async () => {
  const [layout, provider, manifest] = await Promise.all([
    read("app/layout.tsx"),
    read("components/providers/smooth-scroll-provider.tsx"),
    read("package.json"),
  ]);

  assert.match(layout, /Cormorant_Garamond, Geist/);
  assert.doesNotMatch(layout, /Manrope/);
  assert.match(layout, /<SmoothScrollProvider>\{children\}<\/SmoothScrollProvider>/);
  assert.equal((layout.match(/<GalaxyStage\b/g) ?? []).length, 1);
  assert.equal((layout.match(/<CinematicJourney\b/g) ?? []).length, 1);
  assert.equal((layout.match(/<MysticCursor\b/g) ?? []).length, 1);
  assert.match(provider, /ReactLenis/);
  assert.match(provider, /stopInertiaOnNavigate:\s*enabled/);
  assert.match(provider, /syncTouch:\s*false/);
  assert.match(manifest, /"lenis"/);
  assert.match(manifest, /"motion"/);
});

test("smooth scrolling preserves native accessibility fallbacks and journey safety", async () => {
  const provider = await read("components/providers/smooth-scroll-provider.tsx");

  assert.match(provider, /hover: hover/);
  assert.match(provider, /pointer: fine/);
  assert.match(provider, /prefers-reduced-motion: reduce/);
  assert.match(provider, /forced-colors: active/);
  assert.match(provider, /saveData/);
  assert.match(provider, /esoterica:journey/);
  assert.match(provider, /phase === "closing" \|\| phase === "covered"/);
  assert.match(provider, /phase === "opening" \|\| phase === "idle"/);
  assert.match(provider, /JOURNEY_RESUME_TIMEOUT_MS/);
});

test("site frame publishes a stable foreground interface contract", async () => {
  const [frame, globals] = await Promise.all([
    read("components/site/site-frame.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(frame, /className="site-shell site-interface atlas-journey"/);
  assert.match(frame, /data-interface-layer="foreground"/);
  assert.match(frame, /data-interface-route=\{activePath\}/);
  assert.match(frame, /data-interface-plane="content"/);
  assert.equal((frame.match(/<JourneyStage\b/g) ?? []).length, 1);
  assert.equal((frame.match(/<JourneyHud\b/g) ?? []).length, 1);
  assert.equal((frame.match(/<JourneyRail\b/g) ?? []).length, 1);
  assert.match(globals, /\.site-interface[\s\S]*z-index:\s*var\(--z-content\)/);
  assert.match(globals, /html\[data-scroll-engine="lenis"\][\s\S]*scroll-behavior:\s*auto/);
});

test("El Atlas Vivo stages one persistent world and semantic acts per route", async () => {
  const [frame, home, tarot, books, readings, stage, stageCss] = await Promise.all([
    read("components/site/site-frame.tsx"),
    read("app/page.tsx"),
    read("app/tarot/page.tsx"),
    read("app/libros/page.tsx"),
    read("app/lecturas/page.tsx"),
    read("components/site/journey-stage.tsx"),
    read("app/cinematic-stage.css"),
  ]);

  assert.equal((frame.match(/<JourneyStage\b/g) ?? []).length, 1);
  assert.match(stage, /data-journey-stage="persistent"/);
  assert.doesNotMatch(frame, /cosmic-beat-hud|observatory-hud/);

  for (const route of [home, tarot, books, readings]) {
    assert.match(route, /data-journey-scene=/);
    assert.match(route, /data-journey-act="thesis"/);
    assert.match(route, /data-journey-act="specimen"/);
    assert.match(route, /data-journey-act="portal"/);
    assert.match(route, /data-stage-preset=/);
  }

  assert.equal((home.match(/className="journey-category-matrix"/g) ?? []).length, 1);
  assert.equal((home.match(/data-specimen-index=/g) ?? []).length, 2);
  assert.equal((tarot.match(/data-specimen-index=/g) ?? []).length, 1);
  assert.match(books, /data-stage-preset="book"/);
  assert.match(readings, /data-stage-preset="eclipse"/);
  assert.match(stageCss, /\.journey-scene[\s\S]*min-height:\s*85svh/);
  assert.match(stageCss, /html\.journey-static[\s\S]*\.journey-scene/);
  assert.match(stageCss, /data-performance-mode="lite"[\s\S]*\.journey-scene/);
  assert.doesNotMatch(
    stageCss,
    /transition(?:-property)?:[^;]*(?:width|height|margin|clip-path|filter|box-shadow|border-color)/,
  );
});

test("foreground kinetics use tokenized premium easing without layout animation", async () => {
  const [globals, kinetic, cosmic, cursor] = await Promise.all([
    read("app/globals.css"),
    read("app/kinetic-ui.css"),
    read("app/cosmic-motion.css"),
    read("app/mystic-cursor.css"),
  ]);
  const foregroundStyles = [globals, kinetic, cosmic, cursor].join("\n");

  assert.match(globals, /--ui-ease-snap:\s*cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
  assert.match(globals, /--ui-ease-structural:\s*cubic-bezier\(0\.76, 0, 0\.24, 1\)/);
  assert.match(globals, /--z-content:\s*10/);
  assert.match(globals, /--z-action:\s*12/);
  assert.match(globals, /--z-focus:\s*18/);
  assert.match(globals, /--z-sticky:\s*30/);
  assert.match(globals, /--z-skip:\s*100/);
  assert.match(globals, /--z-transition:\s*2147483645/);
  assert.match(globals, /-moz-osx-font-smoothing:\s*grayscale/);
  assert.match(
    globals,
    /:is\(\[data-ui-action="nav"\], \[data-ui-action="text"\]\)[\s\S]*min-height:\s*48px/,
  );
  assert.match(kinetic, /will-change:\s*transform, opacity/);
  assert.doesNotMatch(cosmic, /\):hover\s*\{\s*box-shadow:/);
  assert.doesNotMatch(
    foregroundStyles,
    /transition(?:-property)?:[^;]*(?:width|height|margin)/,
  );
  assert.doesNotMatch(kinetic, /\s(?:linear|ease-in-out|ease-out|ease)\s*[,;]/);
});

test("Celestial Titanium keeps one coherent material hierarchy with safe fallbacks", async () => {
  const [globals, components, pages, guardian] = await Promise.all([
    read("app/globals.css"),
    read("app/cosmic-components.css"),
    read("app/cosmic-pages.css"),
    read("app/performance-guardian.css"),
  ]);
  const componentMaterial = components.slice(
    components.lastIndexOf("/* Celestial Titanium"),
  );
  const pageMaterial = pages.slice(pages.lastIndexOf("/* Celestial Titanium"));
  const guardianMaterial = guardian.slice(
    guardian.lastIndexOf("/* Celestial Titanium"),
  );
  const materialStyles = [componentMaterial, pageMaterial, guardianMaterial].join("\n");

  assert.match(globals, /--titanium-smoke:\s*rgba\(/);
  assert.match(globals, /--titanium-smoke-strong:\s*rgba\(/);
  assert.match(globals, /--titanium-edge-milk:\s*rgba\(/);
  assert.match(globals, /--titanium-edge-gold:\s*rgba\(/);
  assert.match(globals, /--titanium-edge-iris:\s*rgba\(/);
  assert.match(globals, /--titanium-blur:\s*22px/);
  assert.match(globals, /--titanium-radius-control:\s*18px/);
  assert.match(globals, /--titanium-radius-card:\s*28px/);
  assert.match(globals, /--titanium-radius-panel:\s*36px/);

  assert.match(componentMaterial, /\.site-header\s*\{[\s\S]*backdrop-filter:\s*blur\(var\(--titanium-blur\)\)/);
  assert.match(componentMaterial, /\.catalog-card\s*\{[\s\S]*var\(--titanium-radius-card\)/);
  assert.match(componentMaterial, /\.primary-nav ul\s*\{[\s\S]*backdrop-filter:\s*none/);
  assert.match(pageMaterial, /\.reading-chambers \.reading-tier/);
  assert.match(pageMaterial, /\.artifact-scene \.book-cover/);
  assert.match(pageMaterial, /\.artifact-scene \.book-purchase/);
  assert.match(pageMaterial, /\.celestial-gateways \.purchase-link/);
  assert.match(guardianMaterial, /\.performance-guardian-offer\s*\{[\s\S]*backdrop-filter:\s*blur\(var\(--titanium-blur\)\)/);
  assert.match(guardianMaterial, /\.performance-guardian-switch\s*\{[\s\S]*backdrop-filter:\s*none/);

  assert.match(materialStyles, /@media \(max-width:\s*720px\)/);
  assert.match(materialStyles, /data-performance-mode="lite"/);
  assert.match(materialStyles, /\.kinetic-save-data/);
  assert.match(materialStyles, /@media \(forced-colors:\s*active\)/);
  assert.match(materialStyles, /outline:\s*2px solid var\(--ui-focus\)/);
  assert.match(materialStyles, /translate3d\(0, -2px, 0\) scale\(1\.01\)/);
  assert.match(materialStyles, /translate3d\(0, 0, 0\) scale\(0\.985\)/);
  assert.doesNotMatch(
    materialStyles,
    /transition(?:-property)?:[^;]*(?:width|height|margin)/,
  );
  assert.doesNotMatch(
    materialStyles,
    /\s(?:linear|ease-in-out|ease-out|ease)\s*[,;]/,
  );
});

test("Atlas state rebinds by route and cannot strand legacy reveal copy", async () => {
  const [motion, stageCss] = await Promise.all([
    read("components/site/cosmic-motion.tsx"),
    read("app/cinematic-stage.css"),
  ]);

  assert.match(motion, /const pathname = usePathname\(\)/);
  assert.match(motion, /\[capabilityVersion, mode, pathname, ready\]/);
  assert.match(motion, /scenes\.forEach\(\(scene\) => scene\.setAttribute\("data-journey-state", "static"\)\)/);
  assert.match(motion, /JOURNEY_VARIABLES\.forEach/);
  assert.doesNotMatch(motion, /IntersectionObserver|pendingRevealTargets|revealObserver/);
  assert.match(stageCss, /\.journey-scene \[data-reveal\][\s\S]*visibility:\s*visible !important/);
});
