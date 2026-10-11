'use client';
/* ActivityFeed.Interactive (SURF-187, REQ-SURF-97): the client island inside
   the server ActivityFeed — owns the load-more sentinel (one
   IntersectionObserver), the prepend announcer (aria-live), and the button.
   children arrive already-rendered from the server root. */
import * as React from 'react';

export interface ActivityFeedInteractiveProps {
  children: React.ReactNode;
  itemsLength: number;
  newItemsLabel?: string | undefined;
  onLoadMore?: (() => void) | undefined;
  hasMore?: boolean | undefined;
  loading?: boolean | undefined;
  autoLoad?: boolean | undefined;
  loadMoreLabel?: string | undefined;
  loadingLabel?: string | undefined;
}

export function ActivityFeedInteractive({
  children,
  itemsLength,
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

  React.useEffect(() => {
    if (firstLen.current === null) {
      firstLen.current = itemsLength;
      return;
    }
    const delta = itemsLength - firstLen.current;
    if (delta > 0) setAnnouncement(`${delta} ${newItemsLabel ?? 'new activities'}`);
    firstLen.current = itemsLength;
    return undefined;
  }, [itemsLength, newItemsLabel]);

  return (
    <>
      {children}
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
            {loading ? (loadingLabel ?? 'Loading') : (loadMoreLabel ?? 'Load more')}
          </button>
        </>
      ) : null}
    </>
  );
}
