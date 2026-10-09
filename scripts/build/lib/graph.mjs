/* Shared module-graph helpers for the 5.0 build gates (PLAT-242..298).
   Everything here is a static scan over src/: no bundler, no network. */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, posix } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
export const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '../../..');
export const SRC = join(ROOT, 'src');
export const DIST = join(ROOT, 'dist');

const IMPORT_RE = /(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;
const RESOLVE_EXTS = ['.ts', '.tsx', '.js', '.mjs', '.jsx', '.d.ts', '.css'];

/** Resolve a specifier to an absolute file path, or null when external/unresolvable. */
export function resolveSpecifier(spec, fromFile) {
  if (spec.startsWith('@/')) spec = './' + spec.slice(2); // tsconfig path alias -> src/*
  let base;
  if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec);
  else if (spec.startsWith('aura-glass/')) base = join(SRC, spec.slice('aura-glass/'.length), 'index.ts');
  else if (spec === 'aura-glass') base = join(SRC, 'index.ts');
  else return null;
  for (const ext of RESOLVE_EXTS) if (existsSync(base + ext)) return base + ext;
  for (const ext of RESOLVE_EXTS) if (existsSync(join(base, 'index' + ext))) return join(base, 'index' + ext);
  if (existsSync(base) && statSync(base).isFile()) return base;
  return null;
}

export function specifiersOf(file) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { return []; }
  const out = [];
  for (const m of text.matchAll(IMPORT_RE)) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

/** The transitive import closure of `entry`, restricted to src/** (and optionally dist). */
export function importClosure(entryFile, { within = SRC } = {}) {
  const seen = new Set();
  const stack = [entryFile];
  while (stack.length) {
    const f = stack.pop();
    if (!f || seen.has(f)) continue;
    seen.add(f);
    for (const spec of specifiersOf(f)) {
      const r = resolveSpecifier(spec, f);
      if (r && r.startsWith(within)) stack.push(r);
    }
  }
  return seen;
}

/** A file is seed-marked only via a line-1 header: `/^\/[*\/] @ag-contract-seed:/`
 *  (`/* @ag-contract-seed:` or `// @ag-contract-seed:`). Mid-file mentions of the
 *  marker (rule references in comments, docs) are not seeds (REQ-FIN-06). */
export const SEED_HEADER_RE = /^\/[*\/] @ag-contract-seed:/;

export function fileIsSeed(file) {
  try {
    const text = readFileSync(file, 'utf8');
    const nl = text.indexOf('\n');
    return SEED_HEADER_RE.test(nl === -1 ? text : text.slice(0, nl));
  } catch { return false; }
}

/** Files in the entry's src closure whose line-1 header declares the seed. */
export function closureSeedFiles(entryFile) {
  const out = [];
  for (const f of importClosure(entryFile)) if (fileIsSeed(f)) out.push(f);
  return out.sort();
}

/** True when any file in the entry's src closure carries the seed marker. */
export function closureHasSeed(entryFile) {
  return closureSeedFiles(entryFile).length > 0;
}

export function walk(dir, filter = () => true) {
  const out = [];
  if (!existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const s = statSync(p);
      if (s.isDirectory()) stack.push(p);
      else if (filter(p)) out.push(p);
    }
  }
  return out.sort();
}

export function rel(file) { return posix.join(...relative(ROOT, file).split(require('node:path').sep)); }

export function loadJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }

/** Manifest entries; `js` = buildable sources, `asset` = css/deprecations/package.json rows. */
export function manifestEntries(root = ROOT) {
  const manifest = loadJson(join(root, 'build', 'exports.manifest.json'));
  const entries = manifest.entries ?? manifest;
  const js = [];
  const asset = [];
  for (const e of entries) {
    if (e.source === 'build:css' || e.source === 'build:deprecations' || e.source === 'package.json') asset.push(e);
    else js.push(e);
  }
  return { entries, js, asset };
}

/** entries[].ga marks the first GA line that ships the entry; on an earlier
 *  package version the entry is dropped entirely (e.g. ga:'5.1' on 5.0.x).
 *  Returns null when the entry is eligible on `version`. */
export function gaGate(e, version) {
  if (!e.ga || !version) return null;
  const [maj, min] = String(version).split('.');
  const [gmaj, gmin] = String(e.ga).split('.');
  if (Number.isNaN(+maj) || Number.isNaN(+min) || Number.isNaN(+gmaj) || Number.isNaN(+gmin)) return null;
  return (+gmaj * 1000 + +gmin) > (+maj * 1000 + +min) ? `ga:'${e.ga}' > ${maj}.${min} (ships on ${e.ga}.x)` : null;
}

/** Entries whose src closure is seed-free (the pre-release filter of §5.2.3 / PLAT-242).
 *  pending rows carry seedFiles[] (the files whose line-1 header declares the seed)
 *  or a missing-source reason. */
export function buildableEntries(root = ROOT) {
  const { js } = manifestEntries(root);
  const version = loadJson(join(root, 'package.json')).version;
  const keep = [];
  const pending = [];
  for (const e of js) {
    const drop = gaGate(e, version);
    if (drop) { pending.push({ ...e, reason: drop, gaDropped: true }); continue; }
    const src = join(root, e.source);
    if (!existsSync(src)) { pending.push({ ...e, reason: `missing source ${e.source}` }); continue; }
    const seedFiles = closureSeedFiles(src);
    if (seedFiles.length) pending.push({ ...e, reason: 'import graph contains @ag-contract-seed', seedFiles });
    else keep.push(e);
  }
  return { keep, pending };
}
