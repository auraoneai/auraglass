# PROMPT-05g (A11Y): `GlassPreferencesPanel`, deprecations, 4.x coordination, claims, removal verification, GA certification

You are implementing the final part of PRD-05 for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`, except that A11Y-092/093 inspect `release/4.x` read-only. Tasks: A11Y-088..A11Y-098 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read §2.3, §2.8, §2.9, REQ-A11Y-38/39, §5.10 REQ-A11Y-47..49, §8 (name note on `GlassPreferencesPanel`), §9 (removal table), §10, §11, §13 (`Theme/GlassPreferencesPanel` story), §14 (390 px single column), §16, §17 AC-A11Y-16, 19..25, §18, §20 steps 10–14.
- `AURAGLASS_RELEASE_MIGRATION_PRD.md` §4.3: repo-root `deprecations.json` (version 1 from 4.1.1, no v0 seed; seeded by TRUST-075), schema `docs/schemas/deprecations.schema.json` (REL-010); exception enum `security|privacy|crash|legal|honesty` (SC-02/03).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-02, SC-03, SC-29, SC-30 (the panel's APG spec is this PRD's, because A11Y owns the panel), SC-37 (PRD-17 interim owner REL), SC-39, SC-40 (`gate` field for external release gates).
- `AURAGLASS_TRUST_PATCH_4_1_1_PRD.md`: the REQ-A11Y-48 honesty fix is executed there.
- `AURAGLASS_FLAGSHIP_CONTROLS_PRD.md`: `RadioGroup` and `Slider`.
- `AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md`: PRD-20 docs lint `no-unsourced-claim`, PRD-18 codemods `providers`/`removed`.

Requirements: REQ-A11Y-38, 39 (panel half), 47, 48 (verification), 49. Acceptance: AC-A11Y-07 (final), 16 (full run), 19, 20, 21, 24, 25 (final), and the §18 DoD.

## 2. Files
May touch:
- NEW: `src/theme/GlassPreferencesPanel.tsx`, `src/theme/__tests__/GlassPreferencesPanel.test.tsx`, `src/theme/GlassPreferencesPanel.stories.tsx`, `tests/a11y/apg/glass-preferences-panel.apg.spec.ts`
- `src/theme/index.ts`: export only
- `deprecations.json`: append entries only (MODIFY after REL-010 + TRUST-075)
- NEW: `tests/a11y/claims-sources.json`, `scripts/ci/verify-a11y-removals.mjs`, `scripts/ci/a11y-cert-summary.mjs`, `tests/a11y/a11y-cert-summary.test.ts` (rejects a fixture whose SHA doesn't match)
- `certification/lanes.config.ts`: register the `beta-gate` (L1 Static) and `ga-cert` cells only (QA-owned, MODIFY after QA-031; no `a11y-lanes.yml`)
- `tests/a11y/apg/coverage.json`: add the panel row

Must not touch:
- the deletion PRs (PRD-16 = FND; e.g. RM-09 FND-125) and the removal gate workflow (FND-102)
- the 4.x branch source (PRD-00 = TRUST; PRD-17 = interim REL)
- codemods (PRD-18 = DX; DX-041/042)
- the docs app and claims lint implementation (PRD-20 = DX; DX-134/136; QA-091 claims build)
- `README.md` text (PRD-20 generates it)
- issue #16, until A11Y-097's conditions hold

## 3. Prerequisites
- 05b and 05d merged: `rg -n "useAnnouncer|usePreferenceActions" src/theme/index.ts`.
- CTL-035 `RadioGroup` and CTL-089 `Slider` are certified (their APG specs green × 3 engines in QA L5 Behaviour). If they aren't, don't build the panel on native inputs as a stand-in. Report the blocker.
- TRUST-075 seeded `deprecations.json` and REL-010 created its schema: `test -f deprecations.json && test -f docs/schemas/deprecations.schema.json`.
- For A11Y-095..098: FND removal PRs merged (beta; FND-102 removal gate green), and the RC SHA cut (A11Y-097 `gate`).
- For A11Y-092: `aura-glass@4.1.1` published (TRUST-026 shipped; task `gate`). For A11Y-093: the `v4.2.0` tag exists and REL-089 classified the D-28 PRs (task `gate`; the implementing 4.2 edit task is PRD §21 OI-09).

## 4. Steps
1. **A11Y-088 `GlassPreferencesPanel.tsx`** (`'use client'`, T2). Props: `show?: Array<'transparency'|'glassOpacity'|'contrast'|'motion'|'scheme'|'density'>` (default: the first four), `onChange?(key, value)`, `labels?` (i18n).
   - Structure: a `<fieldset>` per group with a `<legend>`.
   - Transparency is a `RadioGroup` (System / Glass / Tinted / Solid).
   - Glass opacity is a `Slider`: 0–100%, step 5, with `aria-valuetext` like "40% more opaque".
   - Contrast is a `RadioGroup` (System / Standard / More), and Motion is a `RadioGroup` (System / Full / Calm / None).
   - Options below `useResolvedPreferences().floors` get `aria-disabled="true"`, stay focusable, and carry an `aria-describedby` note naming the floor, e.g. "Your system's Increase Contrast setting requires at least Tinted". Selecting one is a no-op.
   - Changes go through `usePreferenceActions().set`, and the panel announces them politely with `useAnnouncer` ("Transparency set to Tinted").
   - It renders through `Surface`. At ≤390 px it uses a single column with full-width controls.
2. **A11Y-089 tests**:
   - `GlassPreferencesPanel.test.tsx`: `"fieldset legend names"`, `"floor-locked options"` (emulated `contrastMoreOS=true` through the injected store: Glass is `aria-disabled` and described; clicking it leaves `resolved().transparency === 'tinted'`; the user value is persisted), `"change announced"`, `"show filtering"`, `"re-renders only the panel"` (React Profiler: a `transparency` change commits ≤1 component outside the panel subtree, which is 0 surfaces; §16).
   - `glass-preferences-panel.apg.spec.ts` (remote, three engines): the radio-group arrows move and select with one tab stop; the slider handles arrows, PageUp/PageDown and Home/End. Use the 05f harness.
3. **A11Y-091 story** `Theme/GlassPreferencesPanel`: default, floor-locked (story-level `contrast=more` global emulation), `show` subsets, dark scheme, RTL. Include remote screenshots of each in the PR for human review.
4. **A11Y-090 `deprecations.json`**: one entry per §9 row, validated by the PRD-01 schema. Each entry has `id`, `symbol`, `path`, `class:'C-D'`, `since:'4.2.0'`, `removal:'5.0.0'`, `replacement`, `codemod` (`removed` | `providers` | `canonical-names` | `null` + `todo`), and `doc`. The rows are:
   - `ContrastGuard`, `TextWithContrast`, `HighContrastText`, `useContrastGuard`
   - `useAutoTextContrast`
   - `validateTextContrast`, `validateLiquidContrast`, `sampleBackdropLuminance`
   - `GlassA11y` and its four sub-panels
   - `GlassFocusIndicators`, `SkipLinks`, `LandmarkAnnouncer`, `KeyboardShortcutsHelper`, plus the CSS
   - `GlassA11yAuditor`
   - `GlassFocusRing`, `FocusIndicator`
   - `AccessibilityProvider`, `useAccessibility`
   - `useAccessibilitySettings`
   - `FocusTrap`, `useFocusTrap`, `trapFocus`
   - `ScreenReader`, `ScreenReaderOnly`, `LiveRegion`, `announce`, `useAnnounce`, `announceToScreenReader`
   - primitives `SkipLinks`
   - `ReducedMotionProvider`, `MotionPreferenceContext`, `useReducedMotion`, `useMotionPreference`
   - the CSS classes `glass-contrast-guard`, `glass-focus`, `glass-touch-target`, `.high-contrast`, `.large-text`, `data-color-blindness`

   The 4.2 call-time warnings are emitted by REL's `warnDeprecated` (REL-072, interim PRD-17) from this file. You only supply the entries.
5. **A11Y-092 verify 4.1.1 (REQ-A11Y-48, PRD-00)**: on the published 4.1.1 tarball, unpacked from `npm pack aura-glass@4.1.1` in a scratch directory, confirm that:
   - `ContrastGuard` reports `"unverified"`
   - `validateTextContrast` doesn't return `true`
   - neither `data-meets-wcag` nor the "AA" indicator string is emitted
   - `reports/FOCUS_MANAGEMENT_SUMMARY.md`, `reports/contrastguard-integration-report.json` and `reports/a11y_summary.md` are absent from the tree

   Report pass or fail per item, with a pointer to the PRD-00 owner task (TRUST-026). Don't patch 4.x yourself.
6. **A11Y-093 verify 4.2 (PRD-17)**: on the 4.2 tag, confirm:
   - `rg -n "prefers-contrast:\s*high" src dist` = 0
   - `src/styles/theme-transitions.css:51-53` has no nested `forced-colors: active;` declaration
   - the 4.x forced-colors and reduced-transparency selectors include `.liquid-glass-material` and the overlay classes
   - labelled before/after composites exist in the 4.2 release artifacts (REL-089 visual-class)

   This closes AC-A11Y-07.
7. **A11Y-094 claims (REQ-A11Y-49)**: write `tests/a11y/claims-sources.json`, mapping each permitted claim key (WCAG level, contrast minimum, SR coverage, reduced-transparency support, forced-colors support) to its source artifact and JSON path. DX's `scripts/docs/lint-claims.mjs` (DX-136, `no-unsourced-claim`) consumes it, with claims built by QA-091. Verify that lint flags the current `README.md:3` "accessibility guardrails" string. File any gap against DX-136.
8. **A11Y-095 `verify-a11y-removals.mjs`**, run in the `beta-gate` cell (after FND-102):
   - **(a)** none of the §9 symbols is exported from any `dist` entry or subpath (parse each `exports` target's `.d.ts` and the runtime export keys) → AC-A11Y-21
   - **(b)** detector count: exactly 1 preference store module and 1 provider. Patterns: `rg -l "matchMedia\(" src` outside `src/theme/preferences/media.ts` = 0, plus a list of reduced-motion hooks and settings providers = 0 → AC-A11Y-19
   - **(c)** focus traps outside Base UI and `src/primitives/FocusScope.tsx` = 0; live-region implementations outside `src/theme/announcer` = 0; focus CSS outside `src/a11y/css/focus.css` = 0 → AC-A11Y-20
   - **(d)** `verify-a11y-css.mjs --enforce-zero` (AC-A11Y-22) and `verify-apg-coverage.mjs --enforce`
9. **A11Y-096 budgets (AC-A11Y-25)**: collect the §16 numbers on the GA SHA from their lanes (L2 Artifact size gate PKG-049; L10 Performance via PERF-039 `run-perf.mjs`) and fail if any is over budget. The numbers are: script bytes, `./theme` min+gz, panel delta, `src/a11y/css` gz, the MQL count, contrast observers 0, scroll-padding writes, re-render count, style recalc ≤16 ms, inert ≤2 ms, announcer writes, hydration 0 and CLS 0.000, solid-rung frame time ≤ lightweight +5%, and hit-area layout 0.
10. **A11Y-097 SR/touch certification (AC-A11Y-16)**: on the RC SHA, human testers record SR-1..SR-4 for all 44 flagships (176 cells), plus iOS and Android touch (88 cells). SR-5/SR-6 are recorded and non-blocking.
    - `verify-a11y-manual.mjs` validates the uploaded `a11y-manual-<sha>.json`.
    - Close issue #16 (`gh issue close 16 -R auraoneai/auraglass -c "<artifact URL>"`) only when 176/176 + 88/88 pass on the RC SHA.
    - An agent may coordinate and validate. It may not produce records.
11. **A11Y-098 `a11y-cert-summary.mjs`** (`ga-cert` cell in `certify-release.yml`): read `contrast-matrix.json`, `a11y-pixel-contrast.json`, `axe-results.json`, `focus-appearance.json`, `a11y-manual-<sha>.json` and the budget results. Reject any artifact whose SHA ≠ the GA SHA. Emit `a11y-cert-summary.json`, with one row per AC-A11Y-01..25 giving value, target, pass and source artifact URL. DX (DX-134 `gen-claims.mjs`) generates docs and README claims from this file.

## 5. Running
Unit tests run locally. The APG spec, the `beta-gate`, the budgets and `ga-cert` run only in QA's `certify-*.yml` workflows in GitHub Actions on `auraoneai/auraglass` (follow `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or via the `auraone-remote-run` skill. Never use local Docker or a local browser. Tarball inspection (A11Y-092) is file-only: unpack into an empty directory and read it, and don't execute it.

