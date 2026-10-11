import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'AppShell',
  owner: 'SURF',
  entry: '.',
  flagship: 22,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['root', 'page-header', 'title', 'eyebrow', 'actions', 'sidebar', 'main', 'top-bar', 'status-bar', 'skip-link', 'inspector', 'sidebar-toggle', 'inspector-toggle', 'controller', 'sidebar-drawer', 'tabs'],
  states: ['expanded', 'collapsed', 'rail'],
  variants: {},
  migration: [{ from: 'GlassAppShell', props: { header: null, sidebar: null, footer: null, sidebarWidth: null, sidebarPlacement: 'sidebarSide', collapsed: 'defaultSidebar', collapsible: null, mobileOverlay: null, padding: null, maxWidth: null }, automation: 'mostly', compat: true }],
});
