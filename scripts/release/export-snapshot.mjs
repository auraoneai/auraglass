#!/usr/bin/env node
/* scripts/release/export-snapshot.mjs — REQ-PLAT-23. Builds a byte-stable
   snapshot of a packed tarball's public surface:

     node scripts/release/export-snapshot.mjs --tarball <pkg.tgz> [--out <path>] [--install]
     node scripts/release/export-snapshot.mjs --version <v> [--package aura-glass] [--out <path>] [--install]

   --version packs the published tarball (`npm pack aura-glass@<v>`). The
   tarball is unpacked into a temp project's node_modules; by default the temp
   project sits under the repo's node_modules/.cache so peers and dependencies
   resolve from the repo install, and --install runs `npm install` of the
   tarball in an isolated temp project instead (CI, published versions).

   Per exports key:
     runtime   sorted value names of `await import(spec)` with jsdom globals installed
     require   sorted names of `require(spec)` where a `require` condition exists
     types     sorted export names of the entry's `types` file (TypeScript
               compiler API: checker.getExportsOfModule, so `export *` and
               `export { … } from` are followed); typeValues = the value subset
     typesRuntimeMismatch  boolean: typeValues and runtime differ;
               mismatch[] names them as `types-only:X` / `runtime-only:Y`
     CSS/JSON (asset) keys: kind 'asset' and the resolved `file`.
   Requires Node >= 20.19. Pure JSON, deterministic ordering. Line-neutral. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ASSET_EXT = /\.(css|map|json)$/;
export const MIN_NODE = [20, 19];

export function nodeSupported(version = process.versions.node) {
  const [maj, min] = version.split('.').map(Number);
  return maj > MIN_NODE[0] || (maj === MIN_NODE[0] && min >= MIN_NODE[1]);
}

const sorted = (xs) => [...new Set(xs ?? [])].sort();

export function stableSnapshot(entries, meta = {}) {
  const out = { version: 1, ...meta, entries: {} };
  for (const key of Object.keys(entries).sort()) {
    const e = entries[key];
    if (e.kind === 'asset') { out.entries[key] = { kind: 'asset', file: e.file ?? null }; continue; }
    const row = {
      kind: e.kind ?? 'module',
      runtime: sorted(e.runtime),
      require: sorted(e.require),
      types: sorted(e.types),
      typeValues: sorted(e.typeValues),
      typesRuntimeMismatch: Boolean(e.typesRuntimeMismatch),
      mismatch: sorted(e.mismatch),
    };
    if (e.error) row.error = e.error;
    out.entries[key] = row;
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

/* Regex fallback (no TypeScript available): names declared in one d.ts file. */
export function dtsExportNames(text) {
  const names = new Set();
  for (const m of text.matchAll(/export\s+(?:declare\s+)?(?:const|let|var|function|class|interface|type|enum|namespace|abstract\s+class)\s+(\w+)/g)) names.add(m[1]);
  for (const m of text.matchAll(/export\s*\{([^}]*)\}(?!\s*from)/g)) {
    for (const part of m[1].split(',')) {
      const aliased = /\s+as\s+(\w+)$/.exec(part.trim());
      const t = (aliased ? aliased[1] : part.trim().replace(/^type\s+/, '')).trim();
      if (t) names.add(t);
    }
  }
  if (/export\s+default\b/.test(text)) names.add('default');
  return [...names].sort();
}

function loadTypeScript(root = ROOT) {
  try { return createRequire(join(root, 'package.json'))('typescript'); } catch { return null; }
}

/** Export names of a declaration file through the TypeScript compiler API:
    { names, values } (values = exports that carry a runtime value). */
export function dtsExports(dtsPath, { root = ROOT } = {}) {
  const ts = loadTypeScript(root);
  if (!ts) {
    const names = dtsExportNames(readFileSync(dtsPath, 'utf8'));
    return { names, values: names, compiler: false };
  }
  const program = ts.createProgram([dtsPath], {
    noEmit: true, skipLibCheck: true, types: [], target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowArbitraryExtensions: true, resolveJsonModule: true, jsx: ts.JsxEmit.ReactJSX,
  });
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(dtsPath);
  const mod = sf && checker.getSymbolAtLocation(sf);
  if (!mod) return { names: [], values: [], compiler: true };
  const names = []; const values = [];
  for (const sym of checker.getExportsOfModule(mod)) {
    const name = sym.getName();
    names.push(name);
    const typeOnlyDecl = (sym.declarations ?? []).some((d) => d.isTypeOnly || d.parent?.parent?.isTypeOnly
      || (ts.isImportSpecifier?.(d) && d.parent?.parent?.isTypeOnly));
    let target = sym;
    if (sym.flags & ts.SymbolFlags.Alias) { try { target = checker.getAliasedSymbol(sym); } catch { target = sym; } }
    if (!typeOnlyDecl && (target.flags & ts.SymbolFlags.Value)) values.push(name);
  }
  return { names: names.sort(), values: values.sort(), compiler: true };
}

