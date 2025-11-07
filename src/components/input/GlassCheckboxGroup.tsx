'use client';

import React, { forwardRef, useState, useCallback, createContext, useContext } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { createFormFieldA11y, useA11yId, announceToScreenReader } from '../../utils/a11y';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { useGlassSound } from '../../utils/soundDesign';

export interface GlassCheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface GlassCheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Currently selected values */
  value?: string[];
  /** Default selected values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when selection changes */
  onChange?: (value: string[]) => void;
  /** Checkbox options */
  options: GlassCheckboxOption[];
  /** Whether the checkbox group is disabled */
  disabled?: boolean;
  /** Size of the checkboxes */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Orientation of the checkbox group */
  orientation?: 'horizontal' | 'vertical';
  /** Label for the checkbox group */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether the checkbox group is required */
  required?: boolean;
  /** Minimum number of selections required */
  minSelections?: number;
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Custom checkbox item component */
  renderItem?: (option: GlassCheckboxOption, index: number, isSelected: boolean) => React.ReactNode;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Accessible label for the checkbox group */
  'aria-label'?: string;
  /** ID of element that labels the checkbox group */
  'aria-labelledby'?: string;
  /** ID of element(s) that describe the checkbox group */
  'aria-describedby'?: string;
}

export interface GlassCheckboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Value of this checkbox item */
  value: string;
  /** Whether this item is checked */
  checked?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Whether this item is indeterminate */
  indeterminate?: boolean;
  /** Child content */
  children?: React.ReactNode;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
}

