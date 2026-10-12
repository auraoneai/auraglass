/* @jest-environment node */
/* REQ-PLAT-74: build/css-ownership.json maps each component selector prefix to
   the bundle(s) its declaring fragment targets; every emitted selector lands
   in a bundle that declares it (styles.css may also embed compat/globals.css
   prefixes). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { collectCssFragments, computeOwnership, styleRules, selectorPrefix, splitSelectors, CSS_A11Y_PAIRING_BASELINE } from '../../scripts/build/lib/css.mjs';

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
    for (const [prefix, state] of Object.entries(own.a11y)) expect(['paired', 'none', 'baselined']).toContain(state);
    expect(Object.keys(own.a11y).length).toBeGreaterThan(0);
  });
});

/* REQ-PLAT-74: "each component prefix with ag.components rules has ag.a11y rules
   in the same bundle or an explicit 'none' in its fragment" — enforced by
   computeOwnership at assembly time (source fragments, no build needed). */
describe('a11y pairing is explicit (REQ-PLAT-74)', () => {
  const frag = (file: string, layer: string, bundle: string, content: string, a11y?: 'none') =>
    ({ stream: 'cmp', file, layer, bundle, order: 0, content, ...(a11y ? { a11y } : {}) } as const);
  const comp = (a11y?: 'none', bundle = 'styles.css') =>
    frag('src/components/x/X.css', 'ag.components', bundle, '@layer ag.components { .ag-x { color: red; } }', a11y);
  const a11yRule = (bundle = 'styles.css') =>
    frag('src/a11y/css/x.css', 'ag.a11y', bundle, '@layer ag.a11y { .ag-x:focus-visible { outline: 2px solid; } }');

  it('a prefix with neither a11y rules in its bundle nor an explicit none fails, naming it', () => {
    expect(() => computeOwnership([comp()])).toThrow(/a11y pairing.*\n.*'\.ag-x' \(src\/components\/x\/X\.css/s);
  });
  it('ag.a11y rules in the same bundle pair it; in another bundle they do not', () => {
    expect((computeOwnership([comp(), a11yRule()]) as { a11y: Record<string, string> }).a11y['.ag-x']).toBe('paired');
    expect(() => computeOwnership([comp(undefined, 'data.css'), a11yRule('styles.css')])).toThrow(/a11y pairing/);
  });
  it("an explicit a11y: 'none' records 'none'; a baselined file records 'baselined'", () => {
    expect((computeOwnership([comp('none')]) as { a11y: Record<string, string> }).a11y['.ag-x']).toBe('none');
    const own = computeOwnership([comp()], { a11yBaseline: new Map([['src/components/x/X.css', {}]]) }) as { a11y: Record<string, string> };
    expect(own.a11y['.ag-x']).toBe('baselined');
  });

  it('the repo fragments pass with the expiring baseline, and every baseline row is still needed', async () => {
    const rows = JSON.parse(readFileSync(join(ROOT, CSS_A11Y_PAIRING_BASELINE), 'utf8')) as Array<{ file: string; owner: string; reqFin: string; expires: string }>;
    const fragments = await collectCssFragments(ROOT, { validate: false });
    const own = computeOwnership(fragments, { a11yBaseline: new Map(rows.map((r) => [r.file, r])) }) as { a11y: Record<string, string> };
    expect(Object.keys(own.a11y).length).toBeGreaterThan(0);
    const components = new Set(fragments.filter((f) => f.layer === 'ag.components' && f.a11y !== 'none').map((f) => f.file));
    // a row for a file that now declares a11y: 'none' (or no longer ships) must be deleted (burn-down only)
    expect(rows.filter((r) => !components.has(r.file)).map((r) => r.file)).toEqual([]);
    for (const r of rows) expect({ file: r.file, reqFin: r.reqFin, expires: r.expires }).toEqual({ file: r.file, reqFin: 'REQ-FIN-38', expires: 'RC-1' });
    // without the baseline the same fragments fail: the rows are load-bearing
    expect(() => computeOwnership(fragments)).toThrow(/a11y pairing/);
  });
});
