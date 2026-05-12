"use client";
import { cn } from "../../lib/utilsComprehensive";

import React, {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassSpotlightProps extends HTMLAttributes<HTMLDivElement> {
  targetRect?: DOMRect | null;
  onClose?: () => void;
  padding?: number;
  /** Keep the spotlight inside a local container instead of using fixed viewport overlay. */
  contained?: boolean;
  /** Alias for contained catalog/documentation previews. */
  preview?: boolean;
  /** Show a package-owned animated local spotlight when no targetRect is provided. */
  demoMotion?: boolean;
  /** Whether to honor reduced-motion settings for the package-owned demo motion. */
  respectMotionPreference?: boolean;
  /** Local preview height. */
  height?: number | string;
  /** Local preview max-height. */
  maxHeight?: number | string;
}

export const GlassSpotlight = forwardRef<HTMLDivElement, GlassSpotlightProps>(
  (
    {
      targetRect,
      onClose,
      className,
      children,
      padding = 8,
      contained = false,
      preview = false,
      demoMotion = false,
      respectMotionPreference = true,
      height,
      maxHeight,
      style,
      ...rest
    },
    ref
  ) => {
    const isContained = contained || preview;
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate =
      demoMotion && (respectMotionPreference ? !prefersReducedMotion : true);
    const [demoPhase, setDemoPhase] = useState(0);
    const resolvedHeight = typeof height === "number" ? `${height}px` : height;
    const resolvedMaxHeight =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    const holeStyle = useMemo((): React.CSSProperties | undefined => {
      if (!targetRect) return undefined;

      return {
        position: "absolute",
        left: targetRect.left - padding,
        top: targetRect.top - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
        borderRadius: 12,
        boxShadow: "0 0 0 9999px var(--glass-text-tertiary-dark)",
        pointerEvents: "none",
      };
    }, [targetRect, padding]);

    const spotlightHoleStyle = holeStyle ? { ...holeStyle } : undefined;

    useEffect(() => {
      if (!shouldAnimate) return undefined;
      let raf = 0;
      const start = performance.now();
      const tick = (now: number) => {
        setDemoPhase((now - start) / 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [shouldAnimate]);

    const demoX = 14 + Math.sin(demoPhase * 1.35) * 60;
    const demoY = 12 + Math.cos(demoPhase * 1.08) * 44;
    const demoScale = 1.04 + Math.sin(demoPhase * 1.5) * 0.16;
    const demoOpacity = 0.76 + Math.sin(demoPhase * 1.24) * 0.22;

    return (
      <div
        ref={ref}
        data-glass-component
        className={cn(
          isContained ? "relative overflow-hidden" : "fixed inset-0",
          className
        )}
        style={{
          ...{
            background: targetRect
              ? "transparent"
              : "linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.85))",
            minHeight: resolvedHeight ?? (isContained ? "202px" : undefined),
            maxHeight: resolvedMaxHeight,
            width: isContained ? "100%" : undefined,
          },
          ...(style ?? {}),
        }}
        onClick={onClose}
        {...rest}
      >
        {!targetRect && demoMotion ? (
          <>
            <div
              aria-hidden="true"
              className="ag-glass-spotlight-demo-orb"
              style={{
                transform: shouldAnimate
                  ? `translate(${demoX}%, ${demoY}%) scale(${demoScale})`
                  : "translate(28%, 22%) scale(1)",
                opacity: shouldAnimate ? demoOpacity : 0.78,
              }}
            />
            <style>{`
              .ag-glass-spotlight-demo-orb {
                position: absolute;
                width: 210px;
                height: 210px;
                border-radius: 999px;
                background: radial-gradient(circle, rgba(255,255,255,0.58) 0%, rgba(124,211,255,0.46) 23%, rgba(216,111,255,0.20) 48%, transparent 76%);
                filter: blur(1px);
                pointer-events: none;
              }
              @keyframes ag-glass-spotlight-demo {
                0% { transform: translate(18%, 8%) scale(0.92); opacity: 0.62; }
                50% { transform: translate(58%, 28%) scale(1.08); opacity: 0.95; }
                100% { transform: translate(28%, 52%) scale(0.98); opacity: 0.72; }
              }
              .ag-glass-spotlight-demo-orb {
                animation: ag-glass-spotlight-demo 3.4s ease-in-out infinite alternate;
              }
              @media (prefers-reduced-motion: reduce) {
                .ag-glass-spotlight-demo-orb { animation: none; }
              }
            `}</style>
          </>
        ) : null}
        {spotlightHoleStyle ? (
          <div style={{ ...spotlightHoleStyle }} />
        ) : (
          <span className="glass-sr-only">Glass spotlight inactive</span>
        )}
        {children}
      </div>
    );
  }
);

GlassSpotlight.displayName = "GlassSpotlight";

export default GlassSpotlight;
