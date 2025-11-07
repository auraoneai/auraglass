import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassDateRangePicker } from './GlassDateRangePicker';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDateRangePicker> = {
  title: 'Components/Input/GlassDateRangePicker',
  component: GlassDateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdaterangepicker component.',
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
type Story = StoryObj<typeof GlassDateRangePicker>;

export const Default: Story = {
  args: {
    placeholder: 'Select date range',
    onChange: fn(),
    defaultValue: { from: null, to: null },
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassDateRangePicker {...args} />
    </div>
  ),
  args: {
    placeholder: 'Pick date range',
    onChange: fn(),
    defaultValue: { from: null, to: null },
  },
};
