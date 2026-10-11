import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from '../../../src/components/collapsible';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Collapsible',
  component: Collapsible.Root,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Collapsible', kind: 'component' } },
} satisfies Meta<typeof Collapsible.Root>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Collapsible', id: 'core-collapsible--default' } },
  render: () => (
    <Collapsible.Root defaultOpen>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Panel</Collapsible.Content>
    </Collapsible.Root>
  ),
};
export const Closed: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Collapsible', id: 'core-collapsible--closed' } },
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>Panel</Collapsible.Content>
    </Collapsible.Root>
  ),
};
