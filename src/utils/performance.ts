/**
 * AuraGlass Performance Monitoring
 * Real-time performance tracking and optimization
 * Enhanced with consciousness interface performance monitoring
 */

interface PerformanceMetrics {
  componentMount: number;
  firstPaint: number;
  layoutShift: number;
  interactionLatency: number;
  memoryUsage: number;
  backdropFilterCost: number;
  // Consciousness interface metrics
  consciousnessInit: number;
  eyeTrackingLatency: number;
  biometricProcessing: number;
  predictiveAnalysis: number;
  spatialAudioLatency: number;
  achievementTracking: number;
}

// Performance budgets for consciousness features (in milliseconds)
export const CONSCIOUSNESS_PERFORMANCE_BUDGETS = {
  CONSCIOUSNESS_INIT: 50,
  EYE_TRACKING_UPDATE: 16.67,
  BIOMETRIC_PROCESSING: 100,
  PREDICTIVE_ANALYSIS: 200,
  SPATIAL_AUDIO_UPDATE: 33.33,
  ACHIEVEMENT_TRACKING: 50,
  COMPONENT_RENDER: 16.67,
} as const;

class GlassPerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observer: PerformanceObserver | null = null;
  private rafId: number | null = null;
  private consciousnessMetrics: Map<string, number[]> = new Map();
  private performanceViolations: Array<{operation: string, actual: number, budget: number}> = [];
  
  /**
   * Start monitoring performance
   */
  start() {
    // Monitor paint timing
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            this.recordMetric('firstPaint', entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            this.recordMetric('layoutShift', (entry as any).value);
          }
          if (entry.entryType === 'measure' && entry.name.includes('consciousness')) {
            this.recordConsciousnessMetric(entry.name, entry.duration);
          }
        }
      });
      
      this.observer.observe({ 
        entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint', 'measure'] 
      });
    }
    
    // Monitor backdrop filter performance
    this.measureBackdropFilterCost();
    
    // Monitor memory
    this.monitorMemory();
    
    // Monitor consciousness features
    this.monitorConsciousnessPerformance();
  }
  
  /**
   * Measure component mount time
   */
  measureComponentMount(componentName: string, callback: () => void): number {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const mountTime = endTime - startTime;
    
    this.recordMetric(`${componentName}.mount`, mountTime);
    
    // Warn if mount time exceeds budget
    if (mountTime > 16) {
      console.warn(`⚠️ ${componentName} mount time (${mountTime.toFixed(2)}ms) exceeds 16ms budget`);
    }
    
    return mountTime;
  }
  
  /**
   * Measure backdrop filter rendering cost
   */
  private measureBackdropFilterCost() {
    const measure = () => {
      const elements = document.querySelectorAll('[class*="glass-blur"]');
      let totalCost = 0;
      
      elements.forEach((el: any) => {
        const rect = el.getBoundingClientRect();
        const area = rect.width * rect.height;
        const blurAmount = this.getBlurAmount(el);
        
        // Estimate cost based on area and blur radius
        const cost = (area * blurAmount) / 1000000; // Normalize
        totalCost += cost;
      });
      
      this.recordMetric('backdropFilterCost', totalCost);
      
      // Warn if cost is too high
      if (totalCost > 10) {
        console.warn(`⚠️ High backdrop filter cost: ${totalCost.toFixed(2)}`);
        this.suggestOptimizations();
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    measure();
  }
  
  /**
   * Get blur amount from element
   */
  private getBlurAmount(element: Element): number {
    const classes = element.className;
    if (classes.includes('glass-blur-xl')) return 24;
    if (classes.includes('glass-blur-lg')) return 16;
    if (classes.includes('glass-blur-md')) return 8;
    if (classes.includes('glass-blur-sm')) return 4;
    return 0;
  }
  
  /**
   * Monitor memory usage
   */
  private monitorMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1048576;
        this.recordMetric('memoryUsage', usedMB);
        
        if (usedMB > 100) {
          console.warn(`⚠️ High memory usage: ${usedMB.toFixed(2)}MB`);
        }
      }, 5000);
    }
  }
  
  /**
   * Monitor consciousness interface performance
   */
  private monitorConsciousnessPerformance() {
    // Track consciousness feature initialization times
    const originalConsole = console.time;
    const originalConsoleEnd = console.timeEnd;
    
    const measurementMap = new Map<string, number>();
    
    console.time = (label?: string) => {
      if (label?.includes('consciousness')) {
        measurementMap.set(label, performance.now());
      }
      return originalConsole.call(console, label);
    };
    
    console.timeEnd = (label?: string) => {
      if (label?.includes('consciousness') && measurementMap.has(label)) {
        const duration = performance.now() - measurementMap.get(label)!;
        this.recordConsciousnessMetric(label, duration);
        measurementMap.delete(label);
      }
      return originalConsoleEnd.call(console, label);
    };
  }
  
  /**
   * Record consciousness-specific metrics
   */
  recordConsciousnessMetric(operation: string, duration: number) {
    if (!this.consciousnessMetrics.has(operation)) {
      this.consciousnessMetrics.set(operation, []);
    }
    
    this.consciousnessMetrics.get(operation)!.push(duration);
    
    // Check against budgets
    const budget = this.getConsciousnessBudget(operation);
    if (budget && duration > budget) {
      this.performanceViolations.push({ operation, actual: duration, budget });
      console.warn(`⚠️ Consciousness performance violation: ${operation} took ${duration.toFixed(2)}ms (budget: ${budget}ms)`);
    }
    
    // Keep only last 100 measurements
    const measurements = this.consciousnessMetrics.get(operation)!;
    if (measurements.length > 100) {
      measurements.splice(0, measurements.length - 100);
    }
  }
  
  /**
   * Get budget for consciousness operation
   */
  private getConsciousnessBudget(operation: string): number | undefined {
    if (operation.includes('init')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.CONSCIOUSNESS_INIT;
    if (operation.includes('eye-tracking')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.EYE_TRACKING_UPDATE;
    if (operation.includes('biometric')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.BIOMETRIC_PROCESSING;
    if (operation.includes('predictive')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.PREDICTIVE_ANALYSIS;
    if (operation.includes('spatial-audio')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.SPATIAL_AUDIO_UPDATE;
    if (operation.includes('achievement')) return CONSCIOUSNESS_PERFORMANCE_BUDGETS.ACHIEVEMENT_TRACKING;
    return undefined;
  }
  
  /**
   * Get consciousness performance statistics
   */
  getConsciousnessStats() {
    const stats: Record<string, any> = {};
    
    for (const [operation, measurements] of this.consciousnessMetrics.entries()) {
      if (measurements.length === 0) continue;
      
      const sorted = [...measurements].sort((a, b) => a - b);
      stats[operation] = {
        count: measurements.length,
        min: Math.min(...measurements),
        max: Math.max(...measurements),
        avg: measurements.reduce((a, b) => a + b) / measurements.length,
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      };
    }
    
    return stats;
  }
  
  /**
   * Record a metric
   */
  private recordMetric(name: string, value: number) {
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance', {
        metric_name: name,
        value: value,
      });
    }
    
    // Store locally
    const current = this.metrics.get('current') || {} as PerformanceMetrics;
    (current as any)[name] = value;
    this.metrics.set('current', current);
  }
  
  /**
   * Suggest performance optimizations
   */
  private suggestOptimizations() {
    console.group('🎯 Performance Optimization Suggestions');
    console.log('Glass Effects:');
    console.log('1. Reduce blur radius on large surfaces');
    console.log('2. Use will-change sparingly');
    console.log('3. Limit stacked glass layers to 2');
    console.log('4. Consider glass-blur-sm for backgrounds');
    console.log('5. Lazy load off-screen glass elements');
    
    if (this.performanceViolations.length > 0) {
      console.log('\nConsciousness Interface:');
      console.log('6. Debounce eye tracking updates to 60fps max');
      console.log('7. Throttle biometric processing to 100ms intervals');
      console.log('8. Cache predictive analysis results');
      console.log('9. Use Web Workers for heavy consciousness computations');
      console.log('10. Lazy load consciousness features on user interaction');
    }
    console.groupEnd();
  }
  
  /**
   * Get comprehensive performance report
   */
  getReport() {
    const baseMetrics = this.metrics.get('current');
    const consciousnessStats = this.getConsciousnessStats();
    
    return {
      timestamp: new Date().toISOString(),
      baseMetrics,
      consciousnessMetrics: consciousnessStats,
      performanceViolations: this.performanceViolations,
      budgets: CONSCIOUSNESS_PERFORMANCE_BUDGETS,
      recommendations: this.generateRecommendations(),
    };
  }
  
  /**
   * Generate performance recommendations
   */
  private generateRecommendations() {
    const recommendations: string[] = [];
    const consciousnessStats = this.getConsciousnessStats();
    
    Object.entries(consciousnessStats).forEach(([operation, stats]) => {
      const budget = this.getConsciousnessBudget(operation);
      if (budget && stats.p95 > budget) {
        if (operation.includes('eye-tracking')) {
          recommendations.push('Consider throttling eye tracking updates to 60fps');
        } else if (operation.includes('biometric')) {
          recommendations.push('Move biometric processing to Web Worker');
        } else if (operation.includes('predictive')) {
          recommendations.push('Implement caching for predictive analysis');
        } else if (operation.includes('spatial-audio')) {
          recommendations.push('Reduce spatial audio update frequency');
        }
      }
    });
    
    return recommendations;
  }
  
  /**
   * Stop monitoring
   */
  stop() {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// Export singleton
export const glassPerformance = new GlassPerformanceMonitor();

/**
 * React hook for performance monitoring
 */
export function useGlassPerformance(componentName: string) {
  useEffect(() => {
    const mountTime = glassPerformance.measureComponentMount(
      componentName,
      () => {}
    );
    
    return () => {
      // Cleanup if needed
    };
  }, [componentName]);
}

/**
 * React hook for consciousness performance monitoring
 */
export function useConsciousnessPerformance(componentName: string) {
  const measureOperation = (operation: string, fn: () => void) => {
    const label = `consciousness-${componentName}-${operation}`;
    const startTime = performance.now();
    
    try {
      fn();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      glassPerformance.recordConsciousnessMetric(label, duration);
    }
  };
  
  return { measureOperation };
}

/**
 * Performance-optimized consciousness hooks
 */
export function useOptimizedConsciousnessFeatures(features: any) {
  const { measureOperation } = useConsciousnessPerformance('consciousness-features');
  
  // Debounced eye tracking
  const debouncedEyeTracking = useCallback(
    debounce((data: any) => {
      measureOperation('eye-tracking', () => {
        // Eye tracking logic here
      });
    }, 16.67), // 60fps
    []
  );
  
  // Throttled biometric processing
  const throttledBiometricProcessing = useCallback(
    throttle((data: any) => {
      measureOperation('biometric', () => {
        // Biometric processing logic here
      });
    }, 100),
    []
  );
  
  return {
    debouncedEyeTracking,
    throttledBiometricProcessing,
  };
}

// Utility functions
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

/**
 * Intersection Observer for lazy loading glass elements
 */
export function lazyLoadGlass(threshold = 0.1) {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Add glass classes when in view
          element.classList.add('glass-foundation-complete');
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          observer.unobserve(element);
        }
      });
    },
    { threshold }
  );
  
  // Observe all lazy glass elements
  document.querySelectorAll('[data-lazy-glass]').forEach((el: any) => {
    const element = el as HTMLElement;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.3s ease-out';
    observer.observe(element);
  });
}

/**
 * Adaptive quality based on device capabilities
 */
export function getAdaptiveQuality(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'high';
  
  // Check device memory
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return 'low';
  
  // Check connection
  const connection = (navigator as any).connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'low';
    if (effectiveType === '3g') return 'medium';
  }
  
  // Check CPU cores
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return 'medium';
  
  return 'high';
}

import { useEffect, useCallback } from 'react';