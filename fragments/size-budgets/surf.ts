// size-budgets fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { SizeBudgetRow } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { id: 'SB-SURF-W1-APPSHELL-CSS', import: 'aura-glass/app-shell.css', limitBytes: 8192, kind: 'css' },
  { id: 'SB-SURF-W1-APPSHELL-ISLAND', import: "{ AppShellSidebarToggle } from 'aura-glass/app-shell'", limitBytes: 4096, kind: 'js' },
  { id: 'SB-SURF-W1-SIDEBAR-DRAWER', import: "{ SidebarDrawer } from 'aura-glass/app-shell'", limitBytes: 6144, kind: 'js' },
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
const w3 = [] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
const w4 = [] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly SizeBudgetRow[];
