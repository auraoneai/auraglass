import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HeaderUserMenu } from './HeaderUserMenu';

const user = {
  id: 'user1',
  name: 'Maya Chen',
  email: 'maya.chen@example.com',
  avatar: '',
  status: 'online' as const,
};

const menuItems = [
  { id: 'profile', label: 'Profile', icon: 'P' },
  { id: 'settings', label: 'Settings', icon: 'S' },
  { id: 'logout', label: 'Logout', icon: 'L', variant: 'danger' as const },
];

const meta: Meta<typeof HeaderUserMenu> = {
  title: 'Navigation/Header User Menu',
  component: HeaderUserMenu,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Header user menu trigger shown in realistic glass app headers.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: {
    user,
    items: menuItems,
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof HeaderUserMenu>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <header
      className="glass-flex glass-w-full glass-max-w-3xl glass-items-center glass-justify-between glass-gap-4 glass-rounded-2xl glass-p-4 glass-shadow-xl"
      style={{ width: '100%', maxWidth: 760, background: 'rgba(255,255,255,0.86)', color: '#0f172a' }}
    >
      <div className="glass-min-w-0">
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
          Account
        </p>
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">Workspace header</h3>
      </div>
      <HeaderUserMenu {...args} />
    </header>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, boxSizing: 'border-box' }}>
    <div className="glass-grid glass-w-full glass-max-w-4xl glass-grid-cols-1 glass-gap-4 sm:glass-grid-cols-3" style={{ width: '100%', maxWidth: 920 }}>
      {[
        { name: 'Maya Chen', status: 'online' as const },
        { name: 'Noah Patel', status: 'away' as const },
        { name: 'Iris Stone', status: 'busy' as const },
      ].map((variantUser) => (
        <header key={variantUser.name} className="glass-flex glass-items-center glass-justify-between glass-rounded-2xl glass-p-4 glass-shadow-lg" style={{ background: 'rgba(255,255,255,0.86)', color: '#0f172a' }}>
          <span className="glass-text-sm glass-font-medium glass-text-primary">{variantUser.name}</span>
          <HeaderUserMenu {...args} user={{ ...user, ...variantUser }} />
        </header>
      ))}
    </div>
    </div>
  ),
};
