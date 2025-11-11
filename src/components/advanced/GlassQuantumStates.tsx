"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Quantum States System
 * Probabilistic UI states that collapse into deterministic visuals based on user interaction
 * Part of Next-Wave Systems (10/10) - Meta-Systems Framework
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// Quantum state types
interface QuantumState<T = any> {
  id: string;
  possibleStates: T[];
  probabilities: number[];
  coherence: number;
  entangled: string[];
  lastMeasurement?: T;
  measurementTime?: number;
  decoherenceRate: number;
}

interface QuantumMeasurement<T = any> {
  stateId: string;
  measuredValue: T;
  probability: number;
  timestamp: number;
  observer: string;
  causedCollapse: boolean;
}

interface QuantumEntanglement {
  state1: string;
  state2: string;
  strength: number;
  correlationType: "positive" | "negative" | "complex";
  created: number;
  lastInteraction: number;
}

interface QuantumSuperposition {
  states: Map<string, any>;
  totalProbability: number;
  coherenceTime: number;
  interferencePattern: number[];
}

// Complex number representation for quantum amplitudes
class ComplexNumber {
  constructor(
    public real: number = 0,
    public imaginary: number = 0
  ) {}

  static fromPolar(magnitude: number, phase: number): ComplexNumber {
    return new ComplexNumber(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  phase(): number {
    return Math.atan2(this.imaginary, this.real);
  }

  multiply(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }

  normalize(): ComplexNumber {
    const mag = this.magnitude();
    if (mag === 0) return new ComplexNumber(0, 0);
    return new ComplexNumber(this.real / mag, this.imaginary / mag);
  }
}

// Quantum state vector representation
class QuantumStateVector {
  private amplitudes: ComplexNumber[];
  private stateLabels: string[];

  constructor(states: string[]) {
    this.stateLabels = states;
    this.amplitudes = states.map(
      () => new ComplexNumber(1 / Math.sqrt(states.length), 0)
    );
  }

  setAmplitude(stateIndex: number, amplitude: ComplexNumber): void {
    if (stateIndex >= 0 && stateIndex < this.amplitudes.length) {
      this.amplitudes[stateIndex] = amplitude;
    }
  }

  getAmplitude(stateIndex: number): ComplexNumber {
    return this.amplitudes[stateIndex] || new ComplexNumber(0, 0);
  }

  getProbability(stateIndex: number): number {
    const amplitude = this.getAmplitude(stateIndex);
    return amplitude.magnitude() ** 2;
  }

  normalize(): void {
    const totalProbability = this.amplitudes.reduce(
      (sum, amp) => sum + amp.magnitude() ** 2,
      0
    );
    const normalizationFactor = 1 / Math.sqrt(totalProbability);

    this.amplitudes = this.amplitudes.map(
      (amp: any) =>
        new ComplexNumber(
          amp.real * normalizationFactor,
          amp.imaginary * normalizationFactor
        )
    );
  }

  measure(): { stateIndex: number; state: string; probability: number } {
    this.normalize();
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < this.amplitudes.length; i++) {
      const probability = this.getProbability(i);
      cumulativeProbability += probability;

      if (random <= cumulativeProbability) {
        // Collapse to measured state
        this.amplitudes.fill(new ComplexNumber(0, 0));
        this.amplitudes[i] = new ComplexNumber(1, 0);

        return {
          stateIndex: i,
          state: this.stateLabels[i],
          probability,
        };
      }
    }

    // Fallback to last state
    const lastIndex = this.amplitudes.length - 1;
    return {
      stateIndex: lastIndex,
      state: this.stateLabels[lastIndex],
      probability: this.getProbability(lastIndex),
    };
  }

  evolve(hamiltonianMatrix: number[][], timeStep: number): void {
    // Simplified time evolution using Hamiltonian
    const newAmplitudes: ComplexNumber[] = [];

    for (let i = 0; i < this.amplitudes.length; i++) {
      let sum = new ComplexNumber(0, 0);

      for (let j = 0; j < this.amplitudes.length; j++) {
        const evolutionPhase = -hamiltonianMatrix[i][j] * timeStep;
        const evolutionFactor = ComplexNumber.fromPolar(1, evolutionPhase);
        sum = sum.add(evolutionFactor.multiply(this.amplitudes[j]));
      }

      newAmplitudes.push(sum);
    }

    this.amplitudes = newAmplitudes;
    this.normalize();
  }

  getSuperposition(): Array<{
    state: string;
    probability: number;
    amplitude: ComplexNumber;
  }> {
    return this.stateLabels.map((state, index) => ({
      state,
      probability: this.getProbability(index),
      amplitude: this.getAmplitude(index),
    }));
  }
}

// Quantum interference patterns for UI animations
class InterferencePatternGenerator {
  private waveFunction: (x: number, t: number) => number;
  private frequency: number;
  private wavelength: number;

