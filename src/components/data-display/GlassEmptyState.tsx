"use client";

import React, { forwardRef } from "react";
import { Archive, Search, Sparkles } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { GlassButton } from "../button/GlassButton";

export interface GlassEmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface GlassEmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "search" | "success" | "compact";
  primaryAction?: GlassEmptyStateAction;
  secondaryAction?: GlassEmptyStateAction;
}

const variantIcon = {
  default: Archive,
  search: Search,
  success: Sparkles,
  compact: Archive,
};

const EmptyAction = ({ action }: { action: GlassEmptyStateAction }) => {
  if (action.href) {
    return (
      <GlassButton asChild size="sm">
        <a href={action.href}>{action.label}</a>
      </GlassButton>
    );
  }
  return (
    <GlassButton type="button" size="sm" onClick={action.onClick}>
      {action.label}
    </GlassButton>
  );
};

export const GlassEmptyState = forwardRef<HTMLDivElement, GlassEmptyStateProps>(
  (
    {
      title = "Nothing here yet",
      description = "Create a record or adjust the current filters to populate this surface.",
      icon,
      variant = "default",
      primaryAction,
      secondaryAction,
      className,
      ...props
    },
    ref
  ) => {
    const Icon = variantIcon[variant];
    const compact = variant === "compact";

    return (
      <OptimizedGlass
        ref={ref}
        data-glass-component
        role="status"
        aria-live="polite"
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        animation="none"
        className={cn(
          "glass-flex glass-flex-col glass-items-center glass-justify-center glass-gap-3 glass-text-center",
          compact ? "glass-p-4" : "glass-min-h-[220px] glass-p-8",
          className
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="glass-flex glass-h-12 glass-w-12 glass-items-center glass-justify-center glass-rounded-full glass-border glass-border-white/15 glass-bg-white/8 glass-text-primary"
        >
          {icon ?? <Icon size={22} />}
        </div>
        <div className="glass-space-y-1">
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">
            {title}
          </h3>
          {description ? (
            <p className="glass-mx-auto glass-max-w-md glass-text-sm glass-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-center glass-gap-2">
            {primaryAction ? <EmptyAction action={primaryAction} /> : null}
            {secondaryAction ? <EmptyAction action={secondaryAction} /> : null}
          </div>
        )}
      </OptimizedGlass>
    );
  }
);

GlassEmptyState.displayName = "GlassEmptyState";
