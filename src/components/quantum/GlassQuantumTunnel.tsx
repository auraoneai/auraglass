import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { cn } from "../../lib/utilsComprehensive";

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

export interface GlassQuantumTunnelProps {
  quantumStates: QuantumState[];
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

export const GlassQuantumTunnel = forwardRef<
  HTMLDivElement,
  GlassQuantumTunnelProps
>(
  (
    {
      quantumStates,
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
      Array<{
        from: string;
        to: string;
        progress: number;
        probability: number;
        startTime: number;
      }>
    >([]);
    const [measuredStates, setMeasuredStates] = useState<Set<string>>(
      new Set()
    );
    const [quantumParticles, setQuantumParticles] = useState<
      Array<{
        id: string;
        x: number;
        y: number;
        energy: number;
        wavePhase: number;
        tunneling: boolean;
        targetState?: string;
      }>
    >([]);
    const id = useA11yId("glass-quantum-tunnel");
    const { shouldAnimate } = useMotionPreference();

    // Initialize quantum particles
    useEffect(() => {
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
      const interval = setInterval(() => {
        setCurrentTime((prev: any) => prev + 0.1 * tunnelingSpeed);
      }, 16);
      return () => clearInterval(interval);
    }, [tunnelingSpeed]);

    // Quantum tunneling simulation
    useEffect(() => {
      if (!realTimeMode) return;

      const interval = setInterval(() => {
        quantumStates.forEach((state: any) => {
          if (!state.isActive) return;

          state.connections.forEach((connectionId: any) => {
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
              setActiveTransitions((prev: any) => [
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
      }, 2000);

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
      setActiveTransitions((prev: any) =>
        prev
          .map((transition: any) => ({
            ...transition,
            progress: Math.min(1, (currentTime - transition.startTime) / 5),
          }))
          .filter((transition: any) => transition.progress < 1)
      );
    }, [currentTime]);

    // Update quantum particles
    useEffect(() => {
      setQuantumParticles((prev: any) =>
        prev.map((particle: any) => {
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
        barriers.forEach((barrier: any) => {
          ctx.fillStyle = `rgba(255, 100, 100, ${barrier.transparency})`;
          ctx.fillRect(
            barrier.position.x - barrier.width / 2,
            50,
            barrier.width,
            barrier.height
          );

          // Barrier label
          ctx.fillStyle =
            "rgba(var(--glass-color-white) / var(--glass-opacity-80))";
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
        quantumStates.forEach((state: any) => {
          const y = 200 - state.energy * 20;
          ctx.strokeStyle = "rgba(100, 200, 255, 0.6)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(state.position.x - 30, y);
          ctx.lineTo(state.position.x + 30, y);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      // Draw wave functions
      if (showWaveFunction) {
        quantumParticles.forEach((particle: any) => {
          const state = quantumStates.find(
            (s) => s.id === particle.id.replace("particle-", "")
          );
          if (!state) return;

          ctx.strokeStyle = particle.tunneling
            ? "rgba(255, 100, 255, 0.8)"
            : "rgba(100, 150, 255, 0.6)";
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
            ? "rgba(255, 100, 255, 0.2)"
            : "rgba(100, 150, 255, 0.2)";
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
      quantumParticles.forEach((particle: any) => {
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
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(1, `rgba(100, 150, 255, ${alpha * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Tunneling effect
        if (particle.tunneling) {
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius + i * 4, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(255, 100, 255, ${0.3 / i})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw connections
      quantumStates.forEach((state: any) => {
        state.connections.forEach((connectionId: any) => {
          const targetState = quantumStates.find((s) => s.id === connectionId);
          if (!targetState) return;

          ctx.strokeStyle = "var(--glass-bg-hover)";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(state.position.x, state.position.y);
          ctx.lineTo(targetState.position.x, targetState.position.y);
          ctx.stroke();
          ctx.setLineDash([]);
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
        ref={ref}
        variant="frosted"
        className={`relative ${className}`}
        {...props}
      >
        <div className="glass-p-6 space-y-4">
          {/* Header */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <div>
              <h2 className="glass-text-xl font-semibold text-primary/90">
                Quantum Tunnel
              </h2>
              <p className="glass-text-sm text-primary/60">
                {quantumStates.length} quantum states • {barriers.length}{" "}
                barriers
              </p>
            </div>

            <div className="glass-flex glass-items-center space-x-4">
              <div className="glass-text-sm text-primary/60">
                T: {(totalTunnelingProbability * 100).toFixed(1)}%
              </div>
              {realTimeMode && (
                <div className="glass-flex glass-items-center space-x-1 text-primary">
                  <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
                  <span className="glass-text-xs">Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="glass-border glass-border-white/20 glass-radius-lg glass-surface-dark/20"
            />

            {/* Quantum state overlays */}
            <AnimatePresence>
              {quantumStates.map((state: any) => (
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
                    shouldAnimate ? { duration: 0.3 } : { duration: 0 }
                  }
                >
                  <div className="glass-flex glass-items-center space-x-2">
                    {state.icon && (
                      <span className="glass-text-lg">{state.icon}</span>
                    )}
                    <div>
                      <div className="glass-text-sm font-medium text-primary/90">
                        {state.label}
                      </div>
                      {showTunnelingProbability && (
                        <div className="glass-text-xs text-primary/60">
                          T: {(state.tunnelingProbability * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>

                  {measuredStates.has(state.id) && (
                    <motion.div
                      className="absolute glass-top-1 -right-1 w-3 h-3 glass-surface-green glass-radius-full"
                      initial={{ scale: 0 }}
                      animate={prefersReducedMotion ? {} : { scale: 1 }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { duration: 0.2 }
                      }
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Active transitions */}
            <AnimatePresence>
              {activeTransitions.map((transition: any) => {
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
                    className="absolute pointer-events-none"
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
                    <div className="w-4 h-4 bg-pink-400 glass-radius-full glass-shadow-lg animate-pulse" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 glass-text-xs text-pink-300 whitespace-nowrap">
                      Tunneling: {(transition.probability * 100).toFixed(1)}%
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="glass-flex glass-items-center glass-justify-between">
            <div className="glass-flex glass-items-center space-x-4">
              <button
                onClick={() => setMeasuredStates(new Set())}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors duration-200
                  ${createGlassStyle({ opacity: 0.7 }).background}
                  border border-white/20 text-white/70 hover:text-white
                `}
              >
                Reset Measurements
              </button>
            </div>

            <div className="glass-flex glass-items-center space-x-6 glass-text-sm text-primary/60">
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
            <h3 className="glass-text-sm font-semibold text-primary/90">
              Quantum Statistics
            </h3>

            <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4 glass-text-sm">
              <div>
                <span className="text-primary/60">Avg Tunneling:</span>
                <div className="text-primary/90 font-medium">
                  {(totalTunnelingProbability * 100).toFixed(1)}%
                </div>
              </div>

              <div>
                <span className="text-primary/60">Wave Coherence:</span>
                <div className="text-primary/90 font-medium">
                  {(Math.cos(currentTime * 0.5) * 50 + 50).toFixed(0)}%
                </div>
              </div>

              <div>
                <span className="text-primary/60">Energy Spread:</span>
                <div className="text-primary/90 font-medium">
                  {quantumStates.length > 0
                    ? (
                        Math.max(...quantumStates.map((s: any) => s.energy)) -
                        Math.min(...quantumStates.map((s: any) => s.energy))
                      ).toFixed(1)
                    : "0"}{" "}
                  eV
                </div>
              </div>

              <div>
                <span className="text-primary/60">Barrier Count:</span>
                <div className="text-primary/90 font-medium">
                  {barriers.length}
                </div>
              </div>
            </div>

            {/* Recent tunneling events */}
            {activeTransitions.length > 0 && (
              <div className="space-y-1">
                <span className="text-primary/60 glass-text-sm">
                  Active Tunneling:
                </span>
                <div className="glass-flex glass-flex-wrap glass-gap-1">
                  {activeTransitions.slice(-3).map((transition, index) => (
                    <div
                      key={index}
                      className="glass-px-2 glass-py-1 glass-text-xs bg-pink-500/20 text-pink-300 glass-radius glass-border glass-border-pink-400/20"
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
