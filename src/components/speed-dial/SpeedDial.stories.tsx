import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SpeedDial } from './SpeedDial';
import { cn } from '../../lib/utils';

const meta: Meta<typeof SpeedDial> = {
  title: 'Components/Speed-dial/SpeedDial',
  component: SpeedDial,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism speeddial component.',
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
type Story = StoryObj<typeof SpeedDial>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">SpeedDial</h3>
        <p className="text-sm opacity-80">This is the default speeddial component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <SpeedDial {...args}>
        Default
      </SpeedDial>
    </div>
  ),
  args: {
    children: null,
  },
};
