import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from './HStack';

const meta: Meta<typeof HStack> = {
  title: 'Surfaces/App Shells + Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Horizontal stack shown as responsive action and status rows.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: {
    className: '',
    spacing: 'md',
    wrap: true,
    align: 'center',
  },
};

export default meta;
type Story = StoryObj<typeof HStack>;

export const Default: Story = {
  render: (args) => (
    <HStack
      {...args}
      className="glass-w-full glass-max-w-3xl glass-rounded-2xl glass-bg-white/60 glass-p-4 glass-shadow-xl"
      aria-label="Deployment status row"
    >
      <span className="glass-rounded-full glass-bg-blue-100 glass-px-3 glass-py-1 glass-text-sm glass-font-medium glass-text-blue-800">
        Preview
      </span>
      <div className="glass-min-w-0 glass-flex-1">
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">Storybook lane D</h3>
        <p className="glass-text-sm glass-text-secondary">Navigation, layout, surfaces, templates, and cards.</p>
      </div>
      <button className="glass-rounded-lg glass-bg-slate-900 glass-px-3 glass-py-2 glass-text-sm glass-font-medium glass-text-white">
        Open
      </button>
    </HStack>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-w-full glass-max-w-3xl glass-space-y-3">
      {['xs', 'md', 'xl'].map((spacing) => (
        <HStack key={spacing} {...args} spacing={spacing as any} className="glass-rounded-xl glass-bg-white/60 glass-p-3">
          <span className="glass-w-12 glass-text-sm glass-font-semibold glass-text-primary">{spacing}</span>
          <span className="glass-rounded-lg glass-bg-white/65 glass-px-3 glass-py-2 glass-text-sm glass-text-secondary">
            Responsive horizontal spacing
          </span>
        </HStack>
      ))}
    </div>
  ),
};
