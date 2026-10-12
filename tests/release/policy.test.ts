/* @jest-environment node */
/* tests/release/policy.test.ts — REQ-PLAT-18 (release/4.x port of
   tests/release/policy.test.mjs on next): the §4.4 taxonomy in code and docs.
   policy.mjs is ESM and the 4x jest transform cannot import it, so the module
   is loaded once by real `node --input-type=module`, which evaluates every
   case and prints one JSON object; the cases below assert on that dump. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from '@jest/globals';

const ROOT = process.cwd();
const run = (body: string): any => JSON.parse(execFileSync('node', ['--input-type=module', '-e',
  `const m = await import(${JSON.stringify(join(ROOT, 'scripts/release/lib/policy.mjs'))});\n${body}`],
{ cwd: ROOT, encoding: 'utf8' }));

const CLASSES = ['C-I', 'C-I-VF', 'C-E', 'C-D', 'C-D-IL', 'C-B'];
const TARGETS = ['4x-patch', '4x-minor', '4x-4.4', 'next-pre', '5x-patch', '5x-minor'];
const MARKERS: Array<[string, Record<string, unknown>]> = [
  ['C-B', {}], ['C-B', { hasBang: true }], ['C-B', { hasBreaking: true }],
  ['C-E', { hasBang: true }], ['C-B', { hasBang: true, line: '4x' }], ['C-I', { hasBang: true, line: '4x' }],
];
const BUMPS: Array<[string, string[], number]> = [
  ['C-I', ['patch'], 0], ['C-E', ['patch'], 1], ['C-E', ['minor'], 0],
  ['C-D', ['minor'], 0], ['C-D-IL', ['minor'], 0], ['C-B', ['major'], 0],
  ['C-B', ['minor'], 1], ['C-E', ['patch', 'minor'], 0], ['C-B', ['major', 'patch'], 0],
];
const IL_SOURCE = 'const m = await import(\'zod\').catch(() => { throw new Error("[aura-glass] zod is now an optional peer; install it: npm i zod") })';

const dump = run(`
const allowed = {};
for (const t of ${JSON.stringify(TARGETS)}) for (const c of ${JSON.stringify(CLASSES)}) allowed[c + '|' + t] = m.allowedOn(c, t);
let unknownTarget = '';
try { m.allowedOn('C-I', 'nowhere'); } catch (e) { unknownTarget = String(e.message); }
const dep = { kind: 'dependency', since: '4.2.0', symbol: 'zod' };
console.log(JSON.stringify({
  CLASSES: m.CLASSES, TARGETS: m.TARGETS, VISUAL: m.VISUAL_TOLERANCE, ALLOWED: m.ALLOWED,
  BUMP_RANK: m.BUMP_RANK, FLOOR: m.CLASS_CHANGESET_FLOOR, RANK: m.CLASS_RANK,
  allowed, unknownTarget,
  markers: ${JSON.stringify(MARKERS)}.map(([c, o]) => m.checkMarkers(c, o)),
  bumps: ${JSON.stringify(BUMPS)}.map(([c, b]) => m.checkChangesetBump(c, b).length),
  ilOk: m.installLevelViolations({ depEntry: dep, version: '4.2.0',
    sources: { 'src/x.ts': ${JSON.stringify(IL_SOURCE)} }, doctorReport: { undeclared: [] },
    releaseNotes: { firstList: ['zod moved to an optional peer'] } }),
  ilNoEntry: m.installLevelViolations({ depEntry: null, version: '4.2.0' }),
  ilBad: m.installLevelViolations({ depEntry: dep, version: '4.2.0',
    sources: { 'src/x.ts': "import z from 'zod'" }, releaseNotes: { firstList: [] } }),
}));`);

const doc = readFileSync(join(ROOT, 'docs/release/change-classes.md'), 'utf8');
const DOC_CLASS: Record<string, string> = { 'C-I (visual fix)': 'C-I-VF', 'C-D (install-level)': 'C-D-IL' };
const DOC_TARGET: Record<string, string> = {
  '4.x patch': '4x-patch', '4.x minor ≤ 4.3': '4x-minor', '4.x minor = 4.4': '4x-4.4',
  '`next` pre-release': 'next-pre', '5.x patch': '5x-patch', '5.x minor': '5x-minor',
};
/** Rows of the markdown table whose header row starts with `| <first> |`. */
function tableRows(first: string): string[][] {
  const lines = doc.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`| ${first} |`));
  const rows: string[][] = [];
  for (let i = start + 2; start >= 0 && i < lines.length && lines[i]!.startsWith('|'); i++) {
    rows.push(lines[i]!.split('|').slice(1, -1).map((c) => c.trim()));
  }
  return rows;
}

