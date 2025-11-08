'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass NeuroSync System
 * Brain-computer interface hooks for EEG-based attention/focus feedback and neural UI adaptation
 * Part of Next-Wave Systems (10/10) - Multi-Sensory Integration
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

// Neural signal types
interface EEGSignal {
  timestamp: number;
  channels: {
    fp1: number; // Left frontal
    fp2: number; // Right frontal
    f3: number; // Left frontal
    f4: number; // Right frontal
    c3: number; // Left central
    c4: number; // Right central
    p3: number; // Left parietal
    p4: number; // Right parietal
    o1: number; // Left occipital
    o2: number; // Right occipital
  };
  quality: number; // Signal quality 0-1
}

interface NeuroMetrics {
  attention: number; // 0-1, higher = more focused
  relaxation: number; // 0-1, higher = more relaxed
  meditation: number; // 0-1, higher = meditative state
  engagement: number; // 0-1, higher = more engaged
  cognitiveLoad: number; // 0-1, higher = more mental effort
  fatigue: number; // 0-1, higher = more tired
  stress: number; // 0-1, higher = more stressed
  flow: number; // 0-1, higher = flow state
}

interface NeuroAdaptation {
  id: string;
  trigger: NeuroMetrics;
  adaptation: {
    uiComplexity: "minimal" | "standard" | "detailed";
    colorScheme: "high-contrast" | "normal" | "low-contrast";
    animationIntensity: "none" | "subtle" | "normal" | "enhanced";
    interactionStyle: "passive" | "standard" | "proactive";
    contentDensity: "sparse" | "normal" | "dense";
    cognitiveSupport: "high" | "medium" | "low";
  };
  confidence: number;
  appliedAt?: number;
}

interface BrainwavePatterns {
  delta: number; // 0.5-4 Hz (deep sleep)
  theta: number; // 4-8 Hz (meditation, creativity)
  alpha: number; // 8-13 Hz (relaxed awareness)
  beta: number; // 13-30 Hz (active thinking)
  gamma: number; // 30-100 Hz (high-level cognitive function)
}

interface NeuroFeedback {
  type: "attention" | "relaxation" | "meditation" | "engagement" | "flow";
  intensity: number;
  duration: number;
  visual: boolean;
  audio: boolean;
  haptic: boolean;
}

// EEG signal processing using digital signal processing techniques
class EEGProcessor {
  private sampleRate: number;
  private bufferSize: number;
  private signalBuffer: EEGSignal[];
  private filteredBuffer: Map<string, number[]>;
  private bandpassFilters: Map<string, ButterworthFilter>;

  constructor(sampleRate: number = 256) {
    this.sampleRate = sampleRate;
    this.bufferSize = sampleRate * 4; // 4 seconds of data
    this.signalBuffer = [];
    this.filteredBuffer = new Map();
    this.bandpassFilters = new Map();

    this.initializeFilters();
  }

  private initializeFilters(): void {
    // Bandpass filters for different brainwave frequencies
    this.bandpassFilters.set(
      "delta",
      new ButterworthFilter(0.5, 4, this.sampleRate, "bandpass")
    );
    this.bandpassFilters.set(
      "theta",
      new ButterworthFilter(4, 8, this.sampleRate, "bandpass")
    );
    this.bandpassFilters.set(
      "alpha",
      new ButterworthFilter(8, 13, this.sampleRate, "bandpass")
    );
    this.bandpassFilters.set(
      "beta",
      new ButterworthFilter(13, 30, this.sampleRate, "bandpass")
    );
    this.bandpassFilters.set(
      "gamma",
      new ButterworthFilter(30, 100, this.sampleRate, "bandpass")
    );

    // Initialize filtered buffers
    Object.keys(this.bandpassFilters).forEach((band: any) => {
      this.filteredBuffer.set(band, []);
    });
  }

  processSignal(signal: EEGSignal): NeuroMetrics {
    this.signalBuffer.push(signal);

    // Maintain buffer size
    if (this.signalBuffer.length > this.bufferSize) {
      this.signalBuffer.shift();
    }

    // Apply filters and extract brainwave patterns
    const brainwaves = this.extractBrainwavePatterns(signal);

    // Calculate neural metrics
    const metrics = this.calculateNeuroMetrics(brainwaves, signal);

    return metrics;
  }

