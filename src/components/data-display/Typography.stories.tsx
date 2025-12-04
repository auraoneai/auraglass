import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';
import { cn } from '../../lib/utils';

const meta: Meta<typeof Typography> = {
  title: 'Components/Data-display/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism typography component.',
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
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <Typography {...args}>
        Default
      </Typography>
    </div>
  ),
  args: {
    
  },
};
