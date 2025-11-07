import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassToast } from './GlassToast';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassToast> = {
  title: 'Components/Data-display/GlassToast',
  component: GlassToast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasstoast component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom className for the toast',
    },
    title: {
      control: 'text',
      description: 'Toast title',
    },
    description: {
      control: 'text',
      description: 'Toast description',
    },
    type: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast type',
    },
  },
  args: {
    className: '',
    title: 'Toast Title',
    description: 'This is a sample toast message',
    type: 'info',
  },
};

export default meta;
type Story = StoryObj<typeof GlassToast>;

export const Default: Story = {
  args: {
    title: 'Sample Toast',
    description: 'This is a sample toast notification.',
    type: 'info',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <GlassToast {...args} type="success" title="Success!" description="Operation completed successfully." />
      <GlassToast {...args} type="error" title="Error!" description="Something went wrong." />
      <GlassToast {...args} type="warning" title="Warning!" description="Please check your input." />
      <GlassToast {...args} type="info" title="Info!" description="Here's some information." />
    </div>
  ),
};
