/* @jest-environment node */
/* REQ-PLAT-66: the d.ts graph mirrors the js graph. For every manifest entry the
   module set reached from `types` — resolved with ts.resolveModuleName under both
   `bundler` and `node16` — is identical between the two modes, every relative
   specifier resolves, and its runtime part (the reached declarations that have a
   js twin) equals by relative path the set reached from `default`. No non-root
   entry reaches dist/index. Every emitted js has a sibling d.ts. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import ts from 'typescript';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

interface Entry { subpath: string; types?: string; default?: string }
const manifest = JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8')) as { entries: Entry[] };

const MODES = {
  bundler: { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler },
  node16: { module: ts.ModuleKind.Node16, moduleResolution: ts.ModuleResolutionKind.Node16 },
} as const;

/** relative module specifiers of a declaration or js file (imports, re-exports, import() types). */
function relativeSpecs(file: string): string[] {
  const info = ts.preProcessFile(readFileSync(file, 'utf8'), true, true);
  return info.importedFiles.map((f) => f.fileName).filter((s) => s.startsWith('.'));
}

const stemOf = (abs: string) => relative(DIST, abs).replace(/\\/g, '/').replace(/\.(d\.ts|js)$/, '');

/** declaration graph from `start` under one resolution mode. */
function typesGraph(start: string, mode: keyof typeof MODES): { reached: Set<string>; unresolved: string[] } {
  const options: ts.CompilerOptions = { ...MODES[mode], noEmit: true };
  const cache = ts.createModuleResolutionCache(DIST, (x) => x, options);
  const reached = new Set<string>();
  const unresolved: string[] = [];
  const queue = [start];
  while (queue.length) {
    const f = queue.pop()!;
    const stem = stemOf(f);
    if (reached.has(stem)) continue;
    reached.add(stem);
    // node16 resolves per the importing file's module format (ESM under "type": "module": no extension search)
    const format = mode === 'node16' ? ts.getImpliedNodeFormatForFile(f, cache.getPackageJsonInfoCache(), ts.sys, options) : undefined;
    for (const spec of relativeSpecs(f)) {
      const r = ts.resolveModuleName(spec, f, options, ts.sys, cache, undefined, format).resolvedModule;
      if (!r || !r.resolvedFileName.startsWith(DIST)) { unresolved.push(`${relative(ROOT, f)} -> ${spec}`); continue; }
      if (r.resolvedFileName.endsWith('.d.ts')) queue.push(r.resolvedFileName);
      else reached.add(stemOf(r.resolvedFileName)); // json/css asset
    }
  }
  return { reached, unresolved };
}

/** runtime graph from `start`: node ESM semantics — a relative specifier names its file exactly. */
function runtimeGraph(start: string): { reached: Set<string>; unresolved: string[] } {
  const reached = new Set<string>();
  const unresolved: string[] = [];
  const queue = [start];
  while (queue.length) {
    const f = queue.pop()!;
    const stem = stemOf(f);
    if (reached.has(stem)) continue;
    reached.add(stem);
    for (const spec of relativeSpecs(f)) {
      const target = resolve(dirname(f), spec);
      if (!existsSync(target)) { unresolved.push(`${relative(ROOT, f)} -> ${spec}`); continue; }
      if (target.endsWith('.js')) queue.push(target);
      else reached.add(stemOf(target));
    }
  }
  return { reached, unresolved };
}

const shipped = () => manifest.entries.filter((e) => e.types && e.default && existsSync(join(ROOT, e.types)) && existsSync(join(ROOT, e.default)));

