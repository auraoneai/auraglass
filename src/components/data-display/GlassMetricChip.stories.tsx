import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMetricChip } from './GlassMetricChip';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMetricChip> = {
  title: 'Components/Data-display/GlassMetricChip',
  component: GlassMetricChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmetricchip component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassMetricChip>;

export const Default: Story = {
  args: {
    label: 'Revenue',
    value: '$12,345',
    delta: '+15%',
    intent: 'success',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassMetricChip {...args} />
    </div>
  ),
  args: {
    label: 'Users',
    value: 1234,
  },
};
