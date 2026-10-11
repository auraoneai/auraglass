import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Timeline',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'server',
  parts: ['activity-actor', 'activity-day-heading', 'activity-feed', 'activity-load-more', 'timeline', 'timeline-description', 'timeline-item', 'timeline-marker', 'timeline-meta', 'timeline-time', 'timeline-title'],
  states: [],
  apg: 'feed',
  variants: { density: ['compact', 'comfortable'] },
  budgetKb: 4,
  migration: [
    { from: 'GlassTimeline', props: { events: 'items' }, selectors: { '.glass-timeline': '[data-ag-part="timeline"]' }, automation: 'mostly', compat: true },
  ],
});
