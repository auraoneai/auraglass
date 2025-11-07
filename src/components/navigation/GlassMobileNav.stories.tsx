import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMobileNav } from './GlassMobileNav';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMobileNav> = {
  title: 'Components/Navigation/GlassMobileNav',
  component: GlassMobileNav,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmobilenav component.',
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
type Story = StoryObj<typeof GlassMobileNav>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassMobileNav {...args}>
        Default
      </GlassMobileNav>
    </div>
  ),
  args: {
    
  },
};
