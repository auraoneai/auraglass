/* CMP-323 compat: EnhancedGlassButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButton } from './GlassButton';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0003';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface EnhancedGlassButtonProps extends GlassButtonProps {
  enhanced?: unknown;
  glowIntensity?: unknown;
  animation?: string;
}

/** @deprecated EnhancedGlassButton DEP-C0003 since 4.3.0, removed in 5.0.0. {@link Button} */
export function EnhancedGlassButton({ enhanced, glowIntensity, animation, ...rest }: EnhancedGlassButtonProps) {
  warnDeprecated(DEP);
  if (enhanced !== undefined) drop('enhanced');
  if (glowIntensity !== undefined) drop('glowIntensity');
  if (animation !== undefined) drop('animation');
  return <GlassButton {...rest} />;
}
