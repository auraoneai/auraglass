/* GlassMain — 4.x compat adapter (REQ-SURF-13, DEP-S0005) → AppShell.Main
   (the page scroll container and skip-link target). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';
import { domProps } from '../_shared';

export interface GlassMainProps {
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassMain` compat adapter (DEP-S0005).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link AppShell.Main from aura-glass/app-shell}.
 */
export function GlassMain(props: GlassMainProps) {
  warnDeprecated('DEP-S0005');
  const { children, ...rest } = props;
  return <AppShell.Main {...domProps(rest)}>{children}</AppShell.Main>;
}
