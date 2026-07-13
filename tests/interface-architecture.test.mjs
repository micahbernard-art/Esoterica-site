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
  assert.match(globals, /\.site-interface[\s\S]*z-index:\s*10/);
  assert.match(globals, /html\[data-scroll-engine="lenis"\][\s\S]*scroll-behavior:\s*auto/);
});
