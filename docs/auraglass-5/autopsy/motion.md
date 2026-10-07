# AuraGlass 5.0 Autopsy — Motion

Scope: `src/animations`, `src/physics`, `src/components/animations`, motion hooks in `src/hooks`, `src/primitives/motion`, `src/primitives/MotionNative.tsx`, framer-motion usage across `src`, CSS keyframes/tokens, reduced-motion infrastructure, and `reports/REDUCED_MOTION_100_COMPLETE.md` / `reports/reduced-motion-final-report.json`.

Method: static reading plus `rg` counts. Counts exclude `*.stories.*`, `*.test.*`, `__tests__`. No browser was run. Framer Motion behaviour claims were checked against `node_modules/framer-motion@11.18.2` source. The certification PNGs could not be rendered in this session, so no visual claims below rely on them.

## Summary and score

**Score: 3 / 10**

AuraGlass has a lot of motion code and no motion language. There are at least 8 separate sources of motion tokens that disagree with each other, 53 distinct JS duration literals, 25 distinct spring stiffness values, 18 distinct cubic-beziers, and two different components both exported as `Motion`. Most of the "physics" layer (Galileo, AuraPhysicsEngine, orchestration, gesture physics) is not used by any component. One "spring" hook that components do use doesn't animate at all.

Reduced-motion support is the worst problem. The "100% coverage" claim is tautological: the report counts every component as covered because a global CSS `*` rule exists. In a sample of 25 JS-animated components, only 5 (20%) handle reduced motion correctly. Nine of the 25 make content invisible, or leave it at `scale: 0`, for users who have reduced motion on. That comes from a library-wide anti-pattern, `animate={reduced ? {} : {...}}` (85 occurrences in 36 files). 44 components read a motion context that is never provided, so they ignore the OS setting entirely.

There is also no material motion for "Liquid Glass". Nothing models how glass materializes, refracts, morphs or hands off velocity. There are zero `layoutId` shared-element morphs, zero View Transitions, and no interruptible gesture-to-spring handoff. What does exist is generic fade, slide or scale-in on mount (`preset="fadeIn"` 54×), Tailwind `animate-pulse` (78 + 44 `glass-animate-pulse`), hover scale 1.02/1.05, and decorative infinite loops.

## What exists (counts)

| Item | Count / evidence |
|---|---|
| Files importing framer-motion | 83 (78 in `src/components`) |
| Named imports | `motion` 67, `AnimatePresence` 36, `useMotionValue` 7, `useSpring` 6, `useTransform` 4, `useAnimationFrame` 2, `MotionConfig` 1 |
| `MotionConfig reducedMotion` provider | 1 (`src/primitives/motion/ReducedMotionProvider.tsx:29`), used by **0** components or providers |
| `layoutId` shared-element morphs | **0** |
| View Transitions API (`startViewTransition`) | 0 |
| `requestAnimationFrame(` calls | 150 in 78 files (55 component files). Only **1** of the 55 pauses on `visibilitychange`/IntersectionObserver |
| `setInterval(` in components | 60 files |
| `Math.random` in components | 68 files (non-deterministic decorative motion) |
| framer `repeat: Infinity` | 43 in 21 files |
| CSS `infinite` | 102 occurrences in 43 files |
| `@keyframes` | 120 definitions in 31 files, 106 distinct names, 44 of them decorative (float/pulse/shimmer/glow/orbit/aurora/drift…) |
| Duplicate keyframe names | `shimmer` ×4, `glowPulse` ×3, `pulse`, `float`, `glass-shimmer`, `glow-pulse`, `gradientShift`, `rainbow-glow`… ×2 |
| Distinct JS `duration:` literals | **53** (top: 0, 0.3, 300, 400, 200, 0.2, 500, 2, 0.01, 1 — seconds and milliseconds mixed) |
| Distinct CSS transition/animation durations | 40 (0.01ms through 32s) |
| Tailwind `duration-*` | 200 (127), 300 (49), 500, 1000, 100, 400, 150 |
| Distinct `cubic-bezier()` | 18 real values (top: `0.4,0,0.2,1` ×17, `0.2,0,0,1` ×14, `0.2,0.8,0.2,1` ×7) |
| Distinct spring `stiffness` | **25** (100, 300, 200, 400, 170, 150, 120, 50, 280, 210, 180, 80, 500, 350, 95, 90, 85, 70, 40, 330…) |
| Distinct spring `damping` | 22 |
| `type: "spring"` | 32 |
| `whileHover` scale | 1.02 ×26, 1.05 ×21, 1.01 ×5, 1.1 ×3 |
| `whileTap` scale | 0.98 ×24, 0.95 ×19, 0.99 ×4, 0.9 ×2 |
| `transition: all` / `transition-all` / `glass-transition-all` | 53 / 297 / 90 |
| Animated `filter`/blur keyframe arrays | 20 |
| Reduced-motion hooks | `useReducedMotion` ×2 implementations (`src/hooks/useReducedMotion.ts`, `.tsx`), `useEnhancedReducedMotion`, `useMotionPreference`, `useMotionAwareAnimation`, `useMotionPreferenceContext`, `useGlassMotionPolicy`, `useAccessibilitySettings`, `prefersReducedMotion()` (`src/animations/accessibleAnimation.ts:4`), plus inline `matchMedia` in `MotionFramer`, `MotionNative`, `ReducedMotionProvider` |
| Global CSS reduced-motion `*` nukes | 3 (`src/styles/animations.css:6`, `:530`, `src/styles/design-tokens.css:134`) |
| Motion modules in `src/animations` + `src/physics` | ~5.4k LOC |
| `src/components/animations` | ~3k LOC across 4 components |

