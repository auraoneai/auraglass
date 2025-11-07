import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBox } from './GlassBox';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBox> = {
  title: 'Components/Layout/GlassBox',
  component: GlassBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbox component.',
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
type Story = StoryObj<typeof GlassBox>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassBox {...args}>
        Default
      </GlassBox>
    </div>
  ),
  args: {
    
  },
};
