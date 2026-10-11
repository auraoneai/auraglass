/* REQ-PLAT-36: train-checklist.json is the machine-readable mirror of
   docs/release/train.md — same stops, same dates, gate text on both. */
import { readFileSync } from 'node:fs';

const checklist = JSON.parse(readFileSync('docs/release/train-checklist.json', 'utf8')) as {
  stops: { id: string; gates: string[]; targetDate: string }[];
};
const train = readFileSync('docs/release/train.md', 'utf8');

describe('train-checklist.json mirrors docs/release/train.md', () => {
  it('has the 8 stops in train order', () => {
    expect(checklist.stops.map((s) => s.id)).toEqual([
      '4.1.1', '4.2.0', '4.3.0', '4.4.0', '5.0.0-alpha.N', '5.0.0-beta.1', '5.0.0-rc.1', '5.0.0-GA',
    ]);
  });
  it.each(checklist.stops.map((s) => [s.id, s]))('%s appears in train.md', (id) => {
    // ids use '-'/'.' separators; train.md may write '5.0.0 GA' — match loosely.
    expect(train).toMatch(new RegExp(String(id).split(/[-.]/).join('[\\s.-]*')));
  });
  it('dated stops carry their train.md dates', () => {
    for (const [id, date] of [['4.1.1', '2026-10-12'], ['4.2.0', '2026-11-16'], ['4.3.0', '2027-01-18']])
      expect(checklist.stops.find((s) => s.id === id)?.targetDate).toBe(date);
  });
  it('every stop names at least one gate', () => {
    for (const s of checklist.stops) expect(s.gates.length).toBeGreaterThan(0);
  });
  it('4.4.0 is late C-D only in both documents', () => {
    expect(train).toMatch(/4\.4\.0[\s\S]{0,200}[Ll]ate C-D only/);
    expect(JSON.stringify(checklist.stops.find((s) => s.id === '4.4.0'))).toContain('late C-D only');
  });
});
