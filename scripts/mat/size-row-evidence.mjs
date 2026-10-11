#!/usr/bin/env node
/* scripts/mat/size-row-evidence.mjs — FIN-D agent prep for the `mat:tokens-js`
   budget decision (REQ-FIN-54 / REQ-MAT-22 step 5, PR #178's proposed raise
   2048 -> 6144 B, owner action "Perf budget").

   A budget raise needs a measured tool artifact. This script does not measure
   anything itself: it runs the size tool (scripts/ci/verify-size-budgets.mjs,
   esbuild bundle+minify+gzip-9 over the CI-built dist/), then copies the
   tool's numbers for the requested MAT rows into
   .artifacts/mat/size/<row>.json together with the commit, job and pipeline
   of the run, plus the full docs/size-budgets.json the tool wrote.

     node scripts/mat/size-row-evidence.mjs [--row mat:tokens-js]...
          [--proposed <bytes>] [--from <size-budgets.json>] [--out-dir <dir>]

   Fail-closed: exit 1 when a requested row is missing or the tool left it
   `pending` (not measured). Whether the measured size is within the limit is
   the PLAT size gate's verdict (plat:gate:glass-quality); it is recorded
   here, not enforced. Runs in CI only (job mat:test:size-evidence); a local
   invocation without --from exits 2 and names the remote job. */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const TOOL = 'scripts/ci/verify-size-budgets.mjs';
const TOOL_OUTPUT = 'docs/size-budgets.json';
export const REMOTE_JOB = 'mat:test:size-evidence';

const slug = (id) => id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');

/** Pure: build the evidence record for one row of the tool's output. */
export function evidenceFor(rowId, toolDoc, { proposed = null, run = {} } = {}) {
  const row = (toolDoc?.rows ?? []).find((r) => r.id === rowId);
  if (!row) return { error: `${rowId}: row not present in ${TOOL_OUTPUT}` };
  if (row.status === 'pending' || typeof row.measuredBytes !== 'number') {
    return { error: `${rowId}: not measured by ${TOOL} (status ${row.status ?? 'unknown'})` };
  }
  return {
    record: {
      row: row.id,
      import: row.import,
      kind: row.kind,
      measuredBytes: row.measuredBytes,
      limitBytes: row.limitBytes,
      withinLimit: row.measuredBytes <= row.limitBytes,
      proposedLimitBytes: proposed,
      withinProposed: proposed === null ? null : row.measuredBytes <= proposed,
      toolStatus: row.status,
      tool: TOOL,
      toolGeneratedAt: toolDoc.generatedAt ?? null,
      method: 'esbuild bundle+minify, format esm, platform browser, peers external, gzip level 9 (verify-size-budgets)',
      ...run,
    },
  };
}

function gitSha() {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const rows = [];
  let proposed = null;
  let from = null;
  let outDir = join(ROOT, '.artifacts/mat/size');
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--row') rows.push(argv[++i]);
    else if (a === '--proposed') proposed = Number(argv[++i]);
    else if (a === '--from') from = resolve(argv[++i]);
    else if (a === '--out-dir') outDir = resolve(argv[++i]);
    else { console.error(`size-row-evidence: unknown argument ${a}`); return 1; }
  }
  if (!rows.length) rows.push('mat:tokens-js');
  if (proposed !== null && !(Number.isInteger(proposed) && proposed > 0)) {
    console.error('size-row-evidence: --proposed must be a positive integer byte count');
    return 1;
  }

  let toolExit = null;
  if (!from) {
    if (!env.CI) {
      console.error(`size-row-evidence: runs in GitLab CI only (needs the CI-built dist/). Remote: job ${REMOTE_JOB} in ci/mat.gitlab-ci.yml.`);
      return 2;
    }
    if (!existsSync(join(ROOT, 'dist'))) {
      console.error('size-row-evidence: dist/ missing — the plat:build:dist artifact did not reach this job');
      return 1;
    }
    const r = spawnSync(process.execPath, [join(ROOT, TOOL)], { cwd: ROOT, stdio: 'inherit' });
    toolExit = r.status;
    from = join(ROOT, TOOL_OUTPUT);
  }
  if (!existsSync(from)) { console.error(`size-row-evidence: ${from} not found`); return 1; }
  const toolDoc = JSON.parse(readFileSync(from, 'utf8'));
  const run = {
    toolExit,
    commitSha: env.CI_COMMIT_SHA ?? gitSha(),
    jobUrl: env.CI_JOB_URL ?? null,
    pipelineUrl: env.CI_PIPELINE_URL ?? null,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'size-budgets.json'), JSON.stringify(toolDoc, null, 2) + '\n');
  let failed = 0;
  for (const id of rows) {
    const { record, error } = evidenceFor(id, toolDoc, { proposed, run });
    if (error) { console.error(`FAIL size-row-evidence: ${error}`); failed++; continue; }
    const file = join(outDir, `${slug(id)}.json`);
    writeFileSync(file, JSON.stringify(record, null, 2) + '\n');
    console.log(`size-row-evidence: ${id} ${record.measuredBytes} B (limit ${record.limitBytes} B`
      + (proposed === null ? '' : `, proposed ${proposed} B`) + `) -> ${relative(ROOT, file) || file}`);
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  process.exitCode = main();
}
