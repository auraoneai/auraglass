import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartAxis } from './ChartAxis';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartAxis> = {
  title: 'Components/Charts/ChartAxis',
  component: ChartAxis,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chart axis component.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Axis orientation',
    },
    show: {
      control: 'boolean',
      description: 'Show the axis',
    },
    showLabels: {
      control: 'boolean',
      description: 'Show axis labels',
    },
    showTicks: {
      control: 'boolean',
      description: 'Show tick marks',
    },
    label: {
      control: 'text',
      description: 'Axis label text',
    },
  },
  args: {
    orientation: 'horizontal',
    show: true,
    showLabels: true,
    showTicks: true,
  },
};

export default meta;
type Story = StoryObj<typeof ChartAxis>;

export const Default: Story = {
  args: {
    label: 'X Axis',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div style={{ position: 'relative', width: '400px', height: '100px' }}>
        <ChartAxis {...args} orientation="horizontal" label="Horizontal Axis" />
      </div>
      <div style={{ position: 'relative', width: '100px', height: '300px' }}>
        <ChartAxis {...args} orientation="vertical" label="Vertical Axis" />
      </div>
    </div>
  ),
};
