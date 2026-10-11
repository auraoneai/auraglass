# aura-glass 4.2.0 release notes

## Moved dependencies (install them yourself)

These packages were `dependencies` in v4.1.0 and are now
`peerDependencies`; npm no longer installs them for you. Install the ones
whose feature you use. Without the package, the feature throws at call
time; importing `aura-glass` itself does not.

| Package | Range in v4.1.0 | Peer range | Optional | Deprecation |
| --- | --- | --- | --- | --- |
| `@google-cloud/vision` | `^5.3.4` | `^5.3.4` | yes | `DEP-P0035` (removed in 5.0.0) |
| `@pinecone-database/pinecone` | `^7.2.0` | `^7.2.0` | yes | `DEP-P0034` (removed in 5.0.0) |
| `@sentry/node` | `^10.56.0` | `^10.56.0` | yes | `DEP-P0036` (removed in 5.0.0) |
| `bcryptjs` | `^3.0.3` | `^3.0.3` | yes | `DEP-P0031` (removed in 5.0.0) |
| `chart.js` | `^4.5.0` | `^4.5.0` | yes | `DEP-P0037` (removed in 5.0.0) |
| `compression` | `^1.8.1` | `^1.8.1` | yes | `DEP-P0025` (removed in 5.0.0) |
| `cors` | `^2.8.6` | `^2.8.6` | yes | `DEP-P0024` (removed in 5.0.0) |
| `date-fns` | `^4.1.0` | `^4.1.0` | yes | `DEP-P0039` (removed in 5.0.0) |
| `dotenv` | `^17.4.2` | `^17.4.2` | yes | `DEP-P0032` (removed in 5.0.0) |
| `express` | `^5.2.1` | `^5.2.1` | yes | `DEP-P0021` (removed in 5.0.0) |
| `express-rate-limit` | `^8.5.2` | `^8.5.2` | yes | `DEP-P0022` (removed in 5.0.0) |
| `framer-motion` | `^11.18.2` | `^11.18.2` | yes | `DEP-P0041` (removed in 5.0.0) |
| `helmet` | `^8.2.0` | `^8.2.0` | yes | `DEP-P0023` (removed in 5.0.0) |
| `ioredis` | `^5.11.1` | `^5.11.1` | yes | `DEP-P0028` (removed in 5.0.0) |
| `jsonwebtoken` | `^9.0.3` | `^9.0.3` | yes | `DEP-P0030` (removed in 5.0.0) |
| `openai` | `^6.10.0` | `^6.10.0` | yes | `DEP-P0033` (removed in 5.0.0) |
| `react-chartjs-2` | `^5.3.0` | `^5.3.0` | yes | `DEP-P0038` (removed in 5.0.0) |
| `react-hook-form` | `^7.54.0` | `^7.0.0` | yes | `DEP-P0072` (removed in 5.0.0) |
| `redis` | `^5.10.0` | `^5.10.0` | yes | `DEP-P0029` (removed in 5.0.0) |
| `socket.io` | `^4.8.3` | `^4.8.3` | yes | `DEP-P0026` (removed in 5.0.0) |
| `socket.io-client` | `^4.8.3` | `^4.8.3` | yes | `DEP-P0027` (removed in 5.0.0) |
| `zod` | `^3.22.0` | `^3.22.0` | yes | `DEP-P0040` (removed in 5.0.0) |

## Changelog

From `CHANGELOG.md` `[4.2.0] - Unreleased`.

Minor release on `release/4.x`. Runtime dependencies become optional peers, `/forms` and `/data` become real bundle entries, and the 5.0 removals start warning in development.

### Moved dependencies

- 22 packages moved from `dependencies` to optional `peerDependencies`: `@google-cloud/vision`, `@pinecone-database/pinecone`, `@sentry/node`, `bcryptjs`, `chart.js`, `compression`, `cors`, `date-fns`, `dotenv`, `express`, `express-rate-limit`, `framer-motion`, `helmet`, `ioredis`, `jsonwebtoken`, `openai`, `react-chartjs-2`, `react-hook-form`, `redis`, `socket.io`, `socket.io-client`, `zod`. npm no longer installs them; install the ones whose feature you use. A feature whose peer is missing throws `[aura-glass] <name> is now an optional peer; install it: npm i <name>` when it is called. Importing `aura-glass` does not throw (REQ-PLAT-56). `RELEASE_NOTES_4.2.0.md` has the ranges and the DEP id of each package. `clsx` and `tailwind-merge` remain dependencies.
- `react-hook-form` has one role only (optional peer, `^7.0.0`); it was both a dependency and a peer in 4.1.x.
- `GlassForm` and the Chart.js components no longer touch their peer at module load: `FormProvider` is wrapped in a component, and Chart.js registration runs once on first render.

### Removed

- `useGalileoStateSpring` and its alias `useAuraStateSpring` are no longer exported from the root entry (PLAT-104). Their deprecation entry, `DEP-M0864`, gives `removeIn: 5.0.0`.

### Deprecated

- `warnDeprecated` emits a development-only warning once per DEP id. `AuraGlassProvider` takes `deprecations: "warn" | "silent"` to turn the warnings off. The five older providers are wrapped and warn with `DEP-P0050`.
- New DEP entries with `since: 4.2.0` for platform exports, subpaths, providers and the 28 `recipe:<id>` CLI rows (`DEP-P0042`–`DEP-P0059`, `DEP-P0073`–`DEP-P0106`), component names (`DEP-C*`), material and motion exports (`DEP-M*`) and surface exports (`DEP-S*`). The full list, generated from `fragments/deprecations/*.ts`, is in `RELEASE_NOTES_4.2.0.md`. Services, `useGlassProbes`, the alias barrels and `interactiveGlass` call `warnDeprecated`.

### Added

- `aura-glass/forms` and `aura-glass/data` are real bundle entries with their own `dist/forms` and `dist/data` output. In 4.1.x they were type-only aliases into the root bundle (REQ-PLAT-57).
- `./deprecations.json` export, generated at `prepack` from the deprecation fragments.
- `AuraGlassProvider` `preview?: "v5"` renders `data-ag-preview` for the 5.0 material preview (PLAT-156).

### Fixed

- D-28 visual fixes (records in `docs/release/visual-fixes/`): `--glass-opacity-24/32/52/72` are defined, so `rgba(var(...) / var(--glass-opacity-NN))` resolves; `prefers-contrast: more` is honoured next to `:high`; the dark `--glass-on-surface` token is light enough to read on dark surfaces; `GlassSwitch` no longer applies the lift and press classes to the control (REQ-PLAT-59).
- `GlassWorkspaceTabs` no longer passes `value`/`onValueChange` to the DOM; `GlassWorkspaceTab` fires `onValueChange` on click.
- `useGlassPerformance`, `usePerformance`, `useEnhancedPerformance` and `PerformanceMonitor` no longer run a permanent `requestAnimationFrame` FPS loop. FPS is sampled on demand (`sampleFPS(windowMs)`), and an unmeasured FPS is not treated as low performance.

### Internal (no change to the published package)

- Gzip budget ratchet per entry (`build/budgets-4x.json`) and a side-effect report; breaking-register coverage and tag gates; `consumer-4x` Next 15 and Vite fixtures; React 19 CI legs; the FIN-B GitLab CI port to `release/4.x`.

## Deprecations added

The 22 dependency entries are in the table above.

