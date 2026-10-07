# PROMPT-15d (EXP): Owner hand-off of gap contracts, contract verification, RTL and spatial specs, roadmap story, release notes

Source PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` (Key **EXP**, self-id PRD-15). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-01 keys, SC-29 lanes, SC-30 test paths, SC-31 stories, SC-37 labs). Requirements: **REQ-EXP-21, -22, -23, -24, -25, -26, -27, -28, -30, -31**, plus REQ-EXP-33 (5.1 delivery flip), REQ-EXP-35 (publication), PRD §13.1, §13.3, §13.4, §15.9, DoD 3, 6, 7. Acceptance: **AC-EXP-07 (gap half), AC-EXP-08, AC-EXP-09 (owner half), AC-EXP-13 (stories half), AC-EXP-14 (labs half), AC-EXP-15**. Tasks: `docs/auraglass-5/tasks/EXP.json` EXP-072..EXP-093. Index: `docs/auraglass-5/prompts/PROMPT_15_EXP.md`.

This prompt does **not** implement `DateTimePicker`, `FileUpload.onUpload`, `ColorPicker.Area`, `OtpField`, `Table` reorder/edit or `media-transcript`; owners do (DATA, FND, MED). Status at 2026-10-06 (PRD REQ-EXP-21): X-17 → REQ-FND-32, X-18 → REQ-FND-33 and X-43 → REQ-MED-95 are already owned; **5 gaps remain open**: X-07 (A11Y), X-16, X-25, X-26 (DATA), X-19 (FND). This prompt files those 5 contracts in the owner PRDs, then verifies the owners' tests by name and flips ledger rows.

## 1. Files you may touch

- MODIFY (append-only, one new requirement each, at the end of the owner's requirements section, with the next free id in that file): `prd/AURAGLASS_ACCESSIBILITY_PRD.md` (X-07, from REQ-EXP-22), `prd/AURAGLASS_DATA_PRD.md` (X-16, X-25, X-26, from REQ-EXP-23/-27/-28), `prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` (X-19 only, from REQ-EXP-26). Each new REQ copies the contract verbatim and ends "(ledger X-nn; contract source REQ-EXP-nn)". Do **not** edit `AURAGLASS_MEDIA_BACKDROPS_PRD.md` (EXP-075 is verify-only).
- MODIFY (append one line "Capability ledger rows: X-..") the owner PRDs of every non-`PRD-EXP` row: MATERIAL_ENGINE, ACCESSIBILITY, COMPONENT_REMEDIATION, FLAGSHIP_CONTROLS, FLAGSHIP_OVERLAYS, APP_SHELL_NAVIGATION, DATA, AI, MEDIA_BACKDROPS, DEVELOPER_EXPERIENCE (all under `docs/auraglass-5/prd/`).
- MODIFY `docs/auraglass-5/capability-ledger.json` (`reqRefs`, `stories`, `status`, `artifacts` of rows named below)
- MODIFY `tests/capability/req-refs.test.ts`; NEW `tests/capability/contract-tests.test.ts`, NEW `tests/capability/rejected-absent.test.ts`
- NEW `tests/a11y/rtl.spec.ts`, NEW `tests/labs/spatial-admission.spec.ts`, NEW `tests/lint/logical-properties.test.ts`
- MODIFY `jest.config.js` (QA owns it, SC-29; MODIFY depending on QA-003): append `'<rootDir>/tests/a11y/rtl\\.spec\\.ts$'` and `'<rootDir>/tests/labs/.*\\.spec\\.ts$'` to `testPathIgnorePatterns` only, if QA's config does not already exclude Playwright specs
- NEW `src/stories/capability/CapabilityRoadmap.stories.tsx`
- Release-notes input for REL's `scripts/release/release-notes.mjs` (REL-033), in the slot that script reads; if REL has no slot yet, attach as CI artifact and report.

Must not touch: component sources under `src/**` (other than the story), owners' tests, any other requirement text in owner PRDs.

## 2. Prerequisites (owner prompts named)

- PROMPT-15a merged (`npm run verify:capability` exits 0). Tasks EXP-072..EXP-078 need nothing else (Wave 1–2).
- EXP-079: `AuraGlassProvider` with `dir` (A11Y-029, X-07), `Sheet` (OVL-097), `Slider` (CTL-089), `Breadcrumbs` (NAV-078), `Table` (DATA-038) stories in the CI Storybook (`storybook-static/index.json` contains their ids); QA cert config (QA-018).
- EXP-081..EXP-087: each owner's component merged (DATA-097/DATA-038, FND-081, FND-082, MED-041 + DX-067), checked in 15b's `exports.json`; X-19 waits for EXP-074's owner REQ.
- EXP-088: PROMPT-15e labs package (EXP-094) with at least one `area: "spatial"` resident, plus PERF's `run-perf.mjs` (PERF-039) on the remote mid-tier mobile profile. If no resident exists, write the spec and run it against a negative control only (see step 9) and report "no resident to admit".
- EXP-093: REL release notes (REL-033) at the `v5.0.0` and `v5.1.0` tags.

## 3. Steps

1. **EXP-072..EXP-074 file the 5 open gap contracts (REQ-EXP-21); EXP-075 verify REQ-MED-95 against REQ-EXP-30 (no edit).** Append the requirements listed in §1. Use `rg -o "REQ-<PFX>-[0-9]+" <file> | sort -V | tail -1` to pick the next id; never renumber existing ids.
2. **EXP-076 flip refs.** In the ledger, replace REQ-EXP-22/-23/-26/-27/-28 in `reqRefs` of X-07, X-16, X-19, X-25, X-26 with the new owner ids (keep the REQ-EXP id as a second entry); confirm X-17 REQ-FND-32, X-18 REQ-FND-33, X-43 REQ-MED-95. `npm run verify:capability` green.
3. **EXP-077 / EXP-078 backrefs (DoD 3).** Append the "Capability ledger rows" line to each owner PRD. Extend `req-refs.test.ts` with "every owner PRD file cites each of its ledger row ids" and "no gap row cites only a REQ-EXP id" (AC-EXP-07 gap half).
4. **EXP-079 `tests/a11y/rtl.spec.ts` (REQ-EXP-22, AC-EXP-08).** Playwright against the CI Storybook build with globals `dir:rtl` (and `locale:he-IL`): for `Sheet side="start"` assert the sheet's `boundingBox().x + width` ≈ viewport right edge (±1 px); for `Breadcrumbs` and `Table` header cells assert x-order is reversed vs the LTR capture; for `Slider` focus the thumb, press ArrowRight, assert `aria-valuenow` decreased; run `@axe-core/playwright` and assert 0 violations. Projects `chromium`, `webkit`, `firefox` from `playwright.config.ts`. Remote only.
5. **EXP-080 `tests/lint/logical-properties.test.ts` (REQ-EXP-22 static half).** Scans CSS under `src/{date,data,ai,media,charts}/**`, `src/components/*/` directories whose name is kebab-case (5.0 layout, `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1), and `registry/{blocks,items}/**`; fails on declarations `left:`, `right:`, `margin-left`, `margin-right`, `padding-left`, `padding-right` with file:line output. 4.x `Glass*` directories are out of scope.
6. **EXP-081..EXP-087 contract verification** in `tests/capability/contract-tests.test.ts`: one `describe` per row; each asserts that the owner's test file exists and contains the exact `it`/`test` titles, and that the ledger row is `delivered` only if so:
   - X-16 → `src/date/DateTimePicker.test.tsx` + `tests/a11y/apg/date-time-picker.apg.spec.ts` (SC-30; A11Y harness A11Y-073) (5.1)
   - X-17 → `src/components/file-upload/FileUpload.test.tsx` (REQ-FND-32, FND-081): "no onUpload → never complete", "abort sets status cancelled", "rejected promise sets status error"
   - X-18 → `src/components/color-picker/ColorPicker.test.tsx` (REQ-FND-33, FND-082): "area keyboard steps"; the area is one focusable element with `aria-valuetext` "saturation S%, brightness B%" (owner wins over the earlier two-input proposal)
   - X-19 → `src/components/otp-field/OtpField.test.tsx`: "paste 6 digits fires onComplete once" (5.1)
   - X-25 → `src/data/table/Table.reorder.test.tsx`: "move right updates columnOrder and announces", "pinned column cannot move into the unpinned group"
   - X-26 → `src/data/table/Table.edit.test.tsx`: "Escape cancels without callback", "Enter commits once" (5.1)
   - X-43 → `registry/items/media-transcript/media-transcript.test.tsx` (path as named by REQ-MED-95; SC-30 question is PRD §21 O-06 — follow MED's final path): "click cue seeks", "aria-current follows currentTime" (5.1)
   A row whose `release` is not yet due asserts only "not delivered"; it never passes vacuously once its release is due (the test reads `AURAGLASS_RELEASE_VERSION`). Link each owner's green CI run in the row's `artifacts`.
7. **EXP-089 `CapabilityRoadmap.stories.tsx` (§13.1).** Imports `docs/auraglass-5/capability-ledger.json` at build time; filterable table (area, priority, owner, release, form, status) with a link per row to its first `stories` id; a "Rejected novelty" tab listing X-R rows and reasons; every count computed from the JSON (rg for digits in JSX text = 0 except the filter labels P0..P3).
8. **EXP-090 part/prop stories (§13.3).** For every row with `form` incl. `part`/`prop`, set `stories` to the owner's named story id (e.g. `combobox--autocomplete`, `popover--hover-intent`, `toast--history`, `alert--banner`, `mediacontrols--scrubber`) once it exists in the CI `storybook-static/index.json`; 15b's `--delivery` check enforces it.
9. **EXP-088 `tests/labs/spatial-admission.spec.ts` (REQ-EXP-31, AC-EXP-14 labs half; L10 Performance, driven by `run-perf.mjs`, PERF-039).** Remote mid-tier mobile profile, CDP: p95 main-thread time per frame ≤4 ms over 300 frames (`Tracing` / `Performance.getMetrics`); extra composited layers ≤1 (`LayerTree.layerTreeDidChange` count with vs without the resident); 0 `requestAnimationFrame` callbacks in the 500 ms after `visibilitychange`→hidden and after scrolling the resident out of view (instrument `window.requestAnimationFrame` via `addInitScript`); two `prefers-reduced-motion: reduce` screenshots are byte-identical (SHA-256). Also include a negative control page (an rAF loop that ignores visibility) that the spec must fail, proving the probe works.
10. **EXP-091 `tests/capability/rejected-absent.test.ts` (AC-EXP-13 stories half, §13.4).** After 5.0-beta: rg over `src/**/*.stories.*` for every X-R `names` entry = 0. Before beta (read `AURAGLASS_RELEASE_VERSION`) it prints the remaining hits per file for FND's removal work (FND-103) and asserts the count did not increase vs the previous run's artifact.
11. **EXP-092 manual matrix (§15.9).** Confirm `tests/a11y/manual/scripts/<component>.md` exists (A11Y; schema `tests/a11y/manual/sr-record.schema.json`, A11Y-084) for Combobox, DatePicker/Calendar, Table, Composer, ToolCall, MediaScrubber, ResizablePanels and (5.1) DateTimePicker, and that `a11y-manual-<sha>.json` for the RC SHA has a record for each; add an assertion to `contract-tests.test.ts` that rows X-12, X-14, X-24, X-25, X-32, X-33, X-38, X-44 are `delivered` only when that record exists (artifact path from `AURAGLASS_SR_RECORD`).
12. **EXP-093 release notes + charts (REQ-EXP-33, -35, AC-EXP-15).** At `v5.0.0` and `v5.1.0` run `node scripts/ci/verify-capability-ledger.mjs --report release-notes --version 5.0` / `5.1`; hand the section to REL's `scripts/release/release-notes.mjs` (REL-033); every row links its CI artifact. At 5.1, set X-28 `delivered` only when the 5.1 L2 Artifact lane shows `{ Chart }` from `aura-glass/charts` ≤15 KB min+gz with `d3-scale`/`d3-shape` external (DATA row in `docs/size-budgets.json`, SC-15/SC-38).

## 4. Running

Jest (local, light): `npx jest tests/capability tests/lint/logical-properties.test.ts --ci`. Playwright specs, Storybook build and perf/CDP probes run only in CI or on an `auraone-remote-run` worker (`npx playwright test tests/a11y/rtl.spec.ts --project=chromium --project=webkit --project=firefox`). Read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` first. Never local browsers or Docker.

## 5. Prohibitions

No implementing owner components here; no editing owner tests or their names to match; no rewording owner requirements beyond the appended REQ; no skipped/only tests; no `test.fixme`; no relaxing ±1 px, ≤4 ms, ≤1 layer, 0 rAF or 0 axe; no flipping a row to `delivered` without its artifact URL.

## 6. Exit criteria

- AC-EXP-07: 5/5 open gap rows have owner REQ ids (3 already closed: X-17, X-18, X-43); backref test green.
- AC-EXP-08: `rtl.spec.ts` green on Chromium, WebKit and Gecko with 0 axe violations (L5 Behaviour run URL).
- AC-EXP-09 (owner half): at 5.1.0 X-16, X-19, X-26, X-28, X-42, X-43 delivered with artifacts.
- AC-EXP-13 (stories half): 0 rejected stories after 5.0-beta.
- AC-EXP-14 (labs half): spec green for admitted residents; negative control fails.
- AC-EXP-15: 5.0 and 5.1 "New capability" sections generated and linked.

## 7. Final report

```
PROMPT-15d report
branch / SHA / PR:
gap row -> owner file -> new REQ id (5 lines; plus REQ-MED-95 diff result for X-43):
backrefs added (PRD file -> row ids):
rtl.spec run URL per engine + axe count:
contract rows: id | owner test file | titles found | status | artifact
spatial-admission: resident | p95 ms | extra layers | rAF after hidden/scroll-out | reduced-motion hash equal | negative control failed?
CapabilityRoadmap story id; part/prop story ids set (count / rows):
rejected story hits remaining:
manual-matrix records present (rows):
release notes 5.0 / 5.1 location + link check:
blockers:
```
