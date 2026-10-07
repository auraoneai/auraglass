/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { defineMaterial, DEFAULT_MATERIAL_SPEC } from '../defineMaterial';
import type { MaterialSpec } from '../types';

const base = (): MaterialSpec => JSON.parse(JSON.stringify(DEFAULT_MATERIAL_SPEC)) as MaterialSpec;

describe('defineMaterial', () => {
  it('returns a frozen spec with defaults for an empty input', () => {
    const spec = defineMaterial();
    expect(Object.isFrozen(spec)).toBe(true);
    expect(Object.isFrozen(spec.blur)).toBe(true);
    expect(Object.isFrozen(spec.opacityFloor.glass.regular)).toBe(true);
    expect(spec.blur.thick).toBe('32px');
    expect(spec.grain.asset).toBe('ag-grain-128.avif');
    expect(spec.scrim.clearOverBright).toBe(0.35);
    expect(spec.refraction.bezel).toEqual({ thin: '12px', regular: '16px', thick: '24px' });
  });

  it('merges partial input over defaults', () => {
    const spec = defineMaterial({ saturation: 1.8 });
    expect(spec.saturation).toBe(1.8);
    expect(spec.blur.regular).toBe('20px');
  });

  it.each([
    ['blur.thick', { blur: { thick: '40px' } }, /blur\.thick.*32px cap/],
    ['blur.thin', { blur: { thin: '33px' } }, /blur\.thin/],
    ['scrim.modal', { scrim: { modal: 1.4 } }, /scrim\.modal/],
    ['scrim.blur', { scrim: { blur: '16px' } }, /scrim\.blur.*12px/],
    ['grain.opacity low', { grain: { opacity: 0.01 } }, /grain\.opacity.*0\.02/],
    ['grain.opacity high', { grain: { opacity: 0.5 } }, /grain\.opacity/],
    ['fallbackFill.light', { fallbackFill: { light: 'oklch(97% 0.004 260 / 0.5)' } }, /fallbackFill\.light/],
  ] as const)('throws naming %s', (_name, patch, pattern) => {
    const spec = base();
    const merged = JSON.parse(JSON.stringify(spec)) as Record<string, unknown>;
    // apply the (possibly partial) patch over a full spec
    const apply = (dst: Record<string, unknown>, src: Record<string, unknown>) => {
      for (const [k, v] of Object.entries(src)) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v) && typeof dst[k] === 'object' && dst[k] !== null) {
          apply(dst[k] as Record<string, unknown>, v as Record<string, unknown>);
        } else {
          dst[k] = v;
        }
      }
    };
    apply(merged, patch as Record<string, unknown>);
    expect(() => defineMaterial(merged as Partial<MaterialSpec>)).toThrow(pattern);
  });

  it('throws naming the cell when an opacityFloor alpha leaves [0,1]', () => {
    const spec = base();
    spec.opacityFloor.glass.thin.light = 1.2;
    expect(() => defineMaterial(spec)).toThrow(/opacityFloor\.glass\.thin\.light/);
  });

  it('is pure: repeated calls return equal frozen specs and do not mutate input', () => {
    const input = { saturation: 2 };
    const a = defineMaterial(input);
    const b = defineMaterial(input);
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    expect(input).toEqual({ saturation: 2 });
  });
});
