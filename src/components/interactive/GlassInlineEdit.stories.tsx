import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassInlineEdit } from './GlassInlineEdit';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassInlineEdit> = {
  title: 'Effects + Advanced/Glass Inline Edit',
  component: GlassInlineEdit,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassinlineedit component.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Current value to display/edit',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when value is empty',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class',
    },
  },
  args: {
    value: 'Click to edit this text',
    placeholder: 'Click to edit...',
    className: '',
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassInlineEdit>;

export const Default: Story = {
  args: {
    value: 'Edit this text inline',
    placeholder: 'Click to edit...',
    onChange: fn(),
  },
};

export const Variants: Story = {
  args: {
    value: 'Sample editable text',
    placeholder: 'Enter some text...',
    onChange: fn(),
  },
};
