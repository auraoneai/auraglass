import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'SidebarDrawer',
  owner: 'SURF',
  entry: './app-shell',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  budgetKb: 16,
  tier: 'T1',
  rsc: 'client',
  parts: ['backdrop', 'detent-live', 'hit-area', 'main', 'root', 'sidebar', 'sidebar-drawer', 'sidebar-item', 'sidebar-item-li', 'sidebar-nav', 'sidebar-toggle', 'trigger'],
  states: ['open', 'closed'],
  material: { layer: 'chrome', refractionEligible: false },
  variants: {},
  migration: [{ from: 'GlassSidebarDrawer', props: {}, selectors: { '.glass-sidebar-drawer': '[data-ag-part="sidebar-drawer"]' }, automation: 'mostly', compat: true }],
});
