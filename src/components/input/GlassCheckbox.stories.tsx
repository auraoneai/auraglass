import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCheckbox } from './GlassCheckbox';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassCheckbox> = {
  title: 'Components/Input/GlassCheckbox',
  component: GlassCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscheckbox component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
    label: {
      control: 'text',
      description: 'label prop',
    },
    description: {
      control: 'text',
      description: 'description prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
    variant: {
      control: { type: 'select' },
      options: ["default","success","warning","error","info"],
      description: 'variant prop',
    },
  },
  args: {
    className: '',
    disabled: false,
    label: 'Accept terms and conditions',
    description: 'By checking this box, you agree to our terms.',
    size: 'md',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof GlassCheckbox>;

export const Default: Story = {
  args: {
    label: 'Default checkbox',
    description: 'This is a default GlassCheckbox component',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} variant="default" label="Default variant" />
      <GlassCheckbox {...args} variant="success" label="Success variant" />
      <GlassCheckbox {...args} variant="warning" label="Warning variant" />
      <GlassCheckbox {...args} variant="error" label="Error variant" />
      <GlassCheckbox {...args} variant="info" label="Info variant" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} size="sm" label="Small size" />
      <GlassCheckbox {...args} size="md" label="Medium size" />
      <GlassCheckbox {...args} size="lg" label="Large size" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassCheckbox {...args} checked={false} label="Unchecked" />
      <GlassCheckbox {...args} checked={true} label="Checked" />
      <GlassCheckbox {...args} indeterminate label="Indeterminate" />
      <GlassCheckbox {...args} disabled label="Disabled" />
      <GlassCheckbox {...args} disabled checked label="Disabled checked" />
    </div>
  ),
};
