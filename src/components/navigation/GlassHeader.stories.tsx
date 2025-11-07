import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassHeader } from './GlassHeader';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassHeader> = {
  title: 'Components/Navigation/GlassHeader',
  component: GlassHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassheader component.',
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
type Story = StoryObj<typeof GlassHeader>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassHeader {...args}>
        Default
      </GlassHeader>
    </div>
  ),
  args: {
    
  },
};
