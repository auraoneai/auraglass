'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAdvanced } from './GlassAdvanced';

const meta: Meta<typeof GlassAdvanced> = {
  title: 'Foundations/Liquid Glass Primitives/Glass Advanced',
  component: GlassAdvanced,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassadvanced component.',
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
type Story = StoryObj<typeof GlassAdvanced>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-neutral-level1 glass-rounded-2xl glass-p-4 text-center">
        <h3 className="glass-text-primary text-lg font-semibold mb-2">GlassAdvanced</h3>
        <p className="glass-text-secondary text-sm opacity-80">This is the default glassadvanced component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassAdvanced {...args}>
        Default
      </GlassAdvanced>
    </div>
  ),
  args: {
    children: null,
  },
};
