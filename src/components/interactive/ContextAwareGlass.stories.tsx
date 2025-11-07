import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContextAwareGlass } from './ContextAwareGlass';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ContextAwareGlass> = {
  title: 'Components/Interactive/ContextAwareGlass',
  component: ContextAwareGlass,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism contextawareglass component.',
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
type Story = StoryObj<typeof ContextAwareGlass>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ContextAwareGlass {...args}>
        Default
      </ContextAwareGlass>
    </div>
  ),
  args: {
    
  },
};
