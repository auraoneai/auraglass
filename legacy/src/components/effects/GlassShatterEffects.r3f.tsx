"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Triangle, Zap } from "@/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import * as THREE from "three";
import { SeededRandom } from "../../utils/random";

// Shatter geometry factory
const ShatterGeometryFactory = {
  createGlassShard: (
    size = 1,
    complexity = 3,
    random: SeededRandom = new SeededRandom()
  ) => {
    const geometry = new THREE.PlaneGeometry(
      size,
      size,
      complexity,
      complexity
    );

    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      const edgeFactor = Math.abs(x) + Math.abs(y);
      if (edgeFactor > 0.8) {
        positions[i] += random.nextSigned() * 0.1;
        positions[i + 1] += random.nextSigned() * 0.1;
        positions[i + 2] += random.nextSigned() * 0.05;
      }
    }

    geometry.computeVertexNormals();
    return geometry;
  },

  createShatterField: (
    count = 20,
    _spread = 5,
    random: SeededRandom = new SeededRandom()
  ) => {
    const geometries: THREE.PlaneGeometry[] = [];
    for (let i = 0; i < count; i++) {
      const size = 0.5 + random.next() * 1.5;
      const complexity = 2 + random.nextInt(0, 2);
      const geometry = ShatterGeometryFactory.createGlassShard(
        size,
        complexity,
        random
      );
      geometries.push(geometry);
    }
    return geometries;
  },
};

const ShatterMaterialFactory = {
  createGlassShardMaterial: (options: any = {}) => {
    const {
      color = new THREE.Color(0.7, 0.9, 1.0),
      opacity = 0.8,
      refractionRatio = 1.5,
      reflectivity = 0.8,
    } = options;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        opacity: { value: opacity },
        refractionRatio: { value: refractionRatio },
        reflectivity: { value: reflectivity },
        shatterProgress: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;

          vec3 displacedPosition = position;
          displacedPosition += normal * sin(time * 10.0 + position.x * 5.0) * 0.02;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        uniform float refractionRatio;
        uniform float reflectivity;
        uniform float shatterProgress;

        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

          vec3 finalColor = color;
          finalColor += vec3(
            sin(vPosition.x * 10.0) * 0.1,
            cos(vPosition.y * 10.0) * 0.1,
            sin(vPosition.z * 10.0) * 0.1
          );

          float shatterEffect = sin(time * 20.0 + vPosition.x * 5.0 + vPosition.y * 5.0) * 0.5 + 0.5;
          finalColor *= (1.0 - shatterProgress * 0.3);

          float finalOpacity = opacity * (0.7 + 0.3 * fresnel) * (1.0 - shatterProgress * 0.2);

          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  },
};

const ShatterAnimations = {
  createShardAnimation: (
    shard: THREE.Mesh,
    targetPosition: THREE.Vector3,
    targetRotation: THREE.Euler,
    duration: number = 2
  ) => {
    const startPosition = shard.position.clone();
    const startRotation = shard.rotation.clone();
    const startTime = Date.now();

    return () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);

      shard.position.lerpVectors(startPosition, targetPosition, easedProgress);
      shard.rotation.x = THREE.MathUtils.lerp(
        startRotation.x,
        targetRotation.x,
        easedProgress
      );
      shard.rotation.y = THREE.MathUtils.lerp(
        startRotation.y,
        targetRotation.y,
        easedProgress
      );
      shard.rotation.z = THREE.MathUtils.lerp(
        startRotation.z,
        targetRotation.z,
        easedProgress
      );

      return progress >= 1;
    };
  },

  createExplosionAnimation: (
    shards: THREE.Mesh[],
    center: THREE.Vector3,
    force: number = 10,
    duration: number = 1
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const animations = shards.map((shard) => {
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      const distance = 2 + Math.random() * 3;
      const targetPosition = center
        .clone()
        .add(direction.multiplyScalar(distance));
      const targetRotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      return ShatterAnimations.createShardAnimation(
        shard,
        targetPosition,
        targetRotation,
        duration
      );
    });

    return () => animations.every((animation) => animation());
  },

  createReformAnimation: (
    shards: THREE.Mesh[],
    originalPositions: THREE.Vector3[],
    duration: number = 2
  ) => {
    const animations = shards.map((shard, index) => {
      const targetPosition = originalPositions[index];
      const targetRotation = new THREE.Euler(0, 0, 0);
      return ShatterAnimations.createShardAnimation(
        shard,
        targetPosition,
        targetRotation,
        duration
      );
    });

    return () => animations.every((animation) => animation());
  },
};

