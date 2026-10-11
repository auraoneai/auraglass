import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ActivityFeed',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'mixed',
  parts: ['activity-actor', 'activity-day-heading', 'activity-feed', 'activity-load-more'],
  states: ['new-items'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
  variants: {},
  budgetKb: 4,
  migration: [
    { from: 'GlassActivityFeed', props: { entries: 'items' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-activity-feed', to: '[data-ag-part="activity-feed"]' }],
});
