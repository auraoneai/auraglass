"use client";

import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

export interface LiquidGlassInspectorSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface LiquidGlassInspectorPanelProps extends React.HTMLAttributes<HTMLElement> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  selectionLabel?: string;
  placement?: "right" | "left" | "bottom";
  resizable?: boolean;
  sections?: LiquidGlassInspectorSection[];
  materialVariant?: "regular" | "clear";
}

export const LiquidGlassInspectorPanel = forwardRef<HTMLElement, LiquidGlassInspectorPanelProps>(
  (
    {
      open,
      onOpenChange,
      title = "Inspector",
      selectionLabel,
      placement = "right",
      resizable = true,
      sections = [],
      materialVariant = "regular",
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (!open) return null;
    return (
      <aside
        ref={ref}
        className={cn(
          "liquid-glass-inspector-panel glass-relative glass-z-50 glass-p-3",
          placement === "bottom" ? "glass-w-full" : "glass-w-80",
          resizable && placement !== "bottom" && "glass-resize-x glass-overflow-auto",
          className
        )}
        aria-label={title}
        data-liquid-glass-inspector-panel="true"
        {...props}
      >
        <LiquidGlassMaterial material="liquid" variant={materialVariant} radius="2xl" className="glass-h-full">
          <LiquidGlassScrollEdge edge="top" styleMode="hard" active />
          <div className="glass-flex glass-items-start glass-justify-between glass-gap-3 glass-p-4">
            <div>
              <h2 className="glass-text-lg glass-font-semibold">{title}</h2>
              {selectionLabel && <p className="glass-text-sm glass-text-secondary">{selectionLabel}</p>}
            </div>
            <button type="button" aria-label="Close inspector" onClick={() => onOpenChange?.(false)}>
              x
            </button>
          </div>
          <div className="glass-flex glass-flex-col glass-gap-4 glass-p-4">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={`${section.id}-title`}>
                <h3 id={`${section.id}-title`} className="glass-text-sm glass-font-semibold">
                  {section.title}
                </h3>
                <div className="glass-mt-2">{section.content}</div>
              </section>
            ))}
            {children}
          </div>
        </LiquidGlassMaterial>
      </aside>
    );
  }
);

LiquidGlassInspectorPanel.displayName = "LiquidGlassInspectorPanel";
