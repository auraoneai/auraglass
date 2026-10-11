#!/usr/bin/env node
/* scripts/release/verify-breaking-register.mjs — REQ-PLAT-29/62 (PLAT-194).
   Fails unless every B-id in docs/release/breaking-changes.json is referenced by
   >= 1 fragment entry (B1, B2, B13 via notice entries of kind peer|engine|
   behavior with codemod null) and has a `#b-<n>` anchor in the generated
   migration guide. `--coverage` writes .artifacts/plat/deprecation-coverage.json
   classifying every 4.x name renamed or removed in 5.0 — every fragment entry
   plus every export/subpath missing from the head snapshot versus the newest
   published 4.x tarball's snapshot — as covered|uncovered (REQ-PLAT-28/62,
   rules in scripts/release/lib/deprecation-coverage.mjs). Published versions
   and their packed deprecations.json are read with `npm view` / `npm pack`
   (or offline from --published-dir). Uncovered removals are reported and do
   not fail the run, except with --ga (alias --require-covered: the 5.0 GA tag
   pipeline), which exits 1 on any uncovered removal. Line-neutral.

     node scripts/release/verify-breaking-register.mjs [--guide <md>] [--coverage]
       [--allowlist <json>] [--published-dir <dir>] [--base-snapshot <json>]
       [--head-snapshot <json>] [--out <json>] [--ga|--require-covered] */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';
import { coverage as removalCoverage, dirRegistry, npmRegistry, snapshotRemovals } from './lib/deprecation-coverage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const NOTICE_KINDS = new Set(['peer', 'engine', 'behavior']);
const NOTICE_B = new Set(['B1', 'B2', 'B13']);

export function anchorsOf(guideText) {
  return new Set([...guideText.matchAll(/id="(b-\d+|dep-dep-[pmcsq]\d+)"/g)].map((m) => m[1]));
}

export function checkRegister(items, entries, guideText) {
  const errors = [];
  const anchors = guideText == null ? null : anchorsOf(guideText);
  for (const item of items) {
    const refs = entries.filter((e) => e.breaking === item.id);
    if (!refs.length) errors.push(`${item.id}: not referenced by any deprecation entry`);
    else if (NOTICE_B.has(item.id)) {
      const notice = refs.find((e) => NOTICE_KINDS.has(e.kind) && e.codemod == null);
      if (!notice) errors.push(`${item.id}: notice B-id needs a kind peer|engine|behavior entry with codemod null`);
    }
    if (anchors != null && !anchors.has(`b-${item.id.slice(1)}`)) {
      errors.push(`${item.id}: no #b-${item.id.slice(1)} anchor in the generated migration guide`);
    }
  }
  return errors;
}

// Coverage (REQ-PLAT-28/62). The allowlist only applies to entries with
// `exception` set; `since` must be a published 4.x minor >= 4.2.0 whose packed
// deprecations.json carries the id.
export function coverage(entries, { registry, allowlist = new Set(), removals = [], ga = false } = {}) {
  return { ...removalCoverage({ entries, removals, registry, allowlist }), ga };
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const PATHS = relPaths(root);
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const has = (f) => argv.includes(f);
  const register = JSON.parse(readFileSync(arg('--register') ?? PATHS.breakingRegister, 'utf8'));
  const guidePath = arg('--guide') ?? PATHS.docsMigrationOut;
  const guideText = existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : null;
  const { loadEntries } = await import('./gen-deprecations.mjs');
  const entries = await loadEntries(root);

  const errors = checkRegister(register.items ?? register.changes ?? [], entries, guideText);
  if (guideText == null) errors.push(`generated migration guide missing at ${guidePath} (run gen-deprecations --docs)`);

  if (has('--coverage')) {
    const allowPath = arg('--allowlist') ?? PATHS.exceptionAllowlist;
    const allowlist = new Set(existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, 'utf8')).allowlist ?? [] : []);
    const pdir = arg('--published-dir');
    const registry = pdir ? dirRegistry(pdir) : npmRegistry();
    const readSnap = (p) => JSON.parse(readFileSync(p, 'utf8'));
    const baseSnap = arg('--base-snapshot'); const headSnap = arg('--head-snapshot');
    if (Boolean(baseSnap) !== Boolean(headSnap)) errors.push('--base-snapshot and --head-snapshot must be passed together');
    const removals = baseSnap && headSnap ? snapshotRemovals(readSnap(baseSnap), readSnap(headSnap)) : [];
    const ga = has('--ga') || has('--require-covered');
    const cov = { ...coverage(entries, { registry, allowlist, removals, ga }), newestPublished4x: registry.newest4x() };
    const out = arg('--out') ?? PATHS.deprecationCoverage;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify(cov, null, 2)}\n`);
    console.log(`coverage: ${cov.total} removal(s), ${cov.uncoveredCount} uncovered (newest published 4.x: ${cov.newestPublished4x ?? 'none'}) -> ${out}`);
    if (ga && cov.uncoveredCount) errors.push(`${cov.uncoveredCount} removal(s) without a deprecation shipped in a published 4.x minor >= 4.2.0 (G-07)`);
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log(`verify-breaking-register: ${(register.items ?? register.changes ?? []).length} B-ids covered`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
