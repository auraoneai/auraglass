#!/usr/bin/env node
/* generate-exports.mjs (PLAT-255, REQ-PLAT-67, REQ-FIN-06; CMP-23, CMP-29)
   Generates package.json "exports", top-level "main" and top-level "types"
   from build/exports.manifest.json (verbatim from the contract ENTRIES list,
   PLAT-owned; this script never writes it).
   - types first, then default (D-03).
   - Pre-release filter: an entry whose src import closure contains a file with
     a line-1 /^\/[*\/] @ag-contract-seed:/ header is excluded (an excluded
     entry was never shipped). The marker anywhere else is not a seed.
   - EntrySpec.ga (src/contracts/entries.ts) marks the first GA line that ships
     an entry; entries with ga > the package version (ga:'5.1' on 5.0.x, i.e.
     ./charts) are dropped.
   - Pattern subpaths declared by the contract next to their base entry
     (ENTRIES './icons' row: "+ './icons/<name>' pattern") are emitted right
     after the base entry when it ships.
   - --check (default): prints every excluded entry with its seed file(s), the
     file's owner (contracts/ownership.json) and the REQ-FIN that removes the
     seed. Exit 1 only on a stale exclusion:
       (a) an excluded entry with no seed file behind it (missing source), or
       (b) package.json disagrees with the gate (an eligible entry absent, an
           excluded entry present, or a stale main/types).
     Seed-backed and ga-gated exclusions alone exit 0.
   - --write: rewrite package.json exports/main/types. --list-entries: print.
   - --root <dir>: run against a fixture tree. */
import { writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { ROOT, buildableEntries, loadJson, contractGaLines } from './lib/graph.mjs';

/** REQ-FIN that removes each known seed file (PRD-F §5.1 REQ-FIN-06 / §5.4). */
const REMOVING_REQ_FIN_BY_FILE = {
  'src/theme/createGlassTheme.ts': 'REQ-FIN-52 (FIN-D seed-body replacement)',
  'src/theme/public.ts': 'REQ-FIN-52 (FIN-D seed-body replacement)',
  'src/motion/public.ts': 'REQ-FIN-58 (FIN-D seed-body replacement)',
  'src/contracts/seed.tsx': 'none — contract seed helper, excluded from the package build (FIN-463)',
};
/** Fallback by contracts/ownership.json owner stream → that stream's WP range. */
const REMOVING_REQ_FIN_BY_OWNER = {
  MAT: 'REQ-FIN-50..59 (FIN-D)',
  CMP: 'REQ-FIN-70..76 (FIN-E)',
  SURF: 'REQ-FIN-80..90 (FIN-F)',
  PLAT: 'REQ-FIN-30..45 (FIN-C)',
  QUAL: 'REQ-FIN-100..107 (FIN-G)',
  CONTRACT: 'FIN-463 contract/v1.2-final (FIN-A)',
};

/** Contract-declared pattern subpaths, keyed by their base entry. */
const PATTERN_EXPORTS = {
  './icons': {
    subpath: './icons/*',
    cond: { types: './dist/icons/*.d.ts', default: './dist/icons/*.js' },
  },
};

const globRe = (glob) =>
  new RegExp('^' + glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*') + '$');

const ownerRowsCache = new Map();
function ownerOf(fileRel, root) {
  let rows = ownerRowsCache.get(root);
  if (!rows) {
    rows = (loadJson(join(root, 'contracts', 'ownership.json')).rows ?? [])
      .map((r) => ({ ...r, re: globRe(r.glob) }));
    ownerRowsCache.set(root, rows);
  }
  return rows.find((r) => r.re.test(fileRel))?.owner ?? 'NONE';
}

const manifest = (root) => loadJson(join(root, 'build', 'exports.manifest.json')).entries;

/** Each excluded entry: reason plus seed file(s) with owner and removing REQ-FIN.
 *  `stale` = excluded with no seed file behind it (not ga-gated, no seed). */
export function exclusionReport(root = ROOT) {
  const { pending } = buildableEntries(root);
  return pending.map((e) => {
    if (e.gaDropped) return { subpath: e.subpath, reason: e.reason, gaDropped: true, stale: false };
    if (!e.seedFiles?.length) return { subpath: e.subpath, reason: e.reason, stale: true };
    const seedFiles = e.seedFiles.map((f) => {
      const file = relative(root, f).split('\\').join('/');
      const owner = ownerOf(file, root);
      const removingReqFin = REMOVING_REQ_FIN_BY_FILE[file] ?? REMOVING_REQ_FIN_BY_OWNER[owner] ?? 'unassigned';
      return { file, owner, removingReqFin };
    });
    return { subpath: e.subpath, reason: e.reason, seedFiles, stale: false };
  });
}

export function desiredExports(root = ROOT) {
  const { keep } = buildableEntries(root);
  const ok = new Set(keep.map((e) => e.subpath));
  const out = {};
  for (const e of manifest(root)) {
    const isJs = e.source.startsWith('src/');
    if (isJs && !ok.has(e.subpath)) continue; // seed closure / ga gate / missing source
    if (!isJs) { out[e.subpath] = './' + e.default; continue; } // css / json / package.json artifacts
    const cond = { types: './' + e.types, default: './' + e.default };
    if (e.css) cond.css = './' + e.css;
    out[e.subpath] = cond;
    const pat = PATTERN_EXPORTS[e.subpath];
    if (pat) out[pat.subpath] = { ...pat.cond };
  }
  return out;
}

/** Top-level "main"/"types" follow the '.' entry, and only when '.' ships. */
export function desiredTopLevel(root = ROOT) {
  const dot = manifest(root).find((e) => e.subpath === '.');
  if (!dot || !(desiredExports(root)['.'])) return { main: undefined, types: undefined };
  return { main: './' + dot.default, types: './' + dot.types };
}
export const desiredTypes = (root = ROOT) => desiredTopLevel(root).types;
export const desiredMain = (root = ROOT) => desiredTopLevel(root).main;

/** Every way package.json disagrees with the gate (stale-exclusion kind (b)). */
export function packageDrift(root = ROOT) {
  const pkg = loadJson(join(root, 'package.json'));
  const have = pkg.exports ?? {};
  const want = desiredExports(root);
  const top = desiredTopLevel(root);
  const out = [];
  for (const k of new Set([...Object.keys(have), ...Object.keys(want)]))
    if (JSON.stringify(have[k]) !== JSON.stringify(want[k]))
      out.push(`exports["${k}"]: have ${JSON.stringify(have[k])}, want ${JSON.stringify(want[k])}`);
  if (JSON.stringify(Object.keys(have)) !== JSON.stringify(Object.keys(want)) && !out.length)
    out.push(`exports key order: have ${Object.keys(have).join(',')}, want ${Object.keys(want).join(',')}`);
  for (const key of ['main', 'types'])
    if (pkg[key] !== top[key]) out.push(`"${key}": have ${JSON.stringify(pkg[key])}, want ${JSON.stringify(top[key])}`);
  return out;
}

function printReport(report) {
  if (!report.length) { console.log('excluded entries: none'); return; }
  console.log('excluded entries:');
  for (const x of report) {
    console.log(`  ${x.subpath}  ${x.reason}${x.stale ? '  [STALE: no seed file]' : ''}`);
    for (const f of x.seedFiles ?? []) console.log(`      seed: ${f.file}  owner: ${f.owner}  removed by ${f.removingReqFin}`);
  }
}

function main(argv) {
  const i = argv.indexOf('--root');
  const root = i >= 0 ? resolve(argv[i + 1]) : ROOT;
  const mode = argv.find((a, j) => a.startsWith('--') && a !== '--root' && argv[j - 1] !== '--root') ?? '--check';
  contractGaLines(root); // fail fast on an unreadable contract list

  if (mode === '--list-entries') {
    const { keep } = buildableEntries(root);
    console.log('exports (built):');
    for (const e of keep) console.log(`  ${e.subpath} -> ${e.default}`);
    printReport(exclusionReport(root));
    return 0;
  }
  if (mode === '--write') {
    const pkgPath = join(root, 'package.json');
    const old = loadJson(pkgPath);
    const top = desiredTopLevel(root);
    // Rebuild key order: exports, then main/types right after it when new
    // (existing keys keep their position).
    const pkg = {};
    for (const [k, v] of Object.entries(old)) {
      if ((k === 'main' || k === 'types') && top[k] === undefined) continue;
      pkg[k] = k === 'exports' ? desiredExports(root) : (k === 'main' || k === 'types') ? top[k] : v;
      if (k === 'exports') for (const key of ['main', 'types']) if (!(key in old) && top[key] !== undefined) pkg[key] = top[key];
    }
    if (!('exports' in old)) {
      pkg.exports = desiredExports(root);
      for (const key of ['main', 'types']) if (top[key] !== undefined) pkg[key] = top[key];
    }
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`generate-exports: wrote ${Object.keys(pkg.exports).length} exports` +
      (top.types ? `, main ${top.main}, types ${top.types}` : ', no main/types (\'.\' excluded)'));
    return 0;
  }
  if (mode !== '--check') { console.error(`generate-exports: unknown mode ${mode}`); return 2; }

  const report = exclusionReport(root);
  printReport(report);
  const stale = report.filter((x) => x.stale);
  const drift = packageDrift(root);
  for (const x of stale) console.error(`generate-exports: STALE EXCLUSION ${x.subpath} — ${x.reason} (no seed file; fix the manifest row or the source)`);
  if (drift.length) {
    console.error('generate-exports: STALE EXCLUSION — package.json disagrees with the gate (run --write):');
    for (const d of drift) console.error('  ' + d);
  }
  if (stale.length || drift.length) return 1;
  console.log('generate-exports: package.json exports/main/types match the gate');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname))
  process.exit(main(process.argv.slice(2)));
