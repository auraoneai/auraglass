// tests/capability/no-rejected.test.ts — REQ-SURF-179/185.
// Rejected rows stay status 'rejected' with rubric false and release 'never';
// their names never appear on a non-rejected row.
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ledger = JSON.parse(
  readFileSync(join(__dirname, '../../docs/auraglass-5/capability-ledger.json'), 'utf8')
);

describe('rejected rows', () => {
  const rejected = ledger.rows.filter((r: any) => r.status === 'rejected');
  it('exactly X-R01..X-R13 are rejected', () => {
    expect(rejected.map((r: any) => r.id)).toEqual([
      'X-R01', 'X-R02', 'X-R03', 'X-R04', 'X-R05', 'X-R06', 'X-R07',
      'X-R08', 'X-R09', 'X-R10', 'X-R11', 'X-R12', 'X-R13',
    ]);
  });
  it('every rejected row has rubric false and release never', () => {
    for (const r of rejected) {
      expect(Object.values(r.rubric)).toEqual([false, false, false, false, false, false]);
      expect(r.release).toBe('never');
      expect(r.form).toEqual(['rejected']);
    }
  });
  it('no non-rejected row carries a rejected name (case-insensitive)', () => {
    const banned = new Map<string, string>();
    for (const r of rejected) for (const n of r.names) banned.set(String(n).toLowerCase(), r.id);
    const hits: string[] = [];
    for (const r of ledger.rows) {
      if (r.status === 'rejected') continue;
      for (const n of r.names) {
        if (banned.has(String(n).toLowerCase())) hits.push(`${r.id}:${n}(${banned.get(String(n).toLowerCase())})`);
      }
    }
    expect(hits).toEqual([]);
  });
});
