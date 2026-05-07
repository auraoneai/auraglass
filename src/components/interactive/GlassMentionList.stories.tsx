import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassMentionList } from './GlassMentionList';
import { cn } from '../../lib/utils';
import { fn } from '@storybook/test';

const meta: Meta<typeof GlassMentionList> = {
  title: 'Effects + Advanced/Glass Mention List',
  component: GlassMentionList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmentionlist component.',
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
type Story = StoryObj<typeof GlassMentionList>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', label: '@john_doe', meta: 'John Doe' },
      { id: '2', label: '@jane_smith', meta: 'Jane Smith' },
      { id: '3', label: '@mike_wilson', meta: 'Mike Wilson' },
    ],
    onSelect: fn(),
  },
};

export const WithMeta: Story = {
  args: {
    items: [
      { id: 'user1', label: '@alice', meta: 'Alice Johnson - Developer' },
      { id: 'user2', label: '@bob', meta: 'Bob Smith - Designer' },
      { id: 'user3', label: '@charlie', meta: 'Charlie Brown - Manager' },
      { id: 'user4', label: '@diana', meta: 'Diana Prince - QA Engineer' },
    ],
    onSelect: fn(),
  },
};
