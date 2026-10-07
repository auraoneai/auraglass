"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

const carouselButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  padding: 0,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.32)",
  color: "var(--glass-theme-text, var(--glass-text-primary))",
  boxShadow:
    "0 8px 24px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
  backdropFilter: "blur(16px) saturate(1.4) brightness(1.05) contrast(1.04)",
  WebkitBackdropFilter:
    "blur(16px) saturate(1.4) brightness(1.05) contrast(1.04)",
  transform: "translateY(-50%)",
  font: "600 24px/1 system-ui, sans-serif",
  cursor: "pointer",
};

export interface LiquidGlassCarouselRailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[];
  showScrollButtons?: boolean;
}

export const LiquidGlassCarouselRail = forwardRef<
  HTMLDivElement,
  LiquidGlassCarouselRailProps
>(({ items, showScrollButtons = true, className, children, ...props }, ref) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollBy = (delta: number) =>
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-carousel-rail glass-relative glass-w-full glass-max-w-full glass-min-w-0 glass-overflow-hidden",
        className
      )}
      data-liquid-glass-carousel-rail="true"
      {...props}
    >
      <LiquidGlassScrollEdge
        edge="left"
        styleMode="soft"
        targetRef={scrollerRef}
      />
      <div
        ref={scrollerRef}
        className="glass-flex glass-w-full glass-max-w-full glass-min-w-0 glass-gap-3 glass-overflow-x-auto glass-px-10 glass-py-2"
        data-liquid-glass-scroll-target
      >
        {items?.map((item, index) => (
          <div key={index} className="glass-shrink-0">
            {item}
          </div>
        ))}
        {children}
      </div>
      <LiquidGlassScrollEdge
        edge="right"
        styleMode="soft"
        targetRef={scrollerRef}
      />
      {showScrollButtons && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            className="glass-absolute glass-left-1 glass-top-1/2 glass-z-30"
            style={carouselButtonStyle}
            onClick={() => scrollBy(-240)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="glass-absolute glass-right-1 glass-top-1/2 glass-z-30"
            style={carouselButtonStyle}
            onClick={() => scrollBy(240)}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
});

LiquidGlassCarouselRail.displayName = "LiquidGlassCarouselRail";
