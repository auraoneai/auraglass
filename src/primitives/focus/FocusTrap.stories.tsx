'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FocusTrap } from './FocusTrap';

const meta: Meta<typeof FocusTrap> = {
  title: 'Components/Focus/FocusTrap',
  component: FocusTrap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism focustrap component.',
      },
    },
  },
  argTypes: {
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof FocusTrap>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <FocusTrap {...args}>
        Default
      </FocusTrap>
    </div>
  ),
  args: {
    
  },
};