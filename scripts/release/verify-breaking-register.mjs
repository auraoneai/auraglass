#!/usr/bin/env node
/* scripts/release/verify-breaking-register.mjs — REQ-PLAT-62 (4.x port).
   Two modes:
     1) register check: every B-id in docs/release/breaking-changes.json is
        referenced by >= 1 fragment entry (B1, B2, B13 via notice entries of
        kind peer|engine|behavior with codemod null) and has a #b-<n> anchor
        in the generated migration guide. Requires a --register JSON; absent
        register is an error unless --coverage-only.
     2) --coverage: writes .artifacts/plat/deprecation-coverage.json
        classifying every 4.x entry's deprecation shipped in a published
        4.x minor >= 4.2.0 as covered|uncovered.
     --coverage-only skips the register+guide checks (4.x has no generated
     guide on this line).

     node scripts/release/verify-breaking-register.mjs [--coverage] [--coverage-only]
       [--register <json>] [--guide <md>] [--allowlist <json>]
       [--published-dir <dir>] [--ga] */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PATHS = relPaths(ROOT);
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

// Coverage: every entry's deprecation shipped in a published 4.x minor >= 4.2.0
// is covered|uncovered. Exception-allowlisted ids count as covered.
export function coverage(entries, { published = {}, allowlist = new Set(), ga = false } = {}) {
  const rows = []; const minors = (v) => /^4\.(\d+)\.\d+$/.exec(v ?? '');
  for (const e of entries) {
    const m = minors(e.since);
    const shipped = m != null && Number(m[1]) >= 2 && (published[e.since] ?? []).includes(e.id);
    const status = allowlist.has(e.id) ? 'covered' : shipped ? 'covered' : 'uncovered';
    rows.push({
      id: e.id, kind: e.kind, symbol: e.symbol, entry: e.entry,
      removeIn: e.removeIn, since: e.since, breaking: e.breaking,
      coverage: status, verifiedIn: shipped ? e.since : (allowlist.has(e.id) ? 'exception' : null),
    });
  }
  const uncovered = rows.filter((r) => r.coverage === 'uncovered');
  return { version: 1, ga, total: rows.length, uncoveredCount: uncovered.length, entries: rows };
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const has = (f) => argv.includes(f);
  const errors = [];

  if (!has('--coverage-only')) {
    const registerPath = arg('--register') ?? PATHS.breakingRegister;
    if (!existsSync(registerPath)) {
      errors.push(`breaking register missing at ${registerPath}`);
    } else {
      const register = JSON.parse(readFileSync(registerPath, 'utf8'));
      const guidePath = arg('--guide') ?? PATHS.docsMigrationOut;
      const guideText = existsSync(guidePath) ? readFileSync(guidePath, 'utf8') : null;
      const { loadEntries } = await import('./gen-deprecations.mjs');
      const entries = await loadEntries(root);
      errors.push(...checkRegister(register.items ?? register.changes ?? [], entries, guideText));
      if (guideText == null) errors.push(`generated migration guide missing at ${guidePath}`);
    }
  }

  if (has('--coverage') || has('--coverage-only')) {
    const { loadEntries } = await import('./gen-deprecations.mjs');
    const entries = await loadEntries(root);
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
    if (has('--ga') && cov.uncoveredCount) errors.push(`${cov.uncoveredCount} entries without a deprecation shipped in a published 4.x minor >= 4.2.0`);
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log('verify-breaking-register: ok');
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