  constructor(frequency: number = 1, wavelength: number = 10) {
    this.frequency = frequency;
    this.wavelength = wavelength;
    this.waveFunction = (x: number, t: number) =>
      Math.sin(2 * Math.PI * (this.frequency * t - x / this.wavelength));
  }

  generatePattern(width: number, height: number, time: number): number[][] {
    const pattern: number[][] = [];

    for (let y = 0; y < height; y++) {
      pattern[y] = [];
      for (let x = 0; x < width; x++) {
        const wave1 = this.waveFunction(x, time);
        const wave2 = this.waveFunction(y, time + Math.PI / 4);
        const interference = (wave1 + wave2) / 2;
        pattern[y][x] = (interference + 1) / 2; // Normalize to 0-1
      }
    }

    return pattern;
  }

  createConstructiveInterference(x: number, y: number, time: number): number {
    const distance1 = Math.sqrt(x * x + y * y);
    const distance2 = Math.sqrt((x - 50) * (x - 50) + (y - 50) * (y - 50));

    const wave1 = Math.sin(
      2 * Math.PI * (this.frequency * time - distance1 / this.wavelength)
    );
    const wave2 = Math.sin(
      2 * Math.PI * (this.frequency * time - distance2 / this.wavelength)
    );

    return Math.abs(wave1 + wave2) / 2;
  }
}

// Main quantum states system
class QuantumUISystem {
  private quantumStates: Map<string, QuantumStateVector>;
  private entanglements: Map<string, QuantumEntanglement>;
  private measurements: QuantumMeasurement[];
  private interferenceGenerator: InterferencePatternGenerator;
  private decoherenceTimer: Map<string, NodeJS.Timeout>;
  private hamiltonianMatrices: Map<string, number[][]>;

  constructor() {
    this.quantumStates = new Map();
    this.entanglements = new Map();
    this.measurements = [];
    this.interferenceGenerator = new InterferencePatternGenerator();
    this.decoherenceTimer = new Map();
    this.hamiltonianMatrices = new Map();
  }

  createQuantumState<T>(
    stateId: string,
    possibleStates: T[],
    initialProbabilities?: number[]
  ): QuantumStateVector {
    const stateLabels = possibleStates.map((state: any) =>
      JSON.stringify(state)
    );
    const quantumState = new QuantumStateVector(stateLabels);

    if (
      initialProbabilities &&
      initialProbabilities.length === possibleStates.length
    ) {
      // Set initial amplitudes based on probabilities
      const normalizedProbs = this.normalizeProbabilities(initialProbabilities);
      normalizedProbs.forEach((prob, index) => {
        const amplitude = new ComplexNumber(Math.sqrt(prob), 0);
        quantumState.setAmplitude(index, amplitude);
      });
    }

    this.quantumStates.set(stateId, quantumState);
    this.createHamiltonianMatrix(stateId, possibleStates.length);
    this.startQuantumEvolution(stateId);

    return quantumState;
  }

  private normalizeProbabilities(probabilities: number[]): number[] {
    const sum = probabilities.reduce(
      (total, prob) => total + Math.abs(prob),
      0
    );
    return probabilities.map((prob: any) => Math.abs(prob) / sum);
  }

