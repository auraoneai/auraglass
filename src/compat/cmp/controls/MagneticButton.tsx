/* CMP-323 compat: MagneticButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButton } from './GlassButton';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0007';
const DEP_GLASS = 'DEP-C0041';

export interface MagneticButtonProps extends GlassButtonProps {
  magnetic?: unknown;
  magneticStrength?: number;
  magneticRadius?: number;
}

function renderMagnetic(dep: string, { magnetic, magneticStrength, magneticRadius, ...rest }: MagneticButtonProps) {
  warnDeprecated(dep);
  const drop = (p: string) => warnDeprecated(`${dep}.prop.${p}`);
  if (magnetic !== undefined) drop('magnetic');
  if (magneticStrength !== undefined) drop('magneticStrength');
  if (magneticRadius !== undefined) drop('magneticRadius');
  return <GlassButton {...rest} />;
}

export function MagneticButton(props: MagneticButtonProps) {
  return renderMagnetic(DEP, props);
}

/** 4.x also shipped `GlassMagneticButton`: same mapping, its own id
    (REQ-CMP-131: one warning per symbol). */
export function GlassMagneticButton(props: MagneticButtonProps) {
  return renderMagnetic(DEP_GLASS, props);
}
