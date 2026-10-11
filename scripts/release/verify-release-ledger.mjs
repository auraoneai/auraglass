#!/usr/bin/env node
/* scripts/release/verify-release-ledger.mjs — REQ-PLAT-31 (PLAT-200). For every
   version >= 4.1.1, the four ledgers must agree: CHANGELOG heading, git tag,
   GitLab Release (public API), npm registry version. --github (operator) adds
   GitHub Releases. Pre-4.1.1 mismatches must be recorded once in
   docs/release/ledger-corrections.json (history is not rewritten); --regen
   rebuilds that file from the live sources. Any source that cannot be read
   (npm, git, GitLab via CI_JOB_TOKEN or `glab`, gh) is an error.

     node scripts/release/verify-release-ledger.mjs [--github] [--cut 4.1.1] [--regen] */
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
      // missingFrom is computed, never authored: a record that no longer matches the live
      // ledgers is stale and must be regenerated (--regen).
      else if (Array.isArray(rec.missingFrom) && [...rec.missingFrom].sort().join() !== [...missing].sort().join())
        errors.push(`${v}: ledger-corrections.json is stale (recorded missingFrom ${rec.missingFrom.join(', ') || 'none'}, live ${missing.join(', ')}); rerun --regen`);
      else records.push(`${v}: recorded (${rec.note})`);
    } else errors.push(`${v}: missing from ${missing.join(', ')}`);
  }
  // Versions < cut present in corrections but actually consistent -> warn only.
  return { errors, records };
}

// Every source is required: a fetch failure throws, it never becomes an empty
// set (an empty GitLab release list is only valid when the API answered 200).
export async function collectLive({ root = ROOT, github = false, fetchImpl = null, execImpl = execFileSync } = {}) {
  const fetch = fetchImpl ?? globalThis.fetch;
  const fail = (src, e) => { throw new Error(`verify-release-ledger: ${src} fetch failed: ${String(e?.message ?? e).split('\n')[0]}`); };
  const changelogPath = join(root, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) fail('CHANGELOG.md', 'file missing');
  const changelog = changelogVersions(readFileSync(changelogPath, 'utf8'));
  let tags;
  try { tags = execImpl('git', ['tag', '-l', 'v*'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean).map((t) => t.replace(/^v/, '')); }
  catch (e) { fail('git tag', e); }
  let npm;
  try {
    const out = JSON.parse(execImpl('npm', ['view', 'aura-glass', 'versions', '--json'], { encoding: 'utf8', timeout: 30000 }));
    // Some npm versions wrap `npm view --json` output in a one-element array.
    npm = Array.isArray(out) && out.length === 1 && Array.isArray(out[0]) ? out[0] : out;
    if (!Array.isArray(npm) || !npm.every((v) => typeof v === 'string')) throw new Error(`unexpected payload ${JSON.stringify(out).slice(0, 80)}`);
  } catch (e) { fail('npm view aura-glass versions', e); }
  // GitLab Releases: the project is private, so the API needs a credential.
  // In CI the job token of the tag pipeline is used; on an operator machine
  // the existing `glab` login (`glab api --paginate`).
  let gitlab = [];
  try {
    const token = process.env.CI_JOB_TOKEN;
    const api = process.env.CI_API_V4_URL ?? 'https://gitlab.com/api/v4';
    if (token) {
      for (let page = 1; ; page++) {
        const res = await fetch(`${api}/projects/${GITLAB_PROJECT}/releases?per_page=100&page=${page}`,
          { headers: { 'JOB-TOKEN': token } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        if (!Array.isArray(rows)) throw new Error('unexpected payload');
        gitlab.push(...rows.map((r) => String(r.tag_name).replace(/^v/, '')));
        if (rows.length < 100) break;
      }
    } else {
      const rows = JSON.parse(execImpl('glab', ['api', `projects/${GITLAB_PROJECT}/releases`, '--paginate'],
        { cwd: root, encoding: 'utf8', timeout: 60000 }));
      if (!Array.isArray(rows)) throw new Error('unexpected payload');
      gitlab = rows.map((r) => String(r.tag_name).replace(/^v/, ''));
    }
  } catch (e) { fail(`GitLab releases (project ${GITLAB_PROJECT})`, e); }
  let gh = null;
  if (github) {
    try {
      const out = execImpl('gh', ['release', 'list', '--json', 'tagName', '--limit', '1000'], { cwd: root, encoding: 'utf8' });
      gh = JSON.parse(out).map((r) => String(r.tagName).replace(/^v/, ''));
    } catch (e) { fail('gh release list', e); }
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
  const key = (v) => v.split(/[.-]/).map((p) => (/^\d+$/.test(p) ? p.padStart(6, '0') : p)).join('.');
  for (const v of [...all].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0))) {
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

export async function main(argv = process.argv.slice(2), { root = ROOT, fetchImpl = null, execImpl = execFileSync, write = true } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const cut = arg('--cut') ?? '4.1.1';
  const correctionsPath = join(root, 'docs/release/ledger-corrections.json');
  const corrections = existsSync(correctionsPath)
    ? JSON.parse(readFileSync(correctionsPath, 'utf8')).corrections ?? [] : [];
  const live = await collectLive({ root, github: argv.includes('--github'), fetchImpl, execImpl });
  if (argv.includes('--regen')) {
    const rows = computeCorrections(live, { cut });
    const out = {
      version: 1,
      note: 'Regenerated by verify-release-ledger --regen: each ledger mismatch recorded once with its computed missingFrom list. History is not rewritten; versions listed here are skipped by the post-cut check.',
      generatedAt: new Date().toISOString(),
      cut,
      sources: { changelog: live.changelog.length, tags: live.tags.length, gitlabReleases: live.gitlab.length,
        npm: live.npm.length, ...(live.github ? { githubReleases: live.github.length } : {}) },
      corrections: rows,
    };
    if (write) {
      const { writeFileSync } = await import('node:fs');
      writeFileSync(correctionsPath, JSON.stringify(out, null, 2) + '\n');
    }
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
