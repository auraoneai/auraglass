import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassSchemaViewer } from './GlassSchemaViewer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassSchemaViewer> = {
  title: 'Data + Visualization/Glass Schema Viewer',
  component: GlassSchemaViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassschemaviewer component.',
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
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassSchemaViewer>;

export const Default: Story = {
  args: {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        active: { type: 'boolean' }
      },
      required: ['name']
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassSchemaViewer {...args} />
    </div>
  ),
  args: {
    schema: { type: 'string', format: 'email' },
  },
};
