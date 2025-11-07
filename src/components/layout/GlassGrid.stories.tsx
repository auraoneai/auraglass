import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassGrid } from './GlassGrid';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassGrid> = {
  title: 'Components/Layout/GlassGrid',
  component: GlassGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassgrid component.',
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
type Story = StoryObj<typeof GlassGrid>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassGrid {...args}>
        Default
      </GlassGrid>
    </div>
  ),
  args: {
    
  },
};
