import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassListView } from './GlassListView';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof GlassListView> = {
  title: 'Components/List/GlassListView',
  component: GlassListView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasslistview component.',
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
type Story = StoryObj<typeof GlassListView>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassListView {...args}>
        Default
      </GlassListView>
    </div>
  ),
  args: {
    
  },
};
