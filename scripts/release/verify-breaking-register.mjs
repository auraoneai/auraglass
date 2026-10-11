#!/usr/bin/env node
/* scripts/release/verify-breaking-register.mjs — REQ-PLAT-29/62 (PLAT-194).
   Fails unless every B-id in docs/release/breaking-changes.json is referenced by
   >= 1 fragment entry (B1, B2, B13 via notice entries of kind peer|engine|
   behavior with codemod null) and has a `#b-<n>` anchor in the generated
   migration guide. `--coverage` writes .artifacts/plat/deprecation-coverage.json
   classifying every 4.x name renamed or removed in 5.0 as covered|uncovered
   (reporting only on 4.x tags). Line-neutral.

     node scripts/release/verify-breaking-register.mjs [--guide <md>] [--coverage]
       [--allowlist <json>] [--published-dir <dir>] [--ga] */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

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

// Coverage: every 4.x name renamed or removed in 5.0 (the register's removal
// scope) is covered|uncovered by a deprecation entry shipped in a published
// 4.x minor >= 4.2.0. An allowlisted id counts as covered only when its
// entry carries an `exception` (REQ-PLAT-28 item 4).
export function coverage(entries, { published = {}, allowlist = new Set(), ga = false } = {}) {
  const rows = []; const minors = (v) => /^4\.(\d+)\.\d+$/.exec(v ?? '');
  for (const e of entries) {
    const m = minors(e.since);
    const shipped = m != null && Number(m[1]) >= 2 && (published[e.since] ?? []).includes(e.id);
    const excepted = allowlist.has(e.id) && e.exception != null;
    const status = excepted || shipped ? 'covered' : 'uncovered';
    rows.push({
      id: e.id, kind: e.kind, symbol: e.symbol, entry: e.entry,
      removeIn: e.removeIn, since: e.since, breaking: e.breaking,
      coverage: status, verifiedIn: shipped ? e.since : (excepted ? 'exception' : null),
    });
  }
  const uncovered = rows.filter((r) => r.coverage === 'uncovered');
  return { version: 1, ga, total: rows.length, uncoveredCount: uncovered.length, entries: rows };
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const has = (f) => argv.includes(f);
  const PATHS = relPaths(root);
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
    const published = {};
    const pdir = arg('--published-dir');
    if (pdir && existsSync(pdir)) {
      for (const f of readdirSync(pdir).filter((x) => x.endsWith('.json'))) {
        const j = JSON.parse(readFileSync(join(pdir, f), 'utf8'));
        published[j.version ?? f.replace('.json', '')] = (j.entries ?? []).map((e) => (typeof e === 'string' ? e : e.id));
      }
    }
    const cov = coverage(entries, { published, allowlist, ga: has('--ga') });
    mkdirSync(dirname(PATHS.deprecationCoverage), { recursive: true });
    writeFileSync(PATHS.deprecationCoverage, `${JSON.stringify(cov, null, 2)}\n`);
    console.log(`coverage: ${cov.total} entries, ${cov.uncoveredCount} uncovered -> ${PATHS.deprecationCoverage}`);
    if (has('--ga') && cov.uncoveredCount) errors.push(`${cov.uncoveredCount} entries without a deprecation shipped in a published 4.x minor >= 4.2.0 (G-07)`);
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log(`verify-breaking-register: ${(register.items ?? register.changes ?? []).length} B-ids covered`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
