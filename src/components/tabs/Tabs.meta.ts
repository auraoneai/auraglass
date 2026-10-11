import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'Tabs',
  owner: 'SURF',
  entry: '.',
  apg: 'tabs',
  budgetKb: 6,
  flagship: 25,
  tier: 'T1',
  rsc: 'client',
  parts: ['indicator', 'list', 'panel', 'tab', 'tabs'],
  states: ['active', 'inactive'],
  variants: {},
  migration: [{ from: 'GlassTabs', props: { selectedTab: 'value', onTabChange: 'onValueChange' }, automation: 'mostly', compat: true }],
});
