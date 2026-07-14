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

  assert.match(frame, /className="site-shell site-interface"/);
  assert.match(frame, /data-interface-layer="foreground"/);
  assert.match(frame, /data-interface-route=\{activePath\}/);
  assert.match(frame, /data-interface-plane="content"/);
  assert.match(globals, /\.site-interface[\s\S]*z-index:\s*var\(--z-content\)/);
  assert.match(globals, /html\[data-scroll-engine="lenis"\][\s\S]*scroll-behavior:\s*auto/);
});

test("Oracle Observatory stages one sticky specimen and static-safe chapters per route", async () => {
  const [frame, hero, heading, home, tarot, books, readings, pages, choreography] =
    await Promise.all([
      read("components/site/site-frame.tsx"),
      read("components/site/page-hero.tsx"),
      read("components/site/section-heading.tsx"),
      read("app/page.tsx"),
      read("app/tarot/page.tsx"),
      read("app/libros/page.tsx"),
      read("app/lecturas/page.tsx"),
      read("app/cosmic-pages.css"),
      read("app/galaxy-choreography.css"),
    ]);

  assert.doesNotMatch(frame, /className="observatory-hud"/);
  assert.match(hero, /data-observatory-chapter="arrival"/);
  assert.match(hero, /<span>Llegada · 00<\/span>/);
  assert.match(hero, /<strong>UMBRAL<\/strong>/);
  assert.match(heading, /chapterWord\?:\s*string/);
  assert.match(heading, /data-observatory-chapter=/);

  for (const route of [home, tarot, books, readings]) {
    assert.equal((route.match(/\bobservatory-sticky-stage\b/g) ?? []).length, 1);
    assert.match(route, /\bobservatory-portal\b/);
    assert.match(route, /<strong>CONVERSEMOS<\/strong>/);
  }

  assert.match(home, /chapterWord="ARCANO"/);
  assert.match(home, /chapterWord="ELIGE"/);
  assert.match(home, /chapterWord="CLARIDAD"/);
  assert.match(tarot, /chapterWord="ARCANO"/);
  assert.equal((tarot.match(/data-observatory-phase=/g) ?? []).length, 1);
  assert.match(tarot, /index < 2 \? "specimen" : index < 4 \? "choice" : "clarity"/);
  assert.match(books, /<strong>LIBRO<\/strong>/);
  assert.ok(books.indexOf("<strong>ELIGE</strong>") < books.indexOf("<strong>CLARIDAD</strong>"));
  assert.match(readings, /chapterWord="LECTURA"/);

  assert.match(pages, /min-height:\s*var\(--observatory-portal-height\)/);
  assert.match(pages, /min-height:\s*70svh/);
  assert.match(pages, /\.orbital-categories\.observatory-choice[\s\S]*overflow:\s*clip/);
  assert.match(pages, /@media \(max-width:\s*900px\)[\s\S]*\.observatory-sticky-stage[\s\S]*position:\s*relative/);
  assert.match(pages, /data-performance-mode="lite"[\s\S]*\.observatory-sticky-stage/);
  assert.match(pages, /\.observatory-portal::after[\s\S]*var\(--finale-p/);
  assert.match(choreography, /\[data-observatory-chapter\]/);
  assert.doesNotMatch(
    choreography,
    /transition(?:-property)?:[^;]*(?:clip-path|filter|box-shadow|border-color|width|height|margin)/,
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

test("cosmic reveal observers rebind by route and cannot strand mobile copy", async () => {
  const motion = await read("components/site/cosmic-motion.tsx");

  assert.match(motion, /const pathname = usePathname\(\)/);
  assert.match(motion, /\}, \[mode, pathname, ready\]\)/);
  assert.match(motion, /if \(!ready \|\| mode === "lite"\)/);
  assert.match(motion, /pendingRevealTargets = new Set<HTMLElement>\(\)/);
  assert.match(motion, /pendingRevealTargets\.forEach/);
  assert.match(motion, /rect\.bottom > 0 && rect\.top < window\.innerHeight \* 0\.98/);
  assert.match(motion, /pendingRevealTargets\.delete\(target\)/);
  assert.match(motion, /revealObserver\?\.unobserve\(target\)/);
  assert.match(motion, /rootMargin: "0px 0px 12% 0px", threshold: 0\.01/);
});
