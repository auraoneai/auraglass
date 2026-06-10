"use client";
// Removed circular imports - components import directly from source

import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import {
  announceToScreenReader,
  createFormFieldA11y,
  useA11yId,
} from "../../utils/a11y";
import { GlassButton } from "../button/GlassButton";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * GlassInput variant
   */
  variant?: "default" | "filled" | "outlined" | "minimal";
  /**
   * GlassInput size
   */
  size?: "sm" | "md" | "lg";
  /**
   * GlassInput state
   */
  state?: "default" | "error" | "warning" | "success";
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
  "aria-labelledby"?: string;
  /**
   * ID of element(s) that describe the input
   */
  "aria-describedby"?: string;
  /**
   * Whether the input is required
   */
  "aria-required"?: boolean;
  /**
   * Whether the input value is invalid
   */
  "aria-invalid"?: boolean;
  /**
   * ID of error message element
   */
  "aria-errormessage"?: string;
  /**
   * Glass material variant
   */
  material?: "glass" | "liquid";
  /**
   * Material properties for liquid glass
   */
  materialProps?: {
    ior?: number;
    thickness?: number;
    tint?: { r: number; g: number; b: number; a: number };
    variant?: "regular" | "clear";
    quality?: "ultra" | "high" | "balanced" | "efficient";
  };
}

