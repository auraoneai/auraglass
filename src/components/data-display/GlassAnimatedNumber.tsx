"use client";
import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { OptimizedGlass } from "../../primitives";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassAnimatedNumberProps {
  /** The target number to animate to */
  value: number;
  /** Starting value for animation */
  from?: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  /** Number of decimal places to show */
  decimals?: number;
  /** Whether to use comma separators */
  separator?: boolean;
  /** Prefix to show before the number */
  prefix?: string;
  /** Suffix to show after the number */
  suffix?: string;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** Whether to animate on value change */
  animateOnChange?: boolean;
  /** Custom className */
  className?: string;
  /** Font size */
  size?: "sm" | "md" | "lg" | "xl";
  /** Animation variant */
  variant?: "count" | "scale" | "glow";
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** ARIA label for the animated number */
  "aria-label"?: string;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export const GlassAnimatedNumber = forwardRef<
  HTMLDivElement,
  GlassAnimatedNumberProps
>(
  (
    {
      value = 0,
      from = 0,
      duration = ANIMATION.DURATION.normal,
      easing = "easeOut",
      decimals = 0,
      separator = false,
      prefix = "",
      suffix = "",
      formatter,
      animateOnChange = true,
      className = "",
      size = "md",
      variant = "count",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(from);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef<number>();
    const startTimeRef = useRef<number>();
    const startValueRef = useRef<number>(from);
    const elementRef = useRef<HTMLDivElement>(null);

    // Forward ref
    useImperativeHandle(ref, () => elementRef.current as HTMLDivElement);

    const sizeClasses = {
      sm: "glass-text-lg",
      md: "glass-text-2xl",
      lg: "glass-text-4xl",
      xl: "glass-text-6xl",
    };
    const sizeClassName = sizeClasses[size] ?? sizeClasses.md;

    // Format number with separators and decimals
    const formatNumber = (num: number): string => {
      if (formatter) {
        return formatter(num);
      }

      let formatted = num.toFixed(decimals);

      if (separator) {
        // Add comma separators for thousands
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      return `${prefix}${formatted}${suffix}`;
    };

    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easingFunctions[easing](progress);
      const currentValue =
        startValueRef.current + (value - startValueRef.current) * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        setIsAnimating(false);
      }
    };

    // Start animation when value changes
    useEffect(() => {
      if (!animateOnChange || value === startValueRef.current) {
        setDisplayValue(value);
        return;
      }

      setIsAnimating(true);
      startValueRef.current = displayValue;
      startTimeRef.current = undefined;

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Start new animation
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [value, animateOnChange]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case "scale":
          return {
            transform: isAnimating ? "scale(1.1)" : "scale(1)",
            transition: `transform var(--glass-motion-duration-fast) var(--glass-motion-easing-standard)`,
          };
        case "glow":
          return {
            textShadow: isAnimating
              ? '0 0 20px var(--glass-border-hover), 0 0 40px ${glassStyles.borderColor || "var(--glass-bg-hover)"}'
              : "none",
            transition: `text-shadow var(--glass-motion-duration-normal) var(--glass-motion-easing-standard)`,
          };
        case "count":
        default:
          return {};
      }
    };

    return (
      <OptimizedGlass
        data-glass-component
        ref={elementRef}
        className={cn(
          "glass-inline-flex glass-items-center glass-justify-center glass-font-mono glass-font-bold glass-text-primary",
          sizeClassName,
          className
        )}
        style={{ ...getVariantStyles() }}
        elevation="level1"
        interactive={false}
        aria-label={ariaLabel}
        {...props}
      >
        <ContrastGuard>
          <span className={cn("glass-tabular-nums")}>
            {formatNumber(displayValue)}
          </span>
        </ContrastGuard>
      </OptimizedGlass>
    );
  }
);

GlassAnimatedNumber.displayName = "GlassAnimatedNumber";

// Compound component for animated counter with label
export const GlassAnimatedCounter: React.FC<{
  value: number;
  label?: string;
  from?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}> = ({
  value,
  label,
  from = 0,
  duration = ANIMATION.DURATION.slow,
  size = "lg",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "glass-flex glass-flex-col glass-items-center glass-gap-2",
        className
      )}
    >
      <GlassAnimatedNumber
        value={value}
        from={from}
        duration={duration}
        size={size}
        variant="scale"
        separator={true}
      />
      {label && (
        <OptimizedGlass
          className={cn(
            "glass-text-sm glass-text-primary-70 glass-font-medium"
          )}
          elevation="level1"
        >
          {label}
        </OptimizedGlass>
      )}
    </div>
  );
};

// Compound component for animated progress/stat
export const GlassAnimatedStat: React.FC<{
  value: number;
  total?: number;
  label?: string;
  showPercentage?: boolean;
  duration?: number;
  className?: string;
}> = ({
  value,
  total,
  label,
  showPercentage = false,
  duration = ANIMATION.DURATION.normal,
  className = "",
}) => {
  const percentage = total ? (value / total) * 100 : value;

  return (
    <div className={cn("glass-flex glass-flex-col glass-gap-2", className)}>
      <div className={cn("glass-flex glass-items-baseline glass-gap-2")}>
        <GlassAnimatedNumber
          value={value}
          duration={duration}
          size="lg"
          separator={true}
        />
        {showPercentage && total && (
          <GlassAnimatedNumber
            value={percentage}
            duration={duration}
            decimals={1}
            suffix="%"
            size="md"
            className={cn("glass-text-primary-80")}
          />
        )}
      </div>

      {label && (
        <OptimizedGlass
          className={cn("glass-text-sm glass-text-primary-70")}
          elevation="level1"
        >
          <ContrastGuard>{label}</ContrastGuard>
        </OptimizedGlass>
      )}

      {/* Progress bar */}
      {total && (
        <OptimizedGlass
          className={cn(
            "glass-h-2 glass-w-full glass-radius-full glass-overflow-hidden"
          )}
          elevation="level1"
        >
          <div
            className={cn(
              "glass-h-full glass-bg-gradient-to-r glass-from-blue-500 glass-to-purple-500 glass-radius-full glass-transition-all"
            )}
            style={{
              transitionDuration: `${ANIMATION.DURATION.normal}ms`,
              transitionTimingFunction: ANIMATION.EASING.easeOut,
              width: `${percentage}%`,
            }}
          />
        </OptimizedGlass>
      )}
    </div>
  );
};

// Utility hook for managing animated numbers
export const useAnimatedNumber = (
  targetValue: number,
  options: {
    duration?: number;
    easing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
    decimals?: number;
  } = {}
) => {
  const [currentValue, setCurrentValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateTo = (newValue: number) => {
    if (newValue === currentValue) return;

    setIsAnimating(true);
    const startValue = currentValue;
    const startTime = Date.now();
    const duration = options.duration || ANIMATION.DURATION.normal;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        easingFunctions[options.easing || "easeOut"](progress);
      const current = startValue + (newValue - startValue) * easedProgress;

      setCurrentValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(newValue);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return {
    value: currentValue,
    isAnimating,
    animateTo,
  };
};
