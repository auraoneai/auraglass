/* REQ-CMP-61 — TextField chrome grid (REQ-FIN-73).
   Renders the real TextField, matches every TextField.css / controls.css rule
   against the rendered root, shell and control with Element.matches (jsdom
   implements :has/:where), cascades the declarations by specificity then
   source order, and resolves var() chains through inherited custom properties
   down to the MAT token JSON (tokens/comp, tokens/sys). The asserted values
   are what the browser would compute for those tokens. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import postcss, { type Rule } from 'postcss';
import { TextField } from '../../src/components/text-field';

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

/* ---------- token values (the MAT seam: tokens/comp + tokens/sys) ---------- */
type Json = { [k: string]: unknown };
const TOKENS = new Map<string, string>();
const walk = (node: unknown) => {
  if (!node || typeof node !== 'object') return;
  const n = node as Json;
  const ext = n.$extensions as Json | undefined;
  const v = n.$value as { value?: number; unit?: string } | undefined;
  if (ext && typeof ext['ag.cssVar'] === 'string' && v && typeof v.value === 'number') {
    TOKENS.set(ext['ag.cssVar'] as string, `${v.value}${v.unit ?? ''}`);
  }
  for (const [k, child] of Object.entries(n)) if (!k.startsWith('$')) walk(child);
};
walk(JSON.parse(read('tokens/comp/comp.tokens.json')));
walk(JSON.parse(read('tokens/sys/space.tokens.json')));

/* ---------- rules ---------- */
type Decl = { prop: string; value: string };
type R = { selector: string; decls: Decl[]; order: number; file: string };
const collect = (file: string): R[] => {
  const out: R[] = [];
  postcss.parse(read(file), { from: file }).walkRules((rule: Rule) => {
    let p = rule.parent;
    while (p && p.type !== 'root') {
      if (p.type === 'atrule' && (p as postcss.AtRule).name === 'media') return; // forced-colors / pointer branches
      p = p.parent;
    }
    const decls: Decl[] = [];
    rule.each((n) => {
      if (n.type === 'decl') decls.push({ prop: n.prop, value: n.value });
    });
    for (const selector of rule.selectors) out.push({ selector, decls, order: out.length, file });
  });
  return out;
};
const TF_FILE = 'src/components/text-field/TextField.css';
const SHARED_FILE = 'src/components/control-shared/controls.css';
const TF_RULES = collect(TF_FILE);
const SHARED_RULES = collect(SHARED_FILE);

