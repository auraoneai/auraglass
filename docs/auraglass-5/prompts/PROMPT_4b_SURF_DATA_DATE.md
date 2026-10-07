# PROMPT-4b (SURF lane W2): Data, date and charts

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PRODUCT_SURFACES_PRD.md` §4.1–§4.4, §5.4, §5.5, §5.9 (charts), §5.10 (data blocks/items), §13 (Table, TreeView, FilterBar, StatCard, Sparkline, ChartFrame, Timeline, Date stories), §14, §16, §20 row W2. Index and shared rules: `docs/auraglass-5/prompts/PROMPT_4_SURF.md` (binding). Contract: contract-v1.1.
Requirement IDs: REQ-SURF-66..105, -161..-164, -174, -178 (owned); W2 rows of REQ-SURF-01..-04, -06..-15, -170, -171, -188, -189, -194..-196.
Acceptance: AC-SURF-10, -14, -30 (owned, -30 for 5.1/5.2 items); W2 rows of AC-SURF-01, -02, -11, -12, -13, -23, -24, -25, -26.
Tasks: `tasks/SURF.json` lane `W2`, SURF-134..SURF-275. Archived detail reused from `archive/v1-19-prd/prompts/PROMPT_12a..12j_DATA_*.md` (DATA-001..144 re-keyed; 4.x chart/date fixes on `release/4.x` were dropped: they are PLAT's) and EXP column reorder / inline edit / DateTimePicker tasks.
Flagships: 14 date set, 32 Table, 33 TreeView, 34 FilterBar, 35 StatCard, 36 Sparkline + ChartFrame, 37 Timeline/ActivityFeed; T2 `Chip`, `KeyValueEditor`.

## Prerequisites

**None** except the frozen contract. Verify (C0 files; report if missing, never create):

```bash
test -f src/contracts/components.ts && test -f src/contracts/entries.ts && test -f src/contracts/fragments.ts \
 && ls tests/contract-doubles/cmp/{popover,menu,select,combobox,collapsible,scroll-area}.tsx && test -f tests/helpers/index.ts \
 && node -e "const p=require('./package.json');for(const d of ['@tanstack/react-table','@tanstack/react-virtual','@base-ui/react'])if(!(p.dependencies||{})[d])process.exit(1);for(const d of ['react-aria-components','@internationalized/date'])if(!(p.peerDependencies||{})[d])process.exit(2)"