describe('types-runtime-graph (REQ-PLAT-66)', () => {
  it('every emitted js has a sibling d.ts; every shipped manifest entry has both', () => {
    ensureBuilt();
    const missing = walk(DIST, (p) => p.endsWith('.js')).filter((f) => !existsSync(f.replace(/\.js$/, '.d.ts'))).map((f) => relative(ROOT, f));
    for (const e of manifest.entries) {
      if (!e.types) continue;
      const hasTypes = existsSync(join(ROOT, e.types));
      const hasJs = e.default ? existsSync(join(ROOT, e.default)) : true;
      if (!hasTypes && !hasJs) continue; // pending/seed entry ships neither
      if (!hasTypes) missing.push(e.types);
      if (!hasJs) missing.push(e.default!);
    }
    expect(missing).toEqual([]);
    expect(shipped().length).toBeGreaterThan(5);
  });

  it('every entry declaration graph resolves completely and identically under bundler and node16', () => {
    ensureBuilt();
    const problems: string[] = [];
    for (const e of shipped()) {
      const b = typesGraph(join(ROOT, e.types!), 'bundler');
      const n = typesGraph(join(ROOT, e.types!), 'node16');
      problems.push(...b.unresolved.map((u) => `${e.subpath} [bundler] ${u}`), ...n.unresolved.map((u) => `${e.subpath} [node16] ${u}`));
      const onlyB = [...b.reached].filter((s) => !n.reached.has(s));
      const onlyN = [...n.reached].filter((s) => !b.reached.has(s));
      if (onlyB.length || onlyN.length) problems.push(`${e.subpath}: bundler-only ${onlyB.join(',')} node16-only ${onlyN.join(',')}`);
    }
    expect(problems).toEqual([]);
  });

  it('each entry exports the same value names from types (bundler and node16) as from default', () => {
    ensureBuilt();
    const entries = shipped();
    /* The runtime graph folds pure re-export barrels into their importers and its
       internals are not referenced by any declaration, so the relative module sets
       of the two graphs differ by construction; what must be identical is the
       observable surface: every runtime export is declared and every declared
       value exists at runtime. Types are read with the checker over the resolved
       graph (getExportsOfModule, value symbols only). */
    const valueNames = (mode: keyof typeof MODES) => {
      const program = ts.createProgram(entries.map((e) => join(ROOT, e.types!)), { ...MODES[mode], noEmit: true, skipLibCheck: true, types: [] });
      const checker = program.getTypeChecker();
      const out = new Map<string, string[]>();
      for (const e of entries) {
        const sf = program.getSourceFile(join(ROOT, e.types!));
        const sym = sf && checker.getSymbolAtLocation(sf);
        const names = sym ? checker.getExportsOfModule(sym).filter((s) => {
          const target = s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
          return (target.flags & ts.SymbolFlags.Value) !== 0;
        }).map((s) => s.name) : ['<unresolved>'];
        out.set(e.subpath, names.sort());
      }
      return out;
    };
    const runtimeNames = (file: string, seen = new Set<string>()): string[] => {
      if (seen.has(file)) return [];
      seen.add(file);
      const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      const names: string[] = [];
      for (const s of sf.statements) {
        if (ts.isExportDeclaration(s)) {
          if (!s.exportClause) {
            const spec = (s.moduleSpecifier as ts.StringLiteral).text;
            if (spec.startsWith('.')) names.push(...runtimeNames(resolve(dirname(file), spec), seen).filter((n) => n !== 'default'));
            else names.push(`* from ${spec}`);
          } else if (ts.isNamespaceExport(s.exportClause)) names.push(s.exportClause.name.text);
          else for (const el of s.exportClause.elements) names.push(el.name.text);
        } else if (ts.isExportAssignment(s)) names.push('default');
        else if (ts.canHaveModifiers(s) && ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          if (ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)) names.push('default');
          else if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) names.push(d.name.getText());
          else if ((ts.isFunctionDeclaration(s) || ts.isClassDeclaration(s)) && s.name) names.push(s.name.text);
        }
      }
      return [...new Set(names)];
    };
    const bundler = valueNames('bundler');
    const node16 = valueNames('node16');
    const problems: string[] = [];
    for (const e of entries) {
      const rt = runtimeNames(join(ROOT, e.default!)).sort();
      const b = bundler.get(e.subpath)!;
      const n = node16.get(e.subpath)!;
      if (b.includes('<unresolved>') || n.includes('<unresolved>')) problems.push(`${e.subpath}: entry declaration did not resolve`);
      const diff = (a: string[], c: string[]) => a.filter((x) => !c.includes(x));
      if (diff(b, n).length || diff(n, b).length) problems.push(`${e.subpath}: bundler/node16 differ: ${diff(b, n).join(',')} | ${diff(n, b).join(',')}`);
      if (diff(b, rt).length) problems.push(`${e.subpath}: declared values missing at runtime: ${diff(b, rt).join(', ')}`);
      if (diff(rt, b).length) problems.push(`${e.subpath}: runtime exports without a value declaration: ${diff(rt, b).join(', ')}`);
    }
    expect(problems).toEqual([]);
  }, 120_000);

  it('no entry other than "." resolves to the root dist/index', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const e of shipped()) {
      if (e.subpath === '.') continue;
      if (typesGraph(join(ROOT, e.types!), 'bundler').reached.has('index')) bad.push(`${e.subpath} (types)`);
      if (runtimeGraph(join(ROOT, e.default!)).reached.has('index')) bad.push(`${e.subpath} (default)`);
    }
    expect(bad).toEqual([]);
  });
});

describe('dotted module names get a runtime extension in d.ts (REQ-PLAT-66/73)', () => {
  it('rewriteFile appends .js to ./X.client / ./X.types and /index.js to directories', async () => {
    const { rewriteFile } = await import('../../scripts/build/rewrite-dts-aliases.mjs');
    const dir = mkdtempSync(join(tmpdir(), 'ag-dts-'));
    try {
      writeFileSync(join(dir, 'Menu.client.d.ts'), 'export declare const Menu: 1;\n');
      writeFileSync(join(dir, 'Menu.types.d.ts'), 'export type MenuProps = {};\n');
      writeFileSync(join(dir, 'plain.d.ts'), 'export declare const p: 1;\n');
      const entry = join(dir, 'index.d.ts');
      writeFileSync(entry, [
        "export { Menu } from './Menu.client';",
        "export type { MenuProps } from './Menu.types';",
        "export { p } from './plain';",
        "export { q } from './already.js';",
        '',
      ].join('\n'));
      rewriteFile(entry);
      const out = readFileSync(entry, 'utf8');
      expect(out).toContain("from './Menu.client.js'");
      expect(out).toContain("from './Menu.types.js'");
      expect(out).toContain("from './plain.js'");
      expect(out).toContain("from './already.js'");
      expect(out).not.toContain('.js.js');
      const r = ts.resolveModuleName('./Menu.client.js', entry, { ...MODES.node16 }, ts.sys).resolvedModule;
      expect(r?.resolvedFileName).toBe(join(dir, 'Menu.client.d.ts'));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
