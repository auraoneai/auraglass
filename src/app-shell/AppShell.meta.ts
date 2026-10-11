import { defineMeta } from '../foundation';

export default defineMeta({
  name: 'AppShell',
  owner: 'SURF',
  entry: './app-shell',
  flagship: 22,
  tier: 'T1',
  rsc: 'mixed',
  parts: ['actions', 'description', 'eyebrow', 'main', 'page-header', 'root', 'skip-link', 'tabs', 'title'],
  states: ['expanded', 'collapsed', 'rail'],
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
  variants: {},
  migration: [{ from: 'GlassAppShell', props: { header: null, sidebar: null, footer: null, sidebarWidth: 'sidebarWidth', collapsible: null, mobileOverlay: null, padding: null, maxWidth: null }, automation: 'mostly', compat: true }],
});
