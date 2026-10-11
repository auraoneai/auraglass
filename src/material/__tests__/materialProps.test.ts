/* MAT-145 — materialProps/resolveRole matrix: determinism, defaults, no style
   key, size-class↔thickness mapping, sheet never refracts. */
import { describe, expect, it } from '@jest/globals';
import { materialProps } from '../materialProps';
import { resolveRole } from '../internal/resolveRole';
import { componentMaterialProps } from '../internal';
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

  it('emits only data-ag-* keys: no className, no style (S-05)', () => {
    const out = materialProps({ layer: 'overlay' });
    expect(Object.keys(out).every((k) => k.startsWith('data-ag-'))).toBe(true);
    expect(out['data-ag-surface']).toBe('');
    expect(out['data-ag-layer']).toBe('overlay');
  });

  describe('defaults', () => {
    it('layer defaults to content (frozen contract S-05)', () => {
      expect(resolveRole({})['data-ag-layer']).toBe('content');
      expect(materialProps({})['data-ag-layer']).toBe('content');
    });
    it('variant regular emitted for non-content, omitted for content without explicit variant', () => {
      expect(materialProps({ layer: 'chrome' })['data-ag-variant']).toBe('regular');
      expect(materialProps({ layer: 'content' })).not.toHaveProperty('data-ag-variant');
      expect(materialProps({ layer: 'content', variant: 'clear' })['data-ag-variant']).toBe('clear');
    });
    it('content default content-raised on content layer only; content ignored off-layer', () => {
      expect(materialProps({ layer: 'content' })['data-ag-content']).toBe('content-raised');
      expect(materialProps({ layer: 'chrome' })).not.toHaveProperty('data-ag-content');
      // contract: content passed on a non-content layer is dropped entirely
      expect(materialProps({ layer: 'transient', content: 'content-raised' }))
        .not.toHaveProperty('data-ag-content');
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
  it('sizeClass maps control→thin bar→regular panel→regular sheet→thick in emitted data-ag-thickness', () => {
    expect(resolveRole({ layer: 'chrome' }, 'control')['data-ag-thickness']).toBe('thin');
    expect(resolveRole({ layer: 'chrome' }, 'bar')['data-ag-thickness']).toBe('regular');
    expect(resolveRole({ layer: 'chrome' }, 'panel')['data-ag-thickness']).toBe('regular');
    expect(resolveRole({ layer: 'overlay' }, 'sheet')['data-ag-thickness']).toBe('thick');
  });
  it('pure default (no thickness, no size class) omits data-ag-thickness', () => {
    expect(resolveRole({ layer: 'chrome' })).not.toHaveProperty('data-ag-thickness');
    expect(materialProps({ layer: 'chrome' })).not.toHaveProperty('data-ag-thickness');
  });
  it('sizeClass keys the refraction map', () => {
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

describe('componentMaterialProps (internal size-class channel, D-07)', () => {
  it('emits the size-class thickness: control→thin, bar→regular, panel→regular, sheet→thick', () => {
    expect(componentMaterialProps({ layer: 'chrome', interactive: true }, 'control')['data-ag-thickness']).toBe('thin');
    expect(componentMaterialProps({ layer: 'chrome' }, 'bar')['data-ag-thickness']).toBe('regular');
    expect(componentMaterialProps({ layer: 'overlay' }, 'panel')['data-ag-thickness']).toBe('regular');
    expect(componentMaterialProps({ layer: 'overlay' }, 'sheet')['data-ag-thickness']).toBe('thick');
  });
  it('explicit thickness wins over the size class', () => {
    expect(componentMaterialProps({ layer: 'chrome', thickness: 'thick' }, 'control')['data-ag-thickness']).toBe('thick');
  });
  it('equals materialProps plus only the thickness (and refraction sizeclass) attributes', () => {
    const role: MaterialRole = { layer: 'chrome', variant: 'clear', interactive: true };
    expect(componentMaterialProps(role, 'control')).toEqual({ ...materialProps(role), 'data-ag-thickness': 'thin' });
    expect(componentMaterialProps({ layer: 'chrome', refraction: true }, 'bar')).toEqual({
      ...materialProps({ layer: 'chrome', refraction: true }), 'data-ag-thickness': 'regular', 'data-ag-sizeclass': 'bar',
    });
  });
  it('emits only data-ag-* keys and no style, and never refracts a sheet', () => {
    const out = componentMaterialProps({ layer: 'overlay', refraction: true }, 'sheet');
    expect(Object.keys(out).every((k) => k.startsWith('data-ag-'))).toBe(true);
    expect(out).not.toHaveProperty('style');
    expect(out).not.toHaveProperty('data-ag-refraction');
    expect(out).not.toHaveProperty('data-ag-sizeclass');
  });
  it('is not part of the public ./material entry', async () => {
    const pub = (await import('../index')) as Record<string, unknown>;
    expect(pub).not.toHaveProperty('componentMaterialProps');
    expect(pub).not.toHaveProperty('resolveRole');
  });
});
