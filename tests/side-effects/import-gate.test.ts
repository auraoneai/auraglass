/* @jest-environment node */
/* PLAT-263/265: the verify script + the empty PLAT fragment gate imports. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt } from '../build/helpers';

describe('side-effects gate (PLAT-263)', () => {
  it('verify-side-effects passes on the emitted artifact', () => {
    ensureBuilt();
    const out = execFileSync('node', ['scripts/ci/verify-side-effects.mjs'], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/verify-side-effects: \d+ recorded call\(s\)/);
  }, 180_000);

  it('writes .artifacts/plat/side-effects.json with zero violations', () => {
    const p = join(ROOT, '.artifacts', 'plat', 'side-effects.json');
    expect(existsSync(p)).toBe(true);
    const rec = JSON.parse(readFileSync(p, 'utf8'));
    expect(rec.violations).toEqual([]);
  });
});
