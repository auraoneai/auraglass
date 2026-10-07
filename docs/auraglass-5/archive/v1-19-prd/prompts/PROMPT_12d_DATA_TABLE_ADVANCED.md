# PROMPT-12d (DATA): Table resize, pinning, pagination, grid mode and browser specs

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §4.3 (pinning, resize, grid-mode deviation), REQ-DATA-10 (pagination props), REQ-DATA-11 (`focusCell`), REQ-DATA-14 (browser half), REQ-DATA-15, -16, -17, -20 (coarse pointer), §12.2 rows `table.apg`, `table.virtual`, `table.pinning`, `table.responsive`, §14 Table row and the reflow/target/zoom requirements, §16 Table runtime lines, §20 step 2b.
- Architecture §11.2 #32, D-13 (alpha coverage check).
- Evidence: `src/components/data-display/GlassDataGrid.tsx:287,334-335` (proven table semantics; read only).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-045..DATA-054.

Requirements: REQ-DATA-10 (pagination), -11 (`focusCell`), -14 (browser), -15, -16, -17, -20 (coarse). Acceptance: AC-DATA-06 (three engines), AC-DATA-08 (Table), AC-DATA-09 (Table), AC-DATA-17 (Table).

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May modify: `src/data/table/Table.tsx`, `src/data/table/table.css`, `src/data/table/types.ts`, `src/data/table/Table.test.tsx` (add cases), `src/data/table/Table.stories.tsx` (add stories).
May create: `src/data/table/useGridKeyboard.ts`, `src/data/table/Table.resize.test.tsx`, `tests/a11y/apg/table.apg.spec.ts`, `tests/data/table.virtual.spec.ts`, `tests/data/table.pinning.spec.ts`, `tests/data/table.responsive.spec.ts`.
Must NOT touch: `src/components/**`, `playwright.config.ts`/`jest.config.js` (12b/PRD-QA own them), tokens, `package.json`, any other `src/data/**` component.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12c merged: `test -f src/data/table/Table.tsx && ./node_modules/.bin/jest src/data/table` green.
- Runner wiring (DATA-030): `node scripts/ci/verify-data-runner-split.mjs` exits 0.
- Remote Playwright lane with Storybook served (PRD-QA QA-018 cert config, QA-082 L5 Behaviour): a workflow or runner job that builds Storybook and runs `playwright test tests/data` and the `tests/a11y/apg/table.apg.spec.ts` spec on Chromium, WebKit and Firefox. Name the job you used.
- PRD-A11Y APG harness (A11Y-073): `test -f tests/a11y/apg/harness.ts`.
- PRD-CTL `Button`/`Select` for pagination (CTL-055, CTL-102): `test -f src/components/select/Select.client.tsx`.
- PRD-DS `--ag-table-pin-shadow` (DS-016; PRD §21 OI-04): `rg -n "ag-table-pin-shadow" src/material/css/generated tokens 2>/dev/null`.
- PRD-FND alpha coverage result for grid mode (FND-001; does Base UI ship a grid primitive?): read the PRD-FND report. If Base UI ships one, stop and report that §4.3 says the hook is replaced by it.

