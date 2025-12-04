import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStack } from './GlassStack';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassStack> = {
  title: 'Components/Layout/GlassStack',
  component: GlassStack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassstack component.',
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
type Story = StoryObj<typeof GlassStack>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStack {...args}>
        Default
      </GlassStack>
    </div>
  ),
  args: {
    
  },
};
