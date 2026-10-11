import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'SidebarDrawer',
  owner: 'SURF',
  entry: './app-shell',
  apg: 'dialog-modal',
  budgetKb: 6,
  tier: 'T1',
  rsc: 'client',
  parts: ['backdrop', 'detent-live', 'root', 'sidebar-drawer', 'sidebar-item', 'sidebar-item-li', 'sidebar-nav'],
  states: ['open', 'closed'],
  variants: {},
  migration: [{ from: 'GlassSidebarDrawer', props: {}, automation: 'mostly', compat: true }],
});
