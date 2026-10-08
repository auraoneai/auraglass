import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dispositionsRows } from '../../scripts/release/consumer-grep.mjs';

const DOC = 'docs/inventory/component-dispositions.md';
const GEN = 'scripts/release/gen-component-dispositions.mjs';

describe('component dispositions (PLAT-219..222)', () => {
  const text = readFileSync(DOC, 'utf8');
  const rows = dispositionsRows(text);

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
    expect(count('removed')).toBe(234);
    expect(count('compat')).toBe(152);
    expect(count('flagship')).toBe(47);
    expect(count('core')).toBe(41);
    expect(count('registry')).toBe(13);
    expect(count('labs')).toBe(9);
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
