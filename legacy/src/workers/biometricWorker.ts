/**
 * Biometric Processing Web Worker
 * Handles batch processing of biometric data (heart rate, stress, engagement)
 */

interface BiometricMessage {
  command: "processBatch" | "analyze";
  data?: BiometricDataPoint[] | BiometricDataPoint;
}

interface BiometricDataPoint {
  heartRate?: number;
  heartRateVariability?: number;
  skinConductance?: number;
  facialExpression?: string;
  timestamp: number;
}

interface BiometricAnalysis {
  stressLevel: number; // 0-1
  engagementLevel: number; // 0-1
  emotionalState: "calm" | "focused" | "stressed" | "excited" | "neutral";
  recommendations: string[];
  timestamp: number;
}

/**
 * Analyze batch of biometric data
 */
function processBiometricBatch(batch: BiometricDataPoint[]): BiometricAnalysis {
  if (batch.length === 0) {
    return {
      stressLevel: 0,
      engagementLevel: 0,
      emotionalState: "neutral",
      recommendations: [],
      timestamp: Date.now(),
    };
  }

  // Calculate average metrics
  const avgHeartRate =
    batch.reduce((sum, d) => sum + (d.heartRate || 0), 0) / batch.length;

  const avgHRV =
    batch.reduce((sum, d) => sum + (d.heartRateVariability || 0), 0) /
    batch.length;

  const avgSkinConductance =
    batch.reduce((sum, d) => sum + (d.skinConductance || 0), 0) / batch.length;

  // Analyze stress level (simplified algorithm)
  // In production, use ML model trained on biometric data
  let stressLevel = 0;

  // High heart rate + low HRV = stress
  if (avgHeartRate > 80 && avgHRV < 50) {
    stressLevel += 0.4;
  }

  // High skin conductance = stress/arousal
  if (avgSkinConductance > 0.5) {
    stressLevel += 0.3;
  }

  // Facial expression analysis
  const stressedExpressions = batch.filter(
    (d) => d.facialExpression === "frown" || d.facialExpression === "tense"
  ).length;
  stressLevel += (stressedExpressions / batch.length) * 0.3;

  stressLevel = Math.min(1, stressLevel);

  // Calculate engagement level
  // Higher heart rate + higher HRV = engagement
  let engagementLevel = 0;

  if (avgHeartRate > 70 && avgHeartRate < 90 && avgHRV > 50) {
    engagementLevel += 0.5;
  }

  const focusedExpressions = batch.filter(
    (d) => d.facialExpression === "focused" || d.facialExpression === "smile"
  ).length;
  engagementLevel += (focusedExpressions / batch.length) * 0.5;

  engagementLevel = Math.min(1, engagementLevel);

  // Determine emotional state
  let emotionalState: BiometricAnalysis["emotionalState"] = "neutral";

  if (stressLevel > 0.7) {
    emotionalState = "stressed";
  } else if (engagementLevel > 0.7) {
    emotionalState = "focused";
  } else if (avgHeartRate > 90) {
    emotionalState = "excited";
  } else if (stressLevel < 0.3 && avgHeartRate < 70) {
    emotionalState = "calm";
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (stressLevel > 0.6) {
    recommendations.push("Consider taking a break");
    recommendations.push("Try deep breathing exercises");
  }

  if (engagementLevel < 0.4) {
    recommendations.push("Content may not be engaging enough");
    recommendations.push("Consider adding interactive elements");
  }

  if (avgHeartRate < 60 && engagementLevel < 0.3) {
    recommendations.push("User may be disengaged or fatigued");
  }

  return {
    stressLevel,
    engagementLevel,
    emotionalState,
    recommendations,
    timestamp: Date.now(),
  };
}

/**
 * Analyze single biometric data point
 */
function analyzeSingleDataPoint(
  dataPoint: BiometricDataPoint
): BiometricAnalysis {
  return processBiometricBatch([dataPoint]);
}

// Listen for messages from main thread
self.addEventListener("message", (event: MessageEvent<BiometricMessage>) => {
  const { command, data } = event.data;

  switch (command) {
    case "processBatch":
      if (Array.isArray(data)) {
        const analysis = processBiometricBatch(data);
        self.postMessage(analysis);
      }
      break;

    case "analyze":
      if (data && !Array.isArray(data)) {
        const analysis = analyzeSingleDataPoint(data);
        self.postMessage(analysis);
      }
      break;

    default:
      self.postMessage({ error: "Unknown command" });
  }
});

// Notify main thread that worker is ready
self.postMessage({ status: "ready" });