/**
 * GlassInput component
 * A glassmorphism input field with various states and configurations
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      variant = "default",
      size = "md",
      state = "default",
      fullWidth = false,
      leftIcon,
      rightIcon,
      helperText,
      errorText,
      loading = false,
      clearable = false,
      material = "glass",
      materialProps,
      onClear,
      className,
      disabled,
      label,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-required": ariaRequired,
      "aria-invalid": ariaInvalid,
      "aria-errormessage": ariaErrorMessage,
      "data-testid": dataTestId,
      required,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Generate unique IDs for accessibility
    const inputId = useA11yId("glass-input");
    const helperTextId =
      helperText || errorText ? useA11yId("glass-input-helper") : undefined;
    const errorId = errorText ? useA11yId("glass-input-error") : undefined;
    const labelId = label ? useA11yId("glass-input-label") : undefined;

    const currentState = errorText ? "error" : state;
    const displayHelperText = errorText || helperText;
    const isInvalid = currentState === "error" || ariaInvalid === true;
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

    // Add aria-label if no explicit label is provided
    if (!label && !props["aria-label"] && !ariaLabelledBy) {
      a11yProps["aria-label"] = props.placeholder || "Input field";
    }

    // Announce error state changes
    React.useEffect(() => {
      if (errorText) {
        announceToScreenReader(`Input error: ${errorText}`, "assertive");
      }
    }, [errorText]);

    const sizeClasses = {
      sm: "glass-h-8 glass-px-3 glass-text-sm",
      md: "glass-h-10 glass-px-4 glass-text-sm",
      lg: "glass-h-12 glass-px-5 glass-text-base",
    };

    const variantClasses = {
      default: "glass-surface-dark/30 glass-border glass-border-white/10",
      filled: "glass-surface-dark/40 glass-border glass-border-transparent",
      outlined: "glass-bg-transparent glass-border glass-border-white/20",
      minimal: "glass-bg-transparent glass-border-0",
    };

    const stateClasses = {
      default: "focus:glass-border-blue",
      error: "glass-border-red focus:glass-border-red",
      warning: "glass-border-yellow focus:glass-border-yellow",
      success: "glass-border-green focus:glass-border-green",
    };

    const iconSize = {
      sm: "glass-w-4 glass-h-4",
      md: "glass-w-4 glass-h-4",
      lg: "glass-w-5 glass-h-5",
    };
    const accessibleName =
      label || props["aria-label"] || props.placeholder || "input";

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
        }
      },
      [ref]
    );

    const handleClear = () => {
      if (disabled || loading) return;

      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }

      if (onClear) {
        onClear();
      } else if (props?.onChange && inputRef.current) {
        const event = {
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        props?.onChange(event);
      }
    };

    return (
      <div
        data-glass-component
        data-testid={dataTestId || "glassinput"}
        className={cn(
          "glass-relative glass-min-w-0",
          { "glass-w-full": fullWidth },
          className
        )}
      >
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={cn(
              "glass-block glass-text-sm glass-font-medium glass-text-primary glass-mb-2",
              isRequired &&
                'after:content-["*"] after:glass-ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        {material === "liquid" ? (
          <LiquidGlassMaterial
            ior={materialProps?.ior || (isFocused ? 1.46 : 1.43)}
            thickness={
              materialProps?.thickness ||
              (size === "sm" ? 5 : size === "md" ? 7 : 9)
            }
            tint={
              materialProps?.tint ||
              (currentState === "error"
                ? { r: 220, g: 38, b: 38, a: 0.08 }
                : currentState === "warning"
                  ? { r: 217, g: 119, b: 6, a: 0.08 }
                  : currentState === "success"
                    ? { r: 34, g: 197, b: 94, a: 0.08 }
                    : { r: 0, g: 0, b: 0, a: 0.04 })
            }
            variant={materialProps?.variant || "clear"}
            quality={materialProps?.quality || "high"}
            environmentAdaptation
            motionResponsive={false}
            interactive
            className={cn(
              "glass-relative glass-flex glass-items-center glass-transition-all glass-duration-200 liquid-glass-input-surface",
              sizeClasses?.[size],
              variantClasses?.[variant],
              stateClasses?.[currentState],
              {
                "glass-opacity-50": disabled,
                "glass-ring-2 glass-ring-primary":
                  isFocused && currentState === "default",
                "glass-ring-2 glass-ring-red":
                  isFocused && currentState === "error",
                "glass-ring-2 glass-ring-yellow":
                  isFocused && currentState === "warning",
                "glass-ring-2 glass-ring-green":
                  isFocused && currentState === "success",
              },
              className
            )}
            style={{
              ...({
                "--liquid-glass-input-density": isFocused ? "0.95" : "0.92",
                "--liquid-glass-focus-refraction": "1.15",
              } as React.CSSProperties),
              background:
                "var(--glass-primary-level3-surface)",
              border: "1px solid rgba(148, 163, 184, 0.24)",
              boxShadow:
                "0 8px 22px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
            data-liquid-glass-input="true"
            data-input-state={currentState}
            data-input-focused={isFocused}
            aria-busy={loading || undefined}
          >
            {leftIcon && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-justify-center glass-mr-3 glass-text-secondary",
                  iconSize?.[size]
                )}
              >
                {leftIcon}
              </div>
            )}

            <input
              ref={setInputRef}
              {...a11yProps}
              className={cn(
                "glass-flex-1 glass-bg-transparent glass-border-0 glass-outline-none glass-pulse-ring glass-text-primary glass-min-w-0",
                {
                  "glass-pr-8": clearable || rightIcon || loading,
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
              {...(() => {
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
              })()}
            />

            {loading && (
              <GlassButton
                variant="ghost"
                size="sm"
                iconOnly
                disabled
                aria-label="Loading"
                className={cn(
                  "glass-flex glass-items-center glass-justify-center glass-text-secondary",
                  iconSize?.[size]
                )}
              >
                <div className="glass-animate-spin">⟳</div>
              </GlassButton>
            )}

            {clearable && props.value && !loading && (
              <GlassButton
                variant="ghost"
                size="sm"
                iconOnly
                onClick={handleClear}
                aria-label={`Clear ${accessibleName}`}
                className={cn(
                  "glass-flex glass-items-center glass-justify-center glass-text-secondary hover:glass-text-primary glass-transition-colors",
                  iconSize?.[size]
                )}
              >
                ×
              </GlassButton>
            )}

            {rightIcon && !loading && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-justify-center glass-text-secondary",
                  iconSize?.[size]
                )}
              >
                {rightIcon}
              </div>
            )}
          </LiquidGlassMaterial>
        ) : (
          <OptimizedGlass
            elevation={isFocused ? "level2" : "level1"}
            intensity="subtle"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            liftOnHover
            press
            style={{
              background:
                "var(--glass-primary-level3-surface)",
              border: "1px solid rgba(148, 163, 184, 0.24)",
              boxShadow:
                "0 8px 22px rgba(2, 6, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
            className={cn(
              "glass-relative glass-flex glass-items-center glass-transition-all glass-duration-200 glass-radius-2xl glass-surface-dark/30 glass-border glass-border-white/10",
              sizeClasses?.[size],
              variantClasses?.[variant],
              stateClasses?.[currentState],
              {
                "glass-opacity-50": disabled,
                "glass-ring-2 glass-ring-primary":
                  isFocused && currentState === "default",
                "glass-ring-2 glass-ring-red":
                  isFocused && currentState === "error",
                "glass-ring-2 glass-ring-yellow":
                  isFocused && currentState === "warning",
                "glass-ring-2 glass-ring-green":
                  isFocused && currentState === "success",
              },
              className
            )}
            aria-busy={loading || undefined}
          >
            {leftIcon && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-justify-center glass-mr-3 glass-text-secondary",
                  iconSize?.[size]
                )}
              >
                {leftIcon}
              </div>
            )}

            <input
              ref={setInputRef}
              {...a11yProps}
              className={cn(
                "glass-flex-1 glass-bg-transparent glass-border-0 glass-outline-none glass-pulse-ring glass-text-primary glass-min-w-0",
                {
                  "glass-pr-8": clearable || rightIcon || loading,
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
              {...(() => {
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
              })()}
            />

            <div className="glass-flex glass-items-center glass-gap-1">
              {loading && (
                <div
                  className={cn(
                    "glass-animate-spin glass-radius-full glass-border-2 glass-border-white/30 glass-border-t-white/60",
                    iconSize?.[size]
                  )}
                />
              )}

              {clearable && props?.value && !loading && (
                <GlassButton
                  type="button"
                  onClick={handleClear}
                  variant="ghost"
                  size="sm"
                  iconOnly
                  aria-label={`Clear ${accessibleName}`}
                  className={cn(
                    "glass-flex glass-items-center glass-justify-center glass-text-secondary hover:glass-text-primary glass-transition-colors",
                    iconSize?.[size]
                  )}
                >
                  ×
                </GlassButton>
              )}

              {rightIcon && !loading && (
                <div
                  className={cn(
                    "glass-flex glass-items-center glass-justify-center glass-text-secondary",
                    iconSize?.[size]
                  )}
                >
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
              "glass-mt-1 glass-text-xs",
              currentState === "error"
                ? "text-destructive"
                : currentState === "warning"
                  ? "text-warning"
                  : currentState === "success"
                    ? "text-success"
                    : "glass-text-secondary"
            )}
            role={errorText ? "alert" : undefined}
            aria-live={errorText ? "polite" : undefined}
          >
            {displayHelperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";

// Backward-compat alias exports for legacy imports
export { GlassTextarea as GlassTextArea } from "./GlassTextarea";
export type { GlassTextareaProps as GlassTextAreaProps } from "./GlassTextarea";