- `DEP-C0200` (prop . GlassButton.predictive, removed in 5.0.0): 'GlassButton' prop 'predictive' has no 5.0 equivalent and is removed.
- `DEP-C0201` (prop . GlassButton.eyeTracking, removed in 5.0.0): 'GlassButton' prop 'eyeTracking' has no 5.0 equivalent and is removed.
- `DEP-C0202` (prop . GlassButton.adaptive, removed in 5.0.0): 'GlassButton' prop 'adaptive' has no 5.0 equivalent and is removed.
- `DEP-C0203` (prop . GlassButton.spatialAudio, removed in 5.0.0): 'GlassButton' prop 'spatialAudio' has no 5.0 equivalent and is removed.
- `DEP-C0204` (prop . GlassButton.trackAchievements, removed in 5.0.0): 'GlassButton' prop 'trackAchievements' has no 5.0 equivalent and is removed.
- `DEP-C0205` (prop . GlassButton.usageContext, removed in 5.0.0): 'GlassButton' prop 'usageContext' has no 5.0 equivalent and is removed.
- `DEP-C0206` (prop . GlassButton.glassVariant, removed in 5.0.0): 'GlassButton' prop 'glassVariant' has no 5.0 equivalent and is removed.
- `DEP-C0207` (prop . GlassButton.materialProps, removed in 5.0.0): 'GlassButton' prop 'materialProps' has no 5.0 equivalent and is removed.
- `DEP-C0209` (prop . GlassSelect.options, removed in 5.0.0): GlassSelect 'options' maps to Select 'items' in 5.0.
- `DEP-C0210` (prop . GlassModal.backdropBlur, removed in 5.0.0): 'GlassModal' prop 'backdropBlur' has no 5.0 equivalent and is removed.
- `DEP-C0211` (prop . GlassModal.material, removed in 5.0.0): 'GlassModal' prop 'material' has no 5.0 equivalent and is removed.
- `DEP-C0212` (prop . GlassModal.materialProps, removed in 5.0.0): 'GlassModal' prop 'materialProps' has no 5.0 equivalent and is removed.
- `DEP-C0213` (prop . GlassModal.consciousness, removed in 5.0.0): 'GlassModal' prop 'consciousness' has no 5.0 equivalent and is removed.
- `DEP-C0214` (prop . GlassModal.predictive, removed in 5.0.0): 'GlassModal' prop 'predictive' has no 5.0 equivalent and is removed.
- `DEP-C0215` (prop . GlassModal.adaptive, removed in 5.0.0): 'GlassModal' prop 'adaptive' has no 5.0 equivalent and is removed.
- `DEP-C0216` (prop . GlassModal.eyeTracking, removed in 5.0.0): 'GlassModal' prop 'eyeTracking' has no 5.0 equivalent and is removed.
- `DEP-C0217` (prop . GlassModal.trackAchievements, removed in 5.0.0): 'GlassModal' prop 'trackAchievements' has no 5.0 equivalent and is removed.
- `DEP-C0218` (prop . GlassModal.animation, removed in 5.0.0): 'GlassModal' prop 'animation' has no 5.0 equivalent and is removed.
- `DEP-C0219` (prop . GlassModal.compact, removed in 5.0.0): 'GlassModal' prop 'compact' has no 5.0 equivalent and is removed.
- `DEP-C0220` (prop . GlassModal.isContained, removed in 5.0.0): GlassModal 'isContained' has no direct 5.0 prop; compose with Surface and set data-ag-transparency.
- `DEP-M0800` (subpath ./tokens/keyframes *, removed in 5.0.0): aura-glass/tokens/keyframes is removed in 5.0; import aura-glass/tokens.css — the motion keyframes are emitted inside it.
- `DEP-M0801` (asset ./tokens/tailwind dist/tokens/tailwind.theme.mjs, removed in 5.0.0): the Tailwind v3 preset module (dist/tokens/tailwind.theme.mjs) is removed in 5.0; consume aura-glass/tokens.css instead.
- `DEP-M0802` (asset ./tokens dist/tokens/unocss.preset.ts, removed in 5.0.0): the UnoCSS preset module (dist/tokens/unocss.preset.ts) is removed in 5.0; consume aura-glass/tokens.css instead.
- `DEP-M0803` (export ./tokens getPersona, removed in 5.0.0): getPersona is removed in 5.0; persona lookup is replaced by the presets table on aura-glass/theme.
- `DEP-M0804` (export ./tokens getPersonaModeTokens, removed in 5.0.0): getPersonaModeTokens is removed in 5.0; derive themed tokens from createBrandTheme/presets on aura-glass/theme.
- `DEP-M0805` (export . OptimizedGlass, removed in 5.0.0): OptimizedGlass is deprecated; use Surface (codemod: canonical-names). Dead optical props are stripped by dead-optical-props.
- `DEP-M0806` (export . OptimizedGlassCore, removed in 5.0.0): OptimizedGlassCore is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0807` (export . GlassAdvanced, removed in 5.0.0): GlassAdvanced is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0808` (export . OptimizedGlassAdvanced, removed in 5.0.0): OptimizedGlassAdvanced is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0809` (export . LiquidGlassMaterial, removed in 5.0.0): LiquidGlassMaterial is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0810` (export ./primitives GlassCore, removed in 5.0.0): GlassCore is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0811` (export ./primitives GlassPrimitive, removed in 5.0.0): GlassPrimitive is deprecated; use Surface (codemod: canonical-names).
- `DEP-M0812` (export ./primitives LiquidGlassEffectGroup, removed in 5.0.0): LiquidGlassEffectGroup is deprecated; use SurfaceGroup (codemod: canonical-names).
- `DEP-M0813` (export ./primitives LiquidGlassScrollEdge, removed in 5.0.0): LiquidGlassScrollEdge is deprecated; use ScrollEdge (codemod: canonical-names).
- `DEP-M0814` (export ./primitives LiquidGlassConcentricFrame, removed in 5.0.0): LiquidGlassConcentricFrame is deprecated; use ConcentricFrame (codemod: canonical-names).
- `DEP-M0815` (export ./primitives LiquidGlassLayerProvider, removed in 5.0.0): LiquidGlassLayerProvider is deprecated; counts nested layers in dev and needs no provider (codemod: providers).
- `DEP-M0816` (export ./primitives LiquidGlassSurfaceLayer, removed in 5.0.0): LiquidGlassSurfaceLayer is deprecated; layer is inferred from nesting in 5.x (codemod: providers).
- `DEP-M0817` (export ./primitives useLiquidGlassLayer, removed in 5.0.0): useLiquidGlassLayer is deprecated; layer is inferred from nesting in 5.x (codemod: providers).
- `DEP-M0818` (export ./primitives LiquidGlassBackdropSampler, removed in 5.0.0): LiquidGlassBackdropSampler is removed in 5.0; declare the backdrop with data-ag-backdrop or Environment (codemod: removed).
- `DEP-M0819` (export . useLiquidGlassBackdrop, removed in 5.0.0): useLiquidGlassBackdrop is removed in 5.0; declare the backdrop with data-ag-backdrop or Environment (codemod: removed).
- `DEP-M0820` (export ./hooks/useGlassProbes useGlassProbes, removed in 5.0.0): useGlassProbes is removed in 5.0; declare the backdrop with data-ag-backdrop or Environment (codemod: removed).
- `DEP-M0821` (subpath ./hooks/useGlassProbes *, removed in 5.0.0): aura-glass/hooks/useGlassProbes is removed in 5.0; declare the backdrop with data-ag-backdrop or Environment (codemod: removed).
- `DEP-M0822` (export . createGlassStyle, removed in 5.0.0): createGlassStyle is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0823` (export . createGlassHoverMixin, removed in 5.0.0): createGlassHoverMixin is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0824` (export . createGlassFocusMixin, removed in 5.0.0): createGlassFocusMixin is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0825` (export . createGlassDisabledMixin, removed in 5.0.0): createGlassDisabledMixin is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0826` (export . generateGlassThemeVariables, removed in 5.0.0): generateGlassThemeVariables is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0827` (export . createResponsiveGlassStyle, removed in 5.0.0): createResponsiveGlassStyle is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0828` (export ./core/mixins/glassMixins createGlassMixin, removed in 5.0.0): createGlassMixin is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0829` (export ./core/mixins/glassMixins createGlassLoadingMixin, removed in 5.0.0): createGlassLoadingMixin is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0830` (export ./core/mixins/glassMixins canUseHighQualityGlass, removed in 5.0.0): canUseHighQualityGlass is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0831` (export ./core/mixins/glassMixins getRecommendedTier, removed in 5.0.0): getRecommendedTier is removed in 5.0; use materialProps/MaterialSpec — unmapped call shapes get a TODO marker (codemod: removed).
- `DEP-M0832` (export ./tokens glassTokenUtils, removed in 5.0.0): glassTokenUtils is removed in 5.0; use materialProps/MaterialSpec (codemod: removed).
- `DEP-M0833` (export ./tokens glassUtils, removed in 5.0.0): glassUtils is removed in 5.0; use materialProps/MaterialSpec (codemod: removed).
- `DEP-M0834` (export ./tokens liquidGlassUtils, removed in 5.0.0): liquidGlassUtils is removed in 5.0; use materialProps/MaterialSpec (codemod: removed).
- `DEP-M0835` (subpath ./core/mixins/glassMixins *, removed in 5.0.0): aura-glass/core/mixins/glassMixins is removed in 5.0; use materialProps/MaterialSpec (codemod: removed).
- `DEP-M0836` (export ./theme GlassMaterialPreset, removed in 5.0.0): the GlassMaterialPreset type is removed in 5.0; use MaterialSpec (codemod: removed).
- `DEP-M0837` (export ./theme GlassMaterialTokens, removed in 5.0.0): the GlassMaterialTokens type is removed in 5.0; use MaterialSpec (codemod: removed).
- `DEP-M0838` (asset ./styles glass.generated.css, removed in 5.0.0): glass.generated.css is removed in 5.0; the 5.x material.css emits solved recipes. doctor reports remaining class usage.
- `DEP-M0839` (css-global ./styles glass.css recipe classes, removed in 5.0.0): the glass.css recipe classes are removed in 5.0; use aura-glass/material.css + data-ag-tier. doctor reports usage.
- `DEP-M0840` (css-global ./styles glass-backdrop-blur*, removed in 5.0.0): the glass-backdrop-blur* are removed in 5.0; use data-ag-backdrop + material.css tiers. doctor reports usage.
- `DEP-M0841` (css-global ./styles glass-animate-*, removed in 5.0.0): the glass-animate-* are removed in 5.0; use CSS motion tokens + aura-glass/motion. doctor reports usage.
- `DEP-M0842` (css-global ./styles glass-transition-all, removed in 5.0.0): the glass-transition-all are removed in 5.0; use the 5.x motion tokens (transition presets). doctor reports usage.
- `DEP-M0843` (css-global ./styles glass-tier-*, removed in 5.0.0): the glass-tier-* are removed in 5.0; use data-ag-tier. doctor reports usage.
- `DEP-M0844` (css-global ./styles liquid-glass-* emissions, removed in 5.0.0): the liquid-glass-* emissions are removed in 5.0; use data-ag-* attributes emitted by material.css. doctor reports usage.
- `DEP-M0845` (css-var . --aura-blur-amount, removed in 5.0.0): --aura-blur-amount is removed in 5.0; blur is a solved material property (codemod: css-vars).
- `DEP-M0846` (export . HoudiniGlassCard, removed in 5.0.0): HoudiniGlassCard is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0847` (export . HoudiniGlassProvider, removed in 5.0.0): HoudiniGlassProvider is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0848` (export . LiquidGlassGPU, removed in 5.0.0): LiquidGlassGPU is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0849` (export . GlassWebGLShader, removed in 5.0.0): GlassWebGLShader is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0850` (export . HeatGlass, removed in 5.0.0): HeatGlass is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0851` (export . Glass3DEngine, removed in 5.0.0): Glass3DEngine is removed in 5.0; GPU/shader effects are labs-only over owned pixels, not part of core (codemod: removed).
- `DEP-M0852` (css-global ./styles storybook-utility-shim.css, removed in 5.0.0): the storybook-utility-shim.css import (src/styles/index.css) leaves the package at 5.0 — the file moves to .storybook/ (PKG-101). doctor --v5 reports it.
- `DEP-M0853` (export . Motion, removed in 5.0.0): Motion (root; MotionNative alias) is removed in 5.0; use CSS motion tokens, startMorph or aura-glass/motion (codemod: motion-imports).
- `DEP-M0854` (export ./primitives Motion, removed in 5.0.0): Motion (MotionFramer alias) is removed in 5.0; use CSS motion tokens, startMorph or aura-glass/motion (codemod: motion-imports).
- `DEP-M0855` (export ./primitives GlassMotion, removed in 5.0.0): GlassMotion is removed in 5.0; use CSS motion tokens, startMorph or aura-glass/motion (codemod: motion-imports).
- `DEP-M0856` (export . MotionNative, removed in 5.0.0): MotionNative is removed in 5.0; use CSS motion tokens, startMorph or aura-glass/motion (codemod: motion-imports).
- `DEP-M0857` (export ./primitives MotionFramer, removed in 5.0.0): MotionFramer is removed in 5.0; use CSS motion tokens, startMorph or aura-glass/motion (codemod: motion-imports).
- `DEP-M0858` (export . GlassMotionController, removed in 5.0.0): GlassMotionController (and the private OrganicAnimationEngine/AdvancedAnimations family it wraps) is removed in 5.0; use CSS motion tokens or aura-glass/motion (codemod: motion-imports).
- `DEP-M0859` (export . GlassTransitions, removed in 5.0.0): GlassTransitions (and the private OrganicAnimationEngine/AdvancedAnimations family it wraps) is removed in 5.0; use CSS motion tokens or aura-glass/motion (codemod: motion-imports).
- `DEP-M0860` (export . animationPresets, removed in 5.0.0): animationPresets is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0861` (export . usePhysicsEngine, removed in 5.0.0): usePhysicsEngine is removed in 5.0; use aura-glass/motion springs (toMotionTransition) (codemod: motion-imports).
- `DEP-M0862` (export . usePhysicsLayout, removed in 5.0.0): usePhysicsLayout is removed in 5.0; use aura-glass/motion SharedLayout (codemod: motion-imports).
- `DEP-M0863` (export . usePhysicsInteraction, removed in 5.0.0): usePhysicsInteraction is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0864` (export . useGalileoStateSpring, removed in 5.0.0): useGalileoStateSpring is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0865` (export . useGalileoSprings, removed in 5.0.0): useGalileoSprings is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0866` (export . useMultiSpringBasic, removed in 5.0.0): useMultiSpringBasic is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0867` (export . useMultiSpringPhysics, removed in 5.0.0): useMultiSpringPhysics is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0868` (export . useGesturePhysics, removed in 5.0.0): useGesturePhysics is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0869` (export . useAnimationSequence, removed in 5.0.0): useAnimationSequence is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0870` (export . useAnimationSequenceBasic, removed in 5.0.0): useAnimationSequenceBasic is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0871` (export . useAnimationSequenceOrchestrator, removed in 5.0.0): useAnimationSequenceOrchestrator is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0872` (export . orchestrationUseAnimationSequence, removed in 5.0.0): orchestrationUseAnimationSequence is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0873` (export . orchestrationPresets, removed in 5.0.0): orchestrationPresets is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0874` (export . createOrchestration, removed in 5.0.0): createOrchestration is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0875` (export . useOrchestration, removed in 5.0.0): useOrchestration is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0876` (export . useMouseMagneticEffect, removed in 5.0.0): useMouseMagneticEffect is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-imports).
- `DEP-M0877` (export . useMagneticField, removed in 5.0.0): useMagneticField is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-imports).
- `DEP-M0878` (export . useMagneticButton, removed in 5.0.0): useMagneticButton is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-imports).
- `DEP-M0879` (export . useMagneticElement, removed in 5.0.0): useMagneticElement is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-imports).
- `DEP-M0880` (export . use3DTransform, removed in 5.0.0): use3DTransform is removed in 5.0; use CSS transforms + the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0881` (export . useAmbientTilt, removed in 5.0.0): useAmbientTilt is removed in 5.0; use CSS transforms + the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0882` (export . useZSpaceAnimation, removed in 5.0.0): useZSpaceAnimation is removed in 5.0; use aura-glass/motion sequencing (codemod: motion-imports).
- `DEP-M0883` (export . useDraggableListPhysics, removed in 5.0.0): useDraggableListPhysics is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0884` (export . createMagneticEffect, removed in 5.0.0): createMagneticEffect is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-imports).
- `DEP-M0885` (export . createRippleEffect, removed in 5.0.0): createRippleEffect is removed in 5.0; use none — ripple effects are not part of the material grammar (codemod: motion-imports).
- `DEP-M0886` (export . createAccessibleAnimation, removed in 5.0.0): createAccessibleAnimation is removed in 5.0; use the preference-aware 5.x motion tokens (codemod: motion-imports).
- `DEP-M0887` (export . SpringPresets, removed in 5.0.0): SpringPresets is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0888` (export . InterpolationUtils, removed in 5.0.0): InterpolationUtils is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0889` (export . interpolate, removed in 5.0.0): interpolate is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0890` (export . GalileoPhysicsSystem, removed in 5.0.0): GalileoPhysicsSystem is removed in 5.0; use aura-glass/motion springs (codemod: motion-imports).
- `DEP-M0891` (export . ChartAnimationUtils, removed in 5.0.0): ChartAnimationUtils is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0892` (export . animateChart, removed in 5.0.0): animateChart is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0893` (export . chartAnimationPresets, removed in 5.0.0): chartAnimationPresets is removed in 5.0; use the 5.x motion tokens (codemod: motion-imports).
- `DEP-M0894` (export . MotionPreferenceProvider, removed in 5.0.0): MotionPreferenceProvider (the 4.x ReducedMotionProvider role) is deprecated; preferences live under AuraGlassProvider and usePreference (codemod: providers).
- `DEP-M0895` (export . useMotionPreferenceContext, removed in 5.0.0): useMotionPreferenceContext (MotionPreferenceContext access) is deprecated; use usePreference / useResolvedPreferences (codemod: providers).
- `DEP-M0896` (export . useReducedMotion, removed in 5.0.0): useReducedMotion is deprecated; use usePreference('motion') (codemod: motion-imports). A compat wrapper ships in aura-glass/compat.
- `DEP-M0897` (export . useEnhancedReducedMotion, removed in 5.0.0): useEnhancedReducedMotion is deprecated; use usePreference('motion') (codemod: motion-imports).
- `DEP-M0898` (export . useMotionPreference, removed in 5.0.0): useMotionPreference is deprecated; use usePreference('motion') (codemod: motion-imports).
- `DEP-M0899` (export . prefersReducedMotion, removed in 5.0.0): prefersReducedMotion is deprecated; use usePreference('motion') (codemod: motion-imports). A compat wrapper ships in aura-glass/compat.
- `DEP-M0900` (export ./theme useGlassMotionPolicy, removed in 5.0.0): useGlassMotionPolicy is removed in 5.0; motion policy is a floor, not a prop — use usePreference('motion') (codemod: motion-imports).
- `DEP-M0901` (prop . respectMotionPreference, removed in 5.0.0): the respectMotionPreference prop is removed in 5.0; use the OS motion floor (not overridable in 5.x) (codemod: motion-props).
- `DEP-M0902` (prop . motionPolicy, removed in 5.0.0): the motionPolicy prop is removed in 5.0; use the OS motion floor (not overridable in 5.x) (codemod: motion-props).
- `DEP-M0903` (prop . initialMotionPolicy, removed in 5.0.0): the initialMotionPolicy prop is removed in 5.0; use the OS motion floor (not overridable in 5.x) (codemod: motion-props).
- `DEP-M0904` (prop . preset (motion) / animationPreset, removed in 5.0.0): the preset (motion) / animationPreset prop is removed in 5.0; use the 5.x motion tokens (codemod: motion-props).
- `DEP-M0905` (prop . animate, removed in 5.0.0): the animate prop is removed in 5.0; use CSS motion tokens or aura-glass/motion (codemod: motion-props).
- `DEP-M0906` (prop . disableAnimation, removed in 5.0.0): the disableAnimation prop is removed in 5.0; use the OS motion floor / calm mode (codemod: motion-props).
- `DEP-M0907` (prop . whileHover / whileTap pass-through, removed in 5.0.0): the whileHover / whileTap pass-through prop is removed in 5.0; use aura-glass/motion magnetic() / CSS motion tokens (codemod: motion-props).
- `DEP-M0908` (export . MagneticButton, removed in 5.0.0): MagneticButton is removed in 5.0; use Button + magnetic() (aura-glass/motion) (codemod: motion-props).
- `DEP-M0909` (export . GlassMagneticCursor, removed in 5.0.0): GlassMagneticCursor is removed in 5.0; use magnetic() (aura-glass/motion) (codemod: motion-props).
- `DEP-M0910` (export . RippleButton, removed in 5.0.0): RippleButton is removed in 5.0; use Button (5.x) — ripple effects are not part of the material grammar (codemod: motion-props).
- `DEP-M0911` (export . TouchRippleEffects, removed in 5.0.0): TouchRippleEffects is removed in 5.0; use none — ripple effects are not part of the material grammar (codemod: motion-props).
- `DEP-M0912` (export . MotionAwareGlass, removed in 5.0.0): MotionAwareGlass is removed in 5.0; use Surface (motion is preference-driven in 5.x) (codemod: motion-props).
- `DEP-M0913` (export . GlassDepthLayer, removed in 5.0.0): GlassDepthLayer is removed in 5.0; use Surface layering (the 5.x nested-materials rule) (codemod: motion-props).
- `DEP-M0914` (export ./tokens ANIMATION, removed in 5.0.0): ANIMATION is removed in 5.0; motion values ship as tokens (codemod: motion-imports).
- `DEP-M0915` (export ./tokens AURA_GLASS, removed in 5.0.0): AURA_GLASS (the .motion member) is removed in 5.0; motion values ship as tokens (codemod: motion-imports).
- `DEP-M0916` (export ./tokens LIQUID_GLASS, removed in 5.0.0): LIQUID_GLASS (the .motionFluency member) is removed in 5.0; motion values ship as tokens (codemod: motion-imports).
- `DEP-M0917` (css-var . --glass-motion-*, removed in 5.0.0): the --glass-motion-* variables are removed in 5.0; use the --ag-motion-* tokens (codemod: css-vars).
- `DEP-M0918` (css-var . --glass-motion-default, removed in 5.0.0): --glass-motion-default is removed in 5.0; use --ag-motion-default (codemod: css-vars).
- `DEP-M0919` (css-var . --glass-theme-duration-*, removed in 5.0.0): the --glass-theme-duration-* variables are removed in 5.0; use the --ag-motion-duration-* tokens (codemod: css-vars).
- `DEP-M0920` (peer . framer-motion, removed in 5.0.0): the framer-motion peer is removed in 5.0; aura-glass/motion takes an optional motion@^12 peer (codemod: deps).
- `DEP-M0921` (export . ContrastGuard, removed in 5.0.0): ContrastGuard (with TextWithContrast/useContrastGuard/useAutoTextContrast internals) is removed in 5.0; contrast floors are solved by the material (codemod: removed).
- `DEP-M0922` (export . GlassA11y, removed in 5.0.0): GlassA11y is removed in 5.0; use GlassPreferencesPanel (codemod: removed).
- `DEP-M0923` (export . GlassHighContrast, removed in 5.0.0): GlassHighContrast is removed in 5.0; use GlassPreferencesPanel (contrast preference) (codemod: removed).
- `DEP-M0924` (export . GlassMotionControls, removed in 5.0.0): GlassMotionControls is removed in 5.0; use GlassPreferencesPanel (motion preference) (codemod: removed).
- `DEP-M0925` (export . GlassScreenReader, removed in 5.0.0): GlassScreenReader is removed in 5.0; use GlassPreferencesPanel / useAnnouncer (codemod: removed).
- `DEP-M0926` (export . GlassKeyboardNav, removed in 5.0.0): GlassKeyboardNav is removed in 5.0; use the 5.x keyboard contract (built into components) (codemod: removed).
- `DEP-M0927` (export . GlassA11yAuditor, removed in 5.0.0): GlassA11yAuditor is removed in 5.0; audits run in the CI axe lane (codemod: removed).
- `DEP-M0928` (export . GlassFocusIndicators, removed in 5.0.0): GlassFocusIndicators (incl. LandmarkAnnouncer/KeyboardShortcutsHelper internals) is removed in 5.0; use focus.css + useAnnouncer (codemod: removed).
- `DEP-M0929` (export ./primitives/focus SkipLinks, removed in 5.0.0): SkipLinks is removed in 5.0; use focus.css landmark/focus styles (codemod: removed).
- `DEP-M0930` (css-global . GlassFocusIndicators CSS (focus-indicator rules), removed in 5.0.0): the GlassFocusIndicators companion CSS is removed in 5.0; focus styles ship in focus.css (codemod: removed).
- `DEP-M0931` (export . GlassFocusRing, removed in 5.0.0): GlassFocusRing is removed in 5.0; focus appearance ships in focus.css (codemod: removed).
- `DEP-M0932` (export . FocusIndicator, removed in 5.0.0): FocusIndicator is removed in 5.0; focus appearance ships in focus.css (codemod: removed).
- `DEP-M0933` (export . AccessibilityProvider, removed in 5.0.0): AccessibilityProvider is deprecated; use AuraGlassProvider (highContrast→contrast="more", reducedTransparency→transparency="tinted", colorBlindness dropped) (codemod: providers).
- `DEP-M0934` (export . useAccessibilityFeature, removed in 5.0.0): useAccessibilityFeature is deprecated; use usePreference / useResolvedPreferences (codemod: providers).
- `DEP-M0935` (export . useAccessibleAnimation, removed in 5.0.0): useAccessibleAnimation is deprecated; use usePreference('motion') (codemod: providers).
- `DEP-M0936` (export . useAccessibleColors, removed in 5.0.0): useAccessibleColors is deprecated; use usePreference / useResolvedPreferences (codemod: providers).
- `DEP-M0937` (export ./theme GlassThemeProvider, removed in 5.0.0): GlassThemeProvider is deprecated; use AuraGlassProvider (codemod: providers).
- `DEP-M0938` (export . ThemeProvider, removed in 5.0.0): ThemeProvider is deprecated; use AuraGlassProvider (codemod: providers).
- `DEP-M0939` (export ./theme useGlassTheme, removed in 5.0.0): useGlassTheme is deprecated; use usePreference / useResolvedPreferences (codemod: providers).
- `DEP-M0940` (export . AIGlassThemeProvider, removed in 5.0.0): AIGlassThemeProvider is deprecated; use AuraGlassProvider (codemod: providers).
- `DEP-M0941` (export ./primitives/focus ScreenReader, removed in 5.0.0): ScreenReader is removed in 5.0; use useAnnouncer (ScreenReaderOnly → VisuallyHidden) (codemod: canonical-names).
- `DEP-M0942` (export ./primitives/focus ScreenReaderOnly, removed in 5.0.0): ScreenReaderOnly is removed in 5.0; use VisuallyHidden (CMP) (codemod: canonical-names).
- `DEP-M0943` (export ./primitives/focus LiveRegion, removed in 5.0.0): LiveRegion is removed in 5.0; use useAnnouncer (codemod: canonical-names).
- `DEP-M0944` (export ./primitives/focus announce, removed in 5.0.0): announce is removed in 5.0; use useAnnouncer (codemod: canonical-names).
- `DEP-M0945` (export ./primitives/focus useAnnounce, removed in 5.0.0): useAnnounce is removed in 5.0; use useAnnouncer (codemod: canonical-names).
- `DEP-M0946` (export ./primitives/focus FocusTrap, removed in 5.0.0): FocusTrap is removed in 5.0; overlay components manage focus internally (codemod: removed).
- `DEP-M0947` (export ./primitives/focus useFocusTrap, removed in 5.0.0): useFocusTrap is removed in 5.0; overlay components manage focus internally (codemod: removed).
- `DEP-P0042` (subpath ./services/ai/config services/ai/config, removed in 5.0.0): the ./services/ai/config subpath leaves the component package in 5.0.0; migrate to the runtime package.
- `DEP-P0043` (subpath ./services/ai/cache-service services/ai/cache-service, removed in 5.0.0): the ./services/ai/cache-service subpath leaves the component package in 5.0.0.
- `DEP-P0044` (subpath ./services/ai/openai-service services/ai/openai-service, removed in 5.0.0): the ./services/ai/openai-service subpath leaves the component package in 5.0.0.
- `DEP-P0045` (subpath ./services/ai/vision-service services/ai/vision-service, removed in 5.0.0): the ./services/ai/vision-service subpath leaves the component package in 5.0.0.
- `DEP-P0046` (subpath ./services/websocket/collaboration-service services/websocket/collaboration-service, removed in 5.0.0): the ./services/websocket/collaboration-service subpath leaves the component package in 5.0.0.
- `DEP-P0047` (subpath ./services services, removed in 5.0.0): the ./services namespace leaves the component package in 5.0.0.
- `DEP-P0048` (subpath ./hooks/useGlassProbes useGlassProbes, removed in 5.0.0): the ./hooks/useGlassProbes subpath is replaced by the 5.0 probe API.
- `DEP-P0049` (prop . dead optical props (shimmer, glowIntensity aliases), removed in 5.0.0): dead optical props removed in 5.0.0; run the prop-grammar/dead-optical-props codemods.
- `DEP-P0050` (prop . old theme providers (ThemeProvider, GlassThemeProvider, DarkModeProvider, MotionProvider, AnimationProvider), removed in 5.0.0): the five old theme/motion providers wrap AuraGlassProvider and warn once; migrate to AuraGlassProvider directly.
- `DEP-P0051` (subpath ./navigation navigation alias subpath, removed in 5.0.0): the ./navigation alias subpath is removed in 5.0.0.
- `DEP-P0052` (subpath ./overlays overlays alias subpath, removed in 5.0.0): the ./overlays alias subpath is removed in 5.0.0.
- `DEP-P0053` (subpath ./marketing marketing alias subpath, removed in 5.0.0): the ./marketing alias subpath is removed in 5.0.0.
- `DEP-P0054` (subpath ./workflows workflows alias subpath, removed in 5.0.0): the ./workflows alias subpath is removed in 5.0.0.
- `DEP-P0055` (subpath ./workspace workspace alias subpath, removed in 5.0.0): the ./workspace alias subpath is removed in 5.0.0.
- `DEP-P0056` (subpath ./client client alias subpath, removed in 5.0.0): the ./client alias subpath is removed in 5.0.0.
- `DEP-P0057` (subpath ./ssr ssr alias subpath, removed in 5.0.0): the ./ssr alias subpath is removed in 5.0.0.
- `DEP-P0058` (subpath ./server server alias subpath, removed in 5.0.0): the ./server alias subpath is removed in 5.0.0.
- `DEP-P0059` (subpath ./registry registry alias subpath, removed in 5.0.0): the ./registry alias subpath is removed in 5.0.0.
- `DEP-P0073` (export . keyframes theme exports, removed in 5.0.0): keyframes theme exports is removed in 5.0.0.
- `DEP-P0074` (export . glassMixins legacy mixin functions, removed in 5.0.0): glassMixins legacy mixin functions is removed in 5.0.0.
- `DEP-P0075` (export . interactiveGlass, removed in 5.0.0): interactiveGlass is removed in 5.0.0.
- `DEP-P0076` (export . v2 export block, removed in 5.0.0): v2 export block is removed in 5.0.0.
- `DEP-P0077` (export . getPersona* accessors, removed in 5.0.0): getPersona* accessors is removed in 5.0.0.
- `DEP-P0078` (export ./registry registry exports beyond auraGlassRecipes, removed in 5.0.0): registry exports beyond auraGlassRecipes is removed in 5.0.0.
- `DEP-P0079` (cli cli recipe:saas-dashboard, removed in 5.0.0): recipe:saas-dashboard is removed in 5.0.0.
- `DEP-P0080` (cli cli recipe:ai-command-center, removed in 5.0.0): recipe:ai-command-center is removed in 5.0.0.
- `DEP-P0081` (cli cli recipe:media-player-surface, removed in 5.0.0): recipe:media-player-surface is removed in 5.0.0.
- `DEP-P0082` (cli cli recipe:analytics-overview, removed in 5.0.0): recipe:analytics-overview is removed in 5.0.0.
- `DEP-P0083` (cli cli recipe:settings-billing, removed in 5.0.0): recipe:settings-billing is removed in 5.0.0.
- `DEP-P0084` (cli cli recipe:kanban-workspace, removed in 5.0.0): recipe:kanban-workspace is removed in 5.0.0.
- `DEP-P0085` (cli cli recipe:calendar-schedule, removed in 5.0.0): recipe:calendar-schedule is removed in 5.0.0.
- `DEP-P0086` (cli cli recipe:collaborative-workspace, removed in 5.0.0): recipe:collaborative-workspace is removed in 5.0.0.
- `DEP-P0087` (cli cli recipe:admin-data-table, removed in 5.0.0): recipe:admin-data-table is removed in 5.0.0.
- `DEP-P0088` (cli cli recipe:ecommerce-product-panel, removed in 5.0.0): recipe:ecommerce-product-panel is removed in 5.0.0.
- `DEP-P0089` (cli cli recipe:saas-admin-shell, removed in 5.0.0): recipe:saas-admin-shell is removed in 5.0.0.
- `DEP-P0090` (cli cli recipe:ai-product-console, removed in 5.0.0): recipe:ai-product-console is removed in 5.0.0.
- `DEP-P0091` (cli cli recipe:media-review-workspace, removed in 5.0.0): recipe:media-review-workspace is removed in 5.0.0.
- `DEP-P0092` (cli cli recipe:commerce-operations-panel, removed in 5.0.0): recipe:commerce-operations-panel is removed in 5.0.0.
- `DEP-P0093` (cli cli recipe:team-collaboration-hub, removed in 5.0.0): recipe:team-collaboration-hub is removed in 5.0.0.
- `DEP-P0094` (cli cli recipe:settings-and-billing-suite, removed in 5.0.0): recipe:settings-and-billing-suite is removed in 5.0.0.
- `DEP-P0095` (cli cli recipe:analytics-command-center, removed in 5.0.0): recipe:analytics-command-center is removed in 5.0.0.
- `DEP-P0096` (cli cli recipe:calendar-operations-board, removed in 5.0.0): recipe:calendar-operations-board is removed in 5.0.0.
- `DEP-P0097` (cli cli recipe:customer-support-console, removed in 5.0.0): recipe:customer-support-console is removed in 5.0.0.
- `DEP-P0098` (cli cli recipe:creator-studio-dashboard, removed in 5.0.0): recipe:creator-studio-dashboard is removed in 5.0.0.
- `DEP-P0099` (cli cli recipe:ai-ops-control-room, removed in 5.0.0): recipe:ai-ops-control-room is removed in 5.0.0.
- `DEP-P0100` (cli cli recipe:semantic-search-console, removed in 5.0.0): recipe:semantic-search-console is removed in 5.0.0.
- `DEP-P0101` (cli cli recipe:vision-review-workbench, removed in 5.0.0): recipe:vision-review-workbench is removed in 5.0.0.
- `DEP-P0102` (cli cli recipe:collaboration-room-console, removed in 5.0.0): recipe:collaboration-room-console is removed in 5.0.0.
- `DEP-P0103` (cli cli recipe:support-triage-workspace, removed in 5.0.0): recipe:support-triage-workspace is removed in 5.0.0.
- `DEP-P0104` (cli cli recipe:release-command-center, removed in 5.0.0): recipe:release-command-center is removed in 5.0.0.
- `DEP-P0105` (cli cli recipe:developer-docs-portal, removed in 5.0.0): recipe:developer-docs-portal is removed in 5.0.0.
- `DEP-P0106` (cli cli recipe:marketing-launch-kit, removed in 5.0.0): recipe:marketing-launch-kit is removed in 5.0.0.
- `DEP-S0001` (export . GlassAppShell, removed in 5.0.0): GlassAppShell is removed in 5.0; use the AppShell entry and migrate slot props to slot children.
- `DEP-S0002` (export . GlassHeader, removed in 5.0.0): GlassHeader is removed in 5.0; use TopBar — AppShell.SidebarToggle replaces the built-in burger.
- `DEP-S0003` (export . GlassTopBar, removed in 5.0.0): GlassTopBar is removed in 5.0; use TopBar inside AppShell.Root.
- `DEP-S0004` (export . GlassSidebar, removed in 5.0.0): GlassSidebar is removed in 5.0; use Sidebar with Sidebar.Nav/Sidebar.Item children.
- `DEP-S0005` (export . GlassMain, removed in 5.0.0): GlassMain is removed in 5.0; use AppShell.Main inside AppShell.Root.
- `DEP-S0006` (export . GlassPageHeader, removed in 5.0.0): GlassPageHeader is removed in 5.0; use AppShell.PageHeader.
- `DEP-S0007` (export . GlassStatusBar, removed in 5.0.0): GlassStatusBar is removed in 5.0; use StatusBar inside AppShell.Root.
- `DEP-S0008` (export . GlassInspector, removed in 5.0.0): GlassInspector is removed in 5.0; use Inspector inside AppShell.Root.
- `DEP-S0009` (export . GlassMobileShell, removed in 5.0.0): GlassMobileShell is removed in 5.0; use MobileShell.
- `DEP-S0010` (export . ZSpaceAppLayout, removed in 5.0.0): ZSpaceAppLayout is removed in 5.0; the AppShell composition replaces z-depth layouts.
- `DEP-S0011` (export . GlassTabs, removed in 5.0.0): GlassTabs is removed in 5.0; use Tabs with Tabs.List/Tabs.Tab/Tabs.Panel.
- `DEP-S0012` (export . GlassPageTabs, removed in 5.0.0): GlassPageTabs is removed in 5.0; use Tabs inside AppShell.PageHeader actions.
- `DEP-S0013` (export . GlassTabBar, removed in 5.0.0): GlassTabBar is removed in 5.0; use TabBar.
- `DEP-S0014` (export . GlassWorkspaceTabs, removed in 5.0.0): GlassWorkspaceTabs is removed in 5.0; use Tabs.
- `DEP-S0015` (export . LiquidGlassTabBar, removed in 5.0.0): LiquidGlassTabBar is removed in 5.0; use TabBar with material variants.
- `DEP-S0016` (export . GlassBottomNav, removed in 5.0.0): GlassBottomNav is removed in 5.0; use TabBar in the MobileShell tabBar slot.
- `DEP-S0017` (export . LiquidGlassBottomAccessory, removed in 5.0.0): LiquidGlassBottomAccessory is removed in 5.0; use TabBar accessory slot.
- `DEP-S0018` (export . GlassMobileNav, removed in 5.0.0): GlassMobileNav is removed in 5.0; Sidebar.Drawer provides the overlay navigation.
- `DEP-S0019` (export . GlassBreadcrumb, removed in 5.0.0): GlassBreadcrumb is removed in 5.0; use Breadcrumbs.
- `DEP-S0020` (export . GlassPagination, removed in 5.0.0): GlassPagination is removed in 5.0; use Pagination (currentPage->page, totalPages->pageCount).
- `DEP-S0021` (export . GlassCommandPalette, removed in 5.0.0): GlassCommandPalette is removed in 5.0; use CommandPalette.
- `DEP-S0022` (export . GlassCommand, removed in 5.0.0): GlassCommand is removed in 5.0; use Command.
- `DEP-S0023` (export . LiquidGlassCommandSurface, removed in 5.0.0): LiquidGlassCommandSurface is removed in 5.0; use CommandPalette.
- `DEP-S0024` (export . LiquidGlassTransitionProvider, removed in 5.0.0): LiquidGlassTransitionProvider is removed in 5.0; use SourceTransition.
- `DEP-S0025` (export . LiquidGlassSource, removed in 5.0.0): LiquidGlassSource is removed in 5.0; use SourceTransition.
- `DEP-S0026` (export . LiquidGlassDestination, removed in 5.0.0): LiquidGlassDestination is removed in 5.0; use SourceTransition.
- `DEP-S0200` (export . GlassDataTable, removed in 5.0.0): GlassDataTable is removed in 5.0; use Table from aura-glass/data.
- `DEP-S0201` (export . GlassDataGrid, removed in 5.0.0): GlassDataGrid is removed in 5.0; use Table from aura-glass/data.
- `DEP-S0202` (export . GlassVirtualTable, removed in 5.0.0): GlassVirtualTable is removed in 5.0; use Table with virtualize from aura-glass/data.
- `DEP-S0203` (export . GlassVirtualList, removed in 5.0.0): GlassVirtualList is removed in 5.0; use Table virtualization primitives.
- `DEP-S0204` (export . GlassTreeView, removed in 5.0.0): GlassTreeView is removed in 5.0; use TreeView from aura-glass/data.
- `DEP-S0205` (export . TreeView, removed in 5.0.0): TreeView is removed in 5.0; use TreeView from aura-glass/data.
- `DEP-S0206` (export . GlassFileTree, removed in 5.0.0): GlassFileTree is removed in 5.0; use TreeView from aura-glass/data.
- `DEP-S0207` (export . GlassFileExplorer, removed in 5.0.0): GlassFileExplorer is removed in 5.0; use TreeView from aura-glass/data.
- `DEP-S0208` (export . GlassFilterBar, removed in 5.0.0): GlassFilterBar is removed in 5.0; use FilterBar from aura-glass/data.
- `DEP-S0209` (export . GlassSearchBar, removed in 5.0.0): GlassSearchBar is removed in 5.0; use FilterBar search slot from aura-glass/data.
- `DEP-S0210` (export . GlassStatCard, removed in 5.0.0): GlassStatCard is removed in 5.0; use StatCard from aura-glass/data.
- `DEP-S0211` (export . GlassKPICard, removed in 5.0.0): GlassKPICard is removed in 5.0; use StatCard from aura-glass/data.
- `DEP-S0212` (export . GlassMetricCard, removed in 5.0.0): GlassMetricCard is removed in 5.0; use StatCard from aura-glass/data.
- `DEP-S0213` (export . GlassMetricChip, removed in 5.0.0): GlassMetricChip is removed in 5.0; use Chip from aura-glass/data.
- `DEP-S0214` (export . GlassAnimatedNumber, removed in 5.0.0): GlassAnimatedNumber is removed in 5.0; use StatCard value from aura-glass/data.
- `DEP-S0215` (export . GlassSparkline, removed in 5.0.0): GlassSparkline is removed in 5.0; use Sparkline from aura-glass/data.
- `DEP-S0216` (export . GlassTimeline, removed in 5.0.0): GlassTimeline is removed in 5.0; use Timeline from aura-glass.
- `DEP-S0217` (export . GlassActivityFeed, removed in 5.0.0): GlassActivityFeed is removed in 5.0; use ActivityFeed from aura-glass.
- `DEP-S0218` (export . GlassChip, removed in 5.0.0): GlassChip is removed in 5.0; use Chip from aura-glass/data.
- `DEP-S0219` (export . GlassKeyValueEditor, removed in 5.0.0): GlassKeyValueEditor is removed in 5.0; use KeyValueEditor from aura-glass/data.
- `DEP-S0220` (export . GlassDateField, removed in 5.0.0): GlassDateField is removed in 5.0; use DateField from aura-glass/date.
- `DEP-S0221` (export . GlassTimeField, removed in 5.0.0): GlassTimeField is removed in 5.0; use TimeField from aura-glass/date.
- `DEP-S0222` (export . GlassDatePicker, removed in 5.0.0): GlassDatePicker is removed in 5.0; use DatePicker from aura-glass/date.
- `DEP-S0223` (export . GlassDateRangePicker, removed in 5.0.0): GlassDateRangePicker is removed in 5.0; use DateRangePicker from aura-glass/date.
- `DEP-S0224` (export . GlassCalendar, removed in 5.0.0): GlassCalendar is removed in 5.0; use Calendar from aura-glass/date.
- `DEP-S0225` (export . GlassDataChart, removed in 5.0.0): GlassDataChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0226` (export . DataChart, removed in 5.0.0): DataChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0227` (export . ModularGlassDataChart, removed in 5.0.0): ModularGlassDataChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0228` (export . GlassChart, removed in 5.0.0): GlassChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0229` (export . GlassLineChart, removed in 5.0.0): GlassLineChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0230` (export . GlassBarChart, removed in 5.0.0): GlassBarChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0231` (export . GlassAreaChart, removed in 5.0.0): GlassAreaChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0232` (export . GlassPieChart, removed in 5.0.0): GlassPieChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0233` (export . GlassDonutChart, removed in 5.0.0): GlassDonutChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0234` (export . GlassChartContainer, removed in 5.0.0): GlassChartContainer is removed in 5.0 with no 4.x-shape replacement; ChartFrame from aura-glass/data.
- `DEP-S0235` (export . GlassChartWidget, removed in 5.0.0): GlassChartWidget is removed in 5.0 with no 4.x-shape replacement; ChartFrame from aura-glass/data.
- `DEP-S0236` (export . GlassAdvancedDataViz, removed in 5.0.0): GlassAdvancedDataViz is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0237` (export . GlassChartsDemo, removed in 5.0.0): GlassChartsDemo is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0238` (export . GlassHeatmap, removed in 5.0.0): GlassHeatmap is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0239` (export . GlassGanttChart, removed in 5.0.0): GlassGanttChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0240` (export . KpiChart, removed in 5.0.0): KpiChart is removed in 5.0 with no 4.x-shape replacement; the Chart entry ships on aura-glass/charts in 5.1.
- `DEP-S0241` (export . GlassMetricsGrid, removed in 5.0.0): GlassMetricsGrid is removed in 5.0 with no 4.x-shape replacement; StatCard composition from aura-glass/data.
- `DEP-S0242` (export . GlassVirtualGrid, removed in 5.0.0): GlassVirtualGrid is removed in 5.0 with no 4.x-shape replacement; Table with virtualize from aura-glass/data.
- `DEP-S0243` (export . GlassInfiniteScroll, removed in 5.0.0): GlassInfiniteScroll is removed in 5.0 with no 4.x-shape replacement; Table with virtualize from aura-glass/data.
- `DEP-S0244` (export . GlassListView, removed in 5.0.0): GlassListView is removed in 5.0 with no 4.x-shape replacement; Table from aura-glass/data.
- `DEP-S0245` (export . GlassFormTable, removed in 5.0.0): GlassFormTable is removed in 5.0 with no 4.x-shape replacement; Table + forms composition.
- `DEP-S0246` (export . TableWidget, removed in 5.0.0): TableWidget is removed in 5.0 with no 4.x-shape replacement; Table from aura-glass/data.
- `DEP-S0247` (export . GlassDataGridPro, removed in 5.0.0): GlassDataGridPro is removed in 5.0 with no 4.x-shape replacement; Table from aura-glass/data.
- `DEP-S0248` (export . QueryBuilder, removed in 5.0.0): QueryBuilder is removed in 5.0 with no 4.x-shape replacement; the query-builder registry item.
- `DEP-S0400` (export . GlassChat, removed in 6.0.0): GlassChat is removed from aura-glass in 5.0; the aura-glass/compat adapter keeps working until 6.0.0. Migrate to ./ai (Thread/Message/Composer).
- `DEP-S0401` (export . GlassChatInput, removed in 6.0.0): GlassChatInput is removed from aura-glass in 5.0; the aura-glass/compat adapter keeps working until 6.0.0. Migrate to ./ai Composer.
- `DEP-S0402` (export . GlassMessageList, removed in 6.0.0): GlassMessageList is removed from aura-glass in 5.0; the aura-glass/compat adapter keeps working until 6.0.0. Migrate to ./ai Thread.
- `DEP-S0403` (export . GlassTypingIndicator, removed in 6.0.0): GlassTypingIndicator is removed from aura-glass in 5.0; the aura-glass/compat adapter keeps working until 6.0.0. Use a streaming-status message or AgentSteps.
- `DEP-S0404` (export . GlassVoiceInput, removed in 5.0.0): GlassVoiceInput is removed in 5.0 with no compat adapter; install the ai-voice-input registry item.
- `DEP-S0405` (export . GlassPredictiveChat, removed in 5.0.0): GlassPredictiveChat is removed in 5.0; predictive/simulated AI surfaces are rejected by the contract (no-simulation).
- `DEP-S0406` (export . GlassPredictiveEngine, removed in 5.0.0): GlassPredictiveEngine is removed in 5.0 (no-simulation contract).
- `DEP-S0407` (export . usePredictiveEngine, removed in 5.0.0): usePredictiveEngine is removed in 5.0 (no-simulation contract).
- `DEP-S0408` (export . GlassAutoComposer, removed in 5.0.0): GlassAutoComposer is removed in 5.0 (no-simulation contract).
- `DEP-S0409` (export . useAutoComposer, removed in 5.0.0): useAutoComposer is removed in 5.0 (no-simulation contract).
- `DEP-S0410` (export . AIGlassThemeProvider, removed in 5.0.0): AIGlassThemeProvider is removed in 5.0 (no-simulation contract).
- `DEP-S0411` (export . GlassGANGenerator, removed in 5.0.0): GlassGANGenerator is removed in 5.0; generative-art surfaces are deferred to 5.1.
- `DEP-S0412` (export . GlassDeepDreamGlass, removed in 5.0.0): GlassDeepDreamGlass is removed in 5.0; generative-art surfaces are deferred to 5.1.
- `DEP-S0413` (export . GlassStyleTransfer, removed in 5.0.0): GlassStyleTransfer is removed in 5.0; generative-art surfaces are deferred to 5.1.
- `DEP-S0414` (export . GlassGenerativeArt, removed in 5.0.0): GlassGenerativeArt is removed in 5.0; generative-art surfaces are deferred to 5.1.
- `DEP-S0415` (export . NeuromorphicLearningNetwork, removed in 5.0.0): NeuromorphicLearningNetwork is removed in 5.0 (no-simulation contract).
- `DEP-S0416` (export . NeuralWeightVisualization, removed in 5.0.0): NeuralWeightVisualization is removed in 5.0 (no-simulation contract).
- `DEP-S0417` (export . GlassMusicVisualizer, removed in 5.0.0): GlassMusicVisualizer is removed in 5.0; a Waveform surface lands at 5.1.
- `DEP-S0418` (export . GlassVoiceWaveform, removed in 5.0.0): GlassVoiceWaveform is removed in 5.0; a Waveform surface lands at 5.1.
- `DEP-S0419` (export . GlassLiveFilter, removed in 5.0.0): GlassLiveFilter is removed in 5.0 (no-simulation contract).
- `DEP-S0420` (export . GlassPredictionIndicator, removed in 5.0.0): GlassPredictionIndicator is removed in 5.0 (no-simulation contract).
- `DEP-S0421` (export . useInteractionRecorder, removed in 5.0.0): useInteractionRecorder is removed in 5.0 (no-simulation contract).
- `DEP-S0422` (export . predictiveEnginePresets, removed in 5.0.0): predictiveEnginePresets is removed in 5.0 (no-simulation contract).
- `DEP-S0600` (export . LiquidGlassMediaControls, removed in 6.0.0): LiquidGlassMediaControls is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to MediaControls.Root from aura-glass/media.
- `DEP-S0601` (export . GlassMediaControls, removed in 6.0.0): GlassMediaControls is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to MediaControls.Root from aura-glass/media.
- `DEP-S0602` (export . LiquidGlassNowPlayingBar, removed in 6.0.0): LiquidGlassNowPlayingBar is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to NowPlayingBar from aura-glass/media.
- `DEP-S0603` (export . LiquidGlassPhotoInspector, removed in 6.0.0): LiquidGlassPhotoInspector is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to ImageViewer + Inspector from aura-glass/media.
- `DEP-S0604` (export . GlassImageViewer, removed in 6.0.0): GlassImageViewer is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to ImageViewer from aura-glass/media (items need id + required alt).
- `DEP-S0605` (export . GlassGallery, removed in 6.0.0): GlassGallery is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to ImageViewer from aura-glass/media (or the media-gallery registry item).
- `DEP-S0606` (export . GlassCarousel, removed in 6.0.0): GlassCarousel is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to CarouselRail from aura-glass/media (infinite to loop, autoPlay gated).
- `DEP-S0607` (export . LiquidGlassCarouselRail, removed in 6.0.0): LiquidGlassCarouselRail is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to CarouselRail from aura-glass/media.
- `DEP-S0608` (export . AuroraBackground, removed in 6.0.0): AuroraBackground is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop preset="aurora" from aura-glass/backdrops.
- `DEP-S0609` (export . AuroraOrb, removed in 6.0.0): AuroraOrb is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop preset="aurora" from aura-glass/backdrops.
- `DEP-S0610` (export . AtmosphericBackground, removed in 6.0.0): AtmosphericBackground is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop presets from aura-glass/backdrops.
- `DEP-S0611` (export . GlassDynamicAtmosphere, removed in 6.0.0): GlassDynamicAtmosphere is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop presets from aura-glass/backdrops.
- `DEP-S0612` (export . DynamicAtmosphere, removed in 6.0.0): DynamicAtmosphere is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop presets from aura-glass/backdrops.
- `DEP-S0613` (export . GlassMeshGradient, removed in 6.0.0): GlassMeshGradient is removed from aura-glass in 5.0; the aura-glass/compat adapter works until 6.0.0. Migrate to Backdrop preset="mesh" from aura-glass/backdrops.
- `DEP-S0617` (export . GlassLazyImage, removed in 5.0.0): GlassLazyImage is removed in 5.0; native img loading="lazy".
- `DEP-S0618` (export . GlassVideoPlayer, removed in 5.0.0): GlassVideoPlayer is removed in 5.0; the media-video-player registry item.
- `DEP-S0619` (export . GlassAdvancedVideoPlayer, removed in 5.0.0): GlassAdvancedVideoPlayer is removed in 5.0; the media-video-player registry item.
- `DEP-S0620` (export . GlassAdvancedAudioPlayer, removed in 5.0.0): GlassAdvancedAudioPlayer is removed in 5.0; the media-audio-player registry item.
- `DEP-S0621` (export . GlassMediaProvider, removed in 5.0.0): GlassMediaProvider is removed in 5.0; useMediaElement from aura-glass/media.
- `DEP-S0622` (export . GlassVoiceWaveform, removed in 5.0.0): GlassVoiceWaveform is removed in 5.0; no successor until 5.1 (Waveform).
- `DEP-S0623` (export . GlassMusicVisualizer, removed in 5.0.0): GlassMusicVisualizer is removed in 5.0; no successor until 5.1 (Waveform).
- `DEP-S0624` (export . ParticleBackground, removed in 5.0.0): ParticleBackground is removed in 5.0; the labs ParticleField (seeded PRNG).
- `DEP-S0625` (export . GlassParticles, removed in 5.0.0): GlassParticles is removed in 5.0; the labs ParticleField (seeded PRNG).
- `DEP-S0626` (export . GlassParticleField, removed in 5.0.0): GlassParticleField is removed in 5.0; the labs ParticleField (seeded PRNG).
- `DEP-S0627` (export . AuroraPro, removed in 5.0.0): AuroraPro is removed in 5.0; Backdrop preset="aurora".
- `DEP-S0628` (export . SeasonalParticles, removed in 5.0.0): SeasonalParticles is removed in 5.0; Backdrop presets; particles live in labs.
- `DEP-S0629` (export . GlassAuroraDisplay, removed in 5.0.0): GlassAuroraDisplay is removed in 5.0; Backdrop preset="aurora".
- `DEP-S0630` (export . GlassNebulaClouds, removed in 5.0.0): GlassNebulaClouds is removed in 5.0; Backdrop presets aurora/mesh.
- `DEP-S0631` (export . LiquidGlassBackdropSampler, removed in 5.0.0): LiquidGlassBackdropSampler is removed in 5.0; Backdrop + useMediaElement({ sampleTone: true }).
- `DEP-S0632` (export . useLiquidGlassBackdrop, removed in 5.0.0): useLiquidGlassBackdrop is removed in 5.0; Backdrop + useMediaElement({ sampleTone: true }).
- `DEP-S0800` (subpath ./workspace *, removed in 5.0.0): aura-glass/workspace is removed in 5.0; migrate to aura-glass/app-shell — the AppShell composition replaces the workspace layout subpath.
- `DEP-S0801` (subpath ./workflows *, removed in 5.0.0): aura-glass/workflows is removed in 5.0; the app-shell workspace recipes and 5.x registry blocks replace every export this subpath re-exported.
- `DEP-S0802` (export . SmartShoppingCart, removed in 5.0.0): The SmartShoppingCart alias is removed in 5.0; it is the same component as GlassSmartShoppingCart, which itself is replaced by the commerce-cart registry block (5.1).
- `DEP-S0803` (export . GlassCommentThread, removed in 5.0.0): GlassCommentThread is removed in 5.0; use the comment-thread registry item (5.1), the single comment surface consolidated from the 4.x duplicates.
- `DEP-S0804` (export . GlassSmartShoppingCart, removed in 5.0.0): GlassSmartShoppingCart is removed in 5.0; use the commerce-cart registry block (5.1) — controlled cart UI that holds no discounts, tax or currency logic.
- `DEP-S0805` (export . GlassProductRecommendations, removed in 5.0.0): GlassProductRecommendations is removed in 5.0; compose the commerce registry blocks (5.1) on Card and CarouselRail instead.
- `DEP-S0806` (export . GlassEcommerceProvider, removed in 5.0.0): GlassEcommerceProvider is removed in 5.0; keep commerce state in your app — the 5.x commerce registry blocks take data by props only.
- `DEP-S0807` (export . GlassTeamCursors, removed in 5.0.0): GlassTeamCursors is removed in 5.0; use the presence-stack registry item (5.1) — it only drew three fake cursors with no data input.
- `DEP-S0808` (export . GlassTeamCursorsWithEffects, removed in 5.0.0): GlassTeamCursorsWithEffects is removed in 5.0; use the presence-stack registry item (5.1) — the effect variant layered static circles on fake cursors.
- `DEP-S0809` (export . GlassCollaborativeComments, removed in 5.0.0): GlassCollaborativeComments is removed in 5.0; use the comment-thread registry item (5.1) — spatial pins become an anchored-popover primitive.
- `DEP-S0810` (export . GlassUserPresence, removed in 5.0.0): GlassUserPresence is removed in 5.0; use the presence-stack registry item (5.1) — deterministic ids replace its random presence colours.
- `DEP-S0811` (export . GlassPresenceIndicator, removed in 5.0.0): GlassPresenceIndicator is removed in 5.0; use the presence-stack registry item (5.1).
- `DEP-S0812` (export . GlassLiveCursorPresence, removed in 5.0.0): GlassLiveCursorPresence is removed in 5.0; render live cursors from your own presence channel through the presence-stack registry item (5.1).
- `DEP-S0813` (export . GlassCollaborativeCursor, removed in 5.0.0): GlassCollaborativeCursor is removed in 5.0; render live cursors from your own presence channel through the presence-stack registry item (5.1).

