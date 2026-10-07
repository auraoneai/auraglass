/**
 * AuraGlass Adaptive AI-Powered UI System
 * Machine learning-driven UI optimization and personalization
 */

import { useState, useEffect } from "react";

interface UserBehavior {
  clicks: {
    element: string;
    timestamp: number;
    position: { x: number; y: number };
  }[];
  hovers: { element: string; duration: number; timestamp: number }[];
  scrollPatterns: { depth: number; speed: number; timestamp: number }[];
  preferences: Map<string, unknown>;
  interactionHeatmap: number[][];
  sessionDuration: number;
  deviceType: string;
  timezone: string;
}

interface AdaptiveConfig {
  glassIntensity: number; // 0-1
  animationSpeed: number; // 0-2
  colorScheme: "light" | "dark" | "auto";
  layoutDensity: "compact" | "comfortable" | "spacious";
  focusMode: boolean;
  reducedMotion: boolean;
  contrastLevel: "normal" | "high" | "highest";
  fontSize: number; // 0.8-1.5
  hapticStrength: number; // 0-1
  soundEnabled: boolean;
}

interface Prediction {
  nextAction: string;
  confidence: number;
  suggestions: string[];
  optimizations: AdaptiveConfig;
}

interface InteractionHotspot {
  x: number;
  y: number;
  intensity: number;
}

interface AdaptivePreferences extends Record<string, unknown> {
  prefersReducedMotion: boolean;
  interactionStyle: "active" | "passive";
  timeOfDay: "night" | "morning" | "afternoon" | "evening";
}

interface BehaviorAnalysis {
  clickVelocity: number;
  avgScrollSpeed: number;
  hotspots: InteractionHotspot[];
  preferences: AdaptivePreferences;
  sessionDuration: number;
  deviceType: string;
}

type AdaptiveNumericConfigKey =
  | "glassIntensity"
  | "animationSpeed"
  | "fontSize"
  | "hapticStrength";

export class AdaptiveAIEngine {
  private static instance: AdaptiveAIEngine;
  private userBehavior: UserBehavior;
  private adaptiveConfig: AdaptiveConfig;
  private modelWeights: Map<string, number>;
  private learningRate: number = 0.01;
  private sessionStartTime: number;
  private interactionHistory: unknown[] = [];

  private constructor() {
    this.userBehavior = this.initUserBehavior();
    this.adaptiveConfig = this.getDefaultConfig();
    this.modelWeights = new Map();
    this.sessionStartTime = Date.now();
    this.initializeTracking();
  }

  static getInstance(): AdaptiveAIEngine {
    if (!AdaptiveAIEngine.instance) {
      AdaptiveAIEngine.instance = new AdaptiveAIEngine();
    }
    return AdaptiveAIEngine.instance;
  }

  /**
   * Initialize user behavior tracking
   */
  private initUserBehavior(): UserBehavior {
    return {
      clicks: [],
      hovers: [],
      scrollPatterns: [],
      preferences: new Map(),
      interactionHeatmap: Array(10)
        .fill(null)
        .map(() => Array(10).fill(0)),
      sessionDuration: 0,
      deviceType: this.detectDeviceType(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Get default adaptive configuration
   */
  private getDefaultConfig(): AdaptiveConfig {
    return {
      glassIntensity: 0.7,
      animationSpeed: 1,
      colorScheme: "auto",
      layoutDensity: "comfortable",
      focusMode: false,
      reducedMotion: false,
      contrastLevel: "normal",
      fontSize: 1,
      hapticStrength: 0.5,
      soundEnabled: true,
    };
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): string {
    if (typeof window === "undefined") return "unknown";

    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
    if (/tablet|ipad/i.test(userAgent)) return "tablet";
    if (/tv|television|smart-tv/i.test(userAgent)) return "tv";
    return "desktop";
  }

  /**
   * Initialize behavior tracking
   */
  private initializeTracking() {
    if (typeof document === "undefined") return;

    // Track clicks
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      this.userBehavior.clicks.push({
        element: target.tagName + (target.id ? `#${target.id}` : ""),
        timestamp: Date.now(),
        position: { x: e.clientX, y: e.clientY },
      });

      // Update heatmap
      const gridX = Math.floor((e.clientX / window.innerWidth) * 10);
      const gridY = Math.floor((e.clientY / window.innerHeight) * 10);
      if (this.userBehavior.interactionHeatmap[gridY]?.[gridX] !== undefined) {
        this.userBehavior.interactionHeatmap[gridY][gridX]++;
      }

      this.analyzeAndAdapt();
    });

    // Track scroll
    let lastScrollY = 0;
    let lastScrollTime = Date.now();

    document.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const scrollSpeed =
        Math.abs(currentScrollY - lastScrollY) / (currentTime - lastScrollTime);

      this.userBehavior.scrollPatterns.push({
        depth: currentScrollY,
        speed: scrollSpeed,
        timestamp: currentTime,
      });

      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;

      // Adapt based on scroll behavior
      if (this.userBehavior.scrollPatterns.length % 10 === 0) {
        this.analyzeAndAdapt();
      }
    });

