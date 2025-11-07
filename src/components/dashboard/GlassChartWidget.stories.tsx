import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart3, LineChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlassChartWidget } from './GlassChartWidget';

const meta: Meta<typeof GlassChartWidget> = {
  title: 'Components/Dashboard/GlassChartWidget',
  component: GlassChartWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasschartwidget component.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Widget title',
    },
    subtitle: {
      control: 'text',
      description: 'Widget subtitle',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Widget size',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    showActions: {
      control: 'boolean',
      description: 'Show actions menu',
    },
  },
  args: {
    title: 'Chart Widget',
    subtitle: 'Sample chart data',
    size: 'md',
    loading: false,
    showActions: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassChartWidget>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <div className="text-center text-primary/80">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>Sample chart content would go here</p>
        </div>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <GlassChartWidget {...args} size="sm" />
      <GlassChartWidget {...args} size="lg" />
    </div>
  ),
  args: {
    children: (
      <div className="p-2">
        <div className="text-center text-primary/60 text-sm">
          <LineChart className="w-8 h-8 mx-auto mb-2" />
          <p>Chart variants</p>
        </div>
      </div>
    ),
  },
};
