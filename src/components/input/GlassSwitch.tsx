'use client';


import { cn } from '../../lib/utilsComprehensive';
import React, { forwardRef } from 'react';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { OptimizedGlass } from '../../primitives';
import { announceToScreenReader, createFormFieldA11y, useA11yId } from '../../utils/a11y';

export interface GlassSwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Whether the switch is checked */
  checked?: boolean;
  /** Whether the switch is checked by default (uncontrolled) */
  defaultChecked?: boolean;
  /** Callback when the switch state changes */
  onChange?: (checked: boolean) => void;
  /** Alias for onChange for compatibility */
  onCheckedChange?: (checked: boolean) => void;
  /** Size of the switch */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Position of label relative to switch */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icons for on/off states */
  icons?: {
    checked?: React.ReactNode;
    unchecked?: React.ReactNode;
  };
  /** Whether to show focus ring */
  focusRing?: boolean;
  /** Custom thumb content */
  thumbContent?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Whether the switch is required */
  required?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Accessible label for the switch */
  'aria-label'?: string;
  /** ID of element that labels the switch */
  'aria-labelledby'?: string;
  /** ID of element(s) that describe the switch */
  'aria-describedby'?: string;
}

export const GlassSwitch = forwardRef<HTMLButtonElement, GlassSwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onChange,
      onCheckedChange,
      size = 'md',
      variant = 'default',
      label,
      description,
      labelPosition = 'right',
      disabled = false,
      loading = false,
      icons,
      focusRing = true,
      thumbContent,
      error,
      required = false,
      respectMotionPreference = true,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    
    // Generate unique IDs for accessibility
    const switchId = useA11yId('glass-switch');
    const finalId = id || switchId;
    const labelId = label ? useA11yId('glass-switch-label') : undefined;
    const descriptionId = description ? useA11yId('glass-switch-description') : undefined;
    const errorId = error ? useA11yId('glass-switch-error') : undefined;
    
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = checked !== undefined ? checked : internalChecked;
    
    const isInvalid = !!error;
    
    // Create accessibility attributes
    const a11yProps = createFormFieldA11y({
      id: finalId,
      label: !ariaLabelledBy && !labelId ? (ariaLabel || label) : undefined,
      description: description,
      error: error,
      required: required,
      invalid: isInvalid,
      disabled: disabled || loading,
      labelId: ariaLabelledBy || labelId,
      descriptionId: ariaDescribedBy || descriptionId,
      errorId: errorId,
    });
    
    // Announce error state changes
    React.useEffect(() => {
      if (error) {
        announceToScreenReader(`Switch error: ${error}`, 'assertive');
      }
    }, [error]);

    const handleToggle = (event: React.MouseEvent) => {
      if (disabled || loading) return;

      const newChecked = !isChecked;

      if (checked === undefined) {
        setInternalChecked(newChecked);
      }

      onChange?.(newChecked);
      onCheckedChange?.(newChecked);
      props?.onClick?.(event as any);

      // Announce state change
      announceToScreenReader(`Switch ${newChecked ? 'on' : 'off'}`, 'polite');
    };

    const sizeConfig = {
      sm: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4',
        text: 'glass-text-xs',
        gap: 'glass-gap-2',
      },
      md: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
        text: 'glass-text-sm',
        gap: 'glass-gap-3',
      },
      lg: {
        track: 'h-7 w-14',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7',
        text: 'glass-text-base',
        gap: 'glass-gap-4',
      },
    };

    const variantConfig = {
      default: {
        track: {
          checked: 'bg-primary border-primary/20',
          unchecked: 'bg-muted/50 border border-border/20',
        },
        thumb: {
          checked: 'bg-white shadow-lg',
          unchecked: 'bg-foreground/80 shadow-md',
        },
      },
      success: {
        track: {
          checked: 'bg-green-500 border-green-400/20',
          unchecked: 'bg-muted/50 border border-border/20',
        },
        thumb: {
          checked: 'bg-white shadow-lg',
          unchecked: 'bg-foreground/80 shadow-md',
        },
      },
      warning: {
        track: {
          checked: 'bg-amber-500 border-amber-400/20',
          unchecked: 'bg-muted/50 border border-border/20',
        },
        thumb: {
          checked: 'bg-white shadow-lg',
          unchecked: 'bg-foreground/80 shadow-md',
        },
      },
      error: {
        track: {
          checked: 'bg-red-500 border-red-400/20',
          unchecked: 'bg-muted/50 border border-border/20',
        },
        thumb: {
          checked: 'bg-white shadow-lg',
          unchecked: 'bg-foreground/80 shadow-md',
        },
      },
      info: {
        track: {
          checked: 'bg-blue-500 border-blue-400/20',
          unchecked: 'bg-muted/50 border border-border/20',
        },
        thumb: {
          checked: 'bg-white shadow-lg',
          unchecked: 'bg-foreground/80 shadow-md',
        },
      },
    };

    const config = sizeConfig?.[size];
    const colors = variantConfig?.[variant];

    const switchElement = (
      <OptimizedGlass
        as="button"
        ref={ref as any}
        role="switch"
        type="button"
        elevation={isChecked ? 'level2' : 'level1'}
        intensity={isChecked ? 'medium' : 'subtle'}
        depth={2}
        tint={isChecked ? 'primary' : 'neutral'}
        border="subtle"
        animation={isMotionSafe && respectMotionPreference ? "shimmer" : "none"}
        performanceMode="medium"
        liftOnHover={!disabled}
        press
        className={cn(
          'glass-switch relative inline-flex shrink-0 cursor-pointer glass-radius-full transition-all duration-200',
          config.track,
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'cursor-wait',
          focusRing && 'glass-focus',
          error && 'ring-2 ring-destructive/50',
          className
        )}
        onClick={handleToggle}
        aria-checked={!!isChecked}
        aria-invalid={isInvalid || undefined}
        aria-required={required || undefined}
        disabled={disabled || loading}
        id={finalId}
        {...a11yProps}
        {...props}
      >
        <div
          className={cn(
            'pointer-events-none relative flex items-center justify-center glass-radius-full transition-all duration-200 shadow-lg',
            config.thumb,
            isChecked ? config.translate : 'translate-x-0.5'
          )}
        />
      </OptimizedGlass>
    );

    const labelElement = label && (
      <label
        htmlFor={finalId}
        id={labelId}
        className={cn(
          'glass-switch-label cursor-pointer font-medium text-foreground',
          config.text,
          disabled && 'cursor-not-allowed opacity-70',
          required && 'after:content-["*"] after:glass-ml-1 after:text-destructive'
        )}
      >
        {label}
      </label>
    );

    const descriptionElement = description && (
      <p
        id={descriptionId}
        className={cn(
          'glass-switch-description glass-text-secondary',
          size === 'sm' ? 'glass-text-xs' : 'glass-text-sm',
          disabled && 'opacity-70'
        )}
      >
        {description}
      </p>
    );
    
    const errorElement = error && (
      <p 
        id={errorId}
        className={cn(
          'glass-switch-error text-destructive glass-mt-1',
          size === 'sm' ? 'glass-text-xs' : 'glass-text-sm'
        )}
        role="alert"
        aria-live="polite"
      >
        {error}
      </p>
    );

    // Render based on label position
    if (!label && !description && !error) {
      return switchElement;
    }

    const containerClass = cn(
      'glass-switch-container flex items-start',
      config.gap,
      labelPosition === 'left' && 'flex-row-reverse',
      labelPosition === 'right' && 'flex-row',
      labelPosition === 'top' && 'flex-col',
      labelPosition === 'bottom' && 'flex-col-reverse',
    );

    return (
      <div className={containerClass}>
        {(labelPosition === 'left' || labelPosition === 'right') && (
          <div className="flex items-center">
            {switchElement}
          </div>
        )}

        {(labelPosition === 'top' || labelPosition === 'bottom') && switchElement}

        <div className="gap-1">
          {labelElement}
          {descriptionElement}
          {errorElement}
        </div>
      </div>
    );
});

GlassSwitch.displayName = 'GlassSwitch';

export default GlassSwitch;
