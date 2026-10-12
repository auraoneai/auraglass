/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-076: compat aliases — every name in the 4.x reader set has an entry in the
// map (count logged); the whole emitted file is inside @layer ag.compat (after
// the @import); the only legacy hook selector is the REQ-MAT-13
// [data-theme=dark] / .dark block mapping to every 5.x --ag-color-* dark value;
// map keys equal the reader set exactly.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { COMPAT_DARK_SELECTOR, legacyReaderSet } from '../../scripts/tokens/formats/compat-aliases.mjs';

const CSS_PATH = join(ROOT, 'dist/compat/tokens.css');
const MAP = JSON.parse(readFileSync(join(ROOT, 'tokens/generated/compat-alias-map.json'), 'utf8'));
const CSS = readFileSync(CSS_PATH, 'utf8');

describe('compat aliases (MAT-076)', () => {
  test('every 4.x reader name has a map entry (count logged)', () => {
    const readers = new Set<string>(legacyReaderSet() as Iterable<string>);
    const missing = [...readers].filter((n) => !(n in MAP));
    // Defined names are emitted as declarations; never-defined names are
    // accounted for in the map (defined: false) and must not be declared.
    const declared = new Set<string>();
    postcss.parse(CSS).walkDecls((d) => { declared.add(d.prop); });
    const accounted = [...readers].filter((n) => MAP[n] && MAP[n].defined === declared.has(n));
    console.log(`4.x reader names: ${readers.size}; map entries: ${Object.keys(MAP).length}; accounted: ${accounted.length}`);
    expect(Object.keys(MAP).sort()).toEqual([...readers].sort());
    expect(missing).toEqual([]);
    expect(accounted.length).toBe(readers.size);
  });

  test('every emitted rule lives inside @layer ag.compat', () => {
    const root = postcss.parse(CSS);
    root.walkRules((rule) => {
      let n: postcss.Container | postcss.Document | undefined = rule.parent;
      let layer = '';
      while (n && n.type !== 'root') {
        if (n.type === 'atrule' && (n as postcss.AtRule).name === 'layer') layer = (n as postcss.AtRule).params;
        n = n.parent;
      }
      expect({ sel: rule.selector, layer }).toEqual({ sel: rule.selector, layer: 'ag.compat' });
    });
    // the @import precedes the layer block
    expect(CSS.indexOf('@import')).toBeLessThan(CSS.indexOf('@layer ag.compat'));
  });

  test('the only legacy-hook selector is the [data-theme=dark]/.dark mapping (REQ-MAT-13)', () => {
    const root = postcss.parse(CSS);
    const hooks: string[] = [];
    root.walkRules((rule) => {
      if (/data-theme|data-aura-|data-persona|data-bg\b|\.glass-on-|\.dark\b|\.light\b/.test(rule.selector))
        hooks.push(rule.selector);
    });
    expect(hooks).toEqual([COMPAT_DARK_SELECTOR]);
    expect(COMPAT_DARK_SELECTOR).toBe(':where([data-theme=dark], .dark, [data-theme=dark] > body, .dark > body)');
  });

  test('[data-theme=dark], .dark carries color-scheme: dark and every 5.x dark scheme value', () => {
    // expected: every public --ag-* value dist/tokens.css sets for the 5.x dark scheme —
    // the ag.tokens [data-ag-scheme="dark"] block (dark mode-table cells, e.g. shadows)
    // plus its light-dark() fallback twin (the explicit dark value of every
    // scheme-paired var, all --ag-color-*).
    const tokens = postcss.parse(readFileSync(join(ROOT, 'dist/tokens.css'), 'utf8'));
    const expected = new Map<string, string>();
    tokens.walkRules((r) => {
      if (r.selector !== '[data-ag-scheme="dark"]') return;
      const parent = r.parent as postcss.AtRule;
      const top = parent.type === 'atrule' && parent.name === 'layer' && parent.params === 'ag.tokens';
      const fallback = parent.type === 'atrule' && parent.name === 'supports' && /^not \(color: light-dark\(/.test(parent.params);
      if (top || fallback) r.walkDecls(/^--ag-/, (d) => { expected.set(d.prop, d.value); });
    });
    expect(expected.has('--ag-color-canvas')).toBe(true);
    expect([...expected.keys()].filter((k) => k.startsWith('--ag-color-')).length).toBeGreaterThanOrEqual(13);
    const rules: postcss.Rule[] = [];
    postcss.parse(CSS).walkRules((r) => { if (r.selector === COMPAT_DARK_SELECTOR) rules.push(r); });
    expect(rules).toHaveLength(1);
    const got = new Map<string, string>();
    rules[0].walkDecls((d) => { got.set(d.prop, d.value); });
    expect(got.get('color-scheme')).toBe('dark');
    got.delete('color-scheme');
    expect(Object.fromEntries(got)).toEqual(Object.fromEntries(expected));
  });

  test('defined legacy names alias or freeze (no silent drops)', () => {
    const defined = Object.entries(MAP).filter(([, v]: [string, any]) => v.defined);
    const dropped = defined.filter(([n]) => !CSS.includes(`${n}:`));
    console.log(`defined legacy names: ${defined.length}; successor-mapped: ${defined.filter(([, v]: [string, any]) => v.successor).length}`);
    expect(dropped).toEqual([]);
  });
});
