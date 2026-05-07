import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassChat } from './GlassChat';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassChat> = {
  title: 'Workflows/Glass Chat',
  component: GlassChat,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasschat component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    messages: {
      control: 'object',
      description: 'Array of chat messages',
    },
    title: {
      control: 'text',
      description: 'Chat title',
    },
    enableReactions: {
      control: 'boolean',
      description: 'Enable message reactions',
    },
  },
  args: {
    className: '',
    messages: [
      {
        id: '1',
        content: 'Hello! This is a sample chat message.',
        sender: {
          id: 'user1',
          name: 'Alice',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 60000),
        type: 'text' as const,
      },
      {
        id: '2',
        content: 'Hi Alice! How are you doing?',
        sender: {
          id: 'user2',
          name: 'Bob',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 30000),
        type: 'text' as const,
      },
    ],
    title: 'General Chat',
    enableReactions: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassChat>;

export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        content: 'Welcome to GlassChat!',
        sender: {
          id: 'system',
          name: 'System',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(),
        type: 'system' as const,
      },
    ],
    title: 'GlassChat',
  },
};

export const Variants: Story = {
  args: {
    messages: [
      {
        id: '1',
        content: 'This is a variant example',
        sender: {
          id: 'user1',
          name: 'User',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(),
        type: 'text' as const,
      },
    ],
    title: 'Chat Variant',
    enableReactions: false,
  },
};
