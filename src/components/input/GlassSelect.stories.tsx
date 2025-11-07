import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSelect } from './GlassSelect';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSelect> = {
  title: 'Components/Input/GlassSelect',
  component: GlassSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassselect component.',
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
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
    variant: {
      control: { type: 'select' },
      options: ["default","filled","outlined","minimal"],
      description: 'variant prop',
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
    placeholder: 'Select an option...',
    size: 'md',
    variant: 'default',
    state: 'default',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassSelect>;

export const Default: Story = {
  args: {
    placeholder: 'Select a fruit...',
    options: [
      { value: 'apple', label: '🍎 Apple' },
      { value: 'banana', label: '🍌 Banana' },
      { value: 'cherry', label: '🍒 Cherry' },
      { value: 'grape', label: '🍇 Grape' },
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-md">
      <GlassSelect {...args} variant="default" placeholder="Default variant" />
      <GlassSelect {...args} variant="filled" placeholder="Filled variant" />
      <GlassSelect {...args} variant="outlined" placeholder="Outlined variant" />
      <GlassSelect {...args} variant="minimal" placeholder="Minimal variant" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-md">
      <GlassSelect {...args} state="default" placeholder="Default state" />
      <GlassSelect {...args} state="success" placeholder="Success state" />
      <GlassSelect {...args} state="warning" placeholder="Warning state" />
      <GlassSelect {...args} state="error" placeholder="Error state" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-md">
      <GlassSelect {...args} size="sm" placeholder="Small size" />
      <GlassSelect {...args} size="md" placeholder="Medium size" />
      <GlassSelect {...args} size="lg" placeholder="Large size" />
    </div>
  ),
};
