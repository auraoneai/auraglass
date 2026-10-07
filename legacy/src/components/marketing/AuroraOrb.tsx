"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import type { MarketingPalette } from "./types";
import "./marketing.css";

export interface AuroraOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string;
  palette?: MarketingPalette;
  pulse?: boolean;
  glow?: "none" | "subtle" | "medium" | "strong";
  interactive?: boolean;
  tiltX?: number;
  tiltY?: number;
}

function toCssSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

export const AuroraOrb = forwardRef<HTMLDivElement, AuroraOrbProps>(
  (
    {
      size = "18rem",
      palette = "aurora",
      pulse = true,
      glow = "medium",
      interactive = false,
      tiltX = 0,
      tiltY = 0,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (
      event
    ) => {
      if (interactive) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          props.onPointerMove?.(event);
          return;
        }
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
        event.currentTarget.style.setProperty(
          "--ag-tilt-y",
          `${x.toFixed(2)}deg`
        );
        event.currentTarget.style.setProperty(
          "--ag-tilt-x",
          `${y.toFixed(2)}deg`
        );
      }

      props.onPointerMove?.(event);
    };

    const handlePointerLeave: React.PointerEventHandler<HTMLDivElement> = (
      event
    ) => {
      if (interactive) {
        event.currentTarget.style.setProperty("--ag-tilt-x", `${tiltX}deg`);
        event.currentTarget.style.setProperty("--ag-tilt-y", `${tiltY}deg`);
      }

      props.onPointerLeave?.(event);
    };

    return (
      <div
        ref={ref}
        aria-hidden={props["aria-hidden"] ?? true}
        data-ag-palette={palette}
        data-glow={glow}
        data-interactive={interactive || undefined}
        data-pulse={pulse || undefined}
        className={cn("ag-marketing-scope ag-aurora-orb", className)}
        style={
          {
            "--ag-orb-size": toCssSize(size),
            "--ag-tilt-x": `${tiltX}deg`,
            "--ag-tilt-y": `${tiltY}deg`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <span className="ag-aurora-orb__core" />
        <span className="ag-aurora-orb__shine" />
        {children}
      </div>
    );
  }
);

AuroraOrb.displayName = "AuroraOrb";
