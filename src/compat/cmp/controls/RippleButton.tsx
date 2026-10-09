/* CMP-323 compat: RippleButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButton } from './GlassButton';
import type { GlassButtonProps } from './GlassButton';

const DEP = 'DEP-C0004';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface RippleButtonProps extends GlassButtonProps {
  ripple?: unknown;
  rippleColor?: string;
}

/** @deprecated RippleButton DEP-C0004 since 4.3.0, removed in 5.0.0. {@link Button} */
export function RippleButton({ ripple, rippleColor, ...rest }: RippleButtonProps) {
  warnDeprecated(DEP);
  if (ripple !== undefined) drop('ripple');
  if (rippleColor !== undefined) drop('rippleColor');
  return <GlassButton {...rest} />;
}
