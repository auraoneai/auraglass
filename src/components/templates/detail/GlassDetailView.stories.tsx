import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDetailView } from './GlassDetailView';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof GlassDetailView> = {
  title: 'Workflows/Glass Detail View',
  component: GlassDetailView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdetailview component.',
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
type Story = StoryObj<typeof GlassDetailView>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDetailView {...args}>
        Default
      </GlassDetailView>
    </div>
  ),
  args: {
    
  },
};
