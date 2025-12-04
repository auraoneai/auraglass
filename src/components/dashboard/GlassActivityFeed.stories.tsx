import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassActivityFeed } from './GlassActivityFeed';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassActivityFeed> = {
  title: 'Components/Dashboard/GlassActivityFeed',
  component: GlassActivityFeed,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassactivityfeed component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Feed title',
    },
    subtitle: {
      control: 'text',
      description: 'Feed subtitle',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of activities to show',
    },
    showFilters: {
      control: 'boolean',
      description: 'Show filter options',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode',
    },
  },
  args: {
    className: '',
    title: 'Recent Activity',
    subtitle: 'Latest updates and events',
    maxItems: 10,
    showFilters: true,
    compact: false,
    activities: [
      {
        id: '1',
        type: 'user',
        title: 'User logged in',
        description: 'John Doe logged into the system',
        timestamp: new Date(),
        user: {
          name: 'John Doe',
          id: 'user-1',
        },
      },
      {
        id: '2',
        type: 'success',
        title: 'Task completed',
        description: 'Database backup completed successfully',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        type: 'warning',
        title: 'High CPU usage',
        description: 'Server CPU usage above 80%',
        timestamp: new Date(Date.now() - 7200000),
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassActivityFeed>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassActivityFeed {...args} />
    </div>
  ),
};
