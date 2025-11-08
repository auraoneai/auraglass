'use client';
import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";

export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  opacity: number;
  type: "sphere" | "square" | "triangle" | "star" | "custom";
  mass?: number;
  charge?: number;
  trail?: boolean;
  customShape?: React.ReactNode;
}

export interface ParticleEmitter {
  id: string;
  x: number;
  y: number;
  z: number;
  rate: number; // particles per second
  velocity: { min: number; max: number };
  angle: { min: number; max: number };
  size: { min: number; max: number };
  life: { min: number; max: number };
  colors: string[];
  enabled: boolean;
  burst?: {
    count: number;
    interval: number;
  };
}

export interface ParticleForce {
  type: "gravity" | "wind" | "magnetic" | "vortex" | "repulsion" | "attraction";
  strength: number;
  x: number;
  y: number;
  z: number;
  radius?: number;
  enabled: boolean;
}

export interface GlassParticleFieldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Particle emitters */
  emitters: ParticleEmitter[];
  /** Environmental forces */
  forces?: ParticleForce[];
  /** Maximum number of particles */
  maxParticles?: number;
  /** Particle physics enabled */
  physics?: boolean;
  /** Collision detection */
  collisions?: boolean;
  /** Particle trails */
  trails?: boolean;
  /** Background interaction */
  interactive?: boolean;
  /** Mouse interaction force */
  mouseForce?: {
    type: "attraction" | "repulsion";
    strength: number;
    radius: number;
  };
  /** Particle system bounds */
  bounds?: {
    width: number;
    height: number;
    depth: number;
  };
  /** Performance settings */
  performance?: {
    culling: boolean;
    lodDistance: number;
    targetFPS: number;
  };
  /** Visual effects */
  effects?: {
    bloom: boolean;
    blur: boolean;
    glow: boolean;
    sparkle: boolean;
  };
  /** Color scheme */
  colorScheme?: "warm" | "cool" | "rainbow" | "monochrome" | "neon";
  /** Animation speed multiplier */
  speed?: number;
  /** Pause animation */
  paused?: boolean;
  /** Debug mode */
  debug?: boolean;
  /** Event handlers */
  onParticleClick?: (particle: Particle) => void;
  onEmitterTrigger?: (emitter: ParticleEmitter) => void;
  onForceApply?: (force: ParticleForce, particles: Particle[]) => void;
  /** Custom particle renderer */
  renderParticle?: (particle: Particle) => React.ReactNode;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassParticleField = forwardRef<
  HTMLDivElement,
  GlassParticleFieldProps
