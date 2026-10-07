import React from 'react';
// Button component types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'link' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glassIntensity?: 'subtle' | 'medium' | 'strong' | 'intense';
}

export interface FabProps extends ButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  animated?: boolean;
  magnetic?: boolean;
}

export interface MagneticButtonProps extends ButtonProps {
  magneticStrength?: number;
  magneticRadius?: number;
}
