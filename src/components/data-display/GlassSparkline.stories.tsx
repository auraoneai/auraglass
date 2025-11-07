import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSparkline } from './GlassSparkline';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSparkline> = {
  title: 'Components/Data-display/GlassSparkline',
  component: GlassSparkline,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasssparkline component.',
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
type Story = StoryObj<typeof GlassSparkline>;

export const Default: Story = {
  args: {
    data: [10, 15, 8, 20, 12, 18, 25, 16, 22, 19],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassSparkline {...args} />
    </div>
  ),
  args: {
    data: [5, 12, 8, 15, 10, 20, 18],
    width: 100,
    height: 40,
  },
};
