// SidebarDrawer.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { Sidebar } from './Sidebar';

const meta: Meta = {
  title: 'surf/sidebar-drawer',
  component: Sidebar.Drawer,
  parameters: { ag: { subject: 'SidebarDrawer', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

/* The drawer only exists in compact/medium shells with the sidebar expanded. */
export const Open: Story = {
  render: () => (
    <AppShell.Root layout="mobile" defaultSidebar="expanded">
      <Sidebar.Drawer>
        <Sidebar.Nav aria-label="Main">
          <Sidebar.Item href="/home" current>Home</Sidebar.Item>
          <Sidebar.Item href="/lib">Library</Sidebar.Item>
        </Sidebar.Nav>
      </Sidebar.Drawer>
    </AppShell.Root>
  ),
};
