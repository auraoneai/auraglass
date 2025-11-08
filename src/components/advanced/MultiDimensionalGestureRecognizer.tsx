'use client';
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface GestureDimension {
  axis: "x" | "y" | "z" | "time" | "pressure" | "rotation";
  weight?: number;
  sensitivity?: number;
}

export interface GestureDefinition {
  id: string;
  name: string;
  pattern: string;
  dimensions: GestureDimension[];
  description?: string;
  baselineConfidence?: number;
}

export interface MultiDimensionalGestureRecognizerProps {
  gestures?: GestureDefinition[];
  onRecognize?: (gesture: GestureDefinition) => void;
  className?: string;
  showConfidence?: boolean;
}

const DEFAULT_GESTURES: GestureDefinition[] = [
  {
    id: "quantum-loop",
    name: "Quantum Loop",
    pattern: "spiral-clockwise",
    dimensions: [
      { axis: "x", weight: 0.4, sensitivity: 0.7 },
      { axis: "y", weight: 0.4, sensitivity: 0.7 },
      { axis: "z", weight: 0.2, sensitivity: 0.6 },
      { axis: "rotation", weight: 0.3, sensitivity: 0.8 },
    ],
    description: "Circular gesture with rising elevation and gentle rotation.",
    baselineConfidence: 0.82,
  },
  {
    id: "phase-shift",
    name: "Phase Shift",
    pattern: "figure-eight",
    dimensions: [
      { axis: "time", weight: 0.2, sensitivity: 0.5 },
      { axis: "pressure", weight: 0.25, sensitivity: 0.6 },
      { axis: "x", weight: 0.35, sensitivity: 0.65 },
      { axis: "y", weight: 0.35, sensitivity: 0.65 },
    ],
    description:
      "Alternating infinity loop signalling intent to switch contexts.",
    baselineConfidence: 0.74,
  },
  {
    id: "portal-drag",
    name: "Portal Drag",
    pattern: "arc-downward",
    dimensions: [
      { axis: "z", weight: 0.5, sensitivity: 0.8 },
      { axis: "pressure", weight: 0.3, sensitivity: 0.7 },
      { axis: "time", weight: 0.2, sensitivity: 0.45 },
    ],
    description: "Pull motion to reveal immersive overlays.",
    baselineConfidence: 0.69,
  },
];

const dimensionLabel: Record<GestureDimension["axis"], string> = {
  x: "Lateral",
  y: "Vertical",
  z: "Depth",
  time: "Temporal",
  pressure: "Pressure",
  rotation: "Rotation",
};

export function MultiDimensionalGestureRecognizer({
  gestures = DEFAULT_GESTURES,
  onRecognize,
  className,
  showConfidence = true,
}: MultiDimensionalGestureRecognizerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeGestureId, setActiveGestureId] = useState<string | null>(null);

  const summarizedGestures = useMemo(() => {
    return gestures.length > 0 ? gestures : DEFAULT_GESTURES;
  }, [gestures]);

  const handleRecognize = useCallback(
    (gesture: GestureDefinition) => {
      setActiveGestureId(gesture.id);
      onRecognize?.(gesture);
    },
    [onRecognize]
  );

  return (
    <OptimizedGlass
      role="application"
      aria-label="Multi-dimensional gesture recognizer"
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-slate-950/80 via-indigo-950/40 to-slate-900/40",
        className
      )}
    >
      <header className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-4">
        <div>
          <h2 className="glass-text-xl font-semibold text-primary">
            Multi-dimensional Gesture Recognizer
          </h2>
          <p className="glass-text-sm text-primary/70">
            Analyse six-axis motion patterns with adaptive sensitivity tuning.
          </p>
        </div>
        {showConfidence && activeGestureId && (
          <span className="glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/10 glass-px-3 glass-py-1 glass-text-xs text-primary/80">
            Active gesture:{" "}
            {summarizedGestures.find((g) => g.id === activeGestureId)?.name ??
              "—"}
          </span>
        )}
      </header>

      <div className="glass-grid glass-gap-4 lg:grid-cols-3">
        {summarizedGestures.map((gesture) => (
          <button
            key={gesture.id}
            type="button"
            onClick={() => handleRecognize(gesture)}
            className={cn(
              "relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition",
              "hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 glass-focus glass-touch-target glass-contrast-guard",
              activeGestureId === gesture.id
                ? "border-sky-400/60 shadow-[0_0_30px_-10px_rgba(125,211,252,0.8)]"
                : undefined
            )}
          >
            <div>
              <h3 className="glass-text-lg font-medium text-primary">
                {gesture.name}
              </h3>
              <p className="glass-text-xs text-primary/60">
                {gesture.description}
              </p>
            </div>

            <dl className="glass-grid glass-gap-2 glass-text-xs text-primary/70">
              <div className="glass-flex glass-items-center glass-justify-between">
                <dt className="uppercase tracking-wide">Pattern</dt>
                <dd className="font-semibold text-primary/85">
                  {gesture.pattern}
                </dd>
              </div>
              {showConfidence && (
                <div className="glass-flex glass-items-center glass-justify-between">
                  <dt className="uppercase tracking-wide">
                    Baseline confidence
                  </dt>
                  <dd className="font-semibold text-primary">
                    {(
                      Math.min(
                        0.99,
                        Math.max(0, gesture.baselineConfidence ?? 0.5)
                      ) * 100
                    ).toFixed(0)}
                    %
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-auto space-y-2">
              <div className="glass-flex glass-items-center glass-justify-between glass-text-xs text-primary/50">
                <span>Dimensional weights</span>
                {!prefersReducedMotion && (
                  <span className="font-semibold text-primary/70">
                    {gesture.dimensions.length} axes
                  </span>
                )}
              </div>
              <ul className="glass-grid glass-gap-2 glass-text-xs text-primary">
                {gesture.dimensions.map((dimension) => (
                  <li
                    key={`${gesture.id}-${dimension.axis}`}
                    className="glass-flex glass-items-center glass-justify-between glass-radius-xl glass-border glass-border-white/5 glass-surface-subtle/5 glass-px-3 glass-py-2"
                  >
                    <span className="font-medium text-primary/85">
                      {dimensionLabel[dimension.axis]}
                    </span>
                    <span className="text-primary/60">
                      Weight {(dimension.weight ?? 0.25).toFixed(2)} | Sens{" "}
                      {(dimension.sensitivity ?? 0.5).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </OptimizedGlass>
  );
}

export default MultiDimensionalGestureRecognizer;