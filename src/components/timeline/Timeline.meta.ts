import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Timeline',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: true,
  rsc: 'server',
  parts: ['timeline', 'timeline-item', 'timeline-marker', 'timeline-title', 'timeline-description', 'timeline-time'],
  states: [],
  variants: { density: ['compact', 'comfortable'] },
  budgetKb: 4,
  migration: [
    { from: 'GlassTimeline', props: { events: 'items' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-timeline', to: '[data-ag-part="timeline"]' }],
});
