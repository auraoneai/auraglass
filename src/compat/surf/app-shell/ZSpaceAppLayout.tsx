/* ZSpaceAppLayout — 4.x compat adapter (REQ-SURF-13, DEP-S0010) → AppShell
   composition. header → TopBar.Root, sidebar → Sidebar.Root, children →
   AppShell.Main, footer → StatusBar.Root, overlay after Main.
   sidebarPosition → sidebarSide, collapsedSidebar → defaultSidebar='rail'.
   The z-depth/perspective props have no 5.0 meaning and are dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';
import { TopBar } from '../../../app-shell/TopBar';
import { StatusBar } from '../../../app-shell/StatusBar';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps, sideOf } from '../_shared';

export interface ZSpaceAppLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  overlay?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  collapsedSidebar?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `ZSpaceAppLayout` compat adapter (DEP-S0010).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link AppShell composition}.
 */
export function ZSpaceAppLayout(props: ZSpaceAppLayoutProps) {
  warnDeprecated('DEP-S0010');
  const { header, sidebar, footer, overlay, sidebarPosition, collapsedSidebar, children, ...rest } = props;
  return (
    <AppShell.Root
      sidebarSide={sideOf(sidebarPosition)}
      defaultSidebar={collapsedSidebar ? 'rail' : 'expanded'}
      {...domProps(rest)}
    >
      {header != null ? <TopBar.Root>{header}</TopBar.Root> : null}
      {sidebar != null ? <Sidebar.Root>{sidebar}</Sidebar.Root> : null}
      <AppShell.Main>{children}</AppShell.Main>
      {footer != null ? <StatusBar.Root>{footer}</StatusBar.Root> : null}
      {overlay}
    </AppShell.Root>
  );
}
