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
