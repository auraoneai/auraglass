// AuraGlass Design System - Main Exports
// A comprehensive collection of glassmorphism UI components

// Core Glass Primitives
export { GlassAdvanced } from "./primitives/glass/GlassAdvanced";
export { OptimizedGlassAdvanced } from "./primitives/glass/OptimizedGlassAdvanced";
export {
  GlassCore as Glass,
  default as GlassPrimitive,
} from "./primitives/GlassCore";
export { MotionFramer } from "./primitives/motion/MotionFramer";
export { MotionNative as Motion } from "./primitives/MotionNative";
export { OptimizedGlassCore as OptimizedGlass } from "./primitives/OptimizedGlassCore";
export { LiquidGlassMaterial } from "./primitives/LiquidGlassMaterial";

// Localization Provider
export { GlassLocalizationProvider } from "./lib/GlassLocalizationProvider";

// Theme Components
export { GlassContext } from "./theme/GlassContext";
export { ThemeProvider } from "./theme/ThemeProvider";

// Layout & Structure Components
export { GlassAppShell } from "./components/layout/GlassAppShell";
export { ContentSection } from "./components/layout/GlassAppShell";
export { Box } from "./components/layout/Box";
export { GlassBox } from "./components/layout/GlassBox";
export { GlassContainer } from "./components/layout/GlassContainer";
export { GlassFlex } from "./components/layout/GlassFlex";
export { GlassGrid } from "./components/layout/GlassGrid";
export { GlassMasonry } from "./components/layout/GlassMasonry";
export { GlassScrollArea } from "./components/layout/GlassScrollArea";
export { GlassSeparator } from "./components/layout/GlassSeparator";
export { GlassSplitPane } from "./components/layout/GlassSplitPane";
export { GlassStack } from "./components/layout/GlassStack";
export { HStack } from "./components/layout/HStack";
export { VStack } from "./components/layout/VStack";
export { OptimizedGlassContainer } from "./components/layout/OptimizedGlassContainer";
export { ZSpaceAppLayout } from "./components/layout/ZSpaceAppLayout";

// Navigation & Chrome Components
export { GlassBottomNav } from "./components/navigation/GlassBottomNav";
export { GlassBreadcrumb } from "./components/navigation/GlassBreadcrumb";
export { GlassCommandBar } from "./components/navigation/GlassCommandBar";
export { GlassContextMenu } from "./components/navigation/GlassContextMenu";
export { GlassDropdownMenu } from "./components/navigation/GlassDropdownMenu";
export { GlassHeader } from "./components/navigation/GlassHeader";
export { GlassMenubar } from "./components/navigation/GlassMenubar";
export { GlassMobileNav } from "./components/navigation/GlassMobileNav";
export { GlassNavigation } from "./components/navigation/GlassNavigation";
export { GlassNavigationMenu } from "./components/navigation/GlassNavigationMenu";
export { GlassPagination } from "./components/navigation/GlassPagination";
export { GlassResponsiveNav } from "./components/navigation/GlassResponsiveNav";
export { GlassResponsiveNav as ResponsiveNavigation } from "./components/navigation/GlassResponsiveNav"; // Alias export
export { GlassSegmentedControl } from "./components/navigation/GlassSegmentedControl";
export { GlassSidebar } from "./components/navigation/GlassSidebar";
export { GlassTabBar } from "./components/navigation/GlassTabBar";
export { GlassTabItem } from "./components/navigation/GlassTabItem";
export { GlassTabs } from "./components/navigation/GlassTabs";
export { EnhancedGlassTabs } from "./components/navigation/EnhancedGlassTabs";
export { GlassToolbar } from "./components/navigation/GlassToolbar";

// Modal & Overlay Components
export { GlassBottomSheet } from "./components/modal/GlassBottomSheet";
export { GlassDialog } from "./components/modal/GlassDialog";
export { GlassDrawer } from "./components/modal/GlassDrawer";
export { GlassHoverCard } from "./components/modal/GlassHoverCard";
export { GlassModal } from "./components/modal/GlassModal";
export { GlassPopover } from "./components/modal/GlassPopover";

// Form & Input Components
export { GlassCheckbox } from "./components/input/GlassCheckbox";
export { GlassCheckboxGroup } from "./components/input/GlassCheckboxGroup";
export { GlassColorPicker } from "./components/input/GlassColorPicker";
export { GlassDatePicker } from "./components/input/GlassDatePicker";
export { GlassDateRangePicker } from "./components/input/GlassDateRangePicker";
export { GlassForm } from "./components/input/GlassForm";
export { GlassFormStepper } from "./components/input/GlassFormStepper";
export { GlassFormTable } from "./components/input/GlassFormTable";
export { GlassInput } from "./components/input/GlassInput";
export { GlassLabel } from "./components/input/GlassLabel";
export { GlassMultiSelect } from "./components/input/GlassMultiSelect";
export { GlassMultiStepForm } from "./components/input/GlassMultiStepForm";
export { GlassRadioGroup } from "./components/input/GlassRadioGroup";
export { GlassSelect } from "./components/input/GlassSelect";
export { default as GlassSelectCompound } from "./components/input/GlassSelectCompound";
export { GlassSlider } from "./components/input/GlassSlider";
export { GlassStep } from "./components/input/GlassStep";
export { GlassStepIcon } from "./components/input/GlassStepIcon";
export { GlassStepLabel } from "./components/input/GlassStepLabel";
export { GlassSwitch } from "./components/input/GlassSwitch";
export { GlassTextarea } from "./components/input/GlassTextarea";
export { GlassToggle } from "./components/input/GlassToggle";
export { GlassWizard } from "./components/input/GlassWizard";

