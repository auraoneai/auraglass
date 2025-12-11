"use client";
/**
 * AuraGlass Magnetic Cursor Effects
 * Interactive cursor with magnetic attraction and glass effects
 */

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

interface MagneticElement {
  element: HTMLElement;
  strength: number;
  radius: number;
  haptic?: boolean;
}

interface GlassMagneticCursorProps {
  className?: string;
  variant?: "default" | "glow" | "trail" | "morph" | "ripple";
  size?: number;
  color?: string;
  magnetStrength?: number;
  magnetRadius?: number;
  showCursor?: boolean;
  trailLength?: number;
  glowIntensity?: number;
  morphTargets?: boolean;
  hapticFeedback?: boolean;
  customCursor?: React.ReactNode;
  respectMotionPreference?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  role?: string;
}

export const GlassMagneticCursor = forwardRef<
  HTMLDivElement,
  GlassMagneticCursorProps
>(function GlassMagneticCursor(
  {
    className,
    variant = "default",
    size = 20,
    color = "rgba(var(--glass-color-primary) / var(--glass-opacity-50))",
    magnetStrength = 0.3,
    magnetRadius = 100,
    showCursor = true,
    trailLength = 5,
    glowIntensity = 1,
    morphTargets = true,
    hapticFeedback = false,
    customCursor,
    respectMotionPreference = true,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    role,
    ...restProps
  }: GlassMagneticCursorProps,
  ref
) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);
  const { prefersReducedMotion } = useMotionPreferenceContext();
  const cursorId = useA11yId("magnetic-cursor");
  const descriptionId = useA11yId("cursor-description");

  // Motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorSize = useMotionValue(size);

  // Spring physics - respect motion preferences
  const shouldAnimate = respectMotionPreference ? !prefersReducedMotion : true;
  const springConfig = {
    damping: shouldAnimate ? 25 : 50,
    stiffness: shouldAnimate ? 200 : 100,
  };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const cursorScale = useSpring(1, { damping: 15, stiffness: 300 });

  // Track magnetic elements
  const magneticElements = useRef<MagneticElement[]>([]);

  // Initialize magnetic elements
  useEffect(() => {
    const elements = document.querySelectorAll("[data-magnetic]");
    magneticElements.current = Array.from(elements).map((el: any) => ({
      element: el as HTMLElement,
      strength:
        parseFloat(el.getAttribute("data-magnetic-strength") || "") ||
        magnetStrength,
      radius:
        parseFloat(el.getAttribute("data-magnetic-radius") || "") ||
        magnetRadius,
      haptic: el.getAttribute("data-magnetic-haptic") === "true",
    }));

    return () => {
      magneticElements.current = [];
    };
  }, [magnetStrength, magnetRadius]);

  // Mouse movement handler
  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      mouseX.set(x);
      mouseY.set(y);

      // Check magnetic elements
      let closestElement: HTMLElement | null = null;
      let closestDistance = Infinity;
      let magneticOffset = { x: 0, y: 0 };

      magneticElements.current.forEach(({ element, strength, radius }) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        if (distance < radius && distance < closestDistance) {
          closestElement = element;
          closestDistance = distance;

          // Calculate magnetic pull
          const pullStrength = (1 - distance / radius) * strength;
          magneticOffset.x = (centerX - x) * pullStrength;
          magneticOffset.y = (centerY - y) * pullStrength;
        }
      });

      // Apply magnetic effect
      if (closestElement) {
        mouseX.set(x + magneticOffset.x);
        mouseY.set(y + magneticOffset.y);
        setIsHovering(true);
        setTargetElement(closestElement);

        // Morph cursor size
        if (morphTargets) {
          const rect = (closestElement as HTMLElement).getBoundingClientRect();
          const targetSize = Math.min(rect.width, rect.height) * 0.8;
          cursorSize.set(targetSize);
        }

        // Haptic feedback (if supported)
        if (hapticFeedback && "vibrate" in navigator) {
          navigator.vibrate(1);
        }
      } else {
        setIsHovering(false);
        setTargetElement(null);
        cursorSize.set(size);
      }

      // Update trail
      if (variant === "trail") {
        setTrail((prev: any) => {
          const newTrail = [
            { x, y, id: Date.now() },
            ...prev.slice(0, trailLength - 1),
          ];
          return newTrail;
        });
      }
    },
    [
      mouseX,
      mouseY,
      size,
      morphTargets,
      hapticFeedback,
      variant,
      trailLength,
      cursorSize,
    ]
  );

  // Click handler for ripple effect
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (variant === "ripple") {
        const ripple = {
          x: e.clientX,
          y: e.clientY,
          id: Date.now(),
        };

        setRipples((prev: any) => [...prev, ripple]);

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev: any) =>
            prev.filter((r: any) => r.id !== ripple.id)
          );
        }, 1000);
      }

      // Scale animation on click
      cursorScale.set(0.8);
      setTimeout(() => cursorScale.set(1), 150);
    },
    [variant, cursorScale]
  );

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => {
    if (showCursor) {
      document.body.style.cursor = "none";
    }
  }, [showCursor]);

  const handleMouseLeave = useCallback(() => {
    document.body.style.cursor = "auto";
    setIsHovering(false);
    setTargetElement(null);
  }, []);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "auto";
    };
  }, [handleMouseMove, handleClick, handleMouseEnter, handleMouseLeave]);

  // Hide default cursor when over magnetic elements
  useEffect(() => {
    magneticElements.current.forEach(({ element }) => {
      element.style.cursor = showCursor ? "none" : "pointer";
    });
  }, [showCursor]);

  if (!showCursor) return null;

  return (
    <>
      {/* Screen reader description */}
      <span id={descriptionId} className="glass-sr-only">
        {ariaLabel || `Magnetic cursor (${variant})`}. Interactive cursor that
        follows mouse movement
        {morphTargets ? " and morphs when hovering over magnetic elements" : ""}
        .
      </span>

      {/* Main cursor */}
      <motion.div
        ref={ref || cursorRef}
        className={cn(
          "fixed pointer-events-none glass-z-9999 mix-blend-difference",
          className
        )}
        id={cursorId}
        role={role || "presentation"}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy || descriptionId}
        aria-hidden="true"
        style={{
          ...(shouldAnimate
            ? {
                x: cursorX,
                y: cursorY,
                scale: cursorScale,
                width: cursorSize,
                height: cursorSize,
              }
            : {}),
        }}
        {...restProps}
      >
        <OptimizedGlass intensity="subtle" blur="medium">
          {customCursor || (
            <OptimizedGlass
              intensity={isHovering ? "medium" : "subtle"}
              blur="subtle"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2",
                "glass-radius-full transition-all"
              )}
              style={{
                width: cursorSize.get(),
                height: cursorSize.get(),
                transitionDuration: "var(--glass-motion-duration-fast)",
                background:
                  variant === "glow"
                    ? `radial-gradient(circle, ${color} 0%, transparent 70%)`
                    : color,
                boxShadow:
                  variant === "glow"
                    ? `0 0 ${20 * glowIntensity}px ${color}`
                    : undefined,
              }}
              aria-hidden="true"
            />
          )}
        </OptimizedGlass>
      </motion.div>

      {/* Trail effect */}
      {variant === "trail" &&
        trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="glass-fixed glass-pointer-events-none glass-z-9998"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION.DURATION.slow / 1000 }}
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
            }}
          >
            <OptimizedGlass
              intensity="subtle"
              blur="subtle"
              className="glass-w-full glass-h-full glass-radius-full"
              style={{
                background: color,
                opacity: 1 - index / trailLength,
              }}
              aria-hidden="true"
            />
          </motion.div>
        ))}

      {/* Ripple effect */}
      <AnimatePresence>
        {variant === "ripple" &&
          ripples.map((ripple: any) => (
            <motion.div
              key={ripple.id}
              className="glass-fixed glass-pointer-events-none glass-z-9997"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ANIMATION.DURATION.slower / 1000,
                ease: ANIMATION.EASING.easeOut,
              }}
              style={{
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
              }}
            >
              <div
                className="glass-w-20 glass-h-20 glass-radius-full glass-border-2"
                style={{
                  borderColor: color,
                }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Hover indicator */}
      {isHovering && targetElement && (
        <motion.div
          className="glass-fixed glass-pointer-events-none glass-z-9996"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            left: targetElement.getBoundingClientRect().left,
            top: targetElement.getBoundingClientRect().top,
            width: targetElement.getBoundingClientRect().width,
            height: targetElement.getBoundingClientRect().height,
          }}
        >
          <div className="glass-w-full glass-h-full glass-radius-lg glass-border glass-border-white/20" />
        </motion.div>
      )}
    </>
  );
});

