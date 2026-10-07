// @ts-nocheck — frozen 4.x consumer usage, the codemod's input (do not "fix").
// SURF-526 case 2/2: the same page composed from the aura-glass/app-shell
// subpath entry — the codemod must handle both specifiers for the same
// component family (import fromEntry './app-shell' and '.').
import { GlassAppShell, GlassTopBar, GlassSidebarRail, GlassMain, GlassPageHeader, GlassBreadcrumbs } from 'aura-glass/app-shell';
import type { GlassSidebarRailItem, GlassBreadcrumbItem } from 'aura-glass/app-shell';

const railItems: GlassSidebarRailItem[] = [
  { id: 'overview', label: 'Overview', active: true, onSelect: () => console.log('go /overview') },
  { id: 'reports', label: 'Reports', onSelect: () => console.log('go /reports') },
];

const crumbs: GlassBreadcrumbItem[] = [
  { label: 'Workspace', href: '/' },
  { label: 'Reports' },
];

export function ReportsPage() {
  return (
    <GlassAppShell
      topBar={<GlassTopBar />}
      sidebar={<GlassSidebarRail items={railItems} aria-label="Workspace" />}
    >
      <GlassMain>
        <GlassPageHeader>
          <GlassBreadcrumbs items={crumbs} />
          <h1>Reports</h1>
        </GlassPageHeader>
      </GlassMain>
    </GlassAppShell>
  );
}