// Button & Card Components
export { GlassButton } from "./components/button/GlassButton";
export { GlassButton as Button } from "./components/button/GlassButton"; // Alias export
export { GlassCardLink } from "./components/card/glass-card-link";
export { GlassCard } from "./components/card/GlassCard";
export { GlassCard as Card } from "./components/card/GlassCard"; // Alias export
export { GlowingCard } from "./components/card/GlowingCard";

// Chart Components
export { GlassAreaChart } from "./components/charts/GlassAreaChart";
export { GlassBarChart } from "./components/charts/GlassBarChart";
export { GlassChart } from "./components/charts/GlassChart";
export { GlassDataChart } from "./components/charts/GlassDataChart";
export { GlassDataChart as DataChart } from "./components/charts/GlassDataChart"; // Alias export
export { GlassLineChart } from "./components/charts/GlassLineChart";
export { GlassPieChart } from "./components/charts/GlassPieChart";

// Data Display Components
export { GlassAccordion } from "./components/data-display/GlassAccordion";
export { GlassAlert } from "./components/data-display/GlassAlert";
export { GlassAvatar } from "./components/data-display/GlassAvatar";
export { GlassBadge } from "./components/data-display/GlassBadge";
export { GlassBadgeLine } from "./components/data-display/GlassBadgeLine";
export { GlassDataGrid } from "./components/data-display/GlassDataGrid";
export { GlassDataGridPro } from "./components/data-display/GlassDataGridPro";
export { GlassDataTable } from "./components/data-display/GlassDataTable";
export { GlassDiffViewer } from "./components/data-display/GlassDiffViewer";
export { GlassHeatmap } from "./components/data-display/GlassHeatmap";
export { GlassJSONViewer } from "./components/data-display/GlassJSONViewer";
export { GlassLoadingSkeleton } from "./components/data-display/GlassLoadingSkeleton";
export { GlassMetricChip } from "./components/data-display/GlassMetricChip";
export { GlassProgress } from "./components/data-display/GlassProgress";
export { GlassSchemaViewer } from "./components/data-display/GlassSchemaViewer";
export { GlassSparkline } from "./components/data-display/GlassSparkline";
export { GlassStatusDot } from "./components/data-display/GlassStatusDot";
export { GlassTimeline } from "./components/data-display/GlassTimeline";
export { GlassToast } from "./components/data-display/GlassToast";
export { GlassVirtualTable } from "./components/data-display/GlassVirtualTable";

// New Components - Phase 1 (High Priority)
export {
  GlassNotificationCenter,
  GlassNotificationItem,
  GlassNotificationProvider,
  useNotifications,
} from "./components/data-display/GlassNotificationCenter";
export {
  GlassSkeleton,
  GlassSkeletonAvatar,
  GlassSkeletonButton,
} from "./components/data-display/GlassSkeleton";
export {
  GlassSkeletonCard,
  GlassSkeletonLoader,
  GlassSkeletonText,
} from "./components/data-display/GlassSkeletonLoader";
export {
  GlassTooltip,
  GlassTooltipContent,
  GlassTooltipTrigger,
} from "./components/modal/GlassTooltip";

// New Components - Phase 2 (Medium Priority)
export {
  GlassAnimated,
  GlassAnimationSequence,
  GlassAnimationTimeline,
  GlassMotionController,
  animationPresets,
  useMotionController,
} from "./components/animations/GlassMotionController";
export {
  GlassAnimatedCounter,
  GlassAnimatedNumber,
  GlassAnimatedStat,
  useAnimatedNumber,
} from "./components/data-display/GlassAnimatedNumber";
export {
  GlassCodeEditor,
  GlassCodeEditorWithFiles,
} from "./components/interactive/GlassCodeEditor";
export { GlassColorSchemeGenerator } from "./components/interactive/GlassColorSchemeGenerator";

// New Components - Phase 3 (Future Phase)
export {
  GlassA11yAuditor,
  useA11yAudit,
} from "./components/interactive/GlassA11yAuditor";
export {
  GlassComponentPlayground,
  createPlaygroundExample,
  usePlaygroundExample,
} from "./components/interactive/GlassComponentPlayground";
export {
  GlassMindMap,
  useMindMap,
} from "./components/interactive/GlassMindMap";
export { GlassWhiteboard } from "./components/interactive/GlassWhiteboard";
export {
  HoudiniGlassProvider,
  useGlassEffect,
  useHoudiniGlass,
} from "./components/houdini/HoudiniGlassProvider";
export { glassPresets } from "./components/houdini/index";

