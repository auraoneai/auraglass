import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSplitPane } from './GlassSplitPane';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSplitPane> = {
  title: 'Components/Layout/GlassSplitPane',
  component: GlassSplitPane,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssplitpane component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Split direction',
    },
    initial: {
      control: 'number',
      description: 'Initial split percentage',
    },
    min: {
      control: 'number',
      description: 'Minimum split percentage',
    },
    max: {
      control: 'number',
      description: 'Maximum split percentage',
    },
  },
  args: {
    className: '',
    direction: 'horizontal',
    initial: 50,
    min: 20,
    max: 80,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSplitPane>;

export const Default: Story = {
  args: {
    left: (
      <div className="glass-p-4 glass-surface-blue/20 glass-radius-lg">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Left Pane</h3>
        <p className="glass-text-sm">This is the left side content.</p>
      </div>
    ),
    right: (
      <div className="glass-p-4 glass-surface-green/20 glass-radius-lg">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Right Pane</h3>
        <p className="glass-text-sm">This is the right side content.</p>
      </div>
    ),
  },
};

export const VerticalSplit: Story = {
  args: {
    direction: 'vertical',
    initial: 30,
    left: (
      <div className="glass-p-4 glass-surface-primary/20 glass-radius-lg">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Top Pane</h3>
        <p className="glass-text-sm">This is the top section.</p>
      </div>
    ),
    right: (
      <div className="glass-p-4 glass-surface-primary/20 glass-radius-lg">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Bottom Pane</h3>
        <p className="glass-text-sm">This is the bottom section with more content.</p>
      </div>
    ),
  },
};
