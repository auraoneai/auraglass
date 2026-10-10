/**
 * @jest-environment jsdom
 */
/* REQ-FIN-03 (REQ-MAT-07, -34, -35, -40): shape AND cascade of the generated
   src/material/css/generated/ladders.css.

   Selector presence alone is not enough: a rule that exists but loses the
   cascade (or a custom property that references itself, which CSS turns into a
   guaranteed-invalid value) leaves the surface wrong. So besides the static
   shape checks this test resolves the winning declaration for real elements in
   a jsdom tree, using the selector matcher for matching and CSS specificity +
   source order for the win, with and without `@media (pointer: coarse)`.

   Clauses checked:
   - engine scalars on [data-ag-surface][data-ag-variant][data-ag-thickness]
     (blur 12/20/32, rim 1px/1px/1.5px) plus :not([data-ag-thickness]) default
     rows equal to the regular-thickness cell (REQ-MAT-07, -35)
   - no custom property declared in terms of itself (cycle = invalid)
   - -webkit-backdrop-filter literals only on ::before, constants only, with
     brightness(); never unprefixed backdrop-filter; never --_ag-surface-alpha
     (REQ-MAT-34, -35)
   - literals apply to no-tier/standard/enhanced surfaces and never to a
     lightweight one, wherever the lightweight tier is declared (REQ-MAT-34)
   - a lightweight surface computes --_ag-blur 0px and grain <= 0.02 (REQ-MAT-35)
   - clear fail-safe: outside a declared backdrop, a clear cell resolves to the
     regular row of its thickness (REQ-FIN-03)
   - coarse pointer: thick computes blur 20px (host and ::before literal),
     every cell grain <= 0.02 (REQ-MAT-40) */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss, { type AtRule, type Rule as PcRule } from 'postcss';

const ROOT = join(__dirname, '../../..');
const LADDERS = readFileSync(join(ROOT, 'src/material/css/generated/ladders.css'), 'utf8');

/* ---------- parsing ---------- */

type Rule = {
  order: number;
  selectors: string[];
  decls: Record<string, string>;
  /** media condition of the enclosing @media, null at top level */
  media: string | null;
};

const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

const RULES: Rule[] = (() => {
  const out: Rule[] = [];
  postcss.parse(LADDERS).walkRules((rule: PcRule) => {
    let media: string | null = null;
    for (let p = rule.parent; p && p.type !== 'root'; p = p.parent as typeof p) {
      if (p.type === 'atrule' && (p as AtRule).name === 'media') media = flat((p as AtRule).params);
    }
    const decls: Record<string, string> = {};
    rule.each((n) => {
      if (n.type === 'decl') decls[n.prop] = flat(n.value);
    });
    out.push({ order: out.length, selectors: rule.selectors.map(flat), decls, media });
  });
  return out;
})();

/* ---------- specificity (Selectors 4) ---------- */

type Spec = [number, number, number];
const add = (a: Spec, b: Spec): Spec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const cmp = (a: Spec, b: Spec) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** Split on top-level commas. */
const splitList = (s: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let cur = '';
  for (const ch of s) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
};

/** Index just past the ')' that closes the '(' at `open`. */
const closeParen = (s: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')' && --depth === 0) return i + 1;
  }
  throw new Error(`unbalanced selector: ${s}`);
};

function specificity(sel: string): Spec {
  let spec: Spec = [0, 0, 0];
  let i = 0;
  const ident = (from: number) => {
    let j = from;
    while (j < sel.length && /[\w-]/.test(sel.charAt(j))) j++;
    return j;
  };
  while (i < sel.length) {
    const ch = sel.charAt(i);
    if (ch === '[') {
      let j = i;
      let quote: string | null = null;
      for (; j < sel.length; j++) {
        const c = sel.charAt(j);
        if (quote) {
          if (c === quote) quote = null;
        } else if (c === '"' || c === "'") quote = c;
        else if (c === ']') break;
      }
      spec = add(spec, [0, 1, 0]);
      i = j + 1;
    } else if (ch === '#') {
      spec = add(spec, [1, 0, 0]);
      i = ident(i + 1);
    } else if (ch === '.') {
      spec = add(spec, [0, 1, 0]);
      i = ident(i + 1);
    } else if (ch === ':' && sel[i + 1] === ':') {
      spec = add(spec, [0, 0, 1]);
      i = ident(i + 2);
      if (sel[i] === '(') i = closeParen(sel, i);
    } else if (ch === ':') {
      const end = ident(i + 1);
      const name = sel.slice(i + 1, end);
      if (sel[end] === '(') {
        const close = closeParen(sel, end);
        const inner = sel.slice(end + 1, close - 1);
        if (name === 'where') {
          /* zero specificity */
        } else if (name === 'not' || name === 'is' || name === 'has') {
          const max = splitList(inner)
            .map(specificity)
            .reduce<Spec>((m, s) => (cmp(s, m) > 0 ? s : m), [0, 0, 0]);
          spec = add(spec, max);
        } else spec = add(spec, [0, 1, 0]);
        i = close;
      } else {
        spec = add(spec, [0, 1, 0]);
        i = end;
      }
    } else if (/[a-zA-Z]/.test(ch)) {
      spec = add(spec, [0, 0, 1]);
      i = ident(i);
    } else i++;
  }
  return spec;
}

