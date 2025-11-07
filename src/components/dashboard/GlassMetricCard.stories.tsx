import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMetricCard } from './GlassMetricCard';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMetricCard> = {
  title: 'Components/Dashboard/GlassMetricCard',
  component: GlassMetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmetriccard component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info', 'primary'],
      description: 'Color variant for the card',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size variant',
    },
    title: {
      control: 'text',
      description: 'Metric title/label',
    },
    value: {
      control: 'text',
      description: 'Main metric value',
    },
    trend: {
      control: 'object',
      description: 'Trend information with value, label, and direction',
    },
  },
  args: {
    className: '',
    variant: 'default',
    size: 'md',
    title: 'Active Users',
    value: '1,234',
    trend: {
      value: 8.2,
      label: 'vs last month',
      direction: 'up' as const,
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassMetricCard>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassMetricCard key="default" {...args} variant="default" />
      <GlassMetricCard key="success" {...args} variant="success" />
      <GlassMetricCard key="warning" {...args} variant="warning" />
      <GlassMetricCard key="error" {...args} variant="error" />
    </div>
  ),
};
