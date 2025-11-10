'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Contextual Engine
 * Hyper-contextual adaptation system that fuses biometrics, device sensors, and environment data
 * Part of Next-Wave Systems (10/10) - Hyper-Contextual Adaptation
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

// Context data types
interface BiometricData {
  heartRate?: number; // BPM
  heartRateVariability?: number; // RMSSD
  skinConductance?: number; // microsiemens
  bodyTemperature?: number; // Celsius
  bloodOxygen?: number; // SpO2 percentage
  respiratoryRate?: number; // breaths per minute
  stressLevel?: number; // 0-1 calculated metric
  arousalLevel?: number; // 0-1 calculated metric
}

interface EnvironmentData {
  lightLevel: number; // lux
  lightTemperature: number; // Kelvin
  ambientNoise: number; // dB
  humidity: number; // percentage
  temperature: number; // Celsius
  pressure: number; // hPa
  uvIndex?: number; // UV index
  weather?: string; // weather condition
  timeOfDay:
    | "dawn"
    | "morning"
    | "noon"
    | "afternoon"
    | "evening"
    | "dusk"
    | "night";
  season: "spring" | "summer" | "autumn" | "winter";
}

interface DeviceSensorData {
  accelerometer: { x: number; y: number; z: number };
  gyroscope: { alpha: number; beta: number; gamma: number };
  magnetometer?: { x: number; y: number; z: number };
  deviceMotion: "static" | "gentle" | "moderate" | "active";
  batteryLevel: number; // 0-1
  networkQuality: "excellent" | "good" | "fair" | "poor" | "offline";
  screenBrightness: number; // 0-1
  deviceTemperature?: number; // estimated device heat
}

interface LocationContext {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  locationType: "indoor" | "outdoor" | "vehicle" | "unknown";
  activityType:
    | "stationary"
    | "walking"
    | "running"
    | "cycling"
    | "driving"
    | "unknown";
}

interface ContextualState {
  biometrics: BiometricData;
  environment: EnvironmentData;
  device: DeviceSensorData;
  location: LocationContext;
  timestamp: number;
  quality: number; // Overall data quality 0-1
}

interface ContextualAdaptation {
  id: string;
  priority: number;
  contextMatch: number; // How well context matches 0-1
  adaptations: {
    visual: {
      brightness: number; // -1 to 1 adjustment
      contrast: number; // -1 to 1 adjustment
      saturation: number; // -1 to 1 adjustment
      colorTemperature: number; // -1 to 1 (cooler to warmer)
      blur: number; // 0-1 blur intensity
      opacity: number; // 0-1 opacity
    };
    animation: {
      speed: number; // 0-2 speed multiplier
      intensity: number; // 0-2 intensity multiplier
      type: "minimal" | "standard" | "enhanced" | "disabled";
      easing: "linear" | "ease" | "ease-in" | "ease-out" | "bounce" | "elastic";
    };
    interaction: {
      sensitivity: number; // 0-2 touch/click sensitivity
      hapticFeedback: number; // 0-1 haptic intensity
      responseDelay: number; // 0-500ms additional delay
      gestureThreshold: number; // 0-1 gesture detection sensitivity
    };
    layout: {
      density: "sparse" | "normal" | "dense";
      complexity: "minimal" | "standard" | "detailed";
      spacing: number; // 0.5-2 spacing multiplier
      fontSize: number; // 0.8-1.5 font size multiplier
    };
    sound: {
      volume: number; // 0-1 system sound volume
      frequency: number; // 0-1 frequency bias (lower-higher)
      spatialAudio: boolean; // 3D audio positioning
      environmentalAudio: boolean; // Ambient sound integration
    };
  };
  confidence: number;
  appliedAt?: number;
  duration?: number;
}

// Multi-sensor fusion system using Kalman filtering
class SensorFusionSystem {
  private kalmanFilters: Map<string, KalmanFilter>;
  private sensorWeights: Map<string, number>;
  private fusedData: Map<string, number>;
  private dataQuality: Map<string, number>;

  constructor() {
    this.kalmanFilters = new Map();
    this.sensorWeights = new Map();
    this.fusedData = new Map();
    this.dataQuality = new Map();

    this.initializeFilters();
  }

  private initializeFilters(): void {
    // Initialize Kalman filters for key metrics
    const metrics = [
      "lightLevel",
      "ambientNoise",
      "temperature",
      "humidity",
      "heartRate",
      "stressLevel",
      "batteryLevel",
      "deviceMotion",
    ];

    metrics.forEach((metric: any) => {
      this.kalmanFilters.set(metric, new KalmanFilter());
      this.sensorWeights.set(metric, 1.0);
      this.dataQuality.set(metric, 1.0);
    });
  }

