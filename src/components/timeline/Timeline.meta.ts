import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Timeline',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'server',
  parts: ['timeline', 'timeline-description', 'timeline-item', 'timeline-marker', 'timeline-meta', 'timeline-time', 'timeline-title'],
  states: [],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: { density: ['compact', 'comfortable'] },
  budgetKb: 4,
  migration: [
    { from: 'GlassTimeline', props: { events: 'items' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-timeline', to: '[data-ag-part="timeline"]' }],
});
