/* @jest-environment node */
/* tests/release/export-snapshot.test.ts — REQ-PLAT-23: packs real fixture
   packages (npm pack, offline) and snapshots runtime (jsdom globals installed),
   require and TypeScript-compiler type names per exports key; a facade entry
   whose runtime is another module flags typesRuntimeMismatch: true, `export *`
   d.ts chains are followed, asset keys record their file, and two runs are
   byte-identical. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from '@jest/globals';
import {
  dtsExportNames, dtsExports, main, nodeSupported, snapshotTarball, stableSnapshot,
} from '../../scripts/release/export-snapshot.mjs';

const dirs: string[] = [];
afterAll(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); });

function pack(files: Record<string, string>, pkg: Record<string, unknown>): string {
  const dir = mkdtempSync(join(tmpdir(), 'snap-pkg-'));
  dirs.push(dir);
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ version: '1.0.0', type: 'module', ...pkg }));
  const out = execFileSync('npm', ['pack', '--pack-destination', dir], { cwd: dir, encoding: 'utf8' }).trim().split('\n').pop() ?? '';
  return join(dir, out.trim());
}

const tgz = pack({
  'dist/index.mjs': 'export const Alpha = 1;\nexport function Beta() {}\nexport default {};\nexport const RuntimeOnly = 2;\n'
    // jsdom globals are installed before the import: this top-level read would throw without them.
    + 'export const hasDom = typeof document.createElement("div").getBoundingClientRect === "function";\n',
  'dist/index.cjs': 'exports.Alpha = 1; exports.Beta = function () {}; exports.CjsOnly = 3;\n',
  'dist/index.d.ts': 'export * from "./more.js";\nexport { Beta } from "./beta.js";\nexport declare const Alpha: number;\nexport declare const TypesOnly: string;\nexport declare const hasDom: boolean;\nexport interface Shape { a: 1 }\nexport type { Hidden } from "./more.js";\ndeclare const _default: {};\nexport default _default;\n',
  'dist/more.d.ts': 'export declare const FromStar: number;\nexport declare class Hidden {}\n',
  'dist/beta.d.ts': 'export declare function Beta(): void;\n',
  // facade: ./forms has its own types but resolves to the root bundle at runtime
  'dist/forms.d.ts': 'export declare function Field(): null;\nexport declare function Form(): null;\n',
  'dist/styles.css': ':root{--x:1}',
}, {
  name: 'snap-fixture',
  exports: {
    '.': { types: './dist/index.d.ts', import: './dist/index.mjs', require: './dist/index.cjs' },
    './forms': { types: './dist/forms.d.ts', import: './dist/index.mjs' },
    './styles.css': './dist/styles.css',
    './package.json': './package.json',
  },
});

describe('export-snapshot over a real tarball', () => {
  const { entries, json } = snapshotTarball(tgz);
  const root = entries['.'] as Record<string, unknown> & { runtime: string[]; types: string[]; typeValues: string[]; require: string[]; mismatch: string[] };

  it('captures runtime (jsdom globals installed), require and types names', () => {
    expect(root.kind).toBe('module');
    expect(root.runtime).toEqual(expect.arrayContaining(['Alpha', 'Beta', 'RuntimeOnly', 'default', 'hasDom']));
    expect(root.error).toBeUndefined();
    expect(root.require).toEqual(['Alpha', 'Beta', 'CjsOnly']);
    expect(JSON.parse(json).package).toBe('snap-fixture@1.0.0');
  });

  it('follows `export *` and `export { } from` through the TypeScript compiler API', () => {
    expect(root.types).toEqual(expect.arrayContaining(['Alpha', 'Beta', 'FromStar', 'Shape', 'TypesOnly', 'default', 'Hidden']));
    // interfaces and `export type { }` re-exports carry no runtime value
    expect(root.typeValues).toContain('FromStar');
    expect(root.typeValues).not.toContain('Shape');
    expect(root.typeValues).not.toContain('Hidden');
  });

  it('typesRuntimeMismatch is a boolean with the names listed separately', () => {
    expect(root.typesRuntimeMismatch).toBe(true);
    expect(root.mismatch).toEqual(expect.arrayContaining(['runtime-only:RuntimeOnly', 'types-only:TypesOnly', 'types-only:FromStar']));
    expect(root.mismatch).not.toContain('types-only:Shape');
  });

  it('a facade entry (types of its own, runtime of the root) flags typesRuntimeMismatch: true', () => {
    const forms = entries['./forms'] as { typesRuntimeMismatch: boolean; mismatch: string[] };
    expect(forms.typesRuntimeMismatch).toBe(true);
    expect(forms.mismatch).toEqual(expect.arrayContaining(['types-only:Field', 'types-only:Form', 'runtime-only:Alpha']));
  });

  it('an entry whose runtime matches its value types is not flagged', () => {
    const okTgz = pack({
      'dist/a.mjs': 'export const A = 1; export function B() {}\n',
      'dist/a.d.ts': 'export declare const A: number;\nexport declare function B(): void;\nexport interface OnlyType { x: 1 }\n',
    }, { name: 'snap-ok', exports: { '.': { types: './dist/a.d.ts', import: './dist/a.mjs' } } });
    const e = snapshotTarball(okTgz).entries['.'] as { typesRuntimeMismatch: boolean; mismatch: string[] };
    expect(e.typesRuntimeMismatch).toBe(false);
    expect(e.mismatch).toEqual([]);
  });

  it('CSS and JSON keys are assets with the resolved file', () => {
    expect(entries['./styles.css']).toEqual({ kind: 'asset', file: './dist/styles.css' });
    expect(JSON.parse(json).entries['./package.json']).toEqual({ kind: 'asset', file: './package.json' });
  });

  it('output is byte-stable across runs', () => {
    const a = snapshotTarball(tgz).json; const b = snapshotTarball(tgz).json;
    expect(a).toBe(json);
    expect(b).toBe(json);
    expect(a.endsWith('\n')).toBe(true);
  });
});

describe('export-snapshot helpers', () => {
  it('stableSnapshot sorts keys and arrays and coerces the mismatch flag', () => {
    const s = stableSnapshot({ './b': { kind: 'module', runtime: ['z', 'a'] }, './a': { kind: 'asset', file: 'x.css' } }, { package: 'x@1' });
    expect(s.indexOf('"a"')).toBeLessThan(s.indexOf('"z"'));
    expect(s.indexOf('"./a"')).toBeLessThan(s.indexOf('"./b"'));
    expect(JSON.parse(s).entries['./b'].typesRuntimeMismatch).toBe(false);
  });
  it('dtsExportNames (no-compiler fallback) handles declare/list/default', () => {
    expect(dtsExportNames('export declare const A: 1; export type T = 1;\nexport default {}')).toEqual(['A', 'T', 'default']);
  });
  it('dtsExports uses the compiler', () => {
    const dir = mkdtempSync(join(tmpdir(), 'snap-dts-')); dirs.push(dir);
    writeFileSync(join(dir, 'a.d.ts'), 'export * from "./b.js";\nexport declare const A: 1;\n');
    writeFileSync(join(dir, 'b.d.ts'), 'export declare function B(): void;\nexport type C = string;\n');
    const r = dtsExports(join(dir, 'a.d.ts'));
    expect(r.compiler).toBe(true);
    expect(r.names).toEqual(['A', 'B', 'C']);
    expect(r.values).toEqual(['A', 'B']);
  });
  it('enforces Node >= 20.19', () => {
    expect(nodeSupported('20.18.1')).toBe(false);
    expect(nodeSupported('20.19.0')).toBe(true);
    expect(nodeSupported('22.0.0')).toBe(true);
    expect(nodeSupported('18.20.0')).toBe(false);
  });
  it('main without --tarball/--version is a usage error', () => {
    const spy = jestSpyError();
    try { expect(main([])).toBe(2); } finally { spy.restore(); }
  });
});

function jestSpyError(): { restore: () => void } {
  const orig = console.error;
  console.error = () => {};
  return { restore: () => { console.error = orig; } };
}