  fuseContextualData(context: ContextualState): ContextualState {
    const fusedContext = { ...context };

    // Fuse biometric data
    if (context.biometrics.heartRate !== undefined) {
      const filtered = this.kalmanFilters
        .get("heartRate")!
        .filter(context.biometrics.heartRate);
      fusedContext.biometrics.heartRate = filtered;
    }

    // Fuse environmental data
    const lightFiltered = this.kalmanFilters
      .get("lightLevel")!
      .filter(context.environment.lightLevel);
    fusedContext.environment.lightLevel = lightFiltered;

    const noiseFiltered = this.kalmanFilters
      .get("ambientNoise")!
      .filter(context.environment.ambientNoise);
    fusedContext.environment.ambientNoise = noiseFiltered;

    const tempFiltered = this.kalmanFilters
      .get("temperature")!
      .filter(context.environment.temperature);
    fusedContext.environment.temperature = tempFiltered;

    // Calculate overall quality based on sensor reliability
    const qualityScores = Array.from(this.dataQuality.values());
    fusedContext.quality =
      qualityScores.reduce((sum, q) => sum + q, 0) / qualityScores.length;

    return fusedContext;
  }

  updateSensorWeights(sensorId: string, accuracy: number): void {
    this.sensorWeights.set(sensorId, Math.max(0.1, Math.min(1.0, accuracy)));
    this.dataQuality.set(sensorId, accuracy);
  }

  getFusedValue(metricId: string): number | undefined {
    return this.fusedData.get(metricId);
  }
}

// Kalman filter for sensor data smoothing
class KalmanFilter {
  private x: number; // State
  private P: number; // Covariance
  private Q: number; // Process noise
  private R: number; // Measurement noise
  private K: number; // Kalman gain

  constructor(processNoise = 0.01, measurementNoise = 0.1) {
    this.x = 0;
    this.P = 1;
    this.Q = processNoise;
    this.R = measurementNoise;
    this.K = 0;
  }

  predict(): void {
    // Predict step
    this.P = this.P + this.Q;
  }

  update(measurement: number): void {
    // Update step
    this.K = this.P / (this.P + this.R);
    this.x = this.x + this.K * (measurement - this.x);
    this.P = (1 - this.K) * this.P;
  }

  filter(measurement: number): number {
    this.predict();
    this.update(measurement);
    return this.x;
  }
}

// Advanced pattern recognition for contextual situations
class ContextPatternRecognizer {
  private patterns: Map<string, ContextualPattern>;
  private historicalContexts: ContextualState[];
  private neuralNetwork: ContextualNeuralNetwork;

  constructor() {
    this.patterns = new Map();
    this.historicalContexts = [];
    this.neuralNetwork = new ContextualNeuralNetwork();

    this.initializeCommonPatterns();
  }

  private initializeCommonPatterns(): void {
    // Define common contextual patterns
    this.patterns.set("focus-work", {
      id: "focus-work",
      conditions: {
        environment: { lightLevel: [400, 1000], ambientNoise: [30, 50] },
        biometrics: { heartRate: [60, 85], stressLevel: [0.3, 0.7] },
        device: { deviceMotion: "static", batteryLevel: [0.3, 1.0] },
        timePattern: ["morning", "afternoon"],
      },
      confidence: 0.9,
      adaptationPriority: "high",
    });

    this.patterns.set("relaxation", {
      id: "relaxation",
      conditions: {
        environment: { lightLevel: [50, 300], ambientNoise: [20, 40] },
        biometrics: { heartRate: [50, 75], stressLevel: [0.0, 0.4] },
        device: { deviceMotion: "static" },
        timePattern: ["evening", "dusk", "night"],
      },
      confidence: 0.85,
      adaptationPriority: "medium",
    });

    this.patterns.set("high-stress", {
      id: "high-stress",
      conditions: {
        biometrics: { heartRate: [90, 150], stressLevel: [0.7, 1.0] },
        environment: { ambientNoise: [60, 120] },
        device: { deviceMotion: "active" },
      },
      confidence: 0.8,
      adaptationPriority: "critical",
    });

    this.patterns.set("outdoor-bright", {
      id: "outdoor-bright",
      conditions: {
        environment: { lightLevel: [10000, 100000] },
        location: { locationType: ["outdoor"] },
        device: { screenBrightness: [0.8, 1.0] },
      },
      confidence: 0.95,
      adaptationPriority: "high",
    });
  }

  analyzeContext(context: ContextualState): string[] {
    const matchedPatterns: string[] = [];

    this.patterns.forEach((pattern, patternId) => {
      const matchScore = this.calculatePatternMatch(context, pattern);
      if (matchScore > 0.7) {
        matchedPatterns.push(patternId);
      }
    });

    // Use neural network for complex pattern recognition
    const neuralPrediction = this.neuralNetwork.predict(context);
    if (neuralPrediction.confidence > 0.8) {
      matchedPatterns.push(neuralPrediction.pattern);
    }

    return matchedPatterns;
  }

