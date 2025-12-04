import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassAppShell } from './GlassAppShell';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassAppShell> = {
  title: 'Components/Layout/GlassAppShell',
  component: GlassAppShell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassappshell component.',
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
type Story = StoryObj<typeof GlassAppShell>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassAppShell {...args}>
        Default
      </GlassAppShell>
    </div>
  ),
  args: {
    
  },
};
