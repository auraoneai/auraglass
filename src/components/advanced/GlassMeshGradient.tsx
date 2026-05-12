"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION, COLORS } from "../../tokens/designConstants";
/**
 * AuraGlass Ambient Mesh Gradients
 * Animated mesh gradients with glass overlay effects
 */

import React, { useRef, useEffect, useMemo, forwardRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";

interface MeshPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

interface GlassMeshGradientProps {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  points?: number;
  speed?: number;
  blur?: number;
  opacity?: number;
  animate?: boolean;
  interactive?: boolean;
  complexity?: "simple" | "moderate" | "complex";
  variant?: "ambient" | "vibrant" | "subtle" | "dark";
  respectMotionPreference?: boolean;
  compact?: boolean;
  contained?: boolean;
  preview?: boolean;
  height?: number | string;
  maxHeight?: number | string;
  "aria-label"?: string;
}

const toCanvasRgba = (color: string, alpha: number) => {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((part) => part + part)
            .join("")
        : hex;
    const value = parseInt(fullHex.slice(0, 6), 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }

  return `rgba(14, 165, 233, ${alpha})`;
};

export function GlassMeshGradient({
  className,
  colors = [
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.primary,
    COLORS.semantic.warning,
  ],
  points = 4,
  speed = 0.5,
  blur = 100,
  opacity = 0.8,
  animate = true,
  interactive = false,
  complexity = "moderate",
  variant = "ambient",
  respectMotionPreference = true,
  compact = false,
  contained = false,
  preview = false,
  height,
  maxHeight,
  style,
  "aria-label": ariaLabel,
}: GlassMeshGradientProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate =
    animate && (respectMotionPreference ? !prefersReducedMotion : true);
  const isBounded = compact || contained || preview;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  const resolvedMaxHeight =
    typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshPoints = useRef<MeshPoint[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  // Initialize mesh points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const numPoints =
      complexity === "simple"
        ? 3
        : complexity === "moderate"
          ? points
          : points * 2;

    meshPoints.current = Array.from({ length: numPoints }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      color: colors[i % colors.length],
      radius: 100 + Math.random() * 200,
    }));
  }, [colors, points, speed, complexity]);

  // Handle mouse interaction
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop
  useAnimationFrame((time) => {
    if (!shouldAnimate) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    frame.current += 1;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw mesh points
    meshPoints.current.forEach((point, i) => {
      // Update position
      if (shouldAnimate) {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // Keep in bounds
        point.x = Math.max(0, Math.min(canvas.width, point.x));
        point.y = Math.max(0, Math.min(canvas.height, point.y));

        // Interactive mouse repulsion
        if (interactive) {
          const dx = mousePos.current.x - point.x;
          const dy = mousePos.current.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            point.vx -= (dx / dist) * force * 0.5;
            point.vy -= (dy / dist) * force * 0.5;
          }
        }

        // Add sinusoidal movement for organic feel
        point.x += Math.sin(frame.current * 0.01 + i) * 0.3;
        point.y += Math.cos(frame.current * 0.01 + i) * 0.3;
      }

      // Create gradient
      const gradient = ctx.createRadialGradient(
        point.x,
        point.y,
        0,
        point.x,
        point.y,
        point.radius
      );

      const color = point.color;
      gradient.addColorStop(0, toCanvasRgba(color, opacity));
      gradient.addColorStop(0.5, toCanvasRgba(color, opacity * 0.5));
      gradient.addColorStop(1, toCanvasRgba(color, 0));

      // Draw gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Apply additional effects based on variant
    if (variant === "vibrant") {
      ctx.globalCompositeOperation = "screen";
    } else if (variant === "dark") {
      ctx.globalCompositeOperation = "multiply";
    } else if (variant === "subtle") {
      ctx.globalAlpha = 0.5;
    }
  });

  // Generate CSS filter based on variant
  const filterStyle = useMemo(() => {
    switch (variant) {
      case "vibrant":
        return "saturate(1.5) brightness(1.2)";
      case "subtle":
        return "saturate(0.8) brightness(0.9)";
      case "dark":
        return "saturate(1.2) brightness(0.7) contrast(1.2)";
      default:
        return "saturate(1) brightness(1)";
    }
  }, [variant]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width: "100%",
        minHeight: resolvedHeight ?? (isBounded ? 220 : undefined),
        maxHeight: resolvedMaxHeight ?? (isBounded ? 240 : undefined),
        ...(style ?? {}),
      }}
      aria-label={ariaLabel}
    >
      <canvas
        ref={canvasRef}
        className="glass-absolute glass-inset-0 glass-w-full glass-h-full"
        style={{
          filter: `blur(${blur}px) ${filterStyle}`,
          opacity,
        }}
      />
      {shouldAnimate ? (
        <>
          <div
            aria-hidden="true"
            className="ag-glass-mesh-gradient-motion-layer"
            style={{
              position: "absolute",
              inset: "-30%",
              filter: `blur(${Math.max(12, Math.round(blur * 0.28))}px)`,
              opacity: Math.min(0.78, Math.max(0.38, opacity * 0.68)),
              mixBlendMode: variant === "dark" ? "screen" : "plus-lighter",
              pointerEvents: "none",
              animation:
                "ag-glass-mesh-gradient-motion 2.8s ease-in-out infinite alternate",
            }}
          />
          <style>{`
            .ag-glass-mesh-gradient-motion-layer {
              background:
                radial-gradient(circle at 22% 32%, rgba(124,211,255,0.72), transparent 28%),
                radial-gradient(circle at 78% 42%, rgba(216,111,255,0.64), transparent 32%),
                radial-gradient(circle at 48% 76%, rgba(99,255,218,0.48), transparent 30%);
            }
            @keyframes ag-glass-mesh-gradient-motion {
              0% {
                transform: translate3d(-8%, -4%, 0) rotate(-7deg) scale(0.96);
                opacity: ${Math.min(0.72, Math.max(0.34, opacity * 0.56))};
              }
              50% {
                transform: translate3d(7%, 5%, 0) rotate(8deg) scale(1.06);
                opacity: ${Math.min(0.9, Math.max(0.48, opacity * 0.82))};
              }
              100% {
                transform: translate3d(2%, -7%, 0) rotate(-2deg) scale(1);
                opacity: ${Math.min(0.8, Math.max(0.42, opacity * 0.68))};
              }
            }
          `}</style>
        </>
      ) : null}
    </div>
  );
}

