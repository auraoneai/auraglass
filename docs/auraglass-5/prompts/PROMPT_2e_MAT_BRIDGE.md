# PROMPT-2e (MAT lane B): Bridge, compat and integration

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **B**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2e-B"` (48 tasks: MAT-327..374).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Prerequisites

**None except the frozen contract** (`contract-v1.1`, landed at C0). No other PRD, stream, lane or task has to finish first. If a C0 seed, double or stub this lane names is missing, report the contract bootstrap as incomplete; do not create it and do not wait.

## Scope

**Owned paths (exclusive inside MAT):** `tokens/compat-alias-map.json`, `tokens/legacy/**`, `src/styles/**` (incl. H02), `src/compat/mat/**`, `src/root/mat.ts`, `fragments/{deprecations,codemods,size-budgets,perf-budgets,lanes,playwright,css,review,side-effects,a11y-baseline}/mat*` (+ `mat/**`), `ci/mat.gitlab-ci.yml`, `ci/mat/**`, `etc/api/{material,theme,tokens,motion}.*`, `etc/api/{root,compat}.mat.api.md`, `stories/mat/**`, `apps/docs/content/mat/**`, `canaries/next16/app/mat/**`, `canaries/vite/src/mat/**`, `canaries/<app>/fixtures/mat/**`, `tests/fixtures/consumer-4x/cases/mat/**`, `tests/{rsc,types}/mat/**`, `tests/material/exports/**`, `.changeset/mat-*.md`

**Delivers:** REQ-MAT-21, 22, 41, 67; §12.4

