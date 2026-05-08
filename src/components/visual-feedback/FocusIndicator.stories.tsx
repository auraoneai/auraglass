import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FocusIndicator from './FocusIndicator';

const meta: Meta<typeof FocusIndicator> = {
  title: 'Controls/Inputs/Focus Indicator',
  component: FocusIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism focusindicator component.',
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
type Story = StoryObj<typeof FocusIndicator>;

export const Default: Story = {
  render: (args: any) => (
    <FocusIndicator
      {...args}
      visible
      style="glow"
      thickness={4}
      className="glass-rounded-lg"
    >
      <button className="glass-rounded-lg glass-bg-slate-900 glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-text-white">
        Focus target
      </button>
    </FocusIndicator>
  ),
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <FocusIndicator {...args}>
        Default
      </FocusIndicator>
    </div>
  ),
  args: {
    
  },
};
