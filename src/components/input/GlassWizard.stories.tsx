import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassWizard } from './GlassWizard';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassWizard> = {
  title: 'Controls/Inputs/Glass Wizard',
  component: GlassWizard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasswizard component.',
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
type Story = StoryObj<typeof GlassWizard>;

export const Default: Story = {
  args: {
    steps: [
      { id: 'welcome', title: 'Welcome', content: 'Welcome to the wizard!' },
      { id: 'setup', title: 'Setup', content: 'Configure your settings' },
      { id: 'complete', title: 'Complete', content: 'You\'re all set!' }
    ],
    currentStep: 0,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassWizard {...args} />
    </div>
  ),
  args: {
    steps: [
      { id: 'step1', title: 'Step 1', content: 'First step' },
      { id: 'step2', title: 'Step 2', content: 'Second step' }
    ],
    currentStep: 1,
  },
};
