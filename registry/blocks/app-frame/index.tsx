/* app-frame (SURF-102, SC-32): the GA application block — AppShell composed
   with sidebar navigation, top bar, status bar and a docked inspector.
   Server-renderable; the drawer/toggle islands light up on hydration.
   Every slot defaults to the block fixtures; consumers (showcases, apps)
   pass their own brand, navigation, inspector and status content. */
import * as React from 'react';
import {
  AppShell,
  Sidebar,
  TopBar,
  StatusBar,
  Inspector,
} from 'aura-glass/app-shell';
import { APP_NAV, APP_TITLE, STATUS_TEXT } from './fixtures';

export interface AppFrameNavItem {
  id: string;
  href: string;
  label: React.ReactNode;
}

export interface AppFrameProps {
  children?: React.ReactNode;
  /** Product name in the top bar (defaults to the fixture title). */
  title?: React.ReactNode;
  /** Leading brand mark rendered before the title. */
  brand?: React.ReactNode;
  /** Extra top-bar trailing controls, before the inspector toggle. */
  actions?: React.ReactNode;
  /** Primary navigation (defaults to the fixture nav). */
  nav?: readonly AppFrameNavItem[];
  /** Id of the current nav item. */
  currentNav?: string;
  /** Accessible name of the primary navigation. */
  navLabel?: string;
  /** Inspector title and body (defaults to the fixture summary). */
  inspectorTitle?: string;
  inspector?: React.ReactNode;
  /** Status bar content (defaults to the fixture status text). */
  status?: React.ReactNode;
}

export function AppFrame({
  children,
  title = APP_TITLE,
  brand,
  actions,
  nav = APP_NAV,
  currentNav = 'overview',
  navLabel = 'Primary',
  inspectorTitle = 'Details',
  inspector,
  status = STATUS_TEXT,
}: AppFrameProps) {
  return (
    <AppShell.Root>
      <TopBar.Root>
        <TopBar.Leading>
          <AppShell.SidebarToggle />
          {brand}
          <TopBar.Title>{title}</TopBar.Title>
        </TopBar.Leading>
        <TopBar.Trailing>
          {actions}
          <AppShell.InspectorToggle />
        </TopBar.Trailing>
      </TopBar.Root>
      <Sidebar.Root labels={{ navigation: navLabel }}>
        <Sidebar.Nav aria-label={navLabel}>
          {nav.map((item) => (
            <Sidebar.Item key={item.id} href={item.href} current={item.id === currentNav}>
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>{children}</AppShell.Main>
      <Inspector.Root aria-label={inspectorTitle}>
        <Inspector.Header title={inspectorTitle} />
        <Inspector.Content>
          {inspector ?? (
            <Inspector.Section title="Summary" defaultOpen>
              <p>Select a row to inspect it.</p>
            </Inspector.Section>
          )}
        </Inspector.Content>
      </Inspector.Root>
      <StatusBar.Root>{status}</StatusBar.Root>
    </AppShell.Root>
  );
}