## Commits since v4.1.0

### Added

- 4.x release notes open with moved dependencies (REQ-PLAT-56)
- port sync-fragments to release/4.x (REQ-FIN-13)
- port #126 FIN-B CI plumbing to release/4.x (REQ-FIN-20/21/22/23/25/26, R1)
- CMP fragment — 166 DEP-C rows for all §7 names (REQ-CMP-132)
- drop useGalileoStateSpring + consent lifecycle + remote reduce spec (PLAT-103/104/105)
- real App Router + Vite apps, all subpaths, wired (REQ-PLAT-63)
- breaking-register coverage + release-notes + tag gates (REQ-PLAT-62)
- doctor --v5 built on checks.ts + add prints replacement once (REQ-PLAT-61)
- missing DEP-P rows + warnDeprecated callsites (REQ-PLAT-58)
- real forms/data entries + gzip budget ratchet + side-effect report (REQ-PLAT-57)
- react-hook-form to optional peer only; diet gate + classify cases (REQ-PLAT-56)
- assertJwtSecret(process.env) first in server/index.ts (REQ-PLAT-53)
- hydration-safe init + Slot ref by React.version (REQ-PLAT-46)
- client-entries.json generated + RSC canary (REQ-PLAT-45)
- enabled param on useOptionalInteractionRecorder + hooks-order test (REQ-PLAT-44)
- ContrastGuard honest 'unverified' status only (REQ-PLAT-43)
- GlassCanvas string-action dev warning + isStorybookDataMedia removal (REQ-PLAT-42)
- jsdom import side-effect gate — shrink-only {effects:[{symbol,kind}]} baseline (REQ-PLAT-41)
- opt-in tracking lifecycle — start()/disable(), capped buffers, disposer (REQ-PLAT-40)
- REQ-FIN-10 classify-change — visual-class report reach + missing-report error on 4x>=4.2.0
- 4.3.0 surface + CLI move + frozen consumer-4x fixture (PLAT-156..167)
- 4.2.0 optional-peer diet + deprecation warnings (PLAT-141..155,163)
- cherry-pick @auraglass/cli for the 4.3 @auraglass/cli@0.x publish (PLAT-349)
- line-neutral release tooling on 4.x (1c-REL port)
- 1a-CI — full §4.2 GitLab job set, pages, npm OIDC publishing toolchain
- bridge-4x tokens + bridge H cells on release/4.x (MAT-327/362)
- complete DEP-S0600..S0632 rows — compat + removed media/backdrop names
- deprecate absorbed 4.x media/backdrop exports (DEP-S0600..S0628)
- deprecate absorbed 4.x AI/chat exports (DEP-S0400..S0422)
- 4.x motion-no-empty-animate lint rule at error severity (MAT-186)
- deprecate absorbed 4.x data/date/charts exports (DEP-S0200..S0248)
- preview-v5 css scoped under [data-ag-preview=v5] (MAT-177/178)
- deprecate absorbed 4.x shell/navigation exports (DEP-S0001..S0026)
- deprecations fragment skeleton + W5 rows DEP-S0800..0809
- deprecations fragment skeleton + 187 rows DEP-M0800..0986

