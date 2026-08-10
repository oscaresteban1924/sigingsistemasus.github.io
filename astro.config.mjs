// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

/**
 * GitHub Pages
 *
 * Repository:
 * https://github.com/oscaresteban1924/sigingsistemasus.github.io
 *
 * Public URL:
 * https://oscaresteban1924.github.io/sigingsistemasus.github.io/
 */
const site = "https://oscaresteban1924.github.io";
const base = "/sigingsistemasus.github.io";

export default defineConfig({
  /**
   * Canonical production domain.
   *
   * `site` contains only the GitHub Pages host.
   * The repository path is configured separately with `base`.
   */
  site,

  /**
   * GitHub Pages publishes this repository as a project site:
   *
   * https://oscaresteban1924.github.io/sigingsistemasus.github.io/
   */
  base,

  /**
   * GitHub Pages is a static hosting service.
   *
   * All Astro routes must therefore be prerenderable.
   */
  output: "static",

  /**
   * Generate directory-style URLs:
   *
   * /about/
   * /contact/
   * /courses/
   */
  trailingSlash: "always",

  /**
   * Astro integrations.
   */
  integrations: [
    mdx(),

    sitemap({
      /**
       * Do not expose development/example or 404 pages
       * through the sitemap.
       */
      filter: (page) =>
        !page.includes("/examples/") &&
        !page.includes("/404/"),
    }),
  ],

  /**
   * Vite configuration.
   */
  vite: {
    plugins: [tailwindcss()],

    build: {
      /**
       * Keep assets as independent files instead of
       * converting small assets into inline base64 URLs.
       */
      assetsInlineLimit: 0,
    },
  },
});
