"use client";

import React, { forwardRef } from "react";
import { cn } from "../lib/utilsComprehensive";

export type LiquidGlassConcentricShape = "concentric" | "capsule" | "rounded-rect" | "fixed";
export type LiquidGlassConcentricRadius = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | number;

const radiusMap: Record<Exclude<LiquidGlassConcentricRadius, number>, string> = {
  sm: "var(--glass-radius-sm, 6px)",
  md: "var(--glass-radius-md, 8px)",
  lg: "var(--glass-radius-lg, 12px)",
  xl: "var(--glass-radius-xl, 16px)",
  "2xl": "var(--glass-radius-2xl, 24px)",
  full: "9999px",
};

export interface LiquidGlassConcentricFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: LiquidGlassConcentricRadius;
  inset?: number;
  shape?: LiquidGlassConcentricShape;
  fallbackRadius?: number;
  asChild?: boolean;
  children?: React.ReactNode;
}

export function getConcentricRadiusValue(
  radius: LiquidGlassConcentricRadius = "lg",
  inset = 0,
  shape: LiquidGlassConcentricShape = "concentric",
  fallbackRadius = 12
) {
  if (shape === "capsule") return "9999px";
  const base = typeof radius === "number" ? `${radius}px` : radiusMap[radius] ?? `${fallbackRadius}px`;
  if (shape === "fixed" || inset === 0) return base;
  if (typeof radius === "number") return `${Math.max(radius - inset, 0)}px`;
  return `max(calc(${base} - ${inset}px), ${fallbackRadius}px)`;
}

export const LiquidGlassConcentricFrame = forwardRef<HTMLDivElement, LiquidGlassConcentricFrameProps>(
  (
    {
      radius = "lg",
      inset = 0,
      shape = "concentric",
      fallbackRadius = 8,
      asChild = false,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const baseRadius = typeof radius === "number" ? `${radius}px` : radiusMap[radius] ?? `${fallbackRadius}px`;
    const computedRadius = getConcentricRadiusValue(radius, inset, shape, fallbackRadius);
    const cssVars = {
      "--liquid-glass-parent-radius": baseRadius,
      "--liquid-glass-frame-inset": `${inset}px`,
      "--liquid-glass-frame-radius": computedRadius,
      borderRadius: "var(--liquid-glass-frame-radius)",
    } as React.CSSProperties;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        className: cn((children as React.ReactElement<any>).props.className, className),
        style: { ...cssVars, ...(children as React.ReactElement<any>).props.style, ...style },
        "data-liquid-glass-concentric-frame": shape,
        ...props,
      });
    }

    return (
      <div
        ref={ref}
        className={cn("liquid-glass-concentric-frame", className)}
        style={{ ...cssVars, ...style }}
        data-liquid-glass-concentric-frame={shape}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiquidGlassConcentricFrame.displayName = "LiquidGlassConcentricFrame";
