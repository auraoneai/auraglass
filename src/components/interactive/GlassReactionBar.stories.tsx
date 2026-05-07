import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassReactionBar } from './GlassReactionBar';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassReactionBar> = {
  title: 'Effects + Advanced/Glass Reaction Bar',
  component: GlassReactionBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassreactionbar component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    className: '',
  },
};

export default meta;
type Story = StoryObj<typeof GlassReactionBar>;

export const Default: Story = {
  args: {
    reactions: [
      { key: 'like', label: '👍', count: 12 },
      { key: 'love', label: '❤️', count: 8 },
      { key: 'laugh', label: '😂', count: 5 },
      { key: 'wow', label: '😮', count: 3 },
      { key: 'sad', label: '😢', count: 1 },
    ],
    onReact: fn(),
  },
};

export const PopularReactions: Story = {
  args: {
    reactions: [
      { key: 'thumbs_up', label: '👍', count: 42 },
      { key: 'heart', label: '❤️', count: 38 },
      { key: 'fire', label: '🔥', count: 27 },
      { key: 'clap', label: '👏', count: 19 },
      { key: 'rocket', label: '🚀', count: 15 },
      { key: 'thinking', label: '🤔', count: 7 },
      { key: 'eyes', label: '👀', count: 4 },
    ],
    onReact: fn(),
  },
};