  private calculatePatternMatch(
    context: ContextualState,
    pattern: ContextualPattern
  ): number {
    let totalMatch = 0;
    let matchCount = 0;

    // Check environmental conditions
    if (pattern.conditions.environment) {
      Object.entries(pattern.conditions.environment).forEach(([key, range]) => {
        const value = (context.environment as any)[key];
        if (value !== undefined && Array.isArray(range)) {
          const match = value >= range[0] && value <= range[1] ? 1 : 0;
          totalMatch += match;
          matchCount++;
        }
      });
    }

    // Check biometric conditions
    if (pattern.conditions.biometrics) {
      Object.entries(pattern.conditions.biometrics).forEach(([key, range]) => {
        const value = (context.biometrics as any)[key];
        if (value !== undefined && Array.isArray(range)) {
          const match = value >= range[0] && value <= range[1] ? 1 : 0;
          totalMatch += match;
          matchCount++;
        }
      });
    }

    // Check device conditions
    if (pattern.conditions.device) {
      Object.entries(pattern.conditions.device).forEach(([key, condition]) => {
        const value = (context.device as any)[key];
        if (value !== undefined) {
          let match = 0;
          if (Array.isArray(condition)) {
            match = value >= condition[0] && value <= condition[1] ? 1 : 0;
          } else {
            match = value === condition ? 1 : 0;
          }
          totalMatch += match;
          matchCount++;
        }
      });
    }

    // Check time pattern
    if (pattern.conditions.timePattern) {
      const match = pattern.conditions.timePattern.includes(
        context.environment.timeOfDay
      )
        ? 1
        : 0;
      totalMatch += match;
      matchCount++;
    }

    return matchCount > 0 ? totalMatch / matchCount : 0;
  }

  learnFromContext(context: ContextualState, userSatisfaction: number): void {
    this.historicalContexts.push(context);

    // Keep only recent contexts
    if (this.historicalContexts.length > 1000) {
      this.historicalContexts.shift();
    }

    // Train neural network
    this.neuralNetwork.train(context, userSatisfaction);
  }
}

interface ContextualPattern {
  id: string;
  conditions: {
    environment?: Record<string, number[] | string>;
    biometrics?: Record<string, number[]>;
    device?: Record<string, number[] | string>;
    location?: Record<string, string[]>;
    timePattern?: string[];
  };
  confidence: number;
  adaptationPriority: "low" | "medium" | "high" | "critical";
}

// Neural network for contextual pattern learning
class ContextualNeuralNetwork {
  private weights: number[][][];
  private biases: number[][];
  private learningRate: number;

  constructor() {
    this.learningRate = 0.01;
    this.weights = [];
    this.biases = [];
    this.initializeNetwork();
  }

  private initializeNetwork(): void {
    // Simple 3-layer network: input -> hidden -> output
    const inputSize = 20; // Context features
    const hiddenSize = 40;
    const outputSize = 10; // Pattern categories

    this.weights = [
      this.randomMatrix(hiddenSize, inputSize),
      this.randomMatrix(outputSize, hiddenSize),
    ];

    this.biases = [this.randomArray(hiddenSize), this.randomArray(outputSize)];
  }

  private randomMatrix(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 - 1)
    );
  }

  private randomArray(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 2 - 1);
  }

  private contextToVector(context: ContextualState): number[] {
    return [
      context.environment.lightLevel / 100000,
      context.environment.ambientNoise / 100,
      context.environment.temperature / 40,
      context.environment.humidity / 100,
      context.biometrics.heartRate || 0 / 200,
      context.biometrics.stressLevel || 0,
      context.device.batteryLevel,
      context.device.accelerometer.x,
      context.device.accelerometer.y,
      context.device.accelerometer.z,
      context.device.gyroscope.alpha / 360,
      context.device.gyroscope.beta / 360,
      context.device.gyroscope.gamma / 360,
      context.location.latitude || 0 / 180,
      context.location.longitude || 0 / 360,
      context.quality,
      // Time features
      context.environment.timeOfDay === "morning" ? 1 : 0,
      context.environment.timeOfDay === "afternoon" ? 1 : 0,
      context.environment.timeOfDay === "evening" ? 1 : 0,
      context.environment.timeOfDay === "night" ? 1 : 0,
    ];
  }

  predict(context: ContextualState): { pattern: string; confidence: number } {
    const input = this.contextToVector(context);
    const output = this.forward(input);

    const maxIndex = output.indexOf(Math.max(...output));
    const confidence = output[maxIndex];

    const patterns = [
      "focus-work",
      "relaxation",
      "high-stress",
      "outdoor-bright",
      "low-light",
      "motion",
      "travel",
      "meeting",
      "exercise",
      "sleep",
    ];

    return {
      pattern: patterns[maxIndex] || "unknown",
      confidence: Math.max(0, Math.min(1, confidence)),
    };
  }

  private forward(input: number[]): number[] {
    let activation = input;

    for (let layer = 0; layer < this.weights.length; layer++) {
      const newActivation = [];

      for (let node = 0; node < this.weights[layer].length; node++) {
        let sum = this.biases[layer][node];
        for (let prevNode = 0; prevNode < activation.length; prevNode++) {
          sum += this.weights[layer][node][prevNode] * activation[prevNode];
        }
        newActivation.push(this.sigmoid(sum));
      }

      activation = newActivation;
    }

    return activation;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  train(context: ContextualState, satisfaction: number): void {
    // Simplified training - in practice would use backpropagation
    const adjustmentRate = this.learningRate * (satisfaction - 0.5);

    this.weights.forEach((layer: any) => {
      layer.forEach((node: any) => {
        node.forEach((weight: any, index: any) => {
          node[index] += adjustmentRate * Math.random() * 0.1;
        });
      });
    });
  }
}

// Main contextual engine
class GlassContextualEngineCore {
  private sensorFusion: SensorFusionSystem;
  private patternRecognizer: ContextPatternRecognizer;
  private currentContext: ContextualState;
  private adaptations: ContextualAdaptation[];
  private contextHistory: ContextualState[];
  private sensors: ContextualSensors;

