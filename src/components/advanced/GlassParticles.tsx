/**
 * AuraGlass Glassmorphic Particles System
 * Interactive particle effects with glass aesthetics
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  forwardRef,
} from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "../../utils/a11y";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  connections: number[];
}

interface GlassParticlesProps {
  className?: string;
  count?: number;
  maxSize?: number;
  minSize?: number;
  speed?: number;
  connectionDistance?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  colorScheme?: "monochrome" | "rainbow" | "gradient" | "custom";
  colors?: string[];
  blur?: boolean;
  glow?: boolean;
  shape?: "circle" | "square" | "triangle" | "star";
  behavior?: "float" | "swarm" | "orbit" | "explode" | "gravity";
  emitRate?: number;
  lifetime?: number;
  /** Accessible label for the particle system */
  "aria-label"?: string;
  /** Reduced motion preference */
  respectMotionPreference?: boolean;
}

export const GlassParticles = forwardRef<HTMLDivElement, GlassParticlesProps>(
  (
    {
      className,
      count = 50,
      maxSize = 8,
      minSize = 2,
      speed = 1,
      connectionDistance = 100,
      mouseInteraction = true,
      mouseRadius = 150,
      colorScheme = "gradient",
      colors = ["var(--glass-color-primary)", "#8b5cf6", "#ec4899"],
      blur = true,
      glow = true,
      shape = "circle",
      behavior = "float",
      emitRate = 0,
      lifetime = 0,
      "aria-label": ariaLabel,
      respectMotionPreference = true,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mousePos = useRef({ x: -1000, y: -1000 });
    const frame = useRef(0);
    const lastEmit = useRef(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const componentId = useA11yId("glass-particles");
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
      if (!respectMotionPreference) return;
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, [respectMotionPreference]);

    // Initialize particles
    const initParticles = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      particles.current = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: 0.3 + Math.random() * 0.7,
        hue: Math.random() * 360,
        life: lifetime > 0 ? Math.random() * lifetime : Infinity,
        maxLife: lifetime,
        connections: [],
      }));
    }, [count, maxSize, minSize, speed, lifetime]);

    // Handle resize
    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        setDimensions({ width: canvas.width, height: canvas.height });

        // Reinitialize particles on resize
        initParticles();
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [initParticles]);

    // Mouse interaction
    useEffect(() => {
      if (!mouseInteraction) return;

      const handleMouseMove = (e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      const handleMouseLeave = () => {
        mousePos.current = { x: -1000, y: -1000 };
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [mouseInteraction]);

    // Draw particle shape
    const drawParticle = useCallback(
      (ctx: CanvasRenderingContext2D, particle: Particle, color: string) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);

        // Apply glow effect
        if (glow) {
          ctx.shadowBlur = particle.size * 2;
          ctx.shadowColor = color;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);

        switch (shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "square":
            ctx.fillRect(
              -particle.size,
              -particle.size,
              particle.size * 2,
              particle.size * 2
            );
            break;

          case "triangle":
            ctx.beginPath();
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(-particle.size, particle.size);
            ctx.lineTo(particle.size, particle.size);
            ctx.closePath();
            ctx.fill();
            break;

          case "star":
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = ((i * 72 - 90) * Math.PI) / 180;
              const x = Math.cos(angle) * particle.size;
              const y = Math.sin(angle) * particle.size;
              i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);

              const innerAngle = ((i * 72 + 36 - 90) * Math.PI) / 180;
              const innerX = Math.cos(innerAngle) * (particle.size / 2);
              const innerY = Math.sin(innerAngle) * (particle.size / 2);
              ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      },
      [shape, glow]
    );

    // Get particle color
    const getParticleColor = useCallback(
      (particle: Particle, index: number) => {
        switch (colorScheme) {
          case "monochrome":
            return `hsla(220, 70%, 60%, ${particle.opacity})`;

          case "rainbow":
            return `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;

          case "gradient":
            const colorIndex = Math.floor(
              (index / particles.current.length) * colors.length
            );
            return colors[Math.min(colorIndex, colors.length - 1)];

          case "custom":
            return colors[index % colors.length];

          default:
            return `hsla(220, 70%, 60%, ${particle.opacity})`;
        }
      },
      [colorScheme, colors]
    );

    // Update particle behavior
    const updateParticle = useCallback(
      (particle: Particle, canvas: HTMLCanvasElement) => {
        switch (behavior) {
          case "float":
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Add gentle floating motion
            particle.y += Math.sin(frame.current * 0.01 + particle.id) * 0.2;
            particle.x += Math.cos(frame.current * 0.01 + particle.id) * 0.1;
            break;

          case "swarm":
            // Particles attract to center of mass
            const centerX =
              particles.current.reduce((sum, p) => sum + p.x, 0) /
              particles.current.length;
            const centerY =
              particles.current.reduce((sum, p) => sum + p.y, 0) /
              particles.current.length;

            const toCenterX = (centerX - particle.x) * 0.0005;
            const toCenterY = (centerY - particle.y) * 0.0005;

            particle.vx += toCenterX;
            particle.vy += toCenterY;
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Limit velocity
            const maxVel = 2;
            const vel = Math.sqrt(
              particle.vx * particle.vx + particle.vy * particle.vy
            );
            if (vel > maxVel) {
              particle.vx = (particle.vx / vel) * maxVel;
              particle.vy = (particle.vy / vel) * maxVel;
            }
            break;

          case "orbit":
            const centerOX = canvas.width / 2;
            const centerOY = canvas.height / 2;
            const angle = Math.atan2(
              particle.y - centerOY,
              particle.x - centerOX
            );
            const radius = Math.sqrt(
              Math.pow(particle.x - centerOX, 2) +
                Math.pow(particle.y - centerOY, 2)
            );

            const newAngle = angle + 0.01 * speed;
            particle.x = centerOX + Math.cos(newAngle) * radius;
            particle.y = centerOY + Math.sin(newAngle) * radius;
            break;

          case "explode":
            const explodeX = canvas.width / 2;
            const explodeY = canvas.height / 2;
            const dx = particle.x - explodeX;
            const dy = particle.y - explodeY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
              particle.vx = (dx / dist) * speed * 2;
              particle.vy = (dy / dist) * speed * 2;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98; // Decay
            particle.vy *= 0.98;
            break;

          case "gravity":
            particle.vy += 0.1; // Gravity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off bottom
            if (particle.y > canvas.height - particle.size) {
              particle.y = canvas.height - particle.size;
              particle.vy *= -0.8; // Energy loss
            }
            break;
        }

        // Mouse interaction
        if (mouseInteraction) {
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            particle.vx -= (dx / distance) * force * 2;
            particle.vy -= (dy / distance) * force * 2;
          }
        }

        // Boundary conditions
        if (behavior !== "gravity") {
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Update life
        if (lifetime > 0) {
          particle.life -= 1;

          if (particle.life <= 0) {
            // Respawn particle
            particle.x = Math.random() * canvas.width;
            particle.y =
              behavior === "gravity" ? 0 : Math.random() * canvas.height;
            particle.vx = (Math.random() - 0.5) * speed;
            particle.vy = (Math.random() - 0.5) * speed;
            particle.life = lifetime;
          }
        }
      },
      [behavior, speed, mouseInteraction, mouseRadius, lifetime]
    );

    // Animation loop
    useAnimationFrame((time) => {
      if (prefersReducedMotion) return; // Skip animation if user prefers reduced motion

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      frame.current += 1;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply blur filter if enabled
      if (blur) {
        ctx.filter = "blur(0.5px)";
      }

      // Update and draw particles
      particles.current.forEach((particle, i) => {
        updateParticle(particle, canvas);

        // Find connections
        particle.connections = [];
        particles.current.forEach((other, j) => {
          if (i === j) return;

          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            particle.connections.push(j);

            // Draw connection
            const opacity = (1 - distance / connectionDistance) * 0.2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw particle
        const color = getParticleColor(particle, i);
        drawParticle(ctx, particle, color);
      });

      // Emit new particles
      if (emitRate > 0 && time - lastEmit.current > 1000 / emitRate) {
        const newParticle: Particle = {
          id: particles.current.length,
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * speed * 2,
          vy: (Math.random() - 0.5) * speed * 2,
          size: minSize + Math.random() * (maxSize - minSize),
          opacity: 1,
          hue: Math.random() * 360,
          life: lifetime || Infinity,
          maxLife: lifetime || Infinity,
          connections: [],
        };

        particles.current.push(newParticle);

        // Remove oldest if too many
        if (particles.current.length > count * 2) {
          particles.current.shift();
        }

        lastEmit.current = time;
      }
    });

    return (
      <div
        ref={ref}
        id={componentId}
        className={cn("relative overflow-hidden", className)}
        role="presentation"
        aria-label={ariaLabel || "Interactive particle effects"}
        aria-hidden={!ariaLabel}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 glass-w-full glass-h-full"
          aria-hidden="true"
        />

        {/* Glass overlay */}
        <OptimizedGlass
          className="absolute inset-0 pointer-events-none opacity-30"
          intent="neutral"
          elevation="level1"
          blur="subtle"
          intensity="medium"
        />
      </div>
    );
  }
);

// Particle emitter component
export const GlassParticleEmitter = forwardRef<
  HTMLDivElement,
  GlassParticlesProps & {
    children?: React.ReactNode;
    trigger?: "hover" | "click" | "always";
  }
>(({ children, className, trigger = "hover", ...particleProps }, ref) => {
  const [isActive, setIsActive] = useState(trigger === "always");

  const handleInteraction = useCallback(() => {
    if (trigger === "click") {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    }
  }, [trigger]);

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onMouseEnter={() => trigger === "hover" && setIsActive(true)}
      onMouseLeave={() => trigger === "hover" && setIsActive(false)}
      onClick={handleInteraction}
      role="presentation"
    >
      {isActive && (
        <GlassParticles className="absolute inset-0" {...particleProps} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

// Preset configurations
export const particlePresets = {
  stars: {
    count: 100,
    maxSize: 3,
    minSize: 1,
    speed: 0.2,
    colorScheme: "monochrome" as const,
    shape: "circle" as const,
    behavior: "float" as const,
    glow: true,
  },
  fireflies: {
    count: 30,
    maxSize: 4,
    minSize: 2,
    speed: 0.5,
    colorScheme: "gradient" as const,
    colors: [
      "var(--glass-color-warning-light)",
      "var(--glass-color-warning)",
      "#fde047",
    ],
    shape: "circle" as const,
    behavior: "swarm" as const,
    glow: true,
    blur: true,
  },
  snow: {
    count: 80,
    maxSize: 6,
    minSize: 2,
    speed: 0.3,
    colorScheme: "monochrome" as const,
    shape: "circle" as const,
    behavior: "gravity" as const,
    glow: false,
    blur: true,
  },
  confetti: {
    count: 50,
    maxSize: 8,
    minSize: 4,
    speed: 2,
    colorScheme: "rainbow" as const,
    shape: "square" as const,
    behavior: "explode" as const,
    lifetime: 100,
    emitRate: 10,
  },
  matrix: {
    count: 60,
    maxSize: 10,
    minSize: 4,
    speed: 1,
    colorScheme: "custom" as const,
    colors: ["var(--glass-color-success)", "#22c55e", "#16a34a"],
    shape: "square" as const,
    behavior: "gravity" as const,
    glow: true,
  },
};
