/* scripts/docs/load-metas.mjs — PLAT-378 (REQ-PLAT-100, REQ-FIN-43). Loads every
   src/**\/<Name>.meta.ts (S-31) without building the library: each file is
   transpiled with the TypeScript compiler and evaluated in a sandbox whose only
   permitted runtime import is `defineMeta` from src/foundation (identity at
   runtime). Any other runtime import fails the run instead of being guessed. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

/** kebab-case slug (AppShell → app-shell); the same rule the docs app uses for /components/<slug>. */
export const slugify = (name) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const toPosix = (p) => p.split(sep).join('/');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (name === 'node_modules' || name.startsWith('.') || name === '__tests__') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else if (name.endsWith('.meta.ts')) out.push(p);
  }
  return out;
}

/** Transpile one meta module to CommonJS and evaluate it; only the foundation import is allowed. */
export function evalMetaModule(file) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  });
  const module = { exports: {} };
  const foundation = { defineMeta: (m) => m };
  const require = (spec) => {
    if (/(^|\/)foundation(\/index)?$/.test(spec)) return foundation;
    throw new Error(`${file}: runtime import '${spec}' is not allowed in a *.meta.ts (S-31)`);
  };
  vm.runInNewContext(outputText, { module, exports: module.exports, require }, { filename: file });
  return module.exports;
}

const isMeta = (v) => Boolean(v) && typeof v === 'object' && typeof v.name === 'string' && typeof v.entry === 'string'
  && typeof v.tier === 'string' && Array.isArray(v.parts);

/**
 * Every meta under <root>/src. When two metas declare the same export name, the
 * one under the entry's own source directory (entry './data' → src/data/) is
 * kept and the other is reported in `conflicts`; an unresolvable duplicate throws.
 */
export function loadMetas(root) {
  const rows = [];
  for (const file of walk(join(root, 'src'))) {
    for (const value of new Set(Object.values(evalMetaModule(file)))) {
      if (isMeta(value)) rows.push({ meta: value, file: toPosix(relative(root, file)) });
    }
  }
  const home = (r) => (r.meta.entry === '.' ? null : `src/${r.meta.entry.replace(/^\.\//, '')}/`);
  const byName = new Map();
  const conflicts = [];
  for (const r of rows.sort((a, b) => a.file.localeCompare(b.file))) {
    const prev = byName.get(r.meta.name);
    if (!prev) { byName.set(r.meta.name, r); continue; }
    const h = home(r);
    if (!h || r.file.startsWith(h) === prev.file.startsWith(h)) {
      throw new Error(`duplicate meta '${r.meta.name}' in ${prev.file} and ${r.file} with no entry-directory owner to prefer`);
    }
    const keep = r.file.startsWith(h) ? r : prev;
    conflicts.push({ name: r.meta.name, kept: keep.file, dropped: keep === r ? prev.file : r.file });
    byName.set(r.meta.name, keep);
  }
  return { metas: [...byName.values()].sort((a, b) => a.meta.name.localeCompare(b.meta.name)), conflicts };
}
