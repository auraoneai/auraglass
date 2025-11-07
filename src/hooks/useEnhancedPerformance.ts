import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PerformanceMonitor, 
  getAdaptivePerformanceConfig, 
  createCleanupManager,
  type PerformanceOptions 
} from '../core/mixins/performanceMixins';
import { detectDevice } from '../utils/deviceCapabilities';

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  networkSpeed: string;
  deviceCapabilities: {
    supportsGPU: boolean;
    supportsBackdropFilter: boolean;
    devicePixelRatio: number;
  };
}

export interface PerformanceState {
  isOptimized: boolean;
  performanceMode: 'high' | 'balanced' | 'low';
  metrics: PerformanceMetrics | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Enhanced performance monitoring and optimization hook
 */
export function useEnhancedPerformance(options: {
  enableMetrics?: boolean;
  metricsInterval?: number;
  adaptiveMode?: boolean;
  onPerformanceChange?: (state: PerformanceState) => void;
} = {}): PerformanceState & {
  startMeasure: (name: string) => void;
  endMeasure: (name: string) => number | null;
  optimizeForDevice: () => void;
  clearMetrics: () => void;
} {
  const {
    enableMetrics = true,
    metricsInterval = 5000,
    adaptiveMode = true,
    onPerformanceChange,
  } = options;

  const [state, setState] = useState<PerformanceState>({
    isOptimized: false,
    performanceMode: 'balanced',
    metrics: null,
    isLoading: true,
    error: null,
  });

  const performanceMonitor = useRef(PerformanceMonitor.getInstance());
  const metricsIntervalRef = useRef<NodeJS.Timeout>();
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const cleanupManager = useRef(createCleanupManager());

  // Measure frame rate
  const measureFrameRate = useCallback(() => {
    let frameCount = 0;
    let startTime = performance.now();

    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - startTime >= 1000) {
        frameCountRef.current = frameCount;
        frameCount = 0;
        startTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };

    requestAnimationFrame(countFrame);
  }, []);

  // Collect performance metrics
  const collectMetrics = useCallback(async (): Promise<PerformanceMetrics | null> => {
    if (!enableMetrics || typeof window === 'undefined') return null;

    try {
      // Memory usage (if available)
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit : 0;

      // Network speed
      const connection = (navigator as any).connection;
      const networkSpeed = connection?.effectiveType || 'unknown';

      // Device capabilities (cached, avoids creating WebGL contexts repeatedly)
      const deviceInfo = detectDevice();
      const deviceCapabilities = {
        supportsGPU: deviceInfo.capabilities.webgl,
        supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(1px)') || 
                                CSS.supports('-webkit-backdrop-filter', 'blur(1px)'),
        devicePixelRatio: window.devicePixelRatio || 1,
      };

      // Render time (average from performance monitor)
      const renderTime = performanceMonitor.current.getAverageMetric('render') || 0;

      return {
        renderTime,
        memoryUsage,
        frameRate: frameCountRef.current,
        networkSpeed,
        deviceCapabilities,
      };
    } catch (error) {
      console.warn('Failed to collect performance metrics:', error);
      return null;
    }
  }, [enableMetrics]);

  // Optimize performance based on current metrics
  const optimizeForDevice = useCallback(() => {
    const config = getAdaptivePerformanceConfig();
    
    setState((prev: any) => ({
      ...prev,
      performanceMode: config.mode || 'balanced',
      isOptimized: true,
    }));
  }, []);

  // Start performance measurement
  const startMeasure = useCallback((name: string) => {
    performanceMonitor.current.startMeasure(name);
  }, []);

