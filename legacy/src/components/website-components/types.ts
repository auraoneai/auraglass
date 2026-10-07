import React from 'react';

export interface GlassWipeSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  slides?: Array<{
    id: string;
    content: React.ReactNode;
    background?: string;
  
  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}>;
  currentSlide?: number;
  onSlideChange?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}

export interface MotionAwareGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  sensitivity?: number;
  maxTilt?: number;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}
