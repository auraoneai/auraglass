import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFormStepper } from './GlassFormStepper';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassFormStepper> = {
  title: 'Components/Input/GlassFormStepper',
  component: GlassFormStepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassformstepper component.',
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
type Story = StoryObj<typeof GlassFormStepper>;

export const Default: Story = {
  args: {
    steps: [
      { id: 'personal', title: 'Personal Info', completed: true },
      { id: 'address', title: 'Address', completed: false },
      { id: 'payment', title: 'Payment', completed: false }
    ],
    currentStep: 1,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassFormStepper {...args} />
    </div>
  ),
  args: {
    steps: [
      { id: 'step1', title: 'Step 1', completed: true },
      { id: 'step2', title: 'Step 2', completed: true },
      { id: 'step3', title: 'Step 3', completed: false }
    ],
    currentStep: 2,
  },
};
