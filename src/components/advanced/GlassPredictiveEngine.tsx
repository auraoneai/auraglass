"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Predictive UI Engine
 * AI-powered system that learns user behavior and anticipates interface needs
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
import { cn } from "@/lib/utils";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

// Behavioral data types
type InteractionType =
  | "click"
  | "hover"
  | "scroll"
  | "focus"
  | "resize"
  | "navigate";
type DeviceType = "mobile" | "tablet" | "desktop";
type PatternType = "sequence" | "temporal" | "spatial" | "contextual";
type PredictiveActionType =
  | "preload"
  | "pre-render"
  | "animate"
  | "suggest"
  | "optimize"
  | "navigate";
type PredictiveInsightCategory =
  | "performance"
  | "usability"
  | "accessibility"
  | "engagement";
type PredictiveMetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | PredictiveMetadataValue[]
  | { [key: string]: PredictiveMetadataValue };
type PredictiveMetadata = Record<string, PredictiveMetadataValue>;
type PatternElement = string | number;

interface PersistedPredictiveData {
  patterns?: Array<[string, BehavioralPattern]>;
  interactions?: UserInteraction[];
}

interface WorkflowSuggestion {
  type: "reorganize" | "automation";
  title: string;
  description: string;
  priority: number;
  cardId: string;
  suggestedColumn: string;
  reason: string;
}

interface BoardPerformanceReport {
  averageResponseTime: number;
  abandonmentRate: number;
  interactionCount: number;
  efficiency: number;
  totalCards: number;
  bottlenecks: string[];
  productivity: number;
  completionRate: number;
  suggestions: WorkflowSuggestion[];
}

interface UserInteraction {
  type: InteractionType;
  element: string;
  timestamp: number;
  context: {
    viewport: { width: number; height: number };
    timeOfDay: number;
    deviceType: DeviceType;
    location?: { x: number; y: number };
    duration?: number;
  };
  metadata: PredictiveMetadata;
}

interface BehavioralPattern {
  id: string;
  type: PatternType;
  confidence: number;
  frequency: number;
  lastSeen: number;
  pattern: PatternElement[];
  prediction: string;
}

interface PredictiveAction {
  id: string;
  type: PredictiveActionType;
  target: string;
  confidence: number;
  timing: number;
  metadata: PredictiveMetadata;
}

interface PredictiveInsight {
  id: string;
  type?: string;
  category: PredictiveInsightCategory;
  insight: string;
  confidence: number;
  impact: number;
  recommendation: string;
  metadata?: {
    sentiment?: "positive" | "neutral" | "negative";
    urgency?: "low" | "medium" | "high";
    topic?: string;
    userStress?: number;
    complexity?: number;
    [key: string]: PredictiveMetadataValue;
  };
}

const PREDICTIVE_ACTION_TYPES: PredictiveActionType[] = [
  "preload",
  "suggest",
  "animate",
  "optimize",
  "pre-render",
];

const getNumericMetadata = (
  metadata: PredictiveMetadata,
  key: string
): number | undefined => {
  const value = metadata[key];
  return typeof value === "number" ? value : undefined;
};

const getBooleanMetadata = (
  metadata: PredictiveMetadata,
  key: string
): boolean | undefined => {
  const value = metadata[key];
  return typeof value === "boolean" ? value : undefined;
};

const getNumberArrayMetadata = (
  metadata: PredictiveMetadata,
  key: string
): number[] | undefined => {
  const value = metadata[key];
  return Array.isArray(value) && value.every((item) => typeof item === "number")
    ? value
    : undefined;
};

const getBoardCardCount = (context: PredictiveMetadata): number => {
  const columns = context.columns;
  if (!Array.isArray(columns)) return 0;

  return columns.reduce<number>((total, column) => {
    if (!column || typeof column !== "object" || Array.isArray(column)) {
      return total;
    }

    const cards = (column as { cards?: PredictiveMetadataValue }).cards;
    return total + (Array.isArray(cards) ? cards.length : 0);
  }, 0);
};

// Neural network simulation for prediction
class PredictiveNeuralNet {
  private weights: number[][][];
  private biases: number[][];
  private learningRate: number;

