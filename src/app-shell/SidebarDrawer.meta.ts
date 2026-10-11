import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'SidebarDrawer',
  owner: 'SURF',
  entry: './app-shell',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  budgetKb: 6,
  tier: 'T1',
  rsc: 'client',
  parts: ['sidebar-drawer'],
  states: ['open', 'closed'],
  variants: {},
  migration: [{ from: 'GlassSidebarDrawer', props: {}, automation: 'mostly', compat: true }],
});