// Animated mesh gradient background component
export const GlassMeshBackground = forwardRef<
  HTMLDivElement,
  GlassMeshGradientProps & { children?: React.ReactNode }
>(function GlassMeshBackground(
  { children, className, "aria-label": ariaLabel, ...meshProps },
  ref
) {
  const backgroundId = useA11yId("mesh-background");

  return (
    <OptimizedGlass
      ref={ref}
      intensity="subtle"
      blur="medium"
      className={cn("relative", className)}
      id={backgroundId}
      role="presentation"
      aria-label={ariaLabel || "Mesh gradient background"}
      aria-hidden="true"
    >
      <GlassMeshGradient
        className="glass-absolute glass-inset-0"
        {...meshProps}
      />
      <div className="glass-relative glass-z-10">
        <ContrastGuard>{children}</ContrastGuard>
      </div>
    </OptimizedGlass>
  );
});

// Preset configurations
export const meshGradientPresets = {
  ocean: {
    colors: [
      COLORS.semantic.primary,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
    ],
    variant: "ambient" as const,
    speed: 0.3,
    blur: 120,
  },
  sunset: {
    colors: [
      COLORS.semantic.warning,
      COLORS.semantic.warning,
      COLORS.semantic.primary,
      COLORS.semantic.error,
    ],
    variant: "vibrant" as const,
    speed: 0.4,
    blur: 100,
  },
  aurora: {
    colors: [
      COLORS.semantic.success,
      COLORS.semantic.success,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
    ],
    variant: "ambient" as const,
    speed: 0.2,
    blur: 150,
    points: 5,
  },
  galaxy: {
    colors: [
      COLORS.semantic.primary,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
      COLORS.semantic.primary,
    ],
    variant: "dark" as const,
    speed: 0.15,
    blur: 200,
    complexity: "complex" as const,
  },
  minimal: {
    colors: [
      "var(--glass-gray-200)",
      "var(--glass-gray-300)",
      "var(--glass-gray-400)",
    ],
    variant: "subtle" as const,
    speed: 0.1,
    blur: 150,
    complexity: "simple" as const,
  },
};

// Hook for dynamic color generation
export function useMeshGradientColors(
  baseColor: string,
  scheme: "analogous" | "complementary" | "triadic" = "analogous"
): string[] {
  return useMemo(() => {
    // Parse base color (simplified - would need proper color parsing)
    const colors: string[] = [baseColor];

    // Generate color scheme (simplified logic)
    switch (scheme) {
      case "analogous":
        colors.push(
          adjustHue(baseColor, 30),
          adjustHue(baseColor, -30),
          adjustHue(baseColor, 60)
        );
        break;
      case "complementary":
        colors.push(
          adjustHue(baseColor, 180),
          adjustHue(baseColor, 150),
          adjustHue(baseColor, 210)
        );
        break;
      case "triadic":
        colors.push(adjustHue(baseColor, 120), adjustHue(baseColor, 240));
        break;
    }

    return colors;
  }, [baseColor, scheme]);
}

// Helper function for hue adjustment (simplified)
function adjustHue(color: string, degrees: number): string {
  // This would need proper HSL conversion
  // For now, return variations
  return color + degrees.toString(16).slice(-2);
}
