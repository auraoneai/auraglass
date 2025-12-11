"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { cn } from "../../lib/utilsComprehensive";
import { ANIMATION, COLORS } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

export interface CoherenceData {
  timestamp: number;
  coherence: number;
  phase: number;
  amplitude: number;
  frequency: number;
  decoherenceRate: number;
  entanglementStrength?: number;
}

export interface GlassCoherenceIndicatorProps {
  coherenceLevel: number;
  phase?: number;
  decoherenceRate?: number;
  entanglementStrength?: number;
  historicalData?: CoherenceData[];
  showPhaseIndicator?: boolean;
  showWaveVisualization?: boolean;
  showDecoherenceRate?: boolean;
  showEntanglement?: boolean;
  realTimeMode?: boolean;
  coherenceThreshold?: number;
  alertOnDecoherence?: boolean;
  animationSpeed?: number;
  onCoherenceLoss?: (coherenceLevel: number) => void;
  onPhaseChange?: (phase: number) => void;
  className?: string;
}

const phaseColors = {
  0: "var(--glass-color-error)", // 0°
  90: "var(--glass-color-info)", // 90°
  180: "var(--glass-color-primary)", // 180°
  270: "var(--glass-color-success)", // 270°
};

const getPhaseColor = (phase: number): string => {
  const normalizedPhase = ((phase % (2 * Math.PI)) / (2 * Math.PI)) * 360;

  if (normalizedPhase < 45 || normalizedPhase >= 315) return phaseColors[0];
  if (normalizedPhase < 135) return phaseColors[90];
  if (normalizedPhase < 225) return phaseColors[180];
  return phaseColors[270];
};

export const GlassCoherenceIndicator = forwardRef<
  HTMLDivElement,
  GlassCoherenceIndicatorProps
