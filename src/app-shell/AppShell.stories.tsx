// AppShell.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';

const meta: Meta = {
  title: 'surf/app-shell',
  component: AppShell.Root,
  parameters: { ag: { subject: 'AppShell', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root> };
export const RTL: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { forcedColors: 'active' } } };
