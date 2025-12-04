'use client';
import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useA11yId } from "@/utils/a11y";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

// Types
export enum OptimizationLevel {
  NONE = "none",
  LIGHT = "light",
  MODERATE = "moderate",
  HEAVY = "heavy",
  MAXIMUM = "heavy",
  AGGRESSIVE = "heavy",
}

export interface OptimizedGlassContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  initialOptimizationLevel?: "none" | "light" | "moderate" | "heavy";
  autoOptimize?: boolean;
  performanceThreshold?: number;
  glassIntensity?: number;
  targetFps?: number;
  checkInterval?: number;
  showIndicator?: boolean;
  preferReducedMotion?: boolean;
  preserveBlur?: boolean;
  onOptimizationChange?: (level: string) => void;
  maxOptimizationLevel?: "none" | "light" | "moderate" | "heavy";
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Accessibility role for semantic meaning
   */
  role?: string;
}

// Performance monitoring hook
const usePerformanceMonitoring = (
  targetFps: number,
  checkInterval: number,
  threshold: number
) => {
  const [currentFps, setCurrentFps] = useState(60);
  const [performanceScore, setPerformanceScore] = useState(1);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrame: number;

    const measureFps = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= checkInterval) {
        const fps =
          (frameCountRef.current * 1000) / (now - lastTimeRef.current);
        setCurrentFps(fps);
        setPerformanceScore(fps / targetFps);

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrame = requestAnimationFrame(measureFps);
    };

    animationFrame = requestAnimationFrame(measureFps);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetFps, checkInterval]);

  return { currentFps, performanceScore };
};

/**
 * OptimizedGlassContainer Component
 * A container that automatically adjusts glass effects based on performance
 */
export const OptimizedGlassContainer = forwardRef<
  HTMLDivElement,
  OptimizedGlassContainerProps
>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      children,
      initialOptimizationLevel = "none",
      autoOptimize = true,
      performanceThreshold = 0.8,
      glassIntensity = 0.6,
      className,
      style,
      targetFps = 60,
      checkInterval = 1000,
      showIndicator = false,
      preferReducedMotion,
      preserveBlur = true,
      onOptimizationChange,
      maxOptimizationLevel = "heavy",
      "aria-label": ariaLabel = "Optimized glass container",
      role = "region",
      ...props
    },
    ref
  ) => {
    const [optimizationLevel, setOptimizationLevel] = useState(
      initialOptimizationLevel
    );
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = preferReducedMotion ?? prefersReducedMotion;
    const containerId = useA11yId();

    // Performance monitoring
    const { currentFps, performanceScore } = usePerformanceMonitoring(
      targetFps,
      checkInterval,
      performanceThreshold
    );

    // Auto optimization logic
    useEffect(() => {
      if (!autoOptimize) return;

      const maxLevelIndex = ["none", "light", "moderate", "heavy"].indexOf(
        maxOptimizationLevel
      );
      let newLevel = optimizationLevel;

      if (performanceScore < performanceThreshold) {
        // Performance is poor, increase optimization
        const currentIndex = ["none", "light", "moderate", "heavy"].indexOf(
          optimizationLevel
        );
        if (currentIndex < maxLevelIndex) {
          newLevel = ["none", "light", "moderate", "heavy"][
            currentIndex + 1
          ] as typeof optimizationLevel;
        }
      } else if (performanceScore > performanceThreshold + 0.1) {
        // Performance is good, reduce optimization
        const currentIndex = ["none", "light", "moderate", "heavy"].indexOf(
          optimizationLevel
        );
        if (currentIndex > 0) {
          newLevel = ["none", "light", "moderate", "heavy"][
            currentIndex - 1
          ] as typeof optimizationLevel;
        }
      }

      if (newLevel !== optimizationLevel) {
        setOptimizationLevel(newLevel);
        onOptimizationChange?.(newLevel);
      }
    }, [
      autoOptimize,
      performanceScore,
      performanceThreshold,
      optimizationLevel,
      maxOptimizationLevel,
      onOptimizationChange,
    ]);

    // Map optimization level to glass properties
    const getGlassProps = () => {
      const baseIntensity = shouldReduceMotion
        ? ("subtle" as const)
        : ("medium" as const);

      switch (optimizationLevel) {
        case "none":
          return {
            intensity: "ultra" as const,
            performanceMode: "ultra" as const,
            animation: shouldReduceMotion
              ? ("none" as const)
              : ("float" as const),
            depth: 4,
          };
        case "light":
          return {
            intensity: "strong" as const,
            performanceMode: "high" as const,
            animation: shouldReduceMotion
              ? ("none" as const)
              : ("gentle" as const),
            depth: 3,
          };
        case "moderate":
          return {
            intensity: baseIntensity,
            performanceMode: "medium" as const,
            animation: "none" as const,
            depth: 2,
          };
        case "heavy":
          return {
            intensity: "subtle" as const,
            performanceMode: "low" as const,
            animation: "none" as const,
            depth: 1,
          };
        default:
          return {
            intensity: baseIntensity,
            performanceMode: "medium" as const,
            animation: shouldReduceMotion
              ? ("none" as const)
              : ("gentle" as const),
            depth: 2,
          };
      }
    };

    const glassProps = getGlassProps();

    // Performance indicator component
    const PerformanceIndicator = () => {
      if (!showIndicator) return null;

      const getIndicatorColor = () => {
        if (performanceScore >= 0.9) return "text-green-400";
        if (performanceScore >= 0.7) return "text-yellow-400";
        return "text-red-400";
      };

      return (
        <div className='glass-absolute glass-top-2 glass-right-2 glass-z-50 glass-surface-dark/50 glass-text-primary glass-p-2 glass-radius-md glass-text-xs glass-font-mono'>
          <div>
            FPS:{" "}
            <span className={getIndicatorColor()}>
              {Math.round(currentFps)}
            </span>
          </div>
          <div>
            Level: <span className='glass-text-primary'>{optimizationLevel}</span>
          </div>
          <div>
            Score:{" "}
            <span className={getIndicatorColor()}>
              {(performanceScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={containerId}
        intent="neutral"
        elevation="level2"
        intensity={glassProps.intensity}
        depth={glassProps.depth}
        tint="neutral"
        border="subtle"
        animation={glassProps.animation}
        performanceMode={glassProps.performanceMode}
        role={role}
        aria-label={ariaLabel}
        aria-live={showIndicator ? "polite" : undefined}
        aria-atomic={showIndicator ? "true" : undefined}
        className={cn(
          "relative",
          // Apply different styling based on optimization level
          {
            "glass-backdrop-blur-xl":
              optimizationLevel === "none" && preserveBlur,
            "glass-backdrop-blur-lg":
              optimizationLevel === "light" && preserveBlur,
            "glass-backdrop-blur-md":
              optimizationLevel === "moderate" && preserveBlur,
            "glass-backdrop-blur-sm":
              optimizationLevel === "heavy" && preserveBlur,
          },
          className
        )}
        style={
          {
            // Adjust opacity based on glass intensity and optimization level
            "--glass-opacity":
              glassIntensity * (optimizationLevel === "heavy" ? 0.5 : 1),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <PerformanceIndicator />
        {children}
      </OptimizedGlass>
    );
  }
);

OptimizedGlassContainer.displayName = "OptimizedGlassContainer";

export default OptimizedGlassContainer;