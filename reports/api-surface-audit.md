# API Surface Audit

Generated: 2026-05-07T16:45:40.155Z

## Summary

- Public root exports audited: 797
- Public source files audited: 416
- Public declaration files audited: 416
- Public source files with explicit `any`: 168
- Public source explicit `any` count: 851
- Public declaration files with explicit `any`: 1
- Public declaration explicit `any` count: 1
- Component-like value exports checked for ref signals: 421
- Non-support component exports needing ref-forwarding review: 129
- Provider/support exports needing intentional no-ref review: 32
- Declaration files missing React type references: 0

## Public Declaration Files With `any`

- dist/primitives/OptimizedGlassCore.d.ts: 1

## Public Source Files With `any`

- src/components/interactive/GlassChat.tsx: 18
- src/components/advanced/GlassContextualEngine.tsx: 17
- src/components/charts/GlassAreaChart.tsx: 17
- src/components/houdini/HoudiniGlassProvider.tsx: 17
- src/hooks/extended/useZSpaceAnimation.ts: 17
- src/components/atmospheric/GlassAuroraDisplay.tsx: 14
- src/components/immersive/GlassFluidSimulation.tsx: 14
- src/components/layouts/GlassIslandLayout.tsx: 14
- src/components/layouts/GlassMasonryGrid.tsx: 14
- src/components/ai/GlassMusicVisualizer.tsx: 13
- src/components/modal/GlassDrawer.tsx: 13
- src/components/social/GlassVoiceWaveform.tsx: 13
- src/components/atmospheric/GlassNebulaClouds.tsx: 12
- src/components/immersive/GlassVortexPortal.tsx: 12
- src/components/atmospheric/GlassBiomeSimulator.tsx: 11
- src/components/modal/GlassDialog.tsx: 11
- src/components/quantum/GlassProbabilityCloud.tsx: 11
- src/components/advanced/GlassEyeTracking.tsx: 10
- src/components/ai/GlassDeepDreamGlass.tsx: 10
- src/components/interactive/GlassCarousel.tsx: 10
- src/components/modal/GlassModal.tsx: 10
- src/hooks/extended/useDraggableListPhysics.ts: 10
- src/hooks/useAccessibilitySettings.ts: 10
- src/utils/soundDesign.ts: 10
- src/components/atmospheric/GlassWeatherGlass.tsx: 9
- src/components/interactive/GlassA11yAuditor.tsx: 9
- src/components/interactive/GlassGradientPicker.tsx: 9
- src/components/navigation/GlassHeader.tsx: 9
- src/components/navigation/GlassTabs.tsx: 9
- src/components/accessibility/GlassFocusIndicators.tsx: 8
- ... 138 more

## Component Ref Follow-Ups

- GlassFocusIndicators (src/components/accessibility/GlassFocusIndicators.tsx)
- BrandColorIntegration (src/components/advanced/BrandColorIntegration.tsx)
- GlassContextAware (src/components/advanced/GlassContextAware.tsx)
- GlassContextualDashboard (src/components/advanced/GlassContextualEngine.tsx)
- AdaptiveGlass (src/components/advanced/GlassEngine.tsx)
- EnvironmentalGlass (src/components/advanced/GlassEngine.tsx)
- GlassColorTinting (src/components/advanced/GlassEngine.tsx)
- GlassEngineDemo (src/components/advanced/GlassEngine.tsx)
- GlassTextureVariations (src/components/advanced/GlassEngine.tsx)
- GlassFoldableSupport (src/components/advanced/GlassFoldableSupport.tsx)
- GlassLiveCursorPresence (src/components/advanced/GlassLiveCursorPresence.tsx)
- GlassMetaDashboard (src/components/advanced/GlassMetaEngine.tsx)
- GlassNeuroFeedback (src/components/advanced/GlassNeuroSync.tsx)
- GlassNeuroMetricsDashboard (src/components/advanced/GlassNeuroSync.tsx)
- GlassOrientationEffects (src/components/advanced/GlassOrientationEffects.tsx)
- BatteryAwareGlass (src/components/advanced/GlassPerformanceOptimization.tsx)
- EfficientGlassRendering (src/components/advanced/GlassPerformanceOptimization.tsx)
- GlassPerformanceMonitor (src/components/advanced/GlassPerformanceOptimization.tsx)
- GlassPerformanceOptimization (src/components/advanced/GlassPerformanceOptimization.tsx)
- LazyGlassLoading (src/components/advanced/GlassPerformanceOptimization.tsx)
- ProgressiveGlassEnhancement (src/components/advanced/GlassPerformanceOptimization.tsx)
- ReducedMotionGlass (src/components/advanced/GlassPerformanceOptimization.tsx)
- GlassPredictionIndicator (src/components/advanced/GlassPredictiveEngine.tsx)
- GlassReactions (src/components/advanced/GlassReactions.tsx)
- GlassSelfHealingDashboard (src/components/advanced/GlassSelfHealingSystem.tsx)
- GlassSelfHealingWrapper (src/components/advanced/GlassSelfHealingSystem.tsx)
- GlassAudioReactive (src/components/advanced/GlassSpatialAudio.tsx)
- GlassSpatialAudio (src/components/advanced/GlassSpatialAudio.tsx)
- GlassSpatialVisualizer (src/components/advanced/GlassSpatialAudio.tsx)
- GlassWebGLShader (src/components/advanced/GlassWebGLShader.tsx)
- LiquidGlassGPU (src/components/advanced/LiquidGlassGPU.tsx)
- LiquidGlassGPUDriver (src/components/advanced/LiquidGlassGPU.tsx)
- LivingEcosystemSimulator (src/components/advanced/LivingEcosystemSimulator.tsx)
- MolecularBondingInterface (src/components/advanced/MolecularBondingInterface.tsx)
- MultiDimensionalGestureRecognizer (src/components/advanced/MultiDimensionalGestureRecognizer.tsx)
- GlassIntelligentFormBuilder (src/components/ai/GlassIntelligentFormBuilder.tsx)
- NeuralWeightVisualization (src/components/ai/NeuralWeightVisualization.tsx)
- NeuromorphicLearningNetwork (src/components/ai/NeuromorphicLearningNetwork.tsx)
- GlassTransitions (src/components/animations/GlassTransitions.tsx)
- GlassCalendar (src/components/calendar/GlassCalendar.tsx)
- ... 89 more

