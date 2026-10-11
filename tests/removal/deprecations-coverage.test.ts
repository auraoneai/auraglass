/* @jest-environment node */
/* REQ-PLAT-80 (PLAT-222): every removed / registry / labs public name in the
   dispositions has a deprecation entry (any stream's fragment) whose
   replacement is a 5.0 export, `registry:<item>`, `labs:<name>` or null.
   Current gaps are rows of the expiring baseline (PRD-F §4.3 rule 3,
   expires RC-1): a new gap, a stale row or a malformed row fails. The full
   list is written to .artifacts/plat/deprecations-coverage.json (G-07 input)
   by `node scripts/removal/deprecations-coverage.mjs`. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { coverage, exportSet, run, validReplacement } from '../../scripts/removal/deprecations-coverage.mjs';
import { ROOT } from '../build/helpers';

type Row = { name: string; id?: string; owner: string; reqFin: string; expires: string };
const BASELINE = JSON.parse(readFileSync(join(ROOT, 'tests/removal/deprecations-coverage.baseline.json'), 'utf8')) as {
  missing: Row[]; invalid: Row[];
};
const STREAMS = ['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL'];

describe('deprecations coverage (removed/registry/labs public names)', () => {
  it('baseline rows are well-formed and expire at RC-1', () => {
    for (const r of [...BASELINE.missing, ...BASELINE.invalid]) {
      expect(STREAMS).toContain(r.owner);
      expect(r.reqFin).toMatch(/^REQ-FIN-\d+$/);
      expect(r.expires).toBe('RC-1');
    }
  });

  it('every name without an entry is a baseline row, and no baseline row is stale', async () => {
    const res = await run(ROOT);
    expect(res.need).toBeGreaterThan(0);
    const now = res.missing.map((m: { name: string }) => m.name).sort();
    const base = BASELINE.missing.map((r) => r.name).sort();
    expect({ newGaps: now.filter((n: string) => !base.includes(n)), staleRows: base.filter((n) => !now.includes(n)) })
      .toEqual({ newGaps: [], staleRows: [] });
  });

  it('every entry for such a name has a valid replacement, except baseline rows', async () => {
    const res = await run(ROOT);
    const now = res.invalid.map((m: { id: string }) => m.id).sort();
    const base = BASELINE.invalid.map((r) => r.id as string).sort();
    expect({ newInvalid: now.filter((n: string) => !base.includes(n)), staleRows: base.filter((n) => !now.includes(n)) })
      .toEqual({ newInvalid: [], staleRows: [] });
  });

  it('replacement rule: 5.0 export (leading identifier), registry:<item>, labs:<name> or null', () => {
    const ex = exportSet(ROOT);
    expect(ex.has('Button')).toBe(true);
    expect(validReplacement(null, ex)).toBe(true);
    expect(validReplacement('registry:kanban', ex)).toBe(true);
    expect(validReplacement('labs:ParticleField', ex)).toBe(true);
    expect(validReplacement('Button', ex)).toBe(true);
    expect(validReplacement('MediaControls.Root from aura-glass/media', ex)).toBe(true);
    expect(validReplacement('the labs ParticleField (seeded PRNG)', ex)).toBe(false);
    expect(validReplacement('NotAnExport', ex)).toBe(false);
    expect(validReplacement('registry:', ex)).toBe(false);
    expect(validReplacement(undefined, ex)).toBe(false);
  });

  it('coverage() finds a missing entry, an invalid replacement, and ignores kept or private rows', () => {
    const ex = new Set(['Button']);
    const rows = [
      { name: 'GlassGone', dest: 'removed', pub: true, prd: 'PRD-16' },
      { name: 'GlassBad (alias)', dest: 'labs', pub: true, prd: 'PRD-21' },
      { name: 'GlassOk', dest: 'registry', pub: true, prd: 'PRD-18' },
      { name: 'GlassPrivate', dest: 'removed', pub: false, prd: 'PRD-16' },
      { name: 'GlassKept', dest: 'compat', pub: true, prd: 'PRD-08' },
    ];
    const entries = [
      { id: 'DEP-1', kind: 'export', symbol: 'GlassBad', replacement: 'the labs thing' },
      { id: 'DEP-2', kind: 'export', symbol: 'GlassOk', replacement: 'registry:ok-item' },
    ];
    const res = coverage(rows, entries, ex);
    expect(res.need).toBe(3);
    expect(res.missing).toEqual([{ name: 'GlassGone', dest: 'removed', owner: 'PLAT' }]);
    expect(res.invalid).toEqual([{ name: 'GlassBad', id: 'DEP-1', replacement: 'the labs thing', owner: 'SURF' }]);
  });
});
