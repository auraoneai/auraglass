/* @jest-environment jsdom */
/* REQ-MAT-42 (REQ-FIN-58, FIN task D.3-24): cascade test for the interaction /
   depth transition lists. The shipped MAT CSS (fragments/css/mat.ts, the
   material.css bundle followed by the styles.css bundle) is resolved with a
   real cascade — @layer order, specificity, source order — against jsdom
   elements, and the winning transition-property list is asserted.

   Regression covered: motion.css used to declare `[data-ag-layer] { transition:
   --_ag-optics … }` after the interactive/overlay/scrim rules at the same
   specificity, so a `[data-ag-interactive][data-ag-layer]` surface lost its
   --ag-specular/--_ag-press transitions (and overlays/scrims their fade).

   Environment modelled: a hover-capable pointer, no reduced-motion / forced
   colours / contrast preference, a backdrop-filter-capable engine, no active
   view transition. `:hover` / `:active` are simulated by attributes because
   jsdom cannot enter those states. */
import { describe, expect, it } from '@jest/globals';
import postcss from 'postcss';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import fragments from '../../fragments/css/mat';
import { ANIMATABLE } from '../../src/contracts/motion';
import { LAYER_ORDER_STATEMENT } from '../../src/contracts/tokens';

const ROOT = join(__dirname, '..', '..');
const BUNDLE_ORDER = ['material.css', 'styles.css'];

const LAYERS = LAYER_ORDER_STATEMENT.replace(/^@layer\s+/, '').replace(/;\s*$/, '')
  .split(',').map((l) => l.trim());

type Spec = [number, number, number];

/** split on top-level commas (commas inside (), [] do not split) */
const splitTop = (s: string): string[] => {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') depth += 1;
    if (ch === ')' || ch === ']') depth -= 1;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

const maxSpec = (specs: Spec[]): Spec =>
  specs.reduce<Spec>((m, s) => (cmpSpec(s, m) > 0 ? s : m), [0, 0, 0]);
const cmpSpec = (a: Spec, b: Spec): number => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** Selectors Level 4 specificity of one complex selector. */
export function specificity(sel: string): Spec {
  const spec: Spec = [0, 0, 0];
  let i = 0;
  const readParen = (): string => {
    let depth = 0;
    const start = i;
    for (; i < sel.length; i += 1) {
      if (sel[i] === '(') depth += 1;
      if (sel[i] === ')') { depth -= 1; if (depth === 0) { i += 1; break; } }
    }
    return sel.slice(start + 1, i - 1);
  };
  while (i < sel.length) {
    const ch = sel[i]!;
    if (ch === '#') { spec[0] += 1; i += 1; while (i < sel.length && /[\w-]/.test(sel[i]!)) i += 1; continue; }
    if (ch === '.') { spec[1] += 1; i += 1; while (i < sel.length && /[\w-]/.test(sel[i]!)) i += 1; continue; }
    if (ch === '[') { spec[1] += 1; while (i < sel.length && sel[i] !== ']') i += 1; i += 1; continue; }
    if (ch === ':') {
      if (sel[i + 1] === ':') {
        spec[2] += 1; i += 2;
        while (i < sel.length && /[\w-]/.test(sel[i]!)) i += 1;
        if (sel[i] === '(') readParen();
        continue;
      }
      i += 1;
      const start = i;
      while (i < sel.length && /[\w-]/.test(sel[i]!)) i += 1;
      const name = sel.slice(start, i);
      const arg = sel[i] === '(' ? readParen() : null;
      if (name === 'where') continue;
      if (name === 'is' || name === 'not' || name === 'has' || name === 'matches') {
        const s = maxSpec(splitTop(arg ?? '').map(specificity));
        spec[0] += s[0]; spec[1] += s[1]; spec[2] += s[2];
        continue;
      }
      spec[1] += 1;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) { spec[2] += 1; while (i < sel.length && /[\w-]/.test(sel[i]!)) i += 1; continue; }
    i += 1; // combinators, whitespace, *, &
  }
  return spec;
}

const mediaMatches = (params: string): boolean => {
  const p = params.replace(/\s+/g, ' ').trim();
  if (/^\(hover: ?hover\)$/.test(p)) return true;
  if (/^\(hover: ?none\)$/.test(p)) return false;
  if (/prefers-reduced-motion|forced-colors|prefers-contrast|prefers-reduced-transparency|inverted-colors/.test(p)) {
    return /no-preference|: ?none\)/.test(p) && !/\bnot\b/.test(p);
  }
  throw new Error(`cascade test: unmodelled @media (${p}) — extend mediaMatches()`);
};
const supportsMatches = (params: string): boolean => !/^\s*not\b/.test(params);

