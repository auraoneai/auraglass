import {
  QuantumNeuromorphicEngine,
  runQuantumNeuromorphicCycle,
} from "./QuantumNeuromorphicEngine";

describe("QuantumNeuromorphicEngine", () => {
  it("initializes with documented defaults and protects its internal snapshot", () => {
    const engine = new QuantumNeuromorphicEngine();

    expect(engine.snapshot).toEqual({
      coherence: 0.8,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.45,
      iteration: 0,
    });

    const externalSnapshot = engine.snapshot;
    externalSnapshot.coherence = 0;
    externalSnapshot.iteration = 99;

    expect(engine.snapshot.coherence).toBe(0.8);
    expect(engine.snapshot.iteration).toBe(0);
  });

  it("accepts a partial initial state without replacing remaining defaults", () => {
    const engine = new QuantumNeuromorphicEngine({
      coherence: 0.64,
      learningRate: 0.28,
      iteration: 12,
    });

    expect(engine.snapshot).toEqual({
      coherence: 0.64,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.28,
      iteration: 12,
    });
  });

  it("steps deterministically from a synaptic-weight sample", () => {
    const engine = new QuantumNeuromorphicEngine();

    const next = engine.step([0.2, 0.4, 0.6]);

    expect(next.coherence).toBeCloseTo(0.88, 10);
    expect(next.entanglementDensity).toBeCloseTo(0.7874, 10);
    expect(next.energyUtilization).toBeCloseTo(0.705, 10);
    expect(next.learningRate).toBeCloseTo(0.45, 10);
    expect(next.iteration).toBe(1);
    expect(engine.snapshot).toEqual(next);
  });

  it("advances an empty step without changing the learned state", () => {
    const engine = new QuantumNeuromorphicEngine({
      coherence: 0.61,
      entanglementDensity: 0.52,
      energyUtilization: 0.43,
      learningRate: 0.34,
      iteration: 7,
    });

    expect(engine.step([])).toEqual({
      coherence: 0.61,
      entanglementDensity: 0.52,
      energyUtilization: 0.43,
      learningRate: 0.34,
      iteration: 8,
    });
  });

  it("adapts learning rate upward for high variance and downward for low variance", () => {
    const highVarianceEngine = new QuantumNeuromorphicEngine();
    const lowVarianceEngine = new QuantumNeuromorphicEngine();
    const fixedRateEngine = new QuantumNeuromorphicEngine();

    const highVariance = highVarianceEngine.step([-1, 1], {
      adaptiveLearningRate: true,
    });
    const lowVariance = lowVarianceEngine.step([0.4, 0.5, 0.6], {
      adaptiveLearningRate: true,
    });
    const fixedRate = fixedRateEngine.step([-1, 1], {
      adaptiveLearningRate: false,
    });

    expect(highVariance.learningRate).toBeCloseTo(0.49, 10);
    expect(lowVariance.learningRate).toBeCloseTo(0.42, 10);
    expect(fixedRate.learningRate).toBeCloseTo(0.45, 10);
  });

  it("clamps evolved metrics and adaptive learning rate to the unit interval", () => {
    const upperBoundEngine = new QuantumNeuromorphicEngine({
      coherence: 0.99,
      entanglementDensity: 0.99,
      energyUtilization: 0.99,
      learningRate: 0.99,
    });
    const lowerBoundEngine = new QuantumNeuromorphicEngine({
      coherence: 0.01,
      entanglementDensity: 0.01,
      energyUtilization: 0.01,
      learningRate: 0.01,
    });

    const upperBound = upperBoundEngine.step([100, 100], {
      fieldIntensity: 99,
      decoherenceNoise: -99,
      adaptiveLearningRate: true,
    });
    const lowerBound = lowerBoundEngine.step([-100, -100], {
      fieldIntensity: -99,
      decoherenceNoise: 99,
      adaptiveLearningRate: true,
    });

    for (const state of [upperBound, lowerBound]) {
      expect(state.coherence).toBeGreaterThanOrEqual(0);
      expect(state.coherence).toBeLessThanOrEqual(1);
      expect(state.entanglementDensity).toBeGreaterThanOrEqual(0);
      expect(state.entanglementDensity).toBeLessThanOrEqual(1);
      expect(state.energyUtilization).toBeGreaterThanOrEqual(0);
      expect(state.energyUtilization).toBeLessThanOrEqual(1);
      expect(state.learningRate).toBeGreaterThanOrEqual(0);
      expect(state.learningRate).toBeLessThanOrEqual(1);
    }
  });

  it("resets to defaults or a supplied partial state", () => {
    const engine = new QuantumNeuromorphicEngine();
    engine.step([0.3, 0.7]);

    engine.reset({ coherence: 0.55, iteration: 4 });
    expect(engine.snapshot).toEqual({
      coherence: 0.55,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.45,
      iteration: 4,
    });

    engine.reset();
    expect(engine.snapshot).toEqual({
      coherence: 0.8,
      entanglementDensity: 0.72,
      energyUtilization: 0.65,
      learningRate: 0.45,
      iteration: 0,
    });
  });

  it("runs a complete weight series in order and returns each independent state", () => {
    const engine = new QuantumNeuromorphicEngine();
    const states = runQuantumNeuromorphicCycle(
      engine,
      [[0.2, 0.4, 0.6], [-0.7, 0.1, 0.8], []],
      { adaptiveLearningRate: true }
    );

    expect(states).toHaveLength(3);
    expect(states.map((state) => state.iteration)).toEqual([1, 2, 3]);
    expect(states[0]).not.toBe(states[1]);
    expect(states[1]).not.toBe(states[2]);
    expect(engine.snapshot).toEqual(states[2]);
  });
});
