import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStatCard } from './GlassStatCard';
import { cn } from '../../lib/utils';
import { TrendingUp, Users, DollarSign } from "@/icons";

const meta: Meta<typeof GlassStatCard> = {
  title: 'Reference/Legacy Components/Glass Stat Card',
  component: GlassStatCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glassmorphism statistics card with trend indicators, progress bars, and additional metrics.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Statistic title/label',
    },
    value: {
      control: 'text',
      description: 'Main statistic value',
    },
    unit: {
      control: 'text',
      description: 'Statistic unit (e.g., $, %, users)',
    },
    description: {
      control: 'text',
      description: 'Statistic description/subtitle',
    },
    type: {
      control: { type: 'select' },
      options: ['revenue', 'users', 'conversion', 'performance', 'growth', 'target', 'activity', 'analytics', 'custom'],
      description: 'Statistic type for automatic icon',
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
    layout: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical', 'compact'],
      description: 'Layout variant',
    },
    showSparkline: {
      control: 'boolean',
      description: 'Show sparkline or mini chart',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Progress value (0-100)',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    className: {
      control: 'text',
      description: 'Custom className',
    },
  },
  args: {
    title: 'Total Revenue',
    value: '$45,231',
    unit: '',
    description: 'Monthly recurring revenue',
    type: 'revenue',
    variant: 'default',
    size: 'md',
    layout: 'vertical',
    showSparkline: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassStatCard>;

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,231',
    unit: '.23',
    description: 'Monthly recurring revenue',
    type: 'revenue',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 lg:glass-glass-grid-cols-3 glass-gap-6">
      <GlassStatCard
        {...args}
        variant="default"
        title="Default Variant"
        value="1,234"
        type="users"
      />
      <GlassStatCard
        {...args}
        variant="success"
        title="Success Variant"
        value="89%"
        type="conversion"
      />
      <GlassStatCard
        {...args}
        variant="warning"
        title="Warning Variant"
        value="67"
        type="performance"
      />
      <GlassStatCard
        {...args}
        variant="error"
        title="Error Variant"
        value="23"
        type="target"
      />
      <GlassStatCard
        {...args}
        variant="info"
        title="Info Variant"
        value="156"
        type="activity"
      />
      <GlassStatCard
        {...args}
        variant="primary"
        title="Primary Variant"
        value="$12,345"
        type="revenue"
      />
    </div>
  ),
};

export const WithTrend: Story = {
  args: {
    title: 'Monthly Growth',
    value: '23.5%',
    description: 'Compared to last month',
    type: 'growth',
    trend: {
      value: 12.3,
      label: 'vs last month',
      direction: 'up',
    },
    showSparkline: true,
    sparklineData: [20, 35, 25, 45, 30, 55, 40, 65, 50, 70, 60, 75],
  },
};

export const WithProgress: Story = {
  args: {
    title: 'Project Completion',
    value: '78%',
    description: 'Q4 2024 Goals',
    type: 'target',
    progress: 78,
    additionalStats: [
      { label: 'Tasks Completed', value: 23 },
      { label: 'Hours Logged', value: 156 },
      { label: 'Team Members', value: 8 },
    ],
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6">
      <GlassStatCard {...args} size="sm" title="Small Size" value="1.2K" />
      <GlassStatCard {...args} size="md" title="Medium Size" value="2.4K" />
      <GlassStatCard {...args} size="lg" title="Large Size" value="5.8K" />
      <GlassStatCard {...args} size="xl" title="Extra Large Size" value="12.3K" />
    </div>
  ),
  args: {
    type: 'users',
    description: 'Active users this month',
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading State',
    value: '$0',
    loading: true,
    type: 'revenue',
  },
};
