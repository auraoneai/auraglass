import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAdvancedSearch } from './GlassAdvancedSearch';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAdvancedSearch> = {
  title: 'Components/Interactive/GlassAdvancedSearch',
  component: GlassAdvancedSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassadvancedsearch component.',
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
type Story = StoryObj<typeof GlassAdvancedSearch>;

export const Default: Story = {
  args: {
    placeholder: 'Search for documents, images, or users...',
    filters: [
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        options: [
          { label: 'Documents', value: 'document' },
          { label: 'Images', value: 'image' },
          { label: 'Videos', value: 'video' }
        ]
      },
      {
        id: 'dateRange',
        label: 'Date Range',
        type: 'range',
        placeholder: 'Select date range'
      }
    ],
    suggestions: [
      { id: '1', text: 'Recent documents', category: 'Quick Search' },
      { id: '2', text: 'Images from last week', category: 'Quick Search' }
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAdvancedSearch {...args} />
    </div>
  ),
  args: {
    placeholder: 'Search...',
    enableAdvancedFilters: false,
    enableHistory: false,
  },
};
