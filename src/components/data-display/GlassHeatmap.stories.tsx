import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassHeatmap } from './GlassHeatmap';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassHeatmap> = {
  title: 'Components/Data-display/GlassHeatmap',
  component: GlassHeatmap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassheatmap component.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassHeatmap>;

export const Default: Story = {
  args: {
    data: [
      { x: 0, y: 0, value: 1, label: 'A1' },
      { x: 1, y: 0, value: 2, label: 'A2' },
      { x: 2, y: 0, value: 3, label: 'A3' },
      { x: 0, y: 1, value: 4, label: 'B1' },
      { x: 1, y: 1, value: 5, label: 'B2' },
      { x: 2, y: 1, value: 6, label: 'B3' },
      { x: 0, y: 2, value: 7, label: 'C1' },
      { x: 1, y: 2, value: 8, label: 'C2' },
      { x: 2, y: 2, value: 9, label: 'C3' }
    ],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassHeatmap {...args} />
    </div>
  ),
  args: {
    data: [
      { x: 0, y: 0, value: 1, label: 'A1' },
      { x: 1, y: 0, value: 2, label: 'A2' },
      { x: 0, y: 1, value: 3, label: 'B1' },
      { x: 1, y: 1, value: 4, label: 'B2' }
    ],
  },
};
