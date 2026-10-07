/**
 * Unified API Design for Consciousness Interface Features
 * Standardized types and interfaces across the component library
 */

// Base consciousness feature configuration
export interface BaseConsciousnessFeatures {
  /** Enable predictive behavior analysis and preloading */
  predictive?: boolean;
  /** Enable eye tracking and gaze-responsive interactions */
  eyeTracking?: boolean;
  /** Enable biometric adaptation based on user state */
  adaptive?: boolean;
  /** Enable spatial audio positioning and feedback */
  spatialAudio?: boolean;
  /** Enable achievement system integration */
  trackAchievements?: boolean;
}

// Extended consciousness features for specific component types
export interface ExtendedConsciousnessFeatures extends BaseConsciousnessFeatures {
  /** Preload related data/content when predictive is enabled */
  preloadData?: boolean;
  /** Preload navigation routes when predictive is enabled */
  preloadRoutes?: boolean;
  /** Preload form actions when predictive is enabled */
  preloadActions?: boolean;
  
  /** Respond to user gaze with visual feedback when eyeTracking is enabled */
  gazeResponsive?: boolean;
  /** Highlight elements based on gaze when eyeTracking is enabled */
  gazeHighlight?: boolean;
  /** Show focus previews when eyeTracking is enabled */
  focusPreview?: boolean;
  /** Enable gaze-based navigation when eyeTracking is enabled */
  gazeNavigation?: boolean;
  
  /** Respond to biometric stress levels when adaptive is enabled */
  biometricResponsive?: boolean;
  /** Adjust UI complexity based on stress when adaptive is enabled */
  complexityAdjustment?: boolean;
  /** Require calm state for certain actions when adaptive is enabled */
  requiresCalm?: boolean;
  /** Adapt content based on user patterns when adaptive is enabled */
  contentAdaptation?: boolean;
  
  /** Provide audio feedback when spatialAudio is enabled */
  audioFeedback?: boolean;
  /** Enable directional audio cues when spatialAudio is enabled */
  directionalCues?: boolean;
  /** Position audio in 3D space when spatialAudio is enabled */
  position?: 'left' | 'center' | 'right' | { x: number; y: number; z: number };
  
  /** Achievement identifier for tracking when trackAchievements is enabled */
  achievementId?: string;
  /** Context for achievement tracking when trackAchievements is enabled */
  usageContext?: 'onboarding' | 'form' | 'navigation' | 'dashboard' | 'analytics' | 'report' | 'presentation' | 'exploration' | 'advanced' | 'showcase' | string;
  /** Show progress indicators when trackAchievements is enabled */
  progressIndicators?: boolean;
}

// Component-specific consciousness feature extensions
export interface NavigationConsciousnessFeatures extends ExtendedConsciousnessFeatures {
  /** Pattern recognition for navigation behavior */
  patternRecognition?: boolean;
  /** Audio navigation cues */
  audioNavigation?: boolean;
}

export interface FormConsciousnessFeatures extends ExtendedConsciousnessFeatures {
  /** Auto-complete based on patterns */
  smartAutoComplete?: boolean;
  /** Validate input in real-time */
  predictiveValidation?: boolean;
  /** Suggest form completions */
  formSuggestions?: boolean;
}

export interface ChartConsciousnessFeatures extends ExtendedConsciousnessFeatures {
  /** Provide chart insights */
  chartInsights?: boolean;
  /** Analyze data patterns */
  patternAnalysis?: boolean;
  /** Focus on data points based on gaze */
  dataPointFocus?: boolean;
}

export interface ModalConsciousnessFeatures extends ExtendedConsciousnessFeatures {
  /** Focus management with eye tracking */
  focusManagement?: boolean;
  /** Audio positioning for modal */
  modalAudioPosition?: boolean;
}

export interface CardConsciousnessFeatures extends ExtendedConsciousnessFeatures {
  /** Focus-aware expansion */
  focusExpansion?: boolean;
  /** Stress-aware simplification */
  stressAware?: boolean;
  /** Simplification mode for high stress */
  simplificationMode?: boolean;
}

