import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassWizardTemplate } from './GlassWizardTemplate';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof GlassWizardTemplate> = {
  title: 'Components/Forms/GlassWizardTemplate',
  component: GlassWizardTemplate,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasswizardtemplate component.',
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
type Story = StoryObj<typeof GlassWizardTemplate>;

// Sample wizard steps for stories
const sampleSteps = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Please provide your basic personal information.',
    schema: [
      {
        type: 'text',
        name: 'firstName',
        label: 'First Name',
        required: true,
        placeholder: 'Enter your first name',
      },
      {
        type: 'text',
        name: 'lastName',
        label: 'Last Name',
        required: true,
        placeholder: 'Enter your last name',
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email Address',
        required: true,
        placeholder: 'Enter your email address',
      },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Tell us about your preferences.',
    schema: [
      {
        type: 'select',
        name: 'theme',
        label: 'Preferred Theme',
        options: [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'auto', label: 'Auto' },
        ],
        required: true,
      },
      {
        type: 'checkbox',
        name: 'notifications',
        label: 'Enable Notifications',
        required: false,
      },
    ],
    optional: true,
    canSkip: true,
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Please review and confirm your information.',
    schema: [],
    component: (
      <div className="glass-text-center glass-py-8">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-4">Ready to Complete Setup</h3>
        <p className="glass-text-secondary">
          Please review your information and click Finish to complete the setup.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    title: 'Setup Wizard',
    description: 'Complete your account setup with this guided wizard.',
    steps: sampleSteps,
    currentStep: 0,
    values: {},
    showStepIndicator: true,
    allowSkipping: true,
    layout: 'default',
  },
};

export const Compact: Story = {
  args: {
    title: 'Compact Wizard',
    description: 'A more compact wizard layout.',
    steps: sampleSteps,
    currentStep: 0,
    values: {},
    showStepIndicator: true,
    allowSkipping: true,
    layout: 'compact',
  },
};

export const Sidebar: Story = {
  args: {
    title: 'Wizard with Sidebar',
    description: 'Wizard with sidebar navigation.',
    steps: sampleSteps,
    currentStep: 1,
    values: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    showStepIndicator: true,
    allowSkipping: true,
    layout: 'sidebar',
  },
};
