import React from 'react';

export interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'onChange'> {
  selected?: boolean;
  value?: string | number;
  size?: 'sm' | 'md' | 'lg' | 'medium';
  variant?: 'default' | 'primary' | 'secondary' | 'outlined';
  glass?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  fullWidth?: boolean;
  grouped?: boolean;
  groupOrientation?: 'horizontal' | 'vertical';
  isGroupStart?: boolean;
  isGroupEnd?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  animationConfig?: any;
  disableAnimation?: boolean;
  motionSensitivity?: 'low' | 'medium' | 'high';
  onChange?: (event: React.MouseEvent<HTMLButtonElement>, value: string | number) => void;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface ToggleButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string | number | (string | number)[];
  defaultValue?: string | number | (string | number)[];
  onChange?: (event: React.MouseEvent<HTMLButtonElement>, value: string | number | (string | number)[]) => void;
  exclusive?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg' | 'medium';
  variant?: 'default' | 'primary' | 'secondary' | 'outlined';
  glass?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  fullWidth?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  children?: React.ReactNode;
}