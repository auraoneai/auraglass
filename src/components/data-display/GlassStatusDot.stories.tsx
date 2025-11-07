import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStatusDot } from './GlassStatusDot';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassStatusDot> = {
  title: 'Components/Data-display/GlassStatusDot',
  component: GlassStatusDot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassstatusdot component.',
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
type Story = StoryObj<typeof GlassStatusDot>;

export const Default: Story = {
  args: {
    status: 'ok',
    size: 12,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassStatusDot {...args} />
    </div>
  ),
  args: {
    status: 'error',
    size: 16,
  },
};
