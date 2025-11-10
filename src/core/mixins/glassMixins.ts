import { CSSProperties } from 'react';
import { detectDevice } from '../../utils/deviceCapabilities';
import { AURA_GLASS, PERFORMANCE_TIERS, glassTokenUtils, GlassIntent, GlassElevation, QualityTier } from '../../tokens/glass';

export interface GlassOptions {
  intent?: GlassIntent;
  elevation?: GlassElevation;
  tier?: QualityTier;
  interactive?: boolean;
  hoverLift?: boolean;
  focusRing?: boolean;
  press?: boolean;
}

/**
 * SINGLE PUBLIC API - Creates glass styles from canonical tokens
 * 
 * This is the ONLY way to create glass styles going forward.
 * All other methods are deprecated.
 */
export function createGlassStyle(opts: GlassOptions = {}): CSSProperties {
  const {
    intent = 'neutral',
    elevation = 'level2',
    tier = 'high',
    interactive = false,
    hoverLift = false,
    focusRing = false,
    press = false,
  } = opts;

  // Get the base styles from canonical tokens
  const styles = glassTokenUtils.buildSurfaceStyles(intent, elevation, tier);

  if (!styles.backdropFilter) {
    const surface = glassTokenUtils.getSurface(intent, elevation);
    const fallbackFilter = glassTokenUtils.buildBackdropFilter(surface.backdropBlur.px, tier);
    (styles as any).backdropFilter = fallbackFilter;
    (styles as any).WebkitBackdropFilter = fallbackFilter;
  }

  if (!styles.background) {
    const surface = glassTokenUtils.getSurface(intent, elevation);
    (styles as any).background = surface.surface.base;
  }
  
  // Add interactive enhancements if requested
  if (interactive) {
    (styles as any).cursor = 'pointer';
    (styles as any).userSelect = 'none';
    
    // Interactive surfaces get slightly enhanced shadows by default
    if (styles.boxShadow && styles.boxShadow !== 'none') {
      styles.transition = `all ${AURA_GLASS.motion.defaultMs}ms ease-out, transform ${AURA_GLASS.motion.defaultMs}ms ease-out`;
    }
  }
  
  // Add hover lift capability (transform applied via CSS :hover)
  if (hoverLift) {
    styles.transition = `${styles.transition || 'all 200ms ease-out'}, transform ${AURA_GLASS.motion.defaultMs}ms ease-out`;
  }
  
  // Add focus ring capability (applied via CSS :focus-visible)
  if (focusRing) {
    // The actual focus ring is applied via CSS, but we ensure transitions are smooth
    styles.transition = `${styles.transition || 'all 200ms ease-out'}, box-shadow ${AURA_GLASS.motion.defaultMs}ms ease-out`;
  }

  // Add press effect capability (applied via CSS :active)
  if (press) {
    // The actual press effect is applied via CSS, but we ensure transitions are smooth
    styles.transition = `${styles.transition || 'all 200ms ease-out'}, transform ${AURA_GLASS.motion.defaultMs}ms ease-out`;
  }

  return styles;
}

/**
 * DEPRECATED: Legacy API support - will be removed in next version
 * @deprecated Use createGlassStyle() instead
 */
export function createGlassMixin(options: any = {}): CSSProperties {
  console.warn('[AuraGlass] createGlassMixin is deprecated. Use createGlassStyle() instead.');
  
  // Map old options to new options
  const newOptions: GlassOptions = {
    intent: 'neutral',
    elevation: 'level2',
    tier: 'high',
    interactive: options.interactive || false,
  };
  
  // Basic variant mapping
  if (options.variant === 'primary') newOptions.intent = 'primary';
  if (options.variant === 'success') newOptions.intent = 'success';
  if (options.variant === 'warning') newOptions.intent = 'warning';
  if (options.variant === 'error') newOptions.intent = 'danger';
  if (options.variant === 'info') newOptions.intent = 'info';
  
  // Basic elevation mapping
  if (options.elevation === 1) newOptions.elevation = 'level1';
  if (options.elevation === 2) newOptions.elevation = 'level2';
  if (options.elevation === 3) newOptions.elevation = 'level3';
  if (options.elevation === 4) newOptions.elevation = 'level4';
  
  return createGlassStyle(newOptions);
}

/**
 * DEPRECATED: Legacy hover mixin
 * @deprecated Use CSS :hover with createGlassStyle({ hoverLift: true })
 */
export function createGlassHoverMixin(options: any = {}): CSSProperties {
  console.warn('[AuraGlass] createGlassHoverMixin is deprecated. Use CSS :hover with hoverLift option.');
  
  return {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
  };
}

