import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StateIndicator from './StateIndicator';
import { cn } from '../../lib/utils';

const meta: Meta<typeof StateIndicator> = {
  title: 'Components/Visual-feedback/StateIndicator',
  component: StateIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism stateindicator component.',
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
type Story = StoryObj<typeof StateIndicator>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <StateIndicator {...args}>
        Default
      </StateIndicator>
    </div>
  ),
  args: {
    
  },
};
