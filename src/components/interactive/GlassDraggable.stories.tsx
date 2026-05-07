import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDraggable } from './GlassDraggable';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDraggable> = {
  title: 'Effects + Advanced/Glass Draggable',
  component: GlassDraggable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdraggable component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    children: {
      control: 'text',
      description: 'children prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
  },
  args: {
    className: '',
    children: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassDraggable>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-p-4 glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">GlassDraggable</h3>
        <p className="glass-text-sm opacity-80">This is the default glassdraggable component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDraggable {...args}>
        Default
      </GlassDraggable>
    </div>
  ),
  args: {
    children: null,
  },
};
