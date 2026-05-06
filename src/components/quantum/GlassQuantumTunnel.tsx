"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { cn } from "../../lib/utilsComprehensive";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";

export interface QuantumState {
  id: string;
  label: string;
  icon?: string;
  position: { x: number; y: number; z: number };
  waveFunction: number;
  energy: number;
  barrierHeight: number;
  tunnelingProbability: number;
  isActive: boolean;
  connections: string[];
}

export interface TunnelBarrier {
  id: string;
  height: number;
  width: number;
  position: { x: number; y: number };
  transparency: number;
  quantumCoherence: number;
}

export interface QuantumTunnelTransition {
  from: string;
  to: string;
  progress: number;
  probability: number;
  startTime: number;
}

export interface QuantumTunnelParticle {
  id: string;
  x: number;
  y: number;
  energy: number;
  wavePhase: number;
  tunneling: boolean;
  targetState?: string;
}

export interface GlassQuantumTunnelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  quantumStates?: QuantumState[];
  barriers?: TunnelBarrier[];
  showWaveFunction?: boolean;
  showTunnelingProbability?: boolean;
  showEnergyLevels?: boolean;
  showBarriers?: boolean;
  animateTransitions?: boolean;
  tunnelingSpeed?: number;
  waveAmplitude?: number;
  coherenceDecay?: number;
  realTimeMode?: boolean;
  onStateTransition?: (fromId: string, toId: string) => void;
  onTunnelingEvent?: (probability: number) => void;
  className?: string;
}

const generateWaveFunction = (
  x: number,
  energy: number,
  time: number
): number => {
  const k = Math.sqrt(2 * energy); // Wave number
  const frequency = energy / (2 * Math.PI);
  return Math.sin(k * x - frequency * time);
};

const calculateTunnelingProbability = (
  energy: number,
  barrierHeight: number,
  barrierWidth: number
): number => {
  if (energy >= barrierHeight) return 1; // Classical behavior

  const kappa = Math.sqrt(2 * (barrierHeight - energy));
  return Math.exp(-2 * kappa * barrierWidth);
};

const canvasColors = {
  error: (alpha: number) => `rgba(239, 68, 68, ${alpha})`,
  info: (alpha: number) => `rgba(14, 165, 233, ${alpha})`,
  secondary: (alpha: number) => `rgba(168, 85, 247, ${alpha})`,
  white: (alpha: number) => `rgba(255, 255, 255, ${alpha})`,
  hover: "rgba(255, 255, 255, 0.22)",
};

export const GlassQuantumTunnel = forwardRef<
  HTMLDivElement,
  GlassQuantumTunnelProps
