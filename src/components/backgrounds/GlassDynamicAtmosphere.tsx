"use client";
import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

import { ZLayer } from "../../core/zspace";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import styles from "./GlassDynamicAtmosphere.module.css";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const applyAlpha = (color: string, alpha: number) => {
  if (!color)
    return `color-mix(in srgb, var(--glass-black) ${clamp01(alpha) * 100}%, transparent)`;
  if (color.startsWith("#")) {
    // For hex colors, convert to CSS variable or use color-mix
    const normalized = color.replace("#", "");
    if (normalized.length === 3 || normalized.length === 6) {
      // Use color-mix with the hex color
      return `color-mix(in srgb, ${color} ${clamp01(alpha) * 100}%, transparent)`;
    }
  }
  // If already a CSS variable or color-mix, append alpha
  if (color.includes("var(") || color.includes("color-mix")) {
    return color; // Assume it already handles opacity
  }
  return color;
};

// Types of atmospheric effects
export type AtmosphereType =
  | "subtle"
  | "nebula"
  | "aurora"
  | "particles"
  | "waves"
  | "gradient"
  | "ambient"
  | "custom";

// Interaction modes for the atmosphere
export type InteractionMode = "none" | "mouse" | "scroll" | "audio" | "time";

export interface DynamicAtmosphereProps {
  /**
   * The type of atmospheric effect
   */
  type?: AtmosphereType;

  /**
   * Primary color for the atmosphere
   */
  primaryColor?: string;

  /**
   * Secondary color for the atmosphere
   */
  secondaryColor?: string;

  /**
   * Accent color for the atmosphere
   */
  accentColor?: string;

  /**
   * The intensity of the effect (0-1)
   */
  intensity?: number;

  /**
   * The speed of the animation (0-1)
   */
  speed?: number;

  /**
   * The interaction mode for the atmosphere
   */
  interactionMode?: InteractionMode;

  /**
   * The sensitivity of the interaction (0-1)
   */
  interactionSensitivity?: number;

  /**
   * If true, the atmosphere will fill its container
   */
  fullSize?: boolean;

  /**
   * Width of the atmosphere
   */
  width?: string | number;

  /**
   * Height of the atmosphere
   */
  height?: string | number;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Z-index for the atmosphere
   */
  zIndex?: number;

  /**
   * The position of the atmosphere
   */
  position?: "absolute" | "fixed" | "relative";

  /**
   * If true, respect reduced motion preferences
   */
  respectReducedMotion?: boolean;

  /**
   * The number of elements to create for particle-based effects
   */
  particleCount?: number;

  /**
   * Optional custom element to use for particles
   */
  particleElement?: React.ReactNode;

  /**
   * If true, the atmosphere will have a blur effect
   */
  blur?: boolean;

  /**
   * The strength of the blur effect (px)
   */
  blurStrength?: number;

  /**
   * If true, the atmosphere will have a noise texture
   */
  noise?: boolean;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";

  /** Optional inline styles applied to the container */
  style?: React.CSSProperties;
}

/**
 * DynamicAtmosphere Component
 *
 * A component that creates dynamic atmospheric background effects.
 */
export const DynamicAtmosphere = forwardRef<
  HTMLDivElement,
  DynamicAtmosphereProps
