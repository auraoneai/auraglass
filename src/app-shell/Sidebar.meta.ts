import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'Sidebar',
  owner: 'SURF',
  entry: '.',
  tier: 'T1',
  rsc: 'server',
  parts: ['sidebar', 'sidebar-nav', 'sidebar-item', 'sidebar-item-icon', 'sidebar-item-badge', 'sidebar-group', 'sidebar-group-label', 'sidebar-header', 'sidebar-content', 'sidebar-footer', 'sidebar-separator'],
  states: ['expanded', 'collapsed', 'rail'],
  variants: {},
  migration: [{ from: 'GlassSidebar', props: { items: null, activeId: 'currentValue', onClick: 'onSelect', badge: 'badge' }, automation: 'mostly', compat: true }],
});
