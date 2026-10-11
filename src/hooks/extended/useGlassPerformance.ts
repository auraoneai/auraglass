"use client";
import React from "react";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import {
  PerformanceMonitor,
  MemoryManager,
  type PerformanceMetrics as MonitorPerformanceMetrics,
} from "../../utils/performanceOptimizations";

export type PerformanceLevel = "low" | "medium" | "high" | "ultra";

export interface GlassPerformanceReport extends MonitorPerformanceMetrics {
  memoryStats?: ReturnType<MemoryManager["getStats"]>;
  recommendations: string[];
}

export interface GlassPerformanceOptions {
  /** Enable performance monitoring */
  enableMonitoring?: boolean;
  /** Target FPS for animations */
  targetFPS?: number;
  /** Memory limit in MB */
  memoryLimit?: number;
  /** Enable automatic quality adjustment */
  autoAdjustQuality?: boolean;
  /** Quality adjustment threshold */
  qualityThreshold?: number;
  /** Performance metrics callback */
  onPerformanceMetrics?: (metrics: GlassPerformanceReport) => void;
  /** Quality change callback */
  onQualityChange?: (quality: number) => void;
}

export interface GlassPerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  quality: number;
  isThrottled: boolean;
  recommendations: string[];
}

const DEFAULT_OPTIONS: Required<GlassPerformanceOptions> = {
  enableMonitoring: true,
  targetFPS: 60,
  memoryLimit: 100,
  autoAdjustQuality: true,
  qualityThreshold: 45,
  onPerformanceMetrics: () => {},
  onQualityChange: () => {},
};

