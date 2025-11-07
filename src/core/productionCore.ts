import React from 'react';
/**
 * AuraGlass Production Configuration and Utilities
 * 
 * This module provides production-ready configuration, optimization utilities,
 * and performance monitoring for the AuraGlass design system.
 */

import { detectDevice } from '../utils/deviceCapabilities';
import { PolyfillManager } from '../utils/browserCompatibility';
import { PerformanceMonitor } from '../utils/performanceOptimizations';
import { injectGlowKeyframes } from './mixins/glowEffects';

export interface ProductionConfig {
  /** Enable development mode features */
  development: boolean;
  /** Enable performance monitoring */
  monitoring: boolean;
  /** Enable analytics */
  analytics: boolean;
  /** Enable error reporting */
  errorReporting: boolean;
  /** Auto-load polyfills */
  autoPolyfills: boolean;
  /** Quality tier override */
  qualityTier?: 'low' | 'medium' | 'high' | 'ultra' | 'auto';
  /** Enable reduced motion by default */
  reducedMotion?: boolean;
  /** Theme preference */
  defaultTheme?: 'light' | 'dark' | 'glass';
  /** Animation preferences */
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
  /** Performance thresholds */
  performance: {
    targetFPS: number;
    memoryLimit: number;
    autoOptimize: boolean;
  };
}