/* Selector specificity (a, b, c); :where() is 0, :is/:not/:has take their argument. */
const specificity = (sel: string): [number, number, number] => {
  let s = sel.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, '');
  let a = 0, b = 0, c = 0;
  s = s.replace(/:(?:is|not|has)\(((?:[^()]|\([^()]*\))*)\)/g, (_m, inner: string) => {
    const [ia, ib, ic] = inner.split(',').map((x) => specificity(x.trim())).reduce((m, x) => (x > m ? x : m));
    a += ia; b += ib; c += ic;
    return '';
  });
  a += (s.match(/#[\w-]+/g) ?? []).length;
  b += (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length;
  c += (s.replace(/\[[^\]]+\]/g, '').match(/(^|[\s>+~])[a-z][\w-]*/gi) ?? []).length;
  return [a, b, c];
};
const cmp = (x: [number, number, number], y: [number, number, number]) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

/** Cascaded declarations for el (static state: selectors with dynamic pseudo-classes are skipped). */
const cascade = (el: Element, rules: R[]): Map<string, string> => {
  const hits = rules
    .filter((r) => !/:(focus|hover|active|focus-visible|focus-within|-webkit-autofill)\b/.test(r.selector))
    .filter((r) => el.matches(r.selector))
    .sort((x, y) => cmp(specificity(x.selector), specificity(y.selector)) || x.order - y.order);
  const out = new Map<string, string>();
  for (const r of hits) for (const d of r.decls) out.set(d.prop, d.value);
  return out;
};

/* Resolve var() chains: custom properties inherit up the DOM; --ag-* tokens fall back to the token JSON. */
const resolve = (value: string, el: Element, rules: R[], depth = 0): string => {
  if (depth > 20) throw new Error(`var() cycle at ${value}`);
  return value.replace(/var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/g, (_m, name: string, fallback?: string) => {
    for (let n: Element | null = el; n; n = n.parentElement) {
      const v = cascade(n, rules).get(name);
      if (v !== undefined) return resolve(v, n, rules, depth + 1);
    }
    const t = TOKENS.get(name);
    if (t !== undefined) return t;
    if (fallback !== undefined) return resolve(fallback, el, rules, depth + 1);
    return `unresolved(${name})`;
  });
};

const ALL = [...SHARED_RULES, ...TF_RULES];
const mount = (size: 'sm' | 'md' | 'lg' | undefined, density?: 'compact' | 'default' | 'spacious') => {
  const { container } = render(
    <div data-ag-density={density}>
      <TextField label="Name" {...(size ? { size } : {})} />
    </div>,
  );
  const root = container.querySelector('.ag-text-field')!;
  const shell = root.querySelector("[data-ag-part='control-shell']")!;
  const control = root.querySelector("[data-ag-part='control']")!;
  return { root, shell, control };
};

/* REQ-CMP-61 / CMP PRD §4.4 size row. */
const HEIGHTS = {
  default: { sm: '28px', md: '36px', lg: '44px' },
  compact: { sm: '24px', md: '32px', lg: '44px' },
  spacious: { sm: '32px', md: '40px', lg: '48px' },
} as const;
const PAD = { sm: '--ag-space-2', md: '--ag-space-3', lg: '--ag-space-4' } as const;

describe('TextField chrome grid (REQ-CMP-61)', () => {
  it('the comp height tokens the shell reads are emitted by MAT with the PRD values', () => {
    for (const [density, row] of Object.entries(HEIGHTS))
      for (const [size, px] of Object.entries(row))
        expect(TOKENS.get(`--ag-comp-control-height-${size}-${density}`)).toBe(px);
  });

  it('TextField.css never redefines a public --ag-comp-* token', () => {
    const redefined = TF_RULES.flatMap((r) => r.decls.filter((d) => d.prop.startsWith('--ag-')).map((d) => d.prop));
    expect(redefined).toEqual([]);
  });

  for (const density of ['default', 'compact', 'spacious'] as const) {
    for (const size of ['sm', 'md', 'lg'] as const) {
      it(`${size}/${density}: shell min-block-size ${HEIGHTS[density][size]}, padding-inline ${PAD[size]}`, () => {
        const { shell } = mount(size, density === 'default' ? undefined : density);
        const s = cascade(shell, ALL);
        expect(resolve(s.get('min-block-size') ?? 'missing', shell, ALL)).toBe(HEIGHTS[density][size]);
        expect(resolve(s.get('padding-inline') ?? 'missing', shell, ALL)).toBe(TOKENS.get(PAD[size]));
      });
    }
  }

  it('default size (no prop) is md: 36px, --ag-space-3', () => {
    const { shell } = mount(undefined);
    const s = cascade(shell, ALL);
    expect(resolve(s.get('min-block-size')!, shell, ALL)).toBe('36px');
    expect(resolve(s.get('padding-inline')!, shell, ALL)).toBe(TOKENS.get('--ag-space-3'));
  });

  it('text: sm uses --ag-type-label-*, md/lg use --ag-type-body-*', () => {
    for (const [size, role] of [['sm', 'label'], ['md', 'body'], ['lg', 'body']] as const) {
      const { control } = mount(size);
      const c = cascade(control, ALL);
      expect([size, c.get('font-size'), c.get('line-height')]).toEqual([
        size,
        `var(--ag-type-${role}-size)`,
        `var(--ag-type-${role}-leading)`,
      ]);
    }
  });

  it('no local focus ring: the shell ring comes only from the shared REQ-CMP-19 rule', () => {
    const local = TF_RULES.filter((r) => /:focus(-visible|-within)?\b/.test(r.selector)).map((r) => r.selector);
    expect(local).toEqual([]);

    const { shell } = mount('md');
    const ring = SHARED_RULES.filter(
      (r) => /:focus-within\b/.test(r.selector) && shell.matches(r.selector.replace(/:focus-within\b/g, '')),
    );
    expect(ring.length).toBeGreaterThan(0);
    const outline = ring[0]!.decls.find((d) => d.prop === 'outline')?.value ?? '';
    expect(outline).toMatch(/^var\(--ag-focus-width\) solid var\(--ag-focus-outer\b/);

    /* the TextField rest rim must lose to the shared ring (so it actually shows) */
    const rim = TF_RULES.find((r) => r.decls.some((d) => d.prop === 'box-shadow') && shell.matches(r.selector) && !/data-invalid/.test(r.selector))!;
    expect(cmp(specificity(rim.selector), specificity(ring[0]!.selector))).toBeLessThan(0);
  });

  it('invalid rim takes --ag-color-danger', () => {
    const { container } = render(<TextField label="Email" error="Required" />);
    const shell = container.querySelector("[data-ag-part='control-shell']")!;
    expect(cascade(shell, TF_RULES).get('box-shadow')).toMatch(/var\(--ag-color-danger\)$/);
  });
});
