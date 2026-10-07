# AuraGlass 5.0 PRD: Data and Date (`aura-glass/data`, `aura-glass/date`, 5.1 `aura-glass/charts`)

| Field | Value |
|---|---|
| Key | **DATA** (task key; cite this PRD as `PRD-DATA`; shared contract registry `prd/_shared-contracts.md` SC-01) |
| PRD id | PRD-12 (program self-id, alias only). Architecture §16 boundary: **PRD-11** (`PRD-11-data-and-date.md`). The scope is the same; only the label differs. See "Numbering note" below |
| Owner area | Data and date surfaces: flagships 32–37 (`Table`, `TreeView`, `FilterBar`, `StatCard`, `Sparkline` + `ChartFrame`, `Timeline`/`ActivityFeed`) and flagship 14 (`DateField`/`TimeField`/`DatePicker`/`DateRangePicker`, plus `Calendar`). Also the TanStack integration, the chart.js removal and the 5.1 `./charts` roadmap |
| Status | Draft (reconciled with `prd/_shared-contracts.md`, 2026-10-06) |
| Target releases | 4.2.0 (C-D warnings, chart.js/date-fns become optional peers; release scope and gates held by PRD-REL as interim owner of §16 PRD-17, SC-37), 5.0.0-alpha → GA (implementation), 5.1 (`./charts`) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§3.2, §3.4, §3.6, §6, §9, §11.2 #14 and #32–37, §12, §13, §14, §15, §16); `prd/_shared-contracts.md` (SC-01..SC-40, binding where it differs from this file); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_MISSING_CAPABILITY_MAP.md` (data grid, date picker, query builder rows); `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `autopsy/api-consistency.md` §6.6–6.7; `autopsy/accessibility.md`; `autopsy/performance.md`; `autopsy/packaging-ssr-dx.md`; `autopsy/runtime-local.md`; `autopsy/visual-quality.md`; `autopsy/appshell-workspace-recipes-cli.md`; `autopsy/runtime-remote.md`; `component-inventory.json`; `research/competitors.md` |
| Related decisions | **D-21** (charts), D-13 (Base UI + optional React Aria peer for `/date` and `/data` TreeView and grid mode), D-29 (TanStack on the allowlist), D-08 (content materials for Table), D-09 (budgets by design), D-14 (prefix drop), D-15 (export ceiling), D-17 (registry items), D-18 (compat), D-24 (CSS layers, zero `!important`), D-25 (no JS motion runtime), D-26 (per-import budgets), D-27 (change-class enforcement) |
| Depends on | PRD-FND (foundation pattern, KEEP primitives, removal execution), PRD-CTL (Checkbox, Select, Combobox, SearchField, field shell, NumberField, SegmentedControl, Button, IconButton), PRD-OVL (Popover, Sheet, Tooltip, Menu), PRD-DS (tokens), PRD-MAT (material), PRD-A11Y (preferences, announcer, APG harness), PRD-PKG (build, exports manifest, allowlist, size budgets), PRD-QA (certification lanes, scenes), PRD-SB (Storybook preview, showcases), PRD-PERF (perf harness, runtime budgets), PRD-REL (deprecations schema, frozen 4.x fixture, 4.2/4.3 bridge), PRD-DX (CLI, codemod engine, compat index, registry) |
| Consumed by | PRD-AI (`VirtualList`/virtualization); PRD-DX (codemod tables, registry block content for `data-workspace` and `analytics-dashboard`, docs); PRD-SB (showcase compositions `financial-dashboard`, `analytics`, `ops-console`) |

**Numbering note.** Per SC-01, this PRD is cited as `PRD-DATA`. Its program self-id PRD-12 and its §16 boundary PRD-11 are aliases only. In this document, "PRD-NN" references to other PRDs use **§16 numbering** (PRD-01 = REL, PRD-02 = PKG, PRD-03 = DS, PRD-04 = MAT, PRD-05 = A11Y, PRD-06 = MOT, PRD-07/14/16 = FND, PRD-08 = CTL, PRD-09 = OVL, PRD-10 = NAV, PRD-12 = AI, PRD-17 = REL interim bridge, PRD-18/20 = DX, PRD-19 = QA + SB), and the key in parentheses is authoritative. `tasks/DATA.json` `depends_on` uses only real task ids (SC-40), never `PRD-xx` strings.

---

## 1. Problem

AuraGlass 4.1.0 ships a data and date layer that is broad, duplicated, heavy, partly fake, and not accessible. Products that need a dashboard or an admin table (the "data" surface in the six product surfaces) cannot build one from it without hitting a crash, a non-functional prop, or a 167 KB chart engine they never asked for.

The specific problems:

1. **Three chart engines, one hard chart.js dependency, global side effects.** `GlassChart` (2,163 lines), `GlassDataChart`/`DataChart` (2,016 lines) and `ModularGlassDataChart` (1,378 lines) total about 5,500 lines. They use three data shapes (`data`, `datasets`+`labels`, `series`) and three colour props. `GlassDataChart.tsx` calls `ChartJS.register` at module scope and overwrites consumer-global Chart.js defaults, including `defaults.plugins.tooltip.enabled = false`, which disables tooltips for every chart.js chart in the consumer's app (PERFORMANCE-02). chart.js (167 KB minified) is in the bundle of a `GlassButton`-only import (PACKAGING-SSR-DX-02). Rendered charts are grey (sat90 = 0–1, `visual-quality.md:46`).
2. **Four tables, none virtualized, one crashes.** `GlassDataTable` (1,400 lines) calls hooks conditionally behind "consciousness" flags (API-CONSISTENCY-02), so toggling `predictive` or `eyeTracking` throws. `GlassVirtualTable` is not virtual: it renders `GlassDataTable` with a "future iteration" comment (API-CONSISTENCY-09). `GlassDataGridPro` drops `grouping` onto the DOM. `GlassDataGrid` uses a different column type. There is no column resize, pinning, or real virtualization (capability map: "Data grid: virtualized = No", "column resize = No", P0).
3. **Date pickers fail the APG date-grid pattern.** `GlassDatePicker` has no `role="grid"`, no arrow/Page/Home/End navigation, selection shown only by a CSS class, no `role="dialog"` popup, and every day button in the Tab order (ACCESSIBILITY-09, autopsy numbering). `format` is a no-op and week numbers are fake (capability map). Root import eagerly loads 304 `date-fns` modules, and `src/utils/dateAdapters.ts:43-45` calls a dynamic `require` that always throws in browser ESM (`runtime-local.md`).
4. **Trees have no keyboard model.** Two `TreeView`s plus `GlassFileTree` and `GlassTreeSelect`. `TreeItem` handles only ArrowRight/Left, and every item is `tabIndex 0` (ACCESSIBILITY-13).
5. **Stat tiles are three names for one thing.** `GlassKPICard`, `GlassMetricCard` and `GlassStatCard` (plus `MetricChip`, `MetricWidget`, `KpiChart`) duplicate one stat tile (`api-consistency.md:150`). `GlassSparkline` renders at 1.9:1 contrast, "barely there" (`visual-quality.md:165`).
6. **The query builder is unsound.** `GlassQueryBuilder` mutates state in render (`parent.rules.splice`, `group.rules.push`) and has no typed operators per field (capability map, P2).
7. **The `./data` subpath is a lie.** `package.json` `"./data"` points `import` to `./dist/index.mjs`, the root bundle (PACKAGING-SSR-DX-06), and `src/data/index.ts` is a one-line re-export of `components/data-display`.

The competitive bar is set by MUI X and the shadcn/TanStack data table; Mantine 9 still has no official data table (`research/competitors.md`, Mantine 9 section). A certified, glass-native, accessible `Table` with virtualization is a differentiator that AuraGlass can reach at GA, while a full chart engine is not a GA blocker (D-21).

---

## 2. Evidence from the current codebase

All paths were checked against HEAD `15b6de6f7` with `rg --files`. Finding IDs use the numbering of the detail autopsy files. Where the architecture cites a different number for the same defect (the architecture says ACCESSIBILITY-08 for the date picker and -07 for the tree, while `autopsy/accessibility.md` numbers them -09 and -13), the autopsy file's number is used here and the drift is noted. No REFUTED verdict is relied on.

### 2.1 Charts

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-01 | `ChartJS.register(...)` at module top level, three times, plus plugin registration | `src/components/charts/GlassDataChart.tsx:649`, `:712`, `:714`, `:733` | PERFORMANCE-02 (CONFIRMED) |
| E-02 | Consumer-global defaults overwritten: `defaults.plugins.tooltip.enabled = false`, `defaults.font.family`, `defaults.color` | `src/components/charts/GlassDataChart.tsx:718`, `:721`, `:725` | PERFORMANCE-02 |
| E-03 | A second module-scope `ChartJS.register` | `src/components/charts/components/ChartRenderer.tsx:36` | PERFORMANCE-02 |
| E-04 | chart.js and react-chartjs-2 are hard `dependencies` and also listed as peers (the hard dep wins) | `package.json:491` (`chart.js ^4.5.0`), `:504` (`react-chartjs-2 ^5.3.0`), `:377` (peer) | PACKAGING-SSR-DX-17 (CONFIRMED), DOCS-README `README.md:373,380` ("chart.js is a peer", false) |
| E-05 | A `GlassButton`-only import (esbuild `--minify`, deps bundled) is 1,981,738 B minified / 557,659 B gzip, of which chart.js is about 167 KB | measured, `autopsy/performance.md:61` (the autopsy gives "167 KB", not an exact byte count) | PACKAGING-SSR-DX-02, PERFORMANCE-01 |
| E-06 | Three engines: `GlassChart.tsx` 2,163 lines, `GlassDataChart.tsx` 2,016, `ModularGlassDataChart.tsx` 1,378 (`wc -l`) | `src/components/charts/` | API-CONSISTENCY §6.6 |
| E-07 | `GlassChartProps extends BaseChartProps, ConsciousnessFeatures` (the consciousness mixin on a chart) | `src/components/charts/GlassChart.tsx:43`, `:124` | API-CONSISTENCY-02 |
| E-08 | Three data shapes: `datasets`+`labels` vs `series` | `GlassChart.tsx:264-265`, `GlassDataChart.tsx:239-240`, `GlassLineChart.tsx:67`, `GlassBarChart.tsx:72` | `api-consistency.md:115` |
| E-09 | Charts render grey: GlassDataChart sat90=0, GlassLineChart sat90=1 | remote capture | `visual-quality.md:46` |
| E-10 | Inventory: `GlassChart` REDESIGN, `GlassDataChart` DEPRECATE, `ModularGlassDataChart` REMOVE, Line/Bar/Area/Pie CONSOLIDATE, `ChartAxis`/`ChartContainer`/`ChartFilters`/`ChartRenderer`/`AtmosphericEffects`/`TooltipStyles`/`ChartContainerStyles` REMOVE | `component-inventory.json` | inventory |
| E-11 | Galileo-era deprecated aliases still in the chart plugin | `src/components/charts/plugins/GalileoElementInteractionPlugin.ts:84,118,281` | HISTORY-HYGIENE |
| E-12 | `chartAnimations` (546 LOC) has no importer | `src/animations/physics/chartAnimations.ts` | MOTION (unused physics stack, `motion.md:105`) |

### 2.2 Tables and virtualization

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-13 | Conditional hooks: `predictive ? usePredictiveEngine() : null`, `eyeTracking ? useEyeTracking() : null`, and four more | `src/components/data-display/GlassDataTable.tsx:302-309` | API-CONSISTENCY-02 (critical) |
| E-14 | `GlassVirtualTable` renders `GlassDataTable`: "In a future iteration this can swap to an actual virtualized list" | `src/components/data-display/GlassVirtualTable.tsx:22-25` | API-CONSISTENCY-09 (CONFIRMED) |
| E-15 | `GlassDataGridPro` declares `grouping` (`:22`) and never destructures it, so it lands on the DOM. `density` only acts for `compact` (`:72`) | `src/components/data-display/GlassDataGridPro.tsx:22-23`, `:39`, `:72` | API-CONSISTENCY-09 |
| E-16 | `GlassDataGrid` is `role="table"` with `aria-sort` (acceptable) but has no grid navigation; the drag handle is a `span role="button"` with deprecated `aria-grabbed` | `src/components/data-display/GlassDataGrid.tsx:287`, `:334-335`, `:402-404` | `accessibility.md:57,63` |
| E-17 | `GlassDataGrid` wraps header and cell text in `<ContrastGuard autoAdjust={false}>`, which still calls `startMonitoring`, and each instance leaks an unstored subtree `MutationObserver` | `src/components/data-display/GlassDataGrid.tsx:244,348,439,454`; `src/utils/contrastGuard.ts:209-234` vs `:243-259` | ACCESSIBILITY-05 (CONFIRMED) |
| E-18 | A second, unexported `GlassDataTable` (300 lines) with stories and tests; `TableWidget`, `MetricWidget`, `ChartWidget` unexported | `src/components/templates/interactive/GlassDataTable.tsx`, `src/components/templates/dashboard/widgets/*.tsx` | APPSHELL-WORKSPACE-RECIPES-CLI-15 |
| E-19 | `useVirtualization` starts a never-cancelled rAF FPS loop per instance | `src/hooks/useVirtualization.ts:64` → `src/hooks/useEnhancedPerformance.ts:70-88` | PERFORMANCE-05 (CONFIRMED) |
| E-20 | `GlassVirtualList` (385 lines) is hand-rolled; inventory says REPLACE with `@tanstack/react-virtual` | `src/components/interactive/GlassVirtualList.tsx` | inventory |
| E-21 | No column resize, pin or reorder: `rg columnResize` = 0 | — | capability map "Data grid: column resize" (P0) |

### 2.3 Stat, sparkline, timeline, filters

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-22 | Three stat tiles: `GlassKPICard.tsx` 471 lines, `GlassMetricCard.tsx` 542, `GlassStatCard.tsx` 559; plus `GlassMetricChip.tsx` 77, `KpiChart.tsx` | `src/components/dashboard/`, `src/components/data-display/GlassMetricChip.tsx` | `api-consistency.md:150` |
| E-23 | `GlassSparkline` (114 lines) renders an unlabelled `<svg>` at 1.9:1 contrast | `src/components/data-display/GlassSparkline.tsx:83`; `visual-quality.md:165` | VISUAL-QUALITY |
| E-24 | `GlassTimeline` (464 lines, POLISH) and `GlassActivityFeed` (756 lines, REDESIGN) are separate list primitives; `GlassTimelineRail` in workspace is a third | `src/components/data-display/GlassTimeline.tsx`, `src/components/dashboard/GlassActivityFeed.tsx`, `src/workspace/index.tsx` | inventory |
| E-25 | `GlassQueryBuilder` mutates in render: `parent.rules.splice` (`:152`, `:210`), `group.rules.push` (`:188`, `:198`) | `src/components/interactive/GlassQueryBuilder.tsx` | capability map "Query builder" |
| E-26 | `GlassFilterBar` is 97 lines (POLISH); `GlassFilterPanel` 624 lines (REDESIGN) | `src/components/interactive/` | inventory |

### 2.4 Date and time

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-27 | `handleKeyDown` handles only Escape and Enter, on the input only; selection shown by the `glass-surface-primary` class; no grid/gridcell/dialog roles | `src/components/input/GlassDatePicker.tsx:430-437`, `:460`, `:609-635` | ACCESSIBILITY-09 (CONFIRMED; architecture cites it as -08) |
| E-28 | `format = "MM/dd/yyyy"` default, date-fns token string, not locale-driven | `src/components/input/GlassDatePicker.tsx:58`, `:155`, `:202` | capability map "Date picker" |
| E-29 | `loadOptionalDateLibrary` calls `require(packageName)`, which throws in browser ESM (esbuild `__require` shim) | `src/utils/dateAdapters.ts:43-45`, `:58`, `:141` | `runtime-local.md:42` |
| E-30 | Root import loads 304 date-fns modules eagerly | measured | `runtime-local.md:30` |
| E-31 | `GlassDateField` and `GlassTimeField` are 22-line wrappers, both KEEP; `GlassCalendar` (826 lines) REDESIGN; `GlassDateRangePicker` (581) CONSOLIDATE; no `TimePicker` (`rg` = 0) | `src/components/input/`, `src/components/calendar/GlassCalendar.tsx` | inventory; capability map "Time picker" |

### 2.5 Trees and packaging

| # | Evidence | Path:line | Finding ID |
|---|---|---|---|
| E-32 | `TreeItem` handles only ArrowRight/Left; every enabled item is `tabIndex 0` | `src/components/tree-view/TreeItem.tsx:271,277` (keys), `:352` (`tabIndex 0`); `TreeView.tsx` has no `onKeyDown` | ACCESSIBILITY-13 (CONFIRMED; architecture cites -07) |
| E-33 | Two trees: `GlassTreeView.tsx` (707, `role="tree"` at `:692`) and `tree-view/TreeView.tsx` (248, `:212`); `GlassFileTree.tsx` 637; `GlassTreeSelect` REPLACE | `src/components/data-display/`, `src/components/tree-view/`, `src/components/interactive/`, `src/components/input/` | inventory |
| E-34 | `"./data"` export maps `import` to `./dist/index.mjs` (the root bundle) | `package.json:139-143` | PACKAGING-SSR-DX-06 |
| E-35 | `src/data/index.ts` is `export * from "../components/data-display"` | `src/data/index.ts:1` | — |
| E-36 | `dist/esm/components/dashboard/GlassChartWidget.js:11` imports a CSS file that does not exist | build output | PERFORMANCE-13 / -12 |
| E-37 | `GlassDataTable`, `GlassChart`, `GlassDataChart`, `DataChart`, `GlassDataGrid`, `GlassDataGridPro`, `GlassVirtualTable`, `GlassSparkline`, `GlassTimeline`, `GlassStatCard`, `GlassQueryBuilder`, `GlassFilterBar`, `GlassCalendar`, `GlassDatePicker` are root value exports | `src/index.ts:207`, `:280-282`, `:292-294`, `:314`, `:316`, `:325`, `:425-428`, `:442`, `:460`, `:464` | API-CONSISTENCY-15 |

---

## 3. Desired end state

At 5.0.0 GA:

