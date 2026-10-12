#!/usr/bin/env node
/* scripts/registry/certification.mjs — REQ-PLAT-97 → REQ-PLAT-94. Turns the
   render gate's per-test records into the certification artifact that
   scripts/registry/build.mjs consumes to set meta.auraglass.certified.

   tests/dx/registry-render.spec.ts writes one record per (item, Playwright
   project) to <records>/<item>--<project>.json:
     { item, project, sha, status }   status = Playwright's final test status
   An item passes only when EVERY expected project (default: the chromium and
   webkit projects of tests/dx/registry.playwright.config.ts) recorded
   status "passed" for this exact sha (the pass flag is the conjunction of all
   assertions; a missing, failed, timed-out or foreign-sha record fails it).

   Usage: node scripts/registry/certification.mjs --records <dir> --index registry/registry.json
            --out <file> [--sha <sha>] [--projects registry-chromium,registry-webkit]
   sha defaults to CI_COMMIT_SHA (never GITHUB_SHA). Exit 0 when written (even
   if items fail: an uncertified item is omitted from the published registry,
   the build still succeeds), 64 on usage error. */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_PROJECTS = ['registry-chromium', 'registry-webkit'];
export const recordFile = (dir, item, project) => join(dir, `${item}--${project}.json`);

export function readRecords(dir) {
  if (!dir || !existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    try { return JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch { return { file: f, malformed: true }; }
  });
}

/** items: names the render gate must cover; records: per-test records. */
export function aggregate({ items, records, sha, projects = DEFAULT_PROJECTS }) {
  if (!sha) throw new Error('certification: no sha (pass --sha or set CI_COMMIT_SHA)');
  const out = { version: 1, sha, projects: [...projects], items: {} };
  for (const name of [...items].sort()) {
    const per = {};
    const reasons = [];
    for (const p of projects) {
      const r = records.find((x) => x && x.item === name && x.project === p);
      per[p] = r ? r.status : 'missing';
      if (!r) reasons.push(`${p}: no record`);
      else if (r.sha !== sha) reasons.push(`${p}: recorded for ${r.sha ?? 'no sha'}, not ${sha}`);
      else if (r.status !== 'passed') reasons.push(`${p}: ${r.status}`);
    }
    out.items[name] = { pass: reasons.length === 0, projects: per, ...(reasons.length ? { reasons } : {}) };
  }
  const malformed = records.filter((r) => r?.malformed).map((r) => r.file);
  if (malformed.length) out.malformed = malformed;
  return out;
}

/** Names certified for `sha` by a certification artifact; throws on a foreign artifact. */
export function certifiedNames(cert, sha) {
  if (!cert) return new Set();
  if (cert.version !== 1 || typeof cert.items !== 'object' || cert.items === null) throw new Error('certification artifact: unsupported shape');
  if (cert.sha !== sha) throw new Error(`certification artifact is for ${cert.sha}, the build is for ${sha}`);
  return new Set(Object.entries(cert.items).filter(([, v]) => v && v.pass === true).map(([k]) => k));
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const records = arg('--records'), index = arg('--index'), outFile = arg('--out');
  if (!records || !index || !outFile) { console.error('usage: certification.mjs --records <dir> --index <registry.json> --out <file> [--sha <sha>] [--projects a,b]'); return 64; }
  const sha = arg('--sha') ?? env.CI_COMMIT_SHA ?? null;
  const projects = arg('--projects')?.split(',').filter(Boolean) ?? DEFAULT_PROJECTS;
  const idx = JSON.parse(readFileSync(resolve(index), 'utf8'));
  const items = (idx.items ?? []).filter((i) => i.type === 'registry:block' || i.type === 'registry:item').map((i) => i.name);
  let cert;
  try { cert = aggregate({ items, records: readRecords(resolve(records)), sha, projects }); } catch (e) { console.error(String(e.message)); return 64; }
  mkdirSync(dirname(resolve(outFile)), { recursive: true });
  writeFileSync(resolve(outFile), `${JSON.stringify(cert, null, 2)}\n`);
  const pass = Object.values(cert.items).filter((v) => v.pass).length;
  console.log(`registry certification: ${pass}/${items.length} item(s) pass every project (${projects.join(', ')}) at ${sha} → ${outFile}`);
  for (const [n, v] of Object.entries(cert.items)) if (!v.pass) console.log(`  not certified ${n}: ${v.reasons.join('; ')}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
