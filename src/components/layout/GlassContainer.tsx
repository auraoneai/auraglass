"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import {
  useInteractionRecorder,
  usePredictiveEngine,
} from "../advanced/GlassPredictiveEngine";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface ConsciousnessFeatures {
  /**
   * Master consciousness toggle
   */
  consciousness?: boolean;
  /**
   * Enable predictive UI features
   */
  predictive?: boolean;
  /**
   * Enable content preloading
   */
  preloadContent?: boolean;
  /**
   * Enable eye tracking integration
   */
  eyeTracking?: boolean;
  /**
   * Enable gaze-responsive features
   */
  gazeResponsive?: boolean;
  /**
   * Enable biometric adaptation
   */
  adaptive?: boolean;
  /**
   * Enable biometric responsive features
   */
  biometricResponsive?: boolean;
  /**
   * Enable spatial audio
   */
  spatialAudio?: boolean;
  /**
   * Enable audio feedback
   */
  audioFeedback?: boolean;
  /**
   * Enable achievement tracking
   */
  trackAchievements?: boolean;
  /**
   * Achievement identifier
   */
  achievementId?: string;
  /**
   * Container usage context for consciousness features
   */
  usageContext?: "main" | "sidebar" | "modal" | "card" | "list" | "form";
}

export interface GlassContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ConsciousnessFeatures {
  /**
   * Container size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Container centering
   */
  centered?: boolean;
  /**
   * Container padding
   */
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Responsive padding
   */
  responsivePadding?: {
    sm?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    md?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    lg?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    xl?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
    "2xl"?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  };
  /**
   * Container variant
   */
  variant?: "default" | "fluid" | "breakout";
  /**
   * Whether to apply glassmorphism background
   */
  glass?: boolean;
  /**
   * Glass elevation level
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Border radius
   */
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
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
}

/**
 * GlassContainer component
 * Responsive container with glassmorphism styling, flexible sizing, and consciousness interface integration
 */
