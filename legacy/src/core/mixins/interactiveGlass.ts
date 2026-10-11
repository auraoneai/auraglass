/**
 * @deprecated Use createGlassStyle() from glassMixins instead
 * This file contains hardcoded glass interaction patterns that bypass our token system.

 */

import { CSSProperties } from 'react';




export interface InteractiveGlassConfig {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
  disabled?: boolean;
  scale?: number;
  glow?: boolean;
  ripple?: boolean;
  transition?: string;
}

/**


 */
export const interactiveGlass = (config: InteractiveGlassConfig = {}): CSSProperties => {

  
  const {
    hover = true,
    active = true,
    focus = true,
    disabled = false,
    scale = 1.02,
    glow = true,
    ripple = false,
    transition = 'all 0.2s ease',
  } = config;

  // Use the unified glass style with interactive options
  const baseStyles = {
    intent: 'neutral',
    elevation: 'level2',
    interactive: true,
    hoverLift: hover,
    focusRing: focus,
  };

  // Add legacy interactive behavior
  const legacyStyles: CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  if (disabled) {
    legacyStyles.opacity = 0.5;
    legacyStyles.pointerEvents = 'none';
  }

  return { ...baseStyles, ...legacyStyles };
};

/**


 */
export const createInteractiveGlassVariants = () => {
  return {
    // Note: Interactive glass variants are now handled by the unified glass system
  };
};

/**


 */
export const createRippleEffect = (color: string = 'rgba(255, 255, 255, 0.3)'): CSSProperties => {
  return {
    position: 'relative',
    overflow: 'hidden',
    // Note: Ripple effects are now handled by the unified glass system
  };
};

/**


 */
export const createMagneticEffect = (strength: number = 0.3): CSSProperties => {
  return {
    transition: 'transform 0.3s ease',
    // Note: Magnetic effects are now handled by the unified glass system
  };
};

/**


 */
export const glassButtonVariants = (() => {
  return {
    // Note: Button variants are now handled by the unified glass system
  };
})();

// Interactive state management
export interface InteractiveState {
  isHovered: boolean;
  isActive: boolean;
  isFocused: boolean;
  isDisabled: boolean;
}

/**


 */
export const createInteractiveStateStyles = (state: InteractiveState): CSSProperties => {
  const styles: CSSProperties = {};

  if (state.isDisabled) {
    styles.opacity = 0.5;
    styles.cursor = 'not-allowed';
    styles.pointerEvents = 'none';
  } else {
    if (state.isHovered) {
      styles.transform = 'scale(1.02)';
      styles.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
    }

    if (state.isActive) {
      styles.transform = 'scale(0.98)';
    }

    if (state.isFocused) {
      styles.outline = '2px solid rgba(255, 255, 255, 0.5)';
      styles.outlineOffset = '2px';
    }
  }

  return styles;
};

/**


 */
export const createAccessibleInteractiveStyles = (): CSSProperties => {
  return {
    // Note: These styles are now handled by the unified glass system
  };
};

/**


 */
export const createTouchOptimizedStyles = (): CSSProperties => {
  return {
    // Increase touch target size
    minWidth: '44px',
    minHeight: '44px',
    // Note: Touch optimizations are now handled by the unified glass system
    // Prevent text selection on touch
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  };
};
