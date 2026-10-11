import { describe, expect, it } from '@jest/globals';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dispositionsRows } from '../../scripts/removal/consumer-grep.mjs';
import {
  RECONCILIATION, buildRows, catalogueIds, checkColumns, checkReconciliation, findRows, tokenOf,
} from '../../scripts/removal/gen-component-dispositions.mjs';

const DOC = 'docs/inventory/component-dispositions.md';
const GEN = 'scripts/removal/gen-component-dispositions.mjs';

describe('component dispositions (PLAT-219..222)', () => {
  const text = readFileSync(DOC, 'utf8');
  const rows = dispositionsRows(text);
  const built = buildRows(JSON.parse(readFileSync('docs/auraglass-5/component-inventory.json', 'utf8'))).rows;

  it('generated output is fresh (--check exits 0)', () => {
    expect(() => execFileSync('node', [GEN, '--check'], { encoding: 'utf8' })).not.toThrow();
  });
  it('covers all 496 components (500 records - 4 notes)', () => {
    expect(rows.length).toBe(500);
    expect(rows.filter((r) => r.dest === 'note').length).toBe(4);
  });
  it('every row has exactly one destination', () => {
    const valid = new Set(['flagship', 'core', 'compat', 'labs', 'registry', 'removed', 'note']);
    for (const r of rows) expect(valid).toContain(r.dest);
  });
  it('destination totals match the PRD table', () => {
    const count = (d) => rows.filter((r) => r.dest === d).length;
    expect(count('removed')).toBe(236);
    expect(count('compat')).toBe(151);
    expect(count('flagship')).toBe(47);
    expect(count('core')).toBe(40);
    expect(count('registry')).toBe(13);
    expect(count('labs')).toBe(9);
  });
  it('SC-34 corrections: GlassHoverCard compat over Popover openOnHover; GlassTimelineRail, GlassAdvancedDataViz removed', () => {
    const one = (n) => { const m = rows.filter((r) => tokenOf(r.name) === n); expect(m).toHaveLength(1); return m[0]; };
    expect(one('GlassHoverCard')).toMatchObject({ dest: 'compat', target: 'Popover openOnHover', owner: 'CMP', codemod: 'canonical-names' });
    expect(one('GlassTimelineRail')).toMatchObject({ dest: 'removed', target: 'Timeline', owner: 'PLAT', codemod: 'removed' });
    expect(one('GlassAdvancedDataViz')).toMatchObject({ dest: 'removed', target: 'ChartFrame', owner: 'PLAT', codemod: 'removed' });
  });
  it('every row carries an owner stream, a 5.0 target and a catalogued codemod id', () => {
    expect(checkColumns(rows, catalogueIds())).toEqual([]);
    for (const r of rows.filter((x) => ['removed', 'registry', 'labs'].includes(x.dest))) expect(r.codemod).toBe('removed');
    for (const r of rows.filter((x) => x.dest === 'compat')) expect(r.codemod).toBe('canonical-names');
    for (const r of rows.filter((x) => x.dest === 'labs')) expect(r.owner).toBe('SURF');
    for (const r of rows.filter((x) => ['removed', 'registry'].includes(x.dest))) expect(r.owner).toBe('PLAT');
  });
  describe('archive FND §4.7 reconciliation, asserted by name', () => {
    for (const [rid, decision, cases] of RECONCILIATION) {
      it(`${rid}: ${decision}`, () => {
        for (const [sel, ok] of cases) {
          const m = findRows(rows, sel);
          expect({ rid, sel, matches: m.length }).toEqual({ rid, sel, matches: 1 });
          expect({ rid, sel, ok: ok(m[0]), got: `${m[0].dest}/${m[0].target}` }).toMatchObject({ ok: true });
        }
      });
    }
    it('R-18: exactly 18 POLISH/REDESIGN records without a §11 slot are removed, each with a successor or reason', () => {
      const r18 = rows.filter((r) => ['POLISH', 'REDESIGN'].includes(r.disp) && r.dest === 'removed' && !/internal; merged into target/.test(r.note));
      expect(r18).toHaveLength(18);
      for (const r of r18) expect(r.target !== '-' || r.note.length > 0).toBe(true);
    });
    it('the committed table passes the whole reconciliation check', () => {
      expect(checkReconciliation(built)).toEqual([]);
    });
    it('a row that drifts from a decision is reported by rule id and name', () => {
      const drift = built.map((r) => (tokenOf(r.name) === 'GlassHoverCard' ? { ...r, dest: 'core', target: 'HoverCard' } : r));
      expect(checkReconciliation(drift)).toEqual(['SC-34: GlassHoverCard -> core/HoverCard']);
      const gone = built.filter((r) => tokenOf(r.name) !== 'GlassTimelineRail');
      expect(checkReconciliation(gone)).toEqual(['SC-34: GlassTimelineRail matches 0 rows (expected exactly 1)']);
      const r17 = built.map((r) => (tokenOf(r.name) === 'EnhancedGlassButton' ? { ...r, dest: 'removed' } : r));
      expect(checkReconciliation(r17)).toEqual(expect.arrayContaining(['R-17: EnhancedGlassButton -> removed/Button']));
    });
    it('the generator exits 1 naming the violation when a decision is broken', () => {
      const dir = mkdtempSync(join(tmpdir(), 'disp-'));
      try {
        const inv = JSON.parse(readFileSync('docs/auraglass-5/component-inventory.json', 'utf8'));
        /* An unmapped CONSOLIDATE record must fail with UNMAPPED records. */
        inv.push({ name: 'GlassNotInTheMap', file: 'src/components/x/GlassNotInTheMap.tsx', disposition: 'CONSOLIDATE' });
        writeFileSync(join(dir, 'inv.json'), JSON.stringify(inv));
        let err;
        try { execFileSync('node', [GEN, '--inventory', join(dir, 'inv.json'), '--out', join(dir, 'out.md')], { encoding: 'utf8', stdio: 'pipe' }); } catch (e) { err = e; }
        expect(err?.status).toBe(1);
        expect(String(err?.stderr)).toContain('UNMAPPED records');
      } finally { rmSync(dir, { recursive: true, force: true }); }
    });
  });
  it('GA scope: zero removed/registry/labs rows whose 4.x source survives on next (PLAT-221)', () => {
    // A row's 4.x source is quarantined at legacy/<file> on next. At GA every
    // removed/registry/labs row's legacy source must be deleted (the live src/
    // path may legitimately be re-authored under the same name, e.g.
    // src/icons/createIcon.tsx, so the legacy copy is the removal target).
    const survivors = rows.filter((r) => ['removed', 'registry', 'labs'].includes(r.dest))
      .filter((r) => r.file && existsSync(`legacy/${r.file}`));
    const gaScope = process.env.AG_SCOPE === 'release';
    if (!gaScope) {
      console.log(`dispositions GA-scope: ${survivors.length} legacy sources still tracked (pre-GA; RM train removes them)`);
      return;
    }
    expect(survivors.map((r) => r.name)).toEqual([]);
  });
});
