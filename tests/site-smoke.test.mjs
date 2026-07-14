import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";

const routes = ["", "tarot", "libros", "lecturas"];

test("all public catalog routes have page modules", async () => {
  await Promise.all(
    routes.map((route) =>
      access(route ? `app/${route}/page.tsx` : "app/page.tsx"),
    ),
  );
});

test("every catalog route declares a canonical URL", async () => {
  const rootLayout = await readFile("app/layout.tsx", "utf8");
  assert.match(rootLayout, /canonical:\s*["']\/["']/);

  for (const route of routes.slice(1)) {
    const routeLayout = await readFile(`app/${route}/layout.tsx`, "utf8");
    assert.match(routeLayout, new RegExp(`canonical:\\s*["']/${route}["']`));
  }
});

test("robots and sitemap expose the public catalog", async () => {
  const robots = await readFile("app/robots.ts", "utf8");
  const sitemap = await readFile("app/sitemap.ts", "utf8");

  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow:\s*["']\/["']/);

  for (const route of routes.slice(1)) {
    assert.match(sitemap, new RegExp(`\\$\\{siteUrl\\}/${route}`));
  }
});

test("confirmed contact and marketplace destinations remain wired", async () => {
  const siteData = await readFile("lib/site-data.ts", "utf8");

  assert.match(siteData, /WHATSAPP_NUMBER\s*=\s*["']51919623379["']/);
  assert.match(siteData, /instagram\.com\/esoterica\.cix/);
  assert.match(siteData, /tiktok\.com\/@esoterica\.cix/);
  assert.match(siteData, /amazon\.com\/dp\/B0F2629VPZ/);
  assert.match(siteData, /hotmart\.com\/es\/marketplace\/productos/);
});

test("the project uses pnpm as its single package manager", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.match(packageJson.packageManager, /^pnpm@/);
  await access("pnpm-lock.yaml");
  await assert.rejects(access("package-lock.json"));
});

test("monthly accompaniment is presented without automatic billing claims", async () => {
  const readings = await readFile("app/lecturas/page.tsx", "utf8");

  assert.match(readings, /S\/55/);
  assert.match(readings, /No hay cobro ni renovación\s+automática/);
  assert.match(readings, /monthlySupportUrl/);
});

test("foreground actions share one accessible interaction contract", async () => {
  const actionLink = await readFile("components/ui/action-link.tsx", "utf8");
  const motion = await readFile("components/site/cosmic-motion.tsx", "utf8");
  const components = await readFile("app/cosmic-components.css", "utf8");

  assert.match(actionLink, /data-ui-action/);
  assert.match(actionLink, /data-cursor-label/);
  assert.match(actionLink, /noopener noreferrer/);
  assert.match(motion, /\[data-ui-action\]/);
  assert.doesNotMatch(motion, /KINETIC_CONTROL_SELECTOR\s*=\s*["']a\[href\]/);
  assert.match(components, /min-height:\s*48px/);
  assert.match(components, /\[data-ui-action\]:focus-visible/);
  assert.match(components, /--ui-duration-fast/);
});

test("astral actions use continuous orbital glass and compositor-only kinetics", async () => {
  const pageStyles = await readFile("app/cosmic-pages.css", "utf8");
  const kineticStyles = await readFile("app/kinetic-ui.css", "utf8");
  const astralStyles = pageStyles.slice(
    pageStyles.indexOf("/* Orbital glass controls"),
    pageStyles.indexOf("/* Eclipse gate"),
  );
  const kineticControls = kineticStyles.slice(
    kineticStyles.indexOf(".kinetic-enabled .is-kinetic-control.is-kinetic-active"),
    kineticStyles.indexOf(".is-kinetic-card"),
  );
  const astralBase = astralStyles.match(
    /\.button\.astral-button\[data-ui-action\]\s*\{([^}]*)\}/,
  )?.[1];

  assert.ok(astralBase, "expected a scoped astral button base");
  assert.match(astralStyles, /\.button\.astral-button\[data-ui-action\]/);
  assert.match(astralStyles, /min-height:\s*60px/);
  assert.match(astralStyles, /border-radius:\s*999px/);
  assert.match(astralStyles, /clip-path:\s*none/);
  assert.doesNotMatch(astralStyles, /backdrop-filter/);
  assert.match(astralStyles, /grid-template-columns:\s*minmax\(0,\s*auto\)\s+1\.5rem/);
  assert.match(astralStyles, /z-index:\s*var\(--z-action\)/);
  assert.match(astralStyles, /pointer-events:\s*auto/);
  assert.doesNotMatch(
    astralBase,
    /\b(?:font-family|font-size|font-weight|letter-spacing|line-height)\s*:/,
  );
  assert.match(
    astralStyles,
    /\.button\.astral-button\[data-ui-action\]::before,\s*\.button\.astral-button\[data-ui-action\]::after\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*rotate:\s*none;[^}]*scale:\s*none;[^}]*translate:\s*none;/,
  );
  assert.match(
    astralStyles,
    /\.button\.astral-button\.button-primary\[data-ui-action="primary"\]/,
  );
  assert.match(
    astralStyles,
    /\.button\.astral-button\.button-secondary\[data-ui-action="secondary"\]/,
  );
  assert.match(astralStyles, /--ui-duration-fast,\s*320ms/);
  assert.match(astralStyles, /--ui-duration-medium,\s*520ms/);
  assert.match(
    astralStyles,
    /cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/,
  );
  assert.match(astralStyles, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(astralStyles, /@media \(forced-colors:\s*active\)/);
  assert.doesNotMatch(
    pageStyles,
    /\.astral-button\s*\{[^}]*clip-path:\s*polygon/,
  );
  assert.doesNotMatch(
    astralStyles,
    /transition(?:-[\w-]+)?:[^;]*\b(?:width|height|margin|box-shadow|background-color|border-color|color|filter)\b/,
  );
  assert.match(
    kineticControls,
    /translate var\(--ui-duration-fast,[^;]*transform var\(--ui-duration-fast,[^;]*opacity var\(--ui-duration-fast,/,
  );
  assert.match(
    kineticControls,
    /translate var\(--ui-duration-medium,[^;]*transform var\(--ui-duration-medium,[^;]*opacity var\(--ui-duration-medium,/,
  );
  assert.doesNotMatch(
    kineticControls,
    /\b(?:box-shadow|background-color|border-color|color|filter)\b/,
  );
});

test("readings eclipse CTA keeps scoped premium anatomy and route semantics", async () => {
  const home = await readFile("app/page.tsx", "utf8");
  const pageStyles = await readFile("app/cosmic-pages.css", "utf8");
  const eclipseCta = home.match(
    /<ActionLink\s+className="[^"]*\beclipse-cta\b[^"]*"[\s\S]*?<\/ActionLink>/,
  )?.[0];
  const eclipseStyles = pageStyles.slice(
    pageStyles.indexOf("/* Eclipse gate"),
  );

  assert.ok(eclipseCta, "expected one scoped eclipse CTA on homepage");
  assert.match(eclipseCta, /href="\/lecturas"/);
  assert.match(eclipseCta, /intent="primary"/);
  assert.match(eclipseCta, /cursorLabel="Ver lecturas"/);
  assert.doesNotMatch(eclipseCta, /\bastral-button\b/);
  assert.match(
    eclipseCta,
    /className="eclipse-cta__label">Ver opciones y precios<\/span>/,
  );
  assert.match(
    eclipseCta,
    /className="eclipse-cta__orbit" aria-hidden="true"/,
  );
  assert.match(eclipseCta, /<CelestialGlyph kind="eclipse" \/>/);
  assert.equal((home.match(/\beclipse-cta\b/g) ?? []).length, 1);
  assert.match(
    eclipseStyles,
    /\.button\.eclipse-cta\[data-ui-action="primary"\]/,
  );
  assert.match(
    eclipseStyles,
    /--eclipse-duration:\s*var\(--ui-duration-medium,\s*520ms\)/,
  );
  assert.match(
    eclipseStyles,
    /--ui-ease-snap,\s*cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/,
  );
  assert.match(
    eclipseStyles,
    /--eclipse-duration:\s*var\(--ui-duration-fast,\s*320ms\)/,
  );
  assert.match(eclipseStyles, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(eclipseStyles, /@media \(forced-colors:\s*active\)/);
  assert.doesNotMatch(eclipseStyles, /cubic-bezier\(0\.76,/);
  assert.doesNotMatch(
    eclipseStyles,
    /transition(?:-[\w-]+)?:[^;]*\b(?:width|height|margin)\b/,
  );
  assert.doesNotMatch(
    eclipseStyles,
    /transition(?:-[\w-]+)?:[^;]*\b(?:box-shadow|background-color|border-color|color|filter)\b/,
  );
  assert.match(
    eclipseStyles,
    /\.kinetic-enabled \.button\.eclipse-cta\.is-kinetic-control\[data-ui-action="primary"\]\s*\{[^}]*translate var\(--eclipse-duration,[^}]*transform var\(--eclipse-duration,[^}]*opacity var\(--eclipse-duration,/,
  );
  assert.match(
    eclipseStyles,
    /\.button\.eclipse-cta\[data-ui-action="primary"\]::before,\s*\.button\.eclipse-cta\[data-ui-action="primary"\]::after\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*rotate:\s*none;[^}]*scale:\s*none;[^}]*translate:\s*none;/,
  );
});

test("catalog focal metadata and book reveals preserve readable content", async () => {
  const catalogCard = await readFile("components/site/catalog-card.tsx", "utf8");
  const siteData = await readFile("lib/site-data.ts", "utf8");
  const books = await readFile("app/libros/page.tsx", "utf8");

  assert.match(siteData, /imagePosition\?:\s*string/);
  assert.match(siteData, /imageScale\?:\s*number/);
  assert.equal((siteData.match(/imagePosition:/g) ?? []).length, 7);
  assert.match(catalogCard, /--catalog-image-position/);
  assert.match(catalogCard, /--catalog-image-scale/);
  assert.match(catalogCard, /catalog-card-action/);
  assert.doesNotMatch(books, /className="book-copy"\s+data-reveal/);
  assert.match(books, /className="book-copy-intro"\s+data-reveal/);
  assert.match(books, /className="book-purchase[^"]*"\s+data-reveal/);
});
