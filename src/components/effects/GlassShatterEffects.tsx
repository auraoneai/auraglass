import { useReducedMotion } from '@/hooks/useReducedMotion';
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import {
    RotateCcw,
    Triangle,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import * as THREE from 'three';
import { SeededRandom } from '../../utils/random';

// Shatter geometry factory
const ShatterGeometryFactory = {
  createGlassShard: (size = 1, complexity = 3, random: SeededRandom = new SeededRandom()) => {
    const geometry = new THREE.PlaneGeometry(size, size, complexity, complexity);

    // Add random jagged edges
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Add some randomness to edges
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

  createShatterField: (count = 20, spread = 5, random: SeededRandom = new SeededRandom()) => {
    const geometries = [];
    for (let i = 0; i < count; i++) {
      const size = 0.5 + random.next() * 1.5;
      const complexity = 2 + random.nextInt(0, 2);
      const geometry = ShatterGeometryFactory.createGlassShard(size, complexity, random);
      geometries.push(geometry);
    }
    return geometries;
  }
};

// Shatter material factory
const ShatterMaterialFactory = {
  createGlassShardMaterial: (options: any = {}) => {
    const {
      color = new THREE.Color(0.7, 0.9, 1.0),
      opacity = 0.8,
      refractionRatio = 1.5,
      reflectivity = 0.8
    } = options;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        opacity: { value: opacity },
        refractionRatio: { value: refractionRatio },
        reflectivity: { value: reflectivity },
        shatterProgress: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;

          // Add shatter displacement
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
          // Fresnel effect for glass-like appearance
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

          // Add some color variation based on position
          vec3 finalColor = color;
          finalColor += vec3(sin(vPosition.x * 10.0) * 0.1, cos(vPosition.y * 10.0) * 0.1, sin(vPosition.z * 10.0) * 0.1);

          // Shatter effect
          float shatterEffect = sin(time * 20.0 + vPosition.x * 5.0 + vPosition.y * 5.0) * 0.5 + 0.5;
          finalColor *= (1.0 - shatterProgress * 0.3);

          float finalOpacity = opacity * (0.7 + 0.3 * fresnel) * (1.0 - shatterProgress * 0.2);

          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  },

  createRefractionMaterial: (options: any = {}) => {
    const { color = new THREE.Color(0.5, 0.8, 1.0), intensity = 1.0 } = options;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        intensity: { value: intensity },
        refractionStrength: { value: 0.1 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float intensity;
        uniform float refractionStrength;

        varying vec3 vPosition;
        varying vec3 vNormal;

        void main() {
          // Simulate refraction through glass
          vec3 refractedColor = color;
          refractedColor.r += sin(vPosition.x * 20.0 + time * 5.0) * refractionStrength;
          refractedColor.g += cos(vPosition.y * 20.0 + time * 5.0) * refractionStrength;
          refractedColor.b += sin(vPosition.z * 20.0 + time * 5.0) * refractionStrength;

          // Add some sparkle effect
          float sparkle = sin(vPosition.x * 50.0 + time * 10.0) *
                         cos(vPosition.y * 50.0 + time * 10.0) * 0.5 + 0.5;

          refractedColor += sparkle * intensity * 0.3;

          gl_FragColor = vec4(refractedColor, 0.8);
        }
      `,
      transparent: true
    });
  }
};

// Shatter animation system
const ShatterAnimations = {
  createShardAnimation: (shard: THREE.Mesh, targetPosition: THREE.Vector3, targetRotation: THREE.Euler, duration: number = 2) => {
    const startPosition = shard.position.clone();
    const startRotation = shard.rotation.clone();
    const startTime = Date.now();

    return () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      const easedProgress = easeOut(progress);

      // Interpolate position
      shard.position.lerpVectors(startPosition, targetPosition, easedProgress);

      // Interpolate rotation
      shard.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, easedProgress);
      shard.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, easedProgress);
      shard.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, easedProgress);

      return progress >= 1;
    };
  },

  createExplosionAnimation: (shards: THREE.Mesh[], center: THREE.Vector3, force: number = 10, duration: number = 1) => {
  const prefersReducedMotion = useReducedMotion();
    const animations = shards.map((shard: THREE.Mesh, index: number) => {
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      const distance = 2 + Math.random() * 3;
      const targetPosition = center.clone().add(direction.multiplyScalar(distance));
      const targetRotation = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      return ShatterAnimations.createShardAnimation(shard, targetPosition, targetRotation, duration);
    }    );

    return () => {
      const allComplete = animations.every((animation: () => boolean) => animation());
      return allComplete;
    };
  },

  createReformAnimation: (shards: THREE.Mesh[], originalPositions: THREE.Vector3[], duration: number = 2) => {
    const animations = shards.map((shard: THREE.Mesh, index: number) => {
      const targetPosition = originalPositions[index];
      const targetRotation = new THREE.Euler(0, 0, 0);

      return ShatterAnimations.createShardAnimation(shard, targetPosition, targetRotation, duration);
    });

    return () => {
      const allComplete = animations.every((animation: () => boolean) => animation());
      return allComplete;
    };
  }
};

// Main GlassShatterEffects Component
export interface GlassShatterEffectsProps {
  children?: React.ReactNode;
  className?: string;
  trigger?: 'click' | 'hover' | 'manual' | 'auto';
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

export function GlassShatterEffects({
  children,
  className='',
  trigger = 'click',
  duration = 2,
  intensity = 1,
  shardCount = 12,
  autoReform = true,
  reformDelay = 3000,
  onShatter,
  onReform,
  disabled = false,
  showControls = false,
  seed
}: GlassShatterEffectsProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isShattered, setIsShattered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shards, setShards] = useState<THREE.Mesh[]>([]);
  const [originalPositions, setOriginalPositions] = useState<THREE.Vector3[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<(() => boolean) | null>(null);

  // Initialize shards
  useEffect(() => {
    if (!canvasRef.current) return;

    const seededRandom = new SeededRandom(seed ?? `${shardCount}`);
    const geometries = ShatterGeometryFactory.createShatterField(shardCount, 5, seededRandom);
    const newShards: THREE.Mesh[] = [];
    const positions: THREE.Vector3[] = [];

    geometries.forEach((geometry, index) => {
      const material = ShatterMaterialFactory.createGlassShardMaterial({
        opacity: 0.8 - seededRandom.next() * 0.3,
        refractionRatio: 1.3 + seededRandom.next() * 0.4
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

  // Trigger shatter effect
  const triggerShatter = useCallback(() => {
    if (disabled || isAnimating) return;

    setIsShattered(true);
    setIsAnimating(true);
    onShatter?.();

    // Create explosion animation
    const center = new THREE.Vector3(0, 0, 0);
    const animation = ShatterAnimations.createExplosionAnimation(
      shards,
      center,
      intensity * 10,
      duration
    );

    setCurrentAnimation(() => animation);

    // Auto reform after delay
    if (autoReform) {
      setTimeout(() => {
        triggerReform();
      }, reformDelay);
    }
  }, [disabled, isAnimating, shards, intensity, duration, autoReform, reformDelay, onShatter]);

  // Trigger reform effect
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

  // Manual trigger
  const handleManualTrigger = useCallback(() => {
    if (isShattered) {
      triggerReform();
    } else {
      triggerShatter();
    }
  }, [isShattered, triggerReform, triggerShatter]);

  // Handle different trigger types
  useEffect(() => {
    if (disabled) return;

    const element = containerRef.current;
    if (!element) return;

    const handleClick = () => {
      if (trigger === 'click') {
        handleManualTrigger();
      }
    };

    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        triggerShatter();
      }
    };

    const handleMouseLeave = () => {
      if (trigger === 'hover' && autoReform) {
        setTimeout(() => {
          triggerReform();
        }, reformDelay);
      }
    };

    if (trigger === 'click') {
      element.addEventListener('click', handleClick);
    } else if (trigger === 'hover') {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trigger, disabled, handleManualTrigger, triggerShatter, triggerReform, autoReform, reformDelay]);

  // Auto trigger effect
  useEffect(() => {
    if (trigger === 'auto' && !disabled) {
      const interval = setInterval(() => {
        const prefersReducedMotion = useReducedMotion();
        if (!isAnimating) {
          triggerShatter();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [trigger, disabled, isAnimating, triggerShatter]);

  return (
    <div
      ref={containerRef}
      className={cn("glass-shatter-effects glass-relative glass-overflow-hidden", className)}
      style={{
        position: 'relative',
        cursor: trigger === 'click' ? 'pointer' : 'default'
      }}
    >
      {/* Main content */}
      <div
        className={cn("content glass-transition-opacity glass-duration-300", isShattered ? "glass-opacity-0" : "glass-opacity-100")}
      >
        {children}
      </div>

      {/* Shatter overlay */}
      <AnimatePresence>
        {isShattered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("glass-absolute glass-inset-0 glass-pointer-events-none")}
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

      {/* Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          className={cn("glass-absolute glass-bottom-4 glass-right-4 glass-flex glass-gap-2")}
        >
          <button
            onClick={handleManualTrigger}
            disabled={isAnimating}
            className={cn("glass-p-2 glass-surface-subtle glass-foundation-complete glass-radius-lg glass-border glass-border-primary hover:glass-surface-hover glass-transition-colors disabled:glass-opacity-50")}
            title={isShattered ? 'Reform' : 'Shatter'}
          >
            {isShattered ? <RotateCcw className={cn("glass-w-4 glass-h-4")} /> : <Zap className={cn("glass-w-4 glass-h-4")} />}
          </button>

          {isAnimating && (
            <div className={cn("glass-flex glass-items-center glass-gap-2 glass-px-3 glass-py-2 glass-surface-info glass-foundation-complete glass-radius-lg glass-text-info glass-text-sm")}>
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear'  }}
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

// 3D Shatter Scene Component
function ShatterScene({
  shards,
  currentAnimation,
  setCurrentAnimation,
  setIsAnimating,
  setIsShattered,
  isShattered
}: any) {
  const { scene } = useThree();

  // Add shards to scene
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

  // Animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Update shard materials
    shards.forEach((shard: THREE.Mesh, index: number) => {
      if (shard.material && 'uniforms' in shard.material && shard.material.uniforms) {
        if (typeof shard.material.uniforms === 'object' && 'time' in shard.material.uniforms) (shard.material.uniforms.time as any).value = time;
        if (typeof shard.material.uniforms === 'object' && 'shatterProgress' in shard.material.uniforms) (shard.material.uniforms.shatterProgress as any).value = isShattered ? 1 : 0;
      }
    });

    // Run current animation
    if (currentAnimation) {
      const complete = currentAnimation();
      if (complete) {
        setCurrentAnimation(null);
        setIsAnimating(false);

        if (!isShattered) {
          setIsShattered(false);
        }
      }
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color={0x4488ff} />
    </>
  );
}

// Preset shatter effects
export const shatterPresets = {
  gentle: {
    duration: 1.5,
    intensity: 0.5,
    shardCount: 8,
    autoReform: true,
    reformDelay: 2000
  },
  dramatic: {
    duration: 2.5,
    intensity: 1.2,
    shardCount: 16,
    autoReform: true,
    reformDelay: 4000
  },
  explosive: {
    duration: 3,
    intensity: 2,
    shardCount: 24,
    autoReform: false,
    reformDelay: 6000
  },
  subtle: {
    duration: 1,
    intensity: 0.3,
    shardCount: 6,
    autoReform: true,
    reformDelay: 1500
  }
};

export default GlassShatterEffects;
