/**
 * Glass ToggleButton Component
 *
 * A button that can be toggled on/off, with glass morphism styling.
 */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Motion, OptimizedGlass } from "../../primitives";
import { createButtonA11y, useA11yId } from "../../utils/a11y";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import {
  useInteractionRecorder,
  usePredictiveEngine,
} from "../advanced/GlassPredictiveEngine";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";

import { ToggleButtonProps } from "./types";

// Get color intent mapping
const getColorIntent = (
  color: string
): "neutral" | "primary" | "success" | "warning" | "danger" | "info" => {
  switch (color) {
    case "primary":
      return "primary";
    case "secondary":
      return "info";
    case "success":
      return "success";
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "neutral";
  }
};

// Get variant classes
const getVariantClasses = (
  variant: string,
  selected: boolean,
  color: string
) => {
  const baseClasses = "transition-all duration-200 ease-in-out";

  switch (variant) {
    case "primary":
      return cn(
        baseClasses,
        selected
          ? "bg-primary-500 glass-text-primary border-primary-600 shadow-md"
          : "bg-transparent text-primary-400 border-primary-300 hover:bg-primary-500/10"
      );
    case "secondary":
      return cn(
        baseClasses,
        selected
          ? "bg-secondary-500 glass-text-primary border-secondary-600 shadow-md"
          : "bg-transparent text-secondary-400 border-secondary-300 hover:bg-secondary-500/10"
      );
    case "outlined":
      return cn(
        baseClasses,
        "border-2",
        selected
          ? `bg-${color}-500 glass-text-primary border-${color}-600`
          : `bg-transparent text-${color}-400 border-${color}-300 hover:bg-${color}-500/10`
      );
    default:
      return cn(
        baseClasses,
        selected
          ? "bg-gray-600 glass-text-primary border-gray-700 shadow-md"
          : "bg-transparent glass-text-secondary border-gray-500 hover:bg-gray-600/10"
      );
  }
};

// Get size classes
const getSizeClasses = (size: string) => {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-sm min-w-16";
    case "lg":
      return "h-12 px-6 text-base min-w-24";
    case "md":
    case "medium":
    default:
      return "h-10 px-4 text-sm min-w-20";
  }
};

// Get group classes
const getGroupClasses = (
  grouped: boolean,
  groupOrientation: "horizontal" | "vertical" = "horizontal",
  isGroupStart: boolean = false,
  isGroupEnd: boolean = false
) => {
  if (!grouped) return "";

  const classes = [];

  if (groupOrientation === "horizontal") {
    if (!isGroupStart) classes.push("rounded-l-none border-l-0 -ml-px");
    if (!isGroupEnd) classes.push("rounded-r-none");
  } else {
    if (!isGroupStart) classes.push("rounded-t-none border-t-0 -mt-px");
    if (!isGroupEnd) classes.push("rounded-b-none");
  }

  return classes.join(" ");
};

// Enhanced toggle button props interface
interface EnhancedToggleButtonProps
  extends ToggleButtonProps,
    ConsciousnessFeatures {
  /** Accessible label for the button */
  "aria-label"?: string;
  /** ID of element that labels the button */
  "aria-labelledby"?: string;
  /** ID of element(s) that describe the button */
  "aria-describedby"?: string;
  /** Whether button controls expanded content */
  "aria-expanded"?: boolean;
  /** ID of element controlled by this button */
  "aria-controls"?: string;
  /** Whether button has popup menu or dialog */
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
  /** Description text for complex buttons (automatically creates describedby) */
  description?: string;
}

/**
 * ToggleButton Component Implementation
 */
