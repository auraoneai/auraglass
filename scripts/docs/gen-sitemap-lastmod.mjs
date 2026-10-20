#!/usr/bin/env node
// gen-sitemap-lastmod.mjs — SEO pass — 2026-10-20.
// Writes apps/docs/lib/seo/route-lastmod.json: one git-derived lastmod
// (YYYY-MM-DD) per docs route, consumed by apps/docs/app/sitemap.ts.
//
// Route → source mapping (the files whose git history dates the page):
//   home /            apps/docs/app/page.tsx
//   markdown          the page's source .md/.mdx repoPath (lib/routes PageSpec)
//   component         the .meta.ts file (ComponentRow.file), or the page's
//                     markdown source when a content file owns the route
//   surface           registry/blocks/<name> (dir or file)
//   api               the report .md (ApiRow.report) when tracked
//   pending           apps/docs/nav.config.ts (the nav table that mints it)
//
// Usage:
//   node scripts/docs/gen-sitemap-lastmod.mjs           # write the JSON
//   node scripts/docs/gen-sitemap-lastmod.mjs --check   # drift guard: exit 1
//        when the committed JSON is stale, when its route set no longer equals
//        the real route table (buildSite + home), or when robots.ts lost the
//        AI-crawler policy / placeholder base.
//
// Same-day stability: lastmod is date-only; a source edited today but not yet
// committed dates as today, so regenerating inside the same commit keeps
// --check green after the commit lands.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
import { PUBLIC_DOCS_URL } from "./paths.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const APP_DIR = join(ROOT, "apps", "docs");
const OUT_REL = "apps/docs/lib/seo/route-lastmod.json";
const OUT = join(ROOT, OUT_REL);

const git = (args) =>
  execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
/** Raw blob bytes of a tracked path (`git show` adds no framing; no trim). */
const gitBlob = (rel) =>
  execFileSync("git", ["show", `HEAD:${rel}`], { cwd: ROOT, encoding: "utf8" });

function lastmodOf(repoPaths) {
  const dates = repoPaths.map((rel) => {
    let dirty = false;
    try {
      dirty = gitBlob(rel) !== readFileSync(join(ROOT, rel), "utf8");
    } catch {
      dirty = true; // untracked: not yet in history
    }
    if (dirty) return today();
    const iso = git(["log", "-1", "--format=%cI", "--", rel]);
    return iso ? iso.slice(0, 10) : today();
  });
  return dates.sort().at(-1);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Route → source repo paths, from the same lib/routes model the app builds with. */
async function routeSources() {
  const jiti = createJiti(import.meta.url);
  const routes = await jiti.import(join(APP_DIR, "lib", "routes.ts"));
  const site = routes.buildSite(routes.docsAppDir(APP_DIR));
  const map = new Map([["/", ["apps/docs/app/page.tsx"]]]);
  for (const page of site.pages.values()) {
    const srcs = [];
    switch (page.kind) {
      case "markdown":
        srcs.push(page.source.repoPath);
        break;
      case "component":
        if (page.source) srcs.push(page.source.repoPath);
        srcs.push(page.component.file);
        break;
      case "surface":
        srcs.push(`registry/blocks/${page.surface.name}`);
        break;
      case "api":
        if (page.report) srcs.push(page.api.report);
        srcs.push("apps/docs/nav.config.ts");
        break;
      case "pending":
        srcs.push("apps/docs/nav.config.ts");
        break;
    }
    map.set(page.route, srcs);
  }
  return { map, order: [...map.keys()].sort() };
}

async function main() {
  const check = process.argv.includes("--check");
  const { map, order } = await routeSources();
  const next = {};
  for (const route of order) next[route] = lastmodOf(map.get(route));
  const text = JSON.stringify(next, null, 2) + "\n";

  if (check) {
    const problems = [];
    if (!existsSync(OUT)) {
      problems.push(
        `${OUT_REL} is missing (run node scripts/docs/gen-sitemap-lastmod.mjs)`
      );
    } else {
      if (readFileSync(OUT, "utf8") !== text)
        problems.push(
          `${OUT_REL} is stale (run node scripts/docs/gen-sitemap-lastmod.mjs)`
        );
      const keys = Object.keys(JSON.parse(readFileSync(OUT, "utf8"))).sort();
      if (JSON.stringify(keys) !== JSON.stringify(order)) {
        problems.push(
          `${OUT_REL} route set drifted from the buildSite route table (${keys.length} vs ${order.length}) — regenerate`
        );
      }
    }
    const robots = readFileSync(join(ROOT, "apps/docs/app/robots.ts"), "utf8");
    for (const ua of [
      "GPTBot",
      "ClaudeBot",
      "PerplexityBot",
      "Google-Extended",
      "CCBot",
    ]) {
      // Quote-agnostic match: prettier may emit single or double quotes.
      if (!new RegExp(`["']${ua}["'],`).test(robots))
        problems.push(`robots.ts lost the ${ua} AI-crawler group`);
    }
    if (!robots.includes("PUBLIC_DOCS_URL"))
      problems.push(
        "robots.ts no longer derives its base from PUBLIC_DOCS_URL (swap-note drift)"
      );
    if (problems.length) {
      console.error(
        `gen-sitemap-lastmod: FAILED\n  - ${problems.join("\n  - ")}`
      );
      process.exit(1);
    }
    console.log(
      `gen-sitemap-lastmod: OK — ${order.length} routes (${PUBLIC_DOCS_URL}), committed JSON matches regeneration, robots policy intact.`
    );
    return;
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, text);
  console.log(`gen-sitemap-lastmod: wrote ${OUT_REL} (${order.length} routes)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
