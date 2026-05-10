"use client";
/**
 * DimensionalGlass Component
 *
 * A modern glass surface with enhanced depth and dimensional effects.
 * Migrated to use OptimizedGlass architecture.
 */
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Motion, OptimizedGlass } from "../../primitives";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { DimensionalGlassProps } from "./types";

/**
 * DimensionalGlass Component
 * Modern implementation using OptimizedGlass with dimensional effects
 */
export const DimensionalGlass = forwardRef<
  HTMLDivElement,
  DimensionalGlassProps
>(
  (
    {
      children,
      className,
      style,
      elevation = "level2",
      blurStrength = "standard",
      opacity = "medium",
      borderOpacity = "medium",
      borderWidth = 1,
      fullWidth = false,
      fullHeight = false,
      borderRadius = 12,
      interactive = true,
      padding = 16,
      depth = 0.5,
      dynamicShadow = true,
      animate = false,
      zIndex = 1,
      backgroundColor,
      maxTilt = 5,
      hoverScale = 1.02,
      animationConfig,
      disableAnimation,
      motionSensitivity,
      material = "glass",
      materialProps,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animate && !disableAnimation && !prefersReducedMotion;

    // Map blur strength to intensity
    const intensityMap = {
      none: "subtle" as const,
      light: "subtle" as const,
      standard: "medium" as const,
      heavy: "strong" as const,
    };

    // Map elevation to OptimizedGlass elevation levels
    const getElevationLevel = (elev: any) => {
      if (typeof elev === "string" && elev.startsWith("level")) {
        return elev as "level1" | "level2" | "level3" | "level4";
      }
      // Map numeric elevation to level
      const numElev = typeof elev === "number" ? elev : 2;
      if (numElev <= 1) return "level1";
      if (numElev <= 2) return "level2";
      if (numElev <= 3) return "level3";
      return "level4";
    };

    // Calculate depth transform
    const depthTransform = depth > 0 ? `translateZ(${depth * 10}px)` : "";

    return (
      <Motion
        preset={shouldAnimate ? "fadeIn" : "none"}
        className={cn(
          "transform-gpu",
          shouldAnimate && "animate-pulse-subtle",
          className
        )}
      >
        {material === "liquid" ? (
          <LiquidGlassMaterial
            ref={ref}
            ior={materialProps?.ior || 1.52}
            thickness={materialProps?.thickness || depth * 20 + 8}
            tint={
              materialProps?.tint || {
                r: 0,
                g: 0,
                b: 0,
                a: depth * 0.05 + 0.03,
              }
            }
            variant={
              materialProps?.variant === "clear"
                ? ("clear" as const)
                : materialProps?.variant === "regular"
                  ? ("regular" as const)
                  : ("regular" as const)
            }
            quality={materialProps?.quality || "ultra"}
            environmentAdaptation
            motionResponsive
            interactive={interactive}
            className={cn(
              // Base styles
              "relative overflow-hidden transition-all duration-300",
              "liquid-glass-dimensional-surface",

              // Dimensions
              fullWidth && "w-full",
              fullHeight && "h-full",

              // Interactive states
              interactive && [
                "hover:scale-[var(--hover-scale)] active:scale-95",
                "cursor-pointer",
              ],

              // Animation states
              shouldAnimate && "animate-dimensional-float",

              className
            )}
            style={{
              ...(style || {}),
              ...({
                "--hover-scale": hoverScale.toString(),
                "--liquid-glass-dimensional-depth": depth.toString(),
                "--liquid-glass-tilt-max": `${maxTilt}deg`,
              } as React.CSSProperties),
              transform: depthTransform,
              zIndex,
              padding: typeof padding === "number" ? `${padding}px` : padding,
              borderRadius:
                typeof borderRadius === "number"
                  ? `${borderRadius}px`
                  : borderRadius,
            }}
            data-liquid-glass-dimensional="true"
            data-dimensional-depth={depth}
            data-dimensional-elevation={elevation}
            {...Object.fromEntries(
              Object.entries(rest).filter(([key]) => key !== "variant")
            )}
          >
            {children}
          </LiquidGlassMaterial>
        ) : (
          <OptimizedGlass
            ref={ref}
            intent="neutral"
            elevation={getElevationLevel(elevation)}
            intensity={intensityMap[blurStrength]}
            depth={Math.round(depth * 4)} // Convert to 0-4 range
            tint="neutral"
            border={borderOpacity === "none" ? "none" : "subtle"}
            animation={shouldAnimate ? "float" : "none"}
            performanceMode="medium"
            liftOnHover={interactive}
            press={interactive}
            className={cn(
              // Base styles
              "relative overflow-hidden transition-all duration-300",

              // Dimensional effects
              "transform-style-preserve-3d",
              depthTransform && "[transform:" + depthTransform + "]",

              // Size
              fullWidth && "w-full",
              fullHeight && "h-full",

              // Spacing
              typeof padding === "number"
                ? `p-${Math.round(padding / 4)}`
                : "glass-p-4",

              // Border radius
              typeof borderRadius === "number"
                ? borderRadius <= 4
                  ? "glass-radius-md"
                  : borderRadius <= 8
                    ? "glass-radius-lg"
                    : "glass-radius-xl"
                : "glass-radius-xl",

              // Z-index
              zIndex > 1 && `z-${Math.min(zIndex, 50)}`,

              className
            )}
            style={{
              backgroundColor,
              borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
              perspective: interactive ? "1000px" : undefined,
              ...style,
            }}
            {...rest}
          >
            <div
              className={cn(
                "relative h-full w-full",
                interactive &&
                  "transform-gpu transition-transform duration-200",
                depth > 0 && "transform-style-preserve-3d"
              )}
              style={{
                transform: depth > 0 ? `translateZ(${depth * 5}px)` : undefined,
              }}
            >
              {children}
            </div>
          </OptimizedGlass>
        )}
      </Motion>
    );
  }
);

DimensionalGlass.displayName = "DimensionalGlass";

export default DimensionalGlass;
