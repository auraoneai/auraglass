// TabBar.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TabBar } from './TabBar';

const defaultChildren = <TabBar.Root><TabBar.Item href="/home" current>Home</TabBar.Item><TabBar.Item href="/search">Search</TabBar.Item><TabBar.Item href="/library">Library</TabBar.Item></TabBar.Root>;

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
