/* CMP-323 compat: GlassButton (4.x) -> Button (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { GlassButtonMapped } from './_glassButtonMapping';

const DEP = 'DEP-C0001';

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
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  glassVariant?: string;
  /** @deprecated since 4.3.0, removed in 5.0.0. Use {@link 'prominent'}. */
  material?: string;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  materialProps?: Record<string, unknown>;
  /**
   * speculative 4.x props — dropped with one warning each
   * @deprecated since 4.2.0, removed in 5.0.0.
   */
  predictive?: unknown;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  eyeTracking?: unknown;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  adaptive?: unknown;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  spatialAudio?: unknown;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  trackAchievements?: unknown;
  /** @deprecated since 4.2.0, removed in 5.0.0. */
  usageContext?: unknown;
  children?: React.ReactNode;
}

/** @deprecated since 4.3.0, removed in 6.0.0. Use {@link Button}. */
export function GlassButton(props: GlassButtonProps) {
  warnDeprecated(DEP);
  return <GlassButtonMapped dep={DEP} {...props} />;
}
