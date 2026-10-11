/* src/compat/mat/material/OptimizedGlass.tsx — MAT-354 (REQ-MAT-24, S-39/46).
   4.x glass primitives -> Surface. elevation levelN/0|1->thin, 2->regular,
   3+->thick; intent='primary' -> prominent (other intents dropped); interactive
   passthrough; variant='solid' -> data-ag-transparency="solid" wrapper;
   adaptive -> data-ag-backdrop="auto" wrapper only (the variant is not
   rewritten); unmapped variants/intents and the deleted optical props drop
   with one warnDeprecated(<adapter DEP-M id>) (REL-072).
   className/style/children passthrough; no style attribute unless the consumer
   passed one (Surface emits no style otherwise). */
import * as React from 'react';
import { Surface } from '../../../material/index';
import type { MaterialVariant, SurfaceProps } from '../../../contracts/material';
import { dropNoopProps, elevationToThickness, type CompatAdapter } from './shared';

/** 4.x OptimizedGlass surface props (subset mapped by REQ-MAT-24). */
export interface OptimizedGlassCompatProps extends Omit<SurfaceProps, 'variant' | 'thickness'> {
  as?: React.ElementType;
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | number;
  variant?: 'clear' | 'frosted' | 'tinted' | 'luminous' | 'dynamic' | 'crystal' | 'solid' | 'regular';
  interactive?: boolean;
  adaptive?: boolean;
}

const FIVE_VARIANTS = new Set<MaterialVariant>(['regular', 'clear', 'identity']);

function adaptOptimizedGlass(id: CompatAdapter, props: OptimizedGlassCompatProps): React.ReactElement {
  const { as, intent, elevation, variant, adaptive, interactive, ref, ...rest } = props;
  const domProps = dropNoopProps(
    id,
    rest as Record<string, unknown>,
    // 'intent'/'variant' values with no 5.0 mapping drop with the same warning
    [...(intent !== undefined && intent !== 'primary' ? ['intent'] : []),
     ...(variant !== undefined && !FIVE_VARIANTS.has(variant as MaterialVariant) && variant !== 'solid' ? ['variant'] : [])],
  );
  const thickness = elevationToThickness(elevation);
  // adaptive only adds the data-ag-backdrop="auto" wrapper below; the 5.0
  // variant passes through unchanged (REQ-MAT-24). Unmapped 4.x variants drop.
  const mappedVariant: MaterialVariant | undefined =
    variant !== undefined && FIVE_VARIANTS.has(variant as MaterialVariant)
      ? (variant as MaterialVariant)
      : undefined;
  // consumer attrs first, mapped role props last — consumer non-data-ag-*
  // attributes win, role data-ag-* always win (REQ-MAT-24).
  const surface = (
    <Surface
      {...(domProps as Omit<SurfaceProps, 'variant' | 'thickness' | 'interactive' | 'prominent'>)}
      {...(thickness !== undefined ? { thickness } : {})}
      {...(mappedVariant !== undefined ? { variant: mappedVariant } : {})}
      {...(interactive === true ? { interactive: true } : {})}
      {...(intent === 'primary' ? { prominent: true } : {})}
      {...(as !== undefined ? { render: React.createElement(as) } : {})}
      {...(ref !== undefined ? { ref } : {})}
    />
  );
  if (variant === 'solid' || adaptive === true) {
    return (
      <div
        {...(variant === 'solid' ? { 'data-ag-transparency': 'solid' } : {})}
        {...(adaptive === true ? { 'data-ag-backdrop': 'auto' } : {})}
      >
        {surface}
      </div>
    );
  }
  return surface;
}

/** 4.x `OptimizedGlass` (exported as `OptimizedGlassCore` internally). */
export function OptimizedGlass(props: OptimizedGlassCompatProps): React.ReactElement {
  return adaptOptimizedGlass('OptimizedGlass', props);
}

/** 4.x `GlassCore` — same prop surface, fewer defaults. */
export function GlassCore(props: OptimizedGlassCompatProps): React.ReactElement {
  return adaptOptimizedGlass('GlassCore', props);
}

/** 4.x `GlassPrimitive` — the GlassCore surface under its 4.x primitive name. */
export function GlassPrimitive(props: OptimizedGlassCompatProps): React.ReactElement {
  return adaptOptimizedGlass('GlassPrimitive', props);
}

/** 4.x `OptimizedGlassAdvanced` — adds optical props; all map to the same drops. */
export function OptimizedGlassAdvanced(props: OptimizedGlassCompatProps): React.ReactElement {
  return adaptOptimizedGlass('OptimizedGlassAdvanced', props);
}

/** 4.x `GlassAdvanced` — the OptimizedGlassAdvanced surface under its 4.x name. */
export function GlassAdvanced(props: OptimizedGlassCompatProps): React.ReactElement {
  return adaptOptimizedGlass('GlassAdvanced', props);
}
