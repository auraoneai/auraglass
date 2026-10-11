// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassAppShell } from 'aura-glass';

export function Shell({ isRail, children }) {
  return <GlassAppShell sidebarSide='start' defaultSidebar={isRail ? 'rail' : 'expanded'}>{children}</GlassAppShell>;
}
