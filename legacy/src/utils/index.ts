// AuraGlass Utility Modules
export * from './themeHelpers';
export * from './elementTypes';
export * from './browserCompatibility';
export * from './deviceCapabilities';
export * from './performanceOptimizations';

// Re-export commonly used utilities
export { 
  createGlassTheme,
  getThemeValue,
  createThemeVariant,
  adjustColorOpacity,
  lightenColor,
  darkenColor,
  createSpacingScale,
  getSpacingValue,
  createTypographyScale,
  validateTheme,
  generateThemeCSSVariables,
  mergeThemes,
  createDarkTheme,
  createLightTheme,
} from './themeHelpers';

export {
  getElementInfo,
  detectElementCapabilities,
  elementBehaviors,
  elementStyles,
  elementAccessibility,
} from './elementTypes';

export {
  detectBrowser,
  detectCapabilities,
  compatibilityHelpers,
  featureDetection,
  browserOptimizations,
  PolyfillManager,
} from './browserCompatibility';

export {
  detectDevice,
  performanceOptimizations,
  deviceOptimizations,
  adaptiveRendering,
} from './deviceCapabilities';

export {
  PerformanceMonitor,
  MemoryManager,
  AdaptiveQuality,
} from './performanceOptimizations';

// Default exports for common use cases
export { detectDevice as default } from './deviceCapabilities';
