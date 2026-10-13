/* Shared module-graph helpers for the 5.0 build gates (PLAT-242..298).
   Everything here is a static scan over src/: no bundler, no network. */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, posix, sep } from 'node:path';
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

/** Server graph: files reachable from entryFile without following imports of
   a 'use client'-headed module (the client boundary ends the server walk but
   the boundary file itself counts as reached). */
export function serverClosure(entryFile, { within = SRC } = {}) {
  const seen = new Set();
  const stack = [entryFile];
  while (stack.length) {
    const f = stack.pop();
    if (!f || seen.has(f)) continue;
    seen.add(f);
    const head = readFileSync(f, 'utf8').slice(0, 1200);
    if (/^\s*(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*\n|\s)*['"]use client['"]/.test(head)) continue; // boundary: reached, but its imports are client-side
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

/** Files in the entry's src closure whose line-1 header declares the seed.
 *  `root` scopes the closure to `<root>/src` (fixture roots in tests). */
export function closureSeedFiles(entryFile, root = ROOT) {
  const out = [];
  for (const f of importClosure(entryFile, { within: join(root, 'src') })) if (fileIsSeed(f)) out.push(f);
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

/** subpath -> ga line, read from the frozen contract list ENTRIES in
 *  `<root>/src/contracts/entries.ts` (EntrySpec.ga). build/exports.manifest.json
 *  is generated verbatim from ENTRIES and its schema has no `ga` field, so the
 *  contract file is the single source of the GA line. A static scan (no TS
 *  toolchain): every `{ subpath: '…', … ga: '…' … }` row. Throws when the file
 *  exists but yields no rows, so a contract reshape fails loudly instead of
 *  silently shipping a 5.1 entry on 5.0.x. */
export function contractGaLines(root = ROOT) {
  const file = join(root, 'src', 'contracts', 'entries.ts');
  const out = new Map();
  if (!existsSync(file)) return out;
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf('ENTRIES');
  const body = start === -1 ? '' : text.slice(start);
  for (const m of body.matchAll(/\{\s*subpath:\s*'([^']+)'[^{}]*?\bga:\s*'([^']+)'/g)) out.set(m[1], m[2]);
  if (!out.size) throw new Error(`graph.mjs: no ENTRIES rows with subpath/ga found in ${file}`);
  return out;
}

/** EntrySpec.ga marks the first GA line that ships the entry; on an earlier
 *  package version the entry is dropped entirely (e.g. ga:'5.1' on 5.0.x).
 *  Returns null when the entry is eligible on `version`. */
export function gaGate(e, version) {
  if (!e.ga || !version) return null;
  const [maj, min] = String(version).split('.');
  const [gmaj, gmin] = String(e.ga).split('.');
  if (Number.isNaN(+maj) || Number.isNaN(+min) || Number.isNaN(+gmaj) || Number.isNaN(+gmin)) return null;
  return (+gmaj * 1000 + +gmin) > (+maj * 1000 + +min) ? `ga:'${e.ga}' > ${maj}.${min} (ships on ${e.ga}.x)` : null;
}

/** REQ-PLAT-66: dist/contracts/ is the declaration-only contract namespace
 *  (tests/exports/no-foundation-types.test.ts). Runtime contract constants that
 *  implementation modules import by value (SPRINGS, STORAGE_KEY, …) are emitted
 *  as internal modules under dist/internal/contracts/ instead, so no runtime js
 *  sits beside the public contract types. Maps a tsdown chunk name
 *  ('contracts/motion') to its dist path stem ('internal/contracts/motion'). */
export const CONTRACTS_RUNTIME_DIR = 'internal/contracts';
/** REQ-CMP-01 / REQ-PLAT-66: the private CMP foundation namespace (src/foundation/**)
 *  has no package entry and no public type surface. Its runtime modules are emitted
 *  under dist/internal/cmp/ with their declarations moved beside them (post.mjs), so
 *  no dist/foundation/ declaration ships while every emitted js keeps a d.ts twin. */
export const FOUNDATION_RUNTIME_DIR = 'internal/cmp';
export function distChunkStem(name) {
  if (name === 'contracts' || name.startsWith('contracts/')) return `internal/${name}`;
  if (name === 'foundation') return FOUNDATION_RUNTIME_DIR;
  if (name.startsWith('foundation/')) return `${FOUNDATION_RUNTIME_DIR}/${name.slice('foundation/'.length)}`;
  return name;
}

/** The Base UI seam (src/foundation/base-ui/<part>.ts) is one
 *  `export { X } from '@base-ui/react/<part>'` per module: a source-level pin and
 *  confinement point. At build time an import of a seam module is the import of
 *  its external target, so the bundler resolves it there and no seam module (whose
 *  declaration would be a bare Base UI re-export) is emitted. Returns the external
 *  specifier, or null when `file` is not a pure seam re-export. */
export const BASE_UI_SEAM_DIR = join(SRC, 'foundation', 'base-ui');
export function seamReexportTarget(file) {
  if (!file.startsWith(BASE_UI_SEAM_DIR + sep)) return null;
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { return null; }
  const body = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').trim();
  const m = /^export\s*\{([^}]*)\}\s*from\s*['"](@base-ui\/[^'"]+)['"];?$/.exec(body);
  if (!m || /\bas\b/.test(m[1])) return null; // only same-name re-exports are equivalent
  return m[2];
}

/** Contract-declared pattern subpaths, keyed by their base entry (ENTRIES
 *  './icons' row: "+ './icons/<name>' pattern"). `sourceDir` holds the modules
 *  the pattern resolves to: every top-level `<sourceDir>/<name>.ts` with a
 *  sibling `<name>/` directory is a category barrel reachable as
 *  `<base>/<name>` through the pattern row. */
export const PATTERN_EXPORTS = {
  './icons': {
    subpath: './icons/*',
    cond: { types: './dist/icons/*.d.ts', default: './dist/icons/*.js' },
    sourceDir: 'src/icons',
  },
};

/** Build entries behind the pattern rows of shipped base entries. The manifest
 *  only lists the base entry ('./icons'); a bundler in unbundle mode may fold a
 *  pure re-export barrel into its importer, so the pattern targets
 *  (dist/icons/<cat>.js) are emitted only when they are entries themselves.
 *  Returns manifest-shaped rows { subpath, source, types, default, pattern }. */
export function patternEntries(keep, root = ROOT) {
  const out = [];
  for (const base of keep) {
    const pat = PATTERN_EXPORTS[base.subpath];
    if (!pat) continue;
    const dir = join(root, pat.sourceDir);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      const m = /^([^.]+)\.tsx?$/.exec(name);
      if (!m || m[1] === 'index') continue;
      if (!existsSync(join(dir, m[1])) || !statSync(join(dir, m[1])).isDirectory()) continue;
      const source = posix.join(pat.sourceDir, name);
      if (closureSeedFiles(join(root, source), root).length) continue;
      out.push({
        subpath: base.subpath + '/' + m[1],
        source,
        types: pat.cond.types.replace('*', m[1]).replace(/^\.\//, ''),
        default: pat.cond.default.replace('*', m[1]).replace(/^\.\//, ''),
        pattern: pat.subpath,
      });
    }
  }
  return out;
}

/** In-repo composition modules (REQ-CMP-06 / REQ-SURF-124): shipped modules
 *  that also export internal parts whose only consumers are in-repo stories
 *  and compositions importing them by relative path (`SourceScope` for
 *  Sources.stories, `ComboboxLoading` for the Combobox stories). No public
 *  entry re-exports those parts, so unbundle tree-shaking drops them from
 *  the module's dist twin — while its d.ts (tsc, per-file) still declares
 *  them, and the dist-backed Storybook build (REQ-QUAL-56) redirects the
 *  story's relative import to that twin and fails to bind the name. Listing
 *  the module as a tsdown entry of its own preserves its full export
 *  signature in the twin (the same mechanism as patternEntries); it stays
 *  unnamed in the manifest and in package.json `exports`. */
export const INTERNAL_COMPOSITION_MODULES = [
  'src/ai/sources/SourceList.tsx',
  'src/components/combobox/Combobox.client.tsx',
  // Modules whose in-repo-only exports are imported cross-module inside src
  // (color maths, control sizes, container breakpoints, the motion ticker,
  // generated token tables): without entry status rolldown shakes those
  // exports from the dist chunk while the d.ts still declares them, which
  // breaks the dist-backed Storybook build (REQ-QUAL-56) at the first
  // importing module it reaches.
  'src/components/color-picker/colors.ts',
  'src/components/control-shared/size.ts',
  'src/data/filter-bar/filter-model.ts',
  'src/date/legacy-bridge.ts',
  'src/date/useContainerWidth.ts',
  'src/motion/ticker.ts',
  'src/motion/tokens.generated.ts',
  'src/theme/color.ts',
  'src/tokens/generated/presets.ts',
];

/** tsdown entries for INTERNAL_COMPOSITION_MODULES that a shipped (`keep`)
 *  entry already reaches with a seed-free closure. Returns rows shaped
 *  `{ source, internal: true }` — no subpath, so generate-exports and
 *  verify-artifact (which iterate keep + patternEntries only) never see them. */
export function internalCompositionEntries(keep, root = ROOT) {
  const out = [];
  const keepSources = new Set((keep ?? []).map((e) => e.source));
  let reachableFiles = null; // union of the keep closures, computed on first candidate
  for (const source of INTERNAL_COMPOSITION_MODULES) {
    if (keepSources.has(source)) continue; // already an entry of its own
    const file = join(root, source);
    if (!existsSync(file)) continue;
    if (closureSeedFiles(file, root).length) continue;
    if (!reachableFiles) {
      reachableFiles = new Set();
      for (const e of keep ?? []) for (const f of importClosure(join(root, e.source), { within: join(root, 'src') })) reachableFiles.add(f);
    }
    if (reachableFiles.has(file)) out.push({ source, internal: true });
  }
  return out;
}

/** Entries whose src closure is seed-free (the pre-release filter of §5.2.3 / PLAT-242).
 *  pending rows carry seedFiles[] (the files whose line-1 header declares the seed)
 *  or a missing-source reason. */
export function buildableEntries(root = ROOT) {
  const { js } = manifestEntries(root);
  const version = loadJson(join(root, 'package.json')).version;
  const ga = contractGaLines(root);
  const keep = [];
  const pending = [];
  for (const row of js) {
    const e = ga.has(row.subpath) ? { ...row, ga: ga.get(row.subpath) } : row;
    const drop = gaGate(e, version);
    if (drop) { pending.push({ ...e, reason: drop, gaDropped: true }); continue; }
    const src = join(root, e.source);
    if (!existsSync(src)) { pending.push({ ...e, reason: `missing source ${e.source}` }); continue; }
    const seedFiles = closureSeedFiles(src, root);
    if (seedFiles.length) pending.push({ ...e, reason: 'import graph contains @ag-contract-seed', seedFiles });
    else keep.push(e);
  }
  return { keep, pending };
}
