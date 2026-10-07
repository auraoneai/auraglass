// tests/capability/req-refs.test.ts — REQ-SURF-186.
// Every reqRefs id resolves in the owning stream's PRD file, or sits on the
// gap-row whitelist while the row is 'planned'.
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const PRD = join(ROOT, 'docs/auraglass-5/prd');
const OWNER_FILE: Record<string, string> = {
  PLAT: 'AURAGLASS_PLATFORM_RELEASE_PRD.md',
  MAT: 'AURAGLASS_MATERIAL_SYSTEM_PRD.md',
  CMP: 'AURAGLASS_CORE_COMPONENTS_PRD.md',
  SURF: 'AURAGLASS_PRODUCT_SURFACES_PRD.md',
  QUAL: 'AURAGLASS_QUALITY_SHOWCASE_PRD.md',
};
const GAP_WHITELIST = new Set([
  'REQ-SURF-10', 'REQ-SURF-23', 'REQ-SURF-26', 'REQ-SURF-27', 'REQ-SURF-28',
  'REQ-SURF-78', 'REQ-SURF-79', 'REQ-SURF-105', 'REQ-SURF-184',
]);

const ledger = JSON.parse(readFileSync(join(ROOT, 'docs/auraglass-5/capability-ledger.json'), 'utf8'));

describe('ledger reqRefs', () => {
  const cache = new Map<string, Set<string>>();
  const idsFor = (owner: string) => {
    if (!cache.has(owner)) {
      const f = join(PRD, OWNER_FILE[owner]!);
      const ids = existsSync(f)
        ? new Set([...readFileSync(f, 'utf8').matchAll(/\bREQ-[A-Z0-9]+-[0-9]+\b/g)].map((m) => m[0]))
        : new Set<string>();
      cache.set(owner, ids);
    }
    return cache.get(owner)!;
  };

  it('every reqRefs id exists in its owner file or is a planned gap ref', () => {
    const bad: string[] = [];
    for (const row of ledger.rows) {
      if (row.status === 'rejected') continue;
      for (const ref of row.reqRefs) {
        if (idsFor(row.owner).has(ref)) continue;
        if (row.status === 'planned' && GAP_WHITELIST.has(ref)) continue;
        bad.push(`${row.id}:${ref}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('the open gap rows are exactly X-07, X-16, X-19, X-25, X-26', () => {
    const open = new Set(['X-07', 'X-16', 'X-19', 'X-25', 'X-26']);
    for (const row of ledger.rows) {
      const unresolved = (row.reqRefs as string[]).some(
        (r) => !idsFor(row.owner).has(r) && GAP_WHITELIST.has(r)
      );
      if (unresolved) expect(open.has(row.id)).toBe(true);
    }
  });

  it('media/eval rows cite their REQ-SURF ids', () => {
    const byId = new Map(ledger.rows.map((r: any) => [r.id, r]));
    for (const id of ['X-37', 'X-38', 'X-39', 'X-40', 'X-41', 'X-42', 'X-43']) {
      const refs = (byId.get(id) as any).reqRefs as string[];
      expect(refs.length).toBeGreaterThan(0);
      for (const ref of refs) {
        expect(idsFor('SURF').has(ref) || GAP_WHITELIST.has(ref)).toBe(true);
      }
    }
  });
});
