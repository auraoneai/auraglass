import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassKPICard } from './GlassKPICard';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassKPICard> = {
  title: 'Components/Dashboard/GlassKPICard',
  component: GlassKPICard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasskpicard component.',
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
      description: 'KPI title/label',
    },
    value: {
      control: 'text',
      description: 'Main KPI value',
    },
    trend: {
      control: { type: 'select' },
      options: ['up', 'down', 'neutral', 'none'],
      description: 'Trend direction',
    },
  },
  args: {
    className: '',
    variant: 'default',
    size: 'md',
    title: 'Revenue',
    value: '$125,430',
    trend: 'up',
    trendPercentage: 12.5,
  },
};

export default meta;
type Story = StoryObj<typeof GlassKPICard>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassKPICard key="default" {...args} variant="default" />
      <GlassKPICard key="success" {...args} variant="success" />
      <GlassKPICard key="warning" {...args} variant="warning" />
      <GlassKPICard key="error" {...args} variant="error" />
    </div>
  ),
};
