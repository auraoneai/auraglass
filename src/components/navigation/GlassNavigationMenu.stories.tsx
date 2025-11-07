import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassNavigationMenu } from './GlassNavigationMenu';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassNavigationMenu> = {
  title: 'Components/Navigation/GlassNavigationMenu',
  component: GlassNavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassnavigationmenu component.',
      },
    },
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of navigation items',
    },
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      description: 'Menu orientation',
    },
    variant: {
      control: { type: 'select', options: ['default', 'sidebar', 'header'] },
      description: 'Menu variant',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'Size variant',
    },
    activeItem: {
      control: 'text',
      description: 'Active item ID',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether menu is collapsed',
    },
  },
  args: {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        href: '/dashboard',
        description: 'Overview and analytics',
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        href: '/projects',
        badge: 3,
        children: [
          {
            id: 'projects-active',
            label: 'Active Projects',
            href: '/projects/active',
            badge: 2,
          },
          {
            id: 'projects-completed',
            label: 'Completed',
            href: '/projects/completed',
            badge: 1,
          },
        ],
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: '📈',
        href: '/analytics',
        featured: true,
      },
    ],
    orientation: 'vertical',
    variant: 'default',
    size: 'md',
    activeItem: 'dashboard',
    collapsed: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassNavigationMenu>;

export const Default: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', icon: '🏠', href: '/' },
      { id: 'about', label: 'About', icon: 'ℹ️', href: '/about' },
      { id: 'contact', label: 'Contact', icon: '📞', href: '/contact' },
    ],
    activeItem: 'home',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
        <GlassNavigationMenu {...args} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Sidebar Variant</h3>
        <GlassNavigationMenu {...args} variant="sidebar" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Header Variant</h3>
        <GlassNavigationMenu {...args} variant="header" orientation="horizontal" />
      </div>
    </div>
  ),
  args: {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'users', label: 'Users', icon: '👥' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeItem: 'dashboard',
  },
};

export const WithNestedItems: Story = {
  args: {
    items: [
      {
        id: 'products',
        label: 'Products',
        icon: '📦',
        children: [
          { id: 'products-all', label: 'All Products', href: '/products' },
          { id: 'products-new', label: 'Add New', href: '/products/new' },
          { id: 'products-categories', label: 'Categories', href: '/products/categories' },
        ],
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: '🛒',
        badge: 5,
        children: [
          { id: 'orders-pending', label: 'Pending', badge: 3, href: '/orders/pending' },
          { id: 'orders-completed', label: 'Completed', badge: 12, href: '/orders/completed' },
        ],
      },
      { id: 'reports', label: 'Reports', icon: '📈', featured: true },
    ],
    activeItem: 'products',
  },
};

export const Collapsed: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', icon: '🏠' },
      { id: 'search', label: 'Search', icon: '🔍' },
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    activeItem: 'home',
    collapsed: true,
  },
};
