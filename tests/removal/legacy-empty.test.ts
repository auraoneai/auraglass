/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// PLAT-241 / G-12: GA-scope check — runs only when AG_SCOPE=release and the
// git tag is v5.x.y; reports (never fails) otherwise. At GA: legacy/ has no
// tracked files and reports/ is absent from the index.
const isGaScope = process.env.AG_SCOPE === 'release';
const tag = (() => {
  try { return execFileSync('git', ['tag', '--points-at', 'HEAD'], { encoding: 'utf8' }).split('\n')[0]; }
  catch { return ''; }
})();
const isGaTag = /^v5\.\d+\.\d+$/.test(tag);

const active = isGaScope && isGaTag;

describe('legacy quarantine empties before GA (PLAT-241)', () => {
  it('reports scope and stays green outside GA', () => {
    if (!active) {
      console.log(`legacy-empty: not GA scope (AG_SCOPE=${process.env.AG_SCOPE ?? '-'}, tag=${tag || '-'}) — reported, not asserted`);
      return;
    }
    const legacyFiles = execFileSync('git', ['ls-files', 'legacy/'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(legacyFiles).toEqual([]);
    const reportsFiles = execFileSync('git', ['ls-files', 'reports/'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(reportsFiles).toEqual([]);
    expect(existsSync('reports/')).toBe(false);
  });
  it('always true on this branch regardless of scope: reports/ is untracked', () => {
    const reportsFiles = execFileSync('git', ['ls-files', 'reports/'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    expect(reportsFiles).toEqual([]);
  });
});
