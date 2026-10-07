# PROMPT-06f (MOT): Motion removals, framer-motion exit, deprecations and codemods (4.2 deprecations, 5.0 removal)

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` (PRD-06) §5.1 (REQ-07), §5.3 (REQ-22 5.0 part, -24, -25), §5.7 (REQ-51), §5.10, §6, §9, §10, §11, §12 (T20, T21).
Requirement IDs: REQ-MOT-07 (removal), -22 (5.0 deletion), -24, -25, -35 (cleanup), -51 (remove `framer-motion`), -80, -81, -82, -83, -84, -86 (5.0 tree), -87, -88; tests REQ-MOT-T20, REQ-MOT-T21 (`motion-imports` incl. the JS token rewrites, `motion-props`; there is no `tokens` transform id, SC-33).
Acceptance: **AC-MOT-01** (final), **AC-MOT-02**, **AC-MOT-09** (static part), **AC-MOT-16**, **AC-MOT-18**. Tasks: MOT-076..MOT-090.
Contract registry: `docs/auraglass-5/prd/_shared-contracts.md` wins (SC-02/03 `deprecations.json` at repo root, schema REL-010; SC-33 codemod layout and ids; SC-34 compat adapters `src/compat/<area>/<OldName>.tsx` + `warnDeprecated`; SC-39 single removers: `src/tokens/designConstants.ts` → DS-109, `src/hooks/useReducedMotion.ts` → MOT-077, `src/styles/glass.css` → MOT-084).

## Common rules (binding)

- Repo `/Users/gurbakshchahal/platforms/AuraGlass`. Deprecation entries and dev warnings land on the 4.2 line (`release/4.x`, REL bridge scope as interim owner of §16 PRD-17, SC-37); deletions land on `main` (5.0). D-25, D-27, §13 removals win; deviations reported with evidence.
- No fake completion: do not "remove" by commenting out, by renaming to `*.bak`, by adding `// eslint-disable`, or by moving code to an unreferenced folder inside `src/`. No skipped tests, no snapshot updates to make deleted-component tests pass (delete the test with the component). Unfinishable ⇒ BLOCKED.
- Coordinate with FND (§16 PRD-16 removal/extraction, one PR per family through the consumer-grep gate `scripts/removal/consumer-grep.mjs`, FND-103): components whose inventory disposition is REMOVE/DEPRECATE are deleted by FND; this prompt deletes motion-only modules and rewrites motion inside **surviving** files. Check dispositions with `node -e "const r=require('./docs/auraglass-5/component-inventory.json');…"` before touching a component file; if FND already deleted it, skip and record.
- Builds, Storybook and browser runs are remote (CI or skill `auraone-remote-run`). Local: `npm test -- <path>`, `npm run typecheck`, `node_modules/.bin/eslint`, `rg`.
- No new dependencies.

## Prerequisites (verify)

1. 06c and 06d merged (`src/motion/ticker.ts`, `src/motion/adapter/index.ts` exist).
2. 06e merged: `node scripts/ci/verify-motion-css.mjs` and the `auraglass/motion-*` rules exist (currently `warn`).
3. A11Y `usePreference` (A11Y-027) and `AuraGlassProvider` (A11Y-029) exist (replacements for removed hooks/providers).
3a. DS-109 has deleted (or is scheduled to delete) `src/tokens/designConstants.ts`; MOT does not edit that file.
4. Repo-root `deprecations.json` seeded by TRUST-075 with REL-010's schema `docs/schemas/deprecations.schema.json`, generator `scripts/release/gen-deprecations.mjs` (REL-070) and `src/internal/warnDeprecated.ts` (REL-072) exist. If absent, BLOCKED for MOT-089 only.
5. DX: the 4to5 engine `packages/cli/src/migrate/4to5/{index.ts,catalogue.json}` (DX-041/042) and the area contract test (DX-059) exist (`PROMPT_16c_DX_CODEMODS_COMPAT.md`); `src/compat/index.ts` (DX-065) exists. If absent, MOT-090 is BLOCKED; `reduced-motion-initial` from 06a is the reference implementation.

