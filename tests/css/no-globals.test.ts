/* @jest-environment node */
/* REQ-PLAT-74: global element subjects (h1-h6, html, body, universal *, .flex,
   .grid) live only in compat/globals.css; ag.reset selectors are scoped under
   :where([data-ag-root],[data-ag-surface]); :root appears only inside
   ag.tokens / ag.compat layer blocks. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';
import { collectCssFragments, styleRules, selectorPrefix, splitSelectors } from '../../scripts/build/lib/css.mjs';

const FORBIDDEN = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'html', 'body', '*', '.flex', '.grid']);
const ROOT_OK_LAYERS = new Set(['ag.tokens', 'ag.compat']);

const shipped = (name: string) => readFileSync(join(DIST, name), 'utf8');

describe('no global subjects outside compat/globals.css (REQ-PLAT-74)', () => {
  it('no bundle other than compat/globals.css emits a global-subject selector', () => {
    ensureBuilt();
    const hits: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.css') && !p.endsWith('compat/globals.css'))) {
      const css = readFileSync(f, 'utf8');
      for (const r of styleRules(css))
        for (const sel of splitSelectors(r.selector)) {
          const p = selectorPrefix(sel);
          if (FORBIDDEN.has(p)) hits.push(`${f}: ${sel.trim().slice(0, 60)}`);
        }
    }
    expect(hits).toEqual([]);
  });

  it('ag.reset rules are scoped under :where([data-ag-root],[data-ag-surface])', () => {
    const css = shipped('styles.css');
    const inReset = styleRules(css).filter((r) => r.headers.some((h) => /^@layer\s+ag\.reset\b/.test(h)));
    expect(inReset.length).toBeGreaterThan(0);
    const unscoped = inReset.filter((r) => !r.selector.includes('[data-ag-root') && !r.selector.includes('[data-ag-surface'));
    expect(unscoped.map((r) => r.selector.slice(0, 60))).toEqual([]);
  });

  it(':root appears only inside ag.tokens or ag.compat layer blocks', () => {
    // REQ-PLAT-74 / REQ-MAT-19: any :root in a selector — subject, context
    // prefix (`:root:not(x) .s`), attribute-qualified (`:root[data-ag-x]`) or
    // wrapped (`:where(:root)`) — outside ag.tokens / ag.compat is a hit.
    ensureBuilt();
    const hits: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.css'))) {
      const css = readFileSync(f, 'utf8');
      for (const r of styleRules(css)) {
        if (!/:root\b/.test(r.selector)) continue;
        const layer = r.headers.find((h) => h.startsWith('@layer '));
        const layerName = layer ? layer.slice('@layer '.length).trim() : '';
        if (!ROOT_OK_LAYERS.has(layerName)) hits.push(`${f}: ${r.selector.slice(0, 60)} in ${layerName || 'no-layer'}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('no source css fragment outside ag.tokens / ag.compat selects :root (incl. :where(:root))', async () => {
    const fragments = await collectCssFragments(process.cwd(), { validate: false });
    const hits: string[] = [];
    for (const f of fragments as Array<{ file: string; layer: string; content: string }>) {
      for (const r of styleRules(f.content.replace(/\/\*[\s\S]*?\*\//g, ''))) {
        if (!/:root\b/.test(r.selector)) continue;
        const layer = r.headers.find((h: string) => h.startsWith('@layer '));
        const layerName = layer ? layer.slice('@layer '.length).trim() : f.layer;
        if (!ROOT_OK_LAYERS.has(layerName)) hits.push(`${f.file}: ${r.selector.replace(/\s+/g, ' ').slice(0, 80)} in ${layerName}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('the source check catches every :root form (failing fixture)', () => {
    const css = '@layer ag.material { :where(:root) { --x: 1; } :root[data-ag-tier="lightweight"] .s { --y: 1; } :root:not([data-ag-motion]) .s { --z: 1; } }';
    const sels = styleRules(css).filter((r: { selector: string }) => /:root\b/.test(r.selector));
    expect(sels).toHaveLength(3);
  });
});
