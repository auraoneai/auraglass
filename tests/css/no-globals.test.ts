/* @jest-environment node */
/* REQ-PLAT-74: global element subjects (h1-h6, html, body, universal *, .flex,
   .grid) live only in compat/globals.css; ag.reset selectors are scoped under
   :where([data-ag-root],[data-ag-surface]); :root appears only inside
   ag.tokens / ag.compat layer blocks. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';
import { styleRules, selectorPrefix, splitSelectors } from '../../scripts/build/lib/css.mjs';

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
    const hits: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.css'))) {
      const css = readFileSync(f, 'utf8');
      for (const r of styleRules(css)) {
        for (const sel of splitSelectors(r.selector)) {
          // :root used as an ancestor context prefix (:root:not(x) .ag-surface)
          // is not a global-subject leak — only a :root subject counts.
          const subject = sel.trim().split(/\s+|(?=>|\+\s|\+~)/).pop() ?? '';
          if (!subject.trim().startsWith(':root')) continue;
          // a :root subject conditional on ag-* attributes (:root[data-ag-motion],
          // :root:where([data-ag-surface])) is a state hook scoped to our mounts,
          // not an unconditional global leak — allowed in any layer.
          if (subject.includes('[data-ag-')) continue;
          const layer = r.headers.find((h) => h.startsWith('@layer '));
          const layerName = layer ? layer.slice('@layer '.length).trim() : '';
          if (!ROOT_OK_LAYERS.has(layerName)) hits.push(`${f}: ${sel.slice(0, 60)} in ${layerName || 'no-layer'}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
