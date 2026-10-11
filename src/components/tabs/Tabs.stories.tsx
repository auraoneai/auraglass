// Tabs.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Tabs } from './Tabs';

const defaultChildren = <Tabs.Root defaultValue="a"><Tabs.List><Tabs.Tab value="a">Alpha</Tabs.Tab><Tabs.Tab value="b">Beta</Tabs.Tab><Tabs.Tab value="c">Gamma</Tabs.Tab><Tabs.Indicator /></Tabs.List><Tabs.Panel value="a">Alpha content</Tabs.Panel><Tabs.Panel value="b">Beta content</Tabs.Panel><Tabs.Panel value="c">Gamma content</Tabs.Panel></Tabs.Root>;

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

/* SURF-50: a list that overflows a 320px viewport (edge mask + scrollIntoView). */
const many = ['Overview', 'Activity', 'Settings', 'Members', 'Billing', 'Integrations', 'Security', 'Audit log'];
export const Overflow: Story = {
  render: () => (
    <Tabs.Root defaultValue="Overview">
      <Tabs.List>
        {many.map((t) => <Tabs.Tab key={t} value={t}>{t}</Tabs.Tab>)}
        <Tabs.Indicator />
      </Tabs.List>
      {many.map((t) => <Tabs.Panel key={t} value={t}>{`${t} content`}</Tabs.Panel>)}
    </Tabs.Root>
  ),
};
