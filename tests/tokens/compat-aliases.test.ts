/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-076: compat aliases — every name in the 4.x reader set has an entry in the
// map (count logged); the whole emitted file is inside @layer ag.compat (after
// the @import); only legacy hook selectors that could ever appear are
// [data-theme=dark] and .dark (none do — the layer is :where(:root)-scoped);
// map keys equal the reader set exactly.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { legacyReaderSet } from '../../scripts/tokens/formats/compat-aliases.mjs';

const CSS_PATH = join(ROOT, 'dist/compat/tokens.css');
const MAP = JSON.parse(readFileSync(join(ROOT, 'tokens/generated/compat-alias-map.json'), 'utf8'));
const CSS = readFileSync(CSS_PATH, 'utf8');

describe('compat aliases (MAT-076)', () => {
  test('every 4.x reader name has a map entry (count logged)', () => {
    const readers = new Set<string>(legacyReaderSet() as Iterable<string>);
    const missing = [...readers].filter((n) => !(n in MAP));
    // Defined names are emitted as declarations; never-defined names are
    // accounted for in the map (defined: false) and must not be emitted.
    const accounted = [...readers].filter((n) =>
      MAP[n] && (MAP[n].defined ? CSS.includes(`${n}:`) : !CSS.includes(`${n}:`)),
    );
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

  test('no legacy-hook selectors except the (unused) [data-theme=dark]/.dark mapping', () => {
    const root = postcss.parse(CSS);
    const hooks: string[] = [];
    root.walkRules((rule) => {
      if (/data-theme|data-aura-|data-persona|\.glass-on-|\.dark\b|\.light\b/.test(rule.selector))
        hooks.push(rule.selector);
    });
    // contract allows ONLY [data-theme=dark] and .dark; we emit neither
    const unexpected = hooks.filter((s) => s !== '[data-theme="dark"]' && s !== '[data-theme=dark]' && s !== '.dark');
    expect({ hooks, unexpected }).toEqual({ hooks, unexpected: [] });
  });

  test('defined legacy names alias or freeze (no silent drops)', () => {
    const defined = Object.entries(MAP).filter(([, v]: [string, any]) => v.defined);
    const dropped = defined.filter(([n]) => !CSS.includes(`${n}:`));
    console.log(`defined legacy names: ${defined.length}; successor-mapped: ${defined.filter(([, v]: [string, any]) => v.successor).length}`);
    expect(dropped).toEqual([]);
  });
});
