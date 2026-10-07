import React from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface GlassAccordionUIProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    expanded?: boolean;
  }>;
  allowMultiple?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}

export interface GlassCheckboxUIProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
}
