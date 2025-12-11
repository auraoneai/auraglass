"use client";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import {
  createMotionAwareInteractive,
  createMotionAwareVariants,
} from "../../lib/motionPrimitives";
import { cn } from "../../lib/utilsComprehensive";
import { motion } from "framer-motion";
import React, { forwardRef } from "react";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface MotionAwareGlassProps
  extends Omit<
    React.ComponentProps<typeof motion.div>,
    "variants" | "initial" | "animate" | "whileHover" | "whileTap"
  > {
  variant?: "base" | "subtle" | "strong" | "card" | "button" | "input";
  interactive?: boolean;
  animationType?: "fadeInUp" | "fadeInScale" | "slideLeft" | "slideRight";
  children: React.ReactNode;
  className?: string;
  asButton?: boolean;
  disabled?: boolean;
}

/**
 * Motion-aware Glass component that automatically respects user's motion preferences
 * Provides beautiful glass morphism effects while being fully accessible
 */
export const MotionAwareGlass = forwardRef<
  HTMLDivElement,
  MotionAwareGlassProps
>(
  (
    {
      variant = "base",
      interactive = false,
      animationType = "fadeInUp",
      children,
      className,
      asButton = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();

    // Get appropriate glass variant classes
    const getVariantClasses = () => {
      const baseClasses =
        "backdrop-filter border border-opacity-20 glass-radius-lg";

      switch (variant) {
        case "subtle":
          return cn(baseClasses, "glass-subtle bg-white/5 border-white/10");
        case "strong":
          return cn(baseClasses, "glass-strong bg-white/10 border-white/20");
        case "card":
          return cn(
            baseClasses,
            "glass-foundation-complete bg-white/8 border-white/15 glass-p-6 shadow-lg"
          );
        case "button":
          return cn(
            baseClasses,
            "glass-button-secondary bg-white/8 border-white/15 glass-px-6 glass-py-3 cursor-pointer"
          );
        case "input":
          return cn(
            baseClasses,
            "glass-input bg-white/5 border-white/10 glass-px-4 glass-py-2"
          );
        default:
          return cn(
            baseClasses,
            "glass-foundation-complete bg-white/8 border-white/15"
          );
      }
    };

    // Get motion variants based on animation type and motion preference
    const getAnimationVariants = () => {
      switch (animationType) {
        case "fadeInScale":
          return createMotionAwareVariants.fadeInScale(prefersReducedMotion);
        case "slideLeft":
          return createMotionAwareVariants.slideIn(
            "left",
            prefersReducedMotion
          );
        case "slideRight":
          return createMotionAwareVariants.slideIn(
            "right",
            prefersReducedMotion
          );
        default:
          return createMotionAwareVariants.fadeInUp(prefersReducedMotion);
      }
    };

    // Get interactive variants for hover/tap effects
    const getInteractiveVariants = () => {
      if (!interactive || disabled) return {};

      if (variant === "button" || asButton) {
        return createMotionAwareInteractive.button(prefersReducedMotion);
      }

      if (variant === "card") {
        return createMotionAwareInteractive.card(prefersReducedMotion);
      }

      // Default interactive behavior
      if (prefersReducedMotion) {
        return {
          hover: {
            backgroundColor:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            borderColor: "var(--glass-bg-default)",
            transition: { duration: ANIMATION.DURATION.instant / 1000 },
          },
        };
      }

      return {
        hover: {
          backgroundColor:
            '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
          borderColor: "var(--glass-bg-default)",
          y: -2,
          transition: { duration: ANIMATION.DURATION.fast / 1000 },
        },
        tap: {
          y: -1,
          transition: { duration: ANIMATION.DURATION.fast / 2000 },
        },
      };
    };

    const combinedClassName = cn(
      getVariantClasses(),
      {
        "glass-card-motion-aware": interactive && !prefersReducedMotion,
        "cursor-pointer": (interactive || asButton) && !disabled,
        "cursor-not-allowed opacity-50": disabled,
        "focus:outline-none focus:ring-3 glass-focus-ring-blue-500/50":
          asButton || interactive,
        "transition-none": prefersReducedMotion,
      },
      className
    );

    const animationVariants = getAnimationVariants();
    const interactiveVariants = getInteractiveVariants();

    // Combine all motion props
    const motionProps = {
      variants: animationVariants,
      initial: "hidden",
      animate: "visible",
      ...(interactive &&
        interactiveVariants &&
        typeof interactiveVariants === "object" && {
          whileHover: "hover" in interactiveVariants ? "hover" : undefined,
          whileTap: "tap" in interactiveVariants ? "tap" : undefined,
        }),
      ...props,
    };

    // Add accessibility attributes for buttons
    const accessibilityProps =
      asButton || interactive
        ? {
            role: asButton ? "button" : undefined,
            tabIndex: disabled ? -1 : 0,
            "aria-disabled": disabled,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                (asButton || interactive) &&
                !disabled
              ) {
                e.preventDefault();
                props?.onClick?.(e as any);
              }
            },
          }
        : {};

    return (
      <motion.div
        ref={ref}
        className={combinedClassName}
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        whileHover={
          interactive && "hover" in interactiveVariants ? "hover" : undefined
        }
        whileTap={
          interactive && "tap" in interactiveVariants ? "tap" : undefined
        }
        {...props}
        {...accessibilityProps}
      >
        {children}

        {/* Screen reader information for motion preference */}
        {prefersReducedMotion && (
          <span className="glass-sr-only">
            Motion reduced for accessibility
          </span>
        )}
      </motion.div>
    );
  }
);