// Context for checkbox group communication
interface CheckboxGroupContext {
  selectedValues: string[];
  onChange?: (value: string, checked: boolean) => void;
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  name: string;
  respectMotionPreference: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContext | null>(null);

const useCheckboxGroup = () => {
  const context = useContext(CheckboxGroupContext);
  if (!context) {
    throw new Error('CheckboxItem must be used within CheckboxGroup');
  }
  return context;
};

export const GlassCheckboxItem = forwardRef<HTMLDivElement, GlassCheckboxItemProps>(
  ({ value, checked, disabled: itemDisabled, indeterminate = false, children, className, onChange, onClick, onKeyDown, ...props }, ref) => {
    const context = useCheckboxGroup();
    const { shouldAnimate } = useMotionPreference();
    const { play } = useGlassSound();
    
    // Use context if available, otherwise standalone
    const isSelected = context ? context.selectedValues.includes(value) : checked || false;
    const isDisabled = context ? (context.disabled || itemDisabled) : itemDisabled;
    const size = context?.size || 'md';
    const variant = context?.variant || 'default';
    const respectMotionPreference = context?.respectMotionPreference ?? true;
    
    const itemId = useA11yId('glass-checkbox-item');
    
    const sizeConfig = {
      sm: {
        checkbox: 'w-4 h-4',
        check: 'w-2 h-2',
        text: 'glass-text-xs',
        gap: 'glass-gap-2',
      },
      md: {
        checkbox: 'w-5 h-5',
        check: 'w-2.5 h-2.5',
        text: 'glass-text-sm',
        gap: 'glass-gap-3',
      },
      lg: {
        checkbox: 'w-6 h-6',
        check: 'w-3 h-3',
        text: 'glass-text-base',
        gap: 'glass-gap-4',
      },
    };

    const variantConfig = {
      default: {
        checkbox: isSelected || indeterminate
          ? 'bg-primary/20 border-primary/40' 
          : 'bg-background/50 border-border/20',
        check: 'bg-primary',
        focus: 'focus:ring-primary/50',
      },
      success: {
        checkbox: isSelected || indeterminate
          ? 'glass-surface-success/20 glass-border-success/40' 
          : 'bg-background/50 border-border/20',
        check: 'glass-surface-success',
        focus: 'focus:ring-success/50',
      },
      warning: {
        checkbox: isSelected || indeterminate
          ? 'glass-surface-warning/20 glass-border-warning/40' 
          : 'bg-background/50 border-border/20',
        check: 'glass-surface-warning',
        focus: 'focus:ring-warning/50',
      },
      error: {
        checkbox: isSelected || indeterminate
          ? 'glass-surface-danger/20 glass-border-danger/40' 
          : 'bg-background/50 border-border/20',
        check: 'glass-surface-danger',
        focus: 'focus:ring-danger/50',
      },
      info: {
        checkbox: isSelected || indeterminate
          ? 'bg-blue-500/20 border-blue-400/40' 
          : 'bg-background/50 border-border/20',
        check: 'bg-blue-500',
        focus: 'focus:ring-blue-500/50',
      },
    };

    const config = sizeConfig[size];
    const colors = variantConfig[variant];

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      
      const newChecked = !isSelected;
      
      if (context) {
        context.onChange?.(value, newChecked);
      } else {
        onChange?.(newChecked);
      }
      
      onClick?.(e);
      play(newChecked ? 'check' : 'uncheck');
      
      // Announce selection for screen readers
      const childText = typeof children === 'string' ? children : value;
      announceToScreenReader(
        `${childText} ${newChecked ? 'checked' : 'unchecked'}`, 
        'polite'
      );
    }, [isDisabled, isSelected, context, value, onChange, onClick, play, children]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick(e as any);
      }
      onKeyDown?.(e);
    }, [handleClick, onKeyDown]);

    return (
      <OptimizedGlass data-glass-component
        ref={ref}
        elevation="level1"
        intensity="subtle"
        depth={0.5}
        tint="neutral"
        border="subtle"
        animation={shouldAnimate && respectMotionPreference ? "float" : "none"}
        performanceMode="high"
        liftOnHover={!isDisabled}
        className={cn(
          'glass-checkbox-item flex items-center cursor-pointer',
          'glass-p-3 glass-radius-lg border backdrop-blur-md transition-all duration-200',
          'focus:outline-none glass-focus',
          config.gap,
          isDisabled && 'opacity-50 cursor-not-allowed',
          (isSelected || indeterminate) && 'ring-2 ring-current/20',
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isDisabled ? -1 : 0}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : isSelected}
        aria-disabled={isDisabled}
        id={itemId}
        {...props}
      >
        {/* Checkbox square */}
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
        >
          <OptimizedGlass
            elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            'glass-checkbox-square relative glass-radius-md border backdrop-blur-md',
            'flex items-center justify-center transition-all duration-200',
            config.checkbox,
            colors.checkbox,
            colors.focus
          )}
        >
          {/* Checkbox indicator */}
          {(isSelected || indeterminate) && (
            <Motion
              preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
              className={cn(
                'glass-checkbox-indicator flex items-center justify-center glass-text-primary',
                config.check
              )}
            >
              {indeterminate ? (
                // Indeterminate indicator (horizontal line)
                <div className="w-2 h-0-5 bg-transparent glass-radius-full" />
              ) : (
                // Check mark
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </Motion>
          )}
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 glass-radius-md glass-gradient-primary glass-gradient-primary via-transparent glass-gradient-primary" />
        </OptimizedGlass>
        </Motion>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
        
        {/* Hidden input for form submission */}
        <input
          type="checkbox"
          name={context?.name}
          value={value}
          checked={isSelected}
          onChange={() => {}} // Handled by onClick
          disabled={isDisabled}
          className="sr-only"
          tabIndex={-1}
        />
      </OptimizedGlass>
    );
  }
);

GlassCheckboxItem.displayName = 'GlassCheckboxItem';

