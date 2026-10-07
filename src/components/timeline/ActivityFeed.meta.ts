import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'ActivityFeed',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  flagship: true,
  rsc: 'mixed',
  parts: ['activity-feed', 'activity-day', 'activity-heading', 'activity-item', 'activity-actor', 'activity-new-items'],
  states: ['new-items'],
  variants: {},
  budgetKb: 4,
  migration: [
    { from: 'GlassActivityFeed', props: { entries: 'items' }, automation: 'mostly', compat: true },
  ],
  selectors: [{ from: '.glass-activity-feed', to: '[data-ag-part="activity-feed"]' }],
});
