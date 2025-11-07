import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBadge } from './GlassBadge';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBadge> = {
  title: 'Components/Data-display/GlassBadge',
  component: GlassBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbadge component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'outline', 'ghost'],
      description: 'Badge variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Badge size',
    },
  },
  args: {
    className: '',
    children: 'Badge',
    variant: 'primary',
    size: 'sm',
  },
};

export default meta;
type Story = StoryObj<typeof GlassBadge>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4 items-center">
      <GlassBadge {...args} variant="primary">Primary</GlassBadge>
      <GlassBadge {...args} variant="secondary">Secondary</GlassBadge>
      <GlassBadge {...args} variant="success">Success</GlassBadge>
      <GlassBadge {...args} variant="warning">Warning</GlassBadge>
      <GlassBadge {...args} variant="error">Error</GlassBadge>
    </div>
  ),
};
