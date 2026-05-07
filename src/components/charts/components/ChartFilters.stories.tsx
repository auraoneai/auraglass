import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartFilters } from './ChartFilters';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartFilters> = {
  title: 'Data + Visualization/Chart Filters',
  component: ChartFilters,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartfilters component.',
      },
    },
  },
  argTypes: {
    qualityTier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Quality tier for filter effects',
    },
  },
  args: {
    qualityTier: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof ChartFilters>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4">
      <div>Quality: Low</div>
      <ChartFilters {...args} qualityTier="low" />
      <div>Quality: Medium</div>
      <ChartFilters {...args} qualityTier="medium" />
      <div>Quality: High</div>
      <ChartFilters {...args} qualityTier="high" />
    </div>
  ),
};
