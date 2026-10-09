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

/** @deprecated GlassMeshGradient DEP-S0613 since 4.2.0, removed in 6.0.0. {@link Backdrop preset="mesh" from aura-glass/backdrops} */
export function GlassMeshGradient(props: GlassMeshGradientProps) {
  warnDeprecated('DEP-S0613';
  return (
    <Backdrop preset="mesh" motion={props.animate ? 'drift' : 'static'} className={props.className}>
      {props.children}
    </Backdrop>
  );
}
