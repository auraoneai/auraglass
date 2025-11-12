import React from 'react';
export { GlassCard, type GlassCardProps } from './GlassCard';

// Basic card sub-components for compatibility
export const CardHeader = ({ children, className, ...props }: any) => {
  return React.createElement('div', {
    className: `card-header ${className || ''}`,
    ...props
  }, children);
};

export const CardTitle = ({ children, className, ...props }: any) => {
  return React.createElement('h2', {
    className: `card-title ${className || ''}`,
    ...props
  }, children);
};

export const CardContent = ({ children, className, ...props }: any) => {
  return React.createElement('div', {
    className: `card-content ${className || ''}`,
    ...props
  }, children);
};

export const CardFooter = ({ children, className, ...props }: any) => {
  return React.createElement('div', {
    className: `card-footer ${className || ''}`,
    ...props
  }, children);
};
