// size-budgets fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { SizeBudgetRow } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { id: 'SB-SURF-W1-APPSHELL-CSS', import: 'aura-glass/app-shell.css', limitBytes: 8192, kind: 'css' },
  { id: 'SB-SURF-W1-APPSHELL-ISLAND', import: "{ AppShellSidebarToggle } from 'aura-glass/app-shell'", limitBytes: 4096, kind: 'js' },
  { id: 'SidebarDrawer', import: "{ SidebarDrawer } from 'aura-glass/app-shell'", limitBytes: 6144, kind: 'js' },
  { id: 'Breadcrumbs', import: "{ Breadcrumbs } from 'aura-glass'", limitBytes: 5120, kind: 'js' },
  { id: 'Pagination', import: "{ Pagination } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'Tabs', import: "{ Tabs } from 'aura-glass'", limitBytes: 6144, kind: 'js' },
  { id: 'TabBar', import: "{ TabBar } from 'aura-glass'", limitBytes: 5120, kind: 'js' },
  { id: 'Command', import: "{ Command } from 'aura-glass'", limitBytes: 6144, kind: 'js' },
  { id: 'SourceTransition', import: "{ SourceTransition } from 'aura-glass'", limitBytes: 3072, kind: 'js' },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { id: 'SB-SURF-W2-DATA-CSS', import: 'aura-glass/data.css', limitBytes: 8192, kind: 'css' },
  { id: 'SB-SURF-W2-DATE-CSS', import: 'aura-glass/date.css', limitBytes: 4096, kind: 'css' },
  { id: 'Table', import: "{ Table } from 'aura-glass/data'", limitBytes: 14336, kind: 'js' },
  { id: 'TreeView', import: "{ TreeView } from 'aura-glass/data'", limitBytes: 8192, kind: 'js' },
  { id: 'FilterBar', import: "{ FilterBar } from 'aura-glass/data'", limitBytes: 8192, kind: 'js' },
  { id: 'Chip', import: "{ Chip } from 'aura-glass/data'", limitBytes: 3072, kind: 'js' },
  { id: 'KeyValueEditor', import: "{ KeyValueEditor } from 'aura-glass/data'", limitBytes: 15360, kind: 'js' },
  { id: 'StatCard', import: "{ StatCard } from 'aura-glass/data'", limitBytes: 3072, kind: 'js' },
  { id: 'Sparkline', import: "{ Sparkline } from 'aura-glass/data'", limitBytes: 2560, kind: 'js' },
  { id: 'ChartFrame', import: "{ ChartFrame } from 'aura-glass/data'", limitBytes: 5120, kind: 'js' },
  { id: 'DatePicker', import: "{ DatePicker } from 'aura-glass/date'", limitBytes: 8192, kind: 'js' },
  { id: 'DateField', import: "{ DateField } from 'aura-glass/date'", limitBytes: 4096, kind: 'js' },
  { id: 'TimePicker', import: "{ TimePicker } from 'aura-glass/date'", limitBytes: 6144, kind: 'js' },
  { id: 'Timeline', import: "{ Timeline } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'ActivityFeed', import: "{ ActivityFeed } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'Chart', import: "{ Chart } from 'aura-glass/charts'", limitBytes: 15360, kind: 'js' },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { id: 'SB-SURF-W3-AI-CSS', import: 'aura-glass/ai.css', limitBytes: 6144, kind: 'css' },
  { id: 'Thread', import: "{ Thread } from 'aura-glass/ai'", limitBytes: 18432, kind: 'js' },
  { id: 'Message', import: "{ Message } from 'aura-glass/ai'", limitBytes: 10240, kind: 'js' },
  { id: 'StreamingText', import: "{ StreamingText } from 'aura-glass/ai'", limitBytes: 2048, kind: 'js' },
  { id: 'Composer', import: "{ Composer } from 'aura-glass/ai'", limitBytes: 12288, kind: 'js' },
  { id: 'ToolCall', import: "{ ToolCall } from 'aura-glass/ai'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W3-SOURCES', import: "{ SourceList, Citation } from 'aura-glass/ai'", limitBytes: 9216, kind: 'js' },
  { id: 'Reasoning', import: "{ Reasoning } from 'aura-glass/ai'", limitBytes: 4096, kind: 'js' },
  { id: 'AgentSteps', import: "{ AgentSteps } from 'aura-glass/ai'", limitBytes: 5120, kind: 'js' },
  { id: 'UsageMeter', import: "{ UsageMeter } from 'aura-glass/ai'", limitBytes: 4096, kind: 'js' },
  { id: 'ProviderErrorState', import: "{ ProviderErrorState } from 'aura-glass/ai'", limitBytes: 5120, kind: 'js' },
] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
// SURF-441/493/513: media+backdrops budgets — media.css/backdrops.css gz,
// {useMediaElement,MediaControls} ≤14KB, {useMediaElement} alone ≤2.5KB,
// Waveform (5.1 internal) ≤2KB, backdrops.css ≤3KB gz.
const w4 = [
  { id: 'SB-SURF-W4-MEDIA-CSS', import: 'aura-glass/media.css', limitBytes: 6144, kind: 'css' },
  { id: 'SB-SURF-W4-BACKDROPS-CSS', import: 'aura-glass/backdrops.css', limitBytes: 3072, kind: 'css' },
  { id: 'SB-SURF-W4-MEDIA-CORE', import: "{ useMediaElement, MediaControls } from 'aura-glass/media'", limitBytes: 14336, kind: 'js' },
  { id: 'SB-SURF-W4-USEMEDIAELEMENT', import: "{ useMediaElement } from 'aura-glass/media'", limitBytes: 2560, kind: 'js' },
  { id: 'SB-SURF-W4-WAVEFORM', import: "{ Waveform } from 'aura-glass/media'", limitBytes: 2048, kind: 'js' },
  { id: 'ImageViewer', import: "{ ImageViewer } from 'aura-glass/media'", limitBytes: 10240, kind: 'js' },
  { id: 'CarouselRail', import: "{ CarouselRail } from 'aura-glass/media'", limitBytes: 10240, kind: 'js' },
  { id: 'NowPlayingBar', import: "{ NowPlayingBar } from 'aura-glass/media'", limitBytes: 8192, kind: 'js' },
  { id: 'Backdrop', import: "{ Backdrop } from 'aura-glass/backdrops'", limitBytes: 3072, kind: 'js' },
] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

// S-44: one js row per SURF meta, id = meta name, limitBytes = budgetKb × 1024.
const metaRows = [
  { id: 'Citation', import: "{ Citation } from 'aura-glass/ai'", limitBytes: 9216, kind: 'js' },
  { id: 'SourceList', import: "{ SourceList } from 'aura-glass/ai'", limitBytes: 9216, kind: 'js' },
  { id: 'RangeCalendar', import: "{ RangeCalendar } from 'aura-glass/date'", limitBytes: 4096, kind: 'js' },
  { id: 'Calendar', import: "{ Calendar } from 'aura-glass/date'", limitBytes: 4096, kind: 'js' },
  { id: 'DateRangePicker', import: "{ DateRangePicker } from 'aura-glass/date'", limitBytes: 8192, kind: 'js' },
  { id: 'TimeField', import: "{ TimeField } from 'aura-glass/date'", limitBytes: 6144, kind: 'js' },
  { id: 'MediaControls', import: "{ MediaControls } from 'aura-glass/media'", limitBytes: 14336, kind: 'js' },
] as const;

export default [...w1, ...w2, ...w3, ...w4, ...w5, ...metaRows] satisfies readonly SizeBudgetRow[];