export const defaultProductionConfig: ProductionConfig = {
  development: process.env.NODE_ENV === 'development',
  monitoring: true,
  analytics: false,
  errorReporting: true,
  autoPolyfills: true,
  qualityTier: 'auto',
  reducedMotion: false,
  defaultTheme: 'glass',
  animations: {
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  performance: {
    targetFPS: 60,
    memoryLimit: 100 * 1024 * 1024, // 100MB
    autoOptimize: true,
  },
};

export class AuraGlassProduction {
  private static instance: AuraGlassProduction;
  private config: ProductionConfig;
  private performanceMonitor: PerformanceMonitor;
  private initialized: boolean = false;

  private constructor(config: Partial<ProductionConfig> = {}) {
    this.config = { ...defaultProductionConfig, ...config };
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  static getInstance(config?: Partial<ProductionConfig>): AuraGlassProduction {
    if (!AuraGlassProduction.instance) {
      AuraGlassProduction.instance = new AuraGlassProduction(config);
    }
    return AuraGlassProduction.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 1. Load required polyfills
      if (this.config.autoPolyfills) {
        await PolyfillManager.loadRequiredPolyfills();
      }

      // 2. Detect device capabilities
      const device = detectDevice();
      
      // 3. Set optimal quality tier
      if (this.config.qualityTier === 'auto') {
        this.config.qualityTier = device.performance.tier;
      }

      // 4. Inject CSS animations
      injectGlowKeyframes();
      this.injectProductionCSS();

      // 5. Setup performance monitoring
      if (this.config.monitoring) {
        this.setupPerformanceMonitoring();
      }

      // 6. Setup error reporting
      if (this.config.errorReporting) {
        this.setupErrorReporting();
      }

      // 7. Apply accessibility preferences
      this.applyAccessibilityPreferences();

      // 8. Setup theme system
      this.setupThemeSystem();

      this.initialized = true;

      if (this.config.development) {
        console.log('🎉 AuraGlass Production initialized successfully', {
          qualityTier: this.config.qualityTier,
          device: device.type,
          performance: device.performance.tier,
        });
      }
    } catch (error) {
      console.error('❌ AuraGlass Production initialization failed:', error);
      throw error;
    }
  }

  private injectProductionCSS(): void {
    const cssId = 'aura-glass-production-styles';
    
    if (document.getElementById(cssId)) return;

    const style = document.createElement('style');
    style.id = cssId;
    style.textContent = this.generateProductionCSS();
    document.head.appendChild(style);
  }

  private generateProductionCSS(): string {
    return `
      /* AuraGlass Production Styles */
      .aura-glass-root {
        --aura-animation-duration: ${this.config.animations.duration}ms;
        --aura-animation-easing: ${this.config.animations.easing};
        --aura-quality-tier: ${this.config.qualityTier};
      }

      .aura-glass-performance-low {
        --aura-animation-duration: 200ms;
        --aura-blur-amount: 4px;
        --aura-particle-count: 10;
      }

      .aura-glass-performance-medium {
        --aura-animation-duration: 300ms;
        --aura-blur-amount: 8px;
        --aura-particle-count: 25;
      }

      .aura-glass-performance-high {
        --aura-animation-duration: 250ms;
        --aura-blur-amount: 12px;
        --aura-particle-count: 50;
      }

      .aura-glass-performance-ultra {
        --aura-animation-duration: 200ms;
        --aura-blur-amount: 16px;
        --aura-particle-count: 100;
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .aura-glass-root * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* High contrast support */
      @media (prefers-contrast: high) {
        .aura-glass-surface {
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          background: rgba(0, 0, 0, 0.95) !important;
        }
      }
    `;
  }

  private setupPerformanceMonitoring(): void {
    // Monitor component render times
    this.performanceMonitor.startMeasure('aura-glass-render');

    // Monitor memory usage
    setInterval(() => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo.usedJSHeapSize > this.config.performance.memoryLimit) {
          this.optimizeForMemory();
        }
      }
    }, 5000);

    // Monitor FPS
    this.monitorFPS();
  }

  private monitorFPS(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const calculateFPS = (currentTime: number) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Optimize if FPS is too low
        if (fps < this.config.performance.targetFPS * 0.8 && this.config.performance.autoOptimize) {
          this.optimizeForPerformance();
        }
      }

      requestAnimationFrame(calculateFPS);
    };

    requestAnimationFrame(calculateFPS);
  }

  private optimizeForPerformance(): void {
    // Reduce animation quality
    document.documentElement.classList.add('aura-glass-performance-optimized');
    
    // Disable non-essential animations
    const style = document.createElement('style');
    style.textContent = `
      .aura-glass-performance-optimized * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      .aura-glass-performance-optimized .aura-glass-particle {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  private optimizeForMemory(): void {
    // Clear unused caches
    if ('memory' in performance) {
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
    }

    // Emit memory warning event
    window.dispatchEvent(new CustomEvent('aura-glass-memory-warning', {
      detail: { timestamp: Date.now() }
    }));
  }

  private setupErrorReporting(): void {
    window.addEventListener('error', (event) => {
      if (event.error && event.error.stack && event.error.stack.includes('aura-glass')) {
        this.reportError(event.error, 'javascript-error');
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.stack && event.reason.stack.includes('aura-glass')) {
        this.reportError(event.reason, 'unhandled-promise');
      }
    });
  }

  private reportError(error: Error, type: string): void {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      type,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      config: this.config,
    };

    if (this.config.development) {
      console.error('🚨 AuraGlass Error:', errorReport);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, or custom analytics
  }

  private applyAccessibilityPreferences(): void {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || this.config.reducedMotion) {
      document.documentElement.classList.add('aura-glass-reduced-motion');
      this.config.animations.enabled = false;
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('aura-glass-high-contrast');
    }

    // Check for dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches && this.config.defaultTheme === 'glass') {
      document.documentElement.classList.add('aura-glass-dark-mode');
    }
  }

  private setupThemeSystem(): void {
    // Apply default theme
    document.documentElement.setAttribute('data-aura-theme', this.config.defaultTheme || 'glass');
    
    // Apply quality tier class
    document.documentElement.classList.add(`aura-glass-quality-${this.config.qualityTier}`);

    // Setup CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--aura-animation-duration', `${this.config.animations.duration}ms`);
    root.style.setProperty('--aura-animation-easing', this.config.animations.easing);
    root.style.setProperty('--aura-target-fps', this.config.performance.targetFPS.toString());
  }

  // Public API methods
  getConfig(): ProductionConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<ProductionConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (this.initialized) {
      this.applyConfigChanges(updates);
    }
  }

  private applyConfigChanges(updates: Partial<ProductionConfig>): void {
    if (updates.qualityTier) {
      document.documentElement.className = document.documentElement.className
        .replace(/aura-glass-quality-\w+/, `aura-glass-quality-${updates.qualityTier}`);
    }

    if (updates.animations?.duration) {
      document.documentElement.style.setProperty('--aura-animation-duration', `${updates.animations.duration}ms`);
    }

    if (updates.animations?.easing) {
      document.documentElement.style.setProperty('--aura-animation-easing', updates.animations.easing);
    }

    if (updates.defaultTheme) {
      document.documentElement.setAttribute('data-aura-theme', updates.defaultTheme);
    }
  }

  getPerformanceMetrics(): any {
    return this.performanceMonitor.getMetrics();
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  destroy(): void {
    // Cleanup resources
    if (this.performanceMonitor) {
      this.performanceMonitor.stop();
    }

    // Remove injected styles
    const styles = document.querySelectorAll('style[id^="aura-glass"]');
    styles.forEach((style: any) => style.remove());

    // Remove classes
    document.documentElement.className = document.documentElement.className
      .replace(/aura-glass-[\w-]+/g, '');

    this.initialized = false;
  }
}

// Global initialization function
export async function initializeAuraGlass(config?: Partial<ProductionConfig>): Promise<AuraGlassProduction> {
  const instance = AuraGlassProduction.getInstance(config);
  await instance.initialize();
  return instance;
}

// Utility functions for production use
export const productionUtils = {
  // Check if AuraGlass is ready
  isReady: (): boolean => {
    return AuraGlassProduction.getInstance().isInitialized();
  },

  // Get current configuration
  getConfig: (): ProductionConfig => {
    return AuraGlassProduction.getInstance().getConfig();
  },

  // Update configuration
  updateConfig: (updates: Partial<ProductionConfig>): void => {
    AuraGlassProduction.getInstance().updateConfig(updates);
  },

  // Get performance metrics
  getMetrics: (): any => {
    return AuraGlassProduction.getInstance().getPerformanceMetrics();
  },

  // Force performance optimization
  optimize: (): void => {
    const instance = AuraGlassProduction.getInstance();
    (instance as any).optimizeForPerformance();
  },

  // Check device capabilities
  getDeviceInfo: () => {
    return detectDevice();
  },

  // Validate production readiness
  validateProduction: (): { ready: boolean; issues: string[] } => {
    const issues: string[] = [];

    // Check required APIs
    if (!window.requestAnimationFrame) {
      issues.push('RequestAnimationFrame not available');
    }

    if (!window.getComputedStyle) {
      issues.push('GetComputedStyle not available');
    }

    // Check CSS support
    const testElement = document.createElement('div');
    if (!('backdropFilter' in testElement.style) && !('webkitBackdropFilter' in testElement.style)) {
      issues.push('Backdrop filter not supported - glassmorphism effects will be limited');
    }

    if (!('grid' in testElement.style)) {
      issues.push('CSS Grid not supported - layout may be affected');
    }

    // Check performance capabilities
    const device = detectDevice();
    if (device.performance.tier === 'low') {
      issues.push('Low performance device detected - consider enabling performance optimizations');
    }

    return {
      ready: issues.length === 0,
      issues,
    };
  },
};

// Export singleton instance getter
export const getAuraGlass = () => AuraGlassProduction.getInstance();

// Development utilities (only available in development)
export const devUtils = process.env.NODE_ENV === 'development' ? {
  // Enable debug mode
  enableDebug: (): void => {
    document.documentElement.classList.add('aura-glass-debug');
    
    const debugStyle = document.createElement('style');
    debugStyle.id = 'aura-glass-debug-styles';
    debugStyle.textContent = `
      .aura-glass-debug .glass-surface {
        outline: 1px dashed rgba(255, 0, 0, 0.5) !important;
      }
      .aura-glass-debug .glass-surface::before {
        content: attr(class);
        position: absolute;
        top: -20px;
        left: 0;
        font-size: 10px;
        color: red;
        background: rgba(0, 0, 0, 0.8);
        padding: 2px 4px;
        border-radius: 2px;
        z-index: 10000;
      }
    `;
    document.head.appendChild(debugStyle);
  },

  // Disable debug mode
  disableDebug: (): void => {
    document.documentElement.classList.remove('aura-glass-debug');
    const debugStyle = document.getElementById('aura-glass-debug-styles');
    if (debugStyle) debugStyle.remove();
  },

  // Log performance metrics
  logMetrics: (): void => {
    console.table(getAuraGlass().getPerformanceMetrics());
  },

  // Test all components
  testComponents: (): void => {
    console.log('🧪 Testing AuraGlass components...');
    // Component testing logic would go here
  },
} : {};

// Export default configuration
export default defaultProductionConfig;
