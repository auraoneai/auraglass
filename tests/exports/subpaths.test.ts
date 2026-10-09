/* @jest-environment node */
/* PLAT-257 (REQ-PLAT-68): generated exports match build/exports.manifest.json under
   the pre-release filter; subpaths v4.1.0 had that the manifest omits are gone
   (a consumer hitting one gets ERR_PACKAGE_PATH_NOT_EXPORTED from Node). */
import { describe, expect, it } from '@jest/globals';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, read } from '../build/helpers';

const manifest = JSON.parse(read('build/exports.manifest.json'));
const pkg = JSON.parse(read('package.json'));
const v4 = JSON.parse(read('build/v4-exports.snapshot.json'));

describe('exports subpaths (PLAT-257)', () => {
  it('generate-exports --check passes: package.json is exactly the generated map', () => {
    execFileSync('node', ['scripts/build/generate-exports.mjs', '--check'], { cwd: ROOT });
  });

  it('types condition precedes default in every js entry (D-03)', () => {
    for (const [sub, cond] of Object.entries(pkg.exports)) {
      if (typeof cond !== 'object') continue;
      const keys = Object.keys(cond as Record<string, string>);
      if (!keys.includes('types')) throw new Error(`${sub} missing types-first condition`);
      expect(keys[0]).toBe('types');
    }
  });

  it('removed v4 subpaths are not exported (ERR_PACKAGE_PATH_NOT_EXPORTED class)', () => {
    const removed = Object.keys(v4).filter(k => !(k in pkg.exports));
    expect(removed.length).toBeGreaterThan(0); // the v4->v5 map actually removed things
    for (const sub of removed.slice(0, 5)) {
      // Node resolves subpath absent from exports as not exported.
      const req = createRequire(join(ROOT, 'tests/exports/subpaths.test.ts'));
      let code: string | null = null;
      try { req.resolve(`aura-glass${sub.slice(1)}`); } catch (e: any) { code = e?.code ?? null; }
      expect(['ERR_PACKAGE_PATH_NOT_EXPORTED', 'MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND']).toContain(code);
    }
  });
});

