import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassChatInput } from './GlassChatInput';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassChatInput> = {
  title: 'Workflows/Glass Chat Input',
  component: GlassChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasschatinput component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    enableAttachments: {
      control: 'boolean',
      description: 'Enable file attachments',
    },
    enableVoice: {
      control: 'boolean',
      description: 'Enable voice messages',
    },
    enableEmoji: {
      control: 'boolean',
      description: 'Enable emoji picker',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character count',
    },
  },
  args: {
    className: '',
    disabled: false,
    placeholder: 'Type a message...',
    enableAttachments: true,
    enableVoice: false,
    enableEmoji: true,
    maxLength: 1000,
  },
};

export default meta;
type Story = StoryObj<typeof GlassChatInput>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const Variants: Story = {
  args: {
    placeholder: 'Type a message with attachments...',
    enableAttachments: true,
    enableVoice: true,
    enableEmoji: true,
  },
};
