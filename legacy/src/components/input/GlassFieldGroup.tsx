"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";

export interface GlassFieldGroupProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export const GlassFieldGroup = forwardRef<
  HTMLFieldSetElement,
  GlassFieldGroupProps
>(
  (
    { legend, description, columns = 1, className, children, ...props },
    ref
  ) => {
    return (
      <fieldset
        ref={ref}
        data-glass-component
        className={cn(
          "glass-space-y-3 glass-rounded-lg glass-border glass-border-white/10 glass-bg-white/6 glass-p-4",
          className
        )}
        {...props}
      >
        {legend ? (
          <legend className="glass-text-sm glass-font-semibold glass-text-primary">
            {legend}
          </legend>
        ) : null}
        {description ? (
          <p className="glass-text-xs glass-text-secondary">{description}</p>
        ) : null}
        <div
          className={cn(
            "glass-grid glass-gap-3",
            columns === 2 && "md:glass-grid-cols-2",
            columns === 3 && "md:glass-grid-cols-3"
          )}
        >
          {children}
        </div>
      </fieldset>
    );
  }
);

GlassFieldGroup.displayName = "GlassFieldGroup";