>(
  (
    {
      emitters,
      forces = [],
      maxParticles = 1000,
      physics = true,
      collisions = false,
      trails = false,
      interactive = true,
      mouseForce,
      bounds = { width: 800, height: 600, depth: 100 },
      performance = {
        culling: true,
        lodDistance: 200,
        targetFPS: 60,
      },
      effects = {
        bloom: true,
        blur: false,
        glow: true,
        sparkle: false,
      },
      colorScheme = "cool",
      speed = 1,
      paused = false,
      debug = false,
      onParticleClick,
      onEmitterTrigger,
      onForceApply,
      renderParticle,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const shouldAnimate = !prefersReducedMotion;
    const particleFieldId = useA11yId("glass-particle-field");

    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(!paused);
    const [frameRate, setFrameRate] = useState(60);
    const [particleCount, setParticleCount] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef(0);
    const frameCountRef = useRef(0);

    // Color schemes
    const colorSchemes = {
      warm: ["#FF6B35", "#F7931E", "#FFD23F", "#FF0080"],
      cool: ["#06B6D4", "var(--glass-color-primary)", "#8B5CF6", "#06FFA5"],
      rainbow: [
        "#FF0080",
        "#FF8000",
        "#FFFF00",
        "#80FF00",
        "#00FF80",
        "#0080FF",
        "#8000FF",
      ],
      monochrome: [
        "var(--glass-white)",
        "var(--glass-gray-200)",
        "var(--glass-gray-400)",
        "var(--glass-gray-500)",
      ],
      neon: ["#39FF14", "#FF073A", "#FF4081", "#00FFFF", "#FF10F0"],
    };

    const colors = colorSchemes[colorScheme];

    // Generate unique particle ID
    const generateParticleId = useCallback(() => {
      return `particle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Create new particle
    const createParticle = useCallback(
      (emitter: ParticleEmitter): Particle => {
        const angle =
          emitter.angle.min +
          Math.random() * (emitter.angle.max - emitter.angle.min);
        const velocity =
          emitter.velocity.min +
          Math.random() * (emitter.velocity.max - emitter.velocity.min);
        const size =
          emitter.size.min +
          Math.random() * (emitter.size.max - emitter.size.min);
        const life =
          emitter.life.min +
          Math.random() * (emitter.life.max - emitter.life.min);
        const color =
          emitter.colors[Math.floor(Math.random() * emitter.colors.length)];

        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        const vz = (Math.random() - 0.5) * velocity * 0.1;

        return {
          id: generateParticleId(),
          x: emitter.x,
          y: emitter.y,
          z: emitter.z,
          vx,
          vy,
          vz,
          size,
          life,
          maxLife: life,
          color,
          opacity: 1,
          type: "sphere",
          mass: size * 0.1,
          charge: 0,
          trail: trails,
        };
      },
      [generateParticleId, trails]
    );

    // Apply force to particle
    const applyForce = useCallback(
      (particle: Particle, force: ParticleForce, deltaTime: number) => {
        if (!force.enabled) return;

        const dx = force.x - particle.x;
        const dy = force.y - particle.y;
        const dz = force.z - particle.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (force.radius && distance > force.radius) return;

        const strength = force.strength * deltaTime * speed;

        switch (force.type) {
          case "gravity":
            particle.vy += strength;
            break;
          case "wind":
            particle.vx += strength;
            break;
          case "attraction":
            if (distance > 0) {
              const forceX = ((dx / distance) * strength) / (distance + 1);
              const forceY = ((dy / distance) * strength) / (distance + 1);
              const forceZ = ((dz / distance) * strength) / (distance + 1);
              particle.vx += forceX;
              particle.vy += forceY;
              particle.vz += forceZ;
            }
            break;
          case "repulsion":
            if (distance > 0) {
              const forceX = (-(dx / distance) * strength) / (distance + 1);
              const forceY = (-(dy / distance) * strength) / (distance + 1);
              const forceZ = (-(dz / distance) * strength) / (distance + 1);
              particle.vx += forceX;
              particle.vy += forceY;
              particle.vz += forceZ;
            }
            break;
          case "vortex":
            const angle = Math.atan2(dy, dx);
            particle.vx += -Math.sin(angle) * strength;
            particle.vy += Math.cos(angle) * strength;
            break;
        }
      },
      [speed]
    );

    // Update particle physics
    const updateParticle = useCallback(
      (particle: Particle, deltaTime: number): Particle | null => {
        // Update life
        particle.life -= deltaTime * speed;
        if (particle.life <= 0) return null;

        // Apply forces
        forces.forEach((force: any) => applyForce(particle, force, deltaTime));

        // Apply mouse force
        if (interactive && mouseForce) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseForce.radius) {
            const strength =
              (mouseForce.strength * deltaTime * speed) / (distance + 1);
            const forceX = (dx / distance) * strength;
            const forceY = (dy / distance) * strength;

            if (mouseForce.type === "attraction") {
              particle.vx += forceX;
              particle.vy += forceY;
            } else {
              particle.vx -= forceX;
              particle.vy -= forceY;
            }
          }
        }

        // Update position
        particle.x += particle.vx * deltaTime * speed;
        particle.y += particle.vy * deltaTime * speed;
        particle.z += particle.vz * deltaTime * speed;

        // Boundary conditions
        if (particle.x < 0 || particle.x > bounds.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > bounds.height) particle.vy *= -0.8;
        if (particle.z < -bounds.depth || particle.z > bounds.depth)
          particle.vz *= -0.8;

        // Clamp to bounds
        particle.x = Math.max(0, Math.min(bounds.width, particle.x));
        particle.y = Math.max(0, Math.min(bounds.height, particle.y));
        particle.z = Math.max(
          -bounds.depth,
          Math.min(bounds.depth, particle.z)
        );

        // Update opacity based on life
        particle.opacity = particle.life / particle.maxLife;

        // Apply damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        particle.vz *= 0.99;

        return particle;
      },
      [
        forces,
        applyForce,
        interactive,
        mouseForce,
        mousePosition,
        speed,
        bounds,
      ]
    );

    // Emit particles
    const emitParticles = useCallback(
      (
        emitter: ParticleEmitter,
        deltaTime: number,
        currentParticles: Particle[]
      ): Particle[] => {
        if (!emitter.enabled || currentParticles.length >= maxParticles)
          return [];

        const newParticles: Particle[] = [];
        const particlesToEmit = Math.floor(emitter.rate * deltaTime);

        for (
          let i = 0;
          i < particlesToEmit &&
          currentParticles.length + newParticles.length < maxParticles;
          i++
        ) {
          newParticles.push(createParticle(emitter));
        }

        if (newParticles.length > 0) {
          onEmitterTrigger?.(emitter);
        }

        return newParticles;
      },
      [maxParticles, createParticle, onEmitterTrigger]
    );

    // Main animation loop
    const animate = useCallback(
      (currentTime: number) => {
        if (!isPlaying || paused) {
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const deltaTime = (currentTime - lastTimeRef.current) / 1000;
        lastTimeRef.current = currentTime;

        // Calculate frame rate
        frameCountRef.current++;
        if (frameCountRef.current % 60 === 0) {
          setFrameRate(Math.round(1 / deltaTime));
        }

        setParticles((currentParticles) => {
          // Update existing particles
          const updatedParticles = currentParticles
            .map((particle: any) => updateParticle(particle, deltaTime))
            .filter((particle): particle is Particle => particle !== null);

          // Emit new particles
          const newParticles = emitters.reduce((acc, emitter) => {
            return [
              ...acc,
              ...emitParticles(emitter, deltaTime, updatedParticles),
            ];
          }, [] as Particle[]);

          const allParticles = [...updatedParticles, ...newParticles];

          // Apply forces globally
          forces.forEach((force: any) => {
            if (force.enabled) {
              onForceApply?.(force, allParticles);
            }
          });

          setParticleCount(allParticles.length);
          return allParticles;
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      },
      [
        isPlaying,
        paused,
        updateParticle,
        emitters,
        emitParticles,
        forces,
        onForceApply,
      ]
    );

    // Start animation
    useEffect(() => {
      if (shouldAnimate && !paused) {
        lastTimeRef.current = (performance as any).now();
        animationFrameRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [shouldAnimate, paused, animate]);

    // Handle mouse movement
    const handleMouseMove = useCallback((event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }, []);

    // Handle particle click
    const handleParticleClick = useCallback(
      (particle: Particle) => {
        onParticleClick?.(particle);
      },
      [onParticleClick]
    );

    // Render particle on canvas
    const renderParticleToCanvas = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        particle: Particle,
        canvas: HTMLCanvasElement
      ) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        // Apply 3D perspective
        const perspective = 500;
        const scale = perspective / (perspective + particle.z);
        const x = particle.x * scale;
        const y = particle.y * scale;
        const size = particle.size * scale;

        // Apply effects
        if (effects.glow) {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = size * 2;
        }

        ctx.fillStyle = particle.color;

        switch (particle.type) {
          case "sphere":
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "square":
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
            break;
          case "triangle":
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case "star":
            const spikes = 5;
            const outerRadius = size / 2;
            const innerRadius = outerRadius * 0.4;
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i * Math.PI) / spikes;
              const px = x + Math.cos(angle) * radius;
              const py = y + Math.sin(angle) * radius;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            break;
        }

        // Render trail
        if (particle.trail && particle.vx !== 0 && particle.vy !== 0) {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = size * 0.1;
          ctx.globalAlpha = particle.opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - particle.vx * 5, y - particle.vy * 5);
          ctx.stroke();
        }

        ctx.restore();
      },
      [effects]
    );

    // Render to canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = bounds.width;
      canvas.height = bounds.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply effects
      if (effects.blur) {
        ctx.filter = "blur(1px)";
      }

      // Render particles
      particles.forEach((particle: any) => {
        if (renderParticle) {
          // Custom rendering would be handled differently in React
        } else {
          renderParticleToCanvas(ctx, particle, canvas);
        }
      });

      // Render debug info
      if (debug) {
        ctx.fillStyle =
          "rgba(var(--glass-color-white) / var(--glass-opacity-80))";
        ctx.font = "12px monospace";
        ctx.fillText(`Particles: ${particles.length}`, 10, 20);
        ctx.fillText(`FPS: ${frameRate}`, 10, 40);
        ctx.fillText(
          `Emitters: ${emitters.filter((e: any) => e.enabled).length}`,
          10,
          60
        );
        ctx.fillText(
          `Forces: ${forces.filter((f: any) => f.enabled).length}`,
          10,
          80
        );
      }
    }, [
      particles,
      bounds,
      effects,
      renderParticle,
      renderParticleToCanvas,
      debug,
      frameRate,
      emitters,
      forces,
    ]);

    return (
      <OptimizedGlass
        ref={ref}
        id={particleFieldId}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-particle-field relative glass-radius-lg glass-backdrop-blur-md border border-border/20 overflow-hidden",
          className
        )}
        style={{ width: bounds.width, height: bounds.height }}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className="relative glass-w-full glass-h-full"
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 glass-w-full glass-h-full"
            style={{
              filter: effects.bloom
                ? "drop-shadow(0 0 10px var(--glass-color-primary, 0.3))"
                : undefined,
            }}
          />

          {/* React Particles (for custom rendering) */}
          {renderParticle && (
            <div className="absolute inset-0 pointer-events-none">
              {particles.map((particle: any) => (
                <div
                  key={particle.id}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    left: particle.x - particle.size / 2,
                    top: particle.y - particle.size / 2,
                    transform: `translateZ(${particle.z}px) scale(${500 / (500 + particle.z)})`,
                    opacity: particle.opacity,
                  }}
                  onClick={() => handleParticleClick(particle)}
                >
                  {renderParticle(particle)}
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <OptimizedGlass
              elevation="level3"
              intensity="strong"
              depth={2}
              tint="neutral"
              border="subtle"
              className="glass-flex glass-items-center glass-gap-2 glass-px-4 glass-py-2 glass-radius-lg glass-glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="glass-p-2 glass-radius-md hover:glass-surface-overlay transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <div className="glass-text-xs glass-text-secondary">
                Particles: {particleCount}
              </div>

              {debug && (
                <div className="glass-text-xs glass-text-secondary">
                  FPS: {frameRate}
                </div>
              )}
            </OptimizedGlass>
          </div>

          {/* Mouse force indicator */}
          {interactive && mouseForce && (
            <div
              className="absolute glass-radius-full glass-border glass-border-primary/30 pointer-events-none"
              style={{
                left: mousePosition.x - mouseForce.radius,
                top: mousePosition.y - mouseForce.radius,
                width: mouseForce.radius * 2,
                height: mouseForce.radius * 2,
                backgroundColor:
                  mouseForce.type === "attraction"
                    ? "var(--glass-color-primary, 0.1)"
                    : "var(--glass-color-danger, 0.1)",
              }}
            />
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassParticleField.displayName = "GlassParticleField";

export default GlassParticleField;