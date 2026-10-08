/** PLAT-339: every contract CORE_CODEMODS + AREA_CODEMODS entry has a transform. */
import { describe, expect, it } from '@jest/globals';
import { TRANSFORM_ORDER, selectTransforms } from '../src/migrate/4to5/index.js';
import catalogue from '../src/migrate/4to5/catalogue.json' with { type: 'json' };

describe('codemod catalogue coverage', () => {
  it('catalogue transforms == TRANSFORM_ORDER', () => {
    expect(catalogue.transforms.map((t) => t.id)).toEqual([...TRANSFORM_ORDER]);
  });
  it('every id selectable', () => {
    const sel = selectTransforms(catalogue.transforms.map((t) => t.id));
    expect(sel.map((t) => t.id)).toEqual(catalogue.transforms.map((t) => t.id));
  });
});
