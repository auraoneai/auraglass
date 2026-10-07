# PROMPT-00d (TRUST): reduced motion never hides content

Source PRD: `docs/auraglass-5/prd/AURAGLASS_TRUST_PATCH_4_1_1_PRD.md` (PRD-00) §2.4, §4.4 (reduced-motion final state), §5.5, §12, §15, §16 (rAF/WAAPI row), §5.11 (REQ-TRUST-54), §20 step 7. Cookie-consent contract: PRD-06 (MOT) REQ-MOT-28 / REQ-MOT-T07 (accepted 4.1.1 intake, SC-36); lint rule name owner: MOT REQ-MOT-64 (SC-16). Evidence: `docs/auraglass-5/autopsy/motion.md` (MOTION-01 CONFIRMED, MOTION-02), `docs/auraglass-5/autopsy/runtime-remote.md` §5.
Requirements: REQ-TRUST-28, -29, -30, -54. Acceptance: AC-TRUST-12, -26, -28 (rule-name half).
Tasks: TRUST-041..TRUST-046, TRUST-088, TRUST-089. Repo root: `/Users/gurbakshchahal/platforms/AuraGlass`.

## Common rules (binding)

0. Shared contract registry `docs/auraglass-5/prd/_shared-contracts.md` (binding; a registry row wins over PRD or prompt text). Use only registry names: `.github/workflows/publish-npm.yml` (never `release.yml`), `etc/api/` (root slug `index`), `tests/release/`, repo-root `deprecations.json` (`version: 1`), `scripts/ci/lib/{npm-pack,evidence-dir}.js` (no `scripts/lib/`), `auraglass/motion-no-empty-animate`, artifact `retention-days` 14 PR / 30 main / 90 release, unchanged `glass-pipeline.yml` job names (SC-02..SC-07, SC-10, SC-11, SC-16). `depends_on` in `tasks/TRUST.json` holds only real task ids (SC-40).
1. Architecture `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` is canonical. This is a 4.x C-I fix; the 5.0 motion system (PRD-06, `prompts/PROMPT_06_MOT.md`) later replaces it — do not introduce `usePreference` or new tokens here.
2. Remote-first: no Playwright/Chromium, Storybook build, `npm run build`, full `npx jest --ci` on the Mac. Use GitHub Actions on the PR (read `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or `auraone-remote-run`. Local: `rg`, `git`, `npx eslint <files>`, `npx jest <one named test file>`.
3. Forbidden: placeholder implementations; `.skip`/`.only`/`xit`; `--passWithNoTests`; `continue-on-error`; `|| true`; `--no-verify`; eslint-disable of `auraglass/motion-no-empty-animate`; lowering the 35/35 target; `jest -u`. Do not mock `framer-motion` in the visibility test (the test must observe Framer's real mount behaviour); mocking `window.matchMedia` is required and allowed.
4. Non-reduced behaviour must be unchanged: the `false` branch of every rewritten conditional keeps the original object/variant reference.
5. D-32: no evidence committed. No `package.json` `dependencies`/`peerDependencies`/`exports` change. Conventional commits, no `!`, `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Prerequisites

- PROMPT_00a merged (`test -f scripts/ci/lib/evidence-dir.js`).
- If PROMPT_00c is open, rebase after it merges for the overlapping files `src/components/advanced/GlassPredictiveEngine.tsx`, `GlassEyeTracking.tsx`, `GlassAchievementSystem.tsx` (00c owns hook lines, 00d owns `animate=` lines).
- Baseline: `rg --pcre2 -c "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` → 84 matches in 35 files; paste output in the PR.

## May touch

NEW `src/test-utils/motion.ts`; the 35 files: `src/components/interactive/GlassFacetSearch.tsx`, `social/GlassPresenceIndicator.tsx`, `mobile/TouchGlassOptimization.tsx`, `voice/VoiceGlassControl.tsx`, `ar/ARGlassEffects.r3f.tsx`, `animations/GlassTransitions.tsx`, `advanced/GlassSelfHealingSystem.tsx`, `advanced/GlassPredictiveEngine.tsx`, `advanced/GlassMetaEngine.tsx`, `effects/SeasonalParticles.r3f.tsx`, `effects/GlassShatterEffects.r3f.tsx`, `effects/AuroraPro.r3f.tsx`, `advanced/BrandColorIntegration.tsx`, `social/GlassReactionBubbles.tsx`, `houdini/HoudiniGlassCard.tsx`, `advanced/GlassReactions.tsx`, `advanced/GlassLiveCursorPresence.tsx`, `advanced/GlassFoldableSupport.tsx`, `advanced/GlassAchievementSystem.tsx`, `website-components/GlassWipeSliderExamples.tsx`, `social/GlassVoiceWaveform.tsx`, `social/GlassSocialFeed.tsx`, `social/GlassCollaborativeCursor.tsx`, `quantum/GlassQuantumTunnel.tsx`, `quantum/GlassProbabilityCloud.tsx`, `quantum/GlassCoherenceIndicator.tsx`, `layouts/GlassIslandLayout.tsx`, `demo/EnhancementShowcase.tsx`, `animations/AdvancedAnimations.tsx`, `ai/GlassGenerativeArt.tsx`, `advanced/GlassQuantumStates.tsx`, `advanced/GlassNeuroSync.tsx`, `advanced/GlassEyeTracking.tsx`, `advanced/GlassContextualEngine.tsx`, `accessibility/GlassFocusIndicators.tsx` (all under `src/components/`); `src/components/GlassA11y.tsx` region `:398-401` if `rg` shows it matches the second pattern; `eslint-plugin-auraglass.js` (existing file, MODIFY only; owner PKG, SC-16); `eslint.config.js` (enable the new rule); `src/components/cookie-consent/{CookieConsent,GlobalCookieConsent,CompactCookieNotice}.tsx` and their stories (add one story without `forceVisible`); NEW `src/components/cookie-consent/__tests__/visibility.test.tsx`; NEW `docs/release/decisions/4.1.1-reduced-motion-remote-only.md` (only if a WebGL exception exists); NEW `src/__tests__/motion/reduced-motion-visible.test.tsx`; NEW `tests/eslint/motion-no-empty-animate.test.ts`.

## Must not touch

`src/contexts/MotionPreferenceContext.tsx` (MOTION-02 is PRD-06), motion tokens/CSS, `src/hooks/useGalileoStateSpring.ts` (unchanged; PRD-06 removes it in 5.0), FPS-loop code (REQ-MOT-86 is deferred to 4.2, SC-36), hook lines in shared files (00c), stories other than cookie consent, snapshots.

## Steps

1. TRUST-041 (REQ-TRUST-30). Create `src/test-utils/motion.ts` exporting `mockReducedMotion(reduce: boolean)` (installs a `window.matchMedia` returning `matches` for `(prefers-reduced-motion: reduce)` with `addEventListener`/`addListener` stubs) and `expectSettledVisible(element: HTMLElement)`: walks the element and its descendants with non-empty text; for each, inline `style.opacity` and `getComputedStyle().opacity` are `''` or `1`; inline/computed `transform` is `''`, `none`, or an identity matrix (`matrix(1, 0, 0, 1, 0, 0)` / `translateX(0px) …` with zeros and `scale(1)`). Fails with the offending node path.
2. TRUST-042 (REQ-TRUST-28, batch 1: `advanced/*`, `ar/*`, `effects/*`, `houdini/*`, `quantum/*`). For each site replace `animate={reduced ? {} : X}` with `initial={reduced ? false : I}`, `animate={reduced ? FINAL : X}`, `transition={reduced ? { duration: 0 } : T}` where `FINAL` sets, for every key present in `I`, the visible end value (`opacity: 1`, `scale: 1`, `x: 0`, `y: 0`, `rotate: 0`; other keys take the value of `X`'s settled keyframe). Apply the same rule to variables named `prefersReducedMotion`, `shouldReduceMotion`, `isReducedMotion`, and to `? {} : { opacity|scale …}` forms.
3. TRUST-043 (REQ-TRUST-28, batch 2: all remaining files of the list). Same rule. After both batches: `rg --pcre2 "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` = 0 and `rg --pcre2 "\?\s*\{\}\s*:\s*\{\s*(opacity|scale)" src` = 0.
4. TRUST-044 (REQ-TRUST-28/-30). `src/__tests__/motion/reduced-motion-visible.test.tsx`: a table of 35 rows `{ file, component, props }`; each row `mockReducedMotion(true)`, mounts the representative component (exported component of that file whose subtree contains a rewritten site, with props that make the site render), flushes `act()` + `jest.runAllTimers()`, then `expectSettledVisible(container)`. Count assertion: rows.length === 35 and each `file` exists. For `.r3f.tsx` files whose rewritten `motion.*` element is in a DOM overlay, render that overlay; if a file cannot mount in jsdom because it requires WebGL, do not mock the component, do not add test-only exports and do not use `test.failing`; instead mark the row `remoteOnly: true` (the row is not mounted in jest, the count assertion still requires 35 rows, and the test asserts every `remoteOnly` file appears in `docs/release/decisions/4.1.1-reduced-motion-remote-only.md` (NEW) with its jsdom error text and story id), declare a deviation in the PR with the jsdom error text, and cover that file in the remote lane (step 6) with its story id.
5. TRUST-045 (REQ-TRUST-29). MODIFY the existing `eslint-plugin-auraglass.js` (never create it; PKG owns the file, SC-16): add rule `motion-no-empty-animate` (registry name owned by MOT REQ-MOT-64; MOT extends it later): report a `JSXAttribute` named `animate` whose expression is a `ConditionalExpression` with an `ObjectExpression` of 0 properties in either branch; message `Reduced-motion branch must animate to the visible end state, not {}.` Enable as `'auraglass/motion-no-empty-animate': 'error'` in `eslint.config.js` for `src/**`. Test `tests/eslint/motion-no-empty-animate.test.ts` with `RuleTester`: invalid `animate={r ? {} : {opacity:1}}`, `animate={r ? {opacity:1} : {}}`; valid `animate={r ? {opacity:1} : v}`, `animate={v}`.
6. TRUST-046 (remote lane, PRD §15/§16). With `auraone-remote-run` on CI-built `storybook-static/` at the PR SHA, Chromium with `reducedMotion: 'reduce'`, for every story of the 35 components that exists (`node -e` over `storybook-static/index.json` to list ids; record the components with no story): 500 ms after load assert no visible-text node has computed `opacity < 1`, and 1 s after mount `document.getAnimations().length === 0` within the component root; capture a screenshot per story. Upload as `evidence-reduced-motion-<sha>`; commit nothing.
7. TRUST-088 (REQ-TRUST-54; MOT REQ-MOT-28, SC-36 accepted, privacy). In `CookieConsent.tsx` (`:96, :114, :160, :185, :205`), `GlobalCookieConsent.tsx` (`:109, :285, :302, :366`) and `CompactCookieNotice.tsx` (`:103, :154, :171, :200`) stop using `useGalileoStateSpring`; drive opacity/transform from `visible` with a CSS transition on `data-state="open|closed"`; while hidden or after dismiss set `visibility: hidden` and `pointer-events: none`; transition duration 0 under reduced motion. Add one story per component without `forceVisible`. List the change for 00g's `deprecations.json` seed (`kind: behavior`, `exception: privacy`) and for 00f's release notes.
8. TRUST-089. `src/components/cookie-consent/__tests__/visibility.test.tsx` (the REQ-MOT-T07 file; MOT inherits it): for each component without `forceVisible`, after the show timeout computed `opacity` is `1`; after dismiss `visibility: hidden` and `pointer-events: none`; a click at the banner position while hidden calls no consent callback; `rg -n useGalileoStateSpring src/components/cookie-consent` = 0.

## Tests to run

Local: `npx jest src/__tests__/motion/reduced-motion-visible.test.tsx`, `npx jest tests/eslint/motion-no-empty-animate.test.ts`, `npx jest src/components/cookie-consent/__tests__/visibility.test.tsx`, `npx eslint` on the 35 files and the 3 cookie-consent files. Remote (PR CI): full `npx jest --ci`, `lint:check`; the remote Chromium lane of step 6.

## Visual evidence

Step 6 screenshots (one per existing story under emulated reduce) and the JSON of opacity/animation checks; human reviewer confirms content is visible. Artifacts only.

## Exit criteria

AC-TRUST-12: both `rg` patterns = 0; `reduced-motion-visible.test.tsx` passes 35/35 rows (or each exception is a declared WebGL deviation with remote evidence showing opacity 1); remote lane reports 0 nodes with `opacity < 1` and 0 running animations; `lint:check` green with `auraglass/motion-no-empty-animate` at `error` (AC-TRUST-28 rule-name half). AC-TRUST-26: `visibility.test.tsx` passes for all 3 cookie-consent components and `useGalileoStateSpring` is gone from `src/components/cookie-consent`.

## Final report

```
## PROMPT_00d report
Branch/PR: <url>  Head SHA:
| REQ | Status | Commit | Evidence |
| AC-TRUST-12 | Status | Evidence |
Sites: 84 → 0 (rg output); files 35/35 rewritten
Test rows passing: N/35; WebGL deviations: <file: error, remote evidence url>
Cookie consent: 3/3 components pass visibility.test.tsx; DEP entry handed to 00g: <text>
Remote lane: stories checked N, components without story <list>, opacity failures 0, running animations 0, artifact url
Deviations / Blockers:
```
