import React from 'react';
/**
 * AuraGlass Stable API Definitions - v1.0.0
 * 
 * These interfaces represent the LOCKED API surface for AuraGlass.
 * Breaking changes to these types require major version bump.
 * 
 * STABILITY GUARANTEE: These interfaces will not change in v1.x releases.
 */

import type { CSSProperties } from 'react';

/**
 * @stable - Primary glass configuration options
 * @version 1.0.0
 * @since 1.0.0
 */
export interface GlassOptions {
  /** 
   * Visual intent affecting color theming
   * @stable
   * @default 'neutral'
   */
  readonly intent?: GlassIntent;
  
  /** 
   * Elevation level affecting depth and prominence
   * @stable 
   * @default 'level2'
   */
  readonly elevation?: GlassElevation;
  
  /** 
   * Performance tier affecting visual quality
   * @stable
   * @default 'high'
   */
  readonly tier?: GlassTier;
  
  /** 
   * Enable interactive states and behaviors
   * @stable
   * @default false
   */
  readonly interactive?: boolean;
  
  /** 
   * Enable hover lift effect
   * @stable
   * @default false
   */
  readonly hoverLift?: boolean;
  
  /** 
   * Enable focus ring for accessibility
   * @stable
   * @default false
   */
  readonly focusRing?: boolean;
  
  /** 
   * Enable ripple effect on interaction
   * @stable
   * @default false
   */
  readonly ripple?: boolean;
  
  /** 
   * Enable touch device optimizations
   * @stable
   * @default false
   */
  readonly touchOptimized?: boolean;
  
  /** 
   * Enable accessibility enhancements
   * @stable
   * @default false
   */
  readonly a11y?: boolean;
}

/**
 * @stable - Glass visual intent enumeration
 * @version 1.0.0
 * @since 1.0.0
 */
export type GlassIntent = 
  | 'neutral'   // Default surfaces, containers
  | 'primary'   // Primary actions, highlights  
  | 'success'   // Success states, confirmations
  | 'warning'   // Warnings, cautions
  | 'danger'    // Errors, destructive actions
  | 'info';     // Information, help content

/**
 * @stable - Glass elevation levels
 * @version 1.0.0  
 * @since 1.0.0
 */
export type GlassElevation = 
  | 'level1'    // Subtle backgrounds, disabled states
  | 'level2'    // Cards, panels, default surfaces
  | 'level3'    // Modal dialogs, elevated content
  | 'level4';   // Tooltips, dropdowns, overlays

/**
 * @stable - Performance tier system
 * @version 1.0.0
 * @since 1.0.0
 */
export type GlassTier = 
  | 'high'      // Desktop, high-end mobile - full effects
  | 'medium'    // Mid-range devices - reduced complexity  
  | 'low';      // Low-power devices - minimal effects

/**
 * @stable - Primary glass styling function
 * @version 1.0.0
 * @since 1.0.0
 * 
 * The single, authoritative function for creating glass styles.
 * All other glass styling methods are deprecated.
 * 
 * @param options - Glass configuration options
 * @returns CSS properties object for glass styling
 * 
 * @example
 * ```typescript
 * const styles = createGlassStyle({
 *   intent: 'primary',
 *   elevation: 'level2', 
 *   tier: 'high',
 *   interactive: true
 * });
 * ```
 */


/**
 * @stable - Glass CSS class naming convention
 * @version 1.0.0
 * @since 1.0.0
 * 
 * Generated CSS classes follow this pattern:
 * `.glass-{intent}-{elevation}`
 * 
 * Combined with modifier classes:
 * `.glass-tier-{tier}`
 * `.glass-interactive`
 * `.glass-state-{state}`
 */
export type GlassCSSClass = `glass-${GlassIntent}-${GlassElevation}`;

/**
 * @stable - Glass component props interface
 * @version 1.0.0
 * @since 1.0.0
 * 
 * Standard props interface for glass-enabled components
 */
export interface GlassComponentProps {
  /** Glass configuration */
  readonly glass?: GlassOptions;
  
