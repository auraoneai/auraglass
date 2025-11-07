import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSkeletonLoader, GlassSkeletonText } from './GlassSkeletonLoader';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSkeletonLoader> = {
  title: 'Components/Data-display/GlassSkeletonLoader',
  component: GlassSkeletonLoader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassskeletonloader component.',
      },
    },
  },
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the loader is active',
    },
    text: {
      control: 'text',
      description: 'Custom loading text',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
      description: 'Size of the loader',
    },
    variant: {
      control: { type: 'select', options: ['pulse', 'wave', 'shimmer'] },
      description: 'Animation variant',
    },
  },
  args: {
    loading: true,
    text: 'Loading...',
    size: 'md',
    variant: 'pulse',
  },
};

export default meta;
type Story = StoryObj<typeof GlassSkeletonLoader>;

export const Default: Story = {
  args: {
    loading: true,
    text: 'Loading content...',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-4">Pulse</h3>
        <GlassSkeletonLoader {...args} variant="pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-4">Wave</h3>
        <GlassSkeletonLoader {...args} variant="wave" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-4">Shimmer</h3>
        <GlassSkeletonLoader {...args} variant="shimmer" />
      </div>
    </div>
  ),
  args: {
    loading: true,
    text: 'Loading...',
  },
};

export const DifferentSizes: Story = {
  render: (args) => (
    <div className="flex items-center justify-center gap-8">
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-2">Small</h3>
        <GlassSkeletonLoader {...args} size="sm" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-2">Medium</h3>
        <GlassSkeletonLoader {...args} size="md" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-2">Large</h3>
        <GlassSkeletonLoader {...args} size="lg" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold mb-2">Extra Large</h3>
        <GlassSkeletonLoader {...args} size="xl" />
      </div>
    </div>
  ),
  args: {
    loading: true,
    text: 'Loading...',
  },
};

export const WithChildren: Story = {
  render: (args) => (
    <GlassSkeletonLoader {...args}>
      <div className="p-6 glass-surface-subtle/10 glass-radius-lg text-center">
        <h3 className="text-lg font-semibold mb-2">Content Loaded!</h3>
        <p className="text-sm opacity-80">This content appears when loading is complete.</p>
      </div>
    </GlassSkeletonLoader>
  ),
  args: {
    loading: false,
    text: 'Loading...',
  },
};

// Stories for GlassSkeletonText
export const SkeletonText: Story = {
  render: (args) => (
    <div className="gap-4 max-w-md">
      <div>
        <h4 className="text-sm font-medium mb-2">Single Line</h4>
        <GlassSkeletonText lines={1} />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Multiple Lines</h4>
        <GlassSkeletonText lines={3} />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Long Content Block</h4>
        <GlassSkeletonText lines={5} />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">With Custom Width</h4>
        <GlassSkeletonText lines={2} width={['100%', '80%']} />
      </div>
    </div>
  ),
  args: {
    loading: true,
  },
};

export const SkeletonTextVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div>
        <h4 className="text-sm font-medium mb-3">Title Skeleton</h4>
        <GlassSkeletonText lines={1} />
        <div className="glass-mt-2">
          <GlassSkeletonText lines={3} width={['100%', '90%', '60%']} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">List Item Skeleton</h4>
        <div className="gap-3">
          <div className="flex items-center gap-3">
            <GlassSkeletonText lines={1} width="40px" />
            <div className="flex-1">
              <GlassSkeletonText lines={2} width={['100%', '70%']} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Card Content</h4>
        <GlassSkeletonText lines={1} />
        <div className="glass-mt-2">
          <GlassSkeletonText lines={2} width={['100%', '80%']} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Comment Skeleton</h4>
        <div className="flex items-start gap-3">
          <GlassSkeletonText lines={1} width="32px" />
          <div className="flex-1">
            <GlassSkeletonText lines={3} width={['100%', '90%', '40%']} />
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    loading: true,
  },
};
