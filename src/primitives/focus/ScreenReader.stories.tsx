'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScreenReader } from './ScreenReader';

const meta: Meta<typeof ScreenReader> = {
  title: 'Components/Focus/ScreenReader',
  component: ScreenReader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism screenreader component.',
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
type Story = StoryObj<typeof ScreenReader>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ScreenReader {...args}>
        Default
      </ScreenReader>
    </div>
  ),
  args: {
    
  },
};