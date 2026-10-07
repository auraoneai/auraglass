# PROMPT-17c (SB): Scene environment, story root, preview rewrite and certification scenes

You are implementing part of PRD-SB (key SB, self-id alias PRD-17; Storybook, Material Lab and Showcase) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`, Storybook 9.1.20). This prompt is self-contained. Other PRD numbers use architecture §16 numbering (PRD-04 material engine = MAT, PRD-05 a11y/preferences = A11Y, PRD-19 QA certification = QA, PRD-16 removal = FND). Task `depends_on` uses task ids only (SC-40).

## 1. Sources (read in full before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_STORYBOOK_SHOWCASE_PRD.md` deviation 1, §2 rows E1, E2, E3, E8, E17, §3 items 2, 5, 7, §4.1–4.4, §5.A REQ-SB-01..07, §5.F REQ-SB-40, -42, -43, §5.G REQ-SB-46, -47, -48, §12 (config/environment/root/ready/cert-scenes rows), §14 (viewports, focal points), §15 (video, motion), §17 AC-SB-01, -02, -03, -07, -18, §20 steps 3–4.
- PRD-19: `docs/auraglass-5/prd/AURAGLASS_QA_CERTIFICATION_PRD.md` REQ-QA-10 (scenes + manifest), REQ-QA-11 (`certify:1`, the REQ-SB-05 pixel assertion).
- PRD-04 tasks `docs/auraglass-5/tasks/MAT.json` MAT-047..053 (`Surface`, `SurfaceGroup`, `Environment`, barrel) and MAT-090 (a read-only contract check of your SB-048, SC-31).
- Shared contracts `docs/auraglass-5/prd/_shared-contracts.md`: SC-21 (story-only attributes incl. `data-ag-cert-ready`), SC-23 (preference values `system`/`standard`, `glassOpacity`), SC-28 (scenes), SC-31 (preview ownership; other PRDs add globals by MODIFY on SB-048: QA-041 certify, MOT-091 motion, AI-074, DS-095, NAV-103, REL-118/120), SC-12 (exports manifest PKG-005), SC-30 (tests under `tests/storybook/`).
- Architecture §4.2 (`Environment`, `Surface` signatures), §4.5 attributes, §7.4 transparency union, §8 motion union, §15.1 matrix.
- Tasks: `docs/auraglass-5/tasks/SB.json` SB-040..SB-059 and SB-128 (provider swap).

Requirements: REQ-SB-01..07, REQ-SB-40, REQ-SB-42, REQ-SB-43, REQ-SB-46, REQ-SB-47, REQ-SB-48. Acceptance: AC-SB-01, AC-SB-02, AC-SB-03, AC-SB-07 (Storybook half: 8 ids in `cert-manifest.json`), AC-SB-18.

