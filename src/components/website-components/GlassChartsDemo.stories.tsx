import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassChartsDemo } from './GlassChartsDemo';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassChartsDemo> = {
  title: 'Reference/Legacy Components/Glass Charts Demo',
  component: GlassChartsDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasschartsdemo component.',
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
type Story = StoryObj<typeof GlassChartsDemo>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassChartsDemo {...args}>
        Default
      </GlassChartsDemo>
    </div>
  ),
  args: {
    
  },
};
