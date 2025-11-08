/**
 * HeatGlass Component
 *
 * A modern glass surface with heat distortion effects.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HeatGlassProps } from "./types";

// SVG filters for heat distortion effect
const HeatDistortionFilters = React.memo(() => (
  <svg width="0" height="0" className="absolute invisible">
    <defs>
      <filter id="heat-distortion-0">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          seed="0"
        />
        <feDisplacementMap in="SourceGraphic" scale="5" />
      </filter>
      <filter id="heat-distortion-25">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          seed="1"
        />
        <feDisplacementMap in="SourceGraphic" scale="5" />
      </filter>
      <filter id="heat-distortion-50">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          seed="2"
        />
        <feDisplacementMap in="SourceGraphic" scale="5" />
      </filter>
      <filter id="heat-distortion-75">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          seed="3"
        />
        <feDisplacementMap in="SourceGraphic" scale="5" />
      </filter>
    </defs>
  </svg>
));

HeatDistortionFilters.displayName = "HeatDistortionFilters";

/**
 * HeatGlass Component
 * Modern implementation using OptimizedGlass with heat distortion effects
 */
export const HeatGlass = forwardRef<HTMLDivElement, HeatGlassProps>(
  (
    {
      children,
      className,
      style,
      elevation = "level2",
      blurStrength = "standard",
      borderRadius = "md",
      interactive = true,
      heatColor = "rgba(255, 100, 50, 0.7)",
      animate = true,
      backgroundColor,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animate && !prefersReducedMotion;
    const [isHovered, setIsHovered] = useState(false);

    // Map blur strength to intensity
    const intensityMap = {
      none: "subtle" as const,
      light: "subtle" as const,
      standard: "medium" as const,
      heavy: "strong" as const,
    };

    // Map border radius
    const radiusMap = {
      none: "rounded-none",
      sm: "glass-radius-sm",
      md: "glass-radius-md",
      lg: "glass-radius-lg",
      xl: "glass-radius-xl",
      full: "glass-radius-full",
    };

    // Map elevation to OptimizedGlass elevation levels
    const getElevationLevel = (elev: any) => {
      if (typeof elev === "string" && elev.startsWith("level")) {
        return elev as "level1" | "level2" | "level3" | "level4";
      }
      const numElev = typeof elev === "number" ? elev : 2;
      if (numElev <= 1) return "level1";
      if (numElev <= 2) return "level2";
      if (numElev <= 3) return "level3";
      return "level4";
    };

    // Handle mouse events
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
      <>
        {/* SVG Filters for heat distortion */}
        {shouldAnimate && <HeatDistortionFilters />}

        <Motion
          preset={shouldAnimate ? "pulseIn" : "none"}
          className="relative"
        >
          <OptimizedGlass
            ref={ref}
            intent="danger"
            elevation={getElevationLevel(elevation)}
            intensity={intensityMap[blurStrength]}
            depth={3}
            tint="warm"
            border="subtle"
            animation={shouldAnimate ? "pulse" : "none"}
            performanceMode="high"
            liftOnHover={interactive}
            press={interactive}
            className={cn(
              // Base styles
              "relative block w-full min-h-[100px] glass-p-4 box-border overflow-hidden",
              "transition-all duration-300",

              // Border radius
              radiusMap[borderRadius],

              // Heat glow effect
              "shadow-heat-glow",

              // Interactive styles
              interactive && [
                "cursor-pointer",
                "hover:-translate-y-0.5",
                "active:translate-y-0",
              ],

              // Heat pulse animation (respects reduced motion via shouldAnimate)
              shouldAnimate && "glass-animate-heat-pulse",

              className
            )}
            style={
              {
                // Heat glow box shadow
                boxShadow: `0 0 20px 5px ${heatColor}`,
                backgroundColor,
                ...style,
              } as React.CSSProperties
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...rest}
          >
            {/* Heat radial gradient background */}
            <div
              className="absolute inset-0 pointer-events-none glass-radius-inherit -z-10 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${heatColor} 0%, transparent 70%)`,
              }}
            />

            {/* Content with heat distortion */}
            <div
              className={cn(
                "relative z-10",
                shouldAnimate && [
                  "glass-animate-heat-distortion",
                  "will-change-auto", // Use will-change-auto instead of will-change-filter
                ]
              )}
              style={{
                // Apply heat distortion filters
                filter: shouldAnimate ? "url(#heat-distortion-0)" : undefined,
                animationDelay: shouldAnimate
                  ? `${Math.random() * 2}s`
                  : undefined,
              }}
            >
              {children}
            </div>

            {/* Enhanced hover glow */}
            {interactive && isHovered && (
              <div
                className="absolute inset-0 pointer-events-none glass-radius-inherit transition-opacity duration-300"
                style={{
                  boxShadow: `0 0 30px 10px ${heatColor}`,
                  opacity: 0.8,
                }}
              />
            )}
          </OptimizedGlass>
        </Motion>
      </>
    );
  }
);

HeatGlass.displayName = "HeatGlass";

export default HeatGlass;
