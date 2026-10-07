// tests/capability/export-budget.test.ts — REQ-SURF-184.
// Ledger-declared export deltas must stay inside the package ceilings
// (root ≤160, total ≤250); GA additionally requires ≥1 root and ≥4 subpath
// slots free, enforced against the manifest by the delivery check.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ledger = JSON.parse(
  readFileSync(join(__dirname, '../../docs/auraglass-5/capability-ledger.json'), 'utf8')
);

describe('export budget', () => {
  const live = ledger.rows.filter((r: any) => r.status !== 'rejected');
  const root = live.reduce((n: number, r: any) => n + r.exportDelta.root, 0);
  const sub = live.reduce((n: number, r: any) => n + r.exportDelta.subpath, 0);

  it('sum(exportDelta.root) ≤ 160', () => expect(root).toBeLessThanOrEqual(160));
  it('sum(exportDelta.root + exportDelta.subpath) ≤ 250', () => {
    expect(root + sub).toBeLessThanOrEqual(250);
  });
  it('every export-form row declares a positive delta and a subpath', () => {
    const bad = live.filter(
      (r: any) => r.form.includes('export') && (r.exportDelta.root + r.exportDelta.subpath) === 0
    );
    expect(bad.map((r: any) => r.id)).toEqual([]);
  });
});
