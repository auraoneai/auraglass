'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useState, useCallback } from "react";
import { OptimizedGlass } from "../../primitives";

export interface GlassRatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Current rating value (0 to max)
   */
  value?: number;
  /**
   * Maximum rating value
   * @default 5
   */
  max?: number;
  /**
   * Size of the rating stars
   * @default 'md'
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Whether the rating can be changed
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Allow half-star ratings
   * @default false
   */
  allowHalf?: boolean;
  /**
   * Show rating value as text
   * @default false
   */
  showValue?: boolean;
  /**
   * Custom icon for filled state (as SVG path)
   */
  icon?: React.ReactNode;
  /**
   * Custom icon for empty state (as SVG path)
   */
  emptyIcon?: React.ReactNode;
  /**
   * Color variant for stars
   * @default 'primary'
   */
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  /**
   * Callback when rating changes
   */
  onChange?: (value: number) => void;
  /**
   * Callback when hover state changes
   */
  onHoverChange?: (value: number | null) => void;
  /**
   * Glassmorphism elevation level
   * @default 'level1'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
  /**
   * Enable glassmorphism effects
   * @default true
   */
  glass?: boolean;
  /**
   * Labels for each rating value (for accessibility)
   */
  labels?: string[];
}

const StarIcon = ({
  filled,
  halfFilled,
}: {
  filled: boolean;
  halfFilled?: boolean;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="glass-w-full glass-h-full"
  >
    <defs>
      {halfFilled && (
        <linearGradient id="halfFill">
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      )}
    </defs>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={halfFilled ? "url(#halfFill)" : filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={filled || halfFilled ? 1 : 0.3}
    />
  </svg>
);

export const GlassRating = forwardRef<HTMLDivElement, GlassRatingProps>(
  (
    {
      value = 0,
      max = 5,
      size = "md",
      readOnly = false,
      disabled = false,
      allowHalf = false,
      showValue = false,
      icon,
      emptyIcon,
      variant = "primary",
      onChange,
      onHoverChange,
      elevation = "level1",
      glass = true,
      labels,
      className,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-10 h-10",
    };

    const variantClasses = {
      primary: "text-blue-500",
      secondary: "text-purple-500",
      success: "text-green-500",
      warning: "text-yellow-500",
      danger: "text-red-500",
    };

    const textSizeClasses = {
      sm: "glass-text-sm",
      md: "glass-text-base",
      lg: "glass-text-lg",
      xl: "glass-text-xl",
    };

    const handleClick = useCallback(
      (index: number, isHalf: boolean = false) => {
        if (readOnly || disabled) return;
        const newValue = isHalf ? index + 0.5 : index + 1;
        onChange?.(newValue);
      },
      [readOnly, disabled, onChange]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        if (readOnly || disabled || !allowHalf) return;

        const { left, width } = event.currentTarget.getBoundingClientRect();
        const percent = (event.clientX - left) / width;
        const newHoverValue = percent < 0.5 ? index + 0.5 : index + 1;

        if (newHoverValue !== hoverValue) {
          setHoverValue(newHoverValue);
          onHoverChange?.(newHoverValue);
        }
      },
      [readOnly, disabled, allowHalf, hoverValue, onHoverChange]
    );

    const handleMouseEnter = useCallback(
      (index: number) => {
        if (readOnly || disabled) return;
        const newValue = index + 1;
        setHoverValue(newValue);
        onHoverChange?.(newValue);
      },
      [readOnly, disabled, onHoverChange]
    );

    const handleMouseLeave = useCallback(() => {
      if (readOnly || disabled) return;
      setHoverValue(null);
      onHoverChange?.(null);
    }, [readOnly, disabled, onHoverChange]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent, index: number) => {
        if (readOnly || disabled) return;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowDown":
            event.preventDefault();
            if (index > 0) {
              onChange?.(index);
            }
            break;
          case "ArrowRight":
          case "ArrowUp":
            event.preventDefault();
            if (index < max - 1) {
              onChange?.(index + 2);
            }
            break;
          case "Enter":
          case " ":
            event.preventDefault();
            onChange?.(index + 1);
            break;
        }
      },
      [readOnly, disabled, max, onChange]
    );

    const displayValue = hoverValue ?? value;
    const stars = Array.from({ length: max }, (_, index) => {
      const isFilled = index < Math.floor(displayValue);
      const isHalfFilled =
        allowHalf &&
        index === Math.floor(displayValue) &&
        displayValue % 1 !== 0;
      const label =
        labels?.[index] || `${index + 1} star${index !== 0 ? "s" : ""}`;

      return (
        <button
          data-glass-component
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          onMouseMove={(e) => allowHalf && handleMouseMove(e, index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled || readOnly}
          aria-label={label}
          aria-pressed={index < value}
          className={cn(
            sizeClasses[size],
            variantClasses[variant],
            "transition-all duration-200 ease-out",
            !readOnly &&
              !disabled &&
              "cursor-pointer hover:scale-110 active:scale-95",
            readOnly && "cursor-default",
            disabled && "opacity-50 cursor-not-allowed",
            "focus:outline-none glass-focus glass-touch-target glass-contrast-guard"
          )}
        >
          {icon && isFilled ? (
            icon
          ) : emptyIcon && !isFilled && !isHalfFilled ? (
            emptyIcon
          ) : (
            <StarIcon filled={isFilled} halfFilled={isHalfFilled} />
          )}
        </button>
      );
    });

    const content = (
      <div
        className={cn(
          "flex items-center gap-1",
          disabled && "pointer-events-none"
        )}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label="Rating"
        aria-required={!readOnly}
        aria-readonly={readOnly}
      >
        {stars}
        {showValue && (
          <span
            className={cn("glass-text-secondary ml-2", textSizeClasses[size])}
            aria-live="polite"
          >
            {displayValue.toFixed(allowHalf && displayValue % 1 !== 0 ? 1 : 0)}{" "}
            / {max}
          </span>
        )}
      </div>
    );

    if (!glass) {
      return (
        <div ref={ref} className={cn("inline-flex", className)} {...props}>
          {content}
        </div>
      );
    }

    return (
      <OptimizedGlass
        ref={ref}
        elevation={elevation}
        className={cn("inline-flex glass-p-2 glass-radius-lg", className)}
        {...props}
      >
        {content}
      </OptimizedGlass>
    );
  }
);

GlassRating.displayName = "GlassRating";

export default GlassRating;