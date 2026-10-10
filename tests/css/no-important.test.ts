/* @jest-environment node */
/* REQ-PLAT-74: zero !important in every shipped css bundle, and the fragment
   validator fail-closes on a fragment that carries one. A bundle may carry
   !important only through a source fragment that holds a REQ-FIN-14 expiring
   baseline row (PRD-F §4.3 rule 3); its owner removes it (CMP-08, SURF-03). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';
import { validateFragment, collectCssFragments } from '../../scripts/build/lib/css.mjs';
import { ROOT } from '../../scripts/build/lib/graph.mjs';

const shippedCss = () =>
  walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map'));

describe('no !important (REQ-PLAT-74)', () => {
  it('no shipped css contains !important (outside baselined source fragments)', async () => {
    ensureBuilt();
    const frags = await collectCssFragments(ROOT);
    const baselinedBundles = new Set(
      frags.filter((f: { baselined?: string }) => f.baselined && /!important/.test(f.baselined)).map((f: { bundle: string }) => f.bundle)
    );
    const hits: string[] = [];
    for (const f of shippedCss()) {
      const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      if (/!important/i.test(css) && !baselinedBundles.has(f.slice(DIST.length + 1))) hits.push(f);
    }
    expect(hits).toEqual([]);
  });

  it('a fragment containing !important fails validation', () => {
    expect(() =>
      validateFragment({ file: 'fixture.css', layer: 'ag.components', bundle: 'styles.css', content: '@layer ag.components { .a { color: red !important; } }' } as never)
    ).toThrow(/!important/);
  });
});
