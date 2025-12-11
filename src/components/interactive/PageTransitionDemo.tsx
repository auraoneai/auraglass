"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { useState } from "react";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { cn } from "../../lib/utilsComprehensive";
import { AnimatePresence, motion } from "framer-motion";
import { ANIMATION, BORDER_RADIUS } from "../../tokens/designConstants";

export interface PageTransitionDemoProps {
  className?: string;
  "data-testid"?: string;
}

export const PageTransitionDemo: React.FC<PageTransitionDemoProps> = ({
  className,
  "data-testid": dataTestId,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [page, setPage] = useState(0);

  return (
    <div
      className={cn("glass-relative", className)}
      data-testid={dataTestId}
      style={{ width: 520, height: 320 }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={(e) => setPage(0)}
          style={btnStyle(page === 0)}
          className="glass-focus glass-touch-target glass-contrast-guard"
        >
          Overview
        </button>
        <button
          onClick={(e) => setPage(1)}
          style={btnStyle(page === 1)}
          className="glass-focus glass-touch-target glass-contrast-guard"
        >
          Details
        </button>
        <button
          onClick={(e) => setPage(2)}
          style={btnStyle(page === 2)}
          className="glass-focus glass-touch-target glass-contrast-guard"
        >
          Insights
        </button>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: BORDER_RADIUS.lg,
          overflow: "hidden",
          height: 260,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{
              opacity: 0,
              filter: "blur(var(--glass-blur-md))",
              y: 10,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: {
                duration: ANIMATION.DURATION.normal / 1000,
                ease: ANIMATION.EASING.easeInOut,
              },
            }}
            exit={{
              opacity: 0,
              filter: "blur(var(--glass-blur-md))",
              y: -10,
              transition: { duration: ANIMATION.DURATION.fast / 1000 },
            }}
            style={{ ...cardStyle }}
          >
            {page === 0 && (
              <Section
                title="Overview"
                color="linear-gradient(135deg, var(--glass-color-primary-light)33, color-mix(in srgb, var(--glass-color-secondary) 20%, transparent))"
              />
            )}
            {page === 1 && (
              <Section
                title="Details"
                color="linear-gradient(135deg, var(--glass-color-success-light)33, var(--glass-color-primary-light)33)"
              />
            )}
            {page === 2 && (
              <Section
                title="Insights"
                color="linear-gradient(135deg, color-mix(in srgb, var(--glass-color-danger) 20%, transparent), color-mix(in srgb, var(--glass-color-warning) 20%, transparent))"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; color: string }> = ({
  title,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
    }}
  >
    <div style={createGlassStyle({ intent: "neutral", elevation: "level2" })}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color,
          pointerEvents: "none",
        }}
      />
      <h3 style={{ position: "relative", margin: 0, zIndex: 1 }}>{title}</h3>
      <p style={{ position: "relative", zIndex: 1, opacity: 0.8 }}>
        Glass page transition demo
      </p>
    </div>
  </div>
);

const cardStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 10px",
  borderRadius: BORDER_RADIUS.md,
  border: "1px solid color-mix(in srgb, var(--glass-white) 20%, transparent)",
  background: active
    ? "color-mix(in srgb, var(--glass-white) 18%, transparent)"
    : "color-mix(in srgb, var(--glass-white) 8%, transparent)",
  color: "white",
});

export default PageTransitionDemo;
