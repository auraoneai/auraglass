'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  // Core Web Vitals
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  inp: number; // Interaction to Next Paint
  
  // Runtime metrics
  fps: number; // Frames per second
  memoryUsage: number; // Memory usage in MB
  domElements: number; // Number of DOM elements
  
  // Network metrics
  networkLatency: number; // Network latency in ms
  bundleSize: number; // Bundle size in KB
  
  // User experience
  timeToInteractive: number; // Time to Interactive
  totalBlockingTime: number; // Total Blocking Time
}

export interface PerformanceSettings {
  enableMonitoring: boolean;
  sampleRate: number; // Percentage of users to monitor (0-100)
  reportingInterval: number; // How often to report metrics (ms)
  enableDevtools: boolean; // Show performance overlay in dev mode
}

const defaultMetrics: PerformanceMetrics = {
  cls: 0,
  fcp: 0,
  lcp: 0,
  fid: 0,
  inp: 0,
  fps: 60,
  memoryUsage: 0,
  domElements: 0,
  networkLatency: 0,
  bundleSize: 0,
  timeToInteractive: 0,
  totalBlockingTime: 0,
};

const defaultSettings: PerformanceSettings = {
  enableMonitoring: true,
  sampleRate: 100, // Monitor 100% in development
  reportingInterval: 5000, // Report every 5 seconds
  enableDevtools: process.env.NODE_ENV === 'development',
};

export const usePerformance = (settings: Partial<PerformanceSettings> = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(defaultMetrics);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  
  const config = { ...defaultSettings, ...settings };
  const frameId = useRef<number>();
  const lastFrameTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCount.current++;
    
    if (now - lastFrameTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFrameTime.current));
      setMetrics((prev: any) => ({ ...prev, fps }));
      
      frameCount.current = 0;
      lastFrameTime.current = now;
      
      // Alert on low FPS
      if (fps < 30) {
        setAlerts((prev: any) => [...prev, `Low FPS detected: ${fps}`]);
      }
    }
    
    if (isMonitoring) {
      frameId.current = requestAnimationFrame(measureFPS);
    }
  }, [isMonitoring]);

  // Memory usage monitoring
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      setMetrics((prev: any) => ({ ...prev, memoryUsage }));
      
      // Alert on high memory usage
      if (memoryUsage > 100) {
        setAlerts((prev: any) => [...prev, `High memory usage: ${memoryUsage}MB`]);
      }
    }
  }, []);

  // DOM elements count
  const measureDOMComplexity = useCallback(() => {
    const domElements = document.querySelectorAll('*').length;
    setMetrics((prev: any) => ({ ...prev, domElements }));
    
    // Alert on DOM complexity
    if (domElements > 2000) {
      setAlerts((prev: any) => [...prev, `High DOM complexity: ${domElements} elements`]);
    }
  }, []);

  // Web Vitals monitoring
  const measureWebVitals = useCallback(() => {
    // Use Web Vitals library if available
    if ('webVitals' in window) {
      return;
    }

    // Basic CLS measurement
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      setMetrics((prev: any) => ({ ...prev, cls: clsValue }));
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Layout shift not supported
    }

    // LCP measurement
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics((prev: any) => ({ ...prev, lcp: lastEntry.startTime }));
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
    };
  }, []);

  // Network latency estimation
  const measureNetworkLatency = useCallback(async () => {
    const start = performance.now();
    try {
      await fetch('/favicon.ico', { method: 'HEAD' });
      const latency = performance.now() - start;
      setMetrics((prev: any) => ({ ...prev, networkLatency: Math.round(latency) }));
    } catch (e) {
      // Network request failed
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (Math.random() * 100 > config.sampleRate) return;
    
    setIsMonitoring(true);
    measureFPS();
    
    const interval = setInterval(() => {
      measureMemoryUsage();
      measureDOMComplexity();
      measureNetworkLatency();
    }, config.reportingInterval);

    const cleanup = measureWebVitals();

    return () => {
      setIsMonitoring(false);
      clearInterval(interval);
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      cleanup?.();
    };
  }, [config.sampleRate, config.reportingInterval, measureFPS, measureMemoryUsage, measureDOMComplexity, measureNetworkLatency, measureWebVitals]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
  }, []);

  // Performance recommendations
  const getRecommendations = useCallback((): string[] => {
    const recommendations = [];

    if (metrics.fps < 30) {
      recommendations.push('Consider reducing animations or using will-change CSS property');
    }

    if (metrics.memoryUsage > 100) {
      recommendations.push('High memory usage detected. Check for memory leaks');
    }

    if (metrics.domElements > 2000) {
      recommendations.push('High DOM complexity. Consider virtualizing long lists');
    }

    if (metrics.cls > 0.1) {
      recommendations.push('Layout shifts detected. Ensure elements have defined dimensions');
    }

    if (metrics.lcp > 2500) {
      recommendations.push('Slow loading detected. Optimize images and critical resources');
    }

    if (metrics.networkLatency > 200) {
      recommendations.push('High network latency. Consider caching or CDN optimization');
    }

    return recommendations;
  }, [metrics]);

  // Performance score calculation
  const getPerformanceScore = useCallback((): number => {
    let score = 100;

    // FPS penalty
    if (metrics.fps < 60) score -= (60 - metrics.fps) * 0.5;

    // Memory penalty
    if (metrics.memoryUsage > 50) score -= (metrics.memoryUsage - 50) * 0.2;

    // DOM complexity penalty
    if (metrics.domElements > 1000) score -= (metrics.domElements - 1000) * 0.01;

    // Web Vitals penalties
    if (metrics.cls > 0.1) score -= metrics.cls * 100;
    if (metrics.lcp > 2500) score -= (metrics.lcp - 2500) * 0.01;

    return Math.max(0, Math.round(score));
  }, [metrics]);

  // Clear alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Export metrics for reporting
  const exportMetrics = useCallback(() => {
    return {
      ...metrics,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      performanceScore: getPerformanceScore(),
      recommendations: getRecommendations(),
    };
  }, [metrics, getPerformanceScore, getRecommendations]);

  // Initialize monitoring on mount
  useEffect(() => {
    if (!config.enableMonitoring) return;

    const cleanup = startMonitoring();
    return cleanup;
  }, [config.enableMonitoring, startMonitoring]);

  // Performance grade
  const getGrade = useCallback((): 'A' | 'B' | 'C' | 'D' | 'F' => {
    const score = getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, [getPerformanceScore]);

  return {
    metrics,
    isMonitoring,
    alerts,
    startMonitoring,
    stopMonitoring,
    getRecommendations,
    getPerformanceScore,
    getGrade,
    clearAlerts,
    exportMetrics,
    config,
  };
};

// Hook for performance-aware components
export const usePerformanceOptimization = () => {
  const { metrics, getPerformanceScore } = usePerformance();
  
  // Adaptive quality based on performance
  const getAdaptiveQuality = useCallback(() => {
    const score = getPerformanceScore();
    
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }, [getPerformanceScore]);

  // Should reduce animations based on performance
  const shouldReduceAnimations = useCallback(() => {
    return metrics.fps < 30 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, [metrics.fps]);

  // Should lazy load based on performance
  const shouldLazyLoad = useCallback(() => {
    return metrics.memoryUsage > 50 || metrics.domElements > 1500;
  }, [metrics.memoryUsage, metrics.domElements]);

  return {
    adaptiveQuality: getAdaptiveQuality(),
    shouldReduceAnimations: shouldReduceAnimations(),
    shouldLazyLoad: shouldLazyLoad(),
    performanceMetrics: metrics,
  };
};