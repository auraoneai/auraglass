import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTextarea } from './GlassTextarea';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassTextarea> = {
  title: 'Components/Input/GlassTextarea',
  component: GlassTextarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasstextarea component.',
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
    placeholder: {
      control: 'text',
      description: 'placeholder prop',
    },
    value: {
      control: 'text',
      description: 'value prop',
    },
    variant: {
      control: { type: 'select' },
      options: ["default","filled","outlined","minimal"],
      description: 'variant prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
    state: {
      control: { type: 'select' },
      options: ["default","error","warning","success"],
      description: 'state prop',
    },
  },
  args: {
    className: '',
    disabled: false,
    placeholder: 'Enter your text here...',
    value: '',
    variant: 'default',
    size: 'md',
    state: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof GlassTextarea>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your text here...',
    value: 'This is the default GlassTextarea component with some sample text to demonstrate the glass morphism styling.',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} variant="default" placeholder="Default variant" />
      <GlassTextarea {...args} variant="filled" placeholder="Filled variant" />
      <GlassTextarea {...args} variant="outlined" placeholder="Outlined variant" />
      <GlassTextarea {...args} variant="minimal" placeholder="Minimal variant" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} state="default" placeholder="Default state" />
      <GlassTextarea {...args} state="success" placeholder="Success state" />
      <GlassTextarea {...args} state="warning" placeholder="Warning state" />
      <GlassTextarea {...args} state="error" placeholder="Error state" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} size="sm" placeholder="Small size" />
      <GlassTextarea {...args} size="md" placeholder="Medium size" />
      <GlassTextarea {...args} size="lg" placeholder="Large size" />
    </div>
  ),
};

export const WithFeatures: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 max-w-md">
      <GlassTextarea {...args} label="With Label" placeholder="Textarea with label" />
      <GlassTextarea {...args} showCharCount maxLength={100} placeholder="With character count" />
      <GlassTextarea {...args} helperText="This is helper text" placeholder="With helper text" />
      <GlassTextarea {...args} errorText="This field is required" placeholder="With error text" />
    </div>
  ),
};
