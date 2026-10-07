# AuraGlass 5.0 Accessibility and Preferences PRD

| Field | Value |
|---|---|
| PRD id | **PRD-05** |
| Key | **A11Y** (`PRD-A11Y`; task fragment `tasks/A11Y.json`, ids `A11Y-NNN`). Other PRDs are cited by §16 id (`PRD-00`..`PRD-20`); the key crosswalk is `_shared-contracts.md` SC-01 (PRD-00 TRUST, PRD-01 REL, PRD-02 PKG, PRD-03 DS, PRD-04 MAT, PRD-06 MOT, PRD-07/14/16 FND, PRD-08 CTL, PRD-09 OVL, PRD-10 NAV, PRD-11 DATA, PRD-12 AI, PRD-13 MED, PRD-15 interim MAT, PRD-17 interim REL, PRD-18/20 DX, PRD-19 QA + SB, perf policy PERF) |
| Shared contracts | `prd/_shared-contracts.md` is binding; where this PRD and a registry row disagree, the row wins. This PRD **owns** SC-23 (preference runtime), SC-25 (portal root, `LayerStack`, Escape), the A11Y rows of SC-21 and SC-16, and the APG harness in SC-30. It **consumes** SC-18 (DS tokens, incl. `tokens/contrast/busy-reference.json` = DS-033), SC-26 (FND KEEP primitives), SC-28 (QA scenes), SC-29 (QA lanes/workflows/configs) and SC-11 (PKG scripts layout) |
| Title | Accessibility, preferences and legibility contract |
| Owner area | Accessibility and preferences (`ag.a11y` CSS layer, `./theme` preference runtime, a11y certification contract) |
| Status | **Draft** |
| Date / baseline | 2026-10-06, `aura-glass` 4.1.0 at `15b6de6f7` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2 D-10, D-11, D-13, D-24, D-28; §4.4, §4.5, §4.6; §5.3, §5.4; §6; §7; §9.1; §11.1; §13.1; §14.5 B13; §15; §16 PRD-05); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_MISSING_CAPABILITY_MAP.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md`; `autopsy/accessibility.md`; `autopsy/runtime-remote.md` + `autopsy/remote-evidence/analysis.json`; `autopsy/material-engine.md`; `autopsy/motion.md`; `component-inventory.json`; `research/translucent-a11y-perf.md` |
| Related decisions | **D-11** (OS signals are floors), **D-13** (Base UI foundation, RA optional peer for date/tree), D-10 (pre-paint `AuraGlassScript`), D-12 (`clear` without backdrop renders `regular`), D-14 (prefix drop, `compat`), D-24 (layers, zero `!important`), D-25 (motion), D-27 (change class), D-28 (4.x visual a11y fixes), D-32 (evidence is CI artifacts) |
| Requirement prefix | `REQ-A11Y-NN` |
| Acceptance prefix | `AC-A11Y-NN` |
| Exit criterion (§16) | forced-colors, contrast-more and reduced-transparency cells green on `Surface` in the QA lanes **L5 Behaviour** and **L6 Environment visual** (SC-29 lane ids; there is no separate "forced-colors lane"); extended here to every T0 and T1 component before GA |

**Deviations from the canonical architecture, stated explicitly.**

1. **File name.** §16 names this PRD `PRD-05-a11y-preferences.md`. The orchestrating task assigns `prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Same PRD id and boundary; the file name follows the task. PRD index links should point here.
2. **Finding-ID numbering.** The architecture and the autopsy summary use a renumbered `ACCESSIBILITY-*` scheme that does not match the IDs in `autopsy/accessibility.md` (for example, "`prefers-contrast: high`" is ACCESSIBILITY-04 in the summary and architecture, ACCESSIBILITY-06 in the detail report). This PRD cites the **detail-report IDs** (they carry the adversarial verdicts) and gives the crosswalk in §2.1.
3. **Black-background failure count.** The task brief cites "244/342 fail AA on black". Recomputing `autopsy/remote-evidence/analysis.json` `contrastRows` gives **266/342** failing (`fail: true`), 276/342 on `worstRatio`, 268/342 below 4.5:1 and **240/342 below 3:1**, median `ratio` 1.925:1 (reported as 1.92:1 in `runtime-remote.md`; median `worstRatio` 1.525:1). This PRD uses 266/342, which also matches `runtime-remote.md` §1 and the autopsy summary line 20.
4. **Hit-area mechanism.** §6 says the coarse-pointer 44px hit area is "a pseudo-element". §4.6 already allocates both `::before` (optics) and `::after` (rim/specular) on every `.ag-surface`, so a pseudo-element is unavailable on chrome surfaces such as `IconButton`. This PRD uses an internal `aria-hidden` child `<span data-ag-part="hit-area">` instead (REQ-A11Y-30). Non-surface controls may still use a pseudo-element.
5. **Ownership split.** The task scope includes build-time contrast solve, rendered-pixel verification and per-widget APG conformance. §16 assigns the solver transform to PRD-03, the pixel/OCR harness to PRD-19, and widget behaviour to PRD-07..PRD-14. This PRD **owns the contract** (pairs, composites, thresholds, key scripts, matrices, test names) and the shared test helpers; those PRDs own the implementations. No internal of another PRD is edited here (§16 rule).
6. **Busy reference representation.** §7.3 describes the busy composite as "a saturated mid-grey gradient". A gradient has no single colour to solve against, so this PRD fixes it as 9 discrete sRGB samples (REQ-A11Y-15) and takes the minimum over them. The file `tokens/contrast/busy-reference.json` is **created and owned by PRD-03 (DS-033)** per SC-18 (no other PRD creates files under `tokens/`); this PRD specifies the values and verifies them (A11Y-001). Terminology per SC-28: "backdrop" means only the declared `data-ag-backdrop` axis (light/dark/media); white, black and busy are **composites**.
7. **`--ag-glass-opacity` is the one inline custom property.** §9.1 says the provider "writes only `data-ag-*` attributes and an optional brand `<style>`". A continuous 0..1 dial cannot be expressed as a finite attribute set without stepping, so `AuraGlassScript` and `AuraGlassProvider` write exactly one custom property, `--ag-glass-opacity`, on `<html>` or the provider root (REQ-A11Y-07, -31, -37). No other inline style is written by either.
8. **`AuraGlassScript` budget unit.** This PRD adopts the stricter `AURAGLASS_MATERIAL_ENGINE_PRD.md` REQ-MAT-55 limit, ≤1.5 KB **minified** (not min+gz), so both PRDs gate on one number; the script also carries the REQ-MAT-54/55 engine and tier detection that PRD-04 specifies and this PRD implements.
9. **Shared-contract reconciliation (2026-10-06, `_shared-contracts.md`).** (a) SC-26: `Portal`, `DismissableLayer` and `VisuallyHidden` are FND KEEP primitives (FND-031, FND-035, FND-038); this PRD states their behaviour requirements and tests them, it does not create or own them. (b) SC-25: the portal-root context lives in `src/theme/layers/` (A11Y-049/051); the single accessor every Base UI `*.Portal` wrapper uses is FND's `usePortalContainer()` in `src/foundation/portal.ts` (FND-007). (c) SC-30: per-widget APG specs (`tests/a11y/apg/<kebab>.apg.spec.ts`) belong to the component PRD (Button = CTL-060, Dialog = OVL-053); this PRD owns `tests/a11y/apg/harness.ts` (A11Y-073), its self-test fixtures and the coverage manifest. (d) SC-29: `jest.config.js`, `playwright.config.ts`, `certification/playwright.cert.config.ts`, `certification/lanes.config.ts` and the `certify-{pr,main,release}.yml` workflows belong to QA; this PRD registers its suites by MODIFY (no `playwright.a11y.config.ts`, no `a11y-lanes.yml`). (e) SC-11: the pre-paint bundler is `scripts/build/build-prepaint-script.mjs`. (f) SC-28: scene ids are `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`. (g) The matrix contract (axes/pairs/thresholds) is A11Y data at `tests/a11y/contrast/matrix-contract.json`, not under `tokens/`.

---

## 1. Problem

AuraGlass 4.1 sells "accessibility guardrails" (`README.md:3`) and ships about 12.4k lines of accessibility code, but the material that every component paints is not legible over real content, and most of the accessibility layer is fabricated or dead.

