import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Tabs',
  owner: 'SURF',
  entry: '.',
  flagship: 25,
  tier: 'T1',
  rsc: 'client',
  parts: ['tabs', 'list', 'tab', 'panel', 'indicator'],
  states: ['active', 'inactive'],
  variants: {},
  migration: [{ from: 'GlassTabs', props: { selectedTab: 'value', onTabChange: 'onValueChange', activeTab: 'value', onTabClick: 'onValueChange', onChange: 'onValueChange' }, automation: 'mostly', compat: true }],
});
