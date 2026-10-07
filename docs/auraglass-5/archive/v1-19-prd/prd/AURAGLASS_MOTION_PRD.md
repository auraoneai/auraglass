# AuraGlass 5.0 PRD: Motion Language

| Field | Value |
|---|---|
| PRD id | **PRD-06** |
| Key | **MOT** (task prefix `MOT-NNN`; program index `prd/_shared-contracts.md` SC-01) |
| Owner area | Motion (`src/motion/**` NEW, `aura-glass/motion` subpath, motion token **values** (file and compiler are PRD-DS), `@layer ag.components` motion rules, `motion-*` lint rules, motion assertions run in QA lane L9 Motion) |
| Status | Draft, reconciled with the shared contract registry 2026-10-06 (SC-14, -16..-19, -21, -31, -33, -36, -38..-40) |
| Contract registry | `prd/_shared-contracts.md` wins over this file on any conflict. PRDs are cited by §16 id below; the key crosswalk is: PRD-00 TRUST, PRD-01 REL, PRD-02 PKG, PRD-03 DS, PRD-04 MAT, PRD-05 A11Y, PRD-07/14/16 FND, PRD-08 CTL, PRD-09 OVL, PRD-10 NAV, PRD-11 DATA, PRD-12 AI, PRD-13 MED, PRD-15 MAT (interim), PRD-17 REL (interim), PRD-18/20 DX (codemod ids: REL), PRD-19 QA (lanes) and SB (Storybook/Lab), PRD-21 EXP (interim) |
| Baseline | `aura-glass` 4.1.0, HEAD `15b6de6f7` |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` §2 (D-04, D-11, D-24, D-25, D-27), §3.2, §3.4, §3.6, §4.4, §4.5, §5.3, §5.4, §8, §11.2, §12, §13, §14, §15.2, §15.4, §16; `docs/auraglass-5/autopsy/motion.md` (MOTION-01..10, all CONFIRMED); `docs/auraglass-5/AURAGLASS_CURRENT_STATE_AUTOPSY.md` (summary IDs, TD-24, TD-25, C7); `docs/auraglass-5/autopsy/runtime-remote.md` §5; `docs/auraglass-5/autopsy/performance.md`; `docs/auraglass-5/component-inventory.json`; `docs/auraglass-5/research/apple-liquid-glass.md`; `docs/auraglass-5/research/web-glass-techniques.md` §6 |
| Related decisions | D-04 (pointer light is a motion feature, not a tier), D-11 (OS signals are floors), D-13 (Base UI state attributes), D-14 (no `Glass` prefix), D-18 (`aura-glass/compat`), D-24 (layers, zero `!important`), **D-25 (springs → CSS `linear()`, no JS motion runtime in core, `motion` optional peer of `/motion` only)**, D-27 (change-class enforcement), D-29 (dependency allowlist) |
| Related PRDs | PRD-02 (build, allowlist, budgets), PRD-03 (token compiler, `motion-spring` transform), PRD-04 (material layers, optics vars), PRD-05 (`usePreference`, `data-ag-motion`, `AuraGlassScript`), PRD-07 (Base UI wrapping, `data-ag-part`), PRD-08/09 (flagship controls and overlays), PRD-17 (4.2/4.3 bridge), PRD-18 (codemods), PRD-19 (certification infra) |
| Exit criterion (§16) | Motion lane green on `Button` and `Dialog` |

**Deviation notes (explicit).**

1. File name. §16 names this file `PRD-06-motion.md`. It is written to the orchestrator-assigned path `prd/AURAGLASS_MOTION_PRD.md`, matching the sibling PRDs (`AURAGLASS_MATERIAL_ENGINE_PRD.md`). The PRD id stays PRD-06.
2. Finding IDs. Two numberings exist. The detail autopsy `autopsy/motion.md` numbers MOTION-01..10. The summary `AURAGLASS_CURRENT_STATE_AUTOPSY.md` and the architecture use a renumbered crosswalk (for example summary MOTION-07 = `"always-safe"`, MOTION-11 = frozen state spring, MOTION-12 = Switch shimmer and loops). This PRD cites the **detail** IDs as `M-xx` (for example M-01 = the `animate={reduced ? {} : …}` pattern) and cites architecture/summary IDs verbatim as `MOTION-xx (summary)`.
3. Inventory targets superseded. Several inventory `target` fields (for example `GlassMotionController` → "single motion API on framer-motion", `ReducedMotionProvider` → "MotionConfig reducedMotion=user") predate D-25. D-25 wins: core carries no framer-motion and no JS motion runtime. Those targets are re-mapped in §9.
4. Token values. The motion autopsy recommends `micro 90 / short 160 / medium 240 / long 360 / page 480`. The architecture §5.3 is canonical and is used here: `instant 90, micro 120, small 200, medium 320, large 450`. Spring response times are not given in §5.3; this PRD fixes them (REQ-MOT-03) and records them as a PRD-06 decision.
5. Boundaries. The pseudo-layer stack (`::before` pre-blurred layer, rim, specular) is PRD-04's. The preference store and `data-ag-motion` resolution are PRD-05's. This PRD **specifies** the motion contract those layers must expose (the `--_ag-optics`, `--_ag-hover`, `--_ag-press` scalars) and owns the motion CSS that drives them. Requirements owned elsewhere are tagged `[owner: PRD-xx]` and are acceptance inputs here, not work items.

6. Animatable properties. Architecture §8 lint says "only `transform`, `opacity` and registered `--ag-*` scalars may be animated". REQ-MOT-12 additionally allows paint-only colour properties (`color`, `background-color`, `border-color`, `outline-color`) and `display`/`overlay` with `allow-discrete`. Reason: `calm` must keep colour changes (§8 "calm keeps opacity cross-fades"), Base UI exit detection needs discrete `display`/`overlay`, and none of these trigger layout or re-run `backdrop-filter`. `backdrop-filter`, `filter`, `box-shadow` and geometry stay banned exactly as §8 says. (The earlier Card hover `translate: 0 -1px` and press `scale: 0.985` exceptions are withdrawn per SC-38: glass responds with light only.)
7. Pointer light writes. §8 allows "at most one CSS var write per frame". This PRD therefore uses **one** registered variable `--_ag-pointer` (`<percentage>+`, value `x% y%`), not an x/y pair.
8. Codemods. The motion transform ids `reduced-motion-initial`, `motion-imports` and `motion-props` are **registered area ids** (SC-33, catalogue owner REL, engine DX-041/042). There is no `tokens` transform: the JS motion-token rewrites (`ANIMATION.*` → `motionTokens.*`) are part of `motion-imports`. `MotionPreferenceProvider` removal stays in the core `providers` transform (DX-046) and is not duplicated.
9. Release placement (SC-36, SC-37). TRUST is the only owner of 4.1.1 contents: the cookie-consent fix (REQ-MOT-28, privacy) is **accepted into 4.1.1**; the FPS-loop fix (REQ-MOT-86) is **deferred to 4.2**. REL holds the 4.2/4.3 bridge scope (interim owner of §16 PRD-17); MOT owns the content of the experimental 4.2 `aura-glass/motion`.

No screenshot was viewed while writing this PRD. Runtime statements come from `autopsy/runtime-remote.md` (remote browser capture) or are inferred from code and are labelled as such.

---

## 1. Problem

AuraGlass 4.1 has a large amount of motion code and no motion language (`autopsy/motion.md`, score 3/10).

1. **Reduced-motion users get invisible content.** The library-wide pattern `initial={{ opacity: 0 }}` + `animate={reduced ? {} : {...}}` (84 sites in 35 non-story files, M-01 CONFIRMED) leaves elements at `opacity: 0` or `scale: 0` when reduced motion is on, because framer-motion keeps `initial` when `animate` is empty. This hits the accessibility panel itself (`GlassA11y`). The "100% reduced-motion coverage" report is a tautology (M-04).
2. **The OS preference is ignored by default.** `MotionPreferenceContext` defaults to `prefersReducedMotion: false` and its provider is never mounted in `src`, so about 44–46 components ignore the OS setting (M-02). `motionPolicy: "always-safe"` lets apps override the OS entirely (MOTION-07 summary), and 83 non-story files (93 including stories and tests) accept a `respectMotionPreference` opt-out.
3. **There is no single source of motion truth.** 8 token sources disagree on "normal" (200/220/250/300 ms); there are 53 distinct JS duration literals (seconds and milliseconds mixed), 25 spring stiffness values, 18 cubic-beziers and 106 keyframe names. The default spring is underdamped (ζ≈0.5, visibly bouncy). Overshoot `bounce*`/`elastic*` curves are tokens (M-05, M-09).
4. **Motion reads as a 2019 glassmorphism demo, not as material.** Hover and tap are per-component scale bumps (1.01–1.1 / 0.9–0.99). Entrances are generic `fadeIn` mounts (54×), including on layout primitives. `filter: blur()` is animated in 20 keyframe arrays on top of `backdrop-filter`. There are 43 `repeat: Infinity` loops, 95–102 CSS `infinite` animations, and `Math.random` motion in 68 component files. There are zero `layoutId` morphs and zero View Transitions (M-08).
5. **Motion is expensive.** 150 `requestAnimationFrame` calls in 78 files; 0 of 55 component files with rAF pause offscreen (M-08 corrected count); permanent FPS-monitor loops call `setState` per frame. Remote capture shows `glass-modal` at 12 fps and the AI command-centre shell at 19 fps under scripted hover/scroll, with 4 infinite animations running under 12–21 visible backdrop filters (`runtime-remote.md` §5).
6. **framer-motion is a de-facto hard dependency.** It is declared an optional peer (`package.json:374`, `:396`) but 83 non-story files import it, including `Button` and `Modal` through the internal `Motion` primitive. Two different components are both exported as `Motion` (M-06), and the internal one never plays its mount animation on first render.
7. **Fake engines.** About 4k LOC of physics and orchestration (`AuraPhysicsEngine`, Galileo, sequence orchestrators, `gesturePhysics`, `chartAnimations`) have zero component consumers. `useGalileoStateSpring` is a frozen `useState`, which leaves the cookie-consent banners invisible but clickable (M-03, M-07).

AuraGlass 5.0 needs one motion language that matches its material: glass responds with light, not bounce; motion is CSS-first with no JS runtime in core; reduced motion is a floor that can never leave content hidden; and every rule is enforced by lint and by a motion certification lane.

---

## 2. Evidence from the current codebase

Line numbers were spot-checked against HEAD `15b6de6f7` while writing this PRD (marked ✓) or are quoted from the CONFIRMED detail autopsy `autopsy/motion.md`. No finding used here is REFUTED. Counts exclude `*.stories.*`, `*.test.*` and `__tests__`.

### 2.1 Reduced-motion correctness

| ID | Evidence | Finding |
|---|---|---|
| M-01 (CONFIRMED, 84 sites / 35 files) | `src/components/accessibility/GlassA11y.tsx:398-401` ✓ (`initial={{ opacity: 0, scale: 0.9, y: -20 }}` + `animate={prefersReducedMotion ? {} : {…}}`); `src/components/social/GlassPresenceIndicator.tsx:207-208, 371-372`; `src/components/advanced/GlassFoldableSupport.tsx:287-288, 357-358`; `src/components/effects/Glass3DEngine.tsx:575-576`; `src/components/quantum/GlassQuantumTunnel.tsx:600-601` (`scale: 0`); `src/components/houdini/HoudiniGlassCard.tsx:174-175, 230-231` | Content stays at the `initial` value under reduced motion. Mechanism verified in `framer-motion@11.18.2` `render/utils/animation-state.mjs:254-264`. 71 sites have `initial={{ opacity: 0 … }}` on the line directly above |
| M-02 (CONFIRMED; HOOKS-UTILS-TYPES-04 PARTIAL) | `src/contexts/MotionPreferenceContext.tsx:9-13` ✓ (default `prefersReducedMotion: false`, `isMotionSafe: true`); provider mounted only in `MotionPreferenceContext.stories.tsx:77` and `GlassProgress.test.tsx:76` | About 46 component files read only this context and ignore the OS. `GlassTooltip.tsx:10` and `GlassSwitch.tsx:13` import `useReducedMotion` and never call it |
| MOTION-07 (summary) | `src/contexts/MotionPreferenceContext.tsx:6, 38, 44, 64` ✓ (`motionPolicy: "auto" \| "always-safe" \| "never-safe"`; "'always-safe': Force motion enabled, ignore user preference"); `respectMotionPreference` appears in 83 non-story files ✓ (93 including stories/tests; architecture §8 says 87) | An app or a component prop can raise motion above the OS floor. Violates D-11 |
| M-03 (CONFIRMED) | `src/hooks/useGalileoStateSpring.ts:14` ✓ (`useState(initialValue)`, never synced); `src/components/cookie-consent/CookieConsent.tsx:96, 114, 160` ✓, `:185, :205`; same in `GlobalCookieConsent.tsx:109, 285, 302, 366` and `CompactCookieNotice.tsx:103, 154, 171, 200` | Banner gets `display` back but stays `opacity: 0`, hit-testable. Stories pass `forceVisible`, so visual certification cannot catch it |
| M-04 (CONFIRMED) | `reports/reduced-motion-final-report.json:3` (`totalProcessed: 0`), `:16-17`; `reports/REDUCED_MOTION_100_COMPLETE.md:126` | "100%" counts a global CSS rule as coverage. In a 25-component sample 5 are correct, 9 hide content |
| M-06 (CONFIRMED, reach 121 files) | `src/index.ts:16` ✓ (`MotionNative as Motion`); `src/primitives/index.ts:91` ✓ (`MotionFramer as Motion`); `src/primitives/motion/MotionFramer.tsx:235` ✓ (`useState(true)` for `reduced`), `:277-282` | Root and internal `Motion` differ. `MotionFramer` starts reduced, so `initial` is undefined on first render and mount presets do not play (inferred from Framer semantics, not browser-observed) |
| M-09 (CONFIRMED) | `src/hooks/useEnhancedReducedMotion.ts:33-36` (server `true`, client real) vs `src/hooks/useReducedMotion.ts:15` (`false`); `src/animations/accessibleAnimation.ts:5` (`true`) | Eight reduced-motion entry points with three different SSR defaults; hydration-mismatch risk |
| Global nukes | `src/styles/animations.css:6-12` ✓ (`* { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important }`), `src/styles/animations.css:530`, `src/styles/design-tokens.css:134-140`, plus the overridden "keep essential" block `:234-254` | Removes non-vestibular cross-fades WCAG does not require removing; does nothing for framer, rAF, canvas or WebGL; adds `!important` (violates D-24) |
| Remote runtime | `autopsy/runtime-remote.md` §5 | Under emulated `reducedMotion: reduce`, CSS infinite animations go 4 → 0 on modal and app-shell. JS motion was not separately measured |

### 2.2 Tokens and duplication

| ID | Evidence | Finding |
|---|---|---|
| M-05 (CONFIRMED) | `src/tokens/designConstants.ts:13-43` (300 ms, imported by 164 component files); `src/tokens/glass.ts:849-853` (200 ms), `:1370-1376` (`motionFluency` 120/80/150); `src/tokens/generated.ts:176-195` (250 ms); `src/theme/createGlassTheme.ts:93-118` (220 ms; `--glass-theme-duration-*` emitted at `:223-225`, 0 consumers); `src/theme/designMatrix.ts:189, 280`; `src/animations/physics/springPhysics.ts:1-30` (100/10, ζ≈0.5); `src/primitives/motion/presets.ts:6`; `src/components/animations/GlassMotionController.tsx:742` | 8 motion token sources, mutually inconsistent |
| M-09 (CONFIRMED) | `src/tokens/designConstants.ts:30` ✓ `bounceIn` and `:33` ✓ `elasticOut` are both `cubic-bezier(0.68, -0.55, 0.265, 1.55)`; `src/primitives/motion/presets.ts:15-21` (`fadeOut` 1 → 0 → 1); `MotionFramer.tsx:39-42` (`as`, `type`, `direction` declared, unused) | Overshoot curves as tokens; contradictory presets |
| Theme policy (keep) | `src/theme/createGlassTheme.ts:43, 101, 109, 116` ✓ (`allowContinuous`, `true` only when `policy === "expressive"`); `src/theme/useGlassMotionPolicy.ts` (0 component consumers) | The right abstraction, never read by components. Becomes `allowContinuous` in PRD-05's store |
| Literal counts (M-05, not recounted) | 53 JS `duration:` literals; 40 CSS durations (0.01 ms–32 s); 25 `stiffness`; 22 `damping`; 18 cubic-beziers; `whileHover` 1.02×26, 1.05×21; `whileTap` 0.98×24, 0.95×19 | Baseline for the literal ratchet (REQ-MOT-61) |

### 2.3 Continuous, decorative and expensive motion

| ID | Evidence | Finding |
|---|---|---|
| M-08 (CONFIRMED) | `repeat: Infinity` = 43 in non-story `src` ✓; CSS `infinite` 95–102 in 43 files; 120 `@keyframes` (106 names, 44 decorative); `shimmer` defined 4×, `glowPulse` 3× | Unbounded loops, ungated by `allowContinuous` |
| MOTION-12 (summary) | `src/components/input/GlassSwitch.tsx:247` ✓ (`animation={isMotionSafe && respectMotionPreference ? "shimmer" : "none"}`) | Decorative infinite shimmer on a form control; architecture §11.2 row 5 removes it |
| M-08 / PERFORMANCE-07 (PARTIAL: hidden tabs are browser-throttled; offscreen is the gap) | 150 `requestAnimationFrame(` calls in 78 files; 0 of 55 component files pause offscreen; `src/components/layout/OptimizedGlassContainer.tsx:66-84` ✓ (permanent FPS rAF calling `setCurrentFps`/`setPerformanceScore`); `src/components/advanced/GlassPerformanceOptimization.tsx:92-95`; `src/animations/hooks/useMultiSpringBasic.ts:73` (uncapped dt), `:118` (`setValues` per frame) | Per-frame React renders and offscreen work |
| `transition: all` | 335 `transition: all` / `transition-all` in non-story `src` ✓ plus 90 `glass-transition-all`; generated surfaces `src/styles/glass.generated.css:504` ✓ (`transition: all var(--glass-motion-default) ease-out`) | Transitions `backdrop-filter`, `box-shadow` and `background` together |
| Animated filters (MOTION-09 summary) | 20 `filter`/blur keyframe arrays; `src/components/animations/GlassTransitions.tsx:20-190` (shatter/ripple/morph: rotate ±15°, scale 0→1.2→1, `filter: blur()`) | Jank source on top of `backdrop-filter` |
| Remote fps | `autopsy/runtime-remote.md` §5: `glass-modal` 12 fps (12 visible filters, 4 infinite animations), `glass-dialog` 13–14, AI command-centre shell 19 (21 filters, 4 infinite), SaaS shell 21–23; `glass-modal` desktop 49 long tasks / 4,056 ms | Infinite animation under stacked blur is part of the measured slowdown (software raster; relative signal) |

### 2.4 framer-motion coupling and fake engines

| ID | Evidence | Finding |
|---|---|---|
| D-25 input | `package.json:374` ✓ (`"framer-motion": ">=10.0.0"` peer), `:396` ✓ (optional), `:499` (devDependency `^11.18.2`); 83 non-story files import `framer-motion` ✓ (78 in `src/components`); named imports `motion` 67, `AnimatePresence` 36, `useMotionValue` 7, `useSpring` 6 | An "optional" peer that the core cannot run without |
| Flagship sources | `src/components/button/GlassButton.tsx:11, 18, 279, 833-840` ✓ (`Motion` from primitives wraps every button); `src/components/modal/GlassModal.tsx:11, 24, 223, 746, 802-821` ✓ (`Motion` with `duration={prefersReducedMotion ? 0 : undefined}`) | The two §16 exit-criterion components both go through `MotionFramer` |
| M-07 (CONFIRMED) | `src/hooks/extended/useGalileoSprings.ts:164-190, 221`; `src/physics/AuraPhysicsEngine.ts`; `src/animations/physics/{galileoPhysicsSystem,gesturePhysics,chartAnimations,useMultiSpringPhysics,springPhysics,interpolation}.ts`; `src/animations/orchestration/{useAnimationSequenceOrchestrator,useOrchestration}.ts`; `src/animations/hooks/{useAnimationSequenceBasic,useMouseMagneticEffect,useMultiSpringBasic}.ts`; `src/hooks/physics/{usePhysicsEngine,usePhysicsLayout}.ts` | About 4k LOC with 0 component consumers (1 for `useMultiSpringBasic`) |
| M-10 (CONFIRMED, low) | `src/components/animations/GlassTransitions.tsx:435, 552, 634` | Shadow `GlassAccordion`/`GlassModal`/`GlassTabs` |
| No platform motion | `startViewTransition` 0 ✓; `layoutId` used for shared-element morphs 0 ✓ (only a type at `src/types/animations.ts:105`); `animation-timeline`/`useScroll` in 3 files; WAAPI once (`src/primitives/MotionNative.tsx`) | No View Transitions, no `linear()`, no shared-element morphs |
| Keep | `src/hooks/useReducedMotion.ts` (SSR-safe, `false` start, `change` listener); `MotionFramer.tsx:73-170` (easing sanitiser); `GlassOrbitalMenu.tsx:96`, `GlassMusicVisualizer.tsx:362`, `GlowingCard.tsx:108,150` (correct loop gating); easings `cubic-bezier(0.2,0,0,1)` (14×) and `(0.4,0,0.2,1)` (17×) | Patterns to standardise on |

---

## 3. Desired end state

At 5.0 GA:

1. **One source.** Every duration, easing and spring comes from `tokens/sys/motion.tokens.json` (DTCG; file and compiler owned by PRD-03/DS, values owned here, SC-18) compiled by PRD-03 into `--ag-duration-*`, `--ag-ease-*`, `--ag-spring-*` CSS variables (springs as `linear()`) and a typed `motionTokens` TS object. No component file contains a duration, easing, stiffness or damping literal.
2. **Core is CSS-only motion.** Every core and flagship component animates with CSS transitions on Base UI state attributes (`data-open`, `data-starting-style`, `data-ending-style`, `data-pressed`, `data-highlighted`, `data-checked`) and `@starting-style`. Every entry other than `./motion` (including `.`, `./data`, `./date`, `./ai`, `./media`, `./app-shell`, `./backdrops`, `./theme`, `./material`, `./tokens`, `./primitives`, `./forms`, `./three`, `./compat`) imports neither `framer-motion` nor `motion`. The build fails if they do.
3. **Glass responds with light.** Hover raises specular, rim and shadow on pre-composited pseudo-layers. Press compresses depth (inner shadow, specular dip) with no scale. No hover scale or translate (SC-38). No overshoot. Entrances materialize from the anchor: the pre-blurred layer, rim and a 0.96→1 scale cross-fade together. `backdrop-filter` and `filter` are never animated.
4. **Morphs use the platform.** Tab indicator, segmented thumb, menu→sheet and `SourceTransition` use same-document View Transitions (React 19.3 `<ViewTransition>` when detected, FLIP fallback). Optics drop to flat fill during `:active-view-transition` and fade back in afterwards.
5. **Pointer light is opt-in and cheap.** `pointerLight` uses one delegated `pointermove` listener per document, throttled to rAF, writing at most one pair of CSS variables per frame on the hovered surface only. No React state.
6. **Physics is optional.** `aura-glass/motion` provides drag-release springs (Sheet detents, TabBar momentum), `layoutId` shared-element morphs, a magnetic option and velocity-aware handoff on top of the optional peer `motion@^12`. It is the only entry that may import `motion`.
7. **Reduced motion is a floor and is always visible.** Resolved motion is `full | calm | none`. `prefers-reduced-motion: reduce` caps it at `calm`, and no API can raise it. `calm` keeps opacity cross-fades and colour changes and drops transforms, springs, pointer light, parallax and loops. In every mode the settled state is fully visible (opacity 1, scale 1, no residual transform). The `"always-safe"` policy and every `respectMotionPreference` opt-out are gone.
8. **No decorative loops by default.** `allowContinuous` defaults to `false`. With it off, no core component runs an infinite CSS animation, an unbounded rAF loop or a WAAPI animation after settle. Loading motion is one branded token-driven specular sweep and one skeleton shimmer, both gated. Every rAF user goes through one shared ticker with delta-time, offscreen and hidden pause.
9. **Enforced.** ESLint and CSS lint rules fail on every banned pattern, and the remote motion certification lane (frame strips, reduced-motion settle checks, View Transition optics checks, frame-time budgets) is a release gate. It is green on `Button` and `Dialog` first (PRD-06 exit), then on every flagship.

---

## 4. Architecture

### 4.1 Layers (architecture §8, D-25)

| Layer | Location | Mechanism | Dependency | Who uses it |
|---|---|---|---|---|
| L0 Tokens | `tokens/sys/motion.tokens.json` (DS-026) → `dist/tokens.css` (`@layer ag.tokens`) + `src/motion/tokens.generated.ts` (DS-053); both emitted only by the DS compiler `scripts/tokens/build.mjs` (DS-016) | DTCG `duration`, `cubicBezier`, custom `motion-spring` type compiled by PRD-03's `motion-spring` transform to `linear()` | none | everything |
| L1 Core CSS motion | `src/motion/css/motion.css` (NEW, `@layer ag.components`) + per-component CSS | Transitions on Base UI state attributes and `@starting-style`; registered scalars `--_ag-hover`, `--_ag-press`, `--_ag-optics` | none | all core components |
| L2 Mode rules | `src/motion/css/motion-modes.css` (NEW, `@layer ag.a11y`) | `[data-ag-motion="calm"]`, `[data-ag-motion="none"]` and `@media (prefers-reduced-motion: reduce)` mirrors | none | all |
| L3 Morph | `src/motion/viewTransition.ts` (NEW), `src/motion/css/view-transition.css` (NEW) | `document.startViewTransition`, React `<ViewTransition>` when detected, FLIP fallback, optics drop | none | Tabs, SegmentedControl, TabBar, Menu→Sheet, SourceTransition |
| L4 Pointer light | `src/motion/pointerLight.ts` (NEW) | One delegated listener per document, rAF-throttled CSS var write | none | Button, IconButton, TabBar, Card (opt-in) |
| L5 Ticker | `src/motion/ticker.ts` (NEW, internal; anchor MOT-040) | Shared rAF scheduler with delta-time, `document.hidden` and IntersectionObserver pause, dt cap; owns the shared offscreen observer that writes `data-ag-offscreen` (SC-21) | none | any remaining JS loop (pointer light, AnimatedNumber registry item, media/backdrops, labs) |
| L6 Physics | `src/motion/adapter/**` → subpath `aura-glass/motion` | `motion@^12` springs, `drag`, `layoutId`, `useVelocity`; one ms→`motion` units adapter | optional peer `motion@^12` | Sheet detents, TabBar momentum, magnetic, consumer `layoutId` |

### 4.2 Token model

Durations (ms only; exits ≈ 0.7× entries, rounded to 10 ms), from §5.3. Names follow SC-19 (`--ag-<group>-<name>`; public, semver-stable):

| Token | Enter | Exit (`-exit`) | Use |
|---|---|---|---|
| `--ag-duration-instant` | 90 | 60 | press-in, focus ring, colour |
| `--ag-duration-micro` | 120 | 80 | hover light, check mark, knob |
| `--ag-duration-small` | 200 | 140 | tooltip, menu, popover, select popup |
| `--ag-duration-medium` | 320 | 220 | dialog, sheet, toast, indicator morph |
| `--ag-duration-large` | 450 | 320 | full-screen sheet, route-level View Transition |
| `--ag-duration-ambient` | 40,000 | n/a (no exit variant) | ambient decorative loops only (MED `ag-backdrop-drift`); valid only under `[data-ag-continuous="on"]` (SC-19 accepted addition, requested by MED REQ-MED-74) |

Easings: `--ag-ease-standard: cubic-bezier(0.2, 0, 0, 1)`, `--ag-ease-emphasized: cubic-bezier(0.2, 0, 0, 1)` paired with spring `smooth` for long travel, `--ag-ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1)`, `--ag-ease-accelerate: cubic-bezier(0.3, 0, 1, 1)` (exits). No control point outside `[0, 1]` on the y axis.

Springs (PRD-06 decision for response values; ζ from §5.3). Defined as damping ratio ζ plus perceptual response *r* (Apple-style), compiled to `linear()`:

| Token | ζ | Response *r* | Settle (emitted `--ag-spring-*-duration`) | Use |
|---|---|---|---|---|
| `--ag-spring-snappy` | 1.0 | 200 ms | computed, expected ≈ 300 ms | press release, menu, thumb |
| `--ag-spring-smooth` | 0.9 | 350 ms | computed, expected ≈ 500 ms | dialog, sheet, popover emergence |
| `--ag-spring-fluid` | 0.82 | 450 ms | computed, expected ≈ 700 ms | liquid morph, indicator, View Transition group |

`ζ ≥ 0.8` means overshoot ≤ 1.5%. Underdamped defaults (`100/10`, ζ≈0.5) and Penner back/elastic curves do not exist in 5.0.

### 4.3 Spring → `linear()` compilation (contract with PRD-03)

For token (ζ, *r*): ω₀ = 2π / *r*. Sample the unit step response x(t) of `x'' + 2ζω₀x' + ω₀²x = ω₀²` at 1 ms steps. Settle *T* is the earliest t such that |1 − x| < 0.001 and |x'| < 0.001·ω₀ hold at every sample in [t, t + 50 ms]. Emit:

```css
:root {
  --ag-spring-smooth: linear(0, 0.0175 2.4%, 0.0638 4.9%, /* … ≤ 40 stops … */ 0.9994 82%, 1);
  --ag-spring-smooth-duration: 500ms;   /* T rounded up to 10 ms */
}
@supports not (transition-timing-function: linear(0, 1)) {
  :root { --ag-spring-smooth: var(--ag-ease-emphasized-decelerate); }
}
```

Stop reduction uses Ramer–Douglas–Peucker with tolerance 0.002, then caps at 40 stops. Values are rounded to 4 decimals and percentages to 1 decimal. The same sampled curve is exported in TS as `motionTokens.spring.smooth = { zeta, response, duration, linear, stiffness, damping }` with `stiffness = ω₀²` and `damping = 2ζω₀` (mass 1), so `aura-glass/motion` can feed `motion@^12` the identical spring as `{ type: 'spring', stiffness, damping, mass: 1 }`. Physical parameters are used instead of `bounce`/`visualDuration` because `motion` derives stiffness from `visualDuration` as `(2π / (1.2 · visualDuration))²` (verified in `node_modules/framer-motion/dist/es/animation/generators/spring/index.mjs:27`, same generator in `motion@12`), so `visualDuration = r/1000` would produce a 1.2× slower spring than the CSS `linear()` curve. Expected values: snappy `987.0 / 62.83`, smooth `322.3 / 32.31`, fluid `195.0 / 22.90`. `linear()` is Baseline (Chrome 113, Safari 17.2, Firefox 112); the `@supports` fallback covers older engines without layout change.

### 4.4 The motion scalars (contract with PRD-04)

PRD-06 registers three private scalars. PRD-04's pseudo-layer stack must read them `[owner: PRD-04]`:

```css
@property --_ag-hover  { syntax: '<number>'; inherits: false; initial-value: 0; }  /* 0..1 */
@property --_ag-press  { syntax: '<number>'; inherits: false; initial-value: 0; }  /* 0..1 */
@property --_ag-optics { syntax: '<number>'; inherits: false; initial-value: 1; }  /* 0..1; 0 = flat fill */
@property --_ag-pointer { syntax: '<percentage>+'; inherits: false; initial-value: 50% 30%; } /* "x% y%", one write per frame */
```

- Specular layer opacity = `calc(var(--ag-specular) * (1 + 0.35 * var(--_ag-hover) - 0.25 * var(--_ag-press)) * var(--_ag-optics))`.
- Rim layer opacity = `calc(var(--_ag-rim-base) * (1 + 0.25 * var(--_ag-hover)) * var(--_ag-optics))`.
- Shadow: `--ag-surface-shadow` cross-fades between the `rest` and `hover` shadow tokens by opacity of a pre-built shadow pseudo-layer, never by animating `box-shadow` geometry.
- Pre-blurred `::before` (the backdrop layer) opacity = `var(--_ag-optics)`. Its `backdrop-filter` value is static.
- Press depth: an inset shadow layer with opacity `var(--_ag-press)`.

Only `transform`, `opacity` and registered `--_ag-*`/`--ag-*` scalars transition. This is what makes "hover lift", "press compression" and "materialize" composite-only.

### 4.5 Preference resolution (contract with PRD-05)

PRD-05 owns `usePreference('motion')`, `AuraGlassScript` and the `data-ag-motion` attribute on `<html>` (or a subtree) `[owner: PRD-05]`. PRD-06 requires:

- Resolved motion = `min(OS floor, app setting, user setting)` on the ladder `none < calm < full`; `prefers-reduced-motion: reduce` ⇒ at most `calm`.
- `data-ag-motion` is written pre-paint, so CSS motion needs no JS. With JS disabled, the `@media (prefers-reduced-motion: reduce)` mirror in `motion-modes.css` produces the `calm` rules.
- A second key `allowContinuous: boolean` (default `false`) is exposed as `data-ag-continuous="on"` only when `true` **and** resolved motion is `full`. The attribute name is MOT-ratified (SC-21); the key itself is not yet in the SC-23 preference-key list and is an open request to A11Y (§21 O-03).
- Preference runtime paths are SC-23's: `src/theme/preferences/{store,usePreference,resolve}.ts` (A11Y-027), `src/theme/AuraGlassProvider.tsx` (A11Y-029), `src/theme/AuraGlassScript.tsx` (A11Y-032).
- JS readers (`pointerLight`, ticker, `/motion`) read `usePreference('motion')` or the attribute. Nothing calls `matchMedia` directly outside PRD-05's store.

### 4.6 Interaction catalogue (normative)

| Interaction | Trigger / attribute | Properties | Timing | `calm` | `none` |
|---|---|---|---|---|---|
| Hover lift | `:hover` on `[data-ag-interactive]` under `@media (hover: hover)` | `--_ag-hover` 0→1; shadow layer opacity (no translate, no scale; SC-38) | in `micro`/`standard`, out `micro-exit`/`accelerate` | same (scalar only) | instant |
| Press compression | `:active`, `[data-pressed]` | `--_ag-press` 0→1 (inset shadow + specular dip; no scale, SC-38) | in `instant`/`standard`, release `spring-snappy` | same (scalar only) | instant |
| Focus | `:focus-visible` | ring opacity (PRD-05 ring) | `instant` | same | instant |
| Enter / exit (generic) | `[data-starting-style]`, `[data-ending-style]`, `@starting-style` | `opacity` 0→1; `scale` 0.96→1; `transform-origin: var(--transform-origin)` (Base UI positioner) | enter `small`/`spring-snappy`, exit `small-exit`/`accelerate` | opacity only, same durations | none, final state |
| Menu / select / popover expansion | Base UI Positioner + Popup `data-starting-style` | as enter, plus `translate: 0 calc(var(--_ag-side-sign) * 4px)` from the anchor side; `--_ag-optics` 0→1 over the first 60% | `small` + `spring-snappy` | opacity | none |
| Modal emergence | Dialog Popup + Backdrop | Popup: opacity, `scale` 0.96→1, `--_ag-optics` 0→1; scrim: opacity only (scrim blur static) | `medium` + `spring-smooth`; exit `medium-exit` | opacity | none |
| Sheet | Sheet Popup | `translate` along the edge 100%→0; drag via `/motion` | `medium` + `spring-smooth`; full-screen `large` | opacity, no translate | none |
| Toast | Base UI Toast `data-starting-style`, `data-swipe-*` | translate 8px + opacity; stack reflow via `transform` | `medium` + `spring-smooth` | opacity | none |
| Shared element / liquid morph | View Transition (`view-transition-name` per indicator), `layoutId` in `/motion` | VT group geometry; optics dropped | `medium` + `spring-fluid` | cross-fade `micro` (no geometry) | instant swap |
| Depth transition | `data-ag-layer` change (content → overlay, popover promoted) | cross-fade the two shadow layers and `--_ag-optics` | `small` | same (opacity) | instant |
| Scroll response | `ScrollEdge`/`TopBar` `[owner: PRD-04]` | `animation-timeline: scroll()` driving edge-fade opacity and compact TopBar scale ≤ 0.94 | timeline | opacity only (no scale) | static |
| Parallax | `Backdrop parallax` prop in `./backdrops` (opt-in) | `animation-timeline: view()` translate ≤ 24px | timeline | off | off |
| Pointer light | `pointerLight` prop / `data-ag-pointer-light` | `--_ag-pointer` drives specular gradient centre (`radial-gradient(at var(--_ag-pointer), …)`) | rAF | off | off |
| Drag / velocity | `/motion` only | `motion` springs with initial velocity = release velocity | `spring-smooth` from tokens | snap with opacity, no spring | instant snap |
| Loading | `Spinner`, `Skeleton`, `LoadingState` | one specular sweep, `transform` only | 1,400 ms loop, only with `data-ag-continuous="on"`; otherwise one static frame | static | static |
| Ambient loop (consumer of this contract) | MED `Backdrop motion="drift"` (`ag-backdrop-drift`), MED `CarouselRail` autoplay | MED-owned keyframe; duration `--ag-duration-ambient` | only when `allowContinuous` + resolved `full` (`data-ag-continuous="on"`) **and** the consumer prop; CarouselRail autoplay counts as a loop (SC-38) | off | off |

### 4.7 View Transitions optics drop

```css
@layer ag.components {
  :root:active-view-transition [data-ag-surface][data-ag-vt],
  :root:active-view-transition [data-ag-surface][data-ag-vt-participant] { --_ag-optics: 0; transition: none; }
  ::view-transition-group(*.ag-morph) {
    animation-duration: var(--ag-duration-medium);
    animation-timing-function: var(--ag-spring-fluid);
  }
  [data-ag-surface][data-ag-vt-settled] { transition: --_ag-optics var(--ag-duration-micro) var(--ag-ease-standard); }
}
```

`startMorph(update, { surfaces })` in `src/motion/viewTransition.ts`: sets `data-ag-vt` on participating surfaces, calls `document.startViewTransition({ update, types: ['ag-morph'] })` (falls back to the callback form), awaits `finished`, then sets `data-ag-vt-settled` for one `micro` duration so optics fade back to 1. With no View Transition support it runs the FLIP fallback (`getBoundingClientRect` before/after, WAAPI `transform` only, `spring-fluid`). In React 19.3+ (`'ViewTransition' in React`), components render `<ViewTransition name=… share="ag-morph">` instead. Under `calm` the update is wrapped in a 120 ms cross-fade (`::view-transition-old/new` opacity only). Under `none` the update runs synchronously with no transition.

### 4.8 `aura-glass/motion` adapter

```ts
// aura-glass/motion (client, optional peer motion@^12)
export { MotionProvider }            // wires MotionConfig reducedMotion from usePreference('motion')
export function toMotionTransition(token: MotionTokenName, opts?: { exit?: boolean; velocity?: number }): Transition;
export function useDragDetents(opts: { detents: number[]; axis: 'x' | 'y'; onSettle(i: number): void }): DragBindings;
export function useMomentum(opts: { axis: 'x' | 'y'; bounds: [number, number] }): MomentumBindings;
export { SharedLayout, Shared }      // layoutId wrappers; Shared drops optics during layout animation
export function magnetic(opts?: { strength?: number /* 0..0.3, default 0.15 */ }): MagneticBindings;
```

Core components that need drag (Sheet, TabBar) work without the peer: they snap to detents with CSS transitions. When the consumer imports `aura-glass/motion` and wraps in `MotionProvider`, the same components register drag bindings through a `MotionCapability` context (core defines the context type only; the implementation lives in `/motion`). Core never imports the adapter.

**Note on press scale (SC-38, decided).** §8 removes the `scale 1.05/0.95` formula. The earlier declared deviations (press `scale: 0.985` on control size class, Card hover `translate: 0 -1px`) are **rejected**: no scale or translate is allowed on hover or press anywhere in core. Press depth is carried by `--_ag-press` alone. Human confirmation of this decision is tracked in §21 (O-01).

---

## 5. Exact implementation requirements

### 5.1 Tokens and compiler (consumed from PRD-03)

- **REQ-MOT-01** `tokens/sys/motion.tokens.json` (file created by DS-026; MOT supplies the values as a values-only MODIFY, SC-18) defines exactly the durations, `-exit` durations, `ambient`, easings and springs in §4.2. Values are ms integers. No MOT task creates any file under `tokens/`. Unit test: the compiled `tokens.css` contains `--ag-duration-{instant,micro,small,medium,large}` and their `-exit` variants plus `--ag-duration-ambient` with the §4.2 values and nothing else in the `duration` group.
- **REQ-MOT-02** Easing tokens have all cubic-bezier y control points in `[0, 1]`. The compiler fails on any easing with y < 0 or y > 1 (bans back/elastic). The constraint lives in DS's `tokens/$schema.json` (DS-014) and is submitted by MOT as a MODIFY.
- **REQ-MOT-03** Spring tokens are `{ "$type": "motion-spring", "$value": { "dampingRatio": ζ, "response": "<ms>" } }` with the §4.2 values. The compiler fails on ζ < 0.8 or ζ > 1.0 or response outside 120–800 ms.
- **REQ-MOT-04** `[owner: PRD-03]` The `motion-spring` transform implements §4.3: sample, settle threshold 0.001, RDP tolerance 0.002, ≤ 40 stops, emits `--ag-spring-<name>` (`linear()`) and `--ag-spring-<name>-duration`. Test: max |x(t) − linear(t)| ≤ 0.005 across 1,000 samples for each token; stop count ≤ 40; last stop is exactly `1`.
- **REQ-MOT-05** The `@supports not (transition-timing-function: linear(0, 1))` block maps each spring to an easing fallback (`snappy` → `--ag-ease-standard`, `smooth` and `fluid` → `--ag-ease-emphasized-decelerate`) without `!important`.
- **REQ-MOT-06** `src/motion/tokens.generated.ts` (generated by DS-053 from the DS compiler; MOT never hand-writes or creates it, SC-18) exports `motionTokens` with `duration`, `durationExit`, `ease` (4-tuple), and `spring.{name}.{zeta,response,duration,linear,stiffness,damping}`, where `stiffness = (2π / (response/1000))²` and `damping = 2ζ·√stiffness` (§4.3). Type test: `motionTokens.spring.smooth.stiffness` is `number`; unit test: smooth = 322.3 ± 0.1 / 32.31 ± 0.01.
- **REQ-MOT-07** The 7 legacy motion sources are retired (§9): `ANIMATION` in `src/tokens/designConstants.ts` (the file is deleted by DS-109, SC-39; MOT only verifies absence), `AURA_GLASS.motion` and `LIQUID_GLASS.motionFluency` in `src/tokens/glass.ts`, motion keys in `src/tokens/generated.ts`, `--glass-theme-duration-*` emission in `src/theme/createGlassTheme.ts`, persona `motion:` in `src/theme/designMatrix.ts`, `src/animations/physics/springPhysics.ts`, both `animationPresets`. `createGlassTheme` (`src/theme/createGlassTheme.ts`, owned by DS-083; MOT supplies the mapping as a MODIFY) keeps its `motion` policy input and maps it to PRD-05's `motion`/`allowContinuous` (`expressive` → `full` + `allowContinuous: true`; `system` → follows OS; `reduced` → `calm`; `none` → `none`).

### 5.2 Core CSS motion

- **REQ-MOT-10** `src/motion/css/motion.css` (NEW, `@layer ag.components`) registers `--_ag-hover`, `--_ag-press`, `--_ag-optics`, `--_ag-pointer` with the §4.4 `@property` definitions. Test: `CSS.registerProperty` is never called at runtime; the `@property` rules are in the shipped `styles.css`.
- **REQ-MOT-11** Hover and press: `[data-ag-interactive]:hover` (inside `@media (hover: hover)`) sets `--_ag-hover: 1`; `:active, [data-pressed]` sets `--_ag-press: 1`. No hover or press rule in any core component sets `scale`, `transform`, `translate` or `rotate` (no exceptions; SC-38 rejected the press `scale: 0.985` and Card hover `translate: 0 -1px` deviations). Lint (REQ-MOT-62) enforces it.
- **REQ-MOT-12** Every transition in core CSS lists properties explicitly from the allow-list `opacity, transform, scale, translate, rotate, color, background-color, border-color, outline-color, --_ag-hover, --_ag-press, --_ag-optics, --ag-specular`, plus `display`/`overlay` with `allow-discrete` for exit. `transition: all` and `transition-property: all` are banned.
- **REQ-MOT-13** `backdrop-filter`, `-webkit-backdrop-filter`, `filter`, `box-shadow` geometry, `width`, `height`, `top`, `left`, `inset`, `border-radius` and `clip-path` never appear in `transition`, `transition-property`, `@keyframes` or `animate()` keyframes in core. Shadow change is an opacity cross-fade of pseudo-layers (§4.4).
- **REQ-MOT-14** Enter/exit for every Base UI popup (Dialog, AlertDialog, Popover, Menu, Select, Combobox, Tooltip, PreviewCard, Toast, Sheet) uses `[data-starting-style]` and `[data-ending-style]` on the Popup part with the §4.6 values. `transform-origin` reads Base UI's `var(--transform-origin)`. No popup uses JS to delay unmount; Base UI's exit-animation detection (`getAnimations()`) handles it.
- **REQ-MOT-15** Non-Base-UI mounts that need an entrance (for example `Toast` stack items, `Thread` new message) use `@starting-style` with `opacity` and `translate` only. Layout primitives (`Stack`, `Grid`, `Container`, `Separator`, `Text`, `Heading`, `Card` at rest) have **no** mount animation. Test: rendering each in a jsdom-free Playwright page produces 0 entries in `document.getAnimations()` 50 ms after mount.
- **REQ-MOT-16** Materialization: overlay surfaces start with `--_ag-optics: 0` in `[data-starting-style]` and reach `1` at 60% of the entry duration (`transition: --_ag-optics calc(var(--ag-duration-small) * 0.6) var(--ag-ease-standard)` for small popups; `medium` for Dialog/Sheet). The `backdrop-filter` value on the pre-blurred layer is identical at t = 0 and at settle.
- **REQ-MOT-17** `data-ag-animating` `[owner: PRD-04 contract]` is set by CSS-only means where possible (`[data-starting-style], [data-ending-style]` selectors carry `will-change: transform, opacity`). JS sets `data-ag-animating` only for View Transitions and `/motion` drags, and removes it on `finished`/`onAnimationComplete`. Test: no element keeps `will-change` 100 ms after settle.
- **REQ-MOT-18** Toast stack, Menu submenu and Select item highlight transitions run on `transform`/`opacity`/`background-color` only and do not trigger layout during the transition (Performance panel: 0 Layout events attributed to the transition in the motion lane trace).

### 5.3 Modes and reduced-motion correctness

- **REQ-MOT-20** `src/motion/css/motion-modes.css` (NEW, `@layer ag.a11y`) implements `calm` for `[data-ag-motion="calm"]` **and** `@media (prefers-reduced-motion: reduce)` (when no `data-ag-motion` attribute is present): transforms in transitions are removed (`scale`, `translate`, `rotate` set to their settled values in starting styles), springs are replaced by `--ag-ease-standard`, durations are kept, pointer light and parallax are disabled, and `animation-iteration-count: infinite` animations get `animation: none`. No `!important` (D-24; layer order wins).
- **REQ-MOT-21** `none` (`[data-ag-motion="none"]`) sets `transition-duration: 0s` and `animation: none` on library parts only (selector scope `[data-ag-part], [data-ag-surface]`), never on `*`. Final states are applied immediately.
- **REQ-MOT-22** The three global `*` reduced-motion blocks (`src/styles/animations.css:6-12`, `:530-536`; `src/styles/design-tokens.css:134-140`) and the "keep essential" block (`:234-254`) are deleted in 5.0. In 4.2 they are scoped to `[data-glass-component]` descendants (behaviour fix: they stop disabling consumer-owned animations; listed in the 4.2 release notes and run through the D-27 visual-class gate with a before/after composite of the frozen 4.x fixture). From 4.3 they also lose `!important` under `[data-ag-preview="v5"]` (the preview attribute does not exist before 4.3, §14.1).
- **REQ-MOT-23** Settled-state invariant: for every core and flagship component, in every motion mode, after `--ag-duration-large` + 100 ms every library part that is open/visible has computed `opacity` = 1 (or its token resting value), `scale` = `none`/1, `translate` = `none`/0, and `visibility` ≠ `hidden`. Tested by REQ-MOT-T05 and the motion lane.
- **REQ-MOT-24** No API can raise motion above the OS floor. `motionPolicy`, `"always-safe"`, `"never-safe"`, `respectMotionPreference`, `forceMotion`, `disableReducedMotion` and any equivalent prop are removed from every 5.0 component type. Type test: `// @ts-expect-error` on `<Button respectMotionPreference={false} />` and `<AuraGlassProvider motion="always-safe" />`.
- **REQ-MOT-25** No component reads `window.matchMedia('(prefers-reduced-motion…)')`, `useReducedMotion`, `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionPreferenceContext`, `useAccessibilitySettings().reducedMotion` or `prefersReducedMotion()`. The only JS reader is `usePreference('motion')` `[owner: PRD-05]`. Lint REQ-MOT-63.
- **REQ-MOT-26** JS-driven motion that survives (pointer light, ticker clients, `/motion`) checks resolved motion at start **and** subscribes to changes. A change to `calm`/`none` mid-animation jumps to the final state within one frame.
- **REQ-MOT-27** 4.x fix (4.2, C-I): every `animate={X ? {} : {…}}` site is rewritten so `initial` is gated, not `animate`: `initial={reduced ? false : {…}}` with an unconditional `animate={{…final…}}`. Delivered by codemod `reduced-motion-initial` (§11) and verified by REQ-MOT-T06 on the 35 files. This is required even though most of those components are removed in 5.0, because 4.x LTS lasts 12 months.
- **REQ-MOT-28** 4.x fix (**4.1.1**, C-I; accepted into TRUST's 4.1.1 scope as a privacy fix, SC-36): `CookieConsent`, `GlobalCookieConsent` and `CompactCookieNotice` drive opacity and transform from `visible` directly (CSS transition on a `data-state` attribute); `useGalileoStateSpring` is no longer used by them. A hidden banner has `pointer-events: none` and `visibility: hidden` after its exit.
- **REQ-MOT-29** 4.x fix (4.2, C-I): `MotionFramer` initialises `reduced` from a synchronous `matchMedia` read on the client (server snapshot `false`, then `useSyncExternalStore`), so mount presets play on first render when motion is allowed and resolve to the final state when it is not.

### 5.4 Continuous motion, loops and the ticker

- **REQ-MOT-30** `allowContinuous` defaults to `false` (preference key requested of A11Y, §21 O-03). With `data-ag-continuous` absent, no core component has a running animation with `iterationCount === Infinity` and no rAF callback is scheduled 1 s after settle. Test REQ-MOT-T08.
- **REQ-MOT-31** The only continuous animations in core are the loading sweep (`Spinner`, `Progress` indeterminate, `Skeleton`), the `ToolCall` running indicator, and the MED ambient loops (`ag-backdrop-drift` in `./backdrops`, MED-066, duration `--ag-duration-ambient`; `CarouselRail` autoplay, SC-38), all gated by `[data-ag-continuous="on"]` (MED loops additionally require their consumer prop). Without it, `Spinner` shows a static ring segment plus `aria-busy`; `Skeleton` shows a static fill; indeterminate `Progress` shows a static 30% segment. Each still conveys state (WCAG 2.2.2 compliant).
- **REQ-MOT-32** Loading sweep: one `@keyframes ag-sweep` animating `translate` of a specular gradient pseudo-element from −100% to 100%, 1,400 ms, `--ag-ease-standard`. No `hue-rotate`, `filter`, `background-position` or `box-shadow` keyframes. This is the only `@keyframes` for loading in core. The only other admitted infinite keyframe is MED's `ag-backdrop-drift` (REQ-MOT-31).
- **REQ-MOT-33** `src/motion/ticker.ts` (NEW, internal, not exported): one rAF loop shared by all JS-driven motion; `subscribe(cb, { element })` returns an unsubscribe; callbacks receive `dt` capped at 50 ms; the loop stops when there are no subscribers; it pauses when `document.visibilityState === 'hidden'` and skips subscribers whose `element` is reported non-intersecting by one shared `IntersectionObserver`. That same observer is the single owner of the `data-ag-offscreen` attribute (SC-21; requested by MED, not A11Y): it sets `data-ag-offscreen` on every observed element while it is non-intersecting and removes it when it intersects, so CSS loops (`animation-play-state: paused` under `[data-ag-offscreen]`) and media consumers pause without their own observers. An `observeOffscreen(el)` internal helper registers non-ticker elements. Callbacks must not call React state setters (lint REQ-MOT-65).
- **REQ-MOT-34** `AnimatedNumber` (REDESIGN target of `GlassAnimatedNumber`; **registry/compat only**, not a core export and not used by `StatCard`, which is a static Server Component per SC-38 / DATA; tween contract owned here) tweens through the ticker by writing `textContent` on a span, announces only the final value via `aria-live="polite"`, and renders the final value immediately under `calm`/`none`.
- **REQ-MOT-35** No core file uses `Math.random()` to drive motion or keyframe values. Deterministic seeds are required for any remaining procedural visual (labs only).

### 5.5 View Transitions and morphs

- **REQ-MOT-36** `src/motion/viewTransition.ts` exports internal `startMorph(update: () => void | Promise<void>, opts: { surfaces: Element[]; name?: string }): Promise<void>` implementing §4.7 for the imperative path: `document.startViewTransition` when present, otherwise the FLIP fallback. React `<ViewTransition>` is a component, not something `startMorph` can call: morph components detect it once at module scope (`'ViewTransition' in React` or `'unstable_ViewTransition' in React`) and, when present, render `<ViewTransition name=… share="ag-morph">` and wrap the state change in `startTransition` instead of calling `startMorph`; optics drop then relies on `:root:active-view-transition` alone. `startMorph` never throws if the transition is skipped (`InvalidStateError`, `AbortError`) and always runs `update` exactly once.
- **REQ-MOT-37** Optics drop: during `:active-view-transition`, every participating `[data-ag-surface][data-ag-vt]` has `--_ag-optics: 0` (flat solved fill, rim and specular hidden), and after `finished` the value returns to 1 over `--ag-duration-micro`. Tested per engine (REQ-MOT-T12).
- **REQ-MOT-38** Morph users: `Tabs` indicator (`view-transition-name: ag-tabs-indicator-<id>`), `SegmentedControl` thumb, `TabBar` selection capsule, `Menu`→`Sheet` on breakpoint change, and `SourceTransition` (flagship 31). Names are generated from `useId()` and sanitised to `[a-z0-9-]`. No two simultaneously rendered elements share a name (dev warning if they do). Every morph surface also renders the static attribute `data-ag-vt-participant`, so the §4.7 optics drop applies on the React `<ViewTransition>` path where `startMorph` (and thus `data-ag-vt`) is not used.
- **REQ-MOT-39** FLIP fallback animates only `transform` (translate + scale) with WAAPI using `--ag-spring-fluid` read via `getComputedStyle`, duration `--ag-spring-fluid-duration`, and is cancelled and jumped to its end on interruption or a preference change.

### 5.6 Pointer light

- **REQ-MOT-40** `src/motion/pointerLight.ts` (NEW): `installPointerLight(doc)` adds exactly one `pointermove` and one `pointerleave` listener per `Document` (ref-counted across providers/components), `{ passive: true }`. On move it stores the event and schedules a ticker frame; per frame it finds the nearest `[data-ag-pointer-light]` ancestor of the target and writes `--_ag-pointer` (`"<x>% <y>%"`, percent of its border box, 1-decimal) on that element only. On leave it removes the property so CSS transitions back to the initial value over `--ag-duration-micro`.
- **REQ-MOT-41** Pointer light is enabled per component with `pointerLight?: boolean` (default `false`) on `Button`, `IconButton`, `TabBar`, `Card` and `Surface` (prop forwarded as `data-ag-pointer-light`). It is active only when all hold: resolved motion `full`; resolved transparency `glass`; `@media (hover: hover) and (pointer: fine)`; `data-ag-tier` is `standard` or `enhanced`. Otherwise no listener is installed.
- **REQ-MOT-42** Pointer light performs zero React renders per move (React Profiler commit count unchanged during a 2 s synthetic pointer sweep), at most one `style.setProperty('--_ag-pointer', …)` call per frame, and zero `getBoundingClientRect` calls per frame beyond one per entered element (rect cached on `pointerenter`, invalidated on scroll/resize).

### 5.7 framer-motion elimination and the `./motion` adapter

- **REQ-MOT-50** No file under `src/` other than `src/motion/adapter/**` imports `framer-motion` or `motion` (any subpath). `[owner: PRD-02]` (SC-14): the runtime allowlist `docs/dependency-allowlist.json` is created by PKG-056 and checked by `scripts/ci/verify-deps.mjs` (PKG-057). MOT only adds rows by MODIFY: `motion` as an optional peer whose allowed importers are `["src/motion/adapter/**"]`, and `framer-motion` as banned. `scripts/ci/verify-no-core-ui-deps.js` is deleted by PKG-075 and is not edited by MOT.
- **REQ-MOT-51** `package.json` 5.0: `framer-motion` removed from `peerDependencies`, `peerDependenciesMeta` and `devDependencies`; `motion` added as `peerDependencies: { "motion": "^12" }` with `peerDependenciesMeta.motion.optional = true`; `motion` pinned exact in `devDependencies` for tests.
- **REQ-MOT-52** `aura-glass/motion` exports exactly the §4.8 surface: `MotionProvider`, `toMotionTransition`, `useDragDetents`, `useMomentum`, `SharedLayout`, `Shared`, `magnetic`, and the types `MotionTokenName`, `DragBindings`, `MomentumBindings`, `MagneticBindings`. It is `"use client"` per file. The subpath entry is a row in `build/exports.manifest.json` (PKG-005, SC-12). The API report `etc/api/motion.api.md` and the export snapshot `etc/api/motion.exports.json` (REL scripts `scripts/release/{api-report,export-snapshot}.mjs`, SC-04) lock it.
- **REQ-MOT-53** `toMotionTransition('spring-smooth')` returns `{ type: 'spring', stiffness: 322.3, damping: 32.31, mass: 1 }` (values read from `motionTokens`, never re-derived; `opts.velocity` adds `velocity`); duration tokens return `{ duration: ms / 1000, ease: [..4] }`. Unit conversion happens only here (one ms→s adapter, §8). Test: a `motion` spring animation built from this transition and the CSS `linear()` curve for the same token differ by ≤ 0.01 at every 10 ms sample.
- **REQ-MOT-54** `MotionProvider` renders `<MotionConfig reducedMotion={resolved === 'full' ? 'never' : 'always'}>` from `usePreference('motion')`, so `motion` honours AuraGlass's floor, not its own media query, and `calm` disables `motion` transforms and layout animations.
- **REQ-MOT-55** `useDragDetents`: release velocity (px/s, from `motion`'s `info.velocity`) chooses the target detent by projecting `position + velocity * 0.2` and is passed as the spring's initial `velocity` (velocity-aware handoff). Rubber-band beyond the first/last detent with factor 0.55. Under `calm`, release snaps with an opacity-only transition. Under `none`, it jumps.
- **REQ-MOT-56** `useMomentum` (TabBar): decays with `motion`'s `inertia` (`power: 0.8`, `timeConstant: 325`), clamps to bounds, settles in ≤ 1,000 ms, and is fully interruptible by a new pointerdown.
- **REQ-MOT-57** `magnetic({ strength })` translates the element toward the pointer by at most `strength × 0.5 × min(width, height)`, capped at 8 px, via `motion` values (no React state), only under resolved `full` and `(pointer: fine)`. It replaces `GlassMagneticButton` and `GlassMagneticCursor` (§9).
- **REQ-MOT-58** `Shared`/`SharedLayout` wrap `motion`'s `layoutId`/`LayoutGroup`; during a layout animation they set `data-ag-animating` and `--_ag-optics: 0` on the participating surface and restore it on `onLayoutAnimationComplete`.
- **REQ-MOT-59** Core Sheet and TabBar function without the peer: detents reachable by keyboard and handle buttons; CSS transition snap. Test REQ-MOT-T15 runs them with `motion` absent from `node_modules`.

### 5.8 Motion lint (static lane)

Rules are `auraglass/motion-*` (SC-16) registered by MODIFY in the existing `eslint-plugin-auraglass.js` (plugin file, namespace and `eslint.config.js` wiring owned by PKG-015; no MOT task CREATEs the plugin), plus a new CSS checker `scripts/ci/verify-motion-css.mjs` (NEW, PostCSS AST, no new dependency beyond the PostCSS already used by the build `[verify at PRD-02]`). All run in lane **L1 Static** (SC-29) and fail on any violation unless a ratchet is stated. Rules owned elsewhere and only consumed here: `auraglass/no-raw-design-values` (DS, SC-17), `auraglass/no-transition-all`, `no-permanent-will-change`, `raf-requires-cancel`, `raf-requires-visibility-gate` (PERF), `no-random-in-render` (PKG).

- **REQ-MOT-60** `auraglass/motion-no-runtime-import`: error on `import`/`require`/dynamic `import()` of `framer-motion`, `motion`, `motion/react`, `popmotion`, `react-spring`, `gsap` outside `src/motion/adapter/**` (`@auraglass/labs` is a separate package with its own lint config).
- **REQ-MOT-61** Motion literals are the `duration|easing|spring` categories of DS's single rule `auraglass/no-raw-design-values` (ESLint + stylelint, DS-071), run by `scripts/tokens/gates/literals.mjs` (DS-072) against the one baseline `scripts/tokens/gates/literals-baseline.json` (DS-073) (SC-17). There is no `auraglass/motion-no-literals` rule and no `scripts/ci/motion-literal-baseline.json`. MOT supplies the category matchers by MODIFY: numeric `duration`, `delay`, `stiffness`, `damping`, `mass`, `bounce`, `visualDuration` object keys, `cubic-bezier(`/`linear(` strings and Tailwind `duration-*`/`ease-*`/`delay-*` classes in `src/**` outside `src/motion/**` and generated token files; in CSS any `ms`/`s` time literal or `cubic-bezier()` in `transition*`/`animation*` outside `tokens.css`. The baseline is measured on DS's first run (architecture §15.2 "≈1,890" is then replaced by the measured number), ratchets down only and reaches 0 by 5.0.0-beta.1; 0 is required on every flagship file.
- **REQ-MOT-62** `auraglass/motion-no-hover-transform`: CSS (in `verify-motion-css.mjs`): error on `scale`, `transform`, `translate`, `rotate` inside rules whose selector contains `:hover`, `[data-highlighted]`, `:active` or `[data-pressed]`, with no allow-list (SC-38). JS (ESLint): error on `whileHover`/`whileTap` anywhere in `src/**`.
- **REQ-MOT-63** `auraglass/motion-single-preference-source`: error on `matchMedia(` with a string containing `prefers-reduced-motion`, and on imports of `useReducedMotion`, `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionPreferenceContext`, `MotionPreferenceContext`, `prefersReducedMotion`, `ReducedMotionProvider` outside A11Y's `src/theme/preferences/**` (SC-23).
- **REQ-MOT-64** `auraglass/motion-no-empty-animate` (4.x and 5.x; MOT owns the rule, SC-16): error on a JSX `animate` attribute whose value is a conditional with `{}`, `undefined` or `false` in either branch, and on `initial={{ opacity: 0 }}` when `animate` is conditional. It absorbs TRUST's `no-empty-reduced-animate`: TRUST-045 lands it in 4.1.1 under this name (one name on both branches); MOT extends it and keeps it as error on `src/**` from 4.2.
- **REQ-MOT-65** `auraglass/motion-raf-via-ticker`: error on `requestAnimationFrame(` and `setInterval(` in `src/components/**` and `src/primitives/**` (5.0 tree: every component directory); use `ticker.subscribe`. Also error on a call to a `useState` setter or `dispatch` inside a `ticker.subscribe` callback or rAF callback.
- **REQ-MOT-66** `auraglass/motion-gated-continuous`: error on `repeat: Infinity`, `iterations: Infinity`, `animation-iteration-count: infinite` and `infinite` in an `animation` shorthand, unless the rule is nested under `[data-ag-continuous="on"]` (CSS) or, in JS, the loop is started only from a branch guarded by `usePreference('allowContinuous')`. `src/motion/css/loading.css` gets no file-level exception: its `ag-sweep` rules must also be nested under `[data-ag-continuous="on"]`, and so must MED's `ag-backdrop-drift` rules in `src/backdrops/presets/*.css`.
- **REQ-MOT-67** `verify-motion-css.mjs` also fails on: CSS `transition: all` / `transition-property: all` and the `glass-transition-all` utility (REQ-MOT-12; the JS/Tailwind `transition-all` class check is PERF's `auraglass/no-transition-all`, SC-16, and is not duplicated); any animated property outside the REQ-MOT-12 allow-list; `backdrop-filter`/`filter` in `@keyframes` or `transition` (REQ-MOT-13); a cubic-bezier with y outside `[0,1]`; `!important` in any motion rule; duplicate `@keyframes` names across the shipped CSS; a `@keyframes` name not prefixed `ag-`; unregistered custom properties in `transition` lists.
- **REQ-MOT-68** Lint rule unit tests live in `tests/lint/motion-rules.test.ts` (NEW) with at least one valid and one invalid fixture per rule and per allow-list exception.

### 5.9 Motion certification lane (remote)

These assertions run inside QA's lane **L9 Motion** (SC-29): lane entry `certification/lanes/motion.spec.ts` (QA-076), config `certification/playwright.cert.config.ts` (QA-018), workflows `certify-pr.yml` / `certify-main.yml` / `certify-release.yml` (QA-031). MOT adds no Playwright config and no workflow of its own; its specs in `tests/motion/**` are added as a project of the cert config by MODIFY. The 4.x scripts `scripts/audit/storybook-visual-certification.mjs` (deleted by QA-115, SC-39) and `scripts/audit/3.1-frame-loop-audit.js` (dev-only, SC-11) are not extended; the rAF counter is QA-076's `addInitScript` instrument. It runs only on CI or remote runners, never on a developer Mac. QA provides runners, artifacts and retention; PRD-06 owns the motion assertions. Perf checks run through PERF's harness `tests/perf/harness/run-perf.mjs` (PERF-039).

- **REQ-MOT-70** A `motion` project added to `certification/playwright.cert.config.ts` (QA-018, MODIFY) runs `tests/motion/**/*.spec.ts` on Chromium, WebKit and Firefox at 1440×900 and 390×844, with `reducedMotion` emulated as `no-preference` and `reduce`, against the static Storybook build under `certify:1`. Motion is **on** by default in this lane (QA REQ-QA-21: cert mode does not force `reducedMotion: "reduce"`, MOTION-08 summary PARTIAL).
- **REQ-MOT-71** Frame-strip capture: real-time `page.screenshot` cannot sustain 16 ms spacing (one capture takes tens of ms), so frames are captured deterministically. After triggering the state change, the spec immediately calls `document.getAnimations({ subtree: true })` on the subject, pauses every returned animation, and for t ∈ {0, 1/11, …, 11/11} × the longest animation's `effect.getComputedTiming().endTime` sets `currentTime = t` and takes `locator.screenshot()` of the subject box, also recording the `getAnimations()` snapshot (`animationName`/`transitionProperty`, `currentTime`, `playState`). Assert an entrance actually animates: at least 3 distinct frames (pixel diff > 0.5% of the subject box) across the 12 under `no-preference`, and at least 1 `CSSTransition`/`CSSAnimation` exists at trigger + 1 frame. A real-time sanity pass (Chromium only, CDP `Page.startScreencast`) records wall-clock duration within ±20% of the token duration.
- **REQ-MOT-72** Settle check (both preferences): after `--ag-duration-large` + 100 ms, `getAnimations().filter(a => a.playState === 'running')` is empty for library parts, computed opacity of every visible part ≥ 0.99, `getComputedStyle(el).scale` ∈ {`none`, `1`}, `translate` ∈ {`none`, `0px`}, and the subject's bounding box has width and height > 0.
- **REQ-MOT-73** Reduced-motion idle check: under `reduce`, from settle + 0 to + 2,000 ms, a `requestAnimationFrame`/`setInterval` wrapper injected via `page.addInitScript` (QA-076's instrument) records **0** callbacks whose registering stack (`new Error().stack`, captured at registration) contains a URL from the AuraGlass build output (`/aura-glass/` chunk path or the Storybook `node_modules_aura-glass` chunk), and `getAnimations()` returns 0 running animations. Storybook-manager and test-harness callbacks are excluded by the same URL filter. This matches architecture §15.2 "no rAF or WAAPI after settle".
- **REQ-MOT-74** Transform check under `reduce`: across the whole entry, sampled computed `scale`/`translate` on the Popup part never differ from the settled values (opacity may change).
- **REQ-MOT-75** View Transition optics check (per engine where `document.startViewTransition` exists): during `:active-view-transition`, computed `--_ag-optics` on participants is `0`; 1 frame after `finished` + `--ag-duration-micro`, it is `1`. On engines without View Transitions, the FLIP path runs and `--_ag-optics` behaves the same.
- **REQ-MOT-76** Frame-time check (lane **L10 Performance**, PERF harness `tests/perf/harness/run-perf.mjs`, budgets read from `tests/perf/harness/budgets.json`, SC-15/SC-30): mid-tier mobile emulation (4× CPU throttle, 390×844) and a 120 Hz desktop. During Dialog open/close, Menu open, Tabs indicator morph and Button hover/press sweeps: p95 frame time and long-task counts meet §16. Pointer-light sweep meets REQ-MOT-42.
- **REQ-MOT-77** Lane subjects (5.0 exit): `Button` (rest, hover, press, focus, pressed-toggle, `pointerLight`), `Dialog` (open, close, nested AlertDialog over Dialog, Escape). Then every flagship in §11.2 in its states, plus the six product surfaces as scenes. A lane failure blocks merge for the touched component.
- **REQ-MOT-78** The lane emits `motion-report.json` (per subject × engine × viewport × preference: frames-changed, settle pass, idle rAF count, VT optics pass, p95 frame ms) as a CI artifact keyed to the SHA (D-32). Nothing is committed to `reports/`.

### 5.10 Cut inventory (every existing animation to remove)

- **REQ-MOT-80** Delete decorative infinite loops from the 5.0 tree (files whose inventory disposition is REMOVE are deleted by FND's removal families through `scripts/removal/consumer-grep.mjs`, FND-103; MOT deletes motion-only modules and re-authors survivors). Framer `repeat: Infinity` (43 in 21 files) lives in: `website-components/GlassPrismComparison.tsx` (13), `social/GlassPresenceIndicator.tsx` (3), `quantum/GlassSuperpositionalMenu.tsx` (3), `primitives/motion/presets.ts` (2), `social/GlassReactionBubbles.tsx` (2), `effects/Glass3DEngine.tsx` (2), `animations/AdvancedAnimations.tsx` (2), `advanced/GlassQuantumStates.tsx` (2), `accessibility/GlassFocusIndicators.tsx` (2), and 1 each in `social/GlassVoiceWaveform.tsx`, `quantum/GlassCoherenceIndicator.tsx`, `effects/SeasonalParticles.r3f.tsx`, `effects/GlassShatterEffects.r3f.tsx`, `animations/GlassMotionController.tsx`, `advanced/GlassTrophyCase.tsx`, `advanced/GlassSpatialAudio.tsx`, `advanced/GlassReactions.tsx`, `advanced/GlassProgressiveEnhancement.tsx`, `advanced/GlassMetaEngine.tsx`, `advanced/GlassLiveCursorPresence.tsx`, `advanced/BrandColorIntegration.tsx` (all under `src/components/` except `presets.ts`). Each file is either REMOVE/DEPRECATE per inventory (deleted with it) or re-authored without the loop. Acceptance: `rg "repeat: Infinity" src` = 0 outside `src/motion/adapter` and labs.
- **REQ-MOT-81** Delete CSS infinite animations (the removal of `src/styles/glass.css` itself belongs to MOT, MOT-084, SC-20) from `src/styles/glass.css`, `src/styles/design-tokens.css`, `src/styles/storybook-utility-shim.css`, `src/components/backgrounds/GlassDynamicAtmosphere.module.css`, `src/components/backgrounds/AtmosphericBackground.module.css`, `src/components/input/GlassMultiSelect.module.css`, `src/components/marketing/marketing.css`, `src/components/effects/glass-morphing.css`, `src/components/visual-feedback/StateIndicator.module.css`, `src/components/visual-feedback/VisualFeedback.module.css`, and `src/client/components/HeroSection/HeroSection.module.css` (deleted with `client`). The only remaining infinite animation is `ag-sweep` (REQ-MOT-32), gated.
- **REQ-MOT-82** Delete every bounce/overshoot artefact: `bounceIn`, `bounceOut`, `elasticIn`, `elasticOut` (`src/tokens/designConstants.ts:30-34`, removed with the file by DS-109; MOT verifies), `cubic-bezier(0.68,-0.55,0.265,1.55)` (3 uses), `@keyframes springBounce` (`src/styles/glass.css:4350`), `@keyframes spring-bounce` (`src/styles/animations.css:397`), Tailwind `animate-bounce`, and the underdamped 100/10 default (`src/animations/physics/springPhysics.ts:2-6`).
- **REQ-MOT-83** Delete decorative keyframes: `float` (`src/styles/animations.css:177`, `GlassHologram.tsx:821`), `glow-pulse` (`src/styles/animations.css:82`, `src/core/mixins/glowEffects.ts:231`), `rainbow-glow` (`animations.css:106`, `glowEffects.ts:236`), `glowPulse` (`GlowingCard.tsx:222`, `GlassAutoComposer.tsx:529`, `HeroSection.module.css:294`), all four `shimmer` definitions (`src/styles/glass.css:4304`, `src/components/effects/glass-morphing.css:142`, `src/components/advanced/GlassPerformanceOptimization.css:3`, `src/components/data-display/GlassLoadingSkeleton.tsx:444`), plus `rainbowShift`, `gradientShift`, `dual-glow`, `glow-animate`, `nebulaMove`, `meshDrift`, `morphBlob`, `particleFloat`, `particle-orbit`, `quantumFluctuate`, `interference`, `hologram-scan-lines`, `hologram-layer-scan`, `magneticPulse`, `magnetic-attract`, `magnetic-click`, `pulse-3d`, `noise`. Their replacements: none (decorative), or `ag-sweep` (loading), or `Backdrop` presets in `./backdrops` (static, PRD-owned there).
- **REQ-MOT-84** Delete animated-filter motion: the 20 `filter`/blur keyframe arrays, `GlassTransitions.tsx:20-190` shatter/ripple/morph variants, and every `hue-rotate` animation.
- **REQ-MOT-85** Delete the Switch shimmer (`src/components/input/GlassSwitch.tsx:247`) in 4.2 (deferred from 4.1.1 per SC-36; C-I visual fix on the D-28 visual-fix list that REL records, with before/after composite). The `release/4.x` edit is CTL's (CTL-154, SC-36); MOT owns the requirement and the L9 check that no infinite animation remains on the Switch story. It is not reintroduced in 5.0 `Switch` (CTL-041).
- **REQ-MOT-86** Delete permanent FPS loops (on `release/4.x` in **4.2**, deferred from 4.1.1 per SC-36; on `main` with the files' 5.0 removal): `src/components/layout/OptimizedGlassContainer.tsx:66-84`, `src/components/advanced/GlassPerformanceOptimization.tsx:92-95`.
- **REQ-MOT-87** Delete mount animations on layout primitives: `preset="fadeIn"`/`slideDown`/`scaleIn` on `GlassStack`, `HStack`, `VStack`, `GlassGrid`, `GlassFlex`, `GlassSeparator` and every Card at rest.
- **REQ-MOT-88** Replace Tailwind `animate-pulse` (78), `glass-animate-pulse` (44), `animate-spin` (63) and `glass-animate-spin` (54) uses in surviving components with `Spinner`/`Skeleton` (REQ-MOT-31). `glass-animate-*` utilities are not shipped in 5.0 `styles.css`.

---

## 6. Files/directories affected (existing paths, verified with `rg --files`)

| Path | Change |
|---|---|
| `package.json` (`:374`, `:396`, `:499`) | framer-motion → `motion@^12` optional peer (REQ-MOT-51); 4.2 keeps framer-motion optional peer |
| `eslint-plugin-auraglass.js`, `eslint.config.js` | MODIFY only (plugin and wiring owned by PKG-015, SC-16): add the `auraglass/motion-*` rules of REQ-MOT-60, -62..-66 and their severities (`.eslintrc.js` legacy config gets the same rules until PKG removes it) |
| `scripts/ci/token-lint.js` | not extended; motion literals are DS's `no-raw-design-values` categories (REQ-MOT-61, SC-17) |
| `scripts/scan-motion-performance.js` | superseded by the motion lane; deleted at 5.0 |
| `scripts/fix-use-reduced-motion-imports.sh` | deleted (pre-5.0 tooling for a removed hook) |
| `scripts/audit/storybook-visual-certification.mjs` | not touched by MOT; deleted by QA-115 (SC-39) |
| `scripts/audit/3.1-frame-loop-audit.js`, `scripts/audit/verify-visual-evidence.js` | not touched; `scripts/audit/` is dev-only and never a required check (SC-11). The idle-rAF counter is QA-076's; `motion-report.json` is a lane artifact (REQ-MOT-78) |
| `certification/playwright.cert.config.ts` (QA-018) | MODIFY: add the `motion` project for `tests/motion/**` (REQ-MOT-70) |
| `.storybook/preview.tsx` (SB-048) | MOT registers the motion toolbar globals (`system / full / calm / none`, `allowContinuous`) through SB's globals contract; no MOT rewrite (SC-31) |
| `build/css-ownership.json` (PKG-099) | MODIFY: map `src/motion/css/*.css` to their layers so `scripts/build/build-css.mjs` (PKG-097) assembles them into `styles.css` (SC-20) |
| `src/tokens/designConstants.ts` (`:13-43`) | `ANIMATION` C-D in 4.2 (re-exported from tokens with dev warning); the 5.0 file deletion is DS-109 (SC-39), MOT verifies |
| `src/tokens/glass.ts` (`:849-853`, `:1370-1376`) | `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency` removed |
| `src/tokens/generated.ts` (`:176-195`) | motion keys regenerated from the DTCG tree by PRD-03 |
| `src/theme/createGlassTheme.ts` (`:43`, `:93-118`, `:223-225`; owner DS-083) | MODIFY: policy mapped to PRD-05 store; `--glass-theme-duration-*` emission removed |
| `src/theme/designMatrix.ts` (`:189`, `:280`) | persona `motion:` removed |
| `src/theme/useGlassMotionPolicy.ts` | removed (replaced by `usePreference`) |
| `src/styles/animations.css`, `src/styles/design-tokens.css`, `src/styles/glass.css`, `src/styles/performance-animations.css`, `src/styles/keyframes.css`, `src/styles/glass.generated.css` (`:504`) | global nukes, decorative keyframes, `transition: all` removed (REQ-MOT-22, -81..-83, -12) |
| `src/core/mixins/glowEffects.ts` | glow keyframes removed (with `core/mixins/glassMixins` subpath removal) |
| `src/primitives/motion/` (`MotionFramer.tsx`, `presets.ts`, `ReducedMotionProvider.tsx`, `index.ts`) | 4.2 fixes (REQ-MOT-29); removed from core in 5.0 |
| `src/primitives/MotionNative.tsx`, `src/primitives/index.ts:91`, `src/index.ts:16`, `:364`, `:627`, `:908` | `Motion`, `animationPresets`, `GlassTransitions`, `MotionPreferenceProvider` exports removed (C-D 4.2 → C-B 5.0) |
| `src/primitives/LiquidGlassSourceTransition.tsx` | re-authored as `SourceTransition` on `startMorph` |
| `src/contexts/MotionPreferenceContext.tsx` | removed (`"always-safe"` and context default) |
| `src/hooks/useReducedMotion.ts`, `src/hooks/useReducedMotion.tsx`, `src/hooks/useEnhancedReducedMotion.ts`, `src/hooks/useMotionPreference.ts`, `src/hooks/useAccessibilitySettings.ts` (motion part), `src/animations/accessibleAnimation.ts` | removed by MOT-077 (sole remover of `useReducedMotion.ts`, SC-39); `useReducedMotion` re-exported from `aura-glass/compat` as the adapter `src/compat/motion/useReducedMotion.ts` (thin wrapper over `usePreference('motion') !== 'full'`, calls `warnDeprecated(id)` from REL-072; listed in `src/compat/index.ts`, DX-065, SC-34) |
| `src/hooks/useGalileoStateSpring.ts`, `src/hooks/extended/useGalileoSprings.ts`, `src/hooks/physics/usePhysicsEngine.ts`, `src/hooks/physics/usePhysicsLayout.ts` | removed |
| `src/animations/**` (`physics/*`, `orchestration/*`, `hooks/*`, `keyframes/basic.ts`, `accessible/*`, `types*.ts`) | removed; `galileoPhysicsSystem.ts` archived as a reference outside the package |
| `src/physics/AuraPhysicsEngine.ts` | removed |
| `src/components/animations/*` (`AdvancedAnimations`, `GlassMotionController`, `GlassTransitions`, `OrganicAnimationEngine` + stories/tests/snapshots) | removed (§9) |
| `src/components/button/GlassButton.tsx` (`:11`, `:18`, `:279`, `:823-882`) | `Motion` wrapper removed; becomes `Button` (`src/components/button/Button.client.tsx` CTL-055, `Button.css` CTL-056) with CSS motion; MOT supplies the motion rules by MODIFY of `Button.css` |
| `src/components/modal/GlassModal.tsx` (`:11`, `:24`, `:223`, `:746`, `:802-821`), `src/components/modal/GlassDialog.tsx` | become `Dialog` (`src/components/dialog/Dialog.client.tsx` OVL-040, `Dialog.css` OVL-046) on Base UI with CSS motion; MOT supplies the motion rules by MODIFY of `Dialog.css` |
| `src/components/input/GlassSwitch.tsx:247` | shimmer removed on `release/4.x` by CTL-154 (SC-36); MOT verifies |
| `src/components/cookie-consent/{CookieConsent,GlobalCookieConsent,CompactCookieNotice}.tsx` | REQ-MOT-28 fix in 4.x |
| `src/components/layout/OptimizedGlassContainer.tsx`, `src/components/advanced/GlassPerformanceOptimization.tsx` | FPS loops removed |
| All 35 files with the M-01 pattern (list generated by `rg -l 'animate=\{\s*\w+\s*\?\s*\{\}'`) | REQ-MOT-27 codemod in 4.2 |

## 7. Components affected

Motion behaviour changes for every flagship. PRD-06 owns the motion CSS and tests for these; the component PRDs own structure and API.

| Flagship (§11.2) | 4.x source(s) | Motion in 5.0 |
|---|---|---|
| 1 `Button`, 2 `IconButton` | `GlassButton`, `EnhancedGlassButton`, `RippleButton`, `GlassMagneticButton` | hover light, press compression, `pointerLight` opt-in; ripple deleted; magnetic → `/motion` `magnetic()` |
| 3 `ButtonGroup`/`Toolbar`, 4 `SegmentedControl` | `LiquidGlassControlGroup`, `GlassSegmentedControl`, `LiquidGlassSegmentedControl` | thumb liquid morph (View Transition, optics drop) |
| 5 `Switch` | `GlassSwitch` | knob `translate` with `spring-snappy`; shimmer removed |
| 6 `Slider` | `GlassSlider` | thumb hover/press light; no spring on value |
| 7–13 form controls | `GlassCheckbox`, `GlassRadioGroup`, `GlassInput`, `LiquidGlassSearchField`, `GlassSelectCompound`, `GlassCombobox`, `GlassStepper` | check mark `micro`; popups per §4.6 menu expansion |
| 15 `Dialog`, 16 `AlertDialog` | `GlassModal`, `GlassDialog` | modal emergence; scrim opacity only |
| 17 `Sheet` | `GlassDrawer`, `GlassBottomSheet`, `GlassActionSheet`, `MobileGlassBottomSheet` | edge translate; detents via `/motion` |
| 18 `Popover`, 19 `Tooltip`, 20 `Menu`, 21 `Toast` | `GlassPopover`, `GlassTooltip`, `GlassDropdownMenu`, `GlassToast` ×2 | anchor-origin expansion; Toast swipe and stack |
| 22–24 `AppShell`, `Sidebar`, `TopBar` | `GlassAppShell` ×2, `GlassSidebar`, `GlassTopBar` | collapse via `transform`; TopBar scroll response (with PRD-04 `ScrollEdge`) |
| 25 `Tabs`, 26 `TabBar` | `GlassPageTabs`, `GlassTabs`, `LiquidGlassTabBar`, `GlassTabBar` | indicator morph; TabBar momentum via `/motion` (`GlassTabBar.tsx:730-759` rAF removed) |
| 29 `CommandPalette` | `GlassCommandPalette`, `GlassCommand` | Dialog emergence |
| 31 `SourceTransition` | `LiquidGlassSourceTransition` | `startMorph` |
| 36 `Sparkline`, 37 `Timeline` | `GlassSparkline`, `GlassTimeline` | no mount animation |
| 38–41 AI | `GlassMessageList`, `GlassChatInput`, `GlassTypingIndicator` | new message `@starting-style`; `ToolCall` running indicator gated |
| 43–44 Media | `LiquidGlassMediaControls`, `LiquidGlassCarouselRail` | scroll-snap; autoplay counts as a loop: runs only with `allowContinuous` + resolved `full` + the consumer prop (SC-38; MED REQ-MED-54, MED-133) |
| T2 `Skeleton`, `Progress`, `Spinner` (`LoadingState`) | `GlassLoadingSkeleton`, `GlassSkeleton`, `GlassSkeletonLoader`, `GlassProgress` | `ag-sweep` gated |
| `AnimatedNumber` (registry/compat only; **not** in `StatCard`, which is a static Server Component, SC-38) | `GlassAnimatedNumber` (REDESIGN) | ticker tween, final value under `calm` |
| T0 `Surface`, `SurfaceGroup` | `OptimizedGlass`, `LiquidGlassMaterial` | expose §4.4 scalars `[owner: PRD-04]` |

## 8. New components/files

| Path (all NEW) | Purpose |
|---|---|
| `tokens/sys/motion.tokens.json` (**not MOT-created**: DS-026 creates it; MOT supplies values, SC-18) | DTCG motion tokens (§4.2) |
| `src/motion/tokens.generated.ts` (**not MOT-created**: emitted by the DS compiler, DS-053) | generated `motionTokens` (REQ-MOT-06) |
| `src/motion/css/motion.css` | scalars, hover/press, enter/exit, materialize (REQ-MOT-10..18) |
| `src/motion/css/motion-modes.css` | `calm`/`none` and media mirror (REQ-MOT-20..21) |
| `src/motion/css/view-transition.css` | optics drop and VT group timing (REQ-MOT-37) |
| `src/motion/css/loading.css` | `ag-sweep`, gated (REQ-MOT-31..32) |
| `src/motion/viewTransition.ts` | `startMorph`, FLIP fallback (REQ-MOT-36..39) |
| `src/motion/pointerLight.ts` | delegated pointer light (REQ-MOT-40..42) |
| `src/motion/ticker.ts` | shared rAF scheduler (REQ-MOT-33) |
| `src/motion/capability.ts` | `MotionCapability` context type, no implementation (§4.8) |
| `src/motion/adapter/index.ts`, `MotionProvider.tsx`, `toMotionTransition.ts`, `useDragDetents.ts`, `useMomentum.ts`, `SharedLayout.tsx`, `magnetic.ts` | `aura-glass/motion` subpath (REQ-MOT-52..58) |
| `src/components/feedback/Spinner.tsx` (path per PRD-07 layout; component `[owner: PRD-14 T2 core]`) | branded loading primitive; PRD-06 supplies only `loading.css` and the REQ-MOT-31/32 behaviour |
| `scripts/ci/verify-motion-css.mjs` | CSS motion lint (REQ-MOT-67) |
| `tests/motion/**` (specs and `helpers/`) | motion assertions run as the `motion` project of QA's cert config in lane L9 (§5.9); no own Playwright config |
| `tests/perf/browser/motion-frame-time.spec.ts` | REQ-MOT-T18, driven by PERF's `run-perf.mjs` (SC-30) |
| `tests/lint/motion-rules.test.ts` | lint fixtures (REQ-MOT-68) |
| `src/motion/__tests__/*` | unit tests (§12) |
| `packages/cli/src/migrate/4to5/transforms/{reduced-motion-initial,motion-imports,motion-props}.ts`, fixtures `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/{input,output}.*`, tests `packages/cli/src/migrate/4to5/__tests__/` (engine DX-041, catalogue DX-042, ids registered by REL, SC-33) | codemods (§11) |
| `src/stories/motion/*.stories.tsx` (built against SB's Lab harness `.storybook/lab/**`, SB-060, SC-31) | Motion Lab pages (§13) |
| `src/compat/motion/{Motion.tsx,useReducedMotion.ts}` (re-exported by DX-065's `src/compat/index.ts`, SC-34) | compat adapters (§9) |
| `docs/dependency-allowlist.json` (**not MOT-created**: PKG-056) | MOT adds the `motion` row and `["src/motion/adapter/**"]` importer scope by MODIFY (SC-14) |
| `docs/motion.md` | motion language guide generated into the docs site |

## 9. Components/files to remove or deprecate

All removals are C-D in 4.2 (entry in repo-root `deprecations.json` — seeded by TRUST-075, schema `docs/schemas/deprecations.schema.json` from REL-010, entries added by MODIFY; `codemod` is one of the SC-33 ids or null — dev warning via `warnDeprecated(id)`, codemod where listed) and C-B in 5.0, except the 4.1.1/4.2 C-I fixes. Inventory targets that pointed at framer-motion are re-mapped per D-25.

| 4.x item | Inventory disposition | 5.0 replacement | Codemod |
|---|---|---|---|
| `MotionFramer` (`Motion`, `GlassMotion` via primitives) | REDESIGN → "canonical Motion" | **No core `Motion` primitive.** CSS motion in core; `aura-glass/motion` for physics. `compat` exports `Motion` as a pass-through `div` with dev warning (`src/compat/motion/Motion.tsx`) | `motion-imports` |
| `MotionNative` (root `Motion`) | REMOVE | as above | `motion-imports` |
| `ReducedMotionProvider`, `MotionPreferenceProvider`, `MotionPreferenceContext`, `useMotionPreferenceContext` | REMOVE / unlisted | `AuraGlassProvider` + `usePreference('motion')` (PRD-05); `MotionProvider` in `/motion` | `motion-imports` |
| `useReducedMotion` (.ts/.tsx), `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionAwareAnimation`, `prefersReducedMotion()`, `useGlassMotionPolicy` | consolidated | `usePreference('motion')`; `compat/useReducedMotion` wrapper | `motion-imports` |
| `GlassMotionController` (+ `GlassAnimated`, `GlassAnimationSequence`, `GlassAnimationTimeline`, `useMotionController`, `animationPresets`) | CONSOLIDATE → "framer-motion" | deleted; tokens replace presets | `motion-imports` (TODO comment) |
| `GlassTransitions` (+ shadow `GlassModal`/`GlassTabs`/`GlassAccordion`/`SwipeableGlassCards`), `GlassLiquidTransition`, `PageTransitionDemo` | CONSOLIDATE / REMOVE | `SourceTransition`, `startMorph` (internal), View Transitions | `motion-imports` |
| `OrganicAnimationEngine` (+ `GentleAnimation`, `EnergeticAnimation`, `InteractiveAnimation`, `ContemplativeAnimation`, `COMMON_SEQUENCES`) | REMOVE | none | core `removed` (delete import + TODO) |
| `AdvancedAnimations` | CONSOLIDATE → tokens + docs | `docs/motion.md` and Motion Lab | core `removed` (delete import + TODO) |
| `GlassMagneticButton`, `GlassMagneticCursor` | CONSOLIDATE / DEPRECATE | `Button` + `magnetic()` from `/motion` | `motion-props` |
| `RippleButton`, `TouchRippleEffects` | CONSOLIDATE | `Button` press compression (no ripple) | `motion-props` |
| `MotionAwareGlass` family, `GlassDepthLayer` family | DEPRECATE | `Surface` + CSS motion | `motion-props` |
| `GlassPhysicsEngine`, `AuraPhysicsEngine`, Galileo hooks, `useMultiSpring*`, `usePhysicsEngine`, `usePhysicsLayout`, orchestration hooks, `chartAnimations`, `gesturePhysics`, `useMouseMagneticEffect`, `useZSpaceAnimation`, `createAccessibleAnimation` | REMOVE / unlisted | none (0 consumers) | none |
| `ANIMATION`, `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency`, `tokens/keyframes` subpath | consolidated | `--ag-*` tokens / `motionTokens` | `motion-imports` (JS) and core `css-vars` (CSS `--glass-motion-*`) |
| Props: `respectMotionPreference`, `motionPolicy`, `initialMotionPolicy`, `animate`, `animationPreset`, `preset` (motion), `whileHover`/`whileTap` pass-through, `disableAnimation` | n/a | removed; motion follows preferences | `motion-props` deletes them |
| Atmospheric/particle components (`GlassAuroraDisplay`, `GlassNebulaClouds`, `SeasonalParticles`, `AuroraPro`, `GlassParticles`, `GlassParticleField`, `ParticleBackground`) | REMOVE / CONSOLIDATE | `Backdrop` presets (static) in `./backdrops`; animated variants only in `@auraglass/labs` under labs admission criteria | `imports-subpaths` |

---

## 10. API changes

| Change | Release | Class |
|---|---|---|
| Cookie-consent fix (4.1.1, TRUST scope); M-01 `initial`-gating fix across 35 files (4.1.1 via TRUST-041..046, codemod in 4.2); `MotionFramer` synchronous reduced read, Switch shimmer removed (CTL-154), FPS loops removed (4.2, SC-36) | 4.1.1 / 4.2 | C-I (behaviour and accessibility fix; Switch shimmer labelled visual bug fix per D-28) |
| `"always-safe"` no longer overrides the OS (treated as `"auto"` with dev warning) | 4.2 | C-I (accessibility fix, §14.5 B13) |
| `--ag-duration-*`, `--ag-ease-*`, `--ag-spring-*` emitted by `aura-glass/material` experimental entry | 4.2 | C-E |
| `motionTokens` export from `aura-glass/tokens` (§3.2: generated TS constants live in `./tokens`; re-exported from `./theme` for convenience) | 4.2 | C-E |
| `aura-glass/motion` subpath (experimental in 4.2 with `motion@^12` optional peer; content MOT, release scope REL as interim owner of §16 PRD-17, SC-37; stable in 5.0; entry row in PKG-005's manifest) | 4.2 / 5.0 | C-E |
| `pointerLight?: boolean` prop on Button, IconButton, TabBar, Card, Surface | 5.0 | C-E (new prop on new components) |
| `allowContinuous` on `AuraGlassProvider` / `usePreference` | 5.0 | C-E (owned by PRD-05/A11Y; key requested, §21 O-03) |
| `Motion` (root and primitives), `animationPresets`, `GlassMotionController` family, `GlassTransitions` family, `OrganicAnimationEngine` family, `AdvancedAnimations`, `MotionPreferenceProvider`, `ReducedMotionProvider`, all reduced-motion hooks except via `compat`, physics hooks/engines | deprecated 4.2, removed 5.0 | C-D → C-B |
| Props `respectMotionPreference`, `motionPolicy`, `initialMotionPolicy`, motion `preset`/`animationPreset`, `animate`, `disableAnimation`, whileHover/whileTap pass-through | deprecated 4.2, removed 5.0 | C-D → C-B |
| `framer-motion` removed from `peerDependencies`; `motion@^12` optional peer for `/motion` only | 4.2 (both optional) → 5.0 | C-D → C-B |
| `ANIMATION`, `AURA_GLASS.motion`, `LIQUID_GLASS.motionFluency`, `--glass-motion-default`, `--glass-theme-duration-*`, `tokens/keyframes` subpath | deprecated 4.2, removed 5.0 (`compat/tokens.css` aliases `--glass-motion-default` → `--ag-duration-small`) | C-D → C-B |
| Global `*` reduced-motion rules removed; reduced motion becomes `calm` (cross-fades stay) | 5.0 | C-B (behaviour; documented in migration guide) |
| Hover scale and tap scale removed from every component | 5.0 | C-B (visual) |
| `glass-animate-*`, `glass-transition-all` utilities not shipped | 5.0 | C-B (moved to `compat/globals.css` until 6.0) |

Type signatures (5.0):

```ts
// aura-glass/tokens (re-exported from aura-glass/theme)
export declare const motionTokens: {
  duration: Record<'instant' | 'micro' | 'small' | 'medium' | 'large', number>;
  durationExit: Record<'instant' | 'micro' | 'small' | 'medium' | 'large', number>;
  ease: Record<'standard' | 'emphasized' | 'emphasizedDecelerate' | 'accelerate', readonly [number, number, number, number]>;
  spring: Record<'snappy' | 'smooth' | 'fluid', {
    zeta: number; response: number; duration: number; linear: string; stiffness: number; damping: number;
  }>;
};
export type MotionTokenName =
  | `duration-${keyof typeof motionTokens.duration}`
  | `spring-${keyof typeof motionTokens.spring}`;

// shared prop on pointer-light-capable components
interface PointerLightProps { pointerLight?: boolean }
```

## 11. Migration concerns

1. **Silent dependency break.** Consumers using `framer-motion` transitively (through AuraGlass) will break in 5.0. 4.2's `doctor` reports undeclared imports; the `deps` codemod (§14.2) adds `framer-motion` to the consumer's `package.json` when their own source imports it.
2. **Codemods** (`npx @auraglass/cli migrate 4to5 --transform <id>`; ids registered in REL's catalogue §11.2 and schema enum, engine DX-041/042, transforms at `packages/cli/src/migrate/4to5/transforms/<id>.ts`, mapping data only from generated `mappings/*.json` and `<Component>.meta.ts` `migration` fields, SC-33; specified here):
   - `reduced-motion-initial` (also runnable on 4.x consumer code): rewrites `animate={c ? {} : X}` to `initial={c ? false : <original initial>}` + `animate={X}`; fixture covers `prefersReducedMotion`, `reducedMotion`, `!shouldAnimate`, nested ternaries and multiline.
   - `motion-imports`: rewrites imports of removed hooks to `usePreference('motion')` (`useReducedMotion()` → `usePreference('motion') !== 'full'`), removes `ReducedMotionProvider` wrappers (keeps children); `MotionPreferenceProvider` → `AuraGlassProvider` is left to the existing `providers` transform (§14.2) and `motion-imports` skips it, replaces `<Motion preset="fadeIn">` with a plain element and a `// TODO(aura-glass 5): motion is now CSS-driven, see docs/motion.md` comment (SC-33 marker).
   - `motion-props`: deletes `respectMotionPreference`, `motionPolicy`, `initialMotionPolicy`, `animationPreset`, motion `preset`, `disableAnimation`; maps `magnetic` → `/motion` `magnetic()` with a TODO; maps `RippleButton` → `Button`.
   - Token rewrites (part of `motion-imports`; there is no `tokens` transform id): `ANIMATION.DURATION.normal` → `motionTokens.duration.small`; `ANIMATION.EASING.*` bounce/elastic → `motionTokens.ease.standard` with the TODO marker. CSS `--glass-motion-*` vars are handled by the core `css-vars` transform.
3. **Visual change.** Removing hover scale and bounce is a visible pixel change. On `release/4.x` it is not allowed (D-27) except the C-I fixes above with before/after composites. On 5.0 it is part of the documented break.
4. **Reduced-motion users get more motion than before in one respect.** The global nuke removed cross-fades; `calm` keeps opacity cross-fades (≤ `medium`). This is intentional and WCAG 2.3.3-aligned; called out in the migration guide.
5. **Apps that forced motion on** (`"always-safe"`) lose that ability. There is no replacement by design (§14.5 B13).
6. **`layoutId` users** must import from `aura-glass/motion` and install `motion@^12`. `framer-motion` 11 and `motion` 12 can co-exist in one app; `MotionProvider` only configures `motion`.
7. **SSR.** `data-ag-motion` is written pre-paint by `AuraGlassScript` (PRD-05), so no motion flash or hydration mismatch. Apps that skip `AuraGlassScript` still get the `@media (prefers-reduced-motion: reduce)` mirror.
8. **4.3 preview.** Under `[data-ag-preview="v5"]`, the six 4.x glass primitives pick up `motion.css` hover/press rules (scalars only, no prop changes); their framer-motion mounts are unchanged.

## 12. Tests required

Unit and integration tests run in Jest (`npm test`) except where marked Playwright; Playwright suites run remotely only.

| ID | File (NEW unless noted) | Asserts |
|---|---|---|
| REQ-MOT-T01 | `src/motion/__tests__/tokens.test.ts` | §4.2 values; `-exit` ≈ 0.7× rounded to 10 ms; no easing y outside [0,1]; spring ζ ∈ [0.8, 1.0] |
| REQ-MOT-T02 | `src/motion/__tests__/spring-linear.test.ts` | for each spring: max abs error ≤ 0.005 vs analytic step response over 1,000 samples; ≤ 40 stops; monotonic stop positions; first `0`, last `1`; settle duration within ±10 ms of analytic settle; overshoot ≤ 1.5% |
| REQ-MOT-T03 | `src/motion/__tests__/css-output.test.ts` | built `styles.css` has the §4.4 `@property` rules, `@supports not (… linear(0, 1))` fallback, 0 `!important`, 0 `transition: all`, all `@keyframes` prefixed `ag-` |
| REQ-MOT-T04 | `src/motion/__tests__/modes.test.ts` | parses `motion-modes.css`: `calm` and media mirror remove transforms and loops but keep opacity; `none` scoped to `[data-ag-part], [data-ag-surface]` (no `*`) |
| REQ-MOT-T05 | `tests/motion/settle.spec.ts` (Playwright) | REQ-MOT-23 / -72 settled-state invariant per flagship story × engine × {no-preference, reduce} × `data-ag-motion` {full, calm, none} |
| REQ-MOT-T06 | `tests/motion/reduced-motion-visible-4x.spec.ts` (Playwright, `release/4.x`) | for each of the 35 M-01 files' stories (a file with no story gets a minimal story without `forceVisible` in the same PR; the file list is frozen in the spec from the `rg` command in §6 at the 4.2 branch point): under `reduce`, the animated element's opacity is 1 and scale is 1 after 1 s; includes `GlassA11y`, `GlassPresenceIndicator`, `GlassQuantumTunnel` |
| REQ-MOT-T07 | `src/components/cookie-consent/__tests__/visibility.test.tsx` (4.x) | without `forceVisible`, after the show timeout the banner has opacity 1; after dismiss it has `visibility: hidden` and `pointer-events: none` |
| REQ-MOT-T08 | `tests/motion/continuous.spec.ts` (Playwright) | REQ-MOT-30: with `allowContinuous` off, 0 infinite running animations and 0 library rAF callbacks 1 s after settle on every story; with it on, only `ag-sweep` and (on `./backdrops` stories with `motion="drift"`) MED's `ag-backdrop-drift` run; any element carrying `data-ag-offscreen` has 0 running animations |
| REQ-MOT-T09 | `src/motion/__tests__/ticker.test.ts` | single rAF loop for N subscribers; dt capped at 50 ms; stops with 0 subscribers; pauses on `visibilitychange` hidden; skips non-intersecting elements (mocked IO) |
| REQ-MOT-T10 | `src/motion/__tests__/pointerLight.test.ts` | one listener per document across 10 mounts (ref-count); ≤ 1 `setProperty('--_ag-pointer', …)` per frame; no listener when motion ≠ full, transparency ≠ glass, `pointer: coarse` or tier lightweight; properties removed on leave |
| REQ-MOT-T11 | `src/motion/__tests__/viewTransition.test.ts` | `startMorph` uses `document.startViewTransition` when present and FLIP otherwise; morph components render `<ViewTransition>` instead of calling `startMorph` when React exposes it (mocked React module); `update` runs exactly once even when the transition rejects with `AbortError`/`InvalidStateError`; `data-ag-vt` removed after `finished`; `none` runs synchronously |
| REQ-MOT-T12 | `tests/motion/view-transition-optics.spec.ts` (Playwright) | REQ-MOT-75 on Tabs, SegmentedControl, TabBar, SourceTransition per engine |
| REQ-MOT-T13 | `tests/motion/frame-strip.spec.ts` (Playwright) | REQ-MOT-71: ≥ 3 distinct frames on entrance for Button press, Dialog open, Menu open, Popover open, Tabs morph under no-preference; REQ-MOT-74 no transform under reduce; REQ-MOT-112: with `allowContinuous` on, the `ag-sweep` frame strip of `Spinner` and `Skeleton` shows mean relative-luminance change of the subject box < 10% between consecutive frames and ≤ 3 luminance peaks per second |
| REQ-MOT-T14 | `src/motion/adapter/__tests__/adapter.test.tsx` | `toMotionTransition` values (REQ-MOT-53, spring `stiffness`/`damping` equal to `motionTokens`); `MotionProvider` maps `full` → `reducedMotion="never"`, `calm`/`none` → `"always"`; `useDragDetents` velocity projection picks the expected detent for ±1,500 px/s; `magnetic` offset ≤ 8 px |
| REQ-MOT-T15 | `tests/motion/no-peer.spec.ts` (packed-tarball consumer canary) | Vite + React 19 consumer without `motion` installed: Sheet and TabBar render, open, change detent by keyboard; importing `aura-glass/motion` without the peer fails with a clear install message |
| REQ-MOT-T16 | `tests/motion/deps-allowlist.test.ts` | PKG's `scripts/ci/verify-deps.mjs` (PKG-057) with MOT's allowlist rows fails if any non-adapter file imports `framer-motion` or `motion` (fixture file injected) |
| REQ-MOT-T17 | `tests/lint/motion-rules.test.ts` | REQ-MOT-60..67 valid/invalid fixtures |
| REQ-MOT-T18 | `tests/perf/browser/motion-frame-time.spec.ts` (Playwright via `tests/perf/harness/run-perf.mjs`, PERF-039; lane L10; budget rows in `tests/perf/harness/budgets.json`) | §16 budgets on mid-tier mobile and 120 Hz desktop |
| REQ-MOT-T19 | `tests/motion/no-mount-motion.spec.ts` (Playwright, real browser against the static Storybook build; not Jest, because jsdom has no `getAnimations()`) | layout primitives and `Card` at rest produce 0 `getAnimations()` 50 ms after mount (REQ-MOT-15) |
| REQ-MOT-T20 | `src/motion/__tests__/types.test-d.ts` | `@ts-expect-error` on removed motion props and `"always-safe"` (REQ-MOT-24); `MotionTokenName` union |
| REQ-MOT-T21 | `packages/cli/src/migrate/4to5/__tests__/{reduced-motion-initial,motion-imports,motion-props}.test.ts` with fixtures in `packages/cli/src/migrate/4to5/__fixtures__/<id>/<case>/` (SC-33; DX-059 area contract) | codemod fixtures for every pattern listed in §11 item 2; idempotent on second run |

## 13. Storybook requirements

- **REQ-MOT-90** `.storybook/preview.tsx` (owned by SB-048; MOT registers through SB's globals contract and depends on SB-048, SC-31) has two motion toolbar globals: `motion` (`system` default, `full`, `calm`, `none`) writing `data-ag-motion` on the story root, and `allowContinuous` (off by default). `system` follows the OS (§15.4). Forced reduction applies only in the CI static snapshot run, never in the motion lane.
- **REQ-MOT-91** Motion Lab pages (Material Lab section, §15.4; stories `src/stories/motion/*.stories.tsx` written against SB's Lab harness `.storybook/lab/**`, SB-060; scenes are QA's 8 ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame`, SC-28):
  - `Motion/Tokens`: each duration and easing plotted (SVG curve plus a moving dot on a 200 ms-loop *only while the user holds a "Play" button*), each spring's `linear()` curve beside its analytic curve with the error read-out.
  - `Motion/Interactions`: one story per §4.6 row (hover lift, press compression, enter/exit, menu expansion, modal emergence, sheet, toast, liquid morph, depth transition, scroll response, parallax, pointer light, drag, loading) on the 8 environment scenes, with a mode switcher showing `full/calm/none` side by side.
  - `Motion/View Transitions`: Tabs indicator, SegmentedControl thumb, Menu→Sheet, SourceTransition, with an "optics during transition" debug toggle that outlines participants while `--_ag-optics` = 0.
  - `Motion/Physics (aura-glass/motion)`: Sheet detents with velocity read-out, TabBar momentum, `magnetic`, `Shared`/`layoutId`.
- **REQ-MOT-92** Every flagship story has a `play` function that triggers its primary state change (open, press, select) so the motion lane and the Storybook test-runner exercise the same path. Stories must not pass `forceVisible`-style props that bypass entry logic (the M-03 blind spot); a separate "initially hidden" story exists for every component with a visibility timer.
- **REQ-MOT-93** No story uses decorative animated backgrounds; environments are the static scene set.
- **REQ-MOT-94** The docs page for each flagship includes a generated "Motion" table: trigger, properties, tokens, `calm` behaviour, `none` behaviour, from typed component metadata (`motion` field in each `src/**/<Component>.meta.ts`, registry helper `src/foundation/parts.ts` FND-005, SC-27; schema owned here: `{ interactions: Array<{ trigger: string; properties: string[]; token: MotionTokenName; calm: 'opacity' | 'none' | 'same'; }> }`).

## 14. Responsive requirements

- **REQ-MOT-100** Hover light and pointer light apply only under `@media (hover: hover)`; pointer light additionally requires `(pointer: fine)`. On touch, press compression is the only interaction feedback and it is triggered by `:active`/`data-pressed` within 1 frame of `pointerdown`.
- **REQ-MOT-101** At widths < 640 px, `Menu`, `Select` and `Combobox` popups that switch to `Sheet` presentation morph (Menu→Sheet View Transition) when the breakpoint changes while open, and enter as a Sheet (edge translate, `medium`) when opened below the breakpoint.
- **REQ-MOT-102** Sheet travel distance is relative (`translate: 0 100%`), never a pixel constant; on 390×844 a bottom sheet enters within `--ag-duration-medium` and a full-height sheet within `--ag-duration-large`.
- **REQ-MOT-103** Drag thresholds scale with viewport: detent snap projection uses `0.2 s × velocity`, rubber-band factor 0.55, and a dismiss threshold of 25% of sheet height or velocity > 800 px/s.
- **REQ-MOT-104** Parallax and scroll response never move content that holds text more than 24 px and are disabled at widths < 640 px if the measured p95 frame time in REQ-MOT-T18 exceeds the mobile budget.
- **REQ-MOT-105** `transform-origin` for popups uses Base UI's anchor-derived `--transform-origin` at every viewport, so collision-flipped popups grow from the correct side.

## 15. Accessibility requirements

- **REQ-MOT-110** WCAG 2.3.3 (Animation from Interactions, AAA, adopted as floor): under `calm` there is no motion-based (transform, parallax, spring, pointer-tracked) animation triggered by interaction; only opacity and colour change.
- **REQ-MOT-111** WCAG 2.2.2 (Pause, Stop, Hide): no auto-starting motion lasts more than 5 s unless `allowContinuous` is on; with it on, `Spinner`/`Skeleton` loops stop when the content resolves, and `GlassPreferencesPanel` `[owner: PRD-05]` exposes a control to turn `allowContinuous` off.
- **REQ-MOT-112** WCAG 2.3.1: no flashing; specular sweeps change luminance by < 10% of the surface's relative luminance per frame and never more than 3 times per second.
- **REQ-MOT-113** OS floors (D-11): `prefers-reduced-motion: reduce` ⇒ resolved motion ≤ `calm`; no prop, provider setting or global can raise it (REQ-MOT-24). Under `forced-colors: active`, pointer light, specular sweeps and optics fades are disabled (they have no meaning in system colours) and focus indication is never animated away.
- **REQ-MOT-114** Never invisible: content and controls are visible and operable in every mode (REQ-MOT-23). No element is focusable while its computed opacity is < 0.5 or while `visibility: hidden` (the Popup wrapper sets `inert` on the Popup part while `data-ending-style` is present `[owner: PRD-07 wrapping pattern]`; Base UI handles focus return). Test: in the motion lane, `Tab` during a Dialog/Menu exit never lands inside the exiting Popup.
- **REQ-MOT-115** Focus-visible ring appears within one frame (`instant` or 0 ms) and is never delayed by an entrance transition. Focus moves into a Dialog/Popover immediately at open, not after the animation ends.
- **REQ-MOT-116** `AnimatedNumber` and streaming text announce only final values (`aria-live="polite"`, `aria-atomic="true"`), never intermediate tween values.
- **REQ-MOT-117** Reduce-highlights: if PRD-05 ships a `highlights: 'full' | 'reduced'` preference (research `apple-liquid-glass.md`, Reduce Bright Effects), `reduced` disables pointer light, press glow and specular sweeps independently of motion. PRD-06 implements the CSS hook `[data-ag-highlights="reduced"]` regardless, so the preference can land later as C-E.
- **REQ-MOT-118** Manual matrix (§15.2 Manual lane): VoiceOver/Safari macOS and iOS with Reduce Motion on, NVDA/Chrome with Windows "Show animations" off, TalkBack/Chrome with "Remove animations" on — each confirms Button, Dialog, Menu, Sheet, Tabs remain visible and operable.

## 16. Performance requirements (numeric budgets)

| ID | Budget | Measured by |
|---|---|---|
| **REQ-MOT-120** | Core motion CSS (`motion.css` + `motion-modes.css` + `view-transition.css` + `loading.css`) ≤ **3.5 KB** min+gz inside `styles.css` | row in `docs/size-budgets.json` (PKG-048, SC-15), gate `scripts/ci/verify-size-budgets.mjs`, lane L2 Artifact |
| **REQ-MOT-121** | Core motion JS (`viewTransition.ts` + `pointerLight.ts` + `ticker.ts` + `capability.ts`) ≤ **2.0 KB** min+gz, and contributes ≤ 0.5 KB to `{ Button }` (≤ 10 KB total, §3.6) and ≤ 1.0 KB to `{ Dialog }` (≤ 20 KB total) | rows in `docs/size-budgets.json` (PKG-048), `verify-size-budgets.mjs` |
| **REQ-MOT-122** | `aura-glass/motion` own code ≤ **4 KB** min+gz with `motion` external | row in `docs/size-budgets.json`, `verify-size-budgets.mjs` |
| **REQ-MOT-123** | `{ Button }` and `{ Dialog }` import graphs contain **0** bytes of `framer-motion`/`motion` | `verify-size-budgets.mjs` esbuild metafile (lane L2 Artifact) |
| **REQ-MOT-124** | Dialog open and close on mid-tier mobile emulation (4× CPU throttle, 390×844, `standard` tier): p95 frame time ≤ **16.7 ms**, 0 long tasks > 50 ms during the animation, 0 Layout events attributed to the transition. On 120 Hz desktop: p95 ≤ **8.3 ms** | REQ-MOT-T18 |
| **REQ-MOT-125** | Button hover/press sweep (20 buttons in view, `pointerLight` on): p95 frame time ≤ 8.3 ms on 120 Hz desktop; main-thread scripting ≤ **0.5 ms per frame** attributable to pointer light; 0 React commits | REQ-MOT-T10, REQ-MOT-T18 |
| **REQ-MOT-126** | Tabs/SegmentedControl View Transition morph: total main-thread time ≤ **4 ms** for snapshot setup on desktop, ≤ 12 ms on mid-tier mobile | REQ-MOT-T18 |
| **REQ-MOT-127** | Idle: after settle, **0** running animations and **0** rAF callbacks per second from library code with `allowContinuous` off (both preferences) | REQ-MOT-T08 |
| **REQ-MOT-128** | Hidden or offscreen: ticker subscribers receive 0 callbacks while `document.hidden` or non-intersecting | REQ-MOT-T09 |
| **REQ-MOT-129** | `will-change` present on **0** elements in steady state (no animation running), on ≤ **3** elements while an animation runs, and on no element 100 ms after any animation settles | REQ-MOT-17 test in the motion lane |
| **REQ-MOT-130** | Remote baseline regression: the current `glass-modal` story (12 fps, `runtime-remote.md` §5) replaced by `Dialog` reaches ≥ **55 fps** median under the same scripted hover/scroll in the same software-raster harness | remote perf lane comparison run |
| **REQ-MOT-131** | Spring `linear()` strings ≤ 40 stops and ≤ 600 bytes each | REQ-MOT-T02 |

## 17. Acceptance criteria

| ID | Criterion (measurable) |
|---|---|
| AC-MOT-01 | `rg -l "from ['\"](framer-motion\|motion)(/.*)?['\"]" src` returns only files under `src/motion/adapter/`; PKG's `scripts/ci/verify-deps.mjs` fails on an injected violation (REQ-MOT-T16 green) |
| AC-MOT-02 | `package.json` 5.0 has no `framer-motion` key anywhere; `motion` is an optional peer `^12` |
| AC-MOT-03 | Compiled `tokens.css` contains exactly 5 durations, 5 exit durations, `--ag-duration-ambient`, 4 easings, 3 springs (+3 `-duration`), all values per §4.2; REQ-MOT-T01 and REQ-MOT-T02 green (spring error ≤ 0.005) |
| AC-MOT-04 | `duration|easing|spring` counts in DS's `scripts/tokens/gates/literals-baseline.json` (SC-17): 0 in flagship files; totals ≤ the committed baseline and strictly lower than the first-run baseline at every 5.0 pre-release; 0 by 5.0.0-beta.1 |
| AC-MOT-05 | `verify-motion-css.mjs` reports 0 `transition: all`, 0 animated `backdrop-filter`/`filter`, 0 overshoot beziers, 0 `!important`, 0 duplicate `@keyframes` across shipped CSS |
| AC-MOT-06 | Settle check (REQ-MOT-T05) passes for 100% of flagship stories × 3 engines × 2 viewports × {no-preference, reduce} × {full, calm, none}: opacity ≥ 0.99, scale 1, translate 0 |
| AC-MOT-07 | Under `reduce`, 0 running animations and 0 library rAF/interval callbacks in the 2 s after settle on every flagship story (REQ-MOT-73) |
| AC-MOT-08 | Under `no-preference`, ≥ 3 distinct frames on entrance for Button press, Dialog open, Menu open, Popover open, Tabs morph on all three engines (REQ-MOT-T13) |
| AC-MOT-09 | With `allowContinuous` off, 0 infinite running animations on every story in the 5.0 Storybook (REQ-MOT-T08); `rg "repeat: Infinity" src` = 0 outside `src/motion/adapter` |
| AC-MOT-10 | View Transition optics check passes on every engine that supports `startViewTransition`, and the FLIP path passes on the others (REQ-MOT-T12) |
| AC-MOT-11 | Pointer light: 1 listener per document, ≤ 1 `--_ag-pointer` write per frame, 0 React commits during a 2 s sweep; disabled under calm/none, coarse pointer, `tinted`/`solid` transparency and lightweight tier (REQ-MOT-T10) |
| AC-MOT-12 | `{ Button }` ≤ 10 KB and `{ Dialog }` ≤ 20 KB min+gz with 0 bytes of motion runtime; core motion CSS ≤ 3.5 KB; core motion JS ≤ 2.0 KB; `/motion` ≤ 4 KB (REQ-MOT-120..123) |
| AC-MOT-13 | Dialog open/close p95 frame ≤ 16.7 ms on mid-tier mobile and ≤ 8.3 ms at 120 Hz, 0 long tasks > 50 ms during the transition (REQ-MOT-124) |
| AC-MOT-14 | `Dialog` replacement for `glass-modal` reaches ≥ 55 fps median in the remote software-raster harness (REQ-MOT-130) |
| AC-MOT-15 | 4.x: REQ-MOT-T06 passes for all 35 M-01 files and REQ-MOT-T07 passes for the 3 cookie-consent components on `release/4.x` before 4.2.0 is tagged |
| AC-MOT-16 | Type tests (REQ-MOT-T20) prove `respectMotionPreference`, `motionPolicy` and `"always-safe"` do not exist on any 5.0 type |
| AC-MOT-17 | Packed-tarball canary without `motion` installed: Sheet and TabBar work (REQ-MOT-T15) |
| AC-MOT-18 | Every removed motion export and prop in §9/§10 has a `deprecations.json` entry in 4.2 and a passing codemod fixture (REQ-MOT-T21) |
| AC-MOT-19 | Manual matrix (REQ-MOT-118) signed off for Button, Dialog, Menu, Sheet and Tabs on 4 screen-reader/OS combinations with OS motion reduction on |
| AC-MOT-20 | **PRD-06 exit (§16):** lane L9 Motion with the MOT assertions (REQ-MOT-70..78) is green on `Button` and `Dialog`, `motion-report.json` is attached to the CI run for the SHA, and the human motion review (specular response, materialization, no bounce) is approved |

## 18. Definition of done

- All REQ-MOT-01..131 implemented or explicitly re-assigned with a linked change in the owning PRD (`[owner: PRD-xx]` items accepted by that PRD's owner).
- All tests in §12 exist, run in CI, and are green; Playwright suites run on remote runners only.
- Lint rules REQ-MOT-60..67 are `error` on `main` and on `release/4.x` (REQ-MOT-64 only on 4.x).
- Lane L9 Motion (QA, `certify-pr.yml`) fails closed for any PR that touches `src/motion/**`, a flagship's CSS, or `tokens/sys/motion.tokens.json` (affected-subject selection per QA REQ-QA-36).
- `deprecations.json` entries, codemods and the migration guide section "Motion" are published with 4.2; `docs/motion.md` is published with 5.0 beta.
- API reports `etc/api/index.api.md`, `etc/api/theme.api.md`, `etc/api/motion.api.md` (and the matching `.exports.json` snapshots, REL scripts, SC-04) include the §10 surface and nothing else motion-related.
- Size budgets in §16 are rows in `docs/size-budgets.json` (PKG-048) and runtime budgets are rows in `tests/perf/harness/budgets.json` (PERF), both enforced; numbers in README/release notes are rendered from the GA run's `motion-report.json` (D-32), never hand-written.
- No `reports/` files committed; no "100% reduced-motion coverage"-style claim exists anywhere without an artifact source.

## 19. Dependencies

Owner anchor tasks follow SC-40. `depends_on` in `tasks/MOT.json` cites only these task ids, never `PRD-xx` strings; external gates go in the task's `gate` field.

| PRD (key) | What PRD-06 needs | Anchor tasks | Direction |
|---|---|---|---|
| PRD-00 (TRUST) | 4.1.1 scope for REQ-MOT-28 (accepted, SC-36); M-01 site fixes and `motion-no-empty-animate` on `release/4.x`; `deprecations.json` seed | TRUST-041..046, TRUST-045, TRUST-075, TRUST-002 (npm-pack) | upstream |
| PRD-01 + §16 PRD-17 (REL) | deprecations schema and generator, `warnDeprecated`, codemod id catalogue, 4.2/4.3 bridge scope (experimental `/motion`, D-28 visual-fix list), API reports | REL-010, REL-070, REL-072, REL-003, REL-115 | upstream |
| PRD-02 (PKG) | `./motion` manifest row, per-file `"use client"`, lint plugin wiring, dependency allowlist + `verify-deps.mjs`, `docs/size-budgets.json`, CSS assembly map | PKG-005, PKG-015, PKG-056, PKG-057, PKG-075, PKG-048, PKG-097, PKG-099 | upstream |
| PRD-03 (DS) | `tokens/sys/motion.tokens.json`, `tokens/$schema.json`, `motion-spring` transform, generated `motionTokens`, `no-raw-design-values` + literal baseline, `createGlassTheme`, `designConstants.ts` removal | DS-016, DS-014, DS-026, DS-053, DS-071, DS-072, DS-073, DS-083, DS-109 | upstream (hard) |
| PRD-04 (MAT) | pseudo-layer stack reading `--_ag-hover`, `--_ag-press`, `--_ag-optics`, `--_ag-pointer`; `data-ag-animating`; `ScrollEdge`; attribute registry (SC-21) | MAT-015, MAT-047 | upstream contract |
| PRD-05 (A11Y) | `usePreference('motion')`, `allowContinuous` (§21 O-03), `data-ag-motion`/`data-ag-continuous` pre-paint, OS-floor resolution, optional `highlights` | A11Y-027, A11Y-029, A11Y-032, A11Y-049 | upstream (hard) |
| PRD-07/14/16 (FND) | Base UI pin and wrapping pattern, parts/meta registry, layout primitives, `Skeleton`/`Progress`, removal families and consumer-grep gate | FND-001, FND-005, FND-045, FND-046, FND-059, FND-073, FND-103 | parallel |
| PRD-08 (CTL) | `Button` + `Button.css`, `SegmentedControl`, 4.x Switch shimmer removal | CTL-055, CTL-056, CTL-081, CTL-154 | parallel; Button needed for exit |
| PRD-09 (OVL) | `Dialog` + `Dialog.css`, `Sheet` | OVL-040, OVL-046, OVL-097 | parallel; Dialog needed for exit |
| PRD-10 (NAV) | `Tabs` indicator, `TabBar`, `SourceTransition` | NAV-064, NAV-065, NAV-070, NAV-092 | downstream adopters |
| PRD-11/12/13 (DATA, AI, MED) | adopt §4.6 rules; MED drift and CarouselRail autoplay gated by REQ-MOT-31; static `StatCard` | MED-066, MED-133 | downstream |
| PRD-18/20 (DX) | codemod engine/catalogue, compat index, `doctor` framer-motion check, docs site prose | DX-041, DX-042, DX-059, DX-065, DX-035, DX-117 | downstream |
| PRD-19 (QA) | lanes L1/L2/L9/L10, cert Playwright config, `certify-*.yml`, scenes, rAF instrument | QA-018, QA-031, QA-038, QA-076 | upstream for the lane |
| PRD-19 (SB) | `.storybook/preview.tsx` globals contract, Lab harness | SB-048, SB-060 | upstream for Storybook |
| perf policy (PERF) | `run-perf.mjs`, `budgets.json`, PERF-owned lint rules | PERF-039 | upstream for L10 |
| §16 PRD-21 (EXP, interim) | labs admission criteria include REQ-MOT-30/33 equivalents for animated backdrops | none yet | downstream |

## 20. Execution order

1. **4.1.1 (week of 2026-10-12), TRUST scope (SC-36):** REQ-MOT-28 cookie-consent fix (privacy: an invisible but clickable consent banner), accepted. TRUST-041..046 land the M-01 fixes and TRUST-045 lands `auraglass/motion-no-empty-animate`. (C-I)
2. **4.2 prep (`release/4.x`, REL bridge scope):** REQ-MOT-86 FPS loops removed (deferred from 4.1.1); lint rules REQ-MOT-60, -62..-67 in warn mode; REQ-MOT-64 as error; run codemod `reduced-motion-initial` over `src/` (REQ-MOT-27) for any site TRUST did not cover; fix `MotionFramer` mount (REQ-MOT-29); `"always-safe"` → `"auto"` (C-I); Switch shimmer removed by CTL-154 (REQ-MOT-85) with before/after composite; scope the global `*` nukes (REQ-MOT-22). Gate: REQ-MOT-T06, REQ-MOT-T07 green on `release/4.x` in `certify-pr.yml`.
3. **4.2 bridge:** `deprecations.json` entries for every §9 item; `motionTokens` and `--ag-*` motion tokens in experimental `aura-glass/material`; experimental `aura-glass/motion` with `motion@^12` optional peer; `doctor` framer-motion check (DX-035). (C-E / C-D)
4. **5.0 alpha, step A (needs DS):** values in `tokens/sys/motion.tokens.json` (DS-026), schema constraints (DS-014), `motion-spring` transform and `motionTokens` (DS-016/053); REQ-MOT-T01..T03.
5. **Step B (needs MAT, A11Y contracts):** `motion.css`, `motion-modes.css`, scalars, hover/press, enter/exit, materialize; CSS ownership rows (PKG-099); REQ-MOT-T04, T19.
6. **Step C (with CTL-055 Button + OVL-040 Dialog):** apply to `Button` and `Dialog`; add the `motion` project to QA's cert config and REQ-MOT-T05, T08, T13, T18 on these two only; size rows REQ-MOT-120..123. **Exit gate AC-MOT-20.**
7. **Step D:** ticker (anchor MOT-040) with `data-ag-offscreen`, pointer light (REQ-MOT-33, 40..42), View Transitions + optics drop (REQ-MOT-36..39) on Tabs and SegmentedControl; REQ-MOT-T09..T12.
8. **Step E:** `aura-glass/motion` adapter stable (REQ-MOT-52..59) with Sheet detents and TabBar momentum; REQ-MOT-T14, T15.
9. **Step F:** flip lint rules to error; delete §9 items and the cut inventory REQ-MOT-80..88; remove framer-motion from `package.json` (REQ-MOT-51); REQ-MOT-T16, T17.
10. **Step G (beta):** roll the lane across every flagship as CTL/OVL/NAV/DATA/AI/MED deliver; Storybook Motion Lab (§13); codemods + fixtures (REQ-MOT-T21); migration guide.
11. **Step H (RC):** manual matrix (REQ-MOT-118), perf calibration on remote hardware (REQ-MOT-124..130), human motion review; all AC-MOT green; publish `docs/motion.md`.

## 21. Open items

Reconciliation of the MOT entries in `prd/_verification-remaining-concerns.md` against `prd/_shared-contracts.md` (2026-10-06).

Resolved in this revision (no further action):

- Press `scale: 0.985` and Card hover `translate: 0 -1px`: removed (SC-38). REQ-MOT-11/-62, §3, §4.6 and §4.8 now allow no scale or translate on hover or press. Human confirmation is still tracked as O-01.
- Four new codemod ids and the experimental 4.2 `aura-glass/motion`: the three motion ids are registered area ids (SC-33). The `tokens` id is dropped and folded into `motion-imports`. The 4.2 `/motion` content is MOT's and the release scope is REL's (SC-37).
- 4.1.1 cookie-consent and FPS-loop fixes: the cookie-consent fix is accepted into 4.1.1 and the FPS-loop fix is deferred to 4.2 (SC-36). See REQ-MOT-28, REQ-MOT-86 and §20.
- Literal counts carried over from the autopsy: they no longer matter. The baseline is measured on DS's first run of `literals.mjs` (DS-073, SC-17), and REQ-MOT-61 no longer keeps its own baseline.
- MED's requests: `--ag-duration-ambient` added (§4.2, SC-19), `ag-backdrop-drift` admitted by REQ-MOT-31/-66/T08, and the `data-ag-offscreen` observer is owned by the MOT ticker (REQ-MOT-33, SC-21).
- `AnimatedNumber` inside `StatCard`: dropped. `StatCard` is static (SC-38), and `AnimatedNumber` is registry/compat only (REQ-MOT-34).

Open:

| # | Item | Owner | How to close |
|---|---|---|---|
| O-01 | SC-38's rejection of press scale and Card hover still needs human confirmation (registry: "decisions needing human confirmation"). | Architecture owner, with the CTL human visual review (L14) | Record the decision in `docs/release/decisions/`. If it is overturned, only REQ-MOT-11 and REQ-MOT-62 change. |
| O-02 | REQ-MOT-130 (≥ 55 fps median for Dialog in the software-raster harness, against 12 fps for `glass-modal`) depends on MAT capping live backdrop-filters at 3 or fewer. No Dialog with the new material has been measured. | MOT (assertion), PERF (harness), MAT (filter count) | Run MOT-101 at 5.0.0-alpha.1 in L10 and calibrate the threshold in `tests/perf/harness/budgets.json`. |
| O-03 | The `allowContinuous` and `highlights` preference keys are missing from the SC-23 key list. REQ-MOT-30/-111/-117 depend on them, and so do the `GlassPreferencesPanel` switch and the `data-ag-continuous`/`data-ag-highlights` pre-paint writes. | A11Y (SC-23 owner) | Add both keys to SC-23 and to A11Y-027/029/032. Until then MOT-033/035/043 treat a missing attribute as `allowContinuous: false` and `highlights: full`. |
| O-04 | React `<ViewTransition>` availability (the architecture says "19.3") has not been checked against current React releases. The design detects it at runtime, so it works either way. | MOT | At alpha, record the React version that exports it in MOT-049's description. MOT-050 covers both paths. |
| O-05 | The Base UI attributes assumed in §4.6 (`data-pressed` on Button, `data-swipe-*` on Toast, `var(--transform-origin)`) have not been checked against the pinned `@base-ui/react`. | FND (FND-001 pin), CTL/OVL confirm | Grep the pinned package for these attributes when FND-001 lands. If one is missing, update §4.6 and MOT-029. |
| O-06 | Firefox 112 as the `linear()` Baseline floor, and `:active-view-transition` support per engine, have not been re-verified. | MOT | REQ-MOT-T12 (MOT-099) checks support per engine at runtime. Record the engine versions from the QA lane manifest (AC-QA-14). |
| O-07 | Line numbers not marked ✓ (for example `GlassButton.tsx` `:833-840` in §2.4 against `:823-882` in §6) come from the autopsy and were not re-verified. | MOT | Re-verify at the start of each task. Every task that names a line keeps an `rg` precondition. |
| O-08 | DS-026's description lists the §4.2 durations but not `ambient`. | DS | Add `sys.duration.ambient = 40000ms` to DS-026. MOT-020 supplies the value. |
| O-09 | `motion-modes.css` targets `@layer ag.a11y`, and SC-20 assigns that layer's content to A11Y. | PKG (`build/css-ownership.json`), A11Y | Ratify MOT as the author of the motion-mode rules inside `ag.a11y` in PKG-099 (MOT-037 adds the row). |
| O-10 | No fragment has a task that creates the `Spinner` component (only `Skeleton` FND-059 and `Progress` FND-073 exist). | FND (§16 PRD-14 T2 core) | Add an FND task for `src/components/spinner/Spinner.tsx`. MOT-035 then adds it to `depends_on`. |
| O-11 | QA-076 (`certification/lanes/motion.spec.ts`) restates frame-strip and idle assertions that MOT owns. | QA, MOT | QA-076 imports `tests/motion/helpers/frames.ts` (MOT-093) and the MOT specs run as the `motion` project (MOT-092) instead of keeping a second copy. |
| O-12 | PERF-016/018/030/065/066 list `PRD-06:REQ-MOT-*` strings in `depends_on`, which SC-40 makes invalid. | PERF | Map REQ-MOT-17 → MOT-031, REQ-MOT-67 → MOT-073, REQ-MOT-40 → MOT-042 and REQ-MOT-66 → MOT-071. |
| O-13 | TRUST-075 seeds `docs/deprecations.json`, but SC-02 puts the file at the repo root. MOT-089 targets the repo root. | TRUST | Fix the TRUST-075 path (SC-02). |