>(
  (
    {
      quantumStates = [],
      barriers = [],
      showWaveFunction = true,
      showTunnelingProbability = true,
      showEnergyLevels = true,
      showBarriers = true,
      animateTransitions = true,
      tunnelingSpeed = 1,
      waveAmplitude = 20,
      coherenceDecay = 0.02,
      realTimeMode = false,
      onStateTransition,
      onTunnelingEvent,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [activeTransitions, setActiveTransitions] = useState<
      QuantumTunnelTransition[]
    >([]);
    const [measuredStates, setMeasuredStates] = useState<Set<string>>(
      new Set()
    );
    const [quantumParticles, setQuantumParticles] = useState<
      QuantumTunnelParticle[]
    >([]);
    const id = useA11yId("glass-quantum-tunnel");
    const { shouldAnimate } = useMotionPreference();

    // Initialize quantum particles
    useEffect(() => {
      if (quantumStates.length === 0) {
        setQuantumParticles([]);
        return;
      }
      const particles = quantumStates.map((state, index) => ({
        id: `particle-${state.id}`,
        x: state.position.x,
        y: state.position.y,
        energy: state.energy,
        wavePhase: Math.random() * Math.PI * 2,
        tunneling: false,
      }));
      setQuantumParticles(particles);
    }, [quantumStates]);

    // Time evolution
    useEffect(() => {
      if (quantumStates.length === 0) return;
      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 0.1 * tunnelingSpeed);
      }, ANIMATION.DURATION.fast);
      return () => clearInterval(interval);
    }, [tunnelingSpeed, quantumStates.length]);

    // Quantum tunneling simulation
    useEffect(() => {
      if (!realTimeMode || quantumStates.length === 0) return;

      const interval = setInterval(() => {
        quantumStates.forEach((state) => {
          if (!state.isActive) return;

          state.connections.forEach((connectionId) => {
            const targetState = quantumStates.find(
              (s) => s.id === connectionId
            );
            if (!targetState) return;

            const barrier = barriers.find(
              (b) =>
                Math.abs(
                  b.position.x - (state.position.x + targetState.position.x) / 2
                ) <
                b.width / 2
            );

            let tunnelingProb = 1;
            if (barrier) {
              tunnelingProb = calculateTunnelingProbability(
                state.energy,
                barrier.height,
                barrier.width
              );
            }

            // Random tunneling events
            if (Math.random() < tunnelingProb * 0.1) {
              setActiveTransitions((prev) => [
                ...prev,
                {
                  from: state.id,
                  to: connectionId,
                  progress: 0,
                  probability: tunnelingProb,
                  startTime: currentTime,
                },
              ]);

              onTunnelingEvent?.(tunnelingProb);
              onStateTransition?.(state.id, connectionId);
            }
          });
        });
      }, ANIMATION.DURATION.slower * 3);

      return () => clearInterval(interval);
    }, [
      realTimeMode,
      quantumStates,
      barriers,
      currentTime,
      onTunnelingEvent,
      onStateTransition,
    ]);

    // Update active transitions
    useEffect(() => {
      if (quantumStates.length === 0) return;
      setActiveTransitions((prev) =>
        prev
          .map((transition) => ({
            ...transition,
            progress: Math.min(1, (currentTime - transition.startTime) / 5),
          }))
          .filter((transition) => transition.progress < 1)
      );
    }, [currentTime, quantumStates.length]);

    // Update quantum particles
    useEffect(() => {
      if (quantumStates.length === 0) return;
      setQuantumParticles((prev) =>
        prev.map((particle) => {
          const state = quantumStates.find(
            (s) => s.id === particle.id.replace("particle-", "")
          );
          if (!state) return particle;

          // Wave function evolution
          const newWavePhase = (particle.wavePhase + 0.1) % (2 * Math.PI);

          // Check for active transitions
          const activeTransition = activeTransitions.find(
            (t) => t.from === state.id && t.progress < 1
          );

          if (activeTransition) {
            const targetState = quantumStates.find(
              (s) => s.id === activeTransition.to
            );
            if (targetState) {
              return {
                ...particle,
                x:
                  state.position.x +
                  (targetState.position.x - state.position.x) *
                    activeTransition.progress,
                y:
                  state.position.y +
                  (targetState.position.y - state.position.y) *
                    activeTransition.progress,
                wavePhase: newWavePhase,
                tunneling: true,
                targetState: activeTransition.to,
              };
            }
          }

          return {
            ...particle,
            x: state.position.x,
            y: state.position.y,
            wavePhase: newWavePhase,
            tunneling: false,
            targetState: undefined,
          };
        })
      );
    }, [quantumStates, activeTransitions, currentTime]);

    // Canvas rendering
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw barriers
      if (showBarriers) {
        barriers.forEach((barrier) => {
          ctx.fillStyle = canvasColors.error(barrier.transparency);
          ctx.fillRect(
            barrier.position.x - barrier.width / 2,
            50,
            barrier.width,
            barrier.height
          );

          // Barrier label
          ctx.fillStyle = canvasColors.white(0.8);
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            `${barrier.height.toFixed(1)} eV`,
            barrier.position.x,
            45
          );
        });
      }

      // Draw energy levels
      if (showEnergyLevels) {
        quantumStates.forEach((state) => {
          const y = 200 - state.energy * 20;
          ctx.strokeStyle = canvasColors.info(0.6);
          ctx.lineWidth = 2;
          if (ctx.setLineDash) ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(state.position.x - 30, y);
          ctx.lineTo(state.position.x + 30, y);
          ctx.stroke();
          if (ctx.setLineDash) ctx.setLineDash([]);
        });
      }

      // Draw wave functions
      if (showWaveFunction) {
        quantumParticles.forEach((particle) => {
          const state = quantumStates.find(
            (s) => s.id === particle.id.replace("particle-", "")
          );
          if (!state) return;

          ctx.strokeStyle = particle.tunneling
            ? canvasColors.secondary(0.8)
            : canvasColors.info(0.6);
          ctx.lineWidth = 2;

          ctx.beginPath();
          for (let x = -50; x <= 50; x += 2) {
            const waveValue = generateWaveFunction(
              x / 10,
              state.energy,
              currentTime + particle.wavePhase
            );
            const y = state.position.y + waveValue * waveAmplitude;
            if (x === -50) {
              ctx.moveTo(particle.x + x, y);
            } else {
              ctx.lineTo(particle.x + x, y);
            }
          }
          ctx.stroke();

          // Probability density
          ctx.fillStyle = particle.tunneling
            ? canvasColors.secondary(0.2)
            : canvasColors.info(0.2);
          ctx.beginPath();
          ctx.moveTo(particle.x - 50, state.position.y);
          for (let x = -50; x <= 50; x += 2) {
            const waveValue = generateWaveFunction(
              x / 10,
              state.energy,
              currentTime + particle.wavePhase
            );
            const y =
              state.position.y + Math.abs(waveValue) * waveAmplitude * 0.5;
            ctx.lineTo(particle.x + x, y);
          }
          ctx.lineTo(particle.x + 50, state.position.y);
          ctx.closePath();
          ctx.fill();
        });
      }

      // Draw quantum particles
      quantumParticles.forEach((particle) => {
        const radius = particle.tunneling ? 8 : 6;
        const alpha = particle.tunneling ? 0.9 : 0.7;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, 2 * Math.PI);

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          radius
        );
        gradient.addColorStop(0, canvasColors.white(alpha));
        gradient.addColorStop(1, canvasColors.info(alpha * 0.3));
        ctx.fillStyle = gradient;
        ctx.fill();

        // Tunneling effect
        if (particle.tunneling) {
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius + i * 4, 0, 2 * Math.PI);
            ctx.strokeStyle = canvasColors.secondary(0.3 / i);
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw connections
      quantumStates.forEach((state) => {
        state.connections.forEach((connectionId) => {
          const targetState = quantumStates.find((s) => s.id === connectionId);
          if (!targetState) return;

          ctx.strokeStyle = canvasColors.hover;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(state.position.x, state.position.y);
          ctx.lineTo(targetState.position.x, targetState.position.y);
          ctx.stroke();
          if (ctx.setLineDash) ctx.setLineDash([]);
        });
      });
    }, [
      quantumStates,
      quantumParticles,
      barriers,
      currentTime,
      showWaveFunction,
      showEnergyLevels,
      showBarriers,
      waveAmplitude,
    ]);

    const handleStateClick = (stateId: string) => {
      setMeasuredStates((prev: Set<string>) => new Set(prev).add(stateId));
    };

    const totalTunnelingProbability = useMemo(() => {
      return (
        quantumStates.reduce(
          (sum, state) => sum + state.tunnelingProbability,
          0
        ) / quantumStates.length
      );
    }, [quantumStates]);

    return (
      <OptimizedGlass
        data-glass-component
        ref={ref}
        variant="frosted"
        className={`relative ${className}`}
        role="region"
        aria-label="Quantum tunneling visualization"
        {...props}
      >
        <div className="glass-p-6 glass-space-y-4">
          {/* Header */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <div>
              <h2 className="glass-text-xl glass-font-semibold glass-text-primary-glass-opacity-90">
                Quantum Tunnel
              </h2>
              <p className="glass-text-sm glass-text-primary-glass-opacity-60">
                {quantumStates.length} quantum states • {barriers.length}{" "}
                barriers
              </p>
            </div>

            <div className="glass-flex glass-items-center glass-space-x-4">
              <div className="glass-text-sm glass-text-primary-glass-opacity-60">
                T: {(totalTunnelingProbability * 100).toFixed(1)}%
              </div>
              {realTimeMode && (
                <div className="glass-flex glass-items-center glass-space-x-1 glass-text-primary">
                  <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full glass-animate-pulse" />
                  <span className="glass-text-xs">Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="glass-relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20"
            />

            {/* Quantum state overlays */}
            <AnimatePresence>
              {quantumStates.map((state) => (
                <motion.div
                  key={state.id}
                  className={`
                    absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2
                    ${createGlassStyle({ opacity: 0.7 }).background}
                    border border-white/20 rounded-lg p-2
                  `}
                  style={{
                    left: state.position.x,
                    top: state.position.y,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          opacity: state.isActive ? 1 : 0.5,
                          scale: measuredStates.has(state.id) ? 1.2 : 1,
                        }
                  }
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleStateClick(state.id)}
                  transition={
                    shouldAnimate
                      ? { duration: ANIMATION.DURATION.normal / 1000 }
                      : { duration: 0 }
                  }
                >
                  <div className="glass-flex glass-items-center glass-space-x-2">
                    {state.icon && (
                      <span className="glass-text-lg">{state.icon}</span>
                    )}
                    <div>
                      <div className="glass-text-sm glass-font-medium glass-text-primary-glass-opacity-90">
                        {state.label}
                      </div>
                      {showTunnelingProbability && (
                        <div className="glass-text-xs glass-text-primary-glass-opacity-60">
                          T: {(state.tunnelingProbability * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {measuredStates.has(state.id) && (
                    <motion.div
                      className="glass-absolute glass-top-1 glass--right-1 glass-w-3 glass-h-3 glass-surface-green glass-radius-full"
                      initial={{ scale: 0 }}
                      animate={prefersReducedMotion ? {} : { scale: 1 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: ANIMATION.DURATION.fast / 1000 }
                      }
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Active transitions */}
            <AnimatePresence>
              {activeTransitions.map((transition) => {
                const fromState = quantumStates.find(
                  (s) => s.id === transition.from
                );
                const toState = quantumStates.find(
                  (s) => s.id === transition.to
                );
                if (!fromState || !toState) return null;

                const x =
                  fromState.position.x +
                  (toState.position.x - fromState.position.x) *
                    transition.progress;
                const y =
                  fromState.position.y +
                  (toState.position.y - fromState.position.y) *
                    transition.progress;

                return (
                  <motion.div
                    key={`${transition.from}-${transition.to}-${transition.startTime}`}
                    className="glass-absolute glass-pointer-events-none"
                    style={{
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                      prefersReducedMotion ? {} : { opacity: 1, scale: 1 }
                    }
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className="glass-w-4 glass-h-4 glass-surface-pink glass-radius-full glass-shadow-lg glass-animate-pulse" />
                    <div className="glass-absolute glass--bottom-8 glass--left-1-2 glass-transform glass--translate-x-1-2 glass-text-xs glass-text-pink-300 glass-whitespace-nowrap">
                      Tunneling: {(transition.probability * 100).toFixed(1)}%
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <div className="glass-flex glass-items-center glass-space-x-4">
              <button
                onClick={() => setMeasuredStates(new Set())}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors duration-[${ANIMATION.DURATION.fast}ms]
                  ${createGlassStyle({ opacity: 0.7 }).background}
                  border border-white/20 text-white/70 hover:text-white
                `}
              >
                Reset Measurements
              </button>
            </div>

            <div className="glass-flex glass-items-center glass-space-x-6 glass-text-sm glass-text-primary-glass-opacity-60">
              <div>Time: {currentTime.toFixed(1)}</div>
              <div>Active: {activeTransitions.length}</div>
              <div>Measured: {measuredStates.size}</div>
            </div>
          </div>

          {/* Quantum statistics */}
          <div
            className={`
            p-4 rounded-lg border border-white/10 space-y-3
            ${createGlassStyle({ opacity: 0.7 }).background}
          `}
          >
            <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-90">
              Quantum Statistics
            </h3>

            <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm">
              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Avg Tunneling:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {(totalTunnelingProbability * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Wave Coherence:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {(Math.cos(currentTime * 0.5) * 50 + 50).toFixed(0)}%
                </div>
              </div>

              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Energy Spread:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {quantumStates.length > 0
                    ? (
                        Math.max(...quantumStates.map((s) => s.energy)) -
                        Math.min(...quantumStates.map((s) => s.energy))
                      ).toFixed(1)
                    : "0"}{" "}
                  eV
                </div>
              </div>

              <div>
                <span className="glass-text-primary-glass-opacity-60">
                  Barrier Count:
                </span>
                <div className="glass-text-primary-glass-opacity-90 glass-font-medium">
                  {barriers.length}
                </div>
              </div>
            </div>

            {/* Recent tunneling events */}
            {activeTransitions.length > 0 && (
              <div className="glass-space-y-1">
                <span className="glass-text-primary-glass-opacity-60 glass-text-sm">
                  Active Tunneling:
                </span>
                <div className="glass-flex glass-flex-wrap glass-gap-1">
                  {activeTransitions.slice(-3).map((transition, index) => (
                    <div
                      key={index}
                      className="glass-px-2 glass-py-1 glass-text-xs glass-surface-pink/20 glass-text-pink-300 glass-radius glass-border glass-border-pink-400/20"
                    >
                      {transition.from} → {transition.to} (
                      {(transition.probability * 100).toFixed(0)}%)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </OptimizedGlass>
    );
  }
);

GlassQuantumTunnel.displayName = "GlassQuantumTunnel";
