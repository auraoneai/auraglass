import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageList } from './ImageList';
import { cn } from '../../lib/utils';

const meta: Meta<typeof ImageList> = {
  title: 'Components/Image-list/ImageList',
  component: ImageList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism imagelist component.',
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
type Story = StoryObj<typeof ImageList>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ImageList {...args}>
        Default
      </ImageList>
    </div>
  ),
  args: {
    
  },
};
