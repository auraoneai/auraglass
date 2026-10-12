import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'AppShell',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 22,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['actions', 'description', 'edge-registrar', 'eyebrow', 'hit-area', 'indicator', 'inspector', 'inspector-content', 'list', 'main', 'page-header', 'panel', 'root', 'scroll-edge', 'sidebar', 'sidebar-content', 'sidebar-item', 'sidebar-item-icon', 'sidebar-item-li', 'sidebar-nav', 'sidebar-toggle', 'skip-link', 'status-bar', 'status-bar-item', 'tab', 'tab-bar', 'tab-bar-item', 'tab-bar-item-label', 'tab-bar-item-wrap', 'tabs', 'title', 'top-bar', 'top-bar-center', 'top-bar-title', 'top-bar-trailing'],
  states: ['expanded', 'collapsed', 'rail'],
  material: { layer: 'chrome', refractionEligible: false },
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  budgetKb: 12,
  variants: {},
  migration: [{ from: 'GlassAppShell', props: { header: null, sidebar: null, footer: null, sidebarWidth: null, sidebarPlacement: { to: 'sidebarSide', values: { left: 'start', right: 'end' } }, collapsed: { to: 'defaultSidebar', values: { true: 'rail', false: 'expanded' } }, collapsible: null, mobileOverlay: null, padding: null, maxWidth: null }, selectors: { '.glass-app-shell': '[data-ag-part="root"]' }, automation: 'mostly', compat: true }],
});
