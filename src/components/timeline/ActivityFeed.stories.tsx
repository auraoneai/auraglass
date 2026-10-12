// ActivityFeed.stories.tsx — SURF story contract (S-41). Flagship #37 (Data).
// `id` keeps the published story ids (surf-activity-feed--*).
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';

const meta = {
  title: 'Flagships/Data/ActivityFeed',
  id: 'surf-activity-feed',
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

export const Playground: StoryObj<typeof ActivityFeed> = {
  args: { items: [...BASE, ...OLDER], groupBy: 'day', headingLevel: 3, hasMore: false, loading: false, timeZone: 'UTC' },
  argTypes: {
    groupBy: { control: 'inline-radio', options: ['day', 'none'] },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
  },
  render: (args) => <ActivityFeed {...args} onLoadMore={() => undefined} />,
};

/* Ungrouped with more pages, a page loading, and the end of the feed. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ag-space-6)' }}>
      <ActivityFeed items={BASE.slice(0, 2)} hasMore onLoadMore={() => undefined} />
      <ActivityFeed items={BASE.slice(0, 2)} hasMore loading onLoadMore={() => undefined} />
      <ActivityFeed items={OLDER} groupBy="day" />
    </div>
  ),
};

/* tests/a11y/apg/surf/activity-feed.apg.spec.ts: Tab reaches Load more, Enter appends the older page. */
export const Keyboard: Story = { tags: ['apg'], render: () => <LiveFeed groupBy="none" /> };
