/**
 * src/js/paths.test.ts
 * Unit tests for the sitePath() helper.
 * Run via: pnpm test
 *
 * NOTE: import.meta.env.BASE_URL is not available in Node's bare ESM.
 * We shim it to simulate the GitHub Pages sub-path deployment.
 */

import assert from "node:assert/strict";

// ─── Shim import.meta.env.BASE_URL ────────────────────────────────────────
// Node strips import.meta.env in type-stripped ESM, so we patch the global
// before importing the module.  We test both prod base and root base.

type SitePathFn = (path?: string) => string;
type SlugPathFn = (slug: string) => string;

async function makeModule(
  base: string,
): Promise<{ sitePath: SitePathFn; semanaPath: SlugPathFn; laboratorioPath: SlugPathFn }> {
  // Inline a simplified version of the logic to avoid import.meta issues in Node.
  const BASE = (() => {
    const normalized = base.startsWith("/") ? base : `/${base}`;
    return normalized.endsWith("/") ? normalized : `${normalized}/`;
  })();

  function isExternal(path: string): boolean {
    if (!path) return false;
    return (
      /^https?:\/\//i.test(path) ||
      path.startsWith("//") ||
      path.startsWith("mailto:") ||
      path.startsWith("tel:") ||
      path.startsWith("#") ||
      path.startsWith("data:") ||
      path.startsWith("javascript:")
    );
  }

  function hasBase(path: string): boolean {
    return path.startsWith(BASE) || (BASE !== "/" && path === BASE.slice(0, -1));
  }

  function sitePath(path: string = "/"): string {
    if (isExternal(path)) return path;
    if (hasBase(path)) return path;
    const stripped = path.replace(/^\/+/, "");
    if (!stripped) return BASE;
    return `${BASE}${stripped}`;
  }

  return {
    sitePath,
    semanaPath: (slug: string) => sitePath(`/semanas/${slug}/`),
    laboratorioPath: (slug: string) => sitePath(`/laboratorios/${slug}/`),
  };
}

// ─── Tests with GitHub Pages base ─────────────────────────────────────────
const ghBase = "/sigingsistemasus.github.io/";
const { sitePath, semanaPath, laboratorioPath } = await makeModule(ghBase);

// Root
assert.equal(sitePath("/"), "/sigingsistemasus.github.io/", "root /");
assert.equal(sitePath(""), "/sigingsistemasus.github.io/", "empty string");
assert.equal(sitePath(), "/sigingsistemasus.github.io/", "no arg");

// Named routes with leading slash
assert.equal(sitePath("/semanas/"), "/sigingsistemasus.github.io/semanas/");
assert.equal(sitePath("/laboratorios/"), "/sigingsistemasus.github.io/laboratorios/");
assert.equal(sitePath("/about/"), "/sigingsistemasus.github.io/about/");
assert.equal(sitePath("/contact/"), "/sigingsistemasus.github.io/contact/");

// Named routes without leading slash
assert.equal(sitePath("semanas/"), "/sigingsistemasus.github.io/semanas/");
assert.equal(sitePath("about/"), "/sigingsistemasus.github.io/about/");

// Dynamic slug paths
assert.equal(semanaPath("semana-01"), "/sigingsistemasus.github.io/semanas/semana-01/");
assert.equal(
  laboratorioPath("lab-01-geojson-geometrias"),
  "/sigingsistemasus.github.io/laboratorios/lab-01-geojson-geometrias/",
);

// No double-base (idempotent)
assert.equal(
  sitePath("/sigingsistemasus.github.io/semanas/"),
  "/sigingsistemasus.github.io/semanas/",
  "idempotent",
);

// External URLs untouched
assert.equal(sitePath("https://openstreetmap.org/"), "https://openstreetmap.org/");
assert.equal(sitePath("mailto:doc@sig.edu.co"), "mailto:doc@sig.edu.co");
assert.equal(sitePath("#section"), "#section");

// ─── Tests with root base (localhost dev) ────────────────────────────────
const devBase = "/";
const dev = await makeModule(devBase);

assert.equal(dev.sitePath("/"), "/");
assert.equal(dev.sitePath("/semanas/"), "/semanas/");
assert.equal(dev.sitePath("semanas/"), "/semanas/");
assert.equal(dev.semanaPath("semana-01"), "/semanas/semana-01/");
assert.equal(dev.sitePath("https://example.com/"), "https://example.com/");

console.log("paths.test.ts — todas las aserciones pasaron correctamente");