// Interactive Components
export { GlassAdvancedSearch } from "./components/interactive/GlassAdvancedSearch";
export { GlassAvatarGroup } from "./components/interactive/GlassAvatarGroup";
export { GlassCarousel } from "./components/interactive/GlassCarousel";
export { GlassChat } from "./components/interactive/GlassChat";
export { GlassChatInput } from "./components/interactive/GlassChatInput";
export { GlassCoachmarks } from "./components/interactive/GlassCoachmarks";
export { GlassCommand } from "./components/interactive/GlassCommand";
export { GlassCommandPalette } from "./components/interactive/GlassCommandPalette";
export { GlassCommentThread } from "./components/interactive/GlassCommentThread";
export { GlassDraggable } from "./components/interactive/GlassDraggable";
export { GlassFacetSearch } from "./components/interactive/GlassFacetSearch";
export { GlassFileExplorer } from "./components/interactive/GlassFileExplorer";
export { GlassFileTree } from "./components/interactive/GlassFileTree";
export { GlassFileUpload } from "./components/interactive/GlassFileUpload";
export { GlassFilterPanel } from "./components/interactive/GlassFilterPanel";
export { GlassFocusRing } from "./components/interactive/GlassFocusRing";
export { GlassFormBuilder } from "./components/interactive/GlassFormBuilder";
export { GlassGallery } from "./components/interactive/GlassGallery";
export { GlassGradientPicker } from "./components/interactive/GlassGradientPicker";
export { GlassImageViewer } from "./components/interactive/GlassImageViewer";
export { GlassInfiniteScroll } from "./components/interactive/GlassInfiniteScroll";
export { GlassInlineEdit } from "./components/interactive/GlassInlineEdit";
export { GlassKanban } from "./components/interactive/GlassKanban";
export { GlassKeyValueEditor } from "./components/interactive/GlassKeyValueEditor";
export { GlassLazyImage } from "./components/interactive/GlassLazyImage";
export { GlassMentionList } from "./components/interactive/GlassMentionList";
export { GlassMessageList } from "./components/interactive/GlassMessageList";
export { GlassQueryBuilder } from "./components/interactive/GlassQueryBuilder";
export { GlassReactionBar } from "./components/interactive/GlassReactionBar";
export { GlassSearchInterface } from "./components/interactive/GlassSearchInterface";
export { GlassSpotlight } from "./components/interactive/GlassSpotlight";
export { GlassStepper } from "./components/interactive/GlassStepper";
export { GlassTagInput } from "./components/interactive/GlassTagInput";
export { GlassThemeDemo } from "./components/interactive/GlassThemeDemo";
export { GlassThemeSwitcher } from "./components/interactive/GlassThemeSwitcher";
export { GlassUserPresence } from "./components/interactive/GlassUserPresence";
export { GlassVideoPlayer } from "./components/interactive/GlassVideoPlayer";
export { GlassVirtualList } from "./components/interactive/GlassVirtualList";
export { GlassIntelligentFormBuilder } from "./components/ai/GlassIntelligentFormBuilder";

// Dashboard Components
export { GlassActivityFeed } from "./components/dashboard/GlassActivityFeed";
export { GlassChartWidget } from "./components/dashboard/GlassChartWidget";
export { GlassKPICard } from "./components/dashboard/GlassKPICard";
export { GlassMetricCard } from "./components/dashboard/GlassMetricCard";
export { GlassStatCard } from "./components/dashboard/GlassStatCard";
export { DimensionalDashboardContainer } from "./components/dashboard/DimensionalDashboardContainer";

// Calendar Components
export { GlassCalendar } from "./components/calendar/GlassCalendar";

// Template Components
export { GlassDashboard } from "./components/templates/dashboard/GlassDashboard";
export { GlassDetailView } from "./components/templates/detail/GlassDetailView";
export { GlassFormTemplate } from "./components/templates/forms/GlassFormTemplate";
export { GlassFormWizardSteps } from "./components/templates/forms/GlassFormWizardSteps";
export { GlassWizardTemplate } from "./components/templates/forms/GlassWizardTemplate";
export { GlassListView } from "./components/templates/list/GlassListView";

// Additional Button Components
export { GlassFab } from "./components/button/GlassFab";
export { MagneticButton } from "./components/button/GlassMagneticButton";

// Missing Data Display Components (from README)
export { GlassChip } from "./components/data-display/GlassChip";
export { GlassDivider } from "./components/data-display/GlassDivider";
export { GlassGanttChart } from "./components/data-display/GlassGanttChart";
export { GlassKanbanBoard } from "./components/data-display/GlassKanbanBoard";
export { GlassMetricsGrid } from "./components/data-display/GlassMetricsGrid";
export { GlassTreeView } from "./components/data-display/GlassTreeView";

// Specialized Components
export { DynamicAtmosphere } from "./components/backgrounds/GlassDynamicAtmosphere";
export { SeasonalParticles } from "./components/effects/SeasonalParticles";
export { GlassShatterEffects } from "./components/effects/GlassShatterEffects";

// Missing Layout Components (from README)
export { GlassMasonryGrid } from "./components/layouts/GlassMasonryGrid";

// Missing Editor & Chat Components (from README)
export { GlassRichTextEditor } from "./components/editor/GlassRichTextEditor";
export { GlassTypingIndicator } from "./components/chat/GlassTypingIndicator";

