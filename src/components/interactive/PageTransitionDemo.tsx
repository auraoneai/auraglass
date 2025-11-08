'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { useState } from "react";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { cn } from "../../lib/utilsComprehensive";
import { AnimatePresence, motion } from "framer-motion";

export const PageTransitionDemo: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [page, setPage] = useState(0);

  return (
    <div style={{ position: "relative", width: 520, height: 320 }}>
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
          borderRadius: 16,
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
              transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] },
            }}
            exit={{
              opacity: 0,
              filter: "blur(var(--glass-blur-md))",
              y: -10,
              transition: { duration: 0.2 },
            }}
            style={cardStyle}
          >
            {page === 0 && (
              <Section
                title="Overview"
                color="linear-gradient(135deg, var(--glass-color-primary-light)33, #c084fc33)"
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
                color="linear-gradient(135deg, #f472b633, var(--glass-color-warning)33)"
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
  borderRadius: 8,
  border: "1px solid rgba(var(--glass-color-white) / var(--glass-opacity-20))",
  background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
  color: "white",
});

export default PageTransitionDemo;