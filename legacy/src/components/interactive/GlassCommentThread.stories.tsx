import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCommentThread } from './GlassCommentThread';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassCommentThread> = {
  title: 'Workflows/Glass Comment Thread',
  component: GlassCommentThread,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscommentthread component.',
      },
    },
  },
  argTypes: {
    comments: {
      control: 'object',
      description: 'Array of comment objects',
    },
    onReply: {
      control: false,
      description: 'Callback function for replying to comments',
    },
  },
  args: {
    comments: [
      {
        id: '1',
        author: 'User 1',
        text: 'This is a sample comment',
        createdAt: '2024-01-01',
      },
    ],
    onReply: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassCommentThread>;

export const Default: Story = {
  args: {
    comments: [
      {
        id: '1',
        author: 'John Doe',
        text: 'This is a sample comment thread',
        createdAt: '2024-01-01 10:00:00',
      },
      {
        id: '2',
        author: 'Jane Smith',
        text: 'This is a reply to the first comment',
        createdAt: '2024-01-01 10:05:00',
      },
    ],
    onReply: fn(),
  },
};

export const Variants: Story = {
  args: {
    comments: [
      {
        id: '1',
        author: 'User',
        text: 'Sample comment for variants',
        createdAt: '2024-01-01',
      },
    ],
    onReply: fn(),
  },
};
