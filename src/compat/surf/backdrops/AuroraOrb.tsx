'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface AuroraOrbProps {
  color?: string;
  size?: number;
  className?: string;
}

/** @deprecated AuroraOrb DEP-S0609 since 4.2.0, removed in 6.0.0. {@link Backdrop preset="aurora" from aura-glass/backdrops} */
export function AuroraOrb(props: AuroraOrbProps) {
  warnDeprecated('DEP-S0609';
  void props;
  return <Backdrop preset="aurora" palette="aurora" className={props.className} />;
}
