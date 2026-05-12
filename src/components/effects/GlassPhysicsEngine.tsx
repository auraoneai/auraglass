"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * Advanced Physics-Based Glass Effects Engine
 * Creates realistic glass interactions with physics simulation
 */

import React, { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "../../lib/utilsComprehensive";
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Physics simulation parameters
interface PhysicsConfig {
  gravity: number;
  friction: number;
  elasticity: number;
  viscosity: number;
  refractionIndex: number;
  density: number;
}

// Glass interaction types
type GlassInteraction =
  | "ripple"
  | "shatter"
  | "bend"
  | "melt"
  | "freeze"
  | "vibrate";

// Particle system for glass effects
interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
  type: "fragment" | "droplet" | "spark" | "dust";
}

interface GlassPhysicsEngineProps {
  children: React.ReactNode;
  className?: string;
  interaction?: GlassInteraction;
  physics?: Partial<PhysicsConfig>;
  enabled?: boolean;
  intensity?: number;
  autoTrigger?: boolean;
  /** Repeat autoTrigger for catalog/docs demos instead of firing only once. */
  autoRepeat?: boolean;
  triggerDelay?: number;
  /** Whether to honor reduced-motion settings for animation. */
  respectMotionPreference?: boolean;
  onInteractionStart?: (type: GlassInteraction) => void;
  onInteractionEnd?: (type: GlassInteraction) => void;
}

const defaultPhysics: PhysicsConfig = {
  gravity: 0.5,
  friction: 0.98,
  elasticity: 0.7,
  viscosity: 0.1,
  refractionIndex: 1.5,
  density: 2.5,
};

