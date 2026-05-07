import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageListItemBar } from './ImageListItemBar';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ImageListItemBar> = {
  title: 'Media/Image List Item Bar',
  component: ImageListItemBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism imagelistitembar component.',
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
type Story = StoryObj<typeof ImageListItemBar>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ImageListItemBar {...args}>
        Default
      </ImageListItemBar>
    </div>
  ),
  args: {
    
  },
};
