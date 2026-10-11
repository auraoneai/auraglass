// AppShell.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { AppShell } from './AppShell';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { Inspector } from './Inspector';

const meta: Meta = {
  title: 'surf/app-shell',
  component: AppShell.Root,
  // fullscreen: the shell is 100dvh, so story padding would scroll the document (SURF-19).
  parameters: { layout: 'fullscreen', ag: { subject: 'AppShell', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root> };
export const RTL: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => <AppShell.Root><TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root><Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root><AppShell.Main><p>Content</p></AppShell.Main><StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root></AppShell.Root>, parameters: { globals: { forcedColors: 'active' } } };

const rows = (n: number, label: string) =>
  Array.from({ length: n }, (_, i) => <p key={i}>{`${label} row ${i + 1}`}</p>);

/** SURF-18: SkipLink first, then a focusable top bar control before Main. */
export const SkipLink: Story = {
  render: () => (
    <AppShell.Root>
      <AppShell.SkipLink />
      <TopBar.Root><TopBar.Title>App</TopBar.Title><button type="button">Top action</button></TopBar.Root>
      <Sidebar.Root><Sidebar.Nav aria-label="Main"><Sidebar.Item href="/home">Home</Sidebar.Item></Sidebar.Nav></Sidebar.Root>
      <AppShell.Main><h1>Page</h1><p>Content</p></AppShell.Main>
    </AppShell.Root>
  ),
};

/** SURF-19: Main, Sidebar.Content and Inspector.Content all overflow; only they scroll. */
export const ScrollOwnership: Story = {
  render: () => (
    <AppShell.Root defaultInspector="open">
      <AppShell.SkipLink />
      <TopBar.Root><TopBar.Title>App</TopBar.Title></TopBar.Root>
      <Sidebar.Root><Sidebar.Content>{rows(80, 'Sidebar')}</Sidebar.Content></Sidebar.Root>
      <AppShell.Main>{rows(200, 'Main')}</AppShell.Main>
      <Inspector.Root aria-label="Details"><Inspector.Content>{rows(80, 'Inspector')}</Inspector.Content></Inspector.Root>
      <StatusBar.Root><StatusBar.Item>Ready</StatusBar.Item></StatusBar.Root>
    </AppShell.Root>
  ),
};