// Consciousness event handlers
export interface ConsciousnessEventHandlers {
  /** Called when predictive analysis completes */
  onPredictiveAnalysis?: (analysis: PredictiveAnalysis) => void;
  /** Called when eye tracking detects gaze */
  onGazeEnter?: (target: Element) => void;
  /** Called when eye tracking loses gaze */
  onGazeExit?: (target: Element) => void;
  /** Called when biometric state changes */
  onBiometricChange?: (state: BiometricState) => void;
  /** Called when spatial audio plays */
  onAudioPlay?: (audioId: string, position?: SpatialPosition) => void;
  /** Called when achievement is unlocked */
  onAchievementUnlocked?: (achievement: Achievement) => void;
  /** Called when consciousness feature state changes */
  onConsciousnessChange?: (feature: string, enabled: boolean) => void;
}

// Core data types
export interface PredictiveAnalysis {
  patterns: UserPattern[];
  insights: Insight[];
  recommendations: string[];
  confidence: number; // 0-1
  timestamp: number;
}

export interface UserPattern {
  id: string;
  type: 'navigation' | 'interaction' | 'temporal' | 'behavioral';
  frequency: number;
  lastOccurrence: number;
  confidence: number;
  metadata: Record<string, any>;
}

export interface Insight {
  id: string;
  type: 'usage' | 'performance' | 'preference' | 'optimization';
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata: Record<string, any>;
}

export interface BiometricState {
  stressLevel: number; // 0-1 (0 = calm, 1 = stressed)
  cognitiveLoad: number; // 0-1 (0 = low, 1 = high)
  attention: number; // 0-1 (0 = distracted, 1 = focused)
  confidence: number; // 0-1 (0 = uncertain, 1 = confident)
  timestamp: number;
}

export interface SpatialPosition {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  z: number; // -1 to 1 (back to front)
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  unlocked: boolean;
  progress: number; // 0-1
  timestamp?: number;
  metadata: Record<string, any>;
}

export interface GazeData {
  x: number; // Screen coordinates
  y: number;
  confidence: number; // 0-1
  timestamp: number;
  target?: Element;
}

// Consciousness configuration
export interface ConsciousnessConfig {
  /** Global enable/disable for all consciousness features */
  enabled: boolean;
  /** Individual feature toggles */
  features: {
    predictive: boolean;
    eyeTracking: boolean;
    adaptive: boolean;
    spatialAudio: boolean;
    achievements: boolean;
  };
  /** Performance settings */
  performance: {
    eyeTrackingFPS: number; // Default: 60
    biometricUpdateInterval: number; // Default: 100ms
    predictiveAnalysisDelay: number; // Default: 200ms
    spatialAudioUpdateRate: number; // Default: 30fps
  };
  /** Privacy settings */
  privacy: {
    dataRetentionDays: number; // Default: 30
    anonymizeData: boolean; // Default: true
    shareAnalytics: boolean; // Default: false
    requireConsent: boolean; // Default: true
  };
  /** Accessibility settings */
  accessibility: {
    respectReducedMotion: boolean; // Default: true
    respectHighContrast: boolean; // Default: true
    provideAudioAlternatives: boolean; // Default: true
    announceStateChanges: boolean; // Default: true
  };
}

// Hook configurations
export interface PredictiveEngineConfig {
  enabled: boolean;
  analysisDelay?: number;
  maxPatterns?: number;
  confidenceThreshold?: number;
}

export interface EyeTrackingConfig {
  enabled: boolean;
  updateRate?: number; // FPS
  gazeThreshold?: number; // pixels
  dwellTime?: number; // ms
  calibrationRequired?: boolean;
}

export interface BiometricAdaptationConfig {
  enabled: boolean;
  updateInterval?: number; // ms
  stressThreshold?: number; // 0-1
  cognitiveLoadThreshold?: number; // 0-1
  adaptationSensitivity?: number; // 0-1
}

export interface SpatialAudioConfig {
  enabled: boolean;
  updateRate?: number; // FPS
  maxSources?: number;
  falloffDistance?: number;
  volume?: number; // 0-1
}

export interface AchievementSystemConfig {
  enabled: boolean;
  categories?: string[];
  persistProgress?: boolean;
  showNotifications?: boolean;
  trackingGranularity?: 'basic' | 'detailed' | 'comprehensive';
}

