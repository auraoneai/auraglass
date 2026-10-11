import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'SidebarDrawer',
  owner: 'SURF',
  entry: './app-shell',
  apg: 'dialog-modal',
  budgetKb: 6,
  tier: 'T1',
  rsc: 'client',
  parts: ['sidebar-drawer', 'sidebar-item'],
  states: ['open', 'closed'],
  variants: {},
  migration: [{ from: 'GlassSidebarDrawer', props: {}, automation: 'mostly', compat: true }],
});