  private extractBrainwavePatterns(signal: EEGSignal): BrainwavePatterns {
    const patterns: BrainwavePatterns = {
      delta: 0,
      theta: 0,
      alpha: 0,
      beta: 0,
      gamma: 0,
    };

    // Average across all channels for simplicity
    const channels = Object.values(signal.channels);
    const avgSignal =
      channels.reduce((sum, val) => sum + val, 0) / channels.length;

    // Apply bandpass filters
    this.bandpassFilters.forEach((filter, band) => {
      const filtered = filter.process(avgSignal);
      const buffer = this.filteredBuffer.get(band)!;
      buffer.push(filtered);

      // Maintain buffer size
      if (buffer.length > 256) {
        // 1 second of data
        buffer.shift();
      }

      // Calculate power spectral density (simplified)
      if (buffer.length >= 128) {
        const power = this.calculatePowerSpectralDensity(buffer);
        patterns[band as keyof BrainwavePatterns] = power;
      }
    });

    return patterns;
  }

  private calculatePowerSpectralDensity(signal: number[]): number {
    // Simplified PSD calculation using RMS
    const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
    const rms = Math.sqrt(
      signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        signal.length
    );
    return rms;
  }

  private calculateNeuroMetrics(
    brainwaves: BrainwavePatterns,
    signal: EEGSignal
  ): NeuroMetrics {
    // Advanced algorithms based on neuroscience research

    // Attention (beta/theta ratio)
    const attention = Math.min(
      1,
      Math.max(0, brainwaves.beta / (brainwaves.theta + 0.001))
    );

    // Relaxation (alpha prominence)
    const relaxation = Math.min(
      1,
      brainwaves.alpha / (brainwaves.beta + brainwaves.gamma + 0.001)
    );

    // Meditation (theta/beta ratio with alpha component)
    const meditation = Math.min(
      1,
      (brainwaves.theta + brainwaves.alpha) / (brainwaves.beta + 0.001)
    );

    // Engagement (beta + gamma activity)
    const engagement = Math.min(1, (brainwaves.beta + brainwaves.gamma) / 2);

    // Cognitive load (gamma activity with beta support)
    const cognitiveLoad = Math.min(1, brainwaves.gamma + brainwaves.beta * 0.5);

    // Fatigue (delta prominence during wake)
    const fatigue = Math.min(
      1,
      brainwaves.delta / (brainwaves.alpha + brainwaves.beta + 0.001)
    );

    // Stress (high beta with low alpha)
    const stress = Math.min(1, Math.max(0, brainwaves.beta - brainwaves.alpha));

    // Flow state (balanced alpha/theta with moderate beta)
    const alphaTheta = (brainwaves.alpha + brainwaves.theta) / 2;
    const flow = Math.min(
      1,
      alphaTheta * (1 - Math.abs(brainwaves.beta - 0.3))
    );

    return {
      attention: this.smoothMetric("attention", attention),
      relaxation: this.smoothMetric("relaxation", relaxation),
      meditation: this.smoothMetric("meditation", meditation),
      engagement: this.smoothMetric("engagement", engagement),
      cognitiveLoad: this.smoothMetric("cognitiveLoad", cognitiveLoad),
      fatigue: this.smoothMetric("fatigue", fatigue),
      stress: this.smoothMetric("stress", stress),
      flow: this.smoothMetric("flow", flow),
    };
  }

  private metricHistory: Map<string, number[]> = new Map();

  private smoothMetric(metricName: string, newValue: number): number {
    if (!this.metricHistory.has(metricName)) {
      this.metricHistory.set(metricName, []);
    }

    const history = this.metricHistory.get(metricName)!;
    history.push(newValue);

    // Keep only recent history
    if (history.length > 10) {
      history.shift();
    }

    // Apply exponential moving average
    const weights = history.map((_, i) =>
      Math.pow(0.8, history.length - 1 - i)
    );
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    const smoothed =
      history.reduce((sum, val, i) => sum + val * weights[i], 0) / weightSum;

    return Math.min(1, Math.max(0, smoothed));
  }
}

// Butterworth filter implementation for EEG signal filtering
class ButterworthFilter {
  private a: number[] = [];
  private b: number[] = [];
  private x: number[] = [];
  private y: number[] = [];

  constructor(
    lowFreq: number,
    highFreq: number,
    sampleRate: number,
    type: "lowpass" | "highpass" | "bandpass"
  ) {
    this.x = [0, 0, 0];
    this.y = [0, 0, 0];

    // Calculate filter coefficients (simplified 2nd order)
    const nyquist = sampleRate / 2;
    const low = lowFreq / nyquist;
    const high = highFreq / nyquist;

    switch (type) {
      case "lowpass":
        this.calculateLowpassCoefficients(low);
        break;
      case "highpass":
        this.calculateHighpassCoefficients(high);
        break;
      case "bandpass":
        this.calculateBandpassCoefficients(low, high);
        break;
    }
  }

