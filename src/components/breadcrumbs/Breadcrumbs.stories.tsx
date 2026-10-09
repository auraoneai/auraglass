// Breadcrumbs.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

const defaultChildren = <Breadcrumbs.Root><Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Link href="/lib">Library</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Current>Current</Breadcrumbs.Current></Breadcrumbs.Root>;

const meta: Meta = {
  title: 'surf/breadcrumbs',
  component: Breadcrumbs.Root,
  parameters: { ag: { subject: 'Breadcrumbs', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

const overflowTree = <><Breadcrumbs.Root maxItems={4}><Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Link href="/a">Alpha</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Link href="/b">Beta</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Link href="/c">Gamma</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Current>Current</Breadcrumbs.Current></Breadcrumbs.Root><Breadcrumbs.Ellipsis label="Show 2 more" defaultOpen items={[<Breadcrumbs.Link key="a" href="/a">Alpha</Breadcrumbs.Link>, <Breadcrumbs.Link key="b" href="/b">Beta</Breadcrumbs.Link>]} /></>;

export const Default: Story = { render: () => defaultChildren };
export const Overflow: Story = { render: () => overflowTree };
export const RTL: Story = { render: () => defaultChildren, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => defaultChildren, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => defaultChildren, parameters: { globals: { forcedColors: 'active' } } };
