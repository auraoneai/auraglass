import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassProgress } from './GlassProgress';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassProgress> = {
  title: 'Components/Data-display/GlassProgress',
  component: GlassProgress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassprogress component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name',
    },
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'gradient', 'primary'],
      description: 'Progress variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Progress size',
    },
  },
  args: {
    className: '',
    value: 65,
    max: 100,
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof GlassProgress>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-8">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Primary (65%)</h4>
        <GlassProgress {...args} variant="primary" value={65} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Success (80%)</h4>
        <GlassProgress {...args} variant="success" value={80} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Warning (45%)</h4>
        <GlassProgress {...args} variant="warning" value={45} />
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Error (25%)</h4>
        <GlassProgress {...args} variant="error" value={25} />
      </div>
    </div>
  ),
};