  constructor() {
    this.sensorFusion = new SensorFusionSystem();
    this.patternRecognizer = new ContextPatternRecognizer();
    this.currentContext = this.getDefaultContext();
    this.adaptations = [];
    this.contextHistory = [];
    this.sensors = new ContextualSensors();

    this.startContextMonitoring();
  }

  private getDefaultContext(): ContextualState {
    return {
      biometrics: {},
      environment: {
        lightLevel: 300,
        lightTemperature: 6500,
        ambientNoise: 40,
        humidity: 50,
        temperature: 22,
        pressure: 1013,
        timeOfDay: "afternoon",
        season: "summer",
      },
      device: {
        accelerometer: { x: 0, y: 0, z: 9.8 },
        gyroscope: { alpha: 0, beta: 0, gamma: 0 },
        deviceMotion: "static",
        batteryLevel: 1.0,
        networkQuality: "excellent",
        screenBrightness: 0.8,
      },
      location: {
        locationType: "indoor",
        activityType: "stationary",
      },
      timestamp: Date.now(),
      quality: 1.0,
    };
  }

  private async startContextMonitoring(): Promise<void> {
    // Start sensor data collection
    await this.sensors.initialize();

    // Update context every 500ms
    setInterval(() => {
      this.updateContext();
    }, 500);

    // Generate adaptations every 2 seconds
    setInterval(() => {
      this.generateAdaptations();
    }, 2000);
  }

  private async updateContext(): Promise<void> {
    try {
      // Gather sensor data
      const environmentData = await this.sensors.getEnvironmentData();
      const biometricData = await this.sensors.getBiometricData();
      const deviceData = await this.sensors.getDeviceData();
      const locationData = await this.sensors.getLocationData();

      // Create new context
      const newContext: ContextualState = {
        biometrics: biometricData,
        environment: environmentData,
        device: deviceData,
        location: locationData,
        timestamp: Date.now(),
        quality: this.calculateContextQuality(
          environmentData,
          biometricData,
          deviceData
        ),
      };

      // Apply sensor fusion
      this.currentContext = this.sensorFusion.fuseContextualData(newContext);

      // Store in history
      this.contextHistory.push(this.currentContext);
      if (this.contextHistory.length > 200) {
        this.contextHistory.shift();
      }
    } catch (error) {
      console.warn("Failed to update context:", error);
    }
  }

  private calculateContextQuality(
    env: EnvironmentData,
    bio: BiometricData,
    device: DeviceSensorData
  ): number {
    let quality = 1.0;

    // Reduce quality based on sensor availability
    if (!bio.heartRate) quality -= 0.1;
    if (!env.lightLevel) quality -= 0.05;
    if (device.networkQuality === "poor") quality -= 0.2;
    if (device.batteryLevel < 0.2) quality -= 0.1;

    return Math.max(0.1, quality);
  }

