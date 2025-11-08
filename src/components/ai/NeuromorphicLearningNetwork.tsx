import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export interface NeuromorphicSignal {
  channel: string;
  weights: number[];
  phase?: number;
}

export interface NeuromorphicLearningSnapshot {
  energyUsage: number;
  coherence: number;
  plasticity: number;
  stability: number;
  timestamp: number;
}

export interface NeuromorphicLearningNetworkProps {
  className?: string;
  signals?: NeuromorphicSignal[];
  onSnapshot?: (snapshot: NeuromorphicLearningSnapshot) => void;
  autoSampleInterval?: number;
}

const DEFAULT_SIGNALS: NeuromorphicSignal[] = [
  { channel: "sensory", weights: [0.42, -0.31, 0.57, -0.12, 0.25], phase: 0.6 },
  {
    channel: "cognitive",
    weights: [0.63, -0.44, 0.18, 0.27, -0.35],
    phase: 0.52,
  },
  { channel: "motor", weights: [0.29, -0.17, 0.41, -0.22, 0.33], phase: 0.47 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const computeMetrics = (
  signals: NeuromorphicSignal[]
): NeuromorphicLearningSnapshot => {
  if (signals.length === 0) {
    return {
      energyUsage: 0,
      coherence: 0,
      plasticity: 0,
      stability: 0,
      timestamp: Date.now(),
    };
  }

  const allWeights = signals.flatMap((signal) => signal.weights);
  const mean =
    allWeights.reduce((sum, weight) => sum + weight, 0) / allWeights.length;
  const variance =
    allWeights.reduce((sum, weight) => sum + (weight - mean) ** 2, 0) /
    allWeights.length;
  const stdDeviation = Math.sqrt(variance);
  const averageMagnitude =
    allWeights.reduce((sum, weight) => sum + Math.abs(weight), 0) /
    allWeights.length;

  const phaseVariance =
    signals.reduce(
      (sum, signal) => sum + Math.pow((signal.phase ?? 0.5) - 0.5, 2),
      0
    ) / signals.length;

  return {
    energyUsage: clamp(averageMagnitude, 0, 1),
    coherence: clamp(1 - stdDeviation, 0, 1),
    plasticity: clamp(variance * 2, 0, 1),
    stability: clamp(1 - phaseVariance * 4, 0, 1),
    timestamp: Date.now(),
  };
};

export function NeuromorphicLearningNetwork({
  className,
  signals = DEFAULT_SIGNALS,
  onSnapshot,
  autoSampleInterval,
}: NeuromorphicLearningNetworkProps) {
  const [snapshot, setSnapshot] = useState<NeuromorphicLearningSnapshot>(() =>
    computeMetrics(signals)
  );

  const normalizedSignals = useMemo(() => {
    return signals.length > 0 ? signals : DEFAULT_SIGNALS;
  }, [signals]);

  useEffect(() => {
    setSnapshot(computeMetrics(normalizedSignals));
  }, [normalizedSignals]);

  useEffect(() => {
    if (!autoSampleInterval) return;
    const timer = setInterval(
      () => {
        const latest = computeMetrics(normalizedSignals);
        setSnapshot(latest);
        onSnapshot?.(latest);
      },
      clamp(autoSampleInterval, 500, 10_000)
    );

    return () => clearInterval(timer);
  }, [autoSampleInterval, normalizedSignals, onSnapshot]);

  useEffect(() => {
    onSnapshot?.(snapshot);
  }, [snapshot, onSnapshot]);

  return (
    <OptimizedGlass
      role="article"
      aria-label="Neuromorphic learning network"
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-indigo-950/80 via-slate-900/60 to-slate-900/30",
        className
      )}
    >
      <header>
        <h2 className="glass-text-xl font-semibold text-primary">
          Neuromorphic Learning Network
        </h2>
        <p className="glass-text-sm text-primary/70">
          Monitor coherence between quantum-inspired spikes and adaptive
          plasticity feedback.
        </p>
      </header>

      <div className="glass-grid glass-gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["Energy Usage", snapshot.energyUsage],
            ["Coherence", snapshot.coherence],
            ["Plasticity", snapshot.plasticity],
            ["Stability", snapshot.stability],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 text-primary"
          >
            <div className="glass-flex glass-items-center glass-justify-between glass-text-xs uppercase tracking-wide text-primary/60">
              <span>{label}</span>
              <span>{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-3 h-2 glass-w-full overflow-hidden glass-radius-full glass-surface-subtle/10">
              <div
                className="glass-h-full glass-radius-full bg-gradient-to-r from-sky-400/70 to-cyan-500/80"
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="glass-text-sm font-semibold uppercase tracking-wide text-primary/60">
          Signal channels
        </h3>
        <div className="glass-grid glass-gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {normalizedSignals.map((signal) => (
            <div
              key={signal.channel}
              className="glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-4 text-primary/80"
            >
              <div className="glass-flex glass-items-center glass-justify-between glass-text-sm text-primary">
                <span className="font-semibold">{signal.channel}</span>
                <span className="glass-text-xs text-primary/60">
                  Weights {signal.weights.length}
                </span>
              </div>
              <div className="mt-3 space-y-2 glass-text-xs">
                <div className="glass-flex glass-items-center glass-justify-between text-primary/60">
                  <span>Avg Weight</span>
                  <span className="font-semibold text-primary/80">
                    {(
                      signal.weights.reduce((sum, weight) => sum + weight, 0) /
                      signal.weights.length
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="glass-flex glass-items-center glass-justify-between text-primary/60">
                  <span>Phase Alignment</span>
                  <span className="font-semibold text-primary/80">
                    {((signal.phase ?? 0.5) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </OptimizedGlass>
  );
}

export default NeuromorphicLearningNetwork;
