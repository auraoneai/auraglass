import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { div } from './div';

const meta: Meta<typeof div> = {
  title: 'Surfaces/Cards + Panels/div',
  component: div,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'glass', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
  },
  argTypes: {
    // Add common glass props
    intent: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    elevation: {
      control: { type: 'select' }, 
      options: ['level1', 'level2', 'level3', 'level4'],
    },
    tier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Glass div',
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    intent: 'primary',
  },
};

export const Elevated: Story = {
  args: {
    ...Default.args,
    elevation: 'level3',
  },
};

export const HighTier: Story = {
  args: {
    ...Default.args,
    tier: 'high',
  },
};
