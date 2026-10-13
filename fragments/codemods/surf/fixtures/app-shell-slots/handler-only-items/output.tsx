// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
// Same shape as tests/fixtures/consumer-4x/cases/surf/app-shell/: the 4.x
// handler-only navigation pattern the app-shell-slots transform rewrites.
import { GlassAppShell, GlassSidebar, GlassHeader } from 'aura-glass';
import type { NavigationItem } from 'aura-glass';

const navItems: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: 'home', onClick: () => console.log('go /') },
  { id: 'projects', label: 'Projects', onClick: () => console.log('go /projects') },
  {
    id: 'settings',
    label: 'Settings',
    children: [{ id: 'billing', label: 'Billing', onClick: () => console.log('go /billing') }],
  },
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