function ToggleButtonComponent(
  props: EnhancedToggleButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const {
    value,
    selected = false,
    disabled = false,
    onChange,
    children,
    className,
    style,
    glass = false,
    // Prevent custom props from leaking to DOM
    glassVariant,
    blurStrength,
    color = "default",
    size = "medium",
    fullWidth = false,
    variant = "outlined",
    // Group props
    grouped = false,
    groupOrientation = "horizontal",
    isGroupStart = false,
    isGroupEnd = false,
    // Glass props
    intent = "neutral",
    elevation = "level2",
    tier = "medium",
    // Accessibility props
    description,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-expanded": ariaExpanded,
    "aria-controls": ariaControls,
    "aria-haspopup": ariaHaspopup,
    // Consciousness features
    predictive = false,
    preloadContent = false,
    eyeTracking = false,
    gazeResponsive = false,
    adaptive = false,
    biometricResponsive = false,
    spatialAudio = false,
    audioFeedback = false,
    trackAchievements = false,
    achievementId,
    usageContext = "toggle",
    ...rest
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Consciousness feature hooks - only initialize if features are enabled
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;
  const { recordInteraction } = usePredictiveEngine();
  const interactionRecorder =
    predictive || trackAchievements
      ? useInteractionRecorder(`glass-toggle-${variant}-${usageContext}`)
      : null;

  // Generate unique ID for accessibility
  const componentId = useA11yId("glass-toggle");
  const descriptionId = description
    ? useA11yId("glass-toggle-desc")
    : undefined;

  // Handle ref forwarding
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  // Eye tracking effects
  useEffect(() => {
    if (!gazeResponsive || !eyeTracker || !buttonRef.current) return;

    const handleGazeEnter = () => {
      if (!disabled) {
        setIsHovered(true);

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("toggle_gaze_enter", {
            x: buttonRef.current?.offsetLeft || 0,
            y: buttonRef.current?.offsetTop || 0,
            z: 0,
          });
        }
      }
    };

    const handleGazeExit = () => {
      setIsHovered(false);
    };

    // Eye tracking methods not available in current implementation
    // eyeTracker.onGazeEnter(buttonRef.current, handleGazeEnter);
    // eyeTracker.onGazeExit(buttonRef.current, handleGazeExit);

    return () => {
      if (buttonRef.current) {
        // eyeTracker.offGazeEnter(buttonRef.current, handleGazeEnter);
        // eyeTracker.offGazeExit(buttonRef.current, handleGazeExit);
      }
    };
  }, [gazeResponsive, eyeTracker, disabled, spatialAudioEngine, audioFeedback]);

  // Enhanced interaction tracking
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;

      setClickCount((prev: any) => prev + 1);

      // Record interaction for predictive learning
      if (recordInteraction) {
        recordInteraction({
          type: "click",
          element: "toggle-button",
          context: {
            viewport: { width: window.innerWidth, height: window.innerHeight },
            timeOfDay: new Date().getHours(),
            deviceType:
              window.innerWidth < 768
                ? "mobile"
                : window.innerWidth < 1024
                  ? "tablet"
                  : "desktop",
          },
          metadata: { action: "toggle-click", selected: !selected },
        });
      }

      // Play spatial audio feedback
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("toggle_click", {
          x: buttonRef.current?.offsetLeft || 0,
          y: buttonRef.current?.offsetTop || 0,
          z: 0,
        });
      }

      // Track achievements
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction(achievementId || "toggle_interaction", {
          variant,
          context: usageContext,
          selected: !selected,
          clickCount,
          timestamp: Date.now(),
        });
      }

      // Call original onChange handler
      if (onChange && value !== undefined) {
        onChange(event as React.MouseEvent<HTMLButtonElement>, value);
      }
    },
    [
      disabled,
      interactionRecorder,
      spatialAudioEngine,
      audioFeedback,
      achievementTracker,
      trackAchievements,
      achievementId,
      variant,
      usageContext,
      selected,
      clickCount,
      onChange,
      value,
    ]
  );

  // Create accessibility attributes
  const a11yProps = createButtonA11y({
    id: componentId,
    label: ariaLabel,
    description,
    pressed: selected,
    expanded:
      typeof ariaExpanded === "boolean"
        ? ariaExpanded
        : ariaExpanded === "true"
          ? true
          : ariaExpanded === "false"
            ? false
            : undefined,
    controls: ariaControls,
    haspopup:
      ariaHaspopup === "false"
        ? false
        : ariaHaspopup === "true"
          ? true
          : (ariaHaspopup as any),
    disabled: disabled,
    descriptionId,
  });

  // Get computed classes
  const colorIntent = getColorIntent(color);
  const variantClasses = getVariantClasses(variant, selected, color);
  const sizeClasses = getSizeClasses(size);
  const groupClasses = getGroupClasses(
    grouped,
    groupOrientation,
    isGroupStart,
    isGroupEnd
  );

  const baseClasses = cn(
    // Base styles
    "inline-flex items-center justify-center relative",
    "box-border outline-none border-0 m-0",
    "select-none align-middle appearance-none no-underline",
    "font-medium leading-7",
    "glass-radius-md border",
    // Size classes
    sizeClasses,
    // Variant classes
    variantClasses,
    // Group classes
    groupClasses,
    // Full width
    fullWidth && "w-full",
    // Disabled state
    disabled && "cursor-default pointer-events-none opacity-50",
    !disabled && "cursor-pointer glass-focus glass-touch-target",
    // Consciousness feature styles
    gazeResponsive &&
      isHovered /* || (eyeTracker?.isGazing && !disabled) */ &&
      "ring-2 ring-blue-400/40",
    className
  );

  const combinedStyle = { ...style };

  if (glass) {
    return (
      <Motion
        data-glass-component
        preset="scaleIn"
        animateOnHover={true}
        duration={0.2}
        className="inline-block"
      >
        <OptimizedGlass
          ref={(node) => {
            if (ref) {
              if (typeof ref === "function") {
                ref(node as any);
              } else {
                ref.current = node as any;
              }
            }
            if (buttonRef.current !== undefined) {
              (buttonRef as any).current = node;
            }
          }}
          as="button"
          intent={intent}
          elevation={elevation}
          tier={tier}
          variant="frosted"
          intensity="medium"
          border="subtle"
          interactive
          hoverSheen
          liftOnHover
          press
          className={baseClasses}
          style={combinedStyle}
          type="button"
          disabled={disabled}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...a11yProps}
          {...rest}
        >
          <span className="relative z-10">{children}</span>
          {description && (
            <span id={descriptionId} className="sr-only">
              {description}
            </span>
          )}
        </OptimizedGlass>
      </Motion>
    );
  }

  return (
    <Motion
      preset="scaleIn"
      animateOnHover={true}
      duration={0.2}
      className="inline-block"
    >
      <button
        ref={(node) => {
          if (ref) {
            if (typeof ref === "function") {
              ref(node as HTMLButtonElement);
            } else {
              ref.current = node as HTMLButtonElement;
            }
          }
          if (buttonRef.current !== undefined) {
            (buttonRef as any).current = node;
          }
        }}
        className={baseClasses}
        style={combinedStyle}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...a11yProps}
        {...rest}
      >
        {children}
        {description && (
          <span id={descriptionId} className="sr-only">
            {description}
          </span>
        )}
      </button>
    </Motion>
  );
}

/**
 * ToggleButton Component
 *
 * A button that can be toggled on/off, with glass morphism styling.
 */
const ToggleButton = forwardRef(ToggleButtonComponent);

/**
 * GlassToggleButton Component
 *
 * Glass variant of the ToggleButton component.
 */
const GlassToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (props, ref) => {
    // Convert Booleanish aria-expanded to boolean
    const processedProps = {
      ...props,
      "aria-expanded":
        typeof props["aria-expanded"] === "boolean"
          ? props["aria-expanded"]
          : props["aria-expanded"] === "true"
            ? true
            : props["aria-expanded"] === "false"
              ? false
              : props["aria-expanded"],
    };

    return <ToggleButton {...processedProps} glass={true} ref={ref} />;
  }
);

GlassToggleButton.displayName = "GlassToggleButton";

export default ToggleButton;
export { GlassToggleButton, ToggleButton };