### Motion token sources (8, mutually inconsistent)

| Source | "normal" duration | standard easing |
|---|---|---|
| `ANIMATION` — `src/tokens/designConstants.ts:13-43` (imported by 164 component files) | 300ms | CSS keywords plus bounce/elastic beziers |
| `AURA_GLASS.motion` — `src/tokens/glass.ts:849-853` → `--glass-motion-default` | 200ms | `ease-out` |
| `LIQUID_GLASS.motionFluency` — `src/tokens/glass.ts:1370-1376` | hover 120 / press 80 / focus 150 | `cubic-bezier(0.25,0.46,0.45,0.94)` |
| Generated persona tokens — `src/tokens/generated.ts:176-195` | 250ms | `cubic-bezier(0.2,0.8,0.2,1)` |
| Theme engine — `src/theme/createGlassTheme.ts:93-118` → `--glass-theme-duration-*` | 220ms | `cubic-bezier(0.2,0.8,0.2,1)` |
| Persona matrix — `src/theme/designMatrix.ts` (`motion:` per persona, e.g. :189, :280) | per persona | per persona |
| Spring presets — `src/animations/physics/springPhysics.ts:1-30` vs `ANIMATION.SPRING` (`designConstants.ts:37-43`) | default `100/10` vs gentle `120/14` | — |
| Motion presets — `src/primitives/motion/presets.ts:6` **and** `src/components/animations/GlassMotionController.tsx:742` (both named `animationPresets`) | 300 / 400 / 600 | `ease-out` / `spring` |

The theme engine's CSS variables `--glass-theme-duration-*` and `--glass-theme-easing-standard` are consumed **0** times outside `src/theme`.

## What is excellent (keep)

- **Concept of a motion policy in the theme engine.** `createGlassTheme.ts:93-118` defines `none | reduced | system | expressive` with an `allowContinuous` flag. That is the right abstraction (it distinguishes reduced from none, and gates ambient motion separately). It is not wired to anything yet, but it should become the single source of truth.
- **`useReducedMotion` (`src/hooks/useReducedMotion.ts`).** It is SSR-safe: it starts `false`, subscribes to `change`, and falls back to `addListener`. Keep one copy.
- **`galileoPhysicsSystem.ts`.** It uses a fixed timestep, substeps, a capped dt (`:122`) and trapezoidal position integration (`:190-194`). This is the only properly engineered integrator. It is unused, but worth keeping as a reference if a custom solver is ever needed.
- **`MotionFramer` sanitisation (`MotionFramer.tsx:73-170`).** It normalises CSS easing strings and `background` keys for Framer. This is useful defensive glue at the adapter boundary.
- **A few components gate continuous loops correctly.** `GlassOrbitalMenu.tsx:96` stops rAF auto-rotate under reduced motion. `GlassMusicVisualizer.tsx:362` gates its render loop. `GlowingCard.tsx:108,150` removes its decorative glow. These are the pattern to standardise on.
- **The emphasized / standard pair `cubic-bezier(0.2,0,0,1)` (14×) and `(0.4,0,0.2,1)` (17×)** is already the most-used easing set. It is a sound base for the 5.0 easing scale.

## What is mediocre

