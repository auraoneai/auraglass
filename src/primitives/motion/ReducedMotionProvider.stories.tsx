'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReducedMotionProvider from './ReducedMotionProvider';

const meta: Meta<typeof ReducedMotionProvider> = {
  title: 'Components/Motion/ReducedMotionProvider',
  component: ReducedMotionProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism reducedmotionprovider component.',
      },
    },
  },
  argTypes: {
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof ReducedMotionProvider>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ReducedMotionProvider {...args}>
        Default
      </ReducedMotionProvider>
    </div>
  ),
  args: {
    
  },
};