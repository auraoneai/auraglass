import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';

const meta = {
  title: 'surf/activity-feed',
  parameters: { ag: { subject: 'ActivityFeed', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/* 1×1 transparent GIF: a real image source without a colour literal. */
const AVATAR = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const BASE: ActivityItem[] = [
  { id: 'a6', timestamp: '2026-10-02T16:20:00Z', title: 'Merged PR 512', intent: 'success', actor: { name: 'Ada Lovelace', avatarUrl: AVATAR } },
  { id: 'a5', timestamp: '2026-10-02T11:05:00Z', title: 'Requested review', actor: { name: 'Grace Hopper' }, description: 'Table pinning' },
  { id: 'a4', timestamp: '2026-10-01T17:45:00Z', title: 'Pipeline failed', intent: 'danger', actor: { name: 'CI' } },
  { id: 'a3', timestamp: '2026-10-01T09:30:00Z', title: 'Opened PR 509', actor: { name: 'Alan Turing' }, meta: 'draft' },
];

const OLDER: ActivityItem[] = [
  { id: 'a2', timestamp: '2026-09-30T14:00:00Z', title: 'Closed PR 498', actor: { name: 'Ada Lovelace', avatarUrl: AVATAR } },
  { id: 'a1', timestamp: '2026-09-30T08:10:00Z', title: 'Created the project', actor: { name: 'Grace Hopper' } },
];

let seq = 0;
const fresh = (n: number): ActivityItem[] =>
  Array.from({ length: n }, () => {
    seq += 1;
    return { id: `live-${seq}`, timestamp: '2026-10-02T18:00:00Z', title: `Comment ${seq}`, actor: { name: 'Live user' } };
  });

/** Day groups, actors with avatars, Load more, and a control that prepends
    three items (the prepend perf subject and the "3 new activities" batch). */
function LiveFeed({ groupBy = 'day' as const }: { groupBy?: 'day' | 'none' }) {
  const [items, setItems] = React.useState<ActivityItem[]>(BASE);
  const [loading, setLoading] = React.useState(false);
  const hasMore = !items.some((i) => i.id === 'a1');
  return (
    <div>
      <button type="button" data-testid="feed-prepend" onClick={() => setItems((cur) => [...fresh(3), ...cur])}>
        Add 3 activities
      </button>
      <ActivityFeed
        items={items}
        groupBy={groupBy}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={() => {
          setLoading(true);
          setTimeout(() => {
            setItems((cur) => [...cur, ...OLDER]);
            setLoading(false);
          }, 300);
        }}
      />
    </div>
  );
}

export const Default: Story = { render: () => <LiveFeed /> };
export const GroupedByDay: Story = { render: () => <ActivityFeed items={[...BASE, ...OLDER]} groupBy="day" /> };
export const LoadMore: Story = { render: () => <LiveFeed groupBy="none" /> };
export const AutoLoad: Story = {
  render: () => <ActivityFeed items={BASE} hasMore autoLoad onLoadMore={() => undefined} labels={{ loadMore: 'Load older' }} />,
};
