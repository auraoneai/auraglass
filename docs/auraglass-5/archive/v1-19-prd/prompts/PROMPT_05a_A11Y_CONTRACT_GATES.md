# PROMPT-05a (A11Y): Contrast contract, static gates, test infrastructure

You are implementing part of PRD-05 (Accessibility and preferences) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass`. The baseline is 4.1.0, HEAD `15b6de6f7`. This prompt is self-contained. Branch: `main` (5.0 line). Tasks: A11Y-001..A11Y-019 in `docs/auraglass-5/tasks/A11Y.json`.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_ACCESSIBILITY_PRD.md`. Read the §0 deviations (3, 5, 6), §2.3–§2.5, §4.7, §5.3 (REQ-A11Y-15..20), REQ-A11Y-03/05/08/13/14/24/27/33, §12.1 and §20 steps 2–3.
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §7.3 (contrast solve), D-24 (layers, no `!important`), §16.
- Contract consumers: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` REQ-DS-15 / §4.2 (PRD-03 solver; DS-033 creates `tokens/contrast/busy-reference.json`, DS-055/056 own `color.ts` edits and its test, DS-057 solves, DS-109 deletes `src/theme/contrast.ts`), and `AURAGLASS_QA_CERTIFICATION_PRD.md` REQ-QA-18/29 (QA owns `jest.config.js`, `playwright.config.ts`, `certification/lanes.config.ts`, `certify-*.yml`).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-11, SC-16, SC-18, SC-29, SC-40 (binding).
- Evidence: `docs/auraglass-5/autopsy/accessibility.md` (use the detail-report IDs), `autopsy/runtime-remote.md` §1–§4.

Requirements: REQ-A11Y-03 (static half), 05, 08 (gate half), 13 (matrix pair + gate), 14 (matrix cells), 15, 16, 17, 18, 20, 24 (band math), 27 (gate), 33 (lint half). Acceptance: AC-A11Y-03, AC-A11Y-07, AC-A11Y-08, AC-A11Y-22 (ratchet only).

## 2. Files
May touch:
- NEW: `tests/a11y/contrast/matrix-contract.json`
- `src/utils/contrast.ts`: fold onto `color.ts`, then delete; its importers: rewrite imports only
- `src/theme/__tests__/color.test.ts` (created by DS-056): add a11y vectors only
- NEW: `tests/a11y/contrast-matrix.test.ts`
- `src/__tests__/glass-contrast.spec.ts`: delete
- NEW: `scripts/ci/verify-a11y-css.mjs`, `scripts/ci/__fixtures__/a11y-css/**`, `tests/a11y/verify-a11y-css.test.ts`
- `eslint-plugin-auraglass.js`, `eslint.config.js`: MODIFY only (PKG owns the plugin file and wiring, PKG-015; SC-16)
- NEW: `tests/eslint/auraglass-a11y-rules.test.ts`
- `package.json`: devDependencies and scripts only
- `jest.config.js`: `testPathIgnorePatterns` only (MODIFY after QA-003)
- `playwright.config.ts`: add the `a11y-*` projects only (MODIFY after QA-018)
- `certification/lanes.config.ts`: register A11Y suites only (MODIFY after QA-081/QA-082)

Must not touch:
- anything under `tokens/` (DS, SC-18), including `tokens/contrast/busy-reference.json`
- `src/theme/color.ts` and `src/theme/contrast.ts` (DS-055, DS-109); request missing functions from DS
- `.github/workflows/**` (QA/PKG); do not create `playwright.a11y.config.ts` or `a11y-lanes.yml`
- the PRD-03 compiler and its transforms
- `src/material/**` (PRD-04)
- any component under `src/components/**`. The `focus:outline-none` strings are removed by their owning PRDs. Here you only ratchet the count.
- `.storybook/**` (Storybook PRD)
- `reports/**`
- generated CSS: never hand-write a floor

## 3. Prerequisites (check these; don't assume them)
- Owner tasks merged: DS-033 (`test -f tokens/contrast/busy-reference.json`), DS-055/DS-056 (color.ts functions + test file), PKG-015 (plugin wired in `eslint.config.js`), PKG-056 (allowlist), QA-003/QA-018 (configs), QA-031/QA-081/QA-082 (workflow and lanes). Missing owner output is an input blocker naming the task id; don't build it here.
- PRD-03 has emitted a first `material.css`/`tokens.css` containing `--_ag-tint-floor*` and the `sys.color.on-surface*` pairs. Check: `rg -l "_ag-tint-floor" src dist 2>/dev/null`. If they're absent, still land A11Y-002/010–019 and whichever of A11Y-001/003/006 have their DS inputs. Land `contrast-matrix.test.ts` too, but it must fail with a clear "PRD-03 output missing: <file>" message. It must not skip. Record that as an input blocker.
- PRD-02's lint decision: if PRD-02 adopted stylelint, `verify-a11y-css.mjs` still runs standalone (PostCSS parse). Check `package.json` for `postcss`. If it's missing, add `postcss` at an exact pin.

## 4. Steps
1. **A11Y-001 (verify, DS-033 owns the file)**: Check that DS's `tokens/contrast/busy-reference.json` equals `{"$schema":"…","samples":["#777777","#ff3b30","#34c759","#0a84ff","#ffcc00","#af52de","#ff9500","#5ac8fa","#8e8e93"],"composites":["#ffffff","#000000","busy"]}`. exactly, in this order, with no gradient (PRD deviation 6). Assert it in `contrast-matrix.test.ts` case "busy reference"; file any mismatch against DS-033.
2. **A11Y-002**: Create `tests/a11y/contrast/matrix-contract.json` (A11Y data; nothing under `tokens/`). It holds:
   - the axes from REQ-A11Y-15: preset × scheme {light,dark} × contrast {standard,more} × transparency {glass,tinted,solid} × variant {regular, clear+scrim, identity, content-raised, content-sunken} × thickness {thin,regular,thick} × backdrop {light,dark,media}. There is no `auto` row.
   - the pairs and thresholds from REQ-A11Y-16: `on-surface` 4.5; `on-surface-muted` 4.5 body / 3 when `$extensions.ag.usage:"large-only"`; non-text `border-strong`, `icon`, `focus-inner`, `focus-outer` and control boundary at 3; every text pair at 7 under `more`; `on-surface-disabled` at 3 (REQ-A11Y-13)
   - `clear` cells, which carry `scrim: 0.35` (REQ-A11Y-14)
   - the solver step `0.005` (REQ-A11Y-17)
   - `apca: "advisory"`

   PRD-03 (DS-057) consumes this file; you don't implement the solver.
3. **A11Y-003 (verify DS-055)**: confirm `src/theme/color.ts` exports, pure, under DS's names:
   - `relativeLuminance(srgb)`
   - `contrastRatio(a, b)` / `wcagContrast` (WCAG 2.2; (L1+0.05)/(L2+0.05))
   - `compositeOver(fg, bg, alpha)` (sRGB source-over)
   - `oklchToSrgb(oklch)` (CSS Color 4 gamut mapping, chroma reduction)
   - `apcaLc(fg, bg)`, which is advisory only, and `deltaE2000`

   Don't edit `color.ts`; a missing function is a DS-055 blocker. **A11Y-006**: add (MODIFY) to DS-056's `src/theme/__tests__/color.test.ts` these reference vectors:
   - `contrastRatio('#777777','#ffffff')` = 4.48 ±0.01
   - `#000` vs `#fff` = 21
   - `compositeOver('#fff','#000',0.5)` = `#808080` ±1/255
   - out-of-gamut OKLCH maps into [0,1]
4. **A11Y-004 (verify DS-109) / A11Y-005**: DS-109 deletes `src/theme/contrast.ts`; verify `rg -l "theme/contrast" src` = 0 after it. Fold `src/utils/contrast.ts` (`:77-89` luminance copy) onto the DS-055 functions, rewrite its importers (`rg -l "utils/contrast" src`) and delete it. `rg -n "0\.2126" src` should then match only `src/theme/color.ts`, plus files that PRD-16 is deleting. List those in the report.
5. **A11Y-007 / A11Y-008**: Create `tests/a11y/contrast-matrix.test.ts`. It parses the built `material.css`/`tokens.css` with PostCSS, plus the solver's `dist/contrast-matrix.json`. It imports only `src/theme/color.ts`; a private WCAG formula fails review (REQ-A11Y-18). For every cell, recompute `minRatio` over white, black and the 9 busy samples at the emitted floor alpha. Then assert:
   - your value equals the solver's within 0.01
   - every REQ-A11Y-16 threshold is met
   - the `clear` cells include the 0.35 scrim

   Name the test cases `"clear cells"`, `"disabled pair"` and `"focus bands"`. `"focus bands"` checks `ratio(inner, outer) ≥ 3`, and `max(ratio(inner,bg), ratio(outer,bg)) ≥ 3` for all 4,096 backdrops (16 levels per channel). Failure messages name the cell key and the pair.
6. **A11Y-009**: Delete `src/__tests__/glass-contrast.spec.ts` (`:18-37` is its own WCAG copy) and the `test:glass-contrast` script.
7. **A11Y-010**: Create `scripts/ci/verify-a11y-css.mjs` (Node, PostCSS). It exits non-zero and prints `file:line rule`. It scans the built `styles.css` and `src/a11y/css/**/*.css`, plus TSX class strings for the rules marked TSX. Rules:

   | Rule | Check |
   |---|---|
   | `layer-order` | first `@layer` statement equals `ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y` |
   | `no-important` | 0 `!important` inside `@layer ag.a11y` |
   | `max-specificity` | ≤ (0,2,0); (0,1,1) allowed only for forced-colors `::before`/`::after` |
   | `no-prefers-contrast-high` | the regex `prefers-contrast:\s*high` in CSS/JS/TS under `src/` and in `dist/` |
   | `no-handwritten-floor` | an `--_ag-tint-floor*` assignment outside generated files |
   | `no-outline-none-focus` | `outline: none\|0` under `:focus-visible`, `[aria-disabled="true"]` or a global element selector |
   | `no-global-element-selectors` | bare `button`, `a`, `input`, `[tabindex]` selectors in library CSS |
   | `no-host-opacity-on-disabled` | `opacity` on `[data-ag-surface]` disabled selectors |
   | `a11y-selectors-keyed-on-data-ag-surface` | every `ag.a11y` rule in `rungs.css` is keyed on `[data-ag-surface]` or `[data-ag-layer]`; no class list |
   | `focus-outline-none-count` | `rg -c "focus:outline-none" src` total ≤ the ratchet baseline in `scripts/ci/a11y-baselines/focus-outline-none.json` (109 today, decrease-only; 0 required once the `--enforce-zero` flag is set at beta) |

   Ratchet mode: rules other than `layer-order` and `no-important` are **enforcing** on `src/a11y/**`, `src/theme/**` and `src/material/**`. On 4.x paths they report against a per-rule baseline count that may only fall.
8. **A11Y-011**: Add fixtures under `scripts/ci/__fixtures__/a11y-css/<rule>/{pass,fail}.css|.tsx` and `tests/a11y/verify-a11y-css.test.ts`. Each rule must fire on its `fail` fixture and stay silent on its `pass` fixture.
9. **A11Y-012..014** (MODIFY, after PKG-015; rule names are A11Y-owned per SC-16): Add these rules to `eslint-plugin-auraglass.js` (CommonJS `rules` object; keep the style of the existing `no-inline-glass`):
   - `no-runtime-contrast`: flags `getComputedStyle` reads of `color`/`background*` that feed a contrast or luminance call, any canvas `getImageData`, and `ResizeObserver`/`MutationObserver` whose callback calls a contrast function. Allowed under `src/backdrops/**`.
   - `no-document-escape`: flags `document`/`window` `addEventListener('keydown'|'keyup')` whose handler compares `'Escape'`/`'Esc'`/`27`. Allowed in `src/theme/layers/**`.
   - `no-outline-none-focus`: flags TSX string literals or `cn()`/`clsx()` args that contain `focus:outline-none` or `focus-visible:outline-none`.
10. **A11Y-015**: In `eslint.config.js`, set all three rules to `error` for `src/a11y/**`, `src/theme/**` and `src/material/**`, and to `warn` elsewhere.
11. **A11Y-016**: `tests/eslint/auraglass-a11y-rules.test.ts` uses ESLint `RuleTester`, with valid and invalid cases for each rule, including the `src/backdrops/**` allowance.
12. **A11Y-017**: In `package.json`:
    - add `@axe-core/playwright` as an exact-pinned devDependency (no `^`/`~`; run `npm view @axe-core/playwright version`) and add it to `docs/dependency-allowlist.json` through PKG-056's process
    - remove the unused `@axe-core/react` (`:416`) after `rg "@axe-core/react" src tests .storybook` returns 0
    - add the scripts `verify:a11y-css`, `test:a11y:unit` (Jest on `tests/a11y/*.test.ts`, `src/theme/**/__tests__`, `src/a11y/**/__tests__`) and `test:a11y:browser` (`playwright test --project=a11y-chromium --project=a11y-webkit --project=a11y-firefox`)
13. **A11Y-018**:
    - `playwright.config.ts` (QA-owned, MODIFY after QA-018): add projects `a11y-chromium`, `a11y-webkit` and `a11y-firefox` with `testDir: tests/a11y`, `testMatch: ['browser/**/*.spec.ts','apg/__selftest__/**/*.spec.ts']` (per-widget `*.apg.spec.ts` run in L5 via QA-082), `forbidOnly: true`, `retries: 0` (flake is a bug, not a retry), and `baseURL` from `STORYBOOK_URL`. The webServer serves `storybook-static` with an installed dev dependency, not `npx`.
    - `jest.config.js`: add `<rootDir>/tests/a11y/browser/` and `<rootDir>/tests/a11y/apg/` to `testPathIgnorePatterns`.
14. **A11Y-019**: in QA's `certification/lanes.config.ts` (MODIFY after QA-031/QA-081/QA-082), register the A11Y suites as lane cells (SC-29 ids; no separate workflow):
    - L1 Static: eslint a11y rules, `verify:a11y-css`, APG coverage check
    - L4 Token contrast: `tests/a11y/contrast-matrix.test.ts` next to DS's `tests/tokens/contrast-matrix.test.ts` (REQ-QA-29)
    - L5 Behaviour: floors, rungs, forced-colors, layer-stack, prepaint, target-size, focus-not-obscured, zoom-reflow, text-spacing, axe (`AXE_SCOPE=pr`), APG self-tests
    - L6 Environment visual: pixel-modes, focus-appearance, color-vision
    - L12 Unit: `test:a11y:unit`

    `certify-pr.yml` (QA-031) runs them and uploads artifacts with the run id and SHA. The nightly/RC `AXE_SCOPE=full` job is a QA request (PRD §21 OI-03). No cloud secrets are exposed to PR code.

## 5. Running
- Run unit tests and the static gate locally: `npm run test:a11y:unit`, `node scripts/ci/verify-a11y-css.mjs`, `./node_modules/.bin/eslint` on the touched files. These are light.
- The full `npm run build` (needed for the built `styles.css`) and the browser jobs run remotely only: push the branch and run `gh workflow run certify-pr.yml --ref <branch>`, or use the `auraone-remote-run` skill. Never use local Docker. Never run a local browser.

## 6. Prohibited
- stub implementations, or a matrix test that reads the solver's numbers back without recomputing them
- `test.skip`/`.only`/`xit`/`describe.skip`
- lowering any threshold (4.5/3/7/0.01), or raising a ratchet baseline
- editing generated CSS or `contrast-matrix.json`
- `-u`/`--update-snapshots`
- weakening a lint rule to `warn` on enforcing paths

## 7. Exit criteria
| AC | Evidence |
|---|---|
| AC-A11Y-03 | `contrast-matrix.test.ts` green in L4 Token contrast against PRD-03 (DS-057/059) output: 0 cells below threshold; `minRatio` published in the artifact. If PRD-03 output is absent: red with a named blocker. |
| AC-A11Y-07 | `no-prefers-contrast-high` enforcing on new paths; the 4.x count is reported (17 lines today). It goes to 0 when PRD-17 lands 4.2 (verified in 05g). |
| AC-A11Y-08 | `no-important` = 0 on `src/a11y/**` (vacuous until 05c; the gate is live) |
| AC-A11Y-22 | ratchet baseline 109 committed; gate fails on any increase |

## 8. Final report
Markdown, in this order:
1. Task table: A11Y-001..019 → status, PR/commit, CI run URL.
2. Gate output: the per-rule counts from `verify-a11y-css.mjs` (enforcing vs ratchet).
3. Matrix: the number of cells, the worst cell key, and its `minRatio`, or the PRD-03 blocker.
4. Files deleted, and importers rewritten.
5. Blockers, each with the exact missing input and its owner PRD.
6. Any deviation from this prompt, with evidence.