  private generateAdaptations(): void {
    // Analyze current context for patterns
    const matchedPatterns = this.patternRecognizer.analyzeContext(
      this.currentContext
    );

    // Generate adaptations for each pattern
    matchedPatterns.forEach((patternId: any) => {
      const adaptation = this.createAdaptationForPattern(
        patternId,
        this.currentContext
      );
      if (adaptation) {
        this.adaptations.push(adaptation);
      }
    });

    // Remove old adaptations
    const now = Date.now();
    this.adaptations = this.adaptations.filter(
      (adaptation: any) =>
        !adaptation.appliedAt ||
        now - adaptation.appliedAt < (adaptation.duration || 30000)
    );

    // Sort by priority and confidence
    this.adaptations.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityWeight[this.getPriorityFromId(b.id)] -
        priorityWeight[this.getPriorityFromId(a.id)];
      return priorityDiff !== 0 ? priorityDiff : b.confidence - a.confidence;
    });
  }

  private createAdaptationForPattern(
    patternId: string,
    context: ContextualState
  ): ContextualAdaptation | null {
    const adaptationId = `${patternId}-${Date.now()}`;

    switch (patternId) {
      case "focus-work":
        return {
          id: adaptationId,
          priority: 3,
          contextMatch: 0.9,
          adaptations: {
            visual: {
              brightness: -0.1,
              contrast: 0.1,
              saturation: -0.2,
              colorTemperature: 0.2,
              blur: 0.0,
              opacity: 1.0,
            },
            animation: {
              speed: 0.8,
              intensity: 0.6,
              type: "minimal",
              easing: "ease-out",
            },
            interaction: {
              sensitivity: 1.0,
              hapticFeedback: 0.3,
              responseDelay: 0,
              gestureThreshold: 0.8,
            },
            layout: {
              density: "normal",
              complexity: "standard",
              spacing: 1.1,
              fontSize: 1.0,
            },
            sound: {
              volume: 0.3,
              frequency: 0.3,
              spatialAudio: false,
              environmentalAudio: false,
            },
          },
          confidence: 0.85,
          duration: 300000, // 5 minutes
        };

      case "high-stress":
        return {
          id: adaptationId,
          priority: 4,
          contextMatch: 0.8,
          adaptations: {
            visual: {
              brightness: -0.3,
              contrast: -0.2,
              saturation: -0.4,
              colorTemperature: -0.3,
              blur: 0.1,
              opacity: 0.9,
            },
            animation: {
              speed: 0.5,
              intensity: 0.3,
              type: "minimal",
              easing: "ease",
            },
            interaction: {
              sensitivity: 0.8,
              hapticFeedback: 0.1,
              responseDelay: 100,
              gestureThreshold: 0.6,
            },
            layout: {
              density: "sparse",
              complexity: "minimal",
              spacing: 1.5,
              fontSize: 1.1,
            },
            sound: {
              volume: 0.1,
              frequency: 0.2,
              spatialAudio: false,
              environmentalAudio: true,
            },
          },
          confidence: 0.9,
          duration: 600000, // 10 minutes
        };

      case "outdoor-bright":
        return {
          id: adaptationId,
          priority: 3,
          contextMatch: 0.95,
          adaptations: {
            visual: {
              brightness: 0.4,
              contrast: 0.5,
              saturation: 0.2,
              colorTemperature: 0.0,
              blur: 0.0,
              opacity: 1.0,
            },
            animation: {
              speed: 1.2,
              intensity: 1.5,
              type: "enhanced",
              easing: "ease-out",
            },
            interaction: {
              sensitivity: 1.3,
              hapticFeedback: 0.8,
              responseDelay: 0,
              gestureThreshold: 0.9,
            },
            layout: {
              density: "normal",
              complexity: "standard",
              spacing: 1.2,
              fontSize: 1.2,
            },
            sound: {
              volume: 0.6,
              frequency: 0.6,
              spatialAudio: true,
              environmentalAudio: false,
            },
          },
          confidence: 0.95,
          duration: 180000, // 3 minutes
        };

      case "relaxation":
        return {
          id: adaptationId,
          priority: 2,
          contextMatch: 0.85,
          adaptations: {
            visual: {
              brightness: -0.2,
              contrast: -0.1,
              saturation: 0.1,
              colorTemperature: -0.4,
              blur: 0.05,
              opacity: 0.95,
            },
            animation: {
              speed: 0.6,
              intensity: 0.4,
              type: "minimal",
              easing: "ease",
            },
            interaction: {
              sensitivity: 0.9,
              hapticFeedback: 0.2,
              responseDelay: 50,
              gestureThreshold: 0.7,
            },
            layout: {
              density: "sparse",
              complexity: "minimal",
              spacing: 1.3,
              fontSize: 1.0,
            },
            sound: {
              volume: 0.2,
              frequency: 0.1,
              spatialAudio: true,
              environmentalAudio: true,
            },
          },
          confidence: 0.8,
          duration: 900000, // 15 minutes
        };
    }

    return null;
  }

  private getPriorityFromId(
    id: string
  ): "low" | "medium" | "high" | "critical" {
    if (id.includes("stress") || id.includes("emergency")) return "critical";
    if (id.includes("focus") || id.includes("outdoor")) return "high";
    if (id.includes("relaxation") || id.includes("comfort")) return "medium";
    return "low";
  }

  // Public API
  getCurrentContext(): ContextualState {
    return { ...this.currentContext };
  }

  getCurrentAdaptations(): ContextualAdaptation[] {
    return [...this.adaptations];
  }

  getTopAdaptation(): ContextualAdaptation | null {
    return this.adaptations.length > 0 ? this.adaptations[0] : null;
  }

  provideFeedback(adaptationId: string, satisfaction: number): void {
    this.patternRecognizer.learnFromContext(this.currentContext, satisfaction);
  }

  getContextHistory(): ContextualState[] {
    return [...this.contextHistory];
  }
}

// Sensor data collection system
class ContextualSensors {
  private geolocation: Geolocation | null = null;
  private deviceMotion: DeviceMotionEvent | null = null;
  private ambientLight: any = null;
  private battery: any = null;

  async initialize(): Promise<void> {
    // CRITICAL SSR FIX: Skip all sensor initialization on server
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.warn('ContextualSensors: Skipping initialization on server');
      return;
    }

