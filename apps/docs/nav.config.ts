// nav.config.ts — PLAT-375. Section order is contractual (PLAT.json):
// Get started → Foundations → Components (flagships then Core) → Surfaces →
// Guides → Migrate → API. Do not reorder without a contract change.
export interface NavEntry { title: string; href: string; }
export interface NavSection { title: string; entries: NavEntry[]; }

export const NAV: NavSection[] = [
  { title: 'Get started', entries: [
    { title: 'Introduction', href: '/plat/introduction' },
    { title: 'Quickstart (Next)', href: '/quickstart/next' },
    { title: 'Quickstart (Vite)', href: '/quickstart/vite' },
    { title: 'CLI', href: '/plat/cli' },
  ]},
  { title: 'Foundations', entries: [
    { title: 'Layers & CSS', href: '/plat/layers-css' },
    { title: 'Tokens', href: '/foundations/tokens' },
    { title: 'Glass material', href: '/foundations/glass' },
  ]},
  { title: 'Components', entries: [
    /* flagships first, then Core */
    { title: 'AppShell', href: '/components/app-shell' },
    { title: 'DataTable', href: '/components/data-table' },
    { title: 'Button', href: '/components/button' },
    { title: 'TextField', href: '/components/text-field' },
  ]},
  { title: 'Surfaces', entries: [
    { title: 'Registry blocks', href: '/surfaces/blocks' },
    { title: 'Registry items', href: '/surfaces/items' },
  ]},
  { title: 'Guides', entries: [
    { title: 'Theming', href: '/guides/theming' },
    { title: 'Accessibility', href: '/guides/accessibility' },
    { title: 'SSR & hydration', href: '/guides/ssr' },
    { title: 'Forms', href: '/guides/forms' },
    { title: 'Data display', href: '/guides/data-display' },
    { title: 'Animations', href: '/guides/animations' },
    { title: 'Server components', href: '/guides/rsc' },
    { title: 'Troubleshooting', href: '/guides/troubleshooting' },
    { title: 'Upgrading within 5.x', href: '/guides/upgrading' },
  ]},
  { title: 'Migrate', entries: [
    { title: 'From 4.x (v5)', href: '/plat/migrate/5' },
    { title: 'From MUI', href: '/plat/migrate/from-mui' },
    { title: 'From Radix', href: '/plat/migrate/from-radix' },
    { title: 'From Lucide', href: '/plat/migrate/from-lucide' },
  ]},
  { title: 'API', entries: [
    { title: 'API index', href: '/plat/api' },
    { title: 'Registry index', href: '/plat/registry' },
  ]},
];
export default NAV;
