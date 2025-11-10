'use client';
import React, { forwardRef, useEffect, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Progress variant
   */
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "gradient"
    | "primary";
  /**
   * Progress size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Progress shape
   */
  shape?: "glass-radius-md" | "pill" | "square";
  /**
   * Whether to show value text
   */
  showValue?: boolean;
  /**
   * Custom value formatter
   */
  formatValue?: (value: number, max: number) => string;
  /**
   * Whether progress is indeterminate
   */
  indeterminate?: boolean;
  /**
   * Animation on value change
   */
  animated?: boolean;
  /**
   * Animation duration in ms
   */
  animationDuration?: number;
  /**
   * Whether to show stripes
   */
  striped?: boolean;
  /**
   * Custom label
   */
  label?: string;
  /**
   * Label position
   */
  labelPosition?: "top" | "bottom" | "inline";
  /**
   * Respect user's motion preferences
   */
  respectMotionPreference?: boolean;
}

/**
 * GlassProgress component
 * A glassmorphism progress bar with various styles and animations
 */
export const GlassProgress = forwardRef<HTMLDivElement, GlassProgressProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      value = 0,
      max = 100,
      variant = "default",
      size = "md",
      shape = "glass-radius-md",
      showValue = false,
      formatValue,
      indeterminate = false,
      animated = true,
      animationDuration = 500,
      striped = false,
      label,
      labelPosition = "top",
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const progressId = useA11yId("progress");
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const [animatedValue, setAnimatedValue] = useState(0);
    const [mounted, setMounted] = useState(false);
    const shouldAnimate =
      animated && (!respectMotionPreference || !prefersReducedMotion);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted || indeterminate) return;

      if (shouldAnimate) {
        const timer = setTimeout(() => {
          setAnimatedValue(value);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setAnimatedValue(value);
      }
    }, [value, animated, mounted, indeterminate]);

    const percentage = indeterminate
      ? 0
      : Math.min(Math.max((animatedValue / max) * 100, 0), 100);

    const sizeClasses = {
      xs: "h-1",
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
      xl: "h-6",
    };

    const shapeClasses = {
      "glass-radius-md": "glass-radius-md",
      pill: "glass-radius-full",
      square: "rounded-none",
    };

    const variantClasses = {
      default: "glass-surface-primary",
      success: "glass-surface-success",
      warning: "glass-surface-warning",
      error: "glass-surface-danger",
      gradient: "bg-gradient-to-r from-primary via-secondary to-accent",
      primary: "glass-surface-primary",
    };

    const trackClasses = cn(
      "relative w-full overflow-hidden",
      "bg-muted/30 glass-backdrop-blur-md",
      sizeClasses[size],
      shapeClasses[shape]
    );

    const fillClasses = cn(
      "h-full transition-all ease-out relative",
      variantClasses[variant],
      {
        "bg-stripes": striped,
        "animate-pulse": indeterminate,
        "animate-progress-indeterminate": indeterminate,
      }
    );

    const formatDisplayValue = () => {
      if (formatValue) {
        return formatValue(value, max);
      }
      return `${Math.round(percentage)}%`;
    };

    const getLabelContent = () => {
      if (label) return label;
      if (showValue) return formatDisplayValue();
      return null;
    };

    const labelContent = getLabelContent();

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Top label */}
        {labelContent && labelPosition === "top" && (
          <div
            id={`${progressId}-label`}
            className='glass-flex glass-justify-between glass-items-center mb-2'
          >
            <span className='glass-text-sm font-medium text-primary'>
              {label}
            </span>
            {showValue && (
              <span className="glass-text-sm glass-text-secondary">
                {formatDisplayValue()}
              </span>
            )}
          </div>
        )}

        {/* Progress track */}
        <OptimizedGlass
          elevation={undefined}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          id={progressId}
          className={trackClasses}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || "Progress"}
          aria-describedby={labelContent ? `${progressId}-label` : undefined}
        >
          {/* Progress fill */}
          <div
            className={fillClasses}
            style={{
              width: indeterminate ? "100%" : `${percentage}%`,
              transitionDuration: shouldAnimate
                ? `${animationDuration}ms`
                : "0ms",
            }}
          >
            {/* Sheen sweep on fill */}
            <div className='pointer-events-none absolute inset-0 glass-sheen' />
            {/* Inline label */}
            {labelContent && labelPosition === "inline" && (
              <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-px-2">
                <span className='glass-text-xs font-medium text-primary mix-blend-difference'>
                  {showValue ? formatDisplayValue() : label}
                </span>
              </div>
            )}

            {/* Stripes overlay */}
            {striped && (
              <div className='absolute inset-0 bg-stripes opacity-20' />
            )}
          </div>
        </OptimizedGlass>

        {/* Bottom label */}
        {labelContent && labelPosition === "bottom" && (
          <div
            id={`${progressId}-label`}
            className="glass-flex glass-justify-between glass-items-center glass-mt-2"
          >
            <span className='glass-text-sm font-medium text-primary'>
              {label}
            </span>
            {showValue && (
              <span className="glass-text-sm glass-text-secondary">
                {formatDisplayValue()}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

GlassProgress.displayName = "GlassProgress";

/**
 * CircularProgress component
 */
export interface CircularProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "size"> {
  /**
   * Progress value (0-100)
   */
  value?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Progress variant
   */
  variant?: "default" | "success" | "warning" | "error";
  /**
   * Circle size
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Stroke width
   */
  strokeWidth?: number;
  /**
   * Whether progress is indeterminate
   */
  indeterminate?: boolean;
  /**
   * Whether to show value text
   */
  showValue?: boolean;
  /**
   * Custom content in center
   */
  children?: React.ReactNode;
}

export const CircularProgress = forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      value = 0,
      max = 100,
      variant = "default",
      size = "md",
      strokeWidth,
      indeterminate = false,
      showValue = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      if (indeterminate) return;

      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    }, [value, indeterminate]);

    const sizeConfig = {
      sm: { size: 40, stroke: strokeWidth || 3 },
      md: { size: 60, stroke: strokeWidth || 4 },
      lg: { size: 80, stroke: strokeWidth || 5 },
      xl: { size: 120, stroke: strokeWidth || 6 },
    };

    const config = sizeConfig[size];
    const radius = (config.size - config.stroke) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min(Math.max((animatedValue / max) * 100, 0), 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantColors = {
      default: "stroke-primary",
      success: "stroke-success",
      warning: "stroke-warning",
      error: "stroke-destructive",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        style={{ width: config.size, height: config.size }}
        {...props}
      >
        <svg
          className='transform -rotate-90'
          width={config.size}
          height={config.size}
        >
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            className='text-muted/20'
          />

          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={config.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={
              indeterminate ? circumference * 0.25 : strokeDashoffset
            }
            strokeLinecap="round"
            className={cn(
              "transition-all duration-500 ease-out",
              variantColors[variant],
              {
                "animate-spin": indeterminate,
              }
            )}
            style={{
              transformOrigin: "50% 50%",
            }}
          />
          {/* Subtle glow overlay for finished arc */}
          {!indeterminate && (
            <circle
              cx={config.size / 2}
              cy={config.size / 2}
              r={radius}
              strokeWidth={config.stroke}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className='stroke-white/10'
            />
          )}
        </svg>

        {/* Center content */}
        <div className='absolute inset-0 glass-flex glass-items-center glass-justify-center'>
          {children ||
            (showValue && (
              <span className='glass-text-sm font-medium text-primary'>
                {Math.round(percentage)}%
              </span>
            ))}
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

/**
 * StepProgress component
 */
export interface StepProgressProps {
  /**
   * Current step (0-based)
   */
  currentStep: number;
  /**
   * Total steps
   */
  totalSteps: number;
  /**
   * Step labels
   */
  steps?: string[];
  /**
   * Progress variant
   */
  variant?: "default" | "numbered" | "minimal";
  /**
   * Orientation
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether completed steps are clickable
   */
  clickable?: boolean;
  /**
   * Step click handler
   */
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepProgress({
  currentStep,
  totalSteps,
  steps,
  variant = "default",
  orientation = "horizontal",
  size = "md",
  clickable = false,
  onStepClick,
  className,
}: StepProgressProps) {
  const sizeClasses = {
    sm: {
      indicator: "w-6 h-6 glass-text-xs",
      line: orientation === "horizontal" ? "h-0.5" : "w-0.5",
      label: "glass-text-xs",
    },
    md: {
      indicator: "w-8 h-8 glass-text-sm",
      line: orientation === "horizontal" ? "h-1" : "w-1",
      label: "glass-text-sm",
    },
    lg: {
      indicator: "w-10 h-10 glass-text-base",
      line: orientation === "horizontal" ? "h-1.5" : "w-1.5",
      label: "glass-text-base",
    },
  };

  const config = sizeClasses[size];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  const handleStepClick = (stepIndex: number) => {
    if (clickable && stepIndex <= currentStep && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div
      className={cn(
        "flex",
        orientation === "horizontal" ? "items-center" : "flex-col",
        className
      )}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const status = getStepStatus(index);
        const isLast = index === totalSteps - 1;
        const stepLabel = steps?.[index];

        return (
          <div
            key={index}
            className={cn(
              "flex items-center",
              orientation === "vertical" && "flex-col",
              !isLast && orientation === "horizontal" && "flex-1"
            )}
          >
            {/* Step indicator */}
            <div
              className={cn(
                "flex items-center justify-center glass-radius-full font-medium",
                "border-2 transition-all duration-200",
                config.indicator,
                {
                  "bg-primary border-primary text-primary-foreground":
                    status === "completed",
                  "bg-primary border-primary text-primary-foreground ring-2 ring-primary/20":
                    status === "current",
                  "bg-background border-muted glass-text-secondary":
                    status === "pending",
                  "cursor-pointer hover:border-primary/50":
                    clickable && index <= currentStep,
                }
              )}
              onClick={(e) => handleStepClick(index)}
            >
              {variant === "numbered" || !steps ? (
                status === "completed" ? (
                  <svg
                    className='w-4 h-4'
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )
              ) : (
                <div
                  className={cn(
                    "w-2 h-2 glass-radius-full",
                    status === "completed"
                      ? "bg-primary-foreground"
                      : status === "current"
                        ? "bg-primary-foreground"
                        : "bg-muted-foreground"
                  )}
                />
              )}
            </div>

            {/* Step label */}
            {stepLabel && orientation === "horizontal" && (
              <span
                className={cn("glass-ml-2 font-medium", config.label, {
                  "text-primary": status === "current",
                  "text-foreground": status === "completed",
                  "glass-text-secondary": status === "pending",
                })}
              >
                {stepLabel}
              </span>
            )}

            {/* Connecting line */}
            {!isLast && (
              <div
                className={cn(
                  "flex-1 bg-muted",
                  config.line,
                  orientation === "horizontal" ? "glass-mx-4" : "glass-my-4",
                  {
                    "bg-primary": index < currentStep,
                  }
                )}
              />
            )}

            {/* Vertical label */}
            {stepLabel && orientation === "vertical" && (
              <span
                className={cn(
                  "glass-mt-2 text-center font-medium",
                  config.label,
                  {
                    "text-primary": status === "current",
                    "text-foreground": status === "completed",
                    "glass-text-secondary": status === "pending",
                  }
                )}
              >
                {stepLabel}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}