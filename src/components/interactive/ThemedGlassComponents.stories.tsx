import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemedGlassComponents } from './ThemedGlassComponents';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ThemedGlassComponents> = {
  title: 'Foundations/Tokens/Themed Glass Components',
  component: ThemedGlassComponents,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism themedglasscomponents component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof ThemedGlassComponents>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ThemedGlassComponents {...args}>
        Default
      </ThemedGlassComponents>
    </div>
  ),
  args: {
    
  },
};
