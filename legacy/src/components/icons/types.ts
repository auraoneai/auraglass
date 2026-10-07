import React from 'react';

export interface ClearIconProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
  animationType?: 'spin' | 'pulse' | 'bounce' | 'shake';
  glassEffect?: boolean;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}
