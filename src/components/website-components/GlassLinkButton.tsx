import React from 'react';
"use client";

import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "../../lib/utilsComprehensive";

interface GlassLinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  intent?: "primary" | "neutral" | "success" | "warning";
  noise?: boolean;
  children: React.ReactNode;
}

const GlassLinkButton = forwardRef<HTMLAnchorElement, GlassLinkButtonProps>(
  ({ className, variant = "primary", size = "md", intent = "primary", noise = false, children, ...props }, ref) => {
    return (
      <a data-glass-component
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center rounded-glass font-semibold transition-all duration-200 ease-out hover:glass-text-primary",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2",
          "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none isolate",

          {
            "h-8 px-3 text-sm touch-target": size === "sm",
            "h-10 px-4 text-sm touch-target": size === "md",
            "h-12 px-6 text-base touch-target": size === "lg",
          },

          {
            "glass-text-primary bg-gradient-to-r from-blue-500/80 to-purple-500/80 border border-white/20 backdrop-blur-md-medium shadow-glass": variant === "primary",
            "hover:shadow-glass-strong sm:hover:-translate-y-0.5": variant === "primary",

            "glass-foundation-complete glass-text-primary border border-white/14 backdrop-blur-md-subtle": variant === "secondary",
            "hover:bg-white/10 hover:border-white/25": variant === "secondary",

            "bg-transparent glass-text-primary/88 border border-white/10": variant === "ghost",
            "hover:bg-white/5 hover:glass-text-primary hover:border-white/20": variant === "ghost",
          },

          variant !== "primary" && intent === "primary" && "bg-gradient-to-r from-cyan-400/15 to-purple-500/15",
          variant !== "primary" && intent === "success" && "bg-gradient-to-r from-emerald-400/10 to-cyan-400/10",
          variant !== "primary" && intent === "warning" && "bg-gradient-to-r from-amber-400/10 to-orange-500/10",

          className
        )}
        {...props}
      >
        {(variant === "primary" || variant === "secondary") && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: 'inherit',
              padding: '1px',
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level3" }) */',
              mask: 'linear-gradient(var(--glass-black) 0 0) content-box, linear-gradient(var(--glass-black) 0 0)',
              WebkitMask: 'linear-gradient(var(--glass-black) 0 0) content-box, linear-gradient(var(--glass-black) 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0.8,
            }}
          />
        )}

        {variant === "primary" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
            style={{
              borderRadius: 'inherit',
              background: '/* Use createGlassStyle({ intent: "neutral", elevation: "level3" }) */',
            }}
          />
        )}

        <span className="relative z-10 flex items-center gap-2 text-primary group-hover:text-indigo-50">{children}</span>
      </a>
    );
  }
);

GlassLinkButton.displayName = "GlassLinkButton";

export { GlassLinkButton };
export type { GlassLinkButtonProps };
