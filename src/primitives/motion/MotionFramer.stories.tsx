'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MotionFramer } from './MotionFramer';

const meta: Meta<typeof MotionFramer> = {
  title: 'Components/Motion/MotionFramer',
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
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">MotionFramer</h3>
        <p className="text-sm opacity-80">This is the default motionframer component.</p>
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