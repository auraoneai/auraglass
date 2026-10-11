import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'AppShell',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 22,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['actions', 'description', 'edge-registrar', 'eyebrow', 'main', 'page-header', 'root', 'scroll-edge', 'sidebar', 'sidebar-item', 'sidebar-item-li', 'sidebar-nav', 'skip-link', 'status-bar', 'status-bar-item', 'tabs', 'title', 'top-bar', 'top-bar-title'],
  states: ['expanded', 'collapsed', 'rail'],
  apg: 'landmarks',
  variants: {},
  migration: [{ from: 'GlassAppShell', props: { header: null, sidebar: null, footer: null, sidebarWidth: 'sidebarWidth', collapsible: null, mobileOverlay: null, padding: null, maxWidth: null }, automation: 'mostly', compat: true }],
});
