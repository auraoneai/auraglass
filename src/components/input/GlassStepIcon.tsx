'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';

interface GlassStepIconProps {
  index: number;
  active: boolean;
  completed: boolean;
  icon?: React.ReactNode | string;
  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

// Get icon state classes
const getIconStateClasses = (active: boolean, completed: boolean) => {
  if (active) {
    return 'bg-primary-500 glass-text-primary border-primary-300 shadow-[0_0_12px_3px_rgba(59,130,246,0.5)]';
  }
  if (completed) {
    return 'bg-success-500 glass-text-primary border-success-300';
  }
  return 'bg-gray-200 glass-text-secondary border-gray-200 dark:bg-gray-700 dark:glass-text-secondary dark:border-gray-600';
};

export const GlassStepIcon: React.FC<GlassStepIconProps> = ({ 
    index, 
    active, 
    completed, 
    icon,
    intent = 'neutral',
    elevation = 'level2',
    tier = 'medium',
    className,
    style
}) => {
    const getIconContent = () => {
        if (icon) {
          // If icon is a React element, render it directly
          return typeof icon === 'string' ? icon : icon;
        }
        if (completed) {
          return <Check size={16} />;
        }
        return index + 1; // Display step number
    };

    const iconStateClasses = getIconStateClasses(active, completed);

    return (
        <Motion
          className="inline-block"
        >
          <OptimizedGlass
            intent={intent}
            elevation={elevation}
            tier={tier}
            className={cn(
              // Base styles
              'w-6 h-6 min-w-6 glass-radius-full',
              'flex items-center justify-center',
              'relative z-[1] flex-shrink-0',
              'glass-text-xs font-semibold',
              'transition-all duration-300 ease-in-out',
              'border',
              // State-based styles
              iconStateClasses,
              className
            )}
            style={style}
          >
            {getIconContent()}
          </OptimizedGlass>
        </Motion>
    );
};

GlassStepIcon.displayName = 'GlassStepIcon'; 