# PROMPT-06d (MOT): `aura-glass/motion` adapter, `motion@^12` optional peer, dependency allowlist (5.0)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §4.3 (physical spring params), §4.8, §5.7, §14 (REQ-103), §16 (REQ-122).
Requirement IDs: REQ-MOT-50, -51 (add `motion` only; removing `framer-motion` is 06f), -52, -53, -54, -55, -56, -57, -58, -59, -103, -122; tests REQ-MOT-T14, T15, T16.
Acceptance: **AC-MOT-01**, **AC-MOT-17**, `/motion` part of **AC-MOT-12**. Tasks: MOT-053..MOT-064.
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` wins (SC-12 exports manifest is PKG's; SC-14 allowlist file and checker are PKG's, MOT adds rows only; SC-04 API reports at `etc/api/<slug>.api.md` + `.exports.json`; SC-15 size rows in `docs/size-budgets.json`; SC-39 `verify-no-core-ui-deps.js` is deleted by PKG-075).

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`, branch `main`. Architecture D-25 (no JS motion runtime in core; `motion` optional peer of `/motion` only) and D-29 (dependency allowlist) win.
- No fake completion: no placeholder exports, no stub hooks returning constants, no skipped/fixme tests, no lowered thresholds or snapshot updates. Unfinishable ⇒ BLOCKED with reason.
- Remote-first: packed-tarball canary, Vite/Next consumer builds and any browser run on CI/remote runner (skill `auraone-remote-run`). Local: `npm test -- <path>`, `npm run typecheck`.
- Only one new package: `motion` (exact pin in `devDependencies`, `^12` optional peer). Choose the latest `12.x` published at execution time, record the version. No other dependency changes.
- Every file under `src/motion/adapter/` starts with `"use client";`.

## Prerequisites (verify)

1. PROMPT-06b and PROMPT-06c merged: `src/motion/tokens.generated.ts`, `src/motion/capability.ts`, `src/motion/ticker.ts` exist.
2. PKG (`PROMPT_02_PKG.md`): `build/exports.manifest.json` (PKG-005) has a `./motion` row building `src/motion/adapter/index.ts` with `motion` external; `docs/dependency-allowlist.json` (PKG-056) and `scripts/ci/verify-deps.mjs` (PKG-057) exist. If either is missing, mark MOT-054..056 BLOCKED on PKG; do **not** extend `scripts/ci/verify-no-core-ui-deps.js` (PKG-075 deletes it).
3. A11Y `usePreference('motion')` exported from `src/theme/preferences/usePreference.ts` (A11Y-027).
4. For REQ-MOT-59/T15: core `Sheet` (OVL-097, `PROMPT_10f_OVL_SHEET.md`) and `TabBar` (NAV-070, `PROMPT_11e_NAV_TABS_TABBAR.md`) exist, and the pack helper `scripts/ci/lib/npm-pack.js` (TRUST-002) exists. If not, mark MOT-064 BLOCKED on those task ids.

## May touch

`package.json` (`peerDependencies.motion`, `peerDependenciesMeta.motion`, `devDependencies.motion` only); `docs/dependency-allowlist.json` (MOT rows only, MODIFY of PKG-056); NEW `tests/motion/deps-allowlist.test.ts`; NEW `src/motion/adapter/{index.ts,MotionProvider.tsx,toMotionTransition.ts,useDragDetents.ts,useMomentum.ts,SharedLayout.tsx,magnetic.ts}`; NEW `src/motion/adapter/__tests__/adapter.test.tsx`; NEW `tests/motion/no-peer.spec.ts` and its consumer fixture under `tests/motion/fixtures/no-peer-vite/`; `etc/api/motion.api.md` and `etc/api/motion.exports.json` generated with REL's `scripts/release/{api-report,export-snapshot}.mjs` (SC-04); `docs/size-budgets.json` `/motion` row (MODIFY of PKG-048).

## Must not touch

`framer-motion` entries in `package.json` (06f), `scripts/ci/verify-deps.mjs` and `scripts/ci/verify-no-core-ui-deps.js` (PKG), `build/exports.manifest.json` (PKG), component files other than registering capability consumers documented for OVL/NAV, any core file importing the adapter (core must never import `src/motion/adapter/**`).

## Steps

