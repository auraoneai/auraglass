/* AuroraBackground — 4.x compat adapter (REQ-SURF-13, DEP-S0608) → Backdrop
   preset="aurora". palette (when a 5.0 BackdropPalette), grain and fixed map
   1:1; motion 'full' → motion "drift", 'none'/'subtle' or reducedMotion →
   "static". Particles move to the labs ParticleField; vignette/intensity/
   seed have no 5.0 counterpart. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';
import type { BackdropPalette } from '../../../backdrops/types';

const PALETTES = new Set<BackdropPalette>(['aurora', 'prism', 'ocean', 'ember', 'mono']);

export interface AuroraBackgroundProps {
  palette?: string;
  motion?: 'none' | 'subtle' | 'full';
  grain?: boolean;
  fixed?: boolean;
  reducedMotion?: boolean;
  className?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `AuroraBackground` compat adapter (DEP-S0608).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop preset="aurora" from aura-glass/backdrops}.
 */
export function AuroraBackground(props: AuroraBackgroundProps) {
  warnDeprecated('DEP-S0608');
  const { palette, motion, grain, fixed, reducedMotion, className, children } = props;
  const p = palette && PALETTES.has(palette as BackdropPalette) ? (palette as BackdropPalette) : 'aurora';
  return (
    <Backdrop
      preset="aurora"
      palette={p}
      motion={motion === 'full' && !reducedMotion ? 'drift' : 'static'}
      {...(grain !== undefined ? { grain } : {})}
      {...(fixed !== undefined ? { fixed } : {})}
      {...(className ? { className } : {})}
    >
      {children}
    </Backdrop>
  );
}
