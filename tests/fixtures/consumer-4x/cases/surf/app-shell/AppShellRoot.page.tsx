// @ts-nocheck — frozen 4.x consumer usage, the codemod's input (do not "fix").
// SURF-526 case 1/2: root-entry GlassAppShell page whose nav items carry
// onClick handlers only (no href) — the 4.x "handler-only rail items"
// pattern the app-shell-slots codemod rewrites to route-aware items.
import { GlassAppShell, GlassSidebar, GlassHeader } from 'aura-glass';
import type { NavigationItem } from 'aura-glass';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: '🏠', onClick: () => console.log('go /') },
  { id: 'projects', label: 'Projects', icon: '📁', onClick: () => console.log('go /projects') },
  { id: 'team', label: 'Team', icon: '👥', onClick: () => console.log('go /team') },
  { id: 'settings', label: 'Settings', icon: '⚙️', children: [{ id: 'billing', label: 'Billing', onClick: () => console.log('go /billing') }] },
];

export function ConsolePage() {
  return (
    <GlassAppShell
      variant="default"
      header={<GlassHeader />}
      sidebar={<GlassSidebar items={navItems} />}
      collapsible
      sidebarWidth="md"
      mobileOverlay
      padding="lg"
      maxWidth="2xl"
    >
      <h1>Console</h1>
    </GlassAppShell>
  );
}
