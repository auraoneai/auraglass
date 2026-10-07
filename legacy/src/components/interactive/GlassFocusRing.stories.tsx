import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFocusRing } from './GlassFocusRing';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassFocusRing> = {
  title: 'Effects + Advanced/Glass Focus Ring',
  component: GlassFocusRing,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassfocusring component.',
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
type Story = StoryObj<typeof GlassFocusRing>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <GlassFocusRing {...args}>
        <div className="glass-text-center">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">
            GlassFocusRing
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            The focus ring stays visible around the focused element.
          </p>
        </div>
      </GlassFocusRing>
    </div>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassFocusRing {...args}>
        Default
      </GlassFocusRing>
    </div>
  ),
  args: {
    children: null,
  },
};
