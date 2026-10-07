"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import "./marketing.css";

export interface ShowcaseCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "medium" | "strong";
  glow?: "none" | "subtle" | "aurora";
  floating?: boolean;
  interactive?: boolean;
  radius?: "md" | "lg" | "xl";
  padding?: "sm" | "md" | "lg";
  highlight?: boolean;
}

export const ShowcaseCard = forwardRef<HTMLDivElement, ShowcaseCardProps>(
  (
    {
      intensity = "medium",
      glow = "none",
      floating = false,
      interactive = false,
      radius = "xl",
      padding = "md",
      highlight = true,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-glow={glow}
      data-floating={floating || undefined}
      data-highlight={highlight || undefined}
      data-intensity={intensity}
      data-interactive={interactive || undefined}
      data-padding={padding}
      data-radius={radius}
      className={cn("ag-marketing-scope ag-showcase-card", className)}
      {...props}
    >
      {children}
    </div>
  )
);

ShowcaseCard.displayName = "ShowcaseCard";
