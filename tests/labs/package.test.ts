// tests/labs/package.test.ts — REQ-SURF-166 (AC-SURF-28).
// packages/labs has the mandated shape: peers, sideEffects false, exports per
// resident + ./package.json only, no bin, dist-only files.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const PKG = join(ROOT, 'packages/labs/package.json');
const pkg = JSON.parse(readFileSync(PKG, 'utf8'));

describe('@auraglass/labs package shape', () => {
  it('is 0.x ESM, public scope', () => {
    expect(pkg.name).toBe('@auraglass/labs');
    expect(pkg.version).toMatch(/^0\./);
    expect(pkg.type).toBe('module');
  });
  it('declares sideEffects: false', () => {
    expect(pkg.sideEffects).toBe(false);
  });
  it('peers aura-glass ^5.0.0 and react/react-dom ^19', () => {
    expect(pkg.peerDependencies['aura-glass']).toBe('^5.0.0');
    expect(pkg.peerDependencies.react).toMatch(/^\^19/);
    expect(pkg.peerDependencies['react-dom']).toMatch(/^\^19/);
    expect(pkg.dependencies ?? {}).toEqual({});
  });
  it('has no bin', () => {
    expect(pkg.bin).toBeUndefined();
  });
  it('exports only ./package.json until residents land', () => {
    expect(Object.keys(pkg.exports)).toEqual(['./package.json']);
  });
  it('every exports entry resolves to a real file', () => {
    for (const [key, target] of Object.entries(pkg.exports as Record<string, string>)) {
      expect(existsSync(join(ROOT, 'packages/labs', target))).toBe(true);
    }
  });
  it('files list is dist + README only (no source or fixtures ship)', () => {
    for (const f of pkg.files) expect(['dist', 'README.md']).toContain(f);
  });
});
