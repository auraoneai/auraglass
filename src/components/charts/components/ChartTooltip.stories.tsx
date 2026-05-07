import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartTooltip } from './ChartTooltip';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartTooltip> = {
  title: 'Data + Visualization/Chart Tooltip',
  component: ChartTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism charttooltip component.',
      },
    },
  },
  argTypes: {
    qualityTier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Quality tier',
    },
    tooltipStyle: {
      control: { type: 'select' },
      options: ['frosted', 'minimal', 'detailed'],
      description: 'Tooltip style',
    },
    followCursor: {
      control: 'boolean',
      description: 'Follow cursor',
    },
  },
  args: {
    qualityTier: 'medium',
    tooltipStyle: 'frosted',
    followCursor: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChartTooltip>;

export const Default: Story = {
  args: {
    tooltipData: {
      datasetIndex: 0,
      dataIndex: 0,
      x: 100,
      y: 150,
      value: {
        dataset: 'Revenue',
        label: 'January',
        value: 12500,
        color: 'var(--glass-color-primary)',
      },
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-8">
      <ChartTooltip {...args} tooltipStyle="frosted" />
      <ChartTooltip {...args} tooltipStyle="minimal" />
      <ChartTooltip {...args} tooltipStyle="detailed" />
    </div>
  ),
  args: {
    tooltipData: {
      datasetIndex: 0,
      dataIndex: 1,
      x: 200,
      y: 120,
      value: {
        dataset: 'Profit',
        label: 'February',
        value: 8750,
        color: 'var(--glass-color-success)',
      },
    },
  },
};