```

(The dependency set is frozen in contract §4.12; `package.json` is PLAT's and read-only.)
Seams consumed: S-01/S-05/S-06 (`content-raised` for Table/StatCard/ChartFrame, `ScrollEdge` for the sticky header, seeds + `contracts/stubs/reference.css`), S-03/S-04 (chart palette derived from public `--ag-color-*`), S-12, S-20..S-26 (`useAnnouncer` for sort/selection/results, `usePortalContainer`), S-30..S-34 (CMP `Checkbox`, `Skeleton`, `Menu`, `Popover`, `Sheet`, `SearchField`, `ToggleGroup`, `IconButton`, `TextField`, `NumberField`, `Select`, `Button`, `Avatar`, `Card`, `Toolbar`; doubles through `tests/data/jest.doubles.cjs`), S-35 (`./data`, `./date`, `./charts` `ga: '5.1'`, root `Timeline`/`ActivityFeed`), S-37..S-46, S-49 (frozen deps), S-53. Intra-stream: **you own I-1 `VirtualList`** — land it in your first PR exactly as the index defines it; I-3 for `data-workspace` (uses W1 `Pagination`) and `support-inbox` (uses W3 `Thread`).

## May touch (lane W2 exclusive)

`src/data/**`, `src/date/**`, `src/charts/**`, `src/components/timeline/**`; `src/compat/surf/{data,date}/**`; `tests/{data,date,charts}/**` (incl. `tests/data/jest.doubles.cjs`, `tests/data/exports/**`, `tests/data/css/**`, `tests/data/rsc-hydration.test.tsx`, `tests/data/chart-palette.test.ts`, `tests/data/no-chart-deps.test.ts`); `tests/e2e/surf/{data,date,charts}/**`; `tests/a11y/apg/surf/{table,tree-view,filter-bar,calendar,date-picker,time-picker,date-time-picker}.apg.spec.ts`; `tests/perf/browser/surf/{data-table,data-tree-view,data-date-picker}.spec.ts`; `tests/visual/surf/data/**`; `tests/rsc/surf/data-*`; `tests/types/surf/filter-model.test-d.ts`; `canaries/next16/app/surf/data-server/**`, `canaries/vite/src/surf/DataTable.page.tsx`; `registry/blocks/{data-workspace,analytics-dashboard,support-inbox,audit-log,permissions-matrix}/**`; `registry/items/{query-builder,tree-select,faceted-search,schema-viewer}/**`; `tests/capability/registry/{data-items,data-workspace,support-inbox,analytics-dashboard,audit-log,permissions-matrix}.test.tsx`; `fragments/codemods/surf/fixtures/data-*/**`; `tests/fixtures/consumer-4x/cases/surf/data/**`; `etc/api/{data,date,charts}.*`.
Shared (own `lane W2` block only): `src/root/surf.ts` (Timeline, ActivityFeed), `src/compat/surf/index.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,css,side-effects}/surf.ts`, `fragments/playwright/surf.json`, `lint/rules/surf/_strict.cjs`, `ci/surf.gitlab-ci.yml`.

## Must not touch

Other lanes' paths and blocks; `apps/docs/content/surf/**` (W5 writes the data/date/chart migration guides from your tables); `package.json` (5.1 d3 peers come by contract PR); legacy 4.x chart/date/table files and every `release/4.x` code path (PLAT); `docs/size-budgets.json`, `deprecations.json`, `build/**`, `registry/registry.json`.

## Steps

1. **I-1 `VirtualList`** first PR (SURF-134.., REQ-SURF-80): internal, not in any barrel; idle test proves 0 rAF/intervals.
2. **Table core** (REQ-SURF-66..70, -74..-77): one TanStack table, `TableColumnDef` with `meta` keys via declaration merging, controlled/uncontrolled pairs, row models imported per feature, `size: 'sm' | 'md' | 'lg'` (no `density`), virtualization ≤ `ceil(600/40) + 2×8` rows with `aria-rowcount`/`aria-rowindex`, `>500` rows without `virtualize` → dev warning only, sticky header in MAT `ScrollEdge` (`chrome thin`), root `content-raised` (no blur), loading/empty states, no conditional hooks.
3. **Table advanced** (REQ-SURF-71..73, -78): resize separator ARIA + keys (RTL), pinning with `position: sticky` + `inset-inline-*` and auto-pin below 480 px, grid mode (`useGridKeyboard` ≤2.5 KB, focus survives row unmount), column reorder via a CMP `Menu` "Move left/right" (no drag required) with announcement; 5.1 inline edit (REQ-SURF-79).
4. **Display set** (parallel inside the lane): Sparkline (own ≤60-line scale, accessible label, degenerate cases) → StatCard (server, `Intl.NumberFormat`, trend arrow + hidden text, `tabular-nums`, no tween) → ChartFrame (server `<figure>`, client `Legend`/`TableToggle`/`Plot`, `ChartContext`, adapter type only, real `<table>` fallback, private `--_ag-chart-1..8` palette with CVD ΔE checks) → Timeline/ActivityFeed (root, `src/components/timeline/`, `<time dateTime>`, `now` required for relative on the server, batched announcements).
5. **Filter model → FilterBar → Chip, KeyValueEditor** (REQ-SURF-84..89): immutable model exposed as `FilterBar.useModel/serialize/parse` statics, typed operators, URL round-trip, chips with remove buttons, CMP `Popover` editor, `Sheet` below 480 px; `Chip` and `KeyValueEditor` per PRD (moved from archived FND).
6. **TreeView** (REQ-SURF-81..83): React Aria `Tree`, APG tree, `preset: 'files'`, `loadChildren`, virtualized 5,000 nodes ≤40 `treeitem`s.
7. **Date** (REQ-SURF-98..105): `DateProvider` bridging locale/dir into RA `I18nProvider`; DateField/TimeField spinbuttons; Calendar/RangeCalendar APG date grid; DatePicker (CMP `Popover` ≥640 px, `Sheet` below), DateRangePicker (presets listbox, draft-commit, 1/2 months), `week-number.ts` ISO-8601, TimePicker; `@internationalized/date` values only, no `format` prop, no `date-fns`; helpers come from the peer, not re-exported. 5.1 DateTimePicker by additive contract PR.
8. **Entries, statics, CSS, boundaries** (REQ-SURF-01..04, -06..-08): `src/data/index.ts` and `src/date/index.ts` with exactly the contract lists; W2 block of `src/root/surf.ts`; `tests/data/exports/{surf-entries,surf-statics,peer-isolation}.test.ts` on the packed tarball (`AURAGLASS_TARBALL` or `npm pack --pack-destination .artifacts/pack`); `tests/data/no-chart-deps.test.ts`; `tests/data/css/surf-css.test.ts` and logical-properties scan (these scan all SURF CSS and report other lanes' files as `pending` until they exist); `tests/data/rsc-hydration.test.tsx` with a UTC+14 server child process and UTC−11 client.
9. **Migration** (REQ-SURF-12..15): W2 deprecation rows on `release/4.x` (ids DEP-S0200..0399; chart engines and DEPRECATE/REMOVE `since: '4.2.0'`, renames/consolidations `4.3.0`), compat adapters (GlassDataTable, GlassDataGrid, GlassVirtualTable, GlassVirtualList, GlassTreeView, 4.x TreeView, GlassFileTree, GlassFileExplorer, GlassFilterBar, GlassStatCard, GlassKPICard, GlassMetricCard, GlassAnimatedNumber, GlassSparkline, GlassTimeline, GlassActivityFeed, GlassChip, GlassKeyValueEditor, date set with `Date` ↔ `CalendarDate` on the client and required `timeZone` on the server), codemod rows + fixtures, `cases/surf/data/`.
10. **Blocks and items** (REQ-SURF-170, -171, -174, -178): `data-workspace`, `analytics-dashboard`, `support-inbox` (I-3), `query-builder`, `tree-select`, `faceted-search`, `schema-viewer`; 5.2 `audit-log`, `permissions-matrix`. `fixtures.ts` deterministic; QUAL showcases import them.
11. **5.1 charts** (REQ-SURF-161..164): `Chart` implementing `ChartAdapter` on `d3-scale`/`d3-shape` optional peers (contract PR), keyboard cursor, ≤15 KB gz; `./charts` absent from every 5.0.x `latest` map.

## Tests (remote for every `*.spec.ts`)

Jest: `src/data/table/Table{,.virtual,.resize,.dom-contract,.reorder,.edit}.test.tsx` (incl. "sorting", "range selection", "states", "size", "numeric", "toggle every boolean", "handle"), `src/data/virtual-list/VirtualList.test.tsx` ("idle"), `src/data/tree-view/TreeView.test.tsx`, `src/data/filter-bar/{filter-model.test.ts,FilterBar.test.tsx}` ("round-trip" 40 cases, deep-frozen inputs), `src/data/{chip,key-value-editor,stat-card,sparkline,chart-frame}/*.test.tsx`, `src/components/timeline/*.test.tsx`, `src/date/{DatePicker,DateRangePicker,TimePicker,date-props,DateTimePicker}.test.tsx`, `src/date/week-number.test.ts` (20 cases incl. 2020-12-31 → W53, 2021-01-04 → W1), `tests/types/surf/filter-model.test-d.ts`, `tests/data/{exports/*,no-chart-deps,css/*,rsc-hydration,chart-palette,compat}.test.*`, `tests/capability/registry/{data-items,data-workspace,support-inbox,analytics-dashboard}.test.tsx`, `src/charts/Chart.test.tsx`, `tests/charts/peer-isolation.test.ts`; behaviour suites also under `jest -c tests/data/jest.doubles.cjs`.
Remote: `tests/a11y/apg/surf/{table,tree-view,filter-bar,calendar,date-picker,time-picker,date-time-picker}.apg.spec.ts`; `tests/e2e/surf/data/{table-virtual,table-pinning,table-responsive,tree-virtual,chart-frame-sr,forced-colors,preferences,axe}.spec.ts`; `tests/e2e/surf/date/{locale,date-picker-responsive}.spec.ts`; `tests/e2e/surf/charts/keyboard.spec.ts` (5.1); `tests/perf/browser/surf/{data-table,data-tree-view,data-date-picker}.spec.ts`; `tests/visual/surf/data/**`; canaries `data-server` (Next 16) and `DataTable.page.tsx` (Vite, 1,000 rows).

## Visual evidence

Remote captures of every §13 data/date story (Table `Default`, `Virtualized100k`, `ResizeAndPin`, `GridMode`, `OverMedia`, `RTL`; StatCard `Locales`; ChartFrame `TableModes`; Date `Mobile`, `Locales`, `TwoMonths`) at 390/1440 × light/dark × 8 scenes as CI artifacts; L14 through QUAL. Nothing committed.

## Prohibited

Index list, plus: chart.js, react-chartjs-2, date-fns or d3 outside `src/charts/**`; a runtime chart registry; tweened/animated values in StatCard; blurred glass on table content; `toLocale*`; mutating `data` or filter input; automatic virtualization switching; a format-string date prop.

## Exit criteria

- AC-SURF-10: 10,000 virtualized rows ≤31 `<tr>` in a 600 px container in 3 engines, `aria-rowindex` = data index + 2; scroll p95 ≤16.7 ms mobile, ≤8.3 ms desktop.
- AC-SURF-14: `renderToString` → `hydrateRoot` for StatCard, Sparkline, Timeline, ActivityFeed, ChartFrame, Table, DatePicker with server UTC+14 / client UTC−11: 0 warnings.
- AC-SURF-02 (W2 rows): `rg "chart\.js|react-chartjs-2|date-fns"` over SURF paths = 0; the `{ Button }` and `{ Table }` metafiles carry no RA, `@internationalized/date`, `d3-*`, and `{ Button }` no `@tanstack/*`.
- AC-SURF-13 (W2 rows): chart palette ≥3:1 vs `content-raised`, ΔE2000 ≥15 for indices 1–4 under three CVD simulations, chroma ≥0.08 for 1–6.
- AC-SURF-30 (5.1/5.2): `Chart` ≤15 KB gz and the AC-11/12/13 equivalents; `DateTimePicker`, Table inline edit, `audit-log`, `permissions-matrix` delivered at their releases.
- W2 rows of AC-SURF-01 (`./data`, `./date` exact; `Timeline`, `ActivityFeed` in root; `./charts` absent in 5.0.x), -11, -12, -23 (`{ Table }` ≤45 KB etc.), -24, -25 (flagships 14, 32–37), -26.
- SURF-134..275 `DONE` or `BLOCKED` with evidence; `npm test`, `npm run typecheck` green; merge-SHA pipeline `success`.

## Final report format

```
PROMPT-4b SURF/W2 REPORT
Branches/PRs: <next-surf/w2-*> <4x-surf/*>   Merge SHAs   GitLab pipelines: <URLs>
I-1 VirtualList: merged in <PR/sha>
Tasks SURF-134..275: DONE n / BLOCKED n (<id: reason + output>)
REQ-SURF-NN: <test> -> pass | fail | pending | double-pass   (66..105, 161..164, 174, 178 and W2 shares)
AC-SURF-10/-14/-30 (+ W2 rows of -01/-02/-11/-12/-13/-23/-24/-25/-26): PASS | FAIL | PENDING + artifact
I-3 blocks (data-workspace, support-inbox): merged | waiting for export <name>
Budgets measured vs rows; files changed; deviations with evidence
```
