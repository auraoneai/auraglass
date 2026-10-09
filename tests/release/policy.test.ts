/* @jest-environment node */
/* tests/release/policy.test.ts — REQ-PLAT-18 (4x port): the §4.4 taxonomy in
   code and docs. policy.mjs is ESM: jest's 4x transform cannot import it, so
   each case execs real node --input-type=module and asserts on its JSON dump. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const EVAL = (body: string): any =>
  JSON.parse(
    execFileSync('node', ['--input-type=module', '-e',
      `const m = await import('./scripts/release/lib/policy.mjs');\n${body}`],
      { encoding: 'utf8' }),
  );

const doc = readFileSync(join(process.cwd(), 'docs/release/change-classes.md'), 'utf8');
const constants = () => EVAL(`console.log(JSON.stringify({
  CLASSES: m.CLASSES, TARGETS: m.TARGETS, VISUAL: m.VISUAL_TOLERANCE,
  BUMP_RANK: m.BUMP_RANK, FLOOR: m.CLASS_CHANGESET_FLOOR, RANK: m.CLASS_RANK,
  ALLOWED: m.ALLOWED,
}))`);

describe('policy.mjs taxonomy (exec port of the .mjs test)', () => {
  it('defines every §4.4 class and target', () => {
    const c = constants();
    expect(c.CLASSES).toEqual(['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL', 'C-B']);
    expect(c.TARGETS).toEqual(['4x-patch', '4x-minor', '4x-4.4', 'next-pre', '5x-patch', '5x-minor']);
    expect(c.VISUAL).toEqual({ pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 });
  });

  it.each([
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
    const r = EVAL(`console.log(JSON.stringify(m.allowedOn('${cls}', '${target}')))`);
    expect(r).toBe(want);
  });

  it('rejects an unknown target', () => {
    let threw = '';
    try {
      execFileSync('node', ['--input-type=module', '-e',
        `const m = await import('./scripts/release/lib/policy.mjs'); m.allowedOn('C-I','nowhere')`],
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e: any) { threw = `${e.stderr}`; }
    expect(threw).toMatch(/unknown target/);
  });

  it('changeset floor ranks C-I < C-E < C-B and C-B outranks C-D-IL', () => {
    const c = constants();
    expect(c.BUMP_RANK[c.FLOOR['C-I']]).toBe(0);
    expect(c.BUMP_RANK[c.FLOOR['C-E']]).toBe(1);
    expect(c.BUMP_RANK[c.FLOOR['C-B']]).toBe(2);
    expect(c.RANK['C-B']).toBeGreaterThan(c.RANK['C-D-IL']);
  });

  describe('install-level move', () => {
    const runIL = (extra: string) => EVAL(`console.log(JSON.stringify(m.installLevelViolations({
      depEntry: { kind: 'dependency', since: '4.2.0', symbol: 'zod' }, version: '4.2.0', ${extra} })))`);
    it('satisfied move reports no violations', () => {
      expect(runIL(`
        sources: { 'src/x.ts': 'const m = await import(\\'zod\\').catch(() => { throw new Error(\\"[aura-glass] zod is now an optional peer; install it: npm i zod\\") })' },
        doctorReport: { undeclared: [] },
        releaseNotes: { firstList: ['zod moved to an optional peer'] },`)).toEqual([]);
    });
    it('flags each missing condition', () => {
      expect(JSON.stringify(EVAL(`console.log(JSON.stringify(m.installLevelViolations({ depEntry: null, version: '4.2.0' })))`))).not.toBe('[]');
      const v: string[] = runIL(`
        sources: { 'src/x.ts': 'import z from \\'zod\\'' }, releaseNotes: { firstList: [] },`);
      expect(v.join('\n')).toMatch(/lazily/);
      expect(v.join('\n')).toMatch(/doctor --v5/);
      expect(v.join('\n')).toMatch(/release notes/);
    });
  });

  it('the markdown tables equal the code tables', () => {
    const c = constants();
    for (const cls of c.CLASSES) {
      expect(doc).toContain(cls === 'C-I-VF' ? 'C-I (visual fix)' : cls === 'C-D-IL' ? 'C-D (install-level)' : `**${cls}**`);
    }
    for (const list of Object.values(c.ALLOWED) as string[][]) {
      for (const cls of list) expect(c.CLASSES).toContain(cls);
    }
    for (const label of ['4.x patch', '4.x minor ≤ 4.3', '4.x minor = 4.4', '`next` pre-release', '5.x patch', '5.x minor']) {
      expect(doc).toContain(label);
    }
  });
});