>((props, ref) => {
  const {
    type = "subtle",
    primaryColor = "#6366F1", // Primary (purple)
    secondaryColor = "var(--glass-color-primary)", // Secondary (blue)
    accentColor = "var(--glass-color-success)", // Accent (green)
    intensity = 0.5,
    speed = 1,
    interactionMode = "none",
    interactionSensitivity = 0.5,
    fullSize = true,
    width = "100%",
    height = "100%",
    style,
    className,
    zIndex = ZLayer.Background,
    position = "absolute",
    respectReducedMotion = true,
    particleCount = 20,
    blur = false,
    blurStrength = 5,
    noise = false,
    ...rest
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = respectReducedMotion && prefersReducedMotion;
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("");

  // Compute and inject CSS variables for backgrounds to avoid inline glass literals
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const i = intensity;
    const pc = primaryColor;
    const sc = secondaryColor;
    const ac = accentColor;

    let bg = "";
    if (type === "subtle") {
      bg = `radial-gradient(circle at 50% 50%, ${applyAlpha(pc, i * 0.4)}, transparent 70%)`;
    } else if (type === "nebula") {
      bg = `radial-gradient(circle at 30% 50%, ${applyAlpha(pc, i * 0.6)}, transparent 50%), radial-gradient(circle at 70% 50%, ${applyAlpha(sc, i * 0.6)}, transparent 50%)`;
    } else if (type === "waves") {
      bg = `linear-gradient(135deg, ${applyAlpha(pc, i * 0.5)}, ${applyAlpha(sc, i * 0.5)}, ${applyAlpha(ac, i * 0.5)}, ${applyAlpha(pc, i * 0.5)})`;
    } else if (type === "gradient") {
      bg = `linear-gradient(-45deg, ${applyAlpha(pc, i * 0.4)}, ${applyAlpha(sc, i * 0.4)}, ${applyAlpha(ac, i * 0.4)}, ${applyAlpha(pc, i * 0.4)})`;
    }
    if (bg) el.style.setProperty("--atmosphere-bg", bg);

    if (type === "aurora") {
      const aur = `linear-gradient(90deg, ${applyAlpha(pc, 0)}, ${applyAlpha(pc, i * 0.6)}, ${applyAlpha(sc, i * 0.6)}, ${applyAlpha(ac, i * 0.6)}, ${applyAlpha(pc, 0)})`;
      el.style.setProperty("--atmosphere-aurora-bg", aur);
    }
  }, [type, intensity, primaryColor, secondaryColor, accentColor]);

  // Convert width and height to string
  const widthValue = typeof width === "number" ? `${width}px` : width;
  const heightValue = typeof height === "number" ? `${height}px` : height;

  const safeSpeed = Math.max(speed, 0.1);
  const baseAnimationDuration = `${30 / safeSpeed}s`;
  const particleAnimationDuration = `${15 / safeSpeed}s`;

  const containerStyle: React.CSSProperties & Record<string, string | number> =
    {
      position,
      width: fullSize ? "100%" : widthValue,
      height: fullSize ? "100%" : heightValue,
      zIndex,
      overflow: "hidden",
      pointerEvents: "none",
      ...style,
    };

  if (!fullSize) {
    containerStyle.width = widthValue;
    containerStyle.height = heightValue;
  }

  if (position === "absolute" || position === "fixed") {
    containerStyle.top = 0;
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.bottom = 0;
  }

  if (blur) {
    Object.assign(
      containerStyle,
      createGlassStyle({ intent: "neutral", elevation: "level2" })
    );
    containerStyle.backdropFilter = `blur(${blurStrength}px)`;
    (containerStyle as any).WebkitBackdropFilter = `blur(${blurStrength}px)`;
  }

  const effectStyle: React.CSSProperties & Record<string, string | number> = {
    transform,
  };

  const intensityValue = clamp01(intensity);

  const typeClassMap: Record<AtmosphereType, string> = {
    subtle: styles.typeSubtle,
    nebula: styles.typeNebula,
    aurora: styles.typeAurora,
    particles: styles.typeDefault,
    waves: styles.typeWaves,
    gradient: styles.typeGradient,
    ambient: styles.typeAmbient,
    custom: styles.typeDefault,
  };

  const animationClassMap: Partial<Record<AtmosphereType, string>> = {
    subtle: styles.animateSubtle,
    nebula: styles.animateNebula,
    aurora: styles.animateAurora,
    waves: styles.animateWaves,
    gradient: styles.animateGradient,
  };

  if (!shouldReduceMotion) {
    effectStyle["--atmosphere-animation-duration"] = baseAnimationDuration;
  }

  switch (type) {
    case "subtle":
      effectStyle.opacity = intensityValue * 0.7 + 0.3;
      break;
    case "nebula":
      effectStyle.opacity = intensityValue * 0.8 + 0.2;
      break;
    case "aurora":
      effectStyle["--atmosphere-aurora-opacity"] = intensityValue * 0.8 + 0.2;
      break;
    case "waves":
      effectStyle.opacity = intensityValue * 0.7 + 0.3;
      break;
    case "gradient":
      effectStyle.opacity = intensityValue * 0.7 + 0.3;
      break;
    case "ambient":
      effectStyle.opacity = intensityValue * 0.6 + 0.4;
      effectStyle.background = `radial-gradient(circle at 20% 30%, ${applyAlpha(
        primaryColor,
        intensityValue * 0.5
      )}, transparent 50%), radial-gradient(circle at 80% 70%, ${applyAlpha(
        secondaryColor,
        intensityValue * 0.5
      )}, transparent 50%), radial-gradient(circle at 50% 50%, ${applyAlpha(
        accentColor,
        intensityValue * 0.4
      )}, transparent 70%)`;
      break;
    default:
      effectStyle.opacity = intensityValue * 0.5 + 0.5;
      effectStyle.backgroundColor = applyAlpha(
        primaryColor,
        intensityValue * 0.3
      );
      break;
  }

  const effectClasses = cn(
    styles.effect,
    typeClassMap[type] ?? styles.typeDefault,
    noise && styles.noise,
    !shouldReduceMotion && animationClassMap[type],
    shouldReduceMotion && styles.reduceMotion
  );

  // Generate particles
  const renderParticles = () => {
    if (type !== "particles") return null;

    return (
      <div className={styles.particleContainer}>
        {Array.from({ length: particleCount }).map((_, index) => {
          const size = Math.random() * 8 + 2;
          const positionX = Math.random() * 100;
          const positionY = Math.random() * 100;
          const delay = Math.random() * 5;

          const particleStyle: React.CSSProperties &
            Record<string, string | number> = {
            backgroundColor: primaryColor,
            width: `${size}px`,
            height: `${size}px`,
            top: `${positionY}%`,
            left: `${positionX}%`,
          };

          if (!shouldReduceMotion) {
            particleStyle["--particle-animation-duration"] =
              particleAnimationDuration;
            particleStyle["--particle-animation-delay"] = `${delay}s`;
          }

          return (
            <div
              key={`particle-${index}`}
              className={cn(
                styles.particle,
                !shouldReduceMotion && styles.particleAnimated,
                shouldReduceMotion && styles.reduceMotion
              )}
              style={{ ...particleStyle }}
            />
          );
        })}
      </div>
    );
  };

  // Handle mouse movement interaction
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (interactionMode !== "mouse" || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Calculate offset based on mouse position and sensitivity
      const offsetX = (x - 0.5) * interactionSensitivity * 20;
      const offsetY = (y - 0.5) * interactionSensitivity * 20;

      setTransform(`translate(${offsetX}px, ${offsetY}px)`);
    },
    [interactionMode, interactionSensitivity, shouldReduceMotion]
  );

  // Handle scroll interaction
  const handleScroll = useCallback(() => {
    if (interactionMode !== "scroll" || !containerRef.current) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate how far the element is in the viewport
    const rect = containerRef.current.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementVisible =
      Math.min(windowHeight, Math.max(0, scrollY + windowHeight - elementTop)) /
      windowHeight;

    // Apply transform based on scroll position
    const offsetY = (elementVisible - 0.5) * interactionSensitivity * 30;

    setTransform(`translateY(${offsetY}px)`);
  }, [interactionMode, interactionSensitivity, shouldReduceMotion]);

  // Set up event listeners
  useEffect(() => {
    if (shouldReduceMotion) return;

    if (interactionMode === "mouse") {
      window.addEventListener("mousemove", handleMouseMove);
    } else if (interactionMode === "scroll") {
      window.addEventListener("scroll", handleScroll);
      // Initial calculation
      handleScroll();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [interactionMode, handleMouseMove, handleScroll, shouldReduceMotion]);

  const setContainerRef = (node: HTMLDivElement | null) => {
    if (containerRef.current !== node) {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
    }
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  return (
    <div
      ref={setContainerRef}
      className={cn("glass-dynamic-atmosphere", styles.container, className)}
      style={{ ...(containerStyle || {}) }}
      {...rest}
    >
      <div className={effectClasses} style={{ ...effectStyle }} />
      {renderParticles()}
    </div>
  );
});

DynamicAtmosphere.displayName = "GlassDynamicAtmosphere";

export const GlassDynamicAtmosphere = DynamicAtmosphere;

export default DynamicAtmosphere;
