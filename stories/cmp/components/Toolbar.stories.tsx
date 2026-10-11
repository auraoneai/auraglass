import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Toolbar } from '../../../src/components/toolbar';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Flagships/Controls/Toolbar',
  component: Toolbar.Root,
  tags: ['certified', 'flagship'],
  parameters: { ag: { tier: 'standard', subject: 'Toolbar', kind: 'component' } },
  args: { 'aria-label': 'Formatting' },
} satisfies Meta<typeof Toolbar.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const I = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <text x="2" y="12" fontSize="12" fill="currentColor">{d}</text>
  </svg>
);

export const Default: Story = {
  args: { 'aria-label': 'Toolbar' },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.IconButton label="Undo" icon={<I d="↩" />} />
      <Toolbar.Separator />
      <Toolbar.Link href="/docs">Docs</Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const Overview: Story = {
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button>Bold</Toolbar.Button>
      <Toolbar.Button>Italic</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Group>
        <Toolbar.IconButton label="Undo" icon={<I d="↩" />} />
        <Toolbar.IconButton label="Redo" icon={<I d="↪" />} />
      </Toolbar.Group>
      <Toolbar.Link href="/docs">Docs</Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const Vertical: Story = {
  args: { 'aria-label': 'Tools' },
  render: () => (
    <Toolbar.Root aria-label="Tools" orientation="vertical">
      <Toolbar.IconButton label="Select" icon={<I d="V" />} />
      <Toolbar.IconButton label="Move" icon={<I d="M" />} />
    </Toolbar.Root>
  ),
};
