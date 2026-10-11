/* CMP-323 compat: MagneticButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButton } from './GlassButton';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0007';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface MagneticButtonProps extends GlassButtonProps {
  magnetic?: unknown;
  magneticStrength?: number;
  magneticRadius?: number;
}

export function MagneticButton({ magnetic, magneticStrength, magneticRadius, ...rest }: MagneticButtonProps) {
  warnDeprecated(DEP);
  if (magnetic !== undefined) drop('magnetic');
  if (magneticStrength !== undefined) drop('magneticStrength');
  if (magneticRadius !== undefined) drop('magneticRadius');
  return <GlassButton {...rest} />;
}

/** 4.x also shipped `GlassMagneticButton` (DEP-C0041) — same adapter. */
export { MagneticButton as GlassMagneticButton } from './MagneticButton';
