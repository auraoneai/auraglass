import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DimensionalGlass from './DimensionalGlass';
import { cn } from '../../lib/utils';

const meta: Meta<typeof DimensionalGlass> = {
  title: 'Components/Surfaces/DimensionalGlass',
  component: DimensionalGlass,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism dimensionalglass component.',
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
type Story = StoryObj<typeof DimensionalGlass>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <DimensionalGlass {...args}>
        Default
      </DimensionalGlass>
    </div>
  ),
  args: {
    
  },
};
