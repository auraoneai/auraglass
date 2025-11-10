'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
import { cn } from '@/lib/utils';
 * Immersive 3D Glass Effects Engine
 * Creates layered depth perception, parallax scrolling, and interactive 3D distortions
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
  useScroll,
} from "framer-motion";

// 3D layer configuration
interface Glass3DLayer {
  id: string;
  depth: number; // Z-index equivalent, higher = closer to viewer
  parallaxFactor: number; // How much this layer moves with parallax
  refractionIndex: number;
  opacity: number;
  blurRadius: number;
  distortionIntensity: number;
  holographicShift: number; // Color shifting intensity
}

// 3D interaction types
type Glass3DInteraction =
  | "hover"
  | "click"
  | "scroll"
  | "tilt"
  | "proximity"
  | "gaze";

interface Glass3DEngineProps {
  children: React.ReactNode;
  className?: string;
  layers?: Partial<Glass3DLayer>[];
  enableParallax?: boolean;
  enableDepthOfField?: boolean;
  enableDistortion?: boolean;
  enableHolographic?: boolean;
  interactionTypes?: Glass3DInteraction[];
  perspectiveDistance?: number;
  maxDepthLayers?: number;
  onLayerInteraction?: (
    layerId: string,
    interaction: Glass3DInteraction
  ) => void;
}

// Default 3D layer configurations
const DEFAULT_LAYERS: Glass3DLayer[] = [
  {
    id: "background",
    depth: 0,
    parallaxFactor: 0.1,
    refractionIndex: 1.1,
    opacity: 0.3,
    blurRadius: 15,
    distortionIntensity: 0.2,
    holographicShift: 0.1,
  },
  {
    id: "midground",
    depth: 1,
    parallaxFactor: 0.3,
    refractionIndex: 1.3,
    opacity: 0.6,
    blurRadius: 8,
    distortionIntensity: 0.4,
    holographicShift: 0.3,
  },
  {
    id: "foreground",
    depth: 2,
    parallaxFactor: 0.6,
    refractionIndex: 1.5,
    opacity: 0.9,
    blurRadius: 3,
    distortionIntensity: 0.6,
    holographicShift: 0.5,
  },
  {
    id: "surface",
    depth: 3,
    parallaxFactor: 1.0,
    refractionIndex: 1.8,
    opacity: 0.95,
    blurRadius: 1,
    distortionIntensity: 0.8,
    holographicShift: 0.7,
  },
];

