#!/usr/bin/env node
/**
 * REQ-PLAT-50 — tree hygiene gate (next/5x port of the release/4.x script;
 * ESM because the 5.x package is "type": "module").
 * Fails (exit 1) when:
 *  - `git ls-files reports` is non-empty (tracked evidence must not return),
 *  - a tracked root file matches /^[^/]*probe[^/]*\.mjs$/ (throwaway probes),
 *  - a tracked root file is on the audit/inspection scratch deny list
 *    (`.audit-inspect.mjs`, `.audit-*.mjs`, `audit-*.mjs`, `inspect-*.mjs`,
 *    `list-stories.mjs`),
 *  - a tracked file exceeds 5 MB outside src/styles/fonts/ and
 *    visual-baselines/ (size budget for the published tree).
 * Prints file count and bytes for each violation class.
 * AURAGLASS_REPO_ROOT overrides the repository root (tests use a temp index).
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = process.env.AURAGLASS_REPO_ROOT
  ? resolve(process.env.AURAGLASS_REPO_ROOT)
  : resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SIZE_LIMIT = 5 * 1024 * 1024;
const SIZE_ALLOW = /^src\/styles\/fonts\/|^visual-baselines\//;
export const PROBE = /^[^/]*probe[^/]*\.mjs$/;
// Exact names first, then root-level audit/inspect scratch globs.
export const DENY_LIST = [
  '.audit-inspect.mjs',
  'list-stories.mjs',
  /^\.audit-[^/]*\.mjs$/,
  /^audit-[^/]*\.mjs$/,
  /^inspect-[^/]*\.mjs$/,
];

// -z: paths verbatim (no C-quoting of unusual names).
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  .split('\0').filter(Boolean);
const sizeOf = (f) => { try { return statSync(join(repoRoot, f)).size; } catch { return null; } };

const violations = [];

const trackedReports = tracked.filter((f) => f === 'reports' || f.startsWith('reports/'));
if (trackedReports.length) {
  const bytes = trackedReports.reduce((n, f) => n + (sizeOf(f) ?? 0), 0);
  violations.push(`tracked reports/ files: ${trackedReports.length} files, ${bytes} bytes`);
}

const probeFiles = tracked.filter((f) => PROBE.test(f));
if (probeFiles.length) {
  violations.push(`tracked root probe scripts: ${probeFiles.length} files (${probeFiles.slice(0, 5).join(', ')}${probeFiles.length > 5 ? ', …' : ''})`);
}

const denied = tracked.filter((f) => !PROBE.test(f)
  && DENY_LIST.some((d) => (typeof d === 'string' ? f === d : d.test(f))));
if (denied.length) {
  violations.push(`tracked deny-listed files: ${denied.length} files (${denied.join(', ')})`);
}

const oversized = [];
for (const f of tracked) {
  if (SIZE_ALLOW.test(f)) continue;
  const size = sizeOf(f);
  if (size !== null && size > SIZE_LIMIT) oversized.push([f, size]);
}
if (oversized.length) {
  const bytes = oversized.reduce((n, [, s]) => n + s, 0);
  violations.push(`tracked files > 5 MB outside src/styles/fonts/ + visual-baselines/: ${oversized.length} files, ${bytes} bytes (${oversized.map(([f]) => f).join(', ')})`);
}

if (violations.length) {
  for (const v of violations) console.error(`[verify-tree-hygiene] FAIL ${v}`);
  process.exit(1);
}
console.log(`[verify-tree-hygiene] clean: ${tracked.length} tracked files; no tracked reports/, probe or deny-listed scratch scripts, or oversized files`);
