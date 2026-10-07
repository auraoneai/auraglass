"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import type { MarketingPalette } from "./types";
import "./marketing.css";

export interface LogoMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  palette?: MarketingPalette;
  label?: string;
  animated?: boolean;
}

function toCssSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

export const LogoMark = forwardRef<HTMLDivElement, LogoMarkProps>(
  (
    {
      size = "2.5rem",
      palette = "aurora",
      label,
      animated = false,
      className,
      style,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      data-ag-palette={palette}
      data-animated={animated || undefined}
      className={cn("ag-marketing-scope ag-logo-mark", className)}
      style={
        {
          "--ag-logo-size": toCssSize(size),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <span className="ag-logo-mark__core" />
    </div>
  )
);

LogoMark.displayName = "LogoMark";
