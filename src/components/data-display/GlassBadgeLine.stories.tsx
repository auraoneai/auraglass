import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBadgeLine } from './GlassBadgeLine';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBadgeLine> = {
  title: 'Components/Data-display/GlassBadgeLine',
  component: GlassBadgeLine,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbadgeline component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    items: {
      control: 'object',
      description: 'Array of badge items',
    },
  },
  args: {
    className: '',
    items: [
      { label: 'React', intent: 'success' },
      { label: 'TypeScript', intent: 'warning' },
      { label: 'Glassmorphism', intent: 'default' },
      { label: 'UI/UX', intent: 'danger' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassBadgeLine>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassBadgeLine {...args} />
    </div>
  ),
};
