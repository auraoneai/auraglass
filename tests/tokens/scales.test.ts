/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-032: scale tests — 9 roles x 4 props; caption >= 12px; exact body clamp;
// unitless line-heights; space = calc(px * var(--ag-density)); target tokens
// unscaled; exact radius ladder + radius-inner formula; no 'Aeonik'.
// MAT-06 (REQ-MAT-06): every [data-ag-density=…] block redeclares --ag-density
// and all 11 --ag-space-* so nested density wrappers rescale spacing.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const ROLES = ['display', 'title-1', 'title-2', 'title-3', 'body', 'callout', 'caption', 'label', 'mono'];

const prop = (v: string) => {
  const m = new RegExp(`${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^;]+);`).exec(css);
  return m?.[1]!.trim();
};

const SPACE_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

/** Declarations of the single rule with exactly `selector` inside `@layer ag.tokens` (not nested in @media/@supports). */
function blockDecls(selector: string): Map<string, string> {
  const rules: postcss.Rule[] = [];
  postcss.parse(css).walkRules((r) => {
    const parent = r.parent as postcss.AtRule | undefined;
    if (r.selector === selector && parent?.type === 'atrule' && parent.name === 'layer' && parent.params === 'ag.tokens') rules.push(r);
  });
  expect(rules).toHaveLength(1);
  const out = new Map<string, string>();
  rules[0]!.walkDecls((d) => {
    out.set(d.prop, d.value);
  });
  return out;
}

describe('scale contract (MAT-032)', () => {
  test('9 roles x 4 props emitted', () => {
    for (const r of ROLES) {
      expect(prop(`--ag-type-${r}-size`)).toBeTruthy();
      expect(prop(`--ag-type-${r}-leading`)).toBeTruthy();
      expect(prop(`--ag-type-${r}-weight`)).toBeTruthy();
      expect(prop(`--_ag-type-${r}-tracking`)).toBeTruthy();
    }
  });

  test('caption >= 12px', () => {
    const size = prop('--ag-type-caption-size')!;
    const nums = [...size.matchAll(/(\d+(?:\.\d+)?)px/g)].map((m) => +m[1]!);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(12);
  });

  test('body has the exact clamp', () => {
    expect(prop('--ag-type-body-size')).toBe('clamp(15px, 0.9rem + 0.2vw, 17px)');
  });

  test('line-heights are unitless', () => {
    for (const r of ROLES) expect(prop(`--ag-type-${r}-leading`)).toMatch(/^\d+(\.\d+)?$/);
  });

  test('space scale multiplies the public --ag-density', () => {
    const root = blockDecls(':root');
    for (const n of SPACE_STEPS) expect(root.get(`--ag-space-${n}`)).toBe(`calc(${n * 4}px * var(--ag-density))`);
    expect(root.get('--ag-density')).toBe('var(--_ag-density)');
    expect(root.get('--_ag-density')).toBe('1');
  });

  test.each([
    ['compact', '0.875'],
    ['regular', '1'],
    ['spacious', '1.125'],
  ])('[data-ag-density="%s"] redeclares --ag-density = %s and all 11 spaces', (value, factor) => {
    const decls = blockDecls(`[data-ag-density="${value}"]`);
    expect(decls.get('--ag-density')).toBe(factor);
    expect(decls.get('--_ag-density')).toBe(factor);
    for (const n of SPACE_STEPS) expect(decls.get(`--ag-space-${n}`)).toBe(`calc(${n * 4}px * var(--ag-density))`);
    const spaces = [...decls.keys()].filter((k) => /^--ag-space-\d+$/.test(k));
    expect(spaces.sort()).toEqual(SPACE_STEPS.map((n) => `--ag-space-${n}`).sort());
  });

  test('compact block: --ag-space-4 is calc(16px * var(--ag-density)), --ag-density 0.875', () => {
    const compact = blockDecls('[data-ag-density="compact"]');
    expect(compact.get('--ag-space-4')).toBe('calc(16px * var(--ag-density))');
    expect(compact.get('--ag-density')).toBe('0.875');
  });

  test('no emitted --ag-space-* reads the private --_ag-density', () => {
    const bad: string[] = [];
    postcss.parse(css).walkDecls(/^--ag-space-\d+$/, (d) => {
      if (d.value.includes('--_ag-density')) bad.push(`${d.prop}: ${d.value}`);
    });
    expect(bad).toEqual([]);
  });

  test('target tokens are unscaled (no density calc)', () => {
    expect(prop('--ag-target-min')).toBe('24px');
    expect(prop('--ag-target-coarse')).toBe('44px');
  });

  test('exact radius ladder + inner formula', () => {
    for (const [name, px] of [['xs', 6], ['sm', 10], ['md', 14], ['lg', 20], ['xl', 28], ['full', 9999]] as const)
      expect(prop(`--ag-radius-${name}`)).toBe(`${px}px`);
    expect(prop('--ag-radius-inner')).toBe('max(0px, calc(var(--ag-radius-outer) - var(--ag-inset)))');
  });

  test('no Aeonik', () => {
    expect(css).not.toMatch(/Aeonik/i);
  });
});
