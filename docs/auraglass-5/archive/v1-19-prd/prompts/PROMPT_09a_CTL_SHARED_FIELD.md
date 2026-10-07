# PROMPT-09a (CTL): Entry gate, shared control layer, Field/Fieldset, cross-family suites

You are implementing part of PRD-CTL (Flagship Controls; self-id alias PRD-09, architecture §16 PRD-08) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`; 5.0 work targets `main`, see the PROMPT_09 index deviation 1). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §1–§4 (all), §5.1, §5.10 (REQ-CTL-90, -93..-96), §8, §12.1, §13, §15 (REQ-CTL-172, -174, -175), §17, §20 steps 1–2.
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §4.2–§4.7, §6, §9.2, §10, D-02, D-08, D-13, D-24, D-25.
- Foundation pattern: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_REMEDIATION_PRD.md` §4.1 (module layout), §4.2 (REQ-FND-01..10), REQ-FND-05 (`ChangeDetails`).
- Evidence: `docs/auraglass-5/autopsy/accessibility.md` (ACCESSIBILITY-14), `autopsy/api-consistency.md` (API-CONSISTENCY-02/-04), `autopsy/performance.md` (PERFORMANCE-04).
- Contract registry (binding; a row wins over PRD text): `docs/auraglass-5/prd/_shared-contracts.md` SC-11, SC-16, SC-17, SC-20, SC-21, SC-24, SC-25, SC-27, SC-29, SC-30.
- Index: `docs/auraglass-5/prompts/PROMPT_09_CTL.md` (key crosswalk + registry contracts). Tasks: `docs/auraglass-5/tasks/CTL.json` CTL-001..CTL-028.

Requirements: REQ-CTL-01..17 (cross-cutting infrastructure and the parametrised suites), REQ-CTL-90, -93, -94, -95, -96, -160 (Field shell), -172 (shell borders), -174 (default strings), -175 (no live region on `Field.Error`). Acceptance owned here: AC-CTL-02, AC-CTL-04, AC-CTL-05 and the harness halves of AC-CTL-03, AC-CTL-12, AC-CTL-20.

