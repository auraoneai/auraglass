import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStepLabel } from './GlassStepLabel';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassStepLabel> = {
  title: 'Components/Input/GlassStepLabel',
  component: GlassStepLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssteplabel component.',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the step',
    },
    active: {
      control: 'boolean',
      description: 'Whether the step is active',
    },
    completed: {
      control: 'boolean',
      description: 'Whether the step is completed',
    },
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      description: 'Orientation of the step label',
    },
  },
  args: {
    label: 'Step Label',
    active: false,
    completed: false,
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof GlassStepLabel>;

export const Default: Story = {
  args: {
    label: 'Step 1',
    active: true,
    completed: false,
    orientation: 'horizontal',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStepLabel {...args} />
      <GlassStepLabel {...args} label="Completed Step" active={false} completed={true} />
      <GlassStepLabel {...args} label="Inactive Step" active={false} completed={false} />
    </div>
  ),
  args: {
    label: 'Active Step',
    active: true,
    completed: false,
    orientation: 'vertical',
  },
};
