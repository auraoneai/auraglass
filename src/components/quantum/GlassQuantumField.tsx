"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useGlassSound } from "../../utils/soundDesign";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface QuantumParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  amplitude: number;
  frequency: number;
  spin: number;
  entangled: boolean;
  entanglementId?: string;
  waveFunction: {
    real: number;
    imaginary: number;
  };
  uncertainty: {
    position: number;
    momentum: number;
  };
  id: string;
}

export interface QuantumFieldNode {
  x: number;
  y: number;
  z: number;
  fieldStrength: number;
  potential: number;
  probability: number;
}

export type QuantumInteractionType =
  | "strong"
  | "weak"
  | "electromagnetic"
  | "quantum";

export interface QuantumInteraction {
  particle1: string;
  particle2: string;
  strength: number;
  type: QuantumInteractionType;
}

export interface QuantumField {
  nodes: QuantumFieldNode[];
  interactions: QuantumInteraction[];
  id: string;
}

export interface QuantumState {
  superposition: boolean;
  entanglement: number; // 0-1
  coherence: number; // 0-1
  decoherence: number; // 0-1
  measurement: boolean;
  uncertainty: number; // 0-1
  energy: number;
  id: string;
}

export interface QuantumMeasurementResult {
  position: {
    x: number;
    y: number;
  };
  momentum: {
    x: number;
    y: number;
  };
  spin: number;
}

export interface QuantumMeasurementEvent {
  x: number;
  y: number;
  time: number;
}

export interface GlassQuantumFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Number of quantum particles */
  particleCount?: number;
  /** Field resolution */
  fieldResolution?: number;
  /** Quantum coherence level */
  coherence?: number;
  /** Entanglement strength */
  entanglementStrength?: number;
  /** Uncertainty level */
  uncertaintyLevel?: number;
  /** Field energy level */
  energyLevel?: number;
  /** Show wave functions */
  showWaveFunctions?: boolean;
  /** Show probability clouds */
  showProbabilityClouds?: boolean;
  /** Show entanglement connections */
  showEntanglement?: boolean;
  /** Show measurement effects */
  showMeasurement?: boolean;
  /** Animation speed */
  animationSpeed?: number;
  /** Quantum simulation type */
  simulationType?: "particle" | "wave" | "field" | "superposition";
  /** Time evolution */
  timeEvolution?: boolean;
  /** Planck constant scale */
  planckScale?: number;
  /** Temperature (affects decoherence) */
  temperature?: number;
  /** External field strength */
  externalField?: number;
  /** Quantum state change handler */
  onQuantumStateChange?: (state: QuantumState) => void;
  /** Measurement event handler */
  onMeasurement?: (
    particle: QuantumParticle,
    result: QuantumMeasurementResult
  ) => void;
  /** Entanglement event handler */
  onEntanglement?: (particles: QuantumParticle[]) => void;
  /** Show controls */
  showControls?: boolean;
  /** Show quantum info */
  showQuantumInfo?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassQuantumField = forwardRef<
  HTMLDivElement,
  GlassQuantumFieldProps
