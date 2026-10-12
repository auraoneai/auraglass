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
  parts: ['activity-actor', 'activity-day-heading', 'activity-feed', 'activity-load-more', 'fallback', 'image', 'root', 'timeline', 'timeline-container', 'timeline-description', 'timeline-item', 'timeline-marker', 'timeline-meta', 'timeline-time', 'timeline-title'],
  states: ['new-items'],
  material: { layer: 'content', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: {},
  budgetKb: 5,
  migration: [
    { from: 'GlassActivityFeed', props: { entries: 'items' }, selectors: { '.glass-activity-feed': '[data-ag-part="activity-feed"]' }, automation: 'mostly', compat: true },
    // 4.x GlassInfiniteScroll feeds: ActivityFeed autoLoad (one IntersectionObserver) + onLoadMore/hasMore.
    { from: 'GlassInfiniteScroll', props: {}, selectors: { '.glass-infinite-scroll': '[data-ag-part="activity-feed"]' }, automation: 'manual', compat: false },
  ],
});