  /** Additional CSS classes */
  readonly className?: string;
  
  /** Inline styles (discouraged - use glass options instead) */
  readonly style?: CSSProperties;
  
  /** Test ID for automated testing */
  readonly 'data-testid'?: string;
}

/**
 * @stable - Glass design tokens interface
 * @version 1.0.0
 * @since 1.0.0
 * 
 * Represents the structure of canonical glass tokens.
 * Token values may change, but structure is stable.
 */
export interface GlassTokenStructure {
  readonly surfaces: Record<GlassIntent, Record<GlassElevation, {
    readonly backdropBlur: { readonly px: number };
    readonly surface: { 
      readonly base: string; 
      readonly overlay?: string; 
    };
    readonly border: { 
      readonly color: string; 
      readonly width: number; 
      readonly style: 'solid' | 'dashed' | 'none'; 
    };
    readonly text: { 
      readonly primary: string; 
      readonly secondary: string; 
    };
    readonly innerGlow?: { 
      readonly color: string; 
      readonly spread: number; 
      readonly blur: number; 
    };
    readonly outerShadow?: { 
      readonly color: string; 
      readonly x: number; 
      readonly y: number; 
      readonly blur: number; 
      readonly spread: number; 
    };
  }>>;
  
  readonly performance: Record<GlassTier, {
    readonly blurMultiplier: number;
    readonly opacityMultiplier: number;
  }>;
}

/**
 * @stable - Quality constraints and guarantees
 * @version 1.0.0
 * @since 1.0.0
 */
export interface GlassQualityConstraints {
  /** WCAG AA minimum contrast ratio */
  readonly MIN_CONTRAST_RATIO: 4.5;
  
  /** Minimum blur value (px) */
  readonly MIN_BLUR_PX: 4;
  
  /** Maximum blur value (px) */  
  readonly MAX_BLUR_PX: 32;
  
  /** Minimum opacity for visibility */
  readonly MIN_OPACITY: 0.05;
  
  /** Maximum opacity to maintain glass effect */
  readonly MAX_OPACITY: 0.45;
  
  /** Maximum render time (ms) for performance */
  readonly MAX_RENDER_TIME_MS: 16;
}

/**
 * @stable - Runtime probe data structure
 * @version 1.0.0
 * @since 1.0.0
 */
export interface GlassProbeData {
  readonly timestamp: number;
  readonly elementId?: string;
  readonly glassConfiguration: {
    readonly intent: string;
    readonly elevation: string; 
    readonly tier: string;
  };
  readonly performance: {
    readonly backdropSupported: boolean;
    readonly gpuAccelerated: boolean;
    readonly renderTime?: number;
    readonly memoryUsage?: number;
  };
  readonly compliance: {
    readonly wcagContrast: number;
    readonly minVisibility: boolean;
    readonly accessibilityScore: number;
  };
  readonly usage: {

    readonly deprecationWarnings: readonly string[];
  };
}

/**
 * @stable - Migration status for legacy APIs
 * @version 1.0.0
 * @since 1.0.0
 */
export interface GlassMigrationStatus {
  readonly phase: 'deprecated' | 'removed';
  readonly replacement: string;
  readonly migrationGuide: string;
  readonly removalVersion?: string;
}

/**
 * @deprecated Legacy glass APIs - will be removed in v2.0.0
 * @removal v2.0.0
 */
export interface DeprecatedGlassAPIs {

  glassBorder: GlassMigrationStatus;
  

  glassSurface: GlassMigrationStatus;
  

  interactiveGlass: GlassMigrationStatus;
  

  createGlassMixin: GlassMigrationStatus;
  

  createGlassFoundation: GlassMigrationStatus;
}

// Note: TypeScript interfaces cannot be frozen at runtime
// These are compile-time type definitions only

/**
 * Version metadata for API tracking
 */
export const GLASS_API_VERSION = '1.0.0' as const;
export const GLASS_API_STABILITY = 'stable' as const;
export const GLASS_API_LOCKED_DATE = '2025-09-09T06:34:00Z' as const;