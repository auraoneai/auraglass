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
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <GlassDraggable {...args}>
        <div className="glass-text-center">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">
            GlassDraggable
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Drag the card to reposition it.
          </p>
        </div>
      </GlassDraggable>
    </div>
  ),
  args: {
    className: '',
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
