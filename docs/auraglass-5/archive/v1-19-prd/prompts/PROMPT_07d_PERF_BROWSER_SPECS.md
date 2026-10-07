# PROMPT-07d (PERF): Remote browser budget specs

Source PRD: `docs/auraglass-5/prd/AURAGLASS_PERFORMANCE_PRD.md` (Key PERF; alias PRD-07) §4.3–§4.5, §5.2, §5.3, §7, §12, §14, §15, §16.3–§16.5, §20 Waves 2 and 4.
Requirement IDs: REQ-PERF-15, -16, -17, -18, -19, -21, -22, -24, -26, -27, -30, -39; REQ-PERF-12 (scrim computed-blur half); §14 viewports and resize rule; §15 items 1, 2, 7; §7 component-specific budgets.
Acceptance: AC-PERF-07, -08, -11, -12, -13, -15, -16. Tasks: `docs/auraglass-5/tasks/PERF.json` PERF-057..PERF-073.

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Architecture decisions win; deviations go in the final report with evidence.
- **Remote only.** Every spec here runs in Playwright project `perf` on GitHub-hosted runners or an ephemeral EC2 worker via skill `auraone-remote-run` (read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` and `ci-selection.md` first). Never launch a browser or Docker on the Mac. EC2 runs use an offline bundle (egress CA expired 2026-09-27). Terminate and tag workers.
- Locally allowed: `npm run typecheck`, `node_modules/.bin/eslint tests/perf`, `node_modules/.bin/playwright test --list --project perf` (lists, does not launch).
- No fake completion: no `.skip`/`.fixme`/`.only`, no `test.slow()` to mask timeouts, no `retries > 0` in project `perf`, no lowered numbers, no `-u`, no `page.evaluate` that edits the subject's styles or attributes to pass (the only page-side code allowed is `tests/perf/harness/instrument.js` and read-only queries), no per-subject exemption lists. A subject whose owning PRD has not shipped stories fails its test with `subject not yet available: <Name>`; that is the correct red state, not a skip.
- Evidence = CI artifacts keyed by SHA (D-32).

## Prerequisites (verify before writing each spec)

1. Hard — 07c merged: `test -f tests/perf/harness/instrument.js -a -f tests/perf/harness/bci.mjs -a -f tests/perf/harness/budgets.json -a -f src/stories/perf/PerfFixtures.stories.tsx`, and the `perf-self-test` job (PERF-053, in QA's `certify-main.yml`) green on `main`.
2. Hard — MAT (`PROMPT_04b_MAT_CSS_ENGINE.md`, `PROMPT_04c_MAT_RUNTIME.md`): `src/material/index.ts` exports `Surface` (MAT-047), `SurfaceGroup` (MAT-048); `src/material/css/material.css` (MAT-015) exists; `src/material/dev/surfaceCounter.ts` (MAT-055, REQ-MAT-52) and `src/material/dev/warnings.ts` (MAT-054, REQ-MAT-24) exist. Missing → 057/058/069 BLOCKED on MAT with the task id.
3. Hard — A11Y `PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`: `AuraGlassScript` (A11Y-032) and `AuraGlassProvider` (A11Y-029) exported from `aura-glass/theme` (`rg -n "AuraGlassScript" src/theme`). Missing → 068 BLOCKED. PERF-060 (forced colors) also needs A11Y `PROMPT_05c_A11Y_RUNGS_FLOORS.md` (A11Y-036 `rungs.css`).
4. Per-spec subjects (soft; red-not-skipped): `Dialog`/`AlertDialog`/`Sheet` (OVL, `PROMPT_10c_OVL_DIALOG.md`/`10f`, anchor OVL-040), `AppShell` scenes `app-shell--saas`, `app-shell--ai-command-center` (NAV `PROMPT_11b_NAV_FRAME.md`, NAV-016/022) and the six product scenes (QA scenes QA-038/039 + NAV stories), enhanced lens (MAT interim PRD-15, MAT-035/045, Chromium), `./three` (EXP interim PRD-21 labs, EXP-088), flagships (CTL-055, OVL-040, NAV-016, DATA-038, AI-034, MED-130 and the rest of `PROMPT_09*`..`PROMPT_14*`). The 8 certification scene ids are SC-28's (`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`).
5. Tightening request status (PRD §21 OI-PERF-01): read `prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` REQ-MAT-52; if it does not include "effective nesting depth >1" and an `allowNested at depth N` warning, REQ-PERF-16's warning assertion is dropped (PRD §5.2 rule) and only the count is gated. REQ-MAT-24 currently logs `[aura-glass] nested glass depth N at <selector>`: match `/nested glass depth 2|allowNested at depth 2/` and record which text was observed.

## May touch

- NEW `tests/perf/browser/{host-backdrop-root,nesting-collapse,surface-budget,overlay-cost,appshell-cost,svg-lens-budget,webgl-budget,will-change-lifecycle,settled-idle,mount-unmount-leak,hydration-stability,dev-counter,input-latency,component-budgets,evidence-captures}.spec.ts`
- NEW `tests/perf/browser/helpers/{open-story.ts,cells.ts,hydration-page.tsx,hydration-build.mjs}`
- `src/stories/perf/PerfFixtures.stories.tsx` (add args only; no new ids without a schema bump)
- `.github/workflows/certify-main.yml` / `certify-nightly.yml` (QA-owned, SC-29; MODIFY: add job `perf-browser-specs` with engine matrix `chromium|webkit|firefox`). No new workflow file.

## Must not touch

Component sources (`src/**` outside `src/stories/perf/**`), `src/material/**`, `tests/perf/harness/**` (07c owns; file issues instead), `budgets.json` values, `.storybook/**`, `certification/**`, `reports/**`.

## Shared helpers (PERF-057 prerequisite step)

`helpers/open-story.ts`: injects `instrument.js`, opens `iframe.html?id=<id>&globals=environment:photo;certify:1;tier:standard;pointer:<p>;reducedMotion:<m>`, waits fonts + 2 rAF, asserts label read-back (tier, pointer, reduced motion), returns `snapshot()`. `helpers/cells.ts`: viewports `1440x900 fine`, `390x844 coarse`, `768x1024 coarse`, `1920x1080 fine`; engines from the project matrix.

## Steps (one spec per task; every assertion reads computed styles in a real engine, never jsdom)

1. **PERF-057 `host-backdrop-root.spec.ts` (REQ-PERF-15), 3 engines.** For every `.ag-surface` in every `budgets.json` subject story and the Material Lab matrix (PRD-04 `Material.Lab.stories.tsx` ids): host computed `backdrop-filter` (and `-webkit-`) = `none`, `filter` = `none`, `opacity` = `1`, `mix-blend-mode` = `normal`, `will-change` = `auto` unless the host matches `[data-ag-animating]`. Disabled states included (disabled dims via `--_ag-surface-alpha`, not opacity).
2. **PERF-058 `nesting-collapse.spec.ts` (REQ-PERF-16), 3 engines.** `perf-nesting--nest-4` (`allowNestedLevel: 0`): exactly 1 element with non-`none` `::before` backdrop-filter, max effective nesting 1. `allowNestedLevel: 2`: count 2 and, in the development Storybook build only, exactly 1 console warning matching the text recorded in prerequisite 5.
3. **PERF-059 `surface-budget.spec.ts` (REQ-PERF-17, AC-PERF-07), 3 engines.** For the six product scenes and every `budgets.json` T1 subject default story: at scroll top, middle, bottom, and again with every overlay opened (activate each `[aria-haspopup]`, `[data-ag-trigger]`, `[aria-controls]` dialog trigger): `1440x900 fine` and `1920x1080 fine` → blurred ≤6, BCI ≤2.0, nesting ≤1; `390x844 coarse` and `768x1024 coarse` → ≤3, BCI ≤1.2, nesting ≤1. Also every blurred element's blur ∈ {12, 20, 32} px and any element covering ≥95% of the viewport has blur ≤12 px and `data-ag-layer="scrim"` (or is the REQ-MAT-28 scrim sibling). Budgets are read from `budgets.json`, never literals in the spec.
4. **PERF-060 Accessible fallback (§15.1, AC-PERF-15)** in `surface-budget.spec.ts`: under `forcedColors: 'active'`, `reducedTransparency: 'reduce'` (Chromium `Emulation.setEmulatedMedia` feature `prefers-reduced-transparency`; WebKit/Gecko via `page.emulateMedia` where supported, otherwise set `<html data-ag-transparency="solid">` and label the cell `attribute-only`), and `data-ag-transparency="solid"`: 0 elements with non-`none` backdrop-filter (host or `::before`) on all six scenes (4.1: app shell 3, showcase 12).
5. **PERF-070 Resize (§14)** in `surface-budget.spec.ts`, Chromium: mount the dashboard scene at 1440×900 in the `<Profiler>`-enabled page of step 13 (PERF-068 `hydration-build.mjs`), resize to 390×844; library commits ≤1 per component, 0 new composited layers attributable to `.ag-surface` (CDP `LayerTree`), 0 lens rebuilds unless the size class changed (count `svg[data-ag-lens-defs] filter` mutations with a MutationObserver installed by `instrument.js`).
6. **PERF-061 `overlay-cost.spec.ts` (REQ-PERF-18, REQ-PERF-12 scrim, AC-PERF-08), 3 engines.** `Dialog` open over `photo`: exactly 2 blurred elements (scrim computed blur ≤12 px covering the viewport; panel 32 px `thick`), 0 blurred descendants of the panel, `BCI ≤ 0.6 + panelAreaFraction × 1.6` (panel area from its rect). Same for `AlertDialog`, `Sheet` bottom and side; `Sheet` at full height → panel has `data-ag-transparency="tinted"` (or equivalent PRD-04 attribute) and 1 blurred element (scrim). §7: `Popover`, `Tooltip`, `Menu` each add exactly 1 blurred element; 5 stacked `Toast` → ≤3 blurred, the rest tinted.
7. **PERF-062 `appshell-cost.spec.ts` (REQ-PERF-19, AC-PERF-08), 3 engines.** `AppShell` with `TopBar`, `Sidebar`, `Inspector`, `StatusBar`, 8 `Card`, 1 `Table`: blurred ≤3 at fine pointer (SC-38, owner NAV; `budgets.json` `surface.appShellFine`), `StatusBar` is `content-sunken` with computed `::before` `backdrop-filter` = `none`, `Card`/`Table` contribute 0 (sticky `Table` header may be 1 `chrome thin` → still ≤3 total), max nesting 1; adjacent `TopBar`+`Sidebar` under one `SurfaceGroup` count as 1. 4.1 reference: 29 elements, nesting 4.
8. **PERF-063 `svg-lens-budget.spec.ts` (REQ-PERF-21), 3 engines.** `perf-lens--lens-3` with `count: 10` at tier `enhanced`: `svg[data-ag-lens-defs]` count = 1; every `<filter>` id matches `^ag-lens-(fixed|capsule|concentric)-(control|bar|panel)$`; 0 `feTurbulence` in the DOM; visible `url(#ag-lens-…)` backdrops ≤2 at fine, ≤1 at coarse, each ≤25% viewport area (the fixture at its default args must satisfy this; an over-budget arg variant must produce a dev-counter warning). WebKit/Gecko: 0 elements with a `url(` backdrop value.
9. **PERF-064 `webgl-budget.spec.ts` (REQ-PERF-22, AC-PERF-16), Chromium.** `perf-webgl--webgl-3`: live WebGL contexts ≤1; after unmount (Mount Cycle toggle) 0 live contexts and `loseContext` called; hidden tab via the real lifecycle path (open a second page in the same context and `bringToFront()` it, then confirm `document.visibilityState === 'hidden'` in the subject page; never override the property) → rAF callbacks during 1 s = 0; scrolled offscreen 1 s → 0; canvas `width / clientWidth ≤ 1.5` at DPR 3. Assert `LiquidGlassGPU` is absent from `index.json` and from `dist/` (deleted, §4.8).
10. **PERF-065 `will-change-lifecycle.spec.ts` (REQ-PERF-24), 3 engines.** Open `Dialog`: during the transition the panel matches `[data-starting-style]` or `[data-ag-animating]` and computed `will-change` ≠ `auto`; 100 ms after `transitionend` neither attribute exists anywhere and `snapshot().willChangeCount === 0`. Repeat on close. Under `reducedMotion: reduce`, `data-ag-animating` is never present for more than one frame (§15.2).
11. **PERF-066 `settled-idle.spec.ts` (REQ-PERF-26, AC-PERF-11), 3 engines.** Every T1 and T2 subject story: 500 ms after the last `transitionend`/`animationend` with no input → pending rAF 0, active intervals 0, infinite animations 0; indeterminate `Progress`/`Spinner` stories: ≤1 infinite animation whose keyframes touch only `transform`/`opacity`, and 0 under `reducedMotion: reduce` (§15.2). §7: `Switch`/`Slider` 0 infinite animations at rest and after toggle.
12. **PERF-067 `mount-unmount-leak.spec.ts` (REQ-PERF-27, AC-PERF-12), Chromium with `--js-flags=--expose-gc`.** Per flagship via `perf-mount-cycle--default`: record window/document listener counts, observers, intervals, rAF, heap after `gc()`; 10 mount/unmount cycles; all counts equal pre-mount; heap delta ≤1 MB.
13. **PERF-068 `hydration-stability.spec.ts` (REQ-PERF-30, AC-PERF-13), Chromium.** `helpers/hydration-build.mjs` (esbuild) builds a page per product scene: server `renderToString` in Node (inside the test runner) with `AuraGlassScript` in `<head>`; client bundle aliases `react-dom/client` → `react-dom/profiling` (and the scheduler alias the installed React major requires, per React docs) so `<Profiler onRender>` fires in production mode. After `hydrateRoot`, 1 s without input: `onRender` count after the hydration commit = 0; a MutationObserver on `[data-ag-surface]` records 0 `class`/`data-ag-tier` mutations; `<html data-ag-tier>` was set before first paint (check `performance.getEntriesByName('first-paint')` time ≥ the script's `performance.mark('ag-tier-set')`).
14. **PERF-069 `dev-counter.spec.ts` (REQ-PERF-39), Chromium, development Storybook build.** `perf-budget--budget-7`: `count: 7` at fine → exactly 1 `[aura-glass] surface budget` warning per threshold crossing; `count: 6` → 0; `count: 4` at coarse → 1; scrolling or re-render without crossing → no repeat. Production Storybook build of the same story → 0 warnings and no `surfaceCounter` in loaded scripts.
15. **PERF-071 `input-latency.spec.ts` (§15.7; new file, not listed in PRD §12 — deviation recorded).** `event` timing entries for scripted `keydown` (ArrowDown ×10, Enter, Escape) on `Menu`, `Select`, `Combobox`, `Tabs`: p95 ≤50 ms on desktop Chromium, ≤100 ms under profile (b) emulation (4× CPU, coarse).
16. **PERF-072 `component-budgets.spec.ts` (§7; new file, deviation recorded).** `Tabs`/`SegmentedControl`/`TabBar` switch: CDP `LayoutCount` delta = 0 after the first frame and indicator animates only `transform`; `Table` 10,000 rows: DOM rows ≤ visible + overscan (virtualized ≥200), scroll frame p95 ≤16.7 ms on profile (a) via `run-perf.mjs`; `TreeView` 500 nodes virtualized, 0 permanent `will-change`; `Button` inside `Toolbar` has no own blurred `::before`; `Thread` 500 messages: content-raised (0 blur), virtualized, `StreamingText` ≤1 commit per frame; `NowPlayingBar` paused → 0 rAF.
17. **PERF-073 `evidence-captures.spec.ts` (visual evidence).** Remote screenshots of `Dialog` open, `AppShell` dashboard, and the six scenes at 1440 fine and 390 coarse over `photo`, plus a JSON sidecar of the blurred-element list and BCI per capture; artifact `perf-budget-captures-<sha>`. Not baselines, not committed; for 07e human review.

## Tests to run (remote)

`node_modules/.bin/playwright test --project perf tests/perf/browser` inside the `perf-browser-specs` job of QA's `certify-main.yml`/`certify-nightly.yml` (L10 Performance, engine matrix) and on the EC2 worker for Chromium GPU-dependent cells. Record per-spec pass/fail per engine and the run URLs.

## Exit criteria

- AC-PERF-07: `surface-budget.spec.ts` green for all six scenes and all 44 flagships in Chromium, WebKit, Gecko (red subjects listed with owning PRD key and anchor task).
- AC-PERF-08: `overlay-cost` (`Dialog` = 2) and `appshell-cost` (≤3, StatusBar unblurred) green.
- AC-PERF-11, -12, -13, -15, -16: `settled-idle`, `mount-unmount-leak`, `hydration-stability`, `surface-budget` fallback block, `webgl-budget` green.
- REQ-PERF-15, -16, -21, -24, -39 specs green; §14/§15.7/§7 specs green or red with numbers.
- Every spec fails on a deliberately broken input (prove once per spec on a throwaway branch: e.g. remove the nesting-collapse rule from a local copy of `material.css` in the built Storybook) and the run URL is reported.

## Final report

```
PROMPT-07d result: DONE | PARTIAL | BLOCKED
SHA / branch:
Tasks PERF-057..073 -> status each
Spec x engine -> pass/fail/blocked, failing subjects (owner PRD), run URL
Measured: Dialog blurred/BCI, AppShell blurred/nesting, settled counts, heap deltas
Failability proofs: spec -> broken input -> run URL
Artifacts: names
Remote resources: ids, attempt id, terminated
Deviations: input-latency.spec.ts, component-budgets.spec.ts additions; nesting warning text observed
```
