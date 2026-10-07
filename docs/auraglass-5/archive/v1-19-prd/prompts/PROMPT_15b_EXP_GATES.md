# PROMPT-15b (EXP): Export budget, delivery check, no-simulation lint, import/network/registry-only gates

Source PRD: `docs/auraglass-5/prd/AURAGLASS_COMPONENT_EXPANSION_PRD.md` (Key **EXP**, self-id PRD-15). Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` (SC-12 manifest, SC-16 lint plugin, SC-27 meta, SC-32 registry, SC-39 artifact.yml). Requirements: **REQ-EXP-03, -07, -08, -09, -10, -11, -12, -32, -33 (absence half), -34**, plus §13.3 story-id resolution. Acceptance: **AC-EXP-03, -04, -05, -06, -13 (manifest half), -14 (core half)**. Tasks: `docs/auraglass-5/tasks/EXP.json` EXP-025..EXP-046. Index: `docs/auraglass-5/prompts/PROMPT_15_EXP.md`.

## 1. Context

Repo `/Users/gurbakshchahal/platforms/AuraGlass`, baseline 4.1.0 at `15b6de6f7`. Branch `exp/15b-gates` from `main` after 15a merged. ESLint config is flat (`eslint.config.js`, 79 lines) loading the local plugin `eslint-plugin-auraglass.js` (598 lines, rules `no-inline-glass`, `require-glass-tokens`, `no-raw-tailwind`, `no-inline-style-attr`). `devDependencies.eslint` is `^8.45.0` and `@typescript-eslint/parser` `^8.59.2`: run `npx eslint --version` and use the matching `RuleTester` API (ESLint 8 flat: `require('eslint/use-at-your-own-risk').FlatRuleTester`; ESLint 9: `require('eslint').RuleTester`). If PKG has already bumped ESLint (PKG-015), use what is installed.

## 2. Files you may touch

- MODIFY `scripts/ci/verify-capability-ledger.mjs` (add `--enumerate-exports`, `--budget`, `--delivery` modes)
- MODIFY `docs/auraglass-5/capability-ledger.json` (only `exportDelta` corrections found by reconciliation, and `stories` ids)
- MODIFY `eslint-plugin-auraglass.js` (PKG owns the file, SC-16/OV-10: register rule `no-simulation` only; never recreate the file, do not edit existing rules)
- MODIFY `eslint.config.js` (PKG owns the file and its PKG-015 wiring: add config objects only; do not change the existing `src/**` object's rules)
- NEW `tests/capability/{export-budget,delivery,no-network,no-spatial-core,registry-only}.test.ts`
- NEW `tests/exports/expansion-no-alias.test.ts` (directory exists)
- NEW `tests/lint/no-simulation.test.ts`, NEW `tests/lint/restricted-imports.test.ts`, NEW `tests/lint/fixtures/**`
- MODIFY `.github/workflows/artifact.yml` (PKG-073 owns it, SC-39; add steps only)

Must not touch: `src/**` sources, `package.json` dependencies, `build/exports.manifest.json`, `registry/**`, other PRDs, any other workflow.

## 3. Prerequisites (owner prompts named; check, then choose mode)

- PROMPT-15a merged: `node scripts/ci/verify-capability-ledger.mjs` exits 0 on `main`.
- PKG-005 (PKG prompt) manifest: `test -f build/exports.manifest.json && node -e "JSON.parse(require('fs').readFileSync('build/exports.manifest.json'))"`.
- PKG-073 (PKG prompt) L2 Artifact workflow: `test -f .github/workflows/artifact.yml`.
- PKG-015 (PKG prompt) lint wiring for EXP-032..EXP-039.
- FND-005 (FND prompt) parts registry and `<Component>.meta.ts` format, for delivery mode (b).
- DX-067 (DX prompt) `registry/registry.json`, for delivery mode (c).
- Storybook CI build artifact containing `storybook-static/index.json` (SB/QA): `rg -n "storybook-static" .github/workflows`.

**Blocked/ratchet mode:** if the manifest is absent, EXP-025..EXP-031 and EXP-041..EXP-043 are written and their tests run against a fixture manifest under `tests/capability/fixtures/manifest/` only; the PR description states "L2 Artifact gates not live: PKG-005 manifest missing". If `artifact.yml` is absent, EXP-044 is blocked on PKG-073: do not create a substitute workflow. Never fake a manifest in `build/`. Lint tasks (EXP-032..EXP-040) need only PKG-015.

## 4. Steps

1. **EXP-025 enumerator.** `--enumerate-exports <installDir> --out <file>`: reads `build/exports.manifest.json` entries, expands wildcard subpaths from the files present in `<installDir>/node_modules/aura-glass`, `await import()`s each subpath from `<installDir>` (Node, ESM, `--conditions=react-server` **not** set), writes `{ "<subpath>": [sorted value names] }`. Exit 1 if any subpath fails to import.
2. **EXP-026 / EXP-027 budget (REQ-EXP-07, -09).** `--budget <exports.json>`: root (`"."`) value names ≤160; total across subpaths ≤250; for every ledger row with `form` incl. `export` and `status: "delivered"`, every `names` value appears in its `subpath` (or root); ledger Σ`exportDelta` over delivered rows equals the number of those names found (difference > 0 prints both numbers, exit 1). Headroom (only with `--ga`, REQ-EXP-09): `160 - root ≥ 1` **and** `250 - total ≥ 5` (one root slot for `OtpField` plus four subpath slots for `DateTimePicker`, `Chart`, `Waveform` (5.1, SC-12) and `CompareSlider`; root names count toward the total).
3. **EXP-028** `tests/capability/export-budget.test.ts`: "root ≤160 and total ≤250", "ledger count = manifest count", "5.1 headroom" (asserts the `--ga` branch with a fixture at 159/245 → pass, 160/245 → fail, 159/246 → fail), and against the real `exports.json` when `AURAGLASS_EXPORTS_JSON` points at it (CI sets it; the test fails, not skips, if the variable is set but the file is missing). **EXP-046** adds "no rejected name is a value export": every `names` entry of X-R01..X-R13 absent from every subpath (AC-EXP-13 manifest half).
4. **EXP-029** `tests/exports/expansion-no-alias.test.ts`: the 12 names `Autocomplete`, `TagInput`, `HoverCard`, `NotificationCenter`, `Banner`, `Lightbox`, `Dock`, `NavBar`, `ModelPicker`, `QueryBuilder`, `TraceTree`, `Artifact` are absent from every subpath of the enumerated exports (REQ-EXP-08, AC-EXP-05).
5. **EXP-030 delivery (REQ-EXP-03, §13.3).** `--delivery --exports <file> --storybook-index <file> --version <semver>`: for rows with `release` ≤ the major.minor of `--version` and `status: "delivered"`, each `names` entry resolves as (a) value in `exports[subpath]`, (b) `data-ag-part` value in the owner's `src/**/<Component>.meta.ts` (SC-27, FND-005 format; if no `*.meta.ts` exists yet, (b) fails loudly with the file it looked for), or (c) an entry in `registry/registry.json` (DX-067) `items[].name` with `type` `registry:block|registry:item` and built `apps/docs/public/r/<name>.json` present (SC-32). Every `stories` id must exist in `storybook-static/index.json` `entries`. With `--version 5.0.0-rc.1` (or any `5.0.0-rc.*`/`5.0.0`), every 5.0 P0 and P1 row must be `delivered`; list the undelivered ids.
6. **EXP-031** `tests/capability/delivery.test.ts`: fixture-based cases for (a)/(b)/(c) and a missing story id; "all 5.0 P0/P1 delivered at rc" runs the real ledger with `--version` from `AURAGLASS_RELEASE_VERSION` (the release workflow sets it at the `v5.0.0-rc.1` tag). **EXP-043** "charts subpath absent in 5.x before 5.1": `./charts` is not a key of the enumerated exports when `--version` < 5.1.0 and is present at ≥5.1.0 (REQ-EXP-33 absence half, mirrors REQ-DATA-75).
7. **EXP-032..EXP-034 rule `auraglass/no-simulation` (REQ-EXP-10).** MODIFY of the PKG-owned plugin (SC-16): add the rule to the existing `rules` map; never CREATE the file. Messages: `mathRandom`, `fakeProgressTimer`, `mockBlob`, `demoDataDefault`. Flag `Math.random` member access unless its nearest enclosing function is (i) the value of a JSX attribute whose name matches `^on[A-Z]`, or (ii) a function declaration/const whose every reference in the file is such a JSX attribute value; render bodies, `useEffect`/`useLayoutEffect` callbacks, `useState`/`useMemo`/`useRef` initialisers, module scope and timer callbacks are flagged. Flag `setTimeout`/`setInterval` whose callback calls an identifier matching `^set[A-Z]` with a numeric literal or a `prev => prev + <literal>` argument. Flag `new Blob([` whose first array element is a string/template literal. Flag default parameters / `defaultProps` values that are array literals with ≥3 object-literal elements.
8. **EXP-035** `tests/lint/no-simulation.test.ts`: invalid cases — `Math.random()` in a component body, in `useEffect`, in `useState(() => Math.random())`, at module scope, in `setTimeout`; `setInterval(() => setProgress(p => p + 10), 300)`; `new Blob(["mock audio data"], { type: 'audio/webm' })` (the 4.x `GlassChatInput.tsx:303` shape); `function List({ items = [{a:1},{a:2},{a:3}] })`. Valid — `<button onClick={() => Math.random()}>`; `const pick = () => Math.random(); <b onClick={pick}/>`; `useId()`; `new Blob([buffer])`; `items = [{a:1},{a:2}]`.
9. **EXP-036 enable (eslint.config.js).** New config object, `files`: `src/date/**`, `src/data/**`, `src/charts/**`, `src/ai/**`, `src/media/**`, `registry/blocks/**`, `registry/items/**`, `packages/labs/**`, and an explicit `src/app-shell/` + T2 per-file list held in a constant `EXP_REALITY_FILES` at the top of the config (start empty for `src/app-shell` 4.x files; each 5.0 rewrite PR appends its file — never add 4.x files). Rule `auraglass/no-simulation: 'error'`. Then run `npx eslint src/data` locally (light) and report the count (AC-EXP-06 requires 0).
10. **EXP-037 / EXP-038 restricted imports (REQ-EXP-11).** Config object for `registry/**` and `packages/labs/**`: `no-restricted-imports` `patterns` forbidding `**/src/components/**/{Glass,LiquidGlass,Enhanced}*`, `**/src/hooks/**`, `**/src/utils/**`, `aura-glass/compat`, and any `aura-glass/*` deep path not a manifest subpath. `tests/lint/restricted-imports.test.ts` lints `tests/lint/fixtures/registry/bad-import.tsx` (imports `../../../../src/components/input/GlassCombobox`) through `ESLint` with `overrideConfigFile` = repo config and `filePath` mapped to `registry/blocks/fixture/bad-import.tsx`; expects one `no-restricted-imports` error.
11. **EXP-039 / EXP-040 spatial (REQ-EXP-32).** Config object `files: ['src/**']`, `ignores: ['src/three/**']`: `no-restricted-imports` paths `three`, patterns `@react-three/*`; `no-restricted-properties` `{ object: 'navigator', property: 'xr' }`. `tests/capability/no-spatial-core.test.ts`: walks `src/` (excluding `src/three/`) and asserts 0 files match `/from ['"](three|@react-three\/)/` or `navigator\.xr`; plus a lint fixture that fails. Record today's count at HEAD in the report; if >0, list files and their FND removal disposition (FND-103), do not allowlist them.
12. **EXP-041** `tests/capability/no-network.test.ts` (REQ-EXP-12, L2 Artifact): reads the packed `dist/` entry of `./ai` (resolve via `package.json#exports`), and the source files of registry entries `ai-model-picker`, `ai-artifact-panel`, `ai-trace-tree`, `ai-eval-dashboard`, `media-transcript`, `presence-stack`, `comment-thread`, `commerce-cart`, `commerce-checkout`, `pricing` (excluding `ai-sdk-adapter`); asserts 0 matches of `fetch(`, `XMLHttpRequest`, `WebSocket(`, `EventSource(`. Entries not yet present are reported in the test output as "not yet built: <id>" and the ledger row for each must not be `delivered` (asserted), so absence never passes a delivered row.
13. **EXP-042** `tests/capability/registry-only.test.ts` (REQ-EXP-34, Artifact): `ProductCard|CartSummary|CheckoutSteps|PricingTable|PlanComparison|PresenceStack|CommentThread` match 0 times across all files of the unpacked tarball `dist/`.
14. **EXP-044 / EXP-045 L2 Artifact wiring + reconciliation.** MODIFY PKG's `.github/workflows/artifact.yml` (PKG-073; remote CI only): `npm ci && npm run build && npm pack`, install the tarball into a scratch dir, run `--enumerate-exports`, upload `exports.json` as artifact `exports-<sha>`, then `--budget`, the five Artifact-lane test files with `AURAGLASS_EXPORTS_JSON`, and `--delivery` with the Storybook index artifact when present. Fix ledger `exportDelta` values the reconciliation proves wrong (EXP-045), citing the owner line per change.

## 5. Running

Local (light): `npx jest tests/lint tests/capability/no-spatial-core.test.ts tests/exports/expansion-no-alias.test.ts --ci` against fixtures, `npx eslint <single dir>`. `npm run build`, `npm pack`, tarball install and the Artifact tests run only in CI or on an `auraone-remote-run` worker. No browser work here.

## 6. Prohibitions

No `eslint-disable` comments added anywhere to get 0 violations; no file globs dropped from step 9 to hide violations; no `continue-on-error`; no skip/only/todo; no editing the 160/250/1/4 numbers; no committing `exports.json` or a hand-written manifest.

## 7. Exit criteria

- AC-EXP-04: Artifact run shows root ≤160, total ≤250, ledger = manifest, headroom check implemented (asserted live at GA).
- AC-EXP-05: `expansion-no-alias.test.ts` green on the real tarball.
- AC-EXP-06: `auraglass/no-simulation` 0 violations in the enabled dirs; `no-network.test.ts` green.
- AC-EXP-03: delivery check implemented; at `5.0.0-rc.1` it runs in the release workflow (record the job name).
- AC-EXP-13 (manifest half), AC-EXP-14 (core half): green.

## 8. Final report

```
PROMPT-15b report
branch / SHA / PR / mode (live | ratchet: <missing prereq>):
Artifact run URL + exports artifact name:
root values / total values / free root / free subpath:
ledger-vs-manifest diff (should be 0):
no-simulation: enabled globs; violations per dir:
three/navigator.xr hits outside src/three at HEAD:
undelivered 5.0 P0/P1 rows today (ids):
exportDelta corrections (row: old -> new, owner line):
deviations used / new deviations with evidence:
blockers:
```
