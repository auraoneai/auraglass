'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface AuroraOrbProps {
  color?: string;
  size?: number;
  className?: string;
}

export function AuroraOrb(props: AuroraOrbProps) {
  warnDeprecated('AuroraOrb');
  void props;
  return <Backdrop preset="aurora" palette="aurora" className={props.className} />;
}