## May touch

- Legacy motion sources: `src/tokens/glass.ts` (`:849-853`, `:1370-1376`), `src/theme/createGlassTheme.ts` (`:223-225` emission; MODIFY of DS-083), `src/theme/designMatrix.ts` (`:189`, `:280`), `src/theme/useGlassMotionPolicy.ts`, `src/animations/**`, `src/physics/AuraPhysicsEngine.ts`, `src/hooks/{useReducedMotion.ts,useReducedMotion.tsx,useEnhancedReducedMotion.ts,useMotionPreference.ts,useGalileoStateSpring.ts}`, `src/hooks/extended/useGalileoSprings.ts`, `src/hooks/physics/{usePhysicsEngine,usePhysicsLayout}.ts`, motion part of `src/hooks/useAccessibilitySettings.ts`, `src/contexts/MotionPreferenceContext.tsx`, `src/primitives/motion/**`, `src/primitives/MotionNative.tsx`, `src/primitives/index.ts:91`, `src/index.ts` (`:16`, `:364`, `:627`, `:908`), `src/components/animations/**`, `src/core/mixins/glowEffects.ts`
- CSS: `src/styles/{animations,design-tokens,glass,performance-animations,keyframes,glass.generated,storybook-utility-shim}.css`, `src/components/backgrounds/{GlassDynamicAtmosphere,AtmosphericBackground}.module.css`, `src/components/input/GlassMultiSelect.module.css`, `src/components/marketing/marketing.css`, `src/components/effects/glass-morphing.css`, `src/components/visual-feedback/{StateIndicator,VisualFeedback}.module.css`, `src/components/advanced/GlassPerformanceOptimization.css`
- The 21 files with `repeat: Infinity` listed in REQ-MOT-80 (rewrite only if surviving)
- NEW `src/compat/motion/useReducedMotion.ts`, NEW `src/compat/motion/Motion.tsx` (pass-through `div`; both call `warnDeprecated(id)`, REL-072), their entries in DX-065's `src/compat/index.ts` (MODIFY); the `--glass-motion-default → --ag-duration-small` alias is a row request to DS's `compat-alias-map.json` (DS generates `compat/tokens.css`, SC-34)
- `package.json` (remove all `framer-motion` keys; remove scripts referencing deleted tools), delete `scripts/scan-motion-performance.js`, `scripts/fix-use-reduced-motion-imports.sh`
- `deprecations.json` (repo root, MODIFY of TRUST-075); NEW `packages/cli/src/migrate/4to5/transforms/{motion-imports,motion-props}.ts`, fixtures `packages/cli/src/migrate/4to5/__fixtures__/{motion-imports,motion-props}/<case>/`, tests `packages/cli/src/migrate/4to5/__tests__/`; NEW `src/motion/__tests__/no-overshoot.test.ts` (MOT-085); NEW `src/motion/__tests__/types.test-d.ts`; `eslint.config.js`/`.eslintrc.js` (flip motion rules to `error`)

## Must not touch

`src/motion/**` except `__tests__/{types.test-d,no-overshoot.test}.ts`; `src/tokens/designConstants.ts` and `src/tokens/generated.ts` (DS-109 / DS compiler); MAT/A11Y internals; visual baselines; `reports/**`.

## Steps

