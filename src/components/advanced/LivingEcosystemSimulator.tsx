'use client';
import React, { useMemo } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export type EcosystemStatus = "thriving" | "stable" | "recovering" | "critical";

export interface EcosystemLayer {
  id: string;
  name: string;
  health: number;
  trend?: number;
  biodiversity?: number;
  status?: EcosystemStatus;
  description?: string;
}

export interface LivingEcosystemSimulatorProps {
  className?: string;
  title?: string;
  layers?: EcosystemLayer[];
  onSelectLayer?: (layer: EcosystemLayer) => void;
  highlightThreshold?: number;
}

const DEFAULT_LAYERS: EcosystemLayer[] = [
  {
    id: "canopy",
    name: "Canopy Habitat",
    health: 82,
    trend: 4,
    biodiversity: 0.76,
    status: "thriving",
    description: "Tree canopy health and migratory activity.",
  },
  {
    id: "understory",
    name: "Understory",
    health: 68,
    trend: 2,
    biodiversity: 0.64,
    status: "stable",
    description: "Shade adaptable flora and night fauna patterns.",
  },
  {
    id: "forest-floor",
    name: "Forest Floor",
    health: 54,
    trend: -3,
    biodiversity: 0.49,
    status: "recovering",
    description: "Nutrient cycling, soil moisture, decomposer signals.",
  },
  {
    id: "riparian",
    name: "Riparian Basin",
    health: 38,
    trend: -6,
    biodiversity: 0.41,
    status: "critical",
    description: "Water table oscillations and aquatic biomes.",
  },
];

const statusAccent: Record<EcosystemStatus, string> = {
  thriving: "glass-surface-green/40 border-green-400/40",
  stable: "glass-surface-blue/30 border-blue-400/30",
  recovering: "glass-surface-amber/30 border-amber-400/30",
  critical: "glass-surface-red/30 border-red-400/40",
};

