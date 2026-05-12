"use client";
// WebXR API type declarations - extend existing XR types
declare global {
  interface Navigator {
    xr?: XRSystem;
  }
}

import React from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Hand, Info, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "../../lib/utilsComprehensive";
import {
  ARGlassAnimations,
  ARGlassGeometryFactory,
  ARGlassInteractions,
  ARGlassMaterialFactory,
  ARGlassUtils,
} from "./ARGlassEffects.helpers";

// Mock WebXR hook for demonstration - in real implementation this would use actual WebXR APIs
const useWebXR = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [session, setSession] = useState({ isActive: false });
  const [capabilities, setCapabilities] = useState({
    supportsHandTracking: false,
    supportsHitTest: false,
    supportsDomOverlay: false,
    isARSupported: false,
  });
  const [handTracking, setHandTracking] = useState({
    left: {
      isActive: false,
      position: new THREE.Vector3(),
      rotation: new THREE.Quaternion(),
    },
    right: {
      isActive: false,
      position: new THREE.Vector3(),
      rotation: new THREE.Quaternion(),
    },
  });
  const [hitTestResults, setHitTestResults] = useState<
    { point: THREE.Vector3; distance: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock WebXR detection
    const checkSupport = async () => {
      // In real implementation, check for 'xr' in navigator
      const xrSupported = typeof navigator !== "undefined" && "xr" in navigator;
      const arSupported =
        xrSupported && (await navigator.xr?.isSessionSupported("immersive-ar"));

      setIsSupported(xrSupported);
      setIsARSupported(arSupported || false);
      setCapabilities({
        supportsHandTracking: arSupported || false,
        supportsHitTest: arSupported || false,
        supportsDomOverlay: arSupported || false,
        isARSupported: arSupported || false,
      });
    };

    checkSupport();
  }, []);

  const startARSession = useCallback(async (options: any = {}) => {
    setIsLoading(true);
    try {
      // Mock AR session start
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSession({ isActive: true });
      setIsLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  }, []);

  const endARSession = useCallback(async () => {
    setSession({ isActive: false });
    setHandTracking({
      left: {
        isActive: false,
        position: new THREE.Vector3(),
        rotation: new THREE.Quaternion(),
      },
      right: {
        isActive: false,
        position: new THREE.Vector3(),
        rotation: new THREE.Quaternion(),
      },
    });
  }, []);

  const onHitTest = useCallback(
    (
      callback: (results: { point: THREE.Vector3; distance: number }[]) => void
    ) => {
      // Mock hit test callback
      const mockResults = [{ point: new THREE.Vector3(0, 0, -2), distance: 2 }];
      setHitTestResults(mockResults);
      callback(mockResults);
    },
    []
  );

  const onHandTracking = useCallback(
    (
      callback: (hands: {
        left: {
          isActive: boolean;
          position: THREE.Vector3;
          rotation: THREE.Quaternion;
        };
        right: {
          isActive: boolean;
          position: THREE.Vector3;
          rotation: THREE.Quaternion;
        };
      }) => void
    ) => {
      // Mock hand tracking callback
      const mockHands = {
        left: {
          isActive: true,
          position: new THREE.Vector3(-0.3, 1.2, -0.5),
          rotation: new THREE.Quaternion(),
        },
        right: {
          isActive: true,
          position: new THREE.Vector3(0.3, 1.2, -0.5),
          rotation: new THREE.Quaternion(),
        },
      };
      setHandTracking(mockHands);
      callback(mockHands);
    },
    []
  );

  const startVoiceRecognition = useCallback(() => {
    // Mock voice recognition
    return {
      start: () => {},
      stop: () => {},
    };
  }, []);

  return {
    isSupported,
    isARSupported,
    session,
    capabilities,
    handTracking,
    hitTestResults,
    isLoading,
    error,
    startARSession,
    endARSession,
    onHitTest,
    onHandTracking,
    startVoiceRecognition,
  };
};

