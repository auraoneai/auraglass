'use client';
import { warnDeprecated } from '../../../internal';
import { Backdrop } from '../../../backdrops/Backdrop';

/* colors[] are not carried over (TODO in the migration row); mesh is the
 * 5.0 preset. */
export interface GlassMeshGradientProps {
  colors?: string[];
  animate?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function GlassMeshGradient(props: GlassMeshGradientProps) {
  warnDeprecated('GlassMeshGradient');
  return (
    <Backdrop preset="mesh" motion={props.animate ? 'drift' : 'static'} className={props.className}>
      {props.children}
    </Backdrop>
  );
}
