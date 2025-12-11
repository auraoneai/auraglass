"use client";
/**
 * FrostedGlass Component
 *
 * A modern glass surface with frosted ice effects.
 * Migrated to use OptimizedGlass architecture.
 */
import React, { forwardRef, useRef, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useGlassParallax } from "../../hooks/useGlassParallax";
import { FrostedGlassProps } from "./types";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

/**
 * FrostedGlass Component
 * Modern implementation using OptimizedGlass with frost effects
 */
export const FrostedGlass = forwardRef<HTMLDivElement, FrostedGlassProps>(
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
      borderRadius = "md",
      interactive = true,
      padding = 16,
      intensity = 0.5,
      frostColor = "color-mix(in srgb, var(--glass-white) var(--glass-opacity-80), transparent)",
      animate = true,
      pattern = "noise",
      backgroundColor,
      specular = true,
      glow = false,
      lightAngle = 135,
      parallax = false,
      parallaxStrength = 10,
      ...rest
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animate && !prefersReducedMotion;
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle parallax when enabled
    useGlassParallax(containerRef, {
      strength: parallaxStrength,
      enabled: parallax && !prefersReducedMotion,
    });

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

    // Generate frost pattern styles
    const getFrostPattern = () => {
      switch (pattern) {
        case "lines":
          return {
            backgroundImage: `
              linear-gradient(90deg, ${frostColor} 1px, transparent 1px),
              linear-gradient(${frostColor} 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          };
        case "crystals":
          return {
            backgroundImage: `
              radial-gradient(${frostColor} 5%, transparent 5%), 
              radial-gradient(${frostColor} 5%, transparent 5%)
            `,
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0, 15px 15px",
          };
        case "noise":
        default:
          return {
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          };
      }
    };

    // Handle mouse events
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Merge refs
    const setRefs = (node: HTMLDivElement | null) => {
      (containerRef as any).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const frostPatternStyles = getFrostPattern();
    const glowColor =
      typeof glow === "string" ? glow : glow === true ? "primary" : false;

    return (
      <Motion
        preset={shouldAnimate ? "fadeIn" : "none"}
        className="glass-relative glass-isolate"
      >
        <OptimizedGlass
          ref={setRefs}
          intent="neutral"
          elevation={getElevationLevel(elevation)}
          intensity={intensityMap[blurStrength]}
          depth={2}
          tint="cool"
          border={borderOpacity === "none" ? "none" : "subtle"}
          animation={shouldAnimate ? "breathe" : "none"}
          performanceMode="high"
          liftOnHover={interactive}
          press={interactive}
          className={cn(
            // Base styles
            "relative block box-border overflow-hidden isolate",
            `transition-all`,
            `duration-[${ANIMATION.DURATION.normal}ms]`,

            // Size
            fullWidth && "w-full",
            fullHeight && "h-full",
            !fullWidth && !fullHeight && "w-auto h-auto",

            // Border radius
            typeof borderRadius === "string"
              ? radiusMap[borderRadius]
              : `rounded-[${borderRadius}px]`,

            // Padding
            typeof padding === "number"
              ? `p-${Math.round(padding / 4)}`
              : "glass-p-4",

            // Interactive styles
            interactive && [
              "cursor-pointer",
              "glass-hover--translate-y-0-5",
              "active:translate-y-0",
            ],

            // Glow effect
            glowColor &&
              {
                primary:
                  "drop-shadow-[0_0_18px_var(--glass-color-primary,0.28)]",
                success:
                  "drop-shadow-[0_0_18px_var(--glass-color-success,0.28)]",
                warning:
                  "drop-shadow-[0_0_18px_var(--glass-color-warning,0.28)]",
                danger: "drop-shadow-[0_0_18px_var(--glass-color-danger,0.28)]",
                info: "drop-shadow-[0_0_18px_color-mix(in_srgb,var(--glass-color-info)_28%,transparent)]",
              }[glowColor],

            className
          )}
          style={{
            backgroundColor,
            borderWidth: borderWidth > 0 ? `${borderWidth}px` : undefined,
            ...(style || {}),
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...rest}
        >
          {/* Frost pattern overlay */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              shouldAnimate && "animate-frost-grow"
            )}
            style={{
              ...frostPatternStyles,
              // Reduce overlay strength to avoid washing out label text
              opacity: 0.18 + intensity * 0.22,
              // Use soft-light for gentler interaction with backdrop
              mixBlendMode: "soft-light",
            }}
          />

          {/* Frost sparkles */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              shouldAnimate && "animate-frost-sparkle"
            )}
            style={{
              backgroundImage: `radial-gradient(${frostColor} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              // Tone down sparkle overlay for readability
              opacity: Math.min(0.22, intensity * 0.25),
            }}
          />

          {/* Specular highlight and edge frost */}
          <div
            className="glass-absolute glass-inset-0 glass-pointer-events-none glass-radius-inherit"
            style={{
              // Edge frost (less aggressive)
              boxShadow: `inset 0 0 ${4 + intensity * 9}px ${frostColor}`,
              opacity: isHovered
                ? 0.24 + intensity * 0.25
                : 0.18 + intensity * 0.2,
              // Specular highlight (dimmed)
              background: specular
                ? `
                radial-gradient(${intensity * 70 + 40}% ${intensity * 35 + 40}% at 50% -10%, color-mix(in srgb, var(--glass-white) ${Math.min(25, (0.1 + intensity * 0.22) * 100)}%, transparent) 0%, color-mix(in srgb, var(--glass-white) 0%, transparent) 60%),
                linear-gradient(${lightAngle}deg, color-mix(in srgb, var(--glass-white) 12%, transparent), color-mix(in srgb, var(--glass-white) 0%, transparent) 35%)
              `
                : undefined,
              // Softer blending to preserve label contrast
              mixBlendMode: specular ? "overlay" : "normal",
              transform: parallax
                ? "translate(var(--glass-parallax-x), var(--glass-parallax-y))"
                : undefined,
              transition: `transform ${ANIMATION.DURATION.fast}ms ${ANIMATION.EASING.easeOut}, opacity ${ANIMATION.DURATION.normal}ms ${ANIMATION.EASING.ease}`,
            }}
          />

          {/* Content */}
          <div className="glass-relative glass-z-10">{children}</div>
        </OptimizedGlass>
      </Motion>
    );
  }
);

FrostedGlass.displayName = "FrostedGlass";

export default FrostedGlass;