- `aura-glass/data` is a real build entry with its own types and module graph. It exports exactly: `Table`, `VirtualList` (internal-tier, but exported for PRD-AI and consumers), `TreeView`, `FilterBar`, `useFilterModel`, `serializeFilters`, `parseFilters`, `StatCard`, `Sparkline`, `ChartFrame`, `Timeline`, `ActivityFeed`, and their types. That is 12 value exports owned by this PRD. `./data` additionally exports `KeyValueEditor` (architecture §3.2 `./data` row), which is owned and certified by PRD-14 (`AURAGLASS_COMPONENT_REMEDIATION_PRD.md` REQ-FND-25), so the entry's total is 13 value exports. `tests/exports/data-date-entries.test.ts` asserts the exact 13-name set.
- `aura-glass/date` exports `DateField`, `TimeField`, `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar`, `TimePicker` (a `TimeField` in a Popover; capability-map P1) and the re-exported value helpers `parseDate`, `today`, `toCalendarDate`, `fromDate`, `toDate`. That is 7 components and 5 helpers. **Deviation (explicit):** architecture §3.2 lists 5 `./date` components; `RangeCalendar` (the RA primitive that `DateRangePicker` composes) and `TimePicker` (capability map P1; ledger row X-15 in `AURAGLASS_COMPONENT_EXPANSION_PRD.md` assigns it here) are 2 additional subpath exports, which do not touch the D-15 root ceiling. The §3.2 row needs the same errata as §4.7.
- **No chart.js, react-chartjs-2 or date-fns** anywhere in `aura-glass`. `rg "chart.js|react-chartjs-2|date-fns" src package.json` returns 0. `GlassChart`, `GlassDataChart`, `ModularGlassDataChart` and the rest of `src/components/charts/**` are deleted (about 5,500 + 3,000 lines).
- `Table` is a single headless-core table on `@tanstack/react-table` and `@tanstack/react-virtual` (allowlisted, D-29). It supports sorting, single and multiple selection with Shift-range, column visibility, resize, pinning, controlled and manual (server) pagination, a sticky header, row virtualization to 100,000 rows, and an opt-in `mode="grid"` with APG grid keyboard navigation. It renders on the non-backdrop `content-raised` material (D-08), and only its sticky header is chrome glass.
- `Sparkline`, `StatCard`, `Timeline`, `ActivityFeed` and `ChartFrame`'s static frame are Server Components (no `"use client"`), and render with zero client JS.
- `ChartFrame` gives any chart (consumer-supplied Recharts, visx, chart.js, or the 5.1 `Chart`) the AuraGlass frame: title, description, axis label slots, an accessible legend with `aria-pressed` toggles, a data-table fallback, a categorical palette from tokens, and a typed adapter contract.
- Date components are on React Aria Components (an optional peer, D-13), with values typed by `@internationalized/date` and formatting by `Intl`. They pass the APG date-grid and spinbutton keyboard scripts in Chromium, WebKit and Gecko, and with VoiceOver, NVDA and TalkBack.
- 5.1 ships `aura-glass/charts` (`Chart` with `type="line"|"area"|"bar"|"donut"`) with `d3-scale` and `d3-shape` as optional peers, rendered inside `ChartFrame`. Before 5.1.0, it may be published only on the `next` dist-tag with every export marked `@tier preview`; it is absent from the 5.0.x `latest` exports map (REQ-DATA-75).
- Every 4.x name in this family has a `deprecations.json` entry from 4.2 or 4.3. Surviving names are adapted in `aura-glass/compat`, removed names get `removed` codemod TODOs, and the frozen 4.x consumer fixture passes after `migrate 4to5`.
- All 7 flagships pass the full §15 matrix and have perf grade ≥ C.

---

## 4. Architecture

### 4.1 Layers

```
aura-glass/data, aura-glass/date  (components: DOM, data-ag-part, material roles)
        │ consumes
        ├── Base UI parts (Checkbox, Popover, Menu, Toolbar, ToggleGroup, Dialog) via PRD-07 wrappers
        ├── flagship controls from PRD-08 (Checkbox, Select, Combobox, TextField, NumberField, SegmentedControl, Button, IconButton)
        ├── overlays from PRD-09 (Popover, Sheet, Tooltip, Menu)
        ├── @tanstack/react-table, @tanstack/react-virtual   (dependencies, allowlisted)
        ├── react-aria-components, @internationalized/date    (optional peers: /date, TreeView)
        └── aura-glass/material (Surface, ScrollEdge, data-ag-surface roles) and tokens (PRD-03/04)
```

Rules:

1. `src/data/**` and `src/date/**` import only from `@/material`, `@/primitives`, `@/theme` public modules, the PRD-07 foundation wrappers and the PRD-08/09 flagships. They never import `src/components/**` 4.x files. ESLint `no-restricted-imports` enforces this (REQ-DATA-01).
2. No `backdrop-filter`, blur literal or colour literal in `src/data/**` or `src/date/**`. Optics come only from `data-ag-surface` + `src/material` (§4 lint rule, PRD-04).
3. `react-aria-components` is imported only from `src/date/**` and `src/data/tree-view/**`. A build check fails if any other entry's module graph reaches it (REQ-DATA-03).
4. `d3-scale`/`d3-shape` are imported only from `src/charts/**` (5.1).

### 4.2 Material roles (D-08)

| Part | `data-ag-surface` | Notes |
|---|---|---|
| `Table` root | `content-raised` | no backdrop; counts 0 toward the blurred-surface budget |
| `Table` sticky header (when `stickyHeader` and scrolled) | `chrome`, thickness `thin`, wrapped by `ScrollEdge` | the single blurred surface per Table |
| `Table` row hover, selected | token state layers (`--ag-state-hover`, `--ag-state-selected`) | no optics |
| `TreeView` | `content` | none blurred |
| `FilterBar` | `chrome`, `thin` | the filter popovers use the PRD-09 `Popover` overlay role |
| `StatCard` | `content-raised` | |
| `Sparkline`, `Timeline`, `ActivityFeed` | none (inherit the parent surface) | |
| `ChartFrame` | `content-raised`; the legend uses `content` | |
| `DateField`/`TimeField` | `content-sunken` (the PRD-08 field shell) | |
| `DatePicker`/`DateRangePicker` popup | overlay `regular` via PRD-09 `Popover`; below 640 px container width, PRD-09 `Sheet` (bottom) | |

**Deviation (explicit):** architecture §11.2 gives role `content` for #36 (`Sparkline` + `ChartFrame`) and #37 (`Timeline`/`ActivityFeed`). This PRD sets `ChartFrame` to `content-raised` (it is a standalone panel like `StatCard`, #35, and the REQ-DATA-57 palette contrast is solved against `content-raised`), and lets `Sparkline`/`Timeline`/`ActivityFeed` inherit their parent surface (they are inline content, and a standalone `content` surface would double the fill when nested in a `Card`). Neither choice adds a blurred surface. If the architecture maintainer rejects this, the palette and stroke contrast pairs in REQ-DATA-48/-57 must be re-solved against `content`.

### 4.3 Table design

- `Table<TData>` owns a TanStack `useReactTable` instance. TanStack row models are imported per feature (`getCoreRowModel`, `getSortedRowModel`, `getPaginationRowModel`, `getFilteredRowModel`) so unused models tree-shake. The column definition type is TanStack's `ColumnDef<TData, unknown>`, re-exported as `TableColumnDef<TData>`, extended with the `meta` keys `align`, `numeric`, `truncate` and `headerLabel` (via TanStack `ColumnMeta` declaration merging, scoped in `src/data/table/types.ts`).
- Virtualization: `@tanstack/react-virtual` `useVirtualizer` on the scroll container. Rows use `position: absolute` + `transform: translateY` inside a `<tbody>` with an explicit height. `aria-rowcount` (total) and `aria-rowindex` (1-based, header = 1) keep screen-reader positions correct while rows are windowed.
- Semantics: `mode="table"` (default) renders native `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`, and `aria-sort` on sortable headers. The sort trigger is a `<button>` inside `<th>`. `mode="grid"` renders `role="grid"` with roving `tabIndex` on cells (one tab stop), the APG data-grid keyboard model, and `aria-selected` on rows when selectable.
- **Deviation (explicit):** architecture §11.2 #32 says "RA grid mode if BU lacks one". This PRD specifies an own `useGridKeyboard` hook (target ≤ 2.5 KB gz) instead of RA's `Table`/`GridList`, because RA's collection components own row rendering and do not compose with TanStack Virtual's absolutely positioned rows without double state. The alpha coverage check (PRD-07, D-13) re-tests this choice. If Base UI ships a grid primitive by alpha, the hook is replaced by it. RA remains the TreeView foundation. Evidence: `GlassDataGrid` already proves the table semantics (`GlassDataGrid.tsx:287,334-335`), and only cell navigation is missing.
- Pinning uses `position: sticky` with `inset-inline-start`/`inset-inline-end` offsets computed from TanStack `column.getStart('left')`/`getAfter('right')`, so it works under `dir="rtl"`.
- Resize uses a `<div role="separator" aria-orientation="vertical" aria-valuenow>` handle with pointer events and keyboard (Arrow ±8 px, Shift+Arrow ±32 px). TanStack `columnResizeMode: 'onChange'`, with `onEnd` for virtualized tables larger than 1,000 rows.

### 4.4 ChartFrame and charts (D-21)

- `ChartFrame` is a server frame (`<figure>` + `<figcaption>`) with client islands: `ChartFrame.Legend` (toggle buttons), `ChartFrame.TableToggle`, and `ChartFramePlot` (the measured plot box). The plot area is a `children` render function (client callers only, REQ-DATA-07) or a static node, and the function receives a `ChartContext`.
- The adapter contract is a TypeScript type, not a runtime registry. There are no global side effects, and nothing registers at import time.
- 5.1 `Chart` is own SVG over `d3-scale`/`d3-shape` peers. It renders inside `ChartFrame` and implements `ChartAdapter`. It is server-renderable for static output; hover crosshair and tooltip are a client island.

### 4.5 Date design

- `@internationalized/date` values (`CalendarDate`, `CalendarDateTime`, `ZonedDateTime`, `Time`) are the public value types. Formatting uses `Intl.DateTimeFormat` via RA's `useDateFormatter`. There is no format-string prop.
- Locale and `dir` come from `AuraGlassProvider locale` (PRD-05), forwarded to RA's `I18nProvider` inside `src/date/DateProvider.tsx`. With no provider, the `navigator.language` resolved by RA is used.
- Popover/Sheet: RA `DatePicker` state with a PRD-09 `Popover` (≥ 640 px container) or bottom `Sheet` (< 640 px). Focus moves to the selected or today's cell on open and returns to the trigger on close.
- Missing-peer behaviour: importing `aura-glass/date` without `react-aria-components` installed fails at module resolution. `@auraglass/cli doctor` reports it, and the `deps` codemod adds the peers if `/date` imports are found (REQ-DATA-62).

### 4.6 Filters

- `useFilterModel(schema, options)` is a pure reducer (`useReducer`) over an immutable `FilterNode` tree (`FilterRule | FilterGroup`, `combinator: 'and' | 'or'`). It is the fix for E-25.
- `FilterBar` renders the top-level rules as chips, quick filters as a PRD-08 `SegmentedControl`/toggle group, and a rule editor in a PRD-09 `Popover`.
- **Deviation (explicit):** the visual nested-group `QueryBuilder` is not a core export. It ships as the registry item `query-builder` (D-17 pattern) built on `useFilterModel`. Reason: D-15 caps exports, §11.2 lists no QueryBuilder flagship, and the capability map ranks it P2. The headless model is core, so the registry item has no private logic.

### 4.7 Subpath placement of Timeline and ActivityFeed

Architecture §11.2 lists `Timeline`/`ActivityFeed` under "Data (6, `./data`)", while §12 maps them to `.` (root), and §3.2's `./data` row omits them. This PRD follows §11.2: they are exported from `./data` only, which keeps the root under D-15's 160-export ceiling. The §3.2 and §12 rows need a one-line errata in the architecture document (owner: the architecture maintainer; tracked in §19).

---

## 5. Exact implementation requirements

Each requirement is testable. "Test:" names the file in §12 that proves it.

### 5.1 Entry, packaging and dependencies

- **REQ-DATA-01** `src/data/**`, `src/date/**` and `src/charts/**` must not import any path under `src/components/**`, `src/hooks/**` (4.x) or `src/utils/dateAdapters.ts`. Enforced by ESLint `no-restricted-imports` in `eslint.config.*` (PRD-02 owns the config file; this PRD supplies the pattern list). Test: `tests/data/boundaries.test.ts`.
- **REQ-DATA-02** The `./data` and `./date` `exports` entries resolve to `dist/data/index.js` and `dist/date/index.js` with matching `types`. Neither may resolve to the root bundle (fixes E-34). Test: `tests/exports/data-date-entries.test.ts`, which spawns `node --input-type=module -e "console.log(import.meta.resolve('aura-glass/data'))"` against the packed tarball installed in a temp fixture (Jest 29 runs CJS, where `import.meta` is unavailable) and asserts the result ends in `/dist/data/index.js`, `require.resolve` for the `require` condition, and that `@arethetypeswrong/cli` (NEW devDependency via the PRD-02 allowlist PR) reports zero problems for both entries.
- **REQ-DATA-03** The module graph of `aura-glass` (root) and `aura-glass/data` excluding `src/data/tree-view/**` contains no `react-aria-components`, `@internationalized/date`, `d3-scale` or `d3-shape`. Test: `tests/exports/data-peer-isolation.test.ts`, which walks the esbuild metafile for `import { Table } from 'aura-glass/data'` and for `import { Button } from 'aura-glass'`.
- **REQ-DATA-04** `package.json` has no `chart.js`, `react-chartjs-2` or `date-fns` in `dependencies`, `peerDependencies` or `optionalDependencies` at 5.0.0-beta.1. `@tanstack/react-table` and `@tanstack/react-virtual` are in `dependencies` with exact pins, recorded in `docs/dependency-allowlist.json` (owner PRD-PKG, created by PKG-056; this PRD supplies the footprint, licence (MIT) and remote-measured bundle delta by MODIFY, SC-14). Test: `scripts/ci/verify-deps.mjs` (PRD-PKG, PKG-057) plus `tests/data/no-chart-deps.test.ts` (`rg`-equivalent scan of `src/` and `package.json`).
- **REQ-DATA-05** `react-aria-components` and `@internationalized/date` are `peerDependencies` with `peerDependenciesMeta.<name>.optional = true`. The ranges are the current minor at 5.0.0-alpha.1 (a caret range on that minor), recorded in the allowlist PR. They are not chosen here because the RAC version at alpha is unknown. Test: `tests/exports/peer-meta.test.ts`.
- **REQ-DATA-06** Importing any `./data` or `./date` module in jsdom adds no event listeners, intervals, rAF loops, `<style>` tags or `<html>` mutations (side-effect gate, §3.3). Test: the PRD-PKG side-effect gate `scripts/ci/verify-side-effects.mjs` (PKG-042, OV-24), which already iterates every entry; this PRD adds the `./data` and `./date` expectations by MODIFY.
- **REQ-DATA-07** `Sparkline`, `StatCard`, `Timeline`, `ActivityFeed` and `ChartFrame` (root part, `ChartFrame.tsx`) files have no `"use client"` directive and no hooks. `Table`, `TreeView`, `FilterBar`, `ChartFrame.Legend`, `ChartFrame.TableToggle`, `ChartFramePlot` (the measured plot box that owns the REQ-DATA-53 `ResizeObserver` and calls the `children` render function) and every `./date` component file starts with `"use client"`. Because functions cannot cross the server→client boundary, the render-function form of `ChartFrame` `children` is only valid when the caller is itself a client component; a Server Component caller passes a static node (rendered at `height` with no measured `width`). A dev error fires when a function child reaches `ChartFramePlot` from a server render. Test: `tests/rsc/data-directives.test.ts` (static scan) plus the Next 16 canary page `canaries/next16/app/data-server/page.tsx` (NEW file inside the PRD-PKG canary app `canaries/next16/`, PKG-121/122) that renders the five server components inside a Server Component and asserts zero client chunks reference them.

### 5.2 Table (flagship 32)