// Component prop interfaces for consistency
export interface WithConsciousnessProps {
  /** Consciousness feature configuration */
  consciousnessFeatures?: ExtendedConsciousnessFeatures;
  /** Consciousness event handlers */
  consciousnessHandlers?: ConsciousnessEventHandlers;
  /** Override global consciousness config */
  consciousnessConfig?: Partial<ConsciousnessConfig>;
  /** Disable all consciousness features for this component */
  disableConsciousness?: boolean;
}

// Navigation-specific props
export interface WithNavigationConsciousnessProps extends WithConsciousnessProps {
  consciousnessFeatures?: NavigationConsciousnessFeatures;
}

// Form-specific props
export interface WithFormConsciousnessProps extends WithConsciousnessProps {
  consciousnessFeatures?: FormConsciousnessFeatures;
}

// Chart-specific props
export interface WithChartConsciousnessProps extends WithConsciousnessProps {
  consciousnessFeatures?: ChartConsciousnessFeatures;
}

// Modal-specific props
export interface WithModalConsciousnessProps extends WithConsciousnessProps {
  consciousnessFeatures?: ModalConsciousnessFeatures;
}

// Card-specific props
export interface WithCardConsciousnessProps extends WithConsciousnessProps {
  consciousnessFeatures?: CardConsciousnessFeatures;
}

// Utility types for component variants
export type ConsciousnessVariant<T> = T & WithConsciousnessProps;
export type NavigationConsciousnessVariant<T> = T & WithNavigationConsciousnessProps;
export type FormConsciousnessVariant<T> = T & WithFormConsciousnessProps;
export type ChartConsciousnessVariant<T> = T & WithChartConsciousnessProps;
export type ModalConsciousnessVariant<T> = T & WithModalConsciousnessProps;
export type CardConsciousnessVariant<T> = T & WithCardConsciousnessProps;

// Default configurations
export const DEFAULT_CONSCIOUSNESS_CONFIG: ConsciousnessConfig = {
  enabled: false, // Opt-in by default for privacy
  features: {
    predictive: false,
    eyeTracking: false,
    adaptive: false,
    spatialAudio: false,
    achievements: false,
  },
  performance: {
    eyeTrackingFPS: 60,
    biometricUpdateInterval: 100,
    predictiveAnalysisDelay: 200,
    spatialAudioUpdateRate: 30,
  },
  privacy: {
    dataRetentionDays: 30,
    anonymizeData: true,
    shareAnalytics: false,
    requireConsent: true,
  },
  accessibility: {
    respectReducedMotion: true,
    respectHighContrast: true,
    provideAudioAlternatives: true,
    announceStateChanges: true,
  },
};

export const DEFAULT_PREDICTIVE_CONFIG: PredictiveEngineConfig = {
  enabled: false,
  analysisDelay: 200,
  maxPatterns: 100,
  confidenceThreshold: 0.7,
};

export const DEFAULT_EYE_TRACKING_CONFIG: EyeTrackingConfig = {
  enabled: false,
  updateRate: 60,
  gazeThreshold: 50,
  dwellTime: 300,
  calibrationRequired: true,
};

export const DEFAULT_BIOMETRIC_CONFIG: BiometricAdaptationConfig = {
  enabled: false,
  updateInterval: 100,
  stressThreshold: 0.7,
  cognitiveLoadThreshold: 0.8,
  adaptationSensitivity: 0.5,
};

export const DEFAULT_SPATIAL_AUDIO_CONFIG: SpatialAudioConfig = {
  enabled: false,
  updateRate: 30,
  maxSources: 8,
  falloffDistance: 100,
  volume: 0.5,
};

export const DEFAULT_ACHIEVEMENT_CONFIG: AchievementSystemConfig = {
  enabled: false,
  categories: ['interaction', 'exploration', 'mastery', 'social'],
  persistProgress: true,
  showNotifications: true,
  trackingGranularity: 'basic',
};

// Component naming conventions
export const CONSCIOUSNESS_COMPONENT_VARIANTS = {
  // Standard variants
  Conscious: 'Conscious', // e.g., ConsciousGlassButton
  Predictive: 'Predictive', // e.g., PredictiveGlassChart
  Adaptive: 'Adaptive', // e.g., AdaptiveGlassCard
  Immersive: 'Immersive', // e.g., ImmersiveGlassModal
  
  // Specialized variants
  EyeTracking: 'EyeTracking', // e.g., EyeTrackingGlassNavigation
  Biometric: 'Biometric', // e.g., BiometricGlassForm
  SpatialAudio: 'SpatialAudio', // e.g., SpatialAudioGlassButton
  Achievement: 'Achievement', // e.g., AchievementGlassProgress
} as const;

