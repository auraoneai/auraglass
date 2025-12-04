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
    value: 'var(--glass-color-primary)',
    format: 'hex',
    showAlpha: false,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassColorPicker {...args} />
    </div>
  ),
  args: {
    value: 'var(--glass-color-success)',
    size: 'lg',
    showPresets: true,
  },
};
