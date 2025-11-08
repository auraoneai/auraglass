import React, { forwardRef, useRef, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { AlertCircle } from 'lucide-react';

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea variant */
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  /** Textarea size */
  size?: 'sm' | 'md' | 'lg';
  /** Textarea state */
  state?: 'default' | 'error' | 'warning' | 'success';
  /** Whether textarea is full width */
  fullWidth?: boolean;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error text */
  errorText?: string;
  /** Whether to auto-resize based on content */
  autoResize?: boolean;
  /** Minimum number of rows */
  minRows?: number;
  /** Maximum number of rows */
  maxRows?: number;
  /** Character count display */
  showCharCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Loading state */
  loading?: boolean;
  /** Icon to display */
  icon?: React.ReactNode;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      fullWidth = false,
      label,
      helperText,
      errorText,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      showCharCount = false,
      maxLength,
      loading = false,
      icon,
      className,
      id,
      rows = minRows,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const combinedRef = ref || textareaRef;
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const currentLength = typeof value === 'string' ? (value?.length || 0) : 0;

    const sizeConfig = {
      sm: {
        text: 'glass-text-sm',
        padding: 'glass-px-3 glass-py-2',
        minHeight: 'min-h-[80px]',
      },
      md: {
        text: 'glass-text-sm',
        padding: 'glass-px-4 glass-py-3',
        minHeight: 'min-h-[100px]',
      },
      lg: {
        text: 'glass-text-base',
        padding: 'glass-px-4 glass-py-4',
        minHeight: 'min-h-[120px]',
      },
    };

    const variantConfig = {
      default: {
        base: 'bg-background/50 border border-border/20',
        focus: 'focus:border-primary focus:ring-1 focus:ring-primary',
      },
      filled: {
        base: 'bg-muted/50 border border-transparent',
        focus: 'focus:bg-background/50 focus:border-primary',
      },
      outlined: {
        base: 'bg-transparent border-2 border-border/20',
        focus: 'focus:border-primary',
      },
      minimal: {
        base: 'bg-transparent border-0 border-b border-border/20',
        focus: 'focus:border-primary',
      },
    };

    const stateConfig = {
      default: '',
      error: 'border-red-400 focus:border-red-400 focus:ring-red-400',
      warning: 'border-amber-400 focus:border-amber-400 focus:ring-amber-400', 
      success: 'border-green-400 focus:border-green-400 focus:ring-green-400',
    };

    const config = sizeConfig?.[size];
    const variantStyles = variantConfig?.[variant];
    const stateStyles = stateConfig?.[state];
    const hasError = state === 'error' || !!errorText;

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && combinedRef && 'current' in combinedRef && combinedRef.current) {
        const textarea = combinedRef.current;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
        const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
        
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
        const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
        
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, [value, autoResize, minRows, maxRows, combinedRef]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
    };

    return (
      <div data-glass-component className={cn('glass-textarea-wrapper', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'block font-medium text-foreground glass-mb-2',
              config.text,
              props?.disabled && 'opacity-50'
            )}
          >
            {label}
            {props?.required && (
              <span className="text-primary glass-ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={combinedRef}
            id={textareaId}
            rows={autoResize ? undefined : rows}
            value={value}
            onChange={handleChange}
            maxLength={maxLength}
            aria-describedby={
              helperText ? `${textareaId}-helper` : 
              errorText ? `${textareaId}-error` : undefined
            }
            aria-invalid={hasError}
            className={cn(
              'glass-textarea',
              'w-full resize-none glass-radius-lg backdrop-blur-md transition-all duration-200 glass-pulse-ring',
              'placeholder:glass-text-secondary',
              'focus:outline-none focus:ring-offset-2 focus:ring-offset-background',
              
              // Size
              config.text,
              config.padding,
              !autoResize && config.minHeight,
              
              // Variant
              variantStyles.base,
              variantStyles.focus,
              
              // State
              stateStyles,
              
              // Disabled
              props?.disabled && 'opacity-50 cursor-not-allowed',
              
              // Loading
              loading && 'animate-pulse cursor-wait',
              
              // Full width
              fullWidth && 'w-full',
              
              className
            )}
            {...props}
          />

          {/* Icon */}
          {icon && (
            <div className={cn(
              'absolute top-3 right-3 glass-text-secondary',
              props?.disabled && 'opacity-50'
            )}>
              {icon}
            </div>
          )}

          {/* Error Icon */}
          {hasError && (
            <div className="absolute top-3 right-3 text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div className={cn(
            'flex justify-end glass-mt-1 glass-text-xs',
            currentLength > maxLength * 0.9 ? 'text-amber-400' : 'glass-text-secondary',
            currentLength >= maxLength && 'text-red-400'
          )}>
            {currentLength}/{maxLength}
          </div>
        )}

        {/* Helper Text */}
        {helperText && !hasError && (
          <p
            id={`${textareaId}-helper`}
            className={cn(
              'glass-mt-2 glass-text-xs glass-text-secondary',
              props?.disabled && 'opacity-50'
            )}
          >
            {helperText}
          </p>
        )}

        {/* Error Text */}
        {errorText && (
          <p
            id={`${textareaId}-error`}
            className="glass-mt-2 text-xs text-primary flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';

export default GlassTextarea;
