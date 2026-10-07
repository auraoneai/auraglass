// src/compat/surf/index.ts — SURF 4.x-compat slice (S-31, REQ-SURF-28..34,
// REQ-SURF-55/56, REQ-SURF-65..75, REQ-SURF-173). Lane blocks are owned by
// SURF lanes W1..W5; edit only your own block.
// Structure: each adapter = { entry, provide?, legacy mapping, flag?, retireAt }.
// Until lanes land their adapters the slice exports nothing but keeps the
// registration surface so first entries are mechanical.

export interface SurfCompatAdapter {
  /** compat entry name, e.g. 'Layout' or 'Chart' */
  entry: string;
  /** 5.0 module the adapter delegates to, e.g. 'src/app-shell' */
  provide?: string;
  /** prop translation table (4.x name -> 5.0 name / shim) */
  map: Record<string, string>;
  /** env flag that silences the deprecation warning when set */
  flag?: string;
  /** version at which the adapter is removed, e.g. '6.0' */
  retireAt?: string;
}

// --- lane W1 begin ---
export { GlassAppShell } from './app-shell/GlassAppShell';
export { GlassHeader } from './app-shell/GlassHeader';
export { GlassTopBar } from './app-shell/GlassTopBar';
export { GlassSidebar } from './app-shell/GlassSidebar';
export { GlassMain } from './app-shell/GlassMain';
export { GlassPageHeader } from './app-shell/GlassPageHeader';
export { GlassStatusBar } from './app-shell/GlassStatusBar';
export { GlassInspector } from './app-shell/GlassInspector';
export { GlassMobileShell } from './app-shell/GlassMobileShell';
export { ZSpaceAppLayout } from './app-shell/ZSpaceAppLayout';
export { GlassTabs } from './navigation/GlassTabs';
export { GlassPageTabs } from './navigation/GlassPageTabs';
export { GlassTabBar } from './navigation/GlassTabBar';
export { GlassWorkspaceTabs } from './navigation/GlassWorkspaceTabs';
export { LiquidGlassTabBar } from './navigation/LiquidGlassTabBar';
export { GlassBottomNav } from './navigation/GlassBottomNav';
export { LiquidGlassBottomAccessory } from './navigation/LiquidGlassBottomAccessory';
export { GlassMobileNav } from './navigation/GlassMobileNav';
export { GlassBreadcrumb } from './navigation/GlassBreadcrumb';
export { GlassPagination } from './navigation/GlassPagination';
export { GlassCommandPalette } from './navigation/GlassCommandPalette';
export { GlassCommand } from './navigation/GlassCommand';
export { LiquidGlassCommandSurface } from './navigation/LiquidGlassCommandSurface';
export { LiquidGlassTransitionProvider } from './navigation/LiquidGlassTransitionProvider';
export { LiquidGlassSource } from './navigation/LiquidGlassSource';
export { LiquidGlassDestination } from './navigation/LiquidGlassDestination';
// --- lane W1 end ---

// --- lane W2 begin ---
const w2: SurfCompatAdapter[] = [];
// --- lane W2 end ---

// --- lane W3 begin ---
const w3: SurfCompatAdapter[] = [];
// --- lane W3 end ---

// --- lane W4 begin ---
const w4: SurfCompatAdapter[] = [];
// --- lane W4 end ---

// --- lane W5 begin ---
const w5: SurfCompatAdapter[] = [];
// --- lane W5 end ---

export const SURF_COMPAT_ADAPTERS: SurfCompatAdapter[] = [
  ...w2, ...w3, ...w4, ...w5,
];