### Fixed

- no optional-peer access at module load (GlassForm, Chart.js registration); root jest skips workspaces
- optional peers as devDeps, CLI workspace, workers/ artifact, verify-pack client-entries path
- workspace import merge break, npm ci without iltorb, react19 legs on React 19, pack-matrix runs verify half
- quote verify-codemods echo (plain scalar with ': ')
- valid 4.x batch CI YAML; contract/*4x* runs the 4x line; CLI publish under plat:publish:npm
- PerformanceMonitor samples FPS on demand instead of a perpetual rAF loop
- visual-fixes contrast pending on plat:test:visual-4x; behavioural PLAT-59 tests
- PLAT-41 gate runs on Node >=21 and its test ships its fixtures
- default persona system font stack on 4.x (REQ-PLAT-54 font hunk)
- 4.x specifics for the FIN-B port (REQ-FIN-21/25/26)
- MAT 4.x fragment passes contract:ci-fragments (D.3-02 4.x)
- flag + convert empty-object reduced-motion branches (REQ-PLAT-48)
- trim FIN-A classify-change hunks from PLAT-56; portable diet test
- workspace destructure, FPS loops, prefers-contrast, on-surface, switch shimmer (REQ-PLAT-59)
- remove Aeonik — full system stack everywhere (REQ-PLAT-54)
- 4.1.1 patch-scope surface + deprecation set + publish guard (PLAT-133..138)
- remove destructive autofix, restore base surface styles
- reduced-motion visibility for all 84 sites + cookie/palette fixes (PLAT-097..107)
- hoist all conditional hook calls + useOptional context readers (PLAT-085..091)
- client entry directives, hydration helpers, GlassInput hook order
- adaptive AI opt-in, no string-code execution, honest contrast states
- parse npm>=11 pack --json output
- line-aware CI test guards; pin playwright image to 4.x install
- quote lazy loading attr in DEP-S0617
- quote preset names in DEP-S0600 rows
- consumer-4x cases — controls/overlays/registry usage (CMP-426)
- correct W5 deprecation rows to real 4.x exports
- deprecations fragment rows audited against real 4.1 exports
- bootstrap CI + fragments on release/4.x

