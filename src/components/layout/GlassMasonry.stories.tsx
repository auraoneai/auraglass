import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMasonry } from './GlassMasonry';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMasonry> = {
  title: 'Surfaces/App Shells + Layout/Glass Masonry',
  component: GlassMasonry,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmasonry component.',
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
type Story = StoryObj<typeof GlassMasonry>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassMasonry {...args}>
        Default
      </GlassMasonry>
    </div>
  ),
  args: {
    
  },
};
