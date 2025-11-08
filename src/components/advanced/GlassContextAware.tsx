'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Context-Aware Glass Intensity
 * Dynamic glass effects based on environment and usage patterns
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

interface EnvironmentContext {
  lightLevel: number; // 0-1 (dark to bright)
  colorTemperature: number; // Kelvin
  ambientNoise: number; // 0-1
  batteryLevel: number; // 0-1
  networkSpeed: number; // Mbps
  cpuUsage: number; // 0-1
  memoryUsage: number; // 0-1
  time: {
    hour: number;
    isWorkingHours: boolean;
    timeZone: string;
  };
  location: {
    type: "indoor" | "outdoor" | "unknown";
    weather?: string;
  };
  device: {
    type: "mobile" | "tablet" | "desktop" | "tv";
    orientation: "portrait" | "landscape";
    pixelRatio: number;
    refreshRate: number;
  };
}

interface UsageContext {
  focusMode: boolean;
  taskType: "reading" | "writing" | "media" | "gaming" | "work" | "casual";
  sessionDuration: number; // minutes
  interactionIntensity: number; // 0-1
  stressLevel: number; // 0-1 (derived from usage patterns)
  productivity: number; // 0-1
}

interface GlassContextAwareProps {
  children: React.ReactNode;
  className?: string;
  adaptationSpeed?: number; // 0-1, how quickly to adapt
  sensitivity?: number; // 0-1, sensitivity to context changes
  override?: Partial<{
    intensity: number;
    blur: number;
    opacity: number;
    contrast: number;
    saturation: number;
  }>;
  onContextChange?: (context: EnvironmentContext & UsageContext) => void;
}

