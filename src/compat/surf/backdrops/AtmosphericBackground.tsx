'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

/* variant/weather/colorScheme have no 5.0 counterpart — the preset choice is
 * the replacement (TODO documented in the migration row). */
export interface AtmosphericBackgroundProps {
  variant?: string;
  weather?: string;
  colorScheme?: 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

/** @deprecated AtmosphericBackground DEP-S0610 since 4.2.0, removed in 6.0.0. {@link Backdrop presets from aura-glass/backdrops} */
export function AtmosphericBackground(props: AtmosphericBackgroundProps) {
  warnDeprecated('DEP-S0610');
  const scheme = props.colorScheme === 'dark' ? 'dark' : 'light';
  return <Backdrop preset="aurora" scheme={scheme} className={props.className}>{props.children}</Backdrop>;
}
