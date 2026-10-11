import { defineMeta } from '../../foundation';

export default defineMeta({
  name: 'TabBar',
  owner: 'SURF',
  entry: '.',

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'tabs',
  budgetKb: 5,
  flagship: 26,
  tier: 'T1',
  rsc: 'client',
  parts: ['tab-bar', 'tab-bar-accessory', 'tab-bar-item', 'tab-bar-item-badge', 'tab-bar-item-icon', 'tab-bar-item-label', 'tab-bar-item-wrap', 'tab-bar-search'],
  states: ['active', 'inactive'],
  variants: {},
  migration: [{ from: 'GlassTabBar', props: { items: null, activeTab: 'value' }, automation: 'mostly', compat: true }],
});
