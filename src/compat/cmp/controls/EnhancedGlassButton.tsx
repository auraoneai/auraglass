/* CMP-323 compat: EnhancedGlassButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButtonMapped } from './_glassButtonMapping';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0003';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface EnhancedGlassButtonProps extends GlassButtonProps {
  enhanced?: unknown;
  glowIntensity?: unknown;
  animation?: string;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Button}. */
export function EnhancedGlassButton({ enhanced, glowIntensity, animation, ...rest }: EnhancedGlassButtonProps) {
  warnDeprecated(DEP);
  if (enhanced !== undefined) drop('enhanced');
  if (glowIntensity !== undefined) drop('glowIntensity');
  if (animation !== undefined) drop('animation');
  return <GlassButtonMapped dep={DEP} {...rest} />;
}
