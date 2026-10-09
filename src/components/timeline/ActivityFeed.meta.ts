import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ActivityFeed',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: 37,
  rsc: 'mixed',
  parts: ['activity-feed', 'activity-day-heading', 'activity-actor', 'activity-load-more'],
  states: ['new-items'],
  variants: {},
  budgetKb: 4,
  migration: [
    { from: 'GlassActivityFeed', props: { entries: 'items' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-activity-feed', to: '[data-ag-part="activity-feed"]' }],
});
