import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAvatar } from './GlassAvatar';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAvatar> = {
  title: 'Components/Data-display/GlassAvatar',
  component: GlassAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassavatar component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'circle', 'square', 'glass-radius-md'],
      description: 'Avatar variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Avatar size',
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy'],
      description: 'Status indicator',
    },
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for image',
    },
  },
  args: {
    className: '',
    variant: 'circle',
    size: 'md',
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    alt: 'User avatar',
  },
};

export default meta;
type Story = StoryObj<typeof GlassAvatar>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <GlassAvatar {...args} size="sm" status="online" />
      <GlassAvatar {...args} size="md" status="away" />
      <GlassAvatar {...args} size="lg" status="busy" />
      <GlassAvatar {...args} size="xl" status="offline" />
    </div>
  ),
};
