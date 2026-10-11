#!/usr/bin/env node
/* scripts/docs/gen-props.mjs — PLAT-378 (REQ-PLAT-100, REQ-FIN-43). Extracts the
   public props of every exported component with the TypeScript compiler API.

   Types source (in this order):
     1. --tarball <aura-glass-*.tgz>, or the newest .artifacts/pack/aura-glass-<ver>.tgz:
        the tarball is extracted under .artifacts/docs/ and the program is built
        over the `types` .d.ts of every package.json export — the packed d.ts.
     2. otherwise (no pack in this job) the `source` file of every
        build/exports.manifest.json entry. `--require-packed` turns this
        fallback into an error; plat:build:docs runs with it so the committed
        reference is proven equal to the packed d.ts.

   A prop row is { name, type, required, default, description, deprecated }.
   Only props declared in the package itself are rows (HTML/React attributes
   inherited from node_modules types are not). Types are printed by the
   checker (instantiated generics, `| undefined` of optional props dropped).

     node scripts/docs/gen-props.mjs [--tarball <tgz>] [--require-packed]
   writes apps/docs/generated/props.json { <ComponentName>: PropRow[] }. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { GENERATED_DIR } from './paths.mjs';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const toPosix = (p) => p.split(sep).join('/');

export const COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  strict: true,
  skipLibCheck: true,
  resolveJsonModule: true,
  esModuleInterop: true,
  noEmit: true,
  types: [],
};

/** Newest packed aura-glass tarball in <root>/.artifacts/pack (null when the job has no pack). */
export function findPackedTarball(root) {
  const dir = join(root, '.artifacts/pack');
  if (!existsSync(dir)) return null;
  const tgz = readdirSync(dir).filter((f) => /^aura-glass-\d.*\.tgz$/.test(f)).sort();
  return tgz.length ? join(dir, tgz[tgz.length - 1]) : null;
}

/** `types` targets of a package.json exports map, keyed by subpath (CSS/JSON subpaths have none). */
export function exportTypes(exportsMap) {
  const out = [];
  const pick = (cond) => {
    if (typeof cond === 'string') return cond.endsWith('.d.ts') ? cond : null;
    if (!cond || typeof cond !== 'object') return null;
    if (typeof cond.types === 'string') return cond.types;
    for (const k of ['import', 'default', 'require']) { const t = pick(cond[k]); if (t) return t; }
    return null;
  };
  for (const [subpath, cond] of Object.entries(exportsMap ?? {})) {
    const t = pick(cond);
    if (t) out.push({ subpath, file: t });
  }
  return out.sort((a, b) => a.subpath.localeCompare(b.subpath));
}

/**
 * Resolve where types come from. Returns { kind: 'packed'|'source', entries:
 * [{subpath, file}], isOwn(fileName), describe, cleanup() }.
 */
