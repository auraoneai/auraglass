import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStack } from './GlassStack';

const meta: Meta<typeof GlassStack> = {
  title: 'Surfaces/App Shells + Layout/Glass Stack',
  component: GlassStack,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Stack layout examples with visible spacing, dividers, and responsive content.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: {
    className: '',
    space: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof GlassStack>;

const rows = ['Token refresh complete', 'Story audit in progress', 'Contrast pass queued'];

export const Default: Story = {
  render: (args) => (
    <GlassStack
      {...args}
      className="glass-w-full glass-max-w-md glass-rounded-2xl glass-bg-white/60 glass-p-5 glass-shadow-xl"
      aria-label="Release checklist"
    >
      <h3 className="glass-text-lg glass-font-semibold glass-text-primary">Release checklist</h3>
      {rows.map((row) => (
        <div key={row} className="glass-rounded-lg glass-bg-white/65 glass-p-3 glass-text-sm glass-text-primary">
          {row}
        </div>
      ))}
    </GlassStack>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <GlassStack
      {...args}
      direction="horizontal"
      wrap
      divider={<span className="glass-h-10 glass-w-px glass-bg-slate-300/70" />}
      className="glass-w-full glass-max-w-4xl glass-rounded-2xl glass-bg-white/60 glass-p-5 glass-shadow-xl"
    >
      {['Compact', 'Readable', 'Responsive'].map((label) => (
        <div key={label} className="glass-min-w-44 glass-flex-1 glass-rounded-xl glass-bg-white/65 glass-p-4">
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">{label}</h3>
          <p className="glass-mt-2 glass-text-sm glass-text-secondary">Stable spacing with no clipping.</p>
        </div>
      ))}
    </GlassStack>
  ),
};
