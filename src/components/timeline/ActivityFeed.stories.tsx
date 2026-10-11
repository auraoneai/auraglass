// ActivityFeed.stories.tsx — SURF story contract (S-41).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';

const meta: Meta = {
  title: 'surf/activity-feed',
  component: ActivityFeed,
  parameters: { ag: { subject: 'ActivityFeed', kind: 'component' } },
};
export default meta;
type Story = StoryObj;

const items: ActivityItem[] = [
  { id: '1', timestamp: '2026-10-01T09:00:00Z', title: 'Opened the incident', actor: { name: 'Ada' }, meta: 'P1' },
  { id: '2', timestamp: '2026-10-02T15:30:00Z', title: 'Resolved', description: 'Rolled back the deploy.', actor: { name: 'Lin' } },
];

export const ByDay: Story = { render: () => <ActivityFeed items={items} groupBy="day" aria-label="Activity" /> };
export const LoadMore: Story = { render: () => <ActivityFeed items={items} hasMore onLoadMore={() => undefined} aria-label="Activity" /> };