export function resolveTypesSource({ root = ROOT, tarball = null, requirePacked = false } = {}) {
  const tgz = tarball ? resolve(tarball) : findPackedTarball(root);
  if (tgz) {
    if (!existsSync(tgz)) throw new Error(`tarball ${tgz} does not exist`);
    /* Extract under the repo so the package's peer imports (react, ...) resolve from <root>/node_modules. */
    const base = join(root, '.artifacts/docs');
    mkdirSync(base, { recursive: true });
    const tmp = mkdtempSync(join(base, 'pack-types-'));
    execFileSync('tar', ['-xzf', tgz, '-C', tmp]);
    const pkgJson = JSON.parse(readFileSync(join(tmp, 'package', 'package.json'), 'utf8'));
    const pkgDir = join(tmp, 'node_modules', pkgJson.name);
    mkdirSync(dirname(pkgDir), { recursive: true });
    renameSync(join(tmp, 'package'), pkgDir);
    const entries = exportTypes(pkgJson.exports).map((e) => ({ subpath: e.subpath, file: join(pkgDir, e.file) }));
    const missing = entries.filter((e) => !existsSync(e.file));
    if (missing.length) throw new Error(`packed types missing in ${tgz}: ${missing.map((e) => e.subpath).join(', ')}`);
    const own = pkgDir + sep;
    return {
      kind: 'packed', entries, describe: `packed d.ts of ${toPosix(relative(root, tgz))}`,
      isOwn: (f) => resolve(f).startsWith(own),
      cleanup: () => rmSync(tmp, { recursive: true, force: true }),
    };
  }
  if (requirePacked) throw new Error('--require-packed: no .artifacts/pack/aura-glass-*.tgz (run plat:package:pack first)');
  const manifestPath = join(root, 'build/exports.manifest.json');
  if (!existsSync(manifestPath)) throw new Error(`${toPosix(relative(root, manifestPath))} missing (run node scripts/build/generate-exports.mjs)`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const entries = manifest.entries
    .filter((e) => typeof e.source === 'string' && /\.tsx?$/.test(e.source))
    .map((e) => ({ subpath: e.subpath, file: join(root, e.source) }))
    .sort((a, b) => a.subpath.localeCompare(b.subpath));
  const missing = entries.filter((e) => !existsSync(e.file));
  if (missing.length) throw new Error(`manifest sources missing: ${missing.map((e) => toPosix(relative(root, e.file))).join(', ')}`);
  const src = join(root, 'src') + sep;
  return {
    kind: 'source', entries, describe: 'source entries of build/exports.manifest.json (no packed tarball in this job)',
    isOwn: (f) => resolve(f).startsWith(src),
    cleanup: () => {},
  };
}

/** One ts.Program over every entry file of a types source. */
export function createTypesProgram(source, { root = ROOT } = {}) {
  const options = { ...COMPILER_OPTIONS };
  if (source.kind === 'source') Object.assign(options, { baseUrl: root, paths: { '@/*': ['./src/*'] } });
  const program = ts.createProgram(source.entries.map((e) => e.file), options);
  return { program, checker: program.getTypeChecker() };
}

const resolveAlias = (checker, sym) => (sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym);

/** Export name → symbol for one entry module of the program. */
export function moduleExports(program, checker, file) {
  const sf = program.getSourceFile(file);
  const modSym = sf && checker.getSymbolAtLocation(sf);
  const out = new Map();
  if (!modSym) return out;
  for (const s of checker.getExportsOfModule(modSym)) out.set(s.getName(), s);
  return out;
}

/** True when the exported symbol has a runtime value (not a type-only export). */
export const isValueExport = (checker, sym) => Boolean(resolveAlias(checker, sym).flags & ts.SymbolFlags.Value);

/** The props type of a component export: first parameter of its call/construct signature (compound → `.Root`). */
export function componentPropsType(checker, sym) {
  const target = resolveAlias(checker, sym);
  const decl = target.valueDeclaration ?? target.declarations?.[0];
  if (!decl) return null;
  let type = checker.getTypeOfSymbolAtLocation(target, decl);
  for (let depth = 0; depth < 2; depth++) {
    const sigs = type.getCallSignatures().length ? type.getCallSignatures() : type.getConstructSignatures();
    if (sigs.length) {
      const param = sigs[0].getParameters()[0];
      return param ? checker.getTypeOfSymbolAtLocation(param, decl) : null;
    }
    const root = type.getProperty('Root');
    if (!root) return null;
    type = checker.getTypeOfSymbolAtLocation(root, decl);
  }
  return null;
}

const TYPE_FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
  | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType;

/* The checker adds `| undefined` to optional props; printing the whole type
   keeps aliases (ReactNode, Ref<T>, boolean) intact, so only that one
   trailing member is dropped. */
function propType(checker, prop, decl, optional) {
  const text = checker.typeToString(checker.getTypeOfSymbolAtLocation(prop, decl), undefined, TYPE_FLAGS);
  return optional ? unwrapParens(text.replace(/ \| undefined$/, '')) : text;
}

/** `((a: T) => void)` → `(a: T) => void` when one balanced pair wraps the whole text. */
export function unwrapParens(text) {
  if (!text.startsWith('(') || !text.endsWith(')')) return text;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    else if (text[i] === ')') { depth--; if (depth === 0 && i < text.length - 1) return text; }
  }
  return text.slice(1, -1);
}