  constructor(inputSize: number, hiddenSize: number, outputSize: number) {
    this.learningRate = 0.01;

    // Initialize weights and biases
    this.weights = [
      Array.from({ length: hiddenSize }, () =>
        Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
      ),
      Array.from({ length: outputSize }, () =>
        Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1)
      ),
    ];

    this.biases = [
      Array(hiddenSize)
        .fill(0)
        .map(() => Math.random() * 2 - 1),
      Array(outputSize)
        .fill(0)
        .map(() => Math.random() * 2 - 1),
    ];
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  forward(inputs: number[]): number[] {
    // Hidden layer
    const hidden = this.weights[0].map((neuronWeights, i) => {
      const sum =
        neuronWeights.reduce((acc, weight, j) => acc + weight * inputs[j], 0) +
        this.biases[0][i];
      return this.relu(sum);
    });

    // Output layer
    const output = this.weights[1].map((neuronWeights, i) => {
      const sum =
        neuronWeights.reduce((acc, weight, j) => acc + weight * hidden[j], 0) +
        this.biases[1][i];
      return this.sigmoid(sum);
    });

    return output;
  }

  train(inputs: number[], expectedOutputs: number[]): void {
    const outputs = this.forward(inputs);

    // Simple gradient descent (simplified)
    const outputErrors = outputs.map(
      (output, i) => expectedOutputs[i] - output
    );

    // Update weights (simplified backpropagation)
    for (let i = 0; i < this.weights[1].length; i++) {
      for (let j = 0; j < this.weights[1][i].length; j++) {
        this.weights[1][i][j] +=
          this.learningRate * outputErrors[i] * outputs[i] * (1 - outputs[i]);
      }
    }
  }
}

// Main predictive engine class
class PredictiveUIEngine {
  private interactions: UserInteraction[] = [];
  private patterns: Map<string, BehavioralPattern> = new Map();
  private neuralNet: PredictiveNeuralNet;
  private sessionStartTime: number;
  private predictions: PredictiveAction[] = [];
  private insights: PredictiveInsight[] = [];

