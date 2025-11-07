import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SpeedDialAction from './SpeedDialAction';
import { cn } from '../../lib/utils';

const meta: Meta<typeof SpeedDialAction> = {
  title: 'Components/Speed-dial/SpeedDialAction',
  component: SpeedDialAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism speeddialaction component.',
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
type Story = StoryObj<typeof SpeedDialAction>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <SpeedDialAction {...args}>
        Default
      </SpeedDialAction>
    </div>
  ),
  args: {
    
  },
};
