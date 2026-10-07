/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
/* Contract seed (QUAL): every fragment loads through loadFragments and satisfies its
   type; deprecation ids are unique and use the stream's prefix; codemod ids are in
   the catalogue (§6.3). */
import { loadFragments } from '../../src/contracts/load-fragments.mjs';
import { CORE_CODEMODS, AREA_CODEMODS } from '../../src/contracts/fragments';
import type { DeprecationFragment, CodemodMappingFragment } from '../../src/contracts/fragments';

const KINDS = ['deprecations', 'codemods', 'size-budgets', 'perf-budgets', 'lanes',
  'playwright', 'css', 'side-effects', 'review', 'literals-baseline', 'a11y-baseline'] as const;
const PREFIX = { plat: 'DEP-P', mat: 'DEP-M', cmp: 'DEP-C', surf: 'DEP-S', qual: 'DEP-Q' } as const;
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;

describe('loadFragments', () => {
  for (const kind of KINDS) {
    it(`loads every stream's ${kind} fragment, sorted by stream order`, async () => {
      const all = await loadFragments(kind);
      expect(all.map((f) => f.stream)).toEqual([...STREAMS]);
    });
  }

  it('deprecation ids are unique and prefixed by stream', async () => {
    const all = await loadFragments('deprecations');
    const ids: string[] = [];
    for (const { stream, value } of all) {
      for (const e of value as DeprecationFragment) {
        expect(e.id.startsWith(PREFIX[stream as keyof typeof PREFIX])).toBe(true);
        ids.push(e.id);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('codemod ids are in the catalogue', async () => {
    const all = await loadFragments('codemods');
    const catalog = new Set<string>([...CORE_CODEMODS, ...Object.keys(AREA_CODEMODS)]);
    for (const { value } of all) {
      const frag = value as CodemodMappingFragment;
      for (const a of frag.areaTransforms ?? []) expect(catalog.has(a.id)).toBe(true);
      for (const r of frag.renames ?? []) expect(r.to).toBeTruthy();
    }
  });
});