export const GlassCheckboxGroup = forwardRef<HTMLDivElement, GlassCheckboxGroupProps>(
  (
    {
      value,
      defaultValue = [],
      onChange,
      options,
      disabled = false,
      size = 'md',
      variant = 'default',
      orientation = 'vertical',
      label,
      description,
      error,
      required = false,
      minSelections,
      maxSelections,
      renderItem,
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
    const { shouldAnimate } = useMotionPreference();

    // Generate unique IDs for accessibility
    const checkboxGroupId = useA11yId('glass-checkbox-group');
    const finalId = id || checkboxGroupId;
    const labelId = label ? useA11yId('glass-checkbox-group-label') : undefined;
    const descriptionId = description ? useA11yId('glass-checkbox-group-description') : undefined;
    const errorId = error ? useA11yId('glass-checkbox-group-error') : undefined;
    const name = useA11yId('glass-checkbox-group-name');
    
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);
    const currentValue = value !== undefined ? value : internalValue;
    
    const isInvalid = !!error || 
      (minSelections !== undefined && currentValue.length < minSelections) ||
      (maxSelections !== undefined && currentValue.length > maxSelections);
    
    // Create accessibility attributes
    const a11yProps = createFormFieldA11y({
      id: finalId,
      label: !ariaLabelledBy && !labelId ? (ariaLabel || label) : undefined,
      description: description,
      error: error,
      required: required,
      invalid: isInvalid,
      disabled: disabled,
      labelId: ariaLabelledBy || labelId,
      descriptionId: ariaDescribedBy || descriptionId,
      errorId: errorId,
    });
    
    // Announce error state changes
    React.useEffect(() => {
      if (error) {
        announceToScreenReader(`Checkbox group error: ${error}`, 'assertive');
      }
    }, [error]);

    const handleChange = useCallback((itemValue: string, checked: boolean) => {
      let newValue: string[];
      
      if (checked) {
        if (maxSelections && currentValue.length >= maxSelections) {
          // Don't allow more selections than maximum
          return;
        }
        newValue = [...currentValue, itemValue];
      } else {
        if (minSelections && currentValue.length <= minSelections) {
          // Don't allow fewer selections than minimum
          return;
        }
        newValue = currentValue.filter((v: any) => v !== itemValue);
      }
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }, [value, currentValue, onChange, minSelections, maxSelections]);

    const contextValue: CheckboxGroupContext = {
      selectedValues: currentValue,
      onChange: handleChange,
      disabled,
      size,
      variant,
      name,
      respectMotionPreference,
    };

    const sizeConfig = {
      sm: {
        label: 'glass-text-xs',
        gap: 'glass-gap-2',
      },
      md: {
        label: 'glass-text-sm',
        gap: 'glass-gap-3',
      },
      lg: {
        label: 'glass-text-base',
        gap: 'glass-gap-4',
      },
    };

    const config = sizeConfig[size];

    // Get validation error message
    const getValidationError = () => {
      if (minSelections && currentValue.length < minSelections) {
        return `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`;
      }
      if (maxSelections && currentValue.length > maxSelections) {
        return `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}`;
      }
      return error;
    };

    const validationError = getValidationError();

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div className={cn('glass-checkbox-group-container', className)}>
          {/* Label */}
          {label && (
            <label
              id={labelId}
              className={cn(
                'glass-checkbox-group-label block font-medium text-foreground mb-3',
                config.label,
                required && 'after:content-["*"] after:glass-ml-1 after:text-destructive'
              )}
            >
              {label}
            </label>
          )}
          
          {/* Checkbox Group */}
          <div
            ref={ref}
            id={finalId}
            role="group"
            className={cn(
              'glass-checkbox-group flex',
              orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
              config.gap,
              disabled && 'opacity-50',
              validationError && 'ring-2 ring-destructive/50 glass-radius-lg glass-p-2',
            )}
            {...a11yProps}
            aria-invalid={isInvalid || undefined}
            aria-required={required || undefined}
            {...props}
          >
            {options.map((option, index) => {
              if (renderItem) {
                return (
                  <div key={option.value}>
                    {renderItem(option, index, currentValue.includes(option.value))}
                  </div>
                );
              }

              return (
                <GlassCheckboxItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <div className="flex items-start gap-3">
                    {option.icon && (
                      <div className="flex-shrink-0 glass-mt-0-5">
                        {option.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-medium text-foreground',
                        config.label
                      )}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className={cn(
                          'glass-text-secondary glass-mt-1',
                          size === 'sm' ? 'glass-text-xs' : 'glass-text-sm'
                        )}>
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCheckboxItem>
              );
            })}
          </div>
          
          {/* Selection count indicator */}
          {(minSelections || maxSelections) && (
            <div className={cn(
              'glass-mt-2 glass-text-secondary',
              size === 'sm' ? 'glass-text-xs' : 'glass-text-sm'
            )}>
              Selected: {currentValue.length}
              {maxSelections && ` / ${maxSelections}`}
              {minSelections && !maxSelections && ` (min: ${minSelections})`}
            </div>
          )}
          
          {/* Description */}
          {description && (
            <p 
              id={descriptionId}
              className={cn(
                'glass-checkbox-group-description glass-text-secondary glass-mt-2',
                size === 'sm' ? 'glass-text-xs' : 'glass-text-sm'
              )}
            >
              {description}
            </p>
          )}
          
          {/* Error message */}
          {validationError && (
            <p 
              id={errorId}
              className={cn(
                'glass-checkbox-group-error text-destructive glass-mt-2',
                size === 'sm' ? 'glass-text-xs' : 'glass-text-sm'
              )}
              role="alert"
              aria-live="polite"
            >
              {validationError}
            </p>
          )}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

GlassCheckboxGroup.displayName = 'GlassCheckboxGroup';

export default GlassCheckboxGroup;