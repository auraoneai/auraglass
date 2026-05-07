import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBadgeLine } from './GlassBadgeLine';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBadgeLine> = {
  title: 'Data + Visualization/Glass Badge Line',
  component: GlassBadgeLine,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbadgeline component.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ width: "min(640px, calc(100vw - 64px))" }}
      >
        <Story />
      </div>
    ),
  ],
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