>(
  (
    {
      width = 800,
      height = 600,
      particleCount = 50,
      fieldResolution = 20,
      coherence = 0.7,
      entanglementStrength = 0.5,
      uncertaintyLevel = 0.6,
      energyLevel = 0.8,
      showWaveFunctions = true,
      showProbabilityClouds = true,
      showEntanglement = true,
      showMeasurement = true,
      animationSpeed = 1,
      simulationType = "particle",
      timeEvolution = true,
      planckScale = 1,
      temperature = 0.1,
      externalField = 0.3,
      onQuantumStateChange,
      onMeasurement,
      onEntanglement,
      showControls = true,
      showQuantumInfo = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const quantumFieldId = useA11yId("glass-quantum-field");

    const [particles, setParticles] = useState<QuantumParticle[]>([]);
    const [quantumField, setQuantumField] = useState<QuantumField>({
      nodes: [],
      interactions: [],
      id: "field",
    });
    const [quantumState, setQuantumState] = useState<QuantumState>({
      superposition: true,
      entanglement: 0,
      coherence: coherence,
      decoherence: 0,
      measurement: false,
      uncertainty: uncertaintyLevel,
      energy: energyLevel,
      id: "quantum-state",
    });
    const [animationTime, setAnimationTime] = useState(0);
    const [measurementEvents, setMeasurementEvents] = useState<
      QuantumMeasurementEvent[]
    >([]);

    // Initialize quantum particles
    const initializeParticles = useCallback(() => {
      const newParticles: QuantumParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const particle: QuantumParticle = {
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 100 - 50,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 2,
          phase: Math.random() * Math.PI * 2,
          amplitude: Math.random() * 0.8 + 0.2,
          frequency: Math.random() * 0.1 + 0.05,
          spin: Math.random() > 0.5 ? 0.5 : -0.5,
          entangled: false,
          waveFunction: {
            real: Math.random(),
            imaginary: Math.random(),
          },
          uncertainty: {
            position: Math.random() * uncertaintyLevel,
            momentum: Math.random() * uncertaintyLevel,
          },
          id: `particle-${i}`,
        };

        newParticles.push(particle);
      }

      // Create entanglement pairs
      if (entanglementStrength > 0) {
        const entanglementCount = Math.floor(
          (particleCount * entanglementStrength) / 2
        );
        for (let i = 0; i < entanglementCount; i++) {
          const p1Index = Math.floor(Math.random() * newParticles.length);
          const p2Index = Math.floor(Math.random() * newParticles.length);

          if (p1Index !== p2Index) {
            const entanglementId = `entanglement-${i}`;
            newParticles[p1Index].entangled = true;
            newParticles[p1Index].entanglementId = entanglementId;
            newParticles[p2Index].entangled = true;
            newParticles[p2Index].entanglementId = entanglementId;
          }
        }
      }

      setParticles(newParticles);
    }, [particleCount, width, height, uncertaintyLevel, entanglementStrength]);

    // Initialize quantum field
    const initializeField = useCallback(() => {
      const nodes: QuantumFieldNode[] = [];
      const interactions: QuantumInteraction[] = [];

      // Create field nodes
      for (let x = 0; x < width; x += fieldResolution) {
        for (let y = 0; y < height; y += fieldResolution) {
          nodes.push({
            x,
            y,
            z: 0,
            fieldStrength: Math.random() * energyLevel,
            potential: Math.sin(x * 0.01) * Math.cos(y * 0.01) * externalField,
            probability: Math.random(),
          });
        }
      }

      setQuantumField({ nodes, interactions, id: "quantum-field" });
    }, [width, height, fieldResolution, energyLevel, externalField]);

    // Initialize quantum system
    useEffect(() => {
      initializeParticles();
      initializeField();
    }, [initializeParticles, initializeField]);

    // Update quantum particles
    const updateParticles = useCallback(
      (deltaTime: number) => {
        setParticles((prevParticles) => {
          const updated = prevParticles.map((particle) => {
            // Wave function evolution (Schrödinger equation approximation)
            const energyTerm = particle.frequency * deltaTime * planckScale;
            const newPhase = particle.phase + energyTerm;

            // Update wave function
            const newReal =
              particle.waveFunction.real * Math.cos(energyTerm) -
              particle.waveFunction.imaginary * Math.sin(energyTerm);
            const newImaginary =
              particle.waveFunction.real * Math.sin(energyTerm) +
              particle.waveFunction.imaginary * Math.cos(energyTerm);

            // Normalize wave function
            const norm = Math.sqrt(
              newReal * newReal + newImaginary * newImaginary
            );
            const normalizedReal = norm > 0 ? newReal / norm : 0;
            const normalizedImaginary = norm > 0 ? newImaginary / norm : 0;

            // Quantum uncertainty principle
            const positionUncertainty = particle.uncertainty.position;
            const momentumUncertainty = particle.uncertainty.momentum;

            // Heisenberg uncertainty relation: Δx * Δp ≥ ℏ/2
            const minUncertaintyProduct = planckScale * 0.5;
            if (
              positionUncertainty * momentumUncertainty <
              minUncertaintyProduct
            ) {
              particle.uncertainty.position = Math.sqrt(
                minUncertaintyProduct / momentumUncertainty
              );
            }

            // Position evolution with quantum fluctuations
            const quantumNoise = (Math.random() - 0.5) * positionUncertainty;
            let newX =
              particle.x +
              particle.vx * deltaTime * animationSpeed +
              quantumNoise;
            let newY =
              particle.y +
              particle.vy * deltaTime * animationSpeed +
              quantumNoise;

            // Boundary conditions (periodic for quantum systems)
            newX = ((newX % width) + width) % width;
            newY = ((newY % height) + height) % height;

            // Decoherence effects
            const decoherenceRate = temperature * 0.001;
            const newCoherence = Math.max(
              0,
              particle.amplitude * (1 - decoherenceRate * deltaTime)
            );

            return {
              ...particle,
              x: newX,
              y: newY,
              phase: newPhase,
              amplitude: newCoherence,
              waveFunction: {
                real: normalizedReal,
                imaginary: normalizedImaginary,
              },
              uncertainty: {
                position: Math.min(
                  1,
                  positionUncertainty + (Math.random() - 0.5) * 0.01
                ),
                momentum: Math.min(
                  1,
                  momentumUncertainty + (Math.random() - 0.5) * 0.01
                ),
              },
            };
          });

          // Update entanglement correlations
          const entanglementPairs = new Map<string, QuantumParticle[]>();
          updated.forEach((particle) => {
            if (particle.entangled && particle.entanglementId) {
              if (!entanglementPairs.has(particle.entanglementId)) {
                entanglementPairs.set(particle.entanglementId, []);
              }
              entanglementPairs.get(particle.entanglementId)!.push(particle);
            }
          });

          // Apply entanglement correlations
          entanglementPairs.forEach((entangledParticles, entanglementId) => {
            if (entangledParticles.length === 2) {
              const [p1, p2] = entangledParticles;
              // Spin correlation for entangled particles
              if (Math.random() < entanglementStrength) {
                p2.spin = -p1.spin;
                p2.phase = Math.PI - p1.phase;
              }
            }
          });

          return updated;
        });
      },
      [
        animationSpeed,
        planckScale,
        temperature,
        width,
        height,
        entanglementStrength,
      ]
    );

    // Update quantum field
    const updateQuantumField = useCallback(
      (deltaTime: number) => {
        setQuantumField((prevField) => {
          const updatedNodes = prevField.nodes.map((node) => {
            // Field fluctuations
            const fieldFluctuation = (Math.random() - 0.5) * 0.1 * energyLevel;
            const newFieldStrength = Math.max(
              0,
              node.fieldStrength + fieldFluctuation
            );

            // Probability density calculation
            let totalProbability = 0;
            particles.forEach((particle) => {
              const distance = Math.sqrt(
                (particle.x - node.x) ** 2 + (particle.y - node.y) ** 2
              );
              const waveContribution =
                particle.amplitude *
                Math.exp(-distance / (50 * particle.uncertainty.position));
              totalProbability += waveContribution * waveContribution;
            });

            return {
              ...node,
              fieldStrength: newFieldStrength,
              probability: Math.min(1, totalProbability),
            };
          });

          return {
            ...prevField,
            nodes: updatedNodes,
          };
        });
      },
      [energyLevel, particles]
    );

    // Update quantum state
    const updateQuantumState = useCallback(() => {
      const entangledCount = particles.filter((p) => p.entangled).length;
      const totalCoherence =
        particles.reduce((sum, p) => sum + p.amplitude, 0) / particles.length;
      const avgUncertainty =
        particles.reduce((sum, p) => sum + p.uncertainty.position, 0) /
        particles.length;

      const newState: QuantumState = {
        superposition:
          simulationType === "superposition" || totalCoherence > 0.5,
        entanglement: entangledCount / particles.length,
        coherence: totalCoherence,
        decoherence: temperature * 0.1,
        measurement: measurementEvents.length > 0,
        uncertainty: avgUncertainty,
        energy: energyLevel,
        id: quantumState.id,
      };

      setQuantumState(newState);
      onQuantumStateChange?.(newState);
    }, [
      particles,
      simulationType,
      temperature,
      measurementEvents,
      energyLevel,
      quantumState.id,
      onQuantumStateChange,
    ]);

    // Perform quantum measurement
    const performMeasurement = useCallback(
      (x: number, y: number) => {
        const measurementRadius = 50;
        const measuredParticles = particles.filter((particle) => {
          const distance = Math.sqrt(
            (particle.x - x) ** 2 + (particle.y - y) ** 2
          );
          return distance < measurementRadius;
        });

        if (measuredParticles.length > 0) {
          setMeasurementEvents((prev) => [...prev, { x, y, time: Date.now() }]);

          // Collapse wave functions
          setParticles((prevParticles) =>
            prevParticles.map((particle) => {
              if (measuredParticles.includes(particle)) {
                const measurementResult: QuantumMeasurementResult = {
                  position: { x: particle.x, y: particle.y },
                  momentum: { x: particle.vx, y: particle.vy },
                  spin: particle.spin,
                };

                onMeasurement?.(particle, measurementResult);

                return {
                  ...particle,
                  amplitude: 1, // Wave function collapse
                  uncertainty: { position: 0.01, momentum: 1 }, // Increased momentum uncertainty
                  waveFunction: { real: 1, imaginary: 0 },
                };
              }
              return particle;
            })
          );

          play("success");
        }
      },
      [particles, onMeasurement, play]
    );

    // Clear expired measurement events
    useEffect(() => {
      const interval = setInterval(() => {
        setMeasurementEvents((prev) =>
          prev.filter(
            (event) => Date.now() - event.time < ANIMATION.DURATION.slower * 3
          )
        );
      }, ANIMATION.DURATION.fast);

      return () => clearInterval(interval);
    }, []);

    // Render quantum field
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = "rgb(5, 5, 20)";
      ctx.fillRect(0, 0, width, height);

      // Draw quantum field background
      if (simulationType === "field") {
        quantumField.nodes.forEach((node) => {
          if (node.probability > 0.1) {
            const alpha = node.probability * 0.3;
            ctx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.fillRect(node.x - 2, node.y - 2, 4, 4);
          }
        });
      }

      // Draw probability clouds
      if (showProbabilityClouds) {
        particles.forEach((particle) => {
          const cloudRadius = Math.max(1, particle.uncertainty.position * 40);
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            cloudRadius
          );

          const probability =
            particle.waveFunction.real ** 2 +
            particle.waveFunction.imaginary ** 2;
          gradient.addColorStop(0, `rgba(168, 85, 247, ${probability * 0.3})`);
          gradient.addColorStop(1, "transparent");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, cloudRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw wave functions
      if (showWaveFunctions) {
        particles.forEach((particle) => {
          const waveRadius = particle.amplitude * 30;
          const phaseColor = Math.floor((particle.phase / (Math.PI * 2)) * 360);

          // Real part of wave function
          ctx.strokeStyle = `hsl(${phaseColor}, 70%, 60%)`;
          ctx.lineWidth = 2;
          ctx.globalAlpha = particle.amplitude;

          ctx.beginPath();
          for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x =
              particle.x +
              Math.cos(angle) * waveRadius * particle.waveFunction.real;
            const y =
              particle.y +
              Math.sin(angle) * waveRadius * particle.waveFunction.real;

            if (angle === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();

          // Imaginary part
          ctx.strokeStyle = `hsl(${(phaseColor + 90) % 360}, 70%, 60%)`;
          if (ctx.setLineDash) ctx.setLineDash([5, 5]);

          ctx.beginPath();
          for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const x =
              particle.x +
              Math.cos(angle) * waveRadius * particle.waveFunction.imaginary;
            const y =
              particle.y +
              Math.sin(angle) * waveRadius * particle.waveFunction.imaginary;

            if (angle === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();

          if (ctx.setLineDash) ctx.setLineDash([]);
        });
      }

      // Draw particles
      ctx.globalAlpha = 1;
      particles.forEach((particle) => {
        // Particle core
        const coreRadius = 3;
        const spinColor =
          particle.spin > 0 ? "rgb(255, 100, 100)" : "rgb(100, 100, 255)";

        ctx.fillStyle = spinColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // Spin visualization
        ctx.strokeStyle = spinColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, coreRadius + 2, 0, particle.phase);
        ctx.stroke();
      });

      // Draw entanglement connections
      if (showEntanglement) {
        const entanglementPairs = new Map<string, QuantumParticle[]>();
        particles.forEach((particle) => {
          if (particle.entangled && particle.entanglementId) {
            if (!entanglementPairs.has(particle.entanglementId)) {
              entanglementPairs.set(particle.entanglementId, []);
            }
            entanglementPairs.get(particle.entanglementId)!.push(particle);
          }
        });

        entanglementPairs.forEach((entangledParticles) => {
          if (entangledParticles.length === 2) {
            const [p1, p2] = entangledParticles;

            ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
            ctx.lineWidth = 2;
            if (ctx.setLineDash) ctx.setLineDash([5, 5]);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (ctx.setLineDash) ctx.setLineDash([]);
          }
        });
      }

      // Draw measurement events
      measurementEvents.forEach((event) => {
        const age = (Date.now() - event.time) / 2000;
        const alpha = Math.max(0, 1 - age);
        const radius = 30 + age * 20;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(event.x, event.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw quantum info overlay
      if (showQuantumInfo) {
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
        ctx.fillRect(10, 10, 300, 180);

        ctx.fillStyle = "white";
        ctx.font = "14px monospace";
        ctx.fillText(`Quantum State Information:`, 20, 30);
        ctx.fillText(
          `Coherence: ${(quantumState.coherence * 100).toFixed(1)}%`,
          20,
          50
        );
        ctx.fillText(
          `Entanglement: ${(quantumState.entanglement * 100).toFixed(1)}%`,
          20,
          70
        );
        ctx.fillText(
          `Uncertainty: ${(quantumState.uncertainty * 100).toFixed(1)}%`,
          20,
          90
        );
        ctx.fillText(
          `Decoherence: ${(quantumState.decoherence * 100).toFixed(1)}%`,
          20,
          110
        );
        ctx.fillText(
          `Energy: ${(quantumState.energy * 100).toFixed(1)}%`,
          20,
          130
        );
        ctx.fillText(`Particles: ${particles.length}`, 20, 150);
        ctx.fillText(
          `Superposition: ${quantumState.superposition ? "Yes" : "No"}`,
          20,
          170
        );
        ctx.restore();
      }
    }, [
      width,
      height,
      simulationType,
      quantumField,
      showProbabilityClouds,
      particles,
      showWaveFunctions,
      showEntanglement,
      measurementEvents,
      showQuantumInfo,
      quantumState,
    ]);

    // Handle canvas click for measurement
    const handleCanvasClick = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!showMeasurement) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        performMeasurement(x, y);
      },
      [showMeasurement, performMeasurement]
    );

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion && respectMotionPreference) {
        render();
        return;
      }

      const animate = (currentTime: number) => {
        const deltaTime = 16; // 60fps
        setAnimationTime((prev) => prev + deltaTime);

        if (timeEvolution) {
          updateParticles(deltaTime);
          updateQuantumField(deltaTime);
          updateQuantumState();
        }

        render();

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      prefersReducedMotion,
      respectMotionPreference,
      render,
      timeEvolution,
      updateParticles,
      updateQuantumField,
      updateQuantumState,
    ]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
    }, [width, height]);

    // Controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-quantum-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="quantum-type-select" className="glass-text-sm">
              Type:
            </label>
            <select
              id="quantum-type-select"
              value={simulationType}
              onChange={(e) => {}}
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20"
            >
              <option value="particle">Particle</option>
              <option value="wave">Wave</option>
              <option value="field">Field</option>
              <option value="superposition">Superposition</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="quantum-coherence-range" className="glass-text-sm">
              Coherence:
            </label>
            <input
              id="quantum-coherence-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={coherence}
              onChange={(e) => {}}
              className="glass-w-20"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label
              htmlFor="quantum-entanglement-range"
              className="glass-text-sm"
            >
              Entanglement:
            </label>
            <input
              id="quantum-entanglement-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={entanglementStrength}
              onChange={(e) => {}}
              className="glass-w-20"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label
              htmlFor="quantum-temperature-range"
              className="glass-text-sm"
            >
              Temperature:
            </label>
            <input
              id="quantum-temperature-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => {}}
              className="glass-w-20"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                id="quantum-waves-checkbox"
                type="checkbox"
                checked={showWaveFunctions}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Waves
            </label>
            <label className="glass-text-sm">
              <input
                id="quantum-probability-checkbox"
                type="checkbox"
                checked={showProbabilityClouds}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Probability
            </label>
            <label className="glass-text-sm">
              <input
                id="quantum-entanglement-checkbox"
                type="checkbox"
                checked={showEntanglement}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Entanglement
            </label>
            <label className="glass-text-sm">
              <input
                id="quantum-evolution-checkbox"
                type="checkbox"
                checked={timeEvolution}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Evolution
            </label>
          </div>

          <button
            onClick={() => initializeParticles()}
            className="glass-px-3 glass-py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 glass-text-primary"
          >
            Reset
          </button>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={quantumFieldId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-quantum-field relative glass-radius-lg glass-backdrop-blur-md border border-border/20",
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          <div className="glass-relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "border border-border/20 glass-radius-md bg-black",
                showMeasurement && "cursor-crosshair"
              )}
              onClick={handleCanvasClick}
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassQuantumField.displayName = "GlassQuantumField";

export default GlassQuantumField;
