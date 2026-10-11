#!/usr/bin/env node
/* scripts/docs/verify-docs-out.mjs — REQ-PLAT-99 acceptance (AC-FIN-43):
   after `next build`, apps/docs/out holds an HTML file for every nav href.
   Reads the nav the app itself emitted (out/nav.json from app/nav.json/route.ts)
   so the check uses exactly the IA that was built. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const navHrefs = (nav) => nav.flatMap((s) => s.groups.flatMap((g) => g.entries.map((e) => e.href)));

/** HTML file for a route under trailingSlash export: /a/b → a/b/index.html. */
export const htmlFor = (outDir, href) => join(outDir, ...href.split('/').filter(Boolean).map(decodeURIComponent), 'index.html');

export function verifyOut(outDir) {
  const navFile = join(outDir, 'nav.json');
  if (!existsSync(join(outDir, 'index.html'))) return { hrefs: [], missing: ['/'], error: `${outDir}/index.html missing` };
  if (!existsSync(navFile)) return { hrefs: [], missing: [], error: `${navFile} missing — app/nav.json/route.ts was not exported` };
  const { nav } = JSON.parse(readFileSync(navFile, 'utf8'));
  const hrefs = navHrefs(nav);
  const missing = hrefs.filter((h) => !existsSync(htmlFor(outDir, h)));
  return { hrefs, missing, error: null };
}

export function main(outDir = join(ROOT_DEFAULT, 'apps/docs/out')) {
  const { hrefs, missing, error } = verifyOut(outDir);
  if (error) { console.error(`verify-docs-out: ${error}`); return 1; }
  for (const m of missing) console.error(`verify-docs-out: no HTML for nav href ${m} (expected ${htmlFor(outDir, m)})`);
  if (missing.length) return 1;
  console.log(`verify-docs-out: ${hrefs.length} nav hrefs, each with an HTML file in ${outDir}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main(process.argv[2]));
