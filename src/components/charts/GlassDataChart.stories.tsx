import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDataChart } from './GlassDataChart';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDataChart> = {
  title: 'Components/Charts/GlassDataChart',
  component: GlassDataChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdatachart component.',
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
type Story = StoryObj<typeof GlassDataChart>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDataChart {...args}>
        Default
      </GlassDataChart>
    </div>
  ),
  args: {
    
  },
};
