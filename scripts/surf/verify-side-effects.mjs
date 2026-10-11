#!/usr/bin/env node
// scripts/surf/verify-side-effects.mjs — SURF dist side-effect gate (REQ-SURF-06,
// AC-SURF-03; REQ-FIN-80).
//
// Runs PLAT's single side-effect trap (tests/side-effects/trap.mjs, the worker
// behind scripts/ci/verify-side-effects.mjs, REQ-PLAT-70) over the built dist/
// and fails when any recorded call comes from a SURF-owned dist module, when
// fragments/side-effects/surf.ts is not empty, or when a SURF entry is missing
// from dist/ (fail closed: no dist, no pass). It reuses the PLAT trap instead
// of a second implementation and never edits PLAT files; non-SURF calls are
// listed in the report for information only (PLAT's own gate owns them).
//
// Registered in fragments/lanes/surf.ts (lane W5, L2, scopes main + release:
// it needs dist/, so it never runs on the pr scope). Evidence goes to
// .artifacts/surf/side-effects/report.json.
//
// Usage: node scripts/surf/verify-side-effects.mjs   (exit 0 pass, 1 fail)

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const TRAP = join(ROOT, 'tests/side-effects/trap.mjs');

/** dist path prefixes compiled from SURF-owned src (tsdown unbundle: src/x.ts -> dist/x.js). */
export const SURF_DIST_PREFIXES = [
  'dist/app-shell/',
  'dist/data/',
  'dist/date/',
  'dist/ai/',
  'dist/media/',
  'dist/backdrops/',
  'dist/charts/',
  'dist/three/',
  'dist/compat/surf/',
  'dist/components/tabs/',
  'dist/components/tab-bar/',
  'dist/components/breadcrumbs/',
  'dist/components/pagination/',
  'dist/components/command-palette/',
  'dist/components/source-transition/',
  'dist/components/timeline/',
];
export const SURF_DIST_FILES = ['dist/root/surf.js'];

/** The SURF package entries (build/exports.manifest.json subpaths owned by SURF). */
export const SURF_ENTRIES = ['app-shell', 'data', 'date', 'ai', 'media', 'backdrops', 'charts', 'three'];

export const isSurfModule = (module) =>
  typeof module === 'string' &&
  (SURF_DIST_FILES.includes(module) || SURF_DIST_PREFIXES.some((p) => module.startsWith(p)));

/**
 * Pure verdict over one trap run.
 * @param {{ observed: Array<{api: string, module: string}>, surfExceptions: unknown[], distFiles: Set<string> }} input
 */
export function evaluate({ observed, surfExceptions, distFiles }) {
  const missingEntries = SURF_ENTRIES.map((e) => `dist/${e}/index.js`).filter((f) => !distFiles.has(f));
  const surfCalls = observed.filter((c) => isSurfModule(c.module));
  const otherCalls = observed.filter((c) => !isSurfModule(c.module));
  const errors = [];
  if (surfExceptions.length) errors.push(`fragments/side-effects/surf.ts must be [] (has ${surfExceptions.length} row(s))`);
  for (const f of missingEntries) errors.push(`SURF entry missing from dist: ${f}`);
  for (const c of surfCalls) errors.push(`undeclared ${c.api} in ${c.module}`);
  return { ok: errors.length === 0, errors, surfCalls, otherCalls, missingEntries };
}

async function surfFragmentRows(root) {
  const { loadFragments } = await import(join(root, 'src/contracts/load-fragments.mjs'));
  const rows = [];
  for (const { stream, value } of await loadFragments('side-effects', root)) {
    if (stream === 'surf') rows.push(...(Array.isArray(value) ? value : []));
  }
  return rows;
}

/**
 * Run the PLAT trap with `distRoot` as cwd (the trap imports every <cwd>/dist/**.js)
 * and evaluate. `root` supplies the fragments and the report location.
 */
export async function runGate({ root = ROOT, distRoot = root, write = true } = {}) {
  const dist = join(distRoot, 'dist');
  if (!existsSync(dist)) {
    return { ok: false, errors: [`dist/ missing under ${distRoot} — build first (remote plat:build:dist)`], surfCalls: [], otherCalls: [], missingEntries: SURF_ENTRIES };
  }
  const trap = spawnSync(process.execPath, [TRAP], { cwd: distRoot, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (trap.status !== 0) {
    return { ok: false, errors: [`side-effect trap exited ${trap.status}: ${(trap.stderr || trap.stdout).slice(0, 2000)}`], surfCalls: [], otherCalls: [], missingEntries: [] };
  }
  const observed = JSON.parse(trap.stdout.trim().split('\n').pop() ?? '[]');
  const distFiles = new Set(SURF_ENTRIES.map((e) => `dist/${e}/index.js`).filter((f) => existsSync(join(distRoot, f))));
  const result = evaluate({ observed, surfExceptions: await surfFragmentRows(root), distFiles });
  if (write) {
    const out = join(root, '.artifacts', 'surf', 'side-effects');
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'report.json'), JSON.stringify({ ...result, observedTotal: observed.length, generatedAt: new Date().toISOString() }, null, 2));
  }
  return result;
}

// No top-level await: jest (babel CJS transform) imports this module for the
// evaluate()/runGate() tests.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runGate().then((result) => {
    for (const e of result.errors.slice(0, 50)) console.error(`verify-side-effects(surf): ${e}`);
    if (!result.ok) {
      console.error(`verify-side-effects(surf): FAIL — ${result.surfCalls.length} undeclared SURF call(s), ${result.missingEntries.length} missing entr(y/ies)`);
      process.exit(1);
    }
    console.log(`verify-side-effects(surf): ${SURF_ENTRIES.length} SURF entries in dist, 0 undeclared SURF calls (${result.otherCalls.length} non-SURF call(s) left to PLAT's gate)`);
  }, (err) => {
    console.error(`verify-side-effects(surf): ${err?.stack ?? err}`);
    process.exit(1);
  });
}