// Magnetic wrapper component
export const GlassMagneticWrapper = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    radius?: number;
    haptic?: boolean;
    "aria-label"?: string;
    role?: string;
  }
>(function GlassMagneticWrapper(
  {
    children,
    className,
    strength = 0.3,
    radius = 100,
    haptic = false,
    "aria-label": ariaLabel,
    role,
    ...restProps
  },
  ref
) {
  const wrapperId = useA11yId("magnetic-wrapper");

  return (
    <OptimizedGlass
      ref={ref}
      intensity="subtle"
      blur="medium"
      className={cn("relative", className)}
      id={wrapperId}
      role={role}
      aria-label={ariaLabel || "Magnetic interactive element"}
      data-magnetic
      data-magnetic-strength={strength}
      data-magnetic-radius={radius}
      data-magnetic-haptic={haptic}
      {...restProps}
    >
      {children}
    </OptimizedGlass>
  );
});

// Hook for custom magnetic behavior
export function useMagneticCursor(options?: {
  strength?: number;
  radius?: number;
  onHover?: (isHovering: boolean) => void;
}) {
  const elementRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set magnetic attributes
    element.setAttribute("data-magnetic", "true");
    element.setAttribute(
      "data-magnetic-strength",
      String(options?.strength || 0.3)
    );
    element.setAttribute(
      "data-magnetic-radius",
      String(options?.radius || 100)
    );

    // Track hover state
    const handleMouseEnter = () => {
      setIsHovering(true);
      options?.onHover?.(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      options?.onHover?.(false);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeAttribute("data-magnetic");
      element.removeAttribute("data-magnetic-strength");
      element.removeAttribute("data-magnetic-radius");
    };
  }, [options]);

  return { ref: elementRef, isHovering };
}
