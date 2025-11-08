'use client';
import { cn } from "@/lib/utils";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useAccessibleAnimation } from "../../hooks/useAccessibilitySettings";
import { OptimizedGlass } from "../../primitives";
import { GlassComponentErrorBoundary } from "../../utils/errorBoundary";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassSkeletonLoaderProps {
  /** Whether the loader is active */
  loading?: boolean;
  /** Custom loading text */
  text?: string;
  /** Size of the loader */
  size?: "sm" | "md" | "lg" | "xl";
  /** Animation variant */
  variant?: "pulse" | "wave" | "shimmer" | "sheen";
  /** Custom className */
  className?: string;
  /** Children to show when not loading */
  children?: React.ReactNode;
}

/** Animation keyframes for different variants */
const pulseKeyframes = `
  @keyframes glass-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.02);
    }
  }
`;

const waveKeyframes = `
  @keyframes glass-wave {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const shimmerKeyframes = `
  @keyframes glass-shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

const sheenKeyframes = `
  @keyframes glass-sheen-move {
    0% { transform: translateX(-150%) rotate(15deg); }
    100% { transform: translateX(150%) rotate(15deg); }
  }
  @keyframes glass-depth-pulse {
    0%, 100% { box-shadow: var(--glass-elev-2); }
    50% { box-shadow: var(--glass-elev-2); }
  }
`;

export const GlassSkeletonLoader: React.FC<GlassSkeletonLoaderProps> = memo(
  ({
    // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

    loading = true,
    text = "Loading...",
    size = "md",
    variant = "pulse",
    className = "",
    children,
  }) => {
    const [mounted, setMounted] = useState(false);
    const { shouldAnimate, animationDuration } = useAccessibleAnimation();

    useEffect(() => {
      setMounted(true);
    }, []);

    const renderContent = useCallback(() => {
      if (!loading && mounted) {
        return <>{children}</>;
      }

      const sizeClasses = {
        sm: "glass-w-6 glass-h-6",
        md: "glass-w-8 glass-h-8",
        lg: "glass-w-12 glass-h-12",
        xl: "glass-w-16 glass-h-16",
      };

      const getAnimationStyle = (): React.CSSProperties => {
        if (!shouldAnimate) return {};

        switch (variant) {
          case "wave":
            return {
              position: "relative" as const,
              overflow: "hidden",
              background:
                '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              backgroundSize: "200px 100%",
              animation: `glass-wave ${animationDuration * 5}ms infinite`,
            };
          case "shimmer":
            return {
              position: "relative" as const,
              overflow: "hidden",
              background:
                '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              backgroundSize: "200px 100%",
              animation: `glass-shimmer ${animationDuration * 7}ms infinite, glass-depth-pulse ${animationDuration * 14}ms ease-in-out infinite`,
            };
          case "sheen":
            return {
              position: "relative" as const,
              overflow: "hidden",
              background:
                '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              // sheen drawn by a before-like overlay via extra element below
            };
          case "pulse":
          default:
            return {
              animation: `glass-pulse ${animationDuration * 7}ms ease-in-out infinite`,
            };
        }
      };

      return (
        <div
          data-glass-component
          className={cn(
            "glass-flex glass-flex-col glass-items-center glass-justify-center glass-gap-4",
            className
          )}
        >
          <div style={{ position: "relative" }}>
            <OptimizedGlass
              className={cn("glass-radius-full", sizeClasses[size])}
              style={getAnimationStyle()}
              intensity="medium"
              elevation="level1"
              interactive={false}
            />
            {shouldAnimate && variant === "sheen" && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "9999px",
                  background:
                    '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
                  filter: "blur(6px) saturate(120%)",
                  transform: "translateX(-150%) rotate(15deg)",
                  animation: `glass-sheen-move ${animationDuration * 6}ms ease-in-out infinite`,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>

          {text && (
            <OptimizedGlass
              className="glass-px-4 glass-py-2 glass-radius-lg"
              intensity="subtle"
              elevation="level1"
            >
              <span
                className={cn(
                  "glass-text-sm glass-text-primary-70 glass-font-medium"
                )}
              >
                {text}
              </span>
            </OptimizedGlass>
          )}
        </div>
      );
    }, [
      loading,
      mounted,
      children,
      size,
      variant,
      className,
      text,
      shouldAnimate,
      animationDuration,
    ]);

    return (
      <GlassComponentErrorBoundary componentName="GlassSkeletonLoader">
        <>
          <style>
            {pulseKeyframes}
            {waveKeyframes}
            {shimmerKeyframes}
            {sheenKeyframes}
          </style>
          {renderContent()}
        </>
      </GlassComponentErrorBoundary>
    );
  }
);

// Compound component for skeleton text
interface GlassSkeletonTextProps {
  lines?: number;
  width?: string | string[];
  className?: string;
}

export const GlassSkeletonText: React.FC<GlassSkeletonTextProps> = ({
  lines = 1,
  width = "100%",
  className = "",
}) => {
  const { shouldAnimate } = useAccessibleAnimation();
  const widths = Array.isArray(width) ? width : [width];

  const getAnimationStyle = (): React.CSSProperties => {
    return {
      animation: "glass-pulse 2s ease-in-out infinite",
    };
  };

  return (
    <div className={cn("glass-gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <OptimizedGlass
          key={i}
          className={cn("glass-h-4 glass-radius-md")}
          style={{
            width: widths[i % widths.length],
            animation: "glass-pulse 2s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
          intensity="subtle"
          elevation="level1"
          interactive={false}
        />
      ))}
    </div>
  );
};

// Compound component for skeleton card
export const GlassSkeletonCard: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <OptimizedGlass
      className={cn("glass-p-6 glass-gap-4", className)}
      intensity="medium"
      elevation="level1"
    >
      <GlassSkeletonText lines={1} width="60%" />
      <GlassSkeletonText lines={2} width={["100%", "80%"]} />
      <div className={cn("glass-flex glass-gap-2")}>
        <OptimizedGlass
          className={cn("glass-h-8 glass-w-16 glass-radius-md")}
          style={{ animation: "glass-pulse 2s ease-in-out infinite" }}
          intensity="subtle"
          elevation="level1"
        />
        <OptimizedGlass
          className={cn("glass-h-8 glass-w-16 glass-radius-md")}
          style={{
            animation: "glass-pulse 2s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
          intensity="subtle"
          elevation="level1"
        />
      </div>
    </OptimizedGlass>
  );
};