import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../../src/components/skeleton';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Skeleton',
  component: Skeleton,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Skeleton', kind: 'component' } },
} satisfies Meta<typeof Skeleton>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Skeleton', id: 'core-skeleton--default' } },
  render: () => (
    <Skeleton shape="rect" style={{ width: 200, height: 24 }} />
  ),
};

export const Lines: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Skeleton', id: 'core-skeleton--lines' } },
  render: () => (
    <Skeleton shape="text" lines={3} style={{ width: 240 }} />
  ),
};

export const Circle: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Skeleton', id: 'core-skeleton--circle' } },
  render: () => (
    <Skeleton shape="circle" style={{ width: 40, height: 40 }} />
  ),
};