- **Mount fades everywhere.** `preset="fadeIn"` 54×, `slideDown` 18×, `scaleIn` 13× (`rg preset=`). Every card, badge and stack fades in from opacity 0 with a 12–20px offset. This is generic React-lib motion, not material behaviour. Layout primitives (`GlassStack`, `HStack`, `VStack`, `GlassGrid`, `GlassFlex`, `GlassSeparator`) animate at all, which a first-party system would never do.
- **Hover and tap scale with no tokens.** 1.01/1.02/1.05/1.1 and 0.9/0.95/0.98/0.99 are chosen per component. There is no press-depth model, for example highlight or specular shift instead of a scale bump.
- **Seconds and milliseconds mixed.** `duration: 300` and `duration: 0.3` sit side by side. `ANIMATION.DURATION.x / 1000` conversions appear inline (`GlassTransitions.tsx:31,47,71…`, `OrganicAnimationEngine.tsx:113-170`). Arithmetic like `slower * 1.7`, `* 2.7` and `fast / 3` produces arbitrary off-scale values.
- **`transition: all` is the default** (53 inline, 297 `transition-all`, 90 `glass-transition-all`, plus every generated surface in `src/styles/glass.generated.css:504…`). On glass surfaces this transitions `backdrop-filter`, `box-shadow` and `background` together. That is expensive and visually muddy.
- **Spinners and pulses come straight from Tailwind defaults.** There are 63 `animate-spin`, 54 `glass-animate-spin`, 78 `animate-pulse` and 44 `glass-animate-pulse`, and no branded loading or skeleton motion.
- **rAF loops never pause offscreen.** Only 1 of the 55 component files with rAF pauses when hidden or offscreen. `OptimizedGlassContainer.tsx:66-83` and `GlassPerformanceOptimization.tsx:92-95` run an FPS-measuring rAF permanently (a "performance" component that costs a frame callback forever). `useMultiSpringBasic.ts:118` calls `setValues` every frame, which forces a React re-render per frame.

## What is outdated

- **Overshoot "back"/elastic curves as tokens.** `designConstants.ts:30-34` has `bounceIn`, `bounceOut`, `elasticIn` and `elasticOut`. `elasticOut` is literally the same bezier as `bounceIn` (`:30` vs `:33`), so the token is mislabelled. `cubic-bezier(0.68,-0.55,0.265,1.55)` (easeInOutBack, circa 2012) is used 3×. Overshoot on a translucent material reads as a cartoon, not as glass.
- **"Shatter / ripple / morph" page transitions** (`GlassTransitions.tsx:20-190`). These animate rotate ±15°, scale 0→1.2→1, `borderRadius` 50%↔16px and `filter: blur()` keyframe arrays, mixing `blur(var(--glass-blur-md))` with px values that Framer cannot interpolate numerically. This is 2019-era Dribbble motion. Animating `filter: blur` on top of `backdrop-filter` is also a known jank source.
- **Global `* { animation-duration: 0.01ms !important }` as the reduced-motion strategy.** It is duplicated 3× (`animations.css:6-12`, `animations.css:530-536`, `design-tokens.css:134-140`). This is the 2019 "nuke it" snippet. It removes non-vestibular feedback such as opacity crossfades and colour transitions, which WCAG doesn't require you to remove. It also does nothing for Framer Motion, rAF, canvas or WebGL.
- **No modern platform motion.** There is no `linear()` easing for spring-accurate CSS, no View Transitions, essentially no scroll-driven animations (3 files use `useScroll`/`animation-timeline`), no `layoutId`, and WAAPI is used once (`MotionNative`).
- **Ambient decorative loops of 15–32s** (`30s` ×6, `18s` ×3, `32s`, `15s`) plus `Math.random` motion in 68 component files: aurora, nebula, particles, "quantum" fields. This is the stereotypical glassmorphism-demo aesthetic, and is non-deterministic in screenshots.

## Duplication

