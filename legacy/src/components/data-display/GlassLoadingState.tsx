"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";

export interface GlassLoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  variant?: "spinner" | "skeleton" | "progress";
  progress?: number;
  rows?: number;
}

export const GlassLoadingState = forwardRef<
  HTMLDivElement,
  GlassLoadingStateProps
>(
  (
    {
      label = "Loading",
      description,
      variant = "spinner",
      progress,
      rows = 3,
      className,
      ...props
    },
    ref
  ) => {
    const clampedProgress =
      typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : 0;

    return (
      <OptimizedGlass
        ref={ref}
        data-glass-component
        role="status"
        aria-live="polite"
        aria-busy="true"
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        animation="none"
        className={cn("glass-space-y-4 glass-p-5", className)}
        {...props}
      >
        <div className="glass-flex glass-items-center glass-gap-3">
          <Loader2
            aria-hidden="true"
            className={cn(
              "glass-h-5 glass-w-5 glass-text-primary",
              variant === "spinner" && "glass-animate-spin"
            )}
          />
          <div className="glass-space-y-0.5">
            <p className="glass-text-sm glass-font-medium glass-text-primary">
              {label}
            </p>
            {description ? (
              <p className="glass-text-xs glass-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {variant === "skeleton" ? (
          <div className="glass-space-y-2" aria-hidden="true">
            {Array.from({ length: rows }).map((_, index) => (
              <div
                key={index}
                className="glass-h-3 glass-rounded-full glass-bg-white/12"
                style={{ width: `${96 - index * 14}%` }}
              />
            ))}
          </div>
        ) : null}
        {variant === "progress" ? (
          <div
            className="glass-h-2 glass-overflow-hidden glass-rounded-full glass-bg-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clampedProgress}
          >
            <div
              className="glass-h-full glass-rounded-full glass-bg-primary"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        ) : null}
      </OptimizedGlass>
    );
  }
);

GlassLoadingState.displayName = "GlassLoadingState";
