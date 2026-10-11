import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Sidebar',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 23,
  tier: 'T1',
  rsc: 'server',
  parts: ['content', 'sidebar', 'sidebar-collapsible', 'sidebar-content', 'sidebar-footer', 'sidebar-group', 'sidebar-group-items', 'sidebar-group-label', 'sidebar-header', 'sidebar-item', 'sidebar-item-badge', 'sidebar-item-icon', 'sidebar-item-li', 'sidebar-nav', 'sidebar-separator', 'trigger'],
  states: ['expanded', 'collapsed', 'rail'],

  material: { layer: 'chrome', refractionEligible: false },
  apg: 'landmarks',
  variants: {},
  migration: [{ from: 'GlassSidebar', props: { items: null, activeId: 'currentValue', onClick: 'onSelect', badge: 'badge' }, automation: 'mostly', compat: true }],
});
