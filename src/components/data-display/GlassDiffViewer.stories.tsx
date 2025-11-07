import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDiffViewer } from './GlassDiffViewer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDiffViewer> = {
  title: 'Components/Data-display/GlassDiffViewer',
  component: GlassDiffViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdiffviewer component.',
      },
    },
  },
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
    <div className="flex flex-wrap gap-4">
      <GlassDiffViewer {...args} />
    </div>
  ),
};
