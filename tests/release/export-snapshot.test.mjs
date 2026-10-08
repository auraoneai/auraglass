/* @jest-environment node */
/* tests/release/export-snapshot.test.ts — REQ-PLAT-24: packs a real fixture
   package (npm pack, offline) and snapshots runtime/require/types names plus the
   typesRuntimeMismatch list; asserts byte-stable output across runs. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from '@jest/globals';
import { dtsExportNames, snapshotTarball, stableSnapshot } from '../../scripts/release/export-snapshot.mjs';

function fixturePackage() {
  const dir = mkdtempSync(join(tmpdir(), 'snap-pkg-'));
  mkdirSync(join(dir, 'dist'), { recursive: true });
  writeFileSync(join(dir, 'package.json'), JSON.stringify({
    name: 'snap-fixture', version: '1.0.0', type: 'module',
    exports: {
      '.': { types: './dist/index.d.ts', import: './dist/index.mjs', require: './dist/index.cjs' },
      './styles.css': './dist/styles.css',
    },
  }));
  writeFileSync(join(dir, 'dist/index.mjs'),
    'export const Alpha = 1;\nexport function Beta() {}\nexport default {};\nexport const RuntimeOnly = 2;\n');
  writeFileSync(join(dir, 'dist/index.cjs'),
    'exports.Alpha = 1; exports.Beta = function () {}; exports.CjsOnly = 3;\n');
  writeFileSync(join(dir, 'dist/index.d.ts'),
    'export declare const Alpha: number;\nexport declare function Beta(): void;\nexport declare const TypesOnly: string;\nexport default {};\n');
  writeFileSync(join(dir, 'dist/styles.css'), ':root{--x:1}');
  const tgz = execFileSync('npm', ['pack', '--pack-destination', dir], { cwd: dir, encoding: 'utf8' }).trim().split('\n').pop();
  return { dir, tgz: join(dir, tgz) };
}

describe('export-snapshot over a real tarball', () => {
  const { dir, tgz } = fixturePackage();
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  it('captures runtime, require and types names per exports key', () => {
    try {
      const { entries } = snapshotTarball(tgz);
      const root = entries['.'];
      expect(root.kind).toBe('module');
      expect(root.runtime).toContain('Alpha');
      expect(root.runtime).toContain('Beta');
      expect(root.types).toContain('Alpha');
      expect(root.require).toContain('CjsOnly');
      expect(entries['./styles.css'].kind).toBe('asset');
      const j = JSON.parse(snapshotTarball(tgz).json);
      expect(j.package).toBe('snap-fixture@1.0.0');
    } finally { /* fixture dir cleaned by afterAll */ }
  });
  it('typesRuntimeMismatch lists names present on one side only', () => {
    const { entries } = snapshotTarball(tgz);
    const mm = entries['.'].typesRuntimeMismatch;
    expect(mm).toContain('runtime-only:RuntimeOnly');
    expect(mm).toContain('types-only:TypesOnly');
  });
  it('output is byte-stable across runs', () => {
    const a = snapshotTarball(tgz).json; const b = snapshotTarball(tgz).json;
    expect(a).toBe(b);
    expect(a.endsWith('\n')).toBe(true);
  });
  it('stableSnapshot sorts keys and arrays', () => {
    const s = stableSnapshot({ './b': { kind: 'module', runtime: ['z', 'a'] } }, { package: 'x@1' });
    expect(s.indexOf('"a"')).toBeLessThan(s.indexOf('"z"'));
  });
  it('dtsExportNames handles declare/list/default', () => {
    expect(dtsExportNames('export declare const A: 1; export type T = 1;\nexport default {}')).toEqual(['A', 'T', 'default']);
  });
});
