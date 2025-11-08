import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMultiStepForm } from './GlassMultiStepForm';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMultiStepForm> = {
  title: 'Components/Input/GlassMultiStepForm',
  component: GlassMultiStepForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmultistepform component.',
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
type Story = StoryObj<typeof GlassMultiStepForm>;

// Simple form components for stories
const PersonalInfoStep = () => (
  <div className="gap-4">
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">First Name</label>
      <input className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">Last Name</label>
      <input className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
  </div>
);

const ContactDetailsStep = () => (
  <div className="gap-4">
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">Email</label>
      <input type="email" className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">Phone</label>
      <input type="tel" className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
  </div>
);

export const Default: Story = {
  args: {
    steps: [
      {
        id: 'personal',
        title: 'Personal Information',
        component: PersonalInfoStep
      },
      {
        id: 'contact',
        title: 'Contact Details',
        component: ContactDetailsStep
      }
    ],
  },
};

const Step1Component = () => (
  <div className="gap-4">
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">Name</label>
      <input className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
  </div>
);

const Step2Component = () => (
  <div className="gap-4">
    <div>
      <label className="block text-sm font-medium text-primary/80 mb-1">Email</label>
      <input type="email" className="w-full px-3 py-2 glass-surface-subtle/10 border border-white/20 glass-radius-lg text-primary glass-touch-target glass-contrast-guard" />
    </div>
  </div>
);

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassMultiStepForm {...args} />
    </div>
  ),
  args: {
    steps: [
      {
        id: 'step1',
        title: 'Step 1',
        component: Step1Component
      },
      {
        id: 'step2',
        title: 'Step 2',
        component: Step2Component
      }
    ],
  },
};
