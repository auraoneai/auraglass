import React from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export type EntanglementState = "entangled" | "decohering" | "collapsed";

export interface QuantumEntanglementPair {
  id: string;
  nodes: [string, string];
  fidelity: number;
  phaseCorrelation: number;
  state?: EntanglementState;
  latency?: number;
}

export interface QuantumEntanglementVisualizerProps {
  className?: string;
  pairs?: QuantumEntanglementPair[];
  highlightThreshold?: number;
}

const DEFAULT_PAIRS: QuantumEntanglementPair[] = [
  {
    id: "alpha",
    nodes: ["Q1", "Q8"],
    fidelity: 0.93,
    phaseCorrelation: 0.84,
    state: "entangled",
    latency: 4.2,
  },
  {
    id: "beta",
    nodes: ["Q3", "Q11"],
    fidelity: 0.68,
    phaseCorrelation: 0.49,
    state: "decohering",
    latency: 7.8,
  },
  {
    id: "gamma",
    nodes: ["Q2", "Q5"],
    fidelity: 0.81,
    phaseCorrelation: 0.73,
    state: "entangled",
    latency: 5.4,
  },
  {
    id: "delta",
    nodes: ["Q7", "Q12"],
    fidelity: 0.39,
    phaseCorrelation: 0.31,
    state: "collapsed",
    latency: 9.1,
  },
];

const stateStyles: Record<EntanglementState, string> = {
  entangled: "border-emerald-400/60 bg-emerald-500/10 text-emerald-200",
  decohering: "border-amber-400/60 bg-amber-400/10 text-amber-100",
  collapsed: "border-rose-400/60 bg-rose-500/10 text-rose-100",
};

export function QuantumEntanglementVisualizer({
  className,
  pairs = DEFAULT_PAIRS,
  highlightThreshold = 0.7,
}: QuantumEntanglementVisualizerProps) {
  const normalizedPairs = pairs.length > 0 ? pairs : DEFAULT_PAIRS;

  return (
    <OptimizedGlass
      role="table"
      aria-label="Quantum entanglement visualizer"
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-slate-950/80 via-purple-950/40 to-slate-900/40",
        className
      )}
    >
      <header>
        <h2 className="glass-text-xl font-semibold text-primary">
          Quantum Entanglement Visualizer
        </h2>
        <p className="glass-text-sm text-primary/70">
          Monitor fidelity, phase correlation, and decoherence risk for
          entangled qubit pairs.
        </p>
      </header>

      <div className="glass-grid glass-gap-4 lg:grid-cols-2">
        {normalizedPairs.map((pair) => {
          const state =
            pair.state ??
            (pair.fidelity >= highlightThreshold
              ? "entangled"
              : pair.fidelity >= 0.5
                ? "decohering"
                : "collapsed");
          return (
            <div
              key={pair.id}
              className={cn(
                "rounded-2xl border bg-white/5 p-4 text-primary/85 backdrop-blur transition",
                "border-white/10 hover:border-white/30",
                stateStyles[state]
              )}
            >
              <div className="glass-flex glass-items-start glass-justify-between">
                <div>
                  <div className="glass-text-xs uppercase tracking-wide text-primary/60">
                    Pair
                  </div>
                  <div className="glass-text-lg font-semibold text-primary">
                    {pair.nodes[0]} ↔ {pair.nodes[1]}
                  </div>
                </div>
                <span className="glass-radius-full glass-px-3 glass-py-1 glass-text-xs font-semibold uppercase tracking-wide">
                  {state}
                </span>
              </div>

              <dl className="mt-4 glass-grid glass-gap-3 glass-text-xs text-primary/70">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <dt>Fidelity</dt>
                  <dd className="font-semibold text-primary/90">
                    {(pair.fidelity * 100).toFixed(1)}%
                  </dd>
                </div>
                <div className="glass-flex glass-items-center glass-justify-between">
                  <dt>Phase correlation</dt>
                  <dd className="font-semibold text-primary/90">
                    {(pair.phaseCorrelation * 100).toFixed(1)}%
                  </dd>
                </div>
                {typeof pair.latency === "number" && (
                  <div className="glass-flex glass-items-center glass-justify-between">
                    <dt>Latency</dt>
                    <dd className="font-semibold text-primary/80">
                      {pair.latency.toFixed(1)} μs
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 h-2 glass-w-full overflow-hidden glass-radius-full glass-surface-subtle/10">
                <div
                  className="glass-h-full glass-radius-full bg-gradient-to-r from-sky-400/70 to-cyan-500/80"
                  style={{ width: `${pair.fidelity * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </OptimizedGlass>
  );
}

export default QuantumEntanglementVisualizer;
