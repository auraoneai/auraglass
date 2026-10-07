import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMasonry } from './GlassMasonry';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassMasonry> = {
  title: 'Surfaces/App Shells + Layout/Glass Masonry',
  component: GlassMasonry,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmasonry component.',
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
type Story = StoryObj<typeof GlassMasonry>;

export const Default: Story = {
  render: (args) => (
    <GlassMasonry
      {...args}
      className="glass-neutral-level1 glass-w-full glass-max-w-4xl glass-rounded-2xl glass-p-5 glass-shadow-xl"
    >
      <div className="glass-rounded-xl glass-bg-white/65 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Compact cards</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Masonry keeps dense content scannable.</p>
      </div>
      <div className="glass-rounded-xl glass-bg-white/70 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Balanced columns</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Variable heights flow into stable columns.</p>
      </div>
      <div className="glass-rounded-xl glass-bg-white/60 glass-p-4">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Responsive flow</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Breakpoints reflow without clipping.</p>
      </div>
    </GlassMasonry>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassMasonry {...args}>
        Default
      </GlassMasonry>
    </div>
  ),
  args: {
    
  },
};