export function useGlassPerformance(options: GlassPerformanceOptions = {}) {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const monitorRef = useRef<PerformanceMonitor>();
  const memoryManagerRef = useRef<MemoryManager>();
  const qualityRef = useRef(1.0);

  const [metrics, setMetrics] = useState<GlassPerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    quality: 1.0,
    isThrottled: false,
    recommendations: [],
  });

  // Initialize performance monitoring
  useEffect(() => {
    if (!finalOptions.enableMonitoring) return;

    monitorRef.current = PerformanceMonitor.getInstance({
      targetFPS: finalOptions.targetFPS,
      maxMemoryUsage: finalOptions.memoryLimit * 1024 * 1024,
    });

    memoryManagerRef.current = MemoryManager.getInstance(
      finalOptions.memoryLimit * 1024 * 1024
    );

    return () => {
      // PerformanceMonitor is a singleton and doesn't need explicit cleanup
    };
  }, [
    finalOptions.enableMonitoring,
    finalOptions.targetFPS,
    finalOptions.memoryLimit,
  ]);

  const adjustQuality = useCallback(
    (fps: number) => {
      const targetFPS = finalOptions.targetFPS;
      const threshold = finalOptions.qualityThreshold;

      let newQuality = qualityRef.current;

      if (fps < threshold) {
        // Reduce quality
        newQuality = Math.max(0.1, qualityRef.current * 0.9);
      } else if (fps > targetFPS * 0.9) {
        // Increase quality
        newQuality = Math.min(1.0, qualityRef.current * 1.05);
      }

      if (newQuality !== qualityRef.current) {
        qualityRef.current = newQuality;
        finalOptions.onQualityChange(newQuality);

        setMetrics((prev) => ({
          ...prev,
          quality: newQuality,
        }));
      }
    },
    [finalOptions]
  );

  // REQ-PLAT-59 — the continuous rAF FPS loop is deleted. FPS is measured
  // on demand: `sampleFPS()` runs one bounded window of animation frames,
  // stores the result and (with autoAdjustQuality) adjusts quality.
  const sampleFPS = useCallback(
    async (windowMs: number = 1000) => {
      const monitor = monitorRef.current;
      if (!monitor) return metrics.fps;
      const fps = await monitor.sampleFPS(windowMs);
      const { frameTime } = monitor.getMetrics();
      setMetrics((prev) => ({ ...prev, fps, frameTime }));
      if (fps > 0 && finalOptions.autoAdjustQuality) adjustQuality(fps);
      return fps;
    },
    [adjustQuality, finalOptions.autoAdjustQuality, metrics.fps]
  );

  // Performance metrics callback
  useEffect(() => {
    if (!monitorRef.current) return;

    const interval = setInterval(() => {
      const monitorMetrics = monitorRef.current?.getMetrics();
      const memoryStats = memoryManagerRef.current?.getStats();

      if (monitorMetrics) {
        const recommendations =
          monitorRef.current?.getOptimizationSuggestions() || [];

        setMetrics((prev) => ({
          ...prev,
          fps: monitorMetrics.fps ?? prev.fps,
          memoryUsage: monitorMetrics.memoryUsage,
          renderTime: monitorMetrics.frameTime,
          // fps 0 = not measured yet; never treated as throttled.
          isThrottled: prev.fps > 0 && prev.fps < finalOptions.qualityThreshold,
          recommendations,
        }));

        finalOptions.onPerformanceMetrics({
          ...monitorMetrics,
          memoryStats,
          recommendations,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [finalOptions]);

  // Performance optimization methods
  const optimizeForLowPerformance = useCallback(() => {
    return {
      reduceParticles: true,
      disableShadows: true,
      lowerResolution: true,
      reduceAnimationComplexity: true,
    };
  }, []);

  const getOptimalSettings = useCallback(() => {
    // Unmeasured fps (0) falls back to the target instead of degrading.
    const currentFPS = metrics.fps > 0 ? metrics.fps : finalOptions.targetFPS;
    const memoryUsage = metrics.memoryUsage;
    const memoryLimit = finalOptions.memoryLimit * 1024 * 1024;

    return {
      particleCount: currentFPS > 50 ? 100 : currentFPS > 30 ? 50 : 25,
      shadowQuality: memoryUsage < memoryLimit * 0.8 ? "high" : "low",
      textureSize: currentFPS > 50 ? 1024 : 512,
      animationEnabled: currentFPS > 25,
      blurEnabled: currentFPS > 40,
    };
  }, [metrics.fps, metrics.memoryUsage, finalOptions.memoryLimit, finalOptions.targetFPS]);

  return {
    metrics,
    quality: qualityRef.current,
    optimizeForLowPerformance,
    getOptimalSettings,
    sampleFPS,
    isLowPerformance: metrics.fps > 0 && metrics.fps < finalOptions.qualityThreshold,
    isHighPerformance: metrics.fps > finalOptions.targetFPS * 0.9,
  };
}

// Hook for debounced performance monitoring
export function useDebouncedPerformance(
  callback: (metrics: GlassPerformanceReport) => void,
  delay: number = 1000,
  options: GlassPerformanceOptions = {}
) {
  const [debouncedMetrics, setDebouncedMetrics] =
    useState<GlassPerformanceReport | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const performance = useGlassPerformance({
    ...options,
    onPerformanceMetrics: (metrics) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedMetrics(metrics);
        callback(metrics);
      }, delay);
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...performance,
    debouncedMetrics,
  };
}

// Hook for conditional rendering based on performance
export function useConditionalRendering(
  performance: ReturnType<typeof useGlassPerformance>,
  thresholds: {
    low: number;
    medium: number;
    high: number;
  } = { low: 30, medium: 45, high: 55 }
) {
  const performanceLevel = useMemo<PerformanceLevel>(() => {
    // Unmeasured fps (0) is not evidence of low performance (REQ-PLAT-59).
    const fps =
      performance.metrics.fps > 0 ? performance.metrics.fps : thresholds.high;

    if (fps < thresholds.low) return "low";
    if (fps < thresholds.medium) return "medium";
    if (fps < thresholds.high) return "high";
    return "ultra";
  }, [performance.metrics.fps, thresholds]);

  const shouldRender = useCallback(
    (minPerformance: keyof typeof thresholds) => {
      const levels = ["low", "medium", "high", "ultra"];
      const currentIndex = levels.indexOf(performanceLevel);
      const minIndex = levels.indexOf(minPerformance);

      return currentIndex >= minIndex;
    },
    [performanceLevel]
  );

  const getComponentVariant = useCallback(
    <T>(variants: Partial<Record<PerformanceLevel | "default", T>>) => {
      return variants[performanceLevel] || variants.default;
    },
    [performanceLevel]
  );

  return {
    performanceLevel,
    shouldRender,
    getComponentVariant,
  };
}

// Hook for lazy loading based on performance
export function useLazyPerformance<P extends object = Record<string, unknown>>(
  component: React.ComponentType<P>,
  fallback?: React.ComponentType<P>,
  options: GlassPerformanceOptions & {
    minFPS?: number;
    loadDelay?: number;
  } = {}
) {
  const { minFPS = 30, loadDelay = 1000, ...performanceOptions } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const performance = useGlassPerformance(performanceOptions);

  useEffect(() => {
    if (performance.metrics.fps >= minFPS) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, loadDelay);

      return () => clearTimeout(timer);
    }
  }, [performance.metrics.fps, minFPS, loadDelay]);

  const Component = isLoaded ? component : fallback || (() => null);

  return {
    Component,
    isLoaded,
    performance,
  };
}

// Hook for progressive enhancement
export function useProgressiveEnhancement(
  performance: ReturnType<typeof useGlassPerformance>,
  features: Array<{
    name: string;
    component: React.ComponentType<Record<string, unknown>>;
    minFPS: number;
    fallback?: React.ComponentType<Record<string, unknown>>;
  }>
) {
  const enabledFeatures = useMemo(() => {
    return features.filter(
      (feature) => performance.metrics.fps >= feature.minFPS
    );
  }, [features, performance.metrics.fps]);

  const getFeatureComponent = useCallback(
    (featureName: string) => {
      const feature = enabledFeatures.find((f) => f.name === featureName);
      return feature?.component || (() => null);
    },
    [enabledFeatures]
  );

  const isFeatureEnabled = useCallback(
    (featureName: string) => {
      return enabledFeatures.some((f) => f.name === featureName);
    },
    [enabledFeatures]
  );

  return {
    enabledFeatures,
    getFeatureComponent,
    isFeatureEnabled,
    performanceLevel:
      performance.metrics.fps >= 50
        ? "high"
        : performance.metrics.fps >= 30
          ? "medium"
          : "low",
  };
}
