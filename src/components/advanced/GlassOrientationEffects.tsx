'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * AuraGlass Device Orientation Effects
 * Glass effects that respond to device orientation and motion
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

interface OrientationData {
  alpha: number; // Z-axis rotation (0-360)
  beta: number; // X-axis rotation (-180 to 180)
  gamma: number; // Y-axis rotation (-90 to 90)
  absolute: boolean;
}

interface MotionData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  } | null;
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  } | null;
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  } | null;
  interval: number;
}

interface GlassOrientationEffectsProps {
  children: React.ReactNode;
  className?: string;
  sensitivity?: number; // 0-1
  smoothing?: number; // 0-1
  effectTypes?: Array<
    "tilt" | "parallax" | "refraction" | "liquid" | "shimmer"
  >;
  gyroscopeEnabled?: boolean;
  accelerometerEnabled?: boolean;
  compassEnabled?: boolean;
  onOrientationChange?: (orientation: OrientationData) => void;
  onMotionChange?: (motion: MotionData) => void;
}

export function GlassOrientationEffects({
  children,
  className,
  sensitivity = 0.7,
  smoothing = 0.8,
  effectTypes = ["tilt", "parallax", "refraction"],
  gyroscopeEnabled = true,
  accelerometerEnabled = true,
  compassEnabled = true,
  onOrientationChange,
  onMotionChange,
}: GlassOrientationEffectsProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    absolute: false,
  });
  const [motionData, setMotionData] = useState<MotionData>({
    acceleration: null,
    accelerationIncludingGravity: null,
    rotationRate: null,
    interval: 0,
  });

  // Motion values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltZ = useMotionValue(0);
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const refractionX = useMotionValue(0);
  const refractionY = useMotionValue(0);
  const shimmerAngle = useMotionValue(0);

  // Smooth springs
  const springConfig = {
    stiffness: 100 * (1 - smoothing),
    damping: 20 * smoothing,
  };
  const smoothTiltX = useSpring(tiltX, springConfig);
  const smoothTiltY = useSpring(tiltY, springConfig);
  const smoothTiltZ = useSpring(tiltZ, springConfig);
  const smoothParallaxX = useSpring(parallaxX, springConfig);
  const smoothParallaxY = useSpring(parallaxY, springConfig);
  const smoothRefractionX = useSpring(refractionX, springConfig);
  const smoothRefractionY = useSpring(refractionY, springConfig);
  const smoothShimmerAngle = useSpring(shimmerAngle, springConfig);

  // Transform ranges
  const perspectiveX = useTransform(smoothTiltY, [-90, 90], [-30, 30]);
  const perspectiveY = useTransform(smoothTiltX, [-180, 180], [-20, 20]);
  const backgroundX = useTransform(smoothParallaxX, [-1, 1], [-50, 50]);
  const backgroundY = useTransform(smoothParallaxY, [-1, 1], [-50, 50]);

  // Check for device orientation support
  useEffect(() => {
    const checkSupport = () => {
      const hasOrientation = "DeviceOrientationEvent" in window;
      const hasMotion = "DeviceMotionEvent" in window;
      setIsSupported(hasOrientation || hasMotion);
    };

    checkSupport();
  }, []);

  // Request permissions for iOS 13+
  const requestPermissions = useCallback(async () => {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const orientationPermission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        const motionPermission = await (
          DeviceMotionEvent as any
        ).requestPermission();

        setPermissionGranted(
          orientationPermission === "granted" || motionPermission === "granted"
        );
      } catch (error) {
        console.warn("Error requesting device orientation permission:", error);
        setPermissionGranted(false);
      }
    } else {
      // Assume permission granted on non-iOS devices
      setPermissionGranted(true);
    }
  }, []);

  // Handle device orientation changes
  const handleOrientationChange = useCallback(
    (event: DeviceOrientationEvent) => {
      if (!gyroscopeEnabled && !compassEnabled) return;

      const orientationData: OrientationData = {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
        absolute: event.absolute || false,
      };

      setOrientation(orientationData);
      onOrientationChange?.(orientationData);

      // Apply effects based on orientation
      if (effectTypes.includes("tilt")) {
        tiltX.set(orientationData.beta * sensitivity);
        tiltY.set(orientationData.gamma * sensitivity);
        tiltZ.set(orientationData.alpha * sensitivity * 0.1);
      }

      if (effectTypes.includes("parallax")) {
        parallaxX.set((orientationData.gamma / 90) * sensitivity);
        parallaxY.set((orientationData.beta / 180) * sensitivity);
      }

      if (effectTypes.includes("refraction")) {
        refractionX.set((orientationData.gamma / 90) * sensitivity * 0.5);
        refractionY.set((orientationData.beta / 180) * sensitivity * 0.5);
      }

      if (effectTypes.includes("shimmer")) {
        shimmerAngle.set(orientationData.alpha);
      }
    },
    [
      gyroscopeEnabled,
      compassEnabled,
      sensitivity,
      effectTypes,
      onOrientationChange,
    ]
  );

  // Handle device motion changes
  const handleMotionChange = useCallback(
    (event: DeviceMotionEvent) => {
      if (!accelerometerEnabled) return;

      const motionData: MotionData = {
        acceleration:
          event.acceleration &&
          event.acceleration.x !== null &&
          event.acceleration.y !== null &&
          event.acceleration.z !== null
            ? {
                x: event.acceleration.x,
                y: event.acceleration.y,
                z: event.acceleration.z,
              }
            : null,
        accelerationIncludingGravity:
          event.accelerationIncludingGravity &&
          event.accelerationIncludingGravity.x !== null &&
          event.accelerationIncludingGravity.y !== null &&
          event.accelerationIncludingGravity.z !== null
            ? {
                x: event.accelerationIncludingGravity.x,
                y: event.accelerationIncludingGravity.y,
                z: event.accelerationIncludingGravity.z,
              }
            : null,
        rotationRate:
          event.rotationRate &&
          event.rotationRate.alpha !== null &&
          event.rotationRate.beta !== null &&
          event.rotationRate.gamma !== null
            ? {
                alpha: event.rotationRate.alpha,
                beta: event.rotationRate.beta,
                gamma: event.rotationRate.gamma,
              }
            : null,
        interval: event.interval,
      };

      setMotionData(motionData);
      onMotionChange?.(motionData);

      // Apply liquid effect based on acceleration
      if (effectTypes.includes("liquid") && motionData.acceleration) {
        const { x, y, z } = motionData.acceleration;
        const intensity = Math.sqrt(x * x + y * y + z * z) / 10; // Normalize

        tiltX.set(tiltX.get() + y * intensity * sensitivity);
        tiltY.set(tiltY.get() + x * intensity * sensitivity);
      }
    },
    [accelerometerEnabled, sensitivity, effectTypes, onMotionChange]
  );

  // Setup event listeners
  useEffect(() => {
    if (!isSupported || !permissionGranted) return;

    if (gyroscopeEnabled || compassEnabled) {
      window.addEventListener("deviceorientation", handleOrientationChange);
    }

    if (accelerometerEnabled) {
      window.addEventListener("devicemotion", handleMotionChange);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientationChange);
      window.removeEventListener("devicemotion", handleMotionChange);
    };
  }, [
    isSupported,
    permissionGranted,
    gyroscopeEnabled,
    compassEnabled,
    accelerometerEnabled,
    handleOrientationChange,
    handleMotionChange,
  ]);

  // Handle orientation change (screen rotation)
  useEffect(() => {
    const handleScreenOrientationChange = () => {
      // Reset motion values on orientation change
      tiltX.set(0);
      tiltY.set(0);
      tiltZ.set(0);
      parallaxX.set(0);
      parallaxY.set(0);
    };

    window.addEventListener("orientationchange", handleScreenOrientationChange);
    window.addEventListener("resize", handleScreenOrientationChange);

    return () => {
      window.removeEventListener(
        "orientationchange",
        handleScreenOrientationChange
      );
      window.removeEventListener("resize", handleScreenOrientationChange);
    };
  }, []);

  // Permission request component
  if (isSupported && !permissionGranted) {
    return (
      <div
        className={cn(
          "relative OptimizedGlass intensity={0.2} glassBlur={6} glass-p-6",
          className
        )}
      >
        <div className='glass-text-center'>
          <h3 className='glass-text-lg glass-font-semibold glass-mb-2'>
            Enable Device Orientation
          </h3>
          <p className='glass-text-secondary glass-mb-4'>
            Allow orientation access for interactive glass effects
          </p>
          <button
            onClick={requestPermissions}
            className="glass-button glass-button-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            Enable Orientation Effects
          </button>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative OptimizedGlass intensity={0.2} glassBlur={6} overflow-hidden",
        "transform-gpu will-change-transform",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Tilt effect layer */}
      {effectTypes.includes("tilt") && (
        <motion.div
          className='glass-absolute glass-inset-0'
          style={{
            rotateX: perspectiveX,
            rotateY: perspectiveY,
            rotateZ: smoothTiltZ,
          }}
        >
          {/* Background parallax layer */}
          {effectTypes.includes("parallax") && (
            <motion.div
              className='glass-absolute glass-inset-0 glass-optimized-glass intensity={0.2} glassBlur={6} glass-opacity-30'
              style={{
                x: backgroundX,
                y: backgroundY,
                scale: 1.1,
              }}
            />
          )}

          {/* Refraction overlay */}
          {effectTypes.includes("refraction") && (
            <motion.div className="glass-absolute glass-inset-0 glass-pointer-events-none glass-surface-primary/10" />
          )}

          {/* Shimmer effect */}
          {effectTypes.includes("shimmer") && (
            <motion.div className='glass-absolute glass-inset-0 glass-pointer-events-none glass-opacity-20 glass-surface-primary/10' />
          )}

          {/* Content */}
          <div className='glass-relative glass-z-10'>{children}</div>
        </motion.div>
      )}

      {/* Fallback for non-tilt effects */}
      {!effectTypes.includes("tilt") && (
        <div className='glass-relative'>
          {effectTypes.includes("parallax") && (
            <motion.div
              className="glass-absolute glass-inset-0 glass-opacity-30"
              style={{ x: backgroundX, y: backgroundY, scale: 1.1 }}
            />
          )}

          {effectTypes.includes("refraction") && (
            <motion.div className="glass-absolute glass-inset-0 glass-pointer-events-none glass-surface-primary/10" />
          )}

          {effectTypes.includes("shimmer") && (
            <motion.div className='glass-absolute glass-inset-0 glass-pointer-events-none glass-opacity-20 glass-surface-primary/10' />
          )}

          <div className='glass-relative glass-z-10'>{children}</div>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className='glass-absolute glass-bottom-2 glass-left-2 glass-text-xs glass-surface-primary glass-p-2 glass-radius-sm glass-opacity-50'>
          <div>α: {orientation.alpha.toFixed(1)}°</div>
          <div>β: {orientation.beta.toFixed(1)}°</div>
          <div>γ: {orientation.gamma.toFixed(1)}°</div>
        </div>
      )}
    </motion.div>
  );
}

// Hook for accessing orientation data
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    absolute: false,
  });
  const [motionData, setMotionData] = useState<MotionData>({
    acceleration: null,
    accelerationIncludingGravity: null,
    rotationRate: null,
    interval: 0,
  });
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      "DeviceOrientationEvent" in window || "DeviceMotionEvent" in window
    );
  }, []);

  return {
    orientation,
    motion: motionData,
    isSupported,
    setOrientation,
    setMotion: setMotionData,
  };
}

// Preset configurations
export const orientationPresets = {
  subtle: {
    sensitivity: 0.3,
    smoothing: 0.9,
    effectTypes: ["tilt", "parallax"] as const,
  },
  immersive: {
    sensitivity: 1,
    smoothing: 0.5,
    effectTypes: ["tilt", "parallax", "refraction", "shimmer"] as const,
  },
  gaming: {
    sensitivity: 0.8,
    smoothing: 0.3,
    effectTypes: ["tilt", "parallax", "liquid"] as const,
  },
  reading: {
    sensitivity: 0.2,
    smoothing: 0.95,
    effectTypes: ["shimmer"] as const,
  },
  presentation: {
    sensitivity: 0.1,
    smoothing: 0.98,
    effectTypes: ["tilt"] as const,
  },
};