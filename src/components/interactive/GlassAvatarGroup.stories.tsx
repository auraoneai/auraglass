import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAvatarGroup } from './GlassAvatarGroup';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAvatarGroup> = {
  title: 'Components/Interactive/GlassAvatarGroup',
  component: GlassAvatarGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassavatargroup component.',
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
type Story = StoryObj<typeof GlassAvatarGroup>;

export const Default: Story = {
  args: {
    users: [
      { name: 'Alice Johnson', status: 'online' },
      { name: 'Bob Smith', status: 'away' },
      { name: 'Carol Davis', status: 'busy' },
      { name: 'David Wilson', status: 'offline' },
      { name: 'Eve Brown', status: 'online' },
      { name: 'Frank Miller', status: 'away' }
    ],
    max: 5,
    size: 'md',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAvatarGroup {...args} />
    </div>
  ),
  args: {
    users: [
      { name: 'User 1', status: 'online' },
      { name: 'User 2', status: 'online' },
      { name: 'User 3', status: 'online' }
    ],
    max: 3,
    size: 'sm',
  },
};
