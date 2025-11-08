import React from "react";
/**
 * Runtime Glass Style Probes
 *
 * Monitors glass system performance, compliance, and usage patterns in real-time.
 * Provides telemetry for the unified glass system to ensure proper functioning.
 *
 * Part of Phase 5: Quality & Testing
 */

import { AURA_GLASS } from "../tokens/glass";
import { canUseDOM } from "./ssr";

export interface GlassProbeResult {
  timestamp: number;
  elementId?: string;
  glassConfiguration: {
    intent: string;
    elevation: string;
    tier: string;
  };
  performance: {
    backdropSupported: boolean;
    gpuAccelerated: boolean;
    renderTime?: number;
    memoryUsage?: number;
  };
  compliance: {
    wcagContrast: number;
    minVisibility: boolean;
    accessibilityScore: number;
  };
  usage: {
    apiUsed: "createGlassStyle" | "css-classes" | "legacy" | "unknown";
    deprecationWarnings: string[];
  };
}

export class GlassStyleProbes {
  private static instance: GlassStyleProbes;
  private probeResults: GlassProbeResult[] = [];
  private observer: MutationObserver | null = null;
  private performanceObserver: PerformanceObserver | null = null;
  private isMonitoring = false;

  static getInstance(): GlassStyleProbes {
    if (!GlassStyleProbes.instance) {
      GlassStyleProbes.instance = new GlassStyleProbes();
    }
    return GlassStyleProbes.instance;
  }

