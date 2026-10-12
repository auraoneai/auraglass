/** PLAT-344 / REQ-PLAT-93: language-service completions over the packed
 * aura-glass d.ts (tests/types/plat/vendor/aura-glass, produced by
 * setup-extract.mjs). Missing packed declarations fail this suite; the
 * independent stub fixture checks the language-service harness itself.
 *
 * Expected sets come from the sources of truth, never from the d.ts under test:
 *   - Button variant / intent: Button.meta.ts `variants` (loaded by load-metas.mjs)
 *   - Surface thickness: S-01 AG_ATTRIBUTES['data-ag-thickness'].values
 *   - Dialog members: S-30 COMPOUND_PARTS.Dialog
 *   - aura-glass/data value exports: the metas whose entry is './data'
 * Every list is compared with exact set equality (no `string & {}` widening,
 * no internal or Glass* names), and every aura-glass/compat completion must
 * carry the `deprecated` kind modifier. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { AG_ATTRIBUTES } from '../../../src/contracts/material';
import { COMPOUND_PARTS } from '../../../src/contracts/components';
import { loadMetas } from '../../../scripts/docs/load-metas.mjs';

const VENDOR = path.join(__dirname, 'vendor', 'aura-glass');
const DIST_INDEX = path.join(VENDOR, 'dist', 'index.d.ts');
const packed = fs.existsSync(DIST_INDEX);
const ROOT = path.resolve(__dirname, '..', '..', '..');

type Meta = { name: string; entry: string; variants?: Record<string, readonly string[]> };
const METAS: Meta[] = (loadMetas(ROOT) as { metas: { meta: Meta }[] }).metas.map((m) => m.meta);
const meta = (name: string): Meta => {
  const m = METAS.find((x) => x.name === name);
  if (!m) throw new Error(`no ${name}.meta.ts`);
  return m;
};

function makeLS(code: string, file = 'x.ts'): ts.LanguageService {
  const options: ts.CompilerOptions = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    baseUrl: __dirname,
    paths: {
      'aura-glass': [DIST_INDEX],
      'aura-glass/*': [path.join(VENDOR, 'dist', '*', 'index.d.ts'), path.join(VENDOR, 'dist', '*.d.ts')],
      react: [path.join(ROOT, 'node_modules', '@types', 'react')],
      'react/jsx-runtime': [path.join(ROOT, 'node_modules', '@types', 'react', 'jsx-runtime')],
    },
  };
  const host: ts.LanguageServiceHost = {
    getScriptFileNames: () => [file],
    getScriptVersion: () => '0',
    getScriptSnapshot: (n) => (n === file ? ts.ScriptSnapshot.fromString(code) : ts.sys.fileExists(n) ? ts.ScriptSnapshot.fromString(ts.sys.readFile(n)!) : undefined),
    getCurrentDirectory: () => ROOT,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    readFile: ts.sys.readFile,
    fileExists: ts.sys.fileExists,
    resolveModuleNameLiterals: (lits, containingFile) =>
      lits.map((lit) => ts.resolveModuleName(lit.text, containingFile, options, ts.sys)),
  };
  return ts.createLanguageService(host);
}

/** Completion entries at the `|` marker of `src` (the marker is removed). */
function complete(src: string, file = 'c.tsx'): readonly ts.CompletionEntry[] {
  const pos = src.indexOf('|');
  if (pos < 0) throw new Error('no | marker');
  const code = src.slice(0, pos) + src.slice(pos + 1);
  return makeLS(code, file).getCompletionsAtPosition(file, pos, {})?.entries ?? [];
}
/** Names of the value (not type-only) exports of the module imported by `src`. */
function valueExports(src: string, file: string): Set<string> {
  const code = src.replace('|', '');
  const ls = makeLS(code, file);
  const program = ls.getProgram()!;
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(file)!;
  const decl = sf.statements.find(ts.isImportDeclaration)!;
  const mod = checker.getSymbolAtLocation(decl.moduleSpecifier);
  if (!mod) throw new Error(`cannot resolve ${decl.moduleSpecifier.getText(sf)}`);
  const out = new Set<string>();
  for (const sym of checker.getExportsOfModule(mod)) {
    const target = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
    if (target.flags & ts.SymbolFlags.Value) out.add(sym.name);
  }
  return out;
}
const names = (entries: readonly ts.CompletionEntry[]) => entries.map((e) => e.name);
const sorted = (xs: Iterable<string>) => [...new Set(xs)].sort();
/** No widening and no internal/legacy names in any list. */
function expectClean(list: readonly string[]) {
  for (const n of list) {
    expect(n).not.toMatch(/^Glass[A-Z0-9]/);
    expect(n).not.toMatch(/^__/);
    expect(n).not.toBe('string');
  }
}

