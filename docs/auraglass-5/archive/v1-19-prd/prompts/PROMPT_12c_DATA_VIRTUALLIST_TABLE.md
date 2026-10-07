# PROMPT-12c (DATA): VirtualList and Table (table mode)

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §2.2 (E-13..E-21), §4.1–§4.3, §5.2 (REQ-DATA-10..14, 18..22), §5.3 (REQ-DATA-25, -26), §8 rows `src/data/table/*` and `src/data/virtual-list/*`, §12.1 Table/VirtualList rows, §13 Table/VirtualList rows, §14 Table row, §15, §16 Table/VirtualList lines.
- Architecture: §4 (material roles), D-08 (content materials), D-09, D-13, D-24, D-29; §11.1 (selection convention), §11.2 #32.
- Evidence: `docs/auraglass-5/autopsy/api-consistency.md` (API-CONSISTENCY-02, -09), `autopsy/performance.md` (PERFORMANCE-05), `autopsy/accessibility.md:57,63`. Reuse the token approach of `src/components/data-display/GlassDataGrid.module.css` (read only).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-033..DATA-044.

Requirements: REQ-DATA-10, -11, -12, -13, -14, -18, -19, -20, -21, -22, -25, -26. Acceptance: AC-DATA-06 (jsdom half), AC-DATA-20.

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `src/data/virtual-list/{VirtualList.tsx,VirtualList.test.tsx,VirtualList.stories.tsx}`, `src/data/table/{types.ts,table.types.ts,useTableState.ts,Table.tsx,table.css,Table.test.tsx,Table.virtual.test.tsx,Table.dom-contract.test.tsx,Table.stories.tsx}`.
May modify: `src/data/index.ts` (add the DATA-044 exports), `src/data/data.css` (`@import` of `table.css`).
Must NOT touch: `src/components/**` (never import from it; ESLint enforces this), `src/hooks/useVirtualization.ts`, `src/index.ts`, `package.json`, token sources (request missing `table.*` tokens from PRD-DS; don't hard-code values). Resize, pinning, pagination and grid mode belong to 12d. Don't stub them; leave the props unimplemented and typed, and make sure the docs/tests in this prompt don't claim them.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12b merged: `rg -n "react-hooks/rules-of-hooks" eslint.config.js` and `rg -n '"@tanstack/react-table"' package.json` (exact pin) both match; `node -p "require('./package.json').devDependencies.react"` starts with `19.`.
- PRD-FND/CTL/OVL pattern gate (Button CTL-055 + Dialog OVL-040 certified; React 19 ref pattern, parts registry FND-005): the PRD-QA L5 Behaviour results for Button and Dialog are green (link the artifact), and `test -f src/foundation/parts.ts`.
- PRD-CTL `Checkbox` with `indeterminate` (CTL-029): `rg -n "indeterminate" src/components/checkbox/Checkbox.client.tsx`.
- PRD-FND `Skeleton` (FND-059): `test -f src/components/skeleton/Skeleton.tsx`.
- PRD-MAT `Surface`/`ScrollEdge` and `data-ag-surface` roles `content-raised` and `chrome` (MAT-047, MAT-015): `rg -n "export (function|const) ScrollEdge" src/material`.
- PRD-A11Y announcer (A11Y-054): `test -f src/theme/announcer/useAnnouncer.ts`.
- PRD-DS tokens `table.row-height.*`, `--ag-table-cell-padding-inline`, `--ag-state-hover`, `--ag-state-selected`, `--ag-table-pin-shadow` (DS-016 compiler; no DS component-token task exists yet, PRD §21 OI-04): `rg -n "ag-table-row-height|ag-state-selected" src/material/css/generated tokens 2>/dev/null`.
- PRD-SB preview (SB-048) for `Table.stories.tsx`: `rg -n "environment" .storybook/preview.tsx`.
If a control/overlay prerequisite is missing, stop. Don't build a local Checkbox or Skeleton.

## 4. Steps
1. **DATA-033 VirtualList.** `'use client'`; `useVirtualizer` with `measureElement`; props exactly per REQ-DATA-25; `anchor="end"` pins to bottom on append (compare `scrollHeight` before/after in a layout effect); `onEndReached` fires once per crossing (reset when the user scrolls back above the threshold); `role` defaults to `list`; React 19 `ref` prop with `VirtualListHandle`. No rAF loop, no interval.
2. **DATA-034/035** tests (`idle`: fake timers, spy `requestAnimationFrame`/`setInterval`, 0 calls in 500 ms after settle) and stories `Fixed`, `DynamicHeights`, `AnchorEnd` (timer paused under reduced motion and `document.hidden`).
3. **DATA-036 types.ts.** `TableColumnDef`, `ColumnMeta` augmentation (`align`, `numeric`, `truncate`, `headerLabel`), `TableProps<TData>` with every REQ-DATA-10 name, `TableHandle<TData>`, `TableMessages`. `table.types.ts` contains `@ts-expect-error` cases.
4. **DATA-037 useTableState.** One state pair helper per state; never call hooks conditionally (every hook is called on every render, and the branch selects the value).
5. **DATA-038 Table.tsx** in this order, each with its tests green before the next:
   a. Semantics: `<table>` + `<caption>` (or `aria-label`/`aria-labelledby`; dev warning if none); `<th scope="col">`; `data-ag-part` per REQ-DATA-19; root `data-ag-surface="content-raised"`.
   b. Sorting: `getSortedRowModel` imported only in the sorting path; `sortDescFirst: false`, `enableSortingRemoval: true`; `<button>` "Sort by {headerLabel}" (from `messages`); `aria-sort` only on sortable headers; `data-sorted`; announcer "Sorted by {label}, ascending".
   c. Selection: `single` → `aria-selected` rows; `multiple` → PRD-CTL `Checkbox` column + header tri-state "Select all rows"; Shift+click and Shift+Space ranges on the sorted row model from the last anchor; `getRowId` required (dev warning).
   d. Virtualization: `useVirtualizer` on `table-scroller`; `<tbody>` explicit height; rows absolute + `translateY`; `aria-rowcount = rowCount ?? data.length + 1`; `aria-rowindex` 1-based with header = 1; overscan default 8; `estimateRowHeight` default from density (32/40/48). `stickyHeader` defaults to `true` when virtualized; the header is wrapped in PRD-MAT `ScrollEdge`, `data-ag-surface="chrome"`, thickness `thin`, and is the only blurred surface.
   e. States: `loading` → `aria-busy="true"` + 8 `Skeleton` rows, existing rows kept, `data-state="loading"`; empty → `emptyState` in one `<td colSpan>` `data-ag-part="table-empty"`.
   f. Density, numeric meta, `onRowAction` (row click and Enter on a focused row button), `maxHeight`, `ref` handle (`getInstance`, `scrollToRow`; `focusCell` throws a dev error outside grid mode until 12d), dev warning "Consider `virtualize`" when > 500 rows and not virtualized.
6. **DATA-039 table.css** per the task (container query root, coarse-pointer 44 px floor, selected = fill + 2 px start-edge indicator, forced-colors rules). Zero literals, zero `!important`, no `backdrop-filter` (optics come from `data-ag-surface`).
7. **DATA-040..042** tests with the exact names in the tasks. The DOM-contract test uses an inline snapshot. A change to it is a C-B diff for PRD-REL's change-class lane and is never updated just to pass.
8. **DATA-043** stories: `Default`, `Sortable`, `MultiSelect`, `Virtualized100k` (seeded PRNG at module scope), `Density`, `Loading`, `Empty`, `RTL`, `OverMedia`. Use product-realistic copy, no inline hex, typed variant metadata.
9. **DATA-044** add exports to `src/data/index.ts`.

## 5. Tests to run
Local: `./node_modules/.bin/jest src/data/virtual-list src/data/table`, `./node_modules/.bin/eslint src/data`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`. Remote: Storybook build, `tests/exports/data-date-entries.test.ts` (report job), `tests/exports/data-peer-isolation.test.ts`, budget scenario `{ Table }` ≤ 45 KB and `{ VirtualList }` ≤ 6 KB (provisional), and `tests/data/table.virtual.spec.ts` if 12d has written it.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote Storybook screenshots (Chromium, 1440 and 390 px, light and dark, `photo` and `plain` scenes) of `Default`, `MultiSelect` (2 rows selected), `Virtualized100k` scrolled to row 50,000 with the sticky header over content, `Density`, `Loading`, `Empty`, `RTL`, `OverMedia`. Upload them as a CI artifact gallery for human review. Screenshots are evidence, not baselines (baselines come from 12i).

## 7. Integrity rules (binding)
Use real TanStack and react-virtual in every test (mock only layout measurement: `getBoundingClientRect`/`offsetHeight`). No placeholder rows, no fake virtualization (the DOM row cap must hold), no `.skip`/`.only`, no snapshot updates to pass, and no lowering of the ≤ 31-row cap or the budget numbers. Never import from `src/components/**`. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-10/11: controlled + uncontrolled tests green for every state pair; `handle` test green.
- REQ-DATA-12: numeric column first activation gives `aria-sort="ascending"`; cycle and announcement asserted.
- REQ-DATA-13: anchor row 2 + Shift-click row 6 = 5 selected; header tri-state.
- AC-DATA-06 (jsdom half): ≤ 31 `<tr>` for 10,000 rows at 600 px; `aria-rowindex` = data index + 2.
- REQ-DATA-18..21: states, DOM contract snapshot, density computed style, numeric alignment green.
- AC-DATA-20: "toggling every boolean prop does not throw" green; `eslint src/data` reports 0 rules-of-hooks errors.
- REQ-DATA-25/26: VirtualList tests green including `idle`.

## 9. Final report format
```
PROMPT-12c REPORT
Branch/SHA:
Tasks: DATA-033..044 -> done|blocked (reason) each
Budgets (remote, provisional): {Table}=… KB gz, {VirtualList}=… KB gz (CI URL)
Prereq blockers: (foundation gate, Checkbox, Skeleton, ScrollEdge, announcer, tokens; exact output)
Tests: name -> pass/fail (local|remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