interface CascadeDecl {
  prop: string;
  value: string;
  layerRank: number;
  spec: Spec;
  order: number;
  selector: string;
  file: string;
}

/** Every top-level style declaration of the shipped MAT CSS, in bundle order. */
const sheets = [...fragments]
  .sort((a, b) => BUNDLE_ORDER.indexOf(a.bundle) - BUNDLE_ORDER.indexOf(b.bundle) || a.order - b.order)
  .map((f) => ({ file: f.file, root: postcss.parse(readFileSync(join(ROOT, f.file), 'utf8'), { from: f.file }) }));

interface RuleEntry { rule: postcss.Rule; layerRank: number; order: number; file: string }
const ruleEntries: RuleEntry[] = [];
{
  let order = 0;
  for (const { file, root } of sheets) {
    root.walkRules((rule) => {
      let layerRank = LAYERS.length; // unlayered normal decls win over every layer
      let active = true;
      for (let p: postcss.Node | undefined = rule.parent; p && p.type !== 'root'; p = p.parent) {
        if (p.type === 'rule') throw new Error(`cascade test: nested rule ${rule.selector} in ${file} is unmodelled`);
        const at = p as postcss.AtRule;
        if (at.name === 'keyframes') { active = false; break; }
        if (at.name === 'media' && !mediaMatches(at.params)) active = false;
        if (at.name === 'supports' && !supportsMatches(at.params)) active = false;
        if (at.name === 'layer') {
          const idx = LAYERS.indexOf(at.params.trim());
          if (idx < 0) throw new Error(`cascade test: layer ${at.params} not in LAYER_ORDER_STATEMENT`);
          layerRank = idx;
        }
      }
      if (active) ruleEntries.push({ rule, layerRank, order: order += 1, file });
    });
  }
}

const UNREACHABLE = /:active-view-transition|:popover-open|:modal/;
const toTestable = (sel: string): string =>
  sel.replace(/:hover(?![\w-])/g, '[data-test-hover]').replace(/:active(?![\w-])/g, '[data-test-active]');

function cascadeDecls(el: Element): CascadeDecl[] {
  const out: CascadeDecl[] = [];
  for (const { rule, layerRank, order, file } of ruleEntries) {
    const matched = (rule.selectors ?? [rule.selector])
      .filter((s) => !s.includes('::') && !UNREACHABLE.test(s))
      .filter((s) => el.matches(toTestable(s)));
    if (!matched.length) continue;
    const spec = maxSpec(matched.map(specificity));
    for (const node of rule.nodes ?? []) {
      if (node.type !== 'decl') continue; // nested @starting-style etc. do not apply at rest
      out.push({ prop: node.prop, value: node.value, layerRank, spec, order, selector: rule.selector, file });
    }
  }
  return out;
}

const winner = (decls: CascadeDecl[], props: ReadonlyArray<string>): CascadeDecl | undefined =>
  decls.filter((d) => props.includes(d.prop))
    .sort((a, b) => a.layerRank - b.layerRank || cmpSpec(a.spec, b.spec) || a.order - b.order)
    .at(-1);

