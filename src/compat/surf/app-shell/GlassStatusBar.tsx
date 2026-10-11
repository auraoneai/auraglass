/* GlassStatusBar — 4.x compat adapter (REQ-SURF-13, DEP-S0007) →
   StatusBar.Root. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { StatusBar } from '../../../app-shell/StatusBar';
import { domProps } from '../_shared';

export interface GlassStatusBarProps {
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassStatusBar` compat adapter (DEP-S0007).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link StatusBar from aura-glass/app-shell}.
 */
export function GlassStatusBar(props: GlassStatusBarProps) {
  warnDeprecated('DEP-S0007');
  const { children, ...rest } = props;
  return <StatusBar.Root {...domProps(rest)}>{children}</StatusBar.Root>;
}