  private createHamiltonianMatrix(stateId: string, dimension: number): void {
    // Create a random Hamiltonian matrix (Hermitian for proper quantum evolution)
    const matrix: number[][] = [];

    for (let i = 0; i < dimension; i++) {
      matrix[i] = [];
      for (let j = 0; j < dimension; j++) {
        if (i === j) {
          matrix[i][j] = Math.random() * 2 - 1; // Diagonal elements (energy levels)
        } else if (j > i) {
          matrix[i][j] = (Math.random() - 0.5) * 0.1; // Upper triangle
        } else {
          matrix[i][j] = matrix[j][i]; // Make Hermitian
        }
      }
    }

    this.hamiltonianMatrices.set(stateId, matrix);
  }

  private startQuantumEvolution(stateId: string): void {
    const evolveState = () => {
      const quantumState = this.quantumStates.get(stateId);
      const hamiltonian = this.hamiltonianMatrices.get(stateId);

      if (quantumState && hamiltonian) {
        quantumState.evolve(hamiltonian, 0.01); // Small time step
      }
    };

    // Continuous quantum evolution
    setInterval(evolveState, 50); // 20fps evolution
  }

  measureState(
    stateId: string,
    observer: string = "unknown"
  ): QuantumMeasurement | null {
    const quantumState = this.quantumStates.get(stateId);
    if (!quantumState) return null;

    const measurement = quantumState.measure();

    const quantumMeasurement: QuantumMeasurement = {
      stateId,
      measuredValue: JSON.parse(measurement.state),
      probability: measurement.probability,
      timestamp: Date.now(),
      observer,
      causedCollapse: true,
    };

    this.measurements.push(quantumMeasurement);

    // Handle entangled states
    this.handleEntangledMeasurements(stateId, measurement.stateIndex);

    // Start decoherence process
    this.scheduleDecoherence(stateId, 5000); // 5 seconds

    return quantumMeasurement;
  }

  private handleEntangledMeasurements(
    measuredStateId: string,
    measuredIndex: number
  ): void {
    this.entanglements.forEach((entanglement: any) => {
      if (
        entanglement.state1 === measuredStateId ||
        entanglement.state2 === measuredStateId
      ) {
        const otherStateId =
          entanglement.state1 === measuredStateId
            ? entanglement.state2
            : entanglement.state1;
        const otherState = this.quantumStates.get(otherStateId);

        if (otherState) {
          // Correlate the entangled state based on entanglement type
          let correlatedIndex: number;

          switch (entanglement.correlationType) {
            case "positive":
              correlatedIndex = measuredIndex;
              break;
            case "negative":
              correlatedIndex =
                (measuredIndex +
                  Math.floor(otherState.getSuperposition().length / 2)) %
                otherState.getSuperposition().length;
              break;
            case "complex":
              correlatedIndex =
                (measuredIndex * 2) % otherState.getSuperposition().length;
              break;
            default:
              correlatedIndex = measuredIndex;
          }

          // Collapse entangled state
          const superposition = otherState.getSuperposition();
          superposition.forEach((_, index) => {
            const amplitude =
              index === correlatedIndex
                ? new ComplexNumber(1, 0)
                : new ComplexNumber(0, 0);
            otherState.setAmplitude(index, amplitude);
          });
        }
      }
    });
  }