// Unpack <pkg>.tgz into <tmp>/node_modules/<name>/.
export function extractTarball(tgz, tmp, { cwd = ROOT } = {}) {
  mkdirSync(tmp, { recursive: true });
  execFileSync('tar', ['-xzf', tgz, '-C', tmp], { cwd });
  const pkgDir = join(tmp, 'package');
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
  const dest = join(tmp, 'node_modules', pkg.name);
  mkdirSync(dirname(dest), { recursive: true });
  execFileSync('mv', [pkgDir, dest], { cwd });
  return { dir: dest, pkg };
}

// npm install of the tarball into an isolated temp project.
export function installTarball(tgz, tmp) {
  mkdirSync(tmp, { recursive: true });
  writeFileSync(join(tmp, 'package.json'), `${JSON.stringify({ name: 'ag-export-snapshot', private: true, version: '0.0.0' })}\n`);
  // npm installs peers too (react, react-dom …) so `import(spec)` resolves like
  // a consumer's; an unsatisfiable peer set falls back to --legacy-peer-deps,
  // and any entry that then fails to import records its error in the snapshot.
  const args = ['install', '--no-save', '--ignore-scripts', '--no-audit', '--no-fund', tgz];
  try { execFileSync('npm', args, { cwd: tmp, stdio: 'pipe' }); }
  catch { execFileSync('npm', [...args.slice(0, -1), '--legacy-peer-deps', tgz], { cwd: tmp, stdio: 'pipe' }); }
  const name = JSON.parse(execFileSync('tar', ['-xzOf', tgz, 'package/package.json'], { encoding: 'utf8' })).name;
  const dir = join(tmp, 'node_modules', name);
  return { dir, pkg: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) };
}

const RUNNER = `import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const [specDir, spec, jsdomPath, withRequire] = process.argv.slice(2);
if (jsdomPath) {
  try {
    const { JSDOM } = (await import(pathToFileURL(jsdomPath).href)).default ?? await import(pathToFileURL(jsdomPath).href);
    const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/', pretendToBeVisual: true });
    const w = dom.window;
    const keys = ['window', 'document', 'navigator', 'location', 'HTMLElement', 'HTMLDivElement', 'HTMLInputElement', 'HTMLCanvasElement',
      'HTMLVideoElement', 'HTMLMediaElement', 'SVGElement', 'Element', 'Node', 'Text', 'DocumentFragment', 'CustomEvent', 'Event',
      'KeyboardEvent', 'MouseEvent', 'PointerEvent', 'FocusEvent', 'MutationObserver', 'DOMParser', 'getComputedStyle', 'localStorage',
      'sessionStorage', 'requestAnimationFrame', 'cancelAnimationFrame', 'Image', 'CSS', 'customElements', 'matchMedia'];
    for (const k of keys) {
      if (k in globalThis && k !== 'window' && k !== 'document') continue;
      const v = w[k]; if (v === undefined) continue;
      try { Object.defineProperty(globalThis, k, { configurable: true, writable: true, value: typeof v === 'function' && !/^[A-Z]/.test(k) ? v.bind(w) : v }); } catch {}
    }
    if (!globalThis.matchMedia) globalThis.matchMedia = () => ({ matches: false, media: '', addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    if (!globalThis.ResizeObserver) globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    if (!globalThis.IntersectionObserver) globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
    if (!w.matchMedia) w.matchMedia = globalThis.matchMedia;
  } catch (e) { console.error('jsdom unavailable: ' + (e && e.message)); }
}
const out = { ok: true, names: [], require: null };
try {
  const mod = await import(spec);
  out.names = Object.keys(mod).filter((n) => n !== '__esModule').sort();
} catch (e) { out.ok = false; out.error = String(e && e.message || e).split('\\n')[0]; }
if (withRequire === '1') {
  try { out.require = Object.keys(createRequire(specDir + '/package.json')(spec)).filter((n) => n !== '__esModule').sort(); }
  catch (e) { out.require = []; out.requireError = String(e && e.message || e).split('\\n')[0]; }
}
console.log(JSON.stringify(out));
process.exit(0);
`;

function jsdomPath(root = ROOT) {
  try { return createRequire(join(root, 'package.json')).resolve('jsdom'); } catch { return ''; }
}

