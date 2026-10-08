/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-031: colour tests — ramps monotone in L (dL >= 0.03); every sys.color leaf
// emits light-dark(; hex only inside @supports not; dark on-surface L>=0.92 C<=0.02.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

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
