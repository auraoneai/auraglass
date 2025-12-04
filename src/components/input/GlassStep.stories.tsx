import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStep } from './GlassStep';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassStep> = {
  title: 'Components/Input/GlassStep',
  component: GlassStep,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassstep component.',
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
type Story = StoryObj<typeof GlassStep>;

export const Default: Story = {
  args: {
    step: {
      id: 'step1',
      title: 'Step 1',
      description: 'First step in the process',
      completed: false,
      active: true
    },
    index: 0,
    active: true,
    completed: false,
    orientation: 'horizontal'
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStep {...args} />
    </div>
  ),
  args: {
    step: {
      id: 'completed-step',
      title: 'Completed Step',
      description: 'This step is done',
      completed: true
    },
    index: 1,
    active: false,
    completed: true,
    orientation: 'horizontal'
  },
};