- **Glass is not legible over arbitrary backdrops.** In remote headless Chromium with the Storybook stage removed, 266 of 342 sampled text runs fail WCAG contrast on black (median 1.92:1), 20/342 on a busy gradient and 2/342 on white. Every one of the 42 sampled stories fails on black. The computed glass tint changed across white, black and busy backgrounds in **0 of 84** story×viewport pairs. The typical fill is `rgba(255,255,255,0.02)`, and ink is pinned to `rgba(0,0,0,.9)` by a tone class, not by what is behind the surface. The certified 3.2 App Shell stories fail on their own default stage (1.12–2.14:1).
- **The contrast "guarantee" is theatre.** `ContrastGuard` parses its default text colour as white, invents its improvement math, and reports a pass when it throws. Its CSS outputs have no consumer. `LiquidGlassMaterial` "fixes" a failing check by lowering the opacity of the whole surface, text included. `validateTextContrast` returns `true`.
- **OS preferences are only partly honoured.** All 16 `prefers-contrast` queries use the invalid keyword `high`; in Chromium, `contrast: more` changes **0.000%** of pixels on 12/12 stories. `prefers-reduced-transparency` and `forced-colors` blocks target legacy class names only, so inline-styled and `LiquidGlassMaterial` surfaces keep their blur (forced colors: modal 12→10 visible backdrop filters, showcase 12→12, `liquid-glass-material` 1→1). `prefers-reduced-transparency` never fires in Safari or Firefox, and there is no user-level control that reaches the material.
- **There is no single preference or overlay runtime.** Four settings sources, five reduced-motion detectors, six focus traps, six announcers and three skip-link implementations coexist. None of the settings are read by the material. Dialog Escape is a document-level listener, so stacked overlays all close at once.
- **Focus, targets and keyboard support fail on glass.** Focus is drawn by at least four competing systems, one of which is a global stylesheet that rewrites `box-shadow` on every focused element in the consumer's app and hides focus on `aria-disabled` elements. The ring colour is a single hue over unknown backdrops. There is no `pointer: coarse` enlargement. Slider has no keyboard; date picker, tooltip, select, menubar, context menu, accordion, tabs, tree and command palette deviate from the WAI-ARIA APG.
- **Tests cannot catch any of it.** `jest-axe` runs in jsdom (359 files), where `color-contrast` cannot evaluate. There is no browser axe, no `contrast: more` or reduced-transparency emulation, and no rendered-pixel contrast gate. Manual screen-reader and touch certification is still open (GitHub issue #16, `OPEN`: "Track 3.2 manual screen-reader and physical touch certification").

For 5.0 the material is the product (§1.1). If a translucent material cannot guarantee legibility, respect OS accessibility floors, and present a correct focus indicator over any content, nothing built on it can be certified. This PRD defines that guarantee and the single runtime that enforces it.

---

## 2. Evidence from the current codebase

All paths are relative to the repo root `/Users/gurbakshchahal/platforms/AuraGlass` and were confirmed to exist with `rg --files` / `test -e` on 2026-10-06. Line numbers come from the verified autopsy unless marked *(re-read)*, which means they were re-read for this PRD. Verdicts are from `autopsy/accessibility.md` "Verification (adversarial)": 13 CONFIRMED, 4 PARTIAL, 0 REFUTED. PARTIAL corrections are honoured below.

### 2.1 Finding-ID crosswalk (detail report → architecture/summary)

| Content | `autopsy/accessibility.md` (cited here) | Architecture / autopsy summary |
|---|---|---|
| ContrastGuard reads text colour as white | ACCESSIBILITY-01 | ACCESSIBILITY-01 |
| Fabricated enforcement | ACCESSIBILITY-02 | ACCESSIBILITY-02 |
| `LiquidGlassMaterial` fades whole element | ACCESSIBILITY-03 | (cited as -03 "import-only uses" in summary) |
| `prefers-contrast: high` | ACCESSIBILITY-06 | ACCESSIBILITY-04 |
| Reduced-transparency / forced-colors miss canonical material | ACCESSIBILITY-07 | ACCESSIBILITY-05 |
| Slider has no keyboard | ACCESSIBILITY-08 | ACCESSIBILITY-06 |
| Date picker not APG | ACCESSIBILITY-09 | ACCESSIBILITY-08 |
| Tree has no keyboard | part of ACCESSIBILITY-13 | ACCESSIBILITY-07 |
| Tooltip hover-only | ACCESSIBILITY-10 | (summary "Medium", unnumbered) |
| Select keyboard model | ACCESSIBILITY-11 (PARTIAL) | (summary "Medium") |
| Menubar / ContextMenu / DropdownMenu | ACCESSIBILITY-12 | ACCESSIBILITY-12 |
| Accordion as tabs; Tabs landmark + duplicate IDs | ACCESSIBILITY-13 | ACCESSIBILITY-13, -16 |
| Focus hidden on `aria-disabled`; global focus CSS | ACCESSIBILITY-14 | ACCESSIBILITY-11 (focus) |
| jsdom-only axe | ACCESSIBILITY-15 (PARTIAL) | ACCESSIBILITY-10 |
| Overclaiming reports | ACCESSIBILITY-16 | — |
| Touch targets | ACCESSIBILITY-17 (PARTIAL) | ACCESSIBILITY-14 |
| Command palette | ACCESSIBILITY-18 | — |
| Data grid is a table | (mediocre section) | ACCESSIBILITY-15 |

### 2.2 Legibility over real content (runtime, remote Chromium 141)

| Evidence | Source |
|---|---|
| Stage removed: black **266/342** fail (median 1.92:1; 240/342 below 3:1), busy 20/342, white 2/342, default stage 17/342 | `autopsy/remote-evidence/analysis.json` `contrastRows` *(recomputed with node)*; `autopsy/runtime-remote.md` §1 |
| Tint adapts in 0/84 story×viewport pairs; fill `rgba(255,255,255,0.02)` + 0.106→0.02 white gradient | `runtime-remote.md` §1; `src/tokens/glass.ts:995-1000` |
| Ink pinned by tone class: `.glass-on-light .glass` sets `--glass-text-primary` black-90 | `src/styles/glass.css:78-100` |
| Global `[class*="glass-"] { color: var(--glass-text-primary) !important }` | `src/styles/premium-typography.css:113-116` *(re-read)* |
| Every story painted on an opaque light stage (`glass-on-light`), hiding the defect | `.storybook/StorySurface.tsx:85-96` *(re-read)* |
| 3.2 App Shell fails on its own stage (1.12–2.14:1) | `runtime-remote.md` §2 |
| Sampler reads transparent wrappers as black (MATERIAL-ENGINE-08, CONFIRMED) | `src/hooks/useLiquidGlassBackdrop.ts:117-170` |

### 2.3 Fake contrast layer

| ID | Finding | Evidence |
|---|---|---|
| ACCESSIBILITY-01 | Default `textColor` `"var(--glass-text-primary)"` parsed as white; `minContrast` never read | `src/utils/contrastGuard.ts:182,529-546`; `src/components/accessibility/ContrastGuard.tsx:152` |
| ACCESSIBILITY-02 | `captureBackdrop` returns `null`; hard-coded `contrast: 4.5`; ×1.2 blur "estimate"; "assume fallback meets"; error path `meetsRequirement: true`; "AA" badge from that flag | `src/utils/contrastGuard.ts:343-353,387,470,481,509-510,685`; `ContrastGuard.tsx:218-224` |
| ACCESSIBILITY-03 | Failing check sets `opacity` 0.65–0.95 on the whole surface | `src/primitives/LiquidGlassMaterial.tsx:264-270,326-332`; `src/tokens/glass.ts:1344,1349` |
| ACCESSIBILITY-04 | Written vars/classes (`--glass-surface-opacity`, `--glass-adaptive-*`, `glass-contrast-fallback`) have no CSS consumer | `src/utils/contrastGuard.ts:735-764`; `LiquidGlassMaterial.tsx:513-514` |
| ACCESSIBILITY-05 | Leaked `MutationObserver`; N×M observers in `GlassDataGrid`; `HStack` wrapped in ContrastGuard | `contrastGuard.ts:208-259,699-727`; `src/components/data-display/GlassDataGrid.tsx:244,348,439-444`; `src/components/layout/HStack.tsx:54-64` |
| TOKENS-THEME-07 | `validateTextContrast` returns `true`; `validateLiquidContrast`, `sampleBackdropLuminance` helpers | `src/tokens/glass.ts:931,1521,1631` *(re-read)* |
| — | 276 `<ContrastGuard>` JSX uses in 68 files; `.glass-contrast-guard` is only a `color:` rule applied 436 times | `autopsy/accessibility.md` counts; `src/styles/glass.css:572-574` |
| — | Root exports: `ContrastGuard` (`src/index.ts:497`), `GlassA11y` (`:498`), `AccessibilityProvider` (`:629`), `GlassFocusIndicators` (`:630`), `GlassA11yAuditor` (`:381`) | `src/index.ts` *(re-read)* |

### 2.4 OS preferences and fallbacks

| ID | Finding | Evidence |
|---|---|---|
| ACCESSIBILITY-06 | 16 `prefers-contrast: high`, 0 `more` (17 matching lines in non-test `src` by `rg` today) | `src/styles/glass.css:4055`; `src/components/accessibility/GlassFocusIndicators.css:56`; `src/utils/a11y.ts:301,973`; `src/hooks/useAccessibilitySettings.ts:173,225`; `src/components/accessibility/AccessibilityProvider.tsx:104-105`; `src/core/productionCore.ts:230,393`; `src/hooks/useAccessibility.ts:251`; `src/styles/animations.css:550`; `src/styles/premium-typography.css:237` |
| runtime §3 | `contrast: more` → 0.000 pixel diff on 12/12 stories; failure count unchanged (4/46) | `runtime-remote.md` §3 |
| — | Invalid CSS: `forced-colors: active;` written as a declaration inside `@media (prefers-contrast: high)` | `src/styles/theme-transitions.css:51-53` *(re-read)* |
| ACCESSIBILITY-07 | Reduced-transparency (`glass.css:4022`) and forced-colors (`:4073`) blocks target legacy classes only; `buildSurfaceStyles` emits literal `blur()`; `createGlassStyle` called 129× in 62 component files with no media check | `src/styles/glass.css:4022-4093` *(4022, 4073, 4099 re-read)*; `src/tokens/glass.ts:995-1018`; `src/core/mixins/glassMixins.ts:41-95`; `LiquidGlassMaterial.tsx:336-367` |
| runtime §4 | Forced colors keeps blur: modal 12→10, 3.2 shell 21→3, showcase 12→12, `liquid-glass-material` 1→1 | `runtime-remote.md` §4 |
| — | Asset to keep and extend: the fallback block at `glass.css:4022-4123` (§7.2) | architecture §7.2 |
| research | `prefers-reduced-transparency` only in Chromium 118/119+; never fires in Safari (through 27.x TP) or Firefox | `research/translucent-a11y-perf.md` §3 |

### 2.5 Duplicated runtime

| Area | Implementations | Evidence |
|---|---|---|
| Settings | `AccessibilityProvider` (toggles `.high-contrast`, `.large-text`, `data-color-blindness` that no CSS reads), `useAccessibilitySettings`, `a11y.ts:970` watcher, `GlassA11y` local state | `AccessibilityProvider.tsx:181-194`; `src/hooks/useAccessibilitySettings.ts`; `src/utils/a11y.ts:970` |
| Focus traps (6) | `src/primitives/focus/FocusTrap.tsx:58`, `useFocusTrap` `:336`, `src/primitives/FocusScope.tsx:43`, `src/utils/focus.ts:48 trapFocus`, `src/utils/a11yEnhancers.tsx:179`, ad-hoc in `GlassFocusIndicators.tsx:353-393` | `autopsy/accessibility.md` table |
| Announcers (6) | `src/utils/focus.ts:286`, `src/utils/a11y.ts:834`, `src/utils/a11yHooks.ts:299`, `src/primitives/focus/ScreenReader.tsx:160,194`, `src/utils/a11yEnhancers.tsx:573` | *(focus.ts:286, a11y.ts:834, ScreenReader.tsx:160,194 re-read)* |
| Reduced motion (5+) | `src/hooks/useReducedMotion.ts`, `src/hooks/useReducedMotion.tsx`, `src/hooks/useEnhancedReducedMotion.ts`, `src/hooks/useMotionPreference.ts`, `src/contexts/MotionPreferenceContext.tsx`, `src/primitives/motion/ReducedMotionProvider.tsx` | MOTION-02; HOOKS-UTILS-TYPES-04 |
| Skip links (3) | `src/primitives/focus/SkipLinks.tsx`, `SkipLinks` in `GlassFocusIndicators.tsx`, a11yEnhancers | inventory `SkipLinks` CONSOLIDATE |
| Roving focus | `src/primitives/RovingFocusGroup.tsx` (255 LOC), used by no component | ACCESSIBILITY "Duplication" |
| Contrast math (5+, 13 luminance copies) | `utils/contrastGuard.ts`, `utils/contrast.ts:77-89`, `theme/color.ts:61`, `theme/contrast.ts`, `useLiquidGlassBackdrop.ts`, `src/__tests__/glass-contrast.spec.ts:18-37` | ACCESSIBILITY "Duplication"; architecture §7.3 |

### 2.6 Focus, targets, overlays

| ID | Finding | Evidence |
|---|---|---|
| ACCESSIBILITY-14 | `[aria-disabled="true"]:focus-visible{outline:none;box-shadow:none}`; unscoped `button/a/input/[tabindex]:focus-visible` rules shipped in `dist`; Tab-trap listeners re-added on every focus change, never removed | `src/components/accessibility/GlassFocusIndicators.css:78-91,113-116`; `GlassFocusIndicators.tsx:10,353-393` |
| — | `.glass-focus` defined twice with different mechanics (outline vs `outline:none` + box-shadow) | `src/styles/glass.css:549-552,4236-4250` |
| — | Single-hue ring `--glass-focus-ring-color: hsl(var(--glass-color-primary))` | `src/styles/design-tokens.css:46` *(re-read)* |
| — | 109 `focus:outline-none` strings in `src` (`rg` today; architecture says 105); inert Tailwind rings, e.g. `focus-visible:ring-white/10` | `src/components/navigation/GlassContextMenu.tsx:442` |
| ACCESSIBILITY-17 (PARTIAL) | `GlassButton` `xs` 24px / `sm` 32px; 0 `pointer: coarse` queries. Correction honoured: 24px passes 2.5.8 AA; only the 44px platform target fails; sr-only reset is noise | `src/components/button/GlassButton.tsx:595-596`; `src/styles/glass.css:2905-2934`; token `--glass-touch-target-min: 44px` at `src/styles/tokens.css:363` *(re-read)* |
| dialog | `role="dialog"` on the backdrop wrapper; document-level Escape closes all stacked dialogs; background not `inert`; analytics attributes on dialog DOM | `src/components/modal/GlassDialog.tsx:238-249,582-594`; `src/components/modal/GlassModal.tsx:340-375,795-797,838-845` |

### 2.7 Keyboard and APG

| ID | Widget | Defect | Evidence |
|---|---|---|---|
| ACCESSIBILITY-08 | Slider | no `onKeyDown`, no `aria-orientation`, no keyboard tests | `src/components/input/GlassSlider.tsx:468-490` |
| ACCESSIBILITY-09 | DatePicker | no grid/gridcell/dialog roles, no arrows/Page/Home/End, selection visual-only | `src/components/input/GlassDatePicker.tsx:430-442,609-635` |
| ACCESSIBILITY-10 | Tooltip | hover-only, no Escape, `aria-describedby` on wrapper | `src/components/modal/GlassTooltip.tsx:244-250` |
| ACCESSIBILITY-11 (PARTIAL) | Select | searchable mode loses arrows; no option ids / `aria-activedescendant` in any mode | `src/components/input/GlassSelect.tsx:274-327,446,527,625-703`; `src/primitives/focus/FocusTrap.tsx:104-109,220-224` |
| ACCESSIBILITY-12 | Menubar / ContextMenu / DropdownMenu | no roving tabindex; Escape blurs to `<body>`; Tab trapped; no typeahead | `src/components/navigation/GlassMenubar.tsx:389-415`; `GlassContextMenu.tsx:172-197,437`; `GlassDropdownMenu.tsx:351-375` |
| ACCESSIBILITY-13 | Accordion / Tabs / Tree | tab roles in accordion; `role="navigation"` per tab set; ids `trigger-${value}` collide; tree items all tab stops | `src/components/data-display/GlassAccordion.tsx:338-339,398-401,446-447`; `src/components/navigation/GlassTabs.tsx:130,440-442,535`; `src/components/tree-view/TreeItem.tsx:262-285,352` |
| ACCESSIBILITY-18 | CommandPalette | `listbox` without `aria-activedescendant` / option ids / combobox input | `src/components/interactive/GlassCommandPalette.tsx:410-445,614-620,677-678` |
| keep | DropdownMenu, Combobox, Tabs keyboard logic are the best 4.x models | `GlassDropdownMenu.tsx:229-231,352-367`; `src/components/input/GlassCombobox.tsx:99-188`; `GlassTabs.tsx:325-361` |

### 2.8 Tests, reports, issue #16

| ID | Finding | Evidence |
|---|---|---|
| ACCESSIBILITY-15 (PARTIAL) | jest-axe in 359 files under jsdom (contrast cannot run); `glass-contrast.spec.ts` tests white text on a fixed dark backdrop only; no `@axe-core/playwright`. Correction honoured: forced-colors emulation and a computed-style contrast check already exist in Playwright and are reused | `src/__tests__/glass-contrast.spec.ts:179-188,325-343`; `tests/visual/accessibility/a11y-visual.spec.ts:88-91,132`; `tests/visual/accessibility/contrast.spec.ts:16-88`; `scripts/storybook-exhaustive-qa.js:390,687`; `package.json:416` (`@axe-core/react`, unused), `:431` (`@storybook/addon-a11y` 9.1.20), `:466` (`jest-axe`) |
| ACCESSIBILITY-16 | "100% Coverage (284/284)"; "76 successful" integrations that were "imports and TODO comments"; `GlassA11y` hard-codes `passed / 95` | `reports/FOCUS_MANAGEMENT_SUMMARY.md:5`; `reports/contrastguard-integration-report.json:3`; `src/components/accessibility/GlassA11y.tsx:152-156,236-285,903-915` |
| keep | Honest ledgers that mark manual SR/touch as pending | `reports/3.2-release/accessibility-certification.md:3`; `reports/3.3-release/accessibility-certification.md:3` |
| issue #16 | `gh issue view 16` → `OPEN`, "Track 3.2 manual screen-reader and physical touch certification" *(re-checked 2026-10-06)* | GitHub |

### 2.9 Inventory dispositions (`component-inventory.json`, filtered with node)

`ContrastGuard` REPLACE (token-level contract) · `GlassA11y` + sub-panels REMOVE (successor `GlassPreferencesPanel`) · `GlassFocusIndicators` REMOVE · `GlassA11yAuditor` REMOVE · `GlassFocusRing` REPLACE · `FocusIndicator` REMOVE · `AccessibilityProvider` REDESIGN (merge into one provider) · `FocusTrap`/`useFocusTrap` REPLACE · `ScreenReader` family CONSOLIDATE (VisuallyHidden + announcer) · `SkipLinks` CONSOLIDATE · `FocusScope` **KEEP** · `ReducedMotionProvider` REMOVE · `RovingFocusGroup` POLISH (becomes internal; Base UI supersedes it for flagships).

---

## 3. Desired end state

At 5.0 GA:

1. **Legibility is a property of the material, proven twice.** Every `on-surface` text pair reaches ≥4.5:1 (large text and non-text ≥3:1, `contrast=more` ≥7:1) when the surface tint is composited at its solved floor alpha over pure white, pure black and the busy reference set. The token build fails otherwise. The same thresholds hold on rendered pixels across the 8 certification scenes, 3 engines, light/dark and every transparency rung. The 4.1 baseline of 266/342 failing text runs on black goes to **0** for every T0 and T1 subject.
2. **OS accessibility signals are floors (D-11).** `forced-colors: active` always renders solid system colours with no blur on any surface or overlay. `prefers-contrast: more` and `prefers-reduced-transparency: reduce` always render at least `tinted`. No app prop, user setting, `data-ag-*` attribute or `compat` adapter can lower them. This holds with **zero JavaScript**, because the CSS media blocks in `@layer ag.a11y` enforce it.
3. **Users can choose more opacity on every engine.** `AuraGlassProvider` exposes `transparency: 'system' | 'glass' | 'tinted' | 'solid'`, `glassOpacity: 0..1` and `contrast: 'system' | 'standard' | 'more'`. `GlassPreferencesPanel` exposes them to end users. Persisted choices are applied **before first paint** by `AuraGlassScript`, so Safari and Firefox users (where `prefers-reduced-transparency` never fires) get a working Reduce Transparency equivalent without a flash.
4. **One preference store, one provider, one portal root, one layer stack, one announcer, one focus ring.** `usePreference(key)` replaces at least 10 detectors. Base UI and owned overlays portal into the provider's root, share one z-order and one stacked-Escape order, and make the background `inert` for modal layers.
5. **Focus is visible on any glass.** A 2px two-tone ring (inner light, outer dark, `outline`-based) meets WCAG 2.4.13 AAA and 1.4.11 over any backdrop and becomes `2px solid Highlight` under forced colours. Sticky glass chrome publishes `--ag-scroll-padding-*`, so no focused element is entirely hidden (2.4.11).
6. **Targets are 24×24 minimum everywhere, 44×44 under `pointer: coarse`.**
7. **Every interactive widget passes a scripted APG keyboard test** in Chromium, WebKit and Gecko, built on Base UI (or RA for date/tree per D-13), and **every T1 flagship has a recorded pass** in the screen-reader matrix (VoiceOver macOS + iOS, NVDA + Chrome, TalkBack + Chrome) plus a physical-touch pass. Issue #16 is closed by those records.
8. **Content survives zoom and colour-vision differences:** reflow at 400% (320 CSS px), text resize to 200%, text-spacing overrides, and no state conveyed by colour alone, checked under protan/deutan/tritan simulation.
9. **The fakes are gone.** `ContrastGuard`, `TextWithContrast`, `HighContrastText`, `useAutoTextContrast`, `validate*Contrast`, `sampleBackdropLuminance` (in `src/tokens/glass.ts`), `GlassA11y`, `GlassA11yAuditor`, `GlassFocusIndicators` (+ `SkipLinks`, `LandmarkAnnouncer`, `KeyboardShortcutsHelper`), `GlassFocusRing`, `FocusIndicator`, `AccessibilityProvider`'s unstyled classes, the global focus stylesheet and every `prefers-contrast: high` query are deleted. No "AA" badge is ever computed at runtime. README a11y claims are generated from the GA certification run (D-32).

Non-goals: APCA as a gate (advisory only, §7.3); a "colour-blind mode" toggle (colour independence is a design rule, not a mode); runtime per-text contrast sampling in production (deleted, §7.3); WCAG 3 conformance.

---

## 4. Architecture

### 4.1 Layer and module map

```
tokens/*.tokens.json  ──(PRD-03 compiler: contrast-solve transform, contract from this PRD)──▶
   tokens.css  material.css  dist/contrast-matrix.json  (solved floors, per-cell ratios)

styles.css = @layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;
                                                                    ▲
                                    src/a11y/css/*.css  (THIS PRD: rungs, focus, targets, sr-only)

./theme  (client unless noted)
  AuraGlassScript (server)  → pre-paint: reads storage + matchMedia, writes data-ag-* on <html>
  AuraGlassProvider          → preference store, portal root, layer stack, announcer, toast region,
                               dev counters; writes data-ag-* on its root / <html>
  usePreference(key)         → useSyncExternalStore over one PreferenceStore
  GlassPreferencesPanel      → T2 UI over the store (built on flagship RadioGroup + Slider)

./primitives (KEEP set, re-homed): Portal, FocusScope, VisuallyHidden, DismissableLayer, Slot, Label
```

### 4.2 Resolution model (D-11)

Ladder `glass(0) < tinted(1) < solid(2)`. Contrast ladder `standard(0) < more(1)`.

```
transparency_eff = max(
  osFloor:   forced-colors:active → 2; prefers-contrast:more → 1; prefers-reduced-transparency:reduce → 1; else 0
  capFloor:  !CSS.supports('(backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))') → 2; else 0
  app:       provider transparency ('system' → 0)
  user:      persisted transparency ('system' → 0); glassOpacity ≥ 0.7 → 1
)
contrast_eff = max(prefers-contrast:more → 1, app contrast, user contrast)
forcedColors  = matchMedia('(forced-colors: active)')   // independent, always wins
```

`forced-colors` is not a ladder value the store can set; it is read-only and maps to solid. The store exposes `resolved` and `floors` so UI can explain why an option is unavailable.

**Two enforcement paths, both required.**

1. **JS path.** `AuraGlassScript` (pre-paint) and `AuraGlassProvider` (after hydrate, on change) write the *effective* values to `data-ag-transparency` and `data-ag-contrast` on `<html>` (or the provider root for nested providers).
2. **CSS path (no JS).** `@layer ag.a11y` contains attribute blocks first, then media blocks. Media blocks are written so they only *raise*: they match surfaces that are not already under a higher attribute, with equal specificity to the attribute blocks, so source order decides. Sketch:

```css
@layer ag.a11y {
  /* attribute rungs: specificity (0,1,0) via :where() on the ancestor */
  :where([data-ag-transparency="tinted"]) [data-ag-surface] { --_ag-tint-floor: var(--_ag-tint-floor-tinted); --_ag-refraction-scale: 0; }
  :where([data-ag-transparency="solid"])  [data-ag-surface] { /* solid rung, §4.3 */ }
  :where([data-ag-contrast="more"])       [data-ag-surface] { /* contrast-more rung */ }

  /* OS floors: same specificity, later in source, guarded so they never lower 'solid' */
  @media (prefers-reduced-transparency: reduce) {
    [data-ag-surface]:not(:where([data-ag-transparency="solid"] *)) { --_ag-tint-floor: var(--_ag-tint-floor-tinted); --_ag-refraction-scale: 0; }
  }
  @media (prefers-contrast: more) {
    [data-ag-surface] { /* contrast-more ink, border, specular 0 */ }
    [data-ag-surface]:not(:where([data-ag-transparency="solid"] *)) { --_ag-tint-floor: var(--_ag-tint-floor-tinted); }
  }
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { [data-ag-surface] { /* solid rung */ } }
  @media (forced-colors: active) { [data-ag-surface], [data-ag-surface]::before, [data-ag-surface]::after { /* forced rung */ } }
}
```

Because the `ag.a11y` layer is last (D-24), it beats `ag.material` and `ag.components` without `!important`. Unlayered consumer CSS can still beat it; that is the documented escape hatch for apps, and the certification lane asserts that **library** CSS alone satisfies the floors.

### 4.3 Rung table (CSS contract, `[data-ag-surface]`)

| Effective state | `::before` (optics) | Host fill | Ink / border | Other |
|---|---|---|---|---|
| `glass` | compiled blur/saturate | `--_ag-fill` at solved floor (`--_ag-tint-floor`), `--ag-glass-opacity` can only raise | `--ag-on-surface` | refraction allowed (PRD-15) |
| `tinted` | blur kept | floor = `--_ag-tint-floor-tinted` (compiler output) | unchanged | `--_ag-refraction-scale: 0` |
| `contrast=more` | ≥ tinted | ≥ tinted | `--ag-on-surface: var(--ag-color-on-surface-max)` (near black/white), `border: 1px solid var(--ag-color-border-strong)` | `--ag-specular: 0`, grain off; text pairs ≥7:1 |
| `solid` | `backdrop-filter: none; -webkit-backdrop-filter: none` | `background: var(--ag-fallback-fill)` (lightweight-tier fill, alpha ≥0.85 per §4.7; the matrix `solid` cells must pass at that alpha) | `--ag-on-surface` solid pair | rim kept, refraction 0 |
| forced colours | `backdrop-filter: none`, `background-image: none` | `background: Canvas` | `color: CanvasText; border: 1px solid CanvasText` | `box-shadow: none` (the UA forces this too), focus `outline-color: Highlight`; scrims (`data-ag-layer="scrim"`) become `background: transparent; backdrop-filter: none`, and modality is conveyed by `inert` plus the Canvas panel border |

Coverage is by construction: `Surface`, `materialProps()` and every Base UI part rendered through them carry `data-ag-surface` (§7.2). Scrims and full-viewport overlay backdrops carry `data-ag-surface` with `data-ag-layer="scrim"` so they are covered (fixes modal 12→10).

### 4.4 Preference store

```ts
// src/theme/preferences/store.ts (NEW)
export type PreferenceKey = 'transparency' | 'glassOpacity' | 'contrast' | 'motion' | 'scheme' | 'density'
  | 'forcedColors' | 'reducedMotionOS' | 'reducedTransparencyOS' | 'contrastMoreOS' | 'coarsePointer';
export interface PreferenceStorage { get(key: string): string | null; set(key: string, v: string): void; remove?(key: string): void }
export interface PreferenceStore {
  getSnapshot<K extends PreferenceKey>(k: K): PreferenceValue<K>;
  getServerSnapshot<K extends PreferenceKey>(k: K): PreferenceValue<K>; // 'system' / false / defaults
  subscribe(k: PreferenceKey, cb: () => void): () => void;
  set<K extends UserSettableKey>(k: K, v: PreferenceValue<K>): void; // persists, re-resolves, writes attributes
  resolved(): ResolvedPreferences;  // { transparency, contrast, motion, scheme, density, floors }
}
```

- One `MediaQueryList` per query per document, created lazily on first `subscribe`, never at import (side-effect gate, §3.3).
- Storage key `ag:prefs:v1`, JSON `{ transparency, glassOpacity, contrast, motion, scheme, density }`. Default adapter is `localStorage` guarded by `try/catch`; an in-memory adapter is used when storage throws. Apps inject their own (cookie, server profile).
- `motion` resolution follows PRD-06 (`prefers-reduced-motion: reduce` → at most `calm`, nothing can raise it). This PRD owns the store; PRD-06 owns motion CSS.

### 4.5 Provider, portal root and layer stack

`AuraGlassProvider` renders `children` inside its root element (the outermost provider marks `<html>` with `data-ag-root`; a nested provider renders `<div data-ag-root data-ag-provider>`) plus, at the end of `document.body` via `createPortal` (or into the `portalContainer` override prop), one container:

```html
<div data-ag-portal-root data-ag-scheme=… data-ag-transparency=…>
  <div data-ag-layer-root="overlay"></div>   <!-- Dialog, Sheet, Popover, Menu, Select, Combobox -->
  <div data-ag-layer-root="transient"></div> <!-- Tooltip, PreviewCard -->
  <div data-ag-layer-root="toast" role="region" aria-label="Notifications"></div>
  <div data-ag-announcer> <div aria-live="polite" aria-atomic="true"></div> <div aria-live="assertive" aria-atomic="true"></div> </div>
</div>
```

- `z-index` per root comes from tokens `layer.z.{overlay, transient, toast}` (§5.3). Within a root, DOM order is stack order.
- `LayerStack` (internal, `src/theme/layers/LayerStack.ts`, A11Y-049) tracks open layers `{ id, kind, modal, onEscape }` and is the **only** Escape, `inert` and scroll-lock dispatcher in the library (SC-25). `Escape` is handled by one `keydown` listener on the portal root's document, dispatched to the **topmost** layer only. Modal layers set `inert` on every sibling of the portal root and on `[data-ag-portal-root] > *` below them; non-modal layers do not. Elements that a sticky or overlay surface covers are marked `data-ag-obscured` (requested by OVL REQ-OVL-08; SC-21 A11Y row).
- Base UI `Portal` parts receive `container` from FND's single accessor `usePortalContainer()` (`src/foundation/portal.ts`, FND-007), which reads this PRD's portal-root context. FND's wrapping pattern routes Base UI per-root dismissal through `LayerStack`, so no root handles Escape itself. No Base UI type leaks.
- Provider opt-outs: `toasts?: boolean` and `tooltips?: boolean` (default `true`) skip rendering the toast region / transient root for apps that mount their own (SC-21).
- Attributes owned here (SC-21 ratified A11Y row): `data-ag-portal-root`, `data-ag-root`, `data-ag-announcer`, `data-ag-obscured`, `data-ag-focusable`, `data-ag-scroll-container`. The registry itself is MAT's (SC-21 owner).
- Nested providers reuse the outermost portal root and only scope `data-ag-*` attributes on their own wrapper element.

### 4.6 Focus ring, targets, scroll padding

```css
@layer ag.a11y {
  :where([data-ag-focusable], .ag-focusable):focus-visible {
    outline: var(--ag-focus-width, 2px) solid var(--ag-focus-outer);
    outline-offset: var(--ag-focus-width, 2px);
    box-shadow: 0 0 0 var(--ag-focus-width, 2px) var(--ag-focus-inner), var(--_ag-shadow, 0 0 #0000);
  }
  @media (forced-colors: active) { :where([data-ag-focusable], .ag-focusable):focus-visible { outline: 2px solid Highlight; } }
}
```

The inner tone fills the `outline-offset` gap, so the two tones are adjacent bands. With `--ag-focus-inner` ≈ white and `--ag-focus-outer` ≈ `#111`, at least one band reaches ≥3:1 against any opaque colour (worst case is about 4.3:1 at mid-grey; checked in REQ-A11Y-24). Hit area: an internal `<span data-ag-part="hit-area" aria-hidden="true">` centred on the control and sized `max(100%, var(--ag-target-min))` / `max(100%, var(--ag-target-coarse))` under `(pointer: coarse)`. Sticky chrome writes `--ag-scroll-padding-top/bottom` on its nearest scroll container; `[data-ag-scroll-container] { scroll-padding-block: var(--ag-scroll-padding-top,0) var(--ag-scroll-padding-bottom,0) }`.

### 4.7 Contrast proof chain

| Stage | Owner | What runs | Output |
|---|---|---|---|
| Build-time solve | PRD-03 (contract here) | for each cell, minimum floor alpha such that every pair passes on white, black and each busy sample | `dist/contrast-matrix.json`, solved `--_ag-tint-floor*` in `material.css` |
| Unit gate | this PRD | `tests/a11y/contrast-matrix.test.ts` re-computes ratios from the emitted CSS values independently of the compiler | fail < 4.5 / 3 / 7 |
| Rendered pixels | PRD-19 harness (thresholds here) | text-hidden twin per capture, median backdrop under each text box, ink from computed style + pixel, 8 scenes × engines × modes | `a11y-pixel-contrast.json` CI artifact |
| Browser axe | this PRD | `@axe-core/playwright` with `color-contrast` enabled, per story in each scene | `axe-results.json` artifact |
| Manual | this PRD | screen-reader + touch ledger | release artifact + generated docs |

### 4.8 Keyboard foundation (D-13)

Widget behaviour comes from Base UI (React Aria for `DateField`, `TimeField`, `Calendar`, `DatePicker`, `DateRangePicker`, `TreeView` and Table grid mode, until the alpha coverage check). Owned widgets (`ResizablePanels`, `CarouselRail`, `Thread`, `Composer`, `AppShell` skip link) implement APG directly on the KEEP primitives. This PRD supplies `tests/a11y/apg/harness.ts` and the per-widget key script table (§5.8); flagship PRDs make them pass.

---

## 5. Exact implementation requirements

Each requirement names the test that proves it (§12). "Surface" means any element carrying `data-ag-surface`.

### 5.1 Resolution and floors (D-11)

- **REQ-A11Y-01** `resolveTransparency(input: { os: OsSignals; capability: { backdropFilter: boolean }; app?: TransparencySetting; user?: TransparencySetting; glassOpacity?: number }): 'glass' | 'tinted' | 'solid'` is a pure function in `src/theme/preferences/resolve.ts` implementing §4.2 exactly. It is exhaustively tested over the full cartesian product (2×2×2 OS bools × 2 capability × 4 app × 4 user × glassOpacity {0, 0.69, 0.7, 1}) = 1,024 cases with no case where the result is lower than any floor. Test: `src/theme/preferences/__tests__/resolve.test.ts`.
- **REQ-A11Y-02** `forced-colors: active` yields `solid` and `contrast='more'` in `resolved()` regardless of every other input. There is no API (prop, attribute, store `set`, `compat` adapter, `deprecations` option) that changes this. Test: `resolve.test.ts` "forced colors is absolute"; `tests/a11y/browser/floors.spec.ts` "forced colors ignores data-ag-transparency=glass".
- **REQ-A11Y-03** `resolveContrast` returns `'more'` when `prefers-contrast: more` matches or app/user ask for it; nothing lowers an OS `more`. `prefers-contrast: less` and `custom` map to `'standard'` (documented, no rung). The string `high` appears nowhere in shipped CSS or JS. Test: `resolve.test.ts`; static gate `scripts/ci/verify-a11y-css.mjs` rule `no-prefers-contrast-high`.
- **REQ-A11Y-04** CSS-only floors: with JavaScript disabled, and with `data-ag-transparency="glass"` hard-coded on `<html>`, emulating `forcedColors: 'active'`, `contrast: 'more'` (Playwright `page.emulateMedia`) or `prefers-reduced-transparency: reduce` (Playwright's `emulateMedia` has no reduced-transparency option; Chromium only, via CDP `Emulation.setEmulatedMedia({ features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] })` from `page.context().newCDPSession(page)`) produces the forced, contrast-more and tinted rungs respectively on every Surface (computed-style assertions in §5.2). In WebKit and Gecko the reduced-transparency floor is covered by the user-setting path (`data-ag-transparency="tinted"`), because neither engine fires the query (§2.4). Test: `tests/a11y/browser/floors.spec.ts` "no-js floors" (Playwright `javaScriptEnabled: false`).
- **REQ-A11Y-05** The `ag.a11y` CSS uses **zero** `!important` and no selector with specificity above (0,2,0) except the documented forced-colors pseudo-element selectors at (0,1,1). Gate: `scripts/ci/verify-a11y-css.mjs` rules `no-important`, `max-specificity`.
- **REQ-A11Y-06** Capability floor: when `CSS.supports('(backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))')` is false, every Surface renders the `solid` rung via the `@supports not` block (no JS). Test: `tests/a11y/css/supports-fallback.test.ts` asserts the built `styles.css` contains the `@supports not` block keyed on `[data-ag-surface]` that sets `backdrop-filter: none` on host and `::before`; a browser check runs in a Chromium launch with backdrop-filter disabled if the runner build exposes such a switch. Marked **[verify at alpha]**: the flag's availability.
- **REQ-A11Y-07** `glassOpacity` is clamped to `[0,1]`, written as `--ag-glass-opacity` on the provider root, and used only in the §4.4 tint formula (`max(floor, floor + (1 − floor) × dial)`), so it can never lower alpha below the solved floor. `glassOpacity ≥ 0.7` resolves to at least `tinted`. Test: `resolve.test.ts`; `tests/a11y/browser/rungs.spec.ts` "glassOpacity raises alpha monotonically" (computed `--_ag-alpha` at dial 0, 0.25, 0.5, 0.75, 1 is non-decreasing and ≥ floor).

### 5.2 Rungs in `@layer ag.a11y`

- **REQ-A11Y-08** Source file `src/a11y/css/rungs.css` (NEW) contributes rules only inside `@layer ag.a11y`, keyed on `[data-ag-surface]` and its `::before`/`::after`. No class-name list. The built `styles.css` declares the layer order exactly `ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y`. Gate: `verify-a11y-css.mjs` rules `layer-order`, `a11y-selectors-keyed-on-data-ag-surface`.
- **REQ-A11Y-09** `tinted` rung: computed `--_ag-tint-floor` equals the compiler's `--_ag-tint-floor-tinted` for the cell; `--_ag-refraction-scale` = 0; `::before` `backdrop-filter` is not `none`. Test: `rungs.spec.ts` "tinted".
- **REQ-A11Y-10** `contrast=more` rung: computed `border-top-width` ≥ 1px with `border-style: solid`; `--ag-specular` = 0; `color` equals `--ag-color-on-surface-max`; every text pair in the solved matrix for that cell is ≥7:1; the rendered page differs from the default capture by > 0.5% of pixels inside the largest surface (4.1 baseline: 0.000% on 12/12). Test: `rungs.spec.ts` "contrast more"; pixel diff in `tests/a11y/browser/pixel-modes.spec.ts`.
- **REQ-A11Y-11** `solid` rung: computed `backdrop-filter` and `-webkit-backdrop-filter` on the Surface and its `::before` are `none`; host computed `background-color` equals the resolved `--ag-fallback-fill` with alpha ≥0.85 (architecture §4.7 lightweight fill), and `background-image` is `none`. Test: `rungs.spec.ts` "solid".
- **REQ-A11Y-12** Forced-colors rung: for every element in the document with a non-`none` computed `backdrop-filter` (host or pseudo), the count is **0** under `forcedColors: 'active'` on every story of the T0/T1 set, including Dialog, Sheet, AlertDialog scrims, `AppShell`, `Toast`, `Tooltip` and the material lab (4.1 baseline: modal 10, showcase 12, `liquid-glass-material` 1). Surfaces compute `background-color` = `Canvas`, `color` = `CanvasText`, border colour = `CanvasText`. Test: `tests/a11y/browser/forced-colors.spec.ts` "zero visible backdrop filters" (counter reused from the `runtime-remote.md` run-2 method).
- **REQ-A11Y-13** Disabled surfaces never use host `opacity` (it makes a backdrop root and fades ink). Disabled ink still reaches ≥3:1 for the disabled-label pair (WCAG exempts disabled controls; AuraGlass sets 3:1 as a library floor). Test: `contrast-matrix.test.ts` pair `on-surface-disabled`; `scripts/ci/verify-a11y-css.mjs` rule `no-host-opacity-on-disabled`.
- **REQ-A11Y-14** `clear` without a declared `data-ag-backdrop` renders as `regular` (D-12) and logs one dev warning per surface id; `clear` over `light`/`media` always carries the 0.35 scrim (`--_ag-dim: 0.35`). The contrast matrix includes `clear+scrim` cells. Test: `rungs.spec.ts` "clear fail-safe"; `contrast-matrix.test.ts` "clear cells".

### 5.3 Contrast guarantee (contract consumed by PRD-03, PRD-19)

- **REQ-A11Y-15** Matrix axes: preset (all shipped `ThemePreset`s) × scheme {light, dark} × contrast {standard, more} × transparency {glass, tinted, solid} × variant {regular, clear+scrim, identity, content-raised, content-sunken} × thickness {thin, regular, thick} × declared backdrop {light, dark, media} (the `MaterialSpec.opacityFloor` key; `auto` resolves to light/dark and has no row, matching REQ-DS-15). Each cell is evaluated over **three composites**: white `#ffffff`, black `#000000` and busy. Busy = the 9 sRGB samples `#777777 #ff3b30 #34c759 #0a84ff #ffcc00 #af52de #ff9500 #5ac8fa #8e8e93`, stored in `tokens/contrast/busy-reference.json` (created by PRD-03 DS-033 per SC-18; this PRD fixes the values and A11Y-001 verifies them); a cell's busy result is the minimum over samples, and the cell's `minRatio` is the minimum over all three composites. Blur contributes nothing to the composite. Terminology (SC-28): "backdrop" in this PRD always means the declared `data-ag-backdrop` axis; white/black/busy are "composites", never "backdrops". The machine-readable axes/pairs/thresholds live in `tests/a11y/contrast/matrix-contract.json` (A11Y-002).
- **REQ-A11Y-16** Pairs and thresholds per cell: `on-surface` body ≥4.5:1; `on-surface-muted` ≥4.5:1 for body use and ≥3:1 for large text (≥24px, or ≥18.66px at ≥700 weight) — the token carries `$extensions.ag.usage: "large-only"` if it only reaches 3:1; non-text (`border-strong`, icon, focus bands, control boundaries) ≥3:1; under `contrast=more` every text pair ≥7:1. Ratios are WCAG 2.2 relative luminance in sRGB after OKLCH→sRGB gamut mapping. APCA Lc is emitted alongside as `advisory` and never fails the build.
- **REQ-A11Y-17** The solver emits, per cell, `floorAlpha` (the minimum alpha passing all pairs, searched in 0.005 steps from 0 to 1) and `minRatio`. If no alpha ≤1 passes, the build fails naming the cell and pair. Floors are never hand-written; a CSS literal assigned to `--_ag-tint-floor*` outside generated files fails `verify-a11y-css.mjs` rule `no-handwritten-floor`.
- **REQ-A11Y-18** `tests/a11y/contrast-matrix.test.ts` (NEW) parses built `material.css`/`tokens.css`, independently recomputes every cell with `src/theme/color.ts` (the one kept luminance implementation), and asserts it equals the solver's `minRatio` within 0.01 and meets REQ-A11Y-16. Its own copy of the WCAG formula is forbidden; it imports `color.ts`.
- **REQ-A11Y-19** Rendered-pixel contrast (thresholds for the PRD-19 harness): for each capture, sample every visible text run (no 5-run cap), compute ratio of measured ink against the median backdrop pixel from the text-hidden twin, and take the **worst** sample. Thresholds: body ≥4.5:1, large ≥3:1, `contrast=more` ≥7:1, over the 8 SC-28 scenes {`photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`} (QA-038/039) × {Chromium, WebKit, Gecko} × {light, dark} × {glass, tinted, solid} × {default, contrast more, forced colors} × {1440, 390}. Result artifact `a11y-pixel-contrast.json` with per-sample rows in the `contrastRows` schema already used by `remote-evidence/analysis.json` (`text, color, alpha, bg, ratio, worstRatio, need, fail, storyId, viewport, background, mode`), plus `engine`, `scheme`, `transparency`, `tier`. Gate: 0 rows with `fail: true` for T0/T1 subjects.
- **REQ-A11Y-20** No runtime contrast measurement ships in production code. `getComputedStyle`-driven contrast, canvas sampling and `ResizeObserver`/`MutationObserver` contrast loops are lint-banned outside `src/backdrops/**` (library-owned luminance sampling for `data-ag-backdrop="auto"`, owned by PRD-13, which may only set `data-ag-backdrop` and never ink or opacity). Gate: ESLint rule `auraglass/no-runtime-contrast` (NEW, A11Y-owned per SC-16) added by MODIFY to the existing `eslint-plugin-auraglass.js` (plugin file and `eslint.config.js` wiring owned by PRD-02, PKG-015).

### 5.4 Preference store and hooks

- **REQ-A11Y-21** `usePreference<K>(key: K): PreferenceValue<K>` uses `useSyncExternalStore(store.subscribe(key), () => store.getSnapshot(key), () => store.getServerSnapshot(key))`. Server snapshots: settings → `'system'`, OS booleans → `false`, `glassOpacity` → 0. Without a provider it uses a module-singleton store created lazily on first call (not at import). Test: `src/theme/preferences/__tests__/usePreference.test.tsx` (render, `renderToString`, `hydrateRoot` with zero hydration warnings).
- **REQ-A11Y-22** Exactly one `MediaQueryList` per query string per `window`, shared by every subscriber; `matchMedia` call count after mounting 200 components that call `usePreference('reducedMotionOS')` is 1. Listeners are removed when the subscriber count drops to 0. Test: `usePreference.test.tsx` "shared MQL".
- **REQ-A11Y-23** `store.set` persists through the injected `PreferenceStorage`; invalid persisted JSON is ignored (falls back to `'system'`) without throwing; `localStorage` access that throws (Safari private mode, sandboxed iframes) falls back to memory. Test: `store.test.ts`.

### 5.5 Focus, targets, focus-not-obscured

- **REQ-A11Y-24** One focus implementation (§4.6) in `src/a11y/css/focus.css` (NEW). Tokens `--ag-focus-inner`, `--ag-focus-outer`, `--ag-focus-width: 2px` per scheme. Build check in `contrast-matrix.test.ts` "focus bands": `ratio(inner, outer) ≥ 3`, and for 4,096 sampled sRGB backdrop colours (16 levels per channel) `max(ratio(inner, bg), ratio(outer, bg)) ≥ 3`.
- **REQ-A11Y-25** WCAG 2.4.13 (AAA, adopted as the AuraGlass default): for every focusable part of every T0/T1/T2 story, the focus indicator area is ≥ the 2 CSS px perimeter of the unfocused component and the changed pixels reach ≥3:1 between focused and unfocused states, measured on rendered pixels (focused vs unfocused screenshot diff of the component's box + 4px). Test: `tests/a11y/browser/focus-appearance.spec.ts`.
- **REQ-A11Y-26** Forced colours: focus computes `outline-style: solid`, `outline-width ≥ 2px`, `outline-color: Highlight`. Test: `forced-colors.spec.ts` "focus ring".
- **REQ-A11Y-27** No library CSS sets `outline: none`/`outline: 0` on `:focus-visible`, on `[aria-disabled="true"]`, or globally on element selectors (`button`, `a`, `input`, `[tabindex]`). The 109 `focus:outline-none` strings in `src` are 0. Gate: `verify-a11y-css.mjs` rules `no-outline-none-focus`, `no-global-element-selectors`; `rg -c "focus:outline-none" src` = 0 in `scripts/ci/verify-a11y-css.mjs`.
- **REQ-A11Y-28** WCAG 2.4.11: `TopBar`, `TabBar`, `Toolbar` (when `sticky`), `StatusBar`, `Composer` (sticky), `Table` sticky header and `Sheet` detent chrome write `--ag-scroll-padding-top`/`--ag-scroll-padding-bottom` (their border-box block size + 8px) on the nearest `[data-ag-scroll-container]` (or `<html>`) via one `ResizeObserver` per chrome element, cleaned up on unmount. Test: `tests/a11y/browser/focus-not-obscured.spec.ts` tabs through ≥50 focusables under a sticky `TopBar` + bottom `TabBar` at 1440 and 390 and asserts no focused element's rect is fully covered (intersection area / element area < 1.0) and median coverage = 0.
- **REQ-A11Y-29** Target size: every interactive part computes a hit area ≥24×24 CSS px (WCAG 2.5.8), or meets the 24px-circle spacing exception. Test: `tests/a11y/browser/target-size.spec.ts` uses `elementsFromPoint` on a 24px grid around each target.
- **REQ-A11Y-30** Under `(pointer: coarse)` every interactive part (Button, IconButton, Checkbox, Radio, Switch thumb, Slider thumb, Tab, TabBar item, Menu item, Toast action, Chip remove, Pagination item, `CarouselRail` controls, `MediaControls` buttons) has a ≥44×44 hit area provided by `<span data-ag-part="hit-area" aria-hidden="true">` (deviation 4), with `--ag-target-min: 24px` and `--ag-target-coarse: 44px` from the token group `target`. Hit areas never overlap a sibling's hit area (adjacent controls shrink their hit area toward the midpoint via `inset` clamp). Test: `target-size.spec.ts` "coarse" (Playwright `hasTouch: true`, `isMobile: true` WebKit and Chromium, 390×844).

### 5.6 Provider, portal root, layer stack, announcer

- **REQ-A11Y-31** `AuraGlassProvider` props (§10) are applied as `data-ag-*` attributes plus the single `--ag-glass-opacity` custom property (deviation 7), plus an optional brand `<style>`; it emits no other inline style on any element. Without a provider, all CSS rungs and floors still work (server-layout attributes). Test: `src/theme/__tests__/AuraGlassProvider.test.tsx`; canary page `no-provider` in the Next 16 canary (PRD-19).
- **REQ-A11Y-32** One portal root per document (§4.5). Mounting two providers yields one `[data-ag-portal-root]`. All Base UI portals in AuraGlass components target it through FND's `usePortalContainer()` (FND-007, SC-25). Test: `AuraGlassProvider.test.tsx` "single portal root"; `tests/a11y/browser/layer-stack.spec.ts` asserts `document.querySelectorAll('[data-ag-portal-root]').length === 1` with Dialog + Popover + Tooltip + Toast open.
- **REQ-A11Y-33** Stacked Escape: with Dialog → Popover → Tooltip open, three `Escape` presses close Tooltip, then Popover, then Dialog, each returning focus to its own trigger. There is no `document`-level Escape listener in any component (lint `auraglass/no-document-escape`, NEW in `eslint-plugin-auraglass.js`). Test: `layer-stack.spec.ts` "stacked escape".
- **REQ-A11Y-34** Modal layers: background content (`body > *` except the portal root, plus lower layers) has `inert` while open; scroll is locked once (reference-counted); `role="dialog"`/`alertdialog` with `aria-modal="true"` sits on the panel, never on the backdrop. Test: `layer-stack.spec.ts` "inert background" (Tab never reaches background; `document.activeElement` stays inside the panel for 30 Tab presses).
- **REQ-A11Y-35** Announcer API `useAnnouncer(): { announce(message: string, options?: { politeness?: 'polite' | 'assertive'; id?: string }): void; clear(): void }`. Messages are written to the matching live region; a repeated identical message within 500ms is coalesced; the region text is cleared 7,000ms after the last write; an `id` replaces a pending message with the same id (for streaming). Calling `announce` outside a provider logs one dev warning and no-ops. Test: `src/theme/__tests__/announcer.test.tsx`; SR matrix row "announcer polite/assertive".
- **REQ-A11Y-36** Batching contract for `StreamingText` / `Thread` (consumed by PRD-12): at most one polite announcement per 1,000ms while streaming, and a final full announcement on completion; `Thread` uses `role="log"` and does not also call the announcer for each token. Test: `announcer.test.tsx` "streaming budget" with fake timers (≤ 11 writes for a 10s stream).

### 5.7 `AuraGlassScript` and `GlassPreferencesPanel`

- **REQ-A11Y-37** `AuraGlassScript({ nonce?: string; storageKey?: string = 'ag:prefs:v1'; defaults?: Partial<Settings> })` is a Server Component that emits one inline `<script>` (no `new Function`, no `eval`) that, before first paint, reads persisted settings, evaluates `matchMedia` for the four OS signals and `CSS.supports` for the capability floor, runs the same `resolveTransparency`/`resolveContrast` logic (shared source compiled into the script string at build time), and sets `data-ag-transparency`, `data-ag-contrast`, `data-ag-motion`, `data-ag-scheme`, `data-ag-density` on `<html>` plus `--ag-glass-opacity` as a style property on `<html>` (the only inline style the library writes, deviation 7). The same script implements the D-10 engine/tier contract specified by PRD-04 (`AURAGLASS_MATERIAL_ENGINE_PRD.md` REQ-MAT-54..56): `data-ag-engine` from UA-CH brands then UA string, and `data-ag-tier=lightweight` only for `saveData`, `deviceMemory ≤ 2` with `(pointer: coarse)`, or a persisted/app value. Script ≤1.5 KB **minified** (deviation 8), synchronous in `<head>`. The same compiled body is also exported as the string constant `auraGlassPrepaintScript` from `./theme` for Vite/non-RSC heads (DX REQ-DX-12, SC-23); it is bundled by `scripts/build/build-prepaint-script.mjs` (SC-11). Test: `src/theme/__tests__/AuraGlassScript.test.tsx` (output snapshot, CSP nonce present, minified byte budget, engine/tier attributes for Chromium/WebKit/Gecko/unknown UA fixtures) and `tests/a11y/browser/prepaint.spec.ts` (persisted `solid` → first captured frame after navigation already has `backdrop-filter: none`; no frame with blur; uses `page.route` + `requestAnimationFrame` probe injected via `addInitScript`).
- **REQ-A11Y-38** `GlassPreferencesPanel` (T2, `./theme`, client) renders, in a `<fieldset>`/`<legend>` structure: Transparency `RadioGroup` (System / Glass / Tinted / Solid), Glass opacity `Slider` (0–100%, step 5, `aria-valuetext` like "40% more opaque"), Contrast `RadioGroup` (System / Standard / More), Motion `RadioGroup` (System / Full / Calm / None), and optional Scheme and Density groups (`show?: Array<'transparency'|'glassOpacity'|'contrast'|'motion'|'scheme'|'density'>`). Options below an active floor render `aria-disabled="true"` (still focusable) with an `aria-describedby` note naming the floor ("Your system's Increase Contrast setting requires at least Tinted"). Changes apply immediately through the store and are announced politely ("Transparency set to Tinted"). It is itself built on the flagship `RadioGroup`/`Slider` (PRD-08) and renders through `Surface`. Test: `src/theme/__tests__/GlassPreferencesPanel.test.tsx`; APG scripts for radio group and slider; SR matrix row.
- **REQ-A11Y-39** The panel and store never offer a choice that lowers an OS floor: selecting a disabled option is a no-op, and `store.set('transparency', 'glass')` under `prefers-contrast: more` persists `glass` as the *user* setting but `resolved().transparency` stays `tinted`. Test: `GlassPreferencesPanel.test.tsx` "floor-locked options".

### 5.8 Keyboard / APG conformance (contract; implementation in PRD-07..PRD-14)

- **REQ-A11Y-40** `tests/a11y/apg/harness.ts` (NEW) exports `runApgScript(page, script: ApgScript)` where `ApgScript = { story: string; steps: Array<{ press?: string; type?: string; expect: { focused?: string /* data-ag-part or role+name */; attr?: Record<string,string>; announced?: RegExp; open?: boolean } }> }`. Each script runs in Chromium, WebKit and Gecko. Every interactive T0/T1/T2 component has a script file `tests/a11y/apg/<kebab-component>.apg.spec.ts` (SC-30), **created and owned by the component's PRD** (e.g. Button = CTL-060, Dialog = OVL-053); this PRD owns only the harness, its self-test fixtures and `tests/a11y/apg/coverage.json`. QA's L5 Behaviour lane (QA-082) imports every spec in three engines.
- **REQ-A11Y-41** Minimum key coverage per widget (APG pattern in brackets):

| Component | Foundation | Required keys and semantics |
|---|---|---|
| `Button`, `IconButton` (pressed) [button] | BU Button/Toggle | Enter, Space activate; `aria-pressed` toggles; `IconButton` requires an accessible name (type-level required `aria-label` or `label`) |
| `Toolbar`, `ButtonGroup` [toolbar] | BU Toolbar | one tab stop; Arrow Left/Right (or Up/Down if vertical), Home, End move focus |
| `SegmentedControl` [radio group] | BU ToggleGroup | one tab stop; arrows move **and** select; `role="radiogroup"`/`radio`, `aria-checked` |
| `Switch` [switch] | BU Switch | Space toggles; `role="switch"`, `aria-checked` |
| `Slider` [slider] | BU Slider | Arrow ±step, PageUp/PageDown ±10 steps, Home/End min/max; `aria-orientation` when vertical; `aria-valuetext` (fixes ACCESSIBILITY-08) |
| `Checkbox(Group)`, `RadioGroup` | BU | Space toggles checkbox; radio arrows move+select, one tab stop; `aria-checked="mixed"` for indeterminate |
| `TextField`, `SearchField`, `NumberField` | BU Field/Input/NumberField | label association; `aria-invalid` + `aria-describedby` error; NumberField ArrowUp/Down, PageUp/Down, Home/End; SearchField Escape clears |
| `Select` [select-only combobox] | BU Select | Enter/Space/ArrowDown opens; arrows move active option announced via focus or `aria-activedescendant`; typeahead; Escape closes and restores focus; Tab selects-and-closes per Base UI (fixes ACCESSIBILITY-11) |
| `Combobox` [combobox + listbox] | BU Combobox | focus stays in input; `aria-activedescendant`; Alt+ArrowDown opens; Escape clears then closes |
| `DateField`/`TimeField`/`Calendar`/`DatePicker`/`DateRangePicker` [date grid, spinbutton segments] | RA (+BU Popover) | segments with Up/Down; calendar `role="grid"`, arrows by day, PageUp/Down by month, Shift+Page by year, Home/End week; `aria-selected`; popup `role="dialog"` (fixes ACCESSIBILITY-09) |
| `Dialog`, `AlertDialog`, `Sheet` [dialog (modal)] | BU Dialog | focus moves in on open; Tab cycles inside; Escape closes topmost (REQ-A11Y-33); focus restored; AlertDialog initial focus on least-destructive action |
| `Popover` | BU Popover | Escape closes and restores focus; non-modal (Tab leaves and closes) |
| `Tooltip` [tooltip] | BU Tooltip | opens on focus and hover; Escape dismisses without moving focus; `aria-describedby` on the trigger itself; content hoverable and persistent (WCAG 1.4.13; fixes ACCESSIBILITY-10) |
| `Menu`, `ContextMenu`, `Menubar` [menu, menubar] | BU | one tab stop (roving); arrows; Home/End; typeahead; Right/Left open/close submenus with focus moving into them; Escape closes one level and restores focus; Tab closes the menu (fixes ACCESSIBILITY-12) |
| `Toast` | BU Toast | region landmark; F6 or documented hotkey moves focus to region; actions reachable; no auto-dismiss under 5s while focused/hovered (2.2.1) |
| `Tabs`, `TabBar` [tabs] | BU Tabs | one tab stop; orientation-aware arrows; Home/End; automatic vs manual activation; ids from `useId` (no collisions); no `role="navigation"` wrapper (fixes ACCESSIBILITY-13) |
| `Accordion` (T2) [accordion] | BU Collapsible / Accordion | heading + `button` with `aria-expanded`/`aria-controls`; no tab roles (fixes ACCESSIBILITY-13) |
| `CommandPalette` [combobox in dialog] | BU Combobox in Dialog | as Combobox + Dialog; result count announced politely (fixes ACCESSIBILITY-18) |
| `TreeView` [tree] | RA Tree (alpha check) | one tab stop; Up/Down, Right expands/enters, Left collapses/parent, Home/End, typeahead, `*` expands siblings; `aria-level`/`aria-setsize`/`aria-posinset` |
| `Table` (default) [table] / grid mode [grid] | TanStack + (RA grid) | sortable `columnheader` buttons with `aria-sort`; grid mode arrows by cell, Home/End row, Ctrl+Home/End; row reorder via keyboard if drag is enabled (no `aria-grabbed`) |
| `ResizablePanels` [window splitter] | Own | `role="separator"`, `aria-valuenow/min/max`, `aria-controls`; arrows resize, Home/End collapse/expand, Enter toggles |
| `CarouselRail` [carousel] | Own | previous/next buttons; slides `role="group"` `aria-roledescription="slide"`; no auto-rotation unless `allowContinuous` and a pause control is first in Tab order |
| `AppShell` skip link | Own | first Tab stop "Skip to main content" → focuses `<main tabindex="-1">` |

- **REQ-A11Y-42** Browser axe: `tests/a11y/browser/axe.spec.ts` runs `@axe-core/playwright` (exact-pinned devDependency, NEW) with rules `color-contrast` and `color-contrast-enhanced` (the latter only under `contrast=more`) **enabled**, at two coverage levels: (a) **per PR**, the QA L5 Behaviour coverage defined in `AURAGLASS_QA_CERTIFICATION_PRD.md` REQ-QA-18 (every subject-state, `photo` and `flat-white` scenes, light and dark, Chromium/WebKit/Gecko); (b) **on `main` nightly and on every RC/GA SHA** (QA job in `certify-main.yml`/`certify-release.yml`, open item OI-03), every T0/T1/T2 story in all 8 scenes, Chromium and WebKit. Gate: 0 violations of impact `serious` or `critical`; `moderate` fails for T1 flagships (REQ-QA-18) and is reported and ratcheted for T2. jsdom `jest-axe` tests remain allowed for structure only and may not be cited as contrast evidence.

### 5.9 Screen readers, zoom, colour vision

- **REQ-A11Y-43** Screen-reader matrix, required for every T1 flagship (GA blocker) and sampled for T2 (one representative per family):

| Cell | AT | Browser / OS | Level |
|---|---|---|---|
| SR-1 | VoiceOver | Safari 26+ / macOS 26 | required |
| SR-2 | VoiceOver | Safari / iOS 26 (physical device) | required |
| SR-3 | NVDA 2026.x | Chrome stable / Windows 11 | required |
| SR-4 | TalkBack | Chrome / Android 15+ (physical device) | required |
| SR-5 | NVDA | Firefox ESR / Windows 11 | verified (non-blocking) |
| SR-6 | JAWS 2026 | Chrome / Windows 11 | verified (non-blocking) |

Each cell records, per flagship script: name/role/value announced on focus, state change announced, open/close announced, live-region output, and pass/fail with AT + browser versions. Records follow `tests/a11y/manual/sr-record.schema.json` (NEW) and are uploaded as the release artifact `a11y-manual-<sha>.json`; the docs page is generated from it (D-32). Issue #16 closes only when SR-1..SR-4 and the physical touch pass (REQ-A11Y-44) are recorded for all 44 flagships on the RC SHA.
- **REQ-A11Y-44** Physical touch pass: iOS Safari and Android Chrome devices, each flagship's states operated by touch, including Sheet detent drag with a non-drag alternative (WCAG 2.5.7: detents reachable by a button), Slider thumb, CarouselRail swipe with buttons, and VoiceOver/TalkBack swipe navigation. Recorded in the same artifact.
- **REQ-A11Y-45** Zoom and reflow: at 1280×800 with page zoom 200% (WCAG 1.4.4) no text is clipped or overlapped; at 320×256 CSS px equivalent (400%, 1.4.10) no two-dimensional scrolling except inside `Table`, `CodeSurface` registry items and `ImageViewer` canvas (documented exemptions); overlays fit within the viewport with internal scroll; sticky chrome total height ≤ 50% of the viewport height at 320×256 (the AppShell collapses `TopBar`/`TabBar` to a single bar). Text-spacing override (1.4.12: line-height 1.5, paragraph 2em, letter 0.12em, word 0.16em) causes no loss of content. Test: `tests/a11y/browser/zoom-reflow.spec.ts` (zoom is simulated per the WCAG reflow technique by resizing the CSS viewport: 200% at 1280×800 = viewport 640×400 with `deviceScaleFactor: 2`; 400% = viewport 320×256 (portrait reflow also checked at 320×640) with `deviceScaleFactor: 4`. `deviceScaleFactor` only preserves raster fidelity; it does not change CSS px. `document.documentElement.style.zoom` is **not** used), `text-spacing.spec.ts` (injects the 1.4.12 bookmarklet values as an unlayered stylesheet and asserts every text node's `scrollWidth ≤ clientWidth` and `scrollHeight ≤ clientHeight` of its clipping ancestor).
- **REQ-A11Y-46** Colour independence (1.4.1) and colour-vision variance: every intent/status (danger, warning, success, info, selected, current, invalid) carries a non-colour cue (icon with accessible name, text, shape, or `aria-*` state with a visible marker). Test: `tests/a11y/browser/color-vision.spec.ts` renders the intent matrix and `FilterBar`/`Tabs`/`Table` selection states through Machado-2009 protanopia, deuteranopia and tritanopia matrices (severity 1.0) applied to captured pixels, and asserts for each intent pair either ΔE2000 ≥ 10 under every simulation **or** the presence of the registered non-colour cue (`data-ag-part="intent-icon"` or text). Focus ring luminance contrast (REQ-A11Y-24) is colour-independent by construction. No "colour-blind mode" is shipped; 4.x `data-color-blindness` is removed.

### 5.10 Removal and honesty

- **REQ-A11Y-47** Removed from `aura-glass` 5.0 (C-D in 4.2, C-B in 5.0; executed by PRD-16 as one revertable PR per family): see §9. Each has a `deprecations.json` entry with replacement and codemod id, and a dev warning in 4.2 at call time.
- **REQ-A11Y-48** 4.1.1 honesty fix (executed by PRD-00): `ContrastGuard` and `validateTextContrast` return/report `"unverified"`; `data-meets-wcag` and the "AA" indicator are not emitted. 4.2 (D-28, executed by PRD-17): every `prefers-contrast: high` becomes `more` and the invalid nested `forced-colors: active;` declaration in `theme-transitions.css:51-53` is removed, as labelled visual bug fixes with before/after composites.
- **REQ-A11Y-49** No README, `llms.txt`, Storybook or release-note claim about accessibility (WCAG level, contrast minimum, SR coverage, reduced-transparency support) may appear unless rendered from the GA run's artifacts (`contrast-matrix.json`, `a11y-pixel-contrast.json`, `axe-results.json`, `a11y-manual-<sha>.json`). Gate: PRD-20 docs lint `no-unsourced-claim`.
- **REQ-A11Y-50** Icons are decorative (`aria-hidden="true"`) unless `aria-label`/`title`/`label` is provided, in which case they are `role="img"` with the name (HOOKS-UTILS-TYPES-07). Implementation PRD-07 FND-048; test `src/icons/__tests__/icon-a11y.test.tsx` is FND-049, which A11Y-060 extends with the `label` prop case (no separate A11Y test file).

---

## 6. Files and directories affected (existing paths)

All confirmed present at HEAD `15b6de6f7`.

| Path | Change | Owner of the edit |
|---|---|---|
| `src/styles/glass.css` (`:78-100`, `:549-552`, `:572-574`, `:2905-2934`, `:4022-4123`, `:4236-4250`) | 4.2: `high`→`more` at `:4055`; forced-colors selector list extended with `.liquid-glass-material` and overlay classes (C-I). 5.0: file removed from `styles.css`; the `:4022-4123` fallback logic is re-expressed in `src/a11y/css/rungs.css` | PRD-17 (4.2), this PRD (5.0 rungs) |
| `src/styles/premium-typography.css` (`:113-116`, `:237`) | remove `[class*="glass-"] … !important` ink pin and `high` query | PRD-17 / PRD-16 |
| `src/styles/theme-transitions.css` (`:51-53`) | delete invalid nested `forced-colors: active;` | PRD-17 |
| `src/styles/animations.css` (`:550`) | `high`→`more` (4.2) | PRD-17 |
| `src/styles/tokens.css` (`:363`), `src/styles/design-tokens.css` (`:46`) | values migrate to DTCG `target.{min,coarse}`, `sys.color.focus-{inner,outer}`; files leave 5.0 `styles.css` | PRD-03 |
| `src/theme/color.ts` | **kept** as the single luminance/contrast implementation; gains `wcagContrast`, `compositeOver`, `oklchToSrgb` (gamut-mapped), `apcaLc`, `deltaE2000` | PRD-03 DS-055 (test DS-056); this PRD verifies (A11Y-003, A11Y-006) |
| `src/theme/contrast.ts` | deleted (re-export of `color.ts` until then) | PRD-03 DS-109; verified by A11Y-004 |
| `src/utils/contrast.ts` | luminance copy (`:77-89`) folded onto `color.ts`; deleted | this PRD (A11Y-005) |
| `src/theme/index.ts` | exports `AuraGlassProvider`, `AuraGlassScript`, `usePreference`, `useAnnouncer`, `GlassPreferencesPanel` | this PRD |
| `src/theme/GlassThemeProvider.tsx`, `src/theme/GlassContext.tsx` | become thin 4.x wrappers over `AuraGlassProvider` in 4.2 (C-D); removed from root in 5.0, kept in `compat` | PRD-17, PRD-18 |
| `src/primitives/FocusScope.tsx` | KEEP; used by owned widgets only; Base UI handles flagship focus | PRD-07 |
| `src/primitives/Portal.tsx`, `src/primitives/portal/` | default container = `usePortalContainer()` → provider portal root (REQ-A11Y-32) | PRD-07 FND-031 (KEEP primitive, SC-26); requirement and test here (A11Y-052) |
| `src/primitives/DismissableLayer.tsx`, `src/primitives/dismissable-layer/` | registers with `LayerStack` via `useLayer`; drops its own document Escape | PRD-07 FND-035 (SC-26); requirement and test here (A11Y-053) |
| `src/primitives/RovingFocusGroup.tsx`, `src/primitives/roving-focus/` | internal only; re-export shim removed | PRD-07 |
| `src/primitives/index.ts` | exports `VisuallyHidden` (NEW file) | PRD-07 FND-039 (SC-26) |
| `src/hooks/useLiquidGlassBackdrop.ts` (`:117-170`) | sampler moves to `src/backdrops/` for `data-ag-backdrop="auto"` only; ink/opacity writes removed | PRD-13 |
| `src/primitives/LiquidGlassMaterial.tsx` (`:264-270`, `:326-332`, `:513-514`) | 4.1.1: stop `opacity` contrast "fix"; 5.0: replaced by `Surface` | PRD-00, PRD-04 |
| `src/tokens/glass.ts` (`:931`, `:1344`, `:1349`, `:1521`, `:1631`) | `validateTextContrast`, `validateLiquidContrast`, `sampleBackdropLuminance` deleted | PRD-16 |
| `src/index.ts` (`:381-383`, `:497`, `:498`, `:629`, `:630`, `:636`, `:1227`) | remove a11y fakes from root exports (5.0) | PRD-16 |
| `src/components/accessibility/index.ts` | becomes empty and is deleted | PRD-16 |
| `.storybook/StorySurface.tsx` (`:85-96`) | opaque stage replaced by the 8-scene `environment` global (§15.4) | PRD-19 |
| `.storybook/preview.tsx` | globals and the single `AuraGlassProvider` decorator are owned by `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` §4.2 / REQ-SB-01, REQ-SB-06; this PRD supplies only the required preference globals and their mapping (§13) and the `@storybook/addon-a11y` `color-contrast` requirement | Storybook PRD (edit), this PRD (contract) |
| `tests/visual/accessibility/a11y-visual.spec.ts`, `tests/visual/accessibility/contrast.spec.ts` | reused as seeds for `forced-colors.spec.ts` and the computed-style precheck; then retired | this PRD |
| `src/__tests__/glass-contrast.spec.ts` | deleted (own WCAG copy, fixed dark backdrop) — replaced by `tests/a11y/contrast-matrix.test.ts` | this PRD |
| `scripts/storybook-exhaustive-qa.js` (`:390`, `:687`) | contrast probe superseded by REQ-A11Y-19 harness | PRD-19 |
| `eslint-plugin-auraglass.js`, `eslint.config.js` | new rules `no-runtime-contrast`, `no-document-escape`, `no-outline-none-focus` (TSX class strings) | this PRD |
| `package.json` (`:416`, `:431`, `:466`) | add `@axe-core/playwright` (devDependency, exact pin); remove unused `@axe-core/react` | this PRD |
| `reports/a11y_summary.md`, `reports/FOCUS_MANAGEMENT_SUMMARY.md`, `reports/focus-management-report.json`, `reports/contrastguard-integration-report.json`, `reports/aria-*-report.json` | removed from the tree (no history rewrite) | PRD-00 |
| `reports/3.2-release/accessibility-certification.md`, `reports/3.3-release/accessibility-certification.md` | kept as historical ledgers; superseded by generated SR matrix | — |

---

## 7. Components affected

| Group | Components | Impact |
|---|---|---|
| T0 | `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`, `ConcentricFrame`, `Backdrop`, `Icon`, `VisuallyHidden`, `Portal`, `Slot`, `AuraGlassProvider`, `AuraGlassScript`, `usePreference` | carry `data-ag-surface` / portal into provider root; rungs apply; first lane to go green (exit criterion) |
| T1 controls (1–14) | `Button`, `IconButton`, `ButtonGroup`/`Toolbar`, `SegmentedControl`, `Switch`, `Slider`, `Checkbox(Group)`, `RadioGroup`, `TextField`, `SearchField`, `Select`, `Combobox`, `NumberField`, `DateField`/`TimeField`/`DatePicker`/`DateRangePicker` | focus ring, hit area, APG scripts, SR matrix |
| T1 overlays (15–21) | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `Menu`/`ContextMenu`/`Menubar`, `Toast` | layer stack, stacked Escape, `inert`, scrim forced-colors coverage, announcer (Toast) |
| T1 navigation (22–31) | `AppShell`, `Sidebar`, `TopBar`, `Tabs`, `TabBar`, `Breadcrumbs`, `Pagination`, `CommandPalette`, `ResizablePanels`, `SourceTransition` | scroll-padding writers (TopBar, TabBar, StatusBar), skip link, zoom/reflow collapse |
| T1 data (32–37) | `Table`, `TreeView`, `FilterBar`, `StatCard`, `Sparkline`+`ChartFrame`, `Timeline`/`ActivityFeed` | sticky header scroll padding, grid/tree APG, colour-independent status, `ChartFrame` a11y table fallback |
| T1 AI (38–42) | `Thread`, `Message`/`StreamingText`, `Composer`, `ToolCall`, `SourceList`/`Citation` | `role="log"`, announcer batching (REQ-A11Y-36), Composer sticky scroll padding |
| T1 media (43–44) | `MediaControls`/`NowPlayingBar`, `CarouselRail` | `clear`+scrim cells, coarse hit areas, carousel pause control |
| T2 | `Accordion`, `Collapsible`, `Progress`, `Meter`, `Rating`, `InlineEdit`, `ColorPicker`, `FileUpload`, `Tour`, **`GlassPreferencesPanel`**, others in §11.1 | reduced matrix; APG scripts where interactive |
| 4.x (bridge only) | `GlassButton`, `GlassModal`, `GlassDialog`, `GlassSlider`, `GlassDatePicker`, `GlassTooltip`, `GlassSelect`, `GlassMenubar`, `GlassContextMenu`, `GlassAccordion`, `GlassTabs`, `TreeItem`, `GlassCommandPalette`, `LiquidGlassMaterial`, `GlassDataGrid`, `HStack` | 4.1.1/4.2 honesty and CSS fixes only; no behavioural rewrite on 4.x (D-19) |

---

## 8. New components and files

| Path (NEW) | Kind | Purpose |
|---|---|---|
| `src/a11y/css/rungs.css` | CSS (`@layer ag.a11y`) | transparency/contrast/forced-colors/capability rungs (§4.2–4.3) |
| `src/a11y/css/focus.css` | CSS | two-tone ring, forced-colors ring (REQ-A11Y-24..27) |
| `src/a11y/css/targets.css` | CSS | `[data-ag-part="hit-area"]` sizing, `(pointer: coarse)` (REQ-A11Y-29..30) |
| `src/a11y/css/scroll-padding.css` | CSS | `[data-ag-scroll-container]` scroll padding (REQ-A11Y-28) and the `[data-ag-scroll-locked]` rule used by `LayerStack` |
| `src/a11y/useStickyScrollPadding.ts` | hook (client) | ResizeObserver writer for sticky chrome |
| `src/a11y/HitArea.tsx` | internal component | `<span data-ag-part="hit-area" aria-hidden>` |
| ~~`src/primitives/VisuallyHidden.tsx`~~ | — | **not created here**: FND-038 creates it and `src/primitives/VisuallyHidden.css` (`.ag-visually-hidden`, `@layer ag.components`), replacing `ScreenReaderOnly`/`glass-sr-only` (SC-26); A11Y-056 tests it |
| `src/theme/AuraGlassProvider.tsx` | T0 (client) | settings, store, portal root, layer stack, announcer, toast region |
| `src/theme/AuraGlassScript.tsx` | T0 (server) | pre-paint resolver script |
| `src/theme/preferences/store.ts`, `resolve.ts`, `storage.ts`, `media.ts` | runtime | store, pure resolver, storage adapters, shared MQL registry |
| `src/theme/preferences/usePreference.ts` | T0 hook | `useSyncExternalStore` hook |
| `src/theme/layers/LayerStack.ts`, `useLayer.ts` | internal | stacked Escape, `inert`, scroll-lock refcount |
| `src/theme/announcer/Announcer.tsx`, `useAnnouncer.ts` | T0 | the one live-region implementation |
| `src/theme/GlassPreferencesPanel.tsx` | T2 (client) | end-user preference UI |
| ~~`tokens/contrast/busy-reference.json`~~ | data | **not created here**: DS-033 creates it (SC-18); values fixed by REQ-A11Y-15, verified by A11Y-001 |
| `tests/a11y/contrast/matrix-contract.json` | data | matrix axes, pairs, thresholds (REQ-A11Y-15..17), read by DS-057 and `tests/a11y/contrast-matrix.test.ts` |
| `scripts/build/build-prepaint-script.mjs` | build | compiles `resolve.ts` into the `AuraGlassScript` / `auraGlassPrepaintScript` body (SC-11) |
| `scripts/ci/verify-a11y-css.mjs` | CI gate | static CSS/TSX rules named in §5 |
| `tests/a11y/contrast-matrix.test.ts` | unit | independent recompute of the solved matrix |
| `tests/a11y/apg/harness.ts`, `tests/a11y/apg/coverage.json`, `tests/a11y/apg/__selftest__/*.selftest.spec.ts` | Playwright | APG harness, coverage manifest and self-test fixtures; per-widget `tests/a11y/apg/<kebab>.apg.spec.ts` are created by the component PRDs (SC-30) |
| `tests/a11y/browser/*.spec.ts` | Playwright | floors, rungs, forced colors, pixel modes, focus, targets, layer stack, prepaint, axe, zoom, colour vision |
| `tests/a11y/manual/sr-record.schema.json`, `tests/a11y/manual/scripts/<component>.md` | manual protocol | SR/touch scripts and record schema |

| `src/a11y/stories/*.stories.tsx`, `src/theme/GlassPreferencesPanel.stories.tsx` | Storybook | §13 stories (co-located under `src/`, matching the current `.storybook/main.ts` globs) |

Name note: `GlassPreferencesPanel` keeps the `Glass` prefix because §3.2 and §11.1 name it that way; it is the only prefixed 5.0 export and is listed as an intentional exception in the naming manifest. If the owner prefers `PreferencesPanel` (D-14), it is a mechanical rename before RC with no other impact.

---

## 9. Components and files to remove or deprecate

All are C-D in 4.2 (`deprecations.json` + call-time dev warning) and C-B in 5.0, executed by PRD-16 with one revertable PR per family. None are re-exported from `compat` (removed components are not in `compat`, §14.3), except where noted.

| Remove | Path | Replacement | Codemod |
|---|---|---|---|
| `ContrastGuard`, `TextWithContrast`, `HighContrastText`, `useContrastGuard` | `src/components/accessibility/ContrastGuard.tsx`, `src/utils/contrastGuard.ts` | material legibility contract (none needed at call site) | `removed`: unwraps `<ContrastGuard as=X>` to `<X>` (children preserved), drops the import |
| `useAutoTextContrast` | `src/hooks/useAutoTextContrast.ts` | `--ag-on-surface` tokens | `removed` TODO |
| `validateTextContrast`, `validateLiquidContrast`, `sampleBackdropLuminance` | `src/tokens/glass.ts:931,1631,1521` | `contrast-matrix.json` (build), `Backdrop` auto (PRD-13) | `removed` TODO |
| `GlassA11y` (+ `GlassHighContrast`, `GlassMotionControls`, `GlassScreenReader`, `GlassKeyboardNav`) | `src/components/accessibility/GlassA11y.tsx` | `GlassPreferencesPanel` | `removed` → pointer |
| `GlassFocusIndicators` (+ `SkipLinks`, `LandmarkAnnouncer`, `KeyboardShortcutsHelper`) and `GlassFocusIndicators.css` | `src/components/accessibility/GlassFocusIndicators.tsx`, `.css` | `focus.css`, `AppShell.SkipLink`, `useAnnouncer` | `removed` |
| `GlassA11yAuditor` | `src/components/interactive/GlassA11yAuditor.tsx` | browser axe in CI; `@auraglass/cli audit` (PRD-18) | `removed` |
| `GlassFocusRing` (+ module CSS), `FocusIndicator` | `src/components/interactive/GlassFocusRing.tsx`, `GlassFocusRing.module.css`, `src/components/visual-feedback/FocusIndicator.tsx` | built-in ring | `removed` (unwrap) |
| `AccessibilityProvider`, `useAccessibility` | `src/components/accessibility/AccessibilityProvider.tsx` | `AuraGlassProvider`, `usePreference` | `providers` (full); `compat` adapter maps `highContrast`→`contrast="more"`, `reducedTransparency`→`transparency="tinted"`, drops `colorBlindness` with a warning |
| `useAccessibilitySettings`, `useAccessibility` (hook file) | `src/hooks/useAccessibilitySettings.ts`, `src/hooks/useAccessibility.ts` | `usePreference` | `providers` |
| `FocusTrap`, `useFocusTrap`, `trapFocus`, a11yEnhancers `FocusTrap` | `src/primitives/focus/FocusTrap.tsx`, `src/utils/focus.ts:48`, `src/utils/a11yEnhancers.tsx:179` | Base UI focus management; `FocusScope` for owned widgets | `canonical-names` → `FocusScope` |
| `ScreenReader`, `ScreenReaderOnly`, `LiveRegion`, `announce`, `useAnnounce`, `announceToScreenReader` ×2, a11yHooks/a11yEnhancers live regions | `src/primitives/focus/ScreenReader.tsx`, `src/utils/focus.ts:286`, `src/utils/a11y.ts:834`, `src/utils/a11yHooks.ts:299`, `src/utils/a11yEnhancers.tsx:573` | `VisuallyHidden`, `useAnnouncer` | `canonical-names` (mechanical for `ScreenReaderOnly`, `useAnnounce`) |
| `SkipLinks` (primitives) | `src/primitives/focus/SkipLinks.tsx` | `AppShell.SkipLink` | partial |
| `ReducedMotionProvider`, `MotionPreferenceContext`, `useReducedMotion` ×2, `useMotionPreference` | `src/primitives/motion/ReducedMotionProvider.tsx`, `src/contexts/MotionPreferenceContext.tsx`, `src/hooks/useReducedMotion.ts(x)`, `src/hooks/useMotionPreference.ts` | `usePreference('motion')` (PRD-06 owns motion semantics) | `providers` |
| `a11yTesting.ts` helpers that compute contrast | `src/utils/a11yTesting.ts` | test helpers in `tests/a11y/` | none (internal) |
| CSS classes `glass-contrast-guard`, `glass-focus`, `glass-touch-target`, `.high-contrast`, `.large-text`, `data-color-blindness` | `src/styles/glass.css` etc.; 436–577 class-triple occurrences | data-attribute contract | `removed` strips the class triple from consumer JSX |
| Every `prefers-contrast: high` | 16–17 sites (§2.4) | `more` | — (internal, 4.2) |
| Report files (§6) | `reports/*` | generated artifacts | — |

---

## 10. API changes

| API | Change | Class | Release |
|---|---|---|---|
| `AuraGlassProvider` props `transparency?: 'system'\|'glass'\|'tinted'\|'solid'` (default `'system'`), `glassOpacity?: number` (0..1, default 0), `contrast?: 'system'\|'standard'\|'more'`, `motion?: 'system'\|'full'\|'calm'\|'none'`, `scheme?`, `density?`, `storage?: PreferenceStorage \| false`, `storageKey?: string`, `legacyStorageKey?: string` (4.x migration, default `'aura-glass-accessibility-settings'`), `portalContainer?: HTMLElement`, `deprecations?: 'warn'\|'silent'` | new provider | C-E (4.2 experimental under `aura-glass/theme`), stable 5.0 | 4.2 / 5.0 |
| `AuraGlassScript({ nonce, storageKey, defaults })` | new server component | C-E | 4.2 / 5.0 |
| `usePreference(key)`; `useResolvedPreferences(): ResolvedPreferences`; `setPreference(key, value)` via `usePreferenceActions()` | new | C-E | 5.0 (4.2 experimental) |
| `useAnnouncer()` | new | C-E | 5.0 |
| `GlassPreferencesPanel` props `show?`, `onChange?(key, value)`, `labels?` (i18n strings) | new T2 | C-E | 5.0 |
| `auraGlassPrepaintScript` (string constant, same compiled body as `AuraGlassScript`, for Vite/non-RSC `<head>`) | new export in `./theme` (SC-23, DX REQ-DX-12) | C-E | 5.0 (4.2 experimental) |
| `AuraGlassProvider` props `toasts?: boolean`, `tooltips?: boolean` (default `true`; opt out of the toast region / transient root) | new | C-E | 5.0 |
| `VisuallyHidden` (`render?`) | new T0 in `./primitives`, **owned by PRD-07 (FND-038)**; listed for the a11y contract | C-E | 5.0 |
| CSS: `data-ag-transparency`, `data-ag-contrast` on any ancestor; `--ag-glass-opacity`, `--ag-focus-inner/outer/width`, `--ag-target-min/coarse`, `--ag-scroll-padding-top/bottom`; `data-ag-scroll-container`; `data-ag-part="hit-area"` | public contract | C-E | 5.0 |
| OS floors cannot be lowered by app/user (B13) | behaviour | **C-B** (behaviour fix, D-11) | 5.0 |
| `prefers-contrast: high` → `more` in 4.x CSS | visual bug fix | C-I (labelled visual fix, D-28) | 4.2 |
| `ContrastGuard` reports `"unverified"`, no `data-meets-wcag` | honesty fix | C-I | 4.1.1 |
| Forced-colors selector list extended to `.liquid-glass-material` + overlays on 4.x | visual bug fix | C-I (D-28 process) | 4.2 |
| Removals in §9 | removal | C-D 4.2 → C-B 5.0 | 4.2 / 5.0 |
| `AccessibilityProvider` / `GlassThemeProvider` → wrappers over `AuraGlassProvider` | deprecation | C-D | 4.2 |
| Global focus CSS (`GlassFocusIndicators.css` element selectors) no longer imported | removal | C-B | 5.0 (C-D notice 4.2) |
| Focus ring appearance changes on every component | visual | C-B (5.0 only) | 5.0 |

---

## 11. Migration concerns

1. **Apps that forced glass on.** Apps passing `forceGlass`, setting `respectMotionPreference={false}`, or overriding fallbacks will see tinted/solid surfaces for users with OS floors. There is no opt-out by design (B13). Release notes say so first; `doctor --v5` flags these props.
2. **Visual change for users of the Reduce Transparency setting on Safari/Firefox.** Nothing changes until the product exposes `GlassPreferencesPanel` or sets `transparency`. Docs recommend shipping the panel or the registry Settings block.
3. **Global focus CSS removal.** 4.x apps that relied on `GlassFocusIndicators.css` styling their own `button`/`a` focus will lose it. `compat/globals.css` (D-18) does **not** restore it (it was a defect, ACCESSIBILITY-14). `doctor` reports reliance by grepping for the import.
4. **ContrastGuard wrappers.** 276 JSX uses in 68 library files plus unknown consumer uses. The codemod unwraps; `as` props become the element; `autoAdjust`/`minContrast` props are dropped silently (they never worked).
5. **Tests that targeted internal ARIA.** Base UI changes roles and ids (B10). Consumers' tests should use `data-ag-part`/`data-state` and accessible roles/names; selector tables per component are published (PRD-20).
6. **Persisted preferences.** 4.x `useAccessibilitySettings` stored keys are not migrated automatically; `AuraGlassProvider` reads the 4.x key once if present (`aura-glass-accessibility-settings`, the `AccessibilityProvider` default at `src/components/accessibility/AccessibilityProvider.tsx:67`; custom `storageKey` values are passed via `storageKey` migration option `legacyStorageKey`), maps `highContrast`→`contrast:'more'` and `reducedTransparency`→`transparency:'tinted'`, and writes `ag:prefs:v1`.
7. **CSP.** `AuraGlassScript` needs the app's nonce. Without a nonce under strict CSP, the script is blocked and the CSS-only path still enforces floors; only user choices apply after hydration (one possible flash). Documented.
8. **Portal root placement.** Apps that render overlays into custom containers keep `portalContainer`; the layer stack still governs Escape and `inert`.
9. **4.x LTS.** 4.x keeps its own focus systems; only the C-I CSS fixes land there. No Base UI behaviour reaches 4.x (D-19).

---

## 12. Tests required

All browser tests run in the remote lanes (CI or gated remote runners), never in a local browser. Unit tests run in Jest/Vitest per PRD-02.

### 12.1 Unit and SSR (jsdom / Node)

| Test file (NEW unless noted) | Asserts |
|---|---|
| `src/theme/preferences/__tests__/resolve.test.ts` | 1,024-case cartesian product never below any floor; forced colors absolute; `glassOpacity` 0.69→glass, 0.7→tinted; `less`/`custom`→standard (REQ-A11Y-01..03, 07) |
| `src/theme/preferences/__tests__/store.test.ts` | persistence round-trip; corrupt JSON ignored; throwing storage falls back to memory; `set` below floor keeps user value but resolved stays at floor (REQ-A11Y-23, 39) |
| `src/theme/preferences/__tests__/usePreference.test.tsx` | `renderToString` uses server snapshot; `hydrateRoot` emits 0 warnings; 1 `matchMedia` call for 200 subscribers; listeners removed at 0 subscribers (REQ-A11Y-21, 22) |
| `src/theme/__tests__/AuraGlassProvider.test.tsx` | writes only `data-ag-*` + `--ag-glass-opacity`; single portal root with nested providers; legacy key migration; `deprecations="silent"` (REQ-A11Y-31, 32) |
| `src/theme/__tests__/AuraGlassScript.test.tsx` | output contains `nonce`; no `new Function`/`eval`; ≤1.5 KB minified; running the emitted script in jsdom with mocked `matchMedia`/`navigator.userAgentData` sets the expected preference, engine and tier attributes (REQ-A11Y-37; REQ-MAT-54..55) |
| `src/theme/__tests__/announcer.test.tsx` | polite/assertive routing; 500ms coalescing; 7,000ms clear; `id` replacement; ≤11 writes for a 10s stream; no-op + 1 warning without provider (REQ-A11Y-35, 36) |
| `src/theme/__tests__/GlassPreferencesPanel.test.tsx` | fieldset/legend names; floor-locked options `aria-disabled` + description; change announced; `show` filtering (REQ-A11Y-38, 39) |
| `src/icons/__tests__/icon-a11y.test.tsx` (FND-049, extended by A11Y-060) | unnamed icon `aria-hidden`; named icon `role="img"` + name (REQ-A11Y-50) |
| `tests/a11y/contrast-matrix.test.ts` | independent recompute of every cell from built CSS with `src/theme/color.ts`; thresholds 4.5/3/7; focus bands over 4,096 colours; `clear` cells include scrim; disabled pair ≥3:1 (REQ-A11Y-13..18, 24) |
| `tests/a11y/css/supports-fallback.test.ts` | built `styles.css` contains the `@supports not` solid block keyed on `[data-ag-surface]` (REQ-A11Y-06) |
| `scripts/ci/verify-a11y-css.mjs` (gate, run as a test) | `layer-order`, `no-important`, `max-specificity`, `no-prefers-contrast-high`, `no-handwritten-floor`, `no-outline-none-focus`, `no-global-element-selectors`, `no-host-opacity-on-disabled`, `a11y-selectors-keyed-on-data-ag-surface`, `rg "focus:outline-none" src` = 0 |
| ESLint fixtures for `auraglass/no-runtime-contrast`, `auraglass/no-document-escape` | rule fires on banned patterns; passes on allowed `src/backdrops/**` |

### 12.2 Browser (Playwright, Chromium + WebKit + Gecko unless noted)

| Test file (NEW) | Asserts |
|---|---|
| `tests/a11y/browser/floors.spec.ts` | JS on and off: emulated forced colors / contrast more / reduced transparency (Chromium) give forced / contrast-more / tinted rungs even with `data-ag-transparency="glass"` on `<html>` and `transparency="glass"` on the provider (REQ-A11Y-02, 04) |
| `tests/a11y/browser/rungs.spec.ts` | computed values per rung (REQ-A11Y-09..11, 14); `glassOpacity` monotonic (REQ-A11Y-07) |
| `tests/a11y/browser/forced-colors.spec.ts` | 0 non-`none` `backdrop-filter` (host + pseudos) on every T0/T1 story incl. scrims; `Canvas`/`CanvasText`; focus `Highlight` (REQ-A11Y-12, 26). Chromium only (emulation); Gecko via `forced-colors` pref where the runner supports it **[verify]** |
| `tests/a11y/browser/pixel-modes.spec.ts` | `contrast more` changes >0.5% of pixels inside the largest surface on every story (4.1: 0.000% on 12/12) (REQ-A11Y-10) |
| `tests/a11y/browser/focus-appearance.spec.ts` | 2.4.13 area and 3:1 change on rendered pixels for every focusable part in all 8 scenes (REQ-A11Y-25) |
| `tests/a11y/browser/focus-not-obscured.spec.ts` | no focused element fully covered under sticky TopBar + TabBar + Composer at 1440 and 390 (REQ-A11Y-28) |
| `tests/a11y/browser/target-size.spec.ts` | ≥24×24 fine pointer; ≥44×44 coarse pointer; no overlapping hit areas (REQ-A11Y-29, 30) |
| `tests/a11y/browser/layer-stack.spec.ts` | one portal root; stacked Escape order and focus return; `inert` background; panel-only `role="dialog"` (REQ-A11Y-32..34) |
| `tests/a11y/browser/prepaint.spec.ts` | persisted `solid`/`tinted` applied on the first frame; no blur frame before hydration; works with CSP nonce (REQ-A11Y-37) |
| `tests/a11y/browser/axe.spec.ts` | `@axe-core/playwright`, `color-contrast` on; per-PR REQ-QA-18 coverage, nightly/RC full 8 scenes × Chromium + WebKit; 0 serious/critical, 0 moderate on T1 (REQ-A11Y-42) |
| `tests/a11y/browser/zoom-reflow.spec.ts`, `text-spacing.spec.ts` | 200% no clipping; 320 CSS px no 2-D scroll outside exemptions; sticky chrome ≤50% viewport height; text-spacing no loss (REQ-A11Y-45) |
| `tests/a11y/browser/color-vision.spec.ts` | Machado simulation ΔE2000 ≥10 or non-colour cue for each intent pair (REQ-A11Y-46) |
| `tests/a11y/apg/__selftest__/{button-pattern,dialog-pattern}.selftest.spec.ts` + `harness.selftest.spec.ts` (this PRD) | harness drives a minimal fixture of each pattern; failure messages name story, step and key (REQ-A11Y-40) |
| `tests/a11y/apg/<kebab-component>.apg.spec.ts` (one per interactive component, §5.8 table; **created by the component PRD**, e.g. CTL-060, OVL-053; run by QA-082 in L5) | key scripts pass in all three engines (REQ-A11Y-40, 41) |
| QA L6 Environment visual (PRD-19 pixel harness, QA-049/057) consuming REQ-A11Y-19 thresholds (`a11y-pixel-contrast` job) | 0 failing rows for T0/T1 across the full matrix |

### 12.3 Manual

| Protocol | Asserts |
|---|---|
| `tests/a11y/manual/scripts/<component>.md` + `sr-record.schema.json` | SR-1..SR-4 pass per flagship; SR-5/6 recorded; physical touch pass on iOS + Android (REQ-A11Y-43, 44) |

Existing tests reused, then retired once the new specs are green: `tests/visual/accessibility/a11y-visual.spec.ts` (forced-colors emulation seed), `tests/visual/accessibility/contrast.spec.ts` (computed-style precheck). Deleted: `src/__tests__/glass-contrast.spec.ts`, `src/components/accessibility/*.test.tsx` with their components.

---

## 13. Storybook requirements

- **Toolbar globals (contract; implemented in `.storybook/preview.tsx` by `AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` §4.2).** Per SC-23 the globals use the provider value names verbatim: `environment` (SC-28 scene ids), `scheme`, `transparency` (`system|glass|tinted|solid`), `contrast` (`system|standard|more`), `forcedColors` (`off|active`, CI emulation only), `motion` (`system|full|calm|none`, MOT semantics) and `glassOpacity` (0, 0.5, 1). The Storybook PRD's older `os`/`default`/`reduce` names are replaced by `system`/`standard`/`calm` there (SC-23 must-change on SB, REQ-SB-07; SB-048 owns `.storybook/preview.tsx`). This PRD requires: (1) each global maps 1:1 to the `AuraGlassProvider` prop of the same name with no translation table; (2) `glassOpacity` is mapped to the provider prop; (3) globals reach the library only through the provider / `data-ag-*`, never through component props. The interactive `forcedColors: active` toggle shows a note and certifies nothing; certification uses browser emulation.
- **`@storybook/addon-a11y`** (already `9.1.20`, `package.json:431`) configured with `color-contrast` **enabled** and the `environment` scene applied, so contrast is evaluated over real content, not the removed opaque stage.
- **Stories (NEW, `src/a11y/stories/`)**:
  - `A11y/Rungs` — one `Surface` per variant × thickness on each scene, with a live read-out of the effective transparency, contrast, solved floor alpha and `minRatio` from `contrast-matrix.json`.
  - `A11y/Floors` — demonstrates that toggling `transparency=glass` cannot lower an emulated OS floor; shows `resolved().floors`.
  - `A11y/FocusRing` — every focusable part focused on all 8 scenes, plus `aria-disabled` focus.
  - `A11y/Targets` — fine vs coarse hit-area overlay (`data-ag-debug-targets` outlines hit areas).
  - `A11y/LayerStack` — Dialog → Popover → Tooltip → Toast, with Escape order instructions.
  - `A11y/Announcer` — polite/assertive buttons and a streaming demo.
  - `A11y/ScrollPadding` — long form under sticky `TopBar`, `TabBar` and `Composer`.
  - `A11y/ColorVision` — intent matrix with a simulation toggle (SVG `feColorMatrix` with Machado matrices, story-only).
  - `Theme/GlassPreferencesPanel` — default, floor-locked (emulated contrast more), `show` subsets, dark scheme, RTL.
- **Every flagship story** declares `parameters.a11y.apgScript` (path to its APG spec) and `parameters.a11y.srScript` (path to its manual script), rendered in the docs tab.
- No story may set `!important`, paint an opaque stage, or pass a prop that disables a preference (0 tolerance; L1 Static).

---

## 14. Responsive requirements

| Viewport / input | Requirement |
|---|---|
| 390×844, `(pointer: coarse)` | 44×44 hit areas (REQ-A11Y-30); coarse surface budget ≤3 blurred surfaces (§4.7) holds with focus/scroll padding active; `GlassPreferencesPanel` single-column, controls full-width |
| 1440×900, `(pointer: fine)` | 24×24 minimum; focus ring offset never clipped by `overflow: hidden` parents (rings use `outline`, and containers that clip set `overflow: clip` with `overflow-clip-margin: 4px` or inset the ring via `--ag-focus-offset: -2px` on clipped items such as Table cells) |
| 320 CSS px width (400% zoom) | reflow per REQ-A11Y-45; `AppShell` collapses to `MobileShell`; `Sidebar` becomes a `Sheet` drawer; `Toolbar` overflows into a `Menu` ("More") rather than scrolling horizontally |
| 256 CSS px height (landscape 400%) | sticky chrome ≤50% of viewport height; `Sheet` detents re-computed; Dialog content scrolls internally |
| Container queries | rung CSS and focus CSS have no viewport or container dependence; scroll-padding values update on container resize via the ResizeObserver |
| Orientation | no orientation lock (1.3.4); rotation preserves focus and open layers |

---

## 15. Accessibility requirements (conformance targets)

| Criterion | Level | Target in 5.0 | Requirement |
|---|---|---|---|
| 1.3.1 Info and Relationships, 4.1.2 Name, Role, Value | A | all widgets | REQ-A11Y-40..43 |
| 1.3.4 Orientation | AA | no lock | §14 |
| 1.4.1 Use of Color | A | intent cues | REQ-A11Y-46 |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 / 3:1 on build matrix **and** rendered pixels over 8 scenes | REQ-A11Y-15..19 |
| 1.4.6 Contrast (Enhanced) | AAA | 7:1 under `contrast=more` | REQ-A11Y-10, 16 |
| 1.4.4 Resize Text, 1.4.10 Reflow, 1.4.12 Text Spacing | AA | 200%, 320px, spacing overrides | REQ-A11Y-45 |
| 1.4.11 Non-text Contrast | AA | 3:1 for borders, icons, focus bands | REQ-A11Y-16, 24 |
| 1.4.13 Content on Hover or Focus | AA | Tooltip, PreviewCard | REQ-A11Y-41 |
| 2.1.1 Keyboard, 2.1.2 No Keyboard Trap | A | all widgets; traps only in modal layers with Escape | REQ-A11Y-33, 34, 41 |
| 2.2.1 Timing Adjustable, 2.2.2 Pause, Stop, Hide | A | Toast pause on focus/hover; `allowContinuous` + pause control | REQ-A11Y-41; PRD-06 |
| 2.3.3 Animation from Interactions | AAA | `prefers-reduced-motion` → at most `calm`, unoverridable | PRD-06 via store (REQ-A11Y-21) |
| 2.4.1 Bypass Blocks | A | `AppShell.SkipLink` | REQ-A11Y-41 |
| 2.4.3 Focus Order, 2.4.7 Focus Visible | A / AA | single ring, never removed | REQ-A11Y-24..27 |
| 2.4.11 Focus Not Obscured (Minimum) | AA | scroll padding | REQ-A11Y-28 |
| 2.4.13 Focus Appearance | AAA (adopted default) | 2px two-tone | REQ-A11Y-25 |
| 2.5.7 Dragging Movements | AA | Sheet detents, ResizablePanels, Slider, Table reorder have non-drag alternatives | REQ-A11Y-41, 44 |
| 2.5.8 Target Size (Minimum) | AA | 24px; 44px coarse | REQ-A11Y-29, 30 |
| 4.1.3 Status Messages | AA | one announcer | REQ-A11Y-35, 36 |
| OS preferences | — | `forced-colors`, `prefers-contrast: more`, `prefers-reduced-transparency`, `prefers-reduced-motion` as floors; user override for Safari/Firefox | REQ-A11Y-01..12, 37..39 |

APCA Lc values are published as advisory alongside every WCAG 2.2 ratio. No conformance claim is made for WCAG 3.

---

## 16. Performance requirements (numeric budgets)

| Item | Budget | Measured by |
|---|---|---|
| `AuraGlassScript` inline script | ≤1.5 KB minified (REQ-MAT-55); ≤1 ms main-thread execution on the PRD-19 mid-tier mobile profile | `AuraGlassScript.test.tsx`; L10 Performance |
| `aura-glass/theme` JS for `{ AuraGlassProvider, usePreference }` | ≤4 KB min+gz (peers external), inside the `AURAGLASS_PERFORMANCE_PRD.md` row `{ AuraGlassProvider, AuraGlassScript }` ≤6 KB; `GlassPreferencesPanel` adds ≤3 KB beyond its RadioGroup/Slider parts | PRD-02 per-import budget table (new rows) |
| `src/a11y/css/*` contribution to `styles.css` | ≤3 KB gz (inside the 32 KB `styles.css` budget) | L2 Artifact (PKG-049 size gate) |
| `matchMedia` objects | exactly 1 per query per document (≤6 total: forced-colors, contrast more, reduced transparency, reduced motion, color scheme, pointer coarse) | `usePreference.test.tsx` |
| Runtime contrast observers | **0** `ResizeObserver`/`MutationObserver` for contrast (4.1: per-instance, N×M in data grid) | lint + jsdom import gate |
| Sticky scroll-padding observers | ≤1 `ResizeObserver` per sticky chrome element; ≤1 style write per observer callback; 0 writes when size unchanged | unit test with mocked RO |
| Preference change | changing `transparency` re-renders ≤1 React component (the panel) — surfaces respond through CSS attributes only; attribute write to style recalc ≤16 ms on the mid-tier profile with 6 blurred surfaces | L10 Performance |
| Layer stack | Escape dispatch O(1) to top layer; `inert` toggling ≤2 ms for 1,000 background nodes | `layer-stack.spec.ts` timing assertion (Chromium) |
| Announcer | ≤1 DOM write per 1,000 ms per region while streaming | `announcer.test.tsx` |
| Hydration | 0 hydration warnings; 0 layout shift from preferences (CLS contribution 0.000) | SSR canary; `prepaint.spec.ts` |
| Forced-colors / solid rung | blurred surfaces = 0, so frame time must not exceed the lightweight-tier baseline + 5% | L10 Performance |
| Hit areas | no extra layout: hit-area span is `position:absolute`, adds 0 to layout box; ≤1 extra DOM node per interactive part | `target-size.spec.ts` |

---

## 17. Acceptance criteria

Each is measured on the release SHA in CI artifacts (D-32). "T0/T1 set" means every T0 subject and every T1 flagship story state.

| ID | Criterion | 4.1 baseline | Target |
|---|---|---|---|
| **AC-A11Y-01** | Rendered-pixel text contrast failures with no Storybook stage, flat black scene, T0/T1 set, all engines | 266/342 (77.8%) | **0** |
| **AC-A11Y-02** | Rendered-pixel failures across all 8 scenes × scheme × transparency × {default, contrast more} | white 2, busy 20, default 17 of 342 | **0**; worst-case ratio ≥4.5 body / ≥3.0 large / ≥7.0 under contrast more |
| **AC-A11Y-03** | Build matrix: cells below threshold | not measured (ContrastGuard always passes) | **0**; `contrast-matrix.json` min ratio published |
| **AC-A11Y-04** | Pixel difference inside the largest surface, `contrast more` vs default, per story | 0.000% on 12/12 | **>0.5%** on 100% of stories |
| **AC-A11Y-05** | Visible non-`none` `backdrop-filter` elements under forced colors, per story | modal 10, showcase 12, `liquid-glass-material` 1, 3.2 shell 3 | **0** on 100% of T0/T1 stories |
| **AC-A11Y-06** | Surfaces at ≥ tinted under emulated reduced transparency or contrast more, with `transparency="glass"` set by app and user | not enforced | **100%** of `[data-ag-surface]`, JS on and off |
| **AC-A11Y-07** | `prefers-contrast: high` occurrences in shipped CSS/JS | 16 (17 lines) | **0** (4.2 onward) |
| **AC-A11Y-08** | `!important` in `ag.a11y` CSS | fallbacks rely on it | **0** |
| **AC-A11Y-09** | Pre-paint: frames with blur before hydration when persisted `solid` | n/a | **0** across 20 reloads per engine |
| **AC-A11Y-10** | Focus 2.4.13 failures (area or 3:1 change) across all focusable parts × 8 scenes | not measured | **0** |
| **AC-A11Y-11** | Focus-not-obscured: focused elements fully covered by sticky chrome | not measured | **0** of ≥50 per page at 1440 and 390 |
| **AC-A11Y-12** | Interactive parts with hit area <24×24 (fine) / <44×44 (coarse) | `xs` 24px, no coarse rule | **0 / 0** |
| **AC-A11Y-13** | `[data-ag-portal-root]` count with 4 layer kinds open; stacked Escape order correct | multiple portals; document Escape | **1**; 3/3 presses close in order and restore focus |
| **AC-A11Y-14** | APG scripts passing, per interactive component, in Chromium, WebKit, Gecko | Slider 0 keys; DatePicker/Tooltip/Select/Menubar/Accordion/Tree fail | **100%** of §5.8 rows × 3 engines |
| **AC-A11Y-15** | Browser axe serious/critical violations with `color-contrast` on, all stories × 8 scenes | browser axe absent | **0** |
| **AC-A11Y-16** | SR matrix cells SR-1..SR-4 recorded `pass` for the 44 flagships; physical touch pass iOS + Android | 0 (issue #16 OPEN) | **176/176** SR cells + 88/88 touch cells; issue #16 closed referencing `a11y-manual-<sha>.json` |
| **AC-A11Y-17** | Reflow/zoom failures (200%, 320px, text-spacing) on T0/T1 + six product surfaces | not measured | **0** outside documented exemptions |
| **AC-A11Y-18** | Intent pairs failing both ΔE2000 ≥10 and non-colour-cue checks under protan/deutan/tritan | not measured | **0** |
| **AC-A11Y-19** | Preference detectors in `src` (reduced-motion hooks, settings providers, MQL watchers) | ≥10 detectors, 4 settings sources | **1** store, **1** provider |
| **AC-A11Y-20** | Focus traps / announcers / focus systems in `src` | 6 / 6 / ≥4 | Base UI + `FocusScope` / **1** / **1** |
| **AC-A11Y-21** | Removed exports (§9) present in root or any subpath of 5.0 | 7 a11y fakes exported from root | **0**; each has a 4.2 `deprecations.json` entry |
| **AC-A11Y-22** | `focus:outline-none` strings in `src` | 109 | **0** |
| **AC-A11Y-23** | Hydration warnings with provider + script across Next 15/16 canaries | n/a | **0** |
| **AC-A11Y-24** | Unsourced a11y claims in README / `llms.txt` / docs | "accessibility guardrails", "100% coverage" | **0** (docs lint) |
| **AC-A11Y-25** | Budgets in §16 | — | all within budget on alpha calibration and on GA SHA |

---

## 18. Definition of done

1. REQ-A11Y-01..50 implemented, each with its named test passing in CI on `main`.
2. AC-A11Y-01..25 met on the 5.0.0 GA SHA; the artifacts (`contrast-matrix.json`, `a11y-pixel-contrast.json`, `axe-results.json`, `a11y-manual-<sha>.json`, perf results) are attached to the release and linked from the generated docs.
3. **Exit criterion for the PRD-05 wave (alpha gate):** forced-colors, contrast-more and reduced-transparency cells green in QA lanes L5 Behaviour and L6 Environment visual (SC-29) on `Surface` (all variants × thicknesses × 8 scenes × 3 engines), the store/provider/script shipped in `5.0.0-alpha.N`, and the contrast matrix gate live in PRD-03's build.
4. The 4.1.1 honesty fix (REQ-A11Y-48) and the 4.2 `high`→`more` / forced-colors selector fixes are released on the 4.x line with labelled before/after composites.
5. Every removal in §9 has a `deprecations.json` entry shipped in ≥1 4.x minor, a codemod or explicit TODO transform with fixtures, and no consumer canary regression.
6. API Extractor report for `./theme` and `./primitives` reviewed; every change classified as in §10.
7. Storybook stories in §13 exist and render in the Material Lab; every flagship declares `apgScript` and `srScript`.
8. Docs: "Accessibility and preferences" guide, "Shipping a Reduce Transparency setting" guide, per-component keyboard tables and SR notes — generated, not hand-written claims (PRD-20).
9. Issue #16 closed with links to the SR/touch records.
10. No local browser or local Docker was used for any certification evidence.
11. **No simulated completion.** No REQ or AC counts as met through a skipped, `test.fixme`/`test.skip`/`.only`-filtered or quarantined test; a jsdom or mocked-`matchMedia` result standing in for a browser requirement (§12.2); a hand-written or edited `contrast-matrix.json`, `a11y-pixel-contrast.json`, `axe-results.json` or `a11y-manual-<sha>.json`; an SR/touch record without AT version, browser version, device model, tester and date; or a stub implementation that returns a constant (the `validateTextContrast` → `true` pattern). Each artifact carries the producing CI run id and SHA, and the gate rejects artifacts whose SHA differs from the release SHA.

---

## 19. Dependencies

Task-level `depends_on` uses only real task ids (SC-40); the anchor column lists the owner tasks this PRD's fragment cites. External gates (a release being published) go in the task `gate` field.

| PRD (key) | Relationship | Anchor tasks cited |
|---|---|---|
| PRD-00 (TRUST, 4.1.1 trust patch) | executes REQ-A11Y-48 (ContrastGuard `"unverified"`, `data-meets-wcag` removal, overclaiming reports out of the tree) | TRUST-026 |
| PRD-01 (REL, release governance) | `deprecations.json` schema (SC-02/03, repo root, seeded by TRUST-075) and gate; visual-class gate for D-28 fixes; generated-claims gate | REL-010, TRUST-075 |
| PRD-02 (PKG, build/packaging) | layer emission order in `styles.css`; `eslint-plugin-auraglass.js` + `eslint.config.js` wiring (SC-16); exports manifest (SC-12); per-import size budgets in `docs/size-budgets.json` (SC-15); scripts layout (SC-11); jsdom side-effect gate covering the store | PKG-005, PKG-015, PKG-042, PKG-048, PKG-049, PKG-101 |
| **PRD-03 (DS, token compiler)** — hard prerequisite | owns `tokens/**` and generated outputs (SC-18) incl. `tokens/contrast/busy-reference.json` (DS-033); implements `contrast-solve` (DS-057) to this PRD's matrix contract (REQ-A11Y-15..17); emits `--_ag-tint-floor*` (DS-059), `sys.color.focus-*`, `target.*`, `layer.z.*`, `--ag-color-on-surface-max`, `--ag-color-border-strong`, `--ag-fallback-fill`; keeps `src/theme/color.ts` (DS-055) | DS-016, DS-022, DS-024, DS-029, DS-033, DS-055, DS-056, DS-057, DS-059, DS-109 |
| **PRD-04 (MAT, material engine)** — hard prerequisite | `data-ag-surface` on every surface; `::before`/`::after` layer model; no host opacity; `clear` fail-safe (D-12); owns the `data-ag-*` registry (SC-21) | MAT-015, MAT-047 |
| PRD-06 (MOT, motion) | consumes `usePreference('motion')`; owns motion CSS and lane L9 Motion | — (consumer of A11Y-027) |
| PRD-07/14/16 (FND, foundation/core/removal) | `usePortalContainer()` accessor (FND-007); KEEP primitives `Portal`, `DismissableLayer`, `VisuallyHidden` (FND-031/035/038, SC-26); `Icon` naming (FND-048/049); §9 removal PRs (RM-09 = FND-125) and removal gate (FND-102) | FND-007, FND-031, FND-035, FND-038, FND-048, FND-049, FND-102, FND-125 |
| PRD-08 (CTL, controls) | Button pattern proof and `button.apg.spec.ts` (CTL-060); `RadioGroup`/`Slider` used by `GlassPreferencesPanel` | CTL-035, CTL-055, CTL-060, CTL-089 |
| PRD-09 (OVL, overlays) | Dialog pattern proof and `dialog.apg.spec.ts` (OVL-053); requests `data-ag-obscured` (REQ-OVL-08) | OVL-040, OVL-053, OVL-063, OVL-066, OVL-113 |
| PRD-10 (NAV, app shell) | sticky chrome scroll-padding writers; reflow collapse at 320px | NAV-016, NAV-021, NAV-064, NAV-070 |
| PRD-11 (DATA) | Table/Chart reflow exemption and intent cues | DATA-038, DATA-080 |
| PRD-12 (AI) | announcer batching contract (REQ-A11Y-36) | AI-034 (AI-088/AI-093 consume A11Y-078/A11Y-084) |
| PRD-13 (MED, media/backdrops) | owns library-owned luminance sampling for `data-ag-backdrop="auto"` (the only allowed runtime sampler) | MED-060, MED-084 |
| PRD-15 (interim MAT, enhanced tier) | refraction disabled at `tinted` and above and under `contrast=more` (`--_ag-refraction-scale: 0`) | MAT-015 |
| PRD-17 (interim REL, 4.2/4.3 bridge) | ships `high`→`more`, forced-colors selector extension, provider wrappers, experimental `./theme` (SC-37) | REL-089 (visual-class on the D-28 PRs); gate: `v4.2.0` tag |
| PRD-18/20 (DX, CLI/codemods/compat/docs) | `providers` and `removed` transforms (DX-041/042); `compat` `AccessibilityProvider` adapter (DX-065); generated a11y docs and claims lint (DX-134/136); `auraGlassPrepaintScript` consumer (REQ-DX-12) | DX-041, DX-042, DX-065, DX-134, DX-136 |
| **PRD-19 (QA, certification infra)** | 8 scenes (QA-038/039, SC-28); jest/Playwright configs and lanes (QA-003/018/081/082, SC-29); text-hidden-twin pixel harness and `a11y-pixel-contrast.json` (QA-049/057); `certify-pr.yml` (QA-031); claims build (QA-091) | QA-003, QA-018, QA-031, QA-038, QA-039, QA-057, QA-081, QA-082, QA-086, QA-091 |
| PRD-19 (SB, Storybook) | `.storybook/preview.tsx` globals per SC-23 (SB-048) | SB-048 |
| PERF | runtime perf budgets (`tests/perf/harness/budgets.json`, SC-15) for §16 rows | PERF-039 |

---

## 20. Execution order

1. **4.1.1 (with PRD-00, week of 2026-10-12):** REQ-A11Y-48 honesty fix; remove overclaiming reports from the tree. No behaviour change.
2. **Contract freeze (Wave 1, alongside PRD-03):** PRD-03 commits `tokens/contrast/busy-reference.json` (DS-033) with this PRD's values; this PRD commits the matrix axes/pairs/thresholds (`tests/a11y/contrast/matrix-contract.json`) (REQ-A11Y-15..17) and `tests/a11y/contrast-matrix.test.ts` against PRD-03's first emitted `material.css`. The token build fails red until floors are solved — expected.
3. **Static gates:** land `scripts/ci/verify-a11y-css.mjs` and the ESLint rules in ratchet mode on 4.x paths, enforcing mode on `src/a11y/**`, `src/theme/**`, `src/material/**`.
4. **4.2 bridge (with PRD-17, 2026-11-16):** `high`→`more` everywhere; delete the invalid `theme-transitions.css:51-53` block; extend the 4.x forced-colors and reduced-transparency selector lists to `.liquid-glass-material` and overlay layers; publish experimental `aura-glass/theme` (store, `usePreference`, `AuraGlassScript`, `AuraGlassProvider`); old providers wrap it; `deprecations.json` entries for §9.
5. **Rungs on `Surface` (Wave 2, after PRD-04 emits):** `src/a11y/css/rungs.css`; `floors.spec.ts`, `rungs.spec.ts`, `forced-colors.spec.ts`, `pixel-modes.spec.ts` green on `Surface` across 8 scenes × 3 engines → **PRD-05 exit criterion**.
6. **Provider runtime:** portal root, `LayerStack`, announcer (PRD-07 FND-007/031/035/038 then wire `usePortalContainer`, `Portal`, `DismissableLayer`, `VisuallyHidden` to it); `layer-stack.spec.ts`, `announcer.test.tsx`, `prepaint.spec.ts` green.
7. **Focus, targets, scroll padding:** `focus.css`, `targets.css`, `HitArea`, `useStickyScrollPadding`; `focus-appearance`, `target-size`, `focus-not-obscured` specs green on `Surface`-based fixtures.
8. **Pattern proof with PRD-07 (Wave 3, alpha gate):** `Button` and `Dialog` pass every lane in this PRD including APG scripts and a pilot SR-1/SR-3 record; calibrate §16 budgets in L10 Performance (remote).
9. **Harness for flagships:** ship `tests/a11y/apg/harness.ts` (A11Y-073, SC-40 anchor), the §5.8 script table, `axe.spec.ts`, `zoom-reflow.spec.ts`, `color-vision.spec.ts`, SR record schema and protocols; flagship PRDs (Wave 4) attach their scripts.
10. **`GlassPreferencesPanel`** once PRD-08 `RadioGroup` and `Slider` are certified; registry Settings block uses it (PRD-18).
11. **4.3 (2027-01-18):** C-D on every §9 name confirmed; codemods `providers` and `removed` in beta.
12. **Beta (from 2027-02-15):** §9 removals land via PRD-16; floors become unoverridable (B13); full matrix runs on every PR touching `src/a11y`, `src/theme`, `src/material`.
13. **RC (from 2027-03-22):** SR-1..SR-4 + physical touch recording for all 44 flagships on the RC SHA; fix-forward any P0; generated docs.
14. **GA:** AC-A11Y-01..25 green on the GA SHA; close issue #16; claims rendered from artifacts.

---

## 21. Open items

Reconciled against `_shared-contracts.md` and `_verification-remaining-concerns.md` (A11Y section, plus the DS item on "backdrop" terminology) on 2026-10-06. Items resolved inside this PRD are listed first for traceability; the rest need action outside this file.

**Resolved here**

| Item | Resolution |
|---|---|
| "Backdrop" used for white/black/busy (DS concern; SC-28) | REQ-A11Y-15 and deviation 6 now say "composite"; "backdrop" means only the declared `data-ag-backdrop` axis. Cell counts follow DS-057 (2,160 cells) because the axes are identical. |
| `busy-reference.json` double CREATE (SC-18, OV-13) | DS-033 creates it; A11Y-001 is a verification task. |
| KEEP primitives claimed here (SC-26, OV-14) | §6/§8 rows now name FND-031/035/038; A11Y-052/053/056 are TEST tasks. `src/a11y/css/visually-hidden.css` dropped (FND-038 ships `VisuallyHidden.css`). |
| Button/Dialog APG specs (SC-30, OV-15) | CTL-060 and OVL-053 own them; A11Y-076/077 are harness self-test fixtures. |
| Ad-hoc lanes/configs (SC-29) | `playwright.a11y.config.ts` and `a11y-lanes.yml` removed; suites register by MODIFY of `playwright.config.ts` and `certification/lanes.config.ts` (QA-018/081/082). |
| `src/theme/color.ts` edits claimed here | DS-055/DS-056 own the edits and the test file; DS-109 deletes `src/theme/contrast.ts`; A11Y-003/004/006 verify or add vectors. |
| `auraGlassPrepaintScript`, `data-ag-root`, `data-ag-obscured`, `toasts`/`tooltips` opt-outs (SC-21, SC-23) | Added to §4.5, REQ-A11Y-37 and §10. |
| Finding-ID numbering differs (architecture/summary vs detail report) | No change needed: §2.1 crosswalk governs; reviewers use it. |
| Invalid `depends_on` (34 `PRD-xx` strings, SC-40) | `tasks/A11Y.json` rewritten to anchor task ids; external gates moved to a `gate` field. |

**Open (action outside this PRD)**

| # | Item | Owner | How to close |
|---|---|---|---|
| OI-01 | Storybook globals still use `os`/`default`/`reduce` and lack `glassOpacity` | SB (`AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` `:113`, `:115`, REQ-SB-07; SB-048) | Apply SC-23 must-change: `system`/`standard`/`calm`, add `glassOpacity` (0, 0.5, 1); cite §13 of this PRD. |
| OI-02 | Only the DS contrast test is wired into L4 | QA (REQ-QA-29, QA-081) | Add `tests/a11y/contrast-matrix.test.ts` (A11Y-007) to L4 next to `tests/tokens/contrast-matrix.test.ts` (SC-29). Both tests stay. |
| OI-03 | Nightly/RC 8-scene axe run (REQ-A11Y-42 b) has no QA lane | QA (REQ-QA-18, QA-031/082) | Add the `AXE_SCOPE=full` nightly + RC job to `certify-main.yml`/`certify-release.yml` (SC-29 must-change). A11Y-078 provides the spec. |
| OI-04 | QA REQ-QA-70 allows ≤3 SR waivers; this PRD requires all 44 flagships | QA | Remove the waiver allowance (SC-29 must-change); issue #16 rule in REQ-A11Y-43 governs. |
| OI-05 | Architecture §6 still says "pseudo-element" hit area and 105 `focus:outline-none` | Architecture owner (errata E-08) | Edit §6: hit area is a `span` (deviation 4), count 109. |
| OI-06 | `[verify at alpha]`: Chromium switch to disable backdrop-filter for a browser-level REQ-A11Y-06 check | A11Y with QA runner (QA-017 image) | On the pinned remote Playwright/Chromium, test for a launch flag; if none, record "static test is the binding gate" in A11Y-040 and close. |
| OI-07 | `[verify]`: Gecko forced-colors emulation in Playwright (REQ-A11Y-12, -26) | A11Y with QA runner (QA-016/017) | Run `forced-colors.spec.ts` on the pinned Firefox; if unsupported, report the cell as "unsupported" in L5 (no skip), per A11Y-044. |
| OI-08 | 4.2+ dates (2026-11-16, 2027-01-18, 2027-02-15, 2027-03-22) are estimates from architecture §14 | REL (release train, SC-36/37) | Update §20 when REL publishes the gate records (REL-090, REL-125, REL-131, REL-134). |
| OI-09 | The D-28 4.2 CSS edits (`high`→`more` at 16 sites, `theme-transitions.css:51-53`, forced-colors selector extension) have no implementing task; REL-089 only classifies those PRs | REL (interim PRD-17, SC-37) | REL files the 4.2 edit task(s) on `release/4.x`; A11Y-093 depends on REL-089 and verifies the `v4.2.0` tag (its `gate`). |
| OI-10 | `certification/lanes.config.ts` is MODIFIed by QA tasks but no task CREATEs it | QA | Add the CREATE (or mark QA-078 as CREATE); A11Y-019 depends on QA-081. |
| OI-11 | Pending human decision SC-24 (Button `variant` becomes the material axis; `danger` → `intent`) | Product owner / CTL | Confirm SC-24. This PRD's contract-more and APG rows are unaffected by the outcome. |
| OI-12 | The SC-40 validator `scripts/release/verify-task-graph.mjs` does not exist yet | REL | Implement the validator; `tasks/A11Y.json` was checked with an ad-hoc node script on 2026-10-06. |
| OI-13 | `AI-088` marks `tests/a11y/browser/axe.spec.ts` NEW and `AI-093` marks `tests/a11y/manual/sr-record.schema.json` NEW; both are A11Y-created (A11Y-078; A11Y-084, OV-28) | AI | Change both to MODIFY with `depends_on` A11Y-078 / A11Y-084 (SC-40 rule 5). |
