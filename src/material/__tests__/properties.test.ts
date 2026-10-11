/* @jest-environment node */
/* MAT-105 — REQ-MAT-28: the hand-authored src/material/css/properties.css
   registers exactly the 14 REQ-MAT-28 @property names with the contract
   syntax/inherits/initial values; every --_ag-* is inherits:false; no initial
   value contains var(; the file follows the MAT layering rule (line 1 is
   LAYER_ORDER_STATEMENT, one @layer ag.material block). The repo-wide ≤ 16
   union and the no-runtime-registration check live in
   tests/material/properties-union.test.ts. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AtRule, Declaration } from 'postcss';
// SC-20 layer order (contract LAYER_ORDER_STATEMENT, written as a literal per the
// src/** contract-boundary lint rule, as css-contract.test.ts does).
const LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';

// postcss is a direct dependency of stylelint (pinned transitively, OI-MAT-04).
const postcss = require('postcss') as typeof import('postcss');

const FILE = join(__dirname, '../css/properties.css');

/** REQ-MAT-28 registry: name -> {syntax, inherits, initial} */
const EXPECTED: Record<string, { syntax: string; inherits: boolean; initial: string }> = {
  '--ag-light-angle': { syntax: '<angle>', inherits: true, initial: '300deg' },
  '--ag-specular': { syntax: '<number>', inherits: false, initial: '0.5' },
  '--ag-glass-opacity': { syntax: '<number>', inherits: true, initial: '0' },
  '--_ag-blur': { syntax: '<length>', inherits: false, initial: '0px' },
  '--_ag-saturation': { syntax: '<number>', inherits: false, initial: '1' },
  '--_ag-brightness': { syntax: '<number>', inherits: false, initial: '1' },
  '--_ag-tint-floor': { syntax: '<number>', inherits: false, initial: '0.6' },
  '--_ag-dim': { syntax: '<number>', inherits: false, initial: '0' },
  '--_ag-surface-alpha': { syntax: '<number>', inherits: false, initial: '1' },
  '--_ag-refraction-scale': { syntax: '<number>', inherits: false, initial: '0' },
  '--_ag-rim-width': { syntax: '<length>', inherits: false, initial: '1px' },
  '--_ag-grain-opacity': { syntax: '<number>', inherits: false, initial: '0.03' },
  '--_ag-optics': { syntax: '<number>', inherits: false, initial: '1' },
  '--_ag-press': { syntax: '<number>', inherits: false, initial: '0' },
};

interface Prop { name: string; syntax: string; inherits: string; initial: string; rule: AtRule }

const text = readFileSync(FILE, 'utf8');
const ast = postcss.parse(text, { from: FILE });

const registry: Prop[] = [];
ast.walkAtRules('property', (rule) => {
  const decl = (prop: string) =>
    rule.nodes?.find((n): n is Declaration => n.type === 'decl' && n.prop === prop)?.value.trim() ?? '';
  registry.push({
    name: rule.params.trim(),
    syntax: decl('syntax').replace(/^['"]|['"]$/g, ''),
    inherits: decl('inherits'),
    initial: decl('initial-value'),
    rule,
  });
});

describe('src/material/css/properties.css @property registry (REQ-MAT-28)', () => {
  it('registers exactly the 14 REQ-MAT-28 names, each once', () => {
    const names = registry.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    expect([...names].sort()).toEqual(Object.keys(EXPECTED).sort());
    expect(names).toHaveLength(14);
  });

  it.each(Object.entries(EXPECTED))('%s has contract syntax/inherits/initial', (name, want) => {
    const got = registry.find((r) => r.name === name);
    expect(got).toBeDefined();
    expect(got?.syntax).toBe(want.syntax);
    expect(got?.inherits).toBe(String(want.inherits));
    expect(got?.initial).toBe(want.initial);
  });

  it('every --_ag-* registration is inherits:false', () => {
    const privates = registry.filter((r) => r.name.startsWith('--_ag-'));
    expect(privates).toHaveLength(11);
    for (const r of privates) expect(r.inherits).toBe('false');
  });

  it('no initial value contains var(', () => {
    for (const r of registry) expect(r.initial).not.toMatch(/var\(/);
  });

  it('line 1 is LAYER_ORDER_STATEMENT and every registration sits in one @layer ag.material block', () => {
    expect(text.split('\n')[0]).toBe(LAYER_ORDER_STATEMENT);
    const blocks = ast.nodes.filter(
      (n): n is AtRule => n.type === 'atrule' && n.name === 'layer' && Array.isArray(n.nodes),
    );
    expect(blocks).toHaveLength(1);
    expect(blocks[0]!.params).toBe('ag.material');
    for (const r of registry) expect(r.rule.parent).toBe(blocks[0]);
    const stray = ast.nodes.filter(
      (n) => n.type !== 'comment' && !(n.type === 'atrule' && n.name === 'layer'),
    );
    expect(stray).toEqual([]);
  });
});