**Order inside the lane:** day 0: CI fragment, lane/playwright/css fragments, 4.2 deprecation entries on `release/4.x` → legacy freeze + 4.2 bridge build → compat adapters and codemod fixtures → 4.3 preview + compat tokens → API reports and docs

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-03, REQ-MAT-08, REQ-MAT-09, REQ-MAT-11, REQ-MAT-13, REQ-MAT-17, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38, REQ-MAT-40, REQ-MAT-41, REQ-MAT-44, REQ-MAT-46, REQ-MAT-52, REQ-MAT-54, REQ-MAT-67.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-b -b next-mat/b-<topic> origin/next
# release/4.x work in this lane (MAT-338, MAT-339, MAT-340, MAT-351, MAT-352, MAT-353, MAT-364, MAT-373): fragments and frozen 4.x cases only
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-b-4x -b 4x-mat/<topic> origin/release/4.x
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2e-B") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-327 | DOC | `.changeset/mat-ds.md` | Add a 4.2.0 'Changed (C-I)' entry: marketing/navigation private custom properties renamed --ag-* -> --_ag-*; the --ag-* namespace is reserved for the 5.0 public … |  | REQ-MAT-41 |
| MAT-328 | CREATE | `NEW:tokens/legacy/4x-rendered.tokens.json` | Write NEW scripts/tokens/freeze-4x.mjs (uses the existing ts-node and transitive postcss) to extract the glass.ts:997 gradient, :1001 fill, :1030 border, the blur … |  | REQ-MAT-21 |
| MAT-329 | MODIFY | `ci/mat.gitlab-ci.yml` | Interim (MAT-owned job in ci/mat.gitlab-ci.yml, retired when QUAL lanes L1/L4 report on next; no wait): add a 'tokens' step to PKG's 'Glass Quality Gates' job (job name … |  |  |
| MAT-330 | MODIFY | `fragments/lanes/mat.ts` | Register DS providers in QA's L4 Token contrast lane (SC-29, after QA-081): npm run build:tokens, git diff --exit-code on generated files, then … | MAT-329 | REQ-MAT-11 |
| MAT-331 | MODIFY | `fragments/lanes/mat.ts` | L4 provider timing: fail if the full build:tokens takes > 20 s or the contrast solve > 10 s on the CI runner; print both numbers in the lane log. | MAT-330 |  |
| MAT-332 | MODIFY | `fragments/lanes/mat.ts` | Register DS providers in QA's L1 Static lane (SC-29, after QA-078): npm run gates:tokens (undefined-vars, dead-vars, tier-skip, types-runtime, literals vs … | MAT-330 |  |
| MAT-333 | CREATE | `NEW:stories/mat/Tokens.mdx` | Tables generated at build time from dist/tokens/manifest.json: name, tier, group, value per mode, swatch plus a text value, consumers count; no hand-typed values … |  | REQ-MAT-08, REQ-MAT-22 |
| MAT-334 | CREATE | `NEW:stories/mat/ModesMatrix.stories.tsx` | One MAT Surface (MAT-047) per variant x thickness over the 8 SC-28 certification scenes (certification/scenes/, QA-038/039, story ids scenes--<id>). Stock-image … |  |  |
| MAT-335 | CREATE | `NEW:stories/mat/InteractionStates.stories.tsx` | Grid of MAT Surface interactive (MAT-047) forced into hover/active/selected/focus-visible/disabled/loading/dragging/drop-target via data-pressed, data-selected, … |  | REQ-MAT-09 |
| MAT-336 | CREATE | `NEW:stories/mat/Presets.stories.tsx` | Each preset in light and dark, plus a createBrandTheme playground with labelled, keyboard-operable OKLCH L/C/H number inputs rendering contrast.pairs and … |  | REQ-MAT-01 |
| MAT-337 | CREATE | `NEW:stories/mat/ContrastFloors.stories.tsx` | Render tokens/generated/opacity-floors.json as a table (rows transparency x thickness x backdrop; columns preset x scheme x contrast) showing floorAlpha and minRatio as … |  | REQ-MAT-03 |
| MAT-338 | DEPRECATE | `fragments/deprecations/mat.ts` | On release/4.x for 4.2: add entries to the repo-root deprecations.json (SC-02: version 1, schema docs/schemas/deprecations.schema.json REL-010, instance seeded by … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-339 | DEPRECATE | `fragments/deprecations/mat.ts` | On release/4.x for 4.3, add entries (since 4.3.0) to the repo-root deprecations.json (SC-02, MODIFY) for: --glass-*/--aura-*/--persona-*/--glass-theme-* vars (codemod … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-340 | DEPRECATE | `fragments/deprecations/mat.ts` | Dev-only, once-per-name console.warn (stripped when NODE_ENV === 'production') on usePersonaTheme (:1530), PERSONA_IDS/THEME_NAMES, PersonaPicker … | MAT-339 | REQ-MAT-38 |
| MAT-341 | MODIFY | `src/styles/index.css` | MODIFY PKG's src/styles/index.css (owner PKG-101, SC-20): remove the legacy token imports and delete src/styles/glass.generated.css, generated/persona-variables.css, … |  | REQ-MAT-13 |
| MAT-342 | MODIFY | `fragments/size-budgets/mat.ts` | Add DS rows (integer bytes min+gz, peers external) to PKG's docs/size-budgets.json (PKG-048; gate scripts/ci/verify-size-budgets.mjs PKG-049; no … | MAT-341 |  |
| MAT-343 | CREATE | `NEW:etc/api/material.api.md` | Register the ./material entry (slug 'material') with REL's scripts/release/api-report.mjs and scripts/release/export-snapshot.mjs (SC-04; no … |  | REQ-MAT-22 |
| MAT-344 | MODIFY | `ci/mat.gitlab-ci.yml` | Add package.json scripts lint:optics, lint:optics-css, metric:glass-recipes (appended to lint:ci) and add steps to the existing 'Glass Quality Gates' job of PKG's the … |  |  |
| MAT-345 | MODIFY | `etc/api/material.css-api.json` | Add a11yOverridable list (--_ag-blur, --_ag-saturation, --ag-specular, --_ag-tint-floor, --_ag-grain-opacity, --_ag-shadow, --_ag-fill) and required rung values … |  | REQ-MAT-54 |
| MAT-346 | MODIFY | `fragments/size-budgets/mat.ts` | Submit MAT rows to PKG's docs/size-budgets.json (integer limitBytesGz, min+gz, peers external; SC-15, no size-limit, no MAT-specific size script): aura-glass/material … |  | REQ-MAT-23, REQ-MAT-25, REQ-MAT-36, REQ-MAT-38 |
| MAT-347 | TEST | `NEW:tests/material/exports/material-exports.test.ts` | Exact value-export list of aura-glass/material (8 values incl. defineMaterial) from built dist and source; resolveRole and LensDefs absent; a bundle of { Surface } … |  | REQ-MAT-22 |
| MAT-348 | MODIFY | `fragments/playwright/mat.json` | Add a 'material' project (testDir tests/material; chromium, webkit, firefox; retries 0; forbidOnly) to QA's cert config by MODIFY (SC-29; no … |  |  |
| MAT-349 | MODIFY | `ci/mat.gitlab-ci.yml` | Run the 'material' project in QA's the PR-scope qual:certify:l* jobs as L5 Behaviour cells, with WebKit/Gecko-only specs reported under L8 Engine-specific (SC-29; no … | MAT-348 |  |
| MAT-350 | TEST | `fragments/review/mat.ts` | Submit the Material subjects to QA's L14 Human visual review (rubric certification/review/visual-rubric.md, QA-099): specular quality, optical hierarchy, radius rhythm … |  |  |
| MAT-351 | MODIFY | `fragments/deprecations/mat.ts` | [release/4.x] One C-D entry per PRD §9 item (API-7, API-8) in the root deprecations.json (version 1, SC-02/03): id DEP-NNNN, kind, status, symbol, since 4.2.0, removeIn … |  | REQ-MAT-67, REQ-MAT-20 |
| MAT-352 | DEPRECATE | `fragments/deprecations/mat.ts` | [release/4.x] Dev warn-once '[aura-glass] <Name> is deprecated; use <Successor> (codemod: <id>)' in OptimizedGlassCore, GlassCore, glass/GlassAdvanced, … | MAT-351 | REQ-MAT-20 |
| MAT-353 | MODIFY | `fragments/deprecations/mat.ts` | [release/4.x] C-D entry (kind css-global, codemod null) for the storybook-utility-shim.css import (src/styles/index.css:25) plus the doctor --v5 report line (DX-037). … | MAT-351 | REQ-MAT-20 |
| MAT-354 | CREATE | `NEW:src/compat/mat/material/OptimizedGlass.tsx` | [main 5.0] Adapters src/compat/material/{OptimizedGlass, GlassCore, OptimizedGlassAdvanced}.tsx → Surface (SC-34; re-exported by DX src/compat/index.ts): … |  | REQ-MAT-24 |
| MAT-355 | CREATE | `NEW:src/compat/mat/material/LiquidGlassMaterial.tsx` | [main 5.0] Adapters LiquidGlassMaterial (variant kept, thickness/size mapped, adaptToContent/ior/material/enableTilt dropped+warned), … |  | REQ-MAT-24 |
| MAT-356 | TEST | `NEW:src/compat/mat/material/__tests__/adapters.test.tsx` | For each of the 8 adapters: rendered attributes equal materialProps(expectedRole); dropped-prop warning fires once with the prop list; no style attribute unless … | MAT-354, MAT-355 | REQ-MAT-24 |
| MAT-357 | TEST | `src/styles/index.css` | [main 5.0] Verify that PKG-101 removed the storybook-utility-shim.css import (:25) from shipped styles (C-B, API-18) and that .storybook/ imports it; compat/globals.css … |  | REQ-MAT-21 |
| MAT-358 | MODIFY | `ci/mat.gitlab-ci.yml` | At the 5.0.0-beta.1 SHA: count-glass-recipes --strict (fail N>1), no-optics-outside-material error for all src/**, verify-optics-css without baseline, … |  |  |
| MAT-359 | MODIFY | `fragments/perf-budgets/mat.ts` | Submit MAT runtime rows to PERF's budgets file (SC-15; no parallel budget file): material subjects (Material/Matrix stories), surface {fine 6, coarse 3}, refracting ≤2 … |  | REQ-MAT-38, REQ-MAT-36, REQ-MAT-40 |
| MAT-360 | CREATE | `NEW:fragments/codemods/mat.ts` | REQ-MOT-27: TypeScript-compiler-API codemod rewriting JSX animate={c ? {} : X} (also undefined/false, either branch, negated test) to initial={c ? false : <original … |  | REQ-MAT-67 |
| MAT-361 | TEST | `NEW:fragments/codemods/mat/fixtures/reduced-motion-initial/` | REQ-MOT-T21: fixtures for prefersReducedMotion, reducedMotion, !shouldAnimate, nested ternary, multiline attribute, already-fixed input; second run byte-identical. … | MAT-360 | REQ-MAT-67, REQ-MAT-21 |
| MAT-362 | MODIFY | `ci/mat.gitlab-ci.yml` | Add the MOT 4.x checks (MOT-002 codemod fixtures, MOT-006 cookie-consent unit test, MOT-013 T06 spec against the frozen 4.x fixture tests/fixtures/consumer-4x/) to QA's … | MAT-361 |  |
| MAT-363 | MODIFY | `fragments/css/mat.ts` | SC-20: styles.css assembly is PKG's (scripts/build/build-css.mjs, PKG-097). Add rows to build/css-ownership.json mapping src/motion/css/motion.css, loading.css and … |  | REQ-MAT-17 |
| MAT-364 | DOC | `fragments/deprecations/mat.ts` | AC-MOT-18: one entry per §9/§10 export, prop and token (Motion x2, animationPresets, GlassMotionController/GlassTransitions/OrganicAnimationEngine families, … |  | REQ-MAT-67, REQ-MAT-52 |
| MAT-365 | CREATE | `NEW:fragments/codemods/mat.ts` | §11 item 2 / REQ-MOT-T21 (SC-33): motion-imports (hooks -> usePreference('motion') !== 'full', unwrap ReducedMotionProvider, skip MotionPreferenceProvider (core … | MAT-360 | REQ-MAT-21, REQ-MAT-67 |
| MAT-366 | MODIFY | `fragments/playwright/mat.json` | REQ-MOT-70 (SC-29): add a `motion` project to QA's cert config running tests/motion/**/*.spec.ts on chromium, webkit, firefox x 1440x900 and 390x844 x reducedMotion … |  | REQ-MAT-44, REQ-MAT-46 |
| MAT-367 | MODIFY | `fragments/size-budgets/mat.ts` | REQ-MOT-120..123: core motion CSS <= 3.5 KB min+gz; core motion JS (viewTransition+pointerLight+ticker+capability) <= 2.0 KB; { Button } <= 10 KB with <= 0.5 KB motion … | MAT-363 | REQ-MAT-01 |
| MAT-368 | CREATE | `NEW:stories/mat/motion/Interactions.stories.tsx` | REQ-MOT-91/-93: Motion/Tokens (NEW Tokens.stories.tsx: SVG curves, dot animates only while Play held, spring linear() vs analytic with error read-out), … |  | REQ-MAT-08 |
| MAT-369 | MODIFY | `fragments/playwright/mat.json` | SC-29: QA owns playwright.config.ts and jest.config.js; add (MODIFY) projects a11y-chromium, a11y-webkit, a11y-firefox with testDir tests/a11y, testMatch … |  |  |
| MAT-370 | MODIFY | `fragments/lanes/mat.ts` | SC-29: register A11Y suites in QA lanes instead of a separate a11y-lanes.yml: L1 Static (eslint auraglass/no-runtime-contrast + no-document-escape, verify-a11y-css.mjs, … | MAT-369 |  |
| MAT-371 | MODIFY | `fragments/lanes/mat.ts` | Remote: measure {AuraGlassProvider, usePreference} min+gz via PKG size gate (docs/size-budgets.json + scripts/ci/verify-size-budgets.mjs, SC-15) (<=4 KB) and run QA L11 … | MAT-370 |  |
| MAT-372 | MODIFY | `fragments/lanes/mat.ts` | Dispatch the PR-scope qual:certify:l* jobs for the L5/L6 A11Y exit cells: floors, rungs, forced-colors, pixel-modes on Surface all variants x thicknesses x 8 scenes x … | MAT-370 |  |
| MAT-373 | MODIFY | `fragments/deprecations/mat.ts` | Append one PRD-01-schema entry per §9 row (id, symbol, path, class C-D, since 4.2.0, removal 5.0.0, replacement, codemod removed\|providers\|canonical-names\|null+todo, … |  | REQ-MAT-67 |
| MAT-374 | MODIFY | `fragments/lanes/mat.ts` | ga-cert step collecting §16 numbers on GA SHA from their lanes and failing on any overrun: script <=1.5 KB min and <=1 ms mid-tier, ./theme <=4 KB gz, panel <=3 KB … | MAT-371 |  |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-35, S-36, S-37, S-38, S-38..S-45 fragment kinds, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE B REPORT  contract-v1.1  next@<sha>  release/4.x@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
