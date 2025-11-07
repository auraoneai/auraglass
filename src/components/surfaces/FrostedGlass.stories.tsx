import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FrostedGlass from './FrostedGlass';
import { cn } from '../../lib/utils';

const meta: Meta<typeof FrostedGlass> = {
  title: 'Components/Surfaces/FrostedGlass',
  component: FrostedGlass,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism frostedglass component.',
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
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof FrostedGlass>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <FrostedGlass {...args}>
        Default
      </FrostedGlass>
    </div>
  ),
  args: {
    
  },
};