/** computed transition-property of el (first token of each shorthand leg) */
function transitionProperty(el: Element): { props: string[]; from: string } {
  const w = winner(cascadeDecls(el), ['transition', 'transition-property']);
  if (!w) return { props: ['all'], from: '(initial)' };
  const props = splitTop(w.value).map((leg) => leg.split(/\s+/)[0]!).filter((p) => p !== 'none');
  return { props, from: `${w.file} ${w.selector}` };
}

const make = (attrs: Record<string, string>, className?: string): HTMLElement => {
  document.body.innerHTML = '';
  const el = document.createElement('div');
  if (className) el.className = className;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
};

const STATES: Record<string, Record<string, string>> = {
  rest: {},
  hover: { 'data-test-hover': '' },
  active: { 'data-test-hover': '', 'data-test-active': '' },
  pressed: { 'data-pressed': '' },
};
const animatable: ReadonlySet<string> = new Set(ANIMATABLE);

describe('cascade model self-check', () => {
  it('specificity follows Selectors 4 (:where = 0, :is/:not = max argument)', () => {
    expect(specificity('[data-ag-layer]')).toEqual([0, 1, 0]);
    expect(specificity(':where([data-ag-layer])')).toEqual([0, 0, 0]);
    expect(specificity('.ag-surface[data-ag-interactive]:hover')).toEqual([0, 3, 0]);
    expect(specificity(':is([data-ag-overlay=dialog], .a.b)[data-ending-style]')).toEqual([0, 3, 0]);
    expect(specificity('.ag-surface::before')).toEqual([0, 1, 1]);
  });
  it('resolves rules from both bundles and every motion file', () => {
    const files = new Set(ruleEntries.map((r) => r.file));
    for (const f of ['src/material/css/material.css', 'src/motion/css/motion.css', 'src/motion/css/view-transition.css']) {
      expect(files.has(f)).toBe(true);
    }
  });
});

describe('REQ-MAT-42: [data-ag-interactive][data-ag-layer] keeps its interaction transitions', () => {
  for (const [state, extra] of Object.entries(STATES)) {
    it(`bare interactive layered element (${state}): --ag-specular, --_ag-press and the depth cross-fade`, () => {
      const el = make({ 'data-ag-interactive': '', 'data-ag-layer': 'raised', ...extra });
      const { props, from } = transitionProperty(el);
      expect({ from, props }).toEqual({ from, props: expect.arrayContaining(['--ag-specular', '--_ag-press', '--_ag-optics']) });
      expect(props.filter((p) => !animatable.has(p))).toEqual([]);
    });
    it(`.ag-surface interactive layered surface (${state}): --ag-specular and --_ag-press`, () => {
      const el = make({ 'data-ag-surface': '', 'data-ag-interactive': '', 'data-ag-layer': 'raised', ...extra }, 'ag-surface');
      const { props, from } = transitionProperty(el);
      expect({ from, props }).toEqual({ from, props: expect.arrayContaining(['--ag-specular', '--_ag-press']) });
      expect(props.filter((p) => !animatable.has(p))).toEqual([]);
    });
  }
});

describe('REQ-MAT-42: the depth cross-fade does not clobber other transition lists', () => {
  it('a plain layered surface cross-fades --_ag-optics', () => {
    expect(transitionProperty(make({ 'data-ag-layer': 'raised' })).props).toEqual(['--_ag-optics']);
  });
  it('a layered overlay keeps its materialize list at rest and on exit', () => {
    const rest = transitionProperty(make({ 'data-ag-overlay': 'popover', 'data-ag-layer': 'overlay' })).props;
    expect(rest).toEqual(['opacity', 'scale', 'translate', '--_ag-optics']);
    const exit = transitionProperty(make({ 'data-ag-overlay': 'dialog', 'data-ag-layer': 'modal', 'data-ending-style': '' })).props;
    expect(exit).toEqual(['opacity', 'scale', 'translate', '--_ag-optics']);
  });
  it('the scrim keeps its opacity fade', () => {
    expect(transitionProperty(make({ 'data-ag-layer': 'scrim' })).props).toEqual(['opacity']);
  });
});
