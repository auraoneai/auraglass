'use client';

import { GlassInput } from './GlassInput';

import { cn } from '../../lib/utilsComprehensive';
import React, { createContext, useContext, useState, forwardRef } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { createFormFieldA11y, useA11yId, announceToScreenReader } from '../../utils/a11y';
import { useMotionPreference } from '../../hooks/useMotionPreference';

export interface RadioOption {
    value: string | number;
    label: string;
    description?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export interface GlassRadioGroupProps {
    /**
     * Radio options
     */
    options: RadioOption[];
    /**
     * Selected value
     */
    value?: string | number;
    /**
     * Default selected value
     */
    defaultValue?: string | number;
    /**
     * Callback when value changes
     */
    onValueChange?: (value: string | number) => void;
    /**
     * Group name (for form compatibility)
     */
    name?: string;
    /**
     * Whether radio group is disabled
     */
    disabled?: boolean;
    /**
     * Radio group orientation
     */
    orientation?: 'vertical' | 'horizontal';
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Custom className
     */
    className?: string;
    /**
     * Whether to show as card-style radios
     */
    variant?: 'default' | 'card';
    /**
     * Custom render function for options
     */
    renderOption?: (option: RadioOption, isSelected: boolean) => React.ReactNode;
    /**
     * Label for the radio group
     */
    label?: string;
    /**
     * Description text for the radio group
     */
    description?: string;
    /**
     * Error message
     */
    error?: string;
    /**
     * Whether the radio group is required
     */
    required?: boolean;
    /**
     * Respect user's motion preferences
     */
    respectMotionPreference?: boolean;
    /**
     * ID of element that labels the radio group
     */
    'aria-labelledby'?: string;
    /**
     * ID of element(s) that describe the radio group
     */
    'aria-describedby'?: string;
    /**
     * Additional aria attributes
     */
    'aria-label'?: string;
}

export interface GlassRadioGroupItemProps {
    /**
     * Radio option
     */
    option: RadioOption;
    /**
     * Whether this item is selected
     */
    isSelected: boolean;
    /**
     * Whether this item is disabled
     */
    isDisabled: boolean;
    /**
     * Callback when item is selected
     */
    onSelect: (value: string | number) => void;
    /**
     * Item size
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Item variant
     */
    variant?: 'default' | 'card';
    /**
     * Group name
     */
    name?: string;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Respect motion preferences
     */
    respectMotionPreference?: boolean;
}

// Context for radio group state
const RadioGroupContext = createContext<{
    value?: string | number;
    onValueChange?: (value: string | number) => void;
    name?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'card';
    respectMotionPreference?: boolean;
} | null>(null);

const useRadioGroupContext = () => {
    const context = useContext(RadioGroupContext);
    if (!context) {
        throw new Error('RadioGroupItem must be used within a RadioGroup');
    }
    return context;
};

/**
 * GlassRadioGroup component
 * A glassmorphism radio button group
 */
export const GlassRadioGroup = forwardRef<HTMLDivElement, GlassRadioGroupProps>((
    {
        options,
        value: controlledValue,
        defaultValue,
        onValueChange,
        name,
        disabled = false,
        orientation = 'vertical',
        size = 'md',
        variant = 'default',
        className,
        renderOption,
        label,
        description,
        error,
        required = false,
        respectMotionPreference = true,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
    },
    ref
) => {
    const { shouldAnimate } = useMotionPreference();
    
    // Generate unique IDs for accessibility
    const groupId = useA11yId('glass-radio-group');
    const labelId = label ? useA11yId('glass-radio-group-label') : undefined;
    const descriptionId = description ? useA11yId('glass-radio-group-description') : undefined;
    const errorId = error ? useA11yId('glass-radio-group-error') : undefined;
    
    const [internalValue, setInternalValue] = useState<string | number>(defaultValue || '');
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    
    const isInvalid = !!error;
    
    // Create accessibility attributes
    const a11yProps = {
        role: 'radiogroup',
        'aria-labelledby': ariaLabelledBy || labelId || undefined,
        'aria-label': !ariaLabelledBy && !labelId ? (ariaLabel || label) : undefined,
        'aria-describedby': ariaDescribedBy || descriptionId || (description && `${groupId}-description`) || undefined,
        'aria-invalid': isInvalid || undefined,
        'aria-required': required || undefined,
        'aria-disabled': disabled || undefined,
    };
    
    // Announce error state changes
    React.useEffect(() => {
        if (error) {
            announceToScreenReader(`Radio group error: ${error}`, 'assertive');
        }
    }, [error]);

    const handleValueChange = (newValue: string | number) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        
        // Announce selection change
        const selectedOption = options.find(opt => opt.value === newValue);
        if (selectedOption) {
            announceToScreenReader(`Selected ${selectedOption.label}`, 'polite');
        }
    };

    const contextValue = {
        value,
        onValueChange: handleValueChange,
        name,
        disabled,
        size,
        variant,
        respectMotionPreference,
    };

    return (
        <div data-glass-component className={cn('relative', className)}>
            {/* Label */}
            {label && (
                <label 
                    id={labelId}
                    className={cn(
                        'block glass-text-sm font-medium text-foreground mb-3',
                        required && 'after:content-["*"] after:glass-ml-1 after:text-destructive'
                    )}
                >
                    {label}
                </label>
            )}
            
            {/* Description */}
            {description && (
                <p 
                    id={descriptionId}
                    className="text-sm glass-text-secondary mb-3"
                >
                    {description}
                </p>
            )}
            
            <RadioGroupContext.Provider value={contextValue}>
                <div
                    ref={ref}
                    {...a11yProps}
                    className={cn(
                        'flex glass-gap-3',
                        {
                            'flex-col': orientation === 'vertical',
                            'flex-row flex-wrap': orientation === 'horizontal',
                        },
                        error && 'ring-2 ring-destructive/50 glass-radius-lg glass-p-2'
                    )}
                    role="radiogroup"
                    aria-invalid={isInvalid || undefined}
                    aria-required={required || undefined}
                >
                    {options.map((option) => (
                        <GlassRadioGroupItem
                            key={option.value}
                            option={option}
                            isSelected={value === option.value}
                            isDisabled={disabled || option.disabled || false}
                            onSelect={handleValueChange}
                            size={size}
                            variant={variant}
                            name={name}
                            renderOption={renderOption}
                            respectMotionPreference={respectMotionPreference}
                        />
                    ))}
                </div>
            </RadioGroupContext.Provider>
            
            {/* Error message */}
            {error && (
                <p 
                    id={errorId}
                    className="glass-mt-2 text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </p>
            )}
        </div>
    );
});

