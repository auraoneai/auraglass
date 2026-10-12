#!/usr/bin/env node
/* scripts/release/verify-release-ledger.mjs — REQ-PLAT-31 (PLAT-200). For every
   version >= 4.1.1, the four ledgers must agree: CHANGELOG heading, git tag,
   GitLab Release (project API), npm registry version. --github (operator) adds
   GitHub Releases. Pre-4.1.1 mismatches must be recorded once in
   docs/release/ledger-corrections.json (history is not rewritten).

   Every source is fetched live and a fetch failure is an ERROR (exit 1), never
   an empty set: an unreachable registry or a 404 from a private GitLab project
   must not look like "this version was never released".

   GitLab auth (project 87152036 is private): CI_JOB_TOKEN (JOB-TOKEN header)
   or GITLAB_TOKEN (PRIVATE-TOKEN header) when set; otherwise the existing
   `glab api` CLI session. No token is read from or written to disk here.

     node scripts/release/verify-release-ledger.mjs [--github] [--cut 4.1.1] [--regen] */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { relPaths } from './lib/policy.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
export const GITLAB_PROJECT = '87152036';
export const SOURCES = ['changelog', 'tag', 'gitlab-release', 'npm', 'github-release'];

export class LedgerFetchError extends Error {
  constructor(source, cause) {
    super(`verify-release-ledger: ${source} fetch failed — ${cause?.message ?? cause}`);
    this.name = 'LedgerFetchError';
    this.source = source;
  }
}

