/** @jest-environment node */
// MAT-032: scale tests — 9 roles x 4 props; caption >= 12px; exact body clamp;
// unitless line-heights; space = calc(px * var(--_ag-density)); target tokens
// unscaled; exact radius ladder + radius-inner formula; no 'Aeonik'.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const css = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const ROLES = ['display', 'title-1', 'title-2', 'title-3', 'body', 'callout', 'caption', 'label', 'mono'];

const prop = (v: string) => {
  const m = new RegExp(`${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^;]+);`).exec(css);
  return m?.[1].trim();
};

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
    const nums = [...size.matchAll(/(\d+(?:\.\d+)?)px/g)].map((m) => +m[1]);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(12);
  });

  test('body has the exact clamp', () => {
    expect(prop('--ag-type-body-size')).toBe('clamp(15px, 0.9rem + 0.2vw, 17px)');
  });

  test('line-heights are unitless', () => {
    for (const r of ROLES) expect(prop(`--ag-type-${r}-leading`)).toMatch(/^\d+(\.\d+)?$/);
  });

  test('space scale multiplies density', () => {
    const spaces = css.match(/--ag-space-\d+:\s*calc\(\d+px \* var\(--_ag-density\)\)/g) ?? [];
    expect(spaces.length).toBeGreaterThanOrEqual(10);
    expect(prop('--ag-space-4')).toBe('calc(16px * var(--_ag-density))');
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
