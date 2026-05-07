'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptimizedGlassAdvanced } from './OptimizedGlassAdvanced';

const meta: Meta<typeof OptimizedGlassAdvanced> = {
  title: 'Foundations/Liquid Glass Primitives/Optimized Glass Advanced',
  component: OptimizedGlassAdvanced,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism optimizedglassadvanced component.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof OptimizedGlassAdvanced>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">OptimizedGlassAdvanced</h3>
        <p className="text-sm opacity-80">This is the default optimizedglassadvanced component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <OptimizedGlassAdvanced {...args}>
        Default
      </OptimizedGlassAdvanced>
    </div>
  ),
  args: {
    children: null,
  },
};