- **REQ-DATA-10** `Table<TData>` props (exact names): `data: TData[]`; `columns: TableColumnDef<TData>[]`; `getRowId?: (row: TData, index: number) => string` (required when `selectionMode !== 'none'`; dev warning otherwise); `caption?: ReactNode`, or `aria-label`/`aria-labelledby` (one is required; dev warning); `sorting`/`defaultSorting`/`onSortingChange`; `enableMultiSort?: boolean` (default `false`; Shift+click adds); `selectionMode?: 'none' | 'single' | 'multiple'` (default `'none'`); `rowSelection`/`defaultRowSelection`/`onRowSelectionChange`; `columnVisibility`/`onColumnVisibilityChange`; `columnSizing`/`onColumnSizingChange`; `enableColumnResizing?: boolean`; `columnPinning`/`onColumnPinningChange`; `pagination`/`defaultPagination`/`onPaginationChange`; `manualPagination?: boolean`; `manualSorting?: boolean`; `rowCount?: number`; `virtualize?: boolean | { estimateRowHeight?: number; overscan?: number }`; `stickyHeader?: boolean` (default `true` when `virtualize`); `density?: 'compact' | 'normal' | 'comfortable'` (default `'normal'`); `mode?: 'table' | 'grid'` (default `'table'`); `loading?: boolean`; `emptyState?: ReactNode`; `onRowAction?: (row: TData) => void`; `maxHeight?: number | string`; `ref?: Ref<TableHandle<TData>>`. Controlled and uncontrolled both work for every state pair. Test: `src/data/table/Table.test.tsx`.
- **REQ-DATA-11** `TableHandle<TData>` exposes `getInstance(): Table<TData>` (TanStack), `scrollToRow(rowId: string, align?: 'start' | 'center' | 'end' | 'auto'): void` and `focusCell(rowId: string, columnId: string): void` (grid mode only). React 19 `ref` as a prop, with no `forwardRef` (PRD-07 pattern). Test: `Table.test.tsx` "handle".
- **REQ-DATA-12** Sorting: header activation cycles `none → asc → desc → none` for a column with `enableSorting`, for string **and** numeric columns. TanStack's default is not this: with `sortDescFirst` unset, `getAutoSortDir()` returns `'desc'` for non-string first-row values, so numeric columns would start descending. `Table` therefore passes `sortDescFirst: false` and `enableSortingRemoval: true` in its `useReactTable` options; a column may override with TanStack's column-level `sortDescFirst: true`. The `<th>` carries `aria-sort="ascending" | "descending" | "none"` only when sortable; the button inside carries an accessible name of "Sort by {headerLabel}". A sort change is announced through the provider announcer (PRD-05) as "Sorted by {label}, ascending". Test: `Table.test.tsx` "sorting" (includes a numeric column: first activation yields `aria-sort="ascending"`), `tests/a11y/apg/table.apg.spec.ts` (SC-30; uses the PRD-A11Y harness `tests/a11y/apg/harness.ts`).
- **REQ-DATA-13** Selection: `multiple` adds a leading checkbox column built on the PRD-08 `Checkbox`, with a header tri-state checkbox (`checked | indeterminate`) labelled "Select all rows". Shift+click and Shift+Space select a contiguous range between the last anchor and the target, on the current sorted row model. `single` uses `aria-selected` on rows with no checkbox column. Test: `Table.test.tsx` "range selection" (anchor row 2, Shift-click row 6 → 5 selected).
- **REQ-DATA-14** Virtualization: with `virtualize` and 10,000 rows in a 600 px tall container at `density="normal"` (row 40 px), the DOM holds at most `ceil(600/40) + 2 × overscan` rows (overscan default 8, so ≤ 31 `<tr>` in `<tbody>`). `<table>` carries `aria-rowcount={rowCount ?? data.length + 1}`; each rendered `<tr>` carries `aria-rowindex`. Test: `Table.virtual.test.tsx` (jsdom with mocked `getBoundingClientRect`) and `tests/data/table.virtual.spec.ts` (real browser scroll to row 9,000, asserting `aria-rowindex="9001"` exists and the DOM row count stays ≤ 31).
- **REQ-DATA-15** Column resize: the handle is `role="separator"`, `aria-orientation="vertical"`, `aria-valuenow` (px), `aria-valuemin` (column `minSize`, default 48), `aria-valuemax` (`maxSize`, default 800), focusable, and named "Resize {headerLabel}". ArrowLeft/Right change width by 8 px, Shift+Arrow by 32 px, and Home/End jump to min/max. In RTL, ArrowLeft grows the column. Test: `Table.resize.test.tsx`.
- **REQ-DATA-16** Pinning: pinned columns stay visible under horizontal scroll in LTR and RTL. The last left-pinned cell carries `data-ag-pinned-edge="start"` and gets a token shadow (`--ag-table-pin-shadow`). Test: `tests/data/table.pinning.spec.ts` (scroll 2,000 px, bounding box of the pinned column unchanged ±1 px).
- **REQ-DATA-17** Grid mode keyboard (APG data grid): one tab stop; Arrow keys move between cells; Home/End move to the first/last cell in the row; Ctrl+Home/Ctrl+End move to the first/last cell of the grid; PageUp/PageDown move by the visible row count (and scroll virtualized rows into the DOM first); Enter on a cell calls `onRowAction`; Space toggles row selection when `selectionMode !== 'none'`; focus is never lost when a row unmounts under virtualization (focus target re-resolved by `rowId` + `columnId`). Test: `tests/a11y/apg/table.apg.spec.ts` "grid".
- **REQ-DATA-18** States: `loading` renders `aria-busy="true"` on the `<table>` and 8 skeleton rows (PRD-FND `Skeleton`, FND-059) without removing existing rows. Zero rows renders `emptyState` inside a single `<td colSpan>` with `data-ag-part="table-empty"`. Test: `Table.test.tsx` "states".
- **REQ-DATA-19** DOM contract: `data-ag-part` values `table-root`, `table-scroller`, `table-header`, `table-header-cell`, `table-sort-trigger`, `table-resize-handle`, `table-body`, `table-row`, `table-cell`, `table-selection-cell`, `table-empty`, `table-loading`. Rows carry `data-selected`, `data-row-id` and `data-state="loading"` when applicable. Header cells carry `data-sorted="asc" | "desc"`. Snapshot of the attribute set in `Table.dom-contract.test.tsx`.
- **REQ-DATA-20** Density sets `--ag-table-row-height` to 32 / 40 / 48 px and `--ag-table-cell-padding-inline` to 8 / 12 / 16 px. Under `@media (pointer: coarse)`, the minimum row height is 44 px regardless of density (touch target). Tokens are generated by PRD-03 (`table.row-height.*`). Test: `Table.test.tsx` "density" (computed style) and `tests/data/table.responsive.spec.ts` (coarse pointer emulation).
- **REQ-DATA-21** Numeric columns (`meta.numeric: true`) render `text-align: end` and `font-variant-numeric: tabular-nums`. Test: `Table.test.tsx` "numeric".
- **REQ-DATA-22** No hook is called conditionally anywhere in `src/data/**` (fixes E-13). Enforced by `react-hooks/rules-of-hooks` as an error. `eslint-plugin-react-hooks` is already a devDependency (`package.json:461`, `^4.6.0`) but is **not registered** in `eslint.config.js` (its `plugins` block holds only `auraglass`), so this PRD supplies a flat-config block `{ files: ['src/data/**', 'src/date/**', 'src/charts/**'], plugins: { 'react-hooks': reactHooks }, rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' } }` (PRD-PKG owns the file and its wiring, PKG-015; this PRD edits by MODIFY). Test: L1 Static lane (fails on a seeded conditional-hook fixture) plus `Table.test.tsx` "toggling every boolean prop does not throw" (rerenders each boolean prop false→true→false).

### 5.3 VirtualList (internal tier, consumed by PRD-AI)

- **REQ-DATA-25** `VirtualList<T>` props: `items: T[]`, `getItemKey: (item: T, index: number) => string`, `renderItem: (item: T, index: number) => ReactNode`, `estimateSize: number | ((index: number) => number)`, `overscan?: number` (default 6), `orientation?: 'vertical' | 'horizontal'`, `anchor?: 'start' | 'end'` (`'end'` keeps the scroll pinned to the bottom when items append, for `Thread`), `onEndReached?: () => void` with `endReachedThreshold?: number` (px, default 200), `role?: 'list' | 'log' | 'listbox'`, `ref?: Ref<VirtualListHandle>` (`scrollToIndex`, `scrollToKey`). Built on `@tanstack/react-virtual` `useVirtualizer` with `measureElement` for dynamic heights. Test: `src/data/virtual-list/VirtualList.test.tsx`.
- **REQ-DATA-26** `VirtualList` starts no rAF loop and no interval when idle (fixes E-19). Test: `VirtualList.test.tsx` "idle" spies on `requestAnimationFrame` after settle (0 calls in 500 ms with fake timers).

### 5.4 TreeView (flagship 33)

- **REQ-DATA-30** `TreeView<T>` is built on RA `Tree`/`TreeItem`. Props: `items: Iterable<T>` with `getKey`, `getChildren`, `getTextValue`; or static `TreeView.Item` children; `selectionMode?: 'none' | 'single' | 'multiple'`; `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange`; `expandedKeys`/`defaultExpandedKeys`/`onExpandedChange`; `disabledKeys`; `onAction?: (key) => void`; `renderItem?: (item: T, state: { level; isExpanded; isSelected; hasChildren }) => ReactNode`; `loadChildren?: (item: T) => Promise<T[]>` (shows `aria-busy` on the item while loading); `preset?: 'default' | 'files'` (the `files` preset adds folder/file icons from `./icons`, replacing `GlassFileTree`); `aria-label` or `aria-labelledby` (required). Test: `src/data/tree-view/TreeView.test.tsx`.
- **REQ-DATA-31** Keyboard (APG tree view): one tab stop; Up/Down move; Right expands a closed parent or moves to the first child; Left collapses an open parent or moves to the parent; Home/End; `*` expands all siblings; type-ahead on printable characters, matching `getTextValue` prefixes within 1,000 ms; Enter calls `onAction`; Space toggles selection. `aria-level`, `aria-setsize`, `aria-posinset` and `aria-expanded` are present on every `treeitem` (fixes E-32). Test: `tests/a11y/apg/tree-view.apg.spec.ts`.
- **REQ-DATA-32** With `virtualize`, the visible flattened tree is windowed through `VirtualList`, and a 5,000-node fully expanded tree renders ≤ 40 `treeitem` elements in a 480 px container. Test: `tests/data/tree-view.virtual.spec.ts`. If RA `Tree` virtualization (RA `Virtualizer`) is used instead, the same assertion applies.

### 5.5 FilterBar and the filter model (flagship 34)

