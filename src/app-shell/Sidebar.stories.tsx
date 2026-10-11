// Sidebar.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Sidebar } from './Sidebar';


const meta: Meta = {
  title: 'surf/sidebar',
  component: Sidebar.Root,
  parameters: { ag: { subject: 'Sidebar', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home" current>Home</Sidebar.Item><Sidebar.Item href="/lib">Library</Sidebar.Item></Sidebar.Nav></Sidebar.Root> };
export const RTL: Story = { render: () => <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home" current>Home</Sidebar.Item><Sidebar.Item href="/lib">Library</Sidebar.Item></Sidebar.Nav></Sidebar.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home" current>Home</Sidebar.Item><Sidebar.Item href="/lib">Library</Sidebar.Item></Sidebar.Nav></Sidebar.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home" current>Home</Sidebar.Item><Sidebar.Item href="/lib">Library</Sidebar.Item></Sidebar.Nav></Sidebar.Root>, parameters: { globals: { forcedColors: 'active' } } };
/* Every Sidebar region: header, grouped nav with icon/badge, collapsible, separator, footer. */
export const Anatomy: Story = {
  render: () => (
    <Sidebar.Root>
      <Sidebar.Header>Workspace</Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Library</Sidebar.GroupLabel>
          <Sidebar.Nav aria-label="Library">
            <Sidebar.Item href="/inbox" current>
              <Sidebar.ItemIcon>●</Sidebar.ItemIcon>
              Inbox
              <Sidebar.ItemBadge>3</Sidebar.ItemBadge>
            </Sidebar.Item>
            <Sidebar.Collapsible label="Archive" defaultOpen>
              <Sidebar.Item href="/archive/2026">2026</Sidebar.Item>
            </Sidebar.Collapsible>
          </Sidebar.Nav>
        </Sidebar.Group>
        <Sidebar.Separator />
      </Sidebar.Content>
      <Sidebar.Footer>Signed in</Sidebar.Footer>
    </Sidebar.Root>
  ),
};
