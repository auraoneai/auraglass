"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { cn } from "../../lib/utilsComprehensive";

export interface QuantumMenuState {
  id: string;
  label: string;
  icon?: string;
  probability: number;
  energy: number;
  coherence: number;
  entangled?: string[];
  subStates?: QuantumMenuState[];
}

export interface QuantumMenuInteraction {
  type: string;
  stateId: string;
  timestamp: number;
  probability: number;
}

interface WavePoint {
  x: number;
  y: number;
}

export interface GlassSuperpositionalMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  menuStates?: QuantumMenuState[];
  isObserved?: boolean;
  measurementType?: "collapse" | "decoherence" | "interference";
  coherenceDecay?: number;
  entanglementStrength?: number;
  visualizeWaveFunction?: boolean;
  showProbabilities?: boolean;
  showQuantumNoise?: boolean;
  maxSuperpositions?: number;
  onStateCollapse?: (stateId: string) => void;
  onMeasurement?: (states: QuantumMenuState[]) => void;
  onEntanglement?: (stateIds: string[]) => void;
  className?: string;
}

const quantumColors = {
  superposition: "rgba(51, 65, 85, 0.72)",
  entangled: "rgba(100, 116, 139, 0.72)",
  collapsed: "rgba(30, 41, 59, 0.82)",
  decoherent: "rgba(100, 116, 139, 0.68)",
  interference: "rgba(71, 85, 105, 0.70)",
};

const menuGlassStyle: React.CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.105) 0%, rgba(255,255,255,0.035) 52%, rgba(255,255,255,0.018) 100%)",
  backgroundColor: "rgba(255,255,255,0.018)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "var(--glass-theme-text, var(--glass-text-primary))",
  backdropFilter: "blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",
  WebkitBackdropFilter:
    "blur(24px) saturate(1.5) brightness(1.06) contrast(1.04)",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
};

const wavePatterns = {
  sine: (t: number, frequency: number) => Math.sin(t * frequency),
  cosine: (t: number, frequency: number) => Math.cos(t * frequency),
  complex: (t: number, frequency: number) =>
    Math.sin(t * frequency) * Math.cos((t * frequency) / 2),
  damped: (t: number, frequency: number) =>
    Math.sin(t * frequency) * Math.exp(-t * 0.1),
};

export const GlassSuperpositionalMenu = forwardRef<
  HTMLDivElement,
  GlassSuperpositionalMenuProps
