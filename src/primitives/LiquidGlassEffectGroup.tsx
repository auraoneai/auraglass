"use client";

import React, { createContext, forwardRef, useContext, useMemo } from "react";
import { cn } from "../lib/utilsComprehensive";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  LiquidGlassLayerProvider,
  type LiquidGlassPerformanceLevel,
} from "./LiquidGlassLayerProvider";

export type LiquidGlassSamplingStrategy = "shared" | "isolated" | "auto";

export interface LiquidGlassEffectGroupContextValue {
  groupId: string;
  spacing: number | string;
  morph: boolean;
  samplingStrategy: LiquidGlassSamplingStrategy;
  performanceLevel: LiquidGlassPerformanceLevel;
}

const LiquidGlassEffectGroupContext = createContext<LiquidGlassEffectGroupContextValue | null>(null);

export interface LiquidGlassEffectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number | string;
  morph?: boolean;
  samplingStrategy?: LiquidGlassSamplingStrategy;
  performanceLevel?: LiquidGlassPerformanceLevel;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const LiquidGlassEffectGroup = forwardRef<HTMLDivElement, LiquidGlassEffectGroupProps>(
  (
    {
      spacing = 12,
      morph = true,
      samplingStrategy = "shared",
      performanceLevel = "high",
      disabled = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const prefersReducedMotion = useReducedMotion();
    const effectiveMorph = morph && !prefersReducedMotion && !disabled;
    const spacingValue = typeof spacing === "number" ? `${spacing}px` : spacing;
    const value = useMemo<LiquidGlassEffectGroupContextValue>(
      () => ({
        groupId: props.id ?? autoId,
        spacing,
        morph: effectiveMorph,
        samplingStrategy: disabled ? "isolated" : samplingStrategy,
        performanceLevel,
      }),
      [autoId, disabled, effectiveMorph, performanceLevel, props.id, samplingStrategy, spacing]
    );

    const cssVars = {
      "--liquid-glass-group-spacing": spacingValue,
      "--liquid-glass-group-morph": effectiveMorph ? 1 : 0,
    } as React.CSSProperties;

    return (
      <LiquidGlassEffectGroupContext.Provider value={value}>
        <LiquidGlassLayerProvider
          insideEffectGroup={!disabled}
          performanceLevel={performanceLevel}
        >
          <div
            ref={ref}
            className={cn(
              "liquid-glass-effect-group glass-relative",
              effectiveMorph && "liquid-glass-effect-group-morph",
              className
            )}
            style={{ ...cssVars, ...style }}
            data-liquid-glass-effect-group={!disabled ? "true" : "false"}
            data-sampling-strategy={value.samplingStrategy}
            data-liquid-glass-group-id={value.groupId}
            {...props}
          >
            {children}
          </div>
        </LiquidGlassLayerProvider>
      </LiquidGlassEffectGroupContext.Provider>
    );
  }
);

LiquidGlassEffectGroup.displayName = "LiquidGlassEffectGroup";

export function useLiquidGlassEffectGroup() {
  return useContext(LiquidGlassEffectGroupContext);
}
