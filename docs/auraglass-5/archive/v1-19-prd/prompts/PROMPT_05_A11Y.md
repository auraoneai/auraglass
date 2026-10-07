# PROMPT-05 (A11Y): Accessibility, preferences and legibility — index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md` (PRD-05, REQ-A11Y-01..50, AC-A11Y-01..25). Canonical decisions: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-10, D-11, D-12, D-13, D-24, D-28, D-32; §4.4–4.7, §5.3–5.4, §6, §7, §9.1, §11.1, §13.1, §14.5 B13, §15, §16 PRD-05). Task fragment: `docs/auraglass-5/tasks/A11Y.json` (A11Y-001..A11Y-098). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row beats any prompt text). PRD key: **A11Y**.

PRD-05 has 50 requirements. They span a build-time contrast contract, static gates, a preference runtime with a pre-paint script, CSS rungs checked in three browser engines, an overlay runtime, focus/target CSS, a test harness that flagship PRDs plug into, and a manual SR/touch certification. One agent session can't hold all of that, so the work is split into seven prompts. Each one is independently executable and restates the common rules in full.

| Prompt | Scope | REQ IDs | AC IDs | Tasks | Hard prerequisites |
|---|---|---|---|---|---|
| `PROMPT_05a_A11Y_CONTRACT_GATES.md` | busy-reference verification (DS-033 creates it), matrix contract `tests/a11y/contrast/matrix-contract.json`, `color.ts` verification (DS-055/056/109), `src/utils/contrast.ts` fold, `contrast-matrix.test.ts`, `verify-a11y-css.mjs`, ESLint rules (MODIFY, PKG-015), `a11y-*` projects in QA's `playwright.config.ts` + lane registration in `certification/lanes.config.ts`, `@axe-core/playwright` pin | 03 (static), 05, 08 (gate), 13 (pair), 14 (cells), 15, 16, 17, 18, 20, 24 (band math), 27 (gate), 33 (lint) | AC-A11Y-03, 07, 08, 22 (ratchet) | A11Y-001..019 | PROMPT-03 (DS-033, DS-055/056, DS-057/059 first emit; the matrix test may land red, PRD §20 step 2); PROMPT-02 (PKG-015, PKG-056); PROMPT-19/QA (QA-003, QA-018, QA-031, QA-081, QA-082) |
| `PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md` | `resolve.ts`, `store.ts`, `storage.ts`, `media.ts`, `usePreference`, `AuraGlassProvider` attribute writer + legacy migration, `AuraGlassScript`, `./theme` exports | 01, 02 (unit), 03, 07 (unit), 21, 22, 23, 31, 37 (unit), 39 (store) | AC-A11Y-19 (store half), 23, 25 (script/theme budgets) | A11Y-020..035 | 05a merged; PROMPT-02 (PKG-005 `./theme` subpath, PKG-042 side-effect gate, PKG-049 size gate); PROMPT-04 (MAT-047, REQ-MAT-54..56 frozen); QA-086 canaries |
| `PROMPT_05c_A11Y_RUNGS_FLOORS.md` | `src/a11y/css/rungs.css`, floors/rungs/forced-colors/pixel-modes/prepaint browser specs on `Surface`, A11y/Rungs + A11y/Floors stories | 04, 06, 08, 09, 10, 11, 12, 13 (CSS), 14, 37 (browser) | AC-A11Y-04, 05, 06, 08, 09; **PRD-05 exit criterion** | A11Y-036..048 | 05a + 05b merged; PROMPT-04 (MAT-015, MAT-047); PROMPT-03 (DS-059 solved floors); PROMPT-02 (PKG-101); QA-018, QA-038/039 (8 SC-28 scenes) |
| `PROMPT_05d_A11Y_OVERLAY_RUNTIME.md` | portal root context, `LayerStack` (sole Escape/`inert`/scroll-lock dispatcher, SC-25), `useLayer`, announcer; verification of FND's `usePortalContainer`/`Portal`/`DismissableLayer`/`VisuallyHidden` (SC-26) and `Icon` test (FND-049) | 32, 33, 34, 35, 36, 50 | AC-A11Y-13, 20 (announcer/trap half) | A11Y-049..060 | 05b merged (provider); PROMPT-03 (DS-029 z-scale); FND prompt (FND-007, FND-031, FND-035, FND-038, FND-048/049) |
| `PROMPT_05e_A11Y_FOCUS_TARGETS.md` | `focus.css`, `targets.css`, `HitArea`, `scroll-padding.css`, `useStickyScrollPadding`, focus/target/obscured specs | 24 (CSS), 25, 26, 27, 28, 29, 30 | AC-A11Y-10, 11, 12, 22 | A11Y-061..072 | 05a + 05c merged; PROMPT-03 (DS-022 `sys.color.focus-*`, DS-024 `target.*`) |
| `PROMPT_05f_A11Y_HARNESS_CERT.md` | APG harness (SC-40 anchor A11Y-073) + key-script table + self-test fixtures, browser axe, zoom/reflow, text spacing, colour vision, pixel-contrast threshold contract, SR/touch schema + protocols, pilot SR script | 19, 40, 41, 42, 43, 44, 45, 46 | AC-A11Y-01, 02, 14, 15, 16, 17, 18 | A11Y-073..087 | 05a–05e merged; QA prompt (QA-018, QA-057, QA-082); CTL-060 / OVL-053 own `button.apg.spec.ts` / `dialog.apg.spec.ts`; NAV-016, DATA-038/080, NAV-064 for reflow/CVD |
| `PROMPT_05g_A11Y_PANEL_REMOVALS.md` | `GlassPreferencesPanel`, deprecation entries, 4.1.1/4.2 coordination checks, claims gate, removal verification, final certification report | 38, 39 (panel), 47, 48, 49 | AC-A11Y-19, 20, 21, 24, 25 (final) | A11Y-088..098 | 05b + 05d merged; CTL-035/CTL-089 (`RadioGroup`/`Slider`); REL-010 + TRUST-075 (`deprecations.json`); TRUST-026; REL-089; FND-102; DX-136; QA-031, QA-091; PERF-039 |

