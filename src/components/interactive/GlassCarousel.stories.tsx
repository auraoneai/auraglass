import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCarousel } from './GlassCarousel';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassCarousel> = {
  title: 'Components/Interactive/GlassCarousel',
  component: GlassCarousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscarousel component.',
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
type Story = StoryObj<typeof GlassCarousel>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassCarousel {...args}>
        Default
      </GlassCarousel>
    </div>
  ),
  args: {
    
  },
};
