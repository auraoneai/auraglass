import React from 'react';
// Theme and styling type definitions
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  shadow: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
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
    loose: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface GlassTheme {
  intensity: 'subtle' | 'medium' | 'strong' | 'intense';
  blur: number;
  backdropOpacity: number;
  borderOpacity: number;
  shadowOpacity: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  borderRadius: ThemeBorderRadius;
  glass: GlassTheme;
  mode: 'light' | 'dark' | 'auto';
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Partial<Theme>) => void;
  toggleMode: () => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<Theme>;
  mode?: 'light' | 'dark' | 'auto';
}
