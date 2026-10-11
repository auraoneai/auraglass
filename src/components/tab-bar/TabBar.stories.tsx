// TabBar.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TabBar } from './TabBar';
import { AppShell } from '../../app-shell/AppShell';

const defaultChildren = <TabBar.Root aria-label="Primary"><TabBar.Item href="/home" current>Home</TabBar.Item><TabBar.Item href="/search">Search</TabBar.Item><TabBar.Item href="/library">Library</TabBar.Item></TabBar.Root>;

const meta: Meta = {
  title: 'surf/tab-bar',
  component: TabBar.Root,
  parameters: { ag: { subject: 'TabBar', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { args: { children: defaultChildren } };
export const RTL: Story = { args: { children: defaultChildren }, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { args: { children: defaultChildren }, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { args: { children: defaultChildren }, parameters: { globals: { forcedColors: 'active' } } };

const items = (
  <>
    <TabBar.Item href="/home" current>Home</TabBar.Item>
    <TabBar.Item href="/search">Search</TabBar.Item>
    <TabBar.Item href="/library">Library</TabBar.Item>
  </>
);
const filler = Array.from({ length: 60 }, (_, i) => <p key={i}>{`Row ${i + 1}`}</p>);

/* SURF-54: labels minimize with scroll (CSS scroll-timeline on the page). */
export const MinimizeOnScroll: Story = {
  render: () => (
    <div>
      {filler}
      <div style={{ position: 'sticky', insetBlockEnd: 0 }}>
        <TabBar.Root aria-label="Primary" minimizeOnScroll>
          {items}
          <TabBar.Accessory>Now playing</TabBar.Accessory>
        </TabBar.Root>
      </div>
    </div>
  ),
};

/* SURF-52/54: the bar appearance lives only in compact shells; floating stays. */
export const InShellBar: Story = {
  render: () => (
    <AppShell.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
      <TabBar.Root aria-label="Primary">{items}</TabBar.Root>
    </AppShell.Root>
  ),
};
export const InShellFloating: Story = {
  render: () => (
    <AppShell.Root>
      <AppShell.Main><p>Content</p></AppShell.Main>
      <TabBar.Root aria-label="Primary" appearance="floating">{items}</TabBar.Root>
    </AppShell.Root>
  ),
};
