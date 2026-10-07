import React from "react";
import { useMemo, useCallback, useState } from "react";
import { ChartQualityTier, ChartType, ChartPhysicsConfig } from "../types";

// Re-export types for convenience
export type QualityTier = ChartQualityTier;
export type PhysicsParams = {
  stiffness: number;
  dampingRatio: number;
  mass: number;
  precision: number;
  velocity: number;
  friction: number;
};

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isLowEndDevice: boolean;
  hasTouch: boolean;
  connectionSpeed: "slow" | "fast" | "unknown";
  memory: number; // MB
  cores: number;
}

interface ChartPerformanceMetrics {
  dataPointCount: number;
  seriesCount: number;
  animationComplexity: "low" | "medium" | "high";
  interactionComplexity: "low" | "medium" | "high";
}

export function useQualityTier(
  metrics: ChartPerformanceMetrics,
  chartType: ChartType,
  customTier?: ChartQualityTier["tier"]
): ChartQualityTier {
  // Detect device capabilities
  const deviceCapabilities = useMemo((): DeviceCapabilities => {
    const userAgent = navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet = /iPad|Android(?=.*\bMobile\b)|Tablet|PlayBook/i.test(
      userAgent
    );

    // Estimate device performance
    const isLowEndDevice = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 2
      : isMobile && !isTablet;

    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Estimate connection speed (simplified)
    const connection = (navigator as any).connection;
    let connectionSpeed: "slow" | "fast" | "unknown" = "unknown";
    if (connection) {
      const effectiveType = connection.effectiveType;
      connectionSpeed =
        effectiveType === "slow-2g" || effectiveType === "2g" ? "slow" : "fast";
    }

    // Estimate memory (rough approximation)
    const memory = (navigator as any).deviceMemory || (isLowEndDevice ? 2 : 8);
    const cores = navigator.hardwareConcurrency || (isLowEndDevice ? 2 : 4);

    return {
      isMobile,
      isTablet,
      isLowEndDevice,
      hasTouch,
      connectionSpeed,
      memory,
      cores,
    };
  }, []);

  // Calculate optimal quality tier
  const qualityTier = useMemo((): ChartQualityTier => {
    // If custom tier is specified, use it
    if (customTier) {
      return getTierConfig(customTier, deviceCapabilities, metrics);
    }

    // Auto-detect optimal tier based on device and data complexity
    const {
      dataPointCount,
      seriesCount,
      animationComplexity,
      interactionComplexity,
    } = metrics;
    const { isLowEndDevice, isMobile, connectionSpeed, memory } =
      deviceCapabilities;

    // Calculate complexity score
    const dataComplexity = Math.min(
      dataPointCount / 1000 + seriesCount / 10,
      10
    );
    const animationScore =
      animationComplexity === "high"
        ? 3
        : animationComplexity === "medium"
          ? 2
          : 1;
    const interactionScore =
      interactionComplexity === "high"
        ? 3
        : interactionComplexity === "medium"
          ? 2
          : 1;

    const totalComplexity = dataComplexity + animationScore + interactionScore;

    // Determine tier based on complexity and device capabilities
    let tier: ChartQualityTier["tier"];

    if (
      totalComplexity <= 5 &&
      !isLowEndDevice &&
      connectionSpeed !== "slow" &&
      memory >= 4
    ) {
      tier = "ultra";
    } else if (totalComplexity <= 8 && (!isLowEndDevice || memory >= 4)) {
      tier = "high";
    } else if (totalComplexity <= 12 || (!isMobile && memory >= 2)) {
      tier = "medium";
    } else {
      tier = "low";
    }

    return getTierConfig(tier, deviceCapabilities, metrics);
  }, [customTier, deviceCapabilities, metrics]);

  return qualityTier;
}

function getTierConfig(
  tier: ChartQualityTier["tier"],
  device: DeviceCapabilities,
  metrics: ChartPerformanceMetrics
): ChartQualityTier {
  const configs: Record<ChartQualityTier["tier"], ChartQualityTier> = {
    ultra: {
      tier: "ultra",
      maxDataPoints: 50000,
      animationEnabled: true,
      interactionEnabled: true,
      quality: "quality",
    },
    high: {
      tier: "high",
      maxDataPoints: 25000,
      animationEnabled: true,
      interactionEnabled: true,
      quality: "quality",
    },
    medium: {
      tier: "medium",
      maxDataPoints: 10000,
      animationEnabled: device.connectionSpeed !== "slow",
      interactionEnabled: true,
      quality: "balanced",
    },
    low: {
      tier: "low",
      maxDataPoints: 5000,
      animationEnabled: false,
      interactionEnabled: device.hasTouch,
      quality: "fast",
    },
  };

  return configs[tier];
}

