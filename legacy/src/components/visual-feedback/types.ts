import React from 'react';

export interface FocusIndicatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  target?: HTMLElement | React.RefObject<HTMLElement>;
  color?: string;
  width?: number;
  thickness?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'glow';
  shape?: 'rectangle' | 'rounded' | 'circle' | 'pill';
  animated?: boolean;
  glass?: boolean;
  highContrast?: boolean;
  componentStyle?: React.CSSProperties;
  disableAnimation?: boolean;
  animationConfig?: any;
  visible?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  rippleDuration?: number;
  rippleSize?: string;
  rippleSpeed?: string;
  centerRipple?: boolean;
  disabled?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}

export interface StateIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: 'success' | 'warning' | 'error' | 'info' | 'loading' | 'default' | 'hover' | 'active' | 'focus' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glass?: boolean;
  blend?: boolean;
  intensity?: number;
  color?: string;
  animationDuration?: number;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}

export interface VisualFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  effect?: 'none' | 'highlight' | 'glow' | 'pulse' | 'bounce' | 'shake' | 'ripple';
  active?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  color?: string;
  glass?: boolean;
  intensity?: number;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}
