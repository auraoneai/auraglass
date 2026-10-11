/* REQ-QUAL-68 Exemptions: expired fails, OCR/console exemption rejected, >180 days rejected, valid accepted. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXEMPTIONS_FILE, MAX_EXEMPTION_DAYS, isExempt, validateExemptions, type Exemption } from '../src/evidence/exemptions.ts';
import { REPO } from './helpers/laneFixture.ts';

const NOW = new Date('2026-10-10T12:00:00Z');
const valid: Exemption = {
  subject: 'Slider', gate: 'pixel-material-presence', cells: ['Slider--default|photo|webkit|dark-glass'],
  rationale: 'WebKit draws the thumb shadow outside the sampled band; fixed by REQ-CMP-xx', approvedBy: 'design-review', expires: '2027-01-31',
};
const codes = (raw: unknown) => validateExemptions(raw, NOW).map((p) => p.code);

describe('certification/exemptions.json validator', () => {
  it('accepts a valid exemption and the committed file', () => {
    expect(validateExemptions([valid], NOW)).toEqual([]);
    expect(validateExemptions(JSON.parse(readFileSync(join(REPO, EXEMPTIONS_FILE), 'utf8')), NOW)).toEqual([]);
  });

  it('fails an expired exemption', () => {
    expect(codes([{ ...valid, expires: '2026-10-09' }])).toEqual(['expired']);
    expect(codes([{ ...valid, expires: '2026-10-10T11:59:59Z' }])).toEqual(['expired']);
  });

  it('rejects any exemption of OCR contrast (REQ-QUAL-13) or console (REQ-QUAL-17)', () => {
    for (const gate of ['ocr-contrast', 'REQ-QUAL-13', 'console', 'REQ-QUAL-17']) expect([gate, codes([{ ...valid, gate }])]).toEqual([gate, ['non-exemptable']]);
    expect(isExempt([], 'Slider', 'console', 'x', NOW)).toBe(false);
  });

  it(`rejects expiry more than ${MAX_EXEMPTION_DAYS} days ahead`, () => {
    expect(codes([{ ...valid, expires: '2027-04-07' }])).toEqual([]); // 179.5 days (date-only = end of day UTC)
    expect(codes([{ ...valid, expires: '2027-04-08' }])).toEqual(['too-long']); // 180.5 days
    expect(codes([{ ...valid, expires: '2030-01-01' }])).toEqual(['too-long']);
  });

  it('rejects malformed entries and duplicates', () => {
    expect(codes({})).toEqual(['malformed']);
    expect(codes([{ ...valid, approvedBy: '' }])).toEqual(['malformed']);
    expect(codes([{ ...valid, cells: [] }])).toEqual(['malformed']);
    expect(codes([{ ...valid, expires: 'next quarter' }])).toEqual(['malformed']);
    expect(codes([{ ...valid, score: 3 }])).toEqual(['malformed']);
    expect(codes([valid, { ...valid, cells: ['*'] }])).toEqual(['duplicate']);
  });

  it('isExempt honours only valid entries for the named cell and fails closed on an invalid list', () => {
    expect(isExempt([valid], 'Slider', valid.gate, valid.cells[0]!, NOW)).toBe(true);
    expect(isExempt([valid], 'Slider', valid.gate, 'other-cell', NOW)).toBe(false);
    expect(isExempt([{ ...valid, cells: ['*'] }], 'Slider', valid.gate, 'other-cell', NOW)).toBe(true);
    expect(() => isExempt([{ ...valid, expires: '2020-01-01' }], 'Slider', valid.gate, valid.cells[0]!, NOW)).toThrow('expired');
  });

  it('the L1 gate passes on the committed file', () => {
    const r = spawnSync(process.execPath, ['certification/gates/exemptions.mjs'], { cwd: REPO, encoding: 'utf8' });
    expect([r.status, r.stdout.trim()]).toEqual([0, 'exemptions: 0 valid exemption(s)']);
  });
});
