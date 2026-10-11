/* @jest-environment node */
/* tests/material/exports/entries.test.ts — REQ-MAT-22 entry parity (REQ-FIN-54,
   FIN-D D.3-14). For every MAT-owned ENTRIES row the runtime value exports of
   the source barrel equal the frozen contract list exactly (no more, no less),
   src/root/mat.ts equals ROOT_EXPORTS.mat, and the committed API reports
   (etc/api/<entry>.exports.json, written by `npm run api:update -- --entry <e>`)
   record the same names, so a drifting barrel or a stale report both fail. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ENTRIES, ROOT_EXPORTS } from '../../../src/contracts/entries';
import * as materialEntry from '../../../src/material/index';
import * as themeEntry from '../../../src/theme/public';
import * as motionEntry from '../../../src/motion/public';
import * as rootMat from '../../../src/root/mat';

const ROOT = join(__dirname, '../../..');
const sorted = (xs: readonly string[]) => [...xs].sort();
const spec = (subpath: string) => {
  const row = ENTRIES.find((e) => e.subpath === subpath);
  if (!row) throw new Error(`ENTRIES has no ${subpath} row`);
  return row;
};
const report = (stem: string): string[] =>
  JSON.parse(readFileSync(join(ROOT, `etc/api/${stem}.exports.json`), 'utf8')).exports;

/* src/tokens/index.ts is generated with NodeNext `./generated/*.js` specifiers,
   which jest's resolver cannot map to .ts (jest.config.js is contract-owned).
   Import it the way a consumer does: bundle the barrel with esbuild into a
   module under node_modules/.cache and load it with Node's own import(). */
const tokensEntry: Record<string, unknown> = (() => {
  const dir = join(ROOT, 'node_modules/.cache/ag-entries-test');
  mkdirSync(dir, { recursive: true });
  const out = join(dir, 'tokens.mjs');
  const script = `
    const { build } = await import('esbuild');
    await build({ entryPoints: [${JSON.stringify(join(ROOT, 'src/tokens/index.ts'))}], bundle: true,
      format: 'esm', platform: 'node', outfile: ${JSON.stringify(out)}, logLevel: 'silent' });
    const m = await import(${JSON.stringify(`file://${out}`)});
    console.log(JSON.stringify({ keys: Object.keys(m), tokens: m.tokens ?? null }));`;
  const res = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { cwd: ROOT, encoding: 'utf8' }));
  const mod: Record<string, unknown> = {};
  for (const k of res.keys) mod[k] = k === 'tokens' ? res.tokens : true;
  return mod;
})();

const CASES = [
  { subpath: './material', source: 'src/material/index.ts', mod: materialEntry },
  { subpath: './theme', source: 'src/theme/public.ts', mod: themeEntry },
  { subpath: './tokens', source: 'src/tokens/index.ts', mod: tokensEntry },
  { subpath: './motion', source: 'src/motion/public.ts', mod: motionEntry },
] as const;

describe('MAT entry parity (REQ-MAT-22)', () => {
  it('covers every MAT-owned module entry in ENTRIES', () => {
    const matModules = ENTRIES.filter((e) => e.owner === 'MAT' && e.source.startsWith('src/')).map((e) => e.subpath);
    expect(sorted(matModules)).toEqual(sorted(CASES.map((c) => c.subpath)));
  });

  for (const { subpath, source, mod } of CASES) {
    describe(subpath, () => {
      it(`source barrel is ${source}`, () => {
        expect(spec(subpath).source).toBe(source);
      });

      it('runtime value exports equal ENTRIES exports exactly', () => {
        expect(sorted(Object.keys(mod))).toEqual(sorted(spec(subpath).exports));
      });

      it('etc/api report records exactly the runtime exports', () => {
        expect(sorted(report(subpath.slice(2)))).toEqual(sorted(Object.keys(mod)));
      });
    });
  }

  describe('root.mat', () => {
    it('src/root/mat.ts re-exports exactly ROOT_EXPORTS.mat', () => {
      expect(sorted(Object.keys(rootMat))).toEqual(sorted(ROOT_EXPORTS.mat));
    });

    it('etc/api/root.mat report records exactly the runtime exports', () => {
      expect(sorted(report('root.mat'))).toEqual(sorted(Object.keys(rootMat)));
    });
  });

  describe('./tokens content', () => {
    it('tokens holds public variables only: no private --_ag-* key, each value var(<name>)', () => {
      const tokens = (tokensEntry as { tokens?: Record<string, string> }).tokens ?? {};
      const keys = Object.keys(tokens);
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.filter((k) => k.startsWith('--_ag-'))).toEqual([]);
      expect(keys.filter((k) => !k.startsWith('--ag-'))).toEqual([]);
      expect(Object.entries(tokens).filter(([k, v]) => v !== `var(${k})`)).toEqual([]);
    });
  });

  describe('./theme moves', () => {
    it('createGlassThemeCssVars and createBrandGlassTheme are reachable only through compat.mat', () => {
      expect(Object.keys(themeEntry)).not.toContain('createGlassThemeCssVars');
      expect(Object.keys(themeEntry)).not.toContain('createBrandGlassTheme');
      expect(report('compat.mat')).toEqual(expect.arrayContaining(['createGlassThemeCssVars', 'createBrandGlassTheme']));
    });
  });
});
