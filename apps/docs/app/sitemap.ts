// app/sitemap.ts — SEO pass — 2026-10-20.
//
// Exact route bijection: the URL set is '/' (app/page.tsx) plus every route
// of the same lib/routes model that generates the site's pages
// (buildSite → staticParams → app/[...slug]). No route is invented and none
// is missed; a route table change flows here automatically at build time.
//
// lastmod is git-derived per route, written by the committed generator
//   node scripts/docs/gen-sitemap-lastmod.mjs   (npm run docs:sitemap)
// with a --check drift guard (npm run docs:sitemap:check) that also fails
// when the JSON's route set no longer matches this table — the guard below
// re-verifies that agreement at build time and hard-fails on drift.
//
// URLs carry a trailing slash to match `trailingSlash: true` and the static
// export layout (<route>/index.html); per-page canonicals use the same form.
// Placeholder-domain swap-note: the base comes from PUBLIC_DOCS_URL
// (scripts/docs/paths.mjs) — the GitLab Pages URL until OD-12 lands the
// custom domain; swap it there and regenerate, nothing else.
import type { MetadataRoute } from "next";
import { PUBLIC_DOCS_URL } from "../../../scripts/docs/paths.mjs";
import { buildSite, docsAppDir } from "../lib/routes";
import lastmodByRoute from "../lib/seo/route-lastmod.json";

const base = PUBLIC_DOCS_URL.endsWith("/")
  ? PUBLIC_DOCS_URL
  : `${PUBLIC_DOCS_URL}/`;

/* Static export: metadata routes must opt into force-static (same as
   app/nav.json/route.ts). */
export const dynamic = "force-static";

/** route ('/plat/introduction') → served URL with trailing slash; home is the bare base. */
const locOf = (route: string) =>
  route === "/" ? base : `${base}${route.replace(/^\//, "")}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const site = buildSite(docsAppDir());
  const routes = ["/", ...[...site.pages.keys()].sort()];

  // Build-time drift guard: the committed lastmod table must cover exactly
  // the real route set — no missing routes, no ghost routes.
  const tableRoutes = Object.keys(lastmodByRoute).sort();
  const expected = [...routes].sort();
  const missing = expected.filter((r) => !tableRoutes.includes(r));
  const ghost = tableRoutes.filter((r) => !expected.includes(r));
  if (missing.length || ghost.length) {
    throw new Error(
      `sitemap route-lastmod.json drifted from the route table — missing: [${missing.join(", ")}] ghost: [${ghost.join(", ")}] — run npm run docs:sitemap`
    );
  }

  return routes.map((route) => ({
    url: locOf(route),
    lastModified: lastmodByRoute[route as keyof typeof lastmodByRoute],
  }));
}
