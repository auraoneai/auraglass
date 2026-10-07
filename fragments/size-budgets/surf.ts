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
const w2 = [] as const;
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