// Main ARGlassEffects Component
export interface ARGlassEffectsProps {
  mode?: "ar" | "preview" | "demo";
  content?: {
    title?: string;
    text?: string;
    data?: number[];
    media?: string;
  };
  onInteraction?: (type: string, data?: any) => void;
  className?: string;
  enablePhysics?: boolean;
  enableHandTracking?: boolean;
  enableVoiceControl?: boolean;
  adaptiveScaling?: boolean;
  showControls?: boolean;
  showInfo?: boolean;
}

export function ARGlassEffects({
  mode = "preview",
  content = {},
  onInteraction,
  className = "",
  enablePhysics = false,
  enableHandTracking = false,
  enableVoiceControl = false,
  adaptiveScaling = true,
  showControls = true,
  showInfo = true,
}: ARGlassEffectsProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userPosition] = useState(new THREE.Vector3(0, 1.6, 0));
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalActive, setPortalActive] = useState(false);

  const {
    capabilities,
    session,
    handTracking,
    hitTestResults,
    isLoading,
    error: xrError,
    startARSession,
    endARSession,
    onHitTest,
    onHandTracking,
    startVoiceRecognition,
  } = useWebXR();

  // Initialize AR Glass Effects
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitialized(true);
      } catch (error) {
        setError(`Failed to initialize AR Glass Effects: ${error}`);
      }
    };

    initialize();
  }, []);

  // Setup hand tracking
  useEffect(() => {
    if (enableHandTracking && capabilities.supportsHandTracking) {
      const handleHandTracking = ARGlassInteractions.setupHandTracking(
        [], // Objects will be populated from scene
        (
          object: THREE.Object3D,
          hand: {
            isActive: boolean;
            position: THREE.Vector3;
            rotation: THREE.Quaternion;
          }
        ) => {
          if (onInteraction) {
            onInteraction("hand_interaction", { object: object.uuid, hand });
          }
        }
      );

      onHandTracking(handleHandTracking);
    }
  }, [
    enableHandTracking,
    capabilities.supportsHandTracking,
    onHandTracking,
    onInteraction,
  ]);

  // Setup voice control
  useEffect(() => {
    if (enableVoiceControl && mode === "ar") {
      const recognition = startVoiceRecognition();
      return () => {
        if (recognition) {
          recognition.stop();
        }
      };
    }
  }, [enableVoiceControl, mode, startVoiceRecognition]);

  // Handle AR session start/stop
  const handleARToggle = useCallback(async () => {
    if (session.isActive) {
      await endARSession();
    } else {
      try {
        await startARSession({
          requiredFeatures: ["local-floor"],
          optionalFeatures: enableHandTracking ? ["hand-tracking"] : [],
          domOverlay: canvasRef.current?.parentElement
            ? {
                root: canvasRef.current.parentElement,
              }
            : undefined,
        });
      } catch (error) {
        setError(`Failed to start AR session: ${error}`);
      }
    }
  }, [session.isActive, endARSession, startARSession, enableHandTracking]);

  // Handle hit test results
  useEffect(() => {
    onHitTest((results: { point: THREE.Vector3; distance: number }[]) => {
      if (onInteraction && results.length > 0) {
        onInteraction("surface_detected", {
          points: results.map(
            (r: { point: THREE.Vector3; distance: number }) => r.point
          ),
          count: results.length,
        });
      }
    });
  }, [onHitTest, onInteraction]);

  const handlePanelInteraction = useCallback(
    (panelType: string) => {
      if (onInteraction) {
        onInteraction("panel_interaction", { type: panelType });
      }
    },
    [onInteraction]
  );

  const handlePortalActivation = useCallback(() => {
    const prefersReducedMotion = useReducedMotion();
    setPortalActive(!portalActive);
    if (onInteraction) {
      onInteraction("portal_toggle", { active: !portalActive });
    }
  }, [portalActive, onInteraction]);

  if (error) {
    return (
      <div
        className={cn(
          "ar-glass-error glass-foundation-complete glass-surface-danger",
          "glass-p-md glass-radius-lg glass-text-danger",
          className
        )}
      >
        <div className="glass-flex glass-items-center glass-gap-2">
          <AlertCircle className="glass-w-5 glass-h-5" />
          <span>AR Glass Effects Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div
        className={cn(
          "ar-glass-loading glass-foundation-complete glass-surface-info",
          "glass-p-md glass-radius-lg glass-text-info",
          className
        )}
      >
        <div className="glass-flex glass-items-center glass-gap-2">
          <Loader2 className="glass-w-5 glass-h-5 glass-animate-spin" />
          <span>Initializing AR Glass Effects...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "ar-glass-effects glass-foundation-complete relative",
        className
      )}
    >
      {/* AR Controls */}
      {mode === "ar" && capabilities.isARSupported && showControls && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="glass-absolute glass-top-4 glass-right-4 glass-z-10 glass-flex glass-gap-2"
        >
          <button
            onClick={handleARToggle}
            disabled={isLoading}
            className={cn(
              "glass-foundation-complete glass-surface-primary glass-text-primary",
              "glass-px-md glass-py-sm glass-radius-lg glass-shadow-lg",
              "hover:glass-surface-primary-hover disabled:opacity-50",
              "flex items-center glass-gap-2 glass-transition glass-focus glass-touch-target glass-contrast-guard",
              "glass-press glass-magnet"
            )}
          >
            {isLoading ? (
              <Loader2 className="glass-w-4 glass-h-4 glass-animate-spin glass-touch-target glass-contrast-guard" />
            ) : session.isActive ? (
              <EyeOff className="glass-w-4 glass-h-4" />
            ) : (
              <Eye className="glass-w-4 glass-h-4" />
            )}
            {isLoading
              ? "Loading..."
              : session.isActive
                ? "Exit AR"
                : "Enter AR"}
          </button>

          {enableVoiceControl && (
            <div className="glass-px-3 glass-py-2 glass-surface-green/20 glass-text-primary glass-radius-lg glass-text-sm glass-contrast-guard">
              🎤 Voice Active
            </div>
          )}
        </motion.div>
      )}

      {/* Capabilities Info */}
      {mode === "demo" && showInfo && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          className="glass-absolute glass-top-4 glass-left-4 glass-z-10 glass-p-4 glass-surface-dark/80 glass-backdrop-blur-lg glass-radius-lg glass-text-primary glass-text-sm glass-max-w-xs glass-contrast-guard"
        >
          <h3 className="glass-font-semibold glass-mb-2 glass-flex glass-items-center glass-gap-2">
            <Info className="glass-w-4 glass-h-4" />
            AR Capabilities
          </h3>
          <ul className="glass-space-y-1">
            <li className="glass-flex glass-items-center glass-gap-2">
              <span
                className={
                  capabilities.isARSupported ? "text-green-400" : "text-red-400"
                }
              >
                {capabilities.isARSupported ? "✅" : "❌"}
              </span>
              AR Supported
            </li>
            <li className="glass-flex glass-items-center glass-gap-2">
              <span
                className={
                  capabilities.supportsHandTracking
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {capabilities.supportsHandTracking ? "✅" : "❌"}
              </span>
              Hand Tracking
            </li>
            <li className="glass-flex glass-items-center glass-gap-2">
              <span
                className={
                  capabilities.supportsHitTest
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {capabilities.supportsHitTest ? "✅" : "❌"}
              </span>
              Hit Testing
            </li>
            <li className="glass-flex glass-items-center glass-gap-2">
              <span
                className={
                  capabilities.supportsDomOverlay
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {capabilities.supportsDomOverlay ? "✅" : "❌"}
              </span>
              DOM Overlay
            </li>
          </ul>
        </motion.div>
      )}

      {/* Error Display */}
      {xrError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className="glass-absolute glass-bottom-4 glass-left-4 glass-z-10 glass-surface-red glass-text-primary glass-p-3 glass-radius-lg glass-max-w-xs glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <AlertCircle className="glass-w-4 glass-h-4" />
            <span className="glass-text-sm">{xrError}</span>
          </div>
        </motion.div>
      )}

      {/* Hand Tracking Status */}
      {enableHandTracking &&
        (handTracking.left.isActive || handTracking.right.isActive) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            className="glass-absolute glass-bottom-4 glass-right-4 glass-z-10 glass-surface-green glass-text-primary glass-p-3 glass-radius-lg glass-text-sm glass-contrast-guard"
          >
            <div className="glass-flex glass-items-center glass-gap-2">
              <Hand className="glass-w-4 glass-h-4" />
              <span>
                Hands: {handTracking.left.isActive ? "L" : ""}{" "}
                {handTracking.right.isActive ? "R" : ""}
              </span>
            </div>
          </motion.div>
        )}

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        className="glass-w-full glass-h-full"
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
      >
        {/* Camera setup */}
        {mode !== "ar" && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
        )}
        <PerspectiveCamera makeDefault position={[0, 1.6, 3]} />

        {/* AR Scene */}
        <ARScene
          content={content}
          onInteraction={onInteraction}
          userPosition={userPosition}
          enablePhysics={enablePhysics}
          portalActive={portalActive}
          onPortalActivation={handlePortalActivation}
          onPanelInteraction={handlePanelInteraction}
        />
      </Canvas>
    </div>
  );
}

