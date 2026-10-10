// Breadcrumbs.stories.tsx — SURF story contract (S-41): subject = ComponentMeta name,
// kind 'component'; Default + state stories cover the meta's declared states.
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

const defaultChildren = <Breadcrumbs.Root><Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Link href="/lib">Library</Breadcrumbs.Link></Breadcrumbs.Item><Breadcrumbs.Item><Breadcrumbs.Current>Current</Breadcrumbs.Current></Breadcrumbs.Item></Breadcrumbs.Root>;

const meta: Meta = {
  title: 'surf/breadcrumbs',
  component: Breadcrumbs.Root,
  parameters: { ag: { subject: 'Breadcrumbs', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

export const Default: Story = { render: () => defaultChildren };
export const RTL: Story = { render: () => defaultChildren, parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { render: () => defaultChildren, parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { render: () => defaultChildren, parameters: { globals: { forcedColors: 'active' } } };

/* SURF-56: 6 items, maxItems=3 -> 'Show 3 more' overflow menu of links. */
const path = ['/', '/docs', '/docs/guides', '/docs/guides/surf', '/docs/guides/surf/nav'];
export const Overflow: Story = {
  render: () => (
    <Breadcrumbs.Root maxItems={3}>
      {path.map((href, i) => (
        <Breadcrumbs.Item key={href}><Breadcrumbs.Link href={href}>{`Level ${i}`}</Breadcrumbs.Link></Breadcrumbs.Item>
      ))}
      <Breadcrumbs.Item><Breadcrumbs.Current>Here</Breadcrumbs.Current></Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};

/* SURF-57: a 40-character link truncates at 16ch, name stays the full text. */
export const LongLabel: Story = {
  render: () => (
    <Breadcrumbs.Root>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/">Home</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/long">A forty character breadcrumb label here!</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Item><Breadcrumbs.Current>Here</Breadcrumbs.Current></Breadcrumbs.Item>
    </Breadcrumbs.Root>
  ),
};
