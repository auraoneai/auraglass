import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassInfiniteScroll } from './GlassInfiniteScroll';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassInfiniteScroll> = {
  title: 'Components/Interactive/GlassInfiniteScroll',
  component: GlassInfiniteScroll,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassinfinitescroll component.',
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
type Story = StoryObj<typeof GlassInfiniteScroll>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassInfiniteScroll {...args}>
        Default
      </GlassInfiniteScroll>
    </div>
  ),
  args: {
    
  },
};
