import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RippleButton from './RippleButton';
import { cn } from '../../lib/utils';

const meta: Meta<typeof RippleButton> = {
  title: 'Components/Visual-feedback/RippleButton',
  component: RippleButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism ripplebutton component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    variant: {
      control: { type: 'select' },
      options: ["primary","secondary","ghost","outline","danger"],
      description: 'variant prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
    loading: {
      control: 'boolean',
      description: 'loading prop',
    },
  },
  args: {
    className: '',
    variant: 'primary',
    size: 'sm',
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof RippleButton>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <RippleButton key="primary" {...args} variant="primary">
        primary
      </RippleButton>
      <RippleButton key="secondary" {...args} variant="secondary">
        secondary
      </RippleButton>
      <RippleButton key="ghost" {...args} variant="ghost">
        ghost
      </RippleButton>
      <RippleButton key="outline" {...args} variant="outline">
        outline
      </RippleButton>
      <RippleButton key="danger" {...args} variant="danger">
        danger
      </RippleButton>
    </div>
  ),
  args: {
    
  },
};