export interface GlassShatterEffectsProps {
  children?: React.ReactNode;
  className?: string;
  trigger?: "click" | "hover" | "manual" | "auto";
  duration?: number;
  intensity?: number;
  shardCount?: number;
  autoReform?: boolean;
  reformDelay?: number;
  onShatter?: () => void;
  onReform?: () => void;
  disabled?: boolean;
  showControls?: boolean;
  seed?: number | string;
}

export function GlassShatterEffectsR3F(props: GlassShatterEffectsProps) {
  const {
    children,
    className = "",
    trigger = "click",
    duration = 2,
    intensity = 1,
    shardCount = 12,
    autoReform = true,
    reformDelay = 3000,
    onShatter,
    onReform,
    disabled = false,
    showControls = false,
    seed,
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isShattered, setIsShattered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shards, setShards] = useState<THREE.Mesh[]>([]);
  const [originalPositions, setOriginalPositions] = useState<THREE.Vector3[]>(
    []
  );
  const [currentAnimation, setCurrentAnimation] = useState<
    (() => boolean) | null
  >(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const seededRandom = new SeededRandom(seed ?? `${shardCount}`);
    const geometries = ShatterGeometryFactory.createShatterField(
      shardCount,
      5,
      seededRandom
    );
    const newShards: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];

    geometries.forEach((geometry) => {
      const material = ShatterMaterialFactory.createGlassShardMaterial({
        opacity: 0.8 - seededRandom.next() * 0.3,
        refractionRatio: 1.3 + seededRandom.next() * 0.4,
      });

      const shard = new THREE.Mesh(geometry, material);
      shard.position.set(
        seededRandom.nextSigned() * 2,
        seededRandom.nextSigned() * 2,
        0
      );
      shard.rotation.set(
        seededRandom.next() * Math.PI * 2,
        seededRandom.next() * Math.PI * 2,
        seededRandom.next() * Math.PI * 2
      );

      newShards.push(shard);
      positions.push(shard.position.clone());
    });

    setShards(newShards);
    setOriginalPositions(positions);
  }, [shardCount, seed]);

  const triggerReform = useCallback(() => {
    if (!isShattered || isAnimating) return;
    setIsAnimating(true);
    onReform?.();
    const animation = ShatterAnimations.createReformAnimation(
      shards,
      originalPositions,
      duration
    );
    setCurrentAnimation(() => animation);
  }, [isShattered, isAnimating, shards, originalPositions, duration, onReform]);

  const triggerShatter = useCallback(() => {
    if (disabled || isAnimating) return;
    setIsShattered(true);
    setIsAnimating(true);
    onShatter?.();

    const center = new THREE.Vector3(0, 0, 0);
    const animation = ShatterAnimations.createExplosionAnimation(
      shards,
      center,
      intensity * 10,
      duration
    );
    setCurrentAnimation(() => animation);

    if (autoReform) {
      setTimeout(() => {
        triggerReform();
      }, reformDelay);
    }
  }, [
    disabled,
    isAnimating,
    shards,
    intensity,
    duration,
    autoReform,
    reformDelay,
    onShatter,
    triggerReform,
  ]);

  const handleManualTrigger = useCallback(() => {
    if (isShattered) {
      triggerReform();
    } else {
      triggerShatter();
    }
  }, [isShattered, triggerReform, triggerShatter]);

  useEffect(() => {
    if (disabled) return;
    const element = containerRef.current;
    if (!element) return;

    const handleClick = () => {
      if (trigger === "click") handleManualTrigger();
    };
    const handleMouseEnter = () => {
      if (trigger === "hover") triggerShatter();
    };
    const handleMouseLeave = () => {
      if (trigger === "hover" && autoReform) {
        setTimeout(() => triggerReform(), reformDelay);
      }
    };

    if (trigger === "click") {
      element.addEventListener("click", handleClick);
    } else if (trigger === "hover") {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      element.removeEventListener("click", handleClick);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    trigger,
    disabled,
    handleManualTrigger,
    triggerShatter,
    triggerReform,
    autoReform,
    reformDelay,
  ]);

  useEffect(() => {
    if (trigger === "auto" && !disabled) {
      const interval = setInterval(() => {
        if (!isAnimating) triggerShatter();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trigger, disabled, isAnimating, triggerShatter]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "glass-shatter-effects glass-relative glass-overflow-hidden",
        className
      )}
      style={{
        position: "relative",
        cursor: trigger === "click" ? "pointer" : "default",
      }}
    >
      <div
        className={cn(
          "content glass-transition-opacity glass-duration-300",
          isShattered ? "glass-opacity-0" : "glass-opacity-100"
        )}
      >
        {children}
      </div>

      <AnimatePresence>
        {isShattered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "glass-absolute glass-inset-0 glass-pointer-events-none"
            )}
          >
            <Canvas
              ref={canvasRef}
              className={cn("glass-w-full glass-h-full")}
              camera={{ position: [0, 0, 5], fov: 75 }}
              gl={{ alpha: true, antialias: true }}
            >
              <ShatterScene
                shards={shards}
                currentAnimation={currentAnimation}
                setCurrentAnimation={setCurrentAnimation}
                setIsAnimating={setIsAnimating}
                setIsShattered={setIsShattered}
                isShattered={isShattered}
              />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className={cn(
            "glass-absolute glass-bottom-4 glass-right-4 glass-flex glass-gap-2"
          )}
        >
          <button
            onClick={handleManualTrigger}
            disabled={isAnimating}
            className={cn(
              "glass-p-2 glass-surface-subtle glass-foundation-complete glass-radius-lg glass-border glass-border-primary hover:glass-surface-hover glass-transition-colors disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard"
            )}
            title={isShattered ? "Reform" : "Shatter"}
          >
            {isShattered ? (
              <RotateCcw className={cn("glass-w-4 glass-h-4")} />
            ) : (
              <Zap className={cn("glass-w-4 glass-h-4")} />
            )}
          </button>

          {isAnimating && (
            <div
              className={cn(
                "glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-surface-info glass-foundation-complete glass-radius-lg glass-text-info glass-text-sm"
              )}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 1, repeat: Infinity, ease: "linear" }
                }
              >
                <Triangle className={cn("glass-w-3 glass-h-3")} />
              </motion.div>
              Animating...
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function ShatterScene({
  shards,
  currentAnimation,
  setCurrentAnimation,
  setIsAnimating,
  setIsShattered,
  isShattered,
}: any) {
  const { scene } = useThree();

  useEffect(() => {
    shards.forEach((shard: THREE.Mesh) => {
      scene.add(shard);
    });
    return () => {
      shards.forEach((shard: THREE.Mesh) => {
        scene.remove(shard);
      });
    };
  }, [shards, scene]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    shards.forEach((shard: THREE.Mesh) => {
      const material = shard.material as any;
      if (material && material.uniforms) {
        if (material.uniforms.time) material.uniforms.time.value = time;
        if (material.uniforms.shatterProgress)
          material.uniforms.shatterProgress.value = isShattered ? 1 : 0;
      }
    });

    if (currentAnimation) {
      const complete = currentAnimation();
      if (complete) {
        setCurrentAnimation(null);
        setIsAnimating(false);
        if (!isShattered) setIsShattered(false);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={0x4488ff} />
    </>
  );
}

export default GlassShatterEffectsR3F;
