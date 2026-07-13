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

test("cosmic reveal observers rebind by route and cannot strand mobile copy", async () => {
  const motion = await read("components/site/cosmic-motion.tsx");

  assert.match(motion, /const pathname = usePathname\(\)/);
  assert.match(motion, /\}, \[pathname\]\)/);
  assert.match(motion, /pendingRevealTargets = new Set<HTMLElement>\(\)/);
  assert.match(motion, /pendingRevealTargets\.forEach/);
  assert.match(motion, /rect\.bottom > 0 && rect\.top < window\.innerHeight \* 0\.98/);
  assert.match(motion, /pendingRevealTargets\.delete\(target\)/);
  assert.match(motion, /revealObserver\?\.unobserve\(target\)/);
  assert.match(motion, /rootMargin: "0px 0px 12% 0px", threshold: 0\.01/);
});
