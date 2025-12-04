import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HeaderUserMenu } from './HeaderUserMenu';
import { cn } from '../../lib/utils';

const meta: Meta<typeof HeaderUserMenu> = {
  title: 'Components/Navigation/HeaderUserMenu',
  component: HeaderUserMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism headerusermenu component.',
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
type Story = StoryObj<typeof HeaderUserMenu>;

export const Default: Story = {
  args: {
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
      status: 'online',
    },
    items: [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'logout', label: 'Logout', icon: '🚪', variant: 'danger' },
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <HeaderUserMenu {...args} />
    </div>
  ),
  args: {
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '',
      status: 'online',
    },
    items: [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
  },
};
