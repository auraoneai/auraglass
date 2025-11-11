"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { Motion, OptimizedGlass } from "../../primitives";
import {
  announceToScreenReader,
  createFormFieldA11y,
  useA11yId,
} from "../../utils/a11y";
import { useGlassSound } from "../../utils/soundDesign";

export interface GlassStepperProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** Current value of the stepper */
  value?: number;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Number of decimal places to display */
  precision?: number;
  /** Whether the stepper is disabled */
  disabled?: boolean;
  /** Size of the stepper */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "success" | "warning" | "error" | "info";
  /** Orientation of controls */
  orientation?: "horizontal" | "vertical";
  /** Whether to show the input field */
  showInput?: boolean;
  /** Whether to allow manual input */
  allowInput?: boolean;
  /** Label for the stepper */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether the stepper is required */
  required?: boolean;
  /** Format function for displayed values */
  formatValue?: (value: number) => string;
  /** Parse function for input values */
  parseValue?: (value: string) => number;
  /** Custom increment button content */
  incrementContent?: React.ReactNode;
  /** Custom decrement button content */
  decrementContent?: React.ReactNode;
  /** Whether to repeat on long press */
  repeatOnLongPress?: boolean;
  /** Long press delay (ms) */
  longPressDelay?: number;
  /** Long press repeat interval (ms) */
  longPressInterval?: number;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /** Accessible label for the stepper */
  "aria-label"?: string;
  /** ID of element that labels the stepper */
  "aria-labelledby"?: string;
  /** ID of element(s) that describe the stepper */
  "aria-describedby"?: string;
  /** Data test id */
  "data-testid"?: string;
}

