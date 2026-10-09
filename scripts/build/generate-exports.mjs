#!/usr/bin/env node
/* generate-exports.mjs (PLAT-255, REQ-PLAT-67, REQ-FIN-06)
   Generates package.json "exports" + top-level "types" from
   build/exports.manifest.json (verbatim, PLAT-owned).
   - types first, then default (D-03).
   - Pre-release filter: entries whose src import graph carries a line-1
     /^\/[*\/] @ag-contract-seed:/ header are dropped (a dropped entry was
     never shipped). Mid-file mentions of the marker are not seeds.
   - entries[].ga marks the first GA line that ships the entry; entries with
     ga > the package version (e.g. ga:'5.1' on 5.0.x) are dropped.
   - --check: names every excluded entry with its seed file(s), the file's
     owner (contracts/ownership.json) and the REQ-FIN that removes the seed;
     exits 1 only on stale exclusions (package.json drifted from the desired
     exports or the exclusion no longer holds). --write: rewrite;
     --list-entries: print. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { ROOT, buildableEntries, loadJson, rel } from './lib/graph.mjs';



/** REQ-FIN that removes a seed, by contracts/ownership.json owner stream
 *  (PRD-F §6 WP ownership): MAT seed bodies → FIN-D REQ-FIN-52/58 (explicit
 *  in PROMPT_FINAL_COMPLETION FIN-D step 1/2); other streams → their WP's
 *  REQ-FIN range; missing sources → the producer WP named in the ledger row. */
const REMOVING_REQ_FIN = {
  MAT: 'REQ-FIN-52/-58 (FIN-D seed-body replacement)',
  CMP: 'REQ-FIN-70..76 (FIN-E)',
  SURF: 'REQ-FIN-80..90 (FIN-F)',
  PLAT: 'REQ-FIN-30..45 (FIN-C)',
  QUAL: 'REQ-FIN-100..107 (FIN-G)',
  CONTRACT: 'REQ-FIN-06 / FIN-463 (FIN-A)',
};

const globRe = (glob) =>
  new RegExp('^' + glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '[^/]*')
    .replace(//g, '.*') + '$');

const _ownerCache = new Map();
function ownerOf(fileRel, root = ROOT) {
  let rows = _ownerCache.get(root);
  if (!rows) {
    rows = [];
    const p = join(root, 'contracts', 'ownership.json');
    if (existsSync(p))
      rows = (loadJson(p).rows ?? []).map((r) => ({ ...r, re: globRe(r.glob) }));
    _ownerCache.set(root, rows);
  }
  const hit = rows.find((r) => r.re.test(fileRel));
  return hit?.owner ?? 'NONE';
}

/** Describe each excluded entry: seed file(s), owner(s), removing REQ-FIN. */
export function exclusionReport(root = ROOT) {
  const { pending } = buildableEntries(root);
  return pending.map((e) => {
    if (e.gaDropped) return { subpath: e.subpath, reason: e.reason };
    if (!e.seedFiles?.length) {
      const reqFin = e.subpath === './forms' ? 'REQ-FIN-70..76 (FIN-E creates src/forms — CMP-23 clause)' : 'producer WP';
      return { subpath: e.subpath, reason: e.reason, removingReqFin: reqFin };
    }
    const files = e.seedFiles.map((f) => {
      const fileRel = relative(root, f).split('\\').join('/');
      const owner = ownerOf(fileRel, root);
      return { file: fileRel, owner, removingReqFin: REMOVING_REQ_FIN[owner] ?? 'producer WP' };
    });
    return { subpath: e.subpath, reason: e.reason, seedFiles: files };
  });
}

export function desiredExports(root = ROOT) {
  const { keep } = buildableEntries(root);
  const { entries } = manifest(root);
  const bySub = new Map(keep.map(e => [e.subpath, e]));
  const exportsMap = {};
  for (const e of entries) {
    const isJs = e.source.startsWith('src/');
    if (isJs && !bySub.has(e.subpath)) continue; // pending seed graph / ga gate / missing
    const dest = './' + e.default;
    if (isJs) {
      const cond = { types: './' + e.types, default: dest };
      if (e.css) cond.css = './' + e.css;
      exportsMap[e.subpath] = cond;
    } else exportsMap[e.subpath] = dest; // css / json / package.json artifacts
  }
  return exportsMap;
}

function manifest(root) { return { entries: loadJson(join(root, 'build', 'exports.manifest.json')).entries }; }

export function currentExports(root = ROOT) {
  return loadJson(join(root, 'package.json')).exports ?? {};
}

/** package.json top-level "types" points at the '.' manifest entry's types —
 *  a hint about where declarations live, independent of export eligibility. */
export function desiredTypes(root = ROOT) {
  const dot = manifest(root).entries.find((e) => e.subpath === '.');
  return dot?.types ? './' + dot.types : undefined;
}

const args = process.argv.slice(2);
const rootArg = args.indexOf('--root') >= 0 ? args[args.indexOf('--root') + 1] : undefined;
const mode = args.find((a) => a.startsWith('--') && a !== '--root') ?? '--check';
const root = rootArg ? resolve(rootArg) : ROOT;
const want = desiredExports(root);

if (mode === '--list-entries') {
  const { keep, pending } = buildableEntries(root);
  console.log('exports (built):');
  for (const e of keep) console.log(`  ${e.subpath} -> ${e.default}`);
  if (pending.length) {
    console.log('excluded (seed graph / ga gate / missing):');
    for (const x of exclusionReport(root)) {
      console.log(`  ${x.subpath}  ${x.reason}`);
      for (const f of x.seedFiles ?? []) console.log(`      seed: ${f.file}  owner: ${f.owner}  removed by ${f.removingReqFin}`);
      if (x.removingReqFin) console.log(`      removed by ${x.removingReqFin}`);
    }
  }
  process.exit(0);
}

const have = currentExports(root);
const same = JSON.stringify(have) === JSON.stringify(want);
const wantTypes = desiredTypes(root);
const haveTypes = loadJson(join(root, 'package.json')).types;
const typesDrift = wantTypes !== undefined && haveTypes !== wantTypes;

if (mode === '--write') {
  const pkgPath = join(root, 'package.json');
  const pkg = loadJson(pkgPath);
  pkg.exports = want;
  if (wantTypes !== undefined) pkg.types = wantTypes;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`generate-exports: wrote ${Object.keys(want).length} entries` + (wantTypes ? `, types ${wantTypes}` : ''));
} else {
  const report = exclusionReport(root);
  if (report.length) {
    console.log('excluded entries (each needs its removing REQ-FIN to land):');
    for (const x of report) {
      console.log(`  ${x.subpath}  ${x.reason}`);
      for (const f of x.seedFiles ?? []) console.log(`      seed: ${f.file}  owner: ${f.owner}  removed by ${f.removingReqFin}`);
      if (x.removingReqFin) console.log(`      removed by ${x.removingReqFin}`);
    }
  }
  if (same && !typesDrift) console.log('generate-exports: package.json exports match the manifest');
  else {
    if (!same) {
      console.error('generate-exports: DRIFT — stale exports vs build/exports.manifest.json');
      for (const k of new Set([...Object.keys(have), ...Object.keys(want)])) {
        if (JSON.stringify(have[k]) !== JSON.stringify(want[k])) console.error(`  ${k}: have ${JSON.stringify(have[k])}, want ${JSON.stringify(want[k])}`);
      }
    }
    if (typesDrift) console.error(`generate-exports: DRIFT — package.json "types" is ${JSON.stringify(haveTypes)}, want ${JSON.stringify(wantTypes)}`);
    process.exit(1);
  }
}
