/* GlassMobileShell — 4.x `aura-glass/app-shell` compat adapter (REQ-SURF-13,
   DEP-S0009) → MobileShell. 4.x topBar/bottomBar map to topBar/tabBar
   (`tabBar` is also accepted). */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { MobileShell } from '../../../app-shell/MobileShell';
import { domProps } from '../_shared';

export interface GlassMobileShellProps {
  topBar?: React.ReactNode;
  bottomBar?: React.ReactNode;
  tabBar?: React.ReactNode;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassMobileShell` compat adapter (DEP-S0009).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link MobileShell from aura-glass/app-shell}.
 */
export function GlassMobileShell(props: GlassMobileShellProps) {
  warnDeprecated('DEP-S0009');
  const { topBar, bottomBar, tabBar, children, ...rest } = props;
  const bottom = bottomBar ?? tabBar;
  return (
    <MobileShell
      {...(topBar !== undefined ? { topBar } : {})}
      {...(bottom !== undefined ? { tabBar: bottom } : {})}
      {...domProps(rest)}
    >
      {children}
    </MobileShell>
  );
}