## 4. Steps
1. **DATA-049 spike first (§20.2b).** Prototype `useGridKeyboard` on a 10,000-row virtualized table. Measure focus retention when the focused row scrolls out and back, and when PageDown targets an unmounted row. Record the results (pass/fail per case, three engines, remote) in the PR description before writing the final hook.
2. **DATA-045 resize.** Handle markup and keys exactly as REQ-DATA-15. RTL inversion reads `dir` from the closest `[dir]`/provider. `columnResizeMode` is `'onEnd'` when virtualized with > 1,000 rows. The coarse-pointer hit area is expanded with `::before` (≥ 44×44) and the visual width is unchanged. Write `Table.resize.test.tsx`.
3. **DATA-047 pinning.** Sticky cells with `inset-inline-start = column.getStart('left')` and `inset-inline-end = column.getAfter('right')`; `data-ag-pinned-edge="start"|"end"` on edge cells; `box-shadow: var(--ag-table-pin-shadow)`. Auto-pin rule below 480 px container width when `columnPinning` is unset and there are > 3 columns. Read the container width from the scroller measurement the virtualizer already takes (no second `ResizeObserver`, §16 idle-cost row allows ≤ 1 per Table), and feed the derived pin state into TanStack. Add a "pinning attributes" case to `Table.test.tsx`.
4. **DATA-048 pagination.** `getPaginationRowModel` imported only when `pagination`/`defaultPagination` is given. Manual mode uses `rowCount`. Controls are PRD-CTL `Button` + `Select`, with names from `messages`.
5. **DATA-049 grid mode.** `mode="grid"` → `role="grid"`, rows `role="row"`, cells `role="gridcell"`/`columnheader`; roving `tabIndex` (exactly one `0`); keys per REQ-DATA-17; PageUp/PageDown call `virtualizer.scrollToIndex` and focus after the row mounts; focus target stored as `{rowId, columnId}` and re-resolved on remount; `aria-selected` on rows when selectable; `TableHandle.focusCell`. Target ≤ 2.5 KB gz for the hook (report the measured size).
6. **DATA-050 stories** `ResizeAndPin`, `ServerPagination` (`loaders`, 300 ms), `GridMode`.
7. **DATA-051..054 Playwright specs** exactly as described in the tasks. Every spec runs on all three engines. `tests/a11y/apg/table.apg.spec.ts` is built on `tests/a11y/apg/harness.ts` (A11Y-073) and runs in L5 Behaviour (QA-082). Axe runs from the PRD-A11Y spec `tests/a11y/browser/axe.spec.ts` (A11Y-078), where DATA-127 registers the data stories (SC-30); for this prompt, run that spec filtered to the Table stories.

## 5. Tests to run
Local: `./node_modules/.bin/jest src/data/table`, `./node_modules/.bin/eslint src/data/table`. Remote: `playwright test tests/data/table.*.spec.ts` on Chromium, WebKit and Firefox against the built Storybook, plus `{ Table }` budget. Attach run URLs and the Playwright HTML report artifact.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote screenshots (three engines, 1440 px and 390 px, light/dark): `ResizeAndPin` before and after a 2,000 px horizontal scroll in LTR and RTL (pinned columns in place, edge shadow visible), the resize handle focused (focus ring visible), `GridMode` with a focused cell, and `Default` at 390 px under coarse-pointer emulation. Also a 200%-zoom capture at 1440 px. Upload as a CI artifact gallery for human review.

## 7. Integrity rules (binding)
Specs drive the real Storybook build with real TanStack/react-virtual (no module mocks, no `page.route` fakes for data). Don't `test.skip` an engine. If WebKit or Firefox fails, fix it or report it as a blocker. Don't loosen the ±1 px pinning tolerance, the ≤ 31-row cap or the 44 px target. No `--update-snapshots`. No local Docker or local browser.

## 8. Exit criteria
- AC-DATA-06: `table.virtual.spec.ts` green in all three engines (≤ 31 rows throughout; `aria-rowindex="9001"` present).
- AC-DATA-08 (Table): `table.apg.spec.ts` "sorting" and "grid" green in all three engines.
- AC-DATA-09 (Table): `tests/a11y/browser/axe.spec.ts` (filtered to Table stories) reports 0 violations on `Default` and `GridMode`, light and dark.
- REQ-DATA-15: `Table.resize.test.tsx` green. REQ-DATA-16: `table.pinning.spec.ts` green, LTR and RTL.
- AC-DATA-17 (Table): `table.responsive.spec.ts` green at 320/390/1440 px, coarse pointer, and 200% zoom.
- Spike results recorded; hook size reported.

## 9. Final report format
```
PROMPT-12d REPORT
Branch/SHA:
Tasks: DATA-045..054 -> done|blocked (reason) each
Grid spike: case -> chromium/webkit/firefox pass|fail
useGridKeyboard size: … B gz
Prereq blockers: (exact output)
Tests: name -> engine -> pass/fail (remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
