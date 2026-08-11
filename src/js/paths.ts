/**
 * src/js/paths.ts
 *
 * Centralised internal-link helper for Astro + GitHub Pages deployments
 * that live under a base path (e.g. /sigingsistemasus.github.io/).
 *
 * Usage (in any .astro file frontmatter or TS module):
 *
 *   import { sitePath } from "@js/paths";
 *
 *   sitePath("/")           → /sigingsistemasus.github.io/
 *   sitePath("/semanas/")   → /sigingsistemasus.github.io/semanas/
 *   sitePath("semanas/")    → /sigingsistemasus.github.io/semanas/
 *   sitePath(`/semanas/${slug}/`) → /sigingsistemasus.github.io/semanas/semana-01/
 *
 * Rules:
 *   – Never double-prefix the base (idempotent).
 *   – Never produce double-slashes.
 *   – Works in both dev (base = "/") and production (base = "/sigingsistemasus.github.io/").
 *   – Leaves external URLs (https:// etc.), mailto:, tel:, #, and empty strings untouched.
 *   – Does NOT use window / location — safe in SSG/SSR.
 */

/** The base path with guaranteed leading and trailing slashes. */
const BASE: string = (() => {
  const raw: string = import.meta.env.BASE_URL ?? "/";
  // Ensure both leading and trailing slash
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
})();

/**
 * Returns `true` when `path` already begins with the base path,
 * preventing double-prefixing on accidental re-use.
 */
function hasBase(path: string): boolean {
  return path.startsWith(BASE) || (BASE !== "/" && path === BASE.slice(0, -1));
}

/**
 * Returns `true` when `path` should be left completely untouched:
 * external URLs, protocol-relative URLs, mailto, tel, #, data:, javascript:.
 */
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

/**
 * Prefix an internal site path with `import.meta.env.BASE_URL`.
 *
 * @param path  Internal path — with or without leading slash.
 *              "/" or "" → base root.
 * @returns     Full path including base prefix.
 */
export function sitePath(path = "/"): string {
  if (isExternal(path)) return path;
  if (hasBase(path)) return path;

  // Strip leading slashes to avoid double-slash after BASE
  const stripped = path.replace(/^\/+/, "");

  if (!stripped) return BASE;

  return `${BASE}${stripped}`;
}

/**
 * Build a semana detail URL from a slug / collection entry id.
 */
export function semanaPath(slugOrId: string): string {
  return sitePath(`/semanas/${slugOrId}/`);
}

/**
 * Build a laboratorio detail URL from a slug / collection entry id.
 */
export function laboratorioPath(slugOrId: string): string {
  return sitePath(`/laboratorios/${slugOrId}/`);
}
