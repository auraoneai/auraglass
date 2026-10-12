// SidebarDrawer.stories.tsx — SURF story contract (S-41). Sidebar.Drawer is the compact
// mode of the Sidebar flagship (#23), so it sits with it under Flagships/App Shell.
// `id` keeps the published story ids (surf-sidebar-drawer--*).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { Sidebar } from './Sidebar';
import { Menu } from '../components/menu';
import { MenuPortal, MenuPositioner, MenuPopup } from '../components/menu/Menu.client';
import { appShellRoot, setDrawer } from './appShellStore';

const meta: Meta = {
  title: 'Flagships/App Shell/SidebarDrawer',
  id: 'surf-sidebar-drawer',
  component: Sidebar.Drawer,
  parameters: { ag: { subject: 'SidebarDrawer', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

/* Story-only: opens the drawer once on mount through the same store call the
   toggle uses, so the open state is a real drawer, not a forced prop. */
function OpenOnMount() {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  React.useLayoutEffect(() => {
    const root = appShellRoot(ref.current);
    if (root) setDrawer(root, 'open');
  }, []);
  return <span hidden ref={ref} />;
}

const Nav = () => (
  <Sidebar.Nav aria-label="Main">
    <Sidebar.Item href="#home" current>Home</Sidebar.Item>
    <Sidebar.Item href="#library">Library</Sidebar.Item>
  </Sidebar.Nav>
);

/* Compact shell with the drawer open. Sidebar.Root mounts the drawer with the
   same children; the inline sidebar is display:none in compact. */
export const Open: Story = {
  render: () => (
    <AppShell.Root layout="mobile">
      <AppShell.SidebarToggle />
      <Sidebar.Root><Nav /></Sidebar.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
      <OpenOnMount />
    </AppShell.Root>
  ),
};

/* Auto layout (mode from the shell's own width) with the drawer closed: the
   e2e spec opens it with the toggle at 375 and checks the sidebar again at
   1440. The drawer holds a CMP Menu for the stacked-Escape case. */
export const Toggle: Story = {
  render: () => (
    <AppShell.Root persistKey="sidebar-drawer-story">
      <AppShell.SidebarToggle shortcut />
      <Sidebar.Root>
        <Nav />
        <Menu.Root>
          <Menu.Trigger data-testid="drawer-menu">More</Menu.Trigger>
          <MenuPortal>
            <MenuPositioner side="bottom" align="start">
              <MenuPopup data-testid="drawer-menu-popup">
                <Menu.Item>Rename</Menu.Item>
                <Menu.Item>Archive</Menu.Item>
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </Menu.Root>
      </Sidebar.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
    </AppShell.Root>
  ),
};
