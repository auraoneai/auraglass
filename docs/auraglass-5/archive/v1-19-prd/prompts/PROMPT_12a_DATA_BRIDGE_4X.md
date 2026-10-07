# PROMPT-12a (DATA): 4.2/4.3 bridge — chart.js globals, lazy date-fns, optional peers, deprecations

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Work on `release/4.x` (create it from the 4.1.x tag per PRD-REL branch policy `docs/release/branch-policy.md` if it does not exist; never commit 4.x bridge work to `main`).

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §2.1 (E-01..E-05), §2.4 (E-29, E-30), §5.12 (REQ-DATA-78, REQ-DATA-79), §9, §10.1 (A-01..A-05), §11 items 1–3, 5–8, §20 steps 1 and 3, §21 (OI-14, OI-15).
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-02/SC-03 (deprecations file and schema), SC-33 (codemod ids), SC-36/SC-37 (4.x scope and the interim bridge owner REL).
- Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` D-27, D-28, §14.
- Evidence: `docs/auraglass-5/autopsy/performance.md` (PERFORMANCE-02), `autopsy/runtime-local.md:30,42`.
- PRD-REL: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` (deprecations schema REL-010, `warnDeprecated` REL-072, change-class gate REL-052).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-001..DATA-015.

Requirements: REQ-DATA-78, REQ-DATA-79, A-01..A-05. Acceptance: AC-DATA-04, AC-DATA-05, AC-DATA-15 (4.x half).

Numbering: cite PRDs by key (SC-01). The 4.2/4.3 bridge (§16 PRD-17) is held by PRD-REL as interim owner (SC-37); `doctor` is PRD-DX (DX-035). See `prompts/PROMPT_12_DATA.md`.

## 2. Scope
May modify: `src/components/charts/GlassDataChart.tsx`, `src/components/charts/components/ChartRenderer.tsx`, `src/components/charts/ModularGlassDataChart.tsx`, NEW `src/components/charts/utils/registerChartJs.ts`, `src/utils/dateAdapters.ts`, `src/lib/GlassLocalizationProvider.tsx`, `package.json` (`dependencies`, `peerDependencies`, `peerDependenciesMeta` only), `README.md` (lines 373, 380 only), `deprecations.json` at the repo root (entries only, SC-02), `CHANGELOG.md`, and render-time warning calls in the component files listed in DATA-010/DATA-011.
May create: `src/components/charts/GlassDataChart.globals.test.tsx`, `src/utils/dateAdapters.test.ts`, `tests/exports/root-no-date-fns.test.ts`, `tests/exports/peer-meta-4x.test.ts`, `tests/deprecations/data-4-2.test.ts`, `tests/deprecations/data-4-3.test.ts`, `tests/deprecations/data-warnings.test.tsx`, `docs/migration/date.md`, `docs/migration/data-table.md`, `docs/migration/charts.md`.
Must NOT touch: `src/index.ts` exports, anything under `src/data/**`, `src/date/**`, `src/charts/**` (5.0 code), the deprecation helper or schema (PRD-REL owns them: REL-072, REL-010), the `deprecations.json` envelope (TRUST-075 seed), `.github/workflows/publish-npm.yml`, any `main`-branch file. No visual change other than the intended consumer-tooltip fix.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- PRD-TRUST seed and PRD-REL schema/helper (anchors TRUST-075, REL-010, REL-072): `test -f deprecations.json && node -e "const d=require('./deprecations.json'); if(d.version!==1) process.exit(1)"` at the repo root (not `docs/deprecations.json`, SC-02; see PRD §21 OI-14), `test -f docs/schemas/deprecations.schema.json`, and `test -f src/internal/warnDeprecated.ts`. If missing, do DATA-001..008 and DATA-012..015, and report DATA-009..011 blocked on the missing anchor.
- PRD-DX `doctor` (DX-035) reports undeclared direct imports of chart.js/react-chartjs-2/date-fns (needed before shipping DATA-008): `rg -n "date-fns|chart.js" packages/cli/src/commands/doctor.ts`. If absent, land DATA-008 on the branch but mark the 4.2 release item blocked on DX-035.
- PRD-REL change-class gate on `release/4.x` (REL-052): `test -f .github/workflows/change-class.yml`; if absent, record it as a release blocker (the code work can proceed).
- Baseline check: `git merge-base --is-ancestor 15b6de6f7 HEAD`.

