import React from 'react';
import { detectDevice } from './deviceCapabilities';
/**
 * Production utilities for AuraGlass components
 * These utilities are optimized for production environments
 */

// === Environment Detection ===

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

// === Logging Utilities ===

export const logger = {
  error: (message: string, ...args: any[]) => {
    if (isDevelopment()) {
      console.error(`[AuraGlass Error]: ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    if (isDevelopment()) {
      console.warn(`[AuraGlass Warning]: ${message}`, ...args);
    }
  },

  info: (message: string, ...args: any[]) => {
    if (isDevelopment()) {
      console.info(`[AuraGlass Info]: ${message}`, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (isDevelopment()) {
      console.debug(`[AuraGlass Debug]: ${message}`, ...args);
    }
  },
};

// === Performance Utilities ===

export const performance = {
  measure: (name: string, fn: () => void): number => {
    if (!isDevelopment()) {
      fn();
      return 0;
    }

    const start = Date.now();
    fn();
    const end = Date.now();
    const duration = end - start;

    logger.debug(`Performance: ${name} took ${duration}ms`);
    return duration;
  },

  measureAsync: async (name: string, fn: () => Promise<void>): Promise<number> => {
    if (!isDevelopment()) {
      await fn();
      return 0;
    }

    const start = Date.now();
    await fn();
    const end = Date.now();
    const duration = end - start;

    logger.debug(`Performance: ${name} took ${duration}ms`);
    return duration;
  },
};

// === Error Handling ===

export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  errorMessage?: string
): T => {
  try {
    return fn();
  } catch (error) {
    logger.error(errorMessage || 'Safe execution failed', error);
    return fallback;
  }
};

export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    logger.error(errorMessage || 'Safe async execution failed', error);
    return fallback;
  }
};

// === Feature Detection ===

export const features = {
  supportsIntersectionObserver: (): boolean => {
    return typeof IntersectionObserver !== 'undefined';
  },

  supportsResizeObserver: (): boolean => {
    return typeof ResizeObserver !== 'undefined';
  },

  supportsBackdropFilter: (): boolean => {
    if (typeof CSS === 'undefined') return false;
    return (
      CSS.supports('backdrop-filter', 'blur(1px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
    );
  },

  supportsWebGL: (): boolean => {
    if (typeof window === 'undefined') return false;
    // Use cached device detection to avoid creating contexts repeatedly
    return detectDevice().capabilities.webgl;
  },

  supportsWebP: (): boolean => {
    if (typeof CSS === 'undefined') return false;
    return CSS.supports('image-format', 'webp');
  },

  supportsAVIF: (): boolean => {
    if (typeof CSS === 'undefined') return false;
    return CSS.supports('image-format', 'avif');
  },

  supportsContainerQueries: (): boolean => {
    if (typeof CSS === 'undefined') return false;
    return CSS.supports('container-type', 'inline-size');
  },
};

// === Memory Management ===

export const memory = {
  cleanup: (refs: React.RefObject<any>[]): void => {
    refs.forEach((ref: any) => {
      if (ref.current) {
        (ref as React.MutableRefObject<any>).current = null;
      }
    });
  },

  debounce: <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): T => {
    let timeout: NodeJS.Timeout;
    
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    }) as T;
  },

  throttle: <T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean;
    
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
};

// === Validation ===

export const validate = {
  isValidHexColor: (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  },

  isValidRgbaColor: (color: string): boolean => {
    return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/.test(color);
  },

  isValidCSSUnit: (value: string): boolean => {
    return /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex)$/.test(value);
  },

  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// === Data Utilities ===

export const data = {
  generateId: (prefix: string = 'glass'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(data.deepClone) as unknown as T;
    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        cloned[key] = data.deepClone(obj[key]);
      }
      return cloned;
    }
    return obj;
  },

  isEqual: (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, index) => data.isEqual(val, b[index]));
    }
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => data.isEqual(a[key], b[key]));
    }
    return false;
  },

  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach((key: any) => delete result[key]);
    return result;
  },

  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach((key: any) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
};

// === CSS Utilities ===

export const css = {
  classNames: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  },

  mergeStyles: (...styles: (React.CSSProperties | undefined)[]): React.CSSProperties => {
    return styles.filter((style): style is React.CSSProperties => style !== undefined)
      .reduce((merged, style) => ({ ...merged, ...style }), {} as React.CSSProperties);
  },

  pxToRem: (px: number, baseFontSize: number = 16): string => {
    return `${px / baseFontSize}rem`;
  },

  hexToRgba: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// === Browser Utilities ===

export const browser = {
  isChrome: (): boolean => {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  },

  isFirefox: (): boolean => {
    return /Firefox/.test(navigator.userAgent);
  },

  isSafari: (): boolean => {
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  },

  isEdge: (): boolean => {
    return /Edg/.test(navigator.userAgent);
  },

  isMobile: (): boolean => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isTouch: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  getViewportSize: (): { width: number; height: number } => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  getDevicePixelRatio: (): number => {
    return window.devicePixelRatio || 1;
  },
};

// === Storage Utilities ===

export const storage = {
  set: (key: string, value: any): void => {
    safeExecute(
      () => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      undefined,
      `Failed to save to localStorage: ${key}`
    );
  },

  get: <T>(key: string, fallback: T): T => {
    return safeExecute(
      () => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      },
      fallback,
      `Failed to read from localStorage: ${key}`
    );
  },

  remove: (key: string): void => {
    safeExecute(
      () => {
        localStorage.removeItem(key);
      },
      undefined,
      `Failed to remove from localStorage: ${key}`
    );
  },

  clear: (): void => {
    safeExecute(
      () => {
        localStorage.clear();
      },
      undefined,
      'Failed to clear localStorage'
    );
  },
};

// === Analytics Utilities ===

export const analytics = {
  track: (event: string, properties?: Record<string, any>): void => {
    if (isProduction()) {
      // Integration point for analytics service
      // Example: analyticsService.track(event, properties);
      safeExecute(
        () => {
          // Your analytics implementation here
          if (isDevelopment()) {
            logger.debug(`Analytics: ${event}`, properties);
          }
        },
        undefined,
        `Failed to track analytics event: ${event}`
      );
    }
  },

  page: (page: string, properties?: Record<string, any>): void => {
    if (isProduction()) {
      // Integration point for page tracking
      // Example: analyticsService.page(page, properties);
      safeExecute(
        () => {
          // Your page tracking implementation here
          if (isDevelopment()) {
            logger.debug(`Page: ${page}`, properties);
          }
        },
        undefined,
        `Failed to track page view: ${page}`
      );
    }
  },

  identify: (userId: string, traits?: Record<string, any>): void => {
    if (isProduction()) {
      // Integration point for user identification
      // Example: analyticsService.identify(userId, traits);
      safeExecute(
        () => {
          // Your user identification implementation here
          if (isDevelopment()) {
            logger.debug(`Identify: ${userId}`, traits);
          }
        },
        undefined,
        `Failed to identify user: ${userId}`
      );
    }
  },
};

// === Production Configuration ===

export const productionConfig = {
  // Error reporting configuration
  errorReporting: {
    enabled: isProduction(),
    endpoint: process.env.REACT_APP_ERROR_ENDPOINT || '',
    apiKey: process.env.REACT_APP_ERROR_API_KEY || '',
    maxRetries: 3,
    retryDelay: 1000,
  },

  // Analytics configuration
  analytics: {
    enabled: isProduction(),
    trackingId: process.env.REACT_APP_ANALYTICS_ID || '',
    sampleRate: 1.0,
    enableAutoPageTracking: true,
  },

  // Performance configuration
  performance: {
    enableMonitoring: isProduction(),
    sampleRate: 0.1, // Monitor 10% of sessions
    thresholds: {
      renderTime: 16, // 60fps
      memoryUsage: 0.8, // 80% of available memory
      bundleSize: 150 * 1024, // 150KB
    },
  },

  // Feature flags
  features: {
    enableAdvancedAnimations: true,
    enableVirtualization: true,
    enableLazyLoading: true,
    enableA11yAuditing: isDevelopment(),
    enablePerformanceMonitoring: true,
  },
};

// === Bundle Analysis ===

export const bundle = {
  reportSize: (componentName: string, size: number): void => {
    if (isDevelopment()) {
      logger.info(`Bundle: ${componentName} is ${(size / 1024).toFixed(2)}KB`);
      
      if (size > productionConfig.performance.thresholds.bundleSize) {
        logger.warn(`Bundle: ${componentName} exceeds size threshold`);
      }
    }
  },

  trackImport: (componentName: string): void => {
    if (isDevelopment()) {
      logger.debug(`Import: ${componentName} loaded`);
    }
    
    analytics.track('component_imported', {
      component: componentName,
      timestamp: Date.now(),
    });
  },
};

// === Health Checks ===

export const health = {
  checkGlassSupport: (): {
    supported: boolean;
    issues: string[];
  } => {
    const issues: string[] = [];

    if (!features.supportsBackdropFilter()) {
      issues.push('Backdrop filter not supported');
    }

    if (!features.supportsIntersectionObserver()) {
      issues.push('Intersection Observer not supported');
    }

    if (!features.supportsResizeObserver()) {
      issues.push('Resize Observer not supported');
    }

    return {
      supported: issues.length === 0,
      issues,
    };
  },

  checkPerformance: (): {
    score: number;
    recommendations: string[];
  } => {
    const recommendations: string[] = [];
    let score = 100;

    // Check device capabilities
    if (!features.supportsWebGL()) {
      score -= 20;
      recommendations.push('Enable GPU acceleration for better performance');
    }

    if (browser.isMobile()) {
      score -= 10;
      recommendations.push('Consider reduced effects for mobile devices');
    }

    // Check memory
    const memory = (performance as any).memory;
    if (memory && memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
      score -= 30;
      recommendations.push('High memory usage detected - enable virtualization');
    }

    return { score, recommendations };
  },
};

// === Production Initialization ===

export const initializeProduction = (): void => {
  if (!isProduction()) return;

  // Set up error handling
  window.addEventListener('error', (event) => {
    logger.error('Unhandled error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason);
  });

  // Check glass support
  const glassSupport = health.checkGlassSupport();
  if (!glassSupport.supported) {
    logger.warn('Glass effects may not work properly:', glassSupport.issues);
  }

  // Check performance
  const performanceCheck = health.checkPerformance();
  if (performanceCheck.score < 70) {
    logger.warn('Performance issues detected:', performanceCheck.recommendations);
  }

  logger.info('AuraGlass production mode initialized');
};

// === Development Helpers ===

export const dev = {
  logComponentRender: (componentName: string, props: any): void => {
    if (isDevelopment()) {
      logger.debug(`Render: ${componentName}`, props);
    }
  },

  logPerformanceWarning: (componentName: string, metric: string, value: number, threshold: number): void => {
    if (isDevelopment() && value > threshold) {
      logger.warn(`Performance: ${componentName} ${metric} (${value}) exceeds threshold (${threshold})`);
    }
  },

  validateProps: <T>(props: T, schema: Record<keyof T, (value: any) => boolean>): boolean => {
    if (!isDevelopment()) return true;

    const errors: string[] = [];

    Object.entries(schema).forEach(([key, validator]) => {
      const value = (props as any)[key];
      const validatorFn = validator as (value: any) => boolean;
      if (value !== undefined && !validatorFn(value)) {
        errors.push(`Invalid prop: ${key}`);
      }
    });

    if (errors.length > 0) {
      logger.error('Prop validation failed:', errors);
      return false;
    }

    return true;
  },
};
