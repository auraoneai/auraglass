import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActivityFeed } from '../../../src/components/timeline/ActivityFeed';

const meta = {
  title: 'CMP/ActivityFeed',
  component: ActivityFeed,
  parameters: { ag: { subject: 'ActivityFeed', kind: 'component' } },
} satisfies Meta<typeof ActivityFeed>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupBy: 'day',
    hasMore: true,
    items: [
      { id: '1', timestamp: '2026-01-01T10:00:00Z', title: 'Deployed', actor: 'devin' },
      { id: '2', timestamp: '2026-01-02T10:00:00Z', title: 'Reviewed', actor: 'gchahal' },
    ],
  },
};
