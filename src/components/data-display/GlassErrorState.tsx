"use client";

import React, { forwardRef } from "react";
import { AlertCircle, RefreshCw } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { GlassButton } from "../button/GlassButton";

export interface GlassErrorStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  details?: React.ReactNode;
  severity?: "error" | "warning";
}

export const GlassErrorState = forwardRef<HTMLDivElement, GlassErrorStateProps>(
  (
    {
      title = "Something went wrong",
      description = "The surface could not load. Try again or review the error details.",
      retryLabel = "Retry",
      onRetry,
      details,
      severity = "error",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <OptimizedGlass
        ref={ref}
        data-glass-component
        role="alert"
        aria-live={severity === "error" ? "assertive" : "polite"}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint={severity === "error" ? "danger" : "warning"}
        border="visible"
        animation="none"
        className={cn("glass-space-y-4 glass-p-5", className)}
        {...props}
      >
        <div className="glass-flex glass-items-start glass-gap-3">
          <AlertCircle
            aria-hidden="true"
            className="glass-mt-0.5 glass-h-5 glass-w-5 glass-text-primary"
          />
          <div className="glass-min-w-0 glass-flex-1 glass-space-y-1">
            <h3 className="glass-text-base glass-font-semibold glass-text-primary">
              {title}
            </h3>
            {description ? (
              <p className="glass-text-sm glass-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {details ? (
          <div className="glass-rounded-md glass-border glass-border-white/10 glass-bg-black/20 glass-p-3 glass-text-xs glass-text-secondary">
            {details}
          </div>
        ) : null}
        {onRetry ? (
          <GlassButton type="button" size="sm" onClick={onRetry}>
            <RefreshCw aria-hidden="true" className="glass-h-4 glass-w-4" />
            {retryLabel}
          </GlassButton>
        ) : null}
      </OptimizedGlass>
    );
  }
);

GlassErrorState.displayName = "GlassErrorState";
