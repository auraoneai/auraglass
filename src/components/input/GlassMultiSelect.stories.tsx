import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMultiSelect } from './GlassMultiSelect';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMultiSelect> = {
  title: 'Controls/Inputs/Glass Multi Select',
  component: GlassMultiSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass-styled multi-select component with physics-based animations and advanced filtering.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no options are selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search/filtering functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button to remove all selections',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the component',
    },
    variant: {
      control: { type: 'select' },
      options: ['outlined', 'filled', 'standard'],
      description: 'Visual variant of the component',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the component should take full width',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of selectable items',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    placeholder: 'Select options...',
    disabled: false,
    searchable: true,
    clearable: true,
    size: 'medium',
    variant: 'outlined',
    fullWidth: false,
    maxItems: 5,
    loading: false,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
      { value: 'fig', label: 'Fig' },
      { value: 'grape', label: 'Grape' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassMultiSelect>;

export const Default: Story = {
  args: {
    placeholder: 'Select fruits...',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-2xl">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Outlined</h4>
        <GlassMultiSelect {...args} variant="outlined" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Filled</h4>
        <GlassMultiSelect {...args} variant="filled" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Standard</h4>
        <GlassMultiSelect {...args} variant="standard" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-gap-4 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Small</h4>
        <GlassMultiSelect {...args} size="small" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Medium</h4>
        <GlassMultiSelect {...args} size="medium" />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Large</h4>
        <GlassMultiSelect {...args} size="large" />
      </div>
    </div>
  ),
};

export const WithSelection: Story = {
  args: {
    value: ['apple', 'banana'],
    placeholder: 'Fruits selected',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    placeholder: 'Loading options...',
  },
};
