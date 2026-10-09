'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

export interface AuroraBackgroundProps {
  motion?: 'none' | 'subtle' | 'full';
  className?: string;
  children?: React.ReactNode;
}

export function AuroraBackground(props: AuroraBackgroundProps) {
  warnDeprecated('DEP-S0608';
  const motion = props.motion === 'full' ? 'drift' : 'static';
  return <Backdrop preset="aurora" palette="aurora" motion={motion} className={props.className}>{props.children}</Backdrop>;
}
