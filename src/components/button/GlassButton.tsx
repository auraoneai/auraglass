'use client';
import { cn } from "../../lib/utilsComprehensive";
import { Slot } from "@radix-ui/react-slot";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { OptimizedGlass, type OptimizedGlassProps } from "../../primitives";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { Motion } from "../../primitives";
import { GlassButtonVariantType } from "./types";
import {
  createButtonA11y,
  useA11yId,
  announceToScreenReader,
} from "../../utils/a11y";
import {
  usePredictiveEngine,
  useInteractionRecorder,
} from "../advanced/GlassPredictiveEngine";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";

export interface GlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    ConsciousnessFeatures {
  /**
   * Button variant
   */
  variant?: GlassButtonVariantType;
  /**
   * Button size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Glass elevation
   */
  elevation?: OptimizedGlassProps["elevation"];
  /**
   * Glass variant for advanced effects
   */
  glassVariant?: "frosted" | "dynamic" | "clear" | "tinted" | "luminous";
  /**
   * Glass intensity
   */
  intensity?: OptimizedGlassProps["intensity"];
  /**
   * Glass depth layers
   */
  depth?: OptimizedGlassProps["depth"];
  /**
   * Glass tint color
   */
  tint?: OptimizedGlassProps["tint"];
  /**
   * Glass border style
   */
  border?: "subtle" | "glow" | "neon" | "none";
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Icon only button
   */
  iconOnly?: boolean;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Animation preset
   */
  animation?: "none" | "scale" | "bounce" | "pulse";
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  /**
   * Loading spinner
   */
  loadingSpinner?: React.ReactNode;
  /**
   * Loading text to display
   */
  loadingText?: string;
  /**
   * Render the button as its child element (Slot pattern)
   */
  asChild?: boolean;
  /**
   * Flat style override for ghost/link — removes bg/border/shadow/rings
   */
  flat?: boolean;
  /**
   * Glass material variant
   */
  material?: "glass" | "liquid";
  /**
   * Material properties for liquid glass
   */
  materialProps?: {
    ior?: number;
    thickness?: number;
    tint?: { r: number; g: number; b: number; a: number };
    variant?: "regular" | "clear";
    quality?: "ultra" | "high" | "balanced" | "efficient";
  };

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Performance tier */
  tier?: "low" | "medium" | "high";

  // Accessibility props
  /**
   * Accessible label for the button (required for iconOnly buttons)
   */
  "aria-label"?: string;
  /**
   * ID of element that labels the button
   */
  "aria-labelledby"?: string;
  /**
   * ID of element(s) that describe the button
   */
  "aria-describedby"?: string;
  /**
   * Whether button is pressed/active (for toggle buttons)
   */
  "aria-pressed"?: boolean;
  /**
   * Whether button controls expanded content
   */
  "aria-expanded"?: boolean;
  /**
   * ID of element controlled by this button
   */
  "aria-controls"?: string;
  /**
   * Whether button has popup menu or dialog
   */
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
  /**
   * Description text for complex buttons (automatically creates describedby)
   */
  description?: string;
}

/**
 * GlassButton component
 * A glassmorphism button with multiple variants and animations
 */
