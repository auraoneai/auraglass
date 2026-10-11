import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '../../../src/components/separator';
import type { StoryAgParameters } from '../../../src/contracts/testing';

const sbMeta = {
  title: 'Core/Separator',
  component: Separator,
  tags: ['certified'],
  parameters: { ag: { tier: 'standard', subject: 'Separator', kind: 'component' } },
} satisfies Meta<typeof Separator>;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

export const Default: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Separator', id: 'core-separator--default' } },
  render: () => (
    <Separator />
  ),
};

export const Vertical: Story = {
  parameters: { ag: { tier: 'standard', subject: 'Separator', id: 'core-separator--vertical' } },
  render: () => (
    <Separator orientation="vertical" decorative />
  ),
};

