'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MotionNative } from './MotionNative';

const meta: Meta<typeof MotionNative> = {
  title: 'Foundations/Liquid Glass Primitives/Motion Native',
  component: MotionNative,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism motionnative component.',
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
type Story = StoryObj<typeof MotionNative>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">MotionNative</h3>
        <p className="text-sm opacity-80">This is the default motionnative component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <MotionNative {...args}>
        Default
      </MotionNative>
    </div>
  ),
  args: {
    children: null,
  },
};