- **Two different components exported as `Motion`.** `src/index.ts:16` exports `MotionNative as Motion` (WAAPI + custom spring), but `src/primitives/index.ts:91` and `src/primitives/motion/index.ts:5` export `MotionFramer as Motion`. All 94 internal imports (`import { Motion } from "../../primitives"`) get `MotionFramer`. Consumers importing `Motion` from the package root get a different implementation, with different props and different reduced-motion defaults (`MotionNative.tsx:101` starts `false`; `MotionFramer.tsx:235` starts `true`).
- **Two `animationPresets`.** `src/primitives/motion/presets.ts:6` and `src/components/animations/GlassMotionController.tsx:742`. The root index exports the GlassMotionController one (`src/index.ts:364`).
- **Two `useReducedMotion` files** (`src/hooks/useReducedMotion.ts` and `.tsx`, near-identical). Module resolution decides which one wins.
- **Five spring integrators.** `useMultiSpringBasic.ts`, `useMultiSpringPhysics.ts`, `galileoPhysicsSystem.ts`, `src/physics/AuraPhysicsEngine.ts`, `usePhysicsEngine.ts`, plus framer `useSpring` in 6 files. All of them are explicit or semi-implicit Euler with different rest thresholds.
- **Two sequence/orchestration systems.** `useAnimationSequenceBasic.ts` (542 LOC) and `orchestration/useAnimationSequenceOrchestrator.ts` (613 LOC), plus `GlassAnimationSequence`/`GlassAnimationTimeline` and `OrganicAnimationEngine` sequences.
- **Shadow copies of core components inside the animations folder.** `GlassTransitions.tsx:435` `GlassAccordion`, `:552` `GlassModal`, `:634` `GlassTabs`. Their names collide with the canonical `src/components/data-display/GlassAccordion.tsx:114`, `src/components/modal/GlassModal.tsx:169` and `src/components/navigation/GlassTabs.tsx:43`.
- **Three global reduced-motion blocks** with conflicting values (0.001ms vs 0.01ms), plus a "keep essential at 0.3s" block (`design-tokens.css:234-254`) that the universal `!important` rule already overrides.
- **Eight reduced-motion entry points** (listed in "What exists"), each with a different SSR default: `false` (`useReducedMotion.ts:15`), `true` (`useEnhancedReducedMotion.ts:33-36`, `accessibleAnimation.ts:5`, `MotionFramer.tsx:235`), or a context default of `false`.

## Fake complexity

- **`useGalileoStateSpring` is a no-op** (`src/hooks/useGalileoStateSpring.ts:13-24`). It returns `useState(initialValue)`, the setter just calls `setValue` with no animation, and `isAnimating` is hard-coded `false`. Three cookie-consent components rely on it, which causes MOTION-03.
- **`useGalileoSprings` is not a spring** (`src/hooks/extended/useGalileoSprings.ts`). `springTo` applies a single one-frame force (`:221`). The position-sync rAF loop runs once on mount (`:164-190`), stops when bodies are at rest, and is never restarted when forces are applied later. Its rAF is never cancelled. Component usage: 0.
- **Unused physics stack.** No component imports `AuraPhysicsEngine`, `GalileoPhysicsSystem`, `useMultiSpringPhysics`, `usePhysicsEngine`, `usePhysicsLayout`, `useOrchestration`, `useAnimationSequence*`, `useMouseMagneticEffect`, `chartAnimations` (546 LOC), `gesturePhysics` (383 LOC), `useZSpaceAnimation` or `createAccessibleAnimation`. That is roughly 4k LOC of motion "engine" with no consumer.
- **`OrganicAnimationEngine` "emotional context" motion** (`OrganicAnimationEngine.tsx:74-170, 352-560`). Emotions (`calm`, `energetic`, `contemplative`) map to multiplied durations. It computes `prefersReducedMotion` (`:366`) and never reads it. `optimizeForPerformance.reducedMotion` (`:433`) is never consulted either. "Adaptive speed" is user-agent sniffing.
- **`MotionFramer` declares `as`, `type` and `direction` props that do nothing** (`MotionFramer.tsx:39-42`, not destructured or used).
- **`fadeOut` preset is self-contradictory** (`presets.ts:15-21`): initial 1 → animate 0 → exit 1.
- **The "spring" easing in `useMotionAwareAnimation`** (`useMotionPreference.ts:88-91`) returns `{ type: "spring" }` and drops the requested duration.

## Critical findings

### MOTION-01: Reduced-motion users get invisible or zero-scale content (`animate={reduced ? {} : …}` anti-pattern)

Severity: **critical**.

- `rg 'animate=\{\s*(prefersReducedMotion|reducedMotion|!shouldAnimate)\s*\?\s*\{\}'` finds 85 occurrences in 36 files. 57 of them sit directly below an ungated `initial={{ opacity: 0 … }}`.
- Examples:
  - `src/components/accessibility/GlassA11y.tsx:399-401`: the accessibility panel itself.
  - `src/components/social/GlassPresenceIndicator.tsx:207-208, 371-372`.
  - `src/components/advanced/GlassFoldableSupport.tsx:287-288, 357-358`.
  - `src/components/effects/Glass3DEngine.tsx:575-576`.
  - `src/components/quantum/GlassQuantumTunnel.tsx:600-601` (`initial={{ scale: 0 }}`).
  - `src/components/houdini/HoudiniGlassCard.tsx:174-175, 230-231`.
- Mechanism, verified in `node_modules/framer-motion/dist/es/render/utils/animation-state.mjs:254-264` and `render/VisualElement.mjs:434-448`:
  - An element mounted while reduced motion is already on just keeps its `initial` (opacity 0 or scale 0).
  - An element mounted before the hook flips from `false` to `true` has the animate keys removed. Framer then animates them back to the `initial` value as the fallback target.
