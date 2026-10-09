/* @jest-environment node */
/* REQ-CMP-29: '.' and './primitives' are emitted — the last seed markers in
   their import closures were stripped (surf.ts comment, createGlassTheme
   header); theme/motion stay pending on their own MAT-owned seeds. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, read } from '../build/helpers';

const manifest = JSON.parse(read('build/exports.manifest.json'));
const pkg = JSON.parse(read('package.json'));

describe('seed-stripped entries (REQ-CMP-29)', () => {
  it("package.json exports includes '.' and './primitives'", () => {
    const exports_ = pkg.exports as Record<string, unknown>;
    expect(Object.keys(exports_)).toContain('.');
    expect(Object.keys(exports_)).toContain('./primitives');
  });

  it("the manifest keeps 'aura-glass' and 'aura-glass/primitives' resolvable", () => {
    const subs = (manifest.entries as { subpath: string }[]).map((e) => e.subpath);
    expect(subs).toContain('.');
    expect(subs).toContain('./primitives');
  });

  it('generate-exports --check passes with the regenerated map', () => {
    expect(() => execFileSync('node', ['scripts/build/generate-exports.mjs', '--check'], { cwd: ROOT })).not.toThrow();
  });

  it('no @ag-contract-seed literal remains in src/root/surf.ts or createGlassTheme.ts', () => {
    for (const f of ['src/root/surf.ts', 'src/theme/createGlassTheme.ts']) {
      expect(readFileSync(join(ROOT, f), 'utf8')).not.toContain('@ag-contract-seed');
    }
  });
});
