#!/usr/bin/env node
/* REQ-PLAT-71 / PLAT-287 (D-26): transitive-ceiling calibration.

   D-26 is state-triggered: it fires on the first pre-release where Button and
   Dialog carry no `@ag-contract-seed` in their source closures. Until then the
   run reports `pending` (never `pass`). Once triggered, it packs the built
   tarball, installs it with --omit=dev --omit=optional --omit=peer, counts the
   transitive closure, and (with --write, in CI only) records the measured
   count as the machine-readable `transitiveCeiling:` line in
   docs/size-budgets.changelog.md with the job URL as evidence. After
   calibration the ceiling only decreases (contract §6.1, PLAT-287).

   Usage (CI, after `npm run build`):
     node scripts/build/calibrate-transitive.mjs            # report only
     node scripts/build/calibrate-transitive.mjs --write    # record on first non-pending run
   Result JSON: $AG_ARTIFACTS (default .artifacts/plat/d26)/transitive-calibration.json */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, importClosure } from './lib/graph.mjs';

const require = createRequire(import.meta.url);

export const CHANGELOG = join(ROOT, 'docs', 'size-budgets.changelog.md');
/** The D-26 trigger: both entries' source closures must be seed-free. */
export const TRIGGER_ENTRIES = ['src/components/button/index.ts', 'src/components/dialog/index.ts'];

const CEILING_RE = /^transitiveCeiling:\s*(\d+)\s*$/m;
const STATUS_RE = /^transitiveCeilingStatus:\s*(provisional|calibrated)\s*$/m;
const EVIDENCE_RE = /^transitiveCeilingEvidence:.*$/m;

/** Parse the machine-readable ceiling record out of the changelog text. */
export function readRecord(text) {
  const c = text.match(CEILING_RE);
  const s = text.match(STATUS_RE);
  return { ceiling: c ? Number(c[1]) : null, status: s ? s[1] : null };
}

const SEED_MARKER = '@ag-contract-seed';

/** True when any file in the entry's closure under `<root>/src` carries the seed marker. */
function closureSeeded(entryFile, root) {
  for (const f of importClosure(entryFile, { within: join(root, 'src') })) {
    try { if (readFileSync(f, 'utf8').includes(SEED_MARKER)) return true; } catch { /* unreadable: not a seed */ }
  }
  return false;
}

/** D-26 trigger state: which trigger entries still carry the seed marker (or are missing). */
export function triggerState(root = ROOT) {
  const blocking = [];
  for (const entry of TRIGGER_ENTRIES) {
    const abs = join(root, entry);
    if (!existsSync(abs)) blocking.push(`${entry} (missing)`);
    else if (closureSeeded(abs, root)) blocking.push(`${entry} (@ag-contract-seed in closure)`);
  }
  return { ready: blocking.length === 0, blocking };
}

/** Count every node in an `npm ls --json --all` tree (excluding the root). */
export function countTree(node) {
  if (!node?.dependencies) return 0;
  return Object.values(node.dependencies).reduce((acc, dep) => acc + countTree(dep), Object.keys(node.dependencies).length);
}

/**
 * Apply a measurement to the changelog text. Returns { text, problem }.
 * provisional -> calibrated at the measured count (a measurement above the
 * provisional ceiling is a raise and is refused). Already calibrated -> no
 * rewrite; a measurement above the recorded ceiling is a failure.
 */
export function applyMeasurement(text, measured, evidenceUrl) {
  const { ceiling, status } = readRecord(text);
  if (ceiling === null || status === null) {
    return { text, problem: 'changelog lacks the `transitiveCeiling:` / `transitiveCeilingStatus:` record lines' };
  }
  if (measured > ceiling) {
    return { text, problem: `measured ${measured} exceeds recorded ceiling ${ceiling} (a raise needs a Perf-Budget-Raise row)` };
  }
  if (status === 'calibrated') return { text, problem: null };
  if (!evidenceUrl) return { text, problem: 'calibration record needs the CI job URL (CI_JOB_URL) as evidence' };
  let next = text.replace(CEILING_RE, `transitiveCeiling: ${measured}`).replace(STATUS_RE, 'transitiveCeilingStatus: calibrated');
  const evidence = `transitiveCeilingEvidence: ${evidenceUrl}`;
  next = EVIDENCE_RE.test(next) ? next.replace(EVIDENCE_RE, evidence) : next.replace(/^transitiveCeilingStatus:.*$/m, (line) => `${line}\n${evidence}`);
  return { text: next, problem: null };
}

/** Pack the built package and count its production install closure. */
export function measure(root = ROOT) {
  if (!existsSync(join(root, 'dist'))) throw new Error('dist/ is missing — run `npm run build` first (CI only)');
  const { packToDir } = require('../ci/lib/npm-pack.cjs');
  const dir = mkdtempSync(join(tmpdir(), 'ag-d26-'));
  try {
    execFileSync('npm', ['init', '-y'], { cwd: dir, stdio: 'pipe' });
    const { tarballPath } = packToDir(root, dir);
    execFileSync('npm', ['install', '--omit=dev', '--omit=optional', '--omit=peer', '--no-audit', '--no-fund', tarballPath],
      { cwd: dir, encoding: 'utf8', stdio: 'pipe', timeout: 240_000 });
    /* npm ls exits ELSPROBLEMS for unresolved optional peers; the tree on stdout is still complete. */
    const ls = spawnSync('npm', ['ls', '--json', '--all', '--omit=dev'], { cwd: dir, encoding: 'utf8', maxBuffer: 64 << 20 });
    const tree = JSON.parse(ls.stdout);
    return countTree(tree);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

function main(argv) {
  const write = argv.includes('--write');
  const outDir = process.env.AG_ARTIFACTS ?? join(ROOT, '.artifacts', 'plat', 'd26');
  const report = (result) => {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'transitive-calibration.json'), JSON.stringify(result, null, 2) + '\n');
  };
  const text = readFileSync(CHANGELOG, 'utf8');
  const record = readRecord(text);
  const trigger = triggerState();
  if (!trigger.ready) {
    report({ status: 'pending', reason: 'D-26 trigger not met', blocking: trigger.blocking, record });
    console.log(`calibrate-transitive: pending — D-26 trigger not met: ${trigger.blocking.join('; ')}`);
    return 0;
  }
  if (!process.env.CI) {
    console.error('calibrate-transitive packs and installs the tarball: remote only. Run in GitLab CI: node scripts/build/calibrate-transitive.mjs --write');
    return 2;
  }
  const measured = measure();
  const { text: nextText, problem } = applyMeasurement(text, measured, process.env.CI_JOB_URL);
  if (problem) {
    report({ status: 'fail', measured, record, problem });
    console.error(`calibrate-transitive: ${problem}`);
    return 1;
  }
  const changed = nextText !== text;
  if (write && changed) writeFileSync(CHANGELOG, nextText);
  const after = write ? readRecord(nextText) : record;
  report({ status: record.status === 'calibrated' ? 'pass' : (write ? 'calibrated' : 'measured'), measured, record: after, evidence: process.env.CI_JOB_URL ?? null, wrote: write && changed });
  console.log(`calibrate-transitive: measured ${measured}; ceiling ${after.ceiling} (${after.status})${write && changed ? ' — recorded' : ''}`);
  return 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)));