- Either way, content stays hidden.
- The global CSS nuke cannot help, because these are JS inline styles.
- Not verified in a real browser. The conclusion follows from the library source.

### MOTION-02: 44 components ignore the OS reduced-motion setting by default (unprovided context)

Severity: **critical**.

- `MotionPreferenceContext` defaults to `prefersReducedMotion: false` (`src/contexts/MotionPreferenceContext.tsx:9-13`).
- The `if (!context)` fallback (`:23`) can never trigger, because a default value exists.
- `MotionPreferenceProvider` is never mounted anywhere in `src`: only definition and export, `src/index.ts:908`.
- 44 component files read only this context. Among them:
  - Particles and atmospherics: `GlassParticleField`, `GlassFluidSimulation`, `GlassVortexPortal`, `GlassNebulaClouds`, `GlassAuroraDisplay`, `GlassWeatherGlass` (rAF), `GlassMagneticCursor`.
  - Overlays: `GlassTooltip`, `GlassHoverCard`, `GlassBottomSheet`.
  - Inputs and feedback: `GlassSwitch`, `GlassSlider`, `GlassCheckbox`, `GlassAlert`, `GlassProgress`.
- For all of them, reduced motion only takes effect if the consumer happens to mount an undocumented provider.
- `GlassTooltip.tsx:10` and `GlassSwitch.tsx:13` even import `useReducedMotion` and never call it.

### MOTION-03: Cookie consent banners render invisible but clickable in production use

Severity: **high**.

- `CookieConsent.tsx:96` starts `visible = forceVisible` (default `false`) and later `setVisible(true)` (`:114`).
- `useGalileoStateSpring(visible ? 1 : 0)` (`:160`) captures `0` in `useState` and never updates (`src/hooks/useGalileoStateSpring.ts:14`).
- The result is applied as `opacity: animatedOpacity` (`:185, :205`).
- The banner gets `display` back but stays at `opacity: 0` and `translateY(20px)`. It is still hit-testable, covering page content.
- The same bug is in `GlobalCookieConsent.tsx:109, 285, 302, 366` and `CompactCookieNotice.tsx:103, 154, 171, 200`.
- Stories pass `forceVisible` (`CookieConsent.stories.tsx:80`), so visual certification cannot catch it.

### MOTION-04: "100% reduced-motion coverage" is a tautology

Severity: **high**.

- `reports/REDUCED_MOTION_100_COMPLETE.md` counts "Global CSS | 356" as coverage for every entry.
- It credits 193 components for `data-glass-component` attributes, which do not reduce any motion.
- `reports/reduced-motion-final-report.json` records `totalProcessed: 0`, all results 0, and coverage `"before": "100.0", "after": "100.0"`.
- The global CSS rule cannot affect Framer Motion, rAF, canvas or WebGL, which is where most of this library's motion lives.
- Sample of 25 JS-animated components (every 5th file of 123 files using rAF, `repeat: Infinity`, framer or `infinite`):

| Result | Count | Components |
|---|---|---|
| Correct | 5 | GlassMusicVisualizer, GlassOrbitalMenu, GlowingCard, GlassPerformanceOptimization*, OptimizedGlassContainer* |
| CSS-only (rescued by global nuke) | 2 | GlassTypingIndicator (hook called, unused: `:89` vs `:159`), GlassLoadingSkeleton |
| Content hidden under reduced motion (MOTION-01) | 9 | GlassA11y, GlassFoldableSupport, GlassMetaEngine, GlassSelfHealingSystem, Glass3DEngine, HoudiniGlassCard, GlassFacetSearch, GlassQuantumTunnel, GlassPresenceIndicator |
| Context-only, OS ignored (MOTION-02) | 4 | GlassBiometricAdaptation, GlassWeatherGlass, GlassParticleField, GlassPatternBuilder |
| Hook unused or not called, JS motion ungated | 5 | OrganicAnimationEngine (`:366`), LiquidGlassGPU (`:25` import only; WebGL rAF `:735`), GlassWipeSlider (`:3` import only; rAF `:292`), SpatialComputingEngine (physics rAF `:541-556` ungated), GlassTabBar (prop-only `:118`; momentum/bounce rAF `:730-759`) |

  \* These two keep a permanent FPS-monitor rAF running.

- Real coverage in the sample: 20% correct, 28% acceptable.

### MOTION-05: No single motion source of truth (8 token systems, 53 durations, 25 stiffnesses)

Severity: **high**.

