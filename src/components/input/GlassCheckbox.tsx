"use client";
import { GlassInput } from "./GlassInput";

import { cn } from "../../lib/utilsComprehensive";
import { Check, Minus } from "lucide-react";
import React, { forwardRef } from "react";
import { Motion, OptimizedGlass } from "../../primitives";
import {
  createFormFieldA11y,
  useA11yId,
  announceToScreenReader,
} from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean;
  /** Callback when the checkbox state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Size of the checkbox */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Position of label relative to checkbox */
  labelPosition?: "left" | "right" | "top" | "bottom";
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Whether to show focus ring */
  focusRing?: boolean;
  /** Custom check icon */
  checkIcon?: React.ReactNode;
  /** Custom indeterminate icon */
  indeterminateIcon?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Accessible name for the checkbox */
  "aria-label"?: string;
  /** ID of element that labels the checkbox */
  "aria-labelledby"?: string;
  /** ID of element(s) that describe the checkbox */
  "aria-describedby"?: string;
}

export const GlassCheckbox = forwardRef<HTMLInputElement, GlassCheckboxProps>(
  (
    {
      checked,
      indeterminate = false,
      onCheckedChange,
      onChange,
      size = "md",
      variant = "default",
      label,
      description,
      labelPosition = "right",
      disabled = false,
      loading = false,
      focusRing = true,
      checkIcon,
      indeterminateIcon,
      error,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "data-testid": dataTestId,
      className,
      id,
      required,
      defaultChecked,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const shouldAnimate = isMotionSafe && !prefersReducedMotion;

    // Generate unique IDs for accessibility
    const checkboxId = useA11yId("glass-checkbox");
    const finalId = id || checkboxId;
    const labelId = label ? useA11yId("glass-checkbox-label") : undefined;
    const descriptionId = description
      ? useA11yId("glass-checkbox-description")
      : undefined;
    const errorId = error ? useA11yId("glass-checkbox-error") : undefined;

    const isInvalid = !!error;
    const isRequired = required || false;
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(
      Boolean(defaultChecked)
    );
    const isChecked = isControlled ? Boolean(checked) : internalChecked;

    // Create accessibility attributes
    const a11yProps = createFormFieldA11y({
      id: finalId,
      label: !ariaLabelledBy && !labelId ? ariaLabel || label : undefined,
      description: description,
      error: error,
      required: isRequired,
      invalid: isInvalid,
      disabled: disabled || loading,
      labelId: ariaLabelledBy || labelId,
      descriptionId: ariaDescribedBy || descriptionId,
      errorId: errorId,
    });

    // Announce error state changes
    React.useEffect(() => {
      if (error) {
        announceToScreenReader(`Checkbox error: ${error}`, "assertive");
      }
    }, [error]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || loading) return;

      const newChecked = event.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
      onChange?.(event);
    };

    const sizeConfig = {
      sm: {
        box: "glass-h-4 glass-w-4",
        icon: "glass-h-3 glass-w-3",
        text: "glass-text-xs",
        gap: "glass-gap-2",
      },
      md: {
        box: "glass-h-5 glass-w-5",
        icon: "glass-h-4 glass-w-4",
        text: "glass-text-sm",
        gap: "glass-gap-3",
      },
      lg: {
        box: "glass-h-6 glass-w-6",
        icon: "glass-h-5 glass-w-5",
        text: "glass-text-base",
        gap: "glass-gap-4",
      },
    };

    const variantConfig = {
      default: {
        checked: "bg-primary border-primary/20 text-primary-foreground",
        unchecked: "bg-background/50 border border-border/20",
        hover: "hover:border-primary/50",
      },
      success: {
        checked: "bg-green-500 border-green-400/20 glass-text-primary",
        unchecked: "bg-background/50 border border-border/20",
        hover: "hover:border-green-400/50",
      },
      warning: {
        checked: "bg-amber-500 border-amber-400/20 glass-text-primary",
        unchecked: "bg-background/50 border border-border/20",
        hover: "hover:border-amber-400/50",
      },
      error: {
        checked: "bg-red-500 border-red-400/20 glass-text-primary",
        unchecked: "bg-background/50 border border-border/20",
        hover: "hover:border-red-400/50",
      },
      info: {
        checked: "bg-blue-500 border-blue-400/20 glass-text-primary",
        unchecked: "bg-background/50 border border-border/20",
        hover: "hover:border-blue-400/50",
      },
    };

    const config = sizeConfig[size];
    const colors = variantConfig[variant];
    const isCheckedOrIndeterminate = isChecked || indeterminate;

    const checkboxElement = (
      <div
        className="glass-relative glass-inline-flex glass-items-center"
        data-testid={dataTestId || "glasscheckbox"}
      >
        {/* Hidden input */}
        <input
          ref={ref}
          type="checkbox"
          {...a11yProps}
          checked={isControlled ? isChecked : undefined}
          defaultChecked={!isControlled ? defaultChecked : undefined}
          onChange={handleChange}
          disabled={disabled || loading}
          className="glass-sr-only glass-touch-target glass-contrast-guard"
          aria-label={
            ariaLabel || label || a11yProps["aria-label"] || "Checkbox"
          }
          {...props}
        />

        {/* Visual checkbox */}
        <OptimizedGlass
          elevation={isCheckedOrIndeterminate ? "level2" : "level1"}
          intensity="medium"
          depth={2}
          tint={isCheckedOrIndeterminate ? "primary" : "neutral"}
          border="subtle"
          animation={
            shouldAnimate && respectMotionPreference ? "float" : "none"
          }
          performanceMode="medium"
          liftOnHover
          press
          className={cn(
            "glass-checkbox-box relative inline-flex items-center justify-center",
            "cursor-pointer group glass-radius-lg transition-all duration-200",

            // Size
            config.box,

            // Disabled state
            disabled && "opacity-50 cursor-not-allowed",

            // Loading state
            loading && "cursor-wait",

            // Focus styles
            focusRing && [
              "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2",
              "focus-within:ring-primary focus-within:ring-offset-background",
            ],

            // Error state
            error && !isCheckedOrIndeterminate && "ring-2 ring-destructive/50"
          )}
          role="checkbox"
          aria-checked={!!isChecked}
          aria-busy={loading || undefined}
          aria-label={
            a11yProps["aria-label"] || label || description || "checkbox"
          }
          aria-labelledby={a11yProps["aria-labelledby"]}
          aria-describedby={a11yProps["aria-describedby"]}
        >
          {/* Check/indeterminate icon */}
          <Motion
            preset={
              shouldAnimate && respectMotionPreference ? "scaleIn" : "none"
            }
            className={cn(
              "flex items-center justify-center",
              config.icon,
              isCheckedOrIndeterminate ? "opacity-100" : "opacity-0"
            )}
          >
            {loading && (
              <div
                className={cn(
                  shouldAnimate && respectMotionPreference
                    ? "animate-spin"
                    : "",
                  "glass-radius-full border-2 border-current border-t-transparent",
                  size === "sm"
                    ? "glass-w-2 glass-h-2"
                    : size === "md"
                      ? "glass-w-3 glass-h-3"
                      : "glass-w-4 glass-h-4"
                )}
              />
            )}

            {!loading &&
              indeterminate &&
              (indeterminateIcon || (
                <Minus className={config.icon} strokeWidth={3} />
              ))}

            {!loading &&
              !indeterminate &&
              isChecked &&
              (checkIcon || <Check className={config.icon} strokeWidth={3} />)}
          </Motion>
        </OptimizedGlass>
      </div>
    );

    const labelElement = label && (
      <label
        id={labelId}
        htmlFor={finalId}
        className={cn(
          "glass-checkbox-label cursor-pointer font-medium text-foreground",
          config.text,
          disabled && "cursor-not-allowed opacity-70",
          isRequired &&
            'after:content-["*"] after:glass-ml-1 after:text-destructive'
        )}
      >
        {label}
      </label>
    );

    const descriptionElement = description && (
      <p
        id={descriptionId}
        className={cn(
          "glass-checkbox-description glass-text-secondary",
          size === "sm" ? "glass-text-xs" : "glass-text-sm",
          disabled && "opacity-70"
        )}
      >
        {description}
      </p>
    );

    const errorElement = error && (
      <p
        id={errorId}
        className={cn(
          "glass-checkbox-error text-destructive",
          size === "sm" ? "glass-text-xs" : "glass-text-sm"
        )}
        role="alert"
        aria-live="polite"
      >
        {error}
      </p>
    );

    // Render based on label position
    if (!label && !description && !error) {
      return React.cloneElement(checkboxElement, {
        className: cn(checkboxElement.props.className, className),
      });
    }

    return (
      <div
        className={cn(
          "glass-flex",
          {
            "glass-flex-row glass-items-start":
              labelPosition === "left" || labelPosition === "right",
            "glass-flex-col glass-items-start":
              labelPosition === "top" || labelPosition === "bottom",
          },
          config.gap,
          className
        )}
        data-testid={dataTestId || "glasscheckbox"}
      >
        {(labelPosition === "left" || labelPosition === "right") && (
          <div className="glass-flex glass-items-start glass-pt-0.5">
            {checkboxElement}
          </div>
        )}

        {(labelPosition === "top" || labelPosition === "bottom") &&
          checkboxElement}

        <div className="glass-gap-1 glass-min-w-0 glass-flex-1">
          {labelElement}
          {descriptionElement}
          {errorElement}
        </div>
      </div>
    );
  }
);

GlassCheckbox.displayName = "GlassCheckbox";

export default GlassCheckbox;
