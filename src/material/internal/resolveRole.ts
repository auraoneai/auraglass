/* MAT-134 — pure role→attribute resolution (§4.10 emission rules).
   No DOM, no React, no side effects. Not exported from index.ts. */
import type { MaterialRole, Layer, Thickness, SizeClass } from '../types';

/** sizeClass -> thickness (D-07 internal mapping) */
const SIZECLASS_TO_THICKNESS: Record<SizeClass, Thickness> = {
  control: 'thin',
  bar: 'regular',
  panel: 'regular',
  sheet: 'thick',
};

/** thickness -> sizeClass for the refraction map key */
const THICKNESS_TO_SIZECLASS: Record<Thickness, SizeClass> = {
  thin: 'control',
  regular: 'bar',
  thick: 'panel',
};

export interface ResolvedAttributes {
  'data-ag-surface': '';
  'data-ag-layer': Layer;
  'data-ag-variant'?: string;
  'data-ag-thickness'?: Thickness;
  'data-ag-content'?: string;
  'data-ag-shape'?: string;
  'data-ag-interactive'?: '';
  'data-ag-prominent'?: '';
  'data-ag-refraction'?: '';
  'data-ag-allow-nested'?: '';
  'data-ag-sizeclass'?: SizeClass;
  'data-ag-radius'?: string;
}

export interface ResolvedRole extends MaterialRole {
  sizeClass?: SizeClass;
}

export function resolveRole(role: MaterialRole = {}, sizeClass?: SizeClass): ResolvedAttributes {
  // S-05 (frozen contract test): layer defaults to 'content'; the variant
  // attribute is emitted for non-content layers (default 'regular') and for
  // content only when explicit; data-ag-content is emitted only when
  // layer=content (default 'content-raised'), ignored otherwise.
  const layer: Layer = role.layer ?? 'content';
  const out: Record<string, string> = {
    'data-ag-surface': '',
    'data-ag-layer': layer,
  };

  if (layer === 'content') {
    if (role.variant !== undefined) out['data-ag-variant'] = role.variant;
    out['data-ag-content'] = role.content ?? 'content-raised';
  } else {
    out['data-ag-variant'] = role.variant ?? 'regular';
  }

  // thickness resolution: explicit prop > sizeClass map > 'regular'. The
  // attribute is emitted when explicit or derived from a component size class
  // (REQ-MAT-23, D-07); only the pure default (no thickness, no size class) is
  // omitted, because the ladder cells default to regular.
  const derived: Thickness | undefined = role.thickness
    ?? (sizeClass !== undefined ? SIZECLASS_TO_THICKNESS[sizeClass] : undefined);
  const thickness: Thickness = derived ?? 'regular';
  if (derived !== undefined) out['data-ag-thickness'] = derived;

  // shape default 'fixed' is emitted only when explicit
  if (role.shape !== undefined) out['data-ag-shape'] = role.shape;

  const isSheet = sizeClass === 'sheet';
  if (role.interactive === true) out['data-ag-interactive'] = '';
  if (role.prominent === true) out['data-ag-prominent'] = '';
  if (role.refraction === true && !isSheet) {
    out['data-ag-refraction'] = '';
    out['data-ag-sizeclass'] = sizeClass ?? THICKNESS_TO_SIZECLASS[thickness] as SizeClass;
  }
  if (role.allowNested === true) out['data-ag-allow-nested'] = '';
  if (role.fallbackRadius !== undefined) out['data-ag-radius'] = role.fallbackRadius;

  return out as unknown as ResolvedAttributes;
}
