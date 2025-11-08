/**
 * AuraGlass Style Utilities
 * Generate token-based style objects for glassmorphism components
 */

export interface GlassStyleOptions {
  elev?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  opacity?: number;
  interactive?: boolean;
  glow?: boolean;
}

/**
 * Token values mapped from CSS variables
 * These should match the values in tokens.css
 */
const tokens = {
  blur: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  elev: {
    0: 'none',
    1: '0 2px 8px rgba(0 0 0 / 0.12)',
    2: '0 4px 16px rgba(0 0 0 / 0.16)',
    3: '0 8px 24px rgba(0 0 0 / 0.20)',
    4: '0 12px 32px rgba(0 0 0 / 0.24)',
    5: '0 16px 40px rgba(0 0 0 / 0.28)',
    6: '0 24px 56px rgba(0 0 0 / 0.32)',
  },
  radius: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  transition: {
    duration: '250ms',
    timing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  gradient: {
    default: 'linear-gradient(135deg, rgba(255 255 255 / 0.25) 0%, rgba(255 255 255 / 0.15) 50%, rgba(255 255 255 / 0.10) 100%)',
    primary: 'linear-gradient(135deg, rgba(255 255 255 / 0.30) 0%, rgba(59 130 246 / 0.20) 50%, rgba(59 130 246 / 0.10) 100%)',
    success: 'linear-gradient(135deg, rgba(255 255 255 / 0.30) 0%, rgba(34 197 94 / 0.20) 50%, rgba(34 197 94 / 0.10) 100%)',
    warning: 'linear-gradient(135deg, rgba(255 255 255 / 0.30) 0%, rgba(251 191 36 / 0.20) 50%, rgba(251 191 36 / 0.10) 100%)',
    danger: 'linear-gradient(135deg, rgba(255 255 255 / 0.30) 0%, rgba(239 68 68 / 0.20) 50%, rgba(239 68 68 / 0.10) 100%)',
    info: 'linear-gradient(135deg, rgba(255 255 255 / 0.30) 0%, rgba(14 165 233 / 0.20) 50%, rgba(14 165 233 / 0.10) 100%)',
  },
};

/**
 * Create a style object for glassmorphism components
 * Returns CSSProperties-compatible object
 */
export function createGlassStyle(options: GlassStyleOptions = {}): React.CSSProperties {
  const {
    elev = 2,
    variant = 'default',
    blur = 'lg',
    radius = 'lg',
    opacity,
    interactive = false,
    glow = false,
  } = options;
  
  const styles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: tokens.radius[radius],
    boxShadow: tokens.elev[elev],
    background: tokens.gradient[variant],
  };
  
  if (opacity !== undefined) {
    styles.opacity = opacity;
  }
  
  if (interactive) {
    styles.transition = `all ${tokens.transition.duration} ${tokens.transition.timing}`;
    styles.cursor = 'pointer';
    styles.willChange = 'transform, box-shadow';
  }
  
  if (glow) {
    styles.filter = 'drop-shadow(0 0 14px rgba(59 130 246 / 0.30))';
  }
  
  return styles;
}

/**
 * Get CSS variable for a token path
 */
export function getGlassToken(path: string): string {
  return `var(--glass-${path})`;
}

/**
 * Compose multiple glass styles with proper precedence
 */
export function composeGlassStyles(...styles: (React.CSSProperties | undefined)[]): React.CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

/**
 * Generate responsive glass styles
 */
export function createResponsiveGlassStyle(
  base: GlassStyleOptions,
  breakpoints: {
    sm?: GlassStyleOptions;
    md?: GlassStyleOptions;
    lg?: GlassStyleOptions;
    xl?: GlassStyleOptions;
  } = {}
): Record<string, React.CSSProperties> {
  const styles: Record<string, React.CSSProperties> = {
    base: createGlassStyle(base),
  };
  
  // Note: For actual responsive styles, you'd need to use CSS-in-JS
  // or generate media query strings. This is a simplified version.
  if (breakpoints.sm) styles.sm = createGlassStyle({ ...base, ...breakpoints.sm });
  if (breakpoints.md) styles.md = createGlassStyle({ ...base, ...breakpoints.md });
  if (breakpoints.lg) styles.lg = createGlassStyle({ ...base, ...breakpoints.lg });
  if (breakpoints.xl) styles.xl = createGlassStyle({ ...base, ...breakpoints.xl });
  
  return styles;
}

/**
 * Calculate appropriate text color based on background luminance
 */
export function getGlassTextColor(variant: GlassStyleOptions['variant'] = 'default', isDark = false): string {
  // In a real implementation, this would calculate actual luminance
  // For now, return token-based values
  return isDark ? 'rgba(255 255 255 / 0.95)' : 'rgba(0 0 0 / 0.90)';
}

/**
 * Generate animation properties for glass elements
 */
export function createGlassAnimation(type: 'float' | 'shimmer' | 'ambient' | 'press'): React.CSSProperties {
  const animations: Record<typeof type, React.CSSProperties> = {
    float: {
      animation: 'glass-float 3s ease-in-out infinite',
    },
    shimmer: {
      position: 'relative',
      overflow: 'hidden',
    },
    ambient: {
      animation: 'glass-ambient 4s ease-in-out infinite',
    },
    press: {
      transition: 'transform 150ms cubic-bezier(0.2, 0, 0, 1)',
    },
  };
  
  return animations[type] || {};
}

/**
 * Create elevation-specific shadow values
 */
export function getElevationShadow(level: GlassStyleOptions['elev'] = 2): string {
  return tokens.elev[level || 0];
}

/**
 * Create border styles with proper token usage
 */
export function createGlassBorder(
  variant: GlassStyleOptions['variant'] = 'default',
  width = 2
): React.CSSProperties {
  const borderColors = {
    default: 'rgba(255 255 255 / 0.40)',
    primary: 'rgba(59 130 246 / 0.40)',
    success: 'rgba(34 197 94 / 0.40)',
    warning: 'rgba(251 191 36 / 0.40)',
    danger: 'rgba(239 68 68 / 0.40)',
    info: 'rgba(14 165 233 / 0.40)',
  };
  
  return {
    border: `${width}px solid ${borderColors[variant]}`,
  };
}