import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartLegend } from './ChartLegend';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartLegend> = {
  title: 'Components/Components/ChartLegend',
  component: ChartLegend,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartlegend component.',
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Legend position',
    },
    style: {
      control: { type: 'select' },
      options: ['default', 'compact', 'minimal'],
      description: 'Legend style',
    },
    glassEffect: {
      control: 'boolean',
      description: 'Enable glass effect',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactivity',
    },
  },
  args: {
    position: 'top',
    style: 'default',
    glassEffect: true,
    interactive: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChartLegend>;

export const Default: Story = {
  args: {
    datasets: [
      { label: 'Dataset 1', color: 'var(--glass-color-primary)' },
      { label: 'Dataset 2', color: 'var(--glass-color-danger)' },
      { label: 'Dataset 3', color: 'var(--glass-color-success)' },
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <ChartLegend {...args} position="top" style="default" />
      <ChartLegend {...args} position="bottom" style="compact" />
      <ChartLegend {...args} position="left" style="minimal" />
    </div>
  ),
  args: {
    datasets: [
      { label: 'Revenue', color: 'var(--glass-color-primary)' },
      { label: 'Profit', color: 'var(--glass-color-success)' },
      { label: 'Expenses', color: 'var(--glass-color-danger)' },
    ],
  },
};
