import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFileUpload } from './GlassFileUpload';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassFileUpload> = {
  title: 'Components/Interactive/GlassFileUpload',
  component: GlassFileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassfileupload component.',
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
type Story = StoryObj<typeof GlassFileUpload>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">GlassFileUpload</h3>
        <p className="text-sm opacity-80">This is the default glassfileupload component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <GlassFileUpload {...args}>
        Default
      </GlassFileUpload>
    </div>
  ),
  args: {
    children: null,
  },
};