GlassRadioGroup.displayName = 'GlassRadioGroup';

/**
 * GlassRadioGroupItem component
 * Individual radio button item
 */
type GlassRadioGroupItemPropsWithRender = GlassRadioGroupItemProps & {
    renderOption?: GlassRadioGroupProps['renderOption'];
};

export const GlassRadioGroupItem = forwardRef<HTMLDivElement, GlassRadioGroupItemPropsWithRender>(({
    option,
    isSelected,
    isDisabled,
    onSelect,
    size = 'md',
    variant = 'default',
    name,
    className,
    renderOption,
    respectMotionPreference = true,
}, ref) => {
    const { shouldAnimate } = useMotionPreference();
    const itemId = useA11yId('glass-radio-item');
        const sizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
        };

        const textSizeClasses = {
            sm: 'glass-text-sm',
            md: 'glass-text-base',
            lg: 'glass-text-lg',
        };

        // Create accessibility attributes for the radio item
        const itemA11yProps = createFormFieldA11y({
            id: itemId,
            label: option.label,
            description: option.description,
            disabled: isDisabled,
        });
        
        const handleClick = () => {
            if (!isDisabled) {
                onSelect(option.value);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        };

        if (renderOption) {
            return (
                <div 
                    ref={ref}
                    onClick={handleClick} 
                    onKeyDown={handleKeyDown} 
                    tabIndex={isDisabled ? -1 : 0}
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={isDisabled}
                    {...itemA11yProps}
                >
                    {renderOption(option, isSelected)}
                </div>
            );
        }

        if (variant === 'card') {
            return (
                <Motion
                    preset={shouldAnimate && respectMotionPreference ? (isSelected ? "scaleIn" : "fadeIn") : "none"}
                    animateOnHover={!isDisabled && shouldAnimate && respectMotionPreference}
                    duration={200}
                >
                    <OptimizedGlass
                        elevation={isSelected ? 'level3' : 'level1'}
                        intensity="medium"
                        depth={2}
                        tint="neutral"
                        border="subtle"
                        animation="none"
                        performanceMode="medium"
                        liftOnHover
                        press

                        className={cn(
                            'relative cursor-pointer transition-all duration-200 glass-p-4 glass-radius-xl',
                            {
                                'opacity-50 cursor-not-allowed': isDisabled,
                            },
                            className
                        )}
                        ref={ref}
                        onClick={handleClick}
                        onKeyDown={handleKeyDown}
                        tabIndex={isDisabled ? -1 : 0}
                        role="radio"
                        aria-checked={isSelected}
                        aria-disabled={isDisabled}
                        {...itemA11yProps}
                    >
                        {/* Hidden native radio for form compatibility */}
                        <GlassInput type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => onSelect(option.value)}
                            className="sr-only"
                        />

                        <div className="flex items-start gap-3">
                            {/* Custom radio indicator */}
                            <div
                                className={cn(
                                    'relative flex items-center justify-center glass-radius-full border-2',
                                    'transition-all duration-200 mt-0.5',
                                    sizeClasses[size],
                                    {
                                        'border-white/40 bg-white/10': !isSelected,
                                        'border-white bg-white/20': isSelected && !isDisabled,
                                        'border-white/20 bg-white/5': isDisabled,
                                    }
                                )}
                            >
                                {isSelected && (
                                    <Motion
                                        preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
                                        duration={200}
                                        className="w-2 h-2 glass-radius-full glass-surface-subtle"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    {option.icon && (
                                        <div className="flex items-center justify-center text-primary/70">
                                            {option.icon}
                                        </div>
                                    )}
                                    <h3 className={cn(
                                        'font-medium glass-text-primary',
                                        textSizeClasses[size]
                                    )}>
                                        {option.label}
                                    </h3>
                                </div>

                                {option.description && (
                                    <p className="text-primary/60 text-sm glass-mt-1 leading-relaxed">
                                        {option.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </OptimizedGlass>
                </Motion>
            );
        }

        // Default variant
        return (
            <OptimizedGlass
                ref={ref}
                elevation={isSelected ? 'level2' : 'level1'}
                intensity="subtle"
                depth={1}
                tint={isSelected ? 'primary' : 'neutral'}
                border="subtle"
                animation={shouldAnimate && respectMotionPreference ? "shimmer" : "none"}
                performanceMode="medium"
                liftOnHover={!isDisabled}
                press
                className={cn(
                    'flex items-center glass-gap-3 cursor-pointer group',
                    'transition-all duration-200 glass-p-3 glass-radius-lg',
                    {
                        'opacity-50 cursor-not-allowed': isDisabled,
                    },
                    className
                )}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={isDisabled ? -1 : 0}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isDisabled}
                {...itemA11yProps}
            >
                {/* Hidden native radio for form compatibility */}
                <GlassInput type="radio"
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => onSelect(option.value)}
                    className="sr-only"
                />

                {/* Custom radio indicator */}
                <div
                    className={cn(
                        'relative flex items-center justify-center glass-radius-full border-2',
                        'transition-all duration-200',
                        sizeClasses[size],
                        {
                            'border-white/40 bg-white/10': !isSelected,
                            'border-white bg-white/20': isSelected && !isDisabled,
                            'border-white/20 bg-white/5': isDisabled,
                        }
                    )}
                >
                    {isSelected && (
                        <Motion
                            preset={shouldAnimate && respectMotionPreference ? "scaleIn" : "none"}
                            duration={200}
                            className="w-2 h-2 glass-radius-full glass-surface-subtle"
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {option.icon && (
                            <div className="flex items-center justify-center text-primary/70">
                                {option.icon}
                            </div>
                        )}
                        <span className={cn(
                            'glass-text-primary/90',
                            textSizeClasses[size],
                            {
                                'font-medium': isSelected,
                            }
                        )}>
                            {option.label}
                        </span>
                    </div>

                    {option.description && (
                        <p className="text-primary/60 text-sm glass-mt-1">
                            {option.description}
                        </p>
                    )}
                </div>
            </OptimizedGlass>
        );
});

GlassRadioGroupItem.displayName = 'GlassRadioGroupItem';

/**
 * Hook for managing radio group state
 */
export const useRadioGroup = (initialValue?: string | number) => {
    const [value, setValue] = useState<string | number>(initialValue || '');

    return {
        value,
        setValue,
        onValueChange: setValue,
    };
};
