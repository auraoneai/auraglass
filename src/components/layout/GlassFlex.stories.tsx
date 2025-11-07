import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFlex } from './GlassFlex';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassFlex> = {
  title: 'Components/Layout/GlassFlex',
  component: GlassFlex,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassflex component.',
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
type Story = StoryObj<typeof GlassFlex>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassFlex {...args}>
        Default
      </GlassFlex>
    </div>
  ),
  args: {
    
  },
};