// Missing Advanced Components (from README)
export { ContrastGuard } from "./components/accessibility/ContrastGuard";
export { GlassA11y } from "./components/accessibility/GlassA11y";
export { LiquidGlassGPU } from "./components/advanced/LiquidGlassGPU";
export { GlassParallaxLayers } from "./components/advanced/GlassParallaxLayers";
export { GlassMeshGradient } from "./components/advanced/GlassMeshGradient";
export { GlassParticles } from "./components/advanced/GlassParticles";
export { GlassMagneticCursor } from "./components/advanced/GlassMagneticCursor";
export { GlassLiquidTransition } from "./components/advanced/GlassLiquidTransition";
export { GlassWebGLShader } from "./components/advanced/GlassWebGLShader";
export {
  GlassPredictiveEngineProvider as GlassPredictiveEngine,
  usePredictiveEngine,
} from "./components/advanced/GlassPredictiveEngine";
export {
  GlassEyeTrackingProvider,
  useEyeTracking,
} from "./components/advanced/GlassEyeTracking";
export {
  GlassAchievementProvider,
  useAchievements,
} from "./components/advanced/GlassAchievementSystem";
export { useBiometricAdaptation } from "./components/advanced/GlassBiometricAdaptation";
export {
  GlassEngineProvider,
  useGlassEngine,
  AdaptiveGlass,
  GlassOpacityEngine,
  GlassColorTinting,
  GlassTextureVariations,
  EnvironmentalGlass,
  GlassEngineDemo,
} from "./components/advanced/GlassEngine";
export {
  GlassMetaEngineProvider,
  useGlassMetaEngine,
  GlassMetaDashboard,
  useMetaEngineRecorder,
  metaEnginePresets,
} from "./components/advanced/GlassMetaEngine";
export {
  GlassNeuroSyncProvider,
  useNeuroSync,
  GlassNeuroMetricsDashboard,
  GlassNeuroFeedback,
  useNeuroAdaptive,
  neuroSyncPresets,
} from "./components/advanced/GlassNeuroSync";
export {
  GlassSelfHealingProvider,
  useSelfHealing,
  GlassSelfHealingWrapper,
  GlassSelfHealingDashboard,
  useComponentSelfHealing,
  selfHealingPresets,
} from "./components/advanced/GlassSelfHealingSystem";
export { useAutoComposer } from "./components/advanced/GlassAutoComposer";
export { useContextualEngine } from "./components/advanced/GlassContextualEngine";
export { GlassPerformanceMonitor } from "./components/advanced/GlassPerformanceOptimization";
export { useQuantumStates } from "./components/advanced/GlassQuantumStates";
export { GlassFoldableSupport } from "./components/advanced/GlassFoldableSupport";
export { GlassOrientationEffects } from "./components/advanced/GlassOrientationEffects";
export { GlassContextAware } from "./components/advanced/GlassContextAware";

