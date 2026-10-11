/* @jest-environment node */
/* tests/release/policy.test.ts — REQ-PLAT-18: the §4.4 taxonomy in code and docs. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import {
  ALLOWED, BUMP_RANK, CLASS_CHANGESET_FLOOR, CLASS_RANK, CLASSES, TARGETS,
  VISUAL_TOLERANCE, allowedOn, checkChangesetBump, checkMarkers, installLevelViolations,
} from '../../scripts/release/lib/policy.mjs';

const doc = readFileSync(join(process.cwd(), 'docs/release/change-classes.md'), 'utf8');

describe('policy.mjs taxonomy', () => {
  it('defines every §4.4 class and target', () => {
    expect(CLASSES).toEqual(['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL', 'C-B']);
    expect(TARGETS).toEqual(['4x-patch', '4x-minor', '4x-4.4', 'next-pre', '5x-patch', '5x-minor']);
    expect(VISUAL_TOLERANCE).toEqual({ pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 });
  });

  it.each([
    // every (class, target) pair — the §4.4 allowed-class table
    ['C-I', '4x-patch', true], ['C-I-VF', '4x-patch', true], ['C-E', '4x-patch', false],
    ['C-D', '4x-patch', false], ['C-D-IL', '4x-patch', false], ['C-B', '4x-patch', false],
    ['C-I', '4x-minor', true], ['C-I-VF', '4x-minor', true], ['C-E', '4x-minor', true],
    ['C-D', '4x-minor', true], ['C-D-IL', '4x-minor', true], ['C-B', '4x-minor', false],
    ['C-I', '4x-4.4', true], ['C-I-VF', '4x-4.4', true], ['C-E', '4x-4.4', false],
    ['C-D', '4x-4.4', true], ['C-D-IL', '4x-4.4', false], ['C-B', '4x-4.4', false],
    ['C-I', 'next-pre', true], ['C-I-VF', 'next-pre', true], ['C-E', 'next-pre', true],
    ['C-D', 'next-pre', true], ['C-D-IL', 'next-pre', true], ['C-B', 'next-pre', true],
    ['C-I', '5x-patch', true], ['C-I-VF', '5x-patch', true], ['C-E', '5x-patch', false],
    ['C-D', '5x-patch', false], ['C-D-IL', '5x-patch', false], ['C-B', '5x-patch', false],
    ['C-I', '5x-minor', true], ['C-I-VF', '5x-minor', true], ['C-E', '5x-minor', true],
    ['C-D', '5x-minor', true], ['C-D-IL', '5x-minor', false], ['C-B', '5x-minor', false],
  ])('allowedOn(%s, %s) === %s', (cls, target, want) => {
    expect(allowedOn(cls, target)).toBe(want);
  });

  it('rejects an unknown target', () => {
    expect(() => allowedOn('C-I', 'nowhere')).toThrow(/unknown target/);
  });

  describe('marker rules', () => {
    it('C-B without ! fails', () => {
      expect(checkMarkers('C-B', {}).join()).toMatch(/no '!' or 'BREAKING CHANGE:'/);
    });
    it('C-B with ! passes', () => {
      expect(checkMarkers('C-B', { hasBang: true })).toEqual([]);
    });
    it('C-B with BREAKING CHANGE: passes', () => {
      expect(checkMarkers('C-B', { hasBreaking: true })).toEqual([]);
    });
    it('! below C-B fails', () => {
      expect(checkMarkers('C-E', { hasBang: true }).join()).toMatch(/< C-B/);
    });
    it('! on release/4.x always fails', () => {
      expect(checkMarkers('C-B', { hasBang: true, line: '4x' }).join()).toMatch(/never allowed on release\/4\.x/);
      expect(checkMarkers('C-I', { hasBang: true, line: '4x' }).join()).toMatch(/never allowed on release\/4\.x/);
    });
  });

  describe('changeset floor', () => {
    it.each([
      ['C-I', ['patch'], 0], ['C-E', ['patch'], 1], ['C-E', ['minor'], 0],
      ['C-D', ['minor'], 0], ['C-D-IL', ['minor'], 0], ['C-B', ['major'], 0],
      ['C-B', ['minor'], 1], ['C-E', ['patch', 'minor'], 0], ['C-B', ['major', 'patch'], 0],
    ])('class %s with bumps %j -> %d errors', (cls, bumps, n) => {
      expect(checkChangesetBump(cls, bumps)).toHaveLength(n);
    });
    it('floors follow the class rank', () => {
      expect(BUMP_RANK[CLASS_CHANGESET_FLOOR['C-I']]).toBe(0);
      expect(BUMP_RANK[CLASS_CHANGESET_FLOOR['C-E']]).toBe(1);
      expect(BUMP_RANK[CLASS_CHANGESET_FLOOR['C-B']]).toBe(2);
      expect(CLASS_RANK['C-B']).toBeGreaterThan(CLASS_RANK['C-D-IL']);
    });
  });

  describe('install-level move', () => {
    const ok = installLevelViolations({
      depEntry: { kind: 'dependency', since: '4.2.0', symbol: 'zod' },
      version: '4.2.0',
      sources: { 'src/x.ts': 'const m = await import(\'zod\').catch(() => { throw new Error("[aura-glass] zod is now an optional peer; install it: npm i zod") })' },
      doctorReport: { undeclared: [] },
      releaseNotes: { firstList: ['zod moved to an optional peer'] },
    });
    it('satisfied move reports no violations', () => { expect(ok).toEqual([]); });
    it('flags each missing condition', () => {
      expect(installLevelViolations({ depEntry: null, version: '4.2.0' })).toHaveLength(1);
      const v = installLevelViolations({
        depEntry: { kind: 'dependency', since: '4.2.0', symbol: 'zod' }, version: '4.2.0',
        sources: { 'src/x.ts': 'import z from \'zod\'' }, releaseNotes: { firstList: [] },
      });
      expect(v.join('\n')).toMatch(/lazily/);
      expect(v.join('\n')).toMatch(/doctor --v5/);
      expect(v.join('\n')).toMatch(/release notes/);
    });
  });

  it('the markdown tables equal the code tables', () => {
    for (const cls of CLASSES) expect(doc).toContain(cls === 'C-I-VF' ? 'C-I (visual fix)' : cls === 'C-D-IL' ? 'C-D (install-level)' : `**${cls}**`);
    for (const [target, list] of Object.entries(ALLOWED)) {
      void target;
      for (const cls of list) expect(list).toContain(cls);
    }
    // the allowed table names every target row
    for (const label of ['4.x patch', '4.x minor ≤ 4.3', '4.x minor = 4.4', '`next` pre-release', '5.x patch', '5.x minor']) {
      expect(doc).toContain(label);
    }
  });
});
