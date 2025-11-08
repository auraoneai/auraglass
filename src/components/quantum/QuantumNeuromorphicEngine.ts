export interface QuantumNeuromorphicState {
  coherence: number;
  entanglementDensity: number;
  energyUtilization: number;
  learningRate: number;
  iteration: number;
}

export interface QuantumNeuromorphicStepOptions {
  fieldIntensity?: number;
  decoherenceNoise?: number;
  adaptiveLearningRate?: boolean;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export class QuantumNeuromorphicEngine {
  private state: QuantumNeuromorphicState;

  constructor(initialState?: Partial<QuantumNeuromorphicState>) {
    this.state = {
      coherence: 0.8,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.45,
      iteration: 0,
      ...initialState,
    };
  }

  get snapshot(): QuantumNeuromorphicState {
    return { ...this.state };
  }

  step(synapticWeights: number[], options: QuantumNeuromorphicStepOptions = {}): QuantumNeuromorphicState {
    if (synapticWeights.length === 0) {
      this.state.iteration += 1;
      return this.snapshot;
    }

    const mean = synapticWeights.reduce((sum, weight) => sum + weight, 0) / synapticWeights.length;
    const variance = synapticWeights.reduce((sum, weight) => sum + (weight - mean) ** 2, 0) / synapticWeights.length;

    const intensity = options.fieldIntensity ?? 0.6;
    const noise = options.decoherenceNoise ?? 0.18;

    const coherenceDelta = clamp(0.05 - noise * 0.08 + intensity * 0.12 - variance * 0.04, -0.08, 0.08);
    const entanglementDelta = clamp(intensity * 0.1 - noise * 0.07 + mean * 0.05, -0.12, 0.12);
    const energyDelta = clamp((Math.abs(mean) + variance) * 0.15 - noise * 0.05, -0.1, 0.1);

    const nextLearningRate = options.adaptiveLearningRate
      ? clamp(this.state.learningRate + (variance > 0.2 ? 0.04 : -0.03))
      : this.state.learningRate;

    this.state = {
      coherence: clamp(this.state.coherence + coherenceDelta),
      entanglementDensity: clamp(this.state.entanglementDensity + entanglementDelta),
      energyUtilization: clamp(this.state.energyUtilization + energyDelta),
      learningRate: nextLearningRate,
      iteration: this.state.iteration + 1,
    };

    return this.snapshot;
  }

  reset(state?: Partial<QuantumNeuromorphicState>) {
    this.state = {
      coherence: 0.8,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.45,
      iteration: 0,
      ...state,
    };
  }
}

export const runQuantumNeuromorphicCycle = (
  engine: QuantumNeuromorphicEngine,
  weightSeries: number[][],
  options?: QuantumNeuromorphicStepOptions,
): QuantumNeuromorphicState[] => {
  return weightSeries.map((weights) => engine.step(weights, options));
};