## 6. Prohibited
- a panel built on stand-in controls
- allowing a disabled option to change the resolved value
- hand-editing artifacts or SR records
- authoring SR or touch results as an agent
- closing issue #16 early
- `test.skip`/`.only`
- relaxing any AC target or budget
- `-u` snapshot updates
- marking a PRD-00/16/17/20 item done without inspecting its output

## 7. Exit criteria
| AC | Gate |
|---|---|
| AC-A11Y-07 | A11Y-093: 0 `high` on 4.2 and 5.0 |
| AC-A11Y-16 | 176/176 SR + 88/88 touch on the RC SHA; issue #16 closed with the artifact link |
| AC-A11Y-19/20/21 | `verify-a11y-removals.mjs` green in `beta-gate` |
| AC-A11Y-24 | PRD-20 `no-unsourced-claim` = 0, driven by `claims-sources.json` |
| AC-A11Y-25 | A11Y-096: all §16 budgets green on the GA SHA |
| REQ-A11Y-38/39 | panel unit and APG tests green |
| DoD §18 | `a11y-cert-summary.json` shows AC-A11Y-01..25 all `pass` on the GA SHA |

## 8. Final report
1. Task table A11Y-088..098 → status, commit, CI URL.
2. The `a11y-cert-summary.json` table: AC, value, target, pass, artifact.
3. 4.1.1/4.2 verification results per item.
4. `deprecations.json` entry count, and schema validation output.
5. SR/touch progress (cells recorded / required).
6. Panel screenshots and reviewer sign-off.
7. Blockers with their owner PRD.
8. Deviations, with evidence.
