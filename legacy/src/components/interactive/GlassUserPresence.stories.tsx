import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassUserPresence } from './GlassUserPresence';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassUserPresence> = {
  title: 'Effects + Advanced/Glass User Presence',
  component: GlassUserPresence,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassuserpresence component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    showOnlineCount: {
      control: 'boolean',
      description: 'Show online count',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode',
    },
    showRoles: {
      control: 'boolean',
      description: 'Show user roles',
    },
  },
  args: {
    className: '',
    showOnlineCount: true,
    compact: false,
    showRoles: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassUserPresence>;

export const Default: Story = {
  args: {
    users: [
      { id: '1', name: 'Alice Johnson', status: 'online', role: 'admin' },
      { id: '2', name: 'Bob Smith', status: 'online', role: 'member' },
      { id: '3', name: 'Charlie Brown', status: 'away', role: 'member' },
      { id: '4', name: 'Diana Prince', status: 'offline', role: 'member' },
    ],
    currentUser: { id: '1', name: 'Alice Johnson', status: 'online', role: 'admin' },
    onUserClick: fn(),
  },
};

export const CompactMode: Story = {
  args: {
    compact: true,
    users: [
      { id: '1', name: 'Alice', status: 'online', role: 'admin' },
      { id: '2', name: 'Bob', status: 'online', role: 'member' },
      { id: '3', name: 'Charlie', status: 'busy', role: 'member' },
      { id: '4', name: 'Diana', status: 'away', role: 'member' },
      { id: '5', name: 'Eve', status: 'offline', role: 'guest' },
    ],
    onUserClick: fn(),
  },
};
