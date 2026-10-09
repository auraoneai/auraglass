// Tabs.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tabs } from './Tabs';

const defaultChildren = <Tabs.Root defaultValue="a"><Tabs.List><Tabs.Tab value="a">Alpha</Tabs.Tab><Tabs.Tab value="b">Beta</Tabs.Tab><Tabs.Indicator /></Tabs.List><Tabs.Panel value="a">Alpha content</Tabs.Panel><Tabs.Panel value="b">Beta content</Tabs.Panel></Tabs.Root>;

const meta: Meta = {
  title: 'surf/tabs',
  component: Tabs.Root,
  parameters: { ag: { subject: 'Tabs', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { args: { children: defaultChildren } };
export const RTL: Story = { args: { children: defaultChildren }, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { args: { children: defaultChildren }, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { args: { children: defaultChildren }, parameters: { globals: { forcedColors: 'active' } } };
