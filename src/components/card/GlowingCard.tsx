"use client";
/**
 * Glowing Card Component
 * A glassmorphic card with animated glowing edges and hover effects
 */

import React, { CSSProperties, forwardRef, ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

/**
 * Glowing Card Props
 */
export interface GlowingCardProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  "data-testid"?: string;
  glowColor?: string;
  glowIntensity?: number; // 0-1
  animationDuration?: number; // milliseconds
  variant?: "default" | "neon" | "subtle" | "rainbow";
  onClick?: () => void;
  interactive?: boolean;
  disabled?: boolean;
  "aria-label"?: string; // Add aria-label to props
}

/**
 * Glowing Card Component
 */
export const GlowingCard = forwardRef<HTMLDivElement, GlowingCardProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      children,
      className = "",
      style = {},
      glowColor = "#00d4ff",
      glowIntensity = 0.8,
      animationDuration = 3000,
      variant = "default",
      onClick,
      interactive = true,
      disabled = false,
      "data-testid": dataTestId,
      "aria-label": ariaLabel, // Destructure aria-label
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    /**
     * Get glow styles based on variant
     */
    const getGlowStyles = (): CSSProperties => {
      const baseGlow = {
        "--glow-color": glowColor,
        "--glow-intensity": glowIntensity,
        "--animation-duration": `${animationDuration}ms`,
      } as CSSProperties;

      switch (variant) {
        case "neon":
          return {
            ...baseGlow,
            "--glow-color": glowColor,
            "--glow-spread": "8px",
            "--glow-blur": "20px",
          } as CSSProperties;

        case "subtle":
          return {
            ...baseGlow,
            "--glow-spread": "2px",
            "--glow-blur": "10px",
            "--glow-intensity": glowIntensity * 0.5,
          } as CSSProperties;

        case "rainbow":
          return {
            ...baseGlow,
            "--glow-color-1": "#ff006e",
            "--glow-color-2": "#00d4ff",
            "--glow-color-3": "#00ff88",
            "--glow-spread": "4px",
            "--glow-blur": "16px",
          } as CSSProperties;

        default:
          return {
            ...baseGlow,
            "--glow-spread": "4px",
            "--glow-blur": "16px",
          } as CSSProperties;
      }
    };

    /**
     * Get animation classes
     */
    const getAnimationClass = (): string => {
      if (prefersReducedMotion || disabled) {
        return "";
      }

      return "glowing-card-animated";
    };

    const containerStyles: CSSProperties = {
      ...getGlowStyles(),
      ...style,
      position: "relative",
      overflow: "hidden",
      cursor: interactive && !disabled ? "pointer" : "default",
      transition: prefersReducedMotion
        ? "none"
        : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? "none" : "auto",
    };

    return (
      <div
        ref={ref}
        data-testid={dataTestId || "glowingcard"}
        className={`glowing-card ${variant} ${getAnimationClass()} ${className}`}
        style={{ ...containerStyles }}
        onClick={!disabled ? onClick : undefined}
        role={onClick ? "button" : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onKeyDown={
          onClick && !disabled
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        aria-label={ariaLabel} // Pass aria-label here
      >
        {/* Glow Layer */}
        {!prefersReducedMotion && (
          <div className="glowing-card-glow" aria-hidden="true" />
        )}

        {/* Content */}
        <GlassCard
          className="glowing-card-content"
          style={{ ...{ position: "relative", zIndex: 1 } }}
        >
          {children}
        </GlassCard>

        <style>{`
          .glowing-card {
            border-radius: 12px;
          }

          .glowing-card-glow {
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: linear-gradient(
              90deg,
              var(--glow-color, #00d4ff),
              var(--glow-color, #00d4ff)
            );
            opacity: var(--glow-intensity, 0.8);
            filter: blur(var(--glow-blur, 16px));
            z-index: 0;
            pointer-events: none;
          }

          .glowing-card.rainbow .glowing-card-glow {
            background: linear-gradient(
              90deg,
              var(--glow-color-1, #ff006e),
              var(--glow-color-2, #00d4ff),
              var(--glow-color-3, #00ff88),
              var(--glow-color-1, #ff006e)
            );
            background-size: 200% 100%;
          }

          .glowing-card-animated .glowing-card-glow {
            animation: glowPulse var(--animation-duration, 3000ms) ease-in-out
              infinite;
          }

          .glowing-card-animated.rainbow .glowing-card-glow {
            animation: glowPulse var(--animation-duration, 3000ms) ease-in-out
                infinite,
              rainbowShift calc(var(--animation-duration, 3000ms) * 2) linear
                infinite;
          }

          .glowing-card.neon .glowing-card-glow {
            box-shadow: 0 0 var(--glow-spread, 8px) var(--glow-blur, 20px)
              var(--glow-color, #00d4ff);
          }

          .glowing-card:hover .glowing-card-glow {
            opacity: calc(var(--glow-intensity, 0.8) * 1.3);
            filter: blur(calc(var(--glow-blur, 16px) * 1.2));
          }

          .glowing-card-content {
            position: relative;
            width: 100%;
            height: 100%;
            background: inherit;
          }

          @keyframes glowPulse {
            0%,
            100% {
              opacity: var(--glow-intensity, 0.8);
            }
            50% {
              opacity: calc(var(--glow-intensity, 0.8) * 1.5);
            }
          }

          @keyframes rainbowShift {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .glowing-card-glow {
              animation: none !important;
            }
            .glowing-card {
              transition: none !important;
            }
          }
        `}</style>
      </div>
    );
  }
);

GlowingCard.displayName = "GlowingCard";