MotionAwareGlass.displayName = "MotionAwareGlass";

// Specialized variants for common use cases
export const MotionAwareGlassCard = forwardRef<
  HTMLDivElement,
  Omit<MotionAwareGlassProps, "variant">
>((props, ref) => (
  <MotionAwareGlass ref={ref} variant="card" interactive {...props} />
));
MotionAwareGlassCard.displayName = "MotionAwareGlassCard";

export const MotionAwareGlassButton = forwardRef<
  HTMLDivElement,
  Omit<MotionAwareGlassProps, "variant" | "asButton" | "interactive">
>((props, ref) => (
  <MotionAwareGlass
    ref={ref}
    variant="button"
    asButton
    interactive
    {...props}
  />
));
MotionAwareGlassButton.displayName = "MotionAwareGlassButton";

export const MotionAwareGlassInput = forwardRef<
  HTMLDivElement,
  Omit<MotionAwareGlassProps, "variant">
>((props, ref) => <MotionAwareGlass ref={ref} variant="input" {...props} />);
MotionAwareGlassInput.displayName = "MotionAwareGlassInput";

// Hook for easy access to motion-aware glass styles
export const useMotionAwareGlassStyles: () => {
  getGlassStyle: (
    variant?: MotionAwareGlassProps["variant"]
  ) => React.CSSProperties;
  prefersReducedMotion: boolean;
} = () => {
  const { prefersReducedMotion } = useMotionPreferenceContext();

  return {
    getGlassStyle: (variant: MotionAwareGlassProps["variant"] = "base") => {
      const baseStyle = createGlassStyle({
        intent: "neutral",
        elevation: "level2",
      });

      switch (variant) {
        case "subtle":
          return {
            ...baseStyle,
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
          };
        case "strong":
          return {
            ...baseStyle,
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
          };
        case "card":
          return {
            ...baseStyle,
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
            padding: "24px",
            boxShadow: "var(--glass-elev-2)",
          };
        default:
          return {
            ...baseStyle,
            background:
              '/* Use createGlassStyle({ intent: "neutral", elevation: "level2" }) */',
          };
      }
    },
    prefersReducedMotion,
  };
};

export default MotionAwareGlass;
