/** Contract catalogue: every CORE_CODEMODS + AREA_CODEMODS id maps to a transform. */
import { describe, expect, it } from '@jest/globals';
import { selectTransforms, TRANSFORM_ORDER } from '../index.js';
import catalogue from '../catalogue.json' with { type: 'json' };
describe('catalogue coverage', () => {
  it('catalogue ids all resolve', () => {
    const sel = selectTransforms(catalogue.transforms.map((t) => t.id));
    expect(sel.length).toBe(catalogue.transforms.length);
  });
  it('frozen order', () => {
    expect([...TRANSFORM_ORDER]).toEqual(catalogue.transforms.map((t) => t.id));
  });
});
