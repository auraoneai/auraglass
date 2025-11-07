import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassVirtualTable } from './GlassVirtualTable';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassVirtualTable> = {
  title: 'Components/Data-display/GlassVirtualTable',
  component: GlassVirtualTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassvirtualtable component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    children: {
      control: 'text',
      description: 'children prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
  },
  args: {
    className: '',
    children: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassVirtualTable>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">GlassVirtualTable</h3>
        <p className="text-sm opacity-80">This is the default glassvirtualtable component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassVirtualTable {...args}>
        Default
      </GlassVirtualTable>
    </div>
  ),
  args: {
    children: null,
  },
};
