import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptimizedGlassContainer } from './OptimizedGlassContainer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof OptimizedGlassContainer> = {
  title: 'Surfaces/App Shells + Layout/Optimized Glass Container',
  component: OptimizedGlassContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism optimizedglasscontainer component.',
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
type Story = StoryObj<typeof OptimizedGlassContainer>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <OptimizedGlassContainer {...args}>
        Default
      </OptimizedGlassContainer>
    </div>
  ),
  args: {
    
  },
};
