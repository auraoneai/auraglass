import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StateIndicator from './StateIndicator';

const meta: Meta<typeof StateIndicator> = {
  title: 'Controls/Inputs/State Indicator',
  component: StateIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism stateindicator component.',
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
type Story = StoryObj<typeof StateIndicator>;

export const Default: Story = {
  render: (args: any) => (
    <StateIndicator
      {...args}
      state="success"
      blend={false}
      intensity={0.9}
      className="glass-rounded-xl glass-border glass-border-slate-300 glass-bg-white glass-p-4 glass-text-slate-950"
    >
      <div className="glass-text-sm glass-font-semibold">Sync complete</div>
      <div className="glass-text-xs glass-text-slate-700">
        Saved 24 component updates.
      </div>
    </StateIndicator>
  ),
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <StateIndicator {...args}>
        Default
      </StateIndicator>
    </div>
  ),
  args: {
    
  },
};
