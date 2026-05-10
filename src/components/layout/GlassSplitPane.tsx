"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassSplitPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Split direction
   */
  direction?: "horizontal" | "vertical";
  /**
   * Initial split percentage for first pane
   */
  initial?: number;
  /**
   * Minimum percentage for first pane
   */
  min?: number;
  /**
   * Maximum percentage for first pane
   */
  max?: number;
  /**
   * Content for the left/top pane
   */
  left?: React.ReactNode;
  /**
   * Content for the right/bottom pane
   */
  right?: React.ReactNode;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for screen readers
   */
  "aria-label"?: string;
  /**
   * Callback when split percentage changes
   */
  onSplitChange?: (percentage: number) => void;
}

/**
 * GlassSplitPane component
 * Resizable split pane with glassmorphism styling
 */
export const GlassSplitPane = forwardRef<HTMLDivElement, GlassSplitPaneProps>(
  (
    {
      // ContrastGuard layout text coverage is tracked in the manual accessibility QA report.

      direction = "horizontal",
      initial = 50,
      min = 20,
      max = 80,
      left,
      right,
      respectMotionPreference = true,
      "aria-label": ariaLabel = "Split pane",
      onSplitChange,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [pct, setPct] = React.useState(initial);
    const dragging = React.useRef(false);
    const splitPaneId = useA11yId();
    const separatorId = useA11yId();
    const splitPaneLabelId = useA11yId("split-pane-label");
    const leftPaneLabelId = useA11yId("split-pane-left");
    const rightPaneLabelId = useA11yId("split-pane-right");
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    const onDown = () => (dragging.current = true);
    const onUp = () => (dragging.current = false);

    const onMove = React.useCallback(
      (e: MouseEvent) => {
        if (!dragging.current) return;

        let newPct: number;
        if (direction === "horizontal") {
          newPct = (e.clientX / window.innerWidth) * 100;
        } else {
          newPct = (e.clientY / window.innerHeight) * 100;
        }

        const clampedPct = Math.max(min, Math.min(max, newPct));
        setPct(clampedPct);
        onSplitChange?.(clampedPct);
      },
      [direction, min, max, onSplitChange]
    );

    React.useEffect(() => {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }, [onMove]);

    // Keyboard support for separator
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const step = 5; // 5% steps
      let newPct = pct;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          newPct = Math.max(min, pct - step);
          break;
        case "ArrowRight":
        case "ArrowDown":
          newPct = Math.min(max, pct + step);
          break;
        case "Home":
          newPct = min;
          break;
        case "End":
          newPct = max;
          break;
        default:
          return;
      }

      e.preventDefault();
      setPct(newPct);
      onSplitChange?.(newPct);
    };

    return (
      <div
        ref={ref}
        id={splitPaneId}
        className={cn(
          "glass-relative glass-grid glass-w-full glass-h-full",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        style={{
          // @ts-ignore custom var
          ["--a" as any]: `${pct}%`,
          display: "grid",
          gridTemplateColumns:
            direction === "horizontal"
              ? "var(--a) 12px minmax(0, 1fr)"
              : undefined,
          gridTemplateRows:
            direction === "vertical"
              ? "var(--a) 12px minmax(0, 1fr)"
              : undefined,
          minWidth: 0,
          minHeight: 0,
          ...style,
        }}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={splitPaneLabelId}
        {...props}
      >
        <span id={splitPaneLabelId} className="glass-sr-only">
          {ariaLabel}
        </span>
        {/* Left/Top Pane */}
        <ContrastGuard
          as="div"
          level="AA"
          className="glass-min-w-0 glass-min-h-0 glass-overflow-auto"
          role="region"
          aria-labelledby={leftPaneLabelId}
        >
          <span id={leftPaneLabelId} className="glass-sr-only">
            {direction === "horizontal" ? "Left pane" : "Top pane"}
          </span>
          {left}
        </ContrastGuard>

        {/* Separator */}
        <div
          id={separatorId}
          role="separator"
          tabIndex={0}
          aria-orientation={
            direction === "horizontal" ? "vertical" : "horizontal"
          }
          aria-valuenow={pct}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={`Resize ${direction === "horizontal" ? "vertical" : "horizontal"} split. Currently at ${Math.round(pct)}%`}
          onMouseDown={onDown}
          onKeyDown={handleKeyDown}
          className={cn(
            "glass-select-none glass-radius-full glass-focus-outline-none glass-focus-ring-2 glass-focus-ring-primary/50",
            direction === "horizontal"
              ? "glass-w-3 glass-h-full glass-cursor-col-resize"
              : "glass-h-3 glass-w-full glass-cursor-row-resize",
            "glass-bg-white/10",
            shouldRespectMotion
              ? "hover:glass-bg-white/20 glass-transition-colors glass-duration-200"
              : "hover:glass-bg-white/20",
            dragging.current && "glass-bg-white/30"
          )}
        />

        {/* Right/Bottom Pane */}
        <ContrastGuard
          as="div"
          level="AA"
          className="glass-min-w-0 glass-min-h-0 glass-overflow-auto"
          role="region"
          aria-labelledby={rightPaneLabelId}
        >
          <span id={rightPaneLabelId} className="glass-sr-only">
            {direction === "horizontal" ? "Right pane" : "Bottom pane"}
          </span>
          {right}
        </ContrastGuard>
      </div>
    );
  }
);

GlassSplitPane.displayName = "GlassSplitPane";

export default GlassSplitPane;