/**
 * DEPRECATED: Legacy focus mixin
 * @deprecated Use CSS :focus-visible with createGlassStyle({ focusRing: true })
 */
export function createGlassFocusMixin(options: any = {}): CSSProperties {
  console.warn('[AuraGlass] createGlassFocusMixin is deprecated. Use CSS :focus-visible with focusRing option.');
  
  return {
    outline: 'none',
    boxShadow: '0 0 0 3px var(--glass-color-primary, 0.3)',
  };
}

/**
 * DEPRECATED: Legacy disabled mixin
 * @deprecated Use CSS :disabled with reduced opacity
 */
export function createGlassDisabledMixin(): CSSProperties {
  console.warn('[AuraGlass] createGlassDisabledMixin is deprecated. Use CSS :disabled with opacity: 0.6.');
  
  return {
    opacity: 0.6,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  };
}

/**
 * DEPRECATED: Legacy loading mixin
 * @deprecated Use modern loading UI patterns
 */
export function createGlassLoadingMixin(): CSSProperties {
  console.warn('[AuraGlass] createGlassLoadingMixin is deprecated. Use modern loading UI patterns.');
  
  return {
    position: 'relative',
    overflow: 'hidden',
  };
}

/**
 * Utility: Generate CSS custom properties for dynamic theming
 * This creates CSS variables that can be overridden at runtime
 */
export function generateGlassThemeVariables(options: {
  intent?: GlassIntent;
  elevation?: GlassElevation;
} = {}): Record<string, string> {
  const { intent = 'neutral', elevation = 'level2' } = options;

  const surface = glassTokenUtils.getSurface(intent, elevation);

  return {
    '--glass-surface': surface.surface.base,
    '--glass-border-color': surface.border.color,
    '--glass-border-width': `${surface.border.width}px`,
    '--glass-blur': `${surface.backdropBlur.px}px`,
    '--glass-text-primary': surface.text.primary,
    '--glass-text-secondary': surface.text.secondary,
    '--glass-shadow': surface.outerShadow
      ? `${surface.outerShadow.x}px ${surface.outerShadow.y}px ${surface.outerShadow.blur}px ${surface.outerShadow.spread}px ${surface.outerShadow.color}`
      : 'none',
    '--glass-radius': `${AURA_GLASS.radii.md}px`,
    '--glass-transition': `all ${AURA_GLASS.motion.defaultMs}ms ease-out`,
  };
}

/**
 * Utility: Create responsive glass styles for different screen sizes
 * 
 * Returns CSS properties optimized for different performance tiers
 * based on typical device capabilities.
 */
export function createResponsiveGlassStyle(
  mobile: GlassOptions,
  tablet: GlassOptions,
  desktop: GlassOptions
): Record<string, CSSProperties> {
  return {
    // Mobile: use low tier for better performance
    mobile: createGlassStyle({ ...mobile, tier: 'low' }),
    // Tablet: use medium tier for balanced experience  
    tablet: createGlassStyle({ ...tablet, tier: 'medium' }),
    // Desktop: use high tier for full experience
    desktop: createGlassStyle({ ...desktop, tier: 'high' }),
  };
}

/**
 * Performance helper: Detect if device supports high-quality glass
 */
export function canUseHighQualityGlass(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Check for backdrop-filter support
  const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)') || 
                                 CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  
  if (!supportsBackdropFilter) return false;
  
  // Check device capabilities
  const devicePixelRatio = window.devicePixelRatio || 1;
  const isHighDPI = devicePixelRatio >= 2;
  
  // Check for hardware acceleration via cached device capabilities
  const hasWebGL = detectDevice().capabilities.webgl;
  
  return isHighDPI && hasWebGL;
}

/**
 * Performance helper: Get recommended tier for current device
 */
export function getRecommendedTier(): QualityTier {
  if (typeof window === 'undefined') return 'high';
  
  if (canUseHighQualityGlass()) return 'high';
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'low';
  
  // Check connection quality if available
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    if (conn.effectiveType === '4g') return 'medium';
    if (conn.effectiveType === '3g') return 'low';
  }
  
  return 'medium';
}

// Export types for external usage
export type { GlassIntent, GlassElevation, QualityTier };

// Legacy types for backward compatibility
export type GlassVariant = 'clear' | 'frosted' | 'tinted' | 'luminous' | 'dynamic';
export type BlurIntensity = 'none' | 'subtle' | 'medium' | 'strong' | 'intense';
