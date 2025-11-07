import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDatePicker } from './GlassDatePicker';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDatePicker> = {
  title: 'Components/Input/GlassDatePicker',
  component: GlassDatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdatepicker component.',
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
type Story = StoryObj<typeof GlassDatePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
    format: 'MM/dd/yyyy',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassDatePicker {...args} />
    </div>
  ),
  args: {
    placeholder: 'Pick a date',
    showTodayButton: true,
  },
};