const statusLabel: Record<EcosystemStatus, string> = {
  thriving: "Thriving",
  stable: "Stable",
  recovering: "Recovering",
  critical: "Critical",
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function LivingEcosystemSimulator({
  className,
  title = "Living Ecosystem Simulator",
  layers = DEFAULT_LAYERS,
  onSelectLayer,
  highlightThreshold = 45,
}: LivingEcosystemSimulatorProps) {
  const normalizedLayers = useMemo(() => {
    const usable = layers.length > 0 ? layers : DEFAULT_LAYERS;
    return usable.map((layer) => ({
      ...layer,
      health: clamp(layer.health),
      biodiversity:
        layer.biodiversity !== undefined
          ? Math.max(0, Math.min(1, layer.biodiversity))
          : undefined,
      status:
        layer.status ??
        (layer.health >= 75
          ? "thriving"
          : layer.health >= 55
            ? "stable"
            : layer.health >= 40
              ? "recovering"
              : "critical"),
    }));
  }, [layers]);

  const aggregate = useMemo(() => {
    const total = normalizedLayers.reduce(
      (acc, layer) => {
        acc.health += layer.health;
        acc.biodiversity += layer.biodiversity ?? 0;
        acc.count += 1;
        if (layer.status === "critical") acc.critical += 1;
        return acc;
      },
      { health: 0, biodiversity: 0, count: 0, critical: 0 }
    );
    return {
      averageHealth: total.count ? Math.round(total.health / total.count) : 0,
      averageBiodiversity: total.count ? total.biodiversity / total.count : 0,
      criticalZones: total.critical,
    };
  }, [normalizedLayers]);

  return (
    <OptimizedGlass
      role="region"
      aria-label={title}
      className={cn(
        "glass-radius-3xl glass-border glass-border-soft glass-backdrop-grid glass-p-6 space-y-6",
        "bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40",
        className
      )}
    >
      <header className="glass-flex glass-flex-wrap glass-items-end glass-justify-between glass-gap-4">
        <div>
          <h2 className='glass-text-xl glass-font-semibold glass-text-primary'>{title}</h2>
          <p className='glass-text-sm glass-text-primary-opacity-70'>
            Real-time biosphere telemetry across layered habitats.
          </p>
        </div>
        <dl className='glass-flex glass-gap-6 glass-text-sm glass-text-primary-glass-opacity-80'>
          <div>
            <dt className='glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50'>
              Avg. Health
            </dt>
            <dd className='glass-text-lg glass-font-semibold glass-text-primary'>
              {aggregate.averageHealth}%
            </dd>
          </div>
          <div>
            <dt className='glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50'>
              Bio-Diversity
            </dt>
            <dd className='glass-text-lg glass-font-semibold glass-text-primary'>
              {(aggregate.averageBiodiversity * 100).toFixed(0)}%
            </dd>
          </div>
          <div>
            <dt className='glass-uppercase glass-tracking-wide glass-text-xs glass-text-primary-glass-opacity-50'>
              Critical Zones
            </dt>
            <dd
              className={cn(
                "text-lg font-semibold",
                aggregate.criticalZones > 0 ? "text-red-400" : "text-primary"
              )}
            >
              {aggregate.criticalZones}
            </dd>
          </div>
        </dl>
      </header>

      <div className='glass-grid glass-gap-4 md:glass-grid-cols-2'>
        {normalizedLayers.map((layer) => {
          const isCritical = layer.health <= highlightThreshold;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => onSelectLayer?.(layer)}
              className={cn(
                "w-full text-left glass-radius-2xl border glass-border-soft p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 glass-focus glass-touch-target glass-contrast-guard",
                statusAccent[layer.status ?? "stable"],
                isCritical
                  ? "shadow-[0_0_30px_-10px_rgba(248,113,113,0.7)]"
                  : "hover:border-white/40",
                isCritical ? "ring-1 ring-red-400/40" : undefined
              )}
            >
              <div className="glass-flex glass-items-start glass-justify-between glass-gap-4">
                <div>
                  <h3 className='glass-text-lg glass-font-medium glass-text-primary'>
                    {layer.name}
                  </h3>
                  <p className='glass-text-xs glass-text-primary-glass-opacity-60 glass-max-w-xs'>
                    {layer.description}
                  </p>
                </div>
                <span className='glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-90'>
                  {statusLabel[layer.status ?? "stable"]}
                </span>
              </div>

              <div className='glass-mt-4 glass-space-y-3'>
                <div>
                  <div className='glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60'>
                    <span>Habitat Health</span>
                    <span
                      className={cn(
                        "font-semibold",
                        isCritical ? "text-red-300" : "text-primary"
                      )}
                    >
                      {layer.health}%
                    </span>
                  </div>
                  <div className='glass-mt-2 glass-h-2 glass-w-full glass-overflow-hidden glass-radius-full glass-surface-subtle/10'>
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isCritical ? "bg-red-400/80" : "bg-cyan-400/80"
                      )}
                      style={{ width: `${layer.health}%` }}
                    />
                  </div>
                </div>

                {layer.biodiversity !== undefined && (
                  <div className='glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-primary-glass-opacity-60'>
                    <span>Biodiversity Index</span>
                    <span className='glass-font-semibold glass-text-primary-glass-opacity-80'>
                      {(layer.biodiversity * 100).toFixed(0)}%
                    </span>
                  </div>
                )}

                {typeof layer.trend === "number" && (
                  <div className='glass-text-xs glass-text-primary-glass-opacity-60'>
                    Trend:{" "}
                    <span
                      className={
                        layer.trend >= 0 ? "text-emerald-300" : "text-red-300"
                      }
                    >
                      {layer.trend >= 0 ? "+" : ""}
                      {layer.trend}
                    </span>{" "}
                    pts
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </OptimizedGlass>
  );
}

export default LivingEcosystemSimulator;