  // End performance measurement
  const endMeasure = useCallback((name: string): number | null => {
    return performanceMonitor.current.endMeasure(name);
  }, []);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    performanceMonitor.current.clearMetrics();
    frameCountRef.current = 0;
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    const initialize = async () => {
      try {
        setState((prev: any) => ({ ...prev, isLoading: true, error: null }));

        // Start frame rate monitoring
        if (enableMetrics) {
          measureFrameRate();
        }

        // Adaptive optimization
        if (adaptiveMode) {
          optimizeForDevice();
        }

        // Set up metrics collection interval
        if (enableMetrics && metricsInterval > 0) {
          const intervalId = setInterval(async () => {
            const metrics = await collectMetrics();
            if (metrics) {
              setState((prev: any) => {
                const newState = { ...prev, metrics };
                onPerformanceChange?.(newState);
                return newState;
              });
            }
          }, metricsInterval);

          metricsIntervalRef.current = intervalId;
          cleanupManager.current.add(() => clearInterval(intervalId));
        }

        // Initial metrics collection
        const initialMetrics = await collectMetrics();
        
        setState((prev: any) => ({
          ...prev,
          metrics: initialMetrics,
          isLoading: false,
        }));

      } catch (error) {
        setState((prev: any) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Performance initialization failed',
          isLoading: false,
        }));
      }
    };

    initialize();

    return () => {
      cleanupManager.current.cleanup();
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [enableMetrics, metricsInterval, adaptiveMode, measureFrameRate, collectMetrics, optimizeForDevice, onPerformanceChange]);

  return {
    ...state,
    startMeasure,
    endMeasure,
    optimizeForDevice,
    clearMetrics,
  };
}

/**
 * Hook for performance-aware rendering
 */
export function usePerformanceAwareRendering<T>(
  data: T[],
  options: {
    itemsPerPage?: number;
    enableVirtualization?: boolean;
    performanceThreshold?: number;
  } = {}
): {
  visibleData: T[];
  shouldVirtualize: boolean;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
} {
  const {
    itemsPerPage = 50,
    enableVirtualization = true,
    performanceThreshold = 100,
  } = options;

  const [currentPage, setCurrentPage] = useState(0);
  const { metrics } = useEnhancedPerformance();

  const shouldVirtualize = enableVirtualization && (
    (data?.length || 0) > performanceThreshold ||
    (metrics?.frameRate || 60) < 30 ||
    (metrics?.memoryUsage || 0) > 0.8
  );

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  
  const visibleData = shouldVirtualize
    ? data?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : data;

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  return {
    visibleData,
    shouldVirtualize,
    currentPage,
    totalPages,
    setPage,
  };
}

/**
 * Hook for lazy loading with performance awareness
 */
export function usePerformanceLazyLoading(
  enabled: boolean = true,
  options: {
    threshold?: number;
    rootMargin?: string;
    performanceMode?: 'high' | 'balanced' | 'low';
  } = {}
): {
  ref: React.RefObject<HTMLElement>;
  isIntersecting: boolean;
  shouldLoad: boolean;
} {
  const { threshold = 0.1, rootMargin = '50px', performanceMode } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { performanceMode: detectedMode } = useEnhancedPerformance();

  const effectiveMode = performanceMode || detectedMode;
  const shouldLoad = !enabled || isIntersecting || effectiveMode === 'high';

  useEffect(() => {
    if (!enabled || !ref.current || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: effectiveMode === 'low' ? 0.5 : threshold,
        rootMargin: effectiveMode === 'low' ? '0px' : rootMargin,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, effectiveMode]);

  return {
    ref,
    isIntersecting,
    shouldLoad,
  };
}

/**
 * Hook for adaptive image loading based on performance
 */
export function useAdaptiveImageLoading(
  src: string,
  options: {
    lowQualitySrc?: string;
    webpSrc?: string;
    avifSrc?: string;
    sizes?: string;
  } = {}
): {
  currentSrc: string;
  isLoading: boolean;
  error: string | null;
} {
  const { lowQualitySrc, webpSrc, avifSrc } = options;
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { metrics, performanceMode } = useEnhancedPerformance();

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Determine best image format based on performance and support
        let targetSrc = src;
        
        if (performanceMode === 'high' && metrics?.networkSpeed === '4g') {
          // Use best quality format available
          if (avifSrc && CSS.supports('image-format', 'avif')) {
            targetSrc = avifSrc;
          } else if (webpSrc && CSS.supports('image-format', 'webp')) {
            targetSrc = webpSrc;
          }
        } else if (performanceMode === 'low' || metrics?.networkSpeed === '2g') {
          // Use low quality version if available
          if (lowQualitySrc) {
            targetSrc = lowQualitySrc;
          }
        }

        // Preload image
        const img = new Image();
        img.onload = () => {
          setCurrentSrc(targetSrc);
          setIsLoading(false);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setCurrentSrc(src); // Fallback to original
          setIsLoading(false);
        };
        img.src = targetSrc;

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Image loading failed');
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, lowQualitySrc, webpSrc, avifSrc, performanceMode, metrics?.networkSpeed]);

  return {
    currentSrc,
    isLoading,
    error,
  };
}
