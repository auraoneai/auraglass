"use client";

import React, { forwardRef, useId } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { GlassValidationMessage } from "./GlassValidationMessage";

export interface GlassFormFieldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  htmlFor?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export const GlassFormField = forwardRef<HTMLDivElement, GlassFormFieldProps>(
  (
    {
      label,
      htmlFor,
      description,
      error,
      required,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const labelId = htmlFor ?? `glass-field-${generatedId}`;

    return (
      <div
        ref={ref}
        data-glass-component
        data-disabled={disabled || undefined}
        className={cn(
          "glass-space-y-2",
          disabled && "glass-opacity-60",
          className
        )}
        {...props}
      >
        {label ? (
          <label
            htmlFor={labelId}
            className="glass-block glass-text-sm glass-font-medium glass-text-primary"
          >
            {label}
            {required ? (
              <span
                aria-hidden="true"
                className="glass-ml-1 glass-text-red-300"
              >
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {children}
        {description && !error ? (
          <p className="glass-text-xs glass-text-secondary">{description}</p>
        ) : null}
        {error ? (
          <GlassValidationMessage tone="error">{error}</GlassValidationMessage>
        ) : null}
      </div>
    );
  }
);

GlassFormField.displayName = "GlassFormField";