>(
  (
    {
      menuStates = [],
      isObserved = false,
      measurementType = "collapse",
      coherenceDecay = 0.02,
      entanglementStrength = 0.5,
      visualizeWaveFunction = true,
      showProbabilities = true,
      showQuantumNoise = true,
      maxSuperpositions = 8,
      onStateCollapse,
      onMeasurement,
      onEntanglement,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [currentStates, setCurrentStates] =
      useState<QuantumMenuState[]>(menuStates);
    const [measurementTime, setMeasurementTime] = useState<number | null>(null);
    const [collapsedState, setCollapsedState] = useState<string | null>(null);
    const [quantumTime, setQuantumTime] = useState(0);
    const [interactionHistory, setInteractionHistory] = useState<
      QuantumMenuInteraction[]
    >([]);
    const id = useA11yId("glass-superposition-menu");

    // Motion preference hook
    const { shouldAnimate } = useMotionPreference();

    // Helper function to respect motion preferences
    const respectMotionPreference = (config: Transition): Transition =>
      shouldAnimate ? config : { duration: 0 };

    // Quantum time evolution
    useEffect(() => {
      const interval = setInterval(() => {
        setQuantumTime((prev) => prev + 0.1);
      }, 16);
      return () => clearInterval(interval);
    }, []);

    // Coherence decay simulation
    useEffect(() => {
      if (isObserved || collapsedState) return;

      const interval = setInterval(() => {
        setCurrentStates((prev) =>
          prev
            .map((state) => ({
              ...state,
              coherence: Math.max(0, state.coherence - coherenceDecay),
              probability:
                state.coherence > 0.1
                  ? state.probability + (Math.random() - 0.5) * 0.02
                  : state.probability * 0.98,
            }))
            .map((state) => ({
              ...state,
              probability: Math.max(0.01, Math.min(1, state.probability)),
            }))
        );
      }, 100);

      return () => clearInterval(interval);
    }, [isObserved, collapsedState, coherenceDecay]);

    // Normalize probabilities to ensure they sum to 1
    useEffect(() => {
      const totalProb = currentStates.reduce(
        (sum, state) => sum + state.probability,
        0
      );
      if (totalProb > 0) {
        setCurrentStates((prev) =>
          prev.map((state) => ({
            ...state,
            probability: state.probability / totalProb,
          }))
        );
      }
    }, [currentStates.length]);

    const performMeasurement = (targetStateId?: string) => {
      setMeasurementTime(Date.now());

      let selectedState: QuantumMenuState;

      if (targetStateId) {
        selectedState = currentStates.find((s) => s.id === targetStateId)!;
      } else {
        // Quantum measurement based on probability amplitudes
        const random = Math.random();
        let cumulativeProb = 0;

        selectedState =
          currentStates.find((state) => {
            cumulativeProb += state.probability * state.probability; // |ψ|²
            return random <= cumulativeProb;
          }) || currentStates[0];
      }

      if (measurementType === "collapse") {
        setCollapsedState(selectedState.id);
        setCurrentStates([
          {
            ...selectedState,
            probability: 1,
            coherence: 0,
          },
        ]);
      }

      setInteractionHistory((prev) => [
        ...prev,
        {
          type: "measurement",
          stateId: selectedState.id,
          timestamp: Date.now(),
          probability: selectedState.probability,
        },
      ]);

      onStateCollapse?.(selectedState.id);
      onMeasurement?.(currentStates);
    };

    const createEntanglement = (stateIds: string[]) => {
      setCurrentStates((prev) =>
        prev.map((state) => {
          if (stateIds.includes(state.id)) {
            return {
              ...state,
              entangled: stateIds.filter((id) => id !== state.id),
              coherence: Math.min(1, state.coherence + 0.2),
            };
          }
          return state;
        })
      );

      onEntanglement?.(stateIds);
    };

    const getStateOpacity = (state: QuantumMenuState) => {
      if (collapsedState) {
        return state.id === collapsedState ? 1 : 0.1;
      }
      return 1;
    };

    const getQuantumPhase = (state: QuantumMenuState) => {
      return (
        quantumTime * (1 + state.energy * 0.5) + state.probability * Math.PI
      );
    };

    const WaveFunction = ({
      state,
      index,
    }: {
      state: QuantumMenuState;
      index: number;
    }) => {
      const points = useMemo(() => {
        const numPoints = 50;
        const amplitude = state.probability * 20;
        const frequency = 0.5 + state.energy * 0.3;
        const phase = getQuantumPhase(state);

        return Array.from({ length: numPoints }, (_, i): WavePoint => {
          const t = (i / numPoints) * 4 * Math.PI;
          const y = amplitude * wavePatterns.complex(t + phase, frequency);
          return { x: (i / numPoints) * 200, y: y + 25 };
        });
      }, [state, quantumTime]);

      return (
        <svg
          className="glass-w-full glass-h-full glass-pointer-events-none"
          viewBox="0 0 200 50"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={`M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            stroke={
              state.entangled?.length
                ? quantumColors.entangled
                : quantumColors.superposition
            }
            strokeWidth="2"
            fill="none"
            opacity={state.coherence * 0.6}
            strokeDasharray={state.coherence < 0.5 ? "5,5" : "none"}
          />

          {/* Probability density */}
          <path
            d={`M ${points.map((p) => `${p.x} ${25 + Math.abs(p.y - 25) * 0.3}`).join(" L ")}`}
            fill={
              state.entangled?.length
                ? quantumColors.entangled
                : quantumColors.superposition
            }
            opacity={state.probability * 0.2}
          />
        </svg>
      );
    };

    const QUANTUM_NOISE_POINTS = Array.from({ length: 20 }, (_, i) => ({
      left: (i * 13) % 100,
      top: (i * 29) % 100,
      delay: (i * 37) % 3,
    }));

    const QuantumNoise = () => (
      <div
        className={cn("glass-absolute glass-inset-0 glass-pointer-events-none")}
      >
        {QUANTUM_NOISE_POINTS.map((point, i) => (
          <motion.div
            key={i}
            className={cn(
              "glass-absolute glass-w-1 glass-h-1 glass-surface-muted glass-radius-full"
            )}
            style={{
              left: `${point.left}%`,
              top: `${point.top}%`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    opacity: [0.1, 0.5, 0.1],
                    scale: [0.5, 1, 0.5],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 3,
                    repeat: Infinity,
                    delay: point.delay,
                  }
            }
          />
        ))}
      </div>
    );

    const EntanglementLines = () => (
      <svg
        className={cn("glass-absolute glass-inset-0 glass-pointer-events-none")}
        data-glass-overlay="true"
        style={{ zIndex: 0, opacity: 0.18 }}
      >
        {currentStates
          .map((state) =>
            state.entangled?.map((entangledId) => {
              const entangledState = currentStates.find(
                (s) => s.id === entangledId
              );
              if (!entangledState) return null;

              const startIndex = currentStates.indexOf(state);
              const endIndex = currentStates.indexOf(entangledState);

              const startY = startIndex * 80 + 40;
              const endY = endIndex * 80 + 40;

              return (
                <motion.line
                  key={`${state.id}-${entangledId}`}
                  x1="50"
                  y1={startY}
                  x2="150"
                  y2={endY}
                  stroke={quantumColors.entangled}
                  strokeWidth="2"
                  opacity={entanglementStrength}
                  strokeDasharray="10,5"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          strokeDashoffset: [0, 15],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }
                  }
                />
              );
            })
          )
          .filter(Boolean)}
      </svg>
    );

    const QuantumState = ({
      state,
      index,
    }: {
      state: QuantumMenuState;
      index: number;
    }) => (
      <motion.div
        className="glass-relative"
        initial={{ opacity: 1 }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: getStateOpacity(state),
                y: isObserved ? 0 : Math.sin(getQuantumPhase(state)) * 1.5,
              }
        }
        transition={respectMotionPreference({
          duration: 0.3,
          type: collapsedState ? "spring" : "tween",
        })}
        whileHover={{ y: -1 }}
        onClick={() => performMeasurement(state.id)}
      >
        <div
          className={cn(
            "glass-relative glass-p-4 glass-radius-lg glass-cursor-pointer glass-border-2 glass-transition-all glass-duration-300",
            "glass-border-subtle glass-surface-subtle"
          )}
          style={{
            ...menuGlassStyle,
            boxShadow: `0 10px ${18 + state.probability * 12}px rgba(15, 23, 42, ${0.08 + state.probability * 0.06})`,
          }}
        >
          <div className={cn("glass-relative glass-z-10")}>
            <div
              className={cn("glass-flex glass-items-center glass-space-x-3")}
            >
              {state.icon && (
                <span
                  style={{ fontSize: 18, lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {state.icon}
                </span>
              )}
              <div className={cn("glass-flex-1")}>
                <h3 className={cn("glass-text-primary glass-font-medium")}>
                  {state.label}
                </h3>
                {showProbabilities && (
                  <div
                    className={cn(
                      "glass-flex glass-items-center glass-flex-wrap glass-gap-2 glass-text-sm glass-text-secondary"
                    )}
                  >
                    <span>P: {(state.probability * 100).toFixed(1)}%</span>
                    <span>•</span>
                    <span>C: {(state.coherence * 100).toFixed(0)}%</span>
                    {state.entangled?.length && (
                      <>
                        <span>•</span>
                        <span className={cn("glass-text-accent")}>
                          ⚛ {state.entangled.length}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantum indicators */}
            <div className={cn("glass-mt-2 glass-flex glass-space-x-2")}>
              <div
                className={cn(
                  "glass-h-1 glass-surface-primary glass-radius-full"
                )}
                style={{ width: `${state.probability * 100}%` }}
              />
              <div
                className={cn(
                  "glass-h-1 glass-surface-info glass-radius-full glass-opacity-60"
                )}
                style={{ width: `${state.coherence * 100}%` }}
              />
            </div>

            {visualizeWaveFunction && !collapsedState && (
              <div
                className="glass-mt-3 glass-w-full glass-overflow-hidden glass-radius"
                style={{ height: 34, background: "rgba(226, 232, 240, 0.42)" }}
              >
                <WaveFunction state={state} index={index} />
              </div>
            )}
          </div>

          {/* Quantum field visualization */}
          {!collapsedState && (
            <motion.div
              className={cn(
                "glass-absolute glass-inset-0 glass-radius-lg glass-pointer-events-none"
              )}
              animate={{
                background: [
                  `radial-gradient(circle at ${50 + Math.sin(quantumTime) * 20}% ${50 + Math.cos(quantumTime * 0.7) * 20}%, rgba(100, 116, 139, 0.10) 0%, transparent 50%)`,
                  `radial-gradient(circle at ${50 + Math.sin(quantumTime + Math.PI) * 20}% ${50 + Math.cos(quantumTime * 0.7 + Math.PI) * 20}%, rgba(100, 116, 139, 0.10) 0%, transparent 50%)`,
                ],
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }
              }
            />
          )}
        </div>
      </motion.div>
    );

    const superpositionStates = collapsedState
      ? currentStates.filter((s) => s.id === collapsedState)
      : currentStates.slice(0, maxSuperpositions);

    return (
      <OptimizedGlass
        data-glass-component
        ref={ref}
        variant="frosted"
        className={cn(
          "glass-relative glass-p-6 glass-space-y-4 glass-text-primary",
          className
        )}
        style={{
          color: "var(--glass-theme-text, var(--glass-text-primary))",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
        role="region"
        aria-label="Quantum superposition menu"
        {...props}
      >
        {/* Quantum field background */}
        {showQuantumNoise && <QuantumNoise />}
        {visualizeWaveFunction &&
          currentStates.some((state) => state.entangled?.length) && (
            <EntanglementLines />
          )}

        {/* Header */}
        <div
          className={cn(
            "glass-flex glass-items-start glass-justify-between glass-flex-wrap glass-gap-4"
          )}
        >
          <div>
            <h2
              className={cn(
                "glass-text-xl glass-font-semibold glass-text-primary"
              )}
            >
              Quantum Menu
            </h2>
            <p className={cn("glass-text-sm glass-text-secondary")}>
              {collapsedState
                ? "State Collapsed"
                : `${superpositionStates.length} superposition${superpositionStates.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div
            className={cn(
              "glass-flex glass-items-center glass-flex-wrap glass-gap-3"
            )}
          >
            {!collapsedState && (
              <>
                <button
                  aria-expanded="true"
                  aria-controls={`${id}-states`}
                  onClick={() => performMeasurement()}
                  className={cn(
                    "glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",
                    "glass-text-primary hover:glass-text-white glass-border glass-border-primary hover:glass-border-white"
                  )}
                  style={{
                    ...menuGlassStyle,
                  }}
                >
                  🔬 Measure
                </button>

                <button
                  aria-expanded="true"
                  aria-controls={`${id}-states`}
                  onClick={() => {
                    const randomStates = currentStates
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 2)
                      .map((s) => s.id);
                    createEntanglement(randomStates);
                  }}
                  className={cn(
                    "glass-px-4 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",
                    "glass-text-accent hover:glass-text-accent-light glass-border glass-border-accent hover:glass-border-accent-light"
                  )}
                  style={{
                    ...menuGlassStyle,
                  }}
                >
                  ⚛ Entangle
                </button>
              </>
            )}

            <div className={cn("glass-text-sm glass-text-secondary")}>
              t: {quantumTime.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Quantum states */}
        <div
          id={`${id}-states`}
          role="menu"
          aria-label="Available quantum states"
          className={cn("glass-space-y-3")}
        >
          <AnimatePresence>
            {superpositionStates.map((state, index) => (
              <QuantumState key={state.id} state={state} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Quantum information */}
        <div
          className={cn(
            "glass-p-4 glass-radius-lg glass-border glass-border-subtle"
          )}
          style={menuGlassStyle}
        >
          <div
            className={cn(
              "glass-grid glass-grid-cols-2 glass-gap-4 glass-text-sm"
            )}
          >
            <div>
              <span className={cn("glass-text-secondary")}>
                Total Coherence:
              </span>
              <span className={cn("glass-ml-2 glass-text-primary")}>
                {(
                  (currentStates.reduce((sum, s) => sum + s.coherence, 0) /
                    currentStates.length) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div>
              <span className={cn("glass-text-secondary")}>
                Entangled Pairs:
              </span>
              <span className={cn("glass-ml-2 glass-text-primary")}>
                {currentStates.filter((s) => s.entangled?.length).length / 2}
              </span>
            </div>
            <div>
              <span className={cn("glass-text-secondary")}>Measurements:</span>
              <span className={cn("glass-ml-2 glass-text-primary")}>
                {
                  interactionHistory.filter((h) => h.type === "measurement")
                    .length
                }
              </span>
            </div>
            <div>
              <span className={cn("glass-text-secondary")}>State:</span>
              <span className={cn("glass-ml-2 glass-text-primary")}>
                {collapsedState ? "Collapsed" : "Superposition"}
              </span>
            </div>
          </div>
        </div>

        {/* Reset button */}
        {collapsedState && (
          <motion.button
            onClick={() => {
              setCollapsedState(null);
              setCurrentStates(menuStates);
              setMeasurementTime(null);
            }}
            className={cn(
              "glass-w-full glass-p-3 glass-radius-lg glass-text-sm glass-font-medium glass-transition-colors glass-duration-200",
              "glass-text-info hover:glass-text-info-light glass-border glass-border-info hover:glass-border-info-light"
            )}
            style={{
              ...menuGlassStyle,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={respectMotionPreference({ delay: 0.5 })}
          >
            🔄 Reset Quantum State
          </motion.button>
        )}
      </OptimizedGlass>
    );
  }
);

GlassSuperpositionalMenu.displayName = "GlassSuperpositionalMenu";