// AR Scene Component
function ARScene({
  content,
  onInteraction,
  userPosition,
  enablePhysics,
  portalActive,
  onPortalActivation,
  onPanelInteraction,
}: any) {
  const { scene } = useThree();

  // Initialize physics if enabled
  useEffect(() => {
    if (enablePhysics) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.physics) {
          // Add physics objects to the system
        }
      });
    }
  }, [scene, enablePhysics]);

  // Update physics
  useFrame((state, delta) => {
    if (enablePhysics) {
      // Update physics simulation
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />

      {/* Main content panel */}
      <FloatingPanel
        position={[0, 1.5, -2]}
        content={content?.title || "AR Content"}
        userPosition={userPosition}
        onInteraction={() => onPanelInteraction("main")}
      />

      {/* Secondary information panel */}
      <FloatingPanel
        position={[-2, 1, -2.5]}
        rotation={[0, 0.3, 0]}
        content={content?.text || "Additional Information"}
        userPosition={userPosition}
        onInteraction={() => onPanelInteraction("secondary")}
      />

      {/* Data visualization */}
      {content?.data && (
        <DataVisualization
          data={content.data}
          position={[2, 0.5, -2]}
          userPosition={userPosition}
        />
      )}

      {/* Portal for immersive content */}
      <HolographicPortal
        position={[0, 0, -5]}
        isActive={portalActive}
        onActivate={onPortalActivation}
      />

      {/* Particle field for atmosphere */}
      <ParticleField position={[0, 0, -3]} count={50} />

      {/* Environmental elements */}
      <group position={[0, -1, 0]}>
        {/* Ground plane with glass material */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial color={0x333333} transparent opacity={0.1} />
        </mesh>
      </group>
    </>
  );
}

// Floating Panel Component
function FloatingPanel({
  position,
  rotation = [0, 0, 0],
  content,
  userPosition,
  onInteraction,
  isInteractive = true,
}: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [distance, setDistance] = useState(0);

  const geometry = useMemo(
    () => ARGlassGeometryFactory.createCurvedPanel(2, 1.5, 0.2),
    []
  );
  const material = useMemo(
    () =>
      ARGlassMaterialFactory.createSpatialUI({
        color: new THREE.Color(0.3, 0.7, 1.0),
        opacity: 0.8,
        userPosition,
        interactionRadius: 3.0,
        glowIntensity: isHovered ? 2.0 : 1.0,
      }),
    [userPosition, isHovered]
  );

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;
    const mat = materialRef.current;

    // Update distance to user
    const currentDistance = mesh.position.distanceTo(userPosition);
    setDistance(currentDistance);

    // Update material uniforms
    mat.uniforms.time.value = time;
    mat.uniforms.userPosition.value.copy(userPosition);

    // Floating animation
    const floatingAnimation = ARGlassAnimations.createFloatingAnimation(
      mesh,
      0.05,
      0.5
    );
    floatingAnimation(time);

    // Adaptive scaling
    if (isInteractive) {
      const scale = ARGlassUtils.createAdaptiveScaling(
        1.0,
        5.0
      )(currentDistance);
      mesh.scale.setScalar(scale);
    }

    // Look at user
    mesh.lookAt(userPosition);
  });

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (onInteraction) {
      onInteraction();
      ARGlassInteractions.createHapticFeedback(0.7, 150);
    }
  }, [onInteraction]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      geometry={geometry}
      material={material}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    />
  );
}

