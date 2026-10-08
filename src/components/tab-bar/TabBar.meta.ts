import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'TabBar',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'client',
  parts: ['tab-bar', 'tab-bar-item', 'tab-bar-item-icon', 'tab-bar-item-label', 'tab-bar-item-badge', 'tab-bar-accessory', 'tab-bar-search'],
  states: ['active', 'inactive'],
  variants: {},
  migration: [{ from: 'GlassTabBar', props: { items: null, activeTab: 'value' }, automation: 'mostly', compat: true }],
});
