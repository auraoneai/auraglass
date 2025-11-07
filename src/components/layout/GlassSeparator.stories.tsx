import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSeparator } from './GlassSeparator';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSeparator> = {
  title: 'Components/Layout/GlassSeparator',
  component: GlassSeparator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassseparator component.',
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
type Story = StoryObj<typeof GlassSeparator>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassSeparator {...args}>
        Default
      </GlassSeparator>
    </div>
  ),
  args: {
    
  },
};