// Data Visualization Component
function DataVisualization({ data, position, userPosition }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const materials = useRef<THREE.ShaderMaterial[]>([]);

  const geometries = useMemo(() => {
    return data.map((_: number, index: number) => {
      const height = data[index] * 2;
      return new THREE.BoxGeometry(0.2, height, 0.2);
    });
  }, [data]);

  const dataMaterials = useMemo(() => {
    return data.map((value: number) =>
      ARGlassMaterialFactory.createDataVisualization({
        lowColor: new THREE.Color(0.2, 0.4, 1.0),
        highColor: new THREE.Color(1.0, 0.4, 0.2),
        opacity: 0.8,
        dataValue: value,
      })
    );
  }, [data]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Update materials
    materials.current.forEach((material, index) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.animationProgress.value = Math.min(1, time * 0.5);
        material.uniforms.dataValue.value = data[index];
      }
    });

    // Look at user
    groupRef.current.lookAt(userPosition);
  });

  return (
    <group ref={groupRef} position={position}>
      {data.map((value: number, index: number) => (
        <mesh
          key={index}
          position={[(index - data.length / 2) * 0.3, value, 0]}
          geometry={geometries[index]}
          material={dataMaterials[index]}
          ref={(ref) => {
            if (ref)
              materials.current[index] = ref.material as THREE.ShaderMaterial;
          }}
        />
      ))}
    </group>
  );
}

