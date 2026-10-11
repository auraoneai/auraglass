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
export { GlassDataTable } from './data/GlassDataTable';
export { GlassDataGrid } from './data/GlassDataGrid';
export { GlassVirtualTable } from './data/GlassVirtualTable';
export { GlassVirtualList } from './data/GlassVirtualList';
export { GlassTreeView } from './data/GlassTreeView';
export { TreeView as TreeView4x } from './data/TreeView4x';
export { GlassFileTree } from './data/GlassFileTree';
export { GlassFileExplorer } from './data/GlassFileExplorer';
export { GlassFilterBar } from './data/GlassFilterBar';
export { GlassStatCard } from './data/GlassStatCard';
export { GlassKPICard } from './data/GlassKPICard';
export { GlassMetricCard } from './data/GlassMetricCard';
export { GlassAnimatedNumber } from './data/GlassAnimatedNumber';
export { GlassSparkline } from './data/GlassSparkline';
export { GlassTimeline } from './data/GlassTimeline';
export { GlassActivityFeed } from './data/GlassActivityFeed';
export { GlassChip } from './data/GlassChip';
export { GlassMetricChip } from './data/GlassMetricChip';
export { GlassKeyValueEditor } from './data/GlassKeyValueEditor';
export { GlassDateField } from './date/GlassDateField';
export { GlassTimeField } from './date/GlassTimeField';
export { GlassDatePicker } from './date/GlassDatePicker';
export { GlassDateRangePicker } from './date/GlassDateRangePicker';
export { GlassCalendar } from './date/GlassCalendar';
const w2: SurfCompatAdapter[] = [];
// --- lane W2 end ---

// --- lane W3 begin ---
export { GlassChat } from './ai/GlassChat';
export { GlassChatInput } from './ai/GlassChatInput';
export { GlassMessageList } from './ai/GlassMessageList';
export { GlassTypingIndicator } from './ai/GlassTypingIndicator';
const w3: SurfCompatAdapter[] = [];
// --- lane W3 end ---

// --- lane W4 begin ---
export { LiquidGlassMediaControls } from './media/LiquidGlassMediaControls';
export { GlassMediaControls } from './media/GlassMediaControls';
export { LiquidGlassNowPlayingBar } from './media/LiquidGlassNowPlayingBar';
export { LiquidGlassPhotoInspector } from './media/LiquidGlassPhotoInspector';
export { GlassImageViewer } from './media/GlassImageViewer';
export { GlassGallery } from './media/GlassGallery';
export { GlassCarousel } from './media/GlassCarousel';
export { LiquidGlassCarouselRail } from './media/LiquidGlassCarouselRail';
export { AuroraBackground } from './backdrops/AuroraBackground';
export { AuroraOrb } from './backdrops/AuroraOrb';
export { AtmosphericBackground } from './backdrops/AtmosphericBackground';
export { GlassDynamicAtmosphere, DynamicAtmosphere } from './backdrops/GlassDynamicAtmosphere';
export { GlassMeshGradient } from './backdrops/GlassMeshGradient';
const w4: SurfCompatAdapter[] = [];
// --- lane W4 end ---

// --- lane W5 begin ---
const w5: SurfCompatAdapter[] = [];
// --- lane W5 end ---

export const SURF_COMPAT_ADAPTERS: SurfCompatAdapter[] = [
  ...w2, ...w3, ...w4, ...w5,
];