1. **Deprecations (4.2, AC-MOT-18).** One `deprecations.json` entry per §9/§10 item (exports: `Motion` ×2, `animationPresets`, `GlassMotionController` family, `GlassTransitions` family, `OrganicAnimationEngine` family, `AdvancedAnimations`, `MotionPreferenceProvider`, `ReducedMotionProvider`, every reduced-motion hook, physics hooks/engines, `ANIMATION`, `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency`, `--glass-motion-default`, `--glass-theme-duration-*`, `tokens/keyframes`; props `respectMotionPreference`, `motionPolicy`, `initialMotionPolicy`, motion `preset`/`animationPreset`, `animate`, `disableAnimation`, `whileHover`/`whileTap` pass-through), each with the REL-010 schema fields (`since: "4.2.0"`, `removeIn: "5.0.0"`, `replacement`, `codemod` ∈ {`reduced-motion-initial`, `motion-imports`, `motion-props`, `removed`, `css-vars`, `providers`} or null per SC-33). 4.2 dev warnings fire once per symbol.
2. **Codemods (T21).** `motion-imports`: `useReducedMotion()` → `usePreference('motion') !== 'full'`; other removed hooks likewise; unwrap `ReducedMotionProvider` (keep children); skip `MotionPreferenceProvider` (owned by `providers`); `<Motion preset="fadeIn">…` → plain element + `// TODO(aura-glass 5): motion is now CSS-driven, see docs/motion.md`; JS token rewrites `ANIMATION.DURATION.normal` → `motionTokens.duration.small`, bounce/elastic easings → `motionTokens.ease.standard` + TODO (inside `motion-imports`). `motion-props`: delete the §11 props; `magnetic` → `/motion` `magnetic()` + TODO; `RippleButton` → `Button`. Mapping data only from generated `mappings/*.json` and `<Component>.meta.ts` `migration` fields. Each with fixtures and an idempotence test.
3. **Remove props and policy (REQ-MOT-24).** Delete `respectMotionPreference`, `motionPolicy`, `"always-safe"`, `"never-safe"`, `forceMotion`, `disableReducedMotion`, `initialMotionPolicy`, motion `preset`/`animationPreset`, `animate`, `disableAnimation` from every surviving 5.0 component type and from `AuraGlassProvider` props.
4. **Single preference source (REQ-MOT-25).** Delete the hook/context files listed above; add `src/compat/motion/useReducedMotion.ts` = `usePreference('motion') !== 'full'`. MOT-077 is the sole remover of `src/hooks/useReducedMotion.ts` (SC-39). Rewrite surviving readers to `usePreference('motion')`. `rg -n "prefers-reduced-motion" src --glob '*.{ts,tsx}'` returns only the A11Y store (`src/theme/preferences/**`).
5. **Legacy token sources (REQ-MOT-07).** `ANIMATION` goes with `src/tokens/designConstants.ts` (DS-109) and generated motion keys with DS's regeneration; verify 0 readers. Remove `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency`, `--glass-theme-duration-*` emission, persona `motion:`, `springPhysics.ts`, both `animationPresets`; rewrite consumers to `motionTokens`/`--ag-*` (164 importers of `designConstants` — only motion members change).
6. **Motion primitives and engines (§9).** Delete `src/primitives/motion/**`, `MotionNative.tsx`, their exports in `src/primitives/index.ts`/`src/index.ts`; add `src/compat/motion/Motion.tsx`. Delete `src/animations/**` (archive `physics/galileoPhysicsSystem.ts` outside the package, e.g. `docs/auraglass-5/archive/`), `src/physics/AuraPhysicsEngine.ts`, Galileo/physics hooks, `src/components/animations/**` (with stories/tests/snapshots), `src/theme/useGlassMotionPolicy.ts`.
7. **Cut inventory.** REQ-MOT-80: 0 `repeat: Infinity` in `src` outside `src/motion/adapter`. REQ-MOT-81: remove infinite CSS animations from the 11 files listed (only `ag-sweep` remains). REQ-MOT-82: `bounceIn`, `bounceOut`, `elasticIn`, `elasticOut` go with DS-109 (verify only); delete the remaining `cubic-bezier(0.68,-0.55,0.265,1.55)` uses, `@keyframes springBounce` (`glass.css:4350`), `@keyframes spring-bounce` (`animations.css:397`), `animate-bounce`, the 100/10 spring. REQ-MOT-83: delete every keyframe named in the PRD list (`float`, `glow-pulse`, `rainbow-glow`, `glowPulse`, 4× `shimmer`, `rainbowShift`, `gradientShift`, `dual-glow`, `glow-animate`, `nebulaMove`, `meshDrift`, `morphBlob`, `particleFloat`, `particle-orbit`, `quantumFluctuate`, `interference`, `hologram-scan-lines`, `hologram-layer-scan`, `magneticPulse`, `magnetic-attract`, `magnetic-click`, `pulse-3d`, `noise`). REQ-MOT-84: the 20 filter/blur keyframe arrays, `GlassTransitions.tsx:20-190`, every `hue-rotate` animation. REQ-MOT-86: no permanent FPS loop in the 5.0 tree. REQ-MOT-87: remove `preset="fadeIn"|"slideDown"|"scaleIn"` from `GlassStack`, `HStack`, `VStack`, `GlassGrid`, `GlassFlex`, `GlassSeparator`, every Card at rest. REQ-MOT-88: replace `animate-pulse` (78), `glass-animate-pulse` (44), `animate-spin` (63), `glass-animate-spin` (54) in surviving files with `Spinner`/`Skeleton` (FND components: `Skeleton` FND-059; `Spinner` task pending, PRD §21 O-10); `glass-animate-*` and `glass-transition-all` move to `compat/globals.css` (PKG-owned file; request the rows from PKG). REQ-MOT-22: delete the global `*` blocks and the "keep essential" block. Remaining `transition: all` (335 + 90 + `glass.generated.css:504`) replaced with explicit allow-list properties.
8. **framer-motion exit (REQ-MOT-51, AC-MOT-02).** After 0 imports remain outside the adapter, delete `framer-motion` from `peerDependencies`, `peerDependenciesMeta`, `devDependencies`. Delete `scripts/scan-motion-performance.js` and `scripts/fix-use-reduced-motion-imports.sh` and their `package.json` scripts.
9. **Flip lint to error (DoD).** All `auraglass/motion-*` rules `error`; `lint:motion` required in `lint:ci`.

