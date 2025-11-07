import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VStack } from './VStack';
import { cn } from '../../lib/utils';

const meta: Meta<typeof VStack> = {
  title: 'Components/Layout/VStack',
  component: VStack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism vstack component.',
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
type Story = StoryObj<typeof VStack>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <VStack {...args}>
        Default
      </VStack>
    </div>
  ),
  args: {
    
  },
};
