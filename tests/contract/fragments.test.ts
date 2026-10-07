/* Contract seed (QUAL): every fragment loads through loadFragments and satisfies its
   type; deprecation ids are unique and use the stream's prefix; codemod ids are in
   the catalogue (§6.3). */
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { CORE_CODEMODS, AREA_CODEMODS } from '../../src/contracts/fragments';
import type { DeprecationFragment, CodemodMappingFragment } from '../../src/contracts/fragments';

const KINDS = ['deprecations', 'codemods', 'size-budgets', 'perf-budgets', 'lanes',
  'playwright', 'css', 'side-effects', 'review', 'literals-baseline', 'a11y-baseline'] as const;
const PREFIX = { plat: 'DEP-P', mat: 'DEP-M', cmp: 'DEP-C', surf: 'DEP-S', qual: 'DEP-Q' } as const;

describe('loadFragments', () => {
  for (const kind of KINDS) {
    it(`loads every stream's ${kind} fragment`, async () => {
      const all = await loadFragments(kind);
      expect(all).toHaveProperty('plat');
      expect(all).toHaveProperty('mat');
      expect(all).toHaveProperty('cmp');
      expect(all).toHaveProperty('surf');
      expect(all).toHaveProperty('qual');
    });
  }

  it('deprecation ids are unique and prefixed by stream', async () => {
    const all = await loadFragments('deprecations') as Record<keyof typeof PREFIX, DeprecationFragment>;
    const ids: string[] = [];
    for (const [s, frag] of Object.entries(all)) {
      for (const e of frag) {
        expect(e.id.startsWith(PREFIX[s as keyof typeof PREFIX])).toBe(true);
        ids.push(e.id);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('codemod ids are in the catalogue', async () => {
    const all = await loadFragments('codemods') as Record<string, CodemodMappingFragment>;
    const catalog = new Set<string>([...CORE_CODEMODS, ...Object.keys(AREA_CODEMODS)]);
    for (const frag of Object.values(all)) {
      for (const a of frag.areaTransforms ?? []) expect(catalog.has(a.id)).toBe(true);
      for (const r of frag.renames ?? []) expect(r.to).toBeTruthy();
    }
  });
});
