/* ActivityFeed (SURF-187, REQ-SURF-97): server component — day grouping and
   the Timeline markup land in the RSC payload. Load more, the prepend
   announcer and the IntersectionObserver live in ActivityFeed.Interactive
   (client island) so render children never cross the boundary. */
import * as React from 'react';
import { Timeline, type TimelineItem, type TimelineProps } from './Timeline';
import { ActivityFeedInteractive } from './ActivityFeed.Interactive';

export interface ActivityItem extends TimelineItem {
  actor?: { name: string; avatarUrl?: string | undefined } | undefined;
}

export interface ActivityFeedProps extends Omit<TimelineProps, 'items'> {
  items: readonly ActivityItem[];
  groupBy?: 'day' | 'none' | undefined;
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  onLoadMore?: (() => void) | undefined;
  hasMore?: boolean | undefined;
  loading?: boolean | undefined;
  autoLoad?: boolean | undefined;
  labels?: { loadMore?: string | undefined; newItems?: string | undefined; loading?: string | undefined } | undefined;
}

export function ActivityFeed({
  items,
  groupBy = 'none',
  headingLevel = 3,
  onLoadMore,
  hasMore = false,
  loading = false,
  autoLoad = false,
  labels,
  locale = 'en-US',
  ref,
  ...rest
}: ActivityFeedProps & { ref?: React.Ref<HTMLElement> | undefined }) {
  const Heading = `h${headingLevel}` as 'h3';
  const itemsWithActors = items.map((it) => ({
    ...it,
    meta: it.actor !== undefined ? (
      <span data-ag-part="activity-actor" className="ag-activity__actor">
        {it.actor.name}
      </span>
    ) : (
      it.meta
    ),
  }));
  let groups: [string, typeof itemsWithActors][] | null = null;
  if (groupBy === 'day') {
    const map = new Map<string, typeof itemsWithActors>();
    const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    for (const it of itemsWithActors) {
      const d = typeof it.timestamp === 'string' ? new Date(it.timestamp) : it.timestamp;
      const key = fmt.format(d);
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    groups = [...map.entries()];
  }
  const feed = groups === null ? (
    <Timeline {...rest} items={itemsWithActors} locale={locale} />
  ) : (
    groups.map(([day, dayItems]) => (
      <section key={day}>
        <Heading data-ag-part="activity-day-heading" className="ag-activity__heading">
          {day}
        </Heading>
        <Timeline {...rest} items={dayItems} locale={locale} />
      </section>
    ))
  );
  return (
    <section ref={ref} data-ag-part="activity-feed" className="ag-activity-feed">
      <ActivityFeedInteractive
        itemsLength={items.length}
        newItemsLabel={labels?.newItems}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
        autoLoad={autoLoad}
        loadMoreLabel={labels?.loadMore}
        loadingLabel={labels?.loading}
      >
        {feed}
      </ActivityFeedInteractive>
    </section>
  );
}
