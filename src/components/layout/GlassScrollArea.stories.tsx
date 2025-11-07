import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassScrollArea } from './GlassScrollArea';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassScrollArea> = {
  title: 'Components/Layout/GlassScrollArea',
  component: GlassScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassscrollarea component.',
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
type Story = StoryObj<typeof GlassScrollArea>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassScrollArea {...args}>
        Default
      </GlassScrollArea>
    </div>
  ),
  args: {
    
  },
};