- See the "Motion token sources" table above.
- "Normal" is defined as 300 (`designConstants.ts:18`), 250 (`generated.ts:181`), 220 (`createGlassTheme.ts:114`) and 200 ms (`glass.ts:850`).
- The default spring is 100/10 (`springPhysics.ts:2-6`, underdamped, ζ≈0.5, visibly bouncy) in one place and 120/14 (`designConstants.ts:38`) in another.
- The theme engine's motion policy CSS variables have zero consumers.
- Without one source, a coherent hierarchy (micro → component → surface → page) is impossible.

### MOTION-06: `Motion` export split-brain and dead mount animation in `MotionFramer`

Severity: **high**.

- The root `Motion` is `MotionNative` (`src/index.ts:16`), while the internal `Motion` is `MotionFramer` (`src/primitives/index.ts:91`).
- `MotionFramer` initialises `reduced = true` (`:235`), so the first render has `initial: undefined` and `animate: undefined` (`:277-282`).
- After the effect flips `reduced` to `false`, `initial` is set post-mount, but Framer applies `initial` only on mount. The element is already at its final values, so the `fadeIn`/`slide*`/`scaleIn` presets play nothing on initial page mount. They only work on later remounts.
- Inferred from code and Framer semantics. Not verified in a browser.

### MOTION-07: Fake and unused physics engines

Severity: **medium**.

- `useGalileoStateSpring.ts:13-24` is a no-op.
- `useGalileoSprings.ts:164-190, 221` is a one-frame force with a dead update loop.
- `useMultiSpringBasic.ts:73` has an uncapped dt with explicit Euler, which goes unstable on long frames. `:118` calls `setState` per frame.
- About 4k LOC under `src/animations` and `src/physics` have zero component consumers (counted with `rg -l` per symbol across `src/components` and `src/primitives`).

### MOTION-08: Unbounded decorative and continuous motion

Severity: **medium**.

- framer `repeat: Infinity` appears 43× in 21 files and CSS `infinite` 102× in 43 files.
- 54 of 55 rAF component files never pause offscreen.
- 68 component files use `Math.random` motion.
- The theme's `allowContinuous` flag (`createGlassTheme.ts:101, 109, 116`) is never read by components.

### MOTION-09: Mislabelled and contradictory presets/tokens

Severity: **low**.

- `elasticOut === bounceIn` (`designConstants.ts:30, 33`).
- `fadeOut` goes initial 1 → animate 0 → exit 1 (`presets.ts:15-21`).
- `MotionFramer` declares `as`, `type` and `direction` props that are ignored (`MotionFramer.tsx:39-42`).
- `useEnhancedReducedMotion` defaults to `true` on the server and to the real value on the client, which risks a hydration mismatch (`useEnhancedReducedMotion.ts:33-36`). This contradicts `useReducedMotion`, which defaults to `false`.

### MOTION-10: Shadow `GlassAccordion` / `GlassModal` / `GlassTabs` inside `GlassTransitions`

Severity: **low**.

- `GlassTransitions.tsx:435, 552, 634` duplicate the canonical components under the same names, with different motion (ripple/morph modal).
- Anyone importing from the file path gets an unrelated implementation.

## Recommendations for AuraGlass 5.0

1. **One motion token module.** Example: `src/motion/tokens.ts`, emitted to CSS vars and to a Framer adapter. Delete the other seven sources.
   - Durations: `instant 0`, `micro 90`, `short 160`, `medium 240`, `long 360`, `page 480`. Milliseconds only; convert at the adapter.
   - Easing: `standard (0.2,0,0,1)`, `decelerate (0,0,0,1)`, `accelerate (0.3,0,1,1)`, `emphasized (0.2,0,0,1)` with a long-tail `linear()` spring approximation. No overshoot beziers.
   - Springs, defined as damping ratio plus response (Apple-style): `snappy (ζ 1.0, 0.25s)`, `smooth (ζ 1.0, 0.4s)`, `gel (ζ 0.82, 0.5s)` for glass morphs. Map them to framer `{ bounce, visualDuration }`. Ban raw `stiffness`/`damping` literals with lint (`no-restricted-syntax` on `stiffness:` / `duration:` numeric literals outside `src/motion`).
2. **A motion hierarchy contract.** Every component declares a tier:
   - micro (press/hover/focus): opacity, highlight and specular only, ≤160ms, never layout.
   - component (open/close, select): transform + opacity, spring `snappy`.
   - surface (sheet, popover, dialog materialization): glass-specific (see 3).
   - page/route: View Transitions with fallback.
   - Ambient continuous motion is opt-in only and gated by `allowContinuous`.
   - Layout primitives (Stack/Grid/Flex/Separator) get **no** motion.
