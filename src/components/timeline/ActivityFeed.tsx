'use client';
/* ActivityFeed (SURF-187, REQ-SURF-97): Timeline items plus actors, day
   grouping, Load more (button or one IntersectionObserver via autoLoad),
   and prepends announce batched ≤1/2s. */
import * as React from 'react';
import { Timeline, type TimelineItem, type TimelineProps } from './Timeline';

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
  ...rest
}: ActivityFeedProps) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const firstLen = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!autoLoad || !hasMore || onLoadMore === undefined || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const el = sentinelRef.current;
    if (el === null) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) onLoadMore();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [autoLoad, hasMore, onLoadMore]);

  // Announce prepends; the MAT announcer provider coalesces bursts, so a
  // synchronous update here is both pure (no timers) and batched audibly.
  React.useEffect(() => {
    if (firstLen.current === null) {
      firstLen.current = items.length;
      return;
    }
    const delta = items.length - firstLen.current;
    if (delta > 0) {
      setAnnouncement(`${delta} ${labels?.newItems ?? 'new activities'}`);
    }
    firstLen.current = items.length;
    return undefined;
  }, [items.length, labels?.newItems]);

  const Heading = `h${headingLevel}` as 'h3';
  const groups = React.useMemo(() => {
    if (groupBy !== 'day') return null;
    const map = new Map<string, ActivityItem[]>();
    const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' });
    items.forEach((it) => {
      const d = typeof it.timestamp === 'string' ? new Date(it.timestamp) : it.timestamp;
      const key = fmt.format(d);
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    });
    return [...map.entries()];
  }, [items, groupBy, locale]);

  const itemsWithActors = React.useMemo(
    () =>
      items.map((it) => ({
        ...it,
        meta: it.actor !== undefined ? (
          <span data-ag-part="activity-actor" className="ag-activity__actor">
            {it.actor.name}
          </span>
        ) : (
          it.meta
        ),
      })),
    [items],
  );

  return (
    <section data-ag-part="activity-feed" className="ag-activity-feed">
      {groups === null ? (
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
      )}
      <span aria-live="polite" role="status" className="ag-visually-hidden">
        {announcement}
      </span>
      {hasMore ? (
        <>
          <div ref={sentinelRef} aria-hidden="true" />
          <button
            type="button"
            data-ag-part="activity-load-more"
            className="ag-activity__load-more"
            disabled={loading}
            onClick={onLoadMore}
          >
            {loading ? (labels?.loading ?? 'Loading') : (labels?.loadMore ?? 'Load more')}
          </button>
        </>
      ) : null}
    </section>
  );
}