    // Track session duration
    setInterval(() => {
      this.userBehavior.sessionDuration = Date.now() - this.sessionStartTime;
    }, 1000);
  }

  /**
   * Analyze user behavior and adapt UI
   */
  private analyzeAndAdapt() {
    // Analyze interaction patterns
    const analysis = this.analyzePatterns();

    // Generate predictions
    const predictions = this.generatePredictions(analysis);

    // Update adaptive configuration
    this.updateConfiguration(predictions);

    // Apply optimizations
    this.applyOptimizations();
  }

  /**
   * Analyze user interaction patterns
   */
  private analyzePatterns(): BehaviorAnalysis {
    const recentClicks = this.userBehavior.clicks.slice(-20);
    const recentScrolls = this.userBehavior.scrollPatterns.slice(-20);

    // Calculate interaction velocity
    const clickVelocity =
      recentClicks.length /
      (Date.now() - (recentClicks[0]?.timestamp || Date.now()));

    // Calculate average scroll speed
    const avgScrollSpeed =
      recentScrolls.reduce((sum, s) => sum + s.speed, 0) /
      (recentScrolls.length || 1);

    // Identify interaction hotspots
    const hotspots = this.identifyHotspots();

    // Detect user preferences
    const preferences = this.detectPreferences();

    return {
      clickVelocity,
      avgScrollSpeed,
      hotspots,
      preferences,
      sessionDuration: this.userBehavior.sessionDuration,
      deviceType: this.userBehavior.deviceType,
    };
  }

  /**
   * Identify interaction hotspots
   */
  private identifyHotspots(): InteractionHotspot[] {
    const hotspots: InteractionHotspot[] = [];

    this.userBehavior.interactionHeatmap.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 5) {
          hotspots.push({
            x: (x / 10) * 100, // Convert to percentage
            y: (y / 10) * 100,
            intensity: value,
          });
        }
      });
    });

    return hotspots;
  }

  /**
   * Detect user preferences from behavior
   */
  private detectPreferences(): AdaptivePreferences {
    const avgScrollSpeed =
      this.userBehavior.scrollPatterns.reduce((sum, s) => sum + s.speed, 0) /
      (this.userBehavior.scrollPatterns.length || 1);
    const hour = new Date().getHours();

    const preferences: AdaptivePreferences = {
      prefersReducedMotion: avgScrollSpeed < 0.5,
      interactionStyle:
        this.userBehavior.clicks.length > 50 ? "active" : "passive",
      timeOfDay:
        hour < 6
          ? "night"
          : hour < 12
            ? "morning"
            : hour < 18
              ? "afternoon"
              : "evening",
    };

    return preferences;
  }

  /**
   * Generate AI predictions
   */
  private generatePredictions(analysis: BehaviorAnalysis): Prediction {
    // Simple neural network-like prediction
    const features = [
      analysis.clickVelocity,
      analysis.avgScrollSpeed,
      analysis.sessionDuration / 60000, // Convert to minutes
      analysis.deviceType === "mobile" ? 1 : 0,
      analysis.preferences.prefersReducedMotion ? 1 : 0,
    ];

    // Calculate weighted prediction
    let prediction = 0;
    features.forEach((feature, i) => {
      const weight = this.modelWeights.get(`w${i}`) || Math.random();
      prediction += feature * weight;
    });

    // Sigmoid activation
    const confidence = 1 / (1 + Math.exp(-prediction));

    // Generate suggestions based on patterns
    const suggestions = this.generateSuggestions(analysis);

    // Generate optimized configuration
    const optimizations = this.generateOptimizations(analysis);

    return {
      nextAction: this.predictNextAction(analysis),
      confidence,
      suggestions,
      optimizations,
    };
  }

  /**
   * Predict next user action
   */
  private predictNextAction(analysis: BehaviorAnalysis): string {
    // Markov chain-like prediction based on recent actions
    const recentActions = this.userBehavior.clicks
      .slice(-5)
      .map((c) => c.element);

    if (recentActions.length === 0) return "explore";

    // Find most common pattern
    const patterns = new Map<string, number>();
    for (let i = 0; i < recentActions.length - 1; i++) {
      const pattern = `${recentActions[i]}->${recentActions[i + 1]}`;
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    }

    // Return most likely next action
    const lastAction = recentActions[recentActions.length - 1];
    let maxCount = 0;
    let predictedAction = "unknown";

    patterns.forEach((count, pattern) => {
      if (pattern.startsWith(lastAction) && count > maxCount) {
        maxCount = count;
        predictedAction = pattern.split("->")[1];
      }
    });

    return predictedAction;
  }

  /**
   * Generate UI suggestions
   */
  private generateSuggestions(analysis: BehaviorAnalysis): string[] {
    const suggestions: string[] = [];

    if (analysis.avgScrollSpeed > 2) {
      suggestions.push("Enable quick navigation shortcuts");
    }

    if (analysis.preferences.prefersReducedMotion) {
      suggestions.push("Reduce animation complexity");
    }

    if (analysis.deviceType === "mobile") {
      suggestions.push("Optimize for touch interactions");
    }

    if (analysis.sessionDuration > 300000) {
      // 5 minutes
      suggestions.push("Enable focus mode for better concentration");
    }

    if (analysis.preferences.timeOfDay === "night") {
      suggestions.push("Switch to dark mode for eye comfort");
    }

    return suggestions;
  }

  /**
   * Generate optimized configuration
   */
  private generateOptimizations(analysis: BehaviorAnalysis): AdaptiveConfig {
    const config = { ...this.adaptiveConfig };

    // Adjust glass intensity based on device and time
    if (analysis.deviceType === "mobile") {
      config.glassIntensity = 0.5; // Less intensive for mobile
    }

    // Adjust animation speed
    if (analysis.preferences.prefersReducedMotion) {
      config.animationSpeed = 0.5;
      config.reducedMotion = true;
    }

    // Adjust color scheme
    if (analysis.preferences.timeOfDay === "night") {
      config.colorScheme = "dark";
    }

    // Adjust layout density
    if (analysis.clickVelocity > 0.1) {
      config.layoutDensity = "compact"; // More content for active users
    }

    // Adjust contrast for long sessions
    if (analysis.sessionDuration > 600000) {
      // 10 minutes
      config.contrastLevel = "high";
    }

    return config;
  }

  /**
   * Update configuration with predictions
   */
  private updateConfiguration(predictions: Prediction) {
    // Gradually update configuration using exponential moving average
    const nextConfig: AdaptiveConfig = { ...this.adaptiveConfig };
    const mutableConfig = nextConfig as Record<
      keyof AdaptiveConfig,
      AdaptiveConfig[keyof AdaptiveConfig]
    >;
    const numericKeys: AdaptiveNumericConfigKey[] = [
      "glassIntensity",
      "animationSpeed",
      "fontSize",
      "hapticStrength",
    ];

    numericKeys.forEach((key) => {
      const currentValue = this.adaptiveConfig[key];
      const predictedValue = predictions.optimizations[key];
      mutableConfig[key] = currentValue * 0.9 + predictedValue * 0.1;
    });

    (
      Object.keys(predictions.optimizations) as Array<keyof AdaptiveConfig>
    ).forEach((key) => {
      if (numericKeys.includes(key as AdaptiveNumericConfigKey)) return;
      mutableConfig[key] = predictions.optimizations[key];
    });

    this.adaptiveConfig = nextConfig;
  }

  /**
   * Apply optimizations to the UI
   */
  private applyOptimizations() {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // Apply CSS variables
    root.style.setProperty(
      "--glass-ai-intensity",
      String(this.adaptiveConfig.glassIntensity)
    );
    root.style.setProperty(
      "--glass-ai-animation-speed",
      String(this.adaptiveConfig.animationSpeed)
    );
    root.style.setProperty(
      "--glass-ai-font-size",
      String(this.adaptiveConfig.fontSize)
    );

    // Apply data attributes
    root.setAttribute("data-ai-color-scheme", this.adaptiveConfig.colorScheme);
    root.setAttribute(
      "data-ai-layout-density",
      this.adaptiveConfig.layoutDensity
    );
    root.setAttribute("data-ai-contrast", this.adaptiveConfig.contrastLevel);
    root.setAttribute(
      "data-ai-reduced-motion",
      String(this.adaptiveConfig.reducedMotion)
    );
    root.setAttribute(
      "data-ai-focus-mode",
      String(this.adaptiveConfig.focusMode)
    );
  }

  /**
   * Get current adaptive configuration
   */
  getConfiguration(): AdaptiveConfig {
    return { ...this.adaptiveConfig };
  }

  /**
   * Get behavior insights
   */
  getInsights() {
    return {
      totalInteractions: this.userBehavior.clicks.length,
      sessionDuration: this.userBehavior.sessionDuration,
      averageScrollSpeed:
        this.userBehavior.scrollPatterns.reduce((sum, s) => sum + s.speed, 0) /
        (this.userBehavior.scrollPatterns.length || 1),
      hotspots: this.identifyHotspots(),
      preferences: this.detectPreferences(),
      adaptiveConfig: this.adaptiveConfig,
    };
  }

  /**
   * Reset learning
   */
  reset() {
    this.userBehavior = this.initUserBehavior();
    this.adaptiveConfig = this.getDefaultConfig();
    this.modelWeights.clear();
    this.interactionHistory = [];
    this.sessionStartTime = Date.now();
  }

  /**
   * Export learning data
   */
  exportData() {
    return {
      userBehavior: this.userBehavior,
      adaptiveConfig: this.adaptiveConfig,
      modelWeights: Array.from(this.modelWeights.entries()),
      interactionHistory: this.interactionHistory,
    };
  }

  /**
   * Import learning data
   */
  importData(data: ReturnType<typeof this.exportData>) {
    this.userBehavior = data.userBehavior;
    this.adaptiveConfig = data.adaptiveConfig;
    this.modelWeights = new Map(data.modelWeights);
    this.interactionHistory = data.interactionHistory;
    this.applyOptimizations();
  }
}

// Export singleton
export const adaptiveAI = AdaptiveAIEngine.getInstance();

// React hook for adaptive AI
export function useAdaptiveAI() {
  const [config, setConfig] = useState(adaptiveAI.getConfiguration());
  const [insights, setInsights] = useState(adaptiveAI.getInsights());

  useEffect(() => {
    const interval = setInterval(() => {
      setConfig(adaptiveAI.getConfiguration());
      setInsights(adaptiveAI.getInsights());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { config, insights, ai: adaptiveAI };
}
