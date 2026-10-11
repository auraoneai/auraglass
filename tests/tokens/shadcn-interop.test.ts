/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// REQ-MAT-20 (MAT-071): shadcn interchange — a var() resolver over the emitted
// tokens.css plus the emitter itself.
//  - the 8 contract names (PUBLIC_CSS_VARS.shadcn) are emitted under
//    :where(:root:not([data-ag-shadcn-source])) and resolve to their --ag-* values;
//  - the shadcn-authoritative :root[data-ag-shadcn-source] block ships only when
//    AG_ATTRIBUTES registers the attribute (contract C-2 / OD-16; fallback: off);
//  - with the block on, a consumer --primary drives --ag-color-accent;
//  - no cycle in either mode, and a synthetic cycle makes the emitter die.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { SHADCN_MAP } from '../../scripts/tokens/formats/_shared.mjs';
import { shadcnSourceRegistered, SHADCN_SOURCE_ATTR } from '../../scripts/tokens/formats/css-layered.mjs';
import { PUBLIC_CSS_VARS } from '../../src/contracts/tokens';
import { AG_ATTRIBUTES } from '../../src/contracts/material';

const DIST_CSS = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const FIXTURE = join(ROOT, 'tests/tokens/fixtures/shadcn/emit.mjs');
const SOURCE_SEL = ':root[data-ag-shadcn-source]';
const DEFAULT_SEL = ':where(:root:not([data-ag-shadcn-source]))';
const REGISTERED = Object.hasOwn(AG_ATTRIBUTES, 'data-ag-shadcn-source');

const runFixture = (name: string) =>
  spawnSync(process.execPath, [FIXTURE, name], { cwd: ROOT, encoding: 'utf8' });

const norm = (sel: string) => sel.replace(/\s+/g, ' ').trim();

/** Declarations per scope: global :root, default-direction block, source block. */
const collectScopes = (css: string) => {
  const root = postcss.parse(css);
  const scopeGlobal = new Map<string, string>();
  const scopeDefault = new Map<string, string>();
  const scopeSource = new Map<string, string>();
  const attrSelectors: string[] = [];
  root.walkRules((rule) => {
    const sel = norm(rule.selector);
    if (sel.includes(`[${SHADCN_SOURCE_ATTR}]`)) attrSelectors.push(sel);
    // only top-level @layer ag.tokens :root rules (not @supports/@media fallbacks)
    const parent = rule.parent as postcss.AtRule | postcss.Root;
    const inTokensLayer = parent.type === 'atrule' && (parent as postcss.AtRule).name === 'layer';
    if (!inTokensLayer) return;
    const map = sel === ':root' ? scopeGlobal : sel === DEFAULT_SEL ? scopeDefault : sel === SOURCE_SEL ? scopeSource : null;
    if (map) rule.walkDecls((d) => { map.set(d.prop, d.value); });
  });
  return { scopeGlobal, scopeDefault, scopeSource, attrSelectors };
};

/** Resolve a var(--x, fallback) chain to a final non-var value; throws on cycle. */
const resolveVar = (name: string, maps: Map<string, string>[], seen = new Set<string>()): string => {
  if (seen.has(name)) throw new Error(`cycle: ${[...seen, name].join(' -> ')}`);
  seen.add(name);
  for (const m of maps) {
    const raw = m.get(name);
    if (raw === undefined) continue;
    const v = raw.replace(/\s+/g, ' ').trim();
    const varCall = /^var\(\s*(--[a-zA-Z0-9-]+)\s*(?:,\s*(.+))?\)$/.exec(v);
    if (!varCall) return v;
    try {
      return resolveVar(varCall[1]!, maps, new Set(seen));
    } catch (e: any) {
      if (varCall[2] && !/^cycle/.test(e.message)) return varCall[2];
      throw e;
    }
  }
  throw new Error(`unresolved ${name}`);
};

