import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTabs } from './GlassTabs';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassTabs> = {
  title: 'Components/Navigation/GlassTabs',
  component: GlassTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasstabs component.',
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
type Story = StoryObj<typeof GlassTabs>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassTabs {...args}>
        Default
      </GlassTabs>
    </div>
  ),
  args: {
    
  },
};
