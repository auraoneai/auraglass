import React from "react";
import { CSSProperties } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface GlassTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: string;
  boxShadow: string;
  backdropFilter: string;
  transition: string;
}

// Theme helper functions
export const createGlassTheme = (
  baseTheme: Partial<GlassTheme> = {}
): GlassTheme => {
  const defaultColors: ThemeColors = {
    primary: "hsl(var(--glass-color-primary))",
    secondary: "var(--glass-gray-500)",
    accent: "#8b5cf6",
    background: "#0b1220",
    surface: "rgba(255,255,255,0.06)",
    text: "rgba(255,255,255,0.92)",
    textSecondary: "var(--glass-text-secondary)",
    border: "rgba(255,255,255,0.16)",
    error: "hsl(var(--glass-color-danger))",
    warning: "hsl(var(--glass-color-warning))",
    success: "hsl(var(--glass-color-success))",
    info: "#0ea5e9",
  };

  const BACKDROP_FILTER_PROP = "backdropFilter" as const;

  return {
    colors: { ...defaultColors, ...(baseTheme.colors || {}) },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem",
      ...baseTheme.spacing,
    },
    typography: {
      fontFamily: "system-ui, -apple-system, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        xxl: "1.5rem",
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      ...baseTheme.typography,
    },
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
    [BACKDROP_FILTER_PROP]: "var(--glass-backdrop-filter, blur(16px))",
    // Use tokenized backdrop via CSS variables on surfaces
    // Use createGlassStyle() instead,
    transition: "all 0.2s ease",
    ...baseTheme,
  };
};

export const getThemeValue = (
  theme: GlassTheme,
  path: string,
  fallback?: any
): any => {
  const keys = path.split(".");
  let value: any = theme;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }

  return value;
};

export const createThemeVariant = (
  baseTheme: GlassTheme,
  overrides: Partial<GlassTheme>
): GlassTheme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...overrides.colors,
    },
    spacing: {
      ...baseTheme.spacing,
      ...overrides.spacing,
    },
    typography: {
      ...baseTheme.typography,
      ...overrides.typography,
      fontSize: {
        ...baseTheme.typography.fontSize,
        ...overrides.typography?.fontSize,
      },
      fontWeight: {
        ...baseTheme.typography.fontWeight,
        ...overrides.typography?.fontWeight,
      },
      lineHeight: {
        ...baseTheme.typography.lineHeight,
        ...overrides.typography?.lineHeight,
      },
    },
  };
};

// Color manipulation utilities
export const adjustColorOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Handle rgba colors
  if (color.startsWith("rgba")) {
    const parts = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (parts) {
      return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${opacity})`;
    }
  }

  // Handle rgb colors
  if (color.startsWith("rgb")) {
    const parts = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (parts) {
      return `rgba(${parts[1]}, ${parts[2]}, ${parts[3]}, ${opacity})`;
    }
  }

  return color;
};

export const lightenColor = (color: string, amount: number): string => {
  // Simple color lightening - in a real implementation you'd use a proper color library
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return color;
};

export const darkenColor = (color: string, amount: number): string => {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return color;
};

// Spacing utilities
export const createSpacingScale = (base: number = 4): ThemeSpacing => {
  return {
    xs: `${base}px`,
    sm: `${base * 2}px`,
    md: `${base * 4}px`,
    lg: `${base * 6}px`,
    xl: `${base * 8}px`,
    xxl: `${base * 12}px`,
  };
};

export const getSpacingValue = (
  spacing: ThemeSpacing,
  size: keyof ThemeSpacing
): string => {
  return spacing[size];
};

// Typography utilities
export const createTypographyScale = (
  baseSize: number = 16,
  scale: number = 1.25
): ThemeTypography["fontSize"] => {
  return {
    xs: `${baseSize / scale ** 2}px`,
    sm: `${baseSize / scale}px`,
    md: `${baseSize}px`,
    lg: `${baseSize * scale}px`,
    xl: `${baseSize * scale ** 2}px`,
    xxl: `${baseSize * scale ** 3}px`,
  };
};

export const createFontWeightScale = (): ThemeTypography["fontWeight"] => {
  return {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };
};

// Theme validation
export const validateTheme = (theme: Partial<GlassTheme>): string[] => {
  const errors: string[] = [];

  if (!theme.colors) {
    errors.push("Theme must include colors");
  } else {
    const requiredColors: (keyof ThemeColors)[] = [
      "primary",
      "background",
      "text",
    ];

    requiredColors.forEach((color: any) => {
      if (!(theme.colors as any)![color]) {
        errors.push(`Theme colors must include ${color}`);
      }
    });
  }

  if (!theme.spacing) {
    errors.push("Theme must include spacing");
  }

  if (!theme.typography) {
    errors.push("Theme must include typography");
  }

  return errors;
};

// CSS custom properties generation
export const generateThemeCSSVariables = (theme: GlassTheme): string => {
  const variables: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables.push(`  --color-${key}: ${value};`);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`  --spacing-${key}: ${value};`);
  });

  // Typography
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables.push(`  --font-size-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`  --font-weight-${key}: ${value};`);
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables.push(`  --line-height-${key}: ${value};`);
  });

  variables.push(`  --font-family: ${theme.typography.fontFamily};`);
  variables.push(`  --border-radius: ${theme.borderRadius};`);
  variables.push(`  --box-shadow: ${theme.boxShadow};`);
  variables.push(`  --backdrop-filter: ${theme.backdropFilter};`);
  variables.push(`  --transition: ${theme.transition};`);

  return `:root {\n${variables.join("\n")}\n}`;
};

