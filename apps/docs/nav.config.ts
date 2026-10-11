// nav.config.ts — REQ-PLAT-99 (PLAT-374/377, REQ-FIN-43). The information
// architecture is contractual and exact:
//   Get started → Foundations → Components (flagships by Controls / Overlays /
//   Navigation / Data / AI / Media, then Core) → Surfaces (every certified
//   block) → Guides → Migrate → API (per subpath).
// Components, Surfaces and API are derived from build-time data written by
// scripts/docs/prepare-docs-app.mjs (metas, certified registry report,
// package.json exports); the fixed sections are listed here verbatim.
// Pure module: no fs access, so tests and the app share one definition.

export interface NavEntry { title: string; href: string }
export interface NavGroup { title: string; entries: NavEntry[] }
export interface NavSection { title: string; groups: NavGroup[] }

export interface ComponentRow {
  name: string; slug: string; owner: string | null; entry: string; tier: string;
  flagship: number | null; rsc: string | null; parts: string[]; states: string[]; file: string;
}
export interface SurfaceRow { name: string; title: string; description: string; owner: string | null; files: string[] }
export interface ApiRow { subpath: string; slug: string; label: string; report: string }
export interface SceneRow { id: string; backdrop: string; file: string | null }
export interface NavData {
  version: string;
  components: ComponentRow[];
  componentConflicts?: { name: string; kept: string; dropped: string }[];
  surfaces: SurfaceRow[];
  api: ApiRow[];
  scenes: SceneRow[];
}

export const SECTION_TITLES = ['Get started', 'Foundations', 'Components', 'Surfaces', 'Guides', 'Migrate', 'API'] as const;

/** Flagship numbers per architecture §11.2 (1–14 Controls … 43–44 Media). */
export const FLAGSHIP_GROUPS: ReadonlyArray<{ title: string; from: number; to: number }> = [
  { title: 'Controls', from: 1, to: 14 },
  { title: 'Overlays', from: 15, to: 21 },
  { title: 'Navigation', from: 22, to: 31 },
  { title: 'Data', from: 32, to: 37 },
  { title: 'AI', from: 38, to: 42 },
  { title: 'Media', from: 43, to: 44 },
];
export const CORE_GROUP = 'Core';

export const GET_STARTED: NavEntry[] = [
  { title: 'Introduction', href: '/plat/introduction' },
  { title: 'Next quickstart', href: '/quickstart/next' },
  { title: 'Vite quickstart', href: '/quickstart/vite' },
  { title: 'CLI', href: '/plat/cli' },
];

/** Foundations prose is MAT's (apps/docs/content/mat/); Layers & CSS is PLAT's. */
export const FOUNDATIONS: NavEntry[] = [
  { title: 'Choosing a material', href: '/mat/choosing-a-material' },
  { title: 'Theming', href: '/mat/theming' },
  { title: 'Accessibility', href: '/mat/accessibility' },
  { title: 'Motion', href: '/mat/motion' },
  { title: 'Layers & CSS', href: '/plat/layers-css' },
];

export const GUIDES: NavEntry[] = [
  { title: 'Next.js', href: '/guides/nextjs' },
  { title: 'Vite', href: '/guides/vite' },
  { title: 'React Router', href: '/guides/react-router' },
  { title: 'RSC', href: '/guides/rsc' },
  { title: 'Tailwind', href: '/guides/tailwind' },
  { title: 'Plain CSS', href: '/guides/plain-css' },
  { title: 'shadcn', href: '/guides/shadcn' },
  { title: 'Testing', href: '/guides/testing' },
  { title: 'AI agents', href: '/guides/ai-agents' },
];

export const MIGRATE: NavEntry[] = [
  { title: '4→5', href: '/plat/migrate/5' },
  { title: 'From MUI', href: '/plat/migrate/from-mui' },
  { title: 'From Radix', href: '/plat/migrate/from-radix' },
  { title: 'From Lucide', href: '/plat/migrate/from-lucide' },
];

export const componentHref = (slug: string) => `/components/${slug}`;
export const surfaceHref = (name: string) => `/surfaces/${name}`;
export const apiHref = (slug: string) => `/api/${slug}`;

const single = (title: string, entries: NavEntry[]): NavSection => ({ title, groups: [{ title, entries }] });

export function componentGroups(components: ComponentRow[]): NavGroup[] {
  const byFlagship = (a: ComponentRow, b: ComponentRow) => (a.flagship! - b.flagship!) || a.name.localeCompare(b.name);
  const entry = (c: ComponentRow): NavEntry => ({ title: c.name, href: componentHref(c.slug) });
  const groups: NavGroup[] = FLAGSHIP_GROUPS.map((g) => ({
    title: g.title,
    entries: components.filter((c) => c.flagship !== null && c.flagship >= g.from && c.flagship <= g.to).sort(byFlagship).map(entry),
  }));
  groups.push({
    title: CORE_GROUP,
    entries: components.filter((c) => c.flagship === null && c.tier !== 'preview').sort((a, b) => a.name.localeCompare(b.name)).map(entry),
  });
  return groups;
}

export function buildNav(data: NavData): NavSection[] {
  return [
    single('Get started', GET_STARTED),
    single('Foundations', FOUNDATIONS),
    { title: 'Components', groups: componentGroups(data.components) },
    single('Surfaces', data.surfaces.map((s) => ({ title: s.title, href: surfaceHref(s.name) }))),
    single('Guides', GUIDES),
    single('Migrate', MIGRATE),
    single('API', data.api.map((a) => ({ title: a.label, href: apiHref(a.slug) }))),
  ];
}

export const navHrefs = (nav: NavSection[]): string[] => nav.flatMap((s) => s.groups.flatMap((g) => g.entries.map((e) => e.href)));

export default buildNav;
