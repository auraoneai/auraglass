"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";
import { createGlassStyle } from "../../core/mixins/glassMixins";

const carouselButtonStyle: React.CSSProperties = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
});

export interface LiquidGlassCarouselRailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[];
  showScrollButtons?: boolean;
}

/** @deprecated LiquidGlassCarouselRail DEP-S0607 since 4.2.0, removed in 6.0.0. {@link CarouselRail from aura-glass/media} */
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
