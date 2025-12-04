import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import GlassSelectCompound from './GlassSelectCompound';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSelectCompound> = {
  title: 'Components/Input/GlassSelectCompound',
  component: GlassSelectCompound,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassselectcompound component.',
      },
    },
  },
  argTypes: {
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof GlassSelectCompound>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassSelectCompound {...args}>
        Default
      </GlassSelectCompound>
    </div>
  ),
  args: {
    
  },
};
