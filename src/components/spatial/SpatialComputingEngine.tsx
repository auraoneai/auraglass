'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
import { cn } from '@/lib/utils';
 * Spatial Computing Engine
 * Foundation for AR/VR glass components with 3D space awareness,
 * gesture recognition, and mixed reality integration
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Spatial coordinate system
export interface SpatialPosition {
  x: number; // World X coordinate
  y: number; // World Y coordinate
  z: number; // World Z coordinate (depth)
  pitch: number; // Rotation around X axis (degrees)
  yaw: number; // Rotation around Y axis (degrees)
  roll: number; // Rotation around Z axis (degrees)
}

// Spatial bounds and constraints
export interface SpatialBounds {
  min: SpatialPosition;
  max: SpatialPosition;
  shape: "box" | "sphere" | "cylinder" | "plane";
  constraints?: {
    lockX?: boolean;
    lockY?: boolean;
    lockZ?: boolean;
    lockRotation?: boolean;
  };
}

// Gesture recognition types
export type SpatialGesture =
  | "tap"
  | "pinch"
  | "grab"
  | "swipe"
  | "rotate"
  | "scale"
  | "point"
  | "wave"
  | "push"
  | "pull"
  | "circle"
  | "custom";

export interface GestureEvent {
  type: SpatialGesture;
  position: SpatialPosition;
  velocity: SpatialPosition;
  confidence: number;
  duration: number;
  data?: Record<string, any>;
}

// Spatial anchor system for persistent positioning
export interface SpatialAnchor {
  id: string;
  position: SpatialPosition;
  persistent: boolean;
  cloudSync: boolean;
  accuracy: number;
  lastUpdate: number;
}

// Mixed reality environment types
export type MREnvironment =
  | "desktop"
  | "mobile"
  | "vr-headset"
  | "ar-glasses"
  | "ar-phone"
  | "holographic";

export interface SpatialContext {
  environment: MREnvironment;
  capabilities: {
    headTracking: boolean;
    handTracking: boolean;
    eyeTracking: boolean;
    bodyTracking: boolean;
    environmentMapping: boolean;
    occlusion: boolean;
    lighting: boolean;
    physics: boolean;
  };
  displayInfo: {
    fov: number; // Field of view in degrees
    resolution: { width: number; height: number };
    refreshRate: number;
    ipd?: number; // Interpupillary distance for VR
  };
}

interface SpatialComputingEngineProps {
  children: React.ReactNode;
  className?: string;
  position?: Partial<SpatialPosition>;
  bounds?: SpatialBounds;
  enableGestures?: boolean;
  enableAnchoring?: boolean;
  enablePhysics?: boolean;
  enableOcclusion?: boolean;
  gestureTypes?: SpatialGesture[];
  spatialId?: string;
  onGesture?: (gesture: GestureEvent) => void;
  onPositionChange?: (position: SpatialPosition) => void;
  onAnchorUpdate?: (anchor: SpatialAnchor) => void;
}

// Default spatial position
const DEFAULT_POSITION: SpatialPosition = {
  x: 0,
  y: 0,
  z: 0,
  pitch: 0,
  yaw: 0,
  roll: 0,
};

// Spatial context detection
const detectSpatialContext = (): SpatialContext => {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

  // Check for WebXR support
  const hasWebXR = typeof navigator !== "undefined" && "xr" in navigator;
  const isVR = hasWebXR && userAgent.includes("VR");
  const isAR =
    hasWebXR && (userAgent.includes("AR") || userAgent.includes("Mobile"));

  // Basic capability detection
  const capabilities = {
    headTracking: hasWebXR,
    handTracking: hasWebXR && "getInputSources" in (window as any),
    eyeTracking: false, // Requires specific hardware/API
    bodyTracking: false, // Limited availability
    environmentMapping: hasWebXR,
    occlusion: hasWebXR,
    lighting: hasWebXR,
    physics: true, // Software-based physics always available
  };

  let environment: MREnvironment = "desktop";
  if (isVR) environment = "vr-headset";
  else if (isAR && userAgent.includes("Mobile")) environment = "ar-phone";
  else if (isAR) environment = "ar-glasses";
  else if (userAgent.includes("Mobile")) environment = "mobile";

  return {
    environment,
    capabilities,
    displayInfo: {
      fov: environment.includes("vr") ? 110 : 60,
      resolution: {
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080,
      },
      refreshRate: 60, // Default assumption
    },
  };
};

