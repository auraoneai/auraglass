'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface AuroraOrbProps {
  color?: string;
  size?: number;
  className?: string;
}

export function AuroraOrb(props: AuroraOrbProps) {
  warnDeprecated('DEP-S0609';
  void props;
  return <Backdrop preset="aurora" palette="aurora" className={props.className} />;
}
