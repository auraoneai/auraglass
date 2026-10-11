/** PLAT-344 / REQ-PLAT-93: language-service completions over the packed
 * aura-glass d.ts (tests/types/plat/vendor/aura-glass, produced by
 * setup-extract.mjs). Missing packed declarations fail this suite; the
 * independent stub fixture checks the language-service harness itself. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const VENDOR = path.join(__dirname, 'vendor', 'aura-glass');
const DIST_INDEX = path.join(VENDOR, 'dist', 'index.d.ts');
const packed = fs.existsSync(DIST_INDEX);
const ROOT = path.resolve(__dirname, '..', '..', '..');

function makeLS(code: string, file = 'x.ts'): ts.LanguageService {
  const options: ts.CompilerOptions = {
    strict: true,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
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

const at = (code: string, needle: string) => code.lastIndexOf(needle) + needle.length;

describe('type DX completions', () => {
  it('Button props complete to the 5.0 grammar (stub fixture)', () => {
    const code = `interface ButtonProps { intent?: 'neutral'|'info'|'success'|'warning'|'danger'; prominent?: boolean; disabled?: boolean }\nconst p: ButtonProps = { int: 1, };`;
    const ls = makeLS(code);
    const res = ls.getCompletionsAtPosition('x.ts', code.lastIndexOf('int') + 1, {});
    const names = (res?.entries ?? []).map((e) => e.name);
    expect(names).toContain('intent');
    expect(names).toContain('prominent');
  });

  it('packed declarations are available', () => { expect(packed).toBe(true); });
  const run = it;
  run('Button variant/intent, Surface thickness, Dialog member, data named import — packed d.ts', () => {
    const code = [
      `import { Button, Surface, Dialog } from 'aura-glass';`,
      `const b: import('react').ComponentProps<typeof Button> = { variant: 'X' };`,
      `const s: import('react').ComponentProps<typeof Surface> = { thickness: 'X' };`,
      `const d: typeof Dialog = {};`,
    ].join('\n');
    const ls = makeLS(code, 'y.tsx');
    const variantAt = code.indexOf(`variant: 'X'`) + `variant: '`.length;
    const names = (ls.getCompletionsAtPosition('y.tsx', variantAt, {})?.entries ?? []).map((e) => e.name);
    for (const n of names) {
      expect(n).not.toMatch(/^Glass/); // no internal Glass* names leak
      expect(n).not.toBe('__internal');
    }
    expect(names).toEqual(expect.arrayContaining(['regular', 'clear', 'identity']));
    expect(names).not.toContain('primary');
    expect(names).not.toContain('solid');
  });

  run('compat entries carry kindModifiers deprecated', () => {
    const code = `import { ` + '} from "aura-glass/compat";';
    const ls = makeLS(code, 'z.ts');
    const cursor = code.indexOf('} from') - 1;
    const res = ls.getCompletionsAtPosition('z.ts', cursor, {});
    const entries = res?.entries ?? [];
    const compat = entries.filter((e) => e.name.startsWith('Ag'));
    expect(entries.length).toBeGreaterThan(0);
    for (const e of compat) {
      expect(e.kindModifiers ?? '').toContain('deprecated');
    }
  });
});
