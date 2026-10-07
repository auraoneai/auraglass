"use client";
/**
 * AuraGlass Progressive Glass Enhancement
 * Adaptive quality system that adjusts glass effects based on device capabilities
 */

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { detectDevice } from "../../utils/deviceCapabilities";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { isBrowser, safeMatchMedia } from "../../utils/env";

interface DeviceCapabilities {
  gpu: {
    renderer: string;
    vendor: string;
    tier: "low" | "mid" | "high" | "unknown";
    webglSupport: boolean;
    webgl2Support: boolean;
  };
  cpu: {
    cores: number;
    estimatedPerformance: "low" | "mid" | "high";
  };
  memory: {
    deviceMemory?: number; // GB
    estimatedTier: "low" | "mid" | "high";
  };
  display: {
    pixelRatio: number;
    resolution: { width: number; height: number };
    colorGamut: "srgb" | "p3" | "rec2020";
    hdr: boolean;
  };
  network: {
    effectiveType: "2g" | "3g" | "4g" | "5g" | "unknown";
    saveData: boolean;
  };
  battery: {
    level: number; // 0-1
    charging: boolean;
  };
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    forcedColors: boolean;
  };
}

interface QualityTier {
  name: string;
  level: "minimal" | "basic" | "standard" | "premium" | "ultra";
  capabilities: {
    backdropFilterEnabled: boolean;
    boxShadow: boolean;
    borderRadius: boolean;
    transforms: boolean;
    animations: boolean;
    particles: boolean;
    webgl: boolean;
    complexGradients: boolean;
    highResolution: boolean;
  };
  limits: {
    maxBlur: number; // px
    maxElements: number;
    animationDuration: number; // multiplier
    particleCount: number;
  };
}

interface GlassProgressiveEnhancementProps {
  children: React.ReactNode;
  className?: string;
  autoDetect?: boolean;
  forcedTier?: QualityTier["level"];
  adaptToNetwork?: boolean;
  adaptToBattery?: boolean;
  respectUserPreferences?: boolean;
  monitorPerformance?: boolean;
  showDebugHud?: boolean;
  onTierChange?: (tier: QualityTier) => void;
  onCapabilitiesDetected?: (capabilities: DeviceCapabilities) => void;
}

// Quality tier definitions
const qualityTiers: Record<QualityTier["level"], QualityTier> = {
  minimal: {
    name: "Minimal Glass",
    level: "minimal",
    capabilities: {
      // Use createGlassStyle() instead,
      backdropFilterEnabled: false,
      boxShadow: true,
      borderRadius: true,
      transforms: false,
      animations: false,
      particles: false,
      webgl: false,
      complexGradients: false,
      highResolution: false,
    },
    limits: {
      maxBlur: 0,
      maxElements: 10,
      animationDuration: 0,
      particleCount: 0,
    },
  },
  basic: {
    name: "Basic Glass",
    level: "basic",
    capabilities: {
      // Use createGlassStyle() instead,
      backdropFilterEnabled: false,
      boxShadow: true,
      borderRadius: true,
      transforms: true,
      animations: false,
      particles: false,
      webgl: false,
      complexGradients: false,
      highResolution: false,
    },
    limits: {
      maxBlur: 8,
      maxElements: 20,
      animationDuration: 0,
      particleCount: 0,
    },
  },
  standard: {
    name: "Standard Glass",
    level: "standard",
    capabilities: {
      // Use createGlassStyle() instead,
      backdropFilterEnabled: true,
      boxShadow: true,
      borderRadius: true,
      transforms: true,
      animations: true,
      particles: false,
      webgl: false,
      complexGradients: true,
      highResolution: false,
    },
    limits: {
      maxBlur: 16,
      maxElements: 50,
      animationDuration: 1,
      particleCount: 0,
    },
  },
  premium: {
    name: "Premium Glass",
    level: "premium",
    capabilities: {
      // Use createGlassStyle() instead,
      backdropFilterEnabled: true,
      boxShadow: true,
      borderRadius: true,
      transforms: true,
      animations: true,
      particles: true,
      webgl: false,
      complexGradients: true,
      highResolution: true,
    },
    limits: {
      maxBlur: 24,
      maxElements: 100,
      animationDuration: 1,
      particleCount: 25,
    },
  },
  ultra: {
    name: "Ultra Glass",
    level: "ultra",
    capabilities: {
      // Use createGlassStyle() instead,
      backdropFilterEnabled: true,
      boxShadow: true,
      borderRadius: true,
      transforms: true,
      animations: true,
      particles: true,
      webgl: true,
      complexGradients: true,
      highResolution: true,
    },
    limits: {
      maxBlur: 32,
      maxElements: 200,
      animationDuration: 1,
      particleCount: 100,
    },
  },
};