/* ---------- cascade over ladders.css ---------- */

type Ctx = { coarse?: boolean; pseudo?: 'before' };

const mediaActive = (media: string | null, ctx: Ctx) =>
  media === null || (media === '(pointer: coarse)' && !!ctx.coarse);

/** Winning declaration of `prop` for `el` (host or its ::before) in ladders.css. */
function winning(el: Element, prop: string, ctx: Ctx = {}): { value: string; rule: Rule } | null {
  let best: { spec: Spec; order: number; value: string; rule: Rule } | null = null;
  for (const rule of RULES) {
    if (!(prop in rule.decls) || !mediaActive(rule.media, ctx)) continue;
    for (const sel of rule.selectors) {
      const isBefore = sel.endsWith('::before');
      if (isBefore !== (ctx.pseudo === 'before')) continue;
      const host = isBefore ? sel.slice(0, -'::before'.length) : sel;
      if (!el.matches(host)) continue;
      const spec = specificity(sel);
      if (!best || cmp(spec, best.spec) > 0 || (cmp(spec, best.spec) === 0 && rule.order > best.order))
        best = { spec, order: rule.order, value: rule.decls[prop] ?? '', rule };
    }
  }
  return best && { value: best.value, rule: best.rule };
}

/** Numeric value of a resolved scalar: a number, or min()/max() of numbers. */
function numeric(value: string): number {
  const m = /^(min|max)\(([^()]+)\)$/.exec(value);
  if (m) {
    const args = (m[2] ?? '').split(',').map((a) => Number(a.trim()));
    if (args.some(Number.isNaN)) throw new Error(`non-numeric ${value}`);
    return m[1] === 'min' ? Math.min(...args) : Math.max(...args);
  }
  const n = Number(value);
  if (Number.isNaN(n)) throw new Error(`non-numeric ${value}`);
  return n;
}

/** Build `<div attrs...><div attrs...>...<div data-ag-surface .../></div></div>` and return the surface. */
function surface(attrs: Record<string, string>, ancestors: Record<string, string>[] = []): Element {
  document.body.innerHTML = '';
  let parent: Element = document.body;
  for (const a of ancestors) {
    const d = document.createElement('div');
    for (const [k, v] of Object.entries(a)) d.setAttribute(k, v);
    parent.appendChild(d);
    parent = d;
  }
  const el = document.createElement('div');
  el.setAttribute('data-ag-surface', '');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  return el;
}

/* ---------- fixtures ---------- */

const VARIANTS = ['regular', 'clear', 'identity'] as const;
const BLURRED = ['regular', 'clear'] as const;
const THICKNESSES = ['thin', 'regular', 'thick'] as const;
const BLUR = { thin: '12px', regular: '20px', thick: '32px' } as const;
const RIM = { thin: '1px', regular: '1px', thick: '1.5px' } as const;
const SCALARS = [
  '--_ag-blur',
  '--_ag-saturation',
  '--_ag-brightness',
  '--_ag-grain-opacity',
  '--_ag-rim-width',
  '--_ag-shadow',
  '--_ag-tint-alpha',
];
const cellSel = (v: string, t: string) => `[data-ag-surface][data-ag-variant="${v}"][data-ag-thickness="${t}"]`;
const cellRule = (v: string, t: string) =>
  RULES.find((r) => r.media === null && r.selectors.length === 1 && r.selectors[0] === cellSel(v, t));