/** Public prop rows of a props type; only props declared in the package's own files. */
export function propRows(checker, propsType, isOwn) {
  if (!propsType) return [];
  const members = propsType.isUnion() ? propsType.types : [propsType];
  const byName = new Map();
  for (const member of members) {
    for (const prop of checker.getPropertiesOfType(checker.getApparentType(member))) {
      const own = (prop.declarations ?? []).filter((d) => isOwn(d.getSourceFile().fileName));
      if (!own.length) continue;
      const name = prop.getName();
      const optional = Boolean(prop.flags & ts.SymbolFlags.Optional);
      const tags = prop.getJsDocTags(checker);
      const tag = (n) => tags.find((t) => t.name === n);
      const tagText = (t) => (t?.text ? ts.displayPartsToString(t.text).trim() : null);
      const row = {
        name,
        type: propType(checker, prop, own[0], optional).replace(/\s+/g, ' '),
        required: !optional,
        default: tagText(tag('default') ?? tag('defaultValue')),
        description: ts.displayPartsToString(prop.getDocumentationComment(checker)).trim().replace(/\s+/g, ' ') || null,
        deprecated: tag('deprecated') ? (tagText(tag('deprecated')) ?? '') : null,
      };
      const prev = byName.get(name);
      if (!prev) byName.set(name, { row, seen: 1 });
      else { prev.seen++; if (!prev.row.description && row.description) prev.row.description = row.description; }
    }
  }
  /* A union member that lacks a prop makes it optional for the union. */
  return [...byName.values()]
    .map(({ row, seen }) => (seen < members.length ? { ...row, required: false } : row))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Props for the requested components. `wanted` is [{ name, entry }] (entry =
 * S-35 subpath). Returns { props: {name: rows}, exported: {name: boolean} }.
 */
export function extractProps({ root = ROOT, source, wanted }) {
  const { program, checker } = createTypesProgram(source, { root });
  const fileOf = new Map(source.entries.map((e) => [e.subpath, e.file]));
  const exportsCache = new Map();
  const props = {}; const exported = {};
  for (const { name, entry } of wanted) {
    const file = fileOf.get(entry);
    if (!file) { exported[name] = false; continue; }
    if (!exportsCache.has(file)) exportsCache.set(file, moduleExports(program, checker, file));
    const sym = exportsCache.get(file).get(name);
    exported[name] = Boolean(sym && isValueExport(checker, sym));
    if (!exported[name]) continue;
    props[name] = propRows(checker, componentPropsType(checker, sym), source.isOwn);
  }
  return { props, exported };
}

/** Deterministic props.json text (every row keeps all of its keys). */
export const serializeProps = (props) => `${JSON.stringify(Object.fromEntries(Object.keys(props).sort().map((k) => [k, props[k]])), null, 2)}\n`;

export async function main(argv = process.argv.slice(2), root = ROOT) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const { loadMetas } = await import('./load-metas.mjs');
  const source = resolveTypesSource({ root, tarball: arg('--tarball'), requirePacked: argv.includes('--require-packed') });
  try {
    const { metas } = loadMetas(root);
    const { props } = extractProps({ root, source, wanted: metas.map((m) => ({ name: m.meta.name, entry: m.meta.entry })) });
    const dest = join(root, GENERATED_DIR, 'props.json');
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, serializeProps(props));
    console.log(`props.json: ${Object.keys(props).length} components from ${source.describe}`);
  } finally { source.cleanup(); }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().then((code) => process.exit(code), (err) => { console.error(`gen-props: ${err.message}`); process.exit(1); });
}