## 2. Scope
May create or modify:
- NEW `.storybook/environment/{StoryEnvironment.tsx,scenes.ts,scene-presentation.json,scene-strip.tsx,scenes.module.css}`
- NEW `.storybook/contract/StoryRoot.tsx`
- `.storybook/preview.tsx` (rewrite), `.storybook/main.ts` (stories globs, `staticDirs`, `viteFinal` resolution, externals; keep 17b's addon entry)
- Delete `.storybook/StorySurface.tsx`; remove the `previewSurface` parameter from every story file (239 files match `previewSurface|StorySurface` at HEAD). Remove the parameter only, using NEW `scripts/codemods/internal/remove-preview-surface.mjs` (jscodeshift-free AST edit via `@babel/parser` + `recast`, or `ts-morph` if already installed; check with `npm ls`).
- NEW `src/stories/Scenes.stories.tsx`
- NEW `scripts/storybook/write-cert-manifest.mjs`, generated `.storybook/cert-manifest.json`; `package.json` `postbuild-storybook` chains it after the build manifest
- NEW tests: `tests/storybook/{storybook-config.test.ts,StoryEnvironment.test.tsx,StoryRoot.test.tsx,story-ready.test.tsx,cert-scenes.test.ts}`, `tests/storybook/{scene-bands.test.mjs,write-cert-manifest.test.mjs}`
- `scripts/storybook/static-gates.mjs` (add the timer check, SB-057)
- `.github/workflows/storybook-tests.yml` (add a `scene-bands` job)

Must NOT touch: `certification/**` or scene assets (PRD-19 owns them; never copy or re-encode them), `src/material/**`, `src/styles/**` (including `glass.css:78-100`, which is PRD-04's), component source, `.storybook/lab/**` (17d), `.storybook/contract/defineComponentStories.tsx` (17e). Don't add the `certify` decorator mode; PRD-19 REQ-QA-11 owns it, and you only keep `StoryRoot` compatible with it.

## 3. Prerequisites (check; stop with a blocker report for the dependent tasks)
- 17b merged: `rg -n "story-no-optics" eslint-plugin-auraglass.js` and `test -f scripts/storybook/story-lint-baseline.json`.
- PRD-19 scenes (QA-038/039, `PROMPT_18d_QA_SCENES_GATES.md`): `test -f certification/scenes/scenes.manifest.json`, and `node -e "const m=require('./certification/scenes/scenes.manifest.json');console.log(Object.keys(m.scenes??m).length)"` shows 8 ids exactly matching `photo, saturated-abstract, dense-text, dark-media, flat-white, flat-black, hf-pattern, video-frame`. This blocks SB-040..044, SB-053, SB-059.
- PRD-04 (MAT-047/049/053, `PROMPT_04c_MAT_RUNTIME.md`): `test -f src/material/index.ts && rg -n "export.*\b(Environment|Surface)\b" src/material/index.ts`, plus a `./material` entry in `package.json` `exports` (PKG-005, `PROMPT_02a_PKG_BUILD.md`). This blocks SB-043, SB-053.
- PRD-05 (A11Y-029/032, `PROMPT_05b_A11Y_PREFERENCES_RUNTIME.md`): `rg -n "export.*AuraGlassProvider" src` returns the 5.0 provider with props `transparency`, `glassOpacity`, `contrast`, `motion`, `scheme`, `density`. This blocks **SB-128 only**. SB-048 lands first with an interim provider slot, because A11Y-019 depends on QA-031, which reaches SB-048 through QA-008 → SB-055; making SB-048 wait would be a dependency cycle.
- PRD-16 (FND-118 RM-01, `PROMPT_08f_FND_REMOVAL_EXECUTION.md`): the server graph is cut (`rg -l "from '(openai|redis|bcryptjs|jsonwebtoken|@pinecone-database/pinecone|@google-cloud/vision)'" src` is empty). This blocks SB-052; until then the externals list may only shrink.
- PRD-02 PKG-101 (`tasks/PKG.json`) moves `src/styles/storybook-enhancements.css` and `storybook-utility-shim.css` into `.storybook/` and imports them from `preview.tsx` in `@layer sb`. If it has landed, those files are in this PRD's tree. Strip from them every `!important`, every `StorySurface` reference (`storybook-enhancements.css:5`) and every `.sb-story` paint rule. If it hasn't landed, don't edit `src/styles/**`: the REQ-SB-01 `rg` for `src` is then scoped to `-g '*.stories.tsx' -g '*.mdx'` as AC-SB-01 states, and you report the remaining hit.

## 4. Steps
1. **SB-040 scene loader.** `scenes.ts` imports `certification/scenes/scenes.manifest.json` with a JSON import and a typed `SceneId` union of the 8 ids. It merges each entry with `scene-presentation.json` entries `{ id, label, backdrop: 'light'|'dark'|'media', focal: { x, y } }` and exports `getScene(id)` → `{ id, label, backdrop, src: '/scenes/<file>', video?: '/scenes/video-frame.webm', focal, sha256 }`. An id mismatch between the two files throws at import. Set `video-frame` `src` to the still frame and `video` to the loop.
2. **SB-041 `main.ts`.**
   - Add the stories globs `'../showcase/**/*.stories.tsx'` and `'../src/material/stories/*.stories.tsx'`.
   - Add `staticDirs: [{ from: '../certification/scenes', to: '/scenes' }]`.
   - Leave the `.mdx` globs in place.
3. **SB-051 exports-map resolution (REQ-SB-47).** Depends on PKG-005 (exports manifest) and PKG-115 (`AG_STORYBOOK_DIST=1` → `dist` alias for CI builds; PKG owns that branch of `main.ts`).
   - Every CI/evidence build (`deploy-storybook.yml`, `certify-*.yml`) sets `AG_STORYBOOK_DIST=1`, so `aura-glass` and `aura-glass/<subpath>` resolve to `dist/` through the `exports` map generated from `build/exports.manifest.json`. Prefer a workspace self-reference; otherwise generate one exact-match alias per `exports` key (`find: /^aura-glass\/material$/` → that key's dist file). Never use a directory alias, a `src/**` glob, or `@/`.
   - The local dev server may keep PKG-115's `src` alias (editing aid only, never evidence).
   - Any import of a non-exported path must fail the CI build.
   - `storybook-config.test.ts` asserts that with `CI=true` or `AG_STORYBOOK_DIST=1` no alias maps `aura-glass` to `src` and every alias `find` is an exact `exports` key whose target is a file.
   - Record in the report whether the self-reference resolved (PRD §21 O-SB-05).
   - If PKG-005's manifest isn't present, report the blocker and leave the current resolution untouched.
4. **SB-052 backend externals (REQ-SB-46).** Remove the `process.env` define (`main.ts:35-46`) and the `serverOnlyPackages` externals (`:48-67`: `@google-cloud/vision`, `@pinecone-database/pinecone`, `bcryptjs`, `jsonwebtoken`, `openai`, `redis`, and `socket.io-client`, which the PRD doesn't list but which is in the same array). Remove each package as soon as `rg` shows no `src/**` importer, and the whole block when FND-118 is done.
5. **SB-043 `StoryEnvironment.tsx`.**
   - Renders `<Environment backdrop={scene.backdrop} image={scene.src} video={interactive && scene.video}>` from `aura-glass/material`. Positioning uses `scenes.module.css` (layout, `object-fit: cover`, `object-position` from `focal`).
   - Sets no `background`, `color`, `.glass*`, tone class or `--ag-on-surface*` on any ancestor of the subject.
   - Video is muted, has a visible native-button pause control labelled "Pause background video", and doesn't play when `prefers-reduced-motion: reduce` or global `motion` is `none`/`calm` (WCAG 2.2.2).
   - Every capture uses the still frame.
6. **SB-045 `StoryRoot.tsx`.**
   - Renders exactly one `<div data-ag-story-content data-ag-story-kind={kind}>`, where `kind ∈ {lab, component, matrix, scene, showcase}`, taken from `parameters.agKind` or inferred from tags (`lab`→lab, `matrix`→matrix, `cert-scene`→scene, `showcase-s1|s2`→showcase, else component).
   - Sets `data-ag-cert-ready="true"` (SC-21) after `document.fonts.ready`, after all `img` inside have `decode()` resolved, and after a `useLayoutEffect` commit plus one `requestAnimationFrame`.
   - Paints nothing: no class, no style except `dir` and `data-ag-density`/`data-ag-tier` attributes from globals.
7. **SB-048 rewrite `preview.tsx`.**
   - Register `globalTypes` exactly per PRD §4.2: `environment` (8 ids, default `photo`), `scheme` (`light`,`dark`; default follows OS), `transparency` (`system`,`glass`,`tinted`,`solid`; default `system`), `glassOpacity` (`0`,`0.5`,`1`), `contrast` (`system`,`standard`,`more`; default `system`), `forcedColors` (`off`,`active`; interactive toggle shows a text note that it is CI-emulated), `motion` (`system`,`full`,`calm`,`none`; default `system`; MOT-091 adds/edits the toolbar entry by MODIFY), `tier` (`auto`,`lightweight`,`standard`,`enhanced`; default `auto`), `density` (`comfortable`,`compact`), `dir` (`ltr`,`rtl`). Every toolbar item has a text `title`.
   - Exactly one decorator: `<ProviderSlot>` wrapping `<StoryEnvironment>` wrapping `<StoryRoot>`. In SB-048 `ProviderSlot` is the existing 4.x provider stack minus the persona/preview toolbars; **SB-128** replaces it with `<AuraGlassProvider scheme transparency glassOpacity contrast density motion={motion==='system'?undefined:motion}>` (A11Y-029) and deletes `AccessibilityProvider`/`AnimationProvider`/`ThemeProvider`.
   - Set `parameters.backgrounds = { disable: true }`.
   - Viewports: `desktop` 1440×900, `laptop` 1280×800, `tablet` 834×1194, `mobile` 390×844.
   - `parameters.a11y = { test: 'error', config: { rules: [{ id: 'color-contrast', enabled: true }] } }`, overridden per `matrix` tag to `test: 'off'` in the contract generator (REQ-SB-48).
   - `storySort.order` = `['Start Here','Material Lab','Scenes','Showcases','Flagships',['Controls','Overlays','App Shell','Data','AI','Media'],'Core','Foundations','Migration']` (17e tests it).
   - Delete the persona/preview-mode toolbars (`:61-88`), backgrounds (`:116-136`), `initialSettings.reducedMotion` (`:168-174`) and the `ContrastGuard className="glass-contrast-guard"` `<main>` and skip links (`:185-197`).
   - No decorator sets `data-ag-motion` when `motion === 'system'`.
   - Leave a clearly marked extension point for the `certify` global branch that QA-041 adds (REQ-QA-11); don't implement it.
8. **SB-049 delete `StorySurface.tsx`** and run the codemod to remove `previewSurface` from all story files (forms at HEAD: `previewSurface: "component"|"app"|"marketing"`, single or double quotes, sometimes followed by ` }`). Then remove any `parameters: {}` the removal leaves empty. Proof: `rg -l "previewSurface|StorySurface" .storybook showcase -g '!__tests__'` = 0 and `rg -l "previewSurface|StorySurface" src -g '*.stories.tsx' -g '*.mdx'` = 0.
9. **SB-053 `src/stories/Scenes.stories.tsx`.**
   - Title `Scenes`, tags `['cert-scene', '!autodocs']`, 8 named exports producing the ids `scenes--photo` … `scenes--video-frame`. Each sets `globals: { environment: '<id>' }` and takes no args.
   - Body: `Surface` × {`regular`,`clear`,`identity`,`content-raised`} × {`thin`,`regular`,`thick`} = 12 cells, each ≥240×160 at 1440 and ≥160×120 at 390 (grid in `scenes.module.css`). Each cell has a 2-line label (`<strong>` variant, then thickness) and a 14 px body paragraph of real sentences (no banned strings).
   - **SB-058** adds the flagship strip (`Button`, `SegmentedControl`, `Slider`, `TextField`, `Tabs`, `Toast`) in `scene-strip.tsx`, imported from public `aura-glass` entries once PRD-08/09/10 export them.
10. **SB-055 `write-cert-manifest.mjs`.**
    - Reads `storybook-static/index.json` (verify-fresh first) and writes `.storybook/cert-manifest.json` = `{ schemaVersion: 1, sha, stories: [{ id, tags, kind, viewports: [1440, 390], axes: ['scheme','transparency','contrast','forcedColors','tier','motion'] }] }` for tags `cert-scene`, `showcase-s1`, `showcase-s2`, `lab`, `matrix`.
    - Fails on duplicate ids.
    - **SB-056** test covers generation, duplicate failure and a missing-id diff.
11. **SB-057 timers (REQ-SB-43).** Add a check to `static-gates.mjs`: `setTimeout|setInterval` in `*.stories.tsx`/`*.showcase.tsx` (ratchet count in `scripts/storybook/story-lint-baseline.json`, key `timers`; must reach 0 by 17f). Overlays use `defaultOpen`; streaming uses `StreamingText` with a `step` arg.

## 5. Tests to write and run
- `storybook-config.test.ts` (Jest; import `preview.tsx` default and `main.ts`) asserts:
  - `globalTypes` keys, values and defaults equal the PRD §4.2 table;
  - `decorators.length === 1`, and after SB-128 the provider is `AuraGlassProvider`;
  - `backgrounds.disable === true`;
  - no `initialSettings`;
  - `motion` default `system`, with no `data-ag-motion` rendered for it; `contrast` values `system|standard|more`; `glassOpacity` present;
  - `staticDirs` includes `/scenes`;
  - `viteFinal` output has no `define['process.env']`, no external among the 6 packages, and, with `CI=true`/`AG_STORYBOOK_DIST=1`, no alias whose target contains `/src`.
- `StoryEnvironment.test.tsx`: all 8 scenes. Walk ancestors of a test subject and assert no class matches `/glass-on-|glass-contrast|tone-/` and no inline `background`/`color` except on the `Environment` element; video absent under reduced motion.
- `StoryRoot.test.tsx`: one root, valid kind, `data-ag-cert-ready` only after a mocked `fonts.ready` and image decode.
- `story-ready.test.tsx`: an overlay story with `defaultOpen` and a `StreamingText` story at `step=n` reach final DOM with `jest.useFakeTimers()` and **no** timer advance.
- `cert-scenes.test.ts`: `composeStories` on `Scenes.stories.tsx`; 8 ids; 12 `[data-ag-surface]` cells; 6 flagship roots after SB-058; root `data-ag-backdrop` equals the manifest/presentation value.
- `scene-bands.test.mjs` (`node --test`, **remote only**, CI job `scene-bands`). Decode with PRD-19's image utilities in `packages/qa/**` if exported; otherwise use `sharp` exact-pinned as a devDependency. OCR with PRD-19's OCR module, or `tesseract-ocr` installed via apt on the runner. Assert the REQ-SB-04 bands exactly:
  - `flat-white` mean ≥245, `flat-black` ≤12, `dark-media` ≤70, `video-frame` still ≤100;
  - `photo` and `saturated-abstract` stddev ≥40;
  - `saturated-abstract` Hasler–Süsstrunk colourfulness ≥60;
  - `hf-pattern` ≥30% of 8×8 blocks with range ≥40;
  - `dense-text` ≥400 OCR words;
  - served `/scenes/<file>` sha256 from the built `storybook-static/scenes/` equals the manifest.

  On a band failure, file a PRD-19 defect. Don't swap or edit assets.

Run Jest tests locally (light) with `./node_modules/.bin/jest tests/storybook` (roots added by SB-127 in 17b) and the node tests with `node --test tests/storybook/write-cert-manifest.test.mjs`. Everything else runs in `storybook-tests.yml` and `deploy-storybook.yml` on GitHub-hosted runners.

## 6. Visual evidence (remote)
**SB-059:** on the PR SHA, trigger PRD-19's L6 Environment visual capture (`certify-pr.yml` `visual-reduced`, QA-031/QA-056, or the `auraone-remote-run` worker against the verified `storybook-static`) for `scenes--*` at 1440 and 390, light and dark. Attach:
- (a) the artifact URL of 16 PNGs;
- (b) PRD-19's REQ-QA-11 assertion result: pixels outside `[data-ag-story-content]` differ from the scene by ≤0.5%;
- (c) the AC-SB-01 measurement: switching `photo` → `flat-black` changes ≥30% of pixels inside the largest `regular` cell;
- (d) the axe count from the `vitest` job.

You can't view the PNGs; a human reviews them.

## 7. Integrity rules (binding)
- MAT-090 is a contract check of your SB-048 (SC-31); if it asserts something SB-048 doesn't provide, file it as an SB task rather than letting MAT edit `preview.tsx`.
- Don't fake scenes: no gradients or CSS standing in for a missing asset. If PRD-19 hasn't landed, the tasks are blocked.
- Don't widen REQ-SB-04 bands, exclude a scene, or set `a11y.test` to `'todo'`/`'off'` except on `matrix`.
- No `.skip`/`.only`, no snapshot updates to pass. No local browser, no local `build-storybook` as evidence, no local Docker.

## 8. Exit criteria
- AC-SB-01: both `rg` checks = 0, and (c) ≥30%.
- AC-SB-02 / AC-SB-03: `scene-bands.test.mjs` green remotely; default `environment` = `photo`.
- AC-SB-07 (this half): `cert-manifest.json` lists exactly the 8 `scenes--*` ids, and `cert-scenes.test.ts` is green with 12 + 6.
- AC-SB-18: `main.ts` has none of the 6 externals and no `process.env` (or blocked on PRD-16, with the remaining list).
- REQ-SB-05/06/07/43/47/48: the named tests are green.

## 9. Final report format
```
PROMPT-17c REPORT
Branch/SHA:
Tasks: SB-040..SB-059, SB-128 -> done|blocked (reason) each
Prereq status: QA-038/039 scenes, MAT-047/049/053 material, A11Y-029 provider, PKG-005/PKG-101/PKG-115, FND-118 server graph (cmd + output)
Scene bands: id -> measured values -> pass/fail
Remote evidence: capture artifact URL, outside-root diff %, scene-switch change %, axe violations
Tests: name -> pass/fail (local|remote URL)
Deviations: socket.io-client external; SB-048/SB-128 split; others with evidence
Files changed: (codemod: N story files)
```
