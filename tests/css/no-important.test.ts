/* @jest-environment node */
/* REQ-PLAT-74: zero !important in every shipped css bundle, and the fragment
   validator fail-closes on a fragment that carries one. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';
import { validateFragment } from '../../scripts/build/lib/css.mjs';

const shippedCss = () =>
  walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map'));

describe('no !important (REQ-PLAT-74)', () => {
  it('no shipped css contains !important', () => {
    ensureBuilt();
    const hits: string[] = [];
    for (const f of shippedCss()) {
      const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      if (/!important/i.test(css)) hits.push(f);
    }
    expect(hits).toEqual([]);
  });

  it('a fragment containing !important fails validation', () => {
    expect(() =>
      validateFragment({ file: 'fixture.css', layer: 'ag.components', bundle: 'styles.css', content: '@layer ag.components { .a { color: red !important; } }' } as never)
    ).toThrow(/!important/);
  });
});