## Provider/Support Ref Follow-Ups

- AccessibilityProvider (src/components/accessibility/AccessibilityProvider.tsx)
- GlassContextualEngine (src/components/advanced/GlassContextualEngine.tsx)
- GlassContextualEngineProvider (src/components/advanced/GlassContextualEngine.tsx)
- GlassEngine (src/components/advanced/GlassEngine.tsx)
- GlassEngineProvider (src/components/advanced/GlassEngine.tsx)
- GlassOpacityEngine (src/components/advanced/GlassEngine.tsx)
- GlassMetaEngineProvider (src/components/advanced/GlassMetaEngine.tsx)
- GlassNeuroSyncProvider (src/components/advanced/GlassNeuroSync.tsx)
- GlassPerformanceProvider (src/components/advanced/GlassPerformanceOptimization.tsx)
- GlassPredictiveEngine (src/components/advanced/GlassPredictiveEngine.tsx)
- GlassPredictiveEngineProvider (src/components/advanced/GlassPredictiveEngine.tsx)
- GlassSelfHealingProvider (src/components/advanced/GlassSelfHealingSystem.tsx)
- GlassSpatialAudioProvider (src/components/advanced/GlassSpatialAudio.tsx)
- AIGlassThemeProvider (src/components/ai/AIGlassThemeProvider.tsx)
- GalileoElementInteractionPlugin (src/components/charts/plugins/GalileoElementInteractionPlugin.ts)
- GlassCollaborationProvider (src/components/collaboration/CollaborativeGlassWorkspace.tsx)
- GlassEcommerceProvider (src/components/ecommerce/GlassEcommerceProvider.tsx)
- Glass3DEngine (src/components/effects/Glass3DEngine.tsx)
- GlassMorphingEngine (src/components/effects/GlassMorphingEngine.tsx)
- GlassPhysicsEngine (src/components/effects/GlassPhysicsEngine.tsx)
- GlassImageProcessingProvider (src/components/image/GlassImageProcessingProvider.tsx)
- GlassMediaProvider (src/components/media/GlassMediaProvider.tsx)
- QuantumNeuromorphicEngine (src/components/quantum/QuantumNeuromorphicEngine.ts)
- SpatialComputingEngine (src/components/spatial/SpatialComputingEngine.tsx)
- AuraGlassClientBoundary (src/components/ssr/AuraGlassClientBoundary.tsx)
- PersonaPicker (src/components/theme/PersonaPicker.tsx)
- AnimationProvider (src/contexts/AnimationContext.tsx)
- ConsciousnessStreamProvider (src/contexts/ConsciousnessStreamProvider.tsx)
- MotionPreferenceProvider (src/contexts/MotionPreferenceContext.tsx)
- LiquidGlassLayerProvider (src/primitives/LiquidGlassLayerProvider.tsx)
- GlassContext (src/theme/GlassContext.tsx)
- ThemeProvider (src/theme/ThemeProvider.tsx)

