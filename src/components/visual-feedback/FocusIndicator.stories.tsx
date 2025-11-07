import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FocusIndicator from './FocusIndicator';
import { cn } from '../../lib/utils';

const meta: Meta<typeof FocusIndicator> = {
  title: 'Components/Visual-feedback/FocusIndicator',
  component: FocusIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism focusindicator component.',
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
type Story = StoryObj<typeof FocusIndicator>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <FocusIndicator {...args}>
        Default
      </FocusIndicator>
    </div>
  ),
  args: {
    
  },
};
