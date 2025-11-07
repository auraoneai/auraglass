import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from './HStack';
import { cn } from '../../lib/utils';

const meta: Meta<typeof HStack> = {
  title: 'Components/Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism hstack component.',
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
type Story = StoryObj<typeof HStack>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <HStack {...args}>
        Default
      </HStack>
    </div>
  ),
  args: {
    
  },
};
