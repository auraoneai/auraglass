/** @jest-environment node */
// tests/capability/entries.test.ts — REQ-SURF-165 (REQ-FIN-87, AC-FIN-87; OI-01, contract C-6).
// `./three` ships at 5.0 as an empty entry: the contract row lists no exports,
// the source barrel is `export {};`, and the built entry resolved through the
// package's own `exports` map exposes 0 named exports. No 4.x three component
// is ported.
//
// The dist half needs the `plat:build:dist` artifact (`dist/`), which GitLab
// hands to every later-stage job in the pipeline (surf:test:doubles
// [capability] runs this file with it). Without dist the test FAILS naming the
// producer job; it never skips.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { ENTRIES } from '../../src/contracts/entries';

const ROOT = join(__dirname, '../..');
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const MANIFEST = JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8'));
const SUBPATH = './three';

function requireDist(rel: string): string {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    throw new Error(
      `${rel} is missing. package.json exports['${SUBPATH}'] points at it, so 'aura-glass/three' cannot resolve. ` +
        'It is produced by `npm run build` (GitLab job plat:build:dist, PLAT/FIN-C build config).',
    );
  }
  return abs;
}

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

  it("Object.keys(await import('aura-glass/three')) is empty against the built dist", () => {
    requireDist(PKG.exports[SUBPATH].default.replace(/^\.\//, ''));
    // A fresh Node process resolves the bare specifier through the package's
    // own `exports` (self-reference), exactly as a consumer would.
    const out = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        "const m = await import('aura-glass/three'); process.stdout.write(JSON.stringify(Object.keys(m)));",
      ],
      { cwd: ROOT, encoding: 'utf8' },
    );
    expect(JSON.parse(out)).toEqual([]);
  });

  it('the built declaration file declares 0 exports', () => {
    const dts = requireDist(PKG.exports[SUBPATH].types.replace(/^\.\//, ''));
    const program = ts.createProgram([dts], { noEmit: true, skipLibCheck: true });
    const source = program.getSourceFile(dts);
    const symbol = source && program.getTypeChecker().getSymbolAtLocation(source);
    expect(symbol).toBeDefined();
    expect(program.getTypeChecker().getExportsOfModule(symbol!).map((s) => s.name)).toEqual([]);
  });
});
