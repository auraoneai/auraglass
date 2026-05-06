"use client";

import React, { forwardRef, useEffect } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassAdaptiveSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  side?: "bottom" | "left" | "right";
  height?: number | string;
  sourceId?: string;
  presentationMode?: "interruptive" | "parallel";
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassAdaptiveSheet = forwardRef<HTMLDivElement, LiquidGlassAdaptiveSheetProps>(
  (
    {
      open,
      onOpenChange,
      title,
      side = "bottom",
      height = "70%",
      sourceId,
      presentationMode = "interruptive",
      materialVariant = "regular",
      className,
      children,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (!open || typeof document === "undefined") return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onOpenChange?.(false);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [onOpenChange, open]);

    if (!open) return null;

    const isBottom = side === "bottom";
    return (
      <div
        className="glass-fixed glass-inset-0 glass-z-1100"
        data-liquid-glass-adaptive-sheet-root="true"
        data-presentation-mode={presentationMode}
      >
        {presentationMode === "interruptive" && (
          <button
            type="button"
            aria-label="Close sheet"
            className="glass-absolute glass-inset-0 glass-bg-black/30"
            onClick={() => onOpenChange?.(false)}
          />
        )}
        <div
          ref={ref}
          role="dialog"
          aria-modal={presentationMode === "interruptive"}
          aria-label={title}
          className={cn(
            "liquid-glass-adaptive-sheet glass-absolute glass-p-3",
            isBottom ? "glass-left-0 glass-right-0 glass-bottom-0" : side === "left" ? "glass-left-0 glass-top-0 glass-bottom-0 glass-w-96" : "glass-right-0 glass-top-0 glass-bottom-0 glass-w-96",
            className
          )}
          style={isBottom ? { height: typeof height === "number" ? `${height}px` : height } : undefined}
          data-source-id={sourceId}
          {...props}
        >
          <LiquidGlassMaterial material="liquid" variant={materialVariant} radius={isBottom ? "2xl" : "xl"} className="glass-h-full">
            <LiquidGlassScrollEdge edge="top" styleMode="soft" active />
            {title && <h2 className="glass-p-4 glass-text-lg glass-font-semibold">{title}</h2>}
            <div className="glass-p-4">{children}</div>
          </LiquidGlassMaterial>
        </div>
      </div>
    );
  }
);

LiquidGlassAdaptiveSheet.displayName = "LiquidGlassAdaptiveSheet";
