'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Motion, OptimizedGlass } from '../../primitives';
import { GlassStepInternalProps, Step } from './types';
// Import the new sub-components
import { GlassStepIcon } from './GlassStepIcon';
import { GlassStepLabel } from './GlassStepLabel';

// Props for the internal GlassStep
interface GlassStepProps {
  step: Step;
  index: number;
  active: boolean;
  completed: boolean;
  orientation: 'horizontal' | 'vertical';
  isLast?: boolean;
  onClick?: () => void;
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

// Get step state classes
const getStepStateClasses = (active: boolean, completed: boolean, disabled: boolean, clickable: boolean) => {
  const baseClasses = [
    'flex items-center relative flex-1 glass-p-2 transition-all duration-300 ease-in-out',
    clickable && !disabled ? 'cursor-pointer hover:bg-glass-light-primary/5 hover:scale-[1.01]' : 'cursor-default'
  ];
  
  if (disabled) {
    baseClasses.push('opacity-50 pointer-events-none');
  }
  
  return baseClasses.filter(Boolean).join(' ');
};

// Get orientation classes
const getOrientationClasses = (orientation: 'horizontal' | 'vertical') => {
  return orientation === 'vertical' ? 'flex-col text-center' : 'flex-row text-left';
};

// Use the specific internal props type
export const GlassStep = forwardRef<HTMLDivElement, GlassStepInternalProps>((
  {
    step,
    index,
    active,
    completed,
    orientation,
    onClick,
    intent = 'neutral',
    elevation = 'level1',
    tier = 'medium',
    className,
    style
  },
  ref // Receive the forwarded ref
) => {
  const isClickable = !!onClick;
  const isDisabled = step.disabled || false;
  const finalOrientation = orientation || 'horizontal';

  const handleClick = () => {
    if (onClick && !isDisabled) {
      onClick(step);
    }
  };

  const stepStateClasses = getStepStateClasses(active, completed, isDisabled, isClickable);
  const orientationClasses = getOrientationClasses(finalOrientation);

  return (
    <Motion data-glass-component>
      <OptimizedGlass
        ref={ref}
        intent={intent}
        elevation={elevation}
        tier={tier}
        className={cn(
          stepStateClasses,
          orientationClasses,
          className
        )}
        style={style}
        onClick={handleClick}
        role={isClickable ? 'button' : 'listitem'}
        aria-label={`Step ${index + 1}: ${step.label || step.title}${active ? ' (current)' : ''}${completed ? ' (completed)' : ''}${isDisabled ? ' (disabled)' : ''}`}
        aria-current={active ? 'step' : undefined}
        aria-disabled={isDisabled}
        tabIndex={isClickable && !isDisabled ? 0 : -1}
        onKeyDown={isClickable && !isDisabled ? (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
      >
        {/* Use GlassStepIcon component */}
        <GlassStepIcon 
            index={index} 
            active={active} 
            completed={completed} 
            icon={step.icon}
            intent={intent}
            elevation={elevation}
            tier={tier}
        />
        {/* Use GlassStepLabel component */}
        <GlassStepLabel
            label={step.label || step.title}
            active={active}
            completed={completed}
            orientation={finalOrientation}
            intent={intent}
            elevation={elevation}
            tier={tier}
        />
      </OptimizedGlass>
    </Motion>
  );
});

GlassStep.displayName = 'GlassStep';
