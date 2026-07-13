import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (path) => readFile(path, "utf8");

test("capability assessment stays numeric and privacy safe", async () => {
  const quality = await read("lib/galaxy/quality.ts");
  const assessment =
    quality.match(/export function assessPerformanceCapabilities[\s\S]*?^}/m)?.[0] ?? "";

  assert.match(quality, /getParameter\(gl\.MAX_TEXTURE_SIZE\)/);
  assert.match(quality, /getParameter\(gl\.MAX_RENDERBUFFER_SIZE\)/);
  assert.match(quality, /Boolean\(webgl2\)/);
  assert.doesNotMatch(quality, /UNMASKED_|debug_renderer_info|getParameter\([^)]*(?:VENDOR|RENDERER)/i);
  assert.doesNotMatch(assessment, /coarse|pointer|innerWidth|userAgent/i);
});

test("static recommendations require hard limits or corroborated moderate signals", async () => {
  const quality = await read("lib/galaxy/quality.ts");

  assert.match(quality, /maxTextureSize < 4096/);
  assert.match(quality, /maxRenderbufferSize < 4096/);
  assert.match(quality, /cores <= 2/);
  assert.match(quality, /memory !== null && memory <= 2/);
  assert.match(quality, /!capabilities\.webgl2 && moderateSignalCount >= 2/);
  assert.match(quality, /recommendationReason = "device-pressure"/);
});

test("sustained pressure sampling needs two visible slow windows and never auto-switches", async () => {
  const provider = await read("components/providers/performance-provider.tsx");

  assert.match(provider, /STABILIZATION_DELAY_MS = 1_800/);
  assert.match(provider, /IGNORED_FRAME_GAP_MS = 250/);
  assert.match(provider, /REQUIRED_SLOW_WINDOWS = 2/);
  assert.match(provider, /document\.hidden/);
  assert.match(provider, /visibilitychange/);
  assert.match(provider, /slowWindowCount >= REQUIRED_SLOW_WINDOWS/);
  assert.match(provider, /if \(!slowWindow\)[\s\S]*samplingComplete = true/);
  assert.match(provider, /setRecommendationReason\("sustained-frame-pressure"\)/);
  assert.doesNotMatch(provider, /setPreferenceState\(["']lite["']\)/);
  assert.match(provider, /cancelAnimationFrame/);
  assert.match(provider, /clearTimeout/);
});

test("preference is versioned, persistent, explicit, and reversible", async () => {
  const provider = await read("components/providers/performance-provider.tsx");

  assert.match(provider, /esoterica:performance-mode:v1/);
  assert.match(provider, /"auto" \| "full" \| "lite"/);
  assert.match(provider, /localStorage\.getItem\(PERFORMANCE_PREFERENCE_KEY\)/);
  assert.match(provider, /localStorage\.setItem\(PERFORMANCE_PREFERENCE_KEY, nextPreference\)/);
  assert.match(provider, /Activar modo ligero/);
  assert.match(provider, /Mantener experiencia visual/);
  assert.match(provider, /Restaurar efectos/);
  assert.match(provider, /Automático/);
});

test("guardian publishes the integration contract and keeps the offer non-modal", async () => {
  const [provider, quality] = await Promise.all([
    read("components/providers/performance-provider.tsx"),
    read("lib/galaxy/quality.ts"),
  ]);

  assert.match(provider, /root\.dataset\.performanceMode = mode/);
  assert.match(provider, /root\.dataset\.performanceRecommendation = recommendationReason/);
  assert.match(provider, /esoterica:performance-pressure/);
  assert.match(provider, /role="region"/);
  assert.doesNotMatch(provider, /role="dialog"|aria-modal/);
  assert.match(quality, /"user-lite"/);
  assert.match(quality, /if \(options\.forceStatic\) staticReason = "user-lite"/);
});

test("guardian styling obeys kinetic and stacking guardrails", async () => {
  const styles = await read("app/performance-guardian.css");

  assert.match(styles, /z-index:\s*var\(--z-overlay\)/);
  assert.match(styles, /\.performance-guardian-layer[\s\S]*pointer-events:\s*none/);
  assert.match(styles, /\.performance-guardian-offer[\s\S]*pointer-events:\s*auto/);
  assert.match(styles, /will-change:\s*transform, opacity/);
  assert.match(styles, /var\(--ui-ease-snap\)/);
  assert.match(styles, /var\(--ui-ease-structural\)/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
  assert.match(styles, /forced-colors:\s*active/);
  assert.match(styles, /data-performance-mode="lite"/);
  assert.match(styles, /\.tarot-fan \.celestial-glyph/);
  assert.doesNotMatch(styles, /transition(?:-property)?:[^;]*(?:width|height|margin)/);
  assert.doesNotMatch(styles, /\s(?:linear|ease-in-out|ease-out|ease)\s*[,;]/);
});
