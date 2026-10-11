/* LiquidGlassTransitionProvider — 4.x compat adapter (REQ-SURF-13,
   DEP-S0024) → SourceTransition.Root. `disabled` keeps the 4.x opt-out by
   rendering children without a transition root; namespace/duration have no
   5.0 equivalent (motion timing is token-owned). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { SourceTransition } from '../../../components/source-transition/SourceTransition';

export interface LiquidGlassTransitionProviderProps {
  disabled?: boolean;
  namespace?: string;
  duration?: number;
  children?: React.ReactNode;
}

/**
 * 4.x `LiquidGlassTransitionProvider` compat adapter (DEP-S0024).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link SourceTransition from aura-glass}.
 */
export function LiquidGlassTransitionProvider(props: LiquidGlassTransitionProviderProps) {
  warnDeprecated('DEP-S0024');
  const { disabled = false, children } = props;
  if (disabled) return <>{children}</>;
  return <SourceTransition.Root>{children}</SourceTransition.Root>;
}