export function GlassContextAware({
  children,
  className,
  adaptationSpeed = 0.5,
  sensitivity = 0.7,
  override,
  onContextChange,
}: GlassContextAwareProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [environmentContext, setEnvironmentContext] =
    useState<EnvironmentContext>({
      lightLevel: 0.5,
      colorTemperature: 6500,
      ambientNoise: 0.3,
      batteryLevel: 1,
      networkSpeed: 10,
      cpuUsage: 0.3,
      memoryUsage: 0.4,
      time: {
        hour: new Date().getHours(),
        isWorkingHours: isWorkingTime(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      location: { type: "unknown" },
      device: {
        type: detectDeviceType(),
        orientation:
          window.innerHeight > window.innerWidth ? "portrait" : "landscape",
        pixelRatio: window.devicePixelRatio || 1,
        refreshRate: 60,
      },
    });

  const [usageContext, setUsageContext] = useState<UsageContext>({
    focusMode: false,
    taskType: "casual",
    sessionDuration: 0,
    interactionIntensity: 0.5,
    stressLevel: 0.3,
    productivity: 0.7,
  });

  // Motion values for smooth transitions
  const glassIntensity = useMotionValue(0.7);
  const glassBlur = useMotionValue(16);
  const glassOpacity = useMotionValue(0.1);
  const glassContrast = useMotionValue(1);
  const glassSaturation = useMotionValue(1);

  // Smooth springs
  const smoothIntensity = useSpring(glassIntensity, {
    stiffness: 100 * adaptationSpeed,
    damping: 20,
  });
  const smoothBlur = useSpring(glassBlur, {
    stiffness: 100 * adaptationSpeed,
    damping: 20,
  });
  const smoothOpacity = useSpring(glassOpacity, {
    stiffness: 100 * adaptationSpeed,
    damping: 20,
  });
  const smoothContrast = useSpring(glassContrast, {
    stiffness: 100 * adaptationSpeed,
    damping: 20,
  });
  const smoothSaturation = useSpring(glassSaturation, {
    stiffness: 100 * adaptationSpeed,
    damping: 20,
  });

  // Detect device type
  function detectDeviceType(): "mobile" | "tablet" | "desktop" | "tv" {
    if (typeof window === "undefined") return "desktop";
    const ua = navigator.userAgent;
    if (/mobile|android|iphone/i.test(ua)) return "mobile";
    if (/tablet|ipad/i.test(ua)) return "tablet";
    if (/tv|television/i.test(ua)) return "tv";
    return "desktop";
  }

  // Check if current time is working hours
  function isWorkingTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 17;
  }

  // Monitor environment context
  useEffect(() => {
    const updateEnvironmentContext = () => {
      const now = new Date();

      // Update time context
      const timeContext = {
        hour: now.getHours(),
        isWorkingHours: isWorkingTime(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // Update device context
      const deviceContext = {
        ...environmentContext.device,
        orientation:
          window.innerHeight > window.innerWidth
            ? ("portrait" as const)
            : ("landscape" as const),
      };

      // Estimate light level based on time of day
      const lightLevel = calculateLightLevel(timeContext.hour);

      // Get battery info if available
      const getBatteryLevel = async () => {
        if ("getBattery" in navigator) {
          try {
            const battery = await (navigator as any).getBattery();
            return battery.level;
          } catch {}
        }
        return 1;
      };

      // Get network info if available
      const getNetworkSpeed = () => {
        if ("connection" in navigator) {
          const connection = (navigator as any).connection;
          return connection.downlink || 10;
        }
        return 10;
      };

      getBatteryLevel().then((batteryLevel) => {
        setEnvironmentContext((prev: any) => ({
          ...prev,
          lightLevel,
          batteryLevel,
          networkSpeed: getNetworkSpeed(),
          time: timeContext,
          device: deviceContext,
          colorTemperature: calculateColorTemperature(timeContext.hour),
        }));
      });
    };

    updateEnvironmentContext();
    const interval = setInterval(updateEnvironmentContext, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate light level based on time
  function calculateLightLevel(hour: number): number {
    // Simulate natural light cycle
    if (hour >= 6 && hour <= 18) {
      // Daytime: peak brightness at noon
      const dayProgress = (hour - 6) / 12;
      return 0.3 + 0.7 * Math.sin(dayProgress * Math.PI);
    } else {
      // Nighttime: minimal light
      return 0.1;
    }
  }

  // Calculate color temperature based on time
  function calculateColorTemperature(hour: number): number {
    // Warmer at night, cooler during day
    if (hour >= 6 && hour <= 18) {
      return 5500 + 1000 * Math.sin(((hour - 6) / 12) * Math.PI);
    } else {
      return 3000; // Warm light at night
    }
  }

  // Monitor usage patterns
  useEffect(() => {
    let interactionCount = 0;
    let lastInteraction = Date.now();
    const sessionStart = Date.now();

    const trackInteraction = () => {
      interactionCount++;
      lastInteraction = Date.now();

      // Calculate interaction intensity
      const intensity = Math.min(interactionCount / 100, 1);

      // Calculate session duration
      const sessionDuration = (Date.now() - sessionStart) / (1000 * 60);

      // Estimate stress level based on interaction frequency
      const timeSinceLastInteraction = Date.now() - lastInteraction;
      const stressLevel = Math.max(0, 1 - timeSinceLastInteraction / 30000); // High stress if rapid interactions

      // Detect task type based on interaction patterns
      const taskType = detectTaskType(interactionCount, sessionDuration);

      setUsageContext((prev: any) => ({
        ...prev,
        interactionIntensity: intensity,
        sessionDuration,
        stressLevel,
        taskType,
      }));
    };

    // Track various interaction events
    const events = ["click", "keydown", "scroll", "mousemove", "touchstart"];
    events.forEach((event: any) => {
      document.addEventListener(event, trackInteraction);
    });

    return () => {
      events.forEach((event: any) => {
        document.removeEventListener(event, trackInteraction);
      });
    };
  }, []);

  // Detect task type based on patterns
  function detectTaskType(
    interactions: number,
    duration: number
  ): UsageContext["taskType"] {
    const interactionsPerMinute = interactions / Math.max(duration, 1);

    if (interactionsPerMinute > 50) return "gaming";
    if (interactionsPerMinute > 30) return "work";
    if (interactionsPerMinute > 15) return "writing";
    if (interactionsPerMinute > 5) return "reading";
    if (duration > 30) return "media";
    return "casual";
  }

  // Adaptive glass calculations
  const calculateGlassProperties = useCallback(() => {
    const context = { ...environmentContext, ...usageContext };

    // Base calculations
    let intensity = 0.7;
    let blur = 16;
    let opacity = 0.1;
    let contrast = 1;
    let saturation = 1;

    // Adapt to light level
    intensity *= 0.5 + 0.5 * (1 - context.lightLevel); // More intense in darker environments
    opacity += 0.1 * (1 - context.lightLevel);

    // Adapt to time of day
    if (context.time.hour < 6 || context.time.hour > 20) {
      // Night mode: warmer, less intense
      intensity *= 0.7;
      saturation *= 0.8;
      contrast *= 0.9;
    }

    // Adapt to battery level
    if (context.batteryLevel < 0.2) {
      // Low battery: reduce effects
      intensity *= 0.5;
      blur *= 0.7;
    }

    // Adapt to device performance
    const performanceScore =
      1 - (context.cpuUsage * 0.5 + context.memoryUsage * 0.5);
    intensity *= performanceScore;
    blur *= performanceScore;

    // Adapt to task type
    switch (context.taskType) {
      case "reading":
        intensity *= 0.6; // Less distraction
        opacity *= 0.8;
        break;
      case "writing":
        intensity *= 0.7;
        contrast *= 1.1; // Better text contrast
        break;
      case "work":
        if (context.focusMode) {
          intensity *= 0.5; // Minimal distraction
          opacity *= 0.7;
        }
        break;
      case "gaming":
        intensity *= 1.2; // More immersive
        saturation *= 1.1;
        break;
      case "media":
        intensity *= 1.1;
        saturation *= 1.05;
        break;
    }

    // Adapt to stress level
    intensity *= 1 - context.stressLevel * 0.3; // Reduce intensity when stressed

    // Apply sensitivity multiplier
    const baseDiff = {
      intensity: intensity - 0.7,
      blur: blur - 16,
      opacity: opacity - 0.1,
      contrast: contrast - 1,
      saturation: saturation - 1,
    };

    intensity = 0.7 + baseDiff.intensity * sensitivity;
    blur = 16 + baseDiff.blur * sensitivity;
    opacity = 0.1 + baseDiff.opacity * sensitivity;
    contrast = 1 + baseDiff.contrast * sensitivity;
    saturation = 1 + baseDiff.saturation * sensitivity;

    // Apply overrides
    if (override) {
      intensity = override.intensity ?? intensity;
      blur = override.blur ?? blur;
      opacity = override.opacity ?? opacity;
      contrast = override.contrast ?? contrast;
      saturation = override.saturation ?? saturation;
    }

    // Update motion values
    glassIntensity.set(Math.max(0, Math.min(1, intensity)));
    glassBlur.set(Math.max(0, Math.min(50, blur)));
    glassOpacity.set(Math.max(0, Math.min(1, opacity)));
    glassContrast.set(Math.max(0.5, Math.min(2, contrast)));
    glassSaturation.set(Math.max(0, Math.min(2, saturation)));

    // Notify listeners
    onContextChange?.(context);
  }, [
    environmentContext,
    usageContext,
    sensitivity,
    override,
    onContextChange,
  ]);

  // Update glass properties when context changes
  useEffect(() => {
    calculateGlassProperties();
  }, [calculateGlassProperties]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative OptimizedGlass intensity={0.2} glassBlur={6}",
        "transform-gpu will-change-transform",
        className
      )}
      style={
        {
          "--glass-adaptive-intensity": smoothIntensity,
          "--glass-adaptive-blur": smoothBlur,
          "--glass-adaptive-opacity": smoothOpacity,
          "--glass-adaptive-contrast": smoothContrast,
          "--glass-adaptive-saturation": smoothSaturation,
          // Use createGlassStyle() instead,
          backgroundColor: `rgba(255, 255, 255, ${smoothOpacity.get()})`,
        } as React.CSSProperties
      }
    >
      {children}

      {/* Context debug overlay (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute glass-top-2 right-2 glass-text-xs glass-surface-primary glass-p-2 glass-radius-sm opacity-50">
          <div>Light: {(environmentContext.lightLevel * 100).toFixed(0)}%</div>
          <div>
            Battery: {(environmentContext.batteryLevel * 100).toFixed(0)}%
          </div>
          <div>Task: {usageContext.taskType}</div>
          <div>Intensity: {smoothIntensity.get().toFixed(2)}</div>
        </div>
      )}
    </motion.div>
  );
}

// Hook for accessing context-aware glass state
export function useGlassContextAware() {
  const [context, setContext] = useState<
    (EnvironmentContext & UsageContext) | null
  >(null);

  return {
    context,
    setContext,
    isAdaptive: context !== null,
  };
}

// Preset configurations
export const contextAwarePresets = {
  office: {
    adaptationSpeed: 0.3,
    sensitivity: 0.8,
  },
  gaming: {
    adaptationSpeed: 0.7,
    sensitivity: 1,
  },
  reading: {
    adaptationSpeed: 0.2,
    sensitivity: 0.5,
  },
  presentation: {
    adaptationSpeed: 0.1,
    sensitivity: 0.3,
    override: { intensity: 0.3, opacity: 0.05 },
  },
  accessibility: {
    adaptationSpeed: 0.1,
    sensitivity: 0.2,
    override: { contrast: 1.5 },
  },
};