export function runtimeNames(spec, pkgDir, { cwd = ROOT, withRequire = false } = {}) {
  const runner = join(pkgDir, '.snapshot-runner.mjs');
  writeFileSync(runner, RUNNER);
  const scrub = (s) => String(s).split(dirname(dirname(pkgDir))).join('<tmp>').slice(0, 300);
  try {
    const out = execFileSync(process.execPath, [runner, pkgDir, spec, jsdomPath(cwd), withRequire ? '1' : '0'],
      { cwd: dirname(pkgDir), encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
    const j = JSON.parse(out.trim().split('\n').pop());
    return { names: j.ok ? j.names : [], error: j.ok ? null : scrub(j.error), require: j.require, requireError: j.requireError ? scrub(j.requireError) : null };
  } catch (e) { return { names: [], error: scrub(e.message), require: withRequire ? [] : null }; }
  finally { try { rmSync(runner); } catch { /* ignore */ } }
}

// First string target of an exports condition (nested conditions allowed).
function conditionTarget(cond, keys = ['types', 'import', 'default', 'require']) {
  if (typeof cond === 'string') return cond;
  if (!cond || typeof cond !== 'object') return null;
  for (const k of keys) if (k in cond) { const t = conditionTarget(cond[k], keys); if (t) return t; }
  return null;
}

/** Snapshot rows for an unpacked package directory. */
export function snapshotPackageDir(pkgDir, pkg, { cwd = ROOT } = {}) {
  const entries = {};
  for (const [key, cond] of Object.entries(pkg.exports ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
    if (key.includes('*')) continue; // pattern keys have no single spec
    const spec = `${pkg.name}${key === '.' ? '' : key.slice(1)}`;
    const types = cond && typeof cond === 'object' ? conditionTarget(cond.types, ['default', 'import', 'require']) : null;
    const runtimeTarget = conditionTarget(cond, ['import', 'default', 'require', 'node']);
    if (typeof cond === 'string' || (!types && runtimeTarget && ASSET_EXT.test(runtimeTarget)) || (cond && typeof cond === 'object' && 'css' in cond && !types)) {
      entries[key] = { kind: 'asset', file: conditionTarget(cond, ['style', 'css', 'import', 'default', 'require']) };
      continue;
    }
    if (!cond || typeof cond !== 'object') continue;
    const e = { kind: 'module', runtime: [], require: [], types: [], typeValues: [] };
    if (types) {
      const dts = join(pkgDir, types);
      if (existsSync(dts)) { const t = dtsExports(dts, { root: cwd }); e.types = t.names; e.typeValues = t.values; }
      else e.error = `types file ${types} missing`;
    }
    const rt = runtimeNames(spec, pkgDir, { cwd, withRequire: 'require' in cond });
    e.runtime = rt.names;
    if (rt.error) e.error = rt.error;
    if ('require' in cond) e.require = rt.require ?? [];
    if (types) {
      const t = new Set(e.typeValues); const r = new Set(e.runtime);
      e.mismatch = [
        ...[...t].filter((n) => !r.has(n)).map((n) => `types-only:${n}`),
        ...[...r].filter((n) => !t.has(n)).map((n) => `runtime-only:${n}`),
      ].sort();
      e.typesRuntimeMismatch = e.mismatch.length > 0;
    } else { e.mismatch = []; e.typesRuntimeMismatch = false; }
    entries[key] = e;
  }
  return entries;
}

function defaultTmpBase(cwd) {
  const nm = join(cwd, 'node_modules');
  if (!existsSync(nm)) return tmpdir();
  const dir = join(nm, '.cache', 'export-snapshot');
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function snapshotTarball(tgz, { cwd = ROOT, keep = false, tmpBase = null, install = false } = {}) {
  if (!nodeSupported()) throw new Error(`export-snapshot needs Node >= ${MIN_NODE.join('.')} (running ${process.versions.node})`);
  const tmp = mkdtempSync(join(install ? tmpdir() : (tmpBase ?? defaultTmpBase(cwd)), '.snapshot-'));
  try {
    const { dir: pkgDir, pkg } = install ? installTarball(resolve(tgz), tmp) : extractTarball(resolve(tgz), tmp, { cwd });
    const entries = snapshotPackageDir(pkgDir, pkg, { cwd });
    return { json: stableSnapshot(entries, { package: `${pkg.name}@${pkg.version}` }), entries };
  } finally { if (!keep) rmSync(tmp, { recursive: true, force: true }); }
}

/** Snapshot of a published version: `npm pack <name>@<version>`. */
export function snapshotPublished(version, { name = 'aura-glass', cwd = ROOT, install = true, exec = execFileSync } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-pack-'));
  try {
    const packed = JSON.parse(exec('npm', ['pack', `${name}@${version}`, '--json', '--pack-destination', dir], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    return snapshotTarball(join(dir, packed[0].filename), { cwd, install });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

export function main(argv = process.argv.slice(2), { cwd = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const tgz = arg('--tarball'); const version = arg('--version'); const out = arg('--out');
  if (!tgz && !version) { console.error('usage: export-snapshot.mjs (--tarball <pkg.tgz> | --version <v>) [--out <path>] [--install]'); return 2; }
  if (!nodeSupported()) { console.error(`export-snapshot: Node >= ${MIN_NODE.join('.')} required (running ${process.versions.node})`); return 2; }
  const { json } = version
    ? snapshotPublished(version, { name: arg('--package') ?? 'aura-glass', cwd, install: true })
    : snapshotTarball(tgz, { cwd, install: argv.includes('--install') });
  if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, json); console.log(`export-snapshot: wrote ${out}`); }
  else process.stdout.write(json);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