describe('policy.mjs taxonomy (REQ-PLAT-18, 4x exec port)', () => {
  it('defines every §4.4 class and target', () => {
    expect(dump.CLASSES).toEqual(CLASSES);
    expect(dump.TARGETS).toEqual(TARGETS);
    expect(dump.VISUAL).toEqual({ pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 });
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
    expect(dump.allowed[`${cls}|${target}`]).toBe(want);
  });

  it('rejects an unknown target', () => {
    expect(dump.unknownTarget).toMatch(/unknown target/);
  });

  describe('marker rules', () => {
    it('C-B without ! fails', () => { expect(dump.markers[0].join()).toMatch(/no '!' or 'BREAKING CHANGE:'/); });
    it('C-B with ! passes', () => { expect(dump.markers[1]).toEqual([]); });
    it('C-B with BREAKING CHANGE: passes', () => { expect(dump.markers[2]).toEqual([]); });
    it('! below C-B fails', () => { expect(dump.markers[3].join()).toMatch(/< C-B/); });
    it('! on release/4.x always fails', () => {
      expect(dump.markers[4].join()).toMatch(/never allowed on release\/4\.x/);
      expect(dump.markers[5].join()).toMatch(/never allowed on release\/4\.x/);
    });
  });

  describe('changeset floor', () => {
    it.each(BUMPS.map((b, i) => [...b, i] as const))('class %s with bumps %j -> %d errors', (_c, _b, n, i) => {
      expect(dump.bumps[i]).toBe(n);
    });
    it('floors follow the class rank', () => {
      expect(dump.BUMP_RANK[dump.FLOOR['C-I']]).toBe(0);
      expect(dump.BUMP_RANK[dump.FLOOR['C-E']]).toBe(1);
      expect(dump.BUMP_RANK[dump.FLOOR['C-B']]).toBe(2);
      expect(dump.RANK['C-B']).toBeGreaterThan(dump.RANK['C-D-IL']);
    });
  });

  describe('install-level move', () => {
    it('satisfied move reports no violations', () => { expect(dump.ilOk).toEqual([]); });
    it('flags each missing condition', () => {
      expect(dump.ilNoEntry).toHaveLength(1);
      const v = dump.ilBad.join('\n');
      expect(v).toMatch(/lazily/);
      expect(v).toMatch(/doctor --v5/);
      expect(v).toMatch(/release notes/);
    });
  });

  it('the markdown class table names exactly the code classes, in order', () => {
    const names = tableRows('Class').map((r) => r[0]!.replace(/^\*\*|\*\*$/g, ''));
    expect(names.map((n) => DOC_CLASS[n] ?? n)).toEqual(dump.CLASSES);
  });

  it('the markdown allowed-class table equals ALLOWED', () => {
    const fromDoc: Record<string, string[]> = {};
    for (const [label, cell] of tableRows('Target')) {
      const target = DOC_TARGET[label!];
      expect([label, target]).toEqual([label, expect.any(String)]);
      // Parenthetical notes after a class list ("(plus …)", "(late finds …)") are prose.
      fromDoc[target!] = cell!.replace(/\s*\((?!visual fix\)|install-level\))[^)]*\)/g, '')
        .split(',').map((s) => s.trim()).filter(Boolean).map((s) => DOC_CLASS[s] ?? s);
    }
    expect(fromDoc).toEqual(dump.ALLOWED);
  });
});
