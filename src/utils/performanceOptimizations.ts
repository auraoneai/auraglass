import React from 'react';
// Performance optimization utilities

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  layoutTime: number;
  paintTime: number;
  compositeTime: number;
  networkLatency: number;
  cacheHitRate: number;
}

export interface OptimizationConfig {
  enableFPSMonitoring: boolean;
  enableMemoryMonitoring: boolean;
  enableNetworkMonitoring: boolean;
  targetFPS: number;
  maxMemoryUsage: number;
  enableAdaptiveQuality: boolean;
  enableVirtualization: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];
  private frameCount = 0;
  private lastTime = 0;
  private config: OptimizationConfig;
  private measurements = new Map<string, { startTime: number; endTime?: number }>();

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableFPSMonitoring: true,
      enableMemoryMonitoring: false,
      enableNetworkMonitoring: false,
      targetFPS: 60,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      enableAdaptiveQuality: true,
      enableVirtualization: true,
      enableLazyLoading: true,
      enableCaching: true,
      enableCompression: false,
      ...config,
    };

    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      layoutTime: 0,
      paintTime: 0,
      compositeTime: 0,
      networkLatency: 0,
      cacheHitRate: 0,
    };

    this.initializeMonitoring();
  }

  static getInstance(config?: Partial<OptimizationConfig>): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor(config);
    }
    return PerformanceMonitor.instance;
  }

  private initializeMonitoring(): void {
    if (this.config.enableFPSMonitoring) {
      this.startFPSMonitoring();
    }

    if (this.config.enableMemoryMonitoring && 'memory' in performance) {
      this.startMemoryMonitoring();
    }

    if (this.config.enableNetworkMonitoring) {
      this.startNetworkMonitoring();
    }
  }

  private startFPSMonitoring(): void {
    const measureFPS = (timestamp: number) => {
      this.frameCount++;

      if (this.lastTime === 0) {
        this.lastTime = timestamp;
        requestAnimationFrame(measureFPS);
        return;
      }

      const deltaTime = timestamp - this.lastTime;

      if (deltaTime >= 1000) { // Update every second
        this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
        this.metrics.frameTime = deltaTime / this.frameCount;

        this.frameCount = 0;
        this.lastTime = timestamp;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private startMemoryMonitoring(): void {
    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }
    }, 5000); // Check every 5 seconds
  }

  private startNetworkMonitoring(): void {
    // Monitor fetch requests
    const originalFetch = window.fetch;
    let requestCount = 0;
    let cacheHits = 0;

    window.fetch = async (...args) => {
      const startTime = Date.now();
      requestCount++;

      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        // Estimate cache hit based on response time
        if (duration < 50) {
          cacheHits++;
        }

        this.metrics.networkLatency = duration;
        this.metrics.cacheHitRate = (cacheHits / requestCount) * 100;

        return response;
      } catch (error) {
        throw error;
      }
    };
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  isPerformanceGood(): boolean {
    return (
      this.metrics.fps >= this.config.targetFPS * 0.8 &&
      this.metrics.memoryUsage <= this.config.maxMemoryUsage
    );
  }

  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];

    if (this.metrics.fps < this.config.targetFPS * 0.8) {
      suggestions.push('Consider reducing animation complexity');
      suggestions.push('Enable virtualization for large lists');
      suggestions.push('Reduce particle effects or simplify shaders');
    }

    if (this.metrics.memoryUsage > this.config.maxMemoryUsage * 0.8) {
      suggestions.push('Implement memory cleanup');
      suggestions.push('Reduce texture sizes');
      suggestions.push('Unload unused assets');
    }

    if (this.metrics.renderTime > 16.67) { // 60 FPS threshold
      suggestions.push('Optimize render pipeline');
      suggestions.push('Use CSS transforms instead of layout properties');
      suggestions.push('Implement object pooling');
    }

    return suggestions;
  }

  startMeasure(name: string): void {
    this.measurements.set(name, { startTime: performance.now() });
  }

  stop(): void {
    // Stop all measurements and log results
    for (const [name, measurement] of this.measurements) {
      if (!measurement.endTime) {
        measurement.endTime = performance.now();
        const duration = measurement.endTime - measurement.startTime;
        console.log(`Performance measurement '${name}': ${duration.toFixed(2)}ms`);
      }
    }
    this.measurements.clear();
  }

  getMeasurementDuration(name: string): number | null {
    const measurement = this.measurements.get(name);
    if (measurement && measurement.endTime) {
      return measurement.endTime - measurement.startTime;
    }
    return null;
  }
}

// Memory management
export class MemoryManager {
  private static instance: MemoryManager;
  private cache = new Map<string, any>();
  private maxCacheSize: number;
  private currentCacheSize = 0;

  constructor(maxCacheSize: number = 50 * 1024 * 1024) { // 50MB default
    this.maxCacheSize = maxCacheSize;
  }

