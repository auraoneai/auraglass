import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MetricWidget } from './MetricWidget';
import { cn } from '../../../../lib/utils';

const meta: Meta<typeof MetricWidget> = {
  title: 'Components/Widgets/MetricWidget',
  component: MetricWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism metricwidget component.',
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
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <MetricWidget {...args}>
        Default
      </MetricWidget>
    </div>
  ),
  args: {
    
  },
};