  private calculateLowpassCoefficients(cutoff: number): void {
    const ita = 1.0 / Math.tan(Math.PI * cutoff);
    const q = Math.SQRT2;

    this.b = [
      1.0 / (1.0 + q * ita + ita * ita),
      2.0 / (1.0 + q * ita + ita * ita),
      1.0 / (1.0 + q * ita + ita * ita),
    ];

    this.a = [
      1.0,
      -(2.0 * (ita * ita - 1.0)) / (1.0 + q * ita + ita * ita),
      -(1.0 - q * ita + ita * ita) / (1.0 + q * ita + ita * ita),
    ];
  }

  private calculateHighpassCoefficients(cutoff: number): void {
    const ita = Math.tan(Math.PI * cutoff);
    const q = Math.SQRT2;

    this.b = [
      1.0 / (1.0 + q * ita + ita * ita),
      -2.0 / (1.0 + q * ita + ita * ita),
      1.0 / (1.0 + q * ita + ita * ita),
    ];

    this.a = [
      1.0,
      -(2.0 * (ita * ita - 1.0)) / (1.0 + q * ita + ita * ita),
      -(1.0 - q * ita + ita * ita) / (1.0 + q * ita + ita * ita),
    ];
  }

  private calculateBandpassCoefficients(
    lowCutoff: number,
    highCutoff: number
  ): void {
    // Simplified bandpass as cascade of highpass and lowpass
    const center = Math.sqrt(lowCutoff * highCutoff);
    const bandwidth = highCutoff - lowCutoff;

    this.b = [bandwidth, 0, -bandwidth];
    this.a = [
      1,
      -2 * Math.cos(2 * Math.PI * center),
      Math.pow(1 - bandwidth, 2),
    ];
  }

  process(input: number): number {
    // Shift input buffer
    this.x[2] = this.x[1];
    this.x[1] = this.x[0];
    this.x[0] = input;

    // Calculate output
    const output =
      this.b[0] * this.x[0] +
      this.b[1] * this.x[1] +
      this.b[2] * this.x[2] -
      this.a[1] * this.y[0] -
      this.a[2] * this.y[1];

    // Shift output buffer
    this.y[2] = this.y[1];
    this.y[1] = this.y[0];
    this.y[0] = output;

    return output;
  }
}

// Neural adaptation engine
class NeuroAdaptationEngine {
  private adaptations: NeuroAdaptation[];
  private currentMetrics: NeuroMetrics;
  private adaptationHistory: Array<{
    metrics: NeuroMetrics;
    adaptation: NeuroAdaptation;
    timestamp: number;
  }>;
  private learningRate: number;

  constructor() {
    this.adaptations = [];
    this.currentMetrics = this.getDefaultMetrics();
    this.adaptationHistory = [];
    this.learningRate = 0.1;

    this.initializeBaseAdaptations();
  }

  private getDefaultMetrics(): NeuroMetrics {
    return {
      attention: 0.5,
      relaxation: 0.5,
      meditation: 0.5,
      engagement: 0.5,
      cognitiveLoad: 0.5,
      fatigue: 0.5,
      stress: 0.5,
      flow: 0.5,
    };
  }

  private initializeBaseAdaptations(): void {
    // High cognitive load adaptation
    this.adaptations.push({
      id: "high-cognitive-load",
      trigger: { ...this.getDefaultMetrics(), cognitiveLoad: 0.8, stress: 0.7 },
      adaptation: {
        uiComplexity: "minimal",
        colorScheme: "high-contrast",
        animationIntensity: "none",
        interactionStyle: "passive",
        contentDensity: "sparse",
        cognitiveSupport: "high",
      },
      confidence: 0.9,
    });

    // Flow state adaptation
    this.adaptations.push({
      id: "flow-state",
      trigger: {
        ...this.getDefaultMetrics(),
        flow: 0.8,
        attention: 0.7,
        engagement: 0.8,
      },
      adaptation: {
        uiComplexity: "minimal",
        colorScheme: "normal",
        animationIntensity: "subtle",
        interactionStyle: "passive",
        contentDensity: "normal",
        cognitiveSupport: "low",
      },
      confidence: 0.85,
    });

    // Low attention adaptation
    this.adaptations.push({
      id: "low-attention",
      trigger: { ...this.getDefaultMetrics(), attention: 0.3, engagement: 0.4 },
      adaptation: {
        uiComplexity: "standard",
        colorScheme: "high-contrast",
        animationIntensity: "enhanced",
        interactionStyle: "proactive",
        contentDensity: "sparse",
        cognitiveSupport: "high",
      },
      confidence: 0.8,
    });

    // Fatigue adaptation
    this.adaptations.push({
      id: "fatigue",
      trigger: {
        ...this.getDefaultMetrics(),
        fatigue: 0.7,
        cognitiveLoad: 0.6,
      },
      adaptation: {
        uiComplexity: "minimal",
        colorScheme: "low-contrast",
        animationIntensity: "none",
        interactionStyle: "passive",
        contentDensity: "sparse",
        cognitiveSupport: "high",
      },
      confidence: 0.75,
    });

    // Relaxed state adaptation
    this.adaptations.push({
      id: "relaxed",
      trigger: {
        ...this.getDefaultMetrics(),
        relaxation: 0.8,
        meditation: 0.6,
      },
      adaptation: {
        uiComplexity: "detailed",
        colorScheme: "normal",
        animationIntensity: "subtle",
        interactionStyle: "standard",
        contentDensity: "normal",
        cognitiveSupport: "medium",
      },
      confidence: 0.7,
    });
  }

