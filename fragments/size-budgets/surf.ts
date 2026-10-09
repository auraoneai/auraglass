// size-budgets fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { SizeBudgetRow } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { id: 'SB-SURF-W1-APPSHELL-CSS', import: 'aura-glass/app-shell.css', limitBytes: 8192, kind: 'css' },
  { id: 'SB-SURF-W1-APPSHELL-ISLAND', import: "{ AppShellSidebarToggle } from 'aura-glass/app-shell'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W1-SIDEBAR-DRAWER', import: "{ SidebarDrawer } from 'aura-glass/app-shell'", limitBytes: 8192 /* Perf-Budget-Raise: SB-SURF-W1-SIDEBAR-DRAWER — SidebarDrawer bundles base-ui portal + focus trap + motion (first real measurement ? B exceeded provisional 6144 B) */, kind: 'js' },
  { id: 'SB-SURF-W1-BREADCRUMBS', import: "{ Breadcrumbs } from 'aura-glass'", limitBytes: 5120, kind: 'js' },
  { id: 'SB-SURF-W1-PAGINATION', import: "{ Pagination } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W1-TABS', import: "{ Tabs } from 'aura-glass'", limitBytes: 6144, kind: 'js' },
  { id: 'SB-SURF-W1-TABBAR', import: "{ TabBar } from 'aura-glass'", limitBytes: 5120, kind: 'js' },
  { id: 'SB-SURF-W1-COMMAND', import: "{ Command } from 'aura-glass'", limitBytes: 6144, kind: 'js' },
  { id: 'SB-SURF-W1-SOURCETRANSITION', import: "{ SourceTransition } from 'aura-glass'", limitBytes: 3072, kind: 'js' },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { id: 'SB-SURF-W2-DATA-CSS', import: 'aura-glass/data.css', limitBytes: 8192, kind: 'css' },
  { id: 'SB-SURF-W2-DATE-CSS', import: 'aura-glass/date.css', limitBytes: 4096, kind: 'css' },
  { id: 'SB-SURF-W2-TABLE', import: "{ Table } from 'aura-glass/data'", limitBytes: 14336, kind: 'js' },
  { id: 'SB-SURF-W2-TREEVIEW', import: "{ TreeView } from 'aura-glass/data'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W2-FILTERBAR', import: "{ FilterBar } from 'aura-glass/data'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W2-CHIP', import: "{ Chip } from 'aura-glass/data'", limitBytes: 3072, kind: 'js' },
  { id: 'SB-SURF-W2-KVE', import: "{ KeyValueEditor } from 'aura-glass/data'", limitBytes: 15360, kind: 'js' },
  { id: 'SB-SURF-W2-STATCARD', import: "{ StatCard } from 'aura-glass/data'", limitBytes: 3072, kind: 'js' },
  { id: 'SB-SURF-W2-SPARKLINE', import: "{ Sparkline } from 'aura-glass/data'", limitBytes: 2560, kind: 'js' },
  { id: 'SB-SURF-W2-CHARTFRAME', import: "{ ChartFrame } from 'aura-glass/data'", limitBytes: 5120, kind: 'js' },
  { id: 'SB-SURF-W2-DATEPICKER', import: "{ DatePicker } from 'aura-glass/date'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W2-DATEFIELD', import: "{ DateField } from 'aura-glass/date'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W2-TIMEPICKER', import: "{ TimePicker } from 'aura-glass/date'", limitBytes: 6144, kind: 'js' },
  { id: 'SB-SURF-W2-TIMELINE', import: "{ Timeline } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W2-ACTIVITYFEED', import: "{ ActivityFeed } from 'aura-glass'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W2-CHART-51', import: "{ Chart } from 'aura-glass/charts'", limitBytes: 15360, kind: 'js' },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { id: 'SB-SURF-W3-AI-CSS', import: 'aura-glass/ai.css', limitBytes: 6144, kind: 'css' },
  { id: 'SB-SURF-W3-THREAD', import: "{ Thread } from 'aura-glass/ai'", limitBytes: 18432, kind: 'js' },
  { id: 'SB-SURF-W3-MESSAGE', import: "{ Message } from 'aura-glass/ai'", limitBytes: 12288 /* Perf-Budget-Raise: SB-SURF-W3-MESSAGE — Message bundles markdown/code surface + copy actions (first real measurement ? B exceeded provisional 10240 B) */, kind: 'js' },
  { id: 'SB-SURF-W3-STREAMINGTEXT', import: "{ StreamingText } from 'aura-glass/ai'", limitBytes: 4608 /* Perf-Budget-Raise: SB-SURF-W3-STREAMINGTEXT — StreamingText bundles cursor animation + text utils (first real measurement ? B exceeded provisional 2048 B) */, kind: 'js' },
  { id: 'SB-SURF-W3-COMPOSER', import: "{ Composer } from 'aura-glass/ai'", limitBytes: 12288, kind: 'js' },
  { id: 'SB-SURF-W3-TOOLCALL', import: "{ ToolCall } from 'aura-glass/ai'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W3-SOURCES', import: "{ SourceList, Citation } from 'aura-glass/ai'", limitBytes: 9216, kind: 'js' },
  { id: 'SB-SURF-W3-REASONING', import: "{ Reasoning } from 'aura-glass/ai'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W3-AGENTSTEPS', import: "{ AgentSteps } from 'aura-glass/ai'", limitBytes: 5120, kind: 'js' },
  { id: 'SB-SURF-W3-USAGEMETER', import: "{ UsageMeter } from 'aura-glass/ai'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W3-ERRORSTATE', import: "{ ProviderErrorState } from 'aura-glass/ai'", limitBytes: 5120, kind: 'js' },
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
  { id: 'SB-SURF-W4-USEMEDIAELEMENT', import: "{ useMediaElement } from 'aura-glass/media'", limitBytes: 3584 /* Perf-Budget-Raise: SB-SURF-W4-USEMEDIAELEMENT — useMediaElement bundles media session + event wiring (first real measurement ? B exceeded provisional 2560 B) */, kind: 'js' },
  { id: 'SB-SURF-W4-WAVEFORM', import: "{ Waveform } from 'aura-glass/media'", limitBytes: 2048, kind: 'js' },
  { id: 'SB-SURF-W4-IMAGEVIEWER', import: "{ ImageViewer } from 'aura-glass/media'", limitBytes: 10240, kind: 'js' },
  { id: 'SB-SURF-W4-CAROUSELRAIL', import: "{ CarouselRail } from 'aura-glass/media'", limitBytes: 10240, kind: 'js' },
  { id: 'SB-SURF-W4-NOWPLAYING', import: "{ NowPlayingBar } from 'aura-glass/media'", limitBytes: 8192, kind: 'js' },
  { id: 'SB-SURF-W4-BACKDROP', import: "{ Backdrop } from 'aura-glass/backdrops'", limitBytes: 4608 /* Perf-Budget-Raise: SB-SURF-W4-BACKDROP — Backdrop bundles portal layer + material floor styles (first real measurement ? B exceeded provisional 3072 B) */, kind: 'js' },
] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly SizeBudgetRow[];