/** Tier placements: [label, surface attrs, ancestors]. */
const NON_LIGHTWEIGHT: [string, Record<string, string>, Record<string, string>[]][] = [
  ['no tier', {}, []],
  ['standard on the surface', { 'data-ag-tier': 'standard' }, []],
  ['enhanced on the surface', { 'data-ag-tier': 'enhanced' }, []],
  ['standard on the parent', {}, [{ 'data-ag-tier': 'standard' }]],
  ['enhanced on a grandparent', {}, [{ 'data-ag-tier': 'enhanced' }, {}]],
];
const LIGHTWEIGHT: [string, Record<string, string>, Record<string, string>[]][] = [
  ['lightweight on the surface', { 'data-ag-tier': 'lightweight' }, []],
  ['lightweight on the parent', {}, [{ 'data-ag-tier': 'lightweight' }]],
  ['lightweight on a grandparent', {}, [{ 'data-ag-tier': 'lightweight' }, {}]],
  ['lightweight nested inside standard', {}, [{ 'data-ag-tier': 'standard' }, { 'data-ag-tier': 'lightweight' }]],
  ['lightweight on the surface inside enhanced', { 'data-ag-tier': 'lightweight' }, [{ 'data-ag-tier': 'enhanced' }, {}]],
];

/* ---------- tests ---------- */

describe('specificity helper (sanity)', () => {
  it('follows Selectors 4 for the forms ladders.css uses', () => {
    expect(specificity('[a][b][c]')).toEqual([0, 3, 0]);
    expect(specificity('[a][b]:not(:where([x], [x] *))')).toEqual([0, 2, 0]);
    expect(specificity(':where([x] *) [a][b]::before')).toEqual([0, 2, 1]);
    expect(specificity('[a]:not([b], [c][d])')).toEqual([0, 3, 0]);
    expect(specificity('[a="x,y"]')).toEqual([0, 1, 0]);
  });
});