  analyzeAndAdapt(metrics: NeuroMetrics): NeuroAdaptation | null {
    this.currentMetrics = metrics;

    // Find best matching adaptation
    let bestAdaptation: NeuroAdaptation | null = null;
    let bestScore = 0;

    for (const adaptation of this.adaptations) {
      const score = this.calculateAdaptationScore(metrics, adaptation.trigger);

      if (score > bestScore && score > 0.6) {
        // Threshold for activation
        bestScore = score;
        bestAdaptation = { ...adaptation, confidence: score };
      }
    }

    if (bestAdaptation) {
      bestAdaptation.appliedAt = Date.now();

      // Record in history for learning
      this.adaptationHistory.push({
        metrics: { ...metrics },
        adaptation: bestAdaptation,
        timestamp: Date.now(),
      });

      // Limit history
      if (this.adaptationHistory.length > 100) {
        this.adaptationHistory.shift();
      }
    }

    return bestAdaptation;
  }

  private calculateAdaptationScore(
    current: NeuroMetrics,
    trigger: NeuroMetrics
  ): number {
    const weights = {
      attention: 1.2,
      relaxation: 1.0,
      meditation: 0.8,
      engagement: 1.1,
      cognitiveLoad: 1.3,
      fatigue: 1.1,
      stress: 1.2,
      flow: 1.4,
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(trigger).forEach((key: any) => {
      const metricKey = key as keyof NeuroMetrics;
      const currentValue = current[metricKey];
      const triggerValue = trigger[metricKey];
      const weight = weights[metricKey];

      // Calculate similarity (inverse of difference)
      const similarity = 1 - Math.abs(currentValue - triggerValue);
      const score = similarity * weight;

      totalScore += score;
      totalWeight += weight;
    });

    return totalScore / totalWeight;
  }

  learnFromFeedback(adaptationId: string, effectiveness: number): void {
    const adaptation = this.adaptations.find((a) => a.id === adaptationId);
    if (adaptation) {
      // Adjust confidence based on effectiveness
      const adjustment = (effectiveness - 0.5) * this.learningRate;
      adaptation.confidence = Math.max(
        0.1,
        Math.min(0.95, adaptation.confidence + adjustment)
      );
    }
  }

  getCurrentAdaptation(): NeuroAdaptation | null {
    const recent = this.adaptationHistory[this.adaptationHistory.length - 1];
    return recent ? recent.adaptation : null;
  }

  getAdaptationHistory(): Array<{
    metrics: NeuroMetrics;
    adaptation: NeuroAdaptation;
    timestamp: number;
  }> {
    return [...this.adaptationHistory];
  }
}

// Main NeuroSync system
class NeuroSyncSystem {
  private eegProcessor: EEGProcessor;
  private adaptationEngine: NeuroAdaptationEngine;
  private currentMetrics: NeuroMetrics;
  private isConnected: boolean;
  private deviceInfo: { name: string; type: string; channels: number } | null;
  private calibrationData: Map<string, number>;

  constructor() {
    this.eegProcessor = new EEGProcessor();
    this.adaptationEngine = new NeuroAdaptationEngine();
    this.currentMetrics = this.getDefaultMetrics();
    this.isConnected = false;
    this.deviceInfo = null;
    this.calibrationData = new Map();
  }

  private getDefaultMetrics(): NeuroMetrics {
    return {
      attention: 0.5,
      relaxation: 0.5,
      meditation: 0.5,
      engagement: 0.5,
      cognitiveLoad: 0.5,
      fatigue: 0.5,
      stress: 0.5,
      flow: 0.5,
    };
  }

