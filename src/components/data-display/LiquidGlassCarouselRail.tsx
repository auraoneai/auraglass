"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassCarouselRailProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[];
  showScrollButtons?: boolean;
}

export const LiquidGlassCarouselRail = forwardRef<HTMLDivElement, LiquidGlassCarouselRailProps>(
  ({ items, showScrollButtons = true, className, children, ...props }, ref) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const scrollBy = (delta: number) => scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
    return (
      <div ref={ref} className={cn("liquid-glass-carousel-rail glass-relative", className)} data-liquid-glass-carousel-rail="true" {...props}>
        <LiquidGlassScrollEdge edge="left" styleMode="soft" targetRef={scrollerRef} />
        <div ref={scrollerRef} className="glass-flex glass-gap-3 glass-overflow-x-auto glass-px-8 glass-py-2" data-liquid-glass-scroll-target>
          {items?.map((item, index) => <div key={index} className="glass-shrink-0">{item}</div>)}
          {children}
        </div>
        <LiquidGlassScrollEdge edge="right" styleMode="soft" targetRef={scrollerRef} />
        {showScrollButtons && (
          <>
            <button type="button" aria-label="Scroll left" className="glass-absolute glass-left-0 glass-top-1/2" onClick={() => scrollBy(-240)}>‹</button>
            <button type="button" aria-label="Scroll right" className="glass-absolute glass-right-0 glass-top-1/2" onClick={() => scrollBy(240)}>›</button>
          </>
        )}
      </div>
    );
  }
);

LiquidGlassCarouselRail.displayName = "LiquidGlassCarouselRail";
