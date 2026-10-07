// css fragment for SURF (contract S-38..S-45). Lane blocks are owned by SURF lanes W1..W5; edit only your own block.
import type { CssFragment } from '../../src/contracts/fragments';

// --- lane W1 begin ---
const w1 = [
  { file: 'src/app-shell/app-shell.css', layer: 'ag.components', bundle: 'app-shell.css' },
  { file: 'src/components/tabs/Tabs.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/tab-bar/TabBar.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/breadcrumbs/Breadcrumbs.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/pagination/Pagination.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/command-palette/Command.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/components/source-transition/SourceTransition.css', layer: 'ag.components', bundle: 'styles.css' },
] as const;
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [
  { file: 'src/data/table/table.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/chip/Chip.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/key-value-editor/KeyValueEditor.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/filter-bar/filter-bar.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/stat-card/stat-card.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/chart-frame/chart-frame.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/sparkline/sparkline.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/tree-view/tree-view.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/date/date.css', layer: 'ag.components', bundle: 'date.css' },
  { file: 'src/components/timeline/timeline.css', layer: 'ag.components', bundle: 'styles.css' },
  { file: 'src/charts/charts.css', layer: 'ag.components', bundle: 'data.css' },
  { file: 'src/data/data.css', layer: 'ag.components', bundle: 'data.css', order: 90 },
] as const;
// --- lane W2 end ---

// --- lane W3 begin ---
const w3 = [
  { file: 'src/ai/ai.css', layer: 'ag.components', bundle: 'ai.css' },
] as const;
// --- lane W3 end ---

// --- lane W4 begin ---
const w4 = [] as const;
// --- lane W4 end ---

// --- lane W5 begin ---
const w5 = [] as const;
// --- lane W5 end ---

export default [...w1, ...w2, ...w3, ...w4, ...w5] satisfies readonly CssFragment[];
