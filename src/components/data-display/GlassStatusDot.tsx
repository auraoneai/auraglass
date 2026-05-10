"use client";
import React from "react";
import { cn } from "../../lib/utilsComprehensive";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassStatusDotProps {
  status?: "ok" | "warn" | "error" | "busy" | "offline";
  size?: number;
  className?: string;
}

export function GlassStatusDot({
  status = "ok",
  size = 8,
  className,
}: GlassStatusDotProps) {
  const color =
    status === "ok"
      ? "bg-emerald-400"
      : status === "warn"
        ? "bg-amber-400"
        : status === "error"
          ? "bg-red-400"
          : status === "busy"
            ? "bg-blue-400"
            : "bg-slate-400";
  return (
    <span
      className={cn("glass-inline-block glass-radius-full", color, className)}
      style={{ width: size, height: size }}
    />
  );
}

export default GlassStatusDot;