// Advanced & Experimental Components
export { AIGlassThemeProvider } from "./components/ai/AIGlassThemeProvider";
export { GlassDeepDreamGlass } from "./components/ai/GlassDeepDreamGlass";
export { GlassGANGenerator } from "./components/ai/GlassGANGenerator";
export { GlassGenerativeArt } from "./components/ai/GlassGenerativeArt";
export { GlassIntelligentSearch } from "./components/search/GlassIntelligentSearch";
export { GlassLiveFilter } from "./components/ai/GlassLiveFilter";
export { GlassMusicVisualizer } from "./components/ai/GlassMusicVisualizer";
export { NeuralWeightVisualization } from "./components/ai/NeuralWeightVisualization";
export { NeuromorphicLearningNetwork } from "./components/ai/NeuromorphicLearningNetwork";
export { GlassStyleTransfer } from "./components/ai/GlassStyleTransfer";
export { GlassTransitions } from "./components/animations/GlassTransitions";
export {
  ARGlassEffects,
  ARGlassAnimations,
  ARGlassGeometryFactory,
  ARGlassInteractions,
  ARGlassMaterialFactory,
  ARGlassUtils,
} from "./components/ar/ARGlassEffects";
export { AccessibilityProvider } from "./components/accessibility/AccessibilityProvider";
export { GlassFocusIndicators } from "./components/accessibility/GlassFocusIndicators";
export {
  GlassHighContrast,
  GlassKeyboardNav,
  GlassMotionControls,
  GlassScreenReader,
} from "./components/accessibility/GlassA11y";
export { EnhancedGlassButton } from "./components/button/EnhancedGlassButton";
export { GalileoElementInteractionPlugin } from "./components/charts/plugins/GalileoElementInteractionPlugin";
export { InterpolationUtils } from "./animations/physics/interpolation";
export { AuroraPro } from "./components/effects/AuroraPro";
export { Glass3DEngine } from "./components/effects/Glass3DEngine";
export { GlassMorphingEngine } from "./components/effects/GlassMorphingEngine";
export { GlassPhysicsEngine } from "./components/effects/GlassPhysicsEngine";
export { GlassAdvancedDataViz } from "./components/visualization/GlassAdvancedDataViz";
export { GlassChartsDemo } from "./components/website-components/GlassChartsDemo";
export { Glass360Viewer } from "./components/immersive/Glass360Viewer";
export { GlassARPreview } from "./components/immersive/GlassARPreview";
export { GlassFluidSimulation } from "./components/immersive/GlassFluidSimulation";
export { GlassHologram } from "./components/immersive/GlassHologram";
export { GlassParticleField } from "./components/immersive/GlassParticleField";
export { GlassVortexPortal } from "./components/immersive/GlassVortexPortal";
export { GlassAuroraDisplay } from "./components/atmospheric/GlassAuroraDisplay";
export { GlassBiomeSimulator } from "./components/atmospheric/GlassBiomeSimulator";
export { GlassNebulaClouds } from "./components/atmospheric/GlassNebulaClouds";
export { GlassWeatherGlass } from "./components/atmospheric/GlassWeatherGlass";
export { GlassMoodRing } from "./components/experiential/GlassMoodRing";
export {
  BiometricAdaptationEngine,
  BiometricStressDetector,
} from "./components/advanced/GlassBiometricAdaptation";
export { GlassLiveCursorPresence } from "./components/advanced/GlassLiveCursorPresence";
export { GlassReactions } from "./components/advanced/GlassReactions";
export {
  GlassSpatialAudio,
  GlassSpatialAudioProvider,
  GlassAudioReactive,
  GlassSpatialVisualizer,
  useSpatialAudio,
} from "./components/advanced/GlassSpatialAudio";
export { LivingEcosystemSimulator } from "./components/advanced/LivingEcosystemSimulator";
export { MolecularBondingInterface } from "./components/advanced/MolecularBondingInterface";
export { MultiDimensionalGestureRecognizer } from "./components/advanced/MultiDimensionalGestureRecognizer";
export { GlassCoherenceIndicator } from "./components/quantum/GlassCoherenceIndicator";
export { GlassProbabilityCloud } from "./components/quantum/GlassProbabilityCloud";
export { GlassQuantumField } from "./components/quantum/GlassQuantumField";
export { GlassQuantumTunnel } from "./components/quantum/GlassQuantumTunnel";
export { GlassSuperpositionalMenu } from "./components/quantum/GlassSuperpositionalMenu";
export { GlassWaveFunction } from "./components/quantum/GlassWaveFunction";
export { QuantumEntanglementVisualizer } from "./components/quantum/QuantumEntanglementVisualizer";
export {
  QuantumNeuromorphicEngine,
  runQuantumNeuromorphicCycle,
} from "./components/quantum/QuantumNeuromorphicEngine";
export {
  CollaborativeGlassWorkspace,
  GlassCollaborationProvider,
  GlassTeamCursors,
  GlassTeamCursorsWithEffects,
} from "./components/collaboration/CollaborativeGlassWorkspace";
export { GlassCollaborativeCursor } from "./components/collaboration/GlassCollaborativeCursor";
export { GlassCollaborationDashboard } from "./components/collaboration/GlassCollaborationDashboard";
export { GlassCollaborativeComments } from "./components/collaboration/GlassCollaborativeComments";
export { MultiUserGlassEditor } from "./components/collaboration/MultiUserGlassEditor";
export { GlassDragDropProvider } from "./components/cms/GlassDragDropProvider";
export { GlassPageBuilder } from "./components/cms/GlassPageBuilder";
export { GlassCanvas } from "./components/cms/GlassCanvas";
export { GlassComponentPalette } from "./components/cms/GlassComponentPalette";
export { GlassPageStructure } from "./components/cms/GlassPageStructure";
export { GlassPropertyPanel } from "./components/cms/GlassPropertyPanel";
export { GlassEcommerceProvider } from "./components/ecommerce/GlassEcommerceProvider";
export { GlassSmartShoppingCart } from "./components/ecommerce/GlassSmartShoppingCart";
export { GlassProductRecommendations } from "./components/ecommerce/GlassProductRecommendations";
export { GlassImageProcessingProvider } from "./components/image/GlassImageProcessingProvider";
export { GlassIntelligentImageUploader } from "./components/image/GlassIntelligentImageUploader";
export { GlassMediaProvider } from "./components/media/GlassMediaProvider";
export { GlassAdvancedVideoPlayer } from "./components/media/GlassAdvancedVideoPlayer";
export { GlassAdvancedAudioPlayer } from "./components/media/GlassAdvancedAudioPlayer";
export { GlassActionSheet } from "./components/mobile/GlassActionSheet";
export { GlassPullToRefresh } from "./components/mobile/GlassPullToRefresh";
export {
  TouchOptimizedGlass,
  MobileGlassNavigation,
  AdaptiveGlassDensity,
  TouchRippleEffects,
  MobileGlassBottomSheet,
} from "./components/mobile/TouchGlassOptimization";
export { GlassPresenceIndicator } from "./components/social/GlassPresenceIndicator";
export { GlassReactionBubbles } from "./components/social/GlassReactionBubbles";
export { GlassSharedWhiteboard } from "./components/social/GlassSharedWhiteboard";
export { GlassSocialFeed } from "./components/social/GlassSocialFeed";
export { GlassVoiceWaveform } from "./components/social/GlassVoiceWaveform";
export {
  default as VoiceGlassControl,
  GlassVoiceCommands,
} from "./components/voice/VoiceGlassControl";
export {
  HoudiniGlassCard,
  HoudiniGlassShowcase,
} from "./components/houdini/HoudiniGlassCard";
export {
  ConsciousnessStreamProvider,
  useConsciousnessStream,
} from "./contexts/ConsciousnessStreamProvider";
export {
  component_inventory_json,
  COMPONENT_INVENTORY_JSON_PATH,
} from "./reports/componentInventory";
export {
  GILDED_TOKENS_CATALOGUE_MD,
  REDUCED_MOTION_100_COMPLETE_MD,
  REDUCED_MOTION_101_GUIDE_MD,
} from "./reports/legacyDocuments";
export const component_inventory_json_path = "reports/component_inventory.json";
export const GILDED_TOKENS_CATALOGUE_MD_PATH =
  "reports/GILDED_TOKENS_CATALOGUE.md";
export const REDUCED_MOTION_101_GUIDE_MD_PATH =
  "reports/REDUCED_MOTION_101_GUIDE.md";
export const REDUCED_MOTION_100_COMPLETE_MD_PATH =
  "reports/REDUCED_MOTION_100_COMPLETE.md";
