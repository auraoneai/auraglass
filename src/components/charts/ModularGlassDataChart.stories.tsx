import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModularGlassDataChart } from './ModularGlassDataChart';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ModularGlassDataChart> = {
  title: 'Components/Charts/ModularGlassDataChart',
  component: ModularGlassDataChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism modularglassdatachart component.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'className prop' },
    // Avoid Storybook inferring color controls for token-based props
    color: { control: { type: 'select' }, options: ['primary', 'secondary', 'blue', 'green', 'yellow', 'red', 'pink', 'gray'] },
    palette: { control: 'object' },
    axis: { control: 'object' },
  },
  args: {
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof ModularGlassDataChart>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ModularGlassDataChart {...args}>
        Default
      </ModularGlassDataChart>
    </div>
  ),
  args: {
    
  },
};