  private scheduleDecoherence(stateId: string, delay: number): void {
    // Clear existing decoherence timer
    const existingTimer = this.decoherenceTimer.get(stateId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Schedule decoherence (return to superposition)
    const timer = setTimeout(() => {
      this.restoreSuperposition(stateId);
    }, delay);

    this.decoherenceTimer.set(stateId, timer);
  }

  private restoreSuperposition(stateId: string): void {
    const quantumState = this.quantumStates.get(stateId);
    if (!quantumState) return;

    // Restore equal superposition
    const superposition = quantumState.getSuperposition();
    const equalAmplitude = 1 / Math.sqrt(superposition.length);

    superposition.forEach((_, index) => {
      const randomPhase = Math.random() * 2 * Math.PI;
      const amplitude = ComplexNumber.fromPolar(equalAmplitude, randomPhase);
      quantumState.setAmplitude(index, amplitude);
    });
  }

  createEntanglement(
    state1: string,
    state2: string,
    strength: number = 0.8,
    type: "positive" | "negative" | "complex" = "positive"
  ): void {
    const entanglementId = `${state1}-${state2}`;

    const entanglement: QuantumEntanglement = {
      state1,
      state2,
      strength,
      correlationType: type,
      created: Date.now(),
      lastInteraction: Date.now(),
    };

    this.entanglements.set(entanglementId, entanglement);
  }

  getSuperposition(
    stateId: string
  ): Array<{ state: any; probability: number; phase: number }> | null {
    const quantumState = this.quantumStates.get(stateId);
    if (!quantumState) return null;

    return quantumState.getSuperposition().map((item: any) => ({
      state: JSON.parse(item.state),
      probability: item.probability,
      phase: item.amplitude.phase(),
    }));
  }

  generateInterferencePattern(
    width: number,
    height: number,
    time: number
  ): number[][] {
    return this.interferenceGenerator.generatePattern(width, height, time);
  }

  getQuantumCoherence(stateId: string): number {
    const quantumState = this.quantumStates.get(stateId);
    if (!quantumState) return 0;

    const superposition = quantumState.getSuperposition();
    const entropy = superposition.reduce((sum, item) => {
      if (item.probability > 0) {
        return sum - item.probability * Math.log2(item.probability);
      }
      return sum;
    }, 0);

    const maxEntropy = Math.log2(superposition.length);
    return entropy / maxEntropy;
  }

  // Public API
  getStateVector(stateId: string): QuantumStateVector | undefined {
    return this.quantumStates.get(stateId);
  }

  getAllMeasurements(): QuantumMeasurement[] {
    return [...this.measurements];
  }

  getEntanglements(): QuantumEntanglement[] {
    return Array.from(this.entanglements.values());
  }

  cleanup(stateId: string): void {
    const timer = this.decoherenceTimer.get(stateId);
    if (timer) {
      clearTimeout(timer);
      this.decoherenceTimer.delete(stateId);
    }

    this.quantumStates.delete(stateId);
    this.hamiltonianMatrices.delete(stateId);

    // Remove entanglements involving this state
    Array.from(this.entanglements.entries()).forEach(([id, entanglement]) => {
      if (entanglement.state1 === stateId || entanglement.state2 === stateId) {
        this.entanglements.delete(id);
      }
    });
  }
}

// React Context for quantum states
const QuantumStatesContext = createContext<{
  system: QuantumUISystem | null;
  createQuantumState: <T>(
    stateId: string,
    possibleStates: T[],
    initialProbabilities?: number[]
  ) => void;
  measureState: (
    stateId: string,
    observer?: string
  ) => QuantumMeasurement | null;
  getSuperposition: (
    stateId: string
  ) => Array<{ state: any; probability: number; phase: number }> | null;
  createEntanglement: (
    state1: string,
    state2: string,
    strength?: number,
    type?: "positive" | "negative" | "complex"
  ) => void;
  getCoherence: (stateId: string) => number;
}>({
  system: null,
  createQuantumState: () => {},
  measureState: () => null,
  getSuperposition: () => null,
  createEntanglement: () => {},
  getCoherence: () => 0,
});

// Provider component
export function GlassQuantumStatesProvider({
  children,
  onMeasurement,
  onStateChange,
}: {
  children: React.ReactNode;
  onMeasurement?: (measurement: QuantumMeasurement) => void;
  onStateChange?: (stateId: string, superposition: any[]) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const systemRef = useRef<QuantumUISystem>();

  // Initialize system
  useEffect(() => {
    systemRef.current = new QuantumUISystem();

    return () => {
      // Cleanup would go here
    };
  }, []);

  const createQuantumState = useCallback(
    <T,>(
      stateId: string,
      possibleStates: T[],
      initialProbabilities?: number[]
    ) => {
      systemRef.current?.createQuantumState(
        stateId,
        possibleStates,
        initialProbabilities
      );
    },
    []
  );

  const measureState = useCallback(
    (stateId: string, observer: string = "user") => {
      const measurement = systemRef.current?.measureState(stateId, observer);
      if (measurement) {
        onMeasurement?.(measurement);
      }
      return measurement || null;
    },
    [onMeasurement]
  );

  const getSuperposition = useCallback((stateId: string) => {
    return systemRef.current?.getSuperposition(stateId) || null;
  }, []);

  const createEntanglement = useCallback(
    (
      state1: string,
      state2: string,
      strength: number = 0.8,
      type: "positive" | "negative" | "complex" = "positive"
    ) => {
      systemRef.current?.createEntanglement(state1, state2, strength, type);
    },
    []
  );

  const getCoherence = useCallback((stateId: string) => {
    return systemRef.current?.getQuantumCoherence(stateId) || 0;
  }, []);

  const value = {
    system: systemRef.current || null,
    createQuantumState,
    measureState,
    getSuperposition,
    createEntanglement,
    getCoherence,
  };

  return (
    <QuantumStatesContext.Provider value={value}>
      {children}
    </QuantumStatesContext.Provider>
  );
}

// Hook to use quantum states
export function useQuantumStates() {
  const context = useContext(QuantumStatesContext);
  if (!context) {
    throw new Error(
      "useQuantumStates must be used within GlassQuantumStatesProvider"
    );
  }
  return context;
}

// Quantum button component that exists in superposition until clicked
export function GlassQuantumButton({
  children,
  possibleStates,
  onCollapse,
  className,
  stateId,
  ...props
}: {
  children: React.ReactNode;
  possibleStates: Array<{ label: string; color: string; action: () => void }>;
  onCollapse?: (selectedState: any) => void;
  className?: string;
  stateId?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const prefersReducedMotion = useReducedMotion();
  const { createQuantumState, measureState, getSuperposition } =
    useQuantumStates();
  const [currentState, setCurrentState] = useState<any>(null);
  const [superposition, setSuperposition] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const buttonId = stateId || `quantum-button-${Date.now()}`;

  // Initialize quantum state
  useEffect(() => {
    createQuantumState(buttonId, possibleStates);

    // Update superposition display
    const updateSuperposition = () => {
      const currentSuperposition = getSuperposition(buttonId);
      if (currentSuperposition) {
        setSuperposition(currentSuperposition);
      }
    };

    updateSuperposition();
    const interval = setInterval(updateSuperposition, 100);

    return () => clearInterval(interval);
  }, [buttonId, createQuantumState, getSuperposition, possibleStates]);

  const handleClick = useCallback(() => {
    const measurement = measureState(buttonId, "user-click");
    if (measurement) {
      const prefersReducedMotion = useReducedMotion();
      setCurrentState(measurement.measuredValue);
      setIsCollapsed(true);
      onCollapse?.(measurement.measuredValue);
      measurement.measuredValue.action();

      // Restore superposition after delay
      setTimeout(() => {
        setIsCollapsed(false);
        setCurrentState(null);
      }, 3000);
    }
  }, [buttonId, measureState, onCollapse]);

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden glass-surface-primary glass-elev-2",
        "glass-px-6 glass-py-3 glass-radius-md glass-text-primary font-medium",
        "transition-all duration-300 hover:glass-elev-3",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...Object.fromEntries(
        Object.entries(props).filter(([key]) => key !== "onAnimationStart")
      )}
    >
      {/* Quantum superposition visualization */}
      <AnimatePresence>
        {!isCollapsed && superposition.length > 0 && (
          <div className="absolute inset-0 glass-flex">
            {superposition.map((state, index) => (
              <motion.div
                key={index}
                className="glass-flex-1 glass-h-full opacity-30"
                style={{ backgroundColor: state.state.color }}
                initial={{ opacity: 0 }}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        opacity: state.probability * 0.6,
                        scale: 1 + state.phase * 0.1,
                      }
                }
                exit={{ opacity: 0 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
                }
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed state */}
      <AnimatePresence>
        {isCollapsed && currentState && (
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: currentState.color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 0.8 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
            }
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      <div className="relative z-10">
        {isCollapsed ? currentState?.label : children}
      </div>

      {/* Quantum interference pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <QuantumInterferencePattern
          width={100}
          height={40}
          speed={0.5}
          visible={!isCollapsed}
        />
      </div>
    </motion.button>
  );
}

// Quantum interference pattern component
export function QuantumInterferencePattern({
  width = 100,
  height = 100,
  speed = 1,
  visible = true,
  className,
}: {
  width?: number;
  height?: number;
  speed?: number;
  visible?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { system } = useQuantumStates();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!visible || !system) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    let time = 0;
    const animate = () => {
      const pattern = system.generateInterferencePattern(width, height, time);

      ctx.clearRect(0, 0, width, height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const intensity = pattern[y][x];
          const alpha = intensity * 0.3;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      time += speed * 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, speed, visible, system]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      style={{ display: visible ? "block" : "none" }}
    />
  );
}

// Quantum entangled components
export function GlassQuantumEntangledPair({
  children,
  stateId1,
  stateId2,
  possibleStates,
  entanglementType = "positive",
  entanglementStrength = 0.8,
  className,
}: {
  children: [React.ReactNode, React.ReactNode];
  stateId1: string;
  stateId2: string;
  possibleStates: any[];
  entanglementType?: "positive" | "negative" | "complex";
  entanglementStrength?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const {
    createQuantumState,
    createEntanglement,
    measureState,
    getSuperposition,
  } = useQuantumStates();
  const [state1Superposition, setState1Superposition] = useState<any[]>([]);
  const [state2Superposition, setState2Superposition] = useState<any[]>([]);

  // Initialize entangled states
  useEffect(() => {
    createQuantumState(stateId1, possibleStates);
    createQuantumState(stateId2, possibleStates);
    createEntanglement(
      stateId1,
      stateId2,
      entanglementStrength,
      entanglementType
    );

    // Update superpositions
    const updateSuperpositions = () => {
      const super1 = getSuperposition(stateId1);
      const super2 = getSuperposition(stateId2);
      if (super1) setState1Superposition(super1);
      if (super2) setState2Superposition(super2);
    };

    updateSuperpositions();
    const interval = setInterval(updateSuperpositions, 100);

    return () => clearInterval(interval);
  }, [
    stateId1,
    stateId2,
    possibleStates,
    entanglementType,
    entanglementStrength,
    createQuantumState,
    createEntanglement,
    getSuperposition,
  ]);

  return (
    <div className={cn("flex glass-gap-4", className)}>
      const prefersReducedMotion = useReducedMotion();
      <motion.div
        className="glass-flex-1 relative"
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: 0.5 + (state1Superposition[0]?.probability || 0) * 0.5,
                scale: 0.95 + (state1Superposition[0]?.probability || 0) * 0.1,
              }
        }
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.1 }}
      >
        {children[0]}
      </motion.div>
      <motion.div
        className="glass-flex-1 relative"
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: 0.5 + (state2Superposition[0]?.probability || 0) * 0.5,
                scale: 0.95 + (state2Superposition[0]?.probability || 0) * 0.1,
              }
        }
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.1 }}
      >
        {children[1]}
      </motion.div>
      {/* Entanglement visualization */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="glass-w-full glass-h-full">
          <motion.line
            x1="25%"
            y1="50%"
            x2="75%"
            y2="50%"
            stroke="var(--glass-color-primary, 0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    strokeDashoffset: [0, -10],
                    opacity: [0.3, 0.7, 0.3],
                  }
            }
            transition={{
              strokeDashoffset: { duration: 1, repeat: Infinity },
              opacity: { duration: 2, repeat: Infinity },
            }}
          />
        </svg>
      </div>
    </div>
  );
}

// Quantum coherence visualizer
export function GlassQuantumCoherenceIndicator({
  stateId,
  className,
}: {
  stateId: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { getCoherence } = useQuantumStates();
  const [coherence, setCoherence] = useState(0);

  useEffect(() => {
    const updateCoherence = () => {
      setCoherence(getCoherence(stateId));
    };

    updateCoherence();
    const interval = setInterval(updateCoherence, 200);

    return () => clearInterval(interval);
  }, [stateId, getCoherence]);

  return (
    <div className={cn("flex items-center glass-gap-2", className)}>
      <span className="glass-text-xs glass-text-secondary">Coherence:</span>
      <div className="w-20 h-2 glass-surface-subtle glass-radius-full overflow-hidden">
        <motion.div
          className="glass-h-full glass-surface-blue glass-radius-full"
          animate={{ width: `${coherence * 100}%` }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
          }
        />
      </div>
      <span className="glass-text-xs glass-text-secondary">
        {(coherence * 100).toFixed(1)}%
      </span>
    </div>
  );
}

// Hook for creating quantum UI states
export function useQuantumState<T>(
  stateId: string,
  possibleStates: T[],
  initialProbabilities?: number[]
) {
  const { createQuantumState, measureState, getSuperposition } =
    useQuantumStates();
  const [currentMeasurement, setCurrentMeasurement] = useState<T | null>(null);
  const [superposition, setSuperposition] = useState<
    Array<{ state: T; probability: number; phase: number }>
  >([]);

  // Initialize quantum state
  useEffect(() => {
    createQuantumState(stateId, possibleStates, initialProbabilities);
  }, [stateId, createQuantumState, possibleStates, initialProbabilities]);

  // Update superposition
  useEffect(() => {
    const updateSuperposition = () => {
      const currentSuperposition = getSuperposition(stateId);
      if (currentSuperposition) {
        setSuperposition(currentSuperposition);
      }
    };

    updateSuperposition();
    const interval = setInterval(updateSuperposition, 100);

    return () => clearInterval(interval);
  }, [stateId, getSuperposition]);

  const measure = useCallback(
    (observer: string = "component") => {
      const measurement = measureState(stateId, observer);
      if (measurement) {
        setCurrentMeasurement(measurement.measuredValue);
        return measurement.measuredValue;
      }
      return null;
    },
    [stateId, measureState]
  );

  const collapse = useCallback((targetState: T) => {
    // Force collapse to specific state
    setCurrentMeasurement(targetState);
  }, []);

  return {
    measure,
    collapse,
    currentMeasurement,
    superposition,
    isInSuperposition: !currentMeasurement,
    dominantState:
      superposition.length > 0
        ? superposition.reduce((max, current) =>
            current.probability > max.probability ? current : max
          )
        : null,
  };
}

// Presets for different quantum behaviors
export const quantumStatePresets = {
  binary: {
    states: [true, false],
    initialProbabilities: [0.5, 0.5],
    decoherenceTime: 3000,
  },
  ternary: {
    states: ["low", "medium", "high"],
    initialProbabilities: [0.33, 0.34, 0.33],
    decoherenceTime: 5000,
  },
  emotional: {
    states: ["joy", "calm", "excited", "focused"],
    initialProbabilities: [0.25, 0.25, 0.25, 0.25],
    decoherenceTime: 4000,
  },
  interface: {
    states: ["minimal", "standard", "detailed", "expert"],
    initialProbabilities: [0.2, 0.4, 0.3, 0.1],
    decoherenceTime: 10000,
  },
};

// Main component wrapper for testing and simple usage
export function GlassQuantumStates({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <GlassQuantumStatesProvider>
      <div className={className} {...props}>
        {children || (
          <GlassQuantumButton possibleStates={[]}>
            Quantum Button
          </GlassQuantumButton>
        )}
      </div>
    </GlassQuantumStatesProvider>
  );
}