export { GlassDepthLayer } from "./components/surfaces/GlassDepthLayer";
export { GlassFractalLayout } from "./components/layouts/GlassFractalLayout";
export { GlassGoldenRatioGrid } from "./components/layouts/GlassGoldenRatioGrid";
export { GlassIslandLayout } from "./components/layouts/GlassIslandLayout";
export { GlassOrbitalMenu } from "./components/layouts/GlassOrbitalMenu";
export { GlassTessellation } from "./components/layouts/GlassTessellation";

// Surface Components
export { default as DimensionalGlass } from "./components/surfaces/DimensionalGlass";
export { default as FrostedGlass } from "./components/surfaces/FrostedGlass";
export { default as HeatGlass } from "./components/surfaces/HeatGlass";
export { default as PageGlassContainer } from "./components/surfaces/PageGlassContainer";
export { default as WidgetGlass } from "./components/surfaces/WidgetGlass";

// Background Components
export { default as AtmosphericBackground } from "./components/backgrounds/AtmosphericBackground";
export { default as ParticleBackground } from "./components/backgrounds/ParticleBackground";

// Speed Dial Components
export { SpeedDial } from "./components/speed-dial/SpeedDial";
export { default as SpeedDialAction } from "./components/speed-dial/SpeedDialAction";
export { default as SpeedDialIcon } from "./components/speed-dial/SpeedDialIcon";

// Toggle Button Components
export { ToggleButton } from "./components/toggle-button/ToggleButton";
export { ToggleButtonGroup } from "./components/toggle-button/ToggleButtonGroup";

// Tree View Components
export { TreeItem } from "./components/tree-view/TreeItem";
export { TreeView } from "./components/tree-view/TreeView";

// Visual Feedback Components
export { default as FocusIndicator } from "./components/visual-feedback/FocusIndicator";
export { default as RippleButton } from "./components/visual-feedback/RippleButton";
export { default as StateIndicator } from "./components/visual-feedback/StateIndicator";
export { default as VisualFeedback } from "./components/visual-feedback/VisualFeedback";

// Image List Components
export { ImageList } from "./components/image-list/ImageList";
export { ImageListItem } from "./components/image-list/ImageListItem";
export { ImageListItemBar } from "./components/image-list/ImageListItemBar";

// Cookie Consent Components
export { CompactCookieNotice } from "./components/cookie-consent/CompactCookieNotice";
export { CookieConsent } from "./components/cookie-consent/CookieConsent";
export { GlobalCookieConsent } from "./components/cookie-consent/GlobalCookieConsent";

// UI Components (App-specific)
export { GlassPanel } from "./components/ui-components/glass-panel";
export { default as GlassAccordionUI } from "./components/ui-components/GlassAccordionUI";
export { Checkbox as GlassCheckboxUI } from "./components/ui-components/GlassCheckboxUI";

// Website Components
export { GlassLinkButton } from "./components/website-components/GlassLinkButton";
export { GlassPrismComparison } from "./components/website-components/GlassPrismComparison";
export { GlassWipeSlider } from "./components/website-components/GlassWipeSlider";
export { MotionAwareGlass } from "./components/website-components/MotionAwareGlass";

// Enhanced Hooks
export {
  useAccessibilityFeature,
  useAccessibleAnimation,
  useAccessibleColors,
} from "./hooks/useAccessibilitySettings";
export {
  useAdaptiveImageLoading,
  useEnhancedPerformance,
  usePerformanceAwareRendering,
  usePerformanceLazyLoading,
} from "./hooks/useEnhancedPerformance";
export {
  useAsyncError,
  useErrorBoundary,
  useErrorReporting,
  useGracefulDegradation,
} from "./hooks/useErrorBoundary";
export {
  useGlassIntersection,
  useGlassIntersectionAnimation,
  useGlassLazyImage,
  useProgressiveLoading,
} from "./hooks/useGlassIntersection";
export {
  useAdaptiveComponentLoading,
  useGlassOptimization,
  useOptimizedGlassComponent,
} from "./hooks/useGlassOptimization";
export { useMotionPreference } from "./hooks/useMotionPreference";
export { useReducedMotion } from "./hooks/useReducedMotion";
export { useEnhancedReducedMotion } from "./hooks/useEnhancedReducedMotion";
export {
  useGalileoStateSpring,
  useGalileoStateSpring as useAuraStateSpring,
} from "./hooks/useGalileoStateSpring";
export {
  usePhysicsInteraction,
  usePhysicsButton,
  usePhysicsDrag,
  useSimplePhysicsHover,
} from "./hooks/usePhysicsInteraction";
export {
  useGridVirtualization,
  useInfiniteVirtualization,
  useTableVirtualization,
  useVirtualization,
  useWindowVirtualization,
} from "./hooks/useVirtualization";
export { useDeviceCapabilities } from "./hooks/useDeviceCapabilities";
export {
  useQualityTier,
  getQualityBasedPhysicsParams,
  getQualityBasedGlassParams,
} from "./components/charts/hooks/useQualityTier";
export { useChartPhysicsInteraction } from "./components/charts/hooks/useChartPhysicsInteraction";
export {
  useTheme,
  useThemeVariant,
  useThemeProviderPresence,
} from "./theme/ThemeProvider";
export { AnimationProvider, useAnimation } from "./contexts/AnimationContext";
export { useA11yId } from "./utils/a11y";
export { useGlassSound, glassSoundDesign } from "./utils/soundDesign";
export { adaptiveAI, useAdaptiveAI } from "./utils/adaptiveAI";
export { AuraGlassClientBoundary } from "./components/ssr/AuraGlassClientBoundary";