export const GlassStepper = forwardRef<HTMLDivElement, GlassStepperProps>(
  (
    {
      value,
      defaultValue = 0,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision = 0,
      disabled = false,
      size = "md",
      variant = "default",
      orientation = "horizontal",
      showInput = true,
      allowInput = true,
      label,
      description,
      error,
      required = false,
      formatValue = (val) => val.toFixed(precision),
      parseValue = (val) => parseFloat(val) || 0,
      incrementContent,
      decrementContent,
      repeatOnLongPress = true,
      longPressDelay = 500,
      longPressInterval = 100,
      respectMotionPreference = true,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "data-testid": dataTestId,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    // Generate unique IDs for accessibility
    const stepperId = useA11yId("glass-stepper");
    const finalId = id || stepperId;
    const labelId = label ? useA11yId("glass-stepper-label") : undefined;
    const descriptionId = description
      ? useA11yId("glass-stepper-description")
      : undefined;
    const errorId = error ? useA11yId("glass-stepper-error") : undefined;

    const inputRef = useRef<HTMLInputElement>(null);
    const longPressTimeoutRef = useRef<NodeJS.Timeout>();
    const longPressIntervalRef = useRef<NodeJS.Timeout>();
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const isInvalid = !!error;

    // Create accessibility attributes
    const a11yProps = createFormFieldA11y({
      id: finalId,
      label:
        !ariaLabelledBy && !labelId
          ? ariaLabel || label || "Stepper"
          : undefined,
      description: description,
      error: error,
      required: required,
      invalid: isInvalid,
      disabled: disabled,
      labelId: ariaLabelledBy || labelId,
      descriptionId: ariaDescribedBy || descriptionId,
      errorId: errorId,
    });

    // Announce error state changes
    useEffect(() => {
      if (error) {
        announceToScreenReader(`Stepper error: ${error}`, "assertive");
      }
    }, [error]);

    // Initialize internal value
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);
    const currentValue = value !== undefined ? value : internalValue;

    // Update input value when current value changes
    useEffect(() => {
      if (!isInputFocused) {
        setInputValue(formatValue(currentValue));
      }
    }, [currentValue, formatValue, isInputFocused]);

    const sizeConfig = {
      sm: {
        button: "h-6 w-6 glass-text-xs",
        input: "h-6 glass-px-2 glass-text-xs",
        label: "glass-text-xs",
        container:
          orientation === "horizontal" ? "glass-gap-1" : "glass-gap-0.5",
      },
      md: {
        button: "h-8 w-8 glass-text-sm",
        input: "h-8 glass-px-3 glass-text-sm",
        label: "glass-text-sm",
        container: orientation === "horizontal" ? "glass-gap-2" : "glass-gap-1",
      },
      lg: {
        button: "h-10 w-10 glass-text-base",
        input: "h-10 glass-px-4 glass-text-base",
        label: "glass-text-base",
        container:
          orientation === "horizontal" ? "glass-gap-3" : "glass-gap-1.5",
      },
    };

    const variantConfig = {
      default: {
        button:
          "border-border/20 hover:border-primary/30 focus:border-primary/50",
        input: "border-border/20 focus:border-primary/50",
        buttonBg: "bg-background/50",
        inputBg: "bg-background/30",
      },
      success: {
        button:
          "border-green-200/30 hover:border-green-300/40 focus:border-green-400/50",
        input: "border-green-200/30 focus:border-green-400/50",
        buttonBg: "bg-green-50/30",
        inputBg: "bg-green-50/20",
      },
      warning: {
        button:
          "border-amber-200/30 hover:border-amber-300/40 focus:border-amber-400/50",
        input: "border-amber-200/30 focus:border-amber-400/50",
        buttonBg: "bg-amber-50/30",
        inputBg: "bg-amber-50/20",
      },
      error: {
        button:
          "border-red-200/30 hover:border-red-300/40 focus:border-red-400/50",
        input: "border-red-200/30 focus:border-red-400/50",
        buttonBg: "bg-red-50/30",
        inputBg: "bg-red-50/20",
      },
      info: {
        button:
          "border-blue-200/30 hover:border-blue-300/40 focus:border-blue-400/50",
        input: "border-blue-200/30 focus:border-blue-400/50",
        buttonBg: "bg-blue-50/30",
        inputBg: "bg-blue-50/20",
      },
    };

    const config = sizeConfig[size];
    const colors = variantConfig[variant];

    // Utility functions
    const clampValue = useCallback(
      (val: number) => {
        return Math.max(min, Math.min(max, val));
      },
      [min, max]
    );

    const roundToPrecision = useCallback(
      (val: number) => {
        return (
          Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision)
        );
      },
      [precision]
    );

    const updateValue = useCallback(
      (newValue: number) => {
        const clampedValue = clampValue(newValue);
        const roundedValue = roundToPrecision(clampedValue);

        if (value === undefined) {
          setInternalValue(roundedValue);
        }

        onChange?.(roundedValue);

        // Announce value changes for screen readers
        announceToScreenReader(`Value ${formatValue(roundedValue)}`, "polite");
      },
      [value, onChange, clampValue, roundToPrecision, formatValue]
    );

    const increment = useCallback(() => {
      if (disabled || currentValue >= max) return;
      updateValue(currentValue + step);
      play("tap");
    }, [disabled, currentValue, max, step, updateValue, play]);

    const decrement = useCallback(() => {
      if (disabled || currentValue <= min) return;
      updateValue(currentValue - step);
      play("tap");
    }, [disabled, currentValue, min, step, updateValue, play]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      },
      []
    );

    const handleInputBlur = useCallback(() => {
      setIsInputFocused(false);
      const parsed = parseValue(inputValue);

      if (!isNaN(parsed)) {
        updateValue(parsed);
      } else {
        setInputValue(formatValue(currentValue));
      }
    }, [inputValue, parseValue, updateValue, currentValue, formatValue]);

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            increment();
            break;
          case "ArrowDown":
            e.preventDefault();
            decrement();
            break;
          case "Enter":
            e.preventDefault();
            inputRef.current?.blur();
            break;
          case "Escape":
            e.preventDefault();
            setInputValue(formatValue(currentValue));
            inputRef.current?.blur();
            break;
        }
      },
      [increment, decrement, formatValue, currentValue]
    );

    // Long press handlers
    const startLongPress = useCallback(
      (action: () => void) => {
        if (!repeatOnLongPress) return;

        longPressTimeoutRef.current = setTimeout(() => {
          longPressIntervalRef.current = setInterval(action, longPressInterval);
        }, longPressDelay);
      },
      [repeatOnLongPress, longPressDelay, longPressInterval]
    );

    const stopLongPress = useCallback(() => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      if (longPressIntervalRef.current) {
        clearInterval(longPressIntervalRef.current);
      }
    }, []);

    const handleIncrementMouseDown = useCallback(() => {
      increment();
      startLongPress(increment);
    }, [increment, startLongPress]);

    const handleDecrementMouseDown = useCallback(() => {
      decrement();
      startLongPress(decrement);
    }, [decrement, startLongPress]);

    // Clean up long press timers
    useEffect(() => {
      return () => {
        stopLongPress();
      };
    }, [stopLongPress]);

    const canIncrement = !disabled && currentValue < max;
    const canDecrement = !disabled && currentValue > min;

    const renderButton = (
      type: "increment" | "decrement",
      icon: React.ReactNode,
      onMouseDown: () => void,
      canPerformAction: boolean
    ) => (
      <Motion
        preset={isMotionSafe && respectMotionPreference ? "scaleIn" : "none"}
      >
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          animation={isMotionSafe && respectMotionPreference ? "float" : "none"}
          performanceMode="high"
          liftOnHover={!disabled}
          press
          className={cn(
            "glass-stepper-button flex items-center justify-center",
            "glass-radius-md border glass-glass-backdrop-blur-md transition-all duration-200 glass-contrast-guard",
            "focus:outline-none glass-focus select-none glass-touch-target",
            config.button,
            colors.button,
            colors.buttonBg,
            !canPerformAction && "opacity-50 cursor-not-allowed",
            canPerformAction && "cursor-pointer hover:scale-105 active:scale-95"
          )}
          onMouseDown={canPerformAction ? onMouseDown : undefined}
          onMouseUp={stopLongPress}
          onMouseLeave={stopLongPress}
          onTouchStart={canPerformAction ? onMouseDown : undefined}
          onTouchEnd={stopLongPress}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label={
            type === "increment" ? "Increase value" : "Decrease value"
          }
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (canPerformAction) {
                type === "increment" ? increment() : decrement();
              }
            }
          }}
        >
          {icon}
        </OptimizedGlass>
      </Motion>
    );

    const incrementButton = renderButton(
      "increment",
      incrementContent || (
        <svg
          className='w-4 h-4'
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v12m6-6H6"
          />
        </svg>
      ),
      handleIncrementMouseDown,
      canIncrement
    );

    const decrementButton = renderButton(
      "decrement",
      decrementContent || (
        <svg
          className='w-4 h-4'
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 12H6"
          />
        </svg>
      ),
      handleDecrementMouseDown,
      canDecrement
    );

    const inputElement = showInput && (
      <OptimizedGlass
        elevation="level1"
        intensity="subtle"
        depth={0.5}
        tint="neutral"
        border="subtle"
        className={cn("glass-stepper-input", colors.inputBg)}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled || !allowInput}
          className={cn(
            "w-full text-center glass-radius-md border glass-glass-backdrop-blur-md glass-contrast-guard",
            "bg-transparent text-foreground placeholder:glass-text-secondary",
            "focus:outline-none glass-focus transition-all duration-200",
            config.input,
            colors.input,
            disabled && "cursor-not-allowed opacity-50"
          )}
          {...a11yProps}
          aria-valuemin={isFinite(min) ? min : undefined}
          aria-valuemax={isFinite(max) ? max : undefined}
          aria-valuenow={currentValue}
          aria-valuetext={formatValue(currentValue)}
          role="spinbutton"
        />
      </OptimizedGlass>
    );

    return (
      <div
        className={cn("glass-stepper-container", className)}
        data-testid={dataTestId}
      >
        {/* Label */}
        {label && (
          <label
            id={labelId}
            htmlFor={finalId}
            className={cn(
              "glass-stepper-label block font-medium text-foreground glass-mb-2",
              config.label,
              required &&
                'after:content-["*"] after:glass-ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        {/* Stepper */}
        <div
          ref={ref}
          id={id}
          className={cn(
            "glass-stepper inline-flex items-center",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            config.container,
            disabled && "opacity-50",
            error && "ring-2 ring-destructive/50 glass-radius-lg glass-p-1"
          )}
        >
          {orientation === "horizontal" ? (
            <>
              {decrementButton}
              {inputElement}
              {incrementButton}
            </>
          ) : (
            <>
              {incrementButton}
              {inputElement}
              {decrementButton}
            </>
          )}
        </div>

        {/* Description */}
        {description && (
          <p
            id={descriptionId}
            className={cn(
              "glass-stepper-description glass-text-secondary glass-mt-1",
              size === "sm" ? "glass-text-xs" : "glass-text-sm"
            )}
          >
            {description}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className={cn(
              "glass-stepper-error text-destructive glass-mt-1",
              size === "sm" ? "glass-text-xs" : "glass-text-sm"
            )}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

GlassStepper.displayName = "GlassStepper";

export default GlassStepper;
