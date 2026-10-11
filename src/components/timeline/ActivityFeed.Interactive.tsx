'use client';
/* ActivityFeed.Interactive (SURF-187, REQ-SURF-97): the client island inside
   the server ActivityFeed. It owns
   - the prepend announcer: items placed before the previous first id count
     as new; appends (Load more) never announce. Counts are batched in one
     2 s window — the first prepend starts a single timeout, later prepends
     inside the window add to the count, and the timeout announces once
     ("3 new activities"). The timeout is cleared on unmount.
   - the Load more CMP Button and, with autoLoad, one IntersectionObserver on
     a sentinel, disconnected on unmount.
   children arrive already rendered from the server root. */
import * as React from 'react';
import { Button } from '../button';

export const ANNOUNCE_WINDOW_MS = 2000;

export interface ActivityFeedInteractiveProps {
  children: React.ReactNode;
  /** Item ids in render order (serializable; used to tell prepends from appends). */
  itemIds: readonly string[];
  newItemLabel?: string | undefined;
  newItemsLabel?: string | undefined;
  onLoadMore?: (() => void) | undefined;
  hasMore?: boolean | undefined;
  loading?: boolean | undefined;
  autoLoad?: boolean | undefined;
  loadMoreLabel?: string | undefined;
  loadingLabel?: string | undefined;
}

/** Items rendered before the previous first id; 0 for appends or a replaced list. */
export function countPrepended(prevFirstId: string | undefined, ids: readonly string[]): number {
  if (prevFirstId === undefined) return 0;
  const i = ids.indexOf(prevFirstId);
  return i > 0 ? i : 0;
}

export function ActivityFeedInteractive({
  children,
  itemIds,
  newItemLabel,
  newItemsLabel,
  onLoadMore,
  hasMore = false,
  loading = false,
  autoLoad = false,
  loadMoreLabel,
  loadingLabel,
}: ActivityFeedInteractiveProps) {
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const firstId = React.useRef<string | undefined>(itemIds[0]);
  const pending = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelsRef = React.useRef({ one: newItemLabel, many: newItemsLabel });
  const loadMoreRef = React.useRef(onLoadMore);
  const idsRef = React.useRef(itemIds);
  // Latest props for the timeout / observer callbacks (declared first, so it
  // runs before the effects below that read them).
  React.useEffect(() => {
    labelsRef.current = { one: newItemLabel, many: newItemsLabel };
    loadMoreRef.current = onLoadMore;
    idsRef.current = itemIds;
  });

  React.useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  // Runs when the head id moves (a prepend, or a replaced list); appends keep
  // the head, so they never get here.
  const head = itemIds[0];
  React.useEffect(() => {
    const added = countPrepended(firstId.current, idsRef.current);
    firstId.current = head;
    if (added === 0) return;
    pending.current += added;
    if (timer.current !== null) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      const n = pending.current;
      pending.current = 0;
      const { one, many } = labelsRef.current;
      setAnnouncement(`${n} ${n === 1 ? (one ?? 'new activity') : (many ?? 'new activities')}`);
    }, ANNOUNCE_WINDOW_MS);
  }, [head]);

  React.useEffect(() => {
    if (!autoLoad || !hasMore || typeof IntersectionObserver === 'undefined') return undefined;
    const el = sentinelRef.current;
    if (el === null) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) loadMoreRef.current?.();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [autoLoad, hasMore]);

  return (
    <>
      {children}
      <span aria-live="polite" role="status" className="ag-visually-hidden">
        {announcement}
      </span>
      {hasMore ? (
        <>
          <div ref={sentinelRef} aria-hidden="true" />
          <Button
            type="button"
            data-ag-part="activity-load-more"
            suppressInnerParts
            className="ag-activity__load-more"
            disabled={loading}
            onClick={() => loadMoreRef.current?.()}
          >
            {loading ? (loadingLabel ?? 'Loading') : (loadMoreLabel ?? 'Load more')}
          </Button>
        </>
      ) : null}
    </>
  );
}
