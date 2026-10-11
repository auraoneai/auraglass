/* app-frame (SURF-102, SC-32): the GA application block — AppShell composed
   with sidebar navigation, top bar, status bar and a docked inspector.
   Server-renderable; the drawer/toggle islands light up on hydration. */
import * as React from 'react';
import {
  AppShell,
  Sidebar,
  TopBar,
  StatusBar,
  Inspector,
} from 'aura-glass/app-shell';
import { APP_NAV, APP_TITLE, STATUS_TEXT } from './fixtures';

export function AppFrame({ children }: { children?: React.ReactNode }) {
  return (
    <AppShell.Root>
      <TopBar.Root>
        <TopBar.Leading>
          <AppShell.SidebarToggle />
          <strong>{APP_TITLE}</strong>
        </TopBar.Leading>
        <TopBar.Trailing>
          <AppShell.InspectorToggle />
        </TopBar.Trailing>
      </TopBar.Root>
      <Sidebar.Root labels={{ navigation: 'Primary' }}>
        <Sidebar.Nav aria-label="Primary">
          {APP_NAV.map((item) => (
            <Sidebar.Item key={item.id} href={item.href} current={item.id === 'overview'}>
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.Nav>
      </Sidebar.Root>
      <AppShell.Main>{children}</AppShell.Main>
      <Inspector.Root aria-label="Details">
        <Inspector.Header title="Details" />
        <Inspector.Content>
          <Inspector.Section title="Summary" defaultOpen>
            <p>Select a row to inspect it.</p>
          </Inspector.Section>
        </Inspector.Content>
      </Inspector.Root>
      <StatusBar.Root>{STATUS_TEXT}</StatusBar.Root>
    </AppShell.Root>
  );
}
