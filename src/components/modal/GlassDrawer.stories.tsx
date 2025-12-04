import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDrawer } from './GlassDrawer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDrawer> = {
  title: 'Components/Modal/GlassDrawer',
  component: GlassDrawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdrawer component.',
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
type Story = StoryObj<typeof GlassDrawer>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDrawer {...args}>
        Default
      </GlassDrawer>
    </div>
  ),
  args: {
    
  },
};