describe('REQ-FIN-03 ladders.css shape', () => {
  it('emits the engine scalars on every variant x thickness cell (MAT-07/-35)', () => {
    for (const v of VARIANTS)
      for (const t of THICKNESSES) {
        const rule = cellRule(v, t);
        expect(rule).toBeDefined();
        for (const s of SCALARS) expect(rule!.decls).toHaveProperty(s);
        expect(rule!.decls['--_ag-brightness']).toMatch(/^light-dark\(/);
        expect(rule!.decls['--_ag-rim-width']).toBe(RIM[t]);
        expect(rule!.decls['--_ag-shadow']).toContain(`var(--ag-shadow-${t})`);
        if ((BLURRED as readonly string[]).includes(v)) expect(rule!.decls['--_ag-blur']).toBe(BLUR[t]);
      }
  });

  it('never declares a custom property in terms of itself (a cycle makes it invalid)', () => {
    const cycles: string[] = [];
    for (const r of RULES)
      for (const [prop, value] of Object.entries(r.decls))
        if (prop.startsWith('--') && new RegExp(`var\\(\\s*${prop.replace(/[-]/g, '\\-')}\\s*[,)]`).test(value))
          cycles.push(`${r.selectors[0]} { ${prop}: ${value} }`);
    expect(cycles).toEqual([]);
  });

  it('emits no unprefixed backdrop-filter and no --_ag-surface-alpha anywhere', () => {
    expect(RULES.filter((r) => 'backdrop-filter' in r.decls)).toEqual([]);
    expect(LADDERS).not.toContain('--_ag-surface-alpha');
  });

  it('puts -webkit-backdrop-filter on ::before only, as constants with brightness() (MAT-34)', () => {
    const literal = RULES.filter((r) => '-webkit-backdrop-filter' in r.decls);
    expect(literal.length).toBeGreaterThan(0);
    for (const r of literal) {
      expect(r.selectors.every((s) => s.endsWith('::before'))).toBe(true);
      expect(r.decls['-webkit-backdrop-filter']).toMatch(/^blur\(\d+(\.\d+)?px\) saturate\([\d.]+\) brightness\([\d.]+\)$/);
    }
  });
});

describe('REQ-FIN-03 ladders.css cascade', () => {
  it('a surface with no data-ag-thickness resolves to the regular-thickness cell of its variant', () => {
    for (const v of VARIANTS) {
      const expected = cellRule(v, 'regular')!.decls;
      const el = surface({ 'data-ag-variant': v });
      for (const s of SCALARS) expect([v, s, winning(el, s)?.value]).toEqual([v, s, expected[s]]);
    }
  });

  it('the WebKit literal reaches every non-lightweight blurred surface with the cell blur (MAT-34)', () => {
    for (const [label, attrs, anc] of NON_LIGHTWEIGHT)
      for (const v of BLURRED)
        for (const t of THICKNESSES) {
          const el = surface({ ...attrs, 'data-ag-variant': v, 'data-ag-thickness': t }, anc);
          const lit = winning(el, '-webkit-backdrop-filter', { pseudo: 'before' })?.value;
          expect([label, v, t, lit?.match(/^blur\(([\d.]+px)\)/)?.[1]]).toEqual([label, v, t, BLUR[t]]);
        }
  });

  it('identity surfaces get no WebKit literal', () => {
    for (const t of THICKNESSES) {
      const el = surface({ 'data-ag-variant': 'identity', 'data-ag-thickness': t });
      expect(winning(el, '-webkit-backdrop-filter', { pseudo: 'before' })).toBeNull();
    }
  });

  it('no WebKit literal ever applies to a lightweight surface, fine or coarse pointer (MAT-34/-35)', () => {
    for (const [label, attrs, anc] of LIGHTWEIGHT)
      for (const coarse of [false, true])
        for (const v of BLURRED)
          for (const t of THICKNESSES) {
            const el = surface({ ...attrs, 'data-ag-variant': v, 'data-ag-thickness': t }, anc);
            const lit = winning(el, '-webkit-backdrop-filter', { pseudo: 'before', coarse });
            expect([label, coarse, v, t, lit?.rule.selectors ?? null]).toEqual([label, coarse, v, t, null]);
          }
  });

  it('a lightweight surface computes --_ag-blur 0px and grain <= 0.02 (MAT-35)', () => {
    for (const [label, attrs, anc] of LIGHTWEIGHT)
      for (const coarse of [false, true])
        for (const v of VARIANTS)
          for (const t of THICKNESSES) {
            const el = surface({ ...attrs, 'data-ag-variant': v, 'data-ag-thickness': t }, anc);
            const blur = winning(el, '--_ag-blur', { coarse })?.value;
            expect([label, coarse, v, t, blur]).toEqual([label, coarse, v, t, '0px']);
            const grain = winning(el, '--_ag-grain-opacity', { coarse })?.value;
            expect(grain).toBeDefined();
            expect(numeric(grain!)).toBeLessThanOrEqual(0.02);
          }
  });

  it('clear fail-safe: outside a declared backdrop a clear cell resolves to the regular row', () => {
    for (const t of THICKNESSES) {
      const regular = cellRule('regular', t)!.decls;
      const outside = surface({ 'data-ag-variant': 'clear', 'data-ag-thickness': t });
      for (const s of SCALARS) expect([t, s, winning(outside, s)?.value]).toEqual([t, s, regular[s]]);
      const inside = surface({ 'data-ag-variant': 'clear', 'data-ag-thickness': t }, [{ 'data-ag-backdrop': 'dark' }]);
      const clear = cellRule('clear', t)!.decls;
      for (const s of SCALARS) expect([t, s, winning(inside, s)?.value]).toEqual([t, s, clear[s]]);
    }
  });

  it('coarse pointer: thick computes blur 20px on host and ::before, every cell grain <= 0.02 (MAT-40)', () => {
    expect(RULES.some((r) => r.media === '(pointer: coarse)')).toBe(true);
    for (const v of BLURRED) {
      const el = surface({ 'data-ag-variant': v, 'data-ag-thickness': 'thick' });
      expect([v, winning(el, '--_ag-blur', { coarse: true })?.value]).toEqual([v, '20px']);
      expect(winning(el, '--_ag-blur')?.value).toBe(BLUR.thick); // fine pointer keeps 32px
      const lit = winning(el, '-webkit-backdrop-filter', { pseudo: 'before', coarse: true })?.value;
      expect([v, lit?.match(/^blur\(([\d.]+px)\)/)?.[1]]).toEqual([v, '20px']);
    }
    for (const v of VARIANTS)
      for (const t of THICKNESSES) {
        const el = surface({ 'data-ag-variant': v, 'data-ag-thickness': t });
        const grain = winning(el, '--_ag-grain-opacity', { coarse: true })?.value;
        expect(grain).toBeDefined();
        expect([v, t, numeric(grain!) <= 0.02]).toEqual([v, t, true]);
        if (t !== 'thick' && (BLURRED as readonly string[]).includes(v))
          expect(winning(el, '--_ag-blur', { coarse: true })?.value).toBe(BLUR[t]);
      }
  });
});
