import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAlert } from './GlassAlert';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAlert> = {
  title: 'Components/Data-display/GlassAlert',
  component: GlassAlert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassalert component.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info', 'destructive'],
      description: 'Alert variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Alert size',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show default icon',
    },
  },
  args: {
    variant: 'info',
    size: 'md',
    dismissible: false,
    showIcon: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassAlert>;

export const Default: Story = {
  args: {
    children: 'This is a sample alert message with important information.',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <GlassAlert {...args} variant="info">
        This is an info alert
      </GlassAlert>
      <GlassAlert {...args} variant="success">
        This is a success alert
      </GlassAlert>
      <GlassAlert {...args} variant="warning">
        This is a warning alert
      </GlassAlert>
      <GlassAlert {...args} variant="error">
        This is an error alert
      </GlassAlert>
    </div>
  ),
};
