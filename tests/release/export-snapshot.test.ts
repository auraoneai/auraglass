/* @jest-environment node */
/* tests/release/export-snapshot.test.ts — REQ-PLAT-23 (4x port): real tarball
   snapshots incl. facade (export * from) modules and typesRuntimeMismatch. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const S = 'scripts/release/export-snapshot.mjs';
// ESM module: exec a real node --input-type=module harness per call.
const EVAL = (body: string): any =>
  JSON.parse(execFileSync('node', ['--input-type=module', '-e',
    `const m = await import('./${S}');\n${body}`], { encoding: 'utf8' }));

function fixturePackage() {
  const dir = mkdtempSync(join(tmpdir(), 'snap-pkg-'));
  mkdirSync(join(dir, 'dist'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    name: 'snap-fixture', version: '1.0.0', type: 'module',
    exports: {
      '.': { types: './dist/index.d.ts', import: './dist/index.mjs', require: './dist/index.cjs' },
      './facade': { types: './dist/facade.d.ts', import: './dist/facade.mjs', require: './dist/facade.cjs' },
      './styles.css': './dist/styles.css',
    },
  }));
  writeFileSync(join(dir, 'dist/index.mjs'),
    'export const Alpha = 1;\nexport function Beta() {}\nexport default {};\nexport const RuntimeOnly = 2;\n');
  writeFileSync(join(dir, 'dist/index.cjs'),
    'exports.Alpha = 1; exports.Beta = function () {}; exports.CjsOnly = 3;\n');
  writeFileSync(join(dir, 'dist/index.d.ts'),
    'export declare const Alpha: number;\nexport declare function Beta(): void;\nexport declare const TypesOnly: string;\nexport default {};\n');
  // facade: `export * from './inner'` re-export barrel
  writeFileSync(join(dir, 'dist/inner.mjs'), 'export const Inner = 1;\nexport const InnerB = 2;\n');
  writeFileSync(join(dir, 'dist/inner.cjs'), 'exports.Inner = 1; exports.InnerB = 2;\n');
  writeFileSync(join(dir, 'dist/facade.mjs'), "export * from './inner.mjs';\nexport const FacadeOwn = 9;\n");
  writeFileSync(join(dir, 'dist/facade.cjs'), "const i = require('./inner.cjs'); exports.Inner = i.Inner; exports.InnerB = i.InnerB; exports.FacadeCjs = 4;\n");
  writeFileSync(join(dir, 'dist/facade.d.ts'), "export * from './inner.js';\nexport declare const FacadeOwn: number;\n");
  writeFileSync(join(dir, 'dist/inner.d.ts'), 'export declare const Inner: number;\nexport declare const InnerB: number;\n');
  writeFileSync(join(dir, 'dist/styles.css'), ':root{--x:1}');
  const tgz = execFileSync('npm', ['pack', '--pack-destination', dir], { cwd: dir, encoding: 'utf8' }).trim().split('\n').pop()!;
  return { dir, tgz: join(dir, tgz) };
}

const { dir, tgz } = fixturePackage();
process.on('exit', () => { try { rmSync(dir, { recursive: true, force: true }); } catch {} });
const snap = EVAL(`console.log(JSON.stringify(m.snapshotTarball('${tgz.replace(/'/g, "\\'")}').entries))`);

describe('export-snapshot over a real tarball (4x port)', () => {
  it('captures runtime, require and types names per exports key', () => {
    const root = snap['.'];
    expect(root.kind).toBe('module');
    expect(root.runtime).toContain('Alpha');
    expect(root.runtime).toContain('Beta');
    expect(root.types).toContain('Alpha');
    expect(root.require).toContain('CjsOnly');
    expect(snap['./styles.css'].kind).toBe('asset');
  });
  it('typesRuntimeMismatch is a boolean-labelled list of one-sided names', () => {
    const mm = snap['.'].typesRuntimeMismatch;
    expect(mm).toContain('runtime-only:RuntimeOnly');
    expect(mm).toContain('types-only:TypesOnly');
  });
  it('facade entry: export * from re-exports land in runtime and types', () => {
    const f = snap['./facade'];
    expect(f.kind).toBe('module');
    expect(f.runtime).toContain('Inner');
    expect(f.runtime).toContain('InnerB');
    expect(f.runtime).toContain('FacadeOwn');
    // d.ts `export * from` names are types-side
    expect(f.types).toContain('FacadeOwn');
    expect(f.require).toContain('FacadeCjs');
  });
  it('committed 4.1.0 snapshot exists and is well-formed', () => {
    const j = JSON.parse(readFileSync('etc/snapshots/4.1.0.json', 'utf8'));
    expect(j.package).toBe('aura-glass@4.1.0');
    expect(Object.keys(j.entries).length).toBeGreaterThan(40);
    for (const e of Object.values(j.entries) as any[]) {
      expect(['module', 'asset']).toContain(e.kind);
      expect(Array.isArray(e.typesRuntimeMismatch)).toBe(true);
    }
  });
  it('dtsExportNames handles declare/list/default', () => {
    expect(EVAL(`console.log(JSON.stringify(m.dtsExportNames('export declare const A: 1; export type T = 1;\\nexport default {}')))`)).toEqual(['A', 'T', 'default']);
  });
});
