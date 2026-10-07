import React from 'react';
// Unified Type Definitions for AuraGlass Design System
// This consolidates all type definitions from merged libraries

export * from './components';
export * from './themeTypes';
export * from './animations';
export * from './accessibility';

// Base component props interface
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Common variant types
export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'
  | 'ghost'
  | 'link';

export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type GlassIntensity = 'subtle' | 'medium' | 'strong' | 'intense';

// Event handlers
export type EventHandler<T = Element, E = Event> = (event: E & { currentTarget: T }) => void;

// Common HTML element props
export interface HTMLDivProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface HTMLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export interface HTMLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export interface HTMLTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// Utility types
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Animation and transition types
export interface TransitionConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
  type?: 'spring' | 'tween' | 'keyframes';
}

// Form and validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  validation?: ValidationRule;
  required?: boolean;
}

// Data and API types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chart and data visualization types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
}

// Layout and positioning types
export interface Position {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export interface Dimensions {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

// Accessibility types
export interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-selected'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  role?: string;
}

// Focus and keyboard navigation types
export interface FocusableProps {
  tabIndex?: number;
  autoFocus?: boolean;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

// Common callback types
export type Callback<T = void> = () => T;
export type CallbackWithArg<T, A = any> = (arg: A) => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type AsyncCallbackWithArg<T, A = any> = (arg: A) => Promise<T>;
