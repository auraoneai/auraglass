import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';
import { cn } from '../../lib/utils';

const meta: Meta<typeof Box> = {
  title: 'Components/Layout/Box',
  component: Box,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism box component.',
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
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <Box {...args}>
        Default
      </Box>
    </div>
  ),
  args: {
    
  },
};
