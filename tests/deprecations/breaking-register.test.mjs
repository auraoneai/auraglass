/* @jest-environment node */
/* tests/deprecations/breaking-register.test.mjs — REQ-PLAT-29 (PLAT-195): the
   register has B1..B21; unreferenced B-id fails; missing anchor fails (fixture
   guide); coverage output shape. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { checkRegister, coverage } from '../../scripts/release/verify-breaking-register.mjs';

const register = JSON.parse(readFileSync(join(process.cwd(), 'docs/release/breaking-changes.json'), 'utf8'));
const E = (id, b, kind = 'export') => ({ id, kind, breaking: b, symbol: 'x', since: '4.2.0', removeIn: '5.0.0', codemod: 'canonical-names' });
const GUIDE = '<h2 id="b-1">B1</h2><h2 id="b-3">B3</h2>';

describe('the committed register', () => {
  it('contains B1..B21 exactly once', () => {
    const ids = register.items.map((i) => i.id);
    expect(ids).toEqual(Array.from({ length: 21 }, (_, i) => `B${i + 1}`));
    expect(new Set(ids).size).toBe(21);
  });
  it('every item has the §11 fields', () => {
    for (const item of register.items) {
      expect(item.title).toBeTruthy();
      expect(item.affected).toBeTruthy();
      expect(item.cdIn).toMatch(/^4\.\d+\.\d+$/);
      expect(item.path).toBeTruthy();
    }
  });
  it('B17..B21 match the REQ-PLAT-29 additions', () => {
    const t = register.items.slice(16).map((i) => `${i.id}:${i.title}`);
    expect(t.join('|')).toMatch(/B17.*[Aa]sset/);
    expect(t.join('|')).toMatch(/B18.*[Pp]rimitives/);
    expect(t.join('|')).toMatch(/B19.*[Ii]cons/);
    expect(t.join('|')).toMatch(/B20.*[Dd]ead optical/);
    expect(t.join('|')).toMatch(/B21.*[Pp]rovider/);
  });
});

describe('checkRegister', () => {
  it('fails when a B-id is unreferenced', () => {
    const errs = checkRegister([{ id: 'B9' }], [], GUIDE);
    expect(errs.join()).toMatch(/B9: not referenced/);
  });
  it('fails when a notice B-id has no notice entry', () => {
    const errs = checkRegister([{ id: 'B1' }], [E('DEP-P0001', 'B1')], GUIDE);
    expect(errs.join()).toMatch(/B1: notice B-id needs a kind peer\|engine\|behavior/);
  });
  it('accepts a notice entry for B1', () => {
    const e = { ...E('DEP-P0001', 'B1', 'engine'), codemod: null };
    expect(checkRegister([{ id: 'B1' }], [e], GUIDE)).toEqual([]);
  });
  it('fails when the anchor is missing from the guide', () => {
    const errs = checkRegister([{ id: 'B4' }], [E('DEP-P0001', 'B4')], GUIDE);
    expect(errs.join()).toMatch(/B4: no #b-4 anchor/);
  });
  it('passes a covered id with anchor', () => {
    expect(checkRegister([{ id: 'B3' }], [E('DEP-P0001', 'B3')], GUIDE)).toEqual([]);
  });
});

describe('coverage output', () => {
  it('shape: version, total, uncoveredCount, per-entry rows', () => {
    const c = coverage([E('DEP-P0001', 'B3')], { published: { '4.2.0': ['DEP-P0001'] } });
    expect(c).toMatchObject({ version: 1, total: 1, uncoveredCount: 0 });
    expect(c.entries[0]).toMatchObject({ id: 'DEP-P0001', coverage: 'covered' });
  });
});
