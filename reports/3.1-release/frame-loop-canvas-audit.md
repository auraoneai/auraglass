# 3.1 Frame Loop, Canvas, Audio, and WebGL Audit

Generated: 2026-05-12T19:20:13.118Z

## Summary

- Scanned root: src
- Scanned files: 671
- Files with frame/canvas/audio/WebGL signals: 106
- Component files with signals: 73
- Review-required files: 18
- Findings: 18
- Strict mode: no

## Category Totals

- frameLoop: 246
- canvas: 229
- readback: 24
- audioAnalyser: 49
- webgl: 219

## Findings

- review-required: canvas-or-gpu-readback-review at src/components/advanced/GlassProgressiveEnhancement.tsx:282 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ai/GlassDeepDreamGlass.tsx:342 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ai/GlassGANGenerator.tsx:384 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ai/GlassGenerativeArt.tsx:379 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ai/GlassLiveFilter.tsx:693 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ai/GlassStyleTransfer.tsx:262 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/ar/ARGlassEffects.r3f.tsx:516 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/charts/GlassDataChart.tsx:1724 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/charts/ModularGlassDataChart.tsx:786 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/interactive/GlassDrawingCanvas.tsx:445 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/interactive/GlassPatternBuilder.tsx:491 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/interactive/GlassSignaturePad.tsx:287 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/components/interactive/GlassWhiteboard.tsx:645 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/utils/browserCompatibility.ts:56 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/utils/compatibility.ts:243 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/utils/contrastGuard.ts:300 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/utils/deviceCapabilities.ts:138 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.
- review-required: canvas-or-gpu-readback-review at src/utils/smartColorExtraction.ts:104 (readback) - Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.

## Inventory