## 4. Steps
1. **DATA-002 first (shared helper).** Create `src/components/charts/utils/registerChartJs.ts` exporting `ensureChartJsRegistered()` with a module-level `let registered = false`. It calls `ChartJS.register(...)` with exactly the controllers/elements/scales/plugins the three files register today. No code runs at import.
2. **DATA-001.** In `GlassDataChart.tsx`, delete the module-scope `ChartJS.register` calls at `:649`, `:712`, `:714`, `:733` and the `defaults.*` writes at `:718` (`plugins.tooltip.enabled = false`), `:721` (`font.family`), `:725` (`color`) and any other `defaults` assignment in `:649-745`. Call `ensureChartJsRegistered()` from a `useState(() => { ensureChartJsRegistered(); return true; })` initializer. Move the former defaults into the per-chart `options` object (`plugins.tooltip.enabled: false`, `font`, `color`) so GlassDataChart's own look is unchanged.
3. **DATA-002/003.** Do the same in `ChartRenderer.tsx:36` and `ModularGlassDataChart.tsx:130`. Then run `rg -n "register\(|defaults\." src/components/charts` and fix any remaining module-scope hit. List every site you changed in the report.
4. **DATA-004.** Write `GlassDataChart.globals.test.tsx`: the consumer registers chart.js, snapshots `Chart.defaults.plugins.tooltip.enabled`, `.color`, `.font.family`, spies on `Chart.register`, does `await import('../../index')`, asserts 0 register calls and unchanged defaults, renders one `GlassDataChart`, and asserts `Chart.defaults.plugins.tooltip.enabled === true`. Prove the test is meaningful: revert step 2 locally, see it fail, restore.
5. **DATA-005.** In `dateAdapters.ts`, replace `loadOptionalDateLibrary`'s `require(packageName)` (`:43-45`, callers `:58`, `:141`) with `export async function loadDateAdapter(name)` using `await import(name)`. The error for a missing package reads exactly `aura-glass: install <name> to use the <name> date adapter`. Keep old sync exports as deprecated wrappers that throw an error pointing at `loadDateAdapter`. Write `src/utils/dateAdapters.test.ts`.
6. **DATA-006.** In `GlassLocalizationProvider.tsx`, remove the static `import { format, parse, isValid, addDays, addMonths, addYears } from "date-fns"` (`:9`). Load via `loadDateAdapter('date-fns')` in an effect, render children immediately, expose `ready` in context, and fall back to `Intl.DateTimeFormat(locale)` until ready. Existing tests of the provider must pass unchanged in assertions; if one depends on synchronous date-fns, update it only to `await` readiness and say so in the report.
7. **DATA-007.** `tests/exports/root-no-date-fns.test.ts`: esbuild bundle of `import { GlassButton } from 'aura-glass'` against the built `dist` (remote job, after `npm run build`), metafile inputs matching `node_modules/date-fns` = 0.
8. **DATA-008.** `package.json`: move `chart.js` (`:491`), `date-fns` (`:495`), `react-chartjs-2` (`:504`) from `dependencies` to `peerDependencies` with `peerDependenciesMeta.<name>.optional = true`, reconciling with the existing peer entry at `:377`. Fix `README.md:373,380`. Add `tests/exports/peer-meta-4x.test.ts`.
9. **DATA-009/010 (4.2).** Add the A-04 entries to the repo-root `deprecations.json` (list in DATA-009) with `replacement`, `codemod` (an SC-33 id such as `canonical-names`, `prop-grammar`, `removed`, `deps`, or null) and `docs` from PRD §9, validated against `docs/schemas/deprecations.schema.json`, and render-time `warnDeprecated(id)` calls (REL-072) in the files listed in DATA-010. Tests: `tests/deprecations/data-4-2.test.ts`, `tests/deprecations/data-warnings.test.tsx` (one warning in development across two renders, zero in production).
10. **DATA-011 (4.3).** Same for the A-05 names, `tests/deprecations/data-4-3.test.ts`.
11. **DATA-012..014.** Write `docs/migration/date.md`, `data-table.md`, `charts.md` with the content specified in each task. The `charts.md` chart.js adapter example registers chart.js inside the component. Selector tables are generated by PRD-DX tooling; if it is not available, write the table by hand from the 4.x class names (`rg -o "glass-data-table-[a-z-]+" src | sort -u`) and mark it `hand-written; regenerate with scripts/docs/gen-selectors`.
12. **DATA-015.** `CHANGELOG.md` 4.2 entries: chart.js, react-chartjs-2, date-fns listed first; bug-fix entry naming `Chart.defaults`. Produce a remote before/after composite (4.1.0 vs branch) of a consumer-style chart.js chart with tooltips, as a CI artifact. Request the D-28 reviewer approval on the PR.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest src/components/charts/GlassDataChart.globals.test.tsx src/utils/dateAdapters.test.ts tests/exports/peer-meta-4x.test.ts tests/deprecations`. Remote: `npm run build`, `tests/exports/root-no-date-fns.test.ts`, the full Jest suite, Storybook build, and the before/after capture. Attach run URLs.

Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote before/after PNGs of (a) a consumer chart.js line chart with hover tooltip (4.1.0: no tooltip; 4.2: tooltip), and (b) the existing `GlassDataChart` default story (must look identical). Upload as CI artifacts and link them; a human reviewer approves. Do not commit images.

## 7. Integrity rules (binding)
No mock implementations of chart.js or date-fns in the globals/root tests (use the real packages). Don't skip or `.only` tests, don't delete assertions from existing chart/date tests, don't update snapshots to hide a visual change in GlassDataChart. No local Docker or local browser.

## 8. Exit criteria
- AC-DATA-04: `GlassDataChart.globals.test.tsx` green in CI; it fails when DATA-001 is reverted.
- AC-DATA-05: `root-no-date-fns.test.ts` reports 0 date-fns inputs on the 4.2 build (record the 4.1.0 count you measured).
- AC-DATA-15 (4.x half): every §9 name has an entry with `since` 4.2.0 or 4.3.0; warning tests green.
- A-02: peer metadata test green; README corrected; doctor dependency status reported.

## 9. Final report format
```
PROMPT-12a REPORT
Branch/SHA:
Tasks: DATA-001..015 -> done|blocked (reason) each
Registration sites changed: file:line list
date-fns root inputs: before=N (4.1.0) after=0 (cmd + CI URL)
Prereq blockers: (TRUST-075 seed, REL-010 schema, REL-072 helper, REL-052 gate, DX-035 doctor; exact command output)
Tests: name -> pass/fail (local|remote URL)
Visual evidence: artifact URLs + reviewer
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
