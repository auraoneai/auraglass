#!/usr/bin/env node
/* scripts/release/export-snapshot.mjs — REQ-PLAT-24/AC-PLAT-23-snapshot. Builds a
   byte-stable snapshot of a packed tarball's public surface:

     node scripts/release/export-snapshot.mjs --tarball <pkg.tgz> [--out <path>]

   Per exports key: runtime names (import of the spec with jsdom globals shimmed),
   require names (createRequire where a `require` condition exists), types names
   (parsed from the `types` .d.ts), asset kind for css/map/json entries, and a
   typesRuntimeMismatch list (names in `types` but not `runtime` and vice versa).
   Pure JSON, deterministic ordering. Line-neutral: lands on release/4.x. */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSET_EXT = /\.(css|map|json|d\.ts)$/;

export function stableSnapshot(entries, meta = {}) {
  const out = { version: 1, ...meta, entries: {} };
  for (const key of Object.keys(entries).sort()) {
    const e = entries[key];
    out.entries[key] = {
      kind: e.kind,
      runtime: [...(e.runtime ?? [])].sort(),
      require: [...(e.require ?? [])].sort(),
      types: [...(e.types ?? [])].sort(),
      typesRuntimeMismatch: [...(e.typesRuntimeMismatch ?? [])].sort(),
    };
  }
  return `${JSON.stringify(out, null, 2)}\n`;
}

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

// Extract <pkg>.tgz into <tmp>/node_modules/<name>/ so repo parent node_modules
// resolve its peers.
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

const RUNNER = `// jsdom-lite globals so importing UI entrypoints in the snapshot runner
// doesn't explode on bare DOM references (REQ-PLAT-23).
globalThis.window ??= globalThis;
globalThis.document ??= { createElement: () => ({ style: {}, appendChild() {}, setAttribute() {} }), createElementNS: () => ({ style: {} }), body: { appendChild() {} }, head: { appendChild() {} }, documentElement: { style: {} }, querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, removeEventListener() {} };
globalThis.navigator ??= { userAgent: 'export-snapshot-runner' };
globalThis.HTMLElement ??= class {}; globalThis.SVGElement ??= class {};
globalThis.customElements ??= { define() {}, get: () => undefined, whenDefined: () => Promise.resolve() };
globalThis.requestAnimationFrame ??= (f) => setTimeout(f, 0);
globalThis.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} };
globalThis.MutationObserver ??= class { observe() {} disconnect() {} };
import { createRequire } from 'node:module';
const [specDir, spec, typesFile] = process.argv.slice(2);
const req = createRequire(specDir + '/package.json');
try {
  const mod = await import(spec);
  const names = Object.keys(mod).sort();
  console.log(JSON.stringify({ ok: true, names }));
} catch (e) { console.log(JSON.stringify({ ok: false, error: String(e && e.message || e) })); }
`;

export function runtimeNames(spec, pkgDir, { cwd = ROOT } = {}) {
  const runner = join(pkgDir, '.snapshot-runner.mjs');
  writeFileSync(runner, RUNNER);
  try {
    const out = execFileSync(process.execPath, [runner, pkgDir, spec], { cwd: dirname(pkgDir), encoding: 'utf8', timeout: 30000 });
    const j = JSON.parse(out.trim().split('\n').pop());
    return j.ok ? j.names : { error: j.error };
  } catch (e) { return { error: String(e.message).slice(0, 200) }; }
  finally { try { rmSync(runner); } catch { /* ignore */ } }
}

export function requireNames(spec, pkgDir, cond) {
  try {
    const reqMod = createRequire(join(pkgDir, 'package.json'));
    const target = cond.require ?? cond.default;
    if (!target) return [];
    const mod = reqMod(join(pkgDir, target));
    return Object.keys(mod).sort();
  } catch { return []; }
}

export function snapshotTarball(tgz, { cwd = ROOT, keep = false, tmpBase = null } = {}) {
  const tmp = mkdtempSync(join(tmpBase ?? tmpdir(), '.snapshot-'));
  try {
    const { dir: pkgDir, pkg } = extractTarball(resolve(tgz), tmp, { cwd });
    const entries = {};
    for (const [key, cond] of Object.entries(pkg.exports ?? {}).sort(([a], [b]) => a.localeCompare(b))) {
      if (typeof cond === 'string') {
        entries[key] = { kind: 'asset', runtime: [], require: [], types: [], typesRuntimeMismatch: [] };
        continue;
      }
      if (typeof cond !== 'object' || cond === null) continue;
      const target = cond.types ?? cond.default ?? cond.import ?? cond.require;
      const spec = `${pkg.name}${key === '.' ? '' : key.slice(1)}`;
      if (typeof target === 'string' && ASSET_EXT.test(target) && !cond.types) {
        entries[key] = { kind: 'asset' };
        continue;
      }
      const e = { kind: 'module', runtime: [], require: [], types: [], typesRuntimeMismatch: [] };
      if (cond.types) {
        const dts = join(pkgDir, cond.types);
        if (existsSync(dts)) e.types = dtsExportNames(readFileSync(dts, 'utf8'));
      }
      const rt = runtimeNames(spec, pkgDir, { cwd });
      e.runtime = Array.isArray(rt) ? rt : [];
      if (!Array.isArray(rt)) e.error = rt.error;
      if (cond.require) e.require = requireNames(spec, pkgDir, cond);
      const t = new Set(e.types); const r = new Set(e.runtime);
      e.typesRuntimeMismatch = [
        ...[...t].filter((n) => !r.has(n)).map((n) => `types-only:${n}`),
        ...[...r].filter((n) => !t.has(n)).map((n) => `runtime-only:${n}`),
      ].sort();
      entries[key] = e;
    }
    return { json: stableSnapshot(entries, { package: `${pkg.name}@${pkg.version}` }), entries };
  } finally { if (!keep) rmSync(tmp, { recursive: true, force: true }); }
}

export function main(argv = process.argv.slice(2)) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const tgz = arg('--tarball'); const out = arg('--out');
  if (!tgz) { console.error('usage: export-snapshot.mjs --tarball <pkg.tgz> [--out <path>]'); return 2; }
  const { json } = snapshotTarball(tgz);
  if (out) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, json); console.log(`export-snapshot: wrote ${out}`); }
  else process.stdout.write(json);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(main());
