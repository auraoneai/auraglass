import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import VisualFeedback from './VisualFeedback';
import { cn } from '../../lib/utils';

const meta: Meta<typeof VisualFeedback> = {
  title: 'Components/Visual-feedback/VisualFeedback',
  component: VisualFeedback,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism visualfeedback component.',
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
type Story = StoryObj<typeof VisualFeedback>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <VisualFeedback {...args}>
        Default
      </VisualFeedback>
    </div>
  ),
  args: {
    
  },
};
