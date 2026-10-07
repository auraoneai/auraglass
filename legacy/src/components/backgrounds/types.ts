import React from 'react';

export interface AtmosphericBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'sunny';
  intensity?: number;
  animated?: boolean;
  animate?: boolean;
  particleCount?: number;
  colorScheme?: 'day' | 'night' | 'dusk' | 'dawn';
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  baseColor?: string;
  gradientColors?: string[];
  animationDuration?: number;
  interactive?: boolean;
  blur?: boolean;
  blurAmount?: number;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
  
  /** If true, respects user's motion preferences */
  respectMotionPreference?: boolean;
}

export interface GlassDynamicAtmosphereProps extends React.HTMLAttributes<HTMLDivElement> {
  layers?: number;
  depth?: number;
  parallax?: boolean;
  interactive?: boolean;
  colorPalette?: string[];
  animationSpeed?: number;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
  
  /** If true, respects user's motion preferences */
  respectMotionPreference?: boolean;
}

export interface ParticleBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  particleType?: 'dots' | 'lines' | 'shapes' | 'stars' | 'bubbles';
  count?: number;
  size?: number;
  speed?: number;
  color?: string;
  interactive?: boolean;
  mouseInfluence?: number;
  baseColor?: string;
  /** Two CSS colors used to paint the canvas field behind the particles. */
  canvasGradientColors?: readonly [string, string];
  particleColor?: string;
  particleCount?: number;
  particleSize?: number;
  particleSpeed?: number;
  connectParticles?: boolean;
  blur?: boolean;
  blurAmount?: number;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
  
  /** If true, respects user's motion preferences */
  respectMotionPreference?: boolean;
}
