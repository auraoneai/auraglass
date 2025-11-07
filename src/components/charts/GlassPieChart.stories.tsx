import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassPieChart } from './GlassPieChart';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassPieChart> = {
  title: 'Components/Charts/GlassPieChart',
  component: GlassPieChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasspiechart component.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassPieChart>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassPieChart {...args}>
        Default
      </GlassPieChart>
    </div>
  ),
  args: {
    
  },
};
