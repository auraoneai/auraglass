import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'SidebarDrawer',
  owner: 'SURF',
  entry: './app-shell',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  budgetKb: 6,
  tier: 'T1',
  rsc: 'client',
  parts: ['backdrop', 'detent-live', 'hit-area', 'main', 'root', 'sidebar', 'sidebar-drawer', 'sidebar-item', 'sidebar-item-li', 'sidebar-nav', 'sidebar-toggle', 'trigger'],
  states: ['open', 'closed'],
  variants: {},
  migration: [{ from: 'GlassSidebarDrawer', props: {}, automation: 'mostly', compat: true }],
});
