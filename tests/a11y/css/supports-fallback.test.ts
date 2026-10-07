/* MAT-281 (A11Y-010): the @supports-not backdrop-filter fallback must exist
   inside @layer ag.a11y, keyed on [data-ag-surface], disabling backdrop-filter
   on the host and ::before. Asserted structurally on the rungs source (and on
   dist/styles.css when the build has produced it). The browser case requires a
   remote Chromium build with backdrop-filter disabled; none exists, so that
   cell reports 'switch unavailable'. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import postcss from 'postcss';

const SOURCES = ['src/a11y/css/rungs.css'];
const built = 'dist/styles.css';
if (fs.existsSync(built)) SOURCES.push(built);

const supportsBlocks = (css: string) => {
  const root = postcss.parse(css);
  const hits: Array<{ inLayer: boolean; selectors: string[]; decls: Array<[string, string]> }> = [];
  root.walkAtRules('supports', (at) => {
    if (!/not\s*\(\(?\s*(-webkit-)?backdrop-filter\s*:/.test(at.params)) return;
    if (!/backdrop-filter\s*:\s*blur/.test(at.params)) return;
    let inLayer = false;
    let p = at.parent;
    while (p) {
      if ((p as postcss.AtRule).name === 'layer' && (p as postcss.AtRule).params === 'ag.a11y') inLayer = true;
      p = p.parent;
    }
    at.walkRules((rule) => {
      const decls: Array<[string, string]> = [];
      rule.walkDecls((d) => decls.push([d.prop, d.value]));
      hits.push({ inLayer, selectors: rule.selector.split(',').map((s) => s.trim()), decls });
    });
  });
  return hits;
};

describe('@supports-not backdrop-filter fallback', () => {
  for (const src of SOURCES) {
    it(`${src}: fallback keyed on [data-ag-surface] inside ag.a11y`, () => {
      const hits = supportsBlocks(fs.readFileSync(src, 'utf8'));
      expect(hits.length).toBeGreaterThan(0);
      expect(hits.some((h) => h.inLayer)).toBe(true);
      const inLayerRules = hits.filter((h) => h.inLayer);
      // host rule: some [data-ag-surface] selector disabling backdrop-filter
      const host = inLayerRules.find((r) => r.selectors.some((s) => /\[data-ag-surface\]$/.test(s)));
      const before = inLayerRules.find((r) => r.selectors.some((s) => /\[data-ag-surface\]::before$/.test(s)));
      expect(host).toBeDefined();
      expect(before).toBeDefined();
      for (const rule of [host!, before!]) {
        const props = rule.decls.map(([p]) => p);
        expect(props).toContain('backdrop-filter');
        expect(props).toContain('-webkit-backdrop-filter');
        expect(rule.decls.filter(([p]) => /backdrop-filter$/.test(p)).every(([, v]) => v === 'none')).toBe(true);
      }
    });
  }

  it('remote-browser case: switch unavailable', () => {
    // There is no remote Chromium channel in this repo that can disable
    // backdrop-filter; per the task, report 'switch unavailable' instead of
    // faking the measurement.
    expect('switch unavailable').toBe('switch unavailable');
  });
});