// Hook for monitoring chart performance
export function useChartPerformanceMonitoring(enabled: boolean = false) {
  const startTimeRef = useMemo(() => ({ current: 0 }), []);

  const startMeasurement = useCallback(() => {
    if (enabled) {
      startTimeRef.current = performance.now();
    }
  }, [enabled, startTimeRef]);

  const endMeasurement = useCallback(
    (label: string) => {
      if (enabled && startTimeRef.current > 0) {
        const duration = performance.now() - startTimeRef.current;
        startTimeRef.current = 0;
        return duration;
      }
      return 0;
    },
    [enabled, startTimeRef]
  );

  return {
    startMeasurement,
    endMeasurement,
  };
}

// Hook for adaptive quality adjustment
export function useAdaptiveQuality(
  initialTier: ChartQualityTier["tier"] = "medium",
  enabled: boolean = true
) {
  const [currentTier, setCurrentTier] =
    useState<ChartQualityTier["tier"]>(initialTier);
  const performanceHistoryRef = useMemo(
    () => ({ current: [] as number[] }),
    []
  );

  const updateQualityBasedOnPerformance = useCallback(
    (renderTime: number, targetFPS: number = 60) => {
      if (!enabled) return;

      const targetFrameTime = 1000 / targetFPS;
      performanceHistoryRef.current.push(renderTime);

      // Keep only last 10 measurements
      if (performanceHistoryRef.current.length > 10) {
        performanceHistoryRef.current.shift();
      }

      // Calculate average performance
      const avgRenderTime =
        performanceHistoryRef.current.reduce((a, b) => a + b, 0) /
        performanceHistoryRef.current.length;

      // Adjust quality based on performance
      if (avgRenderTime > targetFrameTime * 2 && currentTier !== "low") {
        setCurrentTier((prev: any) => {
          const newTier =
            prev === "ultra"
              ? "high"
              : prev === "high"
                ? "medium"
                : prev === "medium"
                  ? "low"
                  : "low";
          return newTier;
        });
      } else if (
        avgRenderTime < targetFrameTime * 0.8 &&
        currentTier !== "ultra"
      ) {
        setCurrentTier((prev: any) => {
          const newTier =
            prev === "low"
              ? "medium"
              : prev === "medium"
                ? "high"
                : prev === "high"
                  ? "ultra"
                  : "ultra";
          return newTier;
        });
      }
    },
    [enabled, currentTier, performanceHistoryRef]
  );

  return {
    currentTier,
    updateQualityBasedOnPerformance,
  };
}

// Export utility functions for getting quality-based parameters
export function getQualityBasedPhysicsParams(
  qualityTier: ChartQualityTier["tier"]
): PhysicsParams {
  const configs: Record<ChartQualityTier["tier"], PhysicsParams> = {
    ultra: {
      stiffness: 300,
      dampingRatio: 0.8,
      mass: 1,
      precision: 0.001,
      velocity: 0,
      friction: 0.01,
    },
    high: {
      stiffness: 250,
      dampingRatio: 0.7,
      mass: 1.2,
      precision: 0.005,
      velocity: 0,
      friction: 0.02,
    },
    medium: {
      stiffness: 200,
      dampingRatio: 0.6,
      mass: 1.5,
      precision: 0.01,
      velocity: 0,
      friction: 0.05,
    },
    low: {
      stiffness: 150,
      dampingRatio: 0.5,
      mass: 2,
      precision: 0.02,
      velocity: 0,
      friction: 0.1,
    },
  };

  return configs[qualityTier] || configs.medium;
}

export function getQualityBasedGlassParams(
  qualityTier: ChartQualityTier["tier"]
): {
  blurStrength: "none" | "light" | "standard" | "heavy";
  opacity: number;
  borderRadius: number;
  elevation: number;
} {
  const configs: Record<ChartQualityTier["tier"], any> = {
    ultra: {
      blurStrength: "heavy" as const,
      opacity: 0.9,
      borderRadius: 16,
      elevation: "level4",
    },
    high: {
      blurStrength: "standard" as const,
      opacity: 0.85,
      borderRadius: 12,
      elevation: "level3",
    },
    medium: {
      blurStrength: "light" as const,
      opacity: 0.8,
      borderRadius: 8,
      elevation: "level2",
    },
    low: {
      blurStrength: "none" as const,
      opacity: 0.7,
      borderRadius: 4,
      elevation: "level1",
    },
  };

  return configs[qualityTier] || configs.medium;
}