  async connectDevice(
    deviceType: "muse" | "emotiv" | "neurosky" | "simulator" = "simulator"
  ): Promise<boolean> {
    try {
      if (deviceType === "simulator") {
        // Simulator mode for development
        this.isConnected = true;
        this.deviceInfo = {
          name: "NeuroSync Simulator",
          type: "simulator",
          channels: 10,
        };
        this.startSimulation();
        return true;
      }

      // Real device connection would go here
      // For now, we'll use Web Bluetooth API simulation
      if ("bluetooth" in navigator) {
        // Attempt to connect to BCI device
        console.log(`Attempting to connect to ${deviceType} device...`);

        // This would be replaced with actual device-specific connection code
        this.isConnected = true;
        this.deviceInfo = {
          name: `${deviceType} Headset`,
          type: deviceType,
          channels:
            deviceType === "emotiv" ? 14 : deviceType === "muse" ? 4 : 1,
        };

        return true;
      }

      throw new Error("Web Bluetooth not supported");
    } catch (error) {
      console.error("Failed to connect to EEG device:", error);
      return false;
    }
  }

  private startSimulation(): void {
    // Simulate realistic EEG data for development
    const simulateEEG = () => {
      if (!this.isConnected) return;

      const baseNoise = () => (Math.random() - 0.5) * 0.1;
      const time = Date.now() / 1000;

      // Simulate different brainwave patterns
      const alpha = Math.sin(time * 10) * 0.3 + baseNoise(); // 10 Hz alpha
      const beta = Math.sin(time * 20) * 0.2 + baseNoise(); // 20 Hz beta
      const theta = Math.sin(time * 6) * 0.4 + baseNoise(); // 6 Hz theta

      const signal: EEGSignal = {
        timestamp: Date.now(),
        channels: {
          fp1: alpha + beta * 0.5 + baseNoise(),
          fp2: alpha + beta * 0.5 + baseNoise(),
          f3: beta + theta * 0.3 + baseNoise(),
          f4: beta + theta * 0.3 + baseNoise(),
          c3: alpha + baseNoise(),
          c4: alpha + baseNoise(),
          p3: theta + alpha * 0.2 + baseNoise(),
          p4: theta + alpha * 0.2 + baseNoise(),
          o1: alpha * 0.8 + baseNoise(),
          o2: alpha * 0.8 + baseNoise(),
        },
        quality: 0.8 + Math.random() * 0.2,
      };

      this.processSignal(signal);
    };

    // Run simulation at ~256 Hz (realistic EEG sampling rate)
    setInterval(simulateEEG, 1000 / 256);
  }

  processSignal(signal: EEGSignal): NeuroMetrics {
    if (!this.isConnected) return this.currentMetrics;

    // Process the signal through the EEG processor
    const metrics = this.eegProcessor.processSignal(signal);
    this.currentMetrics = metrics;

    // Generate adaptation recommendations
    const adaptation = this.adaptationEngine.analyzeAndAdapt(metrics);

    return metrics;
  }

  getCurrentMetrics(): NeuroMetrics {
    return { ...this.currentMetrics };
  }

  getCurrentAdaptation(): NeuroAdaptation | null {
    return this.adaptationEngine.getCurrentAdaptation();
  }

  calibrateBaseline(duration: number = 30000): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const calibrationMetrics: NeuroMetrics[] = [];

      const collectBaseline = () => {
        if (Date.now() - startTime >= duration) {
          // Calculate baseline averages
          const avgMetrics = this.calculateAverageMetrics(calibrationMetrics);
          Object.entries(avgMetrics).forEach(([key, value]) => {
            this.calibrationData.set(`baseline_${key}`, value);
          });

          resolve();
          return;
        }

        calibrationMetrics.push({ ...this.currentMetrics });
        setTimeout(collectBaseline, 100);
      };

      collectBaseline();
    });
  }

  private calculateAverageMetrics(metrics: NeuroMetrics[]): NeuroMetrics {
    const keys = Object.keys(metrics[0]) as (keyof NeuroMetrics)[];
    const averages: Partial<NeuroMetrics> = {};

    keys.forEach((key: keyof NeuroMetrics) => {
      const sum = metrics.reduce((total, metric) => total + metric[key], 0);
      averages[key] = sum / metrics.length;
    });

    return averages as NeuroMetrics;
  }

  getDeviceInfo(): { name: string; type: string; channels: number } | null {
    return this.deviceInfo;
  }

  isDeviceConnected(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    this.isConnected = false;
    this.deviceInfo = null;
  }

  provideFeedback(adaptationId: string, effectiveness: number): void {
    this.adaptationEngine.learnFromFeedback(adaptationId, effectiveness);
  }
}