export const GlassButton = forwardRef(function GlassButton(
  {
    variant = "default",
    size = "md",
    elevation = "level2",
    glassVariant = "frosted",
    intensity = "medium",
    depth = 2,
    tint = "neutral",
    border = "subtle",
    loading = false,
    iconOnly = false,
    fullWidth = false,
    animation = "none",
    leftIcon,
    rightIcon,
    loadingSpinner,
    loadingText = "Loading...",
    className,
    children,
    disabled,
    asChild = false,
    flat = false,
    material = "glass",
    materialProps,
    description,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-pressed": ariaPressed,
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
    usageContext = "main",
    ...props
  }: GlassButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickCount, setClickCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [adaptiveSize, setAdaptiveSize] = useState(size);
  const [predictedAction, setPredictedAction] = useState<string | null>(null);

  // Consciousness feature hooks - only initialize if features are enabled
  const predictiveEngine = predictive ? usePredictiveEngine() : null;
  const eyeTracker = eyeTracking ? useEyeTracking() : null;
  const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
  const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
  const achievementTracker = trackAchievements ? useAchievements() : null;
  const interactionRecorder =
    predictive || trackAchievements
      ? useInteractionRecorder(`glass-button-${variant}-${usageContext}`)
      : null;
  // Generate unique ID for accessibility
  const componentId = useA11yId("glass-button");
  const descriptionId = description
    ? useA11yId("glass-button-desc")
    : undefined;

  // Handle ref forwarding
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  // Utility: filter out non-DOM props before spreading on elements
  const filterDomProps = useCallback((p: any) => {
    const {
      loadingText: _lt,
      asChild: _ac,
      leftIcon: _li,
      rightIcon: _ri,
      loadingSpinner: _ls,
      animation: _an,
      flat: _fl,
      description: _desc,
      // Master flag
      consciousness: _cons,
      // Consciousness-related props
      predictive: _pred,
      preloadContent: _prel,
      eyeTracking: _eye,
      gazeResponsive: _gaze,
      adaptive: _ad,
      biometricResponsive: _bio,
      spatialAudio: _sa,
      audioFeedback: _af,
      trackAchievements: _ta,
      achievementId: _aid,
      usageContext: _uctx,
      onClick: _oc,
      ...valid
    } = (p || {}) as any;
    return valid;
  }, []);

  // Biometric adaptation effects
  useEffect(() => {
    if (!biometricResponsive || !biometricAdapter) return;

    const adaptButton = () => {
      const stressLevel = biometricAdapter.currentStressLevel;
      // For now, assume desktop capabilities
      const deviceCapabilities = { isMobile: false, isDesktop: true };

      // Adapt button size based on device and stress
      if (deviceCapabilities.isMobile && stressLevel > 0.7) {
        setAdaptiveSize("lg"); // Larger touch targets when stressed on mobile
      } else if (stressLevel < 0.3 && deviceCapabilities.isDesktop) {
        setAdaptiveSize("sm"); // Smaller size when relaxed on desktop
      } else {
        setAdaptiveSize(size); // Use original size
      }
    };

    // Initial adaptation
    adaptButton();

    // Listen for biometric changes
    const interval = setInterval(adaptButton, 3000);
    return () => clearInterval(interval);
  }, [biometricResponsive, biometricAdapter, size]);

  // Eye tracking effects
  useEffect(() => {
    if (!gazeResponsive || !eyeTracker || !buttonRef.current) return;

    const handleGazeEnter = () => {
      if (!disabled && !loading) {
        setIsHovered(true);

        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("button_gaze_enter", {
            x: buttonRef.current?.offsetLeft || 0,
            y: buttonRef.current?.offsetTop || 0,
            z: 0, // Default to center depth
          });
        }

        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction("button_gaze_attention", {
            variant,
            context: usageContext,
            buttonText: typeof children === "string" ? children : "button",
          });
        }
      }
    };

    const handleGazeExit = () => {
      setIsHovered(false);

      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("button_gaze_exit");
      }
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
  }, [
    gazeResponsive,
    eyeTracker,
    disabled,
    loading,
    spatialAudioEngine,
    audioFeedback,
    achievementTracker,
    trackAchievements,
    variant,
    usageContext,
    children,
  ]);

  // Predictive action detection
  useEffect(() => {
    if (!predictive || !predictiveEngine) return;

    // Check for predicted actions related to this button
    const predictions = predictiveEngine.predictions;
    const buttonPrediction = predictions.find(
      (p) =>
        p.metadata?.buttonVariant === variant ||
        p.metadata?.buttonContext === usageContext
    );

    if (buttonPrediction && buttonPrediction.confidence > 0.7) {
      setPredictedAction(buttonPrediction.type);

      // Preload action if specified
      if (preloadContent && buttonPrediction.type === "preload") {
        console.log(
          `Preloading content for button: ${variant}-${usageContext}`
        );
      }
    } else {
      setPredictedAction(null);
    }
  }, [predictive, predictiveEngine, variant, usageContext, preloadContent]);

  // Enhanced interaction tracking
  const handleInteraction = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      setClickCount((prev: any) => prev + 1);

      // Record interaction for predictive learning
      if (interactionRecorder) {
        interactionRecorder.recordClick(event);
      }

      // Play spatial audio feedback
      if (spatialAudioEngine && audioFeedback) {
        spatialAudioEngine.playGlassSound("button_click_success", {
          x: buttonRef.current?.offsetLeft || 0,
          y: buttonRef.current?.offsetTop || 0,
          z: 0, // Default to center depth
        });
      }

      // Track achievements
      if (achievementTracker && trackAchievements) {
        achievementTracker.recordAction(achievementId || "button_interaction", {
          variant,
          context: usageContext,
          clickCount,
          buttonText: typeof children === "string" ? children : "button",
          timestamp: Date.now(),
        });

        // Special achievements for frequent use
        if (clickCount > 0 && clickCount % 10 === 0) {
          achievementTracker.recordAction("button_power_user", {
            variant,
            totalClicks: clickCount,
          });
        }
      }

      // Call original onClick handler
      props.onClick?.(event);
    },
    [
      disabled,
      loading,
      interactionRecorder,
      spatialAudioEngine,
      audioFeedback,
      achievementTracker,
      trackAchievements,
      achievementId,
      variant,
      usageContext,
      clickCount,
      children,
      props.onClick,
    ]
  );

  // Ensure icon-only controls default to a non-frosted appearance
  const resolvedVariant =
    iconOnly && (variant === "default" || !variant)
      ? ("ghost" as GlassButtonVariantType)
      : variant;

  // Validate accessibility requirements
  React.useEffect(() => {
    if (iconOnly && !ariaLabel && !ariaLabelledBy && !children) {
      console.warn(
        "GlassButton: Icon-only buttons must have an aria-label or aria-labelledby prop for accessibility"
      );
    }
  }, [iconOnly, ariaLabel, ariaLabelledBy, children]);

  // Create accessibility attributes
  const a11yProps = createButtonA11y({
    id: componentId,
    label: ariaLabel,
    description,
    pressed: ariaPressed,
    expanded: ariaExpanded,
    controls: ariaControls,
    haspopup:
      ariaHaspopup === "true"
        ? true
        : ariaHaspopup === "false"
          ? false
          : ariaHaspopup,
    disabled: disabled || loading,
    descriptionId,
  });

  // Announce loading state changes to screen readers
  React.useEffect(() => {
    if (loading) {
      announceToScreenReader(loadingText, "polite");
    }
  }, [loading, loadingText]);

  // Use adaptive size if biometric adaptation is enabled, otherwise use original size
  const effectiveSize = biometricResponsive ? adaptiveSize : size;

  const sizeClasses = {
    xs: iconOnly ? "h-6 w-6 p-0" : "h-6 px-2 text-xs",
    sm: iconOnly ? "h-8 w-8 p-0" : "h-8 px-3 text-sm",
    md: iconOnly ? "h-10 w-10 p-0" : "h-10 px-4 text-sm",
    lg: iconOnly ? "h-12 w-12 p-0" : "h-12 px-6 text-base",
    xl: iconOnly ? "h-14 w-14 p-0" : "h-14 px-8 text-lg",
  };

  const baseClasses = cn(
    // Base styles
    "inline-flex items-center justify-center",
    "font-medium",
    "transition-all duration-300 ease-out",
    // Unified focus ring utility
    "glass-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "relative overflow-hidden",
    // Specular overlay + parallax support
    // Avoid specular overlay on icon-only buttons to prevent hard frost look
    !iconOnly && "glass-overlay-specular glass-parallax",
    // Size - use effective size with biometric adaptation
    sizeClasses?.[effectiveSize],
    // Full width
    {
      "w-full": fullWidth,
    },
    // Consciousness feature styles
    {
      "glass-focus-strong glass-surface-primary":
        gazeResponsive &&
        isHovered /* || (eyeTracker?.isGazing && !disabled) */,
      "animate-pulse": predictedAction === "suggest" && !disabled,
      "glass-focus glass-surface-success":
        predictedAction === "preload" && !disabled,
      "transform-gpu": biometricResponsive || gazeResponsive,
      "scale-105": gazeResponsive && isHovered && !disabled,
    }
  );

  const variantStyles = {
    default: {
      glassVariant: "frosted" as const,
      tint: "neutral" as const,
      intensity: "medium" as const,
      border: "subtle" as const,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    primary: {
      glassVariant: "liquid" as const,
      tint: "blue" as const,
      intensity: "strong" as const,
      border: "glow" as const,
      lighting: "volumetric" as const,
      caustics: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    secondary: {
      glassVariant: "crystal" as const,
      tint: "purple" as const,
      intensity: "strong" as const,
      border: "glow" as const,
      lighting: "directional" as const,
      refraction: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    tertiary: {
      glassVariant: "frosted" as const,
      tint: "gray" as const,
      intensity: "medium" as const,
      border: "subtle" as const,
      lighting: "ambient" as const,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    destructive: {
      glassVariant: "frosted" as const,
      tint: "red" as const,
      intensity: "extreme" as const,
      border: "neon" as const,
      lighting: "directional" as const,
      chromatic: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    error: {
      glassVariant: "frosted" as const,
      tint: "red" as const,
      intensity: "extreme" as const,
      border: "neon" as const,
      lighting: "directional" as const,
      chromatic: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    success: {
      glassVariant: "frosted" as const,
      tint: "green" as const,
      intensity: "strong" as const,
      border: "glow" as const,
      lighting: "directional" as const,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    warning: {
      glassVariant: "frosted" as const,
      tint: "orange" as const,
      intensity: "strong" as const,
      border: "glow" as const,
      lighting: "directional" as const,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    outline: {
      glassVariant: "ethereal" as const,
      tint: "neutral" as const,
      intensity: "medium" as const,
      border: "glow" as const,
      lighting: "ambient" as const,
      adaptive: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
    ghost: {
      glassVariant: "ethereal" as const,
      tint: "neutral" as const,
      intensity: "subtle" as const,
      border: "none" as const,
      lighting: "ambient" as const,
      adaptive: true,
      className: "glass-text-secondary hover:glass-text-primary glass-elev-0",
    },
    link: {
      glassVariant: "ethereal" as const,
      tint: "blue" as const,
      intensity: "subtle" as const,
      border: "none" as const,
      className:
        "glass-text-link hover:glass-text-link-hover underline-offset-4 hover:underline",
    },
    gradient: {
      glassVariant: "holographic" as const,
      tint: "rainbow" as const,
      intensity: "ultra" as const,
      border: "dynamic" as const,
      lighting: "iridescent" as const,
      chromatic: true,
      parallax: true,
      className: "glass-text-primary hover:glass-text-secondary",
    },
  };

  const variantConfig = variantStyles?.[resolvedVariant];

  // Map variant to accent focus ring utility
  const variantAccent =
    resolvedVariant === "destructive" || resolvedVariant === "error"
      ? "glass-accent-danger"
      : resolvedVariant === "success"
        ? "glass-accent-success"
        : resolvedVariant === "warning"
          ? "glass-accent-warning"
          : resolvedVariant === "secondary"
            ? "glass-accent-info"
            : "glass-accent-primary";

  const getAnimationPreset = () => {
    switch (animation) {
      case "scale":
        return "scaleIn";
      case "bounce":
        return "bounceIn";
      case "pulse":
        return "pulseIn";
      default:
        return "none";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {loadingSpinner || (
            <div className="w-4 h-4 glass-border-2 glass-border-current glass-border-t-transparent glass-radius-full animate-spin" />
          )}
          {!iconOnly && <span className="ml-2">{loadingText}</span>}
        </>
      );
    }

    if (iconOnly) {
      return leftIcon || rightIcon || children;
    }

    return (
      <>
        {leftIcon && (
          <span className="mr-2" data-icon>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2" data-icon>
            {rightIcon}
          </span>
        )}
      </>
    );
  };

  if (resolvedVariant === "ghost" || resolvedVariant === "link") {
    const Comp: any = asChild ? Slot : "button";
    return (
      <Motion
        data-glass-component
        preset={getAnimationPreset()}
        animateOnHover={animation !== "none"}
        className="inline-block"
      >
        <Comp
          className={cn(
            baseClasses,
            variantAccent,
            variantConfig.className,
            "glass-radius-md overflow-visible glass-magnet glass-ripple glass-press",
            flat &&
              "bg-transparent border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            className
          )}
          disabled={disabled || loading}
          onClick={handleInteraction}
          ref={buttonRef}
          {...a11yProps}
          {...filterDomProps(props)}
        >
          {renderContent()}
          {description && (
            <span
              id={descriptionId}
              className="sr-only glass-focus glass-touch-target glass-contrast-guard"
            >
              {description}
            </span>
          )}
        </Comp>
      </Motion>
    );
  }

  return (
    <Motion
      preset={getAnimationPreset()}
      animateOnHover={animation !== "none"}
      className="inline-block"
    >
      {material === "liquid" ? (
        <LiquidGlassMaterial
          as={asChild ? (Slot as any) : "button"}
          ior={materialProps?.ior || (variant === "primary" ? 1.48 : 1.44)}
          thickness={
            materialProps?.thickness ||
            (size === "xs" ? 4 : size === "sm" ? 6 : size === "md" ? 8 : 10)
          }
          tint={
            materialProps?.tint ||
            (variant === "primary"
              ? { r: 59, g: 130, b: 246, a: 0.1 }
              : { r: 0, g: 0, b: 0, a: 0.05 })
          }
          variant={materialProps?.variant || "regular"}
          quality={materialProps?.quality || "high"}
          environmentAdaptation
          motionResponsive
          interactive
          className={cn(
            baseClasses,
            variantAccent,
            variantConfig.className,
            "liquid-glass-button-surface glass-ripple glass-magnet",
            className
          )}
          style={
            {
              "--liquid-glass-button-pressure": isHovered ? "0.02" : "0.0",
              "--liquid-glass-hover-refraction": "1.2",
              "--liquid-glass-press-density": "0.95",
            } as React.CSSProperties
          }
          data-liquid-glass-button="true"
          data-button-variant={variant}
          data-button-size={size}
          disabled={disabled || loading}
          onClick={handleInteraction}
          ref={buttonRef}
          {...a11yProps}
          {...(() => {
            const {
              loadingText: _,
              asChild: __,
              leftIcon: ___,
              rightIcon: ____,
              loadingSpinner: _____,
              animation: ______,
              description: _______,
              // Filter out the master flag too so it never hits the DOM
              consciousness: __ignoreConsciousness,
              material: ________,
              materialProps: _________,
              predictive: __________,
              preloadContent: ___________,
              eyeTracking: ____________,
              gazeResponsive: _____________,
              adaptive: ______________,
              biometricResponsive: _______________,
              spatialAudio: ________________,
              audioFeedback: _________________,
              trackAchievements: __________________,
              achievementId: ___________________,
              usageContext: ____________________,
              onClick: _____________________,
              ...validProps
            } = props as any;
            return validProps;
          })()}
        >
          {asChild ? (
            // When rendering asChild (Slot), Slot expects exactly one child element.
            // Defer content to the passed child to avoid React.Children.only errors.
            (children as any)
          ) : (
            <>
              {resolvedVariant === "gradient" && (
                <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-secondary/20 glass-gradient-primary glass-radius-md glass-focus glass-touch-target glass-contrast-guard" />
              )}
              <span className="relative z-10">{renderContent()}</span>
              {description && (
                <span id={descriptionId} className="sr-only">
                  {description}
                </span>
              )}
            </>
          )}
        </LiquidGlassMaterial>
      ) : (
        <OptimizedGlass
          as={asChild ? (Slot as any) : "button"}
          variant={glassVariant || variantConfig.glassVariant}
          elevation={elevation}
          intensity={intensity || variantConfig.intensity}
          depth={depth}
          tint={tint || variantConfig.tint}
          border={border || variantConfig.border || "subtle"}
          animation={
            animation === "none"
              ? "none"
              : animation === "scale"
                ? "float"
                : animation === "bounce"
                  ? "pulse"
                  : "shimmer"
          }
          lighting={(variantConfig as any).lighting || "ambient"}
          caustics={(variantConfig as any).caustics || false}
          chromatic={(variantConfig as any).chromatic || false}
          parallax={(variantConfig as any).parallax || false}
          refraction={(variantConfig as any).refraction || false}
          adaptive={(variantConfig as any).adaptive || false}
          interactive
          hoverSheen
          liftOnHover
          press
          magnet
          cursorHighlight={false}
          performanceMode="ultra"
          className={cn(
            baseClasses,
            variantAccent,
            variantConfig.className,
            "glass-radius-md glass-ripple glass-magnet",
            className
          )}
          disabled={disabled || loading}
          onClick={handleInteraction}
          ref={buttonRef}
          {...a11yProps}
          {...filterDomProps(props)}
        >
          {asChild ? (
            // When rendering asChild (Slot), Slot expects exactly one child element.
            // Defer content to the passed child to avoid React.Children.only errors.
            (children as any)
          ) : (
            <>
              {resolvedVariant === "gradient" && (
                <div className="absolute inset-0 glass-gradient-primary glass-gradient-primary via-secondary/20 glass-gradient-primary glass-radius-md glass-focus glass-touch-target glass-contrast-guard" />
              )}
              <span className="relative z-10">{renderContent()}</span>
              {description && (
                <span id={descriptionId} className="sr-only">
                  {description}
                </span>
              )}
            </>
          )}
        </OptimizedGlass>
      )}
    </Motion>
  );
});

GlassButton.displayName = "GlassButton";

/**
 * Icon Button component
 */
export interface IconButtonProps
  extends Omit<GlassButtonProps, "iconOnly" | "leftIcon" | "rightIcon"> {
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Accessible label
   */
  "aria-label": string;
}

export const IconButton = forwardRef(function IconButton(
  {
    icon,
    variant = "ghost",
    flat = true,
    size = "sm",
    ...props
  }: IconButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <GlassButton
      ref={ref}
      iconOnly
      variant={variant}
      flat={flat}
      size={size as any}
      {...props}
    >
      {icon}
    </GlassButton>
  );
});

IconButton.displayName = "IconButton";

/**
 * Button Group component
 */
export interface ButtonGroupProps {
  children: React.ReactNode;
  /**
   * Group orientation
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Group size
   */
  size?: GlassButtonProps["size"];
  /**
   * Group variant
   */
  variant?: GlassButtonProps["variant"];
  /**
   * Whether buttons are connected
   */
  connected?: boolean;
  className?: string;
}

export function ButtonGroup({
  children,
  orientation = "horizontal",
  size,
  variant,
  connected = true,
  className,
}: ButtonGroupProps) {
  const groupClasses = cn(
    "inline-flex",
    {
      "flex-row": orientation === "horizontal",
      "flex-col": orientation === "vertical",
    },
    className
  );

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;

    const isFirst = index === 0;
    const isLast = index === React.Children.count(children) - 1;

    const additionalProps: any = {};

    if (size) additionalProps.size = size;
    if (variant) additionalProps.variant = variant;

    if (connected) {
      if (orientation === "horizontal") {
        additionalProps.className = cn((child as any).props?.className, {
          "rounded-r-none border-r-0": !isLast,
          "rounded-l-none": !isFirst,
        });
      } else {
        additionalProps.className = cn((child as any).props?.className, {
          "rounded-b-none border-b-0": !isLast,
          "rounded-t-none": !isFirst,
        });
      }
    } else {
      additionalProps.className = cn(
        (child as any).props?.className,
        orientation === "horizontal"
          ? "glass-mr-2 last:mr-0"
          : "glass-mb-2 last:glass-mb-0"
      );
    }

    return React.cloneElement(child, additionalProps);
  });

  return <div className={groupClasses}>{enhancedChildren}</div>;
}

/**
 * Toggle Button component
 */
export interface ToggleButtonProps extends Omit<GlassButtonProps, "variant"> {
  /**
   * Whether the button is pressed/active
   */
  pressed?: boolean;
  /**
   * Callback when pressed state changes
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Pressed variant
   */
  pressedVariant?: GlassButtonProps["variant"];
  /**
   * Unpressed variant
   */
  unpressedVariant?: GlassButtonProps["variant"];
}

export const ToggleButton = forwardRef(function ToggleButton(
  {
    pressed = false,
    onPressedChange,
    pressedVariant = "primary",
    unpressedVariant = "outline",
    onClick,
    ...props
  }: ToggleButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPressedChange?.(!pressed);
    onClick?.(event);
  };

  return (
    <GlassButton
      ref={ref}
      variant={pressed ? pressedVariant : unpressedVariant}
      onClick={handleClick}
      aria-pressed={pressed}
      {...props}
    />
  );
});

ToggleButton.displayName = "ToggleButton";

/**
 * Floating Action Button component
 */
export interface FloatingActionButtonProps
  extends Omit<GlassButtonProps, "size" | "iconOnly"> {
  /**
   * FAB size
   */
  size?: "sm" | "md" | "lg";
  /**
   * FAB position
   */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Extended FAB with text
   */
  extended?: boolean;
  /**
   * Accessible label
   */
  "aria-label": string;
}

export const FloatingActionButton = forwardRef(function FloatingActionButton(
  {
    size = "md",
    position = "bottom-right",
    icon,
    extended = false,
    children,
    className,
    ...props
  }: FloatingActionButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const positionClasses = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  const sizeClasses = {
    sm: extended ? "h-8 px-3" : "h-8 w-8",
    md: extended ? "h-10 px-4" : "h-10 w-10",
    lg: extended ? "h-12 px-6" : "h-12 w-12",
  };

  return (
    <GlassButton
      ref={ref}
      variant="default"
      elevation={"level3"}
      animation="bounce"
      iconOnly={!extended}
      leftIcon={extended ? icon : undefined}
      className={cn(
        "shadow-lg z-50",
        "glass-radius-full",
        positionClasses?.[position],
        sizeClasses?.[size],
        className
      )}
      {...props}
    >
      {extended ? children : icon}
    </GlassButton>
  );
});

FloatingActionButton.displayName = "FloatingActionButton";

/**
 * Enhanced GlassButton with consciousness features enabled by default
 * Use this for buttons that should be intelligent and adaptive
 */
export const ConsciousGlassButton = forwardRef(function ConsciousGlassButton(
  props: GlassButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <GlassButton
      ref={ref}
      predictive={true}
      adaptive={true}
      biometricResponsive={true}
      trackAchievements={true}
      achievementId="conscious_button_usage"
      {...props}
    />
  );
});

ConsciousGlassButton.displayName = "ConsciousGlassButton";

/**
 * Eye-tracking enabled button for gaze-responsive interactions
 */
export const GazeResponsiveButton = forwardRef(function GazeResponsiveButton(
  props: GlassButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <GlassButton
      ref={ref}
      eyeTracking={true}
      gazeResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="gaze_button_interaction"
      {...props}
    />
  );
});

