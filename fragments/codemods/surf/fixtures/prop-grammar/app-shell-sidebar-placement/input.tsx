// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassAppShell } from 'aura-glass';

export function Shell({ children }) {
  return <GlassAppShell sidebarPlacement="right" collapsed>{children}</GlassAppShell>;
}
