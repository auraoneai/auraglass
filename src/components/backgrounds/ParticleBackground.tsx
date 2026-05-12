"use client";
/**
 * ParticleBackground Component
 *
 * A dynamic background with animated particles.
 */
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

import { OptimizedGlass } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useA11yId } from "../../utils/a11y";
import { ParticleBackgroundProps } from "./types";
import { ANIMATION } from "../../tokens/designConstants";
import styles from "./ParticleBackground.module.css";

// Particle interface
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

/**
 * ParticleBackground Component Implementation
 */
const ParticleBackgroundComponent = (
  props: ParticleBackgroundProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const {
    children,
    className,
    style,
    baseColor = "color-mix(in srgb, var(--glass-black) 80%, transparent)",
    particleColor = "color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)",
    particleCount = 50,
    particleSize = 2,
    particleSpeed = 1,
    connectParticles = true,
    interactive = true,
    blur = false,
    blurAmount = 5,
    count,
    size,
    speed,
    color,
    intent = "neutral",
    elevation = "level2",
    tier = "medium",
    respectMotionPreference = true,
    ...rest
  } = props;

  // Accessibility and motion preferences
  const componentId = useA11yId("particle-bg");
  const prefersReducedMotion = useReducedMotion();
  const { prefersReducedMotion: motionPrefersReduced } =
    useMotionPreferenceContext();

  // Determine if motion should be reduced based on all preferences
  const shouldReduceMotion =
    respectMotionPreference && (prefersReducedMotion || motionPrefersReduced);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // State for mouse position
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // CRITICAL SSR FIX: Initialize particles as empty array, populate in useEffect
  // This prevents Math.random() from generating different values on server vs client
  const [particles, setParticles] = useState<Particle[]>([]);

  // Use correct property names with fallbacks
  const actualCount = count ?? particleCount ?? 50;
  const actualSize = size ?? particleSize ?? 2;
  const actualSpeed = speed ?? particleSpeed ?? 1;
  const actualColor =
    color ??
    particleColor ??
    "color-mix(in srgb, var(--glass-white) var(--glass-opacity-70), transparent)";

  // Helper function to get color values from CSS variables or color-mix
  const getColorValues = (
    colorStr: string
  ): { r: number; g: number; b: number; a?: number } => {
    if (colorStr.startsWith("rgba(")) {
      const match = colorStr.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
          a: match[4] ? parseFloat(match[4]) : 1,
        };
      }
    }
    if (
      colorStr.includes("var(--glass-white)") ||
      colorStr.includes("color-mix")
    ) {
      // For CSS variables, extract white RGB values (255, 255, 255)
      // In a real implementation, you'd parse the CSS variable at runtime
      return { r: 255, g: 255, b: 255, a: 0.7 };
    }
    // Default fallback - use CSS variable white
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  // CRITICAL SSR FIX: Generate particles only on client-side mount
  // This ensures deterministic behavior and prevents server/client mismatches
  useEffect(() => {
    const newParticles: Particle[] = [];

    for (let i = 0; i < actualCount; i++) {
      newParticles.push({
        x: Math.random() * 100, // Percentage
        y: Math.random() * 100, // Percentage
        size: Math.random() * actualSize + 1,
        speedX: (Math.random() - 0.5) * actualSpeed * 0.1,
        speedY: (Math.random() - 0.5) * actualSpeed * 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        color: actualColor,
      });
    }

    setParticles(newParticles);
  }, [actualCount, actualSize, actualSpeed, actualColor]);

  // Handle canvas animation
  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.max(
        1,
        Math.round(width || container.clientWidth || 320)
      );
      canvas.height = Math.max(
        1,
        Math.round(height || container.clientHeight || 220)
      );
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Convert percentage to actual coordinates
        const x = (particle.x / 100) * canvas.width;
        const y = (particle.y / 100) * canvas.height;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        const colorValues = getColorValues(particle.color);
        ctx.fillStyle = `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        if (connectParticles) {
          for (let j = index + 1; j < particles.length; j++) {
            const otherParticle = particles[j];
            const otherX = (otherParticle.x / 100) * canvas.width;
            const otherY = (otherParticle.y / 100) * canvas.height;

            const distance = Math.sqrt(
              Math.pow(x - otherX, 2) + Math.pow(y - otherY, 2)
            );

            if (distance < canvas.width * 0.07) {
              ctx.beginPath();
              const connectionOpacity =
                0.3 - (distance / (canvas.width * 0.07)) * 0.3;
              ctx.strokeStyle = `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, ${connectionOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(x, y);
              ctx.lineTo(otherX, otherY);
              ctx.stroke();
            }
          }
        }

        // Connect to mouse if interactive and motion is allowed
        if (interactive && mousePosition && !shouldReduceMotion) {
          const mouseX = mousePosition.x * canvas.width;
          const mouseY = mousePosition.y * canvas.height;

          const distance = Math.sqrt(
            Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
          );

          if (distance < canvas.width * 0.1) {
            ctx.beginPath();
            const mouseConnectionOpacity =
              0.5 - (distance / (canvas.width * 0.1)) * 0.5;
            ctx.strokeStyle = `rgba(${colorValues.r}, ${colorValues.g}, ${colorValues.b}, ${mouseConnectionOpacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(x, y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Handle boundaries
        if (particle.x < 0 || particle.x > 100) {
          particle.speedX *= -1;
        }

        if (particle.y < 0 || particle.y > 100) {
          particle.speedY *= -1;
        }
      });

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    particles,
    connectParticles,
    interactive,
    mousePosition,
    shouldReduceMotion,
  ]);

  // Handle mouse movement
  useEffect(() => {
    if (!interactive || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [interactive, shouldReduceMotion]);

  // Combine external ref with internal containerRef
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      if (containerRef.current !== node) {
        (
          containerRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
      }
      if (ref) {
        if (typeof ref === "function") {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
    },
    [ref]
  );

  const blurStyle = useMemo(
    () =>
      ({
        "--particle-blur": blur ? `blur(${blurAmount}px)` : "none",
      }) as React.CSSProperties,
    [blur, blurAmount]
  );

  return (
    <OptimizedGlass
      ref={setRefs}
      className={cn(styles.container, "glass-particle-background", className)}
      intent={intent as any}
      elevation={elevation as any}
      tier={tier as any}
      style={{
        width: typeof style?.width === "undefined" ? "100%" : style.width,
        minHeight:
          typeof style?.height === "undefined" &&
          typeof style?.minHeight === "undefined"
            ? 220
            : style.minHeight,
        ...(style || {}),
      }}
      id={componentId}
      role="img"
      aria-label={`Interactive particle background with ${actualCount} ${connectParticles ? "connected" : "floating"} particles${interactive && !shouldReduceMotion ? ", responding to mouse movement" : ""}`}
      tabIndex={interactive ? 0 : -1}
      {...rest}
    >
      <div
        className={styles.backgroundLayer}
        style={{ backgroundColor: baseColor }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className={styles.canvas}
      />
      <div
        aria-hidden="true"
        className={styles.blurLayer}
        style={{ ...blurStyle }}
      />
      <div className={styles.contentLayer}>{children}</div>
    </OptimizedGlass>
  );
};

// Wrap the component function with forwardRef
const ParticleBackground = forwardRef(ParticleBackgroundComponent);
ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;
