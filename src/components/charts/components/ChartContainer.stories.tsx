import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer } from './ChartContainer';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartContainer> = {
  title: 'Components/Components/ChartContainer',
  component: ChartContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartcontainer component.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof ChartContainer>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">ChartContainer</h3>
        <p className="text-sm opacity-80">This is the default chartcontainer component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <ChartContainer {...args}>
        Default
      </ChartContainer>
    </div>
  ),
  args: {
    children: null,
  },
};