// Note: The following components and services have server-side dependencies and are not included in the client bundle:
// - ProductionAIIntegration: imports OpenAIService, SemanticSearchService, VisionService, CollaborationService, AuthService
// - OpenAIService, SemanticSearchService, VisionService: require backend APIs (OpenAI, Pinecone, Google Vision)
// - CollaborationService: requires WebSocket server infrastructure
// - AuthService: requires jsonwebtoken and server-side auth
// These are meant to be used in a Node.js backend environment, not in the browser.
// They are available in the source code at src/components/ai/ and src/services/ for backend integration.

// Physics & Transform Hooks
export { usePhysicsEngine } from "./hooks/physics/usePhysicsEngine";
export { usePhysicsLayout } from "./hooks/physics/usePhysicsLayout";
export { use3DTransform } from "./hooks/extended/use3DTransform";
export { useAmbientTilt } from "./hooks/extended/useAmbientTilt";
export { useMagneticElement } from "./hooks/extended/useMagneticElement";
export { useZSpace } from "./hooks/extended/useZSpace";

// Extended Hooks
export * from "./hooks/extended";
// Explicit named exports for extended hooks to ensure tree-shaking works correctly
export {
  useZSpaceAnimation,
  useParallaxZSpace,
  useCardStackZSpace,
} from "./hooks/extended/useZSpaceAnimation";

// Gesture Physics Hooks
export { useGesturePhysics } from "./animations/physics/gesturePhysics";

// Orchestration Hooks
export { useOrchestration } from "./animations/orchestration/useOrchestration";

// Enhanced Core Mixins
export {
  createGlassDisabledMixin,
  createGlassFocusMixin,
  createGlassHoverMixin,
  createGlassStyle,
  createResponsiveGlassStyle,
  generateGlassThemeVariables,
  glassCSS,
} from "./core/mixins/glassMixins";

export {
  PerformanceMonitor,
  createCleanupManager,
  createDebouncedResizeObserver,
  createLazyLoadMixin,
  createMemoryEfficientAnimation,
  createOptimizedScrollHandler,
  createOptimizedTransition,
  createPerformanceMixin,
  createVirtualizationMixin,
  detectDeviceCapabilities,
  getAdaptivePerformanceConfig,
} from "./core/mixins/performanceMixins";

// Additional Mixins
export { edgeHighlight } from "./core/mixins/edgeEffects";
export { glowEffects } from "./core/mixins/glowEffects";
export {
  createMagneticEffect,
  createRippleEffect,
} from "./core/mixins/interactiveGlass";
export { createZSpaceLayers, zSpaceLayer } from "./core/mixins/zSpaceLayer";

// Animation System
export * from "./animations/hooks";
export * from "./animations/physics";
export { SpringPresets } from "./animations/physics/springPhysics";
// Explicitly re-export orchestration to resolve ambiguity
export {
  createOrchestration,
  orchestrationPresets,
  useAnimationSequence as orchestrationUseAnimationSequence,
} from "./animations/orchestration/index";
// Accessible animation utilities
export * from "./animations/accessible";

// Gesture Physics System
export {
  GestureType,
  GESTURE_PRESETS as GesturePresets,
} from "./animations/physics/gesturePhysics";
export type { GesturePhysicsPreset } from "./animations/physics/gesturePhysics";

// Orchestration Types
export {
  PublicAnimationStage,
  createOrchestrationSequence,
} from "./animations/orchestration/useOrchestration";

// Error Boundaries and Utils
export {
  GlassAsyncErrorBoundary,
  GlassComponentErrorBoundary,
  GlassErrorBoundary,
  GlassLightErrorBoundary,
  withGlassErrorBoundary,
} from "./utils/errorBoundary";

// Production Utilities
export {
  analytics,
  browser,
  css,
  data,
  dev,
  features,
  initializeProduction,
  logger,
  memory,
  performance,
  productionConfig,
  safeExecute,
  safeExecuteAsync,
  storage,
  validate,
} from "./utils/productionUtils";

// Date Utilities
export {
  createDateFnsAdapter,
  createDayJsAdapter,
  createNativeDateAdapter,
} from "./utils/dateAdapters";
export type { DateAdapter } from "./utils/dateAdapters";

// Core Production System
export {
  AuraGlassProduction,
  defaultProductionConfig,
  devUtils,
  getAuraGlass,
  initializeAuraGlass,
  initializeAuraGlassClient,
  productionUtils,
} from "./core/productionCore";

// Library Utilities
export * from "./lib";

// Utility Modules
export * from "./utils/browserCompatibility";
export * from "./utils/env";
export * from "./utils/deviceCapabilities";
export * from "./utils/elementTypes";
export * from "./utils/performanceOptimizations";
export * from "./utils/themeHelpers";
export * from "./utils/random";
// SSR Utilities (selective exports to avoid conflicts)
export {
  canUseDOM,
  safeWindow,
  safeDocument,
  safeNavigator,
  safeBrowserExec,
  getBrowserValue,
  getUserAgent,
  isTouchDevice,
  getViewportSize,
  getDevicePixelRatio,
  isWebGLSupported,
  isLocalStorageAvailable,
  addBrowserEventListener,
  safeRequestAnimationFrame,
  safeCancelAnimationFrame,
  createBrowserRefCallback,
  getConnectionInfo,
  isDevelopment,
  isProduction,
} from "./utils/ssr";

