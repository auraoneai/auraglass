# PROMPT-12f (DATA): filter model, FilterBar, TreeView and registry items

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §2.3 (E-25, E-26), §2.5 (E-32, E-33), §4.1 rule 3, §4.6 (QueryBuilder deviation), §5.4 (REQ-DATA-30..32), §5.5 (REQ-DATA-35..39), §8 rows `filter-bar`, `tree-view`, §12.1/§12.2 rows, §13 rows, §14 FilterBar/TreeView rows, §15, §16 lines, §20 steps 6–7.
- Architecture: D-13 (RA optional peer for TreeView), D-15, D-17, §11.2 #33, #34.
- Evidence: `src/components/interactive/GlassQueryBuilder.tsx:152,188,198,210` (mutation in render), `src/components/tree-view/TreeItem.tsx:271,277,352` (read only); `docs/auraglass-5/autopsy/accessibility.md` ACCESSIBILITY-13.
- PRD-DX registry layout: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` §4.1 (`registry/items/<name>/**`).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-077..DATA-091.

Requirements: REQ-DATA-30, -31, -32, -35, -36, -37, -38, -39. Acceptance: AC-DATA-08 (FilterBar, TreeView), AC-DATA-09 (these stories).

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `src/data/filter-bar/{filter-model.ts,filter-serialize.ts,filter-model.types.ts,filter-model.test.ts,FilterBar.tsx,filter-bar.css,FilterBar.test.tsx,FilterBar.stories.tsx}`, `src/data/tree-view/{TreeView.tsx,tree-view.css,TreeView.test.tsx,TreeView.stories.tsx}`, `tests/a11y/apg/filter-bar.apg.spec.ts`, `tests/a11y/apg/tree-view.apg.spec.ts`, `tests/data/tree-view.virtual.spec.ts`, `registry/items/query-builder/**`, `registry/items/faceted-search/**`, `registry/items/tree-select/**`.
May modify: `src/data/index.ts` (DATA-091), `src/data/data.css`.
Must NOT touch: `src/components/**`, `src/index.ts`, `package.json`, registry build scripts (PRD-DX), other `src/data/**` components. `react-aria-components` may be imported only from `src/data/tree-view/**` (ESLint enforces it).

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12b merged (RAC optional peer from PKG-059 + devDependency): `rg -n '"react-aria-components"' package.json` appears in `peerDependencies` and `devDependencies`.
- 12c merged (`VirtualList`): `test -f src/data/virtual-list/VirtualList.tsx`.
- PRD-CTL `SearchField` (CTL-075), `IconButton` (CTL-061), `SegmentedControl` (CTL-081), `Select` (CTL-102); PRD-OVL `Popover` (OVL-063), `Sheet` (OVL-097); PRD-FND `Chip` (FND-071): `rg -l "export (function|const) (SearchField|IconButton|SegmentedControl|Popover|Sheet|Chip)\b" src`.
- `./icons` folder/file icons for `preset="files"`: `rg -n "Folder|File" src/icons/index.ts 2>/dev/null` (owner PRD-FND, FND-048). If missing, report a blocker for the preset only.
- PRD-DX registry (SC-32): `registry/registry.json` (DX-067), `scripts/registry/lint.mjs` (DX-070) and the render harness `tests/dx/registry-render.spec.ts` (DX-094): `test -f registry/registry.json && test -f scripts/registry/lint.mjs && test -f tests/dx/registry-render.spec.ts`. Items go to `registry/items/<id>/`; DX registers them in `registry.json` (do not edit it unless a DX task directs you).
- PRD-A11Y APG harness (A11Y-073) and L5 Behaviour (QA-082): `test -f tests/a11y/apg/harness.ts`.
- PRD-FND alpha coverage check (FND-001, D-13): if Base UI shipped a Tree, follow the PRD-FND decision and record it.

## 4. Steps
1. **DATA-077 filter-model.ts.** Types and the default operator table per REQ-DATA-35. `FilterRule<F>` is generic over the field so invalid operator/field pairs fail to type-check. `useFilterModel` is a pure `useReducer`; each action returns a new tree with structural sharing; inputs are never mutated; invalid operators produce a dev warning.
2. **DATA-078 filter-serialize.ts.** `serializeFilters`/`parseFilters`, lossless for all 7 field types and nested groups, stable key order, unknown ids ignored, invalid operators dropped with a dev warning.
3. **DATA-079 tests.** A deep-freeze helper for all actions, the fixed 40-case round-trip table (no fast-check), and `filter-model.types.ts` `@ts-expect-error` cases compiled by `tsc --noEmit`.
4. **DATA-080 FilterBar.tsx** (`'use client'`). `data-ag-surface="chrome"` thin. Chips with remove `IconButton` names per REQ-DATA-38. The chip editor is a PRD-OVL `Popover` (focus first field on open, return to chip on close). Quick filters use `aria-pressed`. `resultCount` is announced politely. Responsive behaviour per §14 (container queries; < 480 px "Filters (n)" opens a bottom `Sheet`; 480–767 px two lines then "+n more"). Implement `messages`.
5. **DATA-081..083** unit tests, stories (`Default`, `WithQuickFilters`, `UrlSync`, `WithTable`) and `filter-bar.apg.spec.ts`.
6. **DATA-085 TreeView.tsx** (`'use client'`) on RAC `Tree`/`TreeItem`. Props per REQ-DATA-30. `loadChildren` shows `aria-busy` on the item. `preset="files"` icons are `aria-hidden`. `virtualize` windows the flattened visible tree through `VirtualList` (or RAC `Virtualizer`; record which and why). `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` on every treeitem. Exactly one tab stop. `data-ag-surface="content"`. Indent and truncation per §14.
7. **DATA-086..089** unit tests, stories (`Default`, `Files`, `AsyncLoad`, `MultiSelect`, `Virtualized5k`, `RTL`), `tree-view.apg.spec.ts` (full APG script including `*` and 1,000 ms type-ahead), `tree-view.virtual.spec.ts` (≤ 40 treeitems for 5,000 nodes in 480 px).
8. **DATA-084/090 registry items** `query-builder` (nested groups on `useFilterModel`, no private logic), `faceted-search`, `tree-select` (PRD-CTL `Select` + `TreeView`), with zero inline hex, `!important` or layout literals.
9. **DATA-091** exports. After this the `./data` value set is complete (13 names). Flip the export-set assertion in `tests/exports/data-date-entries.test.ts` from report-only to required for `./data`.

## 5. Tests to run
Local: `./node_modules/.bin/jest src/data/filter-bar src/data/tree-view`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, `./node_modules/.bin/eslint src/data`. Remote: the three Playwright specs on Chromium/WebKit/Firefox, `tests/exports/data-peer-isolation.test.ts` (RAC reachable only through tree-view), `tests/exports/data-date-entries.test.ts`, the registry render harness (`tests/dx/registry-render.spec.ts`) and lint (`scripts/registry/lint.mjs`), and `scripts/ci/verify-size-budgets.mjs` for the `docs/size-budgets.json` rows `{ TreeView }` ≤ 8 KB and `{ FilterBar, useFilterModel }` ≤ 12 KB.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote screenshots (three engines, 1440/768/390 px, light/dark): FilterBar `Default` with 3 active chips, the chip editor popover open, `WithQuickFilters`, the 390 px collapsed "Filters (n)" state and its Sheet; TreeView `Files` expanded two levels with focus ring, `MultiSelect`, and `RTL`; the `query-builder` registry render. Upload as a CI artifact gallery for human review.

## 7. Integrity rules (binding)
No mutation anywhere in the filter model (the deep-freeze test is the proof). Don't mock RAC in browser specs. Don't reduce the 40-case table, the ≤ 40 treeitem cap or the 1,000 ms type-ahead window. Don't ship a visual QueryBuilder in core (the PRD's §4.6 deviation keeps it as a registry item). No `.skip`/`.only`, no snapshot updates to pass. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-35..37: model, type and round-trip tests green.
- REQ-DATA-38 / AC-DATA-08 (FilterBar): unit tests and `filter-bar.apg.spec.ts` green in three engines.
- REQ-DATA-39: the `query-builder` registry item passes the render lane.
- REQ-DATA-30/31 / AC-DATA-08 (TreeView): unit tests and `tree-view.apg.spec.ts` green in three engines.
- REQ-DATA-32: `tree-view.virtual.spec.ts` green.
- AC-DATA-09 (these stories): axe 0 violations, light and dark.
- `./data` export set required and green.

## 9. Final report format
```
PROMPT-12f REPORT
Branch/SHA:
Tasks: DATA-077..091 -> done|blocked (reason) each
Tree virtualization: VirtualList | RAC Virtualizer (reason)
Budgets: TreeView=…, FilterBar+useFilterModel=… KB gz (CI URL)
Prereq blockers: (exact output)
Tests: name -> engine -> pass/fail (local|remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
