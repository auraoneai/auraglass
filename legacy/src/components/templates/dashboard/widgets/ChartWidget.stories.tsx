import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartWidget } from './ChartWidget';

const meta: Meta<typeof ChartWidget> = {
  title: 'Workflows/Chart Widget',
  component: ChartWidget,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Chart widget with realistic timeseries data and bounded panel sizing.',
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
type Story = StoryObj<typeof ChartWidget>;

const revenueData = {
  title: 'Revenue trend',
  subtitle: 'Last six weeks',
  dataPoints: [
    { label: 'W1', value: 42 },
    { label: 'W2', value: 58 },
    { label: 'W3', value: 51 },
    { label: 'W4', value: 68 },
    { label: 'W5', value: 73 },
    { label: 'W6', value: 86 },
  ],
  summary: {
    total: 378,
    change: 18.4,
    trend: 'up' as const,
  },
};

export const Default: Story = {
  args: {
    data: revenueData,
    type: 'bar',
    size: 'lg',
    colorScheme: 'primary',
    showLegend: true,
    showGrid: true,
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-grid glass-w-[960px] glass-grid-cols-2 glass-gap-4">
      {['bar', 'line'].map((type) => (
        <ChartWidget
          key={type}
          {...args}
          data={{
            ...revenueData,
            title: type === 'bar' ? 'Acquisition' : 'Retention',
          }}
          type={type as any}
          colorScheme={type === 'bar' ? 'success' : 'primary'}
        />
      ))}
    </div>
  ),
  args: {
    data: revenueData,
    size: 'md',
  },
};

export const EmptyData: Story = {
  args: {
    data: {
      title: 'Empty Chart',
      dataPoints: [],
    },
    type: 'bar',
  },
};

export const NoData: Story = {
  args: {
    data: {
      title: 'No Data',
      dataPoints: [],
    },
    type: 'bar',
  },
};
