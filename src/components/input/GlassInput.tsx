'use client';

// Removed circular imports - components import directly from source

import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef, useState } from 'react';
import { OptimizedGlass } from '../../primitives';
import { LiquidGlassMaterial } from '../../primitives/LiquidGlassMaterial';
import { announceToScreenReader, createFormFieldA11y, useA11yId } from '../../utils/a11y';
import { GlassButton } from '../button/GlassButton';

export interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * GlassInput variant
   */
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  /**
   * GlassInput size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * GlassInput state
   */
  state?: 'default' | 'error' | 'warning' | 'success';
  /**
   * Whether input is full width
   */
  fullWidth?: boolean;
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error text
   */
  errorText?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Clear button
   */
  clearable?: boolean;
  /**
   * Custom clear function
   */
  onClear?: () => void;

  // Accessibility props
  /**
   * Accessible label for the input
   */
  label?: string;
  /**
   * ID of element that labels the input
   */
  'aria-labelledby'?: string;
  /**
   * ID of element(s) that describe the input
   */
  'aria-describedby'?: string;
  /**
   * Whether the input is required
   */
  'aria-required'?: boolean;
  /**
   * Whether the input value is invalid
   */
  'aria-invalid'?: boolean;
  /**
   * ID of error message element
   */
  'aria-errormessage'?: string;
  /**
   * Glass material variant
   */
  material?: 'glass' | 'liquid';
  /**
   * Material properties for liquid glass
   */
  materialProps?: {
    ior?: number;
    thickness?: number;
    tint?: { r: number; g: number; b: number; a: number };
    variant?: 'regular' | 'clear';
    quality?: 'ultra' | 'high' | 'balanced' | 'efficient';
  };
}

