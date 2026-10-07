# PROMPT-10i (OVL): Certification, budgets calibration, 5.0 deletions, API freeze

You are implementing the last part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (5.0 work on `main`, beta → rc.1). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md`:
  - §3, §5.1 REQ-OVL-12/-13
  - §5.10 REQ-OVL-75 (matrices), -77
  - §6, §9, §12.4, §13 items 3, 5, 6
  - §14 (390/RTL rules), §15 (global floors, L13 Manual SR lane)
  - §16, §17 (all AC), §18 DoD, §20 steps 10–11
- Certification: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` (8 scenes, pixel/OCR gates, manual matrix, `certify-*.yml`); `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` (Material Lab, `environment` global); `AURAGLASS_PERFORMANCE_PRD.md` (grades, `tests/perf/harness/**`); `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` (removal PR rules, one PR per family).
- Architecture: §15.1–15.4, §14.6 (revertable family PRs), §3.6 budgets.
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-15 (byte rows in PKG `docs/size-budgets.json`; runtime rows in PERF `tests/perf/harness/budgets.json`; calibrated at 5.0.0-alpha.1 by QA L10, ratchet down only), SC-28 (8 scenes), SC-29 (lanes L1–L14), SC-30, SC-39.
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-147..OVL-163. Anchor prerequisites: QA-018/031/049/086, DS-016, SB-060, PERF-039, PKG-048, FND-103 (consumer-grep removal gate), NAV-087, REL-003 (API report), DX-104 (docs generator).

Requirements: REQ-OVL-12, -13, -77, and the §9 deletions. Acceptance: AC-OVL-05, -08, -09, -10, -11, -12, -13, -14, -15, and the final verification of AC-OVL-01..20 on the RC SHA.

## 2. Scope
May create or modify:
- NEW `src/components/overlays/_shared/OverlayMatrix.stories.tsx`, generated from the 7 `.meta.ts` files (no hand-written matrix cells)
- `tests/e2e/overlays/overlay-a11y-modes.spec.ts`: subjects for all 9 widgets
- PRD-QA subject lists for the token/pixel/OCR/canary lanes: overlay rows only
- PKG budget file `docs/size-budgets.json` (PKG-048, MODIFY; gate PKG-049 `verify-size-budgets.mjs`; log in `docs/size-budgets.changelog.md`): calibrated values (ratchet down only). Runtime fps/long-task rows go in PERF `tests/perf/harness/budgets.json`
- Deletions on `main`, one PR per family:
  - modal: `src/components/modal/**`
  - mobile: `src/components/mobile/GlassActionSheet.tsx` and `MobileGlassBottomSheet` in `TouchGlassOptimization.tsx`
  - navigation menus: `src/components/navigation/{GlassDropdownMenu,GlassContextMenu,GlassMenubar,GlassMenuPrimitive,HeaderUserMenu}.tsx`, `navigation/components/CollapsedMenu.tsx`
  - toast/notification: `src/components/data-display/{GlassToast,GlassToastProvider,GlassNotificationCenter}.tsx`
  - positioning + subpath: `src/primitives/Positioner.tsx`, `src/primitives/positioning/GlassPositioner.tsx`, `src/overlays/index.ts`, and the `./overlays` key in `package.json` `exports`
  - each family also covers its stories, tests and `__snapshots__`
- `src/index.ts`: remove the 4.x overlay exports (`:93-110`, `:178-192`, `:317-340` at HEAD; re-locate by symbol)
- API report files for the root entry, `etc/api/index.api.md` and `etc/api/index.exports.json` (REL-003, `scripts/release/api-report.mjs`; overlay section review only)
- NEW `docs/auraglass-5/migration/overlays-consumers.md`: the consumer re-verification ledger