## 2. Scope
May create or modify:
- NEW `tests/controls/base-ui-parts.test.ts`, `tests/controls/families.ts`, `tests/controls/families.test.ts`, `tests/controls/fixtures/field.tsx`, `tests/controls/control-messages.test.tsx`
- NEW `tests/controls/{controls-contract.test.tsx, controls-hooks.test.tsx, controls-side-effects.test.tsx, controls-ssr.test.tsx, controls-api-report.test.ts, controls-meta.test.ts, controls-css.test.ts, field-shell.test.tsx}`
- NEW `src/components/control-shared/{size.ts, value.ts, messages.ts, meta.ts, controls.css}`
- NEW `src/components/field/{Field.client.tsx, Fieldset.client.tsx, Field.types.ts, Field.meta.ts, Fieldset.meta.ts, Field.css, index.ts, Field.test.tsx, Fieldset.test.tsx, Field.stories.tsx, Fieldset.stories.tsx}`
- (no selector generator here: tables come from DX's `scripts/docs/gen-selectors.mjs`, DX-105, over the meta `selectorChanges` field; no `scripts/controls/` directory, SC-11)
- NEW `tests/lint/controls-guard.test.js`
- `src/index.ts` (add the `Field`/`Fieldset` export lines only), `eslint.config.js` (MODIFY: one `$CONTROLS`-scoped block in the PKG-wired config, PKG-015), `jest.config.js` (MODIFY of QA's config, QA-003: `testMatch`/`testPathIgnorePatterns` only), `package.json` (`scripts` only: `test:controls`)
- `.github/workflows/certify-pr.yml` (MODIFY of QA's workflow, QA-031, only if its L1/L12 jobs don't already run lint and jest over `$CONTROLS`; no controls-specific workflow, SC-29)

Must NOT touch: any 4.x component file (`src/components/input/**`, `src/components/button/Glass*.tsx`, `src/components/navigation/**`, …), `src/material/**`, `src/foundation/**`, token sources/outputs, `eslint-plugin-auraglass.js` (every rule is owned elsewhere, SC-16), `.storybook/**` (SB, SC-31), `package.json` dependencies/`exports`, `release/4.x`, the files with unrelated uncommitted edits (`scripts/ci/verify-pack.js`, `scripts/ci/run-{next,vite}-integration.js`, `reports/3.2-release/vite-integration.json`).

`$CONTROLS` = `src/components/{button,icon-button,toolbar,segmented-control,switch,slider,checkbox,radio-group,field,text-field,search-field,select,combobox,number-field,control-shared}/**`, excluding the 4.x files in `src/components/button/` (`GlassButton.tsx`, `EnhancedGlassButton.tsx`, `GlassMagneticButton.tsx`, `GlassFab.tsx`, `LiquidGlassButtonStyle.tsx`, `types.ts`, `index.ts` until 09f).

## 3. Prerequisites (check each; stop with a blocker report naming the failing check)
- Foundation (PRD-FND, arch PRD-07; FND-001/003/004/005/007): `rg '"@base-ui/react": "\d' package.json` shows an exact pin (no `^`/`~`); `test -f src/foundation/types.ts && rg 'export (type|interface) ChangeDetails' src/foundation/types.ts`; `test -f src/foundation/parts.ts`; `rg -n 'export function usePortalContainer' src/foundation/portal.ts`. The Button pattern proof is this PRD's CTL-055 (09c), not a prerequisite here.
- Material (PRD-MAT, MAT-046/047/048): `rg -l 'export function materialProps' src/material` and `rg -l 'export (function|const) (Surface|SurfaceGroup)' src/material` both non-empty.
- Tokens (PRD-DS, DS-016/024): the generated CSS defines `--ag-comp-control-height-md-regular` (or the PRD-03-documented equivalent name; record the exact names you use) and `--ag-duration-micro`, `--ag-state-hover-specular`.
- A11y (PRD-A11Y): `--ag-focus-inner`, `--ag-focus-outer`, `--ag-focus-width` defined; `src/a11y/css/targets.css` styles `[data-ag-part=hit-area]` (A11Y-065); `src/theme/AuraGlassProvider.tsx` (A11Y-029) renders `[data-ag-portal-root]` and exposes a `messages` map.
- Lint rules registered (SC-16/SC-17): `rg -n "no-optics-outside-material|no-inline-glass|no-raw-design-values|no-transition-all|no-random-in-render|no-forward-ref|no-document-escape" eslint-plugin-auraglass.js` (owners MAT-004, DS-069, PERF-025, PKG-086, FND-027, A11Y).
- API report (SC-04; REL-003, TRUST-071): `etc/api/index.api.md` and `etc/api/index.exports.json` are produced by `scripts/release/api-report.mjs`. If missing, `controls-api-report.test.ts` is still written and fails closed; report the blocker.

## 4. Steps
1. **CTL-001 entry gate.** Write `base-ui-parts.test.ts` that imports each Base UI subpath at the pin and asserts every part listed in REQ-CTL-20/30/40/50/60/70/80/90/100/110/120/130 is a defined export. Run it locally (`./node_modules/.bin/jest tests/controls/base-ui-parts.test.ts`). Any missing part (for example `Combobox.Chips`, `NumberField.ScrubArea`, `CheckboxGroup` parent support, `Autocomplete`) goes into the report and into FND's alpha report with "fallback owner: CTL" (PRD §21 O-04). Do not continue past step 1 if `Field`, `Input`, `Checkbox`, `Switch` or `Button` is missing.
2. **CTL-002..005 shared modules.** `size.ts` (`ControlSize`, `sizeAttrs`), `value.ts` (`useControlledSwitchWarning`, re-export of `ChangeDetails` type — never redeclare), `messages.ts` (defaults: "Clear search", "Increase", "Decrease", "Remove {label}", "No results", "Open calendar", "Couldn't load results", `Create "{query}"`, "Loading results"; merge order defaults < provider `messages` < props), `meta.ts` (`ControlMeta` = the FND meta shape registered through `src/foundation/parts.ts`, SC-27, + `props`, `sizes`, `defaults`, optional `keys`, `migration` (SC-33 mapping data) and `selectorChanges: Array<{before, after}>` for DX-105). No hook is ever called conditionally.
3. **CTL-006 `controls.css`.** Exactly the six blocks in the CTL-006 description: size/density heights (24/32/44, 28/36/44, 32/40/48 for compact/regular/spacious), hit-area wiring for A11Y's `<span data-ag-part="hit-area">` (A11Y-065; erratum E-08: a span, not `::after`; ≥24 fine, ≥44 `pointer: coarse`, layout box unchanged), the PRD-A11Y focus ring on `:focus-visible` that is **kept** under `[aria-disabled="true"]`/`[data-disabled]` and becomes `outline: 2px solid Highlight` under `forced-colors`, disabled via `--_ag-surface-alpha` (never `opacity`), hover/press light response (no scale), reduced-motion/`calm`/`none` transition removal. Everything in `@layer ag.components`; tokens only.
4. **CTL-007..015 Field / Fieldset.** Implement per the task descriptions. `Field.Root` renders `data-ag-part="root"`; the control shell part is `control-shell` with `materialProps({ layer: 'content', content: 'content-sunken' })` and no `backdrop-filter`. Description/error ids always exist (Base UI allocates them); elements render only with content. `Field.Error` has no `aria-live`. Add `Field`, `Fieldset` and prop types to `src/index.ts` as named exports (no `export *`). Stories per PRD §13 with product copy only.
5. **CTL-016 family registry.** `tests/controls/families.ts` + `fixtures/field.tsx`. `families.test.ts` fails when any `*.meta.ts` under `$CONTROLS` lacks a registry entry, so later waves can't forget theirs.
6. **CTL-017..021, CTL-023..025 suites.** Write the eight suites exactly as described in their tasks (contract, hooks, side-effects, SSR, API report, meta, CSS, field-shell). They are parametrised over the registry, so they cover Field now and every later family automatically. The CSS suite reads the built `dist` `styles.css` from the remote build artifact (don't run a full build locally).
7. **CTL-022 selector tables.** Run DX's `scripts/docs/gen-selectors.mjs` (DX-105) over the Field/Fieldset metas; it must exit 0 with a row per part. Write no generator. 09f fills in the 4.x `selectorChanges` rows. If DX-105 has not landed, mark CTL-022 blocked on DX-105.
8. **CTL-026 lint.** Add the `$CONTROLS`-scoped block to `eslint.config.js`: `react-hooks/rules-of-hooks`, `auraglass/no-optics-outside-material`, `auraglass/no-inline-glass`, `auraglass/no-raw-design-values`, `auraglass/no-transition-all`, `auraglass/no-random-in-render`, `auraglass/no-forward-ref`, `auraglass/no-document-escape` at `error`, and 4.x imports banned. `tests/lint/controls-guard.test.js` asserts the block enables each rule for a `$CONTROLS` path (the rules themselves are tested by their owners). If a referenced rule isn't registered, stop and report its owner task id.
9. **CTL-027/028 wiring.** MODIFY QA's `jest.config.js` (QA-003): add `$CONTROLS` co-located tests and `tests/controls/**` to `testMatch`; keep `tests/perf/`, `tests/e2e/`, `tests/a11y/apg/` and `tests/visual/` out of jsdom. `package.json` script `test:controls`. CI per CTL-028 (MODIFY `certify-pr.yml`, QA-031, only if needed).

## 5. Tests to run
Local (light, no browser): `./node_modules/.bin/jest tests/controls src/components/field src/components/control-shared tests/lint/controls-guard.test.js`, `./node_modules/.bin/eslint 'src/components/{field,control-shared}/**'`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, `node scripts/docs/gen-selectors.mjs` (DX-105, once landed). Don't use `npx`.
Remote: push the branch; the CI job runs `npm run build`, `controls-css.test.ts` against the build output, `controls-api-report.test.ts` against the API report, and the Storybook build + test runner over `Flagships/Controls/Field*` (GitHub Actions or `auraone-remote-run`; read `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md` and `reference/ci-selection.md` first). Never local Docker, never a local browser.

## 6. Visual evidence
Remote Storybook static build artifact with `Flagships/Controls/Field` and `Fieldset` (Overview, Matrix, Density, InContext, Preferences) captured by QA's L6 Environment visual capture (QA-031 `certify-pr.yml`). Screenshots are reviewed by people; don't claim visual approval.

## 7. Integrity rules (binding)
No mocked Base UI (`jest.mock('@base-ui/react…')` is forbidden), no placeholder parts, no `.skip`/`.only`/`.todo`/`xit`, no `eslint-disable` in `$CONTROLS`, no lowered thresholds, no `-u`/`--update-snapshots`, no hand-edited generated files. A suite that can't find its input (API report, build CSS) fails; it does not pass vacuously. Don't edit 4.x components to make a suite pass.

## 8. Exit criteria
- CTL-001 passes, or the report lists every missing Base UI part with its fallback owner.
- AC-CTL-02: `controls-api-report.test.ts` green (0 `@base-ui`, 0 forbidden props) for Field/Fieldset.
- AC-CTL-04: `controls-hooks.test.tsx` green; `npm run lint:check` 0 errors in `$CONTROLS`; `controls-guard.test.js` proves each ban.
- AC-CTL-05: `controls-css.test.ts` green on the remote build; static lint green.
- AC-CTL-03 / -12 / -20 harness: contract, SSR and meta suites green for Field; DX-105 `scripts/docs/gen-selectors.mjs` exits 0 over the Field metas.
- REQ-CTL-94: toggling `error` undefined → string → undefined across 6 renders throws nothing (`Field.test.tsx`).

## 9. Final report format
```
PROMPT-09a REPORT
Branch/SHA:
Tasks: CTL-001..028 -> done|blocked (reason) each
Base UI pin: <version>; missing parts: <list or none> (fallback owner)
Token/CSS var names used: (exact list)
Prereq blockers: (exact failing command + output)
Tests: name -> pass/fail (local | remote run URL)
Deviations from PRD/architecture: (each with evidence) or none
Files changed: (list)
```
