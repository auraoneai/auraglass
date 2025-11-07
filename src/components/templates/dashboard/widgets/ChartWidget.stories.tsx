import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartWidget } from './ChartWidget';
import { cn } from '../../../../lib/utils';

const meta: Meta<typeof ChartWidget> = {
  title: 'Components/Widgets/ChartWidget',
  component: ChartWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartwidget component.',
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

export const Default: Story = {
  args: {
    data: {
      title: 'Sample Chart',
      subtitle: 'Monthly data',
      dataPoints: [
        { label: 'Jan', value: 65 },
        { label: 'Feb', value: 59 },
        { label: 'Mar', value: 80 },
        { label: 'Apr', value: 81 },
        { label: 'May', value: 56 },
        { label: 'Jun', value: 55 },
      ],
      summary: {
        total: 396,
        change: 12.5,
        trend: 'up' as const,
      },
    },
    type: 'bar',
    size: 'md',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ChartWidget {...args} type="bar" />
      <ChartWidget {...args} type="line" />
      <ChartWidget {...args} type="pie" />
      <ChartWidget {...args} type="sparkline" />
    </div>
  ),
  args: {
    data: {
      title: 'Chart Variants',
      dataPoints: [
        { label: 'A', value: 45 },
        { label: 'B', value: 67 },
        { label: 'C', value: 23 },
        { label: 'D', value: 89 },
      ],
    },
    size: 'sm',
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
    type: 'bar',
  },
};
