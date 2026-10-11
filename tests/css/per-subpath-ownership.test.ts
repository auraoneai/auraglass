/* @jest-environment node */
/* REQ-PLAT-74: build/css-ownership.json maps each component selector prefix to
   the bundle(s) its declaring fragment targets; every emitted selector lands
   in a bundle that declares it (styles.css may also embed compat/globals.css
   prefixes). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { styleRules, selectorPrefix, splitSelectors } from '../../scripts/build/lib/css.mjs';

describe('per-subpath css ownership (REQ-PLAT-74)', () => {
  it('css-ownership.json exists with a selectorPrefix → bundle map', () => {
    ensureBuilt();
    const own = JSON.parse(readFileSync(join(ROOT, 'build/css-ownership.json'), 'utf8'));
    expect(own.version).toBe(1);
    expect(Object.keys(own.selectors).length).toBeGreaterThan(0);
    for (const [prefix, bundles] of Object.entries(own.selectors)) {
      expect(prefix.startsWith('.') || prefix.startsWith('[')).toBe(true);
      expect(Array.isArray(bundles)).toBe(true);
      for (const b of bundles as string[]) expect(b.endsWith('.css')).toBe(true);
    }
  });

  it('every emitted owned prefix lands in a declaring bundle', () => {
    const own = JSON.parse(readFileSync(join(ROOT, 'build/css-ownership.json'), 'utf8'));
    const hits: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('.map'))) {
      const bundle = f.slice(DIST.length + 1);
      for (const r of styleRules(readFileSync(f, 'utf8')))
        for (const sel of splitSelectors(r.selector)) {
          const p = selectorPrefix(sel);
          const owners = own.selectors[p];
          if (owners && !owners.includes(bundle) && !(owners.includes('compat/globals.css') && bundle === 'styles.css'))
            hits.push(`${bundle}: ${p}`);
        }
    }
    expect(hits).toEqual([]);
  });

  it('every ag.components prefix records a11y pairing state', () => {
    const own = JSON.parse(readFileSync(join(ROOT, 'build/css-ownership.json'), 'utf8'));
    for (const [prefix, state] of Object.entries(own.a11y)) expect(['paired', 'none']).toContain(state);
    expect(Object.keys(own.a11y).length).toBeGreaterThan(0);
  });
});
