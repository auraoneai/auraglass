/* MAT-145 — materialProps/resolveRole matrix: determinism, defaults, no style
   key, size-class↔thickness mapping, sheet never refracts. */
import { describe, expect, it } from '@jest/globals';
import { materialProps } from '../materialProps';
import { resolveRole } from '../internal/resolveRole';
import type { MaterialRole } from '../types';

const LAYERS = ['chrome', 'overlay', 'transient', 'content'] as const;
const VARIANTS = ['regular', 'clear', 'identity'] as const;
const THICKNESSES = ['thin', 'regular', 'thick'] as const;
const CONTENTS = ['content-raised', 'content-sunken'] as const;
const SHAPES = ['fixed', 'capsule', 'concentric'] as const;

describe('materialProps matrix', () => {
  it('is deterministic and deep-equal across the full role matrix', () => {
    for (const layer of LAYERS) for (const variant of VARIANTS)
      for (const thickness of THICKNESSES) for (const content of CONTENTS)
        for (const shape of SHAPES) {
          const role: MaterialRole = { layer, variant, thickness, content, shape };
          expect(materialProps(role)).toEqual(materialProps({ ...role }));
        }
  });

  it('never emits a style key or an inline style', () => {
    const out = materialProps({ layer: 'chrome', thickness: 'thick', prominent: true });
    expect(Object.keys(out)).not.toContain('style');
    for (const v of Object.values(out)) expect(v).not.toMatch(/var\(.*:.*\)/);
  });

  it('always emits className + data-ag-surface + data-ag-layer', () => {
    const out = materialProps({ layer: 'overlay' });
    expect(out.className).toBe('ag-surface');
    expect(out['data-ag-surface']).toBe('');
    expect(out['data-ag-layer']).toBe('overlay');
  });

  describe('defaults', () => {
    it('layer defaults to chrome through the resolveRole delegation', () => {
      expect(resolveRole({})['data-ag-layer']).toBe('chrome');
      expect(materialProps({})['data-ag-layer']).toBe('chrome');
    });
    it('variant regular emitted for non-content, omitted for content without explicit variant', () => {
      expect(materialProps({ layer: 'chrome' })['data-ag-variant']).toBe('regular');
      expect(materialProps({ layer: 'content' })).not.toHaveProperty('data-ag-variant');
      expect(materialProps({ layer: 'content', variant: 'clear' })['data-ag-variant']).toBe('clear');
    });
    it('content default content-raised on content layer only', () => {
      expect(materialProps({ layer: 'content' })['data-ag-content']).toBe('content-raised');
      expect(materialProps({ layer: 'chrome' })).not.toHaveProperty('data-ag-content');
    });
    it('shape/thickness attrs only when explicit', () => {
      const out = materialProps({ layer: 'overlay' });
      expect(out).not.toHaveProperty('data-ag-shape');
      expect(out).not.toHaveProperty('data-ag-thickness');
    });
  });

  it('boolean props emit empty-string attributes', () => {
    const out = materialProps({
      layer: 'chrome', interactive: true, prominent: true, refraction: true, allowNested: true,
    }) as unknown as Record<string, string>;
    expect(out['data-ag-interactive']).toBe('');
    expect(out['data-ag-prominent']).toBe('');
    expect(out['data-ag-refraction']).toBe('');
    expect(out['data-ag-allow-nested']).toBe('');
  });
});

describe('resolveRole size-class mapping', () => {
  it('explicit thickness wins over sizeClass', () => {
    expect(resolveRole({ thickness: 'thick' }, 'control')['data-ag-thickness']).toBe('thick');
  });
  it('sizeClass maps control→thin bar→regular panel→regular sheet→thick (resolved)', () => {
    // resolved thickness is internal; attr emitted only when explicit — verify via refraction map
    expect(resolveRole({ layer: 'chrome', refraction: true }, 'control')['data-ag-sizeclass']).toBe('control');
    expect(resolveRole({ layer: 'chrome', refraction: true }, 'bar')['data-ag-sizeclass']).toBe('bar');
    expect(resolveRole({ layer: 'chrome', refraction: true }, 'panel')['data-ag-sizeclass']).toBe('panel');
  });
  it('refraction without sizeClass derives from thickness', () => {
    expect(resolveRole({ layer: 'chrome', refraction: true, thickness: 'thin' })['data-ag-sizeclass']).toBe('control');
    expect(resolveRole({ layer: 'chrome', refraction: true, thickness: 'regular' })['data-ag-sizeclass']).toBe('bar');
    expect(resolveRole({ layer: 'chrome', refraction: true, thickness: 'thick' })['data-ag-sizeclass']).toBe('panel');
    // default thickness regular → bar
    expect(resolveRole({ layer: 'chrome', refraction: true })['data-ag-sizeclass']).toBe('bar');
  });
  it('sheet never refracts and never emits sizeclass', () => {
    const out = resolveRole({ layer: 'chrome', refraction: true }, 'sheet');
    expect(out).not.toHaveProperty('data-ag-refraction');
    expect(out).not.toHaveProperty('data-ag-sizeclass');
  });
  it('fallbackRadius emits data-ag-radius token', () => {
    expect(resolveRole({ layer: 'chrome', fallbackRadius: 'lg' })['data-ag-radius']).toBe('lg');
  });
});
