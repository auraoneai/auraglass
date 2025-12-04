import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassDialog } from './GlassDialog';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassDialog> = {
  title: 'Components/Modal/GlassDialog',
  component: GlassDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassdialog component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    open: {
      control: 'boolean',
      description: 'open prop',
    },
    title: {
      control: 'text',
      description: 'title prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
  },
  args: {
    className: '',
    open: false,
    title: 'Modal Title',
    size: 'sm',
  },
};

export default meta;
type Story = StoryObj<typeof GlassDialog>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassDialog {...args}>
        Default
      </GlassDialog>
    </div>
  ),
  args: {
    
  },
};
