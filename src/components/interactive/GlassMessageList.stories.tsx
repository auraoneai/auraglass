import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMessageList } from './GlassMessageList';
import { fn } from '@storybook/test';

const attachmentImage =
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="0.6" stop-color="#2563eb"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#bg)"/>
      <circle cx="220" cy="56" r="34" fill="rgba(255,255,255,.18)"/>
      <text x="28" y="124" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Attachment</text>
    </svg>
  `)}`;

const meta: Meta<typeof GlassMessageList> = {
  title: 'Workflows/Glass Message List',
  component: GlassMessageList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A glass morphism glassmessagelist component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    currentUserId: {
      control: 'text',
      description: 'Current user ID',
    },
    enableReactions: {
      control: 'boolean',
      description: 'Enable message reactions',
    },
    showTimestamps: {
      control: 'boolean',
      description: 'Show message timestamps',
    },
    showAvatars: {
      control: 'boolean',
      description: 'Show user avatars',
    },
  },
  args: {
    className: '',
    currentUserId: 'user1',
    enableReactions: true,
    showTimestamps: true,
    showAvatars: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          boxSizing: 'border-box',
          display: 'grid',
          minHeight: '100vh',
          overflow: 'hidden',
          padding: 16,
          placeItems: 'center',
          width: 'min(100%, 440px)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassMessageList>;

export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        content: 'Hello everyone! Welcome to the chat.',
        sender: {
          id: 'user1',
          name: 'Alice',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        type: 'text' as const,
      },
      {
        id: '2',
        content: 'Thanks Alice! Glad to be here.',
        sender: {
          id: 'user2',
          name: 'Bob',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        type: 'text' as const,
      },
      {
        id: '3',
        content: 'How is everyone doing today?',
        sender: {
          id: 'user3',
          name: 'Charlie',
          avatar: '',
          status: 'away' as const,
        },
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        type: 'text' as const,
      },
    ],
    onMessageClick: fn(),
    onMessageReaction: fn(),
  },
};

export const WithAttachments: Story = {
  args: {
    messages: [
      {
        id: '1',
        content: 'Check out this image I found!',
        sender: {
          id: 'user1',
          name: 'Alice',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 120000),
        type: 'text' as const,
        attachments: [
          {
            type: 'image',
            url: attachmentImage,
            name: 'sample-image.jpg',
            size: 245760,
          },
        ],
      },
      {
        id: '2',
        content: 'Here\'s the document you requested.',
        sender: {
          id: 'user2',
          name: 'Bob',
          avatar: '',
          status: 'online' as const,
        },
        timestamp: new Date(Date.now() - 60000),
        type: 'text' as const,
        attachments: [
          {
            type: 'file',
            url: '#',
            name: 'important-document.pdf',
            size: 1048576,
          },
        ],
      },
    ],
    onAttachmentDownload: fn(),
  },
};