export const SpatialComputingEngine: React.FC<SpatialComputingEngineProps> = ({
  children,
  className = "",
  position = {},
  bounds,
  enableGestures = true,
  enableAnchoring = false,
  enablePhysics = true,
  enableOcclusion = false,
  gestureTypes = ["tap", "pinch", "grab"],
  spatialId,
  onGesture,
  onPositionChange,
  onAnchorUpdate,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const xrSessionRef = useRef<any>(null); // XRSession type not available in current environment
  const [spatialContext, setSpatialContext] = useState<SpatialContext>(
    detectSpatialContext()
  );
  const [currentPosition, setCurrentPosition] = useState<SpatialPosition>({
    ...DEFAULT_POSITION,
    ...position,
  });
  const [spatialAnchor, setSpatialAnchor] = useState<SpatialAnchor | null>(
    null
  );
  const [gestureActive, setGestureActive] = useState<SpatialGesture | null>(
    null
  );

  const controls = useAnimation();

  // Spatial motion values for smooth transformations
  const spatialX = useSpring(currentPosition.x, {
    stiffness: 400,
    damping: 40,
  });
  const spatialY = useSpring(currentPosition.y, {
    stiffness: 400,
    damping: 40,
  });
  const spatialZ = useSpring(currentPosition.z, {
    stiffness: 400,
    damping: 40,
  });
  const spatialPitch = useSpring(currentPosition.pitch, {
    stiffness: 300,
    damping: 35,
  });
  const spatialYaw = useSpring(currentPosition.yaw, {
    stiffness: 300,
    damping: 35,
  });
  const spatialRoll = useSpring(currentPosition.roll, {
    stiffness: 300,
    damping: 35,
  });

  // WebXR session management
  const initializeXRSession = useCallback(async () => {
    if (!spatialContext.capabilities.headTracking) return;

    try {
      if ("xr" in navigator) {
        const xr = (navigator as any).xr as any; // XRSystem type not available in current environment

        // Check for immersive VR support
        const isVRSupported = await xr.isSessionSupported("immersive-vr");
        const isARSupported = await xr.isSessionSupported("immersive-ar");

        if (isVRSupported || isARSupported) {
          const sessionMode = isVRSupported ? "immersive-vr" : "immersive-ar";
          const session = await xr.requestSession(sessionMode, {
            requiredFeatures: ["local"],
            optionalFeatures: ["hand-tracking", "eye-tracking", "anchors"],
          });

          xrSessionRef.current = session;

          // Set up XR frame loop
          const onXRFrame = (time: number, frame: any) => {
            // XRFrame type not available in current environment
            const pose = frame.getViewerPose(
              session.renderState.baseLayer!.framebuffer as any
            );
            if (pose) {
              updateSpatialPosition(pose);
            }

            session.requestAnimationFrame(onXRFrame);
          };

          session.requestAnimationFrame(onXRFrame);
        }
      }
    } catch (error) {
      console.warn("XR session initialization failed:", error);
    }
  }, [spatialContext]);

  // Update spatial position from XR pose or other input
  const updateSpatialPosition = useCallback(
    (pose?: any | Partial<SpatialPosition>) => {
      // XRPose type not available in current environment
      let newPosition: SpatialPosition;

      if (pose && "transform" in pose) {
        // Extract position from XR pose
        const { position: pos, orientation } = pose.transform;
        newPosition = {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          pitch:
            (Math.atan2(
              2 *
                (orientation.w * orientation.x + orientation.y * orientation.z),
              1 -
                2 *
                  (orientation.x * orientation.x +
                    orientation.y * orientation.y)
            ) *
              180) /
            Math.PI,
          yaw:
            (Math.asin(
              2 *
                (orientation.w * orientation.y - orientation.z * orientation.x)
            ) *
              180) /
            Math.PI,
          roll:
            (Math.atan2(
              2 *
                (orientation.w * orientation.z + orientation.x * orientation.y),
              1 -
                2 *
                  (orientation.y * orientation.y +
                    orientation.z * orientation.z)
            ) *
              180) /
            Math.PI,
        };
      } else {
        // Use provided position data
        newPosition = {
          ...currentPosition,
          ...(pose as Partial<SpatialPosition>),
        };
      }

      // Apply bounds constraints
      if (bounds) {
        newPosition.x = Math.max(
          bounds.min.x,
          Math.min(bounds.max.x, newPosition.x)
        );
        newPosition.y = Math.max(
          bounds.min.y,
          Math.min(bounds.max.y, newPosition.y)
        );
        newPosition.z = Math.max(
          bounds.min.z,
          Math.min(bounds.max.z, newPosition.z)
        );

        if (bounds.constraints?.lockX) newPosition.x = currentPosition.x;
        if (bounds.constraints?.lockY) newPosition.y = currentPosition.y;
        if (bounds.constraints?.lockZ) newPosition.z = currentPosition.z;
        if (bounds.constraints?.lockRotation) {
          newPosition.pitch = currentPosition.pitch;
          newPosition.yaw = currentPosition.yaw;
          newPosition.roll = currentPosition.roll;
        }
      }

      setCurrentPosition(newPosition);

      // Update motion values
      spatialX.set(newPosition.x);
      spatialY.set(newPosition.y);
      spatialZ.set(newPosition.z);
      spatialPitch.set(newPosition.pitch);
      spatialYaw.set(newPosition.yaw);
      spatialRoll.set(newPosition.roll);

      onPositionChange?.(newPosition);
    },
    [
      currentPosition,
      bounds,
      spatialX,
      spatialY,
      spatialZ,
      spatialPitch,
      spatialYaw,
      spatialRoll,
      onPositionChange,
    ]
  );

  // Gesture recognition system
  const recognizeGesture = useCallback(
    (event: PointerEvent | TouchEvent | KeyboardEvent): GestureEvent | null => {
      if (!enableGestures) return null;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return null;

      let gestureType: SpatialGesture | null = null;
      let position: SpatialPosition = { ...DEFAULT_POSITION };
      let confidence = 1;

      if (event instanceof PointerEvent) {
        // Basic pointer gesture recognition
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        position = { ...DEFAULT_POSITION, x: x * 100, y: y * 100 };

        if (event.type === "pointerdown") gestureType = "tap";
        else if (event.pressure > 0.5) gestureType = "grab";
      } else if (event instanceof TouchEvent && event.touches.length > 0) {
        // Multi-touch gesture recognition
        const touch = event.touches[0];
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;

        position = { ...DEFAULT_POSITION, x: x * 100, y: y * 100 };

        if (event.touches.length === 1) gestureType = "tap";
        else if (event.touches.length === 2) gestureType = "pinch";

        confidence = Math.min(1, event.touches.length / 2);
      }

      if (gestureType && gestureTypes.includes(gestureType)) {
        const gestureEvent: GestureEvent = {
          type: gestureType,
          position,
          velocity: { ...DEFAULT_POSITION }, // Would calculate from previous positions
          confidence,
          duration: 0, // Would track duration
        };

        return gestureEvent;
      }

      return null;
    },
    [enableGestures, gestureTypes]
  );

  // Handle gesture events
  const handleGestureStart = useCallback(
    (event: PointerEvent | TouchEvent) => {
      const gesture = recognizeGesture(event);
      if (gesture) {
        setGestureActive(gesture.type);
        onGesture?.(gesture);

        // Visual feedback for gesture
        controls.start({
          scale: 1.05,
          transition: { duration: 0.1 },
        });
      }
    },
    [recognizeGesture, onGesture, controls]
  );

  const handleGestureEnd = useCallback(() => {
    if (gestureActive) {
      setGestureActive(null);
      controls.start({
        scale: 1,
        transition: { duration: 0.2 },
      });
    }
  }, [gestureActive, controls]);

  // Spatial anchoring system
  const createSpatialAnchor = useCallback(async () => {
    if (!enableAnchoring || !spatialId) return;

    const anchor: SpatialAnchor = {
      id: spatialId,
      position: currentPosition,
      persistent: true,
      cloudSync: false,
      accuracy: 1.0,
      lastUpdate: Date.now(),
    };

    // In a real implementation, this would persist to spatial mapping system
    setSpatialAnchor(anchor);
    onAnchorUpdate?.(anchor);
  }, [enableAnchoring, spatialId, currentPosition, onAnchorUpdate]);

  // Physics simulation for spatial objects
  const applyPhysics = useCallback(
    (deltaTime: number) => {
      if (!enablePhysics) return;

      // Simple gravity and collision detection
      const gravity = -9.81; // m/s²
      const newY = currentPosition.y + (gravity * deltaTime * deltaTime) / 1000;

      // Ground collision
      if (newY < 0) {
        updateSpatialPosition({ y: 0 });
      } else {
        updateSpatialPosition({ y: newY });
      }
    },
    [enablePhysics, currentPosition.y, updateSpatialPosition]
  );

  // Initialize XR session on mount
  useEffect(() => {
    initializeXRSession();

    // Cleanup XR session on unmount
    return () => {
      if (xrSessionRef.current) {
        xrSessionRef.current.end();
      }
    };
  }, [initializeXRSession]);

  // Set up gesture event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enableGestures) return;

    const handlePointerDown = (e: PointerEvent) => handleGestureStart(e);
    const handleTouchStart = (e: TouchEvent) => handleGestureStart(e);
    const handlePointerUp = () => handleGestureEnd();
    const handleTouchEnd = () => handleGestureEnd();

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enableGestures, handleGestureStart, handleGestureEnd]);

  // Physics update loop
  useEffect(() => {
    if (!enablePhysics) return;

    let lastTime = Date.now();
    let animationFrame: number;

    const physicsLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      applyPhysics(deltaTime);
      animationFrame = requestAnimationFrame(physicsLoop);
    };

    animationFrame = requestAnimationFrame(physicsLoop);

    return () => cancelAnimationFrame(animationFrame);
  }, [enablePhysics, applyPhysics]);

  // Auto-create anchor if position is stable
  useEffect(() => {
    if (enableAnchoring && !spatialAnchor) {
      const timer = setTimeout(createSpatialAnchor, 5000); // Create anchor after 5s
      return () => clearTimeout(timer);
    }
  }, [enableAnchoring, spatialAnchor, createSpatialAnchor]);

  // Transform calculations for CSS
  const transform3D = useMemo(
    () => ({
      x: spatialX,
      y: spatialY,
      z: spatialZ,
      rotateX: spatialPitch,
      rotateY: spatialYaw,
      rotateZ: spatialRoll,
    }),
    [spatialX, spatialY, spatialZ, spatialPitch, spatialYaw, spatialRoll]
  );

  return (
    <motion.div
      ref={containerRef}
      className={`spatial-computing-container ${className}`}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: "1000px",
        ...transform3D,
      }}
      animate={controls}
    >
      {/* Spatial bounds visualization */}
      {bounds && process.env.NODE_ENV === "development" && (
        <div
          className="spatial-bounds-debug"
          style={{
            position: "absolute",
            border: "1px dashed rgba(0, 255, 0, 0.5)",
            left: `${bounds.min.x}px`,
            top: `${bounds.min.y}px`,
            width: `${bounds.max.x - bounds.min.x}px`,
            height: `${bounds.max.y - bounds.min.y}px`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Spatial anchor indicator */}
      {spatialAnchor && (
        <div
          className="spatial-anchor-indicator"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "8px",
            height: "8px",
            backgroundColor:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Gesture feedback */}
      {gestureActive && (
        <div
          className="gesture-feedback"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            pointerEvents: "none",
            animation: "pulse 1s infinite",
          }}
        />
      )}

      {/* Occlusion layer */}
      {enableOcclusion && spatialContext.capabilities.occlusion && (
        <div
          className="occlusion-layer"
          style={{
            position: "absolute",
            inset: 0,
            background:
              '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
      )}

      {children}

      {/* Debug information */}
      {process.env.NODE_ENV === "development" && (
        <div
          className="spatial-debug-info"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background:
              '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
            color: "white",
            padding: "8px",
            fontSize: "12px",
            borderRadius: "4px",
            pointerEvents: "none",
            fontFamily: "monospace",
          }}
        >
          Env: {spatialContext.environment}
          <br />
          Pos: ({currentPosition.x.toFixed(1)}, {currentPosition.y.toFixed(1)},{" "}
          {currentPosition.z.toFixed(1)})<br />
          Rot: ({currentPosition.pitch.toFixed(1)}°,{" "}
          {currentPosition.yaw.toFixed(1)}°, {currentPosition.roll.toFixed(1)}°)
          <br />
          {gestureActive && `Gesture: ${gestureActive}`}
          <br />
          {spatialAnchor && "Anchored"}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </motion.div>
  );
};

// Specialized spatial components
export const VRGlassComponent: React.FC<SpatialComputingEngineProps> = (
  props
) => (
  <SpatialComputingEngine
    {...props}
    enableGestures={true}
    enablePhysics={true}
    gestureTypes={["grab", "point", "wave"]}
  />
);

export const ARGlassComponent: React.FC<SpatialComputingEngineProps> = (
  props
) => (
  <SpatialComputingEngine
    {...props}
    enableAnchoring={true}
    enableOcclusion={true}
    gestureTypes={["tap", "pinch", "point"]}
  />
);

export const HoloGlassComponent: React.FC<SpatialComputingEngineProps> = (
  props
) => (
  <SpatialComputingEngine
    {...props}
    enableGestures={true}
    enableAnchoring={true}
    enablePhysics={true}
    enableOcclusion={true}
    gestureTypes={["tap", "grab", "rotate", "scale"]}
  />
);

// Spatial computing utilities
export const useSpatialTracking = () => {
  const [position, setPosition] = useState<SpatialPosition>(DEFAULT_POSITION);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    // Would integrate with actual spatial tracking APIs
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  return {
    position,
    isTracking,
    startTracking,
    stopTracking,
  };
};

export default SpatialComputingEngine;