Must NOT touch: flagship behaviour (fixes go back through 10c–10g as separate PRs), the certification infra code (PRD-QA file), `GlassTransitions.tsx`/`GlassAchievementSystem.tsx` (their deletion is the Component Remediation PRD's removal work), `src/primitives/{FocusScope,DismissableLayer}.tsx`, `src/primitives/portal/GlassPortal.tsx` (KEEP).

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 10a–10h merged. All 7 flagship directories exist, and `./node_modules/.bin/jest src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast} src/components/overlays src/compat/overlays` is green.
- QA lanes exist and fail closed (QA-031 `certify-pr.yml`, plus `certify-main.yml` and `certify-release.yml`): `ls .github/workflows/certify-*.yml`. If they don't, the AC rows that need them are blocked.
- Deletion gates. Before each family PR:
  - `rg -n "<OldName>" src --glob '!src/compat/**' --glob '!**/*.stories.tsx'` returns only files deleted in the same PR.
  - The family's compat adapters (10h) are green.
  - Every consumer PRD has migrated its usages: for example, `rg -n "GlassModal|GlassDrawer" src/components` outside the family returns 0.
  - The FND-103 consumer-grep gate (`scripts/removal/consumer-grep.mjs`, `removal-gate.yml`) is green for the family.
  - If any check fails, that family's PR is blocked. Don't delete code that is still referenced.

## 4. Steps
1. **OVL-147 a11y modes (REQ-OVL-12, AC-OVL-08, -10).** Run `overlay-a11y-modes.spec.ts` over all 9 widgets, open, in Chromium, WebKit and Firefox:
   - Forced colors: 0 visible backdrop-filters and a `CanvasText` border.
   - `contrast: more`: a 1px contrasting border and specular off.
   - Reduced transparency.
   - axe with colour contrast on: 0 serious/critical violations.
2. **OVL-148 contrast (REQ-OVL-13, AC-OVL-09).** Register the subjects `overlays/*` (kind × thickness) in the PRD-DS three-composite token gate (≥4.5 / ≥3 large muted / ≥7 contrast-more) and in the OCR pixel gate over 8 scenes, light and dark. Worst-case text contrast must be ≥4.5:1.
3. **OVL-149 matrices (§13 item 3).** `OverlayMatrix.stories.tsx` generates state × thickness × transparency (`glass`/`tinted`/`solid`) × scheme from `.meta.ts`, rendered over the 8 scenes. Its story ids must be stable.
4. **OVL-150 390/RTL (AC-OVL-14).** In the L7 Pixel regression lane "mobile containment", every overlay story at 390×844 has `scrollWidth === 390`. Each flagship has an RTL baseline at 390, approved through PRD-QA's human review flow.
5. **OVL-151 SSR canaries (AC-OVL-15).** For every flagship, closed and `defaultOpen`: `renderToString` → `hydrateRoot` with 0 warnings, in both canaries (Next 16 + React 19.3, Next 15 + React 19.0), run remotely.
6. **OVL-152 manual matrix (AC-OVL-11).** 7 flagships × (VoiceOver macOS + Safari, VoiceOver iOS, NVDA + Chrome, TalkBack + Chrome, physical touch) = 35 cells, recorded in the PRD-QA living matrix with the build SHA. This is a human task. The agent prepares the per-cell scripts from `.meta.ts` keyboard tables and opens a tracking issue. A cell can't be marked green without a human tester record.
7. **OVL-153 perf grades and calibration (AC-OVL-05, REQ-OVL-77).**
   - Grade all 7 flagships in the remote L10 Performance lane. Each must be ≥C; Dialog targets ≥B.
   - Set every REQ-OVL-77 line to the measured value plus the PRD-PERF headroom rule, never above the PRD-OVL ceiling (Dialog/AlertDialog 20, Sheet 24, Popover 14, Tooltip 10, Menu 22, Toast 14 KB min+gz).
   - Overlay CSS total must be ≤6 KB gz. It is a stricter row under PERF REQ-PERF-01's 8 KB ceiling, and it is provisional until this calibration (PRD §21 O-3).
   - Record the calibrated runtime targets (§16.1 fps and long-task windows A/B) as rows in PERF `tests/perf/harness/budgets.json`. The GPU profile depends on QA's GPU pool (PRD §21 O-4).
8. **OVL-154 L1 Static lane (AC-OVL-12).** Over the overlay file set, `rg` and ESLint report 0 hits for:
   - `document.addEventListener`, `window.addEventListener`
   - `document.body.style`
   - `Date.now()` in render
   - `transition: all`, `!important`
   - `focus:outline-none`, and `outline: none` without a replacement
9. **OVL-155..159 family deletions (§9, §14.6).** One revertable PR per family, in this order: positioning + `aura-glass/overlays` subpath, then modal, then mobile, then navigation menus, then toast/notification. Each PR:
   - deletes the sources, stories, tests and snapshots
   - removes the root exports
   - keeps the compat adapters green
   - runs the full jest suite and the L2 Artifact lane remotely
   - lists the `rg` proof in its description
   - The duplicate `GlassTooltip` at `GlassPopover.tsx:678` goes with the modal family.
10. **OVL-160 root exports.** `src/index.ts` exports exactly the 9 overlay values + `useToast` (§10.1) and no 4.x overlay names. The root value count stays under the D-15 cap of 160 (report the number).
11. **OVL-161 API freeze (rc.1).** Review the overlay section of `etc/api/index.api.md` / `etc/api/index.exports.json` (REL-003):
    - no `@base-ui` specifier in `.d.ts`
    - the types match §10.1
    - any change after rc.1 is C-E only
12. **OVL-162 consumer re-verification.** Record in `overlays-consumers.md`, with links to green CI runs on the final contract SHA:
    - PRD-CTL (Select, Combobox)
    - PRD-DATA (DatePicker, DateRangePicker, FilterBar)
    - PRD-AI (Citation/SourceList)
    - PRD-NAV (CommandPalette, AppShell drawer, Sidebar overlay, TabBar overflow)
    - PRD-MED (ImageViewer)
    - Component Remediation (Tour on Popover)
13. **OVL-163 docs pages.** The PRD-DX docs generator renders, per flagship from `.meta.ts`, the parts table, the `data-ag-part`/`data-state` table, the keyboard table, the lineage, the budget line and the perf grade. Verify they are generated with no hand-written prop tables (the PRD-DX docs lint).

## 5. Tests to run
- All remote: the `certify-*` lanes by SC-29 id (L2 Artifact, L4 Token contrast, L5 Behaviour, L6 Environment visual, L7 Pixel regression with OCR, L8 Engine-specific, L10 Performance, L11 Consumer canaries), the `overlays-*` Playwright projects, and the full jest run on the runner.
- Local (light) only: `./node_modules/.bin/jest` on the touched test files, ESLint and `tsc --noEmit`.

## 6. Visual evidence
- Environment-matrix baselines for every flagship state: 8 scenes × light/dark × glass/tinted/solid × default/contrast-more/forced-colors/reduced-motion × tiers × 1440/390.
- RTL baselines at 390.
- New baselines are approved by humans in PRD-QA's review flow, never by `--update-snapshots`.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- No skipped, `.only` or `fixme` specs at the RC SHA: `rg -n "test\.skip|\.only\(|fixme|it\.todo" tests/a11y/apg/{dialog,alert-dialog,sheet,popover,tooltip,menu,context-menu,menubar,toast}.apg.spec.ts tests/e2e/overlays/ tests/perf/browser/overlays-*.spec.ts src/components/overlays/_shared src/components/{dialog,alert-dialog,sheet,popover,tooltip,menu,toast}` returns 0.
- No loosened budget or threshold; ratchet down only.
- Don't mark manual cells green without a tester record.
- Don't delete a family while references remain.
- No evidence committed to git.

## 8. Exit criteria
- AC-OVL-01..20 are all green on the RC SHA, each with a CI artifact link. AC-OVL-11 is green only with 35 human-recorded cells.
- Every §9 family is deleted in its own PR.
- The root export list matches §10.1.
- The API report is frozen.

## 9. Final report format
```
PROMPT-10i REPORT
RC SHA:
Tasks: OVL-147..163 -> done|blocked (reason) each
AC table: AC-OVL-01..20 -> green|red|blocked, artifact URL each
Perf grades: 7 flagships
Sizes calibrated: 7 lines (value / ceiling)
Deletion PRs: family -> PR URL, rg proof
Root value count:
Manual matrix: n/35 cells green
Consumer re-verification: PRD -> run URL
Deviations (with evidence) or none
```