describe('shadcn interchange (REQ-MAT-20)', () => {
  const dist = collectScopes(DIST_CSS);
  const CONTRACT_NAMES = [...PUBLIC_CSS_VARS.shadcn].sort();

  test('SHADCN_MAP covers exactly the 8 contract names', () => {
    expect(CONTRACT_NAMES).toHaveLength(8);
    expect(Object.keys(SHADCN_MAP).sort()).toEqual(CONTRACT_NAMES);
  });

  test('dist: all 8 names are emitted in the default direction and resolve to their --ag-* value', () => {
    expect([...dist.scopeDefault.keys()].sort()).toEqual(CONTRACT_NAMES);
    for (const [sh, ag] of Object.entries(SHADCN_MAP)) {
      expect(dist.scopeDefault.get(sh)).toBe(`var(${ag})`);
      expect(resolveVar(sh, [dist.scopeDefault, dist.scopeGlobal])).toBe(resolveVar(ag, [dist.scopeGlobal]));
    }
  });

  test('dist: the shadcn-source block ships only when AG_ATTRIBUTES registers the attribute', () => {
    expect(shadcnSourceRegistered()).toBe(REGISTERED);
    const expected = REGISTERED ? [DEFAULT_SEL, SOURCE_SEL] : [DEFAULT_SEL];
    expect([...new Set(dist.attrSelectors)].sort()).toEqual(expected.sort());
    expect(dist.scopeSource.size).toBe(REGISTERED ? 8 : 0);
  });

  test('dist: no var cycle for any of the 8 names in default mode', () => {
    for (const sh of CONTRACT_NAMES) expect(() => resolveVar(sh, [dist.scopeDefault, dist.scopeGlobal])).not.toThrow();
  });

  describe('emitter with the source block on (contract C-2 shape)', () => {
    const run = runFixture('acyclic');
    const on = collectScopes(run.stdout);

    test('emits both directions for all 8 names', () => {
      expect(run.status).toBe(0);
      expect([...on.scopeDefault.keys()].sort()).toEqual(CONTRACT_NAMES);
      expect([...on.scopeSource.keys()].sort()).toEqual(Object.values(SHADCN_MAP).sort());
    });

    test('source mode: a consumer --primary drives --ag-color-accent; unset names fall back to the default', () => {
      const consumer = new Map([['--primary', 'oklch(0.6 0.2 30)']]);
      expect(resolveVar('--ag-color-accent', [consumer, on.scopeSource, on.scopeGlobal])).toBe('oklch(0.6 0.2 30)');
      expect(resolveVar('--ag-color-canvas', [consumer, on.scopeSource, on.scopeGlobal])).toBe(on.scopeGlobal.get('--ag-color-canvas'));
    });

    test('no var cycle in source mode for any mapped --ag-* name', () => {
      const consumer = new Map(CONTRACT_NAMES.map((n) => [n, '1px'] as [string, string]));
      for (const ag of Object.values(SHADCN_MAP))
        expect(() => resolveVar(ag, [consumer, on.scopeSource, on.scopeGlobal])).not.toThrow();
    });

    test('gated off, the same token set emits only the default direction', () => {
      const off = runFixture('acyclic-gated');
      expect(off.status).toBe(0);
      expect([...new Set(collectScopes(off.stdout).attrSelectors)]).toEqual([DEFAULT_SEL]);
    });
  });

  test.each([
    ['map-cycle', /var cycle in default mode: --ag-color-canvas -> --ag-color-accent -> --ag-color-canvas/],
    ['token-cycle', /var cycle in default mode: --ag-color-accent -> --primary -> --ag-color-accent/],
  ])('synthetic %s fixture makes the emitter die', (name, message) => {
    const res = runFixture(name);
    expect(res.status).toBe(1);
    expect(res.stderr).toMatch(message);
    expect(res.stdout).toBe('');
  });

  test('the resolver itself rejects a cycle', () => {
    const cycle = new Map([
      ['--primary', 'var(--ag-color-accent)'],
      ['--ag-color-accent', 'var(--primary)'],
    ]);
    expect(() => resolveVar('--primary', [cycle])).toThrow(/cycle/);
  });
});
