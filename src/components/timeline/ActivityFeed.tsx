/* ActivityFeed (SURF-187, REQ-SURF-97): server component — day grouping and
   the Timeline markup land in the RSC payload. Actors render a CMP Avatar
   (decorative; the name is the visible text). Load more (CMP Button), the
   prepend announcer and the IntersectionObserver live in
   ActivityFeed.Interactive (client island), which receives only
   serializable props plus the caller's onLoadMore. Absorbs 4.x
   GlassActivityFeed and GlassInfiniteScroll use (`autoLoad`). */
import * as React from 'react';
/* The avatar part is imported directly, never as Avatar.Root: this is a
   server module and a client-reference namespace object has no `.Root`
   property under RSC (undefined element type at prerender). */
import { AvatarRoot } from '../avatar';
import { Timeline, type TimelineItem, type TimelineProps } from './Timeline';
import { ActivityFeedInteractive } from './ActivityFeed.Interactive';

export interface ActivityItem extends TimelineItem {
  actor?: { name: string; avatarUrl?: string | undefined } | undefined;
}

export interface ActivityFeedProps extends Omit<TimelineProps, 'items' | 'labels'> {
  /** Activity items, newest first. */
  items: readonly ActivityItem[];
  /** 'day' groups items under date headings. */
  groupBy?: 'day' | 'none' | undefined;
  /** Heading level of the group headings. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** Called to load older items. */
  onLoadMore?: (() => void) | undefined;
  /** More items can be loaded. */
  hasMore?: boolean | undefined;
  /** Older items are loading. */
  loading?: boolean | undefined;
  /** Calls `onLoadMore` when the end of the feed scrolls into view. */
  autoLoad?: boolean | undefined;
  /** Overrides for the built-in, localizable UI strings. */
  labels?: (TimelineProps['labels'] & {
    loadMore?: string | undefined;
    /** Announcement suffix for one prepended item ("1 new activity"). */
    newItem?: string | undefined;
    /** Announcement suffix for several ("3 new activities"). */
    newItems?: string | undefined;
    loading?: string | undefined;
  }) | undefined;
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
  timeZone = 'UTC',
  ref,
  ...rest
}: ActivityFeedProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const timelineLabels = labels?.intent !== undefined ? { intent: labels.intent } : undefined;
  const itemsWithActors = items.map((it) => ({
    ...it,
    meta: it.actor !== undefined ? (
      <span data-ag-part="activity-actor" className="ag-activity__actor">
        <AvatarRoot
          {...(it.actor.avatarUrl !== undefined ? { src: it.actor.avatarUrl } : {})}
          alt=""
          name={it.actor.name}
          size="sm"
          aria-hidden="true"
          className="ag-activity__avatar"
        />
        <span>{it.actor.name}</span>
      </span>
    ) : (
      it.meta
    ),
  }));
  let groups: [string, typeof itemsWithActors][] | null = null;
  if (groupBy === 'day') {
    const map = new Map<string, typeof itemsWithActors>();
    const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone });
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
    <Timeline {...rest} items={itemsWithActors} locale={locale} timeZone={timeZone} labels={timelineLabels} />
  ) : (
    groups.map(([day, dayItems]) => (
      <section key={day}>
        <Heading data-ag-part="activity-day-heading" className="ag-activity__heading">
          {day}
        </Heading>
        <Timeline {...rest} items={dayItems} locale={locale} timeZone={timeZone} labels={timelineLabels} />
      </section>
    ))
  );
  return (
    // REQ-CMP-03: the feed's ref resolves to its root part (the section), never the inner timelines.
    <section ref={ref} data-ag-part="activity-feed" className="ag-activity-feed">
      <ActivityFeedInteractive
        itemIds={items.map((it) => it.id)}
        newItemLabel={labels?.newItem}
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
