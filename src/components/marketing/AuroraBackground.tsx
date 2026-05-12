"use client";

import React, { forwardRef, useMemo } from "react";
import { cn } from "../../lib/utils";
import type { MarketingPalette } from "./types";
import "./marketing.css";

export interface AuroraBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  palette?: MarketingPalette;
  intensity?: "subtle" | "medium" | "strong";
  motion?: "none" | "subtle" | "full";
  particles?: boolean | number;
  grain?: boolean;
  vignette?: boolean;
  fixed?: boolean;
  reducedMotion?: boolean;
  seed?: string | number;
}

interface Particle {
  id: string;
  x: string;
  y: string;
  size: string;
  alpha: string;
  duration: string;
  delay: string;
}

const DEFAULT_SEED = "auraglass-marketing";

function hashSeed(seed: string | number): number {
  const input = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function seededRandom(seed: string | number) {
  let state = hashSeed(seed) || 1;

  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

function createParticles(count: number, seed: string | number): Particle[] {
  const random = seededRandom(seed);

  return Array.from({ length: count }, (_, index) => ({
    id: `ag-particle-${index}`,
    x: `${(random() * 100).toFixed(3)}%`,
    y: `${(random() * 100).toFixed(3)}%`,
    size: `${(1.5 + random() * 3.5).toFixed(2)}px`,
    alpha: `${(0.26 + random() * 0.42).toFixed(2)}`,
    duration: `${(8 + random() * 12).toFixed(2)}s`,
    delay: `${(-1 * random() * 12).toFixed(2)}s`,
  }));
}

function particleCount(particles: AuroraBackgroundProps["particles"]): number {
  if (typeof particles === "number") {
    return Math.max(0, Math.min(80, Math.floor(particles)));
  }

  return particles ? 24 : 0;
}

export const AuroraBackground = forwardRef<
  HTMLDivElement,
  AuroraBackgroundProps
>(
  (
    {
      palette = "aurora",
      intensity = "medium",
      motion = "subtle",
      particles = false,
      grain = false,
      vignette = false,
      fixed = false,
      reducedMotion = false,
      seed = DEFAULT_SEED,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const count = particleCount(particles);
    const generatedParticles = useMemo(
      () => createParticles(count, seed),
      [count, seed]
    );
    const motionMode = reducedMotion ? "none" : motion;

    return (
      <div
        ref={ref}
        aria-hidden={
          children ? props["aria-hidden"] : (props["aria-hidden"] ?? true)
        }
        data-ag-palette={palette}
        data-ag-reduced-motion={reducedMotion || motion === "none" || undefined}
        data-fixed={fixed || undefined}
        data-intensity={intensity}
        data-motion={motionMode}
        className={cn("ag-marketing-scope ag-aurora-background", className)}
        {...props}
      >
        <span className="ag-aurora-background__blob" />
        <span className="ag-aurora-background__blob" />
        <span className="ag-aurora-background__blob" />
        {generatedParticles.map((particle) => (
          <span
            key={particle.id}
            className="ag-aurora-background__particle"
            data-testid="aurora-particle"
            style={
              {
                "--ag-particle-x": particle.x,
                "--ag-particle-y": particle.y,
                "--ag-particle-size": particle.size,
                "--ag-particle-alpha": particle.alpha,
                "--ag-particle-duration": particle.duration,
                "--ag-particle-delay": particle.delay,
              } as React.CSSProperties
            }
          />
        ))}
        {grain && <span className="ag-aurora-background__grain" />}
        {vignette && <span className="ag-aurora-background__vignette" />}
        {children}
      </div>
    );
  }
);

AuroraBackground.displayName = "AuroraBackground";
