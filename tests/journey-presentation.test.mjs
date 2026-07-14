import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(path, "utf8");

test("journey HUD is server-safe, route-stable, and tracks the six Atlas acts", async () => {
  const hud = await read("components/site/journey-hud.tsx");
  const acts = ["thesis", "specimen", "matrix", "evidence", "portal", "quiet"];

  assert.match(hud, /activePath }: \{ activePath: SitePath \}/);
  assert.match(hud, /data-journey-route=\{activePath\}/);
  assert.match(hud, /aria-label=\{`Recorrido visual de \$\{route\.label\}`\}/);
  assert.equal((hud.match(/number: "0[1-6]"/g) ?? []).length, 6);

  for (const act of acts) assert.match(hud, new RegExp(`key: "${act}"`));

  assert.match(hud, /data-hud-act=\{act\.key\}/);
  assert.match(hud, /data-hud-chapter=\{act\.key\}/);
  assert.match(hud, /aria-hidden="true"/);
  assert.doesNotMatch(hud, /"use client"|useEffect|addEventListener|requestAnimationFrame/);
  assert.doesNotMatch(hud, /<nav\b|<a\b|<button\b/);
});

test("journey thesis owns one semantic heading and one hidden typographic mirror", async () => {
  const thesis = await read("components/site/journey-thesis.tsx");

  assert.match(thesis, /as\?: "h1" \| "h2"/);
  assert.match(thesis, /as: Heading = "h2"/);
  assert.equal((thesis.match(/<Heading\b/g) ?? []).length, 1);
  assert.match(thesis, /<Heading id=\{titleId\} className="journey-thesis__title">/);
  assert.match(thesis, /className="journey-thesis__mirror" aria-hidden="true"/);
  assert.match(thesis, /description\?: string/);
  assert.match(thesis, /children\?: ReactNode/);
  assert.doesNotMatch(thesis, /"use client"|useEffect|addEventListener|requestAnimationFrame/);
});

test("Atlas presentation CSS uses continuous kinetic variables and isolated stacking", async () => {
  const css = await read("app/journey-typography.css");
  const acts = ["thesis", "specimen", "matrix", "evidence", "portal", "quiet"];

  assert.match(css, /\.journey-hud[\s\S]*z-index:\s*var\(--z-journey-rail\)/);
  assert.match(css, /\.journey-hud[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.journey-hud :is\([\s\S]*pointer-events:\s*auto/);
  assert.match(css, /opacity:\s*calc\(0\.65 \+ var\(--act-focus, 0\) \* 0\.31\)/);
  assert.match(css, /calc\(35px - var\(--act-p, 0\.5\) \* 60px\)/);
  assert.match(css, /font-size:\s*clamp\(7rem, 22vw, 19rem\)/);
  assert.match(css, /font-size:\s*clamp\(2\.4rem, 6vw, 5\.5rem\)/);
  assert.match(css, /font-size:\s*0\.62rem/);
  assert.match(css, /letter-spacing:\s*0\.18em/);
  assert.match(css, /font-size:\s*clamp\(1\.0625rem, 1\.4vw, 1\.25rem\)/);
  assert.match(css, /max-width:\s*44ch/);
  assert.match(css, /will-change:\s*transform, opacity/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(css, /data-performance-mode="lite"/);
  assert.match(css, /:focus-visible/);

  for (const act of acts) {
    assert.match(css, new RegExp(`data-journey-act="${act}"`));
    assert.match(css, new RegExp(`data-hud-act="${act}"`));
  }

  assert.doesNotMatch(
    css,
    /transition(?:-property)?:[^;]*(?:width|height|margin|clip-path|filter|box-shadow|border-color)/,
  );
  assert.doesNotMatch(css, /\s(?:linear|ease-in-out|ease-out|ease)\s*[,;]/);
  assert.doesNotMatch(css, /@keyframes|animation:/);
});
