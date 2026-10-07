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
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <GlassDetailView {...args}>
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
          Release 2.4
        </h3>
        <p className="glass-mt-2 glass-text-sm glass-text-secondary">
          A bounded detail view keeps the certified surface readable across
          viewport sizes.
        </p>
      </GlassDetailView>
    </div>
  ),
  args: {
    className: '',
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