>(
  (
    {
      coherenceLevel,
      phase = 0,
      decoherenceRate = 0.02,
      entanglementStrength = 0,
      historicalData = [],
      showPhaseIndicator = true,
      showWaveVisualization = true,
      showDecoherenceRate = true,
      showEntanglement = true,
      realTimeMode = false,
      coherenceThreshold = 0.3,
      alertOnDecoherence = true,
      animationSpeed = 1,
      onCoherenceLoss,
      onPhaseChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [currentCoherence, setCurrentCoherence] = useState(coherenceLevel);
    const [currentPhase, setCurrentPhase] = useState(phase);
    const [animationTime, setAnimationTime] = useState(0);
    const [isDecohering, setIsDecohering] = useState(false);
    const [coherenceHistory, setCoherenceHistory] =
      useState<CoherenceData[]>(historicalData);
    const id = useA11yId("glass-coherence-indicator");
    const { shouldAnimate } = useMotionPreference();

    // Real-time coherence simulation
    useEffect(() => {
      if (!realTimeMode) return;

      const interval = setInterval(() => {
        setCurrentCoherence((prev: any) => {
          const noise = (Math.random() - 0.5) * 0.1;
          const decay = prev * (1 - decoherenceRate);
          const newCoherence = Math.max(0, Math.min(1, decay + noise));

          if (newCoherence < coherenceThreshold && prev >= coherenceThreshold) {
            setIsDecohering(true);
            if (alertOnDecoherence) {
              onCoherenceLoss?.(newCoherence);
            }
          } else if (newCoherence >= coherenceThreshold) {
            setIsDecohering(false);
          }

          return newCoherence;
        });

        setCurrentPhase((prev: any) => {
          const newPhase = (prev + 0.1 * animationSpeed) % (2 * Math.PI);
          onPhaseChange?.(newPhase);
          return newPhase;
        });

        setAnimationTime((prev: any) => prev + 0.1 * animationSpeed);
      }, 100);

      return () => clearInterval(interval);
    }, [
      realTimeMode,
      decoherenceRate,
      coherenceThreshold,
      alertOnDecoherence,
      animationSpeed,
      onCoherenceLoss,
      onPhaseChange,
    ]);

    // Update historical data
    useEffect(() => {
      if (realTimeMode) {
        const newDataPoint: CoherenceData = {
          timestamp: Date.now(),
          coherence: currentCoherence,
          phase: currentPhase,
          amplitude: currentCoherence,
          frequency: 1.0,
          decoherenceRate,
          entanglementStrength,
        };

        setCoherenceHistory(
          (prev: any) => [...prev.slice(-49), newDataPoint] // Keep last 50 points
        );
      }
    }, [
      currentCoherence,
      currentPhase,
      realTimeMode,
      decoherenceRate,
      entanglementStrength,
    ]);

    const coherenceStatus = useMemo(() => {
      if (currentCoherence >= 0.8)
        return {
          label: "Highly Coherent",
          color: "var(--glass-color-success)",
        };
      if (currentCoherence >= 0.5)
        return {
          label: "Moderately Coherent",
          color: "var(--glass-color-warning)",
        };
      if (currentCoherence >= 0.2)
        return { label: "Low Coherence", color: "var(--glass-color-danger)" };
      return { label: "Decoherent", color: "var(--glass-color-danger)" };
    }, [currentCoherence]);

    const WaveVisualization = () => {
      const points = 100;
      const waveData = useMemo(() => {
        return Array.from({ length: points }, (_, i) => {
          const x = (i / points) * 4 * Math.PI;
          const amplitude = currentCoherence;
          const wave1 = amplitude * Math.sin(x + currentPhase);
          const wave2 =
            entanglementStrength *
            amplitude *
            Math.sin(x + currentPhase + Math.PI / 2);
          return {
            x: (i / points) * 300,
            y1: 50 + wave1 * 30,
            y2: 50 + wave2 * 20,
            combined: 50 + (wave1 + wave2 * 0.5) * 25,
          };
        });
      }, [currentCoherence, currentPhase, entanglementStrength, points]);

      return (
        <svg
          width="300"
          height="100"
          className={cn(
            "glass-border glass-border-primary glass-radius glass-surface-dark"
          )}
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="var(--glass-bg-default)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Center line */}
          <line
            x1="0"
            y1="50"
            x2="300"
            y2="50"
            stroke="var(--glass-bg-hover)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {/* Primary wave */}
          <path
            d={`M ${waveData.map((p: any) => `${p.x} ${p.y1}`).join(" L ")}`}
            fill="none"
            stroke={getPhaseColor(currentPhase)}
            strokeWidth="2"
            opacity={currentCoherence}
          />

          {/* Entangled wave */}
          {entanglementStrength > 0 && (
            <path
              d={`M ${waveData.map((p: any) => `${p.x} ${p.y2}`).join(" L ")}`}
              fill="none"
              stroke="var(--glass-color-secondary)"
              strokeWidth="1.5"
              opacity={entanglementStrength * 0.8}
              strokeDasharray="3,3"
            />
          )}

          {/* Combined interference pattern */}
          {entanglementStrength > 0.3 && (
            <path
              d={`M ${waveData.map((p: any) => `${p.x} ${p.combined}`).join(" L ")}`}
              fill="none"
              stroke="var(--glass-white)"
              strokeWidth="1"
              opacity={0.6}
            />
          )}

          {/* Decoherence visualization */}
          {isDecohering && (
            <g opacity="0.7">
              {Array.from({ length: 20 }, (_, i) => (
                <circle
                  key={i}
                  cx={Math.random() * 300}
                  cy={Math.random() * 100}
                  r={Math.random() * 3 + 1}
                  fill="var(--glass-color-danger)"
                  opacity={Math.random() * 0.8}
                >
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur={`${1 + Math.random()}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>
      );
    };

    const PhaseIndicator = () => (
      <div className={cn("glass-relative glass-w-24 glass-h-24")}>
        <svg
          width="96"
          height="96"
          className={cn("glass-absolute glass-inset-0")}
        >
          {/* Outer circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="var(--glass-bg-hover)"
            strokeWidth="2"
          />

          {/* Phase markers */}
          {[0, 90, 180, 270].map((angle: any) => (
            <g key={angle}>
              <line
                x1={48 + Math.cos((angle * Math.PI) / 180) * 35}
                y1={48 + Math.sin((angle * Math.PI) / 180) * 35}
                x2={48 + Math.cos((angle * Math.PI) / 180) * 42}
                y2={48 + Math.sin((angle * Math.PI) / 180) * 42}
                stroke="var(--glass-border-hover)"
                strokeWidth="2"
              />
              <text
                x={48 + Math.cos((angle * Math.PI) / 180) * 30}
                y={48 + Math.sin((angle * Math.PI) / 180) * 30 + 3}
                textAnchor="middle"
                fontSize="10"
                fill="color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)"
              >
                {angle}°
              </text>
            </g>
          ))}

          {/* Phase vector */}
          <motion.line
            x1="48"
            y1="48"
            x2={
              48 +
              Math.cos(currentPhase - Math.PI / 2) * (30 * currentCoherence)
            }
            y2={
              48 +
              Math.sin(currentPhase - Math.PI / 2) * (30 * currentCoherence)
            }
            stroke={getPhaseColor(currentPhase)}
            strokeWidth="3"
            strokeLinecap="round"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    x2:
                      48 +
                      Math.cos(currentPhase - Math.PI / 2) *
                        (30 * currentCoherence),
                    y2:
                      48 +
                      Math.sin(currentPhase - Math.PI / 2) *
                        (30 * currentCoherence),
                  }
            }
            transition={
              shouldAnimate
                ? { duration: ANIMATION.DURATION.fast / 1000 }
                : { duration: 0 }
            }
          />

          {/* Center dot */}
          <circle cx="48" cy="48" r="3" fill={getPhaseColor(currentPhase)} />
        </svg>

        <div
          className={cn(
            "glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center"
          )}
        >
          <div className={cn("glass-text-center")}>
            <div
              className={cn(
                "glass-text-xs glass-text-primary glass-font-medium"
              )}
            >
              {((currentPhase * 180) / Math.PI).toFixed(0)}°
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        variant="frosted"
        className={cn("glass-p-4 glass-space-y-4", className)}
        {...props}
      >
        {/* Header */}
        <div
          className={cn("glass-flex glass-items-center glass-justify-between")}
        >
          <div>
            <h3
              className={cn(
                "glass-text-lg glass-font-semibold glass-text-primary"
              )}
            >
              Quantum Coherence
            </h3>
            <p className={cn("glass-text-sm glass-text-secondary")}>
              {coherenceStatus.label}
            </p>
          </div>

          <div className={cn("glass-flex glass-items-center glass-space-x-4")}>
            {isDecohering && alertOnDecoherence && (
              <motion.div
                className={cn(
                  "glass-flex glass-items-center glass-space-x-1 glass-text-danger"
                )}
                animate={prefersReducedMotion ? {} : { opacity: [1, 0.5, 1] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: ANIMATION.DURATION.slower / 1000,
                        repeat: Infinity,
                      }
                }
              >
                <span>⚠️</span>
                <span className={cn("glass-text-xs glass-font-medium")}>
                  Decoherence
                </span>
              </motion.div>
            )}

            {realTimeMode && (
              <div
                className={cn(
                  "glass-flex glass-items-center glass-space-x-1 glass-text-success"
                )}
              >
                <div
                  className={cn(
                    "glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"
                  )}
                />
                <span className={cn("glass-text-xs")}>Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Main coherence display */}
        <div className={cn("glass-flex glass-items-center glass-space-x-6")}>
          {/* Coherence level */}
          <div className={cn("glass-flex-1")}>
            <div
              className={cn(
                "glass-flex glass-items-center glass-justify-between glass-mb-2"
              )}
            >
              <span className={cn("glass-text-sm glass-text-primary")}>
                Coherence Level
              </span>
              <span
                className={cn(
                  "glass-text-sm glass-font-medium glass-text-primary"
                )}
              >
                {(currentCoherence * 100).toFixed(1)}%
              </span>
            </div>

            <div
              className={cn(
                "glass-relative glass-h-4 glass-surface-subtle glass-radius-full glass-overflow-hidden"
              )}
            >
              <motion.div
                className={cn("glass-h-full glass-radius-full")}
                style={{
                  background: `linear-gradient(90deg, ${coherenceStatus.color} 0%, ${coherenceStatus.color}80 100%)`,
                }}
                animate={{
                  width: `${currentCoherence * 100}%`,
                }}
                transition={
                  shouldAnimate
                    ? { duration: ANIMATION.DURATION.normal / 1000 }
                    : { duration: 0 }
                }
              />

              {/* Coherence threshold indicator */}
              <div
                className={cn(
                  "glass-absolute glass-top-0 glass-h-full glass-w-0.5 glass-surface-muted"
                )}
                style={{ left: `${coherenceThreshold * 100}%` }}
              />
            </div>

            <div
              className={cn(
                "glass-flex glass-justify-between glass-mt-1 glass-text-xs glass-text-muted"
              )}
            >
              <span>0%</span>
              <span>Threshold ({(coherenceThreshold * 100).toFixed(0)}%)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Phase indicator */}
          {showPhaseIndicator && <PhaseIndicator />}
        </div>

        {/* Wave visualization */}
        {showWaveVisualization && (
          <div>
            <h4
              className={cn(
                "glass-text-sm glass-font-medium glass-text-primary glass-mb-2"
              )}
            >
              Wave Function
            </h4>
            <WaveVisualization />
          </div>
        )}

        {/* Statistics */}
        <div
          className={cn(
            "glass-p-3 glass-radius-lg glass-border glass-border-subtle glass-space-y-2",
            createGlassStyle({ blur: "sm", opacity: 0.6 }).background
          )}
        >
          <div
            className={cn(
              "glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm"
            )}
          >
            <div>
              <span className={cn("glass-text-secondary")}>Phase:</span>
              <div className={cn("glass-text-primary glass-font-medium")}>
                {((currentPhase * 180) / Math.PI).toFixed(1)}°
              </div>
            </div>

            {showDecoherenceRate && (
              <div>
                <span className={cn("glass-text-secondary")}>Decoherence:</span>
                <div className={cn("glass-text-primary glass-font-medium")}>
                  {(decoherenceRate * 100).toFixed(2)}%/s
                </div>
              </div>
            )}

            {showEntanglement && entanglementStrength > 0 && (
              <div>
                <span className={cn("glass-text-secondary")}>
                  Entanglement:
                </span>
                <div className={cn("glass-text-primary glass-font-medium")}>
                  {(entanglementStrength * 100).toFixed(0)}%
                </div>
              </div>
            )}

            <div>
              <span className={cn("glass-text-secondary")}>Status:</span>
              <div
                className={cn("glass-font-medium")}
                style={{ color: coherenceStatus.color }}
              >
                {currentCoherence >= coherenceThreshold ? "Stable" : "Unstable"}
              </div>
            </div>
          </div>

          {/* Historical data summary */}
          {coherenceHistory.length > 10 && (
            <div
              className={cn("glass-pt-2 glass-border-t glass-border-subtle")}
            >
              <div
                className={cn(
                  "glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-secondary"
                )}
              >
                <span>Avg Coherence (1m):</span>
                <span>
                  {(
                    (coherenceHistory
                      .slice(-10)
                      .reduce((sum, d) => sum + d.coherence, 0) /
                      10) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      </OptimizedGlass>
    );
  }
);
