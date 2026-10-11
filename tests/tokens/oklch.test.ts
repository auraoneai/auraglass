/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-031: colour tests — ramps monotone in L (dL >= 0.03); every sys.color leaf
// emits light-dark(; hex only inside @supports not; dark on-surface L>=0.92 C<=0.02.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from '../../scripts/tokens/color.mjs';
import postcss, { type AtRule, type Container } from 'postcss';

const ref = JSON.parse(readFileSync(join(ROOT, 'tokens/ref/color.tokens.json'), 'utf8'));
const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const sys = JSON.parse(readFileSync(join(ROOT, 'tokens/sys/color.tokens.json'), 'utf8'));

const L = (v: any) => v.$value.components[0];

describe('oklch colour contract (MAT-031)', () => {
  test('every ref ramp is monotone decreasing in L with dL >= 0.03', () => {
    for (const [ramp, steps] of Object.entries<any>(ref.ref.color)) {
      if (ramp.startsWith('$') || typeof steps !== 'object') continue;
      const Ls = Object.keys(steps).filter((k) => !k.startsWith('$')).sort((a, b) => +a - +b).map((k) => L(steps[k]));
      for (let i = 1; i < Ls.length; i++) {
        const d = Ls[i - 1] - Ls[i];
        expect({ ramp, i, d }).toEqual(expect.objectContaining({ d: expect.any(Number) }));
        if (!(d >= 0.029)) throw new Error(`${ramp} step ${i - 1}->${i}: dL=${d}`);
      }
    }
  });

  test('every sys.color leaf emits light-dark(', () => {
    const leaves: Array<[string, string]> = [];
    const walk = (o: any, p: string) => {
      for (const [k, v] of Object.entries<any>(o)) {
        if (v.$type === 'color' && v.$value?.light && v.$extensions?.['ag.cssVar'])
          leaves.push([`${p}.${k}`, v.$extensions['ag.cssVar']]);
        else if (typeof v === 'object' && v !== null && !('$value' in v) && !k.startsWith('$')) walk(v, `${p}.${k}`);
      }
    };
    walk(sys.sys.color, 'sys.color');
    const baseBlock = css.slice(0, css.indexOf('[data-ag-scheme'));
    const missing = leaves.filter(([, v]) => !new RegExp(`${v}:\\s*light-dark\\(`).test(baseBlock));
    console.log(`sys.color light-dark leaves: ${leaves.length}, missing: ${missing.map(m => m[0]).join(',') || 'none'}`);
    expect(missing).toEqual([]);
  });

  test('hex appears only inside @supports not blocks', () => {
    // strip every @supports not (...) { ... } block, then no hex may remain
    const stripped = css.replace(/@supports\s+not[^{]*\{(?:[^{}]|\{[^{}]*\}|\{[^{}]*\{[^{}]*\}[^{}]*\})*\}/g, '');
    expect(stripped).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    // sanity: the oklch fallback block does carry hex
    expect(css).toMatch(/@supports not \(color: oklch\(0 0 0\)\)[\s\S]*#[0-9a-fA-F]{3,8}/);
  });

  test('dark on-surface L >= 0.92 and C <= 0.02', () => {
    const onSurface = sys.sys.color['on-surface'];
    const alias = /^\{(.+)\}$/.exec(onSurface.$value.dark)![1]!;
    const [ramp, step] = alias.split('.').slice(-2);
    const dark = ref.ref.color[ramp!][step!].$value;
    const [l, c] = dark.components;
    expect(l).toBeGreaterThanOrEqual(0.92);
    expect(c).toBeLessThanOrEqual(0.02);
  });
});

// MAT-05 (REQ-FIN-50): `@supports not (color: oklch(0 0 0))` carries an sRGB value for
// every --ag-color-* per scheme, keeps alpha, and serialises shadows as full sRGB strings.
// Checked on the published `aura-glass/tokens.css` (dist/tokens.css) and dist/css/tokens.css.
describe.each(['dist/tokens.css', 'dist/css/tokens.css'])('sRGB fallback block (MAT-05) in %s', (file) => {
  const SRGB = /^#[0-9a-f]{6}$|^rgb\(/;
  const root = postcss.parse(readFileSync(join(ROOT, file), 'utf8'));
  const fallback: AtRule[] = [];
  root.walkAtRules('supports', (at) => {
    if (at.params.replace(/\s+/g, ' ') === 'not (color: oklch(0 0 0))') fallback.push(at);
  });
  const ruleDecls = (container: Container, selector: string) => {
    const out = new Map<string, string>();
    container.each((n) => {
      if (n.type === 'rule' && n.selector === selector) n.walkDecls((d) => void out.set(d.prop, d.value));
    });
    return out;
  };
  const mediaDecls = (container: Container, params: string, selector: string) => {
    const out = new Map<string, string>();
    container.each((n) => {
      if (n.type === 'atrule' && n.name === 'media' && n.params === params) ruleDecls(n, selector).forEach((v, k) => out.set(k, v));
    });
    return out;
  };
  const colorVars = (m: Map<string, string>) => [...m].filter(([p]) => p.startsWith('--ag-color-'));
  // Expected sRGB value of a light-dark(oklch(..), oklch(..)) declaration in the main :root.
  const mainRoot = new Map<string, string>();
  root.walkRules(':root', (r) => {
    if (r.parent?.type === 'atrule' && (r.parent as AtRule).name === 'layer') r.walkDecls((d) => void mainRoot.set(d.prop, d.value));
  });
  const expected = (prop: string, scheme: 0 | 1) => {
    const m = /^light-dark\(\s*(oklch\([^)]*\)),\s*(oklch\([^)]*\))\s*\)$/.exec(mainRoot.get(prop) ?? '');
    if (!m) throw new Error(`${prop}: main :root value is not light-dark(oklch, oklch): ${mainRoot.get(prop)}`);
    const [l, c, h] = m[scheme + 1]!.slice(6, -1).trim().split(/\s+/).map(Number);
    return srgbToHex(clampSrgb(oklchToSrgb(gamutMapOklch({ l: l!, c: c!, h: h! }))));
  };
  const sysColorVars = (() => {
    const out: string[] = [];
    const walk = (o: any) => {
      for (const [k, v] of Object.entries<any>(o)) {
        if (k.startsWith('$') || typeof v !== 'object' || v === null) continue;
        const cssVar = v.$extensions?.['ag.cssVar'];
        if (v.$type === 'color' && v.$value?.light && typeof cssVar === 'string' && cssVar.startsWith('--ag-color-')) out.push(cssVar);
        else if (!('$value' in v)) walk(v);
      }
    };
    walk(sys.sys.color);
    return out.sort();
  })();

  test('exactly one oklch fallback block exists', () => {
    expect(fallback).toHaveLength(1);
  });

  test('13 --ag-color-* sRGB declarations for light and 13 for dark (attribute + media mirror)', () => {
    const at = fallback[0]!;
    const light = colorVars(ruleDecls(at, ':root'));
    const dark = colorVars(ruleDecls(at, '[data-ag-scheme="dark"]'));
    const mirror = colorVars(mediaDecls(at, '(prefers-color-scheme: dark)', ':root:not([data-ag-scheme])'));
    expect(sysColorVars).toHaveLength(13);
    for (const [label, decls] of [['light', light], ['dark', dark], ['dark mirror', mirror]] as const) {
      expect({ label, props: decls.map(([p]) => p).sort() }).toEqual({ label, props: sysColorVars });
      const bad = decls.filter(([, v]) => !SRGB.test(v));
      expect({ label, bad }).toEqual({ label, bad: [] });
    }
    for (const [p, v] of light) expect({ p, v }).toEqual({ p, v: expected(p, 0) });
    for (const [p, v] of dark) expect({ p, v }).toEqual({ p, v: expected(p, 1) });
    expect(new Map(mirror)).toEqual(new Map(dark));
  });

  test('--ag-scrim-media keeps alpha 0.72', () => {
    expect(ruleDecls(fallback[0]!, ':root').get('--ag-scrim-media')).toBe('rgb(0 0 0 / 0.72)');
  });

  test('shadows are full sRGB shadow strings', () => {
    const shadows: Array<[string, string]> = [];
    fallback[0]!.walkDecls((d) => {
      if (/^--_?ag-(surface-)?shadow/.test(d.prop)) shadows.push([d.prop, d.value]);
    });
    expect(shadows.length).toBeGreaterThan(0);
    const surface = ruleDecls(fallback[0]!, ':root').get('--ag-surface-shadow');
    expect(surface).toBe('rgb(0 0 0 / 0.18)');
    const bad = shadows.filter(([p, v]) =>
      p === '--ag-surface-shadow' ? false : !/^(?:-?[0-9.]+px\s+){4}(?:#[0-9a-f]{6}|rgb\([0-9 ]+(?:\/ [0-9.]+)?\))$/.test(v));
    expect(bad).toEqual([]);
  });

  test('no oklch() value inside the fallback, and every oklch-bearing main rule is mirrored', () => {
    const at = fallback[0]!;
    const leaked: string[] = [];
    at.walkDecls((d) => { if (/oklch\(|light-dark\(/.test(d.value)) leaked.push(`${d.prop}: ${d.value}`); });
    expect(leaked).toEqual([]);
    // every custom property whose main-layer value uses oklch() has a fallback declaration
    const mainProps = new Set<string>();
    root.walkDecls((d) => {
      let p: any = d.parent;
      while (p && p !== at && p.type !== 'root') p = p.parent;
      if (p !== at && /oklch\(/.test(d.value) && d.prop.startsWith('--')) mainProps.add(d.prop);
    });
    const fbProps = new Set<string>();
    at.walkDecls((d) => void fbProps.add(d.prop));
    expect([...mainProps].filter((p) => !fbProps.has(p))).toEqual([]);
  });
});
