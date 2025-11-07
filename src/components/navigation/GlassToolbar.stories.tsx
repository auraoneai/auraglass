import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassToolbar } from './GlassToolbar';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassToolbar> = {
  title: 'Components/Navigation/GlassToolbar',
  component: GlassToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasstoolbar component.',
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
type Story = StoryObj<typeof GlassToolbar>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassToolbar {...args}>
        Default
      </GlassToolbar>
    </div>
  ),
  args: {
    
  },
};
