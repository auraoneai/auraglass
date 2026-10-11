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
  it('discovered fixture cases satisfy minCases per transform id', async () => {
    const { discoverFixtures } = await import('../../../../test/helpers/fixture-discovery.js');
    const cases = discoverFixtures();
    const perId = new Map<string, number>();
    for (const c of cases) perId.set(c.transform, (perId.get(c.transform) ?? 0) + 1);
    for (const t of catalogue.transforms) {
      const min = (t as { minCases?: number }).minCases ?? 0;
      expect(perId.get(t.id) ?? 0).toBeGreaterThanOrEqual(min);
    }
  });
});
