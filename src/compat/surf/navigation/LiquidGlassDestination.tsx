/* LiquidGlassDestination — 4.x compat adapter (REQ-SURF-13, DEP-S0026) →
   SourceTransition.Destination. id maps 1:1; open={false} renders nothing,
   as in 4.x. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';
import { domProps } from '../_shared';

export interface LiquidGlassDestinationProps {
  id: string;
  open?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassDestination` compat adapter (DEP-S0026).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link SourceTransition.Destination from aura-glass}.
 */
export function LiquidGlassDestination(props: LiquidGlassDestinationProps) {
  warnDeprecated('DEP-S0026');
  const { id, open = true, children, ...rest } = props;
  if (!open) return null;
  const { id: _domId, ...attrs } = domProps(rest);
  return (
    <SourceTransition.Destination id={id} {...attrs}>
      {children}
    </SourceTransition.Destination>
  );
}
