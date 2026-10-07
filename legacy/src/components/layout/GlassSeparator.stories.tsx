import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSeparator } from './GlassSeparator';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSeparator> = {
  title: 'Surfaces/App Shells + Layout/Glass Separator',
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
  render: (args) => (
    <div className="glass-neutral-level1 glass-w-full glass-max-w-md glass-rounded-2xl glass-p-5 glass-shadow-xl">
      <h3 className="glass-text-base glass-font-semibold glass-text-primary">Release checklist</h3>
      <GlassSeparator {...args} className="glass-my-3" />
      <p className="glass-text-sm glass-text-secondary">A separator divides content without adding noise.</p>
      <GlassSeparator {...args} orientation="vertical" className="glass-mx-3 glass-inline-block glass-h-6" />
      <span className="glass-text-sm glass-text-secondary">Inline separators stay aligned.</span>
    </div>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassSeparator {...args}>
        Default
      </GlassSeparator>
    </div>
  ),
  args: {
    
  },
};
