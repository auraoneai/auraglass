# PROMPT-03a (DS): 4.2 honesty items, private-var rename, 4.x value freeze

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03). Requirements: REQ-DS-07, REQ-DS-30 (4.2 part), REQ-DS-42, plus the 4.2 `--glass-opacity-*` D-28 fix in §9/§20 step 1. Contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding): SC-36 takes both the `getPersona*` change and the opacity fix **out of 4.1.1** (4.1.1 contents are TRUST-only). `getPersona*` becomes C-D in 4.2 and is removed in 5.0; the opacity fix is a D-28 labelled visual fix in 4.2. This split still needs human confirmation (PRD §21 OI-01). If it is overturned, stop and report; do not ship anything on a 4.1.1 branch. Acceptance: AC-DS-17 (`src/` half), AC-DS-07 (4.2 half), and the 03a precondition for AC-DS-14 (the freeze). Tasks: `docs/auraglass-5/tasks/DS.json` DS-001..DS-012. Architecture: `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §4.4 (namespace), §14 (change classes C-I/C-D), D-27 (4.x pixel stability), D-28 (labelled fixes).

## 0. Common rules (binding)

- Remote-first. Node-only Jest files and `npm run build:tokens` may run locally. Anything browser-based (Playwright, visual, Storybook build) and full `npm run build` run remotely: in GitHub Actions on `auraoneai/auraglass` (choose public or private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 worker via the `auraone-remote-run` skill. Never use local Docker. Never run a local Playwright browser.
- Don't fake completion. That means no mock or placeholder implementations, no `test.skip`/`.only`/`xit`/`describe.skip`, no lowered thresholds, and no `-u`/`--updateSnapshot`/`--update-baselines` run to get to green. In this prompt you must regenerate two snapshots (DS-006, DS-009). After regenerating, run `git diff` on each `.snap` file. The only changed lines allowed are the ones listed in that task. Paste the filtered diff into the report. Any other changed line means stop, revert the snapshot, and report it.
- Don't hand-edit generated files. `src/tokens/generated.ts` is produced by `scripts/build-tokens.js`.
- Write only the files listed in §2.

## 1. Prerequisites (verify before any edit; stop with a blocker report if one fails)

1. `git ls-remote --heads origin release/4.x` returns a ref (REL branch policy, `PROMPT_01_REL`). If it returns nothing, do DS-011/DS-012 on `main` only and report DS-001..DS-010 as blocked on REL.
1a. REL anchors exist (owner prompt `PROMPT_01_REL`): `docs/schemas/deprecations.schema.json` (REL-010), `scripts/release/visual-class.mjs` (REL-040), `.github/workflows/change-class.yml` (REL-052). If one is missing, mark DS-001 (REL-010), DS-004/005 (REL-040) or DS-007/008 (REL-052) as blocked on that task.
2. HEAD of the target branch contains `scripts/build-tokens.js` lines that emit `getPersona` (`rg -n "getPersona" scripts/build-tokens.js` shows `:440` and `:448`).
3. `rg -o --no-filename -- "--ag-[a-z0-9-]+" src | sort -u | wc -l` prints `28`, and `rg -l -- "--ag-[a-z0-9-]+" src` lists exactly these 8 files: `src/components/marketing/{marketing.css,AuroraBackground.tsx,AuroraOrb.tsx,AuroraOrb.test.tsx,LogoMark.tsx}` and `src/components/navigation/{GlassTabBar.module.css,styled.tsx,__snapshots__/GlassTabBar.test.tsx.snap}`. If the set differs, put the new set in the report and rename that set.
4. `rg -n "glass-opacity-(24|32|52|72)" src` lists `GlassTransitions.tsx:410,867,869`, `AdvancedAnimations.tsx:255` and the `GlassTransitions.test.tsx.snap:42` line.

## 2. File scope

May touch: `scripts/build-tokens.js` (lines 430-460 only), `src/tokens/generated.ts` (regenerated), `src/components/animations/GlassTransitions.tsx`, `src/components/animations/AdvancedAnimations.tsx`, `src/components/animations/__snapshots__/GlassTransitions.test.tsx.snap`, the 8 files in §1.3, `CHANGELOG.md` (4.2.0 section only), and these NEW files: `tests/tokens/types-runtime-parity.test.ts`, `tests/tokens/no-undefined-opacity.test.ts`, `tests/tokens/private-ag-namespace.test.ts`, `tokens/legacy/4x-rendered.tokens.json`, `tests/tokens/legacy-freeze.test.ts`, `scripts/tokens/freeze-4x.mjs`.

Must not touch: any other `src/**`, `src/styles/**`, `tokens/personas/**`, `tokens/index.json`, `package.json` dependencies, `registry/**`, the other PRDs' files, `docs/auraglass-5/**` (except your report as a PR comment).

## 3. Steps

### DS-001..DS-003: types/runtime honesty (4.2 C-D, REQ-DS-30, TOKENS-THEME-08, SC-36)
1. In `scripts/build-tokens.js` (`:440-455`), keep emitting `getPersona` and `getPersonaModeTokens`, but prefix each with `/** @deprecated Never implemented at runtime; removed in 5.0.0. */`. The runtime `dist/tokens/index.mjs` never exported them. Do not add a runtime implementation. The repo-root `deprecations.json` entry (since 4.2.0, removeIn 5.0.0, codemod null) is added in 03f DS-105 by MODIFY. Do not create or edit `deprecations.json` here.
2. Run `npm run build:tokens` and commit the regenerated `src/tokens/generated.ts`. `rg -n "@deprecated" src/tokens/generated.ts` must show both names.
3. Write `tests/tokens/types-runtime-parity.test.ts` (4.2 form). Use the TypeScript compiler API (`ts.createProgram` on `dist/tokens/index.d.ts`, `checker.getExportsOfModule`) to collect value export names. Compare them to `Object.keys(require('../../dist/tokens/index.cjs'))` and to the ESM keys from `await import('../../dist/tokens/index.mjs')`. Assert that the sets differ by exactly `{getPersona, getPersonaModeTokens}` (type-only) and that both carry `@deprecated`. The test builds `dist/tokens` first through `npm run build:tokens` in `beforeAll` (Node only, local OK). 03d replaces the comparison source with `etc/api/tokens.exports.json` (SC-04) and empties the allowlist for 5.0.

### DS-004..DS-006: undefined `--glass-opacity-*` (4.2 D-28 labelled visual fix, TOKENS-THEME-10, SC-36)
4. Replace each undefined step with the nearest defined ladder step in `src/styles/tokens.css`/`variables.css` (defined: 0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,90,95,100): `24→25`, `32→30`, `52→50`, `72→70`. Sites are `GlassTransitions.tsx:410` (52), `:867` (24), `:869` (72), and `AdvancedAnimations.tsx:255` (32). Today the browser drops the whole declaration, so the change is visible. Record it in `CHANGELOG.md` under 4.2.0 "Fixed" with the D-28 label, naming the four sites. REL adds the D-28 list entry (SC-36) and classifies the PR with `scripts/release/visual-class.mjs` (REL-040, SC-09).
5. Regenerate only `GlassTransitions.test.tsx.snap` (`npx jest src/components/animations/GlassTransitions.test.tsx -u`). The diff may change only `--glass-opacity-72` → `--glass-opacity-70` (and any other replaced token on the same lines).
6. Write `tests/tokens/no-undefined-opacity.test.ts`. It collects every `--glass-opacity-<n>` referenced in `src/**/*.{ts,tsx,css}` and every one defined in `src/styles/**/*.css`, then asserts referenced ⊆ defined. Fixture case: a string with `--glass-opacity-24` must be reported.

### DS-007..DS-010: private `--ag-*` → `--_ag-*` (4.2, REQ-DS-07, C-I)
7. In the 4 marketing files and 2 navigation files, rename every `--ag-<name>` to `--_ag-<name>`. Rename definitions and reads together, including `var(--ag-…)` inside template strings and `style` objects. Keep the names otherwise identical.
8. Update `AuroraOrb.test.tsx` assertions to the new names. Regenerate `GlassTabBar.test.tsx.snap`. Its diff may contain only `--ag-` → `--_ag-` replacements: check this with `git diff -U0 -- <snap> | rg '^[+-][^+-]' | rg -v -- '--_?ag-'`, which must print nothing.
9. Write `tests/tokens/private-ag-namespace.test.ts`. It asserts `rg`-equivalent scanning of `src/**` (excluding `src/tokens/generated/**`, which doesn't exist yet) finds 0 `--ag-` names that aren't preceded by `_`. In 03d this becomes the manifest check of the `undefined-vars` gate.
10. `CHANGELOG.md` 4.2.0 "Changed (C-I)": marketing/navigation private custom properties renamed `--ag-*` → `--_ag-*`. They were undocumented, and the `--ag-*` namespace is reserved for the 5.0 public manifest.

### DS-011..DS-012: freeze 4.x rendered values (REQ-DS-42, D-27)
11. Write `scripts/tokens/freeze-4x.mjs`. It imports `src/tokens/glass.ts` through the existing `ts-node` devDependency (`^10.9.2`; `tsx` isn't installed, and you add nothing). It also parses `src/styles/tokens.css` with the `postcss` that is already installed transitively (`node_modules/postcss`). Its output is `tokens/legacy/4x-rendered.tokens.json` (DTCG: `$value`, `$type`, `$extensions.ag.tier: "legacy"`), containing:
   - the `buildSurfaceStyles` gradient at `glass.ts:997`, the fill at `:1001`, the border at `:1030`, and the blur ternary result per `{intent, elevation, tier}`;
   - every `--glass-*` primitive declared in `src/styles/tokens.css` `:root`, with its literal value.
   Write the values exactly as rendered, with no rounding. Run it once and commit the JSON.
12. Write `tests/tokens/legacy-freeze.test.ts` (03a form). It re-runs the extraction in memory and asserts deep equality with the committed JSON. That catches drift if anyone edits `glass.ts`/`tokens.css` before retirement. It also asserts ≥ 1 entry per `--glass-*` primitive in `tokens.css` (count logged). 03f extends this test with the `legacy` Style Dictionary platform output.

## 4. Tests to run

- Local (Node): `npx jest tests/tokens/types-runtime-parity.test.ts tests/tokens/no-undefined-opacity.test.ts tests/tokens/private-ag-namespace.test.ts tests/tokens/legacy-freeze.test.ts src/components/animations src/components/marketing src/components/navigation`.
- Remote (GitHub Actions on the `release/4.x` PR): the workflows that exist on that branch (`design-system-compliance.yml`, and `visual-regression.yml` only as the 4.x evidence path, TRUST-062/SC-09), REL's `change-class` check, and `npm run test:visual:app-chrome`. Classify pixel changes with REL's `visual-class.mjs` (threshold 0.1, `changedRatio > 0.001`). Expected visual result: 0 changed pixels for the rename (DS-007..DS-009). For DS-004/DS-005 the only changed pixels are in the GlassTransitions/AdvancedAnimations stories, where the shadow or overlay now renders.

## 5. Visual evidence

Run this remotely: Storybook build plus Playwright capture of the `GlassTransitions` and `AdvancedAnimations` stories, before and after DS-004/DS-005, in Chromium at 1440×900, light and dark. Also capture before/after for `AuroraOrb`, `AuroraBackground`, `LogoMark` and `GlassTabBar` with a pixel diff that must be 0. Upload the captures as CI artifacts (D-32; don't commit PNGs). A human reviewer signs off on the GlassTransitions change as the labelled fix.

## 6. Exit criteria

- AC-DS-07 (4.2 half): `types-runtime-parity.test.ts` green. The only mismatches in `aura-glass/tokens` are the 2 `@deprecated` type-only names.
- AC-DS-17 (`src` half): `rg -o -- "--ag-[a-z0-9-]+" src` returns 0 names (all 28 are now `--_ag-*`).
- `no-undefined-opacity.test.ts` green, and `rg -n "glass-opacity-(24|32|52|72)" src` returns 0.
- `tokens/legacy/4x-rendered.tokens.json` committed and `legacy-freeze.test.ts` green (precondition for AC-DS-14).
- The remote pixel diff for the renamed components is 0.

## 7. Final report format

```
PROMPT-03a report
Branch/PRs: <url per PR>  (4.2 on release/4.x: DS-001..010; main: DS-011..012)
Prereqs: 1 <ok|blocked:...> 1a REL-010/040/052 <ok|blocked:...> 2 <ok> 3 <28 names / 8 files | delta> 4 <ok>
Tasks: DS-001 <done|blocked: reason> ... DS-012
Tests: <command> -> <pass count>/<total>, 0 skipped
Snapshot diffs (filtered): <pasted lines>
Remote CI: <run urls>; visual artifacts: <artifact urls>; pixel diff renamed comps = <n>
AC: AC-DS-07(4.2) <pass|fail>, AC-DS-17(src) <pass|fail>
REL actions: D-28 list entry for --glass-opacity-* (<done|requested>); SC-36 human confirmation (<recorded in docs/release/decisions/|pending>)
Open issues / deviations: <list with evidence>
```
