import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassResponsiveNav } from './GlassResponsiveNav';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassResponsiveNav> = {
  title: 'Components/Navigation/GlassResponsiveNav',
  component: GlassResponsiveNav,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassresponsivenav component.',
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
type Story = StoryObj<typeof GlassResponsiveNav>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassResponsiveNav {...args}>
        Default
      </GlassResponsiveNav>
    </div>
  ),
  args: {
    
  },
};
