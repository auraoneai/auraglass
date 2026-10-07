import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import VisualFeedback from './VisualFeedback';

const meta: Meta<typeof VisualFeedback> = {
  title: 'Controls/Inputs/Visual Feedback',
  component: VisualFeedback,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism visualfeedback component.',
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
type Story = StoryObj<typeof VisualFeedback>;

export const Default: Story = {
  render: (args: any) => (
    <VisualFeedback
      {...args}
      active
      effect="glow"
      glass
      className="glass-rounded-xl glass-border glass-border-slate-300 glass-bg-white glass-p-4 glass-text-slate-950"
    >
      <div className="glass-text-sm glass-font-semibold">Feedback preview</div>
      <div className="glass-text-xs glass-text-slate-700">
        Glow and glass overlay are visible.
      </div>
    </VisualFeedback>
  ),
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <VisualFeedback {...args}>
        Default
      </VisualFeedback>
    </div>
  ),
  args: {
    
  },
};
