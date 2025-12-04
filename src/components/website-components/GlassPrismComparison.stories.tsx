import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassPrismComparison } from './GlassPrismComparison';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassPrismComparison> = {
  title: 'Components/Website-components/GlassPrismComparison',
  component: GlassPrismComparison,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassprismcomparison component.',
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
type Story = StoryObj<typeof GlassPrismComparison>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassPrismComparison {...args}>
        Default
      </GlassPrismComparison>
    </div>
  ),
  args: {
    
  },
};
