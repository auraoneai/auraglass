import React from 'react';
// Core type definitions
export type ColorMode = 'light' | 'dark' | 'system';

export type ThemeVariant = 'default' | 'compact' | 'expanded' | 'minimal';

export interface Theme {
  colors: {
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
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
  borderRadius: Record<string, string>;
  glass: {
    intensity: string;
    blur: number;
    backdropOpacity: number;
    borderOpacity: number;
    shadowOpacity: number;
  };
  mode: ColorMode;
}

export interface GlassSurfaceProps {
  variant?: 'frosted' | 'crystal' | 'tinted' | 'metallic' | 'neon';
  blur?: 'none' | 'subtle' | 'medium' | 'strong' | 'intense';
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level4';
  interactive?: boolean;
  className?: string;
}
