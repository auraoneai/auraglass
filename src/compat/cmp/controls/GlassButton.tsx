/* CMP-323 compat: GlassButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Button } from '../../../components/button';
import type { ButtonProps } from '../../../components/button';

const DEP = 'DEP-C0001';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export interface GlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'title' | 'color'> {
  variant?:
    | 'primary' | 'secondary' | 'default' | 'outline' | 'ghost' | 'tertiary'
    | 'link' | 'gradient' | 'aurora' | 'success' | 'warning' | 'danger'
    | 'destructive' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
  glassVariant?: string;
  material?: string;
  materialProps?: Record<string, unknown>;
  /** speculative 4.x props — dropped with one warning each */
  predictive?: unknown;
  eyeTracking?: unknown;
  adaptive?: unknown;
  spatialAudio?: unknown;
  trackAchievements?: unknown;
  usageContext?: unknown;
  children?: React.ReactNode;
}

const SIZE_MAP = { xs: 'sm', xl: 'lg' } as const;

/** @deprecated GlassButton DEP-C0001 since 4.3.0, removed in 5.0.0. {@link Button} */
export function GlassButton(props: GlassButtonProps) {
  warnDeprecated(DEP);
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
