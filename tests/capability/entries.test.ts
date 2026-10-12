/** @jest-environment node */
// tests/capability/entries.test.ts — REQ-SURF-165 (REQ-FIN-87, AC-FIN-87; OI-01, contract C-6).
// `./three` ships at 5.0 as an empty entry: the contract row lists no exports
// and the source barrel is `export {};`. No 4.x three component is ported.
//
// Lane split: surf:test:doubles [capability] is sources-only
// (`dependencies: []` — no dist artifact ever reaches it), so this file
// asserts the source side: the contract row, the package/manifest wiring,
// 0 runtime exports through the public specifier, and 0 declared exports in
// the source the build emits from. The built-artifact side (the packed
// tarball's `./three` exposes exactly the contract list, []) is asserted by
// tests/data/exports/surf-entries.test.ts in surf:package:packed-entries.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { ENTRIES } from '../../src/contracts/entries';

const ROOT = join(__dirname, '../..');
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const MANIFEST = JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8'));
const SUBPATH = './three';

describe('./three entry is empty at 5.0 (REQ-SURF-165)', () => {
  it('the contract row keeps ./three at ga 5.0 with exports: []', () => {
    const row = ENTRIES.find((e: (typeof ENTRIES)[number]) => e.subpath === SUBPATH);
    expect(row).toMatchObject({ source: 'src/three/index.ts', owner: 'SURF', ga: '5.0' });
    expect(row?.exports).toEqual([]);
  });

  it('package.json exports map ./three to the manifest dist targets', () => {
    const m = MANIFEST.entries.find((e: { subpath: string }) => e.subpath === SUBPATH);
    expect(m).toBeDefined();
    // The manifest stores package-relative paths without the leading './'.
    expect(PKG.exports[SUBPATH]).toEqual({ types: `./${m.types}`, default: `./${m.default}` });
  });

  it('the source barrel has 0 runtime exports', () => {
    const mod = require('../../src/three/index');
    expect(Object.keys(mod)).toEqual([]);
  });

  it("Object.keys(await import('aura-glass/three')) is empty through the public specifier", async () => {
    // C-4: under jest the package name resolves to the ENTRIES sources
    // (jest.config.js moduleNameMapper), so this proves the specifier is
    // wired to the empty source entry. The packed tarball's own resolution
    // is covered by surf-entries.test.ts.
    const mod = await import('aura-glass/three');
    expect(Object.keys(mod)).toEqual([]);
  });

  it('the source entry declares 0 exports', () => {
    const source = join(ROOT, 'src/three/index.ts');
    const program = ts.createProgram([source], { noEmit: true, skipLibCheck: true });
    const file = program.getSourceFile(source);
    const symbol = file && program.getTypeChecker().getSymbolAtLocation(file);
    expect(symbol).toBeDefined();
    expect(program.getTypeChecker().getExportsOfModule(symbol!).map((s) => s.name)).toEqual([]);
  });
});