3. **Define Liquid Glass material motion** as the brand signature:
   - Materialization: blur radius, refraction strength and specular intensity ramp from 0 while scale goes 0.96→1 from the trigger origin (`transform-origin` from the anchor rect).
   - Morphing: `layoutId` shared-element transitions between a trigger and its expanded surface (button → popover, tab pill → indicator, chip → sheet). Currently 0 exist.
   - Gesture: drag and pan with velocity handoff into `gel` springs, rubber-banding at edges, fully interruptible.
   - Press: depth via highlight/shadow change rather than `scale(0.95)`.
   - Never animate `backdrop-filter` and `filter: blur` together per frame. Animate a pre-blurred layer's opacity or the CSS var on a compositor-friendly path.
4. **Replace reduced-motion infrastructure with one pipeline.**
   - `useMotionPolicy()` reads the theme policy, falling back to `matchMedia`. It defaults to the system setting **without** a provider, and returns `{ policy, allowContinuous, transition(token) }`.
   - Mount `<MotionConfig reducedMotion="user">` inside the root theme provider.
   - Codemod all 85 `animate={reduced ? {} : …}` sites to `initial={reduced ? false : …}` with an unconditional `animate`, or to variant-based APIs.
   - In reduced mode, swap transforms for short opacity crossfades instead of zeroing everything.
   - Delete the 3 global `*` nukes, `useEnhancedReducedMotion`, the duplicate `useReducedMotion.tsx`, `prefersReducedMotion()`, the unprovided `MotionPreferenceContext`, and the inline `matchMedia` copies.
5. **Replace the coverage report with a real test.**
   - A Storybook play test, or a jsdom test with `matchMedia` mocked to reduce, that asserts the final computed opacity is 1 and transform is none for every story.
   - A static rule that fails on `animate={… ? {} :`.
   - A rule that fails any rAF or `repeat: Infinity` that doesn't go through `useMotionPolicy().allowContinuous`.
6. **One `Motion` primitive.** Keep a thin Framer adapter (the `MotionFramer` sanitiser is fine), fix the mount bug by initialising from the policy synchronously or using `MotionConfig`, and remove `MotionNative` or rename it. Remove the props that are declared but do nothing.
7. **Delete fake and unused engines:** `useGalileoStateSpring`, `useGalileoSprings`, `AuraPhysicsEngine`, `useMultiSpring*`, `usePhysicsEngine`/`usePhysicsLayout`, both sequence orchestrators, `chartAnimations`, `gesturePhysics`, `OrganicAnimationEngine` and the "shatter/ripple/morph" variants. Use Framer `useSpring` and `animate()`. Fix the cookie-consent banners by driving opacity from `visible` through `AnimatePresence`.
8. **rAF hygiene.** Use a shared ticker (Framer `frame` or a single scheduler) that pauses on `document.hidden` and when an IntersectionObserver reports offscreen, caps dt, and writes to the DOM or MotionValues instead of React state. Remove the permanent FPS-monitor loops.
9. **Retire generic decoration.** Remove Tailwind `animate-pulse`/`animate-bounce` and the 44 decorative keyframes. Make one branded loading motion (a specular sweep across glass) and one skeleton shimmer, token-driven, that respect `allowContinuous`. Replace `transition: all` with explicit property lists (`opacity, transform, background-color, border-color, box-shadow`).

## Verification (adversarial)

Each finding was re-checked against source using scoped `rg`/`sed`. No browser was run, so runtime claims rest on code plus Framer Motion semantics.