// Consciousness feature flags for conditional rendering
export type ConsciousnessFeatureFlag = keyof BaseConsciousnessFeatures;

// Helper function to check if any consciousness feature is enabled
export const hasConsciousnessFeatures = (features?: ExtendedConsciousnessFeatures): boolean => {
  if (!features) return false;
  return Boolean(
    features.predictive ||
    features.eyeTracking ||
    features.adaptive ||
    features.spatialAudio ||
    features.trackAchievements
  );
};

// Helper function to get enabled consciousness features
export const getEnabledConsciousnessFeatures = (features?: ExtendedConsciousnessFeatures): ConsciousnessFeatureFlag[] => {
  if (!features) return [];
  
  const enabledFeatures: ConsciousnessFeatureFlag[] = [];
  if (features.predictive) enabledFeatures.push('predictive');
  if (features.eyeTracking) enabledFeatures.push('eyeTracking');
  if (features.adaptive) enabledFeatures.push('adaptive');
  if (features.spatialAudio) enabledFeatures.push('spatialAudio');
  if (features.trackAchievements) enabledFeatures.push('trackAchievements');
  
  return enabledFeatures;
};

// Helper function to create consciousness feature object
export const createConsciousnessFeatures = (
  features: Partial<ExtendedConsciousnessFeatures> = {}
): ExtendedConsciousnessFeatures => {
  return {
    predictive: false,
    eyeTracking: false,
    adaptive: false,
    spatialAudio: false,
    trackAchievements: false,
    ...features,
  };
};

// Type guards
export const isNavigationConsciousnessFeatures = (
  features: any
): features is NavigationConsciousnessFeatures => {
  return features && (
    features.patternRecognition !== undefined ||
    features.audioNavigation !== undefined ||
    hasConsciousnessFeatures(features)
  );
};

export const isFormConsciousnessFeatures = (
  features: any
): features is FormConsciousnessFeatures => {
  return features && (
    features.smartAutoComplete !== undefined ||
    features.predictiveValidation !== undefined ||
    features.formSuggestions !== undefined ||
    hasConsciousnessFeatures(features)
  );
};

export const isChartConsciousnessFeatures = (
  features: any
): features is ChartConsciousnessFeatures => {
  return features && (
    features.chartInsights !== undefined ||
    features.patternAnalysis !== undefined ||
    features.dataPointFocus !== undefined ||
    hasConsciousnessFeatures(features)
  );
};

// Error types
export class ConsciousnessError extends Error {
  constructor(
    message: string,
    public readonly feature: ConsciousnessFeatureFlag,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ConsciousnessError';
  }
}

export class ConsciousnessPermissionError extends ConsciousnessError {
  constructor(feature: ConsciousnessFeatureFlag) {
    super(
      `Permission denied for consciousness feature: ${feature}`,
      feature,
      'PERMISSION_DENIED'
    );
  }
}

export class ConsciousnessUnsupportedError extends ConsciousnessError {
  constructor(feature: ConsciousnessFeatureFlag) {
    super(
      `Consciousness feature not supported: ${feature}`,
      feature,
      'UNSUPPORTED_FEATURE'
    );
  }
}

// Analytics types for consciousness features
export interface ConsciousnessAnalytics {
  sessionId: string;
  userId?: string;
  features: ConsciousnessFeatureFlag[];
  interactions: ConsciousnessInteraction[];
  performance: ConsciousnessPerformanceMetrics;
  errors: ConsciousnessError[];
}

export interface ConsciousnessInteraction {
  id: string;
  type: 'gaze' | 'biometric' | 'predictive' | 'spatial' | 'achievement';
  componentType: string;
  timestamp: number;
  duration?: number;
  metadata: Record<string, any>;
}

export interface ConsciousnessPerformanceMetrics {
  initialization: number;
  averageResponseTime: number;
  memoryUsage: number;
  errorRate: number;
  featureUsage: Record<ConsciousnessFeatureFlag, number>;
}