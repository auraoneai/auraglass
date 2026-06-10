// token-lint-ignore-file: token definitions intentionally use raw color values
// Design system constants and configuration
import { createGlassStyle } from "../core/mixins/glassMixins";

export const DESIGN_SYSTEM = {
  name: "AuraGlass",
  version: "1.0.0",
  author: "AuraGlass Team",
  description: "Modern glassmorphism design system for React",
} as const;

// Animation constants
export const ANIMATION = {
  // Duration presets
  DURATION: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  } as const,

  // Easing presets
  EASING: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    bounceIn: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    bounceOut: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    elasticIn: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    elasticOut: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  } as const,

  // Spring physics constants
  SPRING: {
    gentle: { stiffness: 120, damping: 14, mass: 1 },
    wobbly: { stiffness: 180, damping: 12, mass: 1 },
    stiff: { stiffness: 210, damping: 20, mass: 1 },
    slow: { stiffness: 280, damping: 60, mass: 1 },
    bouncy: { stiffness: 170, damping: 8, mass: 1 },
  } as const,
} as const;

// Color constants
export const COLORS = {
  // Glass morphism colors
  glass: {
    frosted: "rgba(255, 255, 255, 0.1)",
    dynamic: "rgba(255, 255, 255, 0.15)",
    clear: "transparent",
    tinted: "rgba(255, 255, 255, 0.08)",
    luminous: "rgba(255, 255, 255, 0.2)",
  },

  // Semantic colors
  semantic: {
    primary: "var(--glass-color-primary)",
    secondary: "var(--glass-gray-500)",
    success: "var(--glass-color-success)",
    warning: "var(--glass-color-warning)",
    error: "var(--glass-color-danger)",
    info: "var(--glass-color-primary)",
  },

  // Neutral colors
  neutral: {
    white: "var(--glass-white)",
    black: "var(--glass-black)",
    gray: {
      50: "var(--glass-gray-50)",
      100: "var(--glass-gray-100)",
      200: "var(--glass-gray-200)",
      300: "var(--glass-gray-300)",
      400: "var(--glass-gray-400)",
      500: "var(--glass-gray-500)",
      600: "var(--glass-gray-600)",
      700: "var(--glass-gray-700)",
      800: "var(--glass-gray-800)",
      900: "var(--glass-gray-900)",
    },
  },

  // Glass-specific colors with transparency
  glassColors: {
    surface: "rgba(255, 255, 255, 0.1)",
    surfaceHover: "rgba(255, 255, 255, 0.15)",
    surfaceActive: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.2)",
    borderHover: "rgba(255, 255, 255, 0.3)",
    text: "var(--glass-text-primary)",
    textSecondary: "var(--glass-text-secondary)",
    shadow: "rgba(0, 0, 0, 0.15)",
  },
} as const;

// Typography constants
export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  // Font sizes
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },

  // Font weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// Spacing constants
export const SPACING = {
  // Spacing scale
  space: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
    56: "14rem",
    64: "16rem",
  },

  // Container max widths
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Border radius constants
export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

// Box shadow constants
export const BOX_SHADOW = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  outline: "0 0 0 3px rgba(66, 153, 225, 0.5)",
} as const;

// Z-index constants
export const Z_INDEX = {
  auto: "auto",
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  60: 60,
  70: 70,
  80: 80,
  90: 90,
  100: 100,
} as const;

// Breakpoint constants
export const BREAKPOINTS = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Performance constants
export const PERFORMANCE = {
  // Frame rate targets
  fps: {
    target: 60,
    minimum: 30,
    critical: 15,
  },

  // Memory limits
  memory: {
    warning: 50 * 1024 * 1024, // 50MB
    critical: 100 * 1024 * 1024, // 100MB
    maximum: 200 * 1024 * 1024, // 200MB
  },

  // Quality tiers
  quality: {
    ultra: { particleLimit: 1000, textureSize: 2048 },
    high: { particleLimit: 500, textureSize: 1024 },
    medium: { particleLimit: 200, textureSize: 512 },
    low: { particleLimit: 50, textureSize: 256 },
  },
} as const;

// Accessibility constants
export const ACCESSIBILITY = {
  // Focus ring
  focusRing: {
    width: "2px",
    style: "solid",
    color: "hsl(var(--glass-color-primary)/0.5)",
    offset: "2px",
  },

  // Reduced motion
  motion: {
    reduced: "(prefers-reduced-motion: reduce)",
    enabled: "(prefers-reduced-motion: no-preference)",
  },

  // Color contrast
  contrast: {
    minimum: 4.5,
    enhanced: 7.0,
  },

  // Touch targets
  touch: {
    minimum: "44px",
    recommended: "48px",
  },
} as const;

// Glass morphism specific constants
export const GLASS = {
  // Opacity levels
  opacity: {
    subtle: 0.05,
    light: 0.1,
    standard: 0.15,
    strong: 0.2,
    intense: 0.3,
  },

  // Blur levels
  blur: {
    none: "none",
    subtle: "blur(4px)",
    light: "blur(8px)",
    standard: "blur(16px)",
    strong: "blur(24px)",
    heavy: "blur(32px)",
  },

  // Variants
  variants: {
    frosted: {},
    dynamic: {},
    clear: createGlassStyle({ intent: "neutral", elevation: "level2" }),
  },
} as const;

// Export utility functions
export const constants = {
  getColor: (key: string) => COLORS[key as keyof typeof COLORS],
  getSpacing: (key: string | number) =>
    SPACING.space[key as keyof typeof SPACING.space],
  getFontSize: (key: string) =>
    TYPOGRAPHY.fontSize[key as keyof typeof TYPOGRAPHY.fontSize],
  getBorderRadius: (key: string) =>
    BORDER_RADIUS[key as keyof typeof BORDER_RADIUS],
  getBoxShadow: (key: string) => BOX_SHADOW[key as keyof typeof BOX_SHADOW],
  getBreakpoint: (key: string) => BREAKPOINTS[key as keyof typeof BREAKPOINTS],
};

export default {
  DESIGN_SYSTEM,
  ANIMATION,
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  BOX_SHADOW,
  Z_INDEX,
  BREAKPOINTS,
  PERFORMANCE,
  ACCESSIBILITY,
  GLASS,
  constants,
};
