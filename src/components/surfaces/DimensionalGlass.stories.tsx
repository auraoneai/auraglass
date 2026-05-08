import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DimensionalGlass from './DimensionalGlass';
import { cn } from '../../lib/utils';

const meta: Meta<typeof DimensionalGlass> = {
  title: 'Surfaces/Cards + Panels/Dimensional Glass',
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
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <DimensionalGlass {...args}>
        <span style={{ color: '#0f172a', fontWeight: 700 }}>Default</span>
      </DimensionalGlass>
    </div>
  ),
  args: {
    
  },
};
