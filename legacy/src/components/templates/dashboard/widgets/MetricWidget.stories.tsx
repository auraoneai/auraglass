import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricWidget } from './MetricWidget';

const meta: Meta<typeof MetricWidget> = {
  title: 'Workflows/Metric Widget',
  component: MetricWidget,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Metric widget shown with real values, trend, and target progress.',
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
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof MetricWidget>;

export const Default: Story = {
  args: {
    data: {
      label: 'Monthly revenue',
      value: '$128.4k',
      change: 12.8,
      changeLabel: 'vs last month',
      trend: 'up',
      target: 150000,
      description: 'Booked recurring revenue',
    },
    variant: 'featured',
    size: 'lg',
    colorScheme: 'primary',
    showTrend: true,
    showTarget: true,
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-grid glass-w-[900px] glass-grid-cols-3 glass-gap-4">
      {[
        { label: 'Conversion', value: '8.7%', change: 1.4, trend: 'up', colorScheme: 'success' },
        { label: 'Open risk', value: '14', change: -3, trend: 'down', colorScheme: 'warning' },
        { label: 'Latency', value: '124ms', change: -18, trend: 'down', colorScheme: 'primary' },
      ].map((metric) => (
        <MetricWidget
          key={metric.label}
          {...args}
          data={{
            label: metric.label,
            value: metric.value,
            change: metric.change,
            changeLabel: 'period delta',
            trend: metric.trend as any,
            target: 100,
          }}
          colorScheme={metric.colorScheme as any}
          showTarget
        />
      ))}
    </div>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
};
