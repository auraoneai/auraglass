import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassThemeDemo } from './GlassThemeDemo';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassThemeDemo> = {
  title: 'Components/Interactive/GlassThemeDemo',
  component: GlassThemeDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassthemedemo component.',
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
type Story = StoryObj<typeof GlassThemeDemo>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassThemeDemo {...args}>
        Default
      </GlassThemeDemo>
    </div>
  ),
  args: {
    
  },
};
