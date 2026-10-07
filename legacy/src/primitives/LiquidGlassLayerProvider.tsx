"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type LiquidGlassPerformanceLevel = "ultra" | "high" | "balanced" | "efficient";
export type LiquidGlassVariant = "regular" | "clear";

export interface LiquidGlassLayerContextValue {
  depth: number;
  insideGlass: boolean;
  insideEffectGroup: boolean;
  variant: LiquidGlassVariant;
  performanceLevel: LiquidGlassPerformanceLevel;
  prefersReducedMotion: boolean;
  allowNestedGlass: boolean;
  contrastPolicy: "AA" | "AAA" | "auto";
}

const LiquidGlassLayerContext = createContext<LiquidGlassLayerContextValue>({
  depth: 0,
  insideGlass: false,
  insideEffectGroup: false,
  variant: "regular",
  performanceLevel: "high",
  prefersReducedMotion: false,
  allowNestedGlass: false,
  contrastPolicy: "auto",
});

export interface LiquidGlassLayerProviderProps {
  children: React.ReactNode;
  variant?: LiquidGlassVariant;
  performanceLevel?: LiquidGlassPerformanceLevel;
  allowNestedGlass?: boolean;
  contrastPolicy?: "AA" | "AAA" | "auto";
  insideEffectGroup?: boolean;
}

export function LiquidGlassLayerProvider({
  children,
  variant,
  performanceLevel,
  allowNestedGlass,
  contrastPolicy,
  insideEffectGroup,
}: LiquidGlassLayerProviderProps) {
  const parent = useContext(LiquidGlassLayerContext);
  const prefersReducedMotion = useReducedMotion();

  const value = useMemo<LiquidGlassLayerContextValue>(
    () => ({
      depth: parent.depth,
      insideGlass: parent.insideGlass,
      insideEffectGroup: insideEffectGroup ?? parent.insideEffectGroup,
      variant: variant ?? parent.variant,
      performanceLevel: performanceLevel ?? parent.performanceLevel,
      prefersReducedMotion,
      allowNestedGlass: allowNestedGlass ?? parent.allowNestedGlass,
      contrastPolicy: contrastPolicy ?? parent.contrastPolicy,
    }),
    [
      allowNestedGlass,
      contrastPolicy,
      insideEffectGroup,
      parent,
      performanceLevel,
      prefersReducedMotion,
      variant,
    ]
  );

  return (
    <LiquidGlassLayerContext.Provider value={value}>
      {children}
    </LiquidGlassLayerContext.Provider>
  );
}

export function LiquidGlassSurfaceLayer({
  children,
  variant,
  performanceLevel,
  allowNestedGlass,
}: {
  children: React.ReactNode;
  variant?: LiquidGlassVariant;
  performanceLevel?: LiquidGlassPerformanceLevel;
  allowNestedGlass?: boolean;
}) {
  const parent = useContext(LiquidGlassLayerContext);
  const prefersReducedMotion = useReducedMotion();

  const value = useMemo<LiquidGlassLayerContextValue>(
    () => ({
      ...parent,
      depth: parent.depth + 1,
      insideGlass: true,
      variant: variant ?? parent.variant,
      performanceLevel: performanceLevel ?? parent.performanceLevel,
      prefersReducedMotion,
      allowNestedGlass: allowNestedGlass ?? parent.allowNestedGlass,
    }),
    [allowNestedGlass, parent, performanceLevel, prefersReducedMotion, variant]
  );

  return (
    <LiquidGlassLayerContext.Provider value={value}>
      {children}
    </LiquidGlassLayerContext.Provider>
  );
}

export function useLiquidGlassLayer() {
  return useContext(LiquidGlassLayerContext);
}

export { LiquidGlassLayerContext };