## Tests

- REQ-MOT-T20 `src/motion/__tests__/types.test-d.ts` (run via `tsc -p tests/types/tsconfig.json` pattern): `// @ts-expect-error` on `<Button respectMotionPreference={false} />`, `<Button motionPolicy="always-safe" />`, `<AuraGlassProvider motion="always-safe" />`, `<Dialog animationPreset="fadeIn" />`; `MotionTokenName` accepts `'spring-smooth'`, rejects `'spring-bouncy'`.
- REQ-MOT-T21 codemod tests under `packages/cli/src/migrate/4to5/__tests__/` for `motion-imports` (incl. token rewrites) and `motion-props`; idempotent; DX-059 area contract green.
- Static: `node_modules/.bin/eslint src` (0 `auraglass/motion-*` errors), `node scripts/ci/verify-motion-css.mjs` (0), T16 checker green, `npm run typecheck`. Full `npm run build` + `npm test` remote.

## Visual evidence

Remote Storybook build: capture before/after for Button, Card, Stack, Switch, Spinner/Skeleton stories (hover scale and decorative loops gone) as CI artifacts for human review (5.0 documented visual break, §11 item 3).

## Exit criteria

- AC-MOT-01: `rg -l "from ['\"](framer-motion|motion)(/.*)?['\"]" src` lists only `src/motion/adapter/**`; T16 green.
- AC-MOT-02: `node -e "const p=require('./package.json');process.exit(JSON.stringify(p).includes('framer-motion')?1:0)"` exits 0; `motion` optional peer `^12`.
- AC-MOT-09 (static): `rg "repeat: Infinity" src` = 0 outside `src/motion/adapter`.
- AC-MOT-05: `verify-motion-css.mjs` = 0 violations across shipped CSS.
- AC-MOT-16: T20 green. AC-MOT-18: every §9/§10 item has a `deprecations.json` entry and a passing codemod fixture.

## Final report format

```
PROMPT-06f REPORT
Commits: <sha main>, <sha release/4.x deprecations>
Tasks MOT-076..090: DONE | BLOCKED(<reason>) each
AC-MOT-01/02/05/09(static)/16/18: PASS/FAIL with command output
Deleted files: <count + list>; skipped because FND already removed: <list>
Counts before→after: repeat:Infinity, CSS infinite, transition:all, framer-motion imports, DS baseline duration/easing/spring
Files changed: <list>
Deviations: <none | item + evidence>
```
