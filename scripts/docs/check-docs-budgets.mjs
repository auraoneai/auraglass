#!/usr/bin/env node
/* scripts/docs/check-docs-budgets.mjs — REQ-PLAT-102 (REQ-FIN-43), PLAT-384.
   Static docs build budgets: `npm run docs:build` <= 10 min and
   apps/docs/out <= 150 MB. Numbers are measured by this tool, never typed.

   node scripts/docs/check-docs-budgets.mjs --time -- npm run docs:build
       runs the command, measures wall time, then checks out/ size;
   node scripts/docs/check-docs-budgets.mjs [--out apps/docs/out]
       checks out/ size only (and a recorded build time, if present).
   Writes .artifacts/plat/docs-build.json { buildMs, buildBudgetMs, outBytes,
   outBudgetBytes, files, command, sha }. Exit 1 on a breach, on a failed
   build command, or when out/ is missing. */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DEFAULT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** 10 minutes (REQ-PLAT-102 "static build <= 10 min"). */
export const BUILD_BUDGET_MS = 10 * 60 * 1000;
/** 150 MB, decimal (REQ-PLAT-102 "out/ <= 150 MB"); decimal is the stricter reading. */
export const OUT_BUDGET_BYTES = 150 * 1000 * 1000;
export const REPORT_PATH = '.artifacts/plat/docs-build.json';

/** Total bytes and file count under `dir` (symlinks are not followed). */
export function dirSize(dir) {
  let bytes = 0;
  let files = 0;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) { bytes += statSync(p).size; files++; }
    }
  }
  return { bytes, files };
}

/** Budget verdicts for measured values. */
export function evaluate({ buildMs = null, outBytes }) {
  const errors = [];
  if (buildMs !== null && buildMs > BUILD_BUDGET_MS) errors.push(`docs build took ${(buildMs / 1000).toFixed(1)} s > ${BUILD_BUDGET_MS / 1000} s`);
  if (outBytes > OUT_BUDGET_BYTES) errors.push(`apps/docs/out is ${(outBytes / 1e6).toFixed(1)} MB > ${OUT_BUDGET_BYTES / 1e6} MB`);
  return errors;
}

export function main(argv = process.argv.slice(2), root = ROOT_DEFAULT) {
  const oi = argv.indexOf('--out');
  const outDir = resolve(root, oi >= 0 ? argv[oi + 1] : 'apps/docs/out');
  const reportFile = join(root, REPORT_PATH);
  const prior = existsSync(reportFile) ? JSON.parse(readFileSync(reportFile, 'utf8')) : {};
  let buildMs = prior.sha && prior.sha === (process.env.CI_COMMIT_SHA ?? null) ? prior.buildMs ?? null : null;
  let command = prior.command ?? null;

  const dd = argv.indexOf('--');
  if (argv.includes('--time')) {
    if (dd < 0 || dd === argv.length - 1) { console.error('docs-budgets: --time needs `-- <command …>`'); return 1; }
    const cmd = argv.slice(dd + 1);
    command = cmd.join(' ');
    const t0 = Date.now();
    const r = spawnSync(cmd[0], cmd.slice(1), { cwd: root, stdio: 'inherit' });
    buildMs = Date.now() - t0;
    if (r.status !== 0) { console.error(`docs-budgets: \`${command}\` exited ${r.status ?? r.signal}`); return 1; }
  }
  if (!existsSync(outDir)) { console.error(`docs-budgets: ${outDir} missing — run npm run docs:build first`); return 1; }
  const { bytes, files } = dirSize(outDir);
  const errors = evaluate({ buildMs, outBytes: bytes });
  const report = { buildMs, buildBudgetMs: BUILD_BUDGET_MS, outBytes: bytes, outBudgetBytes: OUT_BUDGET_BYTES, files, command, sha: process.env.CI_COMMIT_SHA ?? null };
  mkdirSync(dirname(reportFile), { recursive: true });
  writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  for (const e of errors) console.error(`  FAIL ${e}`);
  console.log(`docs-budgets: build ${buildMs === null ? 'not timed' : `${(buildMs / 1000).toFixed(1)} s`}, out ${(bytes / 1e6).toFixed(1)} MB in ${files} files`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main());
