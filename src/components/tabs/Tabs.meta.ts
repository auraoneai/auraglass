import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Tabs',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['tabs', 'list', 'tab', 'panel', 'indicator'],
  states: ['active', 'inactive'],
  variants: {},
  migration: [{ from: 'GlassTabs', props: { selectedTab: 'value', onTabChange: 'onValueChange' }, automation: 'mostly', compat: true }],
});
