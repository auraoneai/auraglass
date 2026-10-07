"use client";

import React, { forwardRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "../../icons";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";

export interface GlassValidationMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: "error" | "warning" | "success" | "info";
  icon?: React.ReactNode;
}

const toneConfig = {
  error: { icon: AlertCircle, role: "alert", className: "text-red-800" },
  warning: {
    icon: AlertTriangle,
    role: "status",
    className: "text-amber-900",
  },
  success: {
    icon: CheckCircle,
    role: "status",
    className: "text-emerald-800",
  },
  info: { icon: Info, role: "status", className: "glass-text-secondary" },
};

export const GlassValidationMessage = forwardRef<
  HTMLParagraphElement,
  GlassValidationMessageProps
>(({ tone = "info", icon, className, children, ...props }, ref) => {
  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <OptimizedGlass
      as="p"
      elevation="level1"
      intensity="subtle"
      border="subtle"
      ref={ref}
      role={config.role}
      className={cn(
        "glass-flex glass-items-start glass-gap-1.5 glass-rounded-lg glass-px-3 glass-py-2 glass-text-xs",
        config.className,
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="glass-mt-0.5 glass-inline-flex">
        {icon ?? <Icon size={14} />}
      </span>
      <span>{children}</span>
    </OptimizedGlass>
  );
});

GlassValidationMessage.displayName = "GlassValidationMessage";
