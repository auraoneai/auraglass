/* AtmosphericBackground — 4.x compat adapter (REQ-SURF-13, DEP-S0610) →
   Backdrop preset="aurora". colorScheme → scheme; animate → motion "drift".
   variant/weather/intensity have no 5.0 counterpart — the preset choice is
   the replacement (TODO documented in the migration row). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface AtmosphericBackgroundProps {
  variant?: string;
  intensity?: number;
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `AtmosphericBackground` compat adapter (DEP-S0610).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Backdrop presets from aura-glass/backdrops}.
 */
export function AtmosphericBackground(props: AtmosphericBackgroundProps) {
  warnDeprecated('DEP-S0610');
  const { animate, colorScheme, className, children } = props;
  return (
    <Backdrop
      preset="aurora"
      scheme={colorScheme === 'dark' ? 'dark' : 'light'}
      motion={animate ? 'drift' : 'static'}
      {...(className ? { className } : {})}
    >
      {children}
    </Backdrop>
  );
}
