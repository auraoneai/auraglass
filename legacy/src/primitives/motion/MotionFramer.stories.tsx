'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MotionFramer } from './MotionFramer';

const meta: Meta<typeof MotionFramer> = {
  title: 'Foundations/Liquid Glass Primitives/Motion Framer',
  component: MotionFramer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism motionframer component.',
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
type Story = StoryObj<typeof MotionFramer>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-neutral-level1 glass-rounded-2xl glass-p-4 text-center">
        <h3 className="glass-text-primary text-lg font-semibold mb-2">MotionFramer</h3>
        <p className="glass-text-secondary text-sm opacity-80">This is the default motionframer component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <MotionFramer {...args}>
        Default
      </MotionFramer>
    </div>
  ),
  args: {
    children: null,
  },
};
