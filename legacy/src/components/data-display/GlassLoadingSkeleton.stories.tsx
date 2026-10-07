import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassLoadingSkeleton } from './GlassLoadingSkeleton';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassLoadingSkeleton> = {
  title: 'Data + Visualization/Glass Loading Skeleton',
  component: GlassLoadingSkeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassloadingskeleton component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ width: "min(680px, calc(100vw - 64px))" }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name',
    },
    rows: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Number of skeleton rows',
    },
    width: {
      control: 'text',
      description: 'Width of the skeleton',
    },
    height: {
      control: 'text',
      description: 'Height of each row',
    },
    avatar: {
      control: 'boolean',
      description: 'Show avatar skeleton',
    },
    animate: {
      control: 'boolean',
      description: 'Animate the skeleton',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'card', 'list', 'table', 'form', 'dashboard'],
      description: 'Layout variant',
    },
    shimmer: {
      control: 'boolean',
      description: 'Show shimmer effect',
    },
  },
  args: {
    className: '',
    rows: 3,
    width: '100%',
    height: '16px',
    avatar: false,
    animate: true,
    variant: 'default',
    shimmer: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassLoadingSkeleton>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-8">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Default</h4>
        <GlassLoadingSkeleton {...args} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">With Avatar</h4>
        <GlassLoadingSkeleton {...args} avatar={true} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Card Layout</h4>
        <GlassLoadingSkeleton {...args} variant="card" />
      </div>
    </div>
  ),
};
