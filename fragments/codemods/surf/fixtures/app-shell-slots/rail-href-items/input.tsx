// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassAppShell, GlassSidebarRail } from 'aura-glass';

const railItems = [
  { id: 'inbox', label: 'Inbox', icon: 'inbox', href: '/inbox' },
  { id: 'reports', label: 'Reports', href: '/reports' },
];

export function Mail() {
  return (
    <GlassAppShell sidebar={<GlassSidebarRail items={railItems} />}>
      <p>Mail</p>
    </GlassAppShell>
  );
}
