import React from 'react';

// Dashboard template types
export interface GlassDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: 'grid' | 'masonry' | 'flex';
  columns?: number;
  gap?: string | number;
  widgets?: React.ReactNode[];
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

// Detail view template types
export interface GlassDetailViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  content?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
}

// Form template types
export interface GlassWizardTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  steps?: Array<{
    title: string;
    description?: string;
    content: React.ReactNode;
  }>;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
}

// List template types
export interface GlassListViewProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[];
  variant?: 'default' | 'compact' | 'detailed';
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  paginated?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
}
