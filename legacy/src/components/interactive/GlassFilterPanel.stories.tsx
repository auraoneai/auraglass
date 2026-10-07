import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFilterPanel } from './GlassFilterPanel';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassFilterPanel> = {
  title: 'Effects + Advanced/Glass Filter Panel',
  component: GlassFilterPanel,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'A glass morphism glassfilterpanel component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-overflow-auto glass-p-8"
        style={{ boxSizing: 'border-box' }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    filters: {
      control: 'object',
      description: 'Array of filter groups',
    },
    values: {
      control: 'object',
      description: 'Current filter values',
    },
    title: {
      control: 'text',
      description: 'Panel title',
    },
    showSearch: {
      control: 'boolean',
      description: 'Whether to show search input',
    },
    showPresets: {
      control: 'boolean',
      description: 'Whether to show filter presets',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Whether to show apply button',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'minimal'],
      description: 'Component variant',
    },
  },
  args: {
    filters: [
      {
        id: 'category',
        label: 'Category',
        type: 'checkbox',
        options: [
          { id: 'electronics', label: 'Electronics', value: 'electronics', count: 25 },
          { id: 'clothing', label: 'Clothing', value: 'clothing', count: 18 },
          { id: 'books', label: 'Books', value: 'books', count: 12 },
        ],
      },
      {
        id: 'price',
        label: 'Price Range',
        type: 'slider',
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        id: 'brand',
        label: 'Brand',
        type: 'select',
        options: [
          { id: 'apple', label: 'Apple', value: 'apple' },
          { id: 'samsung', label: 'Samsung', value: 'samsung' },
          { id: 'google', label: 'Google', value: 'google' },
        ],
      },
    ],
    values: {},
    title: 'Product Filters',
    showSearch: true,
    showPresets: true,
    showApplyButton: true,
    variant: 'default',
    onChange: fn(),
    onApply: fn(),
    onClear: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassFilterPanel>;

export const Default: Story = {
  args: {
    filters: [
      {
        id: 'status',
        label: 'Status',
        type: 'checkbox',
        options: [
          { id: 'active', label: 'Active', value: 'active', count: 15 },
          { id: 'inactive', label: 'Inactive', value: 'inactive', count: 8 },
          { id: 'pending', label: 'Pending', value: 'pending', count: 5 },
        ],
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        options: [
          { id: 'low', label: 'Low', value: 'low' },
          { id: 'medium', label: 'Medium', value: 'medium' },
          { id: 'high', label: 'High', value: 'high' },
        ],
      },
    ],
    values: {},
    title: 'Task Filters',
    onChange: fn(),
    onApply: fn(),
    onClear: fn(),
  },
};

export const Variants: Story = {
  args: {
    filters: [
      {
        id: 'dateRange',
        label: 'Date Range',
        type: 'daterange',
        placeholder: 'Select date range',
      },
    ],
    values: {},
    title: 'Date Filters',
    variant: 'compact',
    showSearch: false,
    onChange: fn(),
    onApply: fn(),
    onClear: fn(),
  },
};