1. **Dependency rule (REQ-MOT-50).** Add rows to PKG's `docs/dependency-allowlist.json` in PKG-056's row schema: `motion` as an optional peer whose allowed importers are `["src/motion/adapter/**"]`, and `framer-motion` with no allowed importer (any import fails). PKG's `verify-deps.mjs` resolves `import`, `export … from`, `require()` and dynamic `import()`; if it lacks importer scoping, file the gap against PKG-057 and mark MOT-055 BLOCKED rather than writing a second checker.
2. **package.json (REQ-MOT-51, add part).** `"peerDependencies": { "motion": "^12" }`, `"peerDependenciesMeta": { "motion": { "optional": true } }`, `"devDependencies": { "motion": "<exact 12.x>" }`.
3. **`toMotionTransition` (REQ-MOT-53).** `toMotionTransition(token: MotionTokenName, opts?: { exit?: boolean; velocity?: number }): Transition`. Springs: `{ type: 'spring', stiffness, damping, mass: 1, velocity? }` read from `motionTokens.spring[name]` (never re-derived, never `bounce`/`visualDuration`). Durations: `{ duration: (exit ? durationExit : duration)[name] / 1000, ease: [...motionTokens.ease.standard] }` (exit uses `ease.accelerate`). This is the only ms→s conversion in the package.
4. **`MotionProvider` (REQ-MOT-54).** `<MotionConfig reducedMotion={resolved === 'full' ? 'never' : 'always'}>` from `usePreference('motion')`; also provides `MotionCapabilityContext` with real `dragDetents`/`momentum` implementations.
5. **`useDragDetents` (REQ-MOT-55, -103).** `({ detents: number[]; axis: 'x'|'y'; onSettle(i: number): void }) => DragBindings`. On drag end: projected = `position + info.velocity[axis] * 0.2`; target = nearest detent to projected; spring from `toMotionTransition('spring-smooth', { velocity })`; beyond first/last detent rubber-band factor `0.55`; dismiss when travel > 25% of sheet height or velocity > 800 px/s. `calm`: snap with opacity-only transition (`duration-small`); `none`: jump.
6. **`useMomentum` (REQ-MOT-56).** `inertia` with `power: 0.8`, `timeConstant: 325`, clamped `bounds`, settles ≤ 1,000 ms, new `pointerdown` stops the animation (`controls.stop()`).
7. **`magnetic` (REQ-MOT-57).** `magnetic({ strength = 0.15 } = {})`, strength clamped to `[0, 0.3]`; offset = min(`strength × 0.5 × min(w,h)`, 8 px) toward the pointer via `useMotionValue`/`useSpring` (`spring-snappy` params); active only when motion `full` and `(pointer: fine)`; no React state.
8. **`SharedLayout`/`Shared` (REQ-MOT-58).** Wrap `LayoutGroup`/`motion.div layoutId`; `onLayoutAnimationStart` sets `data-ag-animating` and inline `--_ag-optics: 0` on the participant, `onLayoutAnimationComplete` removes both.
9. **`index.ts` (REQ-MOT-52).** Exports exactly: `MotionProvider`, `toMotionTransition`, `useDragDetents`, `useMomentum`, `SharedLayout`, `Shared`, `magnetic`, types `MotionTokenName`, `DragBindings`, `MomentumBindings`, `MagneticBindings`. Generate and commit `etc/api/motion.api.md` and `etc/api/motion.exports.json` with REL's scripts (SC-04).
10. **Missing-peer message (REQ-MOT-59/T15).** Importing `aura-glass/motion` without `motion` installed fails with: `aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12`. Implement via the build's external resolution error wrapper defined by PKG, not by a runtime `try { require }` in core.

## Tests

- REQ-MOT-T14 `src/motion/adapter/__tests__/adapter.test.tsx`: `toMotionTransition('spring-smooth')` deep-equals `{ type:'spring', stiffness: motionTokens.spring.smooth.stiffness, damping: motionTokens.spring.smooth.damping, mass: 1 }`; duration tokens divide by 1000; `MotionProvider` passes `never` for `full`, `always` for `calm` and `none`; `useDragDetents` with detents `[0, 300, 600]` from position 300: velocity +1,500 px/s ⇒ 600, −1,500 px/s ⇒ 0, 0 ⇒ 300; `magnetic` offset ≤ 8 px for a 200×200 element at strength 0.3; equivalence (REQ-MOT-53): sample `motion`'s spring generator for each spring token every 10 ms and the compiled `linear()` curve ⇒ max diff ≤ 0.01.
- REQ-MOT-T16 `tests/motion/deps-allowlist.test.ts`: PKG's `verify-deps.mjs` with MOT's rows passes on the tree; fails when a fixture `src/components/__fixture__/Bad.tsx` importing `framer-motion` and one dynamically importing `motion/react` are injected (temp dir copy, not the real tree); passes for the same import under `src/motion/adapter/`.
- REQ-MOT-T15 `tests/motion/no-peer.spec.ts` (remote, lane L11 Consumer canaries, packed tarball): `scripts/ci/lib/npm-pack.js` (TRUST-002), install into a Vite + React 19 fixture with no `motion`; build succeeds; in the browser Sheet and TabBar render, open, change detent via keyboard (ArrowUp/ArrowDown on the handle) and via handle buttons; a second fixture importing `aura-glass/motion` fails with the exact message above.
- Size (REQ-MOT-122): `/motion` own code ≤ 4 KB min+gz with `motion` external, as a row in `docs/size-budgets.json` checked by `scripts/ci/verify-size-budgets.mjs` (lane L2 Artifact).

## Visual evidence

Remote screen recording or frame strip of Sheet detent drag with and without `MotionProvider` (attach to the PR as CI artifacts; human review).

## Exit criteria

- AC-MOT-01: `rg -l "from ['\"](framer-motion|motion)(/.*)?['\"]" src` lists only `src/motion/adapter/**` files **after 06f lands**; in this prompt the checker exists, T16 is green and new code violates nothing.
- AC-MOT-17: T15 green on the remote canary.
- REQ-MOT-122 size ≤ 4 KB recorded; API report for `./motion` lists only the §4.8 surface.

## Final report format

```
PROMPT-06d REPORT
Commit: <sha>; motion version pinned: <x.y.z>
Tasks MOT-053..064: DONE | BLOCKED(<reason>) each
AC-MOT-01 (checker part): PASS/FAIL; AC-MOT-17: PASS/FAIL (CI run URL)
/motion size: <bytes>; API report path
Tests: <name> -> pass/fail, where run
Files changed: <list>
Deviations: <none | item + evidence>
```