| id | verdict | note |
|---|---|---|
| MOTION-01 | CONFIRMED | I counted 84 occurrences of `animate={...reduced... ? {} : ...}` in 35 non-story files, against the claimed 85 in 36. A multiline regex finds 71 where the line directly above is `initial={{ opacity: 0 ...}}`. GlassA11y.tsx:398-401 and GlassPresenceIndicator.tsx:207-208 match exactly as cited. With `animate={}`, Framer keeps the `initial` values, and nothing else (no CSS rule, no MotionConfig) overrides the inline opacity:0. |
| MOTION-02 | CONFIRMED | The context default is `prefersReducedMotion:false` (MotionPreferenceContext.tsx:9-13). The `!context` branch at :23 is dead because a default value always exists. Outside contexts/, stories and index.ts, the only `MotionPreferenceProvider` use is its own story file. `.storybook/preview` does not mount it either. 49 component files import the hook, and only 3 also *call* another reduced-motion source (AtmosphericBackground, ParticleBackground, GlassEyeTracking), leaving about 46 context-only files, near the claimed 44. GlassTooltip.tsx:10 imports `useReducedMotion` but never calls it, and line 73 reads only the context. |
| MOTION-03 | CONFIRMED | `useGalileoStateSpring` is `useState(initialValue)` with no sync to later arguments (useGalileoStateSpring.ts:14). In CookieConsent.tsx, `visible` starts as `forceVisible` (false) at :96, the hook captures 0 at :160, and the timeout then sets visible=true at :114. The banner then renders with an inline `opacity: 0` (:185, :205) and is not `display:none`, so it stays clickable. All three stories pass `forceVisible`: CookieConsent.stories:80, GlobalCookieConsent.stories:103 and CompactCookieNotice.stories:79. |
| MOTION-04 | CONFIRMED | reduced-motion-final-report.json:3 has `totalProcessed: 0`, and :16-17 have before/after of "100.0". REDUCED_MOTION_100_COMPLETE.md:126 counts "Global CSS \| 356". OrganicAnimationEngine.tsx:366 assigns `prefersReducedMotion` and never reads it again. GlassWipeSlider.tsx:3 and LiquidGlassGPU.tsx:25 import `useReducedMotion` but never reference "reduced" anywhere else in the file. I did not re-derive the 25-component sample breakdown. |
| MOTION-05 | CONFIRMED | `normal` is 300 in designConstants.ts:18 and 250ms in generated.ts:180. glass.ts:850 uses `defaultMs: 200`, and motionFluency at glass.ts:1370-1376 uses yet another scale. The theme emits `--glass-theme-duration-*` and `--glass-theme-easing-standard` (createGlassTheme.ts:223-225), and nothing in src outside that file reads them. `useGlassMotionPolicy` has no component consumers. I did not recount the 53/25/22/18 literal counts. |
| MOTION-06 | CONFIRMED (count low) | The root exports `MotionNative as Motion` (src/index.ts:16) and the primitives barrel exports `MotionFramer as Motion` (src/primitives/index.ts:91). I count 121 src files importing `Motion` from a primitives path, not 94, so the finding understates the reach. MotionFramer sets `useState(true)` at :235, and `initial` is undefined while reduced (:277-282). Framer only reads `initial` on first render, so mount presets most likely animate from the default (visible) values, meaning no visible entrance. This is still inferred, not observed in a browser. |
| MOTION-07 | CONFIRMED | In useGalileoSprings.ts:164-190 the rAF loop runs once in an effect keyed only on `precision`. It stops when no body is moving, and `applyForce(..., 1/60)` at :221 never restarts it, so the targets never animate. useMultiSpringBasic.ts:73 computes dt with no cap, and :118 calls `setValues` every frame. `rg` in src/components finds 0 consumers each for AuraPhysicsEngine, useAnimationSequenceOrchestrator, chartAnimations, gesturePhysics and useGalileoSprings, and 1 for useMultiSpringBasic. |
| MOTION-08 | CONFIRMED | There are 43 `repeat: Infinity` in non-story/test src, matching the claim. I count 95 CSS/TS `infinite` hits against the claimed 102; the gap is probably glob scope. 55 component files use rAF, and none of them references IntersectionObserver, `visibilitychange` or `document.hidden`. That is 0 of 55, slightly worse than the claimed 54 of 55. OptimizedGlassContainer.tsx:64-84 runs a permanent FPS loop that calls setState. `allowContinuous` is read only in theme-engine.test.tsx:51. |
| MOTION-09 | CONFIRMED | `elasticOut` (designConstants.ts:33) is byte-identical to `bounceIn` (:30). The fadeOut preset is initial 1, animate 0, exit 1 (presets.ts:15-21). `as`, `type` and `direction` are declared at MotionFramer.tsx:39-42 but not destructured (:217-228), so they fall into `...props` and do nothing. useEnhancedReducedMotion.ts:33-36 uses a lazy initializer that returns `true` on the server and the real query result on the client, which is a hydration-mismatch risk. |
| MOTION-10 | CONFIRMED (low impact) | GlassTransitions.tsx:435, :552 and :634 export function components named GlassAccordion, GlassModal and GlassTabs. The canonical versions are at the cited lines. The package root re-exports only `GlassTransitions` (src/index.ts:627), not these names, so the collision only hits deep or internal imports. |

Net: none of the ten findings is refuted. Count corrections: MOTION-06 has more internal Motion importers than stated (121 vs 94), MOTION-08 has 0 of 55 rAF files pausing offscreen (not 54 of 55), and MOTION-01 and MOTION-02 are within a few files of the stated counts.