- guarded-or-explicit: src/animations/hooks/useAnimationSequenceBasic.ts - frameLoop:6; guards: isPlaying:12, paused:6
- guarded-or-explicit: src/animations/hooks/useMultiSpringBasic.ts - frameLoop:4; guards: none
- guarded-or-explicit: src/animations/orchestration/useAnimationSequenceOrchestrator.ts - frameLoop:7; guards: isPlaying:14, paused:6
- guarded-or-explicit: src/animations/physics/chartAnimations.ts - frameLoop:9; guards: none
- guarded-or-explicit: src/animations/physics/galileoPhysicsSystem.ts - frameLoop:2; guards: paused:4
- guarded-or-explicit: src/animations/physics/useMultiSpringPhysics.ts - frameLoop:4; guards: none
- inventory: src/components/advanced/GlassMeshGradient.tsx - canvas:3; guards: prefersReducedMotion:2, useReducedMotion:3, shouldAnimate:4
- guarded-or-explicit: src/components/advanced/GlassParallaxLayers.tsx - frameLoop:2; guards: prefersReducedMotion:16, useReducedMotion:3
- inventory: src/components/advanced/GlassParticles.tsx - canvas:4; guards: prefersReducedMotion:2, useReducedMotion:3, shouldAnimate:2
- guarded-or-explicit: src/components/advanced/GlassPerformanceOptimization.tsx - frameLoop:3; guards: prefers-reduced-motion:1, useReducedMotion:2, reducedMotion:5, performanceMode:18
- review-required: src/components/advanced/GlassProgressiveEnhancement.tsx - frameLoop:4, canvas:4, readback:1, webgl:2; guards: prefersReducedMotion:5, prefers-reduced-motion:1, useReducedMotion:4, reducedMotion:3, enableAnimation:3
- guarded-or-explicit: src/components/advanced/GlassQuantumStates.tsx - frameLoop:2, canvas:3; guards: prefersReducedMotion:16, useReducedMotion:8
- guarded-or-explicit: src/components/advanced/GlassReactions.tsx - frameLoop:3; guards: prefersReducedMotion:17, useReducedMotion:6
- inventory: src/components/advanced/GlassSelfHealingSystem.tsx - canvas:3; guards: prefersReducedMotion:7, useReducedMotion:5
- guarded-or-explicit: src/components/advanced/GlassSpatialAudio.tsx - frameLoop:1, canvas:2, audioAnalyser:9; guards: prefersReducedMotion:7, useReducedMotion:5, isPlaying:9
- guarded-or-explicit: src/components/advanced/GlassTrophyCase.tsx - audioAnalyser:2; guards: prefersReducedMotion:7, useReducedMotion:3
- guarded-or-explicit: src/components/advanced/GlassWebGLShader.tsx - frameLoop:3, canvas:4, webgl:17; guards: prefersReducedMotion:4, useReducedMotion:3, shouldAnimate:7
- guarded-or-explicit: src/components/advanced/IntelligentColorSystem.tsx - frameLoop:1, canvas:2; guards: prefersReducedMotion:13, useReducedMotion:4
- guarded-or-explicit: src/components/advanced/LiquidGlassGPU.tsx - frameLoop:3, canvas:12, webgl:11; guards: useReducedMotion:2
- review-required: src/components/ai/GlassDeepDreamGlass.tsx - frameLoop:3, canvas:8, readback:2; guards: prefersReducedMotion:2, useReducedMotion:3, useMotionPreference:3, shouldAnimate:9, enableAnimation:7
- review-required: src/components/ai/GlassGANGenerator.tsx - canvas:7, readback:1; guards: prefersReducedMotion:4, useReducedMotion:3, useMotionPreference:3, shouldAnimate:10
- review-required: src/components/ai/GlassGenerativeArt.tsx - canvas:3, readback:2; guards: prefersReducedMotion:4, useReducedMotion:3, useMotionPreference:3, shouldAnimate:5
- review-required: src/components/ai/GlassLiveFilter.tsx - frameLoop:2, canvas:6, readback:3; guards: prefersReducedMotion:1, useReducedMotion:3, useMotionPreference:3, shouldAnimate:9, paused:3
- guarded-or-explicit: src/components/ai/GlassMusicVisualizer.tsx - frameLoop:4, canvas:4, audioAnalyser:7; guards: prefersReducedMotion:5, useReducedMotion:3, useMotionPreference:3, shouldAnimate:9, isPlaying:6
- review-required: src/components/ai/GlassStyleTransfer.tsx - canvas:3, readback:1; guards: prefersReducedMotion:2, useReducedMotion:3, useMotionPreference:3, shouldAnimate:9
- guarded-or-explicit: src/components/animations/GlassMotionController.tsx - frameLoop:4; guards: prefersReducedMotion:5, useReducedMotion:2, reduceMotion:16
- guarded-or-explicit: src/components/ar/ARGlassEffects.helpers.ts - webgl:30; guards: none
- review-required: src/components/ar/ARGlassEffects.r3f.tsx - frameLoop:5, canvas:1, readback:1, webgl:46; guards: prefersReducedMotion:6, useReducedMotion:4
- guarded-or-explicit: src/components/atmospheric/GlassAuroraDisplay.tsx - frameLoop:3, canvas:3; guards: prefersReducedMotion:3, useReducedMotion:2
- guarded-or-explicit: src/components/atmospheric/GlassBiomeSimulator.tsx - frameLoop:3, canvas:3; guards: prefersReducedMotion:3, useReducedMotion:2
- guarded-or-explicit: src/components/atmospheric/GlassNebulaClouds.tsx - frameLoop:3, canvas:3; guards: prefersReducedMotion:3
- guarded-or-explicit: src/components/atmospheric/GlassWeatherGlass.tsx - frameLoop:3, canvas:3; guards: prefersReducedMotion:3, useReducedMotion:2
- guarded-or-explicit: src/components/backgrounds/ParticleBackground.tsx - frameLoop:2, canvas:3; guards: prefersReducedMotion:3, useReducedMotion:3
- guarded-or-explicit: src/components/button/GlassMagneticButton.tsx - frameLoop:8; guards: prefersReducedMotion:8, prefers-reduced-motion:1
- review-required: src/components/charts/GlassDataChart.tsx - canvas:4, readback:1; guards: prefers-reduced-motion:1, isReducedMotion:7, reducedMotion:1
- review-required: src/components/charts/ModularGlassDataChart.tsx - frameLoop:2, canvas:3, readback:1; guards: useReducedMotion:2, isReducedMotion:6, reducedMotion:1
- guarded-or-explicit: src/components/charts/components/AtmosphericEffects.tsx - frameLoop:3; guards: isReducedMotion:8
- guarded-or-explicit: src/components/charts/components/ChartRenderer.tsx - frameLoop:2, canvas:2; guards: isReducedMotion:4
- guarded-or-explicit: src/components/charts/hooks/useChartPhysicsInteraction.ts - frameLoop:3; guards: none
- guarded-or-explicit: src/components/charts/hooks/usePhysicsAnimation.ts - frameLoop:5; guards: none
- guarded-or-explicit: src/components/dashboard/DimensionalDashboardContainer.tsx - frameLoop:3; guards: prefersReducedMotion:7, prefers-reduced-motion:1, useReducedMotion:3
- guarded-or-explicit: src/components/data-display/GlassAccordion.tsx - frameLoop:1; guards: prefersReducedMotion:2, shouldAnimate:2, performanceMode:1
- guarded-or-explicit: src/components/data-display/GlassAnimatedNumber.tsx - frameLoop:7; guards: useReducedMotion:2
- guarded-or-explicit: src/components/effects/AuroraPro.r3f.tsx - frameLoop:1, canvas:1, webgl:40; guards: prefersReducedMotion:8, useReducedMotion:5, isPlaying:11
- guarded-or-explicit: src/components/effects/GlassPhysicsEngine.tsx - frameLoop:2, canvas:3; guards: prefersReducedMotion:2, useReducedMotion:3, shouldAnimate:5
- guarded-or-explicit: src/components/effects/GlassShatterEffects.r3f.tsx - frameLoop:1, canvas:1, webgl:30; guards: prefersReducedMotion:6, useReducedMotion:4
- guarded-or-explicit: src/components/effects/SeasonalParticles.r3f.tsx - frameLoop:1, canvas:1, webgl:31; guards: prefersReducedMotion:6, useReducedMotion:3, isPlaying:7
- inventory: src/components/image/GlassImageProcessingProvider.tsx - canvas:3; guards: none
- guarded-or-explicit: src/components/immersive/Glass360Viewer.tsx - frameLoop:3, canvas:3; guards: useMotionPreference:3, shouldAnimate:2, paused:3, performanceMode:2
- guarded-or-explicit: src/components/immersive/GlassARPreview.tsx - frameLoop:2, canvas:3; guards: useReducedMotion:2, useMotionPreference:3, shouldAnimate:3
- guarded-or-explicit: src/components/immersive/GlassFluidSimulation.tsx - frameLoop:4, canvas:6; guards: prefersReducedMotion:5, paused:3
- guarded-or-explicit: src/components/immersive/GlassHologram.tsx - frameLoop:2; guards: prefersReducedMotion:13
- guarded-or-explicit: src/components/immersive/GlassParticleField.tsx - frameLoop:4, canvas:4; guards: prefersReducedMotion:2, shouldAnimate:4, isPlaying:6, paused:7
- guarded-or-explicit: src/components/immersive/GlassVortexPortal.tsx - frameLoop:3, canvas:4; guards: prefersReducedMotion:3, useReducedMotion:2
- guarded-or-explicit: src/components/interactive/CursorGlow.tsx - frameLoop:2; guards: useReducedMotion:3
- inventory: src/components/interactive/GlassColorWheel.tsx - canvas:12; guards: prefersReducedMotion:1
- review-required: src/components/interactive/GlassDrawingCanvas.tsx - canvas:6, readback:1; guards: prefersReducedMotion:1, useReducedMotion:2
- guarded-or-explicit: src/components/interactive/GlassGestureZone.tsx - frameLoop:2, canvas:7; guards: prefersReducedMotion:3
- review-required: src/components/interactive/GlassPatternBuilder.tsx - frameLoop:1, canvas:7, readback:1; guards: prefersReducedMotion:3
- review-required: src/components/interactive/GlassSignaturePad.tsx - canvas:6, readback:2; guards: useReducedMotion:2, useMotionPreference:3, shouldAnimate:2
- guarded-or-explicit: src/components/interactive/GlassSpotlight.tsx - frameLoop:3; guards: prefersReducedMotion:2, prefers-reduced-motion:1, useReducedMotion:3, shouldAnimate:5
- guarded-or-explicit: src/components/interactive/GlassVoiceInput.tsx - frameLoop:3, canvas:3, audioAnalyser:8; guards: prefersReducedMotion:5, useReducedMotion:2
- review-required: src/components/interactive/GlassWhiteboard.tsx - canvas:6, readback:1; guards: useReducedMotion:2
- guarded-or-explicit: src/components/layout/OptimizedGlassContainer.tsx - frameLoop:3; guards: prefersReducedMotion:2, useReducedMotion:3, performanceMode:7
- guarded-or-explicit: src/components/layouts/GlassFractalLayout.tsx - frameLoop:3; guards: prefersReducedMotion:4, useMotionPreference:3
- guarded-or-explicit: src/components/layouts/GlassIslandLayout.tsx - frameLoop:3, canvas:3; guards: prefersReducedMotion:3, useReducedMotion:3, useMotionPreference:3, shouldAnimate:10
- guarded-or-explicit: src/components/layouts/GlassOrbitalMenu.tsx - frameLoop:3; guards: prefersReducedMotion:9, useMotionPreference:3
- guarded-or-explicit: src/components/layouts/GlassTessellation.tsx - frameLoop:3; guards: prefersReducedMotion:4, useReducedMotion:2, useMotionPreference:3
- guarded-or-explicit: src/components/media/GlassAdvancedAudioPlayer.tsx - frameLoop:3, canvas:9, audioAnalyser:8; guards: isPlaying:17
- guarded-or-explicit: src/components/navigation/GlassPagination.tsx - frameLoop:1; guards: performanceMode:2
- guarded-or-explicit: src/components/navigation/GlassTabBar.tsx - frameLoop:3; guards: isReducedMotion:4, reducedMotion:1, disableAnimation:3
- guarded-or-explicit: src/components/navigation/GlassTabs.tsx - frameLoop:1; guards: performanceMode:1
- inventory: src/components/quantum/GlassProbabilityCloud.tsx - canvas:4; guards: prefersReducedMotion:4, useReducedMotion:3, useMotionPreference:3, shouldAnimate:2
- guarded-or-explicit: src/components/quantum/GlassQuantumField.tsx - frameLoop:3, canvas:4; guards: prefersReducedMotion:3, useReducedMotion:2
- inventory: src/components/quantum/GlassQuantumTunnel.tsx - canvas:3; guards: prefersReducedMotion:5, useReducedMotion:3, useMotionPreference:3, shouldAnimate:2
- guarded-or-explicit: src/components/quantum/GlassWaveFunction.tsx - frameLoop:3, canvas:10; guards: useMotionPreference:3, shouldAnimate:3
- guarded-or-explicit: src/components/social/GlassReactionBubbles.tsx - frameLoop:2; guards: prefersReducedMotion:8, useReducedMotion:3, useMotionPreference:3, shouldAnimate:8
- inventory: src/components/social/GlassSharedWhiteboard.tsx - canvas:5; guards: prefersReducedMotion:2, useReducedMotion:3, useMotionPreference:3, shouldAnimate:2
- guarded-or-explicit: src/components/social/GlassVoiceWaveform.tsx - frameLoop:3; guards: prefersReducedMotion:2, useReducedMotion:3, useMotionPreference:3, shouldAnimate:4
- guarded-or-explicit: src/components/spatial/SpatialComputingEngine.tsx - frameLoop:5; guards: prefersReducedMotion:1, useReducedMotion:3
- guarded-or-explicit: src/components/tree-view/TreeItem.tsx - frameLoop:2; guards: prefersReducedMotion:2, useReducedMotion:3, disableAnimation:3
- guarded-or-explicit: src/components/website-components/GlassWipeSlider.tsx - frameLoop:5; guards: useReducedMotion:2, useMotionPreference:1
- guarded-or-explicit: src/core/mixins/performanceMixins.ts - frameLoop:1; guards: prefersReducedMotion:16, prefers-reduced-motion:1, paused:1
- guarded-or-explicit: src/core/productionCore.ts - frameLoop:4; guards: prefers-reduced-motion:2, reducedMotion:3
- guarded-or-explicit: src/hooks/extended/use3DTransform.ts - frameLoop:5; guards: none
- guarded-or-explicit: src/hooks/extended/useAmbientTilt.ts - frameLoop:1; guards: prefersReducedMotion:9, useReducedMotion:3
- guarded-or-explicit: src/hooks/extended/useGalileoSprings.ts - frameLoop:1; guards: none
- guarded-or-explicit: src/hooks/extended/useGlassPerformance.ts - frameLoop:3; guards: animationEnabled:1
- guarded-or-explicit: src/hooks/extended/useMagneticElement.ts - frameLoop:5; guards: prefersReducedMotion:7, useReducedMotion:3
- guarded-or-explicit: src/hooks/useEnhancedPerformance.ts - frameLoop:2; guards: IntersectionObserver:2, isIntersecting:5, performanceMode:11
- guarded-or-explicit: src/hooks/useGlassParallax.ts - frameLoop:3; guards: none
- guarded-or-explicit: src/hooks/useLiquidGlassBackdrop.ts - frameLoop:2; guards: none
- guarded-or-explicit: src/hooks/usePerformance.ts - frameLoop:3; guards: prefers-reduced-motion:1
- guarded-or-explicit: src/hooks/usePhysicsInteraction.ts - frameLoop:3; guards: shouldAnimate:12
- guarded-or-explicit: src/physics/AuraPhysicsEngine.ts - frameLoop:2; guards: none
- guarded-or-explicit: src/tests/consciousness/ConsciousnessPerformanceBenchmark.tsx - frameLoop:1; guards: none
- review-required: src/utils/browserCompatibility.ts - canvas:6, readback:1, audioAnalyser:2, webgl:5; guards: IntersectionObserver:2
- review-required: src/utils/compatibility.ts - canvas:1, readback:1; guards: prefers-reduced-motion:1
- guarded-or-explicit: src/utils/consciousnessOptimization.ts - audioAnalyser:6; guards: none
- review-required: src/utils/contrastGuard.ts - canvas:3, readback:1; guards: none
- review-required: src/utils/deviceCapabilities.ts - canvas:4, readback:1, audioAnalyser:2, webgl:5; guards: prefersReducedMotion:1, prefers-reduced-motion:1, reduceMotion:1
- guarded-or-explicit: src/utils/performance.ts - frameLoop:2; guards: IntersectionObserver:1, isIntersecting:1
- guarded-or-explicit: src/utils/performanceOptimizations.ts - frameLoop:6, canvas:2; guards: IntersectionObserver:1, isIntersecting:1
- review-required: src/utils/smartColorExtraction.ts - canvas:3, readback:2; guards: none
- guarded-or-explicit: src/utils/soundDesign.ts - audioAnalyser:5; guards: none
- guarded-or-explicit: src/utils/ssr.ts - frameLoop:2, canvas:3, webgl:2; guards: none

## Gate Notes

- This is a source audit gate for 3.1 release-candidate evidence.
- Default mode is report-only so release owners can inventory risk without blocking unrelated work.
- Run `npm run audit:3.1-frame-loop:strict` to fail on review-required findings.
- A file is flagged when a production component has frame-loop, readback, audio analyser, or WebGL signals and lacks obvious reduced-motion or explicit animation guard terms.
