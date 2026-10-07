import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageListItem } from './ImageListItem';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ImageListItem> = {
  title: 'Media/Image List Item',
  component: ImageListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism imagelistitem component.',
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
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof ImageListItem>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-3xl glass-p-6">
      <ImageListItem {...args}>
        <div className="glass-rounded-xl glass-bg-white/70 glass-p-4">
          <div className="glass-text-sm glass-font-semibold glass-text-primary">
            Featured asset
          </div>
          <div className="glass-text-xs glass-text-secondary">
            List items keep media rows scannable.
          </div>
        </div>
      </ImageListItem>
    </div>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ImageListItem {...args}>
        Default
      </ImageListItem>
    </div>
  ),
  args: {
    
  },
};
