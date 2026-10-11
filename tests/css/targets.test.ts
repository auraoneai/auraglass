/* @jest-environment node */
/* REQ-PLAT-74: shipped css parses under the contract browser targets (esbuild
   lowers to CSS_TARGETS), every color-mix() declaration sits inside an
   @supports (color: color-mix(...)) guard, and the @container rule count in
   each bundle equals the count across its source fragments. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { transform as esbuildTransform } from 'esbuild';
import { DIST, ensureBuilt, walk } from '../build/helpers';
import { styleRules, containerCount, collectCssFragments, CSS_TARGETS } from '../../scripts/build/lib/css.mjs';
import { ROOT } from '../../scripts/build/lib/graph.mjs';

const cssFiles = () => walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map'));

describe('css targets + guards (REQ-PLAT-74)', () => {
  it('every shipped css parses under the contract targets', async () => {
    ensureBuilt();
    for (const f of cssFiles()) {
      const css = readFileSync(f, 'utf8');
      await expect(
        esbuildTransform(css, { loader: 'css', target: CSS_TARGETS.split(', ') })
      ).resolves.toBeTruthy();
    }
  });

  it('no color-mix() declaration sits outside an @supports guard', () => {
    const hits: string[] = [];
    for (const f of cssFiles()) {
      const css = readFileSync(f, 'utf8');
      for (const r of styleRules(css))
        if (r.body.includes('color-mix(') && !r.headers.some((h) => /color-mix\s*\(/.test(h)))
          hits.push(`${f}: ${r.selector.slice(0, 60)}`);
    }
    expect(hits).toEqual([]);
  });

  it('@container count in each bundle equals its source-fragment count', async () => {
    const frags = await collectCssFragments(ROOT, { validate: false });
    for (const f of cssFiles()) {
      const name = f.slice(DIST.length + 1);
      const srcCount = frags
        .filter((x) => x.bundle === name)
        .reduce((n, x) => n + containerCount(x.content), 0);
      const distCount = containerCount(readFileSync(f, 'utf8'));
      expect({ bundle: name, dist: distCount, src: srcCount }.dist).toBe(srcCount);
    }
  });
});