export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      size = "lg",
      centered = true,
      padding = "md",
      responsivePadding,
      variant = "default",
      glass = false,
      elevation = "level1",
      radius = "none",
      material = "glass",
      materialProps,
      className,
      children,
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
    },
    ref
  ) => {
    const [containerElement, setContainerElement] =
      useState<HTMLDivElement | null>(null);
    const localRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Forward ref to parent
    useImperativeHandle(ref, () => localRef.current as HTMLDivElement);
    const [adaptiveSize, setAdaptiveSize] = useState(size);
    const [adaptivePadding, setAdaptivePadding] = useState(padding);

    // Consciousness feature hooks - only initialize if features are enabled
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;
    const interactionRecorder =
      predictive || trackAchievements
        ? useInteractionRecorder(`glass-container-${usageContext}`)
        : null;

    // Visibility tracking for predictive preloading
    useEffect(() => {
      if (!containerElement || !preloadContent) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);

          if (entry.isIntersecting && interactionRecorder) {
            // Create synthetic scroll event
            const syntheticEvent = {
              currentTarget: { id: `container-${usageContext}` },
              type: "scroll",
            } as any;
            interactionRecorder.recordFocus(syntheticEvent);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerElement);
      return () => observer.disconnect();
    }, [preloadContent, usageContext, interactionRecorder]);

    // Biometric adaptation effects
    useEffect(() => {
      if (!biometricResponsive || !biometricAdapter) return;

      const adaptContainer = () => {
        const stressLevel = biometricAdapter.currentStressLevel;
        // For now, assume desktop capabilities
        const deviceCapabilities = { isMobile: false, isDesktop: true };

        // Adapt size based on device and stress
        if (deviceCapabilities.isMobile && stressLevel > 0.7) {
          setAdaptiveSize("xl"); // Larger touch targets when stressed on mobile
          setAdaptivePadding("lg"); // More padding for easier interaction
        } else if (stressLevel < 0.3 && deviceCapabilities.isDesktop) {
          setAdaptiveSize("md"); // Compact size when relaxed on desktop
          setAdaptivePadding("sm"); // Less padding for efficiency
        } else {
          setAdaptiveSize(size); // Use original size
          setAdaptivePadding(padding); // Use original padding
        }
      };

      // Initial adaptation
      adaptContainer();

      // Listen for biometric changes
      const interval = setInterval(adaptContainer, 5000);
      return () => clearInterval(interval);
    }, [biometricResponsive, biometricAdapter, size, padding]);

    // Eye tracking effects
    useEffect(() => {
      if (!gazeResponsive || !eyeTracker || !containerElement) return;

      const handleGazeEnter = () => {
        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("focus_enter", {
            x: containerElement?.offsetLeft || 0,
            y: containerElement?.offsetTop || 0,
            z: 0, // Default z position
          });
        }

        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction("container_gaze_attention", {
            context: usageContext,
            duration: Date.now(),
          });
        }
      };

      const handleGazeExit = () => {
        if (spatialAudioEngine && audioFeedback) {
          spatialAudioEngine.playGlassSound("focus_exit");
        }
      };

      // Note: Eye tracking event handlers not yet implemented
      // eyeTracker.onGazeEnter(containerRef.current, handleGazeEnter);
      // eyeTracker.onGazeExit(containerRef.current, handleGazeExit);

      return () => {
        // Note: Eye tracking cleanup not yet implemented
        // if (containerRef.current) {
        //   eyeTracker.offGazeEnter(containerRef.current, handleGazeEnter);
        //   eyeTracker.offGazeExit(containerRef.current, handleGazeExit);
        // }
      };
    }, [
      gazeResponsive,
      eyeTracker,
      spatialAudioEngine,
      audioFeedback,
      achievementTracker,
      trackAchievements,
      usageContext,
    ]);

    // Predictive interaction tracking
    const handleInteraction = useCallback(
      (event: React.MouseEvent | React.FocusEvent) => {
        if (!interactionRecorder) return;

        if (event.type === "click") {
          interactionRecorder.recordClick(event as React.MouseEvent);
        }

        if (achievementTracker && trackAchievements) {
          achievementTracker.recordAction(
            achievementId || "container_interaction",
            {
              context: usageContext,
              timestamp: Date.now(),
            }
          );
        }
      },
      [
        interactionRecorder,
        achievementTracker,
        trackAchievements,
        achievementId,
        usageContext,
      ]
    );

    // Filter out component-specific props and consciousness features that shouldn't be passed to DOM
    const {
      maxWidth,
      minWidth,
      maxHeight,
      minHeight,
      // Prevent leaking master toggle to DOM
      consciousness: _consciousness,
      predictive: _predictive,
      preloadContent: _preloadContent,
      eyeTracking: _eyeTracking,
      gazeResponsive: _gazeResponsive,
      adaptive: _adaptive,
      biometricResponsive: _biometricResponsive,
      spatialAudio: _spatialAudio,
      audioFeedback: _audioFeedback,
      trackAchievements: _trackAchievements,
      achievementId: _achievementId,
      usageContext: _usageContext,
      ...domProps
    } = props as any;
    // Use adaptive values if biometric adaptation is enabled, otherwise use original values
    const effectiveSize = biometricResponsive ? adaptiveSize : size;
    const effectivePadding = biometricResponsive ? adaptivePadding : padding;

    const sizeClasses = {
      xs: "max-w-xs", // 320px
      sm: "max-w-sm", // 384px
      md: "max-w-md", // 448px
      lg: "max-w-4xl", // 896px
      xl: "max-w-6xl", // 1152px
      "2xl": "max-w-7xl", // 1280px
      full: "max-w-full",
    };

    const paddingClasses = {
      none: "glass-p-0",
      xs: "glass-p-2",
      sm: "glass-p-4",
      md: "glass-p-6",
      lg: "glass-p-8",
      xl: "glass-p-12",
      "2xl": "glass-p-16",
    };

    const variantClasses = {
      default: "",
      fluid: "w-full",
      breakout: "w-screen relative left-1/2 right-1/2 -mx-[50vw]",
    };

    const radiusClasses = {
      none: "rounded-none",
      sm: "glass-radius-sm",
      md: "glass-radius-md",
      lg: "glass-radius-lg",
      xl: "glass-radius-xl",
      "2xl": "rounded-2xl",
      full: "glass-radius-full",
    };

    // Map elevation to OptimizedGlass elevation values
    const getGlassElevation = (
      elevation: GlassContainerProps["elevation"] | string | number
    ): "level1" | "level2" | "level3" | "level4" | "level5" => {
      if (elevation === "float") return "level3" as const;
      if (elevation === "modal") return "level4" as const;
      if (typeof elevation === "number") {
        const level = Math.min(5, Math.max(1, elevation + 1));
        switch (level) {
          case 1:
            return "level1" as const;
          case 2:
            return "level2" as const;
          case 3:
            return "level3" as const;
          case 4:
            return "level4" as const;
          case 5:
            return "level5" as const;
          default:
            return "level1" as const;
        }
      }
      // Handle string values that aren't the expected literals
      if (typeof elevation === "string") {
        // Try to parse as number
        const numValue = parseInt(elevation, 10);
        if (!isNaN(numValue)) {
          return getGlassElevation(numValue);
        }
        // Default for unrecognized strings
        return "level1" as const;
      }
      return "level1" as const;
    };

    const responsivePaddingClasses = responsivePadding
      ? [
          responsivePadding.sm && `sm:${paddingClasses[responsivePadding.sm]}`,
          responsivePadding.md && `md:${paddingClasses[responsivePadding.md]}`,
          responsivePadding.lg && `lg:${paddingClasses[responsivePadding.lg]}`,
          responsivePadding.xl && `xl:${paddingClasses[responsivePadding.xl]}`,
          responsivePadding["2xl"] &&
            `2xl:${paddingClasses[responsivePadding["2xl"]]}`,
        ].filter(Boolean)
      : [];

    if (glass) {
      return material === "liquid" ? (
        <LiquidGlassMaterial
          ior={
            materialProps?.ior ||
            (elevation === "modal" ? 1.5 : elevation === "float" ? 1.48 : 1.45)
          }
          thickness={
            materialProps?.thickness ||
            (size === "xs" ? 6 : size === "sm" ? 8 : size === "md" ? 12 : 16)
          }
          tint={
            materialProps?.tint ||
            (usageContext === "modal"
              ? { r: 0, g: 0, b: 0, a: 0.08 }
              : { r: 0, g: 0, b: 0, a: 0.05 })
          }
          variant={
            materialProps?.variant ||
            (usageContext === "modal" ? "regular" : "clear")
          }
          quality={materialProps?.quality || "high"}
          environmentAdaptation
          motionResponsive
          interactive={usageContext === "card" || usageContext === "form"}
          className={cn(
            // Base container styles
            "w-full transition-all duration-300 liquid-glass-container-surface",

            // Size and centering
            sizeClasses[effectiveSize],
            centered && "mx-auto",

            // Variant
            variantClasses[variant],

            // Padding
            paddingClasses[effectivePadding],
            ...responsivePaddingClasses,

            // Radius
            radius === "none"
              ? "rounded-none"
              : radius === "sm"
                ? "glass-radius-sm"
                : radius === "md"
                  ? "glass-radius-md"
                  : radius === "lg"
                    ? "glass-radius-lg"
                    : radius === "xl"
                      ? "glass-radius-xl"
                      : radius === "2xl"
                        ? "rounded-2xl"
                        : radius === "full"
                          ? "glass-radius-full"
                          : "glass-radius-lg",

            // Consciousness feature styles
            isVisible && preloadContent && "animate-pulse",
            biometricResponsive && "transform-gpu",

            className
          )}
          style={{
            "--liquid-glass-container-density":
              usageContext === "modal" ? "0.95" : "0.88",
            "--liquid-glass-environment-adapt": "0.7",
          }}
          data-liquid-glass-container="true"
          data-container-context={usageContext}
          data-container-size={effectiveSize}
          onClick={handleInteraction}
          onFocus={handleInteraction}
          ref={(node) => {
            setContainerElement(node);
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else if ("current" in ref) {
                ref.current = node;
              }
            }
          }}
          {...domProps}
        >
          {children}
        </LiquidGlassMaterial>
      ) : (
        <OptimizedGlass
          intent="neutral"
          elevation={getGlassElevation(elevation)}
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation="none"
          performanceMode="medium"
          className={cn(
            // Base container styles
            "w-full transition-all duration-300",

            // Size and centering
            sizeClasses[effectiveSize],
            centered && "mx-auto",

            // Variant
            variantClasses[variant],

            // Padding
            paddingClasses[effectivePadding],
            ...responsivePaddingClasses,

            // Radius
            radius === "none"
              ? "rounded-none"
              : radius === "sm"
                ? "glass-radius-sm"
                : radius === "md"
                  ? "glass-radius-md"
                  : radius === "lg"
                    ? "glass-radius-lg"
                    : radius === "xl"
                      ? "glass-radius-xl"
                      : radius === "2xl"
                        ? "rounded-2xl"
                        : radius === "full"
                          ? "glass-radius-full"
                          : "glass-radius-lg",

            // Consciousness feature styles
            // gazeResponsive && eyeTracker?.isGazing && 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-400/25',
            isVisible && preloadContent && "animate-pulse",
            biometricResponsive && "transform-gpu",
            // Motion preferences - already handled by consciousness features

            className
          )}
          onClick={handleInteraction}
          onFocus={handleInteraction}
          ref={(node: HTMLDivElement | null) => {
            setContainerElement(node);
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else if ("current" in ref) {
                ref.current = node;
              }
            }
          }}
          {...domProps}
        >
          {children}
        </OptimizedGlass>
      );
    }

    return (
      <div
        data-glass-component
        className={cn(
          // Base container styles
          "w-full transition-all duration-300",

          // Size and centering
          sizeClasses[effectiveSize],
          centered && "mx-auto",

          // Variant
          variantClasses[variant],

          // Padding
          paddingClasses[effectivePadding],
          ...responsivePaddingClasses,

          // Consciousness feature styles
          // gazeResponsive && eyeTracker?.isGazing && 'ring-1 ring-blue-400/30 shadow-md shadow-blue-400/10',
          isVisible && preloadContent && "animate-pulse opacity-75",
          biometricResponsive && "transform-gpu",
          // Motion preferences - already handled by consciousness features

          className
        )}
        onClick={handleInteraction}
        onFocus={handleInteraction}
        ref={(node: HTMLDivElement | null) => {
          setContainerElement(node);
          if (ref) {
            if (typeof ref === "function") {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }}
        {...domProps}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";

// Simple Container alias for basic usage
export const Container = GlassContainer;

/**
 * Enhanced GlassContainer with consciousness features enabled by default
 * Use this for containers that should be intelligent and adaptive
 */
export const ConsciousGlassContainer = forwardRef<
  HTMLDivElement,
  GlassContainerProps
>((props, ref) => (
  <GlassContainer
    ref={ref}
    predictive={true}
    preloadContent={true}
    adaptive={true}
    biometricResponsive={true}
    trackAchievements={true}
    achievementId="conscious_container_usage"
    {...props}
  />
));

ConsciousGlassContainer.displayName = "ConsciousGlassContainer";

/**
 * Utility function to create consciousness-enhanced variants of any container
 */
export function withConsciousness<T extends GlassContainerProps>(
  defaultProps: Partial<ConsciousnessFeatures> = {}
) {
  return function EnhancedContainer(props: T) {
    return (
      <GlassContainer
        predictive={true}
        adaptive={true}
        trackAchievements={true}
        {...defaultProps}
        {...props}
      />
    );
  };
}

/**
 * Pre-configured consciousness container presets
 */
export const ConsciousnessPresets = {
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
