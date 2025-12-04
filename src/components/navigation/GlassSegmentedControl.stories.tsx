import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSegmentedControl } from './GlassSegmentedControl';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSegmentedControl> = {
  title: 'Components/Navigation/GlassSegmentedControl',
  component: GlassSegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssegmentedcontrol component.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of segmented control items',
    },
    value: {
      control: 'text',
      description: 'Currently selected item ID',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'Size variant',
    },
    condensed: {
      control: 'boolean',
      description: 'Whether to use condensed layout',
    },
  },
  args: {
    items: [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
      { id: 'option3', label: 'Option 3' }
    ],
    value: 'option1',
    size: 'md',
    condensed: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSegmentedControl>;

export const Default: Story = {
  args: {
    items: [
      { id: 'daily', label: 'Daily' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' }
    ],
    value: 'daily',
  },
};

export const DifferentSizes: Story = {
  render: (args) => (
    <div className="glass-gap-4">
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Small</h3>
        <GlassSegmentedControl {...args} size="sm" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Medium</h3>
        <GlassSegmentedControl {...args} size="md" />
      </div>
      <div>
        <h3 className="glass-text-sm glass-font-semibold glass-mb-2">Large</h3>
        <GlassSegmentedControl {...args} size="lg" />
      </div>
    </div>
  ),
  args: {
    items: [
      { id: 'small', label: 'Small' },
      { id: 'medium', label: 'Medium' },
      { id: 'large', label: 'Large' }
    ],
    value: 'medium',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { id: 'list', label: 'List', icon: '📋' },
      { id: 'grid', label: 'Grid', icon: '📊' },
      { id: 'card', label: 'Card', icon: '🃏' }
    ],
    value: 'list',
  },
};

export const Condensed: Story = {
  args: {
    items: [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
      { id: 'option3', label: 'Option 3' },
      { id: 'option4', label: 'Option 4' }
    ],
    value: 'option1',
    condensed: true,
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 'enabled1', label: 'Enabled' },
      { id: 'disabled', label: 'Disabled', disabled: true },
      { id: 'enabled2', label: 'Enabled' }
    ],
    value: 'enabled1',
  },
};