    // Request permissions and initialize sensors
    await this.initializeGeolocation();
    await this.initializeDeviceMotion();
    await this.initializeAmbientLight();
    await this.initializeBattery();
  }

  private async initializeGeolocation(): Promise<void> {
    if ("geolocation" in navigator) {
      this.geolocation = navigator.geolocation;
    }
  }

  private async initializeDeviceMotion(): Promise<void> {
    if ("DeviceMotionEvent" in window) {
      // Request permission for iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== "granted") return;
      }

      window.addEventListener("devicemotion", (event) => {
        this.deviceMotion = event;
      });
    }
  }

  private async initializeAmbientLight(): Promise<void> {
    if ("AmbientLightSensor" in window) {
      try {
        this.ambientLight = new (window as any).AmbientLightSensor();
        this.ambientLight.start();
      } catch (error) {
        console.warn("Ambient light sensor not available:", error);
      }
    }
  }

  private async initializeBattery(): Promise<void> {
    if ("getBattery" in navigator) {
      this.battery = await (navigator as any).getBattery();
    }
  }

  async getEnvironmentData(): Promise<EnvironmentData> {
    const now = new Date();
    const hour = now.getHours();

    // Determine time of day
    let timeOfDay: EnvironmentData["timeOfDay"] = "afternoon";
    if (hour >= 5 && hour < 7) timeOfDay = "dawn";
    else if (hour >= 7 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 14) timeOfDay = "noon";
    else if (hour >= 14 && hour < 18) timeOfDay = "afternoon";
    else if (hour >= 18 && hour < 20) timeOfDay = "evening";
    else if (hour >= 20 && hour < 22) timeOfDay = "dusk";
    else timeOfDay = "night";

    // Determine season (simplified for Northern Hemisphere)
    const month = now.getMonth();
    let season: EnvironmentData["season"] = "summer";
    if (month >= 2 && month <= 4) season = "spring";
    else if (month >= 5 && month <= 7) season = "summer";
    else if (month >= 8 && month <= 10) season = "autumn";
    else season = "winter";

    return {
      lightLevel:
        this.ambientLight?.illuminance || this.estimateLightLevel(timeOfDay),
      lightTemperature: this.estimateLightTemperature(timeOfDay),
      ambientNoise: this.estimateAmbientNoise(),
      humidity: 50, // Would come from weather API
      temperature: 22, // Would come from weather API
      pressure: 1013, // Would come from weather API
      timeOfDay,
      season,
    };
  }

  private estimateLightLevel(timeOfDay: string): number {
    const levels = {
      dawn: 100,
      morning: 1000,
      noon: 50000,
      afternoon: 20000,
      evening: 500,
      dusk: 50,
      night: 1,
    };
    return levels[timeOfDay as keyof typeof levels] || 300;
  }

  private estimateLightTemperature(timeOfDay: string): number {
    const temperatures = {
      dawn: 4000,
      morning: 5500,
      noon: 6500,
      afternoon: 6000,
      evening: 4500,
      dusk: 3000,
      night: 2700,
    };
    return temperatures[timeOfDay as keyof typeof temperatures] || 6500;
  }

  private estimateAmbientNoise(): number {
    // Simplified noise estimation based on time
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) return 25; // Night
    if (hour >= 7 && hour <= 9) return 55; // Morning rush
    if (hour >= 17 && hour <= 19) return 60; // Evening rush
    return 40; // Normal day
  }

  async getBiometricData(): Promise<BiometricData> {
    // Placeholder - would integrate with wearables/fitness trackers
    return {
      heartRate: undefined, // Would come from fitness trackers
      stressLevel: undefined, // Would be calculated from HRV
    };
  }

  async getDeviceData(): Promise<DeviceSensorData> {
    let deviceMotion: DeviceSensorData["deviceMotion"] = "static";

    if (this.deviceMotion) {
      const acceleration = this.deviceMotion.acceleration;
      if (acceleration) {
        const totalAccel = Math.sqrt(
          acceleration.x! ** 2 + acceleration.y! ** 2 + acceleration.z! ** 2
        );

        if (totalAccel > 5) deviceMotion = "active";
        else if (totalAccel > 2) deviceMotion = "moderate";
        else if (totalAccel > 0.5) deviceMotion = "gentle";
      }
    }

    return {
      accelerometer: this.deviceMotion?.acceleration
        ? {
            x: this.deviceMotion.acceleration.x || 0,
            y: this.deviceMotion.acceleration.y || 0,
            z: this.deviceMotion.acceleration.z || 9.8,
          }
        : { x: 0, y: 0, z: 9.8 },
      gyroscope: this.deviceMotion?.rotationRate
        ? {
            alpha: this.deviceMotion.rotationRate.alpha || 0,
            beta: this.deviceMotion.rotationRate.beta || 0,
            gamma: this.deviceMotion.rotationRate.gamma || 0,
          }
        : { alpha: 0, beta: 0, gamma: 0 },
      deviceMotion,
      batteryLevel: this.battery?.level || 1.0,
      networkQuality: this.estimateNetworkQuality(),
      screenBrightness: 0.8, // Would require additional APIs
    };
  }

  private estimateNetworkQuality(): DeviceSensorData["networkQuality"] {
    // CRITICAL SSR FIX: Skip navigator access on server
    if (typeof navigator === 'undefined') {
      return "good";
    }

    const connection = (navigator as any).connection;
    if (!connection) return "good";

    const effectiveType = connection.effectiveType;
    switch (effectiveType) {
      case "4g":
        return "excellent";
      case "3g":
        return "good";
      case "2g":
        return "fair";
      case "slow-2g":
        return "poor";
      default:
        return "good";
    }
  }

  async getLocationData(): Promise<LocationContext> {
    return new Promise((resolve) => {
      if (!this.geolocation) {
        resolve({
          locationType: "unknown",
          activityType: "unknown",
        });
        return;
      }

      this.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || undefined,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            locationType: "unknown", // Would need additional logic
            activityType: this.estimateActivity(position),
          });
        },
        () => {
          resolve({
            locationType: "unknown",
            activityType: "unknown",
          });
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    });
  }

  private estimateActivity(
    position: GeolocationPosition
  ): LocationContext["activityType"] {
    const speed = position.coords.speed || 0;

    if (speed < 0.5) return "stationary";
    if (speed < 2) return "walking";
    if (speed < 5) return "running";
    if (speed < 15) return "cycling";
    return "driving";
  }
}

