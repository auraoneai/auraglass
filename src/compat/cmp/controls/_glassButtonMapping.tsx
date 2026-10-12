/* CMP-323 compat: shared GlassButton (4.x) -> Button (5.0) mapping. Not
   re-exported by src/compat/cmp/index.ts (module-private to the button
   adapters). */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Button } from '../../../components/button';
import type { ButtonProps } from '../../../components/button';
import type { GlassButtonProps } from './GlassButton';

const SIZE_MAP = { xs: 'sm', xl: 'lg' } as const;

/** The GlassButton -> Button mapping without the symbol warning. Prop/variant
 *  drops warn under `dep` — the adapter actually called — so an adapter that
 *  composes this one (EnhancedGlassButton, RippleButton, MagneticButton) warns
 *  only with its own id (REQ-PLAT-30: once per symbol). */
export function GlassButtonMapped({ dep, ...props }: GlassButtonProps & { dep: string }) {
  const drop = (p: string) => warnDeprecated(`${dep}.prop.${p}`);
  const {
    variant, size, leftIcon, rightIcon, asChild,
    glassVariant, material, materialProps,
    predictive, eyeTracking, adaptive, spatialAudio, trackAchievements, usageContext,
    ...rest
  } = props;

  const out: ButtonProps = { ...(rest as ButtonProps) };
  if (leftIcon !== undefined) out.startIcon = leftIcon;
  if (rightIcon !== undefined) out.endIcon = rightIcon;
  if (size !== undefined) out.size = (SIZE_MAP as Record<string, 'sm' | 'md' | 'lg'>)[size] ?? size as 'sm' | 'md' | 'lg';
  if (asChild) out.render = undefined;
  if (glassVariant === 'clear') out.variant = 'clear';
  else if (glassVariant !== undefined) drop('glassVariant');

  switch (variant) {
    case 'primary': out.prominent = true; break;
    case 'secondary': case 'default': case 'outline': out.variant = 'regular'; break;
    case 'ghost': case 'tertiary': case 'link': out.variant = 'identity'; break;
    case 'danger': case 'destructive': case 'error': out.intent = 'danger'; break;
    case 'gradient': case 'aurora': case 'success': case 'warning':
      drop(`variant:${variant}`); break;
    case undefined: break;
    default: drop(`variant:${String(variant)}`);
  }
  for (const p of [material !== undefined && 'material', materialProps !== undefined && 'materialProps',
    predictive !== undefined && 'predictive', eyeTracking !== undefined && 'eyeTracking',
    adaptive !== undefined && 'adaptive', spatialAudio !== undefined && 'spatialAudio',
    trackAchievements !== undefined && 'trackAchievements', usageContext !== undefined && 'usageContext'])
    if (p) drop(p);

  return <Button {...out} />;
}
