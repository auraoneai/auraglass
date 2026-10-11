/* LiquidGlassSource — 4.x compat adapter (REQ-SURF-13, DEP-S0025) →
   SourceTransition.Source. id maps 1:1; asChild is dropped (Source accepts a
   render prop instead). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';
import { domProps } from '../_shared';

export interface LiquidGlassSourceProps {
  id: string;
  asChild?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassSource` compat adapter (DEP-S0025).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link SourceTransition.Source from aura-glass}.
 */
export function LiquidGlassSource(props: LiquidGlassSourceProps) {
  warnDeprecated('DEP-S0025');
  const { id, asChild: _asChild, onClick, children, ...rest } = props;
  const { id: _domId, ...attrs } = domProps(rest);
  return (
    <SourceTransition.Source id={id} {...(onClick ? { onClick } : {})} {...attrs}>
      {children}
    </SourceTransition.Source>
  );
}
