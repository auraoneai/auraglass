import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSidebar } from './GlassSidebar';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSidebar> = {
  title: 'Components/Navigation/GlassSidebar',
  component: GlassSidebar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssidebar component.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Navigation items array',
    },
    activeId: {
      control: 'text',
      description: 'Currently active item ID',
    },
    variant: {
      control: { type: 'select', options: ['default', 'compact', 'floating', 'overlay'] },
      description: 'Sidebar variant',
    },
    width: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
      description: 'Sidebar width',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether sidebar is collapsed',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether sidebar is collapsible',
    },
  },
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'projects', label: 'Projects', icon: '📁', badge: 3 },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeId: 'dashboard',
    variant: 'default',
    width: 'md',
    collapsed: false,
    collapsible: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSidebar>;

export const Default: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'projects', label: 'Projects', icon: '📁', badge: 5 },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeId: 'dashboard',
    header: <div className="glass-text-lg glass-font-bold">My App</div>,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-h-96">
      <div className="glass-w-64">
        <GlassSidebar {...args} variant="default" />
      </div>
      <div className="glass-w-64 glass-ml-4">
        <GlassSidebar {...args} variant="compact" />
      </div>
      <div className="glass-w-64 glass-ml-4">
        <GlassSidebar {...args} variant="floating" />
      </div>
    </div>
  ),
  args: {
    items: [
      { id: 'home', label: 'Home', icon: '🏠' },
      { id: 'search', label: 'Search', icon: '🔍' },
      { id: 'profile', label: 'Profile', icon: '👤' },
    ],
    activeId: 'home',
    collapsed: false,
  },
};

export const WithNestedItems: Story = {
  args: {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        children: [
          { id: 'overview', label: 'Overview' },
          { id: 'reports', label: 'Reports' },
        ]
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        badge: 3,
        children: [
          { id: 'active', label: 'Active', badge: 2 },
          { id: 'completed', label: 'Completed', badge: 1 },
        ]
      },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeId: 'dashboard',
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'projects', label: 'Projects', icon: '📁', badge: 3 },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeId: 'dashboard',
    collapsed: true,
    collapsible: true,
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'projects', label: 'Projects', icon: '📁' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    activeId: 'dashboard',
    header: (
      <div className="glass-flex glass-items-center glass-gap-2">
        <div className="glass-w-8 glass-h-8 glass-surface-primary glass-radius-lg glass-flex glass-items-center glass-justify-center">
          <span className="glass-text-primary glass-font-bold">A</span>
        </div>
        <div>
          <h3 className="glass-font-semibold">Aura Glass</h3>
          <p className="glass-text-xs glass-text-secondary">v1.0.0</p>
        </div>
      </div>
    ),
    footer: (
      <div className="glass-text-xs glass-text-secondary">
        © 2024 Aura Glass
      </div>
    ),
  },
};
