import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../../../src/components/progress';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Progress',
  component: Progress,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Progress', kind: 'component' } },
} satisfies Meta<typeof Progress>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Progress', id: 'core-progress--default' } },
  render: () => (
    <Progress value={40} label="Loading" showValue />
  ),
};

export const Indeterminate: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Progress', id: 'core-progress--indeterminate' } },
  render: () => (
    <Progress value={null} label="Working" />
  ),
};

export const Ring: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Progress', id: 'core-progress--ring' } },
  render: () => (
    <Progress appearance="ring" value={70} showValue label="Ring" />
  ),
};

