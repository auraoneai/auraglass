import React from "react";
import { CSSProperties } from "react";
import { detectDevice } from "../../utils/deviceCapabilities";

export type PerformanceMode = "high" | "balanced" | "low";
export type RenderingOptimization = "gpu" | "cpu" | "auto";

export interface PerformanceOptions {
  mode?: PerformanceMode;
  rendering?: RenderingOptimization;
  prefersReducedMotion?: boolean;
  enableLazyLoading?: boolean;
  enableVirtualization?: boolean;
}

export interface BrowserMemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
}

export interface DeviceCapabilitySummary {
  supportsGPU: boolean;
  supportsBackdropFilter: boolean;
  prefersReducedMotion: boolean;
  connectionSpeed: string;
  memoryInfo: BrowserMemoryInfo | null;
  devicePixelRatio?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
  };
}

interface PerformanceWithMemory extends Performance {
  memory?: BrowserMemoryInfo;
}

/**
 * Performance-optimized CSS properties based on device capabilities
 */
export const createPerformanceMixin = (
  options: PerformanceOptions = {}
): CSSProperties => {
  const {
    mode = "balanced",
    rendering = "auto",
    prefersReducedMotion = false,
  } = options;

  let styles: CSSProperties = {};

  // Base performance optimizations
  switch (mode) {
    case "high":
      styles = {
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        contain: "layout style paint",
      };
      break;

    case "balanced":
      styles = {
        willChange: "auto",
        backfaceVisibility: "visible",
        contain: "layout paint",
      };
      break;

    case "low":
      styles = {
        willChange: "auto",
        transform: "none",
        filter: "none",
        // Use createGlassStyle() instead,
        // Use createGlassStyle() instead,
      };
      break;
  }

  // GPU acceleration optimizations
  if (rendering === "gpu" && mode !== "low") {
    styles.transform = "translateZ(0)";
    styles.isolation = "isolate";
  }

  // Reduced motion support
  if (prefersReducedMotion) {
    styles.animation = "none";
    styles.transition = "none";
    styles.transform = "none";
  }

  return styles;
};

/**
 * Optimized transition mixin with fallbacks
 */
export const createOptimizedTransition = (
  properties: string[],
  duration: number = 200,
  easing: string = "cubic-bezier(0.4, 0, 0.2, 1)",
  prefersReducedMotion: boolean = false
): CSSProperties => {
  if (prefersReducedMotion) {
    return {};
  }

  return {
    transition: properties
      .map((prop) => `${prop} ${duration}ms ${easing}`)
      .join(", "),
    transitionProperty: properties.join(", "),
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: easing,
  };
};

/**
 * Memory-efficient animation mixin
 */
export const createMemoryEfficientAnimation = (
  name: string,
  duration: number = 1000,
  iterationCount: number | "infinite" = 1,
  options: {
    playState?: "running" | "paused";
    fillMode?: "none" | "forwards" | "backwards" | "both";
    prefersReducedMotion?: boolean;
  } = {}
): CSSProperties => {
  const {
    playState = "running",
    fillMode = "both",
    prefersReducedMotion = false,
  } = options;

  if (prefersReducedMotion) {
    return {};
  }

  return {
    animation: `${name} ${duration}ms ${iterationCount} ${fillMode}`,
    animationPlayState: playState,
    animationFillMode: fillMode,
  };
};

/**
 * Lazy loading optimization styles
 */
