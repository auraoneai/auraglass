# PROMPT-12i (DATA): certification — showcases, preferences, perf, axe, visual, canaries, manual matrix, blocks, docs

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main` (beta → RC-1).

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §12.2 (preferences, perf, axe, visual baselines, manual matrix, canaries), §13 (showcase compositions), §14 (reflow, targets, legible text, zoom), §15 (all rows), §16 (all budgets), §17 (AC-DATA-03, 07, 09, 10, 13, 16, 17, 18), §18, §20 steps 11–12, §21 (OI-04, OI-10, OI-13).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15 (size rows and runtime budgets), SC-28 (8 scenes), SC-29 (lanes L1..L14), SC-30 (test layout), SC-31 (Storybook, showcases), SC-32 (registry blocks), OV-17, OV-19.
- Architecture: §15 (certification, §15.1 matrix, §15.2 pixel gates, §15.4 Lab), D-09, D-26, D-32.
- PRD-QA: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (lanes, scenes QA-038/039, pixel gates QA-045/047, L6 QA-056, L10 QA-085, review/matrix templates QA-099). PRD-SB: `prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` (preview SB-048; showcases SB-105/107/116). PRD-PERF: `prd/AURAGLASS_PERFORMANCE_PRD.md` (`tests/perf/harness/run-perf.mjs`, PERF-039; `tests/perf/harness/budgets.json`). PRD-A11Y: axe spec A11Y-078, manual SR records A11Y-084. PRD-PKG: canaries PKG-121/122/125/126, size gate PKG-048/049. PRD-DX: blocks DX-073/074, render harness DX-094, docs app DX-101.
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-123..DATA-134.

Acceptance: AC-DATA-03, AC-DATA-07, AC-DATA-09, AC-DATA-10, AC-DATA-13, AC-DATA-16, AC-DATA-17, AC-DATA-18; verifies the remaining ACs on the release SHA. The PRD is done when AC-DATA-01..18 and AC-DATA-20 pass on the 5.0.0 GA SHA.

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `tests/data/data.preferences.spec.ts`, `tests/perf/browser/data-{table,tree-view,date-picker}.spec.ts`, `tests/visual/data/**`, `canaries/next16/app/data-server/page.tsx`, `canaries/next16/app/data-client/page.tsx` (pages inside the PKG canary app), `canaries/vite/src/DataTable.tsx`, `tests/a11y/manual/scripts/data-date.md`, `apps/docs/content/components/{table,tree-view,filter-bar,stat-card,sparkline,chart-frame,timeline,date}.mdx`.
May modify (MODIFY only, after the owner anchor exists): `showcase/financial-dashboard/`, `showcase/analytics/`, `showcase/ops-console/` (data compositions only; SB owns the files, SC-31), `tests/a11y/browser/axe.spec.ts` (register data/date stories; A11Y-078), `registry/blocks/analytics-dashboard/**` and `registry/blocks/data-workspace/**` (block content; DX scaffolds and registers them, SC-32), `docs/size-budgets.json` (calibrated rows only, equal or lower; changes logged in `docs/size-budgets.changelog.md`), `tests/perf/harness/budgets.json` (DATA runtime rows only; PERF owns the file).
Must NOT touch: component implementations (file defects against 12c–12g and fix them there), thresholds in any spec or gate (never raise), the PRD-QA/PERF harness code, `.storybook/preview.tsx` (SB-048), `registry/registry.json` (DX-067). Do not create `src/data/surfaces/**`, a `dashboard` block, `scripts/ci/verify-tree-shaking.js` or a committed manual-results report.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12c–12h merged; `./node_modules/.bin/jest src/data src/date src/compat` green.
- PRD-QA lanes: scenes (QA-038/039) `test -f certification/scenes/scenes.manifest.json`; L6 (QA-056) `test -f certification/lanes/environment-visual.spec.ts`; pixel gates (QA-045/047) `ls packages/qa/src/pixel/`; L10 (QA-085) `test -f certification/lanes/perf.spec.ts`; review templates (QA-099) `ls certification/review/`.
- PRD-PERF harness (PERF-039): `test -f tests/perf/harness/run-perf.mjs && test -f tests/perf/harness/budgets.json`.
- PRD-A11Y axe spec (A11Y-078) and SR schema (A11Y-084): `test -f tests/a11y/browser/axe.spec.ts && test -f tests/a11y/manual/sr-record.schema.json`.
- PRD-PKG canaries (PKG-121/122/125/126): `ls canaries/next16/app canaries/next15 canaries/vite`.
- PRD-SB preview and showcases (SB-048, SB-105/107/116): `rg -n "environment" .storybook/preview.tsx && ls showcase/financial-dashboard showcase/analytics showcase/ops-console`.
- PRD-NAV `AppShell` (NAV-016): `test -f src/app-shell/AppShell.tsx`.
- PRD-MAT dev surface counter (MAT-055): `test -f src/material/dev/surfaceCounter.ts`.
- PRD-DX block scaffolds and render harness (DX-073/074/094) and docs app (DX-101): `ls registry/blocks/analytics-dashboard registry/blocks/data-workspace tests/dx/registry-render.spec.ts apps/docs/package.json`.
(Status of these anchors is tracked in PRD §21 OI-10.)

## 4. Steps
1. **DATA-123** supply the data compositions to the SB showcases `financial-dashboard`, `analytics` and the data parts of `ops-console`, from unmodified public components.
2. **DATA-124** `data.preferences.spec.ts` (contrast more, reduced motion, reduced transparency / transparency `solid`).
3. **DATA-125** `tests/perf/browser/data-*.spec.ts` driven by `run-perf.mjs`, with every §16 runtime row added to `tests/perf/harness/budgets.json` and asserted. Run each scenario ≥ 5 times per profile and assert on the median, with p95 where the PRD says p95. Runs in L10 Performance.
4. **DATA-126** register every §13 story under `tests/visual/data/` for L6 Environment visual and L7 Pixel regression across the §15.1 matrix (8 SC-28 scenes). The first baselines go through human review of the artifact gallery before they are accepted.
5. **DATA-127** register every data/date story in `tests/a11y/browser/axe.spec.ts` × light/dark × 8 scenes, with color-contrast on and no rule disabled.
6. **DATA-128** pixel gates on the showcases and every story (OCR ≥ 4.5:1, ≥ 7:1 under contrast more; p10 word height ≥ 10 px at 390 px; glass density ≤ 0.3; material presence; not blank; no overlap; mobile containment), plus the MAT-055 surface counter (Table ≤ 1 blurred surface).
7. **DATA-129/130** canaries (L11): Next 16 + React 19.3 server page (assert the client reference manifest has 0 modules from `src/data/stat-card`, `src/data/sparkline`, `src/data/timeline/Timeline.tsx`, `src/data/chart-frame/ChartFrame.tsx`), client page, Next 15 + React 19.0 floor, and Vite + React 19 without Tailwind (`{ Table }` chunk ≤ its `docs/size-budgets.json` row).
8. **DATA-131** manual matrix script `tests/a11y/manual/scripts/data-date.md` (steps per component for VoiceOver macOS/iOS, NVDA, TalkBack, physical touch; L13 Manual SR). Humans run it. Record only results you are given, as `sr-record.schema.json` records in CI artifacts, with tester, date and SHA.
9. **DATA-132** calibrate the `docs/size-budgets.json` rows and DATA runtime rows at alpha.1 (equal or lower only) and record A–F grades for the 7 flagships (each ≥ C).
10. **DATA-133/134** content of the GA blocks `analytics-dashboard` (StatCard row + Sparkline + ChartFrame + Timeline) and `data-workspace` (Table + FilterBar + TreeView + StatCard + Pagination), passing `scripts/registry/lint.mjs` and `tests/dx/registry-render.spec.ts`; DatePicker usage goes to the DX `settings` block through a DX task. Then the docs pages with generated API and selector tables in `apps/docs/`.

## 5. Tests to run
All remote: the specs above on Chromium/WebKit/Firefox, L6/L7 visual + pixel gates, L10 perf, `scripts/ci/verify-size-budgets.mjs`, the three L11 canaries, the registry render harness, and the docs build. Locally only `./node_modules/.bin/eslint` / `tsc --noEmit` on files you author.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
The full environment-matrix gallery for every PRD-DATA story and the three showcases (8 scenes × light/dark × 390/1440 px × 3 engines) with the pixel-gate scores per image, as CI artifacts. A human reviewer signs off on the baseline PR using the QA-099 rubric. Call out explicitly in the review request: chart/sparkline saturation (E-09), sparkline contrast (E-23), legible text at 390 px (`visual-quality.md:88`), and the sticky header as the only blurred surface.

## 7. Integrity rules (binding)
Don't raise or relax any threshold, budget, gate or matrix cell, and don't exclude a story or scene from a lane. Don't accept baselines without the pixel gates green and human approval. Don't fill manual-matrix results yourself. Use the perf harness's real profiles (no unthrottled runs labelled mobile). No `.skip`/`.only`/`test.fixme`, no `--update-snapshots`. No local Docker or local browser.

## 8. Exit criteria
- AC-DATA-03: every DATA row in `docs/size-budgets.json` green in `verify-size-budgets.mjs` with calibrated numbers.
- AC-DATA-07: Table scroll p95 ≤ 16.7 ms mobile and ≤ 8.3 ms desktop.
- AC-DATA-09: `tests/a11y/browser/axe.spec.ts` 0 violations across all data/date stories, schemes and scenes.
- AC-DATA-10: OCR worst case ≥ 4.5:1 (≥ 7:1 under contrast more).
- AC-DATA-13: Next 16 manifest contains 0 modules from the four server files.
- AC-DATA-16: 7 flagships ≥ C, environment baselines green, manual rows complete.
- AC-DATA-17: no page overflow at 320 px; coarse targets ≥ 44×44 on every story.
- AC-DATA-18: the data showcases pass every §15.2 gate at 1440 and 390 px.
- Final AC-DATA-01..18 + AC-DATA-20 table on the GA SHA, with links.

## 9. Final report format
```
PROMPT-12i REPORT
Release SHA:
Tasks: DATA-123..134 -> done|blocked (reason) each
AC table: AC-DATA-01..20 -> pass|fail|n/a(5.1) -> CI artifact URL
Perf: scenario -> profile -> median/p95 vs budget
Grades: flagship -> A..F
Budgets (calibrated): import -> bytes gz (before -> after)
Manual matrix: component × AT -> pass|fail|pending (tester, date)
Prereq blockers: (anchor id -> exact output)
Defects filed against 12c–12g: (list)
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
