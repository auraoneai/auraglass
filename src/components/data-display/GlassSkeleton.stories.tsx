import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSkeleton, GlassSkeletonAvatar, GlassSkeletonButton, GlassSkeletonCard } from './GlassSkeleton';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSkeleton> = {
  title: 'Components/Data-Display/GlassSkeleton',
  component: GlassSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Glass morphism skeleton components for loading states with various shapes and animations.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'rectangular', 'circular', 'glass-radius-md'],
      description: 'Shape variant of the skeleton',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none'],
      description: 'Animation type',
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton',
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of text lines (for text variant)',
    },
  },
  args: {
    variant: 'rectangular',
    animation: 'pulse',
    width: '200px',
    height: '100px',
    lines: 1,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSkeleton>;

export const Variants: Story = {
  render: (args) => (
    <div className="space-y-6 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Rectangular</h4>
        <GlassSkeleton {...args} variant="rectangular" width="100%" height="60px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Circular</h4>
        <GlassSkeleton {...args} variant="circular" width="60px" height="60px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Rounded</h4>
        <GlassSkeleton {...args} variant="glass-radius-md" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-3">Text</h4>
        <GlassSkeleton {...args} variant="text" width="100%" height="20px" />
      </div>
    </div>
  ),
  args: {},
};

export const Animations: Story = {
  render: (args) => (
    <div className="glass-gap-4 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Pulse Animation</h4>
        <GlassSkeleton {...args} animation="pulse" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Wave Animation</h4>
        <GlassSkeleton {...args} animation="wave" width="100%" height="40px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">No Animation</h4>
        <GlassSkeleton {...args} animation="none" width="100%" height="40px" />
      </div>
    </div>
  ),
  args: {},
};

export const SkeletonText: Story = {
  render: (args) => (
    <div className="glass-gap-4 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Single Line</h4>
        <GlassSkeleton variant="text" lines={1} width="100%" height="20px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Multiple Lines</h4>
        <GlassSkeleton variant="text" lines={3} width="100%" height="20px" />
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Long Text Block</h4>
        <GlassSkeleton variant="text" lines={5} width="100%" height="20px" />
      </div>
    </div>
  ),
  args: {},
};

export const SkeletonAvatar: Story = {
  render: (args) => (
    <div className="glass-flex glass-items-center glass-gap-4">
      <GlassSkeletonAvatar size="sm" />
      <GlassSkeletonAvatar size="md" />
      <GlassSkeletonAvatar size="lg" />
      <GlassSkeletonAvatar size="xl" />
    </div>
  ),
  args: {},
};

export const SkeletonButton: Story = {
  render: (args) => (
    <div className="glass-gap-4 max-w-md">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Button Sizes</h4>
        <div className="glass-gap-2">
          <GlassSkeletonButton width="60px" />
          <GlassSkeletonButton width="80px" />
          <GlassSkeletonButton width="100px" />
        </div>
      </div>

      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Full Width</h4>
        <GlassSkeletonButton width="100%" />
      </div>
    </div>
  ),
  args: {},
};

export const SkeletonCard: Story = {
  render: (args) => (
    <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 max-w-4xl">
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
      <GlassSkeletonCard />
    </div>
  ),
  args: {},
};

export const LoadingState: Story = {
  render: (args) => (
    <div className="max-w-md glass-gap-4">
      <div className="glass-flex glass-items-center glass-gap-3">
        <GlassSkeletonAvatar size="md" />
        <div className="glass-flex-1 glass-gap-2">
          <GlassSkeleton variant="text" lines={1} width="100%" height="1rem" />
          <GlassSkeleton variant="text" lines={1} width="100%" height="0.75rem" />
        </div>
      </div>

      <GlassSkeletonCard />

      <div className="glass-flex glass-justify-end glass-gap-2">
        <GlassSkeletonButton width="60px" />
        <GlassSkeletonButton width="60px" />
      </div>
    </div>
  ),
  args: {},
};

export const ComplexLayout: Story = {
  render: (args) => (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="glass-flex glass-items-center glass-justify-between">
        <div className="glass-flex glass-items-center glass-gap-3">
          <GlassSkeletonAvatar size="lg" />
          <div className="glass-gap-2">
            <GlassSkeleton variant="text" lines={1} width="100%" height="1rem" />
            <GlassSkeleton variant="text" lines={1} width="100%" height="0.75rem" />
          </div>
        </div>
        <GlassSkeletonButton width="60px" />
      </div>

      {/* Content */}
      <div className="glass-gap-4">
        <GlassSkeleton variant="text" lines={2} width="100%" height="1rem" />
        <GlassSkeleton variant="rectangular" width="100%" height="200px" />
        <GlassSkeleton variant="text" lines={3} width="100%" height="1rem" />
      </div>

      {/* Cards Grid */}
      <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-4">
        <GlassSkeletonCard />
        <GlassSkeletonCard />
        <GlassSkeletonCard />
      </div>

      {/* Actions */}
      <div className="glass-flex glass-justify-between glass-items-center">
        <div className="glass-flex glass-gap-2">
          <GlassSkeletonButton width="60px" />
          <GlassSkeletonButton width="60px" />
        </div>
        <GlassSkeletonButton width="80px" />
      </div>
    </div>
  ),
  args: {},
};