// React Context
const ContextualEngineContext = createContext<{
  engine: GlassContextualEngineCore | null;
  context: ContextualState;
  adaptations: ContextualAdaptation[];
  topAdaptation: ContextualAdaptation | null;
  provideFeedback: (adaptationId: string, satisfaction: number) => void;
}>({
  engine: null,
  context: {} as ContextualState,
  adaptations: [],
  topAdaptation: null,
  provideFeedback: () => {},
});

// Provider component
export function GlassContextualEngineProvider({
  children,
  onContextUpdate,
  onAdaptationChange,
}: {
  children: React.ReactNode;
  onContextUpdate?: (context: ContextualState) => void;
  onAdaptationChange?: (adaptation: ContextualAdaptation | null) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<GlassContextualEngineCore>();
  const [context, setContext] = useState<ContextualState>(
    {} as ContextualState
  );
  const [adaptations, setAdaptations] = useState<ContextualAdaptation[]>([]);
  const [topAdaptation, setTopAdaptation] =
    useState<ContextualAdaptation | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new GlassContextualEngineCore();

    // Update state periodically
    const updateInterval = setInterval(() => {
      if (engineRef.current) {
        const currentContext = engineRef.current.getCurrentContext();
        const currentAdaptations = engineRef.current.getCurrentAdaptations();
        const currentTopAdaptation = engineRef.current.getTopAdaptation();

        setContext(currentContext);
        setAdaptations(currentAdaptations);
        setTopAdaptation(currentTopAdaptation);

        onContextUpdate?.(currentContext);
        onAdaptationChange?.(currentTopAdaptation);
      }
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [onContextUpdate, onAdaptationChange]);

  const provideFeedback = useCallback(
    (adaptationId: string, satisfaction: number) => {
      engineRef.current?.provideFeedback(adaptationId, satisfaction);
    },
    []
  );

  const value = {
    engine: engineRef.current || null,
    context,
    adaptations,
    topAdaptation,
    provideFeedback,
  };

  return (
    <ContextualEngineContext.Provider value={value}>
      {children}
    </ContextualEngineContext.Provider>
  );
}

// Hook to use contextual engine
export function useContextualEngine() {
  const context = useContext(ContextualEngineContext);
  if (!context) {
    throw new Error(
      "useContextualEngine must be used within GlassContextualEngineProvider"
    );
  }
  return context;
}

// Contextual dashboard component
export function GlassContextualDashboard({
  className,
  showSensors = true,
}: {
  className?: string;
  showSensors?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { context, adaptations, topAdaptation } = useContextualEngine();
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      <motion.button
        className={cn(
          "w-12 h-12 glass-radius-full glass-surface-primary glass-elev-3",
          "flex items-center justify-center glass-text-primary",
          "transition-all duration-300 hover:scale-105"
        )}
        onClick={() => setShowDashboard(!showDashboard)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🌐
        {adaptations.length > 0 && (
          <motion.div
            className='absolute glass-top-1 -right-1 w-3 h-3 glass-surface-green glass-radius-full'
            initial={{ scale: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {showDashboard && (
          <motion.div
            className={cn(
              "absolute top-14 right-0 w-80 max-h-96 overflow-y-auto",
              "glass-surface-primary glass-elev-4 glass-radius-lg glass-p-4 glass-gap-3"
            )}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <div className="glass-flex glass-items-center glass-justify-between">
              <h3 className='glass-text-sm font-medium text-primary'>
                Contextual Engine
              </h3>
              <button
                onClick={() => setShowDashboard(false)}
                className='glass-text-xs glass-text-secondary hover:text-primary glass-focus glass-touch-target glass-contrast-guard'
              >
                ✕
              </button>
            </div>

            {/* Current Context */}
            <div className="glass-gap-2">
              <h4 className='glass-text-xs font-medium glass-text-secondary uppercase tracking-wide'>
                Current Context
              </h4>
              <div className="glass-grid glass-grid-cols-2 glass-gap-2 glass-text-xs">
                <div className="glass-surface-secondary glass-p-2 glass-radius-sm">
                  <div className="glass-text-tertiary">Environment</div>
                  <div className='text-primary'>
                    {context.environment?.timeOfDay}
                  </div>
                  <div className="glass-text-secondary">
                    {context.environment?.lightLevel}lx
                  </div>
                </div>
                <div className="glass-surface-secondary glass-p-2 glass-radius-sm">
                  <div className="glass-text-tertiary">Device</div>
                  <div className='text-primary'>
                    {context.device?.deviceMotion}
                  </div>
                  <div className="glass-text-secondary">
                    {((context.device?.batteryLevel || 0) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Active Adaptation */}
            {topAdaptation && (
              <div className="glass-gap-2">
                <h4 className='glass-text-xs font-medium glass-text-secondary uppercase tracking-wide'>
                  Active Adaptation
                </h4>
                <div className="glass-p-3 glass-surface-secondary glass-radius-md">
                  <div className='glass-text-sm text-primary font-medium mb-1'>
                    {topAdaptation.id
                      .split("-")[0]
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}
                  </div>
                  <div className="glass-text-xs glass-text-tertiary">
                    Confidence: {(topAdaptation.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for contextually adaptive components
export function useContextualAdaptation() {
  const { topAdaptation } = useContextualEngine();

  const getAdaptiveStyles = useCallback(() => {
    if (!topAdaptation) return {};

    const { visual, animation } = topAdaptation.adaptations;

    return {
      filter: `brightness(${1 + visual.brightness}) contrast(${1 + visual.contrast}) saturate(${1 + visual.saturation})`,
      animationDuration: `${1 / animation.speed}s`,
      opacity: visual.opacity,
    };
  }, [topAdaptation]);

  return {
    adaptation: topAdaptation,
    getAdaptiveStyles,
    isAdapting: !!topAdaptation,
  };
}

// Presets for different contextual scenarios
export const contextualEnginePresets = {
  office: {
    environmentBias: { lightLevel: 500, ambientNoise: 45, temperature: 22 },
    adaptationSensitivity: 0.7,
    learningRate: 0.1,
  },
  home: {
    environmentBias: { lightLevel: 200, ambientNoise: 30, temperature: 24 },
    adaptationSensitivity: 0.8,
    learningRate: 0.15,
  },
  outdoor: {
    environmentBias: { lightLevel: 20000, ambientNoise: 60, temperature: 18 },
    adaptationSensitivity: 0.9,
    learningRate: 0.05,
  },
  transport: {
    environmentBias: { ambientNoise: 70 },
    adaptationSensitivity: 0.6,
    learningRate: 0.2,
  },
};

interface GlassContextualEngineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showDashboard?: boolean;
  onContextUpdate?: (context: ContextualState) => void;
  onAdaptationChange?: (adaptation: ContextualAdaptation | null) => void;
  children?: React.ReactNode;
}

function ContextualEngineSummary() {
  const { context, adaptations } = useContextualEngine();
  const { adaptation, getAdaptiveStyles, isAdapting } =
    useContextualAdaptation();

  const environment = context?.environment;
  const device = context?.device;
  const safeAdaptations = Array.isArray(adaptations)
    ? adaptations.slice(0, 3)
    : [];

  return (
    <div
      className={cn(
        "glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4",
        "glass-border glass-border-white/10 glass-shadow-soft-lg"
      )}
      style={getAdaptiveStyles()}
      data-testid="glass-contextual-engine-summary"
    >
      <div className="glass-flex glass-items-center glass-justify-between">
        <div>
          <p className="glass-text-xs glass-text-tertiary uppercase tracking-wide">
            Contextual Engine
          </p>
          <h2 className="glass-text-xl glass-text-primary font-semibold">
            {isAdapting ? "Adaptive Mode" : "Learning Mode"}
          </h2>
        </div>
        <div className="glass-text-right">
          <p className="glass-text-xs glass-text-tertiary">Battery</p>
          <p className="glass-text-lg glass-text-primary font-medium">
            {device?.batteryLevel
              ? `${Math.round(device.batteryLevel * 100)}%`
              : "—"}
          </p>
        </div>
      </div>

      <div className="glass-grid glass-grid-cols-2 glass-gap-3">
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary mb-1">
            Time of day
          </p>
          <p className="glass-text-lg glass-text-primary font-medium capitalize">
            {environment?.timeOfDay || "detecting"}
          </p>
          <p className="glass-text-xs glass-text-secondary">
            Light {environment?.lightLevel ? `${environment.lightLevel}lx` : "—"}
          </p>
        </div>
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary mb-1">Motion</p>
          <p className="glass-text-lg glass-text-primary font-medium capitalize">
            {device?.deviceMotion || "idle"}
          </p>
          <p className="glass-text-xs glass-text-secondary">
            {environment?.temperature
              ? `${environment.temperature.toFixed(1)}°C`
              : "Analyzing ambient"}
          </p>
        </div>
      </div>

      <div>
        <p className="glass-text-xs glass-text-tertiary uppercase tracking-wide mb-2">
          Active adaptations
        </p>
        <div className="glass-flex glass-flex-wrap glass-gap-2">
          {safeAdaptations.length === 0 && (
            <span className="glass-text-sm glass-text-secondary">
              Gathering signals…
            </span>
          )}
          {safeAdaptations.map((item) => (
            <span
              key={item.id}
              className="glass-text-xs glass-radius-full glass-px-3 glass-py-1 glass-surface-subtle"
            >
              {item.id.split("-")[0]}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-text-xs glass-text-secondary glass-flex glass-items-center glass-justify-between">
        <span>
          {adaptation
            ? `Confidence ${(adaptation.confidence * 100).toFixed(0)}%`
            : "Awaiting adaptation event"}
        </span>
        <span>
          Ambient noise:{" "}
          {environment?.ambientNoise
            ? `${environment.ambientNoise.toFixed(0)} dB`
            : "—"}
        </span>
      </div>
    </div>
  );
}

export const GlassContextualEngine: React.FC<GlassContextualEngineProps> = ({
  className,
  children,
  showDashboard = true,
  onContextUpdate,
  onAdaptationChange,
  ...rest
}) => {
  return (
    <GlassContextualEngineProvider
      onContextUpdate={onContextUpdate}
      onAdaptationChange={onAdaptationChange}
    >
      <div
        className={cn(
          "glass-contextual-engine-demo glass-relative glass-space-y-4",
          className
        )}
        {...rest}
      >
        {children ?? <ContextualEngineSummary />}
        {showDashboard && <GlassContextualDashboard />}
      </div>
    </GlassContextualEngineProvider>
  );
};

export default GlassContextualEngine;
