/* GlassMeshGradient — 4.x compat adapter (REQ-SURF-13, DEP-S0613) →
   Backdrop preset="mesh". animate (default true in 4.x) → motion "drift";
   variant 'dark' → scheme "dark". colors/points/speed/blur/opacity are
   canvas parameters with no 5.0 counterpart (TODO in the migration row). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface GlassMeshGradientProps {
  colors?: string[];
  animate?: boolean;
  variant?: 'ambient' | 'vibrant' | 'subtle' | 'dark';
  className?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassMeshGradient` compat adapter (DEP-S0613).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop preset="mesh" from aura-glass/backdrops}.
 */
export function GlassMeshGradient(props: GlassMeshGradientProps) {
  warnDeprecated('DEP-S0613');
  const { animate = true, variant, className, children } = props;
  return (
    <Backdrop
      preset="mesh"
      motion={animate ? 'drift' : 'static'}
      {...(variant === 'dark' ? { scheme: 'dark' as const } : {})}
      {...(className ? { className } : {})}
    >
      {children}
    </Backdrop>
  );
}
