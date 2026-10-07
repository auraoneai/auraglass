import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassJSONViewer } from './GlassJSONViewer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassJSONViewer> = {
  title: 'Data + Visualization/Glass JSONViewer',
  component: GlassJSONViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassjsonviewer component.',
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
type Story = StoryObj<typeof GlassJSONViewer>;

export const Default: Story = {
  args: {
    value: {
      name: 'GlassJSONViewer',
      description: 'This is the default glassjsonviewer component.',
      properties: {
        value: 'any JSON object',
        className: 'optional CSS class'
      }
    },
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassJSONViewer {...args} />
    </div>
  ),
  args: {
    value: { component: 'GlassJSONViewer', variant: 'default' },
  },
};