describe('type DX completions', () => {
  it('Button props complete to the 5.0 grammar (stub fixture)', () => {
    const code = `interface ButtonProps { intent?: 'neutral'|'info'|'success'|'warning'|'danger'; prominent?: boolean; disabled?: boolean }\nconst p: ButtonProps = { int: 1, };`;
    const ls = makeLS(code);
    const res = ls.getCompletionsAtPosition('x.ts', code.lastIndexOf('int') + 1, {});
    const list = (res?.entries ?? []).map((e) => e.name);
    expect(list).toContain('intent');
    expect(list).toContain('prominent');
  });

  it('expected sets are non-empty in the sources of truth', () => {
    expect(meta('Button').variants?.variant).toEqual(['regular', 'clear', 'identity']);
    expect((meta('Button').variants?.intent ?? []).length).toBeGreaterThan(0);
    expect(AG_ATTRIBUTES['data-ag-thickness'].values.length).toBeGreaterThan(0);
    expect(COMPOUND_PARTS.Dialog.length).toBeGreaterThan(0);
    expect(METAS.filter((m) => m.entry === './data').length).toBeGreaterThan(0);
  });

  it('packed declarations are available', () => { expect(packed).toBe(true); });

  it('<Button variant="|" /> equals Button meta.variants.variant', () => {
    const list = names(complete(`import { Button } from 'aura-glass';\nexport const x = <Button variant="|" />;`));
    expectClean(list);
    expect(sorted(list)).toEqual(sorted(meta('Button').variants!.variant!));
  });

  it('<Button intent="|" /> equals Button meta.variants.intent', () => {
    const list = names(complete(`import { Button } from 'aura-glass';\nexport const x = <Button intent="|" />;`));
    expectClean(list);
    expect(sorted(list)).toEqual(sorted(meta('Button').variants!.intent!));
  });

  it('<Surface thickness="|" /> equals the S-01 data-ag-thickness values', () => {
    const list = names(complete(`import { Surface } from 'aura-glass';\nexport const x = <Surface thickness="|" />;`));
    expectClean(list);
    expect(sorted(list)).toEqual(sorted(AG_ATTRIBUTES['data-ag-thickness'].values));
  });

  it('<Dialog.| equals COMPOUND_PARTS.Dialog', () => {
    const list = names(complete(`import { Dialog } from 'aura-glass';\nexport const x = <Dialog.| />;`));
    expectClean(list);
    expect(sorted(list)).toEqual(sorted(COMPOUND_PARTS.Dialog));
  });

  it('import { | } from "aura-glass/data" value exports equal the ./data metas', () => {
    const src = `import { | } from 'aura-glass/data';\nexport {};`;
    const entries = complete(src, 'd.ts').filter((e) => e.kind !== ts.ScriptElementKind.keyword);
    expectClean(names(entries));
    const values = valueExports(src, 'd.ts');
    expect(sorted(names(entries).filter((n) => values.has(n)))).toEqual(sorted(METAS.filter((m) => m.entry === './data').map((m) => m.name)));
  });

  it('every aura-glass/compat value export completes with the deprecated kind modifier', () => {
    const src = `import { | } from 'aura-glass/compat';\nexport {};`;
    const entries = complete(src, 'z.ts').filter((e) => e.kind !== ts.ScriptElementKind.keyword);
    const values = valueExports(src, 'z.ts');
    const valueEntries = entries.filter((e) => values.has(e.name));
    expect(valueEntries.length).toBeGreaterThan(0);
    const missing = valueEntries.filter((e) => !(e.kindModifiers ?? '').split(',').includes('deprecated')).map((e) => e.name);
    expect(missing).toEqual([]);
  });
});