  constructor() {
    this.sessionStartTime = Date.now();
    this.neuralNet = new PredictiveNeuralNet(10, 20, 5); // Input, hidden, output sizes
    this.loadStoredData();
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem("auraglass-predictive-data");
      if (stored) {
        const data = JSON.parse(stored) as PersistedPredictiveData;
        this.patterns = new Map(data.patterns || []);
        // Load recent interactions
        this.interactions = (data.interactions || []).slice(-1000); // Keep last 1000
      }
    } catch {
      // Ignore invalid persisted predictive data.
    }
  }

  private saveData(): void {
    try {
      const data = {
        patterns: Array.from(this.patterns.entries()),
        interactions: this.interactions.slice(-100), // Save last 100
        timestamp: Date.now(),
      };
      localStorage.setItem("auraglass-predictive-data", JSON.stringify(data));
    } catch {
      // Ignore storage failures; predictive state remains in memory.
    }
  }

  recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);

    // Keep only recent interactions in memory
    if (this.interactions.length > 2000) {
      this.interactions = this.interactions.slice(-1000);
    }

    this.analyzePatterns();
    this.generatePredictions();
    this.saveData();
  }

  private analyzePatterns(): void {
    const recent = this.interactions.slice(-50);

    // Analyze sequential patterns
    this.analyzeSequentialPatterns(recent);

    // Analyze temporal patterns
    this.analyzeTemporalPatterns(recent);

    // Analyze spatial patterns
    this.analyzeSpatialPatterns(recent);

    // Analyze contextual patterns
    this.analyzeContextualPatterns(recent);
  }

  private analyzeSequentialPatterns(interactions: UserInteraction[]): void {
    for (let i = 0; i < interactions.length - 2; i++) {
      const sequence = interactions.slice(i, i + 3);
      const pattern = sequence.map((int) => int.element).join(" -> ");
      const patternId = `seq_${pattern}`;

      const existing = this.patterns.get(patternId);
      if (existing) {
        existing.frequency++;
        existing.lastSeen = Date.now();
        existing.confidence = Math.min(0.95, existing.confidence + 0.05);
      } else {
        this.patterns.set(patternId, {
          id: patternId,
          type: "sequence",
          confidence: 0.3,
          frequency: 1,
          lastSeen: Date.now(),
          pattern: sequence.map((int) => int.element),
          prediction: sequence.length > 2 ? "next_in_sequence" : "unknown",
        });
      }
    }
  }

  private analyzeTemporalPatterns(interactions: UserInteraction[]): void {
    const timeGroups = new Map<number, UserInteraction[]>();

    interactions.forEach((interaction) => {
      const hour = new Date(interaction.timestamp).getHours();
      if (!timeGroups.has(hour)) {
        timeGroups.set(hour, []);
      }
      timeGroups.get(hour)!.push(interaction);
    });

    timeGroups.forEach((hourInteractions, hour) => {
      const commonElements = this.findCommonElements(hourInteractions);
      commonElements.forEach((element) => {
        const patternId = `temporal_${hour}_${element}`;
        const existing = this.patterns.get(patternId);

        if (existing) {
          existing.frequency++;
          existing.confidence = Math.min(0.9, existing.confidence + 0.1);
        } else {
          this.patterns.set(patternId, {
            id: patternId,
            type: "temporal",
            confidence: 0.4,
            frequency: 1,
            lastSeen: Date.now(),
            pattern: [hour, element],
            prediction: "time_based_usage",
          });
        }
      });
    });
  }

  private analyzeSpatialPatterns(interactions: UserInteraction[]): void {
    const spatialGroups = new Map<string, UserInteraction[]>();

    interactions.forEach((interaction) => {
      if (interaction.context.location) {
        const region = this.getScreenRegion(interaction.context.location);
        if (!spatialGroups.has(region)) {
          spatialGroups.set(region, []);
        }
        spatialGroups.get(region)!.push(interaction);
      }
    });

    spatialGroups.forEach((regionInteractions, region) => {
      const commonSequences = this.findSpatialSequences(regionInteractions);
      commonSequences.forEach((sequence, index) => {
        const patternId = `spatial_${region}_${index}`;
        this.patterns.set(patternId, {
          id: patternId,
          type: "spatial",
          confidence: 0.6,
          frequency: sequence.length,
          lastSeen: Date.now(),
          pattern: sequence,
          prediction: "spatial_flow",
        });
      });
    });
  }

  private analyzeContextualPatterns(interactions: UserInteraction[]): void {
    const deviceGroups = new Map<string, UserInteraction[]>();

    interactions.forEach((interaction) => {
      const device = interaction.context.deviceType;
      if (!deviceGroups.has(device)) {
        deviceGroups.set(device, []);
      }
      deviceGroups.get(device)!.push(interaction);
    });

    deviceGroups.forEach((deviceInteractions, device) => {
      const commonPatterns = this.findContextualPatterns(deviceInteractions);
      commonPatterns.forEach((pattern, index) => {
        const patternId = `contextual_${device}_${index}`;
        this.patterns.set(patternId, {
          id: patternId,
          type: "contextual",
          confidence: 0.7,
          frequency: pattern.frequency,
          lastSeen: Date.now(),
          pattern: pattern.elements,
          prediction: "context_adaptation",
        });
      });
    });
  }

  private generatePredictions(): void {
    this.predictions = [];
    const now = Date.now();

    // Generate predictions from patterns
    this.patterns.forEach((pattern) => {
      if (pattern.confidence > 0.5 && now - pattern.lastSeen < 86400000) {
        // 24 hours
        const prediction = this.createPredictiveAction(pattern);
        if (prediction) {
          this.predictions.push(prediction);
        }
      }
    });

    // Use neural network for complex predictions
    const recentInteractions = this.interactions.slice(-10);
    if (recentInteractions.length >= 5) {
      const neuralPredictions =
        this.generateNeuralPredictions(recentInteractions);
      this.predictions.push(...neuralPredictions);
    }

    // Generate insights
    this.generateInsights();

    // Sort predictions by confidence and timing
    this.predictions.sort((a, b) => {
      const confidenceSort = b.confidence - a.confidence;
      if (Math.abs(confidenceSort) < 0.1) {
        return a.timing - b.timing; // Sooner is better if confidence is similar
      }
      return confidenceSort;
    });
  }

  private createPredictiveAction(
    pattern: BehavioralPattern
  ): PredictiveAction | null {
    const actionId = `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (pattern.type) {
      case "sequence":
        if (pattern.pattern.length >= 2) {
          return {
            id: actionId,
            type: "preload",
            target: String(pattern.pattern[pattern.pattern.length - 1]),
            confidence: pattern.confidence,
            timing: 500,
            metadata: { sequence: pattern.pattern },
          };
        }
        break;

      case "temporal":
        const [hour, element] = pattern.pattern;
        const currentHour = new Date().getHours();
        if (
          typeof hour === "number" &&
          typeof element === "string" &&
          Math.abs(currentHour - hour) <= 1
        ) {
          return {
            id: actionId,
            type: "suggest",
            target: element,
            confidence: pattern.confidence,
            timing: 0,
            metadata: { timeContext: hour },
          };
        }
        break;

      case "spatial":
        return {
          id: actionId,
          type: "animate",
          target: "spatial_indicator",
          confidence: pattern.confidence,
          timing: 200,
          metadata: { spatialPattern: pattern.pattern },
        };

      case "contextual":
        return {
          id: actionId,
          type: "optimize",
          target: "interface",
          confidence: pattern.confidence,
          timing: 0,
          metadata: { contextPattern: pattern.pattern },
        };
    }

    return null;
  }

  private generateNeuralPredictions(
    interactions: UserInteraction[]
  ): PredictiveAction[] {
    const predictions: PredictiveAction[] = [];

    // Convert interactions to neural network input
    const input = this.interactionsToVector(interactions);
    const output = this.neuralNet.forward(input);

    // Interpret neural network output as predictions
    output.forEach((confidence, index) => {
      if (confidence > 0.6) {
        predictions.push({
          id: `neural_${Date.now()}_${index}`,
          type: PREDICTIVE_ACTION_TYPES[index],
          target: "neural_prediction",
          confidence,
          timing: 100 + index * 100,
          metadata: { neuralOutput: output, inputVector: input },
        });
      }
    });

    return predictions;
  }

  private generateInsights(): void {
    this.insights = [];
    const interactions = this.interactions.slice(-100);

    // Performance insights
    const avgResponseTime = this.calculateAverageResponseTime(interactions);
    if (avgResponseTime > 200) {
      this.insights.push({
        id: "perf_response_time",
        category: "performance",
        insight: `Average interaction response time is ${avgResponseTime}ms`,
        confidence: 0.9,
        impact: 0.8,
        recommendation: "Consider preloading frequently accessed components",
      });
    }

    // Usability insights
    const abandonmentRate = this.calculateAbandonmentRate(interactions);
    if (abandonmentRate > 0.3) {
      this.insights.push({
        id: "usability_abandonment",
        category: "usability",
        insight: `High abandonment rate detected: ${(abandonmentRate * 100).toFixed(1)}%`,
        confidence: 0.85,
        impact: 0.9,
        recommendation: "Simplify navigation flow and reduce friction points",
      });
    }

    // Engagement insights
    const sessionDuration = Date.now() - this.sessionStartTime;
    if (sessionDuration > 600000 && interactions.length > 50) {
      this.insights.push({
        id: "engagement_high",
        category: "engagement",
        insight: "High engagement session detected",
        confidence: 0.95,
        impact: 0.7,
        recommendation: "Capture user preferences for future personalization",
      });
    }
  }

  // Helper methods
  private findCommonElements(interactions: UserInteraction[]): string[] {
    const elementCount = new Map<string, number>();
    interactions.forEach((int) => {
      elementCount.set(int.element, (elementCount.get(int.element) || 0) + 1);
    });

    return Array.from(elementCount.entries())
      .filter(([_, count]) => count >= 2)
      .map(([element]) => element);
  }

  private getScreenRegion(location: { x: number; y: number }): string {
    const { x, y } = location;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const col =
      x < screenWidth / 3
        ? "left"
        : x < (screenWidth * 2) / 3
          ? "center"
          : "right";
    const row =
      y < screenHeight / 3
        ? "top"
        : y < (screenHeight * 2) / 3
          ? "middle"
          : "bottom";

    return `${row}_${col}`;
  }

  private findSpatialSequences(interactions: UserInteraction[]): string[][] {
    const sequences: string[][] = [];
    for (let i = 0; i < interactions.length - 1; i++) {
      const sequence = [interactions[i].element, interactions[i + 1].element];
      sequences.push(sequence);
    }
    return sequences;
  }

  private findContextualPatterns(
    interactions: UserInteraction[]
  ): Array<{ elements: string[]; frequency: number }> {
    const patterns: Array<{ elements: string[]; frequency: number }> = [];
    const elementCount = new Map<string, number>();

    interactions.forEach((int) => {
      elementCount.set(int.element, (elementCount.get(int.element) || 0) + 1);
    });

    elementCount.forEach((frequency, element) => {
      if (frequency >= 2) {
        patterns.push({ elements: [element], frequency });
      }
    });

    return patterns;
  }

  private interactionsToVector(interactions: UserInteraction[]): number[] {
    const vector = new Array(10).fill(0);

    interactions.forEach((interaction, index) => {
      if (index < 5) {
        vector[index] = (this.hashString(interaction.element) % 100) / 100;
        vector[index + 5] = interaction.context.timeOfDay / 24;
      }
    });

    return vector;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateAverageResponseTime(
    interactions: UserInteraction[]
  ): number {
    const times = interactions
      .map((int) => getNumericMetadata(int.metadata, "responseTime"))
      .filter((time): time is number => typeof time === "number");

    return times.length > 0
      ? times.reduce((sum, time) => sum + time, 0) / times.length
      : 0;
  }

  private calculateAbandonmentRate(interactions: UserInteraction[]): number {
    const sequences: UserInteraction[][] = [];
    let currentSequence: UserInteraction[] = [];

    interactions.forEach((int) => {
      if (int.type === "navigate") {
        if (currentSequence.length > 0) {
          sequences.push(currentSequence);
        }
        currentSequence = [int];
      } else {
        currentSequence.push(int);
      }
    });

    if (currentSequence.length > 0) {
      sequences.push(currentSequence);
    }

    const abandonedSequences = sequences.filter(
      (seq) =>
        seq.length < 3 &&
        getBooleanMetadata(seq[seq.length - 1]?.metadata || {}, "completed") !==
          true
    );

    return sequences.length > 0
      ? abandonedSequences.length / sequences.length
      : 0;
  }

  // Public API
  getPredictions(): PredictiveAction[] {
    return [...this.predictions];
  }

  getInsights(): PredictiveInsight[] {
    return [...this.insights];
  }

  getPatterns(): BehavioralPattern[] {
    return Array.from(this.patterns.values());
  }

  async generateWorkflowSuggestions(
    context: PredictiveMetadata = {}
  ): Promise<WorkflowSuggestion[]> {
    // Generate workflow suggestions based on current board state
    const suggestions: WorkflowSuggestion[] = [];
    const fallbackCardId =
      getBoardCardCount(context) > 0 ? "high-activity-card" : "workflow";
    const fallbackColumnId = "optimized-flow";

    // Analyze interaction patterns to suggest workflow improvements
    const recentInteractions = this.interactions.slice(-20);
    const taskMovement = recentInteractions.filter(
      (i) => i.type === "click" && i.element === "card"
    );

    if (taskMovement.length > 5) {
      suggestions.push({
        type: "reorganize",
        title: "Consider reorganizing your workflow",
        description:
          "High card movement suggests your current organization may need optimization",
        priority: 0.6,
        cardId: fallbackCardId,
        suggestedColumn: fallbackColumnId,
        reason:
          "High card movement suggests your current organization may need optimization",
      });
    }

    // Suggest based on completion patterns
    const completionPatterns = recentInteractions.filter(
      (i) => i.metadata.action === "complete"
    );
    if (completionPatterns.length > 0) {
      suggestions.push({
        type: "automation",
        title: "Consider automating repetitive tasks",
        description:
          "Detected repetitive completion patterns that could be automated",
        priority: 0.3,
        cardId: fallbackCardId,
        suggestedColumn: fallbackColumnId,
        reason:
          "Detected repetitive completion patterns that could be automated",
      });
    }

    return suggestions;
  }

  async analyzeBoardPerformance(
    context: PredictiveMetadata = {}
  ): Promise<BoardPerformanceReport> {
    // Analyze board performance metrics
    const recentInteractions = this.interactions.slice(-50);
    const avgResponseTime =
      recentInteractions.length > 0
        ? recentInteractions.reduce(
            (sum, i) =>
              sum + (getNumericMetadata(i.metadata, "responseTime") || 0),
            0
          ) / recentInteractions.length
        : 0;
    const abandonmentRate = this.calculateAbandonmentRate(recentInteractions);
    const totalCards = getBoardCardCount(context);

    return {
      averageResponseTime: avgResponseTime || 0,
      abandonmentRate,
      interactionCount: recentInteractions.length,
      efficiency: Math.max(0, 1 - abandonmentRate),
      totalCards,
      bottlenecks: [],
      productivity: Math.max(0, 1 - abandonmentRate),
      completionRate: totalCards > 0 ? Math.max(0, 1 - abandonmentRate) : 0,
      suggestions: await this.generateWorkflowSuggestions(context),
    };
  }

  trainFromFeedback(actionId: string, wasAccurate: boolean): void {
    const action = this.predictions.find((p) => p.id === actionId);
    const inputVector = action
      ? getNumberArrayMetadata(action.metadata, "inputVector")
      : undefined;
    if (action && inputVector) {
      const target = new Array(5).fill(0);
      target[PREDICTIVE_ACTION_TYPES.indexOf(action.type)] = wasAccurate
        ? 1
        : 0;
      this.neuralNet.train(inputVector, target);
    }
  }
}

// React Context for the predictive engine
const PredictiveEngineContext = createContext<{
  engine: PredictiveUIEngine | null;
  recordInteraction: (interaction: Omit<UserInteraction, "timestamp">) => void;
  predictions: PredictiveAction[];
  insights: PredictiveInsight[];
}>({
  engine: null,
  recordInteraction: () => {},
  predictions: [],
  insights: [],
});

// Provider component
export function GlassPredictiveEngineProvider({
  children,
  onPrediction,
  onInsight,
}: {
  children: React.ReactNode;
  onPrediction?: (prediction: PredictiveAction) => void;
  onInsight?: (insight: PredictiveInsight) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const engineRef = useRef<PredictiveUIEngine>();
  const [predictions, setPredictions] = useState<PredictiveAction[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new PredictiveUIEngine();
  }, []);

  const recordInteraction = useCallback(
    (interaction: Omit<UserInteraction, "timestamp">) => {
      if (!engineRef.current) return;

      const fullInteraction: UserInteraction = {
        ...interaction,
        timestamp: Date.now(),
      };

      engineRef.current.recordInteraction(fullInteraction);

      // Update predictions and insights
      const newPredictions = engineRef.current.getPredictions();
      const newInsights = engineRef.current.getInsights();

      setPredictions(newPredictions);
      setInsights(newInsights);

      // Trigger callbacks for new items
      newPredictions.forEach((prediction) => onPrediction?.(prediction));
      newInsights.forEach((insight) => onInsight?.(insight));
    },
    [onPrediction, onInsight]
  );

  // Auto-record viewport changes and device type
  useEffect(() => {
    const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };

    const handleResize = () => {
      recordInteraction({
        type: "resize",
        element: "viewport",
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType: getDeviceType(),
        },
        metadata: { trigger: "resize" },
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [recordInteraction]);

  const value = {
    engine: engineRef.current || null,
    recordInteraction,
    predictions,
    insights,
  };

  return (
    <PredictiveEngineContext.Provider value={value}>
      {children}
    </PredictiveEngineContext.Provider>
  );
}

// Hook to use the predictive engine
export function usePredictiveEngine() {
  const context = useContext(PredictiveEngineContext);
  if (!context) {
    throw new Error(
      "usePredictiveEngine must be used within GlassPredictiveEngineProvider"
    );
  }
  return context;
}

// Component to display predictions
export function GlassPredictionIndicator({
  className,
  showInsights = true,
  maxPredictions = 5,
}: {
  className?: string;
  showInsights?: boolean;
  maxPredictions?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { predictions, insights } = usePredictiveEngine();
  const [showPanel, setShowPanel] = useState(false);

  const topPredictions = predictions.slice(0, maxPredictions);
  const topInsights = insights.slice(0, 3);

  return (
    <div className={cn("fixed top-4 right-4 z-50", className)}>
      {/* AI indicator */}
      <motion.button
        className={cn(
          "w-12 h-12 glass-radius-full glass-surface-primary glass-elev-3",
          "flex items-center justify-center glass-text-primary",
          `transition-all duration-[${ANIMATION.DURATION.normal}ms] glass-hover-scale-105`,
          predictions.length > 0 && "animate-pulse"
        )}
        onClick={() => setShowPanel(!showPanel)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="glass-relative">
          🧠
          {predictions.length > 0 && (
            <motion.div
              className="glass-absolute glass-top-1 glass--right-1 glass-w-3 glass-h-3 glass-surface-blue glass-radius-full glass-text-xs glass-text-primary glass-flex glass-items-center glass-justify-center"
              initial={{ scale: 0 }}
              animate={prefersReducedMotion ? {} : { scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: ANIMATION.DURATION.normal / 1000 }
              }
            >
              {predictions.length}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Prediction panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className={cn(
              "absolute top-14 right-0 w-80 max-h-96 overflow-y-auto",
              "glass-surface-primary glass-elev-4 glass-radius-lg glass-p-4 glass-gap-3"
            )}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: ANIMATION.DURATION.fast / 1000 }
            }
          >
            <div className="glass-flex glass-items-center glass-justify-between">
              <h3 className="glass-text-sm glass-font-medium glass-text-primary">
                AI Predictions
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="glass-text-xs glass-text-secondary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
              >
                ✕
              </button>
            </div>

            {/* Predictions */}
            {topPredictions.length > 0 && (
              <div className="glass-gap-2">
                <h4 className="glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                  Predictions
                </h4>
                {topPredictions.map((prediction) => (
                  <motion.div
                    key={prediction.id}
                    className="glass-p-2 glass-surface-secondary glass-radius-md"
                    initial={{ opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: ANIMATION.DURATION.normal / 1000 }
                    }
                  >
                    <div className="glass-flex glass-items-center glass-justify-between">
                      <span className="glass-text-sm glass-text-primary glass-capitalize">
                        {prediction.type}: {prediction.target}
                      </span>
                      <div className="glass-flex glass-items-center glass-gap-1">
                        <div
                          className="glass-w-2 glass-h-2 glass-radius-full"
                          style={{
                            backgroundColor:
                              prediction.confidence > 0.8
                                ? "hsl(var(--glass-color-success))"
                                : prediction.confidence > 0.6
                                  ? "hsl(var(--glass-color-warning))"
                                  : "hsl(var(--glass-color-danger))",
                          }}
                        />
                        <span className="glass-text-xs glass-text-secondary">
                          {(prediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Insights */}
            {showInsights && topInsights.length > 0 && (
              <div className="glass-gap-2">
                <h4 className="glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                  AI Insights
                </h4>
                {topInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    className="glass-p-2 glass-surface-secondary glass-radius-md"
                    initial={{ opacity: 0, x: -10 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: ANIMATION.DURATION.normal / 1000 }
                    }
                  >
                    <div className="glass-text-sm glass-text-primary glass-mb-1">
                      {insight.insight}
                    </div>
                    <div className="glass-text-xs glass-text-secondary">
                      {insight.recommendation}
                    </div>
                    <div className="glass-flex glass-items-center glass-justify-between glass-mt-1">
                      <span className="glass-text-xs glass-text-tertiary glass-capitalize">
                        {insight.category}
                      </span>
                      <span className="glass-text-xs glass-text-secondary">
                        Impact: {(insight.impact * 100).toFixed(0)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {predictions.length === 0 && insights.length === 0 && (
              <div className="glass-text-center glass-text-sm glass-text-secondary glass-py-4">
                Learning your behavior...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook to automatically record common interactions
export function useInteractionRecorder(elementId?: string) {
  const { recordInteraction } = usePredictiveEngine();

  const recordClick = useCallback(
    (event: React.MouseEvent) => {
      recordInteraction({
        type: "click",
        element: elementId || event.currentTarget.id || "unknown",
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType:
            window.innerWidth < 768
              ? "mobile"
              : window.innerWidth < 1024
                ? "tablet"
                : "desktop",
          location: { x: event.clientX, y: event.clientY },
        },
        metadata: {
          button: event.button,
          ctrlKey: event.ctrlKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
        },
      });
    },
    [recordInteraction, elementId]
  );

  const recordHover = useCallback(
    (event: React.MouseEvent) => {
      recordInteraction({
        type: "hover",
        element: elementId || event.currentTarget.id || "unknown",
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType:
            window.innerWidth < 768
              ? "mobile"
              : window.innerWidth < 1024
                ? "tablet"
                : "desktop",
          location: { x: event.clientX, y: event.clientY },
        },
        metadata: { trigger: "hover" },
      });
    },
    [recordInteraction, elementId]
  );

  const recordFocus = useCallback(
    (event: React.FocusEvent) => {
      recordInteraction({
        type: "focus",
        element: elementId || event.currentTarget.id || "unknown",
        context: {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          timeOfDay: new Date().getHours(),
          deviceType:
            window.innerWidth < 768
              ? "mobile"
              : window.innerWidth < 1024
                ? "tablet"
                : "desktop",
        },
        metadata: { trigger: "focus" },
      });
    },
    [recordInteraction, elementId]
  );

  return {
    recordClick,
    recordHover,
    recordFocus,
  };
}

// Presets for different prediction modes
export const predictiveEnginePresets = {
  conservative: {
    neuralNetConfig: { inputSize: 8, hiddenSize: 12, outputSize: 3 },
    confidenceThreshold: 0.8,
    maxPredictions: 3,
  },
  balanced: {
    neuralNetConfig: { inputSize: 10, hiddenSize: 20, outputSize: 5 },
    confidenceThreshold: 0.6,
    maxPredictions: 5,
  },
  aggressive: {
    neuralNetConfig: { inputSize: 12, hiddenSize: 30, outputSize: 8 },
    confidenceThreshold: 0.4,
    maxPredictions: 10,
  },
  experimental: {
    neuralNetConfig: { inputSize: 15, hiddenSize: 50, outputSize: 12 },
    confidenceThreshold: 0.3,
    maxPredictions: 15,
  },
};

interface GlassPredictiveEngineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onPrediction?: (prediction: PredictiveAction) => void;
  onInsight?: (insight: PredictiveInsight) => void;
  showIndicator?: boolean;
  children?: React.ReactNode;
}

function PredictiveEngineSummary() {
  const { predictions, insights } = usePredictiveEngine();
  const topPrediction = predictions[0];

  return (
    <div
      className={cn(
        "glass-surface-primary glass-radius-2xl glass-p-6 glass-space-y-4",
        "glass-border glass-border-white/10 glass-shadow-soft-lg"
      )}
      data-testid="glass-predictive-engine-summary"
    >
      <div>
        <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
          Predictive Engine
        </p>
        <h2 className="glass-text-2xl glass-text-primary glass-font-semibold">
          {topPrediction ? topPrediction.type : "Monitoring behavior"}
        </h2>
        <p className="glass-text-sm glass-text-secondary">
          {topPrediction ? topPrediction.target : "Collecting interaction data"}
        </p>
      </div>
      <div className="glass-grid glass-grid-cols-2 glass-gap-3">
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary glass-mb-1">
            Predictions
          </p>
          <p className="glass-text-lg glass-text-primary glass-font-semibold">
            {predictions.length}
          </p>
        </div>
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary glass-mb-1">
            Insights
          </p>
          <p className="glass-text-lg glass-text-primary glass-font-semibold">
            {insights.length}
          </p>
        </div>
      </div>
      <div className="glass-text-xs glass-text-secondary">
        {insights[0]?.insight || "Awaiting actionable recommendations."}
      </div>
    </div>
  );
}

export const GlassPredictiveEngine: React.FC<GlassPredictiveEngineProps> = ({
  onPrediction,
  onInsight,
  className,
  children,
  showIndicator = true,
  ...rest
}) => (
  <GlassPredictiveEngineProvider
    onPrediction={onPrediction}
    onInsight={onInsight}
  >
    <div
      className={cn(
        "glass-predictive-engine glass-relative glass-space-y-4",
        className
      )}
      {...rest}
    >
      {children ?? <PredictiveEngineSummary />}
      {showIndicator && <GlassPredictionIndicator />}
    </div>
  </GlassPredictiveEngineProvider>
);

export default GlassPredictiveEngine;
