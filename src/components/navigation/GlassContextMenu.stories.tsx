import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassContextMenu } from './GlassContextMenu';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassContextMenu> = {
  title: 'Components/Navigation/GlassContextMenu',
  component: GlassContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscontextmenu component.',
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
type Story = StoryObj<typeof GlassContextMenu>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassContextMenu {...args}>
        Default
      </GlassContextMenu>
    </div>
  ),
  args: {
    
  },
};
