'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkipLinks } from './SkipLinks';

const meta: Meta<typeof SkipLinks> = {
  title: 'Foundations/Liquid Glass Primitives/Skip Links',
  component: SkipLinks,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism skiplinks component.',
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
type Story = StoryObj<typeof SkipLinks>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <SkipLinks {...args}>
        Default
      </SkipLinks>
    </div>
  ),
  args: {
    
  },
};