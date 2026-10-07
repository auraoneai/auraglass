# PROMPT-17b (SB): Story lint, test tooling and story typecheck

You are implementing part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`, Storybook 9.1.20). This prompt is self-contained. Other PRD numbers use architecture §16 numbering.

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` deviations 4, 6 and 7, §2 rows E9, E13, E15, E16, E19, §4.4 (`interaction` tag), §5.B REQ-SB-10, -13, -15, -16, §5.C REQ-SB-21, §5.D REQ-SB-23, §5.E REQ-SB-30..33, §5.G REQ-SB-45, -48, -49, §8, §12 (lint-titles/lint-story-copy/RuleTester rows), §20 step 2.
- Architecture: D-14 (no `Glass` prefix), D-24 (zero `!important`).
- Policy: `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`, `/Users/gurbakshchahal/.config/agent-policy/reference/remote-execution.md`.
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-020..SB-039 and SB-127.
- Shared contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-16 (all lint rules are `auraglass/<kebab>` in the existing `eslint-plugin-auraglass.js`, plugin file owned by PRD-PKG and wired by PKG-015; every task touching it is MODIFY), SC-30 (tests under `tests/<area>/`; lint tests under `tests/lint/`), SC-29 (`jest.config.js` is PRD-QA's, QA-003), SC-11 (scripts layout).

Requirements: REQ-SB-10, REQ-SB-13 (lint and copy tooling), REQ-SB-15 (runner), REQ-SB-16, REQ-SB-21 (lint half), REQ-SB-23 (lint half), REQ-SB-30, REQ-SB-31, REQ-SB-32 (warn and ratchet phase; the flip is SB-117 in 17f), REQ-SB-45, REQ-SB-49. Acceptance: AC-SB-09 in ratchet mode; AC-SB-10 clause "0 imports of deprecated test packages".

## 2. Scope
May create or modify:
- `eslint-plugin-auraglass.js` (MODIFY only, SC-16): add a shared `isLibraryElement` helper and the six rules `story-no-optics`, `story-no-important`, `story-no-ink-override`, `story-no-tone-class`, `story-no-stage-background`, `story-no-private-vars` (exposed as `auraglass/story-*`). Don't touch rules owned by other PRDs
- NEW `tests/lint/story-rules/<rule>.test.ts` (6 files + `helper.test.ts`), `tests/lint/story-rules/no-disable.test.ts`, `tests/lint/story-rules/ratchet.test.mjs`; NEW `scripts/storybook/story-lint-baseline.json`, `scripts/storybook/story-lint-ratchet.mjs`
- `eslint.config.js`: add flat-config blocks. Don't change the existing `src/**` block's rules.
- `jest.config.js` (owned by PRD-QA, QA-003; MODIFY by SB-127 only): add `<rootDir>/tests/storybook/`, `<rootDir>/tests/showcase/` and `<rootDir>/tests/lint/story-rules/` to the matched roots; exclude `*.test.mjs` (those run under `node --test`)
- `package.json`: `scripts` (`lint:stories`, `lint:stories:ratchet`, `test-storybook`, `typecheck:stories`, `lint:titles`, `lint:story-copy`, `gates:stories`; append the light ones to `lint:ci`), `devDependencies` per REQ-SB-45/31 (exact pins only)
- Import rewrite in the 53 files that import `@storybook/(test|jest|testing-library)` (`rg -l "@storybook/(test|jest|testing-library)['\"]" src .storybook`). Change the import specifier only.
- `.storybook/main.ts`: add `'@storybook/addon-vitest'` to `addons` only. 17c owns the rest of this file.
- NEW `vitest.storybook.config.ts`, NEW `.storybook/vitest.setup.ts`, NEW `tsconfig.storybook.json`, NEW `scripts/storybook/tsc-stories-baseline.json`
- NEW `scripts/storybook/lint-titles.mjs`, `lint-story-copy.mjs`, `static-gates.mjs`, `count-tsc-errors.mjs`, NEW tests `tests/storybook/lint-titles.test.mjs`, `lint-story-copy.test.mjs`, `static-gates.test.mjs` + fixtures
- `.github/workflows/storybook-tests.yml` (created by 17a): add jobs `lint-gates` and `vitest`

Must NOT touch: story contents beyond the import specifier, component source, `.storybook/preview.tsx`, other PRDs' rules inside `eslint-plugin-auraglass.js` (PKG hydration rules, MAT `no-optics-outside-material`/`no-inline-glass`, PERF, MOT, A11Y, OVL, AI, EXP, FND rules), `deploy-storybook.yml`. Don't fix existing violations to shrink the baseline. That is the per-family work in 17e/17f.

## 3. Prerequisites
- 17a merged: `test -f .github/workflows/storybook-tests.yml && test -f scripts/storybook/verify-fresh.mjs`.
- PKG-015 landed (ESM/CJS conversion and plugin wiring; `PROMPT_02a_PKG_BUILD.md`): `node -e "require('./eslint-plugin-auraglass.js')"` or its ESM equivalent loads, and `eslint.config.js` registers the `auraglass` plugin. QA-003 landed (`PROMPT_18a_QA_HARNESS_FOUNDATION.md`) before SB-127. If either is missing, write the rules and tests and report the wiring as blocked.
- Versions: read `node_modules/storybook/package.json` `version`. `@storybook/addon-vitest` must equal it exactly. Read that addon's `peerDependencies` (`npm view @storybook/addon-vitest@<v> peerDependencies --json`) and pin `vitest`, `@vitest/browser` and `playwright` to exact versions inside that range (Vitest 3.2.x for SB 9.1). Use `@vitest/browser-playwright` only if the addon's peers name it.
- PRD-02 stylelint decision does not affect this prompt (stylelint lands in 17f).
- Measure the baseline yourself before writing `scripts/storybook/story-lint-baseline.json`: `rg -o "backdropFilter|backdrop-filter" src -g '*.stories.tsx' | wc -l` (49 at HEAD), `rg -l "backdropFilter|backdrop-filter" src -g '*.stories.tsx' | wc -l` (27), `rg -l '!important' src -g '*.stories.tsx' | wc -l` (34). If your counts differ, commit what you measured and print both.

## 4. Steps
1. **SB-020 shared helper (MODIFY `eslint-plugin-auraglass.js`).** No new plugin package (SC-16). Add an internal `isLibraryElement(node, context)`: a JSX element whose identifier is bound by an import from a specifier matching `^aura-glass(/|$)`, or by a relative import resolving into `src/**` outside `.storybook/` (colocated stories). Ancestry is JSX ancestry within the same returned tree (REQ-SB-30). `Environment` is identified the same way.
2. **SB-021..026 rules** (each rule entry in `eslint-plugin-auraglass.js` has `meta.docs`, `meta.messages`, and a RuleTester test `tests/lint/story-rules/<rule>.test.ts` with ≥4 valid and ≥4 invalid cases):
   - `story-no-optics`: reports `style`/object keys `backdropFilter`, `WebkitBackdropFilter`, `filter`, `mixBlendMode`, and string/template literals containing `backdrop-filter`.
   - `story-no-important`: reports `!important` in template literals, string literals, `<style>` JSX children, and `*.module.css` (the CSS half is processed through a small processor registered in `eslint-plugin-auraglass.js`, or a stylelint rule if 17f adopts stylelint first; document which).
   - `story-no-ink-override`: reports `color`, `--ag-on-surface*` or `--glass-text-*` set via `style`, or via CSS-in-JS on a library component or on an ancestor JSX element of one (REQ-SB-03).
   - `story-no-tone-class`: reports `className` string/template/`clsx` args matching `/(^|\s)glass(-on-|-contrast|-neutral-|-level)/` or `/(^|\s)liquid-glass-/`.
   - `story-no-stage-background`: reports `background`, `backgroundColor`, `backgroundImage` or `background*` on any JSX ancestor of a library component, except an `Environment` element. Files under `.storybook/environment/**` are allowed only on the scene element (REQ-SB-31).
   - `story-no-private-vars`: reports any `--_ag-` occurrence outside `.storybook/lab/**`.
3. **SB-027 ratchet.** `scripts/storybook/story-lint-ratchet.mjs` runs ESLint programmatically with the six rules and writes per-rule `{ files, occurrences }`. `--check` fails if any number exceeds `story-lint-baseline.json`, and also if the numbers drop without the baseline being lowered in the same commit. That way the ratchet only moves down. `tests/lint/story-rules/ratchet.test.mjs` covers an increase failing and a decrease requiring a baseline edit.
4. **SB-028 `eslint.config.js`.**
   - Add a block for `['**/*.stories.tsx', 'showcase/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}']` with the TS parser and the existing `auraglass` plugin, all six `auraglass/story-*` rules at `warn`. `eslint.config.js` wiring is PKG-015's; this is a MODIFY that depends on it.
   - Add a block for `showcase/**` with `no-restricted-imports` patterns `**/src/**`, `@/**`, `**/.storybook/**`, `aura-glass/compat`, `aura-glass/compat/*`, plus `importNames` banning every 4.x export matching `^Glass[A-Z]` (generated from `rg -o "export \{?\s*Glass[A-Za-z]+" src/index.ts` into the config at lint time, not hand-typed). This is REQ-SB-23.
   - Add a block for `src/**` and `showcase/**` banning imports of `**/.storybook/lab/**` (REQ-SB-21).
   - Extend `lint:check` or add `lint:stories` (`eslint "**/*.stories.tsx" showcase .storybook`) and make sure CI runs it. Today `lint:check` is `eslint src` only, and the existing `src/**` block ignores stories.
5. **SB-029 disable ban.** Add `@eslint-community/eslint-plugin-eslint-comments` (exact pin) with `'@eslint-community/eslint-comments/no-restricted-disable': ['error', 'auraglass/story-*']` on the same globs. `tests/lint/story-rules/no-disable.test.ts` lints a fixture string containing `// eslint-disable-next-line auraglass/story-no-important` through the ESLint Node API and asserts an error.
6. **SB-030 import rewrite.** In the 53 files, replace `@storybook/test`, `@storybook/jest` and `@storybook/testing-library` import specifiers with `storybook/test`. Merge duplicate imports in the same file. Don't change `play` bodies except where an API was renamed: `userEvent` and `expect` are the same; `jest.fn` becomes `fn`. List every renamed call in the report.
7. **SB-031 devDependencies.** Remove `@storybook/jest` (`package.json:433`), `@storybook/test` (`:436`) and `@storybook/testing-library` (`:437`). Add exact pins for `@storybook/addon-vitest`, `vitest`, `@vitest/browser`, `playwright` and `@eslint-community/eslint-plugin-eslint-comments`. Regenerate `package-lock.json` with `npm install` (dependency resolution is light; don't run builds). Proof: `npm ls @storybook/test @storybook/jest @storybook/testing-library` shows them absent.
8. **SB-032 Vitest browser project.** `vitest.storybook.config.ts` defines the project `storybook` with the `storybookTest({ configDir: '.storybook', tags: { include: ['interaction', 'showcase-s1', 'lab'], exclude: [] } })` plugin. Set `test.browser = { enabled: true, provider: 'playwright', headless: true, instances: [{ browser: 'chromium' }] }`, and `setupFiles: ['.storybook/vitest.setup.ts']`. The setup calls `setProjectAnnotations([a11yAddonAnnotations, previewAnnotations])`. Add `"test-storybook": "vitest run --project=storybook"`. Don't add `@storybook/test-runner`. Jest stays the unit runner (deviation 6).
9. **SB-033 `storybook-tests.yml`.**
   - Job `lint-gates` runs on `ubuntu-latest`: `npm run lint:stories`, `node scripts/storybook/story-lint-ratchet.mjs --check`, `node scripts/storybook/lint-titles.mjs`, `node scripts/storybook/static-gates.mjs`, `npm run typecheck:stories` (ratchet mode), and the RuleTester and node tests.
   - Job `vitest` installs browsers with `npx playwright install --with-deps chromium` (CI runner only; never locally), runs `npm run test-storybook -- --shard=${{ matrix.shard }}/4`, and uploads the JUnit and a11y reports as artifact `storybook-tests-${{ github.sha }}-${{ matrix.shard }}`. Target ≤12 min wall time (PRD §16).
   - Use only `permissions: contents: read`.
10. **SB-034 `tsconfig.storybook.json`.** Extend `tsconfig.json`; set `strict: true`, `noImplicitAny: true`, `noEmit: true`; `include: [".storybook/**/*", "**/*.stories.tsx", "showcase/**/*"]`. Add `"typecheck:stories": "node scripts/storybook/count-tsc-errors.mjs"`; it runs `tsc --noEmit -p tsconfig.storybook.json`. The current 460 story files contain `as any` and invalid args (E9, `GlassButton.stories.tsx:59`), so the gate can't be 0 on day one. **Explicit deviation (same pattern as REQ-SB-32):** `count-tsc-errors.mjs` compares the error count with `tsc-stories-baseline.json` and fails on any increase. Errors in `.storybook/**` and `showcase/**` are always 0, with no baseline. SB-117 flips the gate to "0 errors" before beta. Record the initial count.
11. **SB-035/036 `lint-titles.mjs`.** Input is `storybook-static/index.json` (run `verify-fresh.mjs` first) or, with `--from-source`, a CSF static parse via `@storybook/csf-tools` `loadCsf` (already a Storybook dependency; confirm with `npm ls @storybook/csf-tools`, otherwise use `storybook/internal/csf-tools`). Reject a title segment matching `/^\d+\.\d+/`, a lowercase-initial leaf, a leaf matching `/^Glass[A-Z]/` (D-14), the same component export under two titles, and a leaf that isn't the default export's component display name. The test has 1 fixture per rejection class plus a clean fixture.
12. **SB-037/038 `lint-story-copy.mjs`.** Uses `composeStories` from `@storybook/react` under jsdom (a Jest environment is acceptable through a tiny wrapper; otherwise use `jsdom` directly) and renders each story's `textContent`. It fails on the case-insensitive banned strings `glass morphism`, `Lorem`, `Sample `, `This is a`, `Click Me`, `consciousness`, `quantum`, `predictive`, `eye tracking`, and the exact rendered text `Default` (REQ-SB-13). For `showcase/**` it also fails on `AuraGlass`, `glass`, `certification`, `Storybook`, and on any showcase with fewer than 40 text runs in one region (REQ-SB-26). The claim check flags copy containing a prop name (from typed metadata, later) whose arg is `false`/absent. Implement the hook and keep the metadata source for 17e. Run in ratchet mode (per-file violation count in `scripts/storybook/story-lint-baseline.json` key `copy`) until 17e/17f. The test has fixture stories for each banned string and a clean one.
13. **SB-039 `static-gates.mjs`.** Node implementation (no `rg` dependency on the runner) of each check below. Each prints offending paths, and the script exits 1 on any hit. 17e/17f run it at full strength; until then the `copy` and REQ-SB-33 hits ratchet in `story-lint-baseline.json`.
    - REQ-SB-16: `previewUsers` in `*.stories.tsx`/`*.showcase.tsx` under `src showcase .storybook` = 0.
    - REQ-SB-33: `LiquidGlassShowcase|LiquidGlassStateMatrix|ComprehensiveShowcase|EnhancementShowcase|StorybookVisualShowcase` in `*.stories.tsx`/`*.mdx` = 0.
    - REQ-SB-41: `storybook-visual-certification|story-presentation-audit` in `package.json .github .storybook` = 0.
    - REQ-SB-45: deprecated test imports = 0.
    - REQ-SB-13: `as any|: any` in `*.stories.tsx` = 0.

## 5. Tests to run
Local (light): `./node_modules/.bin/jest tests/lint/story-rules`, `node --test tests/storybook/lint-titles.test.mjs tests/storybook/lint-story-copy.test.mjs tests/storybook/static-gates.test.mjs tests/lint/story-rules/ratchet.test.mjs`, `node scripts/storybook/story-lint-ratchet.mjs --check`. **SB-127**: if `jest --listTests` omits `tests/storybook/`, `tests/showcase/` or `tests/lint/story-rules/`, add those roots to QA's `jest.config.js` minimally (MODIFY on QA-003) and report it. Remote: the `storybook-tests` run with `lint-gates` and all 4 `vitest` shards green. The existing 7 `play` functions must pass, or fail with a real defect you report; don't delete them to get green. Attach the run URL.

## 6. Visual evidence
None; this prompt changes no pixels. Remote `build-storybook` must still succeed after the import rewrite (artifact from `deploy-storybook` on the PR).

## 7. Integrity rules (binding)
Every rule needs failing fixtures. Don't narrow a rule's selectors to shrink the baseline. Don't add path exemptions beyond `.storybook/lab/**` (private vars) and the `Environment` scene element (background). No `eslint-disable` for `auraglass/story-*`. No `test.skip`/`.only`. Don't loosen version pins (`^`/`~`). Don't install browsers or run Vitest browser mode locally. No local Docker.

## 8. Exit criteria
- AC-SB-09 (ratchet): all 6 `auraglass/story-*` rules registered in `eslint-plugin-auraglass.js`; `story-lint-baseline.json` committed with measured counts; `story-lint-ratchet.mjs --check` fails in CI on an injected increase (demonstrate on a throwaway branch and link the failing run).
- REQ-SB-31: the disable-ban test is green.
- AC-SB-10 (this clause): `npm ls` shows none of the three deprecated packages; `static-gates.mjs` REQ-SB-45 check = 0.
- REQ-SB-15 runner: the `vitest` job runs in CI and reports per-story results.
- REQ-SB-49: `typecheck:stories` gate live; `.storybook/**` + `showcase/**` = 0 errors.
- REQ-SB-10/13: both lint scripts and their tests are green.

## 9. Final report format
```
PROMPT-17b REPORT
Branch/SHA:
Tasks: SB-020..SB-039, SB-127 -> done|blocked (reason) each
Baselines (measured cmd -> value): optics files/occ, !important files, tsc errors, copy violations, title violations
Pinned versions: storybook, @storybook/addon-vitest, vitest, @vitest/browser, playwright, eslint-comments
Renamed APIs in import rewrite: (list or none)
Tests: name -> pass/fail (local|remote run URL)
Deviations: tsc ratchet (SB-034) + any other, with evidence
Files changed:
```