  // Start monitoring glass elements
  startMonitoring(): void {
    // Skip monitoring during SSR
    if (!canUseDOM || this.isMonitoring) return;

    console.log("🔍 Starting AuraGlass runtime probes...");

    this.isMonitoring = true;
    this.setupMutationObserver();
    this.setupPerformanceObserver();
    this.schedulePeriodicProbes();

    // Initial scan of existing glass elements
    this.scanExistingElements();
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    console.log("⏹️ Stopping AuraGlass runtime probes...");

    this.isMonitoring = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  private setupMutationObserver(): void {
    if (!canUseDOM) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.probeElement(node as Element);
            }
          });
        } else if (mutation.type === "attributes") {
          if (
            mutation.attributeName === "class" ||
            mutation.attributeName === "style"
          ) {
            this.probeElement(mutation.target as Element);
          }
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  private setupPerformanceObserver(): void {
    if (!canUseDOM) return;

    if ("PerformanceObserver" in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (
              entry.name.includes("glass") ||
              entry.name.includes("backdrop")
            ) {
              console.log("🏃‍♂️ Glass performance entry:", entry);
            }
          });
        });

        this.performanceObserver.observe({
          entryTypes: ["measure", "paint", "layout-shift"],
        });
      } catch (error) {
        console.warn("⚠️ Performance observer setup failed:", error);
      }
    }
  }

  private schedulePeriodicProbes(): void {
    // Run comprehensive probes every 10 seconds
    setInterval(() => {
      if (this.isMonitoring) {
        this.runComprehensiveProbe();
      }
    }, 10000);
  }

  private scanExistingElements(): void {
    if (!canUseDOM) return;

    const glassElements = document.querySelectorAll('[class*="glass-"]');
    glassElements.forEach((element) => {
      this.probeElement(element);
    });
  }

  private probeElement(element: Element): void {
    if (!this.isGlassElement(element)) return;

    const result = this.analyzeElement(element);
    this.probeResults.push(result);

    // Keep only last 100 results to prevent memory issues
    if (this.probeResults.length > 100) {
      this.probeResults = this.probeResults.slice(-100);
    }

    // Report critical issues immediately
    if (result.compliance.accessibilityScore < 0.7) {
      console.warn("⚠️ Glass accessibility issue detected:", result);
    }

    if (!result.performance.backdropSupported) {
      console.warn("⚠️ Backdrop filter not supported, glass effects disabled");
    }
  }

  private isGlassElement(element: Element): boolean {
    const classes = element.className || "";
    return (
      classes.includes("glass-") ||
      element.getAttribute("data-glass") !== null ||
      this.hasGlassStyles(element)
    );
  }

  private hasGlassStyles(element: Element): boolean {
    const computedStyle = window.getComputedStyle(element);
    return (
      computedStyle.backdropFilter !== "none" ||
      computedStyle.backdropFilter !== "none"
    );
  }

  private analyzeElement(element: Element): GlassProbeResult {
    const startTime = performance.now();

    const glassConfig = this.extractGlassConfiguration(element);
    const performanceData = this.analyzePerformance(element);
    const complianceData = this.analyzeCompliance(element);
    const usageData = this.analyzeUsage(element);

    const endTime = performance.now();
    performanceData.renderTime = endTime - startTime;

    return {
      timestamp: Date.now(),
      elementId: element.id,
      glassConfiguration: glassConfig,
      performance: performanceData,
      compliance: complianceData,
      usage: usageData,
    };
  }

  private extractGlassConfiguration(
    element: Element
  ): GlassProbeResult["glassConfiguration"] {
    const classes = element.className || "";

    // Extract intent from class names like "glass-primary-level2"
    const intentMatch = classes.match(
      /glass-(neutral|primary|secondary|success|warning|danger|info)-/
    );
    const elevationMatch = classes.match(/glass-\w+-(level[1-4])/);
    const tierMatch =
      classes.match(/glass-tier-(high|medium|low)/) ||
      classes.match(/tier-(high|medium|low)/);

    return {
      intent: intentMatch ? intentMatch[1] : "unknown",
      elevation: elevationMatch ? elevationMatch[1] : "unknown",
      tier: tierMatch ? tierMatch[1] : "high", // default to high
    };
  }

  private analyzePerformance(
    element: Element
  ): GlassProbeResult["performance"] {
    const computedStyle = window.getComputedStyle(element);

    const backdropSupported = this.testBackdropSupport();
    const gpuAccelerated = this.testGPUAcceleration(computedStyle);

    // Estimate memory usage (rough approximation)
    const memoryUsage = this.estimateMemoryUsage(element);

    return {
      backdropSupported,
      gpuAccelerated,
      memoryUsage,
    };
  }

  private analyzeCompliance(element: Element): GlassProbeResult["compliance"] {
    const computedStyle = window.getComputedStyle(element);

    const contrastRatio = this.calculateContrastRatio(element);
    const minVisibility = this.checkMinimumVisibility(computedStyle);
    const accessibilityScore = this.calculateAccessibilityScore(element);

    return {
      wcagContrast: contrastRatio,
      minVisibility,
      accessibilityScore,
    };
  }

  private analyzeUsage(element: Element): GlassProbeResult["usage"] {
    const classes = element.className || "";
    const inlineStyles = element.getAttribute("style") || "";
    const warnings: string[] = [];

    // Determine which API was used
    let apiUsed: GlassProbeResult["usage"]["apiUsed"] = "unknown";

    if (classes.match(/glass-\w+-level[1-4]/)) {
      apiUsed = "css-classes"; // Using generated CSS classes
    } else if (
      inlineStyles.includes("backdrop") ||
      classes.includes("createGlassStyle")
    ) {
      apiUsed = "createGlassStyle"; // Using unified API
    } else if (
      classes.includes("glassSurface") ||
      classes.includes("glassBorder")
    ) {
      apiUsed = "legacy";
      warnings.push(
        "Using deprecated glass API - migrate to createGlassStyle()"
      );
    }

    // Check for deprecated patterns
    if (inlineStyles.includes("backdrop-filter")) {
      warnings.push(
        "Inline backdrop-filter detected - should use unified token system"
      );
    }

    if (inlineStyles.match(/rgba\(\s*255,\s*255,\s*255,\s*0\.[0-9]/)) {
      warnings.push("Hardcoded glass background - should use token system");
    }

    return {
      apiUsed,
      deprecationWarnings: warnings,
    };
  }

  private testBackdropSupport(): boolean {
    const testEl = document.createElement("div");
    testEl.style.backdropFilter = "blur(1px)";
    return testEl.style.backdropFilter !== "";
  }

  private testGPUAcceleration(computedStyle: CSSStyleDeclaration): boolean {
    return (
      computedStyle.transform !== "none" ||
      computedStyle.willChange.includes("transform")
    );
  }

  private estimateMemoryUsage(element: Element): number {
    // Rough estimation based on element complexity
    const rect = element.getBoundingClientRect();
    const area = rect.width * rect.height;
    const complexity =
      (element.children.length + 1) * (element.className.split(" ").length + 1);

    return Math.round((area * complexity) / 1000); // KB estimate
  }

  private calculateContrastRatio(element: Element): number {
    try {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;

      // Simplified contrast calculation
      const bgLuminance = this.getColorLuminance(backgroundColor);
      const textLuminance = this.getColorLuminance(color);

      const lighter = Math.max(bgLuminance, textLuminance);
      const darker = Math.min(bgLuminance, textLuminance);

      return (lighter + 0.05) / (darker + 0.05);
    } catch {
      return 1; // Fallback if calculation fails
    }
  }

  private getColorLuminance(color: string): number {
    // Simplified luminance calculation
    const rgb = this.parseColor(color);
    if (!rgb) return 1;

    const [r, g, b] = rgb.map((c: any) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private parseColor(color: string): number[] | null {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match
      ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
      : null;
  }

  private checkMinimumVisibility(computedStyle: CSSStyleDeclaration): boolean {
    const opacity = parseFloat(computedStyle.opacity);
    const backgroundAlpha = this.extractAlphaFromBackground(
      computedStyle.backgroundColor
    );

    return opacity >= 0.05 && backgroundAlpha >= 0.05;
  }

  private extractAlphaFromBackground(backgroundColor: string): number {
    const match = backgroundColor.match(
      /rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/
    );
    return match ? parseFloat(match[1]) : 1;
  }

  private calculateAccessibilityScore(element: Element): number {
    let score = 1.0;

    const contrastRatio = this.calculateContrastRatio(element);
    if (contrastRatio < 4.5) score -= 0.3; // WCAG AA failure
    if (contrastRatio < 3.0) score -= 0.3; // Severe contrast issue

    const computedStyle = window.getComputedStyle(element);
    if (!this.checkMinimumVisibility(computedStyle)) score -= 0.2;

    if (!element.getAttribute("aria-label") && !element.textContent) {
      score -= 0.1; // Missing accessibility info
    }

    return Math.max(0, score);
  }

  private runComprehensiveProbe(): void {
    const glassElements = document.querySelectorAll('[class*="glass-"]');
    const summary = {
      timestamp: Date.now(),
      totalElements: glassElements.length,
      compliance: {
        passed: 0,
        warning: 0,
        failed: 0,
      },
      performance: {
        backdropSupported: this.testBackdropSupport(),
        averageRenderTime: 0,
        memoryUsage: 0,
      },
      usage: {
        unified: 0,
        legacy: 0,
        unknown: 0,
      },
      deprecationWarnings: [] as string[],
    };

    let totalRenderTime = 0;
    let totalMemory = 0;

    this.probeResults.slice(-glassElements.length).forEach((result: any) => {
      // Compliance scoring
      if (result.compliance.accessibilityScore >= 0.8)
        summary.compliance.passed++;
      else if (result.compliance.accessibilityScore >= 0.6)
        summary.compliance.warning++;
      else summary.compliance.failed++;

      // Performance aggregation
      if (result.performance.renderTime)
        totalRenderTime += result.performance.renderTime;
      if (result.performance.memoryUsage)
        totalMemory += result.performance.memoryUsage;

      // Usage patterns
      if (
        result.usage.apiUsed === "createGlassStyle" ||
        result.usage.apiUsed === "css-classes"
      ) {
        summary.usage.unified++;
      } else if (result.usage.apiUsed === "legacy") {
        summary.usage.legacy++;
      } else {
        summary.usage.unknown++;
      }

      // Collect warnings
      summary.deprecationWarnings.push(...result.usage.deprecationWarnings);
    });

    summary.performance.averageRenderTime =
      totalRenderTime / glassElements.length;
    summary.performance.memoryUsage = totalMemory;

    // Remove duplicate warnings
    summary.deprecationWarnings = [...new Set(summary.deprecationWarnings)];

    console.log("📊 AuraGlass Comprehensive Probe Summary:", summary);

    // Store for potential reporting
    (window as any).__auraglassProbeData = {
      latestSummary: summary,
      allResults: this.probeResults,
    };
  }

  // Public API for accessing probe data
  getProbeResults(): GlassProbeResult[] {
    return [...this.probeResults];
  }

  getLatestSummary(): any {
    return (window as any).__auraglassProbeData?.latestSummary;
  }

  // Force a probe of specific element
  probeElementById(elementId: string): GlassProbeResult | null {
    const element = document.getElementById(elementId);
    if (!element) return null;

    return this.analyzeElement(element);
  }
}

// Auto-start monitoring in development mode
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const probes = GlassStyleProbes.getInstance();

  // Start monitoring after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      probes.startMonitoring();
    });
  } else {
    probes.startMonitoring();
  }

  // Expose to global scope for debugging
  (window as any).__auraglassProbes = probes;
}

export default GlassStyleProbes;
