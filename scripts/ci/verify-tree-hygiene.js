#!/usr/bin/env node
'use strict';
/**
 * PLAT-113 — release/4.x tree hygiene gate.
 * Fails (exit 1) when:
 *  - `git ls-files reports` is non-empty (tracked evidence must not return),
 *  - a tracked root file matches /^[^/]*probe[^/]*\.mjs$/ (throwaway probes),
 *  - a tracked file exceeds 5 MB outside src/styles/fonts/ and
 *    visual-baselines/ (size budget for the published tree).
 * Prints file count and bytes for each violation class.
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.env.AURAGLASS_REPO_ROOT
  ? path.resolve(process.env.AURAGLASS_REPO_ROOT)
  : path.resolve(__dirname, '..', '..');
const SIZE_LIMIT = 5 * 1024 * 1024;
const SIZE_ALLOW = /^src\/styles\/fonts\/|^visual-baselines\//;

function lsFiles(pattern) {
  try {
    return execSync(`git ls-files -- '${pattern}'`, { cwd: repoRoot, encoding: 'utf8' })
      .split('\n').filter(Boolean);
  } catch (e) {
    return [];
  }
}

const violations = [];

const trackedReports = lsFiles('reports/');
if (trackedReports.length) {
  const bytes = trackedReports.reduce((n, f) => {
    try { return n + fs.statSync(path.join(repoRoot, f)).size; } catch { return n; }
  }, 0);
  violations.push(`tracked reports/ files: ${trackedReports.length} files, ${bytes} bytes`);
}

const probeFiles = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
  .split('\n').filter((f) => /^[^/]*probe[^/]*\.mjs$/.test(f));
if (probeFiles.length) {
  violations.push(`tracked root probe scripts: ${probeFiles.length} files (${probeFiles.slice(0, 5).join(', ')}${probeFiles.length > 5 ? ', …' : ''})`);
}

// REQ-PLAT-50 — explicit deny list: audit/inspection scratch tooling must
// never be tracked at the repo root (it generated the .audit-inspect.mjs
// incident). Exact names first, then root-level audit/*.mjs globs.
const DENY_LIST = [
  '.audit-inspect.mjs',
  /^\.audit-.*\.mjs$/,
  /^audit-.*\.mjs$/,
  /^inspect-.*\.mjs$/,
];
const denied = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
  .split('\n').filter((f) => DENY_LIST.some((d) => (typeof d === 'string' ? f === d : d.test(f))));
if (denied.length) {
  violations.push(`tracked deny-listed files: ${denied.join(', ')}`);
}

const oversized = [];
for (const f of execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' }).split('\n').filter(Boolean)) {
  if (SIZE_ALLOW.test(f)) continue;
  try {
    const size = fs.statSync(path.join(repoRoot, f)).size;
    if (size > SIZE_LIMIT) oversized.push([f, size]);
  } catch { /* gone */ }
}
if (oversized.length) {
  const bytes = oversized.reduce((n, [, s]) => n + s, 0);
  violations.push(`tracked files > 5 MB outside src/styles/fonts/ + visual-baselines/: ${oversized.length} files, ${bytes} bytes (${oversized.map(([f]) => f).join(', ')})`);
}

if (violations.length) {
  for (const v of violations) console.error(`[verify-tree-hygiene] FAIL ${v}`);
  process.exit(1);
}
console.log('[verify-tree-hygiene] clean: no tracked reports/, probe scripts, or oversized files');
