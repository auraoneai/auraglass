/**
 * Predictive Analysis Web Worker
 * Analyzes user behavior patterns to predict future actions and optimize UX
 */

interface PredictiveMessage {
  command?: string;
  patterns?: UserInteractionPattern[];
}

interface UserInteractionPattern {
  type: "click" | "hover" | "scroll" | "focus" | "gesture";
  target?: string;
  position?: { x: number; y: number };
  timestamp: number;
  duration?: number;
}

interface Prediction {
  action: string;
  confidence: number;
  suggestedOptimization?: string;
}

interface PredictiveAnalysisResult {
  predictions: Prediction[];
  confidence: number;
  patterns: {
    mostCommonAction: string;
    averageSessionDuration: number;
    engagementScore: number;
  };
  recommendations: string[];
}

/**
 * Analyze user interaction patterns and make predictions
 */
function analyzePatternsAndPredict(
  patterns: UserInteractionPattern[]
): PredictiveAnalysisResult {
  if (patterns.length === 0) {
    return {
      predictions: [],
      confidence: 0,
      patterns: {
        mostCommonAction: "none",
        averageSessionDuration: 0,
        engagementScore: 0,
      },
      recommendations: [],
    };
  }

  // Calculate pattern statistics
  const actionCounts = new Map<string, number>();
  const actionSequences: string[] = [];

  patterns.forEach((pattern) => {
    const action = `${pattern.type}:${pattern.target || "unknown"}`;
    actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
    actionSequences.push(action);
  });

  // Find most common action
  let mostCommonAction = "none";
  let maxCount = 0;

  actionCounts.forEach((count, action) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonAction = action;
    }
  });

  // Calculate session metrics
  const sessionStart = patterns[0].timestamp;
  const sessionEnd = patterns[patterns.length - 1].timestamp;
  const averageSessionDuration = sessionEnd - sessionStart;

  // Calculate engagement score based on interaction density
  const interactionRate =
    (patterns.length / (averageSessionDuration / 1000)) * 60; // interactions per minute
  const engagementScore = Math.min(1, interactionRate / 20); // normalized to 0-1

  // Sequence analysis for predictions
  const predictions: Prediction[] = [];

  // Analyze last 5 interactions to predict next action
  const recentPatterns = patterns.slice(-5);
  const recentSequence = recentPatterns.map(
    (p) => `${p.type}:${p.target || "unknown"}`
  );

  // Simple Markov chain prediction
  const sequenceMap = new Map<string, Map<string, number>>();

  for (let i = 0; i < actionSequences.length - 1; i++) {
    const current = actionSequences[i];
    const next = actionSequences[i + 1];

    if (!sequenceMap.has(current)) {
      sequenceMap.set(current, new Map());
    }

    const nextMap = sequenceMap.get(current)!;
    nextMap.set(next, (nextMap.get(next) || 0) + 1);
  }

  // Predict next actions based on last action
  const lastAction = actionSequences[actionSequences.length - 1];
  const nextActionMap = sequenceMap.get(lastAction);

  if (nextActionMap) {
    const totalNext = Array.from(nextActionMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    nextActionMap.forEach((count, action) => {
      const confidence = count / totalNext;

      if (confidence > 0.2) {
        // Only include predictions with >20% confidence
        predictions.push({
          action: action.replace(":", " on "),
          confidence,
          suggestedOptimization: generateOptimization(action, confidence),
        });
      }
    });
  }

  // Sort predictions by confidence
  predictions.sort((a, b) => b.confidence - a.confidence);

  // Generate recommendations
  const recommendations: string[] = [];

  if (engagementScore < 0.3) {
    recommendations.push(
      "Low engagement detected. Consider adding interactive elements."
    );
  }

  if (engagementScore > 0.8) {
    recommendations.push(
      "High engagement! Current UX patterns are working well."
    );
  }

  // Check for repetitive actions (potential frustration)
  const repetitiveActions = Array.from(actionCounts.entries()).filter(
    ([_, count]) => count > patterns.length * 0.3
  );

  if (repetitiveActions.length > 0) {
    recommendations.push(
      `Repetitive action detected: ${repetitiveActions[0][0]}. User may be stuck or confused.`
    );
  }

  // Check for scroll-heavy behavior
  const scrollCount = patterns.filter((p) => p.type === "scroll").length;
  if (scrollCount > patterns.length * 0.5) {
    recommendations.push(
      "High scroll rate. Consider improving content visibility or adding sticky navigation."
    );
  }

  return {
    predictions: predictions.slice(0, 3), // Top 3 predictions
    confidence: predictions.length > 0 ? predictions[0].confidence : 0,
    patterns: {
      mostCommonAction,
      averageSessionDuration,
      engagementScore,
    },
    recommendations,
  };
}

/**
 * Generate UX optimization suggestions based on predicted action
 */
function generateOptimization(action: string, confidence: number): string {
  if (confidence > 0.7) {
    return `Preload resources for "${action}" (high confidence)`;
  } else if (confidence > 0.5) {
    return `Consider prefetching data for "${action}"`;
  } else {
    return `Monitor pattern for "${action}"`;
  }
}

// Listen for messages from main thread
self.addEventListener("message", (event: MessageEvent<PredictiveMessage>) => {
  const { patterns } = event.data;

  if (patterns && Array.isArray(patterns)) {
    const result = analyzePatternsAndPredict(patterns);
    self.postMessage(result);
  } else {
    self.postMessage({
      predictions: [],
      confidence: 0,
      patterns: {
        mostCommonAction: "none",
        averageSessionDuration: 0,
        engagementScore: 0,
      },
      recommendations: ["No pattern data provided"],
    });
  }
});

// Notify main thread that worker is ready
self.postMessage({ status: "ready" });
