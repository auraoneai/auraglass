# PROMPT-10a (OVL): 4.x line — privacy cut (4.1.1 via TRUST intake, else 4.2), 4.2 bridge fixes, 4.2/4.3 deprecations

You are implementing part of PRD-OVL (Flagship Overlays) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_OVERLAYS_PRD.md` §1 (items 1, 4, 7, 8), §2.1, §2.3 (E-28..E-31), §5.9, §9, §11 item 11, §12.1 (last two 4.x rows), §12.3 `overlays-glass-modal-4x.spec.ts`, §20 steps 1–2 and 9.
- Architecture: §13.1, §13.3, §14 (D-27 change classes, visual-class gate), D-28.
- Evidence: `docs/auraglass-5/autopsy/runtime-remote.md` §4–§5 (12 fps, 12 backdrop-filters, 4 infinite animations, forced colors 12 → 10).
- Release tooling: `docs/auraglass-5/prd/AURAGLASS_RELEASE_MIGRATION_PRD.md` REQ-REL-07/-08 (`deprecations.json`, `gen-deprecations.mjs`, `src/internal/warnDeprecated.ts`).
- Contracts: `docs/auraglass-5/prd/_shared-contracts.md` SC-02 (root `deprecations.json`, `version: 1`), SC-20 (`glass.css` edits are `release/4.x` only), SC-30, SC-33 (codemod ids), SC-36 (4.1.1 scope), SC-40.
- Tasks: `docs/auraglass-5/tasks/OVL.json` OVL-001..OVL-017 (`depends_on` holds anchor task ids; `gate` holds release-vehicle conditions).

Requirements: REQ-OVL-05 (attribution half only), REQ-OVL-70, -71, -72, -73, -74. Acceptance: AC-OVL-18, AC-OVL-05 (4.x half), AC-OVL-08 (4.2 half), AC-OVL-16 (the `deprecations.json` half).

## 2. Scope
May modify:
- `src/components/modal/GlassModal.tsx`, `GlassDialog.tsx`, `GlassDrawer.tsx` and their existing `GlassModal.test.tsx`, `GlassDialog.test.tsx`, `GlassDrawer.test.tsx`
- `src/styles/glass.css`: only the forced-colors/reduced-transparency fallback block (`:4022-4123`), plus one appended, delimited block `/* glass-notification-center (moved from runtime injection) */`
- `src/components/data-display/GlassNotificationCenter.tsx`: delete the `<style id="glass-notification-styles">` injection at `:471-474` only
- Delete `src/components/feedback/GlassToast.tsx`, but only after `rg -n "feedback/GlassToast" src` shows no importer and `src/index.ts` doesn't export it
- Repo-root `deprecations.json` (entries only, by MODIFY: TRUST-075 seeds it; REL-010 owns the schema `docs/schemas/deprecations.schema.json`; `codemod` is an SC-33 id or null). Add `warnDeprecated(id)` call sites to: `GlassModal.tsx`, `GlassDialog.tsx`, `GlassDrawer.tsx`, `GlassNotificationCenter.tsx`, `src/primitives/Positioner.tsx`, `src/primitives/positioning/GlassPositioner.tsx`, `src/overlays/index.ts`. The 4.3 rename warnings go in every §2.4 file (`src/components/modal/*.tsx`, `src/components/mobile/GlassActionSheet.tsx`, `src/components/mobile/TouchGlassOptimization.tsx`, `src/components/navigation/{GlassDropdownMenu,GlassContextMenu,GlassMenubar,GlassMenuPrimitive,HeaderUserMenu}.tsx`, `src/components/navigation/components/CollapsedMenu.tsx`, `src/components/data-display/{GlassToast,GlassToastProvider}.tsx`).
- NEW `tests/perf/browser/overlays-attribute-infinite-animations.spec.ts`, NEW `tests/perf/browser/overlays-glass-modal-4x.spec.ts`, NEW `tests/visual/components/glass-modal-forced-colors.spec.ts`, NEW `src/components/modal/__tests__/overlay-deprecations-4x.test.tsx`

Must NOT touch: `glass.css` on `main` (its 5.0 removal is MOT-084, SC-20); `backdropBlurClasses` in `GlassModal.tsx:738-743` (the sm/md/lg bug stays on 4.x, D-27); public prop types (no C-B on 4.x); any 5.0 overlay file (`src/components/{overlays/_shared,dialog,alert-dialog,sheet,popover,tooltip,menu,toast}/**`); `src/index.ts` exports; `package.json` dependencies.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 4.1.1 intake (PRD-TRUST, SC-36): TRUST is the only owner of 4.1.1 contents. REQ-OVL-70 (OVL-001..006) is not in the SC-36 accepted list, so check the TRUST PRD §scope for it first. If TRUST has accepted it and `git ls-remote origin release/4.1.1-trust release/4.1.1` returns a branch, target that branch. Otherwise OVL-001..006 ship on `release/4.x` for 4.2 (PRD §21 O-2). OVL-007..009 are never 4.1.1 scope.
- TRUST-075 / REL-010 / REL-070 / REL-072: `test -f deprecations.json && test -f docs/schemas/deprecations.schema.json && test -f scripts/release/gen-deprecations.mjs && test -f src/internal/warnDeprecated.ts`. OVL-014..017 need all four. If either is missing, those tasks are blocked. Don't write your own warning helper.
- 4.2/4.3 work: `git rev-parse --verify origin/release/4.x`. It is cut by PROMPT_01d. If it is missing, OVL-008..017 are blocked.
- REL-040 visual-class gate (`scripts/release/visual-class.mjs`): `test -f scripts/release/visual-class.mjs`. If absent, run the pixel diff as a Playwright `toHaveScreenshot` against a capture of the **pre-change SHA** built in the same remote job (both captures in one run), with `maxDiffPixels: 0`.

## 4. Steps
1. **OVL-001 GlassModal analytics.** Delete `data-user-stress`, `data-interaction-count` (`:796-797`), `data-time-spent={… Date.now() …}` (`:838`) and any `data-consciousness-*`/`data-modal-complexity`, along with the state that only feeds them.
2. **OVL-002 GlassModal effects.** Make the open/interaction recording (`:418-430`), gaze (`:515-530`), biometric (`:550-560`) and predictive (`:599-612`) effects and the `setInterval` at `:581` no-ops. Keep the props in the types. When any of `consciousness|predictive|adaptive|eyeTracking|trackAchievements` is truthy, emit one dev-only `console.warn` per page load (the 4.1.1 text: "has no effect since 4.1.1 and is removed in 5.0"). That call becomes `warnDeprecated` in OVL-015.
3. **OVL-003 GlassDialog.** Remove `data-dialog-urgency`, `data-user-stress` and `data-interaction-count` (`:589-592`). No-op the intervals at `:339` and `:451` (3,000 ms adaptive loop).
4. **OVL-004 GlassDrawer.** Remove the attributes at `:795-796` and `:839`, and no-op the interval at `:487`.
5. **OVL-005 tests.** In the three existing test files, assert that the 6 attributes are absent and that `jest.getTimerCount()` is 0 after render with `consciousness adaptive predictive eyeTracking` set (fake timers, advance 10 s). Run them locally: `./node_modules/.bin/jest src/components/modal/GlassModal.test.tsx src/components/modal/GlassDialog.test.tsx src/components/modal/GlassDrawer.test.tsx`.
6. **OVL-006 pixel parity (remote).** Capture the `glass-modal`, `glass-dialog` and `glass-drawer` default stories at 1440×900 and 390×844 at the pre-change SHA and at the branch SHA. The diff must be 0 pixels (D-27 visual-class gate).
7. **OVL-007 attribution (REQ-OVL-05).** `overlays-attribute-infinite-animations.spec.ts` opens the `glass-modal` story under the `runtime-remote.md` §5 script and dumps `document.getAnimations().filter(a => a.effect.getTiming().iterations === Infinity).map(a => ({ name: a.animationName, target: cssPath(a.effect.target) }))`. Attach the JSON as a CI artifact and paste the list into the PR. Expect sources such as `glass-float`/`glass-shimmer`/`glass-ambient` (`src/styles/glass.css:622,643,648`), but don't assume them.
8. **OVL-008/009 4.x frame-rate fix (REQ-OVL-71, `release/4.x`).** For each attributed animation on an overlay layer, stop it while the overlay is open and idle (`animation-play-state: paused` under an open-state selector, or omit the class while open), but only if the settled-frame pixel diff stays 0. `overlays-glass-modal-4x.spec.ts` asserts fps ≥30 under the same script on desktop and mobile profiles, plus a pixel diff of 0. If 30 isn't reachable without a visible change, the spec records the measured fps and the PR states "deferred to 5.0". The threshold isn't lowered.
9. **OVL-010/011 forced colors (REQ-OVL-72, 4.2).** Add the modal scrim classes (the `backdropBlurClasses` outputs used at `GlassModal.tsx:800-815`), the panel classes and `.liquid-glass-modal-surface` to both fallback blocks in `glass.css:4022-4123`. `glass-modal-forced-colors.spec.ts` (remote Chromium, `forcedColors: 'active'`) counts visible elements with a computed `backdrop-filter` ≠ `none`: it expects 0 (today 10 under forced colors, 12 without). Produce before/after composites as artifacts and label the PR as a D-28 visual bug fix.
10. **OVL-012 notification CSS.** Move the injected rules into the appended `glass.css` block, verbatim. Delete the injection. The side-effect gate (PRD-PKG) must stop flagging `dist/index.mjs` for `glass-notification-styles`.
11. **OVL-013** Delete `src/components/feedback/GlassToast.tsx` (C-I, unexported).
12. **OVL-014/015 4.2 C-D (REQ-OVL-73).** Add `deprecations.json` entries (kind `prop` / `export` / `subpath`, `since: "4.2.0"`, `removeIn: "5.0.0"`) for every item in REQ-OVL-73. Wire `warnDeprecated(id)` at render or first use. Regenerate `src/internal/deprecations.generated.ts` with `node scripts/release/gen-deprecations.mjs` (don't hand-edit it).
13. **OVL-016 4.3 renames (REQ-OVL-74).** Add a C-D `export` entry for each §2.4 name with a 5.0 successor (successor named in `message`; `codemod` = `canonical-names` or `prop-grammar`). Wire `warnDeprecated` once per symbol.
14. **OVL-017** `overlay-deprecations-4x.test.tsx`: each wired id warns exactly once across two renders, and stays silent under `NODE_ENV=production`.

## 5. Tests to run
Local (light): the jest files from steps 5 and 14, `./node_modules/.bin/eslint` on the changed files, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`. Remote: OVL-006, -007, -009 and -011 Playwright runs plus a Storybook build in GitHub Actions or on an EC2 runner (`auraone-remote-run`). Attach the run URLs.

## 6. Visual evidence
Remote pixel-diff artifacts (0 px) for 3 stories × 2 viewports. Forced-colors before/after composites for `glass-modal`. The fps table (before/after, desktop/mobile). Human review of the composites happens on the CI artifact. Screenshots can't be inspected by the agent.

## 7. Integrity rules (binding)
Never use local Docker or a local browser. Don't mock components. Don't skip tests. Never pass `--update-snapshots`. Don't change `maxDiffPixels` above 0. Don't lower the fps target (record the shortfall instead). Don't delete public props on 4.x. Don't commit evidence files.

## 8. Exit criteria
- AC-OVL-18: 0 analytics attributes, 0 overlay intervals on the 4.1.1 (if TRUST accepted) or 4.2 Modal/Dialog/Drawer, pixel diff 0 (OVL-001..006).
- REQ-OVL-05 attribution list in the PR (OVL-007).
- AC-OVL-05 (4.x half): `glass-modal` ≥30 fps with diff 0, or the shortfall recorded (OVL-009).
- AC-OVL-08 (4.2 half): forced-colors count 12 → 0 (OVL-011).
- AC-OVL-16 (deprecations half): every REQ-OVL-73/-74 entry is present and its generator `--check` is green (OVL-014..017).

## 9. Final report format
```
PROMPT-10a REPORT
Branches/SHAs: 4.1.1=… (or 'not accepted by TRUST') 4.2=… 4.3=…
Tasks: OVL-001..017 -> done|blocked (reason) each
Attribution: [{name,target}] x4 (artifact URL)
fps glass-modal before/after (desktop, mobile):
Forced-colors visible backdrop-filters before/after:
Pixel diffs: story x viewport -> px
deprecations.json ids added:
Prereq blockers:
Tests: name -> pass/fail (local|remote URL)
Deviations (with evidence) or none
Files changed:
```
