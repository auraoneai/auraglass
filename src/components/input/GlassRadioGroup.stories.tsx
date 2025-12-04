import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassRadioGroup } from './GlassRadioGroup';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassRadioGroup> = {
  title: 'Components/Input/GlassRadioGroup',
  component: GlassRadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassradiogroup component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
  },
  args: {
    className: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassRadioGroup>;

export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ],
    value: 'option1',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassRadioGroup {...args} />
    </div>
  ),
  args: {
    options: [
      { value: 'a', label: 'Choice A' },
      { value: 'b', label: 'Choice B' }
    ],
    value: 'a',
  },
};
