import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ActivityFeed',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'mixed',
  // REQ-SURF-97: rendered union — the feed's own parts, the Timeline parts it
  // composes, and the CMP Avatar parts (root/image/fallback) of each actor.
  parts: ['activity-actor', 'activity-day-heading', 'activity-feed', 'activity-load-more', 'fallback', 'image', 'root', 'timeline', 'timeline-description', 'timeline-item', 'timeline-marker', 'timeline-meta', 'timeline-time', 'timeline-title'],
  states: ['new-items'],
  apg: 'feed',
  variants: {},
  budgetKb: 4,
  migration: [
    { from: 'GlassActivityFeed', props: { entries: 'items' }, automation: 'mostly', compat: true },
    // 4.x GlassInfiniteScroll feeds: ActivityFeed autoLoad (one IntersectionObserver) + onLoadMore/hasMore.
    { from: 'GlassInfiniteScroll', props: {}, automation: 'manual', compat: false },
  ],
  selectors: [{ from: '.glass-activity-feed', to: '[data-ag-part="activity-feed"]' }],
});