// Context for sharing quality settings
const GlassQualityContext = createContext<{
  tier: QualityTier;
  capabilities: DeviceCapabilities | null;
  updateTier: (tier: QualityTier["level"]) => void;
}>({
  tier: qualityTiers.standard,
  capabilities: null,
  updateTier: () => {},
});

export function GlassProgressiveEnhancement({
  children,
  className,
  autoDetect = true,
  forcedTier,
  adaptToNetwork = true,
  adaptToBattery = true,
  respectUserPreferences = true,
  monitorPerformance = true,
  showDebugHud = false,
  onTierChange,
  onCapabilitiesDetected,
}: GlassProgressiveEnhancementProps) {
  const prefersReducedMotion = useReducedMotion();
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(
    null
  );
  const [currentTier, setCurrentTier] = useState<QualityTier>(
    forcedTier ? qualityTiers[forcedTier] : qualityTiers.standard
  );
  const performanceMonitor = useRef<{
    frameCount: number;
    lastTime: number;
    fps: number;
  }>({ frameCount: 0, lastTime: 0, fps: 60 });
  const performanceFrameRef = useRef<number | null>(null);

  // Detect device capabilities
  const detectCapabilities =
    useCallback(async (): Promise<DeviceCapabilities> => {
      const capabilities: DeviceCapabilities = {
        gpu: await detectGPUCapabilities(),
        cpu: detectCPUCapabilities(),
        memory: detectMemoryCapabilities(),
        display: detectDisplayCapabilities(),
        network: detectNetworkCapabilities(),
        battery: await detectBatteryCapabilities(),
        preferences: detectUserPreferences(),
      };

      return capabilities;
    }, []);

  // GPU detection
  async function detectGPUCapabilities() {
    const device = detectDevice();
    // If no WebGL support, avoid creating any context
    if (!isBrowser() || !device.capabilities.webgl) {
      return {
        renderer: "unknown",
        vendor: "unknown",
        tier: "low" as const,
        webglSupport: false,
        webgl2Support: false,
      };
    }

    // Create a minimal WebGL context only to get renderer/vendor info, then release it
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const attrs: WebGLContextAttributes & { powerPreference?: any } = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      desynchronized: true as any,
      failIfMajorPerformanceCaveat: true,
      powerPreference: "low-power",
    };

    const gl =
      (canvas.getContext("webgl", attrs) as WebGLRenderingContext | null) ||
      (canvas.getContext(
        "experimental-webgl",
        attrs
      ) as WebGLRenderingContext | null);

    let renderer = "unknown";
    let vendor = "unknown";
    if (gl) {
      try {
        const debugInfo =
          (gl as any).getExtension &&
          (gl as any).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          renderer =
            (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ||
            "unknown";
          vendor =
            (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) ||
            "unknown";
        }
      } catch {}
      // Explicitly release the context
      try {
        const lose =
          (gl as any).getExtension &&
          (gl as any).getExtension("WEBGL_lose_context");
        lose && lose.loseContext && lose.loseContext();
      } catch {}
    }
    try {
      canvas.width = 0;
      canvas.height = 0;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    } catch {}

    // Simplified GPU tier detection
    let tier: "low" | "mid" | "high" = "mid";
    if (renderer.includes("Intel HD") || renderer.includes("Intel(R) UHD")) {
      tier = "low";
    } else if (
      renderer.includes("RTX") ||
      renderer.includes("RX ") ||
      renderer.includes("Pro")
    ) {
      tier = "high";
    }

    return {
      renderer,
      vendor,
      tier,
      webglSupport: true,
      webgl2Support: device.capabilities.webgl2,
    };
  }

  // CPU detection
  function detectCPUCapabilities() {
    const cores =
      typeof navigator === "undefined" ? 4 : navigator.hardwareConcurrency || 4;

    // Estimate performance based on cores and user agent
    let estimatedPerformance: "low" | "mid" | "high" = "mid";
    if (cores <= 2) {
      estimatedPerformance = "low";
    } else if (cores >= 8) {
      estimatedPerformance = "high";
    }

    return { cores, estimatedPerformance };
  }

  // Memory detection
  function detectMemoryCapabilities() {
    const deviceMemory =
      typeof navigator === "undefined"
        ? undefined
        : (navigator as any).deviceMemory;

    let estimatedTier: "low" | "mid" | "high" = "mid";
    if (deviceMemory) {
      if (deviceMemory <= 2) estimatedTier = "low";
      else if (deviceMemory >= 8) estimatedTier = "high";
    }

    return { deviceMemory, estimatedTier };
  }

  // Display detection
  function detectDisplayCapabilities() {
    if (typeof window === "undefined") {
      return {
        pixelRatio: 1,
        resolution: { width: 1024, height: 768 },
        colorGamut: "srgb" as const,
        hdr: false,
      };
    }

    const pixelRatio = window.devicePixelRatio || 1;
    const resolution = {
      width: window.screen.width,
      height: window.screen.height,
    };

    // Detect color gamut support
    let colorGamut: "srgb" | "p3" | "rec2020" = "srgb";
    if (safeMatchMedia("(color-gamut: p3)")?.matches) {
      colorGamut = "p3";
    }
    if (safeMatchMedia("(color-gamut: rec2020)")?.matches) {
      colorGamut = "rec2020";
    }

    const hdr = safeMatchMedia("(dynamic-range: high)")?.matches ?? false;

    return { pixelRatio, resolution, colorGamut, hdr };
  }

  // Network detection
  function detectNetworkCapabilities() {
    const connection =
      typeof navigator === "undefined"
        ? undefined
        : (navigator as any).connection ||
          (navigator as any).mozConnection ||
          (navigator as any).webkitConnection;

    return {
      effectiveType: connection?.effectiveType || "unknown",
      saveData: connection?.saveData || false,
    };
  }

  // Battery detection
  async function detectBatteryCapabilities() {
    try {
      if (typeof navigator !== "undefined" && "getBattery" in navigator) {
        const battery = await (navigator as any).getBattery();
        return {
          level: battery.level,
          charging: battery.charging,
        };
      }
    } catch (error) {
      // Battery API not supported
    }

    return { level: 1, charging: true };
  }

  // User preferences detection
  function detectUserPreferences() {
    return {
      reducedMotion:
        safeMatchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false,
      highContrast:
        safeMatchMedia("(prefers-contrast: high)")?.matches ?? false,
      forcedColors: safeMatchMedia("(forced-colors: active)")?.matches ?? false,
    };
  }

  // Calculate optimal quality tier
  const calculateOptimalTier = useCallback(
    (caps: DeviceCapabilities): QualityTier["level"] => {
      if (forcedTier) return forcedTier;

      let score = 50; // Base score

      // GPU scoring
      switch (caps.gpu.tier) {
        case "high":
          score += 30;
          break;
        case "mid":
          score += 15;
          break;
        case "low":
          score -= 15;
          break;
      }

      if (caps.gpu.webgl2Support) score += 10;
      if (!caps.gpu.webglSupport) score -= 20;

      // CPU scoring
      switch (caps.cpu.estimatedPerformance) {
        case "high":
          score += 20;
          break;
        case "mid":
          score += 10;
          break;
        case "low":
          score -= 10;
          break;
      }

      // Memory scoring
      switch (caps.memory.estimatedTier) {
        case "high":
          score += 15;
          break;
        case "mid":
          score += 5;
          break;
        case "low":
          score -= 10;
          break;
      }

      // Display scoring
      if (caps.display.pixelRatio > 2) score += 10;
      if (caps.display.hdr) score += 5;

      // Network adaptation
      if (adaptToNetwork) {
        switch (caps.network.effectiveType) {
          case "5g":
            score += 10;
            break;
          case "4g":
            score += 5;
            break;
          case "3g":
            score -= 10;
            break;
          case "2g":
            score -= 20;
            break;
        }

        if (caps.network.saveData) score -= 15;
      }

      // Battery adaptation
      if (
        adaptToBattery &&
        caps.battery.level < 0.2 &&
        !caps.battery.charging
      ) {
        score -= 20;
      }

      // User preferences
      if (respectUserPreferences) {
        if (caps.preferences.reducedMotion) score -= 25;
        if (caps.preferences.forcedColors) score -= 15;
      }

      // Determine tier based on score
      if (score >= 90) return "ultra";
      if (score >= 70) return "premium";
      if (score >= 50) return "standard";
      if (score >= 30) return "basic";
      return "minimal";
    },
    [forcedTier, adaptToNetwork, adaptToBattery, respectUserPreferences]
  );

  // Performance monitoring
  const monitorFrameRate = useCallback(() => {
    if (
      !monitorPerformance ||
      !isBrowser() ||
      typeof requestAnimationFrame !== "function"
    ) {
      return () => undefined;
    }

    let cancelled = false;

    const monitor = () => {
      if (cancelled) return;

      const now = performance.now();
      performanceMonitor.current.frameCount++;

      if (now - performanceMonitor.current.lastTime >= 1000) {
        performanceMonitor.current.fps =
          (performanceMonitor.current.frameCount * 1000) /
          (now - performanceMonitor.current.lastTime);

        // Downgrade tier if performance is poor
        if (
          performanceMonitor.current.fps < 30 &&
          currentTier.level !== "minimal"
        ) {
          const currentIndex = Object.keys(qualityTiers).indexOf(
            currentTier.level
          );
          if (currentIndex > 0) {
            const newTierKey = Object.keys(qualityTiers)[
              currentIndex - 1
            ] as QualityTier["level"];
            setCurrentTier(qualityTiers[newTierKey]);
          }
        }

        performanceMonitor.current.frameCount = 0;
        performanceMonitor.current.lastTime = now;
      }

      performanceFrameRef.current = requestAnimationFrame(monitor);
    };

    performanceFrameRef.current = requestAnimationFrame(monitor);

    return () => {
      cancelled = true;
      if (performanceFrameRef.current !== null) {
        cancelAnimationFrame(performanceFrameRef.current);
        performanceFrameRef.current = null;
      }
    };
  }, [monitorPerformance, currentTier.level]);

  // Initialize capabilities detection
  useEffect(() => {
    if (!isBrowser()) return;
    if (!autoDetect) return;
    let active = true;

    detectCapabilities().then((caps) => {
      if (!active) return;

      setCapabilities(caps);
      onCapabilitiesDetected?.(caps);

      if (!forcedTier) {
        const optimalTier = calculateOptimalTier(caps);
        setCurrentTier(qualityTiers[optimalTier]);
      }
    });

    return () => {
      active = false;
    };
  }, [
    autoDetect,
    forcedTier,
    detectCapabilities,
    calculateOptimalTier,
    onCapabilitiesDetected,
  ]);

  // Start performance monitoring
  useEffect(() => {
    return monitorFrameRate();
  }, [monitorFrameRate]);

  // Notify tier changes
  useEffect(() => {
    onTierChange?.(currentTier);
  }, [currentTier, onTierChange]);

  // Update CSS variables based on tier
  useEffect(() => {
    if (!isBrowser()) return;

    const root = document.documentElement;

    root.style.setProperty(
      "--glass-max-blur",
      `${currentTier.limits.maxBlur}px`
    );
    root.style.setProperty(
      "--glass-animation-duration",
      `${currentTier.limits.animationDuration}s`
    );
    root.style.setProperty(
      "--glass-max-elements",
      String(currentTier.limits.maxElements)
    );
    root.style.setProperty(
      "--glass-particle-count",
      String(currentTier.limits.particleCount)
    );

    // Set capability flags
    Object.entries(currentTier.capabilities).forEach(([key, value]) => {
      root.style.setProperty(
        `--glass-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value ? "1" : "0"
      );
    });

    // Apply tier-specific class
    document.body.className = document.body.className.replace(
      /glass-tier-\w+/g,
      ""
    );
    document.body.classList.add(`glass-tier-${currentTier.level}`);

    return () => {
      document.body.classList.remove(`glass-tier-${currentTier.level}`);
    };
  }, [currentTier]);

  const updateTier = useCallback((tier: QualityTier["level"]) => {
    setCurrentTier(qualityTiers[tier]);
  }, []);

  const contextValue = {
    tier: currentTier,
    capabilities,
    updateTier,
  };

  return (
    <GlassQualityContext.Provider value={contextValue}>
      <div
        className={cn(
          "glass-progressive-enhancement",
          prefersReducedMotion && "glass-reduced-motion",
          className
        )}
      >
        {children}

        {/* Quality indicator */}
        {showDebugHud && (
          <div className="glass-fixed glass-bottom-2 glass-left-2 glass-surface-primary glass-p-2 glass-radius-sm glass-text-xs glass-opacity-50 glass-z-50">
            <div>Quality: {currentTier.name}</div>
            <div>FPS: {Math.round(performanceMonitor.current.fps)}</div>
            {capabilities && <div>GPU: {capabilities.gpu.tier}</div>}
          </div>
        )}
      </div>
    </GlassQualityContext.Provider>
  );
}

// Hook to access quality context
export function useGlassQuality() {
  const context = useContext(GlassQualityContext);
  if (!context) {
    throw new Error(
      "useGlassQuality must be used within GlassProgressiveEnhancement"
    );
  }
  return context;
}

// Enhanced glass component that respects quality settings
export function EnhancedGlass({
  children,
  className,
  blur = 16,
  particles = false,
  animation = true,
  webgl = false,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  particles?: boolean;
  animation?: boolean;
  webgl?: boolean;
  [key: string]: any;
}) {
  const { tier } = useGlassQuality();
  const prefersReducedMotion = useReducedMotion();

  // Adjust properties based on quality tier
  const effectiveBlur = Math.min(blur, tier.limits.maxBlur);
  const enableParticles = particles && tier.capabilities.particles;
  const enableAnimation =
    animation && tier.capabilities.animations && !prefersReducedMotion;
  const enableWebGL = webgl && tier.capabilities.webgl;
  const enableBackdropFilter = tier.capabilities.backdropFilterEnabled;

  return (
    <motion.div
      className={cn(
        "relative",
        enableBackdropFilter && "OptimizedGlass intensity={0.2} glassBlur={6}",
        !enableBackdropFilter && "glass-surface-fallback",
        prefersReducedMotion && "glass-reduced-motion",
        className
      )}
      animate={enableAnimation ? { scale: [1, 1.01, 1] } : undefined}
      transition={
        enableAnimation
          ? {
              duration: tier.limits.animationDuration,
              repeat: Infinity,
            }
          : undefined
      }
      style={{
        ...({
          "--glass-effective-blur": `${effectiveBlur}px`,
        } as React.CSSProperties),
      }}
      {...props}
    >
      {children}

      {/* Conditional enhancements */}
      {enableParticles && (
        <div className="glass-absolute glass-inset-0 glass-pointer-events-none">
          {/* Particle system would go here */}
        </div>
      )}

      {enableWebGL && (
        <canvas className="glass-absolute glass-inset-0 glass-pointer-events-none" />
      )}
    </motion.div>
  );
}

// Export quality tiers for external use
export { qualityTiers };
export type { DeviceCapabilities, QualityTier };
