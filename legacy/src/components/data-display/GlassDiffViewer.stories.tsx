import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDiffViewer } from './GlassDiffViewer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDiffViewer> = {
  title: 'Data + Visualization/Glass Diff Viewer',
  component: GlassDiffViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdiffviewer component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ width: "min(900px, calc(100vw - 64px))", overflowX: "auto" }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    left: {
      control: 'text',
      description: 'Left content to compare',
    },
    right: {
      control: 'text',
      description: 'Right content to compare',
    },
    sideBySide: {
      control: 'boolean',
      description: 'Display content side by side',
    },
  },
  args: {
    className: '',
    left: `function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item?.price;
  }
  return total;
}`,
    right: `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item?.price;
  }, 0);
}`,
    sideBySide: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassDiffViewer>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDiffViewer {...args} />
    </div>
  ),
};
