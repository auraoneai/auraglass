import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassColorPicker } from './GlassColorPicker';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassColorPicker> = {
  title: 'Components/Input/GlassColorPicker',
  component: GlassColorPicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscolorpicker component.',
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
type Story = StoryObj<typeof GlassColorPicker>;

export const Default: Story = {
  args: {
    value: '#3b82f6',
    format: 'hex',
    showAlpha: false,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassColorPicker {...args} />
    </div>
  ),
  args: {
    value: '#10b981',
    size: 'lg',
    showPresets: true,
  },
};