/**
 * GlassInput component
 * A glassmorphism input field with various states and configurations
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      fullWidth = false,
      leftIcon,
      rightIcon,
      helperText,
      errorText,
      loading = false,
      clearable = false,
      material = 'glass',
      materialProps,
      onClear,
      className,
      disabled,
      label,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-required': ariaRequired,
      'aria-invalid': ariaInvalid,
      'aria-errormessage': ariaErrorMessage,
      required,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Generate unique IDs for accessibility
    const inputId = useA11yId('glass-input');
    const helperTextId = (helperText || errorText) ? useA11yId('glass-input-helper') : undefined;
    const errorId = errorText ? useA11yId('glass-input-error') : undefined;
    const labelId = label ? useA11yId('glass-input-label') : undefined;

    const currentState = errorText ? 'error' : state;
    const displayHelperText = errorText || helperText;
    const isInvalid = currentState === 'error' || ariaInvalid === true;
    const isRequired = required || ariaRequired === true;

    // Create accessibility attributes
    const a11yProps = createFormFieldA11y({
      id: inputId,
      label: !ariaLabelledBy && !labelId ? label : undefined,
      description: displayHelperText,
      error: errorText,
      required: isRequired,
      invalid: isInvalid,
      disabled: disabled || loading,
      labelId: ariaLabelledBy || labelId,
      descriptionId: helperTextId,
      errorId: errorId || ariaErrorMessage,
    });

    // Announce error state changes
    React.useEffect(() => {
      if (errorText) {
        announceToScreenReader(`Input error: ${errorText}`, 'assertive');
      }
    }, [errorText]);

    const sizeClasses = {
      sm: 'h-8 glass-px-3 glass-text-sm',
      md: 'h-10 glass-px-4 glass-text-sm',
      lg: 'h-12 px-5 glass-text-base',
    };

    const variantClasses = {
      default: 'bg-background/50 border border-border/30',
      filled: 'bg-muted/50 border border-transparent',
      outlined: 'bg-transparent border-2 border-border',
      minimal: 'bg-transparent border-0 border-b border-border',
    };

    const stateClasses = {
      default: 'border-border/30 focus:border-primary/50',
      error: 'border-destructive/50 focus:border-destructive',
      warning: 'border-warning/50 focus:border-warning',
      success: 'border-success/50 focus:border-success',
    };

    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (props?.onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        props?.onChange(event);
      }
    };

    return (
      <div data-glass-component className={cn('relative', { 'w-full': fullWidth })}>
        {/* Label */}
        {label && (
          <label 
            id={labelId}
            htmlFor={inputId}
            className={cn(
              'block glass-text-sm font-medium text-foreground glass-mb-2',
              isRequired && 'after:content-["*"] after:glass-ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        {material === 'liquid' ? (
          <LiquidGlassMaterial
            ior={materialProps?.ior || (isFocused ? 1.46 : 1.43)}
            thickness={materialProps?.thickness || (size === 'sm' ? 5 : size === 'md' ? 7 : 9)}
            tint={materialProps?.tint || (currentState === 'error' ? { r: 220, g: 38, b: 38, a: 0.08 } : 
              currentState === 'warning' ? { r: 217, g: 119, b: 6, a: 0.08 } :
              currentState === 'success' ? { r: 34, g: 197, b: 94, a: 0.08 } :
              { r: 0, g: 0, b: 0, a: 0.04 })}
            variant={materialProps?.variant || 'clear'}
            quality={materialProps?.quality || 'high'}
            environmentAdaptation
            motionResponsive={false}
            interactive
            className={cn(
              'relative flex items-center transition-all duration-200 liquid-glass-input-surface',
              sizeClasses?.[size],
              variantClasses?.[variant],
              stateClasses?.[currentState],
              {
                'opacity-50': disabled,
                'ring-2 ring-primary/20': isFocused && currentState === 'default',
                'ring-2 ring-destructive/20': isFocused && currentState === 'error',
                'ring-2 ring-warning/20': isFocused && currentState === 'warning',
                'ring-2 ring-success/20': isFocused && currentState === 'success',
              },
              className
            )}
            style={{
              '--liquid-glass-input-density': isFocused ? '0.95' : '0.92',
              '--liquid-glass-focus-refraction': '1.15',
            } as React.CSSProperties}
            data-liquid-glass-input="true"
            data-input-state={currentState}
            data-input-focused={isFocused}
            aria-busy={loading || undefined}
          >
          {leftIcon && (
            <div className={cn('flex items-center justify-center mr-3 glass-text-secondary', iconSize?.[size])}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            {...a11yProps}
            className={cn(
              'flex-1 bg-transparent border-0 outline-none glass-pulse-ring',
              'placeholder:glass-text-secondary',
              'text-foreground',
              'disabled:cursor-not-allowed',
              {
                'pr-8': clearable || rightIcon || loading,
              }
            )}
            disabled={disabled || loading}
            onFocus={(e) => {
              setIsFocused(true);
              props?.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props?.onBlur?.(e);
            }}
            {...((() => {
              const {
                variant,
                size,
                state,
                fullWidth,
                leftIcon,
                rightIcon,
                clearable,
                loading: _,
                loadingText: __,
                material: ___,
                materialProps: ____,
                label: _____,
                helperText: ______,
                errorText: _______,
                successText: ________,
                warningText: _________,
                description: __________,
                ...validProps
              } = props as any;
              return validProps;
            })())}
          />

          {loading && (
            <GlassButton
              variant="ghost"
              size="sm"
              iconOnly
              disabled
              aria-label="Loading"
              className={cn(
                'flex items-center justify-center glass-text-secondary',
                iconSize?.[size]
              )}
            >
              <div className="animate-spin">⟳</div>
            </GlassButton>
          )}

          {clearable && props.value && !loading && (
            <GlassButton
              variant="ghost"
              size="sm"
              iconOnly
              onClick={() => {
                if (ref && 'current' in ref && ref.current) {
                  ref.current.value = '';
                  ref.current.focus();
                  props?.onChange?.({ target: ref.current } as any);
                }
              }}
              aria-label={`Clear ${label || 'input'}`}
              className={cn(
                'flex items-center justify-center glass-text-secondary hover:text-foreground transition-colors',
                iconSize?.[size]
              )}
            >
              ×
            </GlassButton>
          )}

          {rightIcon && !loading && (
            <div className={cn('flex items-center justify-center glass-text-secondary', iconSize?.[size])}>
              {rightIcon}
            </div>
          )}
          </LiquidGlassMaterial>
        ) : (
          <OptimizedGlass
            elevation={isFocused ? 'level2' : 'level1'}
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            liftOnHover
            press
            className={cn(
              'relative flex items-center transition-all duration-200 rounded-2xl',
              sizeClasses?.[size],
              variantClasses?.[variant],
              stateClasses?.[currentState],
              {
                'opacity-50': disabled,
                'ring-2 ring-primary/20': isFocused && currentState === 'default',
                'ring-2 ring-destructive/20': isFocused && currentState === 'error',
                'ring-2 ring-warning/20': isFocused && currentState === 'warning',
                'ring-2 ring-success/20': isFocused && currentState === 'success',
              },
              className
            )}
            aria-busy={loading || undefined}
          >
          {leftIcon && (
            <div className={cn('flex items-center justify-center mr-3 glass-text-secondary', iconSize?.[size])}>
              {leftIcon}
            </div>
          )}

          <input 
            ref={ref}
            {...a11yProps}
            className={cn(
              'flex-1 bg-transparent border-0 outline-none glass-pulse-ring',
              'placeholder:glass-text-secondary',
              'text-foreground',
              'disabled:cursor-not-allowed',
              {
                'pr-8': clearable || rightIcon || loading,
              }
            )}
            disabled={disabled || loading}
            onFocus={(e) => {
              setIsFocused(true);
              props?.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props?.onBlur?.(e);
            }}
            {...((() => {
              const {
                variant,
                size,
                state,
                fullWidth,
                leftIcon,
                rightIcon,
                helperText,
                errorText,
                loading,
                clearable,
                onClear,
                className,
                label,
                ...validProps
              } = props as any;
              return validProps;
            })())}
          />

          <div className="flex items-center gap-1">
            {loading && (
              <div className={cn('animate-spin glass-radius-full border-2 border-current border-t-transparent', iconSize?.[size])} />
            )}

            {clearable && props?.value && !loading && (
              <GlassButton
                type="button"
                onClick={handleClear}
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={`Clear ${label || 'input'}`}
                className={cn(
                  'flex items-center justify-center glass-text-secondary hover:text-foreground transition-colors',
                  iconSize?.[size]
                )}
              >
                ×
              </GlassButton>
            )}

            {rightIcon && !loading && (
              <div className={cn('flex items-center justify-center glass-text-secondary', iconSize?.[size])}>
                {rightIcon}
              </div>
            )}
          </div>
          </OptimizedGlass>
        )}

        {displayHelperText && (
          <p 
            id={errorText ? errorId : helperTextId}
            className={cn(
              'glass-mt-1 glass-text-xs',
              currentState === 'error' ? 'text-destructive' :
                currentState === 'warning' ? 'text-warning' :
                  currentState === 'success' ? 'text-success' :
                    'glass-text-secondary'
            )}
            role={errorText ? 'alert' : undefined}
            aria-live={errorText ? 'polite' : undefined}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

// Backward-compat alias exports for legacy imports
export { GlassTextarea as GlassTextArea } from './GlassTextarea';
export type { GlassTextareaProps as GlassTextAreaProps } from './GlassTextarea';