// Holographic Portal Component
function HolographicPortal({ position, isActive, onActivate }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const geometry = useMemo(
    () => ARGlassGeometryFactory.createPortalGeometry(0.8, 1.2),
    []
  );
  const material = useMemo(
    () =>
      ARGlassMaterialFactory.createHolographicGlass({
        color: new THREE.Color(0.6, 0.8, 1.0),
        opacity: isActive ? 0.9 : 0.5,
        fresnelPower: 1.5,
      }),
    [isActive]
  );

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;
    const mat = materialRef.current;

    // Update shader uniforms
    mat.uniforms.time.value = time;
    mat.uniforms.opacity.value = isActive ? 0.9 : 0.5;

    // Rotation animation
    const rotationAnimation = ARGlassAnimations.createRotationAnimation(
      mesh,
      new THREE.Vector3(0, 1, 0),
      isActive ? 2 : 0.5
    );
    rotationAnimation(time);

    // Scale animation when active
    if (isActive) {
      const scaleAnimation = ARGlassAnimations.createScaleAnimation(
        mesh,
        1.0,
        1.1,
        3
      );
      scaleAnimation(time);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
      onClick={onActivate}
    />
  );
}

// Particle Field Component
function ParticleField({ position, count }: any) {
  const meshRef = useRef<THREE.Points>(null!);

  const geometry = useMemo(
    () => ARGlassGeometryFactory.createParticleField(count),
    [count]
  );
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = geometry.attributes.position.array;

    // Animate particles
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + i * 0.01) * 0.002;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      ref={meshRef}
      position={position}
      geometry={geometry}
      material={material}
    />
  );
}

export default ARGlassEffects;
