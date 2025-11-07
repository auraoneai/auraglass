import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBreadcrumb } from './GlassBreadcrumb';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBreadcrumb> = {
  title: 'Components/Navigation/GlassBreadcrumb',
  component: GlassBreadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbreadcrumb component.',
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
type Story = StoryObj<typeof GlassBreadcrumb>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassBreadcrumb {...args}>
        Default
      </GlassBreadcrumb>
    </div>
  ),
  args: {
    
  },
};