- **REQ-DATA-35** Types: `FilterField = { id: string; label: string; type: 'text' | 'number' | 'date' | 'date-range' | 'enum' | 'multi-enum' | 'boolean'; options?: { value: string; label: string }[]; operators?: FilterOperator[] }`. Default operators per type: text `contains | equals | starts-with | is-empty`; number `= | != | < | <= | > | >= | between`; date `on | before | after | between`; enum `is | is-not`; multi-enum `any-of | none-of`; boolean `is`. An operator not valid for the field type is a TypeScript error (`FilterRule<F>` is generic over the field) and a runtime dev warning. Test: `src/data/filter-bar/filter-model.test.ts` plus `src/data/filter-bar/filter-model.types.ts` (type tests: `// @ts-expect-error` cases compiled by `tsc --noEmit` in the type-check lane, since the repo runs Jest 29, not Vitest).
- **REQ-DATA-36** `useFilterModel(schema, { value?, defaultValue?, onValueChange? })` returns `{ value: FilterGroup; addRule; updateRule; removeRule; addGroup; removeGroup; setCombinator; clear }`. Every action returns a new tree, and the input objects are never mutated (fixes E-25). Test: `filter-model.test.ts` runs every action against an `Object.freeze`-deep-frozen input and asserts no throw and referential inequality of the changed path only.
- **REQ-DATA-37** `serializeFilters(group): URLSearchParams` and `parseFilters(schema, params): FilterGroup` round-trip losslessly for every field type, ignore unknown field ids, and drop invalid operators with a dev warning. Test: `filter-model.test.ts` "round-trip" over a fixed table of 40 cases (fast-check is not in the repo's devDependencies, and it is not added for this).
- **REQ-DATA-38** `FilterBar` props: `schema`, `value`/`defaultValue`/`onValueChange` (a `FilterGroup` whose top level is shown), `search?: { value; onValueChange; placeholder }` (PRD-08 `SearchField`), `quickFilters?: { id; label; rule: FilterRule }[]` (rendered as a toggle group, `aria-pressed`), `onClearAll?`, `resultCount?: number` (announced politely on change: "{n} results"). Each active rule is a chip with a remove `IconButton` named "Remove filter {field label} {operator} {value}". Editing a chip opens a PRD-09 `Popover` with focus on the first field and returns focus to the chip on close. Test: `src/data/filter-bar/FilterBar.test.tsx`, `tests/a11y/apg/filter-bar.apg.spec.ts`.
- **REQ-DATA-39** Registry item `query-builder` at `registry/items/query-builder/` (SC-32 layout; PRD-DX owns `registry/registry.json`, build, lint and publishing) renders nested groups with `useFilterModel`, has zero inline hex, `!important` or layout literals, and passes `scripts/registry/lint.mjs` (DX-070) and the PRD-DX registry render harness `tests/dx/registry-render.spec.ts` (DX-094). `scripts/ci/verify-recipes-render.js` is deleted by DX-100 and is not used (SC-39). Test: the registry render harness.

### 5.6 StatCard (flagship 35)

- **REQ-DATA-42** `StatCard` props: `label: ReactNode` (required); `value: number | ReactNode`; `format?: Intl.NumberFormatOptions` (applied when `value` is a number); `locale?: string`; `delta?: number`; `deltaFormat?: Intl.NumberFormatOptions` (default `{ style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 }`); `deltaLabel?: string` (default "vs previous period"); `trendDirection?: 'up-is-good' | 'down-is-good' | 'neutral'` (default `'up-is-good'`); `sparkline?: number[]` (renders a `Sparkline`); `description?: ReactNode`; `loading?: boolean`; `href?: string` or `asChild` (the whole card becomes one link; nested interactive children are a dev error). Server Component. Test: `src/data/stat-card/StatCard.test.tsx`.
- **REQ-DATA-43** Trend is never colour-only (WCAG 1.4.1): an arrow glyph (`aria-hidden`) plus visually hidden text "Up 12.5% vs previous period" or "Down …" or "No change …". Intent colour is `success`/`danger`/`neutral` per `trendDirection`, from tokens, with ≥ 4.5:1 text contrast on `content-raised` in light and dark (L4 Token contrast). `StatCard` renders its final value statically and contains no tweening `AnimatedNumber` (SC-38; this PRD owns the decision). Test: `StatCard.test.tsx` "trend text", L4 Token contrast.
- **REQ-DATA-44** The markup is `<article>` (or `<a>` when linked) with `aria-labelledby` pointing at the label. `value` uses `font-variant-numeric: tabular-nums`. Server and client render the same string for the same `locale` (no `toLocaleString()` without an explicit locale, to avoid hydration mismatch). Test: `tests/rsc/data-hydration.test.tsx` (`renderToString` → `hydrateRoot`, zero warnings, with `locale="de-DE"`).

### 5.7 Sparkline (flagship 36a)

- **REQ-DATA-47** `Sparkline` props: `data: number[]` (`null` gaps allowed: `(number | null)[]`); `variant?: 'line' | 'area' | 'bar'` (default `'line'`); `width?: number | string` (default `'100%'`); `height?: number` (default 32); `intent?: 'neutral' | 'primary' | 'success' | 'danger'`; `min?: number`; `max?: number`; `showLastPoint?: boolean`; `label: string` (required unless `aria-hidden`). Server Component. Own linear scale (≤ 60 lines in `src/data/sparkline/scale.ts`), no d3. Test: `src/data/sparkline/Sparkline.test.tsx`.
- **REQ-DATA-48** Accessibility: `<svg role="img" aria-label>` where the label is `"{label}: {n} points, from {first} to {last}, low {min}, high {max}"` (numbers formatted with `Intl.NumberFormat` and the provider locale). The stroke has ≥ 3:1 non-text contrast against `content-raised` in light and dark (fixes the 1.9:1 in E-23). The stroke uses `vector-effect: non-scaling-stroke` at 1.5 px. Test: `Sparkline.test.tsx` "label", L4 Token contrast `sparkline.stroke` pair, pixel gate OCR not applicable (non-text). Under `forced-colors: active`, the stroke is `CanvasText`. Test: `tests/data/data.forced-colors.spec.ts`.
- **REQ-DATA-49** Degenerate input: an empty array renders an empty `<svg>` with label "{label}: no data". One point renders a dot. All-equal values render a horizontal line at mid-height. `NaN`/`Infinity` are treated as gaps, with a dev warning. Test: `Sparkline.test.tsx` "degenerate".

### 5.8 ChartFrame and the adapter contract (flagship 36b, D-21)

- **REQ-DATA-52** `ChartFrame<TRow>` props: `title: ReactNode` (required; rendered in `<figcaption>`); `description?: ReactNode`; `data: TRow[]`; `series: { key: keyof TRow & string; label: string; colorIndex?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; format?: Intl.NumberFormatOptions }[]`; `x: { key: keyof TRow & string; label: string; format?: (v: TRow[keyof TRow]) => string }`; `yLabel?: string`; `hiddenSeries`/`defaultHiddenSeries`/`onHiddenSeriesChange` (`string[]`); `legend?: 'top' | 'bottom' | 'none'` (default `'bottom'`); `table?: 'toggle' | 'visually-hidden' | 'always'` (default `'toggle'`); `height?: number` (default 240); `children: ReactNode | ((ctx: ChartContext<TRow>) => ReactNode)`. Test: `src/data/chart-frame/ChartFrame.test.tsx`.
- **REQ-DATA-53** `ChartContext<TRow>` is `{ width: number; height: number; data: TRow[]; visibleSeries: Series[]; color(seriesKey: string): string /* resolves to var(--ag-chart-N) */; formatX; formatY; reducedMotion: boolean; dir: 'ltr' | 'rtl' }`. `width` and `height` come from a single `ResizeObserver` on the plot box (one observer per frame, disconnected on unmount). On the server, `width` is `undefined` and adapters must render a placeholder of `height` px (no layout shift: CLS contribution 0). Test: `ChartFrame.test.tsx` "context", "observer cleanup".
- **REQ-DATA-54** `ChartAdapter<TRow>` type: `(ctx: ChartContext<TRow>) => ReactNode`. Docs ship three verified adapter examples (Recharts, visx, chart.js 4 with *locally scoped* registration inside the component, never module scope). None of those libraries is a dependency, peer or devDependency of `aura-glass`. The examples are compiled in the docs type-check lane against pinned versions in the docs app only. Test: `apps/docs` type-check (PRD-DX, DX-101) plus `tests/data/no-chart-deps.test.ts`.
- **REQ-DATA-55** Legend: each series is a `<button aria-pressed>` (pressed = visible) with a colour swatch and a text label, so it is not colour-only. Hiding the last visible series is prevented (button `aria-disabled`, with tooltip "At least one series must be visible"). Test: `ChartFrame.test.tsx` "legend".
- **REQ-DATA-56** Table fallback: a real `<table>` with `<caption>` = title, a header row (x label + series labels) and one row per datum, formatted with each series' `format`. Under `'toggle'`, a "Show data table" button (`aria-expanded`, `aria-controls`) swaps the plot for the table. Under `'visually-hidden'`, the table is always in the accessibility tree and the plot is `aria-hidden`. Test: `ChartFrame.test.tsx` "table fallback"; `tests/data/chart-frame.sr.spec.ts` asserts the accessibility tree has the table under each mode.
- **REQ-DATA-57** Palette: 8 categorical tokens `--ag-chart-1` … `--ag-chart-8`, generated by PRD-03 per scheme. Each has ≥ 3:1 contrast against `content-raised` (WCAG 1.4.11). Adjacent indices 1–4 are distinguishable under deuteranopia, protanopia and tritanopia simulation with ΔE2000 ≥ 15 between any two. Saturation is not grey: OKLCH chroma ≥ 0.08 for indices 1–6 (fixes E-09). Test: `tests/tokens/chart-palette.test.ts` (L4 Token contrast; PRD-DS generates the tokens, this PRD supplies the thresholds and the test).

### 5.9 Timeline and ActivityFeed (flagship 37)

- **REQ-DATA-60** `Timeline` props: `items: { id: string; timestamp: Date | string /* ISO 8601 */; title: ReactNode; description?: ReactNode; icon?: ReactNode; intent?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'; meta?: ReactNode }[]`; `orientation?: 'vertical' | 'horizontal'`; `timeFormat?: 'relative' | 'absolute' | Intl.DateTimeFormatOptions` (default `'absolute'`); `now?: Date` (required when `timeFormat === 'relative'` on the server; dev error otherwise, to prevent hydration mismatch); `locale?: string`. Markup: `<ol>` of `<li>`, with `<time dateTime={iso}>`. Server Component. Intent is shown by icon + text, never colour alone. Test: `src/data/timeline/Timeline.test.tsx`.
- **REQ-DATA-61** `ActivityFeed` extends `Timeline` items with `actor?: { name: string; avatarUrl?: string }` and adds `groupBy?: 'day' | 'none'` (day headings are `<h3>` by default, configurable `headingLevel`), `onLoadMore?: () => void`, `hasMore?: boolean`, `loading?: boolean`. With `onLoadMore`, a client island renders a "Load more" `Button` (no infinite scroll by default; `autoLoad` opts into `IntersectionObserver`, one observer, disconnected on unmount). New items prepended while mounted are announced via a polite live region at most once per 2 s (batched: "3 new activities"). Test: `src/data/timeline/ActivityFeed.test.tsx`.

### 5.10 Date and time (flagship 14, `./date`)

- **REQ-DATA-62** All `./date` components are built on RA Components (`DateField`, `TimeField`, `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar`), styled with AuraGlass parts through RA's `className`/render-prop state, and use PRD-09 `Popover`/`Sheet` for the popup. If `react-aria-components` cannot be resolved, the `deps` codemod and `doctor` report "aura-glass/date requires react-aria-components and @internationalized/date". Test: `src/date/DatePicker.test.tsx`; `@auraglass/cli` doctor fixture (PRD-DX, `packages/cli/src/commands/doctor.ts`, DX-035).
- **REQ-DATA-63** Common props (exact names, RA-aligned): `value`/`defaultValue`/`onValueChange` (the §11.1 selection convention). Internally `onValueChange` is wired to RA's `onChange`, and RA's `onChange` is omitted from the public props type so there is exactly one change callback. Other props (RA-aligned names): `minValue`, `maxValue`, `isDateUnavailable`, `granularity` (`'day' | 'hour' | 'minute' | 'second'`), `hourCycle` (`12 | 24`), `firstDayOfWeek` (`'sun' … 'sat'`), `locale` override, `label`, `description`, `errorMessage`, `isInvalid`, `isRequired`, `isDisabled`, `isReadOnly`, `name` (form submission as ISO string), `size: 'sm' | 'md' | 'lg'` (the PRD-08 field scale). Test: `src/date/date-props.test.tsx`.
- **REQ-DATA-64** `Calendar` keyboard (APG date grid): `role="grid"` with `gridcell`s; one tab stop on the focused date; Arrow keys ±1 day / ±7 days; Home/End to the start/end of the week; PageUp/PageDown ±1 month; Shift+PageUp/PageDown ±1 year; Enter/Space select; `aria-selected` on selected cells; the month heading is a polite live region; unavailable dates are `aria-disabled="true"` and remain focusable (fixes E-27). Test: `tests/a11y/apg/calendar.apg.spec.ts`.
- **REQ-DATA-65** `DatePicker` popup: the trigger is a `Button` named "Choose date" with the current value in `aria-describedby`; the popup is `role="dialog"` with `aria-label` = the field label; focus moves to the selected or today's cell on open; Escape closes and returns focus to the trigger; below a 640 px container width it is a bottom `Sheet`. Test: `tests/a11y/apg/date-picker.apg.spec.ts`, `tests/date/date-picker.responsive.spec.ts`.
- **REQ-DATA-66** `DateRangePicker` adds `presets?: { label: string; value: { start: DateValue; end: DateValue } }[]` rendered as a `listbox` beside (≥ 640 px) or above (< 640 px) the `RangeCalendar`, and `visibleMonths?: 1 | 2` (default 2 at ≥ 768 px container width, 1 below). Test: `src/date/DateRangePicker.test.tsx`.
- **REQ-DATA-67** `showWeekNumbers` renders ISO-8601 week numbers as `rowheader` cells, computed by `src/date/week-number.ts` (NEW), and correct for the 2020-W53 and 2026-W53 boundary cases (fixes the fake week numbers). Test: `src/date/week-number.test.ts` (20 fixed cases, including 2020-12-31 → W53, 2021-01-03 → W53, 2021-01-04 → W1).
- **REQ-DATA-68** `TimePicker` = `TimeField` + a `Popover` with hour/minute `listbox` columns (step via `minuteStep?: 1 | 5 | 10 | 15 | 30`, default 5). Test: `src/date/TimePicker.test.tsx`, `tests/a11y/apg/time-picker.apg.spec.ts`.
- **REQ-DATA-69** No `Date.prototype.toLocale*String()` call and no implicit time zone in `src/date/**`. The server and client render identical text for a given `locale` and `timeZone` (from the provider or props). Lint rule `no-restricted-properties` for `toLocaleDateString`/`toLocaleString`/`toLocaleTimeString` in `src/date/**`, `src/data/**`. Test: `tests/rsc/data-hydration.test.tsx` "date". A single Jest process has one `TZ`, so the test spawns a child Node process with `TZ=Pacific/Kiritimati` (UTC+14) that runs `renderToString` and writes the HTML to a temp file; the Jest worker itself runs with `TZ=Pacific/Pago_Pago` (UTC−11, set in the lane's env, not via `process.env` at runtime) and calls `hydrateRoot` on that HTML in jsdom, asserting zero `console.error` hydration warnings.

### 5.11 Charts in 5.1 (`./charts`, D-21)

- **REQ-DATA-72** `Chart<TRow>` props: everything in `ChartFrame` (it renders inside one) plus `type: 'line' | 'area' | 'bar' | 'donut'`; `stacked?: boolean` (area, bar); `orientation?: 'vertical' | 'horizontal'` (bar); `curve?: 'linear' | 'monotone' | 'step'` (line, area; maps to `d3-shape` `curveLinear`/`curveMonotoneX`/`curveStep`); `yDomain?: [number, number] | 'auto'`; `grid?: boolean`; `tooltip?: boolean` (a client island: crosshair + PRD-09 `Tooltip`-styled overlay, shared across series). Data shape is one shape: rows + `x` + `series` (resolves the three shapes in E-08). Test: `src/charts/Chart.test.tsx`.
- **REQ-DATA-73** `d3-scale` and `d3-shape` are optional peers (`peerDependenciesMeta.optional`) of `aura-glass` and are imported only by `src/charts/**`. `import { Chart } from 'aura-glass/charts'` without them fails at resolution with a `doctor` hint. Test: `tests/exports/data-peer-isolation.test.ts` "charts".
- **REQ-DATA-74** Keyboard: the plot is one tab stop, `role="group"` with `aria-roledescription="chart"` and `aria-labelledby` = the frame title (never `role="application"`). Left/Right move a focused-datum cursor across x values, and the current x value plus every visible series value is announced via `aria-live="polite"` (debounced 150 ms). Test: `tests/charts/chart.keyboard.spec.ts`.
- **REQ-DATA-75** Before 5.1.0, `aura-glass/charts` may publish on `next` with every export tagged `@tier preview` (§11.1). It must not appear in the 5.0.0 `latest` exports map. Test: `tests/exports/data-date-entries.test.ts` "no charts entry in 5.0.0".

### 5.12 Removal and migration support

- **REQ-DATA-78** 4.2 (release scope and gates held by PRD-REL as interim owner of §16 PRD-17, SC-37; content owned here): entries (C-D) in the repo-root `deprecations.json` (SC-02: envelope `version: 1` seeded by TRUST-075; schema `docs/schemas/deprecations.schema.json`, REL-010; this PRD only adds entries by MODIFY) for every 4.x name in §9 with `replacement`, `codemod` (one of the SC-33 ids or null) and `docs` fields. Dev-only warnings fire once per symbol per page load at call time. chart.js, react-chartjs-2 and date-fns move from `dependencies` to optional peers. `ChartJS.register` and the `defaults.*` writes in `GlassDataChart.tsx:649-745` and `ChartRenderer.tsx:36` move inside the component's first render (`useState` initializer guarded by a module-level `registered` flag), and the `defaults.plugins.tooltip.enabled = false` write is deleted (it becomes a per-chart `options.plugins.tooltip.enabled = false`). This is C-I with a visible behaviour fix for consumers' own charts (their tooltips come back), labelled as a bug fix per D-28. Test: `src/components/charts/GlassDataChart.globals.test.tsx` (NEW, 4.x branch) asserts `Chart.defaults.plugins.tooltip.enabled === true` after importing `aura-glass`.
- **REQ-DATA-79** 4.2: `src/utils/dateAdapters.ts` replaces `require(packageName)` with `await import()` behind an explicit async `loadDateAdapter()`, and the root no longer imports date-fns eagerly (304 → 0 modules on root import). Test: `tests/exports/root-no-date-fns.test.ts` (4.x branch; esbuild metafile of `import { GlassButton } from 'aura-glass'` has 0 `date-fns` inputs).
- **REQ-DATA-80** 5.0: `aura-glass/compat` exports the surviving 4.x names `GlassDataTable`, `GlassDataGrid`, `GlassVirtualTable`, `GlassTreeView`, `TreeView` (4.x), `GlassFileTree`, `GlassFileExplorer`, `GlassFilterBar`, `GlassStatCard`, `GlassKPICard`, `GlassMetricCard`, `GlassAnimatedNumber`, `GlassSparkline`, `GlassTimeline`, `GlassActivityFeed`, `GlassDateField`, `GlassTimeField`, `GlassDatePicker`, `GlassDateRangePicker`, `GlassCalendar` as prop adapters onto the 5.0 components (mapping table in §10.3). Adapters live at `src/compat/data/<OldName>.tsx` and `src/compat/date/<OldName>.tsx`, are re-exported from `src/compat/index.ts` (PRD-DX, DX-065) and call `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (PRD-REL, REL-072) (SC-34). Date adapters convert `Date` ↔ `CalendarDate` at the boundary. Chart names and `GlassTimelineRail` are not in compat (no engine to adapt to; this PRD owns that disposition, SC-34). Test: `src/compat/__tests__/data.compat.test.tsx` renders each adapter with its 4.x story's props and asserts the 5.0 component renders and one dev warning fires.
- **REQ-DATA-81** Codemod tables for `npx @auraglass/cli migrate 4to5` (engine owned by PRD-DX, DX-041/042; ids owned by PRD-REL, SC-33). This PRD supplies data only, through the `migration` fields of its `<Component>.meta.ts` files, from which `scripts/release/gen-deprecations.mjs --codemods` (REL-070) generates `packages/cli/src/migrate/4to5/mappings/*.json`. Core ids used: `canonical-names` maps every name above; `prop-grammar` maps `rows → data` (VirtualTable). For `GlassDataGrid`'s `ColumnDefinition` (`src/components/data-display/types.ts:6-18`): `key → accessorKey`, `label → header`, `sortable → enableSorting`, `width → size` (numbers only; strings get a TODO), `render`/`cellRenderer → cell` (wrapped as `({ getValue, row }) => render(getValue(), row.original)`), `align → meta.align` (`left|right → start|end`). For `GlassDataTable`'s `ColumnDef` (`GlassDataTable.tsx:55-67`): `sortable → enableSorting`, `filterable → enableColumnFilter`, `width → size`, and `cell({ row, value })` wrapped the same way. Table props: `compact → density="compact"`, `selectable` + `selectionMode` → `selectionMode`, `selectedRows`/`onSelectionChange` → `rowSelection`/`onRowSelectionChange` (array of ids → `Record<id, true>`, wrapped), `onRowClick → onRowAction`, `emptyMessage → emptyState`. `GlassDatePicker` (`GlassDatePicker.tsx` props): `onChange → onValueChange`, `minDate/maxDate → minValue/maxValue`, `disabledDates → isDateUnavailable`, `disabled → isDisabled`, `required → isRequired`, `error → isInvalid`, `helperText → description`, `mode="range"` → `DateRangePicker`, and `format` (a date-fns string) is removed with `// TODO(aura-glass 5): date format is locale-driven, see docs/migration/date.md`. `removed` covers every chart export with a `ChartFrame` + adapter pointer; `deps` adds `chart.js`/`react-chartjs-2`/`date-fns` to the consumer's `package.json` where the consumer imports them directly. Each transform has ≥ 1 fixture per 4.x name. Test: `packages/cli/src/migrate/4to5/__fixtures__/<id>/data-*/{input,output}.*` (SC-33; NEW case directories inside the PRD-DX fixture tree, run by the DX-041 engine tests).

---

## 6. Files/directories affected (existing paths)

All paths were verified with `rg --files` at HEAD `15b6de6f7`.

| Path | Change | Release |
|---|---|---|
| `package.json` | `dependencies`: remove `chart.js` (`:491`), `date-fns` (`:495`), `react-chartjs-2` (`:504`) (4.2 → optional peers; 5.0 → gone); add `@tanstack/react-table`, `@tanstack/react-virtual` (exact pins); add optional peers `react-aria-components`, `@internationalized/date` (PRD-PKG PKG-059 adds them; this PRD confirms ranges); 5.1 add optional peers `d3-scale`, `d3-shape`. `exports` is generated from `build/exports.manifest.json` (PRD-PKG, PKG-005, SC-12): this PRD MODIFYs the manifest rows `./data` (`:139-143` today points at the root bundle), `./date`, `./data.css`, `./date.css`, and 5.1 `./charts`, `./charts.css` | 4.2, 5.0, 5.1 |
| `src/data/index.ts` | Rewritten from the 4.x barrel (`export * from "../components/data-display"`) to the 5.0 `./data` entry | 5.0 |
| `src/index.ts` | Remove root exports `:207` (`GlassDatePicker`), `:280-282` (`GlassChart`, `GlassDataChart`, `DataChart`), `:292-294`, `:314`, `:316`, `:325`, `:425-428`, `:442`, `:460`, `:464`, and the type exports at `:1154`, `:1178`, `:1181`, `:1192` (`ChartDataset`). They move to `compat` or are removed per §9 | 5.0 |
| `src/components/charts/GlassDataChart.tsx` | 4.2: lazy, scoped registration; delete global `defaults` writes (`:649-745`) | 4.2 |
| `src/components/charts/components/ChartRenderer.tsx` | 4.2: move `ChartJS.register` (`:36`) inside the component | 4.2 |
| `src/utils/dateAdapters.ts` | 4.2: `require` → `import()` (`:43-45`); 5.0: deleted | 4.2, 5.0 |
| `src/components/input/GlassDatePicker.tsx`, `GlassDateRangePicker.tsx`, `GlassDateField.tsx`, `GlassTimeField.tsx`, `src/components/calendar/GlassCalendar.tsx` | 4.3: C-D warning; 5.0: deleted from `src/components`, adapters in `src/compat` | 4.3, 5.0 |
| `src/components/data-display/GlassDataTable.tsx`, `GlassDataGrid.tsx` (+ `.module.css`, 217 lines, whose token approach is reused), `GlassDataGridPro.tsx`, `GlassVirtualTable.tsx`, `GlassSparkline.tsx`, `GlassTimeline.tsx`, `GlassTreeView.tsx`, `GlassMetricChip.tsx`, `GlassMetricsGrid.tsx` | 4.2/4.3: C-D; 5.0: deleted, with compat adapters for the survivors | 4.2–5.0 |
| `src/components/dashboard/GlassStatCard.tsx`, `GlassKPICard.tsx`, `GlassMetricCard.tsx`, `GlassActivityFeed.tsx`, `GlassChartWidget.tsx` | as above | 4.3, 5.0 |
| `src/components/interactive/GlassFilterBar.tsx`, `GlassFilterPanel.tsx`, `GlassQueryBuilder.tsx`, `GlassVirtualList.tsx`, `GlassFileTree.tsx`, `GlassFacetSearch.tsx`, `GlassFileExplorer.tsx`, `GlassInfiniteScroll.tsx`; `src/components/data-display/GlassAnimatedNumber.tsx` | as above | 4.3, 5.0 |
| `src/components/tree-view/TreeView.tsx`, `TreeItem.tsx` (+ `.module.css`) | as above | 4.3, 5.0 |
| `src/components/input/GlassTreeSelect.tsx`, `GlassFormTable.tsx` | deleted (TreeSelect becomes a registry item on `Select` + `TreeView`; FormTable is DEPRECATE with no successor in core) | 5.0 |
| `src/components/templates/interactive/GlassDataTable.tsx`, `src/components/templates/dashboard/widgets/{ChartWidget,MetricWidget,TableWidget}.tsx`, `src/components/templates/list/GlassListView.tsx` | deleted (unexported duplicates, E-18) | 5.0 (PRD-16 executes) |
| `src/hooks/useVirtualization.ts`, `src/hooks/extended/useSortableData.ts` | deleted, replaced by TanStack | 5.0 |
| `src/animations/physics/chartAnimations.ts` | deleted (no importer) | 5.0 (PRD-16) |
| `src/components/data-display/index.ts` | data exports removed | 5.0 |
| `src/registry/recipes.ts` | removed by NAV-136 (SC-38, OV-30). This PRD only supplies the replacement: the chart recipe CSS (`:160-163`, with `!important` at `:161`, `:163`) has no successor, and the dashboard recipe is re-authored as the content of the GA registry blocks `analytics-dashboard` and `data-workspace` (SC-32; PRD-DX scaffolds and registers them, DX-073/074) | 5.0 |
| `scripts/ci/verify-tree-shaking.js` | not used: deleted by PKG-054 (SC-39). This PRD adds its per-import rows to `docs/size-budgets.json` (PKG-048), gated by `scripts/ci/verify-size-budgets.mjs` (PKG-049) (§16, SC-15) | 5.0 |
| `docs/migration/` | add `date.md`, `data-table.md`, `charts.md` (NEW files in an existing directory) | 4.3 |
| `deprecations.json` (repo root; SC-02) | MODIFY: add the §9 entries (REQ-DATA-78). The file is seeded by TRUST-075 and validated by `docs/schemas/deprecations.schema.json` (REL-010) | 4.2, 4.3 |
| `.storybook/preview.tsx` | no change by this PRD; the file and the 8-scene `environment` global belong to PRD-SB (SB-048, SC-31) | — |

---

## 7. Components affected

| 4.x component (path) | Inventory disposition | 5.0 outcome |
|---|---|---|
| `GlassDataTable` (`src/components/data-display/GlassDataTable.tsx`) | REDESIGN, flagship candidate | → `Table` (compat adapter); Conscious/Predictive/GazeResponsive/Accessible variants and `DataTableConsciousnessPresets` removed |
| `GlassDataGrid` (`data-display/GlassDataGrid.tsx`) | CONSOLIDATE | → `Table` (compat adapter); row drag dropped (Kanban/dnd-kit registry item covers reorder use) |
| `GlassDataGridPro` (`data-display/GlassDataGridPro.tsx`) | REMOVE | removed; `removed` codemod → `Table` |
| `GlassVirtualTable` (`data-display/GlassVirtualTable.tsx`) | DEPRECATE | → `Table virtualize` (compat adapter) |
| `GlassVirtualList` (+ `GlassVirtualGrid`) (`interactive/GlassVirtualList.tsx`) | REPLACE | → `VirtualList`; `GlassVirtualGrid` removed |
| `TableWidget`, templates `GlassDataTable` | CONSOLIDATE / REMOVE | removed (unexported) |
| `GlassListView` (`templates/list/GlassListView.tsx`) | REDESIGN | registry item `list-view` (`registry/items/list-view/`) on `Table` + `Toolbar` + `SegmentedControl`; not a GA block (SC-32) |
| `GlassTreeView`, `TreeView`/`TreeItem`, `GlassFileTree` | CONSOLIDATE | → `TreeView` (`preset="files"` for FileTree) |
| `GlassTreeSelect` (`input/GlassTreeSelect.tsx`) | REPLACE | registry item `tree-select` |
| `GlassFilterBar` | POLISH | → `FilterBar` |
| `GlassFilterPanel` (REDESIGN), `GlassFacetSearch` (CONSOLIDATE) | REDESIGN / CONSOLIDATE | → `FilterBar` + `useFilterModel`; facet panel becomes registry item `faceted-search` |
| `GlassQueryBuilder` | REDESIGN | → `useFilterModel` + registry item `query-builder` |
| `GlassStatCard`, `GlassKPICard`, `GlassMetricCard`, `MetricWidget`, `KpiChart`, `GlassMetricChip` | CONSOLIDATE | → `StatCard` (chip use → T2 `Badge`/`Chip`, PRD-14) |
| `GlassMetricsGrid` | REDESIGN | removed; docs show `StatCard` in T2 `Grid` |
| `GlassAnimatedNumber` (+ `GlassAnimatedCounter`, `GlassAnimatedStat`, `useAnimatedNumber`) (`data-display/GlassAnimatedNumber.tsx`) | REDESIGN | absorbed into the `StatCard` family by this PRD (`prd/appendix/component-dispositions.md` row 155: successor `StatCard`, owner PRD-11); `StatCard` renders its final value statically (server, 0 client JS) and does not tween in 5.0. `AURAGLASS_MOTION_PRD.md` REQ-MOT-34 assumed a tweening `AnimatedNumber` inside `StatCard`; SC-38 decides for this PRD (static, no tween; MOT drops StatCard as a consumer, AnimatedNumber is registry/compat only) |
| `GlassInfiniteScroll` (`interactive/GlassInfiniteScroll.tsx`) | POLISH (overridden: no §11 slot) | removed; successor `VirtualList` `onEndReached` (REQ-DATA-25) and `ActivityFeed` `autoLoad` (REQ-DATA-61) (component-dispositions row 286) |
| `GlassFileExplorer` (`interactive/GlassFileExplorer.tsx`) | REDESIGN | → `TreeView preset="files"` (component-dispositions row 275) |
| `GlassSparkline` | POLISH | → `Sparkline` |
| `GlassChart` (+ Conscious/Predictive/Adaptive/Immersive variants) | REDESIGN | removed in 5.0; successor `ChartFrame` + adapter (5.0) and `Chart` (5.1) |
| `GlassDataChart`/`DataChart`, `ModularGlassDataChart` | DEPRECATE / REMOVE | removed |
| `GlassLineChart`, `GlassBarChart`, `GlassAreaChart`, `GlassPieChart` (+ `GlassDonutChart`, `GlassChartContainer`) | CONSOLIDATE | removed in 5.0; `Chart type=` in 5.1 |
| `charts/components/*` (`ChartAxis`, `ChartContainer`, `ChartFilters`, `ChartGrid`, `ChartLegend`, `ChartRenderer`, `ChartTooltip`, `AtmosphericEffects`, `KpiChart`), `charts/styles/*`, `charts/hooks/*`, `charts/plugins/*`, `charts/utils/*`, `charts/types/*` | REMOVE / CONSOLIDATE | removed; legend and table fallback live in `ChartFrame` |
| `GlassChartWidget`, `ChartWidget` | CONSOLIDATE | removed; `ChartFrame` is the panel |
| `GlassAdvancedDataViz` (`visualization/GlassAdvancedDataViz.tsx`), `GlassChartsDemo` (`website-components/`) | CONSOLIDATE / REMOVE | removed |
| `GlassHeatmap` (`data-display/GlassHeatmap.tsx`) | REDESIGN | not in 5.0 core; a 5.x `Chart type="heatmap"` candidate (Preview) |
| `GlassGanttChart` (`data-display/GlassGanttChart.tsx`) | DEPRECATE | registry item (D-17, §13.5) |
| `GlassTimeline`, `GlassActivityFeed`, `GlassTimelineRail` (`src/workspace/index.tsx`) | POLISH / REDESIGN / CONSOLIDATE | → `Timeline`, `ActivityFeed`. `GlassTimelineRail` has no compat adapter; `src/workspace/index.tsx` is deleted by NAV-124 |
| `GlassDateField`, `GlassTimeField` | KEEP (visuals kept per §11.2 #14) | → `DateField`, `TimeField` on RA; the field visuals are carried over through the PRD-08 field shell |
| `GlassDatePicker` | REDESIGN, flagship candidate | → `DatePicker` |
| `GlassDateRangePicker` | CONSOLIDATE | → `DateRangePicker` |
| `GlassCalendar` | REDESIGN | → `Calendar`, `RangeCalendar` |
| `GlassFormTable` | DEPRECATE | removed (no inline-cell-editing successor in 5.0; tracked as a 5.x `Table` C-E candidate) |

---

## 8. New components/files

All paths below are NEW. Directory layout: one folder per component, colocated test, story and CSS.

| Path | Contents |
|---|---|
| `src/data/index.ts` (rewritten) | `./data` entry: 12 value exports owned here + types (§3), plus the re-export of PRD-14's `KeyValueEditor` |
| `src/data/table/Table.tsx` | `Table` (client) |
| `src/data/table/useTableState.ts` | controlled/uncontrolled state pairs → TanStack options |
| `src/data/table/useGridKeyboard.ts` | grid-mode roving focus (REQ-DATA-17) |
| `src/data/table/types.ts` | `TableColumnDef`, `TableHandle`, `ColumnMeta` augmentation |
| `src/data/table/table.css` | `@layer ag.components` rules; `data-ag-part` selectors only |
| `src/data/table/Table.test.tsx`, `Table.virtual.test.tsx`, `Table.resize.test.tsx`, `Table.dom-contract.test.tsx`, `Table.stories.tsx` | tests and stories |
| `src/data/virtual-list/VirtualList.tsx`, `VirtualList.test.tsx`, `VirtualList.stories.tsx` | `VirtualList` |
| `src/data/tree-view/TreeView.tsx`, `tree-view.css`, `TreeView.test.tsx`, `TreeView.stories.tsx` | RA-based `TreeView` |
| `src/data/filter-bar/FilterBar.tsx`, `filter-model.ts`, `filter-serialize.ts`, `filter-model.types.ts`, `filter-bar.css`, `FilterBar.test.tsx`, `filter-model.test.ts`, `FilterBar.stories.tsx` | `FilterBar`, `useFilterModel`, `serializeFilters`, `parseFilters` |
| `src/data/stat-card/StatCard.tsx`, `stat-card.css`, `StatCard.test.tsx`, `StatCard.stories.tsx` | `StatCard` (server) |
| `src/data/sparkline/Sparkline.tsx`, `scale.ts`, `Sparkline.test.tsx`, `Sparkline.stories.tsx` | `Sparkline` (server) |
| `src/data/chart-frame/ChartFrame.tsx`, `ChartFrameLegend.tsx` (client), `ChartFrameTable.tsx`, `ChartFrameTableToggle.tsx` (client), `ChartFramePlot.tsx` (client), `types.ts` (`ChartContext`, `ChartAdapter`), `chart-frame.css`, `ChartFrame.test.tsx`, `ChartFrame.stories.tsx` | `ChartFrame` |
| `src/data/timeline/Timeline.tsx`, `ActivityFeed.tsx`, `ActivityFeedLoadMore.tsx` (client), `timeline.css`, tests, stories | `Timeline`, `ActivityFeed` |
| `src/data/data.css` | concatenation target for `./data.css` |
| `src/date/index.ts` | `./date` entry |
| `src/date/DateProvider.tsx` | `I18nProvider` bridge from `AuraGlassProvider` locale |
| `src/date/DateField.tsx`, `TimeField.tsx`, `DatePicker.tsx`, `DateRangePicker.tsx`, `Calendar.tsx`, `RangeCalendar.tsx`, `TimePicker.tsx` | components |
| `src/date/week-number.ts`, `week-number.test.ts` | ISO week numbers |
| `src/date/date.css` | `./date.css` |
| `src/date/*.test.tsx`, `src/date/*.stories.tsx` | tests and stories |
| `src/charts/index.ts`, `src/charts/Chart.tsx`, `src/charts/marks/{Line,Area,Bar,Donut}.tsx`, `src/charts/ChartTooltip.tsx` (client), `src/charts/charts.css`, tests, stories | 5.1 `./charts` |
| `src/compat/data/<OldName>.tsx`, `src/compat/date/<OldName>.tsx`, `src/compat/__tests__/data.compat.test.tsx` | compat adapters (D-18, SC-34); `src/compat/index.ts` is created by PRD-DX (DX-065) and re-exports them |
| `tests/data/*.spec.ts`, `tests/date/*.spec.ts`, `tests/charts/*.spec.ts` (non-APG browser specs), `tests/a11y/apg/{table,tree-view,filter-bar,calendar,date-picker,time-picker}.apg.spec.ts` (APG specs owned here, harness by PRD-A11Y), `tests/perf/browser/data-*.spec.ts`, `tests/visual/data/`, `tests/rsc/data-*.test.ts(x)`, `tests/exports/data-*.test.ts` | §12 (SC-30 layout) |
| `docs/migration/date.md`, `docs/migration/data-table.md`, `docs/migration/charts.md` | migration guides (generated sections from `deprecations.json`, PRD-REL generator REL-070) |
| Registry items under `registry/items/<id>/`: `query-builder`, `tree-select`, `faceted-search`, `list-view`, `gantt`. Content of GA blocks `registry/blocks/analytics-dashboard/` (StatCard row + Sparkline + ChartFrame + Timeline) and `registry/blocks/data-workspace/` (Table + FilterBar + TreeView + StatCard) | content owned here; PRD-DX owns the scaffold, `registry/registry.json` (DX-067), lint (DX-070), build and the render harness (SC-32) |

---

## 9. Components/files to remove or deprecate

| Item | C-D since | Removed from root | In `compat` (until 6.0) | Successor |
|---|---|---|---|---|
| `GlassChart` + `ConsciousGlassChart`, `PredictiveGlassChart`, `AdaptiveGlassChart`, `ImmersiveGlassChart`, `withChartConsciousness`, `ChartConsciousnessPresets` | 4.2 | 5.0 | no | `ChartFrame` + adapter; 5.1 `Chart` |
| `GlassDataChart`, `DataChart`, type `ChartDataset` | 4.2 | 5.0 | no | same |
| `ModularGlassDataChart` + variants | 4.2 | 5.0 | no | same |
| `GlassLineChart`, `GlassBarChart`, `GlassAreaChart`, `GlassPieChart`, `GlassDonutChart`, `GlassChartContainer` | 4.2 | 5.0 | no | 5.1 `Chart type=` |
| `src/components/charts/**` (87 files, 20,567 lines by `wc -l`, including stories and tests) | 4.2 | 5.0 | — | — |
| `GlassChartWidget`, `GlassAdvancedDataViz`, `GlassChartsDemo` | 4.2 | 5.0 | no | `ChartFrame` |
| `chart.js`, `react-chartjs-2` (deps) | 4.2 (→ optional peer) | 5.0 | — | consumer-installed if they keep chart.js |
| `date-fns` (dep), `src/utils/dateAdapters.ts` | 4.2 (→ optional peer, lazy) | 5.0 | — | `Intl` + `@internationalized/date` |
| `GlassDataTable` (+ Conscious/Predictive/GazeResponsive/Accessible variants, `DataTableConsciousnessPresets`) | 4.3 (name); 4.2 (variants) | 5.0 | `GlassDataTable` yes; variants no | `Table` |
| `GlassDataGrid` | 4.3 | 5.0 | yes | `Table` |
| `GlassDataGridPro` | 4.2 | 5.0 | no | `Table` |
| `GlassVirtualTable` | 4.2 | 5.0 | yes | `Table virtualize` |
| `GlassVirtualList`, `GlassVirtualGrid`, `useVirtualization` | 4.3 | 5.0 | `GlassVirtualList` yes | `VirtualList` |
| `GlassTreeView`, `TreeView`/`TreeItem`/`GlassTreeItem` (4.x), `GlassFileTree` | 4.3 | 5.0 | yes | `TreeView` |
| `GlassFileExplorer` | 4.3 | 5.0 | yes (component-dispositions row 275) | `TreeView preset="files"` |
| `GlassInfiniteScroll` | 4.3 | 5.0 | no | `VirtualList` `onEndReached` |
| `GlassAnimatedNumber`, `GlassAnimatedCounter`, `GlassAnimatedStat`, `useAnimatedNumber` | 4.3 | 5.0 | `GlassAnimatedNumber` yes (renders the formatted final value) | `StatCard` / `Intl.NumberFormat` |
| `GlassTreeSelect`, `GlassFormTable` | 4.2 | 5.0 | no | registry `tree-select`; none |
| `GlassFilterBar` | 4.3 | 5.0 | yes | `FilterBar` |
| `GlassFilterPanel`, `GlassFacetSearch`, `GlassQueryBuilder` | 4.3 | 5.0 | no (data model changes) | `FilterBar`/`useFilterModel`; registry `faceted-search`, `query-builder` |
| `GlassStatCard`, `GlassKPICard`, `GlassMetricCard` | 4.3 | 5.0 | yes | `StatCard` |
| `GlassMetricChip`, `GlassMetricsGrid`, `KpiChart` | 4.3 | 5.0 | no | `StatCard`, T2 `Chip` |
| `GlassSparkline` | 4.3 | 5.0 | yes | `Sparkline` (full codemod) |
| `GlassTimeline`, `GlassActivityFeed`, `GlassTimelineRail` | 4.3 | 5.0 | first two yes | `Timeline`, `ActivityFeed` |
| `GlassHeatmap`, `GlassGanttChart` | 4.2 | 5.0 | no | 5.x Preview `Chart`; registry `gantt` |
| `GlassDateField`, `GlassTimeField`, `GlassDatePicker`, `GlassDateRangePicker`, `GlassCalendar` | 4.3 | 5.0 | yes (Date ↔ CalendarDate adapter) | `./date` |
| Unexported: `templates/interactive/GlassDataTable.tsx`, `templates/dashboard/widgets/*`, `templates/list/GlassListView.tsx`, `src/hooks/extended/useSortableData.ts`, `src/animations/physics/chartAnimations.ts` | n/a (not public) | deleted in 5.0 (PRD-16 PRs) | no | — |

Each removal family is one revertable PR (§14.6): (1) charts + chart.js; (2) tables + virtualization; (3) trees; (4) filters/query; (5) stat/sparkline/timeline; (6) date + date-fns. The PRs run through the PRD-FND removal gate (`.github/workflows/removal-gate.yml`, FND-102/107/108; consumer grep `scripts/removal/consumer-grep.mjs`, FND-103). Family (1) is the PRD-FND squash PR RM-07 (FND-127), which is the single remover of `src/components/charts/**` and the chart.js deps; this PRD's task verifies it. `GlassTimelineRail` leaves with NAV-124 (`src/workspace/index.tsx`).

---

## 10. API changes

### 10.1 By release and compatibility class

| # | Change | Release | Class |
|---|---|---|---|
| A-01 | chart.js registration moves inside the component; consumer-global `Chart.defaults` are no longer written | 4.2 | C-I (behaviour bug fix: consumer tooltips re-enabled; labelled per D-28) |
| A-02 | `chart.js`, `react-chartjs-2`, `date-fns` move from `dependencies` to optional peers | 4.2 | C-D (install-level; `deps` codemod and `doctor` mitigate silent breaks, §3.4) |
| A-03 | `dateAdapters` uses `import()`; the root stops importing date-fns eagerly | 4.2 | C-I |
| A-04 | Dev warnings + `deprecations.json` for all chart names, `GlassDataGridPro`, `GlassVirtualTable`, consciousness table variants, `GlassTreeSelect`, `GlassFormTable`, `GlassHeatmap`, `GlassGanttChart` | 4.2 | C-D |
| A-05 | Dev warnings for the remaining names in §9 (prefix drop and consolidation losers) | 4.3 | C-D |
| A-06 | `aura-glass/data` becomes a real entry with the 5.0 export set; the 4.x `./data` barrel (re-export of `components/data-display`) is gone | 5.0 | C-B |
| A-07 | New entry `aura-glass/date` | 5.0 | C-E |
| A-08 | Removal of all names in §9 from root | 5.0 | C-B (B3, B5) |
| A-09 | `Table` column type is TanStack `ColumnDef` (`accessorKey`, `header`, `cell`, `enableSorting`, `size`) instead of `ColumnDefinition`/4.x `ColumnDef` | 5.0 | C-B (B6; `prop-grammar` partial) |
| A-10 | Date value types change from `Date` to `@internationalized/date` (`CalendarDate` etc.); `format` prop removed | 5.0 | C-B (compat adapter converts `Date`) |
| A-11 | `Table` default material changes from blurred glass to `content-raised` | 5.0 | C-B (B12) |
| A-12 | Table DOM: native `<table>` in table mode, `role="grid"` in grid mode, new `data-ag-part` contract | 5.0 | C-B (B10; selector table in docs) |
| A-13 | `aura-glass/charts` with `Chart`; `d3-scale`/`d3-shape` optional peers | 5.1 | C-E |
| A-14 | Post-GA additions to flagship APIs (for example `Table` inline editing, `groupBy`) | 5.x | C-E only (flagships frozen at rc.1) |

### 10.2 New public API (summary; full signatures in §5)

```ts
// aura-glass/data
export function Table<TData>(props: TableProps<TData>): JSX.Element;
export type TableColumnDef<TData> = ColumnDef<TData, unknown>; // from @tanstack/react-table
export interface TableHandle<TData> { getInstance(): TanStackTable<TData>; scrollToRow(id: string, align?: 'start'|'center'|'end'|'auto'): void; focusCell(rowId: string, columnId: string): void; }
export function VirtualList<T>(props: VirtualListProps<T>): JSX.Element;
export function TreeView<T>(props: TreeViewProps<T>): JSX.Element;
export function FilterBar<S extends FilterSchema>(props: FilterBarProps<S>): JSX.Element;
export function useFilterModel<S extends FilterSchema>(schema: S, opts?: FilterModelOptions<S>): FilterModel<S>;
export function serializeFilters(group: FilterGroup): URLSearchParams;
export function parseFilters<S extends FilterSchema>(schema: S, params: URLSearchParams): FilterGroup;
export function StatCard(props: StatCardProps): JSX.Element;       // server
export function Sparkline(props: SparklineProps): JSX.Element;     // server
export function ChartFrame<TRow>(props: ChartFrameProps<TRow>): JSX.Element; // server frame + client islands
export type ChartAdapter<TRow> = (ctx: ChartContext<TRow>) => React.ReactNode;
export function Timeline(props: TimelineProps): JSX.Element;       // server
export function ActivityFeed(props: ActivityFeedProps): JSX.Element; // server + client island

// aura-glass/date
export { DateField, TimeField, DatePicker, DateRangePicker, Calendar, RangeCalendar, TimePicker };
export { parseDate, today, toCalendarDate, fromDate, toDate } from '@internationalized/date';

// aura-glass/charts (5.1)
export function Chart<TRow>(props: ChartProps<TRow>): JSX.Element;
```

Every component documents its `@tier` (Certified) and typed variant metadata (`density`, `mode`, `variant`, `intent`) for the Lab matrix (§11.3).

### 10.3 Compat prop adapters (`aura-glass/compat`, 5.x, removed in 6.0)

| 4.x name | Adapter maps | Not mapped (dev warning, prop ignored) |
|---|---|---|
| `GlassDataTable` | `columns` (4.x `ColumnDef` → TanStack), `sortable`, `pagination` + `initialPageSize` + `pageSizeOptions`, `selectable`/`selectionMode`/`selectedRows`/`onSelectionChange`, `onRowClick`, `getRowId`, `compact`, `maxHeight`, `loading`, `emptyMessage` | `variant`, `size`, `searchable`/`searchPlaceholder` (use `FilterBar`), `filterable`, `contained`, `maxWidth`, `showFooter`, `getRowProps`, every consciousness prop |
| `GlassDataGrid` | `data`, `columns` (`ColumnDefinition`), `sortable`, `initialSort`, `onSort`, `compact`, `maxHeight` | `enableRowDragging`, `onRowOrderChange`, `intent`, `elevation`, `tier`, `contained`, `maxWidth` |
| `GlassVirtualTable` | `rows → data`, then as `GlassDataTable`, with `virtualize` on | — |
| `GlassDatePicker` | `value`/`defaultValue` (`Date` ↔ `CalendarDate`), `onChange`, `minDate`, `maxDate`, `disabledDates`, `disabled`, `required`, `error`, `errorMessage`, `helperText`, `showWeekNumbers`, `firstDayOfWeek`, `locale`, `mode="range"` + `rangeValue`/`onRangeChange` → `DateRangePicker` | `format`, `renderDate`, `showTodayButton`, `showClearButton`, `placeholder` |
| `GlassStatCard`, `GlassKPICard`, `GlassMetricCard` | `title`/`label`, `value`, `change`/`delta`, `trend`, `sparkline` data | animation, icon-glow and intent-elevation props |
| Others in §9 marked "yes" | name + `onChange → onValueChange` + the SC-24 prop grammar (`variant` = `regular | clear | identity`, status via `intent`, no `material` prop) and `size` | per the generated adapter report |

The exact 4.x prop names for the stat cards are captured by PRD-DX's AST extraction; the table above lists the intent and is regenerated from the API report (`etc/api/index.api.md`, PRD-REL `scripts/release/api-report.mjs`, SC-04) before 4.3.

---

## 11. Migration concerns

1. **Silent dependency breaks (highest risk).** Consumers who imported `chart.js`, `react-chartjs-2` or `date-fns` without declaring them break at 4.2 (when the deps become optional peers) or 5.0. Mitigation: `doctor` (4.2) reports undeclared direct imports; the `deps` codemod adds them; the 4.2 and 5.0 release notes list these three packages first; the frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (owner PRD-REL, REL-115, SC-08) must include one file that imports `date-fns` directly to prove the warning path (requested from REL; §21 OI-15).
2. **Consumer chart.js behaviour change in 4.2.** Removing the global `defaults.plugins.tooltip.enabled = false` write turns tooltips back on in consumers' own chart.js charts. This is the intended fix, but it is a visible change on a maintenance line. Per D-27/D-28 it ships labelled as a bug fix with reviewer approval, a before/after composite of a consumer-style chart.js chart, and a release-note entry naming `Chart.defaults`.
3. **No chart successor at 5.0 GA.** Users of `GlassChart`/`GlassDataChart` must choose: stay on 4.x LTS (12 months), wrap their own library in `ChartFrame` (documented adapters for Recharts, visx, chart.js), or wait for 5.1 `Chart`. `docs/migration/charts.md` gives a `GlassDataChart` → `ChartFrame` + chart.js adapter example that preserves `datasets`/`labels`, so the shortest path keeps the same engine.
4. **Column definitions.** The two 4.x column types map mostly mechanically (§5.12 REQ-DATA-81). Custom `cell` renderers that read `value` need the wrapper; the codemod inserts it and leaves a TODO where the renderer reads other row fields by index.
5. **Date values.** `Date` objects become `CalendarDate`/`ZonedDateTime`. Time-zone bugs are the risk: a `Date` at local midnight converted in a UTC server process shifts by one day. The compat adapter converts with `fromDate(date, getLocalTimeZone())` on the client only, and in Server Components requires an explicit `timeZone` (dev error otherwise). `docs/migration/date.md` has the conversion table.
6. **Format strings.** `format="MM/dd/yyyy"` has no 5.0 equivalent; display follows the locale. Apps that require a fixed display format set `locale` (for example `en-US`). The codemod leaves a TODO, never a guess.
7. **Material change on tables.** Tables lose blurred glass (D-08, B12). Apps that want glass over media set `variant="regular"` on a wrapping `Surface`, which is documented as an explicit opt-in. The 4.3 `data-ag-preview="v5"` preview does not cover data components (D-19 covers only the six primitives), so the first visual preview of `Table` is 5.0.0-beta on `next`.
8. **Selectors and tests.** Consumer CSS or tests targeting 4.x class names (`.glass-data-table-*`, `glass-surface-primary` on calendar days) break. The selector change table (4.x selector → 5.0 `data-ag-part`/`data-state`) is generated per component and published in `docs/migration/data-table.md` and `date.md` (§11.3 deliverable).
9. **React Aria peer.** `/date` consumers must install `react-aria-components` and `@internationalized/date`. If D-13's alpha check finds Base UI coverage sufficient, the `react-aria-components` peer is dropped before beta. `@internationalized/date` stays as the value-type peer, so the public value types do not change.
10. **Rollback.** Per §14.6: tables, date and charts are separate removal PRs, so any one can be reverted on `next` without the others.

---

## 12. Tests required

Unit tests run in Jest 29 (the repo's runner, `package.json:269`). Every `*.spec.ts` under `tests/` is Playwright (`@playwright/test`, `package.json:422`) and runs **remotely** in the PRD-19 lanes (CI or remote runners), never on a developer Mac. All files are NEW.

Runner wiring (required; without it these files run in the wrong runner or not at all). At HEAD, `playwright.config.ts` `testMatch` is only `e2e/**/*.spec.ts` and `visual/**/*.spec.ts`, and `jest.config.js` `testMatch` includes `**/*.{spec,test}.{ts,tsx}` while ignoring only `tests/e2e/` and `tests/visual`. So: (1) add `data/**/*.spec.ts`, `date/**/*.spec.ts` and `charts/**/*.spec.ts` to `playwright.config.ts` `testMatch`; (2) add `'<rootDir>/tests/(data|date|charts)/.*\\.spec\\.ts$'` to `jest.config.js` `testPathIgnorePatterns`. PRD-QA owns both configs and `certification/playwright.cert.config.ts` (QA-003, QA-018; SC-29, OV-22); this PRD edits them only by MODIFY that depends on those anchors, and a lane check fails if `jest --listTests` lists any `tests/(data|date|charts)/*.spec.ts` or `playwright test --list` omits one. APG specs live in `tests/a11y/apg/` (SC-30) and run in L5 Behaviour through `certification/lanes/behaviour.spec.ts` (QA-082), so they need no `testMatch` entry here. (3) The repo's devDependencies pin `react`/`react-dom` `18.2.0` and `@types/react ^18.2.0` (`package.json:471-472`, `:449`); REQ-DATA-11's ref-as-prop and every jsdom test here require the React 19 bump owned by PRD-PKG (PKG-018, D-02) to land first.

### 12.1 Unit and contract (Jest, jsdom)

| File | Asserts |
|---|---|
| `src/data/table/Table.test.tsx` | REQ-DATA-10/11/12/13/18/21/22: controlled and uncontrolled state pairs; the sort cycle and `aria-sort`; range selection (anchor 2 → Shift row 6 = 5 rows); header tri-state; loading keeps rows and sets `aria-busy`; empty state; numeric alignment; toggling every boolean prop does not throw; dev warning when neither `caption` nor `aria-label` is given |
| `src/data/table/Table.virtual.test.tsx` | REQ-DATA-14: ≤ 31 rendered rows for 10,000 rows at 600 px; `aria-rowcount`/`aria-rowindex` |
| `src/data/table/Table.resize.test.tsx` | REQ-DATA-15: separator ARIA; Arrow ±8, Shift ±32, Home/End; RTL inversion |
| `src/data/table/Table.dom-contract.test.tsx` | REQ-DATA-19: the full `data-ag-part` set and `data-*` state attributes (inline snapshot; any change is a C-B diff flagged by the change-class lane) |
| `src/data/virtual-list/VirtualList.test.tsx` | REQ-DATA-25/26: `anchor="end"` keeps scroll at the bottom on append; `onEndReached` fires once per threshold crossing; 0 rAF calls when idle |
| `src/data/tree-view/TreeView.test.tsx` | REQ-DATA-30: controlled expansion/selection; `loadChildren` sets `aria-busy`; `preset="files"` icons are `aria-hidden` |
| `src/data/filter-bar/filter-model.test.ts` | REQ-DATA-36/37: deep-frozen inputs never mutated; structural sharing; 40-case serialize/parse round-trip; unknown ids ignored |
| `src/data/filter-bar/filter-model.types.ts` | REQ-DATA-35: `// @ts-expect-error` for invalid operator/field pairs (compiled in the type-check lane) |
| `src/data/filter-bar/FilterBar.test.tsx` | REQ-DATA-38: chip remove names; `resultCount` announcement; quick filters `aria-pressed` |
| `src/data/stat-card/StatCard.test.tsx` | REQ-DATA-42/43/44: `Intl` formatting per `locale`; trend text for up/down/flat × the three `trendDirection` values; `<a>` when `href`; dev error for nested interactive content |
| `src/data/sparkline/Sparkline.test.tsx` | REQ-DATA-47/48/49: computed `aria-label`; path for known input (snapshot of `d`); degenerate inputs; `null` gaps split the path |
| `src/data/chart-frame/ChartFrame.test.tsx` | REQ-DATA-52/53/55/56: context shape; one `ResizeObserver`, disconnected on unmount; legend `aria-pressed` and the last-visible guard; table fallback rows and formatting under all three `table` modes |
| `src/data/timeline/Timeline.test.tsx`, `ActivityFeed.test.tsx` | REQ-DATA-60/61: `<ol>`/`<time dateTime>`; relative format without `now` throws a dev error on the server; batched announcements (3 items within 2 s → one message) |
| `src/date/DatePicker.test.tsx`, `DateRangePicker.test.tsx`, `TimePicker.test.tsx`, `date-props.test.tsx` | REQ-DATA-62/63/66/68: the prop surface; `onValueChange` fires with `CalendarDate`; presets; `name` submits ISO; `minuteStep` |
| `src/date/week-number.test.ts` | REQ-DATA-67: 20 fixed ISO-week cases |
| `src/compat/__tests__/data.compat.test.tsx` | REQ-DATA-80: each adapter renders the 5.0 component from its 4.x story props, with exactly one dev warning |
| `tests/data/boundaries.test.ts` | REQ-DATA-01: no `src/components/**` imports from the new trees |
| `tests/data/no-chart-deps.test.ts` | REQ-DATA-04/54: no `chart.js`/`react-chartjs-2`/`date-fns` in `src/` or `package.json` (5.0 branch) |
| `tests/exports/data-date-entries.test.ts` | REQ-DATA-02/75: resolution targets, attw clean, no `./charts` in 5.0.0 |
| `tests/exports/data-peer-isolation.test.ts` | REQ-DATA-03/73: esbuild metafile graphs exclude RA/d3 from root and `Table` |
| `tests/exports/peer-meta.test.ts` | REQ-DATA-05: optional peer metadata |
| `tests/rsc/data-directives.test.ts` | REQ-DATA-07: directive presence/absence per file |
| `tests/rsc/data-hydration.test.tsx` | REQ-DATA-44/69: `renderToString` → `hydrateRoot` with zero warnings for StatCard, Timeline, DatePicker, with server and client TZ set to UTC+14 and UTC−11 |
| 4.x branch: `src/components/charts/GlassDataChart.globals.test.tsx`, `tests/exports/root-no-date-fns.test.ts` | REQ-DATA-78/79 |

### 12.2 Browser (Playwright, remote lanes; Chromium, WebKit, Gecko unless noted)

| File | Asserts |
|---|---|
| `tests/a11y/apg/table.apg.spec.ts` | REQ-DATA-12/17: sort by keyboard; grid-mode APG script (Arrow, Home/End, Ctrl+Home/End, PageUp/Down, Enter, Space); focus survives virtualization. Uses `tests/a11y/apg/harness.ts` (A11Y-073) and runs in L5 Behaviour (QA-082) |
| `tests/data/table.virtual.spec.ts` | REQ-DATA-14: scroll to row 9,000; DOM row count ≤ 31 throughout; `aria-rowindex="9001"` present |
| `tests/data/table.pinning.spec.ts` | REQ-DATA-16: pinned column box unchanged ±1 px after a 2,000 px horizontal scroll, LTR and RTL |
| `tests/data/table.responsive.spec.ts` | §14: 390 px and 1440 px; coarse-pointer row ≥ 44 px; horizontal scroll container, no page-level overflow |
| `tests/a11y/apg/tree-view.apg.spec.ts` | REQ-DATA-31: the full APG tree script, including type-ahead and `*` |
| `tests/data/tree-view.virtual.spec.ts` | REQ-DATA-32: ≤ 40 `treeitem`s for 5,000 nodes |
| `tests/a11y/apg/filter-bar.apg.spec.ts` | REQ-DATA-38: chip popover focus in and out; Escape |
| `tests/data/chart-frame.sr.spec.ts` | REQ-DATA-56: the accessibility tree snapshot (`page.accessibility`/`ariaSnapshot`) contains the data table per mode |
| `tests/data/data.forced-colors.spec.ts` | `forcedColors: 'active'`: Sparkline stroke `CanvasText`; table borders visible; selected rows distinguishable (`Highlight`); legend swatches have a border |
| `tests/data/data.preferences.spec.ts` | `contrast: more`, `reducedMotion`, `reducedTransparency`: sticky header becomes solid (no `backdrop-filter` computed) under reduced transparency; no transitions under reduced motion |
| `tests/a11y/apg/calendar.apg.spec.ts` | REQ-DATA-64: the APG date-grid script; unavailable days focusable with `aria-disabled` |
| `tests/a11y/apg/date-picker.apg.spec.ts` | REQ-DATA-65: dialog role, focus on open, Escape returns focus; segment spinbutton keys in `DateField` (Up/Down, typing digits, Backspace) |
| `tests/date/date-picker.responsive.spec.ts` | REQ-DATA-65/66: Sheet below 640 px, one month below 768 px |
| `tests/a11y/apg/time-picker.apg.spec.ts` | REQ-DATA-68 |
| `tests/date/date.locale.spec.ts` | `ar-EG` (RTL, Arabic digits), `ja-JP` (Japanese calendar era off by default), `de-DE` (Monday first): visible order and `dir` |
| `tests/charts/chart.keyboard.spec.ts` (5.1) | REQ-DATA-74 |
| `tests/perf/browser/data-table.spec.ts`, `tests/perf/browser/data-tree-view.spec.ts`, `tests/perf/browser/data-date-picker.spec.ts` | §16 runtime budgets, driven by `tests/perf/harness/run-perf.mjs` (PRD-PERF, PERF-039) in L10 Performance (QA-085); the budget rows go into `tests/perf/harness/budgets.json` (owner PRD-PERF, SC-15) by MODIFY. Profiles: emulated mid-tier mobile with 4× CPU throttle, and a 120 Hz desktop |
| `tests/a11y/browser/axe.spec.ts` (owner PRD-A11Y, A11Y-078) | this PRD registers every data/date story: `@axe-core/playwright` with colour contrast **on**, light and dark, all 8 scenes (SC-28), zero violations |
| Visual baselines (`tests/visual/data/`, PRD-QA L6 Environment visual and L7 Pixel regression, QA-056) | every flagship state × the §15.1 matrix cells; pixel gates (OCR text contrast, glass density ≤ 0.3, not blank, material presence) |
| Manual matrix | VoiceOver/Safari macOS and iOS, NVDA/Chrome, TalkBack/Chrome, physical touch: Table (both modes), TreeView, DatePicker, DateRangePicker, ChartFrame table fallback. Scripts in `tests/a11y/manual/scripts/data-date.md`, records validated by `tests/a11y/manual/sr-record.schema.json` (A11Y-084), matrix template from QA-099; L13 Manual SR (GA blocker) |
| Canaries (PRD-PKG apps `canaries/next16/`, `canaries/next15/`, `canaries/vite/`; PKG-121/125/126; L11 Consumer canaries) | Next 16 + React 19.3 `next build`/`next start` with `canaries/next16/app/data-server/page.tsx` (server exports) and a client page importing every data/date flagship; Next 15 + React 19.0 floor; Vite + React 19 without Tailwind (renders `Table` with 1,000 rows, asserts `{ Table }` gzip ≤ budget) |

---

## 13. Storybook requirements

Storybook is the Material Lab (§15.4; PRD-SB owns `.storybook/preview.tsx` (SB-048) and the 8-scene `environment` global, SC-31). This PRD owns the following component story files (`src/**/<Name>.stories.tsx`). Every story renders with the `environment` toolbar global (8 scenes), uses product-realistic copy (no "This is the default X component" text, cf. `visual-quality.md:81`), and contains no inline hex, no `!important` and no Storybook-only props.

| Story file | Required stories |
|---|---|
| `src/data/table/Table.stories.tsx` | `Default` (25 rows, 6 columns, an orders dataset); `Sortable`; `MultiSelect` (with a bulk-action toolbar); `Virtualized100k` (100,000 rows generated deterministically from a seeded PRNG at module scope, not `Math.random` in render); `ResizeAndPin`; `ServerPagination` (simulated latency 300 ms via `loaders`, `manualPagination`, `rowCount`); `GridMode`; `Density` (three densities side by side); `Loading`; `Empty`; `RTL` (`dir="rtl"`, `ar` locale); `OverMedia` (Table inside a `Surface variant="regular"` over the photo scene, the explicit opt-in) |
| `src/data/virtual-list/VirtualList.stories.tsx` | `Fixed`, `DynamicHeights`, `AnchorEnd` (append every 1 s, paused under reduced motion and when the story is hidden) |
| `src/data/tree-view/TreeView.stories.tsx` | `Default`, `Files` preset, `AsyncLoad`, `MultiSelect`, `Virtualized5k`, `RTL` |
| `src/data/filter-bar/FilterBar.stories.tsx` | `Default` (5 fields across all types), `WithQuickFilters`, `UrlSync` (shows the serialized query string), `WithTable` (FilterBar driving `Table`) |
| `src/data/stat-card/StatCard.stories.tsx` | `Default`, `TrendMatrix` (up/down/flat × up-is-good/down-is-good/neutral), `WithSparkline`, `Linked`, `Loading`, `Locales` (en-US, de-DE, ja-JP, ar-EG) |
| `src/data/sparkline/Sparkline.stories.tsx` | `Line`, `Area`, `Bar`, `Gaps`, `Degenerate` (empty, one point, flat), `Intents` |
| `src/data/chart-frame/ChartFrame.stories.tsx` | `TableFallback` (no adapter: the table is the content), `SvgAdapter` (a 40-line hand-written SVG adapter inside the story file, proving the contract without third-party chart libraries in the Storybook build), `LegendToggle`, `TableModes` |
| `src/data/timeline/Timeline.stories.tsx`, `ActivityFeed.stories.tsx` | `Vertical`, `Horizontal`, `Relative` (fixed `now`), `Intents`; `ActivityFeed`: `GroupedByDay`, `LoadMore`, `LiveUpdates` |
| `src/date/*.stories.tsx` | `DateField`: `Default`, `Granularity`, `Invalid`; `DatePicker`: `Default`, `MinMax`, `Unavailable`, `WeekNumbers`, `Mobile` (390 px viewport, Sheet); `DateRangePicker`: `Presets`, `TwoMonths`; `Calendar`, `RangeCalendar`; `TimePicker`: `12h`, `24h`, `MinuteStep`; all with a `Locales` story |
| Showcase compositions (files owned by PRD-SB under `showcase/<id>/`, SC-31; this PRD supplies the compositions) | `financial-dashboard` (SB-107: AppShell + StatCard ×4 + Sparkline + ChartFrame + virtualized Table + FilterBar + DateRangePicker), `analytics` (SB-116: StatCard, Sparkline + ChartFrame, Table, FilterBar, DateRangePicker) and the data parts of `ops-console` (SB-105: grid-mode Table, Timeline/ActivityFeed, TreeView). This is the "data" product surface, built from unmodified components |
| `src/charts/Chart.stories.tsx` (5.1) | `Line`, `Area`, `StackedArea`, `Bar`, `HorizontalBar`, `Donut`, `Tooltip`, `Keyboard` |

Each story declares its typed variant metadata so the Lab matrix and the visual baselines are generated (§11.3). Interaction tests in `play` functions are allowed, but the APG scripts of record are the Playwright specs in §12.2.

---

## 14. Responsive requirements

Breakpoints are **container** widths (container queries on the component root, `container-type: inline-size`), not viewport media queries, so a table inside an `Inspector` behaves the same as one in a narrow phone.

| Component | < 480 px container | 480–767 px | ≥ 768 px |
|---|---|---|---|
| `Table` | horizontal scroll inside `table-scroller` (never page overflow); the selection column and the first data column auto-pin to start when `columnPinning` is unset and there are > 3 columns; `density` floor `normal` under `pointer: coarse` (44 px rows) | horizontal scroll as needed | full layout |
| `FilterBar` | chips collapse into a "Filters (n)" button opening a bottom `Sheet`; search stays visible full-width | chips wrap to two lines max, then "+n more" | single row |
| `StatCard` | value font steps down one size (token `--ag-stat-value-size-sm`); sparkline hidden when the card is < 200 px wide | default | default |
| `ChartFrame` | legend moves below the plot and wraps; `table="toggle"` button stays reachable; plot min-height 160 px | default | legend placement per prop |
| `Timeline` | horizontal orientation falls back to vertical | default | default |
| `DatePicker`/`DateRangePicker` | bottom `Sheet` (from < 640 px), one month, presets above | Popover, one month | Popover, two months (`DateRangePicker`), presets beside |
| `TreeView` | indentation per level drops from 20 px to 12 px; long labels truncate with full text in `title` and the accessible name | default | default |

Requirements:

- No component produces horizontal page overflow at 320 px viewport width (WCAG 1.4.10 reflow). Test: `tests/data/table.responsive.spec.ts` and the PRD-19 mobile containment pixel gate.
- Touch targets ≥ 24 × 24 CSS px always (WCAG 2.5.8) and ≥ 44 × 44 under `pointer: coarse` for sort triggers, resize handles (hit area expanded via `::before`, visual width unchanged), chips' remove buttons, calendar cells and legend toggles. Test: `tests/data/table.responsive.spec.ts`, `tests/date/date-picker.responsive.spec.ts` (bounding-box assertions).
- Text at 390 px has p10 word height ≥ 10 px (`visual-quality.md:88` found 6–7.8 px in charts and metric grids). Test: PRD-19 OCR "legible text" gate on the data surface at 390 px.
- 200% browser zoom at 1440 px: no clipped content, no overlap. Test: `tests/data/table.responsive.spec.ts` "zoom".

---

## 15. Accessibility requirements

| Area | Requirement | Test |
|---|---|---|
| Patterns | `Table` mode table: WAI-ARIA table semantics with native elements; grid mode: APG data grid. `TreeView`: APG tree view. `Calendar`: APG date grid. `DateField`/`TimeField`: segments as `spinbutton`s. `FilterBar` quick filters: toggle buttons. `ChartFrame` legend: toggle buttons. `Timeline`: list | §12.2 APG specs |
| Names | Every flagship requires an accessible name (`caption`/`aria-label`/`label`); a dev warning fires when missing, and the jsdom tests assert it | unit tests |
| Announcements | Sort changes, filter result counts and feed updates go through the provider announcer (PRD-05), polite, batched ≥ 2 s for feeds | unit + `chart-frame.sr.spec.ts` |
| Non-colour cues | Trend arrows + text (StatCard), intent icons + text (Timeline), selected rows by `aria-selected` + a 2 px start-edge indicator + fill (not fill alone), legend swatch + label | visual review + forced-colors spec |
| Contrast | Text ≥ 4.5:1 (≥ 7:1 under `contrast: more`) on `content-raised` and on the sticky header chrome, measured by the OCR pixel gate across all 8 scenes in light/dark. Non-text (sparkline, chart marks, focus ring, resize handle, checkbox borders) ≥ 3:1 | token lane + pixel gates |
| Focus | Visible focus ring from PRD-05 tokens on every focusable part, including in `aria-disabled` cells (fixes ACCESSIBILITY-14 class of bug); one tab stop for grid, tree, calendar | APG specs |
| Preferences | `forced-colors`: system colours, no backdrop, borders visible. `prefers-reduced-transparency` / app transparency `tinted`/`solid`: sticky header and popovers resolve to the solid rung (D-11). `prefers-reduced-motion`: no row-enter, sort or legend animation; final state visible | `data.preferences.spec.ts`, `data.forced-colors.spec.ts` |
| Screen readers | Manual pass with VoiceOver (macOS Safari, iOS Safari), NVDA + Chrome, TalkBack + Chrome on the components listed in §12.2 "Manual matrix" | living matrix |
| Data alternatives | Every chart has a table equivalent (`ChartFrame` fallback); every Sparkline has a text summary | unit tests |
| Language | Date and number output uses the provider locale; `dir` follows it; no hard-coded English strings outside an overridable `messages` prop (`Table`, `FilterBar`, `DatePicker` expose `messages?: Partial<…Messages>` for "Select all rows", "Sort by", "Remove filter", "Choose date", "Show data table") | unit tests per component |

---

## 16. Performance requirements

Size budgets are integer bytes min+gz, peers external, recorded as rows in `docs/size-budgets.json` (owner PRD-PKG, PKG-048) and gated by `scripts/ci/verify-size-budgets.mjs` (PKG-049) (SC-15). There is no `size-limit`, `.size-limit.json`, `build/budgets.lock.json` or `verify-tree-shaking.js` (deleted by PKG-054). This PRD submits the rows below as the owning PRD; a row may be stricter than the PRD-PERF default ceiling (8 KB gz per subpath CSS), never looser. The `{ Table }` line is from architecture §3.6. All are provisional until calibrated at 5.0.0-alpha.1 in L10 Performance, then ratchet down only (D-26).

| Import | Budget |
|---|---|
| `{ Table }` from `aura-glass/data` (includes `@tanstack/react-table` core + sorted/pagination row models + `@tanstack/react-virtual`) | ≤ 45 KB (§3.6) |
| `{ VirtualList }` | ≤ 6 KB |
| `{ TreeView }` (RA external) | ≤ 8 KB |
| `{ FilterBar, useFilterModel }` | ≤ 12 KB (Popover and controls are shared with root; counted) |
| `{ StatCard }` (with Sparkline) | ≤ 3 KB |
| `{ Sparkline }` | ≤ 1.5 KB (stricter than the ≤ 3 KB row in `AURAGLASS_PERFORMANCE_PRD.md` §16; the stricter line governs) |
| `{ ChartFrame }` | ≤ 5 KB |
| `{ Timeline, ActivityFeed }` | ≤ 4 KB |
| `{ DatePicker }` from `aura-glass/date` (RA and `@internationalized/date` external) | ≤ 10 KB |
| `{ DateRangePicker }` | ≤ 12 KB |
| `data.css` | ≤ 8 KB gz |
| `date.css` | ≤ 4 KB gz |
| `{ Chart }` from `aura-glass/charts` (5.1, d3 external) | ≤ 15 KB (binding owner line, SC-38; EXP is aligned) |
| `{ Button }` from root after this PRD lands | unchanged (≤ 10 KB); asserts no data/date/chart module in its graph |

Runtime budgets (rows in `tests/perf/harness/budgets.json`, owner PRD-PERF, read by `tests/perf/harness/run-perf.mjs`, SC-15; "mobile" = emulated mid-tier Android profile with 4× CPU throttle; "desktop" = 120 Hz desktop profile):

| Scenario | Budget |
|---|---|
| `Table`, 10,000 rows × 12 columns, `virtualize`: mount to first paint of rows | ≤ 120 ms desktop, ≤ 400 ms mobile |
| Same table: continuous scroll for 5 s | p95 frame time ≤ 8.3 ms desktop (120 Hz), ≤ 16.7 ms mobile; 0 long tasks > 50 ms desktop |
| Same table: sort a numeric column | ≤ 50 ms desktop, ≤ 150 ms mobile (interaction to next paint, INP-style) |
| `Table`, 100,000 rows, `virtualize`: mount | ≤ 400 ms desktop; JS heap growth ≤ 40 MB over the dataset itself |
| `Table` without `virtualize` and > 500 rows | dev warning "Consider `virtualize`" (no automatic switch, D-09) |
| Row selection toggle with 10,000 rows | ≤ 16 ms desktop to the next paint (only the changed row and the header checkbox re-render; asserted with React Profiler commit counts ≤ 3 components) |
| Column resize drag | p95 frame ≤ 16.7 ms mobile; with > 1,000 rows `columnResizeMode: 'onEnd'` |
| `TreeView`, 5,000 nodes expanded, virtualized: expand-all | ≤ 150 ms desktop |
| `DatePicker` open → calendar painted | ≤ 50 ms desktop, ≤ 120 ms mobile |
| Server components (`StatCard`, `Sparkline`, `Timeline`, `ChartFrame` frame) | 0 B client JS each in the Next 16 canary (`.next` client manifest contains none of their modules) |
| Blurred surfaces per data surface | `Table` contributes ≤ 1 (sticky header); the data showcases (`financial-dashboard`, `analytics`, `ops-console`) stay inside the §4.7 per-view surface budget, asserted by the dev surface counter (PRD-MAT, `src/material/dev/surfaceCounter.ts`, MAT-055) |
| Idle cost | 0 rAF callbacks, 0 intervals and ≤ 1 `ResizeObserver` per `Table`/`ChartFrame`/`VirtualList` instance after settle |
| Perf grade | every data/date flagship ≥ C on the PRD-19 A–F scale |

---

## 17. Acceptance criteria

Each criterion is measured on the release SHA by CI or remote lanes. Evidence is a CI artifact (D-32), never a committed report.

- **AC-DATA-01** `rg -n "chart\.js|react-chartjs-2|date-fns" src package.json` returns 0 matches on the 5.0.0-beta.1 tag.
- **AC-DATA-02** The esbuild metafile for `import { Button } from 'aura-glass'` contains 0 inputs from `src/data`, `src/date`, `src/charts`, `@tanstack/*`, `react-aria-components`, `@internationalized/date` or `d3-*`.
- **AC-DATA-03** Every per-import row this PRD submits to `docs/size-budgets.json` passes `scripts/ci/verify-size-budgets.mjs`, and `{ Table }` ≤ 45 KB gz.
- **AC-DATA-04** In 4.2.0, after `import 'aura-glass'`, `Chart.defaults.plugins.tooltip.enabled === true` in a consumer that registers chart.js itself (`GlassDataChart.globals.test.tsx`).
- **AC-DATA-05** In 4.2.0, the root import loads 0 `date-fns` modules (from 304).
- **AC-DATA-06** `Table` with 10,000 rows and `virtualize` renders ≤ 31 `<tr>` in `<tbody>` at a 600 px container height in all three engines, and `aria-rowindex` matches the data index + 2 for every rendered row.
- **AC-DATA-07** Table scroll p95 frame time ≤ 16.7 ms on the mobile profile and ≤ 8.3 ms on the desktop profile (10,000 × 12, 5 s scroll).
- **AC-DATA-08** The APG keyboard specs `tests/a11y/apg/{table,tree-view,calendar,date-picker,time-picker,filter-bar}.apg.spec.ts` pass with 0 failures in Chromium, WebKit and Gecko (L5 Behaviour).
- **AC-DATA-09** `@axe-core/playwright` with colour contrast enabled reports 0 violations on every data/date story in the light and dark schemes across the 8 scenes.
- **AC-DATA-10** The OCR text-contrast pixel gate's worst case for data/date stories is ≥ 4.5:1 (default) and ≥ 7:1 (`contrast: more`). Sparkline and chart-palette strokes are ≥ 3:1 against `content-raised` in the token lane.
- **AC-DATA-11** The chart palette tokens `--ag-chart-1..8` pass: ≥ 3:1 vs `content-raised`; ΔE2000 ≥ 15 between indices 1–4 under three CVD simulations; OKLCH chroma ≥ 0.08 for indices 1–6.
- **AC-DATA-12** `renderToString` → `hydrateRoot` for StatCard, Sparkline, Timeline, ActivityFeed, ChartFrame, Table and DatePicker produces 0 hydration warnings, with server TZ UTC+14 and client TZ UTC−11.
- **AC-DATA-13** The Next 16 canary's client manifest contains 0 modules from `src/data/stat-card`, `src/data/sparkline`, `src/data/timeline/Timeline.tsx` and the `ChartFrame` frame file.
- **AC-DATA-14** `npx @auraglass/cli migrate 4to5` on the frozen 4.x consumer fixture `tests/fixtures/consumer-4x/` (REL-115, SC-08) yields 0 TODOs for `GlassDataTable`, `GlassDataGrid`, `GlassVirtualTable`, `GlassSparkline`, `GlassStatCard`, `GlassTimeline` and `GlassDatePicker` call sites without `format`. Chart call sites yield exactly one `removed` TODO each, and the fixture type-checks and renders after the run.
- **AC-DATA-15** Every 4.x name in §9 has a `deprecations.json` entry that shipped in ≥ 1 4.x minor before 5.0.0-beta.1 (the change-class gate).
- **AC-DATA-16** All 7 flagships (Table, TreeView, FilterBar, StatCard, Sparkline + ChartFrame, Timeline/ActivityFeed, the `./date` set) have perf grade ≥ C, green environment-matrix baselines, and a completed manual screen-reader and touch row in the living matrix.
- **AC-DATA-17** No horizontal page overflow at a 320 px viewport, and touch targets ≥ 44 × 44 px under `pointer: coarse`, for every data/date story (PRD-19 mobile containment gate plus bounding-box asserts).
- **AC-DATA-18** The data product surface scene passes every §15.2 pixel gate (not blank, surface separation, OCR contrast, glass density ≤ 0.3, material presence, no overlap) at 1440 and 390 px.
- **AC-DATA-19** 5.1.0: `aura-glass/charts` `Chart` passes AC-DATA-08/09/10 equivalents (`chart.keyboard.spec.ts`), and `{ Chart }` ≤ 15 KB gz with d3 external.
- **AC-DATA-20** Rules-of-hooks lint reports 0 errors in `src/data/**` and `src/date/**`, and the "toggle every boolean prop" tests pass.

---

## 18. Definition of done

A flagship in this PRD is done when all of the following hold (architecture §11.3 plus this PRD):

1. Implementation merged under `src/data/**` or `src/date/**` with no import from `src/components/**`.
2. Typed variant metadata exported, driving docs, the Lab matrix and the codemod tables.
3. The `data-ag-part` / `data-state` contract documented and snapshot-tested.
4. A role and selector change table against every absorbed 4.x component, published in `docs/migration/`.
5. At least one registry block or item uses it (the GA blocks `analytics-dashboard` for StatCard, Sparkline, ChartFrame, Timeline and `data-workspace` for Table, FilterBar, TreeView, StatCard (SC-32); the PRD-DX `settings` block for DatePicker; items `faceted-search` or `tree-select` for TreeView).
6. An APG keyboard script in `tests/**` passing in all three engines.
7. A per-import budget row in `docs/size-budgets.json`, passing `verify-size-budgets.mjs`.
8. Perf grade ≥ C.
9. Environment-matrix baselines green, pixel gates green, manual screen-reader and touch row complete.
10. A codemod fixture for every absorbed 4.x name, and a compat adapter for every surviving one.
11. `deprecations.json` entries shipped in a 4.x minor.
12. Storybook stories per §13 with product-realistic copy.
13. Docs page with "when to use", API, accessibility notes and the adapter guide (ChartFrame).

The PRD as a whole is done when every flagship is done, AC-DATA-01..18 and AC-DATA-20 pass on the 5.0.0 GA SHA, and AC-DATA-19 passes on 5.1.0. Completion is proven only by CI/remote-lane artifacts produced by the real implementation; stubbed components, mocked TanStack/RA modules in browser specs, skipped (`test.skip`/`test.fixme`) specs, or baselines regenerated without the pixel gates do not count.

---

## 19. Dependencies (other PRDs)

Owners and anchor tasks follow `prd/_shared-contracts.md` (SC-40). Where this PRD consumes a shared artifact, it references the owner and does not re-specify or build it.

| PRD (key; §16 id) | What this PRD needs | Anchor tasks | Blocking for |
|---|---|---|---|
| PRD-TRUST (§16 PRD-00) | `deprecations.json` seed at the repo root (SC-02); npm pack helper `scripts/ci/lib/npm-pack.js` (SC-06) for the packed-tarball tests; API report scripts | TRUST-075, TRUST-002, TRUST-071/072 | §9, REQ-DATA-02 |
| PRD-REL (PRD-01; interim §16 PRD-17) | deprecations schema, `gen-deprecations.mjs` (codemod mappings), `warnDeprecated`, frozen 4.x fixture `tests/fixtures/consumer-4x/`, change-class gate, 4.2/4.3 release scope and gates | REL-010, REL-070, REL-072, REL-115, REL-052 | §9, §10, 4.2/4.3 work, AC-DATA-14/15 |
| PRD-PKG (PRD-02) | per-entry build; `build/exports.manifest.json`; `docs/dependency-allowlist.json` and `verify-deps.mjs`; optional peers; `docs/size-budgets.json` + `verify-size-budgets.mjs`; side-effect gate; ESLint wiring; React 19 bump; canary apps | PKG-005, PKG-056, PKG-057, PKG-059, PKG-048, PKG-049, PKG-042, PKG-015, PKG-018, PKG-121/122/125/126 | REQ-DATA-02..06, §16 |
| PRD-DS (PRD-03) | component tokens `table.*`, `stat.*`, `chart.1..8`, `sparkline.stroke`; contrast-solved pairs; CVD/chroma checks for the chart palette | DS-016, DS-022 (no component-token task yet, §21 OI-04) | REQ-DATA-20, -43, -48, -57 |
| PRD-MAT (PRD-04) | `content-raised`, `content`, `content-sunken`, chrome `thin`, `ScrollEdge`, `material.css` layers, the dev surface counter; `data-ag-*` registry (SC-21; this PRD's ratified attribute is `data-ag-pinned-edge`) | MAT-015, MAT-047, MAT-055 | §4.2, §16 |
| PRD-A11Y (PRD-05) | provider (`locale`, transparency), `usePreference`, announcer, focus ring, APG harness, browser axe spec, manual SR records | A11Y-029, A11Y-027, A11Y-054, A11Y-073, A11Y-078, A11Y-084 | §15, AC-DATA-08/09 |
| PRD-MOT (PRD-06) | motion tokens (`tokens/sys/motion.tokens.json`, owner DS-026); no-op motion under reduced motion | DS-026 | §15 |
| PRD-FND (PRD-07/14/16) | Base UI pin and wrapping pattern, React 19 ref pattern, parts registry, KEEP primitives (`VisuallyHidden`), `Skeleton`, `Chip`, `Badge`, `Grid`, the **alpha coverage check** (§4.3), removal gate and the RM-07 chart removal | FND-001, FND-005, FND-038, FND-059, FND-071, FND-051, FND-046, FND-102/107/108, FND-127 | everything; Wave 3 gate; 5.0-beta removals |
| PRD-CTL (PRD-08) | `Checkbox`, `Select`, `SearchField`, field shell, `SegmentedControl`, `Button`, `IconButton` | CTL-029, CTL-102, CTL-075, CTL-007, CTL-081, CTL-055, CTL-061 | Table selection, FilterBar, date fields |
| PRD-OVL (PRD-09) | `Popover`, `Sheet`, `Tooltip`, `Menu` | OVL-063, OVL-097, OVL-066, OVL-081 | FilterBar, DatePicker, column menu |
| PRD-NAV (PRD-10) | `AppShell` for showcase compositions; `src/registry/recipes.ts` removal (NAV-136); `src/workspace/index.tsx` removal incl. `GlassTimelineRail` (NAV-124) | NAV-016, NAV-124, NAV-136 | showcases, §9 family 5 |
| PRD-DX (PRD-18/20) | CLI `doctor`, codemod engine and catalogue, compat index, `registry/registry.json`, registry lint/build/render harness, GA block scaffolds `data-workspace`/`analytics-dashboard`, docs app | DX-035, DX-041, DX-042, DX-065, DX-067, DX-070, DX-073, DX-074, DX-094, DX-101 | REQ-DATA-80/81, registry, §18 item 13 |
| PRD-QA (PRD-19 cert) | `jest.config.js`, `playwright.config.ts`, cert Playwright config, 8 scenes, L5/L6/L10 lanes, pixel gates, manual matrix template | QA-003, QA-018, QA-038/039, QA-082, QA-056, QA-045, QA-047, QA-085, QA-099 | §12.2, §16, §17 |
| PRD-SB (PRD-19 Storybook) | `.storybook/preview.tsx` and the environment global; showcase files `financial-dashboard`, `analytics`, `ops-console` | SB-048, SB-107, SB-116, SB-105 | §13 |
| PRD-PERF (perf policy) | `tests/perf/harness/run-perf.mjs`, `tests/perf/harness/budgets.json`, default size ceilings | PERF-039 | §16 runtime rows |
| PRD-AI (§16 PRD-12) | consumes `VirtualList` (`anchor="end"`, `role="log"`) | — (downstream: DATA-033) | this PRD must land `VirtualList` before PRD-AI's `Thread` work |

Open items that affect this PRD are tracked in §21.

---

## 20. Execution order

1. **4.2 bridge (release scope and gates: PRD-REL as interim §16 PRD-17 owner, SC-37; target 2026-11-16).** (a) Scope chart.js registration inside components and delete the global `defaults` writes (REQ-DATA-78), with the D-28 visual-bug-fix label and composite. (b) Replace `require` in `dateAdapters.ts` with `import()` (REQ-DATA-79). (c) Move chart.js, react-chartjs-2 and date-fns to optional peers, with `doctor` reporting (PRD-DX, DX-035). (d) Repo-root `deprecations.json` entries (TRUST-075 seed, REL-010 schema) and warnings for A-04.
2. **Pre-alpha spikes (parallel with Wave 2).** (a) Measure `@tanstack/react-table` + `react-virtual` footprint and transitive count and hand them to the PRD-PKG allowlist (PKG-056). (b) Prototype `useGridKeyboard` on a 10,000-row virtual table to confirm the §4.3 deviation (focus retention under virtualization). (c) Confirm the RAC version and its peer range (PKG-059).
3. **4.3 preview (target 2027-01-18).** `deprecations.json` C-D for A-05; publish `docs/migration/date.md`, `data-table.md`, `charts.md`; `migration` fields in `*.meta.ts` delivered for REL-070 to generate the `4to5` mappings used by the PRD-DX beta codemods.
4. **Wave 4 start, after the PRD-FND/CTL/OVL pattern gate (Button CTL-055 + Dialog OVL-040 certified).** Build in this order, since each step unblocks the next: `VirtualList` (unblocks PRD-AI) → `Table` (table mode, sort, selection, virtualize, sticky header) → `Table` resize/pin/pagination → `Table` grid mode.
5. **Server-safe set in parallel with step 4:** `Sparkline` → `StatCard` → `ChartFrame` (frame, legend, table fallback, adapter types) → `Timeline` → `ActivityFeed`.
6. **Filters:** `useFilterModel` + serialize/parse → `FilterBar` (needs PRD-CTL `SearchField`, `SegmentedControl` and PRD-OVL `Popover`) → registry items `registry/items/query-builder/` and `registry/items/faceted-search/` (registered by PRD-DX in `registry/registry.json`).
7. **Tree:** `TreeView` on RA, `preset="files"`, virtualization; registry item `tree-select`.
8. **Date:** `DateProvider` → `DateField`/`TimeField` (PRD-CTL field shell) → `Calendar`/`RangeCalendar` → `DatePicker` (Popover/Sheet) → `DateRangePicker` (presets) → `TimePicker`; `week-number.ts`.
9. **Compat and codemods:** adapters `src/compat/data/<OldName>.tsx` and `src/compat/date/<OldName>.tsx` (re-exported by DX-065); fixtures `packages/cli/src/migrate/4to5/__fixtures__/<id>/data-*`; run on `tests/fixtures/consumer-4x/` (AC-DATA-14).
10. **Removal PRs (through the PRD-FND removal gate, before 5.0.0-beta.1):** one PR per family in the §9 order: charts + chart.js (PRD-FND RM-07, FND-127) → tables + virtualization → trees → filters/query → stat/sparkline/timeline → date + date-fns.
11. **Certification (PRD-QA lanes and PRD-SB showcases, beta → RC-1):** L6 environment matrix, pixel gates, L10 perf calibration of §16, L13 manual screen-reader and touch matrix, L11 canaries, registry block content for `analytics-dashboard` and `data-workspace`. Flagship APIs are frozen at 5.0.0-rc.1.
12. **5.0.0 GA:** AC-DATA-01..18 and AC-DATA-20 green on the GA SHA.
13. **5.1 (GA + about 8 weeks):** `aura-glass/charts` `Chart` (line, area, bar, donut) on `d3-scale`/`d3-shape` optional peers inside `ChartFrame`, published on `next` as `@tier preview` until AC-DATA-19 passes, then promoted (C-E).

---

## 21. Open items

Status as of 2026-10-06 after reconciliation with `prd/_shared-contracts.md` and `_verification-remaining-concerns.md` (DATA section). "Resolved" items need no further action in this PRD.

| # | Item | Status | Owner | How to close |
|---|---|---|---|---|
| OI-01 | PRD numbering (self-id PRD-12 vs §16 PRD-11; siblings inconsistent) | Resolved by SC-01: key `DATA`, cite as `PRD-DATA`; header and numbering note updated | PRD-REL (crosswalk) | none here; the architecture §16 file names are errata E-07 |
| OI-02 | MOT REQ-MOT-34 assumes a tweening `AnimatedNumber` inside `StatCard` | Decided by SC-38: static Server Component, no tween (REQ-DATA-43) | PRD-MOT | MOT removes StatCard as a consumer of REQ-MOT-34 (`AURAGLASS_MOTION_PRD.md:293`); AnimatedNumber becomes registry/compat only |
| OI-03 | `{ Chart }` budget: EXP ≤ 22 KB vs ≤ 15 KB here | Decided by SC-38: ≤ 15 KB, DATA owns the row; SC-38 records EXP `:318` as aligned | PRD-DATA (row in `docs/size-budgets.json`, DATA-144) | none beyond DATA-144 |
| OI-04 | No PRD-DS task generates this PRD's component tokens: `table.row-height.*`, `table.cell-padding-inline.*`, `--ag-table-pin-shadow`, `stat.*` (incl. `--ag-stat-value-size-sm`, trend intents), `chart.1..8`, `sparkline.stroke` | Open | PRD-DS | add a DS token task under `tokens/` with these rows and their L4 contrast pairs; then DATA-039/047/056/060/065/068 retarget `depends_on` from DS-016/DS-022 to that task |
| OI-05 | `prd/appendix/component-dispositions.md` marks `GlassTimelineRail` (row 494) and `GlassAdvancedDataViz` (row 452) as compat; §9 here gives neither a compat adapter | Decided by SC-34 (this PRD's §9 governs) | PRD-FND | FND regenerates `prd/appendix/gen-component-dispositions.mjs` (`:138-140`, `:184`) so both rows are not compat |
| OI-06 | Architecture errata: §3.2/§12 vs §11.2 placement of Timeline/ActivityFeed, and §3.2 omits RangeCalendar/TimePicker | Covered by errata E-04 (SC-12 accepts `TimePicker`, `RangeCalendar` on `./date`) | architecture maintainer | apply E-04; this PRD keeps §4.7 (`./data` only) |
| OI-07 | §11.2 #36/#37 roles differ from §4.2 here; not yet listed in §J errata | Open | architecture maintainer (via PRD-REL program index) | add an erratum next to E-04 stating the §4.2 roles |
| OI-08 | §4.3 own `useGridKeyboard` vs "RA grid mode" (§11.2 #32) is not yet evidenced | Open | PRD-DATA (spike, §20 step 2b), PRD-FND alpha coverage check (FND-001) | attach the spike's remote CI artifact (focus retention under virtualization) to DATA-049; if Base UI ships a grid primitive by alpha, replace the hook |
| OI-09 | RAC peer range and TanStack exact pins deferred; footprints unmeasured (`node_modules/@tanstack` absent at HEAD) | Open | PRD-PKG (PKG-056/059), measurements from DATA-022 | record versions, footprint and transitive count in `docs/dependency-allowlist.json` at the alpha allowlist PR |
| OI-10 | Capabilities used by REQ-DATA-48/57 and §16 (8 scenes, OCR gate, perf harness) do not exist yet | Open (planned) | PRD-QA (QA-038/039, QA-045, QA-056, QA-085), PRD-PERF (PERF-039) | DATA certification tasks depend on these anchors; close when they are green on main |
| OI-11 | FND-126 (RM-10) lists `src/data/index.ts` for deletion, but this PRD rewrites that file as the 5.0 `./data` entry (DATA-023) | Open (ownership conflict) | PRD-FND | drop `src/data/index.ts` from FND-126, or sequence FND-126 before DATA-023 and record DATA-023 as the CREATE |
| OI-12 | FND-127 (RM-07) is the single remover of the chart tree but cites the invalid dependency `PRD-11` and covers less than §9 family 1 (`GlassChartWidget`, `GlassAdvancedDataViz`, `GlassChartsDemo`, `ChartWidget`, `chartAnimations.ts`) | Open | PRD-FND | FND-127 depends on DATA-064 and DATA-113 and extends its file list to §9 family 1; DATA-116 then only verifies |
| OI-13 | DX-073/074 (block scaffolds) cite `PRD-12` in `depends_on` | Open | PRD-DX | depend on DATA-133 (content) per SC-32/SC-40 |
| OI-14 | TRUST-075 still creates `docs/deprecations.json`; SC-02 puts the file at the repo root | Open | PRD-TRUST | retarget TRUST-075 to `deprecations.json`; DATA-009/011 already target the root |
| OI-15 | The frozen 4.x fixture must contain one file that imports `date-fns` directly (§11 item 1) | Open (request) | PRD-REL (REL-115) | add the file to `tests/fixtures/consumer-4x/` contents (REL §11.4) |
| OI-16 | SC-24 (Button `variant` becomes the material axis) awaits human confirmation; §10.3 compat adapters and the `intent` usage here follow SC-24 as written | Open (human decision) | PRD-REL program owner | confirm SC-24; if rejected, regenerate §10.3 "Others" row and DATA-109/110 mappings |
| OI-17 | The SC-40 validator `scripts/release/verify-task-graph.mjs` does not exist yet, so `tasks/DATA.json` was checked by a one-off script only | Open | PRD-REL | land the validator and run it over `tasks/*.json` |
