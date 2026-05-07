import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassKeyValueEditor } from './GlassKeyValueEditor';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassKeyValueEditor> = {
  title: 'Workflows/Glass Key Value Editor',
  component: GlassKeyValueEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasskeyvalueeditor component.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of key-value pairs',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class',
    },
  },
  args: {
    value: [
      { key: 'name', value: 'John Doe' },
      { key: 'email', value: 'john@example.com' },
      { key: 'role', value: 'developer' },
    ],
    className: '',
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassKeyValueEditor>;

export const Default: Story = {
  args: {
    value: [
      { key: 'title', value: 'Sample Document' },
      { key: 'author', value: 'Jane Smith' },
    ],
    onChange: fn(),
  },
};

export const Variants: Story = {
  args: {
    value: [
      { key: 'api_key', value: 'sk-1234567890' },
      { key: 'endpoint', value: 'https://api.example.com' },
      { key: 'timeout', value: '5000' },
      { key: 'retries', value: '3' },
    ],
    onChange: fn(),
  },
};