export const createLazyLoadMixin = (
  isLoaded: boolean = false,
  placeholder?: string
): CSSProperties => {
  if (isLoaded) {
    return {
      opacity: 1,
      transform: "none",
    };
  }

  return {
    opacity: 0,
    transform: "scale(0.95)",
    transition: "opacity 300ms ease, transform 300ms ease",
    backgroundImage: placeholder ? `url(${placeholder})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
};

/**
 * Virtualization container styles
 */
export const createVirtualizationMixin = (
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
): CSSProperties => ({
  height: containerHeight,
  overflow: "auto",
  contain: "strict",
  scrollBehavior: "smooth",
  WebkitOverflowScrolling: "touch", // iOS momentum scrolling
});

/**
 * Intersection Observer optimization
 */
export const createIntersectionObserverOptions = (
  threshold: number[] = [0, 0.25, 0.5, 0.75, 1],
  rootMargin: string = "50px"
): IntersectionObserverInit => ({
  threshold,
  rootMargin,
});

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    if (typeof performance !== "undefined") {
      performance.mark(`${name}-start`);
    }
  }

  endMeasure(name: string): number | null {
    if (typeof performance === "undefined") return null;

    try {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name, "measure")[0];
      const duration = measure.duration;

      // Store metric
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);

      // Cleanup
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);

      return duration;
    } catch {
      return null;
    }
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    return metrics.reduce((sum, value) => sum + value, 0) / metrics.length;
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

/**
 * Device capability detection
 */
export const detectDeviceCapabilities = (): DeviceCapabilitySummary => {
  if (typeof window === "undefined") {
    return {
      supportsGPU: false,
      supportsBackdropFilter: false,
      prefersReducedMotion: false,
      connectionSpeed: "unknown",
      memoryInfo: null,
    };
  }

  const device = detectDevice();

  return {
    supportsGPU: device.capabilities.webgl,
    supportsBackdropFilter:
      CSS.supports("backdrop-filter", "blur(1px)") ||
      CSS.supports("-webkit-backdrop-filter", "blur(1px)"),
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    connectionSpeed:
      (navigator as NavigatorWithConnection).connection?.effectiveType ||
      "unknown",
    memoryInfo: (performance as PerformanceWithMemory).memory || null,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
};

/**
 * Adaptive performance configuration
 */
export const getAdaptivePerformanceConfig = (): PerformanceOptions => {
  const capabilities = detectDeviceCapabilities();

  // Low-end device detection
  const isLowEnd =
    !capabilities.supportsGPU ||
    capabilities.connectionSpeed === "slow-2g" ||
    capabilities.connectionSpeed === "2g" ||
    (capabilities.memoryInfo &&
      capabilities.memoryInfo.jsHeapSizeLimit < 1000000000); // < 1GB

  // High-end device detection
  const isHighEnd =
    capabilities.supportsGPU &&
    capabilities.supportsBackdropFilter &&
    (capabilities.connectionSpeed === "4g" ||
      capabilities.connectionSpeed === "5g") &&
    (capabilities.devicePixelRatio ?? 1) >= 2;

  if (isLowEnd) {
    return {
      mode: "low",
      rendering: "cpu",
      prefersReducedMotion: true,
      enableLazyLoading: true,
      enableVirtualization: true,
    };
  }

  if (isHighEnd) {
    return {
      mode: "high",
      rendering: "gpu",
      prefersReducedMotion: capabilities.prefersReducedMotion,
      enableLazyLoading: false,
      enableVirtualization: false,
    };
  }

  return {
    mode: "balanced",
    rendering: "auto",
    prefersReducedMotion: capabilities.prefersReducedMotion,
    enableLazyLoading: true,
    enableVirtualization: true,
  };
};

/**
 * Debounced resize observer for performance
 */
export const createDebouncedResizeObserver = (
  callback: (entries: ResizeObserverEntry[]) => void,
  delay: number = 100
): ResizeObserver | null => {
  if (typeof ResizeObserver === "undefined") return null;

  let timeoutId: NodeJS.Timeout;

  return new ResizeObserver((entries) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(entries), delay);
  });
};

/**
 * Memory leak prevention utilities
 */
export const createCleanupManager = () => {
  const cleanupFunctions: (() => void)[] = [];

  return {
    add: (cleanup: () => void) => {
      cleanupFunctions.push(cleanup);
    },
    cleanup: () => {
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch {
          // Continue running remaining cleanup callbacks.
        }
      });
      cleanupFunctions.length = 0;
    },
  };
};

/**
 * Optimized scroll handling
 */
export const createOptimizedScrollHandler = (
  handler: (event: Event) => void,
  options: {
    throttle?: number;
    passive?: boolean;
  } = {}
) => {
  const { throttle = 16, passive = true } = options; // 60fps by default
  let ticking = false;

  const throttledHandler = (event: Event) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler(event);
        ticking = false;
      });
      ticking = true;
    }
  };

  return {
    handler: throttledHandler,
    options: { passive },
  };
};
