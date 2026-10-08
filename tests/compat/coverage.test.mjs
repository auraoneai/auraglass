/* @jest-environment node */
/* tests/compat/coverage.test.mjs — REQ-PLAT-30 (PLAT-198): the three failure
   cases plus a passing set; absent report -> pending, not failure. */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from '@jest/globals';
import { checkCoverage, compatExports } from '../../scripts/release/verify-compat-coverage.mjs';

const tmp = mkdtempSync(join(tmpdir(), 'compat-cov-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

const E = (o = {}) => ({ id: 'DEP-C0001', kind: 'export', symbol: 'GlassButton', compat: 'GlassButton', replacement: 'Button', breaking: 'B5', since: '4.2.0', removeIn: '5.0.0', ...o });

describe('compatExports', () => {
  it('reads the union of compat.<stream>.exports.json', () => {
    writeFileSync(join(tmp, 'compat.cmp.exports.json'), JSON.stringify({ exports: ['GlassButton'] }));
    writeFileSync(join(tmp, 'compat.surf.exports.json'), JSON.stringify({ exports: ['OldShell'] }));
    const u = compatExports(tmp);
    expect(u.has('GlassButton')).toBe(true);
    expect(u.has('OldShell')).toBe(true);
  });
  it('absent reports directory -> empty union (pending)', () => {
    expect(compatExports(join(tmp, 'nope')).size).toBe(0);
  });
});

describe('checkCoverage', () => {
  const union = new Map([['GlassButton', 'compat.cmp.exports.json']]);
  it('passing: entry with compat + matching export + replacement', () => {
    expect(checkCoverage([E()], union).errors).toEqual([]);
  });
  it('fails: compat export without entry', () => {
    const errs = checkCoverage([], union).errors.join('\n');
    expect(errs).toMatch(/compat export 'GlassButton' has no deprecation entry/);
  });
  it('fails: entry with compat but no export', () => {
    const errs = checkCoverage([E({ symbol: 'Ghost' })], union).errors.join('\n');
    expect(errs).toMatch(/no compat\.<stream> report exports 'Ghost'/);
  });
  it('fails: compat entry with replacement null', () => {
    const errs = checkCoverage([E({ replacement: null })], union).errors.join('\n');
    expect(errs).toMatch(/removed components never enter compat/);
  });
});
