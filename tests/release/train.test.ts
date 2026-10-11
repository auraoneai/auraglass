/* REQ-PLAT-36: docs/release/train.md lists every train stop with its PRD entry gates, each gate
   tagged with a checklist id from docs/release/train-checklist.json. Removing a gate (its id or
   its PRD clause) from its stop fails this test. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';

interface Gate { id: string; gate: string; status: string; evidence: string | null }
interface Stop { id: string; line: string; targetDate: string; gates: Gate[] }

const train = readFileSync('docs/release/train.md', 'utf8');
const gatesDoc = readFileSync('docs/release/5.0.0-gates.md', 'utf8');
const checklist = JSON.parse(readFileSync('docs/release/train-checklist.json', 'utf8')) as {
  rule: string; stops: Stop[];
};

const STOPS = ['4.1.1', '4.2.0', '4.3.0', '4.4.0', '5.0.0-alpha.N', '5.0.0-beta.1', '5.0.0-rc.1', '5.0.0-GA'];
const heading = (id: string) => id.replace(/-GA$/, ' GA');

/** The `### <stop> — …` section of train.md, up to the next `###`/`##`. */
function stopSection(id: string): string {
  const re = new RegExp(`^### ${heading(id).replace(/\./g, '\\.')} — .*$`, 'm');
  const m = re.exec(train);
  if (!m) throw new Error(`train.md has no section for stop ${id}`);
  const rest = train.slice(m.index + m[0].length);
  const end = rest.search(/^##{1,2} /m);
  return end < 0 ? rest : rest.slice(0, end);
}
const idsIn = (text: string) => [...text.matchAll(/`(TR-[^`<>]+-\d+)`/g)].map((m) => m[1]);

// PRD REQ-PLAT-36 entry gates, per stop (clause → literal that must appear in that stop's section).
const PRD_GATES: Array<[string, string[]]> = [
  ['4.1.1', ['REQ-PLAT-37..55', 'advisory is published before the tag']],
  ['4.2.0', ['Change class ≤ C-D', '"C-D since 4.2"', 'REQ-PLAT-56..61', 'Downstream grep attached']],
  ['4.3.0', ['Change class ≤ C-D', '`since` ≤ 4.3.0', 'C-B item', 'Codemod fixture suite green',
    '`@auraglass/cli@0.x` published', '`plat:test:visual-4x`']],
  ['4.4.0', ['Late C-D only', 'B-id already exists']],
  ['5.0.0-alpha.N', ['from `next` to the `next` dist-tag', 'never waits for a stream']],
  ['5.0.0-beta.1', ['REQ-PLAT-28', 'frozen 4.x fixture after `migrate 4to5`']],
  ['5.0.0-rc.1', ['`etc/api/*.api.md` between rc.1 and GA', 'fixes a P0 and is listed in the RC notes',
    'Zero open P0', 'every canary and every registry block']],
  ['5.0.0-GA', ['`ReleaseVerdict.ga === true`', '4 weeks since the first P0-free RC', '`next` merged into `main`',
    'never a retag', '`v4-lts` dist-tag set']],
];

describe('release train (REQ-PLAT-36)', () => {
  it('the checklist has the eight stops in train order', () => {
    expect(checklist.stops.map((s) => s.id)).toEqual(STOPS);
  });

  it('train.md has a section per stop, in the same order', () => {
    const order = STOPS.map((id) => train.search(new RegExp(`^### ${heading(id).replace(/\./g, '\\.')} — `, 'm')));
    expect(order.every((v, i) => v >= 0 && (i === 0 || v > (order[i - 1] ?? -1)))).toBe(true);
  });

  it.each(checklist.stops.map((s) => [s.id, s] as const))('%s: train.md lists exactly the checklist gate ids', (id, stop) => {
    expect(stop.gates.length).toBeGreaterThan(0);
    expect(idsIn(stopSection(id))).toEqual(stop.gates.map((g) => g.id));
  });

  it('gate ids are unique and every id in train.md is in the checklist', () => {
    const all = checklist.stops.flatMap((s) => s.gates.map((g) => g.id));
    expect(new Set(all).size).toBe(all.length);
    expect(idsIn(train).sort()).toEqual([...all].sort());
  });

  it('the checklist mirrors the gate text of train.md', () => {
    for (const s of checklist.stops)
      for (const g of s.gates) expect(stopSection(s.id)).toContain(`- \`${g.id}\` ${g.gate}`);
  });

  it.each(PRD_GATES)('%s carries its PRD entry gates', (id, literals) => {
    const section = stopSection(id);
    for (const l of literals) expect(section).toContain(l);
  });

  it('the dated stops carry the PRD dates in both documents', () => {
    const dated: Array<[string, string]> = [['4.1.1', '2026-10-12'], ['4.2.0', '2026-11-16'], ['4.3.0', '2027-01-18']];
    for (const [id, date] of dated) {
      expect(checklist.stops.find((s) => s.id === id)?.targetDate).toBe(date);
      expect(train).toMatch(new RegExp(`^### ${id.replace(/\./g, '\\.')} — .*${date}`, 'm'));
    }
  });

  it('a missed gate moves the date, never the gate', () => {
    expect(train).toContain('A missed gate moves the date, never the gate.');
    expect(checklist.rule).toBe('A missed gate moves the date, never the gate.');
  });

  it('gates start open; status and evidence are written by the release jobs', () => {
    for (const s of checklist.stops) for (const g of s.gates) {
      expect(['open', 'pass', 'fail']).toContain(g.status);
      if (g.status !== 'open') expect(g.evidence).toMatch(/^https:\/\//);
    }
  });

  it('names the contract §6.2 gates the train feeds', () => {
    for (const g of ['G-05', 'G-07', 'G-08', 'G-11', 'G-12', 'G-15']) expect(train).toContain(g);
  });

  it('5.0.0-gates.md has a section per 5.0 stop with named evidence', () => {
    for (const s of ['5.0.0-alpha.1', '5.0.0-beta.1', '5.0.0-rc.1', '5.0.0 GA'])
      expect(gatesDoc).toContain(`## ${s}`);
    for (const e of ['change-class', 'deprecation-coverage', 'canary', 'API frozen', 'ReleaseVerdict'])
      expect(gatesDoc.toLowerCase()).toContain(e.toLowerCase());
  });
});