GazeResponsiveButton.displayName = "GazeResponsiveButton";

/**
 * Predictive button that learns user interaction patterns
 */
export const PredictiveButton = forwardRef(function PredictiveButton(
  props: GlassButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <GlassButton
      ref={ref}
      predictive={true}
      preloadContent={true}
      trackAchievements={true}
      achievementId="predictive_button_usage"
      {...props}
    />
  );
});

PredictiveButton.displayName = "PredictiveButton";

/**
 * Accessibility-focused button with biometric adaptation and spatial audio
 */
export const AccessibleButton = forwardRef(function AccessibleButton(
  props: GlassButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <GlassButton
      ref={ref}
      adaptive={true}
      biometricResponsive={true}
      spatialAudio={true}
      audioFeedback={true}
      trackAchievements={true}
      achievementId="accessible_button_usage"
      {...props}
    />
  );
});

AccessibleButton.displayName = "AccessibleButton";

/**
 * Pre-configured consciousness button presets
 */
export const ButtonConsciousnessPresets = {
  /**
   * Minimal consciousness features for performance-sensitive contexts
   */
  minimal: {
    predictive: true,
    trackAchievements: true,
  },

  /**
   * Balanced consciousness features for general use
   */
  balanced: {
    predictive: true,
    adaptive: true,
    biometricResponsive: true,
    trackAchievements: true,
  },

  /**
   * Full consciousness features for immersive experiences
   */
  immersive: {
    predictive: true,
    preloadContent: true,
    eyeTracking: true,
    gazeResponsive: true,
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },

  /**
   * Accessibility-focused consciousness features
   */
  accessible: {
    adaptive: true,
    biometricResponsive: true,
    spatialAudio: true,
    audioFeedback: true,
    trackAchievements: true,
  },
} as const;