// React Context for NeuroSync
const NeuroSyncContext = createContext<{
  system: NeuroSyncSystem | null;
  metrics: NeuroMetrics;
  adaptation: NeuroAdaptation | null;
  isConnected: boolean;
  deviceInfo: { name: string; type: string; channels: number } | null;
  connectDevice: (
    type?: "muse" | "emotiv" | "neurosky" | "simulator"
  ) => Promise<boolean>;
  calibrateBaseline: () => Promise<void>;
  provideFeedback: (adaptationId: string, effectiveness: number) => void;
}>({
  system: null,
  metrics: {} as NeuroMetrics,
  adaptation: null,
  isConnected: false,
  deviceInfo: null,
  connectDevice: async () => false,
  calibrateBaseline: async () => {},
  provideFeedback: () => {},
});

// Provider component
export function GlassNeuroSyncProvider({
  children,
  onMetricsUpdate,
  onAdaptationChange,
  autoConnect = false,
}: {
  children: React.ReactNode;
  onMetricsUpdate?: (metrics: NeuroMetrics) => void;
  onAdaptationChange?: (adaptation: NeuroAdaptation | null) => void;
  autoConnect?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const systemRef = useRef<NeuroSyncSystem>();
  const [metrics, setMetrics] = useState<NeuroMetrics>({} as NeuroMetrics);
  const [adaptation, setAdaptation] = useState<NeuroAdaptation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{
    name: string;
    type: string;
    channels: number;
  } | null>(null);

  // Initialize system
  useEffect(() => {
    systemRef.current = new NeuroSyncSystem();

    if (autoConnect) {
      systemRef.current.connectDevice("simulator").then((connected) => {
        setIsConnected(connected);
        if (connected) {
          setDeviceInfo(systemRef.current!.getDeviceInfo());
        }
      });
    }

    // Update metrics periodically
    const updateInterval = setInterval(() => {
      if (systemRef.current && systemRef.current.isDeviceConnected()) {
        const currentMetrics = systemRef.current.getCurrentMetrics();
        const currentAdaptation = systemRef.current.getCurrentAdaptation();

        setMetrics(currentMetrics);
        setAdaptation(currentAdaptation);

        onMetricsUpdate?.(currentMetrics);
        onAdaptationChange?.(currentAdaptation);
      }
    }, 100); // 10Hz update rate

    return () => clearInterval(updateInterval);
  }, [autoConnect, onMetricsUpdate, onAdaptationChange]);

  const connectDevice = useCallback(
    async (
      type: "muse" | "emotiv" | "neurosky" | "simulator" = "simulator"
    ) => {
      if (!systemRef.current) return false;

      const connected = await systemRef.current.connectDevice(type);
      setIsConnected(connected);

      if (connected) {
        setDeviceInfo(systemRef.current.getDeviceInfo());
      }

      return connected;
    },
    []
  );

  const calibrateBaseline = useCallback(async () => {
    if (systemRef.current) {
      await systemRef.current.calibrateBaseline();
    }
  }, []);

  const provideFeedback = useCallback(
    (adaptationId: string, effectiveness: number) => {
      systemRef.current?.provideFeedback(adaptationId, effectiveness);
    },
    []
  );

  const value = {
    system: systemRef.current || null,
    metrics,
    adaptation,
    isConnected,
    deviceInfo,
    connectDevice,
    calibrateBaseline,
    provideFeedback,
  };

  return (
    <NeuroSyncContext.Provider value={value}>
      {children}
    </NeuroSyncContext.Provider>
  );
}

// Hook to use NeuroSync
export function useNeuroSync() {
  const context = useContext(NeuroSyncContext);
  if (!context) {
    throw new Error("useNeuroSync must be used within GlassNeuroSyncProvider");
  }
  return context;
}

// Neural metrics dashboard
export function GlassNeuroMetricsDashboard({
  className,
  showBrainwaves = true,
}: {
  className?: string;
  showBrainwaves?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { metrics, adaptation, isConnected, deviceInfo } = useNeuroSync();
  const [showDashboard, setShowDashboard] = useState(false);

  const metricsArray = Object.entries(metrics).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value || 0,
    color:
      {
        attention: "var(--glass-color-primary)",
        relaxation: "var(--glass-color-success)",
        meditation: "#8b5cf6",
        engagement: "var(--glass-color-warning)",
        cognitiveLoad: "var(--glass-color-danger)",
        fatigue: "var(--glass-gray-500)",
        stress: "var(--glass-color-danger-dark)",
        flow: "#06b6d4",
      }[name] || "var(--glass-gray-500)",
  }));

  return (
    <div
      className={cn(
        "glass-fixed glass-bottom-4 glass-left-4 glass-z-50",
        className
      )}
    >
      <motion.button
        className={cn(
          "w-14 h-14 glass-radius-full glass-surface-primary glass-elev-4",
          "flex items-center justify-center glass-text-primary",
          "transition-all duration-300 hover:scale-105",
          isConnected ? "animate-pulse" : ""
        )}
        onClick={() => setShowDashboard(!showDashboard)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🧠
        <div
          className={cn(
            "glass-absolute glass--top-1 glass-right-1 glass-w-4 glass-h-4 glass-radius-full",
            isConnected ? "glass-surface-success" : "glass-surface-danger"
          )}
          style={{ opacity: 0.8 }}
        />
      </motion.button>

      <AnimatePresence>
        {showDashboard && (
          <motion.div
            className={cn(
              "absolute bottom-16 left-0 w-96 max-h-[80vh] overflow-y-auto",
              "glass-surface-primary glass-elev-5 glass-radius-lg glass-p-6 glass-gap-4"
            )}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <div className="glass-flex glass-items-center glass-justify-between">
              <h3 className="glass-text-lg font-semibold text-primary">
                NeuroSync Dashboard
              </h3>
              <button
                onClick={() => setShowDashboard(false)}
                className="glass-text-sm glass-text-secondary hover:text-primary glass-focus glass-touch-target glass-contrast-guard"
              >
                ✕
              </button>
            </div>

            {/* Device Status */}
            <div className="glass-gap-2">
              <h4 className="glass-text-sm font-medium glass-text-secondary uppercase tracking-wide">
                Device Status
              </h4>
              <div className="glass-p-3 glass-surface-secondary glass-radius-md">
                <div className="glass-flex glass-items-center glass-justify-between">
                  <span className="glass-text-sm text-primary">
                    {deviceInfo?.name || "No Device"}
                  </span>
                  <div className="glass-flex glass-items-center glass-gap-2">
                    <div
                      className={cn(
                        "glass-w-2 glass-h-2 glass-radius-full",
                        isConnected
                          ? "glass-surface-success"
                          : "glass-surface-danger"
                      )}
                    />
                    <span className="glass-text-xs glass-text-secondary">
                      {isConnected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                </div>
                {deviceInfo && (
                  <div className="glass-mt-1 glass-text-xs glass-text-tertiary">
                    {deviceInfo.channels} channels • {deviceInfo.type}
                  </div>
                )}
              </div>
            </div>

            {/* Neural Metrics */}
            <div className="glass-gap-2">
              <h4 className="glass-text-sm font-medium glass-text-secondary uppercase tracking-wide">
                Neural Metrics
              </h4>
              <div className="glass-grid glass-grid-cols-2 glass-gap-2">
                {metricsArray.map((metric: any) => (
                  <div
                    key={metric.name}
                    className="glass-p-3 glass-surface-secondary glass-radius-md"
                  >
                    <div className="glass-text-xs font-medium text-primary">
                      {metric.name}
                    </div>
                    <div className="glass-mt-2 glass-flex glass-items-center glass-gap-2">
                      <div className="glass-flex-1 glass-surface-subtle glass-radius-full h-2">
                        <motion.div
                          className="h-2 glass-radius-full"
                          ref={(el) => {
                            if (el) el.style.backgroundColor = metric.color;
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value * 100}%` }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { duration: 0.3 }
                          }
                        />
                      </div>
                      <span className="glass-text-xs glass-text-secondary w-8 text-right">
                        {(metric.value * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Adaptation */}
            {adaptation && (
              <div className="glass-gap-2">
                <h4 className="glass-text-sm font-medium glass-text-secondary uppercase tracking-wide">
                  Active Adaptation
                </h4>
                <div className="glass-p-3 glass-surface-secondary glass-radius-md">
                  <div className="glass-text-sm text-primary font-medium mb-2">
                    {adaptation.id
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="glass-text-xs glass-text-tertiary glass-gap-1">
                    <div>UI: {adaptation.adaptation.uiComplexity}</div>
                    <div>Colors: {adaptation.adaptation.colorScheme}</div>
                    <div>
                      Animation: {adaptation.adaptation.animationIntensity}
                    </div>
                  </div>
                  <div className="glass-mt-2 glass-flex glass-items-center glass-justify-between">
                    <span className="glass-text-xs glass-text-secondary">
                      Confidence: {(adaptation.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="text-center glass-text-sm glass-text-secondary glass-py-4">
                Connect an EEG device to start neural monitoring
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Neural feedback component
export function GlassNeuroFeedback({
  type,
  target = 0.8,
  className,
}: {
  type: keyof NeuroMetrics;
  target?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { metrics } = useNeuroSync();
  const currentValue = metrics[type] || 0;
  const difference = currentValue - target;
  const isOnTarget = Math.abs(difference) < 0.1;

  return (
    <div className={cn("glass-flex glass-items-center glass-gap-3", className)}>
      <div className="glass-text-sm text-primary capitalize font-medium">
        {type}
      </div>
      <div className="glass-flex-1 relative">
        <div className="glass-w-full h-4 glass-surface-subtle glass-radius-full glass-overflow-hidden">
          <motion.div
            className="glass-h-full glass-radius-full"
            ref={(el) => {
              if (!el) return;
              el.style.backgroundColor = isOnTarget
                ? "var(--glass-color-success)"
                : difference > 0
                  ? "var(--glass-color-primary)"
                  : "var(--glass-color-warning)";
            }}
            animate={{ width: `${currentValue * 100}%` }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
            }
          />
          {/* Target indicator */}
          <div
            className="absolute top-0 w-1 glass-h-full glass-surface-subtle opacity-60"
            ref={(el) => {
              if (el) el.style.left = `${target * 100}%`;
            }}
          />
        </div>
      </div>
      <div className="glass-text-sm glass-text-secondary w-12 text-right">
        {(currentValue * 100).toFixed(0)}%
      </div>
    </div>
  );
}

// Hook for neuro-adaptive components
export function useNeuroAdaptive() {
  const { metrics, adaptation } = useNeuroSync();

  const getAdaptiveStyle = useCallback(
    (baseStyle: React.CSSProperties = {}) => {
      if (!adaptation) return baseStyle;

      const adaptiveStyle: React.CSSProperties = { ...baseStyle };

      // Apply color scheme adaptations
      switch (adaptation.adaptation.colorScheme) {
        case "high-contrast":
          adaptiveStyle.filter = "contrast(1.5)";
          break;
        case "low-contrast":
          adaptiveStyle.filter = "contrast(0.7)";
          break;
      }

      // Apply animation adaptations
      switch (adaptation.adaptation.animationIntensity) {
        case "none":
          adaptiveStyle.animation = "none";
          adaptiveStyle.transition = "none";
          break;
        case "subtle":
          adaptiveStyle.animationDuration = "0.8s";
          break;
        case "enhanced":
          adaptiveStyle.animationDuration = "0.3s";
          break;
      }

      return adaptiveStyle;
    },
    [adaptation]
  );

  const getAdaptiveClassName = useCallback(
    (baseClassName: string = "") => {
      if (!adaptation) return baseClassName;

      const classes = [baseClassName];

      // Add complexity classes
      classes.push(`neuro-complexity-${adaptation.adaptation.uiComplexity}`);
      classes.push(`neuro-density-${adaptation.adaptation.contentDensity}`);
      classes.push(`neuro-support-${adaptation.adaptation.cognitiveSupport}`);

      return classes.filter(Boolean).join(" ");
    },
    [adaptation]
  );

  return {
    metrics,
    adaptation,
    getAdaptiveStyle,
    getAdaptiveClassName,
    isHighCognitiveLoad: metrics.cognitiveLoad > 0.7,
    isInFlowState: metrics.flow > 0.7,
    needsAttentionSupport: metrics.attention < 0.4,
    isFatigued: metrics.fatigue > 0.6,
  };
}

// Presets for different BCI devices and configurations
export const neuroSyncPresets = {
  muse: {
    sampleRate: 256,
    channels: ["TP9", "AF7", "AF8", "TP10"],
    filterSettings: {
      highpass: 1.0,
      lowpass: 50.0,
      notch: 60.0,
    },
  },
  emotiv: {
    sampleRate: 256,
    channels: [
      "AF3",
      "F7",
      "F3",
      "FC5",
      "T7",
      "P7",
      "O1",
      "O2",
      "P8",
      "T8",
      "FC6",
      "F4",
      "F8",
      "AF4",
    ],
    filterSettings: {
      highpass: 0.5,
      lowpass: 45.0,
      notch: 60.0,
    },
  },
  neurosky: {
    sampleRate: 512,
    channels: ["FP1"],
    filterSettings: {
      highpass: 3.0,
      lowpass: 100.0,
      notch: 60.0,
    },
  },
  simulator: {
    sampleRate: 256,
    channels: ["FP1", "FP2", "F3", "F4", "C3", "C4", "P3", "P4", "O1", "O2"],
    filterSettings: {
      highpass: 0.5,
      lowpass: 50.0,
      notch: 60.0,
    },
  },
};