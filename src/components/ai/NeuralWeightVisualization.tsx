import React, { useMemo } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export interface NeuralWeightMatrix {
  id: string;
  label: string;
  weights: number[][];
  activation?: number[];
}

export interface NeuralWeightVisualizationProps {
  layers?: NeuralWeightMatrix[];
  className?: string;
  highlightThreshold?: number;
  precision?: number;
}

const DEFAULT_LAYERS: NeuralWeightMatrix[] = [
  {
    id: "input",
    label: "Input Layer",
    weights: [
      [0.12, -0.34, 0.52],
      [0.41, -0.67, 0.18],
      [0.09, 0.23, -0.12],
    ],
    activation: [0.64, 0.31, 0.78],
  },
  {
    id: "hidden",
    label: "Hidden Layer",
    weights: [
      [0.43, -0.58, 0.72, -0.19],
      [-0.27, 0.35, -0.49, 0.63],
      [0.11, 0.08, -0.14, 0.21],
    ],
    activation: [0.52, 0.61, 0.47, 0.34],
  },
  {
    id: "output",
    label: "Output Layer",
    weights: [
      [0.25, -0.19],
      [-0.38, 0.44],
      [0.57, -0.22],
      [-0.29, 0.31],
    ],
    activation: [0.71, 0.29],
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getWeightColor = (weight: number, threshold: number) => {
  const magnitude = Math.abs(weight);
  const normalized = clamp(magnitude / threshold, 0, 1);
  const hue = weight >= 0 ? 180 : 335; // teal for positive, magenta for negative
  const saturation = 70 + normalized * 20;
  const lightness = 45 - normalized * 20;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export function NeuralWeightVisualization({
  layers = DEFAULT_LAYERS,
  className,
  highlightThreshold = 0.75,
  precision = 2,
}: NeuralWeightVisualizationProps) {
  const normalizedLayers = useMemo(() => {
    const fallback = layers.length > 0 ? layers : DEFAULT_LAYERS;
    return fallback.map((layer) => ({
      ...layer,
      weights: layer.weights.map((row) =>
        row.map((value) => clamp(value, -1, 1))
      ),
      activation: layer.activation?.map((value) => clamp(value, 0, 1)),
    }));
  }, [layers]);

  return (
    <OptimizedGlass
      role="figure"
      aria-label="Neural weight visualization"
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/40",
        className
      )}
    >
      <header>
        <h2 className="glass-text-xl font-semibold text-primary">
          Neural Weight Visualization
        </h2>
        <p className="glass-text-sm text-primary/70">
          Inspect synaptic strengths with polarity-aware colour mapping and
          activation overlays.
        </p>
      </header>

      <div className="glass-grid glass-gap-4 lg:grid-cols-3">
        {normalizedLayers.map((layer) => (
          <div
            key={layer.id}
            className="glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 glass-backdrop-blur"
          >
            <div className="glass-flex glass-items-center glass-justify-between glass-text-sm text-primary/80">
              <h3 className="font-semibold text-primary">{layer.label}</h3>
              {layer.activation && (
                <span className="glass-text-xs text-primary/60">
                  Activation avg{" "}
                  {(
                    layer.activation.reduce((sum, value) => sum + value, 0) /
                    layer.activation.length
                  ).toFixed(2)}
                </span>
              )}
            </div>

            <div className="mt-3 overflow-hidden glass-radius-xl glass-border glass-border-white/10">
              <table className="min-w-full glass-border-collapse">
                <tbody>
                  {layer.weights.map((row, rowIndex) => (
                    <tr
                      key={`${layer.id}-row-${rowIndex}`}
                      className="divide-x divide-white/5"
                    >
                      {row.map((weight, columnIndex) => {
                        const magnitude = Math.abs(weight);
                        const strong = magnitude >= highlightThreshold;
                        const color = getWeightColor(weight, 1);
                        return (
                          <td
                            key={`${layer.id}-${rowIndex}-${columnIndex}`}
                            className={cn(
                              "px-2 py-3 text-center text-xs font-medium text-white/90 transition",
                              strong
                                ? "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] text-white"
                                : "text-white/80"
                            )}
                            style={{
                              background: `linear-gradient(135deg, ${color} 0%, rgba(15,23,42,0.75) 100%)`,
                            }}
                          >
                            {weight.toFixed(precision)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {layer.activation && (
              <div className="mt-4 space-y-2 glass-text-xs text-primary/70">
                <div className="glass-flex glass-items-center glass-justify-between uppercase tracking-wide">
                  <span>Activation Levels</span>
                  <span>Max {Math.max(...layer.activation).toFixed(2)}</span>
                </div>
                <div className="glass-flex glass-gap-2">
                  {layer.activation.map((activation, index) => (
                    <div
                      key={`${layer.id}-activation-${index}`}
                      className="glass-flex-1"
                    >
                      <div className="h-16 overflow-hidden glass-radius-full glass-surface-subtle/10">
                        <div
                          className="glass-h-full glass-w-full glass-radius-full bg-cyan-400/70"
                          style={{ height: `${activation * 100}%` }}
                        />
                      </div>
                      <div className="mt-1 text-center text-[10px] text-primary/60">
                        n{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </OptimizedGlass>
  );
}

export default NeuralWeightVisualization;
