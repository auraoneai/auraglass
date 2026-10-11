/* AuroraOrb — 4.x compat adapter (REQ-SURF-13, DEP-S0609) → Backdrop
   preset="aurora". palette maps when it names a 5.0 BackdropPalette
   (aurora/prism/ocean/ember/mono), otherwise 'aurora'; pulse → motion
   "drift". size/glow/tilt are geometry of the 4.x orb with no 5.0
   counterpart. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';
import type { BackdropPalette } from '../../../backdrops/types';

const PALETTES = new Set<BackdropPalette>(['aurora', 'prism', 'ocean', 'ember', 'mono']);

export interface AuroraOrbProps {
  size?: number | string;
  palette?: string;
  pulse?: boolean;
  glow?: 'none' | 'subtle' | 'medium' | 'strong';
  className?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `AuroraOrb` compat adapter (DEP-S0609).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop preset="aurora" from aura-glass/backdrops}.
 */
export function AuroraOrb(props: AuroraOrbProps) {
  warnDeprecated('DEP-S0609');
  const { palette, pulse, className, children } = props;
  const p = palette && PALETTES.has(palette as BackdropPalette) ? (palette as BackdropPalette) : 'aurora';
  return (
    <Backdrop preset="aurora" palette={p} motion={pulse ? 'drift' : 'static'} {...(className ? { className } : {})}>
      {children}
    </Backdrop>
  );
}
