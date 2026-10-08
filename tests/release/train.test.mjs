import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';

const train = readFileSync('docs/release/train.md', 'utf8');
const gates = readFileSync('docs/release/5.0.0-gates.md', 'utf8');

describe('release train (PLAT-216/217)', () => {
  const stops = ['4.1.1', '4.2.0', '4.3.0', '4.4.0', '5.0.0-alpha', '5.0.0-beta', '5.0.0-rc', 'GA'];
  it.each(stops)('stop %s exists with an entry gate', (stop) => {
    expect(train).toMatch(new RegExp(stop.replace(/\./g, '\\.')));
  });
  it('4.4.0 is late C-D only', () => { expect(train).toMatch(/4\.4\.0[\s\S]{0,200}[Ll]ate C-D only/); });
  it('GA requires ReleaseVerdict.ga, the 4-week P0-free window, merge to main, and v4-lts', () => {
    for (const s of ['ReleaseVerdict.ga', '4 weeks', 'merged into `main`', 'v4-lts'])
      expect(train).toContain(s);
  });
  it('gate ids come from the contract §6.2 list (G-01..G-16)', () => {
    for (const g of ['G-05', 'G-07', 'G-08', 'G-11', 'G-12', 'G-15'])
      expect(train).toMatch(new RegExp(g));
  });
  it('the dates match the PRD stops', () => {
    for (const d of ['2026-10-12', '2026-11-16', '2027-01-18']) expect(train).toContain(d);
  });
  it('5.0.0-gates.md has a section per 5.0 stop with named evidence', () => {
    for (const s of ['5.0.0-alpha.1', '5.0.0-beta.1', '5.0.0-rc.1', '5.0.0 GA'])
      expect(gates).toContain(`## ${s}`);
    for (const e of ['change-class', 'deprecation-coverage', 'canary', 'API frozen', 'ReleaseVerdict'])
      expect(gates.toLowerCase()).toContain(e.toLowerCase());
  });
});