  static getInstance(maxCacheSize?: number): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager(maxCacheSize);
    }
    return MemoryManager.instance;
  }

  set(key: string, value: any, size: number = 0): void {
    if (this.currentCacheSize + size > this.maxCacheSize) {
      this.evictOldEntries(size);
    }

    this.cache.set(key, { value, size, lastAccessed: Date.now() });
    this.currentCacheSize += size;
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
      return entry.value;
    }
    return null;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentCacheSize -= entry.size;
      return this.cache.delete(key);
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.currentCacheSize = 0;
  }

  private evictOldEntries(requiredSize: number): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    let freedSize = 0;
    for (const [key, entry] of entries) {
      if (freedSize >= requiredSize) break;
      freedSize += entry.size;
      this.cache.delete(key);
    }

    this.currentCacheSize -= freedSize;
  }

  getStats(): { size: number; entries: number; hitRate: number } {
    return {
      size: this.currentCacheSize,
      entries: this.cache.size,
      hitRate: 0, // Would need to track hits/misses
    };
  }
}

// Rendering optimizations
export const renderingOptimizations = {
  // Use transform instead of changing layout properties
  useTransformForMovement: (element: HTMLElement, x: number, y: number): void => {
    element.style.transform = `translate(${x}px, ${y}px)`;
    element.style.willChange = 'transform';
  },

  // Optimize for 60fps animations
  optimizeFor60FPS: (callback: () => void): void => {
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= 16.67) { // ~60fps
        callback();
        lastTime = timestamp;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  },

  // Batch DOM updates
  batchDOMUpdates: (updates: Array<() => void>): void => {
    requestAnimationFrame(() => {
      updates.forEach((update: any) => update());
    });
  },

  // Use CSS containment for performance
  enableCSSContainment: (element: HTMLElement): void => {
    element.style.contain = 'layout style paint';
  },

  // Optimize canvas rendering
  optimizeCanvasRendering: (canvas: HTMLCanvasElement): void => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = 'source-over';
    }
  },
};

// Network optimizations
export const networkOptimizations = {
  // Lazy load images
  lazyLoadImage: (img: HTMLImageElement, src: string): void => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      });
    });
    observer.observe(img);
  },

  // Preload critical resources
  preloadCriticalResources: (resources: string[]): void => {
    resources.forEach((resource: any) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      document.head.appendChild(link);
    });
  },

  // Cache API wrapper
  cacheAPI: {
    async set(key: string, data: any): Promise<void> {
      if ('caches' in window) {
        const cache = await caches.open('glass-cache-v1');
        await cache.put(key, new Response(JSON.stringify(data)));
      }
    },

    async get(key: string): Promise<any> {
      if ('caches' in window) {
        const cache = await caches.open('glass-cache-v1');
        const response = await cache.match(key);
        if (response) {
          return response.json();
        }
      }
      return null;
    },
  },
};

// Virtualization utilities
export class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private totalItems: number;
  private visibleItems: number;
  private scrollTop = 0;

  constructor(
    container: HTMLElement,
    itemHeight: number,
    totalItems: number,
    visibleItems: number
  ) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.visibleItems = visibleItems;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleItems();
  }

  private updateVisibleItems(): void {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + this.visibleItems,
      this.totalItems
    );

    // Dispatch custom event with visible range
    const event = new CustomEvent('virtualScroll', {
      detail: { startIndex, endIndex },
    });
    this.container.dispatchEvent(event);
  }

  getVisibleRange(): { start: number; end: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(start + this.visibleItems, this.totalItems);
    return { start, end };
  }

  scrollToItem(index: number): void {
    this.container.scrollTop = index * this.itemHeight;
  }
}

// Adaptive quality system
export class AdaptiveQuality {
  private qualityLevel = 1.0;
  private monitor: PerformanceMonitor;

  constructor(monitor: PerformanceMonitor) {
    this.monitor = monitor;
  }

  updateQuality(): number {
    const metrics = this.monitor.getMetrics();
    const targetFPS = 60;
    const fpsRatio = metrics.fps / targetFPS;

    if (fpsRatio < 0.8) {
      // Reduce quality
      this.qualityLevel = Math.max(0.1, this.qualityLevel * 0.9);
    } else if (fpsRatio > 1.2) {
      // Increase quality
      this.qualityLevel = Math.min(1.0, this.qualityLevel * 1.05);
    }

    return this.qualityLevel;
  }

  getQualitySettings(): {
    particleCount: number;
    textureSize: number;
    shadowQuality: number;
    antialiasing: boolean;
  } {
    return {
      particleCount: Math.floor(1000 * this.qualityLevel),
      textureSize: Math.floor(1024 * this.qualityLevel),
      shadowQuality: Math.floor(4 * this.qualityLevel),
      antialiasing: this.qualityLevel > 0.5,
    };
  }
}

// Export utilities
export const performanceUtils = {
  monitor: PerformanceMonitor.getInstance,
  memory: MemoryManager.getInstance,
  adaptiveQuality: (monitor: PerformanceMonitor) => new AdaptiveQuality(monitor),
  virtualScroller: VirtualScroller,
};
