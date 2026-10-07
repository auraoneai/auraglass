# PROMPT-11h (NAV): Remote certification run — layout, a11y, blur, forced colors, contrast, motion, perf, canaries, budgets

Source PRD: `docs/auraglass-5/prd/AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` (Key NAV; alias PRD-11; contracts `prd/_shared-contracts.md` SC-15, SC-28..30, SC-38, SC-39; key crosswalk `PROMPT_11_NAV.md`), §5.12 (REQ-77..81), §12.2, §12.3, §15, §16, §17, §18 DoD 2/8/9, §20 step 12.
Requirement IDs: REQ-NAV-77, -78, -79, -80, -81, -47 (aggregate), plus the full remote execution of every browser assertion authored in 11a–11g (REQ-NAV-03..07, 10, 13, 17, 19, 22, 24, 27, 28, 31, 34, 37, 40..42, 46, 48, 50, 52..54, 57, 60, 62, 65, 66, 68, 70, 72, 74, 75).
Acceptance: AC-NAV-01, -02, -03, -04, -05, -06, -07, -08, -09, -10, -14, -16, -17 (all on the release SHA). Tasks: NAV-108..NAV-119.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main` (5.0). Architecture wins; deviations reported with evidence.
- **Everything in this prompt runs remotely** (PRD-QA lanes `certify-pr.yml`/`certify-main.yml`/`certify-nightly.yml` (QA-031..033) or the gated runner via skill `auraone-remote-run`; Chromium, WebKit, Gecko). No local browser, no local Docker, no local Storybook server. Local work is limited to editing spec/config files and `npm test`/`typecheck`/`eslint` on them.
- No fake completion: no `test.skip`/`fixme`/`only`, no retries added to mask flakes (> the lane default), no threshold edits, no `--update-snapshots`, no baseline regeneration to pass, no budget raise except the single alpha calibration PR labelled `budget-calibration` (REQ-PERF-02/-38, PERF-079) with the remote artifact attached. A failing lane is fixed at the source in the owning prompt's files (re-open that prompt's task) or reported FAIL; it is never closed from a committed report (D-32).
- Thresholds are fixed by the PRD: contrast ≥ 4.5:1 text / ≥ 3:1 large text and non-text; `contrast: more` diff > 0.5% inside TopBar and Sidebar; forced colors 0 visible backdrop filters; blur ≤ 3 fine / ≤ 2 coarse with StatusBar never blurred, depth 1, ≤ 32px chrome, ≤ 12px scrim (NAV owns this value, SC-38; PRD-PERF REQ-PERF-19 changes to 3); idle 0 animations / 0 rAF after 1,000 ms; §16.1/§16.2 budgets.

## Prerequisites (verify)

1. PROMPT-11a..11g merged and green in their own reports: `rg --files tests/e2e/app-shell tests/a11y/apg tests/motion tests/perf/browser | rg -c 'app-shell|sidebar|tabs|tabbar|breadcrumbs|command|splitter|source-transition|shell-idle|resizable|command-5000'`.
2. PRD-QA lanes exist and fail closed: scenes `certification/scenes/` with the 8 SC-28 ids (QA-038/039), OCR (QA-049), preference delta (QA-051), L6 environment-visual lane `certification/lanes/environment-visual.spec.ts` (QA-056), motion lane (QA-076), perf lane (QA-085) over the PRD-PERF harness `tests/perf/harness/run-perf.mjs` (PERF-039), canaries lane (QA-086) over PRD-PKG `canaries/{next16,next15,vite}` (packed-tarball Vite without Tailwind). Record each lane's workflow file and last run URL.
3. Byte budgets `docs/size-budgets.json` (PKG-048) with gate `scripts/ci/verify-size-budgets.mjs` (PKG-049); runtime budgets `tests/perf/harness/budgets.json` (PERF-044) and grading `tests/perf/harness/grade.mjs` (SC-15). There is no `build/budgets.lock.json` or `size-limit`.
4. AWS/remote runner access via the governed wrapper (`/Users/gurbakshchahal/.local/bin/aws`) if CI capacity is insufficient; on auth failure, report the exact error and stop that lane.

## May touch

NEW `tests/e2e/app-shell/{blur-budget,forced-colors}.spec.ts`, NEW `tests/motion/shell-idle.spec.ts`, `tests/e2e/app-shell/a11y.spec.ts` (axe sweep over all `Flagships/App Shell/*` stories), NEW `tests/perf/browser/app-shell-scroll.spec.ts`; the NAV subject/cell declarations consumed by the PRD-QA L6 lane (story `parameters.ag` + the `packages/qa` matrix; MODIFY of `certification/lanes/environment-visual.spec.ts` only for NAV cell assertions; `scripts/audit/storybook-visual-certification.mjs` is removed by QA-115, SC-39); the shell cases in the PRD-DX render harness `tests/dx/registry-render.spec.ts` (`scripts/ci/verify-recipes-render.js` is removed by DX-100, SC-39); NAV rows in `docs/size-budgets.json` (only via the calibration PR; PKG owns the file); NAV scope entries in `tests/css/class-coverage.test.ts` (PKG-105) and the PRD-QA L1 static scope `certification/lanes.config.ts` (QA-078) for `no-important`, `no-transition-all`, `auraglass/no-raw-design-values` (SC-17), `no-forwardRef`; NEW `docs/auraglass-5/release/NAV-review-sheet.md` (NAV-119: a blank AC-NAV-20/21 review sheet listing artifact URLs and checklist items; it records no results).

## Must not touch

Component source (fixes go back to 11a–11g), PRD-QA/PRD-PERF/PRD-DX lane and harness implementations beyond NAV subject/scope/case entries, thresholds anywhere.

## Steps

1. **Blur budget (REQ-NAV-81, -47).** `blur-budget.spec.ts`: for each S-01 story with no overlay, at `(pointer: fine)` 1440×900 and emulated coarse 390×844, count visible elements whose computed `backdrop-filter` ≠ `none` inside `.ag-app-shell`; assert ≤ 3 / ≤ 2; compute nesting depth (ancestor chain with filters) = 1; parse `blur(Npx)` max ≤ 32 chrome, ≤ 12 for `[data-ag-part=scrim]`; `TabBar` subtree = 1. Also read the PRD-A11Y dev counter label `app-shell` and compare it.
2. **Forced colors (REQ-NAV-79).** `forced-colors.spec.ts` with `forcedColors: 'active'`: 0 visible backdrop filters in every shell story; current Sidebar/TabBar/Breadcrumbs/Pagination item has `outline-style ≠ none` or `text-decoration-line ≠ none` in addition to `Highlight`.
3. **Idle (REQ-NAV-80).** `shell-idle.spec.ts`: after load + 1,000 ms without input, `document.getAnimations().length === 0` and an injected rAF counter records 0 callbacks, at `motion` full/calm/none, every shell story.
4. **Axe (AC-NAV-09).** Sweep every story id under `Flagships/App Shell/*` with `@axe-core/playwright`, `color-contrast` enabled, in 3 engines; 0 violations.
5. **Pixel gates (REQ-NAV-77, -78, §12.3; NAV-112/113 on PRD-QA L6).** Declare the subjects for the L6 lane; run the env matrix: S-01 × 8 scenes × light/dark × transparency glass/tinted/solid × 1440/390 × preference default/contrast-more/forced-colors/reduced-motion × tier lightweight/standard (enhanced for `TabBar refraction` on Chromium). Gates: OCR contrast, glass density ≤ 0.3, material presence under TopBar/Sidebar/TabBar, layout overlap/overflow, 0 story `!important`; `contrast=more` diff > 0.5% inside TopBar and Sidebar with 0 contrast failures.
6. **Registry render gate (§12.2 last row; NAV-114).** In the PRD-DX harness `tests/dx/registry-render.spec.ts` (DX-094), add the shell cases: accumulate console/page errors across all blocks and viewports (no per-viewport reset, which was the 4.x defect at `verify-recipes-render.js:354-355`, `:398-399`), fail on any `layoutIssues`, and add the rail-beside-main assertion for `app-frame` and `app-shell-workspace`.
7. **Perf (§16.2).** Run `app-shell-scroll`, `sidebar-toggle`, `resizable-drag`, `command-5000` and the performance PRD's `regression-4x.spec.ts` (subjects `flagships-app-shell-appshell--saas` and `flagships-app-shell-appshell--ai-command-center` per PRD §21 O-04, ≥ 50 fps and ≥ 0.85× `perf-harness-blank--default`) on the 120 Hz desktop and mid-tier mobile profiles and the software-raster lane. Record p95 frame time, dropped frames, INP, CLS, LCP delta, long tasks, grades (≥ B: AppShell, Sidebar, TopBar, Tabs, Breadcrumbs, Pagination, ResizablePanels; ≥ C: TabBar, CommandPalette, SourceTransition).
8. **Bundle (§16.1; NAV-116).** Add one integer `limitBytesGz` row per import to `docs/size-budgets.json` in the alpha calibration PR only, recorded in `docs/size-budgets.changelog.md`. Use the row name `app-shell client islands` (≤12 KB), which is distinct from the PRD-PERF row `{ AppShell }` all slots (≤15 KB). After that, ratchet down only.
9. **Static lane (AC-NAV-02; NAV-117).** Scope `no-important`, `no-transition-all`, `auraglass/no-raw-design-values` (colour/blur/duration, SC-17), `no-forwardRef` and PKG-105 class coverage to `src/app-shell/**` + the seven nav flagship files + `src/primitives/SourceTransition.tsx`; 0 findings.
10. **Release-SHA run.** Re-run every lane above plus all specs from 11a–11g (layout, a11y, sidebar-drawer, inspector, resizable, theme, ssr-hydration, six APG specs LTR/RTL, motion specs, breadcrumbs canary, packed-tarball Vite fixture for AC-NAV-01) on the release SHA; collect artifact URLs.

## Visual evidence

All screenshots, frame strips, OCR maps and diff images are CI artifacts keyed to the release SHA (D-32), linked in the report and handed to 11i for the AC-NAV-20 human review. No screenshot is committed.

## Exit criteria (release SHA)

AC-NAV-01 (packed Vite, no Tailwind, `app-frame` block adjacent), AC-NAV-02, AC-NAV-03, AC-NAV-04, AC-NAV-05, AC-NAV-06, AC-NAV-07, AC-NAV-08, AC-NAV-09, AC-NAV-10 (6 APG × 3 engines × LTR/RTL), AC-NAV-14, AC-NAV-16, AC-NAV-17 — each PASS with an artifact URL. Any FAIL keeps the AC open and names the owning task.

## Final report format

```
PROMPT-11h REPORT
Release SHA: <sha>
Lanes: <lane> -> <workflow file> -> <run URL> -> pass/fail
AC-NAV-01..10, 14, 16, 17: PASS/FAIL + artifact URL (one line each)
Blur counts per story (fine/coarse/depth/max px): <table>
Perf: <metric> measured vs budget per profile; grades per flagship
Bundle: <import> <KB> vs budget
Failures routed: <AC> -> <NAV task id> -> <prompt>
Tasks NAV-108..119: DONE | BLOCKED(<reason>)
Deviations: <none | item + evidence>
```