// Design Tokens
export * from "./tokens/glass";

// Primitives
export * from "./primitives";

// SSR Utilities (selective exports)
export {
  AuraGlassSSRProvider,
  collectStyles,
  createStyleSheet,
  isStyledComponentsSSRReady,
  getStyledComponentsVersion,
} from "./ssr";

// Development Utilities (Development Only)
// Note: Testing utilities are available in development builds only

// Type exports for TypeScript support
export type {
  GlassAlertProps,
  // Chart types
  GlassAreaChartProps,
  GlassBadgeProps,
  GlassBarChartProps,
  // Interactive types
  GlassCarouselProps,
  GlassChatProps,
  GlassCheckboxProps,
  GlassCommandBarProps,
  // Layout types
  GlassContainerProps,
  // Data display types
  GlassDataTableProps,
  // Modal types
  GlassDialogProps,
  GlassDrawerProps,
  GlassGridProps,
  // Navigation types
  GlassHeaderProps,
  // Form types
  GlassInputProps,
  // Dashboard types
  GlassKPICardProps,
  GlassKanbanProps,
  GlassLineChartProps,
  GlassMetricCardProps,
  GlassModalProps,
  GlassPieChartProps,
  GlassPopoverProps,
  GlassProgressProps,
  GlassSegmentedControlProps,
  GlassSelectProps,
  GlassSidebarProps,
  GlassSliderProps,
  GlassSplitPaneProps,
  GlassStackProps,
  GlassStatCardProps,
  GlassSwitchProps,
  GlassTextareaProps,
  GlassTimelineProps,
  GlassToolbarProps,
  // Glass primitive types
  OptimizedGlassProps,
} from "./types";

// Additional component type exports
export type { GlassCardProps } from "./components/card/GlassCard";
export type { GlowingCardProps } from "./components/card/GlowingCard";
export type { GlassTabItemProps } from "./components/navigation/GlassTabItem";
export type { DateRange } from "./components/input/GlassDateRangePicker";
export type { ChartDataset } from "./components/charts/GlassDataChart";
export type {
  ColumnDefinition,
  SortState,
} from "./components/data-display/types";
export type { MultiSelectOption, Step } from "./components/input/types";
export type { MasonryItem } from "./components/layouts/GlassMasonryGrid";
export type {
  QualityTier as ChartQualityTier,
  PhysicsParams,
} from "./components/charts/hooks/useQualityTier";
export type { QualityTier } from "./components/charts/hooks/useQualityTier";
export type { DimensionalDashboardContainerProps } from "./components/dashboard/DimensionalDashboardContainer";
export type { ZSpaceAppLayoutProps } from "./components/layout/ZSpaceAppLayout";
export type { ContentSectionProps } from "./components/layout/GlassAppShell";
export type { LiquidGlassMaterialProps } from "./primitives/LiquidGlassMaterial";
export type { SeasonalParticlesProps } from "./components/effects/SeasonalParticles";
export type { GlassShatterEffectsProps } from "./components/effects/GlassShatterEffects";
export type { IntelligentFormBuilderProps } from "./components/ai/GlassIntelligentFormBuilder";
export type { HoudiniGlassProviderProps } from "./components/houdini/HoudiniGlassProvider";
export type { AuraGlassClientBoundaryProps } from "./components/ssr/AuraGlassClientBoundary";

// Re-export production types (explicitly to resolve PerformanceMetrics ambiguity)
export type {
  A11yAuditRule,
  AccessibilitySettings,
  AnimationConfig,
  BreadcrumbItem,
  ChartDataPoint,
  ComponentTestProps,
  ConditionalGlassProps,
  CreateGlassComponent,
  DrawerState,
  FlexConfig,
  FormField,
  FormState,
  GlassA11yAuditorProps,
  GlassAnimatedNumberProps,
  GlassCodeEditorProps,
  GlassColorSchemeGeneratorProps,
  GlassComponentPlaygroundProps,
  GlassComponentProps,
  GlassConfig,
  GlassGlobalState,
  GlassMindMapProps,
  GlassMotionControllerProps,
  GlassNotification,
  GlassNotificationCenterProps,
  GlassPlugin,
  GlassPropsWithChildren,
  GlassSkeletonLoaderProps,
  GlassSkeletonProps,
  GlassTooltipProps,
  GlassWhiteboardProps,
  GridConfig,
  IntersectionReturn,
  MockData,
  ModalState,
  MotionPreferences,
  NavigationItem,
  NestedGlassComponent,
  PartialGlassProps,
  PhysicsInteractionReturn,
  PieDataPoint,
  PerformanceMetrics as ProductionPerformanceMetrics,
  SelectOption,
  TableColumn,
  TableRow,
  ThemeConfig,
  TimelineItem,
  ValidationResult,
  ValidationRule,
  VirtualizationConfig,
} from "./types/productionTypes";

// Common types
export type {
  Vector2D,
  UnsubscribeFunction,
  CallbackFunction,
  EventHandler,
  AsyncCallback,
  Subscription,
} from "./types/common";

// Physics types
export type {
  PhysicsBodyState,
  PhysicsBodyOptions,
  CollisionEvent,
} from "./physics/AuraPhysicsEngine";

// Export physics engine
export {
  AuraPhysicsEngineAPI,
  getGlobalPhysicsEngine,
  forcePhysicsEngineUpdate,
  getPhysicsBodyState,
} from "./physics/AuraPhysicsEngine";