// Theme merging utilities
export const mergeThemes = (
  ...themes: Partial<GlassTheme>[]
): Partial<GlassTheme> => {
  const merged = themes.reduce((acc, theme) => {
    return {
      ...acc,
      ...theme,
      colors: {
        ...acc.colors,
        ...theme.colors,
      },
      spacing: {
        ...acc.spacing,
        ...theme.spacing,
      },
      typography: {
        ...acc.typography,
        ...theme.typography,
        fontSize: {
          ...acc.typography?.fontSize,
          ...theme.typography?.fontSize,
        },
        fontWeight: {
          ...acc.typography?.fontWeight,
          ...theme.typography?.fontWeight,
        },
        lineHeight: {
          ...acc.typography?.lineHeight,
          ...theme.typography?.lineHeight,
        },
      },
    } as Partial<GlassTheme>;
  }, {} as Partial<GlassTheme>);

  // Validate and provide defaults
  validateTheme(merged);

  return createGlassTheme(merged);
};

// Theme preset generators
export const createDarkTheme = (): GlassTheme => {
  return createGlassTheme({
    colors: {
      primary: "var(--glass-color-primary-light)",
      secondary: "var(--glass-gray-400)",
      accent: "#a78bfa",
      background: "var(--glass-primary-level2-surface)",
      surface: "rgba(31, 41, 55, 0.8)",
      text: "var(--glass-gray-50)",
      textSecondary: "rgba(156, 163, 175, 0.8)",
      border: "rgba(75, 85, 99, 0.3)",
      error: "var(--glass-color-danger-light)",
      warning: "var(--glass-color-warning-light)",
      success: "var(--glass-color-success-light)",
      info: "var(--glass-color-primary-light)",
    },
  });
};

export const createLightTheme = (): GlassTheme => {
  return createGlassTheme({
    colors: {
      primary: "hsl(var(--glass-color-primary))",
      secondary: "var(--glass-gray-500)",
      accent: "#8b5cf6",
      background: "var(--glass-neutral-level2-surface)",
      surface: "rgba(249, 250, 251, 0.8)",
      text: "var(--glass-gray-900)",
      textSecondary: "rgba(75, 85, 99, 0.7)",
      border: "rgba(229, 231, 235, 0.5)",
      error: "hsl(var(--glass-color-danger))",
      warning: "hsl(var(--glass-color-warning))",
      success: "hsl(var(--glass-color-success))",
      info: "hsl(var(--glass-color-primary))",
    },
  });
};
