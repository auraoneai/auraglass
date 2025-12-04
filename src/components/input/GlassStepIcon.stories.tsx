import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassStepIcon } from './GlassStepIcon';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassStepIcon> = {
  title: 'Components/Input/GlassStepIcon',
  component: GlassStepIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassstepicon component.',
      },
    },
  },
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof GlassStepIcon>;

export const Default: Story = {
  args: {
    index: 0,
    active: true,
    completed: false,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassStepIcon {...args} />
    </div>
  ),
  args: {
    index: 1,
    active: false,
    completed: true,
  },
};
