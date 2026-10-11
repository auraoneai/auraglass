// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassAppShell } from 'aura-glass';

export function Shell({ isRail, children }) {
  return <GlassAppShell sidebarPlacement="left" collapsed={isRail}>{children}</GlassAppShell>;
}
