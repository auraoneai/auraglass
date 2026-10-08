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
