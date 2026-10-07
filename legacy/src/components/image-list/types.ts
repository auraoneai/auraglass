import React from 'react';
// Type definitions for ImageList components

export interface ImageListItemProps {
  children?: React.ReactNode;
  cols?: number;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
  glass?: boolean;
  hoverOverlay?: boolean;
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  rounded?: boolean;
  alt?: string;
  src?: string;
  srcSet?: string;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';

  /** Accessibility props */
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLLIElement>) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

export interface ImageListItemBarProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
  position?: 'top' | 'bottom' | 'below';
  glass?: boolean;
  actionIcon?: React.ReactNode;
  actionPosition?: 'left' | 'right';
  showOnHover?: boolean;
}

export interface ImageListProps {
  children?: React.ReactNode;
  variant?: 'standard' | 'quilted' | 'masonry' | 'woven';
  cols?: number;
  rowHeight?: number | 'auto';
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
  glass?: boolean;
  glassRadiusMd?: boolean;
  rounded?: boolean;
  variableSize?: boolean;
  enableEntranceAnimation?: boolean;
  animationConfig?: any;
  disableAnimation?: boolean;
  motionSensitivity?: any;
}
