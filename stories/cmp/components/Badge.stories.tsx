import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../../src/components/badge';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Badge', kind: 'component' } },
} satisfies Meta<typeof Badge>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Badge', id: 'core-badge--default' } },
  render: () => (
    <Badge intent="info">New</Badge>
  ),
};

export const Intents: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Badge', id: 'core-badge--intents' } },
  render: () => (
    <div>
      <Badge intent="neutral">N</Badge><Badge intent="success">S</Badge>
      <Badge intent="warning">W</Badge><Badge intent="danger">D</Badge>
    </div>
  ),
};

export const Count: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Badge', id: 'core-badge--count' } },
  render: () => (
    <Badge count={120} max={99} label="notifications" />
  ),
};

