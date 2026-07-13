import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(path, "utf8");

test("the astral field is a single non-interactive decorative canvas", async () => {
  const [frame, canvas, styles] = await Promise.all([
    read("components/site/site-frame.tsx"),
    read("components/site/astral-fluid-canvas.tsx"),
    read("app/fluid-canvas.css"),
  ]);

  assert.equal((frame.match(/<AstralFluidCanvas\b/g) ?? []).length, 1);
  assert.match(canvas, /aria-hidden=["']true["']/);
  assert.match(styles, /pointer-events:\s*none/);
});

test("fluid budgets stay below the approved desktop and constrained caps", async () => {
  const engine = await read("lib/fluid/engine.ts");

  assert.match(engine, /constrained\s*\?\s*48\s*:\s*64/);
  assert.match(engine, /constrained\s*\?\s*128\s*:\s*256/);
  assert.match(engine, /constrained\s*\?\s*6\s*:\s*8/);
  assert.match(engine, /constrained\s*\?\s*24\s*:\s*30/);
  assert.doesNotMatch(engine, /\b(?:bloom|sunrays|dat\.gui|ga\()\b/i);
});

test("all public routes have distinct three-color fluid palettes", async () => {
  const palettes = await read("lib/fluid/palettes.ts");

  for (const route of ["/", "/tarot", "/libros", "/lecturas"]) {
    assert.match(palettes, new RegExp(`(?:["']${route === "/" ? "\\/" : route}["']):\\s*\\[`));
  }
  assert.equal((palettes.match(/^\s{4}\[0\./gm) ?? []).length, 12);
});

test("motion layers expose accessibility and device fallbacks", async () => {
  const [canvas, fluidStyles, kinetic, kineticStyles] = await Promise.all([
    read("components/site/astral-fluid-canvas.tsx"),
    read("app/fluid-canvas.css"),
    read("components/site/cosmic-motion.tsx"),
    read("app/kinetic-ui.css"),
  ]);

  assert.match(canvas, /prefers-reduced-motion:\s*reduce/);
  assert.match(canvas, /saveData/);
  assert.match(fluidStyles, /forced-colors:\s*active/);
  assert.match(kinetic, /forced-colors:\s*active/);
  assert.match(kinetic, /pointer:\s*coarse/);
  assert.match(kineticStyles, /prefers-reduced-motion:\s*reduce/);
});

test("pausing the fluid engine stops its animation frame until resume", async () => {
  const engine = await read("lib/fluid/engine.ts");
  const pauseBody = engine.match(/pause\(\)\s*\{([\s\S]*?)\n\s*\},\n\s*queuePointer/)?.[1] ?? "";
  const resumeBody = engine.match(/resume\(\)\s*\{([\s\S]*?)\n\s*\},\n\s*setRoute/)?.[1] ?? "";

  assert.match(pauseBody, /cancelAnimationFrame/);
  assert.match(resumeBody, /requestFrame\(\)|requestAnimationFrame/);
});

test("the adapted WebGL source carries its complete MIT notice", async () => {
  await access("THIRD_PARTY_NOTICES.md");
  const [notice, engine, shaders] = await Promise.all([
    read("THIRD_PARTY_NOTICES.md"),
    read("lib/fluid/engine.ts"),
    read("lib/fluid/shaders.ts"),
  ]);

  for (const source of [notice, engine, shaders]) {
    assert.match(source, /Copyright \(c\) 2017 Pavel Dobryakov/);
    assert.match(source, /MIT License/);
    assert.match(source, /THE SOFTWARE IS PROVIDED "AS IS"/);
  }
});