export function changelogVersions(text) {
  return [...text.matchAll(/^##\s+\[?v?(\d+\.\d+\.\d+)/gm)].map((m) => m[1]);
}
export const atLeast = (v, cut) => {
  const a = v.split('.').map(Number); const b = cut.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return true;
};
// Numeric version order; non-numeric parts (e.g. a `v2.16` tag) sort as 0.
export const compareVersions = (x, y) => {
  const a = x.split('.').map((n) => Number(n) || 0); const b = y.split('.').map((n) => Number(n) || 0);
  for (let i = 0; i < Math.max(a.length, b.length); i++) if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) - (b[i] ?? 0);
  return x.localeCompare(y);
};

function missingFrom(live, v) {
  const missing = [];
  if (!live.changelog.includes(v)) missing.push('changelog');
  if (!live.tags.includes(v)) missing.push('tag');
  if (!live.gitlab.includes(v)) missing.push('gitlab-release');
  if (!live.npm.includes(v)) missing.push('npm');
  if (live.github != null && !live.github.includes(v)) missing.push('github-release');
  return missing;
}

// Sources are injectable for tests; producers return string[] of versions.
export function ledgerCheck({ changelog = [], tags = [], gitlab = [], npm = [], github = null }, { cut = '4.1.1', corrections = [] } = {}) {
  const live = { changelog, tags, gitlab, npm, github };
  const corrected = new Map(corrections.map((c) => [c.version, c]));
  const union = new Set([...changelog, ...tags, ...gitlab, ...npm, ...(github ?? [])]);
  const errors = []; const records = [];
  for (const v of union) {
    const missing = missingFrom(live, v);
    if (!missing.length) continue;
    if (!atLeast(v, cut)) {
      const rec = corrected.get(v);
      if (!rec) errors.push(`${v}: pre-${cut} mismatch missing from ledger-corrections.json (missing: ${missing.join(', ')})`);
      else if (JSON.stringify(rec.missingFrom) !== JSON.stringify(missing))
        errors.push(`${v}: ledger-corrections.json says missingFrom ${JSON.stringify(rec.missingFrom)} but live data computes ${JSON.stringify(missing)} — re-run --regen`);
      else records.push(`${v}: recorded (${rec.note})`);
    } else errors.push(`${v}: missing from ${missing.join(', ')}`);
  }
  return { errors, records };
}

const defaultExec = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'], ...opts });

async function gitlabReleases({ fetchImpl, exec, env }) {
  const token = env.CI_JOB_TOKEN ? { 'JOB-TOKEN': env.CI_JOB_TOKEN }
    : env.GITLAB_TOKEN ? { 'PRIVATE-TOKEN': env.GITLAB_TOKEN } : null;
  const project = env.CI_PROJECT_ID && env.CI_JOB_TOKEN ? env.CI_PROJECT_ID : GITLAB_PROJECT;
  let rows = [];
  if (token) {
    const api = env.CI_API_V4_URL ?? 'https://gitlab.com/api/v4';
    let page = '1';
    while (page) {
      const res = await fetchImpl(`${api}/projects/${project}/releases?per_page=100&page=${page}`, { headers: token });
      if (!res.ok) throw new Error(`HTTP ${res.status} from GitLab releases API`);
      const body = await res.json();
      if (!Array.isArray(body)) throw new Error('GitLab releases API returned a non-array body');
      rows = rows.concat(body);
      page = res.headers?.get?.('x-next-page') || '';
    }
  } else {
    const out = exec('glab', ['api', '--paginate', `projects/${project}/releases?per_page=100`]);
    if (!out.trim()) throw new Error('glab api returned no output');
    // --paginate concatenates one JSON array per page.
    rows = JSON.parse(`[${out.trim().replace(/\]\s*\[/g, '],[')}]`).flat();
  }
  return rows.map((r) => String(r.tag_name).replace(/^v/, ''));
}

export async function collectLive({ root = ROOT, github = false, fetchImpl = globalThis.fetch, exec = defaultExec, env = process.env } = {}) {
  const fail = (source) => (e) => { throw new LedgerFetchError(source, e); };
  const changelogPath = join(root, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) fail('changelog')(new Error(`${changelogPath} not found`));
  const changelog = changelogVersions(readFileSync(changelogPath, 'utf8'));
  if (!changelog.length) fail('changelog')(new Error('no version headings parsed'));

  let tags;
  try {
    tags = exec('git', ['tag', '-l', 'v*'], { cwd: root }).split('\n').filter(Boolean).map((t) => t.replace(/^v/, ''));
  } catch (e) { fail('tag')(e); }
  if (!tags.length) fail('tag')(new Error('git tag -l returned no v* tags (shallow clone without tags?)'));

  let npm;
  try {
    npm = JSON.parse(exec('npm', ['view', 'aura-glass', 'versions', '--json']));
  } catch (e) { fail('npm')(e); }
  if (!Array.isArray(npm) || !npm.length) fail('npm')(new Error('npm view returned no version list'));

  let gitlab;
  try { gitlab = await gitlabReleases({ fetchImpl, exec, env }); } catch (e) { fail('gitlab-release')(e); }

  let gh = null;
  if (github) {
    try {
      gh = JSON.parse(exec('gh', ['release', 'list', '--json', 'tagName', '--limit', '200'], { cwd: root }))
        .map((r) => String(r.tagName).replace(/^v/, ''));
    } catch (e) { fail('github-release')(e); }
  }
  return { changelog, tags, gitlab, npm, github: gh };
}

// REQ-PLAT-31: rebuild docs/release/ledger-corrections.json from the live
// ledgers. Every pre-cut version where CHANGELOG/tag/GitLab/npm disagree gets
// one record with the computed `missingFrom` list.
export function computeCorrections(live, { cut = '4.1.1' } = {}) {
  const all = new Set([...live.changelog, ...live.tags, ...live.gitlab, ...live.npm,
    ...(live.github ?? [])]);
  const rows = [];
  for (const v of [...all].sort(compareVersions)) {
    if (/^\d+\.\d+\.\d+$/.test(v) && atLeast(v, cut)) continue; // post-cut mismatches are failures, never corrections
    const missing = missingFrom(live, v);
    if (missing.length) rows.push({ version: v, missingFrom: missing, note: `computed ${cut}-cut regen` });
  }
  return rows;
}

// The file also carries the 4.1.1 claim retractions (PLAT-116..132) referenced
// from CHANGELOG/README; --regen rewrites only the release-ledger keys. A legacy
// top-level array is the claim list and is moved under `claimCorrections`.
export function readCorrectionsFile(path) {
  if (!existsSync(path)) return {};
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  return Array.isArray(doc) ? { claimCorrections: doc } : doc;
}

export async function main(argv = process.argv.slice(2), { root = ROOT, fetchImpl, exec, env } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const cut = arg('--cut') ?? '4.1.1';
  const paths = relPaths(root);
  const existing = readCorrectionsFile(paths.ledgerCorrections);
  // Throws LedgerFetchError before anything is written.
  const live = await collectLive({ root, github: argv.includes('--github'), fetchImpl, exec, env });
  if (argv.includes('--regen')) {
    const rows = computeCorrections(live, { cut });
    const out = {
      version: 1,
      note: `Regenerated by verify-release-ledger --regen from npm, git tags, GitLab Releases and CHANGELOG headings: each pre-${cut} mismatch recorded once with its computed missingFrom list. History is not rewritten.`,
      sources: { npm: live.npm.length, tags: live.tags.length, gitlabReleases: live.gitlab.length, changelog: live.changelog.length },
      corrections: rows,
      ...(existing.claimCorrections ? { claimCorrections: existing.claimCorrections } : {}),
    };
    writeFileSync(paths.ledgerCorrections, JSON.stringify(out, null, 2) + '\n');
    console.log(`verify-release-ledger --regen: ${rows.length} corrections written`);
    return 0;
  }
  const { errors, records } = ledgerCheck(live, { cut, corrections: existing.corrections ?? [] });
  for (const r of records) console.log(`record ${r}`);
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log('verify-release-ledger: all >= ' + cut + ' versions agree across CHANGELOG/tag/GitLab/npm');
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e.message ?? e); process.exit(1); });
}
