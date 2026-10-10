/* @jest-environment node */
/* REQ-FIN-03 / REQ-MAT-07 acceptance: "dist/tokens.css has distinct two-layer
   --ag-shadow-regular values in :root and [data-ag-scheme=dark]". The public
   shadow names are exactly the contract's tokens.shadow list
   (PUBLIC_CSS_VARS.shadow in src/contracts/tokens.ts), so each public value carries both layers
   (ambient + key) itself; the dark scheme overrides it with a different value.
   Reads the tokens:build output (runs in mat:test:tokens-interim after it). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { PUBLIC_CSS_VARS } from '../../src/contracts/tokens';

const ROOT = join(__dirname, '../..');
const CSS = readFileSync(join(ROOT, 'dist/tokens.css'), 'utf8');
const SHADOWS: readonly string[] = PUBLIC_CSS_VARS.shadow;

/** Top-level comma split (commas inside oklch()/rgb() do not split). */
const layers = (value: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

/** Value of `prop` declared by a rule whose selector list contains `selector`, outside any @media. */
const declared = (selector: string, prop: string): string | undefined => {
  let found: string | undefined;
  postcss.parse(CSS).walkRules((rule) => {
    for (let p = rule.parent; p && p.type !== 'root'; p = p.parent as typeof p)
      if (p.type === 'atrule' && (p as postcss.AtRule).name === 'media') return;
    if (!rule.selectors.map((s) => s.trim()).includes(selector)) return;
    rule.walkDecls(prop, (d) => {
      found = d.value.replace(/\s+/g, ' ').trim();
    });
  });
  return found;
};

const LENGTH = /^-?\d+(\.\d+)?(px)?$/;
const isShadowLayer = (layer: string) => {
  const parts = layer.replace(/\b(inset)\b/, '').trim().split(/\s+(?![^(]*\))/);
  const lengths = parts.filter((p) => LENGTH.test(p));
  return lengths.length >= 2 && lengths.length <= 4 && parts.length - lengths.length === 1;
};

describe('REQ-MAT-07 two-layer elevation shadows', () => {
  it('the contract lists exactly the three public shadow names', () => {
    expect([...SHADOWS].sort()).toEqual(['--ag-shadow-regular', '--ag-shadow-thick', '--ag-shadow-thin']);
  });

  it.each(SHADOWS.map((s) => [s]))('%s is two shadow layers in :root and in [data-ag-scheme="dark"], and they differ', (name) => {
    const light = declared(':root', name);
    const dark = declared('[data-ag-scheme="dark"]', name);
    expect([name, light === undefined, dark === undefined]).toEqual([name, false, false]);
    for (const value of [light!, dark!]) {
      const ls = layers(value);
      expect([name, value, ls.length]).toEqual([name, value, 2]);
      for (const l of ls) expect([name, l, isShadowLayer(l)]).toEqual([name, l, true]);
    }
    expect(dark).not.toBe(light);
  });

  it('emits no public shadow name outside the contract list', () => {
    const emitted = new Set(CSS.match(/--ag-shadow-[\w-]+(?=\s*:)/g) ?? []);
    expect([...emitted].filter((n) => !SHADOWS.includes(n)).sort()).toEqual([]);
  });
});
