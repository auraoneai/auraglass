# PROMPT-06a (MOT): 4.x reduced-motion and loop fixes (4.1.1 / 4.2, change class C-I)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §2.1, §5.3, §5.10, §10, §11 item 2, §12, §20 steps 1–2.
Requirement IDs: REQ-MOT-22 (4.2 scoping only), REQ-MOT-27, REQ-MOT-28, REQ-MOT-29, REQ-MOT-64 (4.x error), REQ-MOT-85, REQ-MOT-86, §10 row "`always-safe` treated as `auto`" (MOTION-07 summary), REQ-MOT-T06, REQ-MOT-T07, REQ-MOT-T21 (`reduced-motion-initial` only).
Acceptance: **AC-MOT-15**. Tasks: `docs/auraglass-5/tasks/MOT.json` MOT-001..MOT-014.
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` (SC-16 rule name, SC-33 codemod layout, SC-36 4.1.1 scope, SC-29 workflows, SC-40 task ids) wins over this prompt.

## Common rules (binding)

- Repo: `/Users/gurbakshchahal/platforms/AuraGlass`. Decisions in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` win; if you deviate, write the deviation and its evidence in your final report.
- No fake completion: no mock implementations standing in for real behaviour, no placeholder files, no `it.skip`/`test.skip`/`describe.skip`/`test.fixme`/`xit`, no `--passWithNoTests`, no lowered thresholds, no `--update-snapshots`/`-u`, no deleting or weakening an existing assertion to get green, no `forceVisible`-style props in new stories. A requirement you cannot finish is reported as BLOCKED with the exact reason.
- Remote-first: Storybook builds, Playwright (all browsers), visual/screenshot capture and perf runs execute on CI (QA's `certify-pr.yml`, QA-031; SC-29) or on an ephemeral remote runner (skill `auraone-remote-run`). Never run Playwright/Chromium or Docker on the Mac. Local is limited to: `npm test -- <path>` (Jest, targeted), `npm run typecheck`, `node_modules/.bin/eslint <touched paths>`. Use `node_modules/.bin/*` executables, not `npx`.
- Do not add dependencies. `postcss`, `typescript`, `@typescript-eslint/parser`, `eslint` (8.57) and `@playwright/test` are already resolvable.
- Do not commit anything under `reports/`. Artifacts go to CI artifacts keyed by SHA (D-32).
- Do not touch files outside "May touch". Do not edit other PRDs' internals.

## Branch and prerequisites

Work on `release/4.x` (4.x LTS line). Verify before starting:

1. `git rev-parse --verify release/4.x` succeeds (created by REL branch policy from tag `v4.1.0`, `PROMPT_01c_REL_CLASSIFY_BRANCH.md`). If it does not exist: BLOCKED on REL; do not create it yourself and do not commit fixes to `main` instead.
2. Freeze the M-01 file list from tag `v4.1.0` (it is 0 after the fix lands, so it cannot be recomputed from the branch tip): `git grep -lP 'animate=\{\s*\w+\s*\?\s*\{\}' v4.1.0 -- src ':!*.stories.*' | wc -l` prints `35`. Record the list in the spec header.
3. Release placement is decided (SC-36): REQ-MOT-28 (cookie consent, privacy) is **accepted into 4.1.1** under TRUST's scope (MOT-005/006 target the 4.1.1 patch); REQ-MOT-86 (FPS loops) is **deferred to 4.2** (MOT-010/011). REQ-MOT-85 (Switch shimmer) is executed by CTL-154 (`PROMPT_09f_CTL_COMPAT_REMOVAL_CERT.md`) on the D-28 visual-fix list; MOT-009 only verifies it.
4. **Overlap with PRD-00 (`prompts/PROMPT_00d_TRUST_MOTION.md`, REQ-TRUST-28..30, tasks TRUST-041..046).** The 4.1.1 trust patch already rewrites the 84 M-01 sites in the same 35 files and adds the ESLint rule (TRUST-045, which per SC-16 lands it under the single name `auraglass/motion-no-empty-animate`, absorbing `no-empty-reduced-animate`) plus `expectSettledVisible` in `src/test-utils/motion.ts`. Check: `rg -n "motion-no-empty-animate|no-empty-reduced-animate" eslint-plugin-auraglass.js` and `rg --pcre2 -c "animate=\{[^}]*[Rr]educed[^?]*\?\s*\{\}" src` (0 once merged).
   - If PROMPT-00d is merged: step 2 becomes **verify-only** (run the codemod in `--dry` mode over `src/`; it must report 0 changes, proving the codemod and the manual fix agree), step 3 **extends** the existing rule instead of creating a second one (MODIFY of `motion-no-empty-animate`: add the `initial={{ opacity: 0 }}` case; if TRUST shipped the old name, rename it, do not alias), and T06 reuses `expectSettledVisible`. Do not re-edit the 35 files.
   - If PROMPT-00d is not merged: do not race it. Implement the codemod and fixtures (step 1) only, mark MOT-003/MOT-004 BLOCKED on TRUST-041..046, and continue with the cookie-consent, MotionFramer, policy, shimmer, FPS-loop and global-nuke steps, which PRD-00 does not cover.

## May touch

- `src/components/**` files in the frozen 35-file M-01 list (codemod output only)
- `src/components/cookie-consent/{CookieConsent,GlobalCookieConsent,CompactCookieNotice}.tsx` and NEW `src/components/cookie-consent/__tests__/visibility.test.tsx`
- `src/primitives/motion/MotionFramer.tsx`
- `src/contexts/MotionPreferenceContext.tsx`
- `src/components/layout/OptimizedGlassContainer.tsx` (`:66-84`), `src/components/advanced/GlassPerformanceOptimization.tsx` (`:92-95`)
- `src/styles/animations.css` (`:6-12`, `:530-536`), `src/styles/design-tokens.css` (`:134-140`, `:234-254`)
- `eslint-plugin-auraglass.js`, `eslint.config.js`, `.eslintrc.js` (REQ-MOT-64 rule only)
- NEW `packages/cli/src/migrate/4to5/transforms/reduced-motion-initial.ts`, NEW `packages/cli/src/migrate/4to5/__tests__/reduced-motion-initial.test.ts` and NEW fixtures `packages/cli/src/migrate/4to5/__fixtures__/reduced-motion-initial/<case>/{input,output}.tsx` (SC-33; engine DX-041/042 from `PROMPT_16c_DX_CODEMODS_COMPAT.md`; must satisfy DX-059's area contract)
- NEW `tests/motion/reduced-motion-visible-4x.spec.ts`, NEW minimal stories next to M-01 files that have none (`<Name>.stories.tsx`, no `forceVisible`)
- `CHANGELOG.md` / 4.2 release-notes section
- `.github/workflows/certify-pr.yml` (MODIFY of QA-031: add the T06/T07/T21 jobs for `release/4.x` in L9/L12, MOT-014; no separate workflow)

## Must not touch

`src/motion/**`, `tokens/**`, `package.json` dependency fields, any 5.0 file, `reports/**`, existing visual baselines, `src/components/input/GlassSwitch.tsx` (CTL-154 edits it), `scripts/audit/**`.

## Steps

1. **Codemod `reduced-motion-initial` (REQ-MOT-27, T21).** TypeScript compiler API (`typescript` is installed; no jscodeshift). Rewrite JSX `animate={c ? {} : X}` (also `undefined`/`false` empty branch, either branch order, `!c`) to `initial={c ? false : <original initial value>}` + `animate={X}`. If the element has no `initial` attribute, leave `initial` absent and only make `animate` unconditional (there is nothing to gate). Preserve formatting via text-span replacement. Fixtures: `prefersReducedMotion`, `reducedMotion`, `!shouldAnimate`, nested ternary, multiline attribute, already-fixed input (idempotent: second run = byte-identical).
2. Run the codemod on the frozen 35 files. Review each diff; `rg -n 'animate=\{\s*\w+\s*\?\s*\{\}' src` must return 0 non-story hits. `GlassQuantumTunnel.tsx:600-601` (`scale: 0`) and `GlassA11y.tsx:398-401` must be in the diff.
3. **REQ-MOT-64 rule** `auraglass/motion-no-empty-animate` in `eslint-plugin-auraglass.js` (MODIFY only; plugin wired by PKG-015; depends on TRUST-045): error on a JSX `animate` conditional with `{}`/`undefined`/`false` in either branch, and on `initial={{ opacity: 0 … }}` alongside a conditional `animate`. Wire as `error` for `src/**` in `eslint.config.js` and `.eslintrc.js`. Valid/invalid fixtures go in this PR inside the rule's test (06e will move them into `tests/lint/motion-rules.test.ts`).
4. **Cookie consent (REQ-MOT-28).** Remove `useGalileoStateSpring` from all three components (`CookieConsent.tsx:96,114,160,185,205`; `GlobalCookieConsent.tsx:109,285,302,366`; `CompactCookieNotice.tsx:103,154,171,200`). Drive a `data-state="open|closed"` attribute from `visible`; CSS transition on `opacity`/`transform` only, using existing 4.x duration vars. Closed: `visibility: hidden; pointer-events: none` after the transition (`transition: visibility 0s linear <exit-duration>`). Do not change `forceVisible` semantics.
5. **T07** `visibility.test.tsx`: render each component **without** `forceVisible`, advance fake timers past the show timeout, assert computed opacity `1`; dismiss, end transition, assert `visibility: hidden` and `pointer-events: none`.
6. **MotionFramer (REQ-MOT-29).** Replace `useState(true)` at `MotionFramer.tsx:235` with `useSyncExternalStore(subscribe, () => matchMedia('(prefers-reduced-motion: reduce)').matches, () => false)`. Mount presets play on first client render when motion is allowed; reduced resolves to final state (no `initial`).
7. **`"always-safe"` (§10, C-I).** In `MotionPreferenceContext.tsx` treat `"always-safe"` exactly as `"auto"` and emit one `console.warn` per session in development (`process.env.NODE_ENV !== 'production'`). Fix the misleading comment at `:38-41`. Type stays (removal is 5.0).
8. **Switch shimmer (REQ-MOT-85, verify only, MOT-009).** CTL-154 removes the `animation="shimmer"` branch at `GlassSwitch.tsx:247`. Verify `rg '"shimmer"' src/components/input/GlassSwitch.tsx` = 0 and that the before/after composite (D-28) is attached to CTL's PR; if CTL-154 is not merged, report MOT-009 BLOCKED on CTL-154.
9. **FPS loops (REQ-MOT-86, 4.2 train).** Delete the permanent rAF FPS monitors at `OptimizedGlassContainer.tsx:66-84` and `GlassPerformanceOptimization.tsx:92-95` including the `setCurrentFps`/`setPerformanceScore` state they feed; keep the public props compiling (deprecated no-op where a prop exposed the value, with a dev warning).
10. **Scope global nukes (REQ-MOT-22, 4.2 part).** Change the `*` selectors in `animations.css:6-12`, `:530-536`, `design-tokens.css:134-140` and the "keep essential" block `:234-254` to `[data-glass-component], [data-glass-component] *`. Keep `!important` on 4.2 (removal is 4.3 preview / 5.0). Run the D-27 visual-class gate with a before/after composite of the frozen 4.x fixture; list the change in 4.2 release notes as "reduced-motion rules no longer disable consumer-owned animations".
11. **T06** `tests/motion/reduced-motion-visible-4x.spec.ts`: one test per frozen file's story, `reducedMotion: 'reduce'`, wait 1 s, assert the animated element's computed opacity is `1` and `scale`/transform matrix scale is `1`. Named tests include `GlassA11y`, `GlassPresenceIndicator`, `GlassQuantumTunnel`. Add a minimal story (no `forceVisible`) for any file without one.

## Tests to run

- Local (targeted): `npm test -- packages/cli/src/migrate/4to5/__tests__/reduced-motion-initial.test.ts src/components/cookie-consent/__tests__/visibility.test.tsx`; `npm run typecheck`; `node_modules/.bin/eslint src/components src/primitives/motion` (must be 0 `motion-no-empty-animate` errors).
- Remote only: `npm run build-storybook`, then `node_modules/.bin/playwright test -c certification/playwright.cert.config.ts --project motion tests/motion/reduced-motion-visible-4x.spec.ts` (all three engines) against the static build, run through `certify-pr.yml` on `release/4.x`; the visual-class gate is REL's (SC-09). Use CI or `auraone-remote-run`.

## Visual evidence

Remote screenshots, attached as CI artifacts: before/after composites for (a) Switch stories, (b) frozen 4.x fixture with scoped nukes, (c) `GlassA11y`, `GlassQuantumTunnel`, `CookieConsent` under `reduce` (before: invisible, after: visible). Human review of (a) and (b) is required before merge; you cannot view screenshots yourself, so list artifact paths for the reviewer.

## Exit criteria

- AC-MOT-15: REQ-MOT-T06 green for all 35 files on 3 engines and REQ-MOT-T07 green for the 3 cookie-consent components on `release/4.x`.
- T21 fixtures green and idempotent; 0 `motion-no-empty-animate` errors in `src/**`.
- `rg "useGalileoStateSpring" src/components/cookie-consent` = 0; `rg "requestAnimationFrame" src/components/layout/OptimizedGlassContainer.tsx` = 0; `GlassSwitch.tsx` contains no `"shimmer"` (CTL-154).

## Final report format

```
PROMPT-06a REPORT
Branch/commit: <sha on release/4.x>
Tasks: MOT-001..014 -> DONE | BLOCKED(<reason>) each
AC-MOT-15: PASS/FAIL (CI run URL, artifact names)
Files changed: <list>
Frozen M-01 list: <35 paths>
Tests: <name> -> pass/fail, where run (local/remote runner id)
Visual evidence: <artifact paths>, human review: pending/approved
Deviations: <none | item + evidence>
```