Order: 05a, then 05b, then 05c (exit criterion), then 05d and 05e (they can run in parallel), then 05f, then 05g. 05g's deprecation-entry task (A11Y-090) can run as soon as 05b is merged.

**PRD numbering.** `PRD-NN` ids in prose use the architecture §16 numbering, as the source PRD does. `A11Y.json` `depends_on` contains **only real task ids** (SC-40); external gates (a published release, an RC SHA) are in the task's `gate` field. Some PRD documents carry a different self-assigned id in their header; the full key crosswalk is SC-01:

| Architecture id | File |
|---|---|
| PRD-00 (TRUST) / PRD-01 (REL, + interim PRD-17) | `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` / `AURAGLASS_RELEASE_MIGRATION_PRD.md` |
| PRD-02 (PKG) / PRD-03 (DS) / PRD-04 (MAT, + interim PRD-15) | `AURAGLASS_PACKAGING_BUILD_PRD.md` / `AURAGLASS_DESIGN_SYSTEM_PRD.md` / `AURAGLASS_MATERIAL_ENGINE_PRD.md` |
| PRD-07 (foundation), plus the PRD-14 T2 core and PRD-16 removal execution (FND) | `AURAGLASS_COMPONENT_REMEDIATION_PRD.md` |
| PRD-08 (controls) | `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` |
| PRD-09 (overlays) | `AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` |
| PRD-10 (app shell) | `AURAGLASS_APP_SHELL_NAVIGATION_PRD.md` |
| PRD-11 (data/date) | `AURAGLASS_DATA_PRD.md` |
| PRD-12 (AI) | `AURAGLASS_AI_PRD.md` |
| PRD-13 (media) | `AURAGLASS_MEDIA_BACKDROPS_PRD.md` |
| PRD-19 (QA certification; SB Storybook half) | `AURAGLASS_QA_CERTIFICATION_PRD.md`, `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` |
| PRD-18 (CLI/codemods) and PRD-20 (docs) (DX) | `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` |

**Ownership boundary (PRD §0 deviation 5).** PRD-05 owns the contract: pairs, composites, thresholds, key scripts, matrices, test names, and the shared helpers. It doesn't own:
- the PRD-03 contrast-solve transform
- the PRD-19 pixel/OCR harness
- the PRD-07..14 widget behaviour
- the PRD-16 deletions
- the PRD-00/PRD-17 4.x fixes
- files under `tokens/` (DS, SC-18), `src/theme/color.ts` edits (DS-055), the KEEP primitives `Portal`/`DismissableLayer`/`VisuallyHidden` and `usePortalContainer()` (FND, SC-25/26), per-widget APG specs (component PRDs, SC-30), and QA's configs, lanes and workflows (SC-29)

Prompts verify those as inputs and record a blocker if they're missing. They never edit those PRDs' internals.

**Shared-contract alignment (PRD deviation 9).**
- REQ-A11Y-50's test is FND-049's `src/icons/__tests__/icon-a11y.test.tsx`; A11Y-060 only adds the `label` case there. No `src/a11y/__tests__/icon-a11y.test.tsx`.
- No `playwright.a11y.config.ts` and no `.github/workflows/a11y-lanes.yml`. A11Y-018 adds `a11y-chromium|webkit|firefox` projects to QA's `playwright.config.ts`; A11Y-019 registers the suites as cells of QA lanes L1 Static, L4 Token contrast, L5 Behaviour, L6 Environment visual and L12 Unit in `certification/lanes.config.ts`, run by `certify-pr.yml` (nightly/RC via `certify-main.yml`/`certify-release.yml`). Where a sub-prompt says "dispatch `certify-pr.yml` with `-f suite=<x>`", use the lane filter input QA-031 exposes; if there is none, run the whole lane and read the A11Y cells.
- Jest's `testMatch` (`jest.config.js:49-52`) would collect the Playwright `*.spec.ts` files under `tests/a11y/`. 05a adds `<rootDir>/tests/a11y/browser/` and `<rootDir>/tests/a11y/apg/` to `testPathIgnorePatterns` by MODIFY of QA's `jest.config.js` (after QA-003).
- Open items that this PRD can't close are in PRD §21 (OI-01..OI-13).

Common rules (each sub-prompt restates them):
- Browser, visual and perf runs, Storybook builds, and the full `npm run build` all run remotely. Use GitHub Actions on `auraoneai/auraglass` (check visibility with `gh repo view auraoneai/auraglass --json visibility` and follow `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`), or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never use local Docker. Never run a local browser.
- Don't fake completion. That rules out:
  - stub or constant-returning implementations
  - `test.skip`, `test.fixme`, `.only`, `xit`, or quarantining
  - lowered thresholds
  - `--update-snapshots`/`-u` or `test:visual:update` to get to green
  - hand-written or edited artifacts (`contrast-matrix.json`, `a11y-pixel-contrast.json`, `axe-results.json`, `a11y-manual-<sha>.json`)
  - jsdom or mocked `matchMedia` standing in for a browser requirement
- Evidence is CI artifacts carrying a run id and SHA (D-32). Nothing goes into `reports/`.

Final report: each sub-prompt defines its own report. The orchestrator merges them into one AC-A11Y-01..25 table with CI artifact links.