export const Glass3DEngine: React.FC<Glass3DEngineProps> = ({
  children,
  className = "",
  layers = [],
  enableParallax = true,
  enableDepthOfField = true,
  enableDistortion = true,
  enableHolographic = true,
  interactionTypes = ["hover", "scroll", "tilt"],
  perspectiveDistance = 1000,
  maxDepthLayers = 4,
  onLayerInteraction,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeInteraction, setActiveInteraction] =
    useState<Glass3DInteraction | null>(null);

  const controls = useAnimation();
  const { scrollY } = useScroll();

  // Motion values for 3D transformations
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });
  const translateZ = useSpring(0, { stiffness: 400, damping: 35 });
  const scale3D = useSpring(1, { stiffness: 350, damping: 32 });

  // Combine default layers with custom layers
  const finalLayers = useMemo(() => {
    const combinedLayers = DEFAULT_LAYERS.slice(0, maxDepthLayers);

    layers.forEach((customLayer, index) => {
      if (index < combinedLayers.length) {
        combinedLayers[index] = { ...combinedLayers[index], ...customLayer };
      }
    });

    return combinedLayers.sort((a, b) => a.depth - b.depth);
  }, [layers, maxDepthLayers]);

  // Parallax scroll effect
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200]);

  // Mouse-based 3D tilt effect
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current || !interactionTypes.includes("tilt")) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      // Normalize to [-1, 1] range
      const normalizedX = mouseX / (bounds.width / 2);
      const normalizedY = mouseY / (bounds.height / 2);

      setMousePosition({ x: normalizedX, y: normalizedY });

      // Apply 3D rotation based on mouse position
      rotateX.set(normalizedY * -10); // Invert Y for natural feel
      rotateY.set(normalizedX * 10);

      onLayerInteraction?.("all", "tilt");
    },
    [interactionTypes, rotateX, rotateY, onLayerInteraction]
  );

  const handleMouseEnter = useCallback(() => {
    if (!interactionTypes.includes("hover")) return;

    setIsInteracting(true);
    setActiveInteraction("hover");
    scale3D.set(1.02);
    translateZ.set(20);

    onLayerInteraction?.("all", "hover");
  }, [interactionTypes, scale3D, translateZ, onLayerInteraction]);

  const handleMouseLeave = useCallback(() => {
    if (!interactionTypes.includes("hover")) return;

    setIsInteracting(false);
    setActiveInteraction(null);
    rotateX.set(0);
    rotateY.set(0);
    scale3D.set(1);
    translateZ.set(0);
    setMousePosition({ x: 0, y: 0 });
  }, [interactionTypes, rotateX, rotateY, scale3D, translateZ]);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!interactionTypes.includes("click")) return;

      setActiveInteraction("click");

      // Create ripple effect on click
      const bounds = containerRef.current?.getBoundingClientRect();
      if (bounds) {
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        controls.start({
          scale: [1, 1.05, 1],
          rotateZ: [0, 2, 0],
          transition: { duration: 0.6, ease: "easeOut" },
        });
      }

      onLayerInteraction?.("surface", "click");

      setTimeout(() => setActiveInteraction(null), 600);
    },
    [interactionTypes, controls, onLayerInteraction]
  );

  // Scroll-based interactions
  useEffect(() => {
    if (!interactionTypes.includes("scroll")) return;

    const unsubscribe = scrollY.on("change", (latest) => {
      const scrollFactor = Math.min(latest / 1000, 1);
      translateZ.set(scrollFactor * 50);

      if (enableParallax) {
        onLayerInteraction?.("all", "scroll");
      }
    });

    return unsubscribe;
  }, [
    scrollY,
    translateZ,
    interactionTypes,
    enableParallax,
    onLayerInteraction,
  ]);

  // Generate layer styles with 3D transformations
  const generateLayerStyles = useCallback(
    (layer: Glass3DLayer, index: number) => {
      const depthOffset = (layer.depth - 1) * 20; // Stagger layers in Z-space
      const parallaxOffset = enableParallax ? layer.parallaxFactor : 0;

      return {
        position: "absolute" as const,
        inset: 0,
        borderRadius: "inherit",
        zIndex: layer.depth,
        transform: enableParallax
          ? `translateZ(${depthOffset}px) translateY(${parallaxOffset * -20}px)`
          : `translateZ(${depthOffset}px)`,
        // Use createGlassStyle() instead,
        background: enableHolographic
          ? `linear-gradient(
            ${45 + layer.holographicShift * 30}deg,
            hsla(${180 + index * 60}, 70%, 80%, ${layer.opacity * 0.1}),
            hsla(${220 + index * 60}, 60%, 85%, ${layer.opacity * 0.15}),
            hsla(${260 + index * 60}, 80%, 90%, ${layer.opacity * 0.08})
          )`
          : `rgba(255, 255, 255, ${layer.opacity * 0.1})`,
        opacity: layer.opacity,
        mixBlendMode: index % 2 === 0 ? "normal" : "multiply",
      };
    },
    [enableParallax, enableHolographic]
  );

  // Distortion mesh for interactive distortions
  const DistortionMesh: React.FC<{ layer: Glass3DLayer }> = ({ layer }) => {
    if (!enableDistortion) return null;

    const distortionPoints = useMemo(() => {
      const points = [];
      const gridSize = 8;

      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          const x = (i / gridSize) * 100;
          const y = (j / gridSize) * 100;

          // Apply mouse-based distortion
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - 50 - mousePosition.x * 25, 2) +
              Math.pow(y - 50 - mousePosition.y * 25, 2)
          );

          const distortionFactor = Math.max(0, 1 - distanceFromMouse / 50);
          const distortionAmount =
            layer.distortionIntensity * distortionFactor * 2;

          points.push({
            x: x + Math.sin(distortionAmount) * distortionAmount,
            y: y + Math.cos(distortionAmount) * distortionAmount,
            intensity: distortionFactor,
          });
        }
      }

      return points;
    }, [layer.distortionIntensity, mousePosition]);

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          borderRadius: "inherit",
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <filter
              id={`distortion-${layer.id}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feTurbulence
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={layer.distortionIntensity * 20}
              />
            </filter>
          </defs>

          {/* Distortion grid visualization */}
          <g filter={`url(#distortion-${layer.id})`}>
            {distortionPoints.map((point, index) => (
              <circle
                key={index}
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r={point.intensity * 2}
                fill={`rgba(255, 255, 255, ${point.intensity * 0.1})`}
                style={{
                  filter: `blur(${point.intensity * 2}px)`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  };

  // Depth of field effect
  const DepthOfFieldLayer: React.FC<{
    layer: Glass3DLayer;
    isFocused: boolean;
  }> = ({ layer, isFocused }) => {
    if (!enableDepthOfField) return null;

    const focusBlur = isFocused ? 0 : (4 - layer.depth) * 3;
    const focusOpacity = isFocused ? 1 : 0.3 + (layer.depth / 4) * 0.7;

    return (
      <motion.div
        style={
          {
            ...generateLayerStyles(layer, layer.depth),
            filter: `blur(${layer.blurRadius + focusBlur}px)`,
            opacity: layer.opacity * focusOpacity,
          } as any
        }
        animate={{
          filter: `blur(${layer.blurRadius + focusBlur}px)`,
          opacity: layer.opacity * focusOpacity,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      >
        <DistortionMesh layer={layer} />
      </motion.div>
    );
  };

  // Focus management for depth of field
  const [focusedLayer, setFocusedLayer] = useState<string>("surface");

  const handleLayerFocus = useCallback(
    (layerId: string) => {
      if (enableDepthOfField) {
        setFocusedLayer(layerId);
      }
    },
    [enableDepthOfField]
  );

  return (
    <motion.div
      ref={containerRef}
      className={`glass-3d-container ${className}`}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: `${perspectiveDistance}px`,
        overflow: "hidden",
      }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* 3D Glass Layers */}
      <motion.div
        className="glass-3d-layers"
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
          translateZ,
          scale: scale3D,
        }}
      >
        {finalLayers.map((layer, index) => (
          <React.Fragment key={layer.id}>
            {/* Standard 3D layer */}
            <motion.div
              className={`glass-3d-layer glass-layer-${layer.id}`}
              style={generateLayerStyles(layer, index) as any}
              onHoverStart={() => handleLayerFocus(layer.id)}
              whileHover={{ scale: 1.01 }}
            >
              <DistortionMesh layer={layer} />
            </motion.div>

            {/* Depth of field layer */}
            <DepthOfFieldLayer
              layer={layer}
              isFocused={focusedLayer === layer.id}
            />
          </React.Fragment>
        ))}

        {/* Holographic overlay */}
        {enableHolographic && (
          <motion.div
            className="glass-holographic-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: `conic-gradient(
                from ${mousePosition.x * 180}deg,
                hsla(200, 100%, 80%, 0.1) 0deg,
                hsla(280, 100%, 90%, 0.15) 120deg,
                hsla(320, 100%, 85%, 0.1) 240deg
              )`,
              borderRadius: "inherit",
              zIndex: finalLayers.length + 1,
              mixBlendMode: "overlay",
              transform: `translateZ(${finalLayers.length * 20 + 10}px)`,
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    opacity: isInteracting ? 0.8 : 0.4,
                    scale: isInteracting ? 1.02 : 1,
                  }
            }
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }
            }
          />
        )}
      </motion.div>

      {/* Content Layer */}
      <motion.div
        className="glass-3d-content"
        style={{
          position: "relative",
          zIndex: finalLayers.length + 2,
          transform: `translateZ(${(finalLayers.length + 1) * 20}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>

      {/* Parallax background elements */}
      {enableParallax && (
        <motion.div
          className="glass-parallax-background"
          style={{
            position: "absolute",
            inset: "-20%",
            background: `radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, 
              var(--glass-bg-default) 0%, 
              transparent 70%
            )`,
            transform: `translateZ(-100px) scale(1.2)`,
            y: parallaxY,
          }}
        />
      )}

      {/* Interactive state indicators */}
      {activeInteraction && (
        <div className="glass-3d-interaction-indicator">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className='interaction-pulse'
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "20px",
              height: "20px",
              background:
                '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      <style>{`
        .glass-3d-container {
          --glass-3d-perspective: ${perspectiveDistance}px;
        }

        .interaction-pulse {
          animation: pulse-3d 1s ease-out infinite;
        }

        @keyframes pulse-3d {
          0% {
            transform: translate(-50%, -50%) scale(1) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3) translateZ(20px);
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
};

// Specialized 3D glass components
export const ParallaxGlass: React.FC<
  Omit<Glass3DEngineProps, "enableParallax">
> = (props) => <Glass3DEngine {...props} enableParallax={true} />;

export const DepthGlass: React.FC<
  Omit<Glass3DEngineProps, "enableDepthOfField">
> = (props) => <Glass3DEngine {...props} enableDepthOfField={true} />;

export const HolographicGlass: React.FC<
  Omit<Glass3DEngineProps, "enableHolographic">
> = (props) => <Glass3DEngine {...props} enableHolographic={true} />;

export const InteractiveGlass3D: React.FC<Glass3DEngineProps> = (props) => (
  <Glass3DEngine
    {...props}
    interactionTypes={["hover", "click", "scroll", "tilt"]}
    enableDistortion={true}
    enableHolographic={true}
    enableDepthOfField={true}
  />
);

export default Glass3DEngine;