export const GlassPhysicsEngine: React.FC<GlassPhysicsEngineProps> = ({
  children,
  className = "",
  interaction = "ripple",
  physics = {},
  enabled = true,
  intensity = 1,
  autoTrigger = false,
  autoRepeat = false,
  triggerDelay = 2000,
  respectMotionPreference = true,
  onInteractionStart,
  onInteractionEnd,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = respectMotionPreference ? !prefersReducedMotion : true;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const physicsConfig = { ...defaultPhysics, ...physics };

  // Transform mouse position to rotation
  const rotateXTransform = useTransform(y, [-300, 300], [15, -15]);
  const rotateYTransform = useTransform(x, [-300, 300], [-15, 15]);

  // Create particle system
  const createParticles = useCallback(
    (
      centerX: number,
      centerY: number,
      count: number,
      type: Particle["type"]
    ) => {
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const velocity = 2 + Math.random() * 4 * intensity;
        const life = 60 + Math.random() * 120;

        newParticles.push({
          id: `particle-${Date.now()}-${i}`,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: life,
          maxLife: life,
          size: 2 + Math.random() * 4,
          opacity: 1,
          color: `hsl(${180 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`,
          type,
        });
      }

      return newParticles;
    },
    [intensity]
  );

  // Update particle physics
  const updateParticles = useCallback(
    (particles: Particle[]) => {
      return particles
        .map((particle: any) => {
          // Apply gravity and friction
          particle.vy += physicsConfig.gravity;
          particle.vx *= physicsConfig.friction;
          particle.vy *= physicsConfig.friction;

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Update life
          particle.life--;
          particle.opacity = particle.life / particle.maxLife;

          // Boundary collision with elasticity
          if (containerRef.current) {
            const bounds = containerRef.current.getBoundingClientRect();

            if (particle.x <= 0 || particle.x >= bounds.width) {
              particle.vx *= -physicsConfig.elasticity;
              particle.x = Math.max(0, Math.min(bounds.width, particle.x));
            }

            if (particle.y <= 0 || particle.y >= bounds.height) {
              particle.vy *= -physicsConfig.elasticity;
              particle.y = Math.max(0, Math.min(bounds.height, particle.y));
            }
          }

          return particle;
        })
        .filter((particle: any) => particle.life > 0);
    },
    [physicsConfig]
  );

  // Render particles to canvas
  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render particles
    particles.forEach((particle: any) => {
      ctx.save();

      // Set particle properties
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;

      // Draw particle based on type
      switch (particle.type) {
        case "fragment":
          ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          break;
        case "droplet":
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "spark":
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.vx, particle.y - particle.vy);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
          break;
        case "dust":
          ctx.globalAlpha = particle.opacity * 0.3;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    });
  }, [particles]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isAnimating) return;

    setParticles((prevParticles) => {
      const updated = updateParticles(prevParticles);

      if (updated.length === 0) {
        setIsAnimating(false);
        onInteractionEnd?.(interaction);
        return [];
      }

      return updated;
    });

    renderParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    isAnimating,
    updateParticles,
    renderParticles,
    interaction,
    onInteractionEnd,
  ]);

  // Start animation loop
  useEffect(() => {
    if (isAnimating) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animate]);

  // Handle different interaction types
  const triggerInteraction = useCallback(
    (
      clientX: number,
      clientY: number,
      interactionType: GlassInteraction = interaction
    ) => {
      if (!enabled || !shouldAnimate || !containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;

      onInteractionStart?.(interactionType);

      switch (interactionType) {
        case "ripple":
          // Create ripple effect
          controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.8, ease: "easeOut" },
          });

          // Add ripple particles
          const rippleParticles = createParticles(
            x,
            y,
            20 * intensity,
            "droplet"
          );
          setParticles(rippleParticles);
          setIsAnimating(true);
          break;

        case "shatter":
          // Create shatter effect
          controls.start({
            scale: [1, 0.95, 1.02, 1],
            rotateX: [0, 2, -1, 0],
            rotateY: [0, -1, 2, 0],
            transition: { duration: 1.2, ease: "easeOut" },
          });

          // Add glass fragments
          const fragments = createParticles(x, y, 50 * intensity, "fragment");
          setParticles(fragments);
          setIsAnimating(true);
          break;

        case "bend":
          // Create bending effect
          const bendX = ((x - bounds.width / 2) / bounds.width) * 20;
          const bendY = ((y - bounds.height / 2) / bounds.height) * 20;

          controls.start({
            rotateX: [0, bendY, 0],
            rotateY: [0, bendX, 0],
            transition: { duration: 1.5, ease: "easeInOut" },
          });
          break;

        case "melt":
          // Create melting effect
          controls.start({
            scaleY: [1, 0.8, 1],
            y: [0, 10, 0],
            transition: { duration: 2, ease: "easeInOut" },
          });

          // Add droplet particles
          const droplets = createParticles(x, y, 15 * intensity, "droplet");
          setParticles(droplets);
          setIsAnimating(true);
          break;

        case "freeze":
          // Create freezing effect
          controls.start({
            scale: [1, 0.98, 1.01, 1],
            transition: { duration: 1, ease: "easeOut" },
          });

          // Add frost particles
          const frost = createParticles(x, y, 30 * intensity, "dust");
          setParticles(frost);
          setIsAnimating(true);
          break;

        case "vibrate":
          // Create vibration effect
          controls.start({
            x: [0, 2, -2, 1, -1, 0],
            y: [0, 1, -1, 2, -2, 0],
            transition: { duration: 0.5, ease: "easeOut" },
          });

          // Add vibration sparks
          const sparks = createParticles(x, y, 10 * intensity, "spark");
          setParticles(sparks);
          setIsAnimating(true);
          break;
      }
    },
    [
      enabled,
      shouldAnimate,
      interaction,
      intensity,
      controls,
      createParticles,
      onInteractionStart,
    ]
  );

  // Handle mouse interactions
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX - bounds.left - bounds.width / 2;
      const mouseY = event.clientY - bounds.top - bounds.height / 2;

      x.set(mouseX);
      y.set(mouseY);

      // Update rotation based on mouse position
      rotateX.set(rotateXTransform.get());
      rotateY.set(rotateYTransform.get());
    },
    [x, y, rotateX, rotateY, rotateXTransform, rotateYTransform]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      triggerInteraction(event.clientX, event.clientY);
    },
    [triggerInteraction]
  );

  // Auto-trigger effect
  useEffect(() => {
    if (autoTrigger && enabled && shouldAnimate) {
      const run = () => {
        if (containerRef.current) {
          const bounds = containerRef.current.getBoundingClientRect();
          triggerInteraction(
            bounds.left + bounds.width / 2,
            bounds.top + bounds.height / 2
          );
        }
      };

      const timer = setTimeout(run, triggerDelay);
      const interval = autoRepeat
        ? setInterval(run, Math.max(triggerDelay * 3, 900))
        : undefined;

      return () => {
        clearTimeout(timer);
        if (interval) clearInterval(interval);
      };
    }
  }, [
    autoTrigger,
    autoRepeat,
    enabled,
    shouldAnimate,
    triggerDelay,
    triggerInteraction,
  ]);

  // Setup canvas
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      const resizeCanvas = () => {
        const bounds = container.getBoundingClientRect();
        canvas.width = bounds.width;
        canvas.height = bounds.height;
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={cn("glass-relative glass-overflow-hidden", className)}
      style={{
        ...{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        },
      }}
      animate={controls}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        data-glass-overlay="true"
        className={cn(
          "glass-absolute glass-inset-0 glass-pointer-events-none glass-z-10"
        )}
        style={{ ...{ mixBlendMode: "screen" } }}
      />

      {/* Glass content */}
      <motion.div
        style={{
          ...{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          },
        }}
        className={cn("glass-relative glass-z-0")}
      >
        {children}
      </motion.div>

      {/* Interaction indicators */}
      {isAnimating && (
        <div
          data-glass-overlay="true"
          className={cn(
            "glass-absolute glass-inset-0 glass-pointer-events-none glass-z-20"
          )}
        >
          <div
            className={cn(
              "glass-absolute glass-inset-0 glass-bg-gradient-radial glass-from-white/10 glass-via-transparent glass-to-transparent glass-opacity-50 glass-animate-pulse"
            )}
          />
        </div>
      )}
    </motion.div>
  );
};

// Specialized physics components
export const ShatterGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="shatter" />;

export const RippleGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="ripple" />;

export const BendGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="bend" />;

export const MeltGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="melt" />;

export const FreezeGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="freeze" />;

export const VibrateGlass: React.FC<
  Omit<GlassPhysicsEngineProps, "interaction">
> = (props) => <GlassPhysicsEngine {...props} interaction="vibrate" />;

export default GlassPhysicsEngine;
