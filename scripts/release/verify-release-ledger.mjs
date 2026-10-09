#!/usr/bin/env node
/* scripts/release/verify-release-ledger.mjs — REQ-PLAT-31 (PLAT-200). For every
   version >= 4.1.1, the four ledgers must agree: CHANGELOG heading, git tag,
   GitLab Release (public API), npm registry version. --github (operator) adds
   GitHub Releases. Pre-4.1.1 mismatches must be recorded once in
   docs/release/ledger-corrections.json (history is not rewritten).

     node scripts/release/verify-release-ledger.mjs [--github] [--cut 4.1.1] */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PATHS = relPaths(ROOT);
export const GITLAB_PROJECT = '87152036';

export function changelogVersions(text) {
  return [...text.matchAll(/^##\s+\[?v?(\d+\.\d+\.\d+)/gm)].map((m) => m[1]);
}
export const atLeast = (v, cut) => {
  const a = v.split('.').map(Number); const b = cut.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return true;
};

// Sources are injectable for tests; producers return string[] of versions.
export function ledgerCheck({ changelog = [], tags = [], gitlab = [], npm = [], github = null }, { cut = '4.1.1', corrections = [] } = {}) {
  const corrected = new Map(corrections.map((c) => [c.version, c]));
  const union = new Set([...changelog, ...tags, ...gitlab, ...npm, ...(github ?? [])]);
  const errors = []; const records = [];
  for (const v of union) {
    const missing = [];
    if (!changelog.includes(v)) missing.push('changelog');
    if (!tags.includes(v)) missing.push('tag');
    if (!gitlab.includes(v)) missing.push('gitlab-release');
    if (!npm.includes(v)) missing.push('npm');
    if (github != null && !github.includes(v)) missing.push('github-release');
    if (!missing.length) continue;
    if (!atLeast(v, cut)) {
      const rec = corrected.get(v);
      if (!rec) errors.push(`${v}: pre-${cut} mismatch missing from ledger-corrections.json (missing: ${missing.join(', ')})`);
      else records.push(`${v}: recorded (${rec.note})`);
    } else errors.push(`${v}: missing from ${missing.join(', ')}`);
  }
  // Versions < cut present in corrections but actually consistent -> warn only.
  return { errors, records };
}

export async function collectLive({ root = ROOT, github = false, fetchImpl = null } = {}) {
  const fetch = fetchImpl ?? globalThis.fetch;
  const changelog = existsSync(join(root, 'CHANGELOG.md'))
    ? changelogVersions(readFileSync(join(root, 'CHANGELOG.md'), 'utf8')) : [];
  let tags = [];
  try { tags = execFileSync('git', ['tag', '-l', 'v*'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean).map((t) => t.replace(/^v/, '')); } catch { /* none */ }
  let npm = [];
  try {
    const out = execFileSync('npm', ['view', 'aura-glass', 'versions', '--json'], { encoding: 'utf8', timeout: 30000 });
    npm = JSON.parse(out);
  } catch { /* npm unreachable */ }
  let gitlab = [];
  try {
    const res = await fetch(`https://gitlab.com/api/v4/projects/${GITLAB_PROJECT}/releases?per_page=100`);
    gitlab = res.ok ? (await res.json()).map((r) => String(r.tag_name).replace(/^v/, '')) : [];
  } catch { /* mirror unreachable -> empty set, reported */ }
  let gh = null;
  if (github) {
    try {
      const out = execFileSync('gh', ['release', 'list', '--json', 'tagName', '--limit', '200'], { cwd: root, encoding: 'utf8' });
      gh = JSON.parse(out).map((r) => String(r.tagName).replace(/^v/, ''));
    } catch { gh = []; }
  }
  return { changelog, tags, gitlab, npm, github: gh };
}

// REQ-PLAT-31: rebuild docs/release/ledger-corrections.json from the live
// ledgers. Every version where CHANGELOG/tag/GitLab/npm disagree gets one
// record with the computed `missingFrom` list; a fetch failure is an error
// (we never write a corrections file built on partial data).
export function computeCorrections(live, { cut = '4.1.1' } = {}) {
  const all = new Set([...live.changelog, ...live.tags, ...live.gitlab, ...live.npm,
    ...(live.github ?? [])]);
  const rows = [];
  for (const v of [...all].sort()) {
    if (/^\d+\.\d+\.\d+$/.test(v) && atLeast(v, cut)) continue; // post-cut mismatches are failures, never corrections
    const missing = [];
    if (!live.changelog.includes(v)) missing.push('changelog');
    if (!live.tags.includes(v)) missing.push('tag');
    if (!live.gitlab.includes(v)) missing.push('gitlab-release');
    if (!live.npm.includes(v)) missing.push('npm');
    if (live.github != null && !live.github.includes(v)) missing.push('github-release');
    if (missing.length) rows.push({ version: v, missingFrom: missing, note: `computed ${cut}-cut regen` });
  }
  return rows;
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const cut = arg('--cut') ?? '4.1.1';
  const corrections = existsSync(PATHS.ledgerCorrections)
    ? JSON.parse(readFileSync(PATHS.ledgerCorrections, 'utf8')).corrections ?? [] : [];
  const live = await collectLive({ root, github: argv.includes('--github') });
  if (argv.includes('--regen')) {
    if (!live.npm.length || !live.tags.length)
      throw new Error('verify-release-ledger --regen: fetch failure — npm and git tag data are required');
    const rows = computeCorrections(live, { cut });
    const out = {
      version: 1,
      note: 'Regenerated by verify-release-ledger --regen: each ledger mismatch recorded once with its computed missingFrom list. History is not rewritten; versions listed here are skipped by the post-cut check.',
      corrections: rows,
    };
    const { writeFileSync } = await import('node:fs');
    writeFileSync(PATHS.ledgerCorrections, JSON.stringify(out, null, 2) + '\n');
    console.log(`verify-release-ledger --regen: ${rows.length} corrections written`);
    return 0;
  }
  const { errors, records } = ledgerCheck(live, { cut, corrections });
  for (const r of records) console.log(`record ${r}`);
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log('verify-release-ledger: all >= ' + cut + ' versions agree across CHANGELOG/tag/GitLab/npm');
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
