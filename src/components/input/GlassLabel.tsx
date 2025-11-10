'use client';
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";

export interface GlassLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Size of the label */
  size?: "xs" | "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "muted" | "accent" | "success" | "warning" | "error";
  /** Whether the label is required */
  required?: boolean;
  /** Whether the label is for a disabled field */
  disabled?: boolean;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Optional description for the label */
  description?: string;
  /** Whether the label should have enhanced visual styling */
  enhanced?: boolean;
  /** Optional test id hook */
  'data-testid'?: string;
}

export const GlassLabel = forwardRef<HTMLLabelElement, GlassLabelProps>(
  (
    {
      size = "md",
      variant = "default",
      required = false,
      disabled = false,
      icon,
      description,
      enhanced = false,
      className,
      children,
      id,
      'data-testid': dataTestId,
      ...props
    },
    ref
  ) => {
    const labelId = useA11yId("glass-label");
    const finalId = id || labelId;
    const sizeConfig = {
      xs: "glass-text-xs",
      sm: "glass-text-sm",
      md: "glass-text-sm",
      lg: "glass-text-base",
    };

    const variantConfig = {
      default: "text-foreground",
      muted: "glass-text-secondary",
      accent: "text-primary",
      success: "text-green-400",
      warning: "text-amber-400",
      error: "text-red-400",
    };

    return (
      <div data-glass-component className="glass-label-container">
        <label
          ref={ref}
          id={finalId}
          data-testid={dataTestId ?? 'glasslabel'}
          className={cn(
            "glass-label",
            "font-medium leading-none transition-colors duration-200",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",

            // Size
            sizeConfig[size],

            // Variant
            variantConfig[variant],

            // Disabled state
            disabled && "opacity-50 cursor-not-allowed",

            // Icon spacing
            icon && "flex items-center glass-gap-2",

            // Enhanced styling
            enhanced && "glass-focus",

            className
          )}
          {...props}
        >
          {icon && <span className='shrink-0'>{icon}</span>}

          <span>
            {children}
            {required && (
              <span
                className='text-destructive glass-ml-1'
                aria-label="required"
              >
                *
              </span>
            )}
          </span>
        </label>

        {description && (
          <p
            className={cn(
              "glass-label-description glass-text-secondary glass-mt-1",
              size === "xs" ? "glass-text-xs" : "glass-text-sm",
              disabled && "opacity-50"
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

GlassLabel.displayName = "GlassLabel";

export default GlassLabel;
