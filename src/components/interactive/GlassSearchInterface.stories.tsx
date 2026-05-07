import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSearchInterface } from './GlassSearchInterface';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassSearchInterface> = {
  title: 'Effects + Advanced/Glass Search Interface',
  component: GlassSearchInterface,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssearchinterface component.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Search placeholder text',
    },
    value: {
      control: 'text',
      description: 'Search input value',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    emptyMessage: {
      control: 'text',
      description: 'Empty state message',
    },
  },
  args: {
    placeholder: 'Search for anything...',
    value: '',
    loading: false,
    emptyMessage: 'No results found',
  },
};

export default meta;
type Story = StoryObj<typeof GlassSearchInterface>;

export const Default: Story = {
  args: {
    onChange: fn(),
    onSearch: fn(),
  },
};

export const WithResults: Story = {
  args: {
    results: [
      {
        id: '1',
        title: 'Getting Started Guide',
        description: 'Learn the basics of our platform',
        category: 'Documentation',
      },
      {
        id: '2',
        title: 'API Reference',
        description: 'Complete API documentation',
        category: 'Documentation',
      },
      {
        id: '3',
        title: 'User Settings',
        description: 'Manage your account preferences',
        category: 'Settings',
      },
    ],
    onChange: fn(),
    onSearch: fn(),
  },
};

export const WithFilters: Story = {
  args: {
    filters: {
      type: [
        { id: 'docs', label: 'Documentation', value: 'docs', count: 25 },
        { id: 'api', label: 'API', value: 'api', count: 12 },
        { id: 'settings', label: 'Settings', value: 'settings', count: 8 },
      ],
      status: [
        { id: 'active', label: 'Active', value: 'active', count: 30 },
        { id: 'draft', label: 'Draft', value: 'draft', count: 15 },
      ],
    },
    onChange: fn(),
    onSearch: fn(),
    onFiltersChange: fn(),
  },
};
