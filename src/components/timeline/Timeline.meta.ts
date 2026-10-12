import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Timeline',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'server',
  // REQ-SURF-96: the parts Timeline itself renders (ActivityFeed's own parts
  // live in ActivityFeed.meta.ts).
  parts: ['timeline', 'timeline-container', 'timeline-description', 'timeline-item', 'timeline-marker', 'timeline-meta', 'timeline-time', 'timeline-title'],
  states: [],
  material: { layer: 'content', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: { density: ['compact', 'comfortable'] },
  budgetKb: 4,
  migration: [
    { from: 'GlassTimeline', props: { events: 'items' }, selectors: { '.glass-timeline': '[data-ag-part="timeline"]' }, automation: 'mostly', compat: true },
  ],
});
