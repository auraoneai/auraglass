#!/usr/bin/env node
/* generate-exports.mjs (PLAT-255, REQ-PLAT-67)
   Generates package.json "exports" from build/exports.manifest.json (verbatim, PLAT-owned).
   - types first, then default (D-03).
   - Pre-release filter: entries whose src import graph carries @ag-contract-seed are
     dropped (they were never exported — a dropped entry was never shipped).
   - --check: exit 1 when package.json drifted; --write: rewrite; --list-entries: print. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, buildableEntries, loadJson } from './lib/graph.mjs';

export function desiredExports(root = ROOT) {
  const { keep } = buildableEntries(root);
  const { entries } = manifest(root);
  const bySub = new Map(keep.map(e => [e.subpath, e]));
  const exportsMap = {};
  for (const e of entries) {
    const isJs = e.source.startsWith('src/');
    const isGlob = e.subpath.includes('*');
    if (isJs && !isGlob && !bySub.has(e.subpath)) continue; // pending seed graph
    const dest = e.default.startsWith('./') ? e.default : './' + e.default;
    if (isJs) {
      const cond = { types: './' + e.types, default: dest };
      if (e.css) cond.css = './' + e.css;
      exportsMap[e.subpath] = cond;
    } else if (isGlob) {
      // wildcard rows (./icons/*) carry types+default targets verbatim
      exportsMap[e.subpath] = { types: e.types, default: dest };
    } else exportsMap[e.subpath] = dest; // css / json / package.json artifacts
  }
  return exportsMap;
}

function manifest(root) { return { entries: loadJson(join(root, 'build', 'exports.manifest.json')).entries }; }

export function currentExports(root = ROOT) {
  return loadJson(join(root, 'package.json')).exports ?? {};
}

const mode = process.argv[2] ?? '--check';
const asJson = process.argv.includes('--json');
const { entries } = manifest(ROOT);
const want = desiredExports();

if (mode === '--list-entries') {
  const { keep, pending } = buildableEntries();
  if (asJson) {
    console.log(JSON.stringify({
      built: keep.map(e => ({ subpath: e.subpath, default: e.default, types: e.types ?? null })),
      pending: pending.map(e => ({ subpath: e.subpath, reason: e.reason })),
      exports: want,
    }, null, 2));
  } else {
    console.log('exports (built):');
    for (const e of keep) console.log(`  ${e.subpath} -> ${e.default}`);
    if (pending.length) { console.log('pending (seed graph / missing):'); for (const e of pending) console.log(`  ${e.subpath}  ${e.reason}`); }
  }
  process.exit(0);
}

const have = currentExports();
const same = JSON.stringify(have) === JSON.stringify(want);
if (mode === '--write') {
  const pkgPath = join(ROOT, 'package.json');
  const pkg = loadJson(pkgPath);
  pkg.exports = want;
  // top-level types (REQ-PLAT-67): the '.' entry's declared types target; while
  // '.' is seed-pending the declared target is still correct (manifest-sourced).
  const rootTypes = want['.']?.types ?? entries.find((e) => e.subpath === '.')?.types;
  if (rootTypes) pkg.types = rootTypes.replace(/^\.\//, '');
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`generate-exports: wrote ${Object.keys(want).length} entries`);
} else {
  if (same) console.log('generate-exports: package.json exports match the manifest');
  else {
    console.error('generate-exports: DRIFT between package.json exports and build/exports.manifest.json');
    for (const k of new Set([...Object.keys(have), ...Object.keys(want)])) {
      if (JSON.stringify(have[k]) !== JSON.stringify(want[k])) console.error(`  ${k}: have ${JSON.stringify(have[k])}, want ${JSON.stringify(want[k])}`);
    }
    process.exit(1);
  }
}
