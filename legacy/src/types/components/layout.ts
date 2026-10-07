import React from 'react';
// Layout component types
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid';
  glassIntensity?: 'subtle' | 'medium' | 'strong' | 'intense';
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centerContent?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  rows?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  autoFlow?: 'row' | 'column' | 'row-dense' | 'column-dense';
}
