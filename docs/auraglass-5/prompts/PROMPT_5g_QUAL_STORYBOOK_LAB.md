# PROMPT-5g (QUAL lane Q7): Storybook and Material Lab

Stream index: `docs/auraglass-5/prompts/PROMPT_5_QUAL.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md` (PRD-5, key QUAL) §20 lane **Q7**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/QUAL.json`, field `lane = "5g-Q7"` (77 tasks: QUAL-212..288).

This lane starts on **day 0**, runs at the same time as every other QUAL lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside QUAL):** `.storybook/**` (except `main.ts` verbatim fields), `tsconfig.storybook.json`, `scripts/storybook/**`, `stories/qual/StartHere.mdx`, `tests/storybook/**`, `scripts/qual/lint-stories.mjs`, `tests/lint/qual/story-rules.test.ts`, `tests/e2e/qual/storybook/**`

**Order inside the lane:** preview, `StoryRoot`, cert mode, scene stories (-08..-11) → build, freshness, manifests (-56) → IA, titles, story contract, docs blocks/pages, Start Here (-49..-52) → Material Lab (-53, -54) → story-glass gate (-55) → interaction flows (-57)

**Requirements closed by this lane:** REQ-QUAL-01, REQ-QUAL-02, REQ-QUAL-05, REQ-QUAL-07, REQ-QUAL-08, REQ-QUAL-09, REQ-QUAL-10, REQ-QUAL-11, REQ-QUAL-14, REQ-QUAL-19, REQ-QUAL-23, REQ-QUAL-35, REQ-QUAL-41, REQ-QUAL-49, REQ-QUAL-50, REQ-QUAL-51, REQ-QUAL-52, REQ-QUAL-53, REQ-QUAL-54, REQ-QUAL-55, REQ-QUAL-56, REQ-QUAL-57, REQ-QUAL-59.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/qual-q7 -b next-qual/q7-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/qual-<slug>.md` and refreshes the QUAL-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/QUAL.json")) if (t.lane === "5g-Q7") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| QUAL-212 | MODIFY | `.storybook/preview.tsx` | [REQ-QA-11, REQ-QA-21] REQ-QA-11 and §13 item 3: add global certify (0\|1). When certify=1 the decorator renders no StorySurface, no ContrastGuard … | QUAL-239, QUAL-236 | REQ-QUAL-09, REQ-QUAL-23 |
| QUAL-213 | CREATE | `NEW:stories/qual/certification/CertFixtures.stories.tsx` | [REQ-QA-12] Cert-only stories tagged cert-fixture and !autodocs (excluded from docs nav per the Storybook PRD tag contract), parameters.ag.subject … | QUAL-212 | REQ-QUAL-14 |
| QUAL-214 | CREATE | `NEW:.storybook/redirects.json` | Map the 50 most-linked 4.x story ids (ranked from `rg -o "\?path=/(story\|docs)/[a-z0-9-]+" README.md docs/ -g '!docs/auraglass-5/**'`) to 5.0 ids, else start-here--page … |  |  |
| QUAL-215 | CREATE | `NEW:scripts/storybook/check-build-log.mjs` | Scan Storybook build log; exit 1 on duplicate story id, missing/unknown story id, 'Failed to resolve import', 'Could not resolve', and vite unresolved-import warnings; … |  | REQ-QUAL-56 |
| QUAL-216 | TEST | `NEW:tests/storybook/check-build-log.test.mjs` | node --test with fixture logs under tests/storybook/fixtures/build-logs/: 1 clean (exit 0) and 1 per failure class (duplicate id, missing id, unresolved import, vite … | QUAL-215 | REQ-QUAL-56 |
| QUAL-217 | CREATE | `NEW:scripts/storybook/write-build-manifest.mjs` | Write storybook-static/ag-build.json {sha: git rev-parse HEAD, dirty: git status --porcelain non-empty, builtAt, storybookVersion (node_modules/storybook/package.json), … |  | REQ-QUAL-56 |
| QUAL-218 | CREATE | `NEW:scripts/storybook/verify-fresh.mjs` | `verify-fresh.mjs [dir=storybook-static]` exits 1 with one-line reason unless ag-build.json exists, sha == HEAD, dirty == false when CI=true, indexSha256 matches … | QUAL-217 | REQ-QUAL-56 |
| QUAL-219 | TEST | `NEW:tests/storybook/verify-fresh.test.mjs` | node --test with temp-dir fixtures: pass; missing manifest; SHA mismatch; dirty with CI=true fails; dirty locally passes; index hash mismatch; deliberately stale build … | QUAL-218 | REQ-QUAL-56 |
| QUAL-220 | REMOVE | `scripts/audit/story-presentation-audit.js` | Delete scripts/audit/story-presentation-audit.js and package.json script `audit:storybook:presentation` (:339). Do not delete … |  |  |
| QUAL-221 | TEST | `NEW:tests/storybook/ci-storybook.test.mjs` | node --test; yaml devDependency is in the frozen set. Parse ci/qual.gitlab-ci.yml: qual:build:storybook and every Storybook-related job extend a root template, have … |  |  |
| QUAL-222 | CREATE | `NEW:scripts/storybook/story-lint-baseline.json` | NEW ratchet.mjs runs the 6 rules via ESLint Node API and writes per-rule {files, occurrences}; `--check` fails on any increase and on a decrease not reflected in … |  | REQ-QUAL-55 |
| QUAL-223 | TEST | `NEW:tests/lint/qual/story-rules/no-disable.test.ts` | Add @eslint-community/eslint-plugin-eslint-comments (exact pin) with `no-restricted-disable: ['error','auraglass/story-*']` on the story/showcase/.storybook globs; test … |  | REQ-QUAL-55 |
| QUAL-224 | CREATE | `NEW:vitest.storybook.config.ts` | Project `storybook` with storybookTest({configDir:'.storybook', tags:{include:['interaction','showcase-s1','lab']}}), browser {enabled:true, provider:'playwright', … |  | REQ-QUAL-57 |
| QUAL-225 | CREATE | `NEW:tsconfig.storybook.json` | Extends tsconfig.json; strict, noImplicitAny, noEmit; include .storybook/**/*, **/*.stories.tsx, showcase/**/*. NEW scripts/storybook/count-tsc-errors.mjs compares … |  | REQ-QUAL-56 |
| QUAL-226 | CREATE | `NEW:scripts/storybook/lint-titles.mjs` | Input storybook-static/index.json (after verify-fresh) or --from-source CSF parse via loadCsf; reject segment /^\d+\.\d+/, lowercase-initial leaf, leaf /^Glass[A-Z]/ … | QUAL-218 | REQ-QUAL-49 |
| QUAL-227 | TEST | `NEW:tests/storybook/lint-titles.test.mjs` | node --test fixtures: version segment (3.2/AppShell), lowercase leaf, Glass prefix, cross-group duplicate, leaf/export mismatch each fail; clean fixture passes. | QUAL-226 | REQ-QUAL-49 |
| QUAL-228 | CREATE | `NEW:scripts/storybook/lint-story-copy.mjs` | Render each story with composeStories under jsdom and read textContent; fail on case-insensitive banned strings `glass morphism`, `Lorem`, `Sample `, `This is a`, … | QUAL-222 | REQ-QUAL-50, REQ-QUAL-59 |
| QUAL-229 | TEST | `NEW:tests/storybook/lint-story-copy.test.mjs` | node --test fixture stories: one per banned string fails, showcase meta-copy fixture fails, <40-run showcase fails, clean fixture passes. | QUAL-228 | REQ-QUAL-50, REQ-QUAL-59 |
| QUAL-230 | CREATE | `NEW:scripts/storybook/static-gates.mjs` | Node (no rg on runner) checks, each printing offending paths: previewUsers in *.stories.tsx/*.showcase.tsx under src showcase .storybook = 0 (REQ-SB-16); … | QUAL-222 | REQ-QUAL-50, REQ-QUAL-57 |
| QUAL-231 | CREATE | `NEW:.storybook/environment/scenes.ts` | Typed loader over PRD-19 certification/scenes/scenes.manifest.json merged with NEW .storybook/environment/scene-presentation.json … |  | REQ-QUAL-07 |
| QUAL-232 | MODIFY | `.storybook/main.ts` | Add stories globs '../showcase/**/*.stories.tsx' and '../src/material/stories/*.stories.tsx'; staticDirs [{from:'../certification/scenes', to:'/scenes'}]. Keep mdx … | QUAL-231 | REQ-QUAL-07 |
| QUAL-233 | TEST | `NEW:tests/storybook/scene-bands.test.mjs` | node --test, remote CI job `scene-bands` only. Decode via PRD-19 packages/qa image utils if exported else `sharp` exact-pinned devDep; OCR via PRD-19 OCR module or apt … | QUAL-231, QUAL-232 | REQ-QUAL-07 |
| QUAL-234 | CREATE | `NEW:.storybook/environment/StoryEnvironment.tsx` | Render <Environment backdrop image video> from aura-glass/material with getScene(global environment); layout in NEW .storybook/environment/scenes.module.css … | QUAL-231 | REQ-QUAL-10 |
| QUAL-235 | TEST | `NEW:tests/storybook/StoryEnvironment.test.tsx` | Jest: render each of 8 scenes with a test subject; walk ancestors: no class matching /glass-on-\|glass-contrast\|tone-/, no inline background/color except on the … | QUAL-234 | REQ-QUAL-10 |
| QUAL-236 | CREATE | `NEW:.storybook/contract/StoryRoot.tsx` | Exactly one <div data-ag-story-content data-ag-story-kind> (kind from parameters.agKind or tags: lab, matrix, cert-scene->scene, showcase-s1\|s2->showcase, else … | QUAL-232 | REQ-QUAL-09, REQ-QUAL-11 |
| QUAL-237 | TEST | `NEW:tests/storybook/StoryRoot.test.tsx` | Jest: exactly one [data-ag-story-content]; data-ag-story-kind in {lab,component,matrix,scene,showcase}; data-ag-cert-ready absent until mocked fonts.ready and image … | QUAL-236 | REQ-QUAL-09, REQ-QUAL-11 |
| QUAL-238 | TEST | `NEW:tests/storybook/story-ready.test.tsx` | Jest with jest.useFakeTimers() and no timer advance: an overlay story using defaultOpen and a StreamingText story at step=n reach final DOM and data-ag-cert-ready; … | QUAL-236 | REQ-QUAL-11, REQ-QUAL-09 |
| QUAL-239 | REDESIGN | `.storybook/preview.tsx` | Rewrite: globalTypes exactly PRD §4.2 (environment 8 ids default photo; scheme light\|dark default OS; transparency system\|glass\|tinted\|solid default system; contrast … | QUAL-234, QUAL-236 | REQ-QUAL-10, REQ-QUAL-49 |
| QUAL-240 | REMOVE | `.storybook/StorySurface.tsx` | Delete .storybook/StorySurface.tsx; NEW scripts/codemods/internal/remove-preview-surface.mjs (@babel/parser AST locate + exact-range text removal) removes … | QUAL-239 | REQ-QUAL-10 |
| QUAL-241 | TEST | `NEW:tests/storybook/storybook-config.test.ts` | Jest: globalTypes keys/values/defaults == PRD §4.2; decorators.length === 1; parameters.backgrounds.disable === true; no initialSettings; motion default system and no … | QUAL-239, QUAL-242, QUAL-243, QUAL-285 | REQ-QUAL-10 |
| QUAL-242 | MODIFY | `.storybook/main.ts` | Resolve aura-glass and aura-glass/<subpath> through package.json exports: preferred PRD-02 source condition first in resolve.conditions; fallback one exact-match alias … |  | REQ-QUAL-56 |
| QUAL-243 | MODIFY | `.storybook/main.ts` | Remove process.env define (:35-46) and serverOnlyPackages externals (:48-67: @google-cloud/vision, @pinecone-database/pinecone, bcryptjs, jsonwebtoken, openai, redis, … |  | REQ-QUAL-56 |
| QUAL-244 | CREATE | `NEW:stories/qual/Scenes.stories.tsx` | Title Scenes, tags ['cert-scene','!autodocs'], 8 exports -> ids scenes--photo, scenes--saturated-abstract, scenes--dense-text, scenes--dark-media, scenes--flat-white, … | QUAL-239 | REQ-QUAL-08 |
| QUAL-245 | TEST | `NEW:tests/storybook/cert-scenes.test.ts` | Jest composeStories on Scenes.stories.tsx: 8 ids exactly; 12 [data-ag-surface] cells per story; root data-ag-backdrop equals scene-presentation backdrop for that id; … | QUAL-244 | REQ-QUAL-08 |
| QUAL-246 | CREATE | `NEW:scripts/storybook/write-cert-manifest.mjs` | After verify-fresh, read storybook-static/index.json and write .storybook/cert-manifest.json {schemaVersion:1, sha, … | QUAL-217, QUAL-244 | REQ-QUAL-01 |
| QUAL-247 | TEST | `NEW:tests/storybook/write-cert-manifest.test.mjs` | node --test fixture index.json: correct selection by tag and kind; duplicate id fails; id present in index but not manifest (and vice versa) reported for … | QUAL-246 | REQ-QUAL-01 |
| QUAL-248 | MODIFY | `NEW:scripts/storybook/static-gates.mjs` | Add check: setTimeout\|setInterval in *.stories.tsx and *.showcase.tsx; ratchet key `timers` in baseline.json, must reach 0 by SB-117; overlays use defaultOpen, … | QUAL-230 | REQ-QUAL-11, REQ-QUAL-09 |
| QUAL-249 | CREATE | `NEW:.storybook/environment/scene-strip.tsx` | Flagship strip at rest for Scenes stories: Button, SegmentedControl, Slider, TextField (PRD-08), Tabs (PRD-10), Toast (PRD-09) imported from public aura-glass entries; … | QUAL-244 | REQ-QUAL-08 |
| QUAL-250 | TEST | `NEW:.storybook/cert-manifest.json` | Remote only (PRD-19 the PR-scope qual:certify:l* jobs or auraone-remote-run worker against verified storybook-static): capture scenes--* at 1440 and 390, light and … | QUAL-244 | REQ-QUAL-09, REQ-QUAL-08 |
| QUAL-251 | CREATE | `NEW:.storybook/lab/MaterialLabFrame.tsx` | Props {subject:(p:SurfaceProps)=>ReactNode; materials?; showReadout?}; layout in NEW .storybook/lab/lab.module.css (Overview subjects >=360x240 @1440; cells >=240x160 … | QUAL-239 | REQ-QUAL-53, REQ-QUAL-54 |
| QUAL-252 | CREATE | `NEW:.storybook/lab/LabControls.tsx` | Native labelled inputs, sliders with aria-valuetext ('Blur 20 pixels'). Discrete -> public Surface props variant, thickness, layer, content, shape, tier, transparency … | QUAL-251 | REQ-QUAL-54 |
| QUAL-253 | CREATE | `NEW:.storybook/lab/spec-export.ts` | buildSpecPatch(current, compiledDefaults) -> DTCG {"<variant>":{"$type":"glass-material","$value":{changed MaterialSpec fields}}} for defineMaterial(); … | QUAL-252 | REQ-QUAL-54 |
| QUAL-254 | CREATE | `NEW:.storybook/lab/ContrastReadout.tsx` | NEW .storybook/lab/contrast.ts WCAG math via PRD-03-designated public export of src/theme/color.ts (relativeLuminance/contrastRatio) or a local copy tested against it … | QUAL-251, QUAL-231 | REQ-QUAL-54 |
| QUAL-255 | TEST | `NEW:tests/storybook/MaterialLab.test.tsx` | Jest jsdom: for every REQ-SB-19 control, diff subject props + inline style before/after and assert exactly the documented key changes; Reset removes all --_ag-* inline … | QUAL-252, QUAL-253 | REQ-QUAL-54 |
| QUAL-256 | TEST | `NEW:tests/storybook/ContrastReadout.test.ts` | Fixture pixel arrays (solid white, solid black, 50% grey, 2-colour checker, seeded noisy patch): ratios within ±0.05 of an inline reference WCAG 2.x implementation; … | QUAL-254 | REQ-QUAL-54 |
| QUAL-257 | TEST | `NEW:tests/storybook/lab-not-shipped.test.mjs` | CI: (a) ESLint Node API on fixtures in src/ and showcase/ importing .storybook/lab errors (SB-028 ban); (b) `npm pack --dry-run --json` lists no .storybook/ path; (c) … | QUAL-251 | REQ-QUAL-54 |
| QUAL-258 | CREATE | `NEW:.storybook/lab/play.ts` | labRoundTrip(canvas,{control,value,expect}) with storybook/test userEvent: sets control, asserts computed style/attr change, presses Reset, asserts no --_ag-* inline … | QUAL-252, QUAL-224 | REQ-QUAL-57 |
| QUAL-259 | TEST | `NEW:tests/storybook/material-lab-order.test.mjs` | From verified index.json: Material Lab contains exactly, in order, Overview, Regular, Clear, Identity, Content Raised, Content Sunken, Tiers, Nesting & Groups, Shape & … | QUAL-218 | REQ-QUAL-53 |
| QUAL-260 | TEST | `NEW:.storybook/lab/LabControls.tsx` | Remote: capture the 12 Material Lab stories at 1440 and 390 over photo, flat-black, dense-text (PRD-19 lane or auraone-remote-run); measure main-thread work per control … | QUAL-259, QUAL-255 | REQ-QUAL-41 |
| QUAL-261 | CREATE | `NEW:.storybook/contract/metadata.ts` | Typed accessors over PRD-07 colocated <Name>.meta.ts (parts, states, variants, tier, rsc, apg, budgetKb, props, sizes, defaults): matrixAxes(meta) = variant x thickness … | QUAL-239 | REQ-QUAL-50 |
| QUAL-262 | CREATE | `NEW:.storybook/contract/defineComponentStories.tsx` | defineComponentStories(meta,{metadata,fixtures,contexts}) returns Playground, States, Matrix, Scenes, InContext, LightDark, Preferences, RTL, Mobile (+Keyboard for … | QUAL-261, QUAL-263, QUAL-264, QUAL-265, QUAL-266 | REQ-QUAL-50 |
| QUAL-263 | CREATE | `NEW:.storybook/contract/StatesGrid.tsx` | Rest + each applicable public-prop state (disabled, loading, invalid, checked/value, selected, defaultOpen) producing the component's own data-state/Base UI attributes; … | QUAL-261 | REQ-QUAL-50 |
| QUAL-264 | CREATE | `NEW:.storybook/contract/MatrixGrid.tsx` | Render exactly matrixCellCount(meta) cells, each data-ag-matrix-cell="<variant>/<thickness>/<interactive>/<prominent>"; layout via NEW … | QUAL-261 | REQ-QUAL-50 |
| QUAL-265 | CREATE | `NEW:.storybook/contract/ScenesStrip.tsx` | Subject over each of the 8 scenes via 8 nested Environment (aura-glass/material) using getScene(); read-only use of .storybook/environment/scenes.ts; no background on … | QUAL-231 | REQ-QUAL-50 |
| QUAL-266 | CREATE | `NEW:.storybook/contract/InContextFragments.tsx` | Four fragments from Surface/SurfaceGroup + subject only: gradient (saturated-abstract), photography (photo), colorful UI (3x3 control grid), dense dashboard (KPI row of … | QUAL-265 | REQ-QUAL-50 |
| QUAL-267 | CREATE | `NEW:.storybook/contract/docs-blocks.tsx` | <Anatomy of={meta}/> (data-ag-part table), <KeyboardTable script/> (from APG spec steps), <MigrationTable names/> (deprecations.json entries whose replacement is this … | QUAL-262 | REQ-QUAL-51 |
| QUAL-268 | TEST | `NEW:tests/storybook/story-contract.test.ts` | Jest composeStories over files tagged flagship/core: exact REQ-SB-12 export set (+Keyboard for flagships tagged apg); Matrix cell count == matrixCellCount(metadata); … | QUAL-262 | REQ-QUAL-50, REQ-QUAL-57 |
| QUAL-269 | TEST | `NEW:tests/storybook/docs-pages.test.mjs` | node --test: one MDX per flagship (per-family expected count until 44/44), each with the 6 headings in order Usage, Anatomy, Material role, Do/Don't, Keyboard, … | QUAL-267 | REQ-QUAL-51 |
| QUAL-270 | TEST | `NEW:tests/storybook/storybook-index.test.mjs` | From verified index.json: first segments in ['Start Here','Material Lab','Scenes','Showcases','Flagships','Core','Foundations','Migration']; Flagships groups Controls, … | QUAL-239, QUAL-218 | REQ-QUAL-49 |
| QUAL-271 | CREATE | `NEW:scripts/storybook/build-start-here.mjs` | Generate NEW src/stories/StartHere.stories.tsx from previous verified index.json (first build: loadCsf static parse) + inventory: computed counts (flagships, core, … | QUAL-270 | REQ-QUAL-52 |
| QUAL-272 | CREATE | `NEW:stories/qual/foundations/Icons.stories.tsx` | Foundations/Icons rebuilt from src/stories/IconsGallery.stories.tsx (real icons, no hard-coded '412' at :100; delete old file); NEW Foundations/Tokens (generated from … | QUAL-239 | REQ-QUAL-49 |
| QUAL-273 | DOC | `NEW:stories/qual/migration/` | One MDX per §12 consolidation family with a 5.0 target, title Migration/<Family>: before (4.x code text only, no live 4.x components) / after (live 5.0 component). |  | REQ-QUAL-51 |
| QUAL-274 | CREATE | `NEW:scripts/storybook/list-stubs.mjs` | List titles whose story set is exactly {Default, Variants} (autopsy: 128; record measured count) joined with inventory action; REMOVE records -> stub deleted in PRD-16 … | QUAL-218 | REQ-QUAL-49 |
| QUAL-275 | MODIFY | `stories/qual/AuraGlass33MarketingLaunch.stories.tsx` | If inventory keeps the marketing components (action != REMOVE), retitle to Showcases/Marketing and make it pass auraglass/story-* lint, title and copy lint; otherwise … |  |  |
| QUAL-276 | TEST | `NEW:tests/storybook/inventory-index.test.mjs` | DoD: every non-REMOVE record in docs/auraglass-5/component-inventory.json (post-PRD-16) has exactly one title in verified index.json; every flagship/core title maps to … | QUAL-270 | REQ-QUAL-02 |
| QUAL-277 | TEST | `NEW:.storybook/contract/defineComponentStories.tsx` | Per pilot and family PR, remote capture via PRD-19 lane of States, Matrix, Scenes, Mobile at 1440 and 390 over photo and flat-black; attach artifact URL, axe result (0 … |  | REQ-QUAL-57, REQ-QUAL-19 |
| QUAL-278 | CREATE | `NEW:scripts/storybook/verify-showcase-imports.mjs` | CI only: npm pack -> temp dir -> npm init -y && npm i <tgz> react/react-dom at repo versions; copy showcase/; Vite library build of every *.showcase.tsx with default … |  | REQ-QUAL-59 |
| QUAL-279 | CREATE | `NEW:scripts/storybook/check-build-size.mjs` | In deploy-storybook build job: storybook-static total excluding *.map <=60 MB; gzip preview-iframe JS for scenes--photo recorded as ag-build.json previewJsGzip … | QUAL-217 |  |
| QUAL-280 | TEST | `NEW:.storybook/cert-manifest.json` | PRD-19 lanes on SHA: S1 full §15.1 matrix, S2 reduced matrix, 8 scenes--* across §15.1 axes: OCR worst-case contrast >=4.5:1 body (7:1 contrast more), glass density … | QUAL-246 | REQ-QUAL-01 |
| QUAL-281 | DOC | `NEW:docs/certification/sr-walkthrough-sb.md` | Prepare screen-reader script and remote preview URLs for human VoiceOver/Safari and NVDA/Chrome walkthrough of S1-1, S1-2, S1-6 (GA blocker §15.2); result recorded in … |  | REQ-QUAL-05 |
| QUAL-282 | TEST | `NEW:.storybook/cert-manifest.json` | Assemble artifact index of S1-1..S1-6 remote captures at 1440 and 390, light and dark; human reviewer signs off specular quality, optical hierarchy, radius rhythm, … | QUAL-280 | REQ-QUAL-01 |
| QUAL-283 | DOC | `.storybook/README.md` | Rewrite for 5.0 (<300 lines): story contract (defineComponentStories exports), globals table, tags table, auraglass/story-* lint rules and allowlist, StoryRoot ready … | QUAL-262, QUAL-239, QUAL-246 |  |
| QUAL-284 | DOC | `NEW:.storybook/cert-manifest.json` | RC sign-off table AC-SB-01..19: per row CI run URL, artifact name and SHA (D-32, not committed files); AC-SB-16 from 17a procedure at tag (ag-build.json sha == tag … | QUAL-280, QUAL-281, QUAL-282 | REQ-QUAL-01 |
| QUAL-285 | MODIFY | `.storybook/preview.tsx` | REQ-SB-06: replace the interim ProviderSlot of SB-048 with the single PRD-A11Y AuraGlassProvider (A11Y-029) fed by the globals: scheme, transparency, glassOpacity, … | QUAL-239 | REQ-QUAL-10 |
| QUAL-286 | CREATE | `NEW:stories/qual/perf/HarnessBlank.stories.tsx` | Stories Perf/Harness Blank Default (id perf-harness-blank--default: scene only) and Perf/Self Test Regression (id perf-self-test--regression: click runs 200 ms busy … |  | REQ-QUAL-05 |
| QUAL-287 | CREATE | `NEW:stories/qual/perf/PerfFixtures.stories.tsx` | Fixtures on PRD-04 Surface: Perf/Nesting Nest4 (arg allowNestedLevel 0\|2), Perf/Budget Budget7 (arg count 4-7), Perf/Lens Lens3 (enhanced, arg count up to 10), … | QUAL-239 | REQ-QUAL-35, REQ-QUAL-05 |
| QUAL-288 | CREATE | `NEW:.storybook/addons/perf-budget/manager.tsx` | §13.3 dev-only budget read-out panel (manager.tsx, preview.ts, register.ts; registered in .storybook/main.ts only for non-production, non-certify builds): blurred … | QUAL-239 | REQ-QUAL-07 |

## Contract seams this lane consumes

S-01, S-02, S-03, S-04, S-05, S-06, S-10, S-11, S-12, S-13, S-20, S-21, S-22, S-23, S-24, S-25, S-26, S-30, S-31, S-32, S-33, S-34, S-35, S-36, S-37, S-38, S-39, S-41, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
QUAL LANE Q7 REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
