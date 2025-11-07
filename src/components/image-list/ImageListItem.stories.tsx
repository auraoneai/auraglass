import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageListItem } from './ImageListItem';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ImageListItem> = {
  title: 'Components/Image-list/ImageListItem',
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
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ImageListItem {...args}>
        Default
      </ImageListItem>
    </div>
  ),
  args: {
    
  },
};
