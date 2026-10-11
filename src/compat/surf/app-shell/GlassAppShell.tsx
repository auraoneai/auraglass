/* GlassAppShell — 4.x compat adapter (REQ-SURF-13, DEP-S0001). Covers both 4.x
   exports: the root `aura-glass` GlassAppShell (header/sidebar/footer,
   defaultCollapsed) and the `aura-glass/app-shell` one (topBar/sidebar/
   actionBar/statusBar, sidebarPlacement). Slots are wrapped in the 5.0 parts:
   header/topBar → TopBar.Root, sidebar → Sidebar.Root, children (+actionBar)
   → AppShell.Main, footer/statusBar → StatusBar.Root. sidebarPlacement maps to
   sidebarSide; collapsed/defaultCollapsed map to defaultSidebar='rail'. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AppShell } from '../../../app-shell/AppShell';
import { TopBar } from '../../../app-shell/TopBar';
import { StatusBar } from '../../../app-shell/StatusBar';
import { Sidebar } from '../../../app-shell/Sidebar';
import { domProps, sideOf } from '../_shared';

export interface GlassAppShellProps {
  header?: React.ReactNode;
  topBar?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  statusBar?: React.ReactNode;
  actionBar?: React.ReactNode;
  sidebarPlacement?: 'left' | 'right';
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassAppShell` compat adapter (DEP-S0001).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link AppShell from aura-glass/app-shell}.
 */
export function GlassAppShell(props: GlassAppShellProps) {
  warnDeprecated('DEP-S0001');
  const {
    header, topBar, sidebar, footer, statusBar, actionBar,
    sidebarPlacement, collapsed, defaultCollapsed, children, ...rest
  } = props;
  const top = header ?? topBar;
  const bottom = footer ?? statusBar;
  return (
    <AppShell.Root
      sidebarSide={sideOf(sidebarPlacement)}
      defaultSidebar={collapsed || defaultCollapsed ? 'rail' : 'expanded'}
      {...domProps(rest)}
    >
      {top != null ? <TopBar.Root>{top}</TopBar.Root> : null}
      {sidebar != null ? <Sidebar.Root>{sidebar}</Sidebar.Root> : null}
      <AppShell.Main>
        {actionBar}
        {children}
      </AppShell.Main>
      {bottom != null ? <StatusBar.Root>{bottom}</StatusBar.Root> : null}
    </AppShell.Root>
  );
}
