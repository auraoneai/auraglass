"use client";
import { GlassButton } from "../button/GlassButton";

import { cn } from "../../lib/utilsComprehensive";
import { X } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Motion, OptimizedGlass } from "../../primitives";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import { useAchievements } from "../advanced/GlassAchievementSystem";
import { useBiometricAdaptation } from "../advanced/GlassBiometricAdaptation";
import { useEyeTracking } from "../advanced/GlassEyeTracking";
import {
  useInteractionRecorder,
  usePredictiveEngine,
} from "../advanced/GlassPredictiveEngine";
import { useSpatialAudio } from "../advanced/GlassSpatialAudio";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";

export interface GlassDrawerProps extends ConsciousnessFeatures {
  /**
   * Whether the drawer is open
   */
  open?: boolean;
  /**
   * Callback when drawer open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Drawer position
   */
  position?: "top" | "right" | "bottom" | "left";
  /**
   * Drawer size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Drawer title
   */
  title?: React.ReactNode;
  /**
   * Drawer description
   */
  description?: React.ReactNode;
  /**
   * Drawer content
   */
  children?: React.ReactNode;
  /**
   * Accessible label for the drawer
   */
  "aria-label"?: string;
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
  /**
   * Whether to close on backdrop click
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether to close on escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Custom header content
   */
  header?: React.ReactNode;
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  /**
   * Whether drawer is modal (blocks interaction with background)
   */
  modal?: boolean;
  /**
   * Custom backdrop blur
   */
  backdropBlur?: boolean;
  /**
   * Drawer elevation
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Custom z-index
   */
  zIndex?: number;
  /**
   * Whether to show overlay
   */
  showOverlay?: boolean;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Whether drawer can be resized
   */
  resizable?: boolean;
  className?: string;
  /**
   * Custom data-testid attribute
   */
  "data-testid"?: string;

  // Consciousness features
  /**
   * Enable comprehensive consciousness tracking
   */
  consciousness?: boolean;
  /**
   * Custom className for drawer content
   */
  contentClassName?: string;
}

/**
 * GlassDrawer component
 * Slide-out panel with glassmorphism styling and comprehensive functionality
 */
export const GlassDrawer = forwardRef<HTMLDivElement, GlassDrawerProps>(
  (
    {
      open = true,
      onOpenChange,
      position = "right",
      size = "md",
      material = "glass",
      materialProps,
      title,
      description,
      children = null,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      header,
      footer,
      modal = true,
      backdropBlur = true,
      elevation = "modal",
      zIndex = 50,
      showOverlay = true,
      animationDuration = 300,
      resizable = false,
      className,
      contentClassName,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      // Consciousness features
      consciousness = false,
      predictive = false,
      adaptive = false,
      eyeTracking = false,
      spatialAudio = false,
      trackAchievements = false,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(open);
    const contentRef = useRef<HTMLDivElement>(null);

    // Consciousness state
    const [interactionCount, setInteractionCount] = useState(0);
    const [drawerFocusTime, setDrawerFocusTime] = useState<number>(0);
    const [contentEngagement, setContentEngagement] = useState<{
      scrollDepth: number;
      timeSpent: number;
      interactions: number;
    }>({ scrollDepth: 0, timeSpent: 0, interactions: 0 });
    const [drawerInsights, setDrawerInsights] = useState<{
      urgency: "low" | "medium" | "high";
      complexity: number;
      userStress: number;
    } | null>(null);

    // Consciousness hooks
    const predictiveEngine = predictive ? usePredictiveEngine() : null;
    const eyeTracker = eyeTracking ? useEyeTracking() : null;
    const biometricAdapter = adaptive ? useBiometricAdaptation() : null;
    const spatialAudioEngine = spatialAudio ? useSpatialAudio() : null;
    const interactionRecorder = consciousness ? useInteractionRecorder() : null;
    const achievementTracker = trackAchievements ? useAchievements() : null;

    // Handle escape key with consciousness tracking
    useEffect(() => {
      if (!closeOnEscape || !open) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          // Record escape key close
          if (consciousness && interactionRecorder) {
            // Create synthetic event for escape interaction
            const syntheticEvent = {
              currentTarget: { id: "drawer-escape" },
              type: "keydown",
            } as any;
            interactionRecorder.recordFocus(syntheticEvent);
          }

          // Play spatial audio for escape close
          if (spatialAudio && spatialAudioEngine) {
            const audioPosition =
              position === "left"
                ? { x: -1, y: 0, z: 0 }
                : position === "right"
                  ? { x: 1, y: 0, z: 0 }
                  : { x: 0, y: 0, z: 0 };
            spatialAudioEngine.playGlassSound(
              "drawer-escape-close",
              audioPosition,
              {
                volume: 0.4,
              }
            );
          }

          onOpenChange?.(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [
      closeOnEscape,
      open,
      onOpenChange,
      consciousness,
      interactionRecorder,
      title,
      position,
      spatialAudio,
      spatialAudioEngine,
    ]);

    // Handle body scroll lock
    useEffect(() => {
      if (modal && open) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [modal, open]);

    // Handle visibility state
    useEffect(() => {
      if (open) {
        setIsVisible(true);
      } else {
        // Delay hiding to allow exit animation
        const timer = setTimeout(() => setIsVisible(false), animationDuration);
        return () => clearTimeout(timer);
      }
    }, [open, animationDuration]);

    // Consciousness effects
    // Drawer opening/closing tracking with spatial audio
    useEffect(() => {
      if (open) {
        const openTime = Date.now();
        setDrawerFocusTime(openTime);
        setInteractionCount((prev: any) => prev + 1);

        // Record drawer opening interaction
        if (consciousness && interactionRecorder) {
          // Create synthetic event for drawer open
          const syntheticEvent = {
            currentTarget: { id: "drawer-open" },
            type: "click",
          } as any;
          interactionRecorder.recordClick(syntheticEvent);
        }

        // Track achievement for drawer interaction
        if (trackAchievements && achievementTracker) {
          achievementTracker.recordAction("drawer_opened", {
            drawerPosition: position,
            drawerSize: size,
            title: title || "Drawer",
            timestamp: openTime,
          });
        }

        // Play spatial audio for drawer opening
        if (spatialAudio && spatialAudioEngine) {
          const audioConfig = {
            sound: `drawer-${position}-open`,
            volume: 0.6,
            position:
              position === "left"
                ? { x: -1, y: 0, z: 0 }
                : position === "right"
                  ? { x: 1, y: 0, z: 0 }
                  : { x: 0, y: 0, z: 0 },
            reverb: 0.3,
          };
          spatialAudioEngine.playGlassSound(
            audioConfig.sound,
            audioConfig.position,
            {
              volume: audioConfig.volume,
            }
          );
        }
      } else if (drawerFocusTime > 0) {
        const closeTime = Date.now();
        const timeSpent = closeTime - drawerFocusTime;

        // Record drawer closing interaction
        if (consciousness && interactionRecorder) {
          // Create synthetic event for drawer close
          const syntheticEvent = {
            currentTarget: { id: "drawer-close" },
            type: "click",
          } as any;
          interactionRecorder.recordClick(syntheticEvent);
        }

        // Update content engagement
        setContentEngagement((prev: any) => ({
          ...prev,
          timeSpent,
        }));

        // Play spatial audio for drawer closing
        if (spatialAudio && spatialAudioEngine) {
          const audioConfig = {
            sound: `drawer-${position}-close`,
            volume: 0.4,
            position:
              position === "left"
                ? { x: -1, y: 0, z: 0 }
                : position === "right"
                  ? { x: 1, y: 0, z: 0 }
                  : { x: 0, y: 0, z: 0 },
            reverb: 0.2,
          };
          spatialAudioEngine.playGlassSound(
            audioConfig.sound,
            audioConfig.position,
            {
              volume: audioConfig.volume,
            }
          );
        }
      }
    }, [
      open,
      consciousness,
      interactionRecorder,
      trackAchievements,
      achievementTracker,
      spatialAudio,
      spatialAudioEngine,
      title,
      position,
      size,
      modal,
      drawerFocusTime,
      contentEngagement,
    ]);

    // Eye tracking for drawer engagement
    useEffect(() => {
      if (!eyeTracking || !eyeTracker || !open) return;

      const handleGazeData = (gazeData: any) => {
        // Track if user is looking at drawer content
        if (contentRef.current) {
          const rect = contentRef.current.getBoundingClientRect();
          const isLookingAtDrawer =
            gazeData.x >= rect.left &&
            gazeData.x <= rect.right &&
            gazeData.y >= rect.top &&
            gazeData.y <= rect.bottom;

          if (isLookingAtDrawer && trackAchievements && achievementTracker) {
            achievementTracker.recordAction("drawer_gaze_engagement", {
              drawerTitle: title,
              gazeTime: Date.now(),
              drawerArea: "content",
              position,
            });
          }
        }
      };

      // Eye tracking methods not available in current implementation
      // eyeTracker.startTracking(handleGazeData);
      // return () => eyeTracker.stopTracking();
    }, [
      eyeTracking,
      eyeTracker,
      open,
      trackAchievements,
      achievementTracker,
      title,
      position,
    ]);

    // Biometric adaptation for drawer behavior
    useEffect(() => {
      if (!adaptive || !biometricAdapter || !open) return;

      const updateAdaptiveFeatures = () => {
        const stressLevel = biometricAdapter.currentStressLevel;

        // Analyze drawer content complexity and user stress
        setDrawerInsights({
          urgency:
            stressLevel > 0.7 ? "high" : stressLevel > 0.4 ? "medium" : "low",
          complexity: (children?.toString().length || 0) > 500 ? 0.8 : 0.4,
          userStress: stressLevel,
        });

        // Record biometric adaptation for achievements
        if (trackAchievements && achievementTracker) {
          const stressLevel = biometricAdapter.currentStressLevel;
          achievementTracker.recordAction("drawer_biometric_adaptation", {
            stressLevel: stressLevel,
            drawerComplexity:
              (children?.toString().length || 0) > 500 ? "high" : "low",
            position,
            adaptations: {
              urgencyLevel: stressLevel > 0.7 ? "high" : "normal",
            },
          });
        }
      };

      const interval = setInterval(updateAdaptiveFeatures, 3000);
      updateAdaptiveFeatures(); // Run immediately

      return () => clearInterval(interval);
    }, [
      adaptive,
      biometricAdapter,
      open,
      children,
      trackAchievements,
      achievementTracker,
      position,
    ]);

    // Predictive drawer insights
    useEffect(() => {
      if (!predictive || !predictiveEngine || !open) return;

      const generateDrawerInsights = async () => {
        try {
          const drawerContext = {
            title: title || "Drawer",
            position,
            size,
            modal,
            hasFooter: !!footer,
            contentLength: children?.toString().length || 0,
            interactionCount,
            timeSpent: drawerFocusTime ? Date.now() - drawerFocusTime : 0,
          };

          const insights = predictiveEngine.insights;

          // Transform insights array to expected object format
          const transformedInsights =
            insights && insights.length > 0
              ? {
                  urgency:
                    (insights.find((i) => i.type === "urgency" && i.metadata)
                      ?.metadata?.urgency as "low" | "medium" | "high") ||
                    "medium",
                  complexity:
                    (insights.find((i) => i.type === "complexity" && i.metadata)
                      ?.metadata?.complexity as number) || 0,
                  userStress:
                    (insights.find((i) => i.type === "stress" && i.metadata)
                      ?.metadata?.userStress as number) || 0,
                }
              : null;

          setDrawerInsights((prevInsights) => {
            if (transformedInsights) {
              return transformedInsights;
            }
            return prevInsights;
          });
        } catch (error) {
          console.warn("Predictive drawer analysis failed:", error);
        }
      };

      const timeoutId = setTimeout(generateDrawerInsights, 1000);
      return () => clearTimeout(timeoutId);
    }, [
      predictive,
      predictiveEngine,
      open,
      title,
      position,
      size,
      modal,
      footer,
      children,
      interactionCount,
      drawerFocusTime,
    ]);

    // Enhanced handlers with consciousness tracking
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          // Record backdrop click interaction
          if (consciousness && interactionRecorder) {
            // Create synthetic event for backdrop click
            const syntheticEvent = {
              currentTarget: { id: "drawer-backdrop" },
              type: "click",
            } as any;
            interactionRecorder.recordClick(syntheticEvent);
          }

          // Play spatial audio for backdrop close
          if (spatialAudio && spatialAudioEngine) {
            const audioPosition =
              position === "left"
                ? { x: -1, y: 0, z: 0 }
                : position === "right"
                  ? { x: 1, y: 0, z: 0 }
                  : { x: 0, y: 0, z: 0 };
            spatialAudioEngine.playGlassSound(
              "drawer-backdrop-close",
              audioPosition,
              {
                volume: 0.3,
              }
            );
          }

          onOpenChange?.(false);
        }
      },
      [
        closeOnBackdropClick,
        onOpenChange,
        consciousness,
        interactionRecorder,
        title,
        position,
        spatialAudio,
        spatialAudioEngine,
      ]
    );

    // Handle close
    const handleClose = useCallback(() => {
      // Record close button interaction
      if (consciousness && interactionRecorder) {
        // Create synthetic event for close button
        const syntheticEvent = {
          currentTarget: { id: "drawer-close-button" },
          type: "click",
        } as any;
        interactionRecorder.recordClick(syntheticEvent);
      }

      // Play spatial audio for button close
      if (spatialAudio && spatialAudioEngine) {
        const audioPosition =
          position === "left"
            ? { x: -1, y: 0, z: 0 }
            : position === "right"
              ? { x: 1, y: 0, z: 0 }
              : { x: 0, y: 0, z: 0 };
        spatialAudioEngine.playGlassSound(
          "drawer-button-close",
          audioPosition,
          {
            volume: 0.3,
          }
        );
      }

      onOpenChange?.(false);
    }, [
      onOpenChange,
      consciousness,
      interactionRecorder,
      title,
      position,
      spatialAudio,
      spatialAudioEngine,
    ]);

    // Size classes based on position
    const getSizeClasses = () => {
      const isVertical = position === "top" || position === "bottom";

      if (isVertical) {
        // Height for top/bottom drawers
        switch (size) {
          case "xs":
            return "h-32";
          case "sm":
            return "h-48";
          case "md":
            return "h-64";
          case "lg":
            return "h-80";
          case "xl":
            return "h-96";
          case "full":
            return "h-full";
          default:
            return "h-64";
        }
      } else {
        // Width for left/right drawers
        switch (size) {
          case "xs":
            return "w-64";
          case "sm":
            return "w-80";
          case "md":
            return "w-96";
          case "lg":
            return "w-[28rem]";
          case "xl":
            return "w-[32rem]";
          case "full":
            return "w-full";
          default:
            return "w-96";
        }
      }
    };

    // Position classes
    const getPositionClasses = () => {
      switch (position) {
        case "top":
          return "top-0 left-0 right-0";
        case "right":
          return "top-0 right-0 bottom-0";
        case "bottom":
          return "bottom-0 left-0 right-0";
        case "left":
          return "top-0 left-0 bottom-0";
        default:
          return "top-0 right-0 bottom-0";
      }
    };

    // Animation direction based on position
    const getAnimationPreset = () => {
      switch (position) {
        case "top":
          return "slideDown";
        case "right":
          return "slideLeft";
        case "bottom":
          return "slideUp";
        case "left":
          return "slideRight";
        default:
          return "slideLeft";
      }
    };

    // Border radius based on position
    const getBorderRadius = () => {
      switch (position) {
        case "top":
          return "rounded-b-xl";
        case "right":
          return "rounded-l-xl";
        case "bottom":
          return "rounded-t-xl";
        case "left":
          return "rounded-r-xl";
        default:
          return "rounded-l-xl";
      }
    };

    if (!isVisible) return null;

    return (
      <div
        data-glass-component
        data-testid={dataTestId}
        className={cn(
          "fixed inset-0",
          `z-${zIndex}`,
          consciousness && "consciousness-drawer-container",
          adaptive &&
            drawerInsights?.urgency === "high" &&
            "consciousness-urgent-drawer",
          eyeTracking && "consciousness-eye-trackable",
          className
        )}
        role="dialog"
        aria-modal={modal}
        aria-label={ariaLabel || (title ? undefined : "Drawer")}
        aria-labelledby={title ? "drawer-title" : undefined}
        aria-describedby={description ? "drawer-description" : undefined}
        data-consciousness-drawer="true"
        data-consciousness-active={String(!!consciousness)}
        data-drawer-title={title}
        data-drawer-position={position}
        data-drawer-size={size}
        data-drawer-urgency={drawerInsights?.urgency}
        data-user-stress={drawerInsights?.userStress}
        data-interaction-count={interactionCount}
      >
        {/* Backdrop/Overlay */}
        {showOverlay && (
          <Motion
            preset="fadeIn"
            duration={animationDuration}
            className={cn(
              "absolute inset-0 bg-black/20 cursor-pointer",
              backdropBlur && "glass-backdrop-blur-md",
              consciousness && "consciousness-drawer-backdrop",
              adaptive &&
                drawerInsights?.urgency === "high" &&
                "consciousness-urgent-backdrop"
            )}
            onClick={handleBackdropClick}
            data-consciousness-backdrop="true"
            data-drawer-backdrop-position={position}
          />
        )}

        {/* Drawer Content */}
        <Motion
          preset={getAnimationPreset()}
          duration={animationDuration}
          className={cn(
            "absolute flex flex-col",
            getPositionClasses(),
            getSizeClasses(),
            consciousness && "consciousness-drawer-content",
            predictive && drawerInsights && "consciousness-predictive-drawer",
            adaptive &&
              drawerInsights?.urgency === "high" &&
              "consciousness-urgent-content"
          )}
          data-consciousness-content="true"
          data-drawer-complexity={drawerInsights?.complexity}
          data-time-spent={drawerFocusTime ? Date.now() - drawerFocusTime : 0}
        >
          {material === "liquid" ? (
            <LiquidGlassMaterial
              ior={materialProps?.ior || 1.45}
              thickness={materialProps?.thickness || 8}
              tint={materialProps?.tint || { r: 0, g: 0, b: 0, a: 0.06 }}
              variant={materialProps?.variant || "regular"}
              quality={materialProps?.quality || "balanced"}
              environmentAdaptation
              motionResponsive
              ref={ref}
              className={cn(
                "h-full flex flex-col liquid-glass-drawer-surface",
                getBorderRadius(),
                resizable && "resize overflow-auto",
                consciousness && "consciousness-drawer-glass",
                eyeTracking && "consciousness-eye-trackable-content",
                adaptive &&
                  drawerInsights?.urgency === "high" &&
                  "consciousness-urgent-glass",
                predictive && drawerInsights && "consciousness-predictive-glass"
              )}
              style={
                {
                  "--liquid-glass-drawer-density":
                    position === "top" || position === "bottom"
                      ? "0.85"
                      : "0.9",
                  "--liquid-glass-motion-factor": "0.6",
                  "--liquid-glass-adaptive-tint":
                    drawerInsights?.urgency === "high"
                      ? "rgba(220, 38, 38, 0.1)"
                      : "rgba(0, 0, 0, 0.06)",
                } as React.CSSProperties
              }
              data-liquid-glass-drawer="true"
              data-drawer-position={position}
              data-drawer-urgency={drawerInsights?.urgency}
              {...props}
            >
              {/* Header */}
              {(header || title || description || showCloseButton) && (
                <div className="glass-flex glass-items-start glass-justify-between glass-p-6 glass-border-b glass-border-glass-border/10 glass-flex-shrink-0">
                  <div className="glass-flex-1 glass-min-w-0">
                    {header || (
                      <>
                        {title && (
                          <h2
                            id="drawer-title"
                            className='glass-text-lg font-semibold text-primary mb-1'
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id="drawer-description"
                            className='glass-text-sm text-muted-foreground'
                          >
                            {description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  {showCloseButton && (
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      iconOnly
                      onClick={handleClose}
                      aria-label="Close drawer"
                      className="glass-flex-shrink-0 glass-ml-4"
                    >
                      ×
                    </GlassButton>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto glass-p-6",
                  contentClassName
                )}
              >
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="glass-p-6 glass-border-t glass-border-glass-border/10 glass-flex-shrink-0">
                  {footer}
                </div>
              )}
            </LiquidGlassMaterial>
          ) : (
            <OptimizedGlass
              intent="neutral"
              elevation="level2"
              intensity="medium"
              depth={2}
              tint="neutral"
              border="subtle"
              animation="none"
              performanceMode="medium"
              ref={ref}
              liftOnHover
              hoverSheen
              className={cn(
                "h-full flex flex-col border border-border/20 glass-radial-reveal",
                getBorderRadius(),
                resizable && "resize overflow-auto",
                consciousness && "consciousness-drawer-glass",
                eyeTracking && "consciousness-eye-trackable-content",
                adaptive &&
                  drawerInsights?.urgency === "high" &&
                  "consciousness-urgent-glass",
                predictive && drawerInsights && "consciousness-predictive-glass"
              )}
              {...props}
            >
              {/* Header */}
              {(header || title || description || showCloseButton) && (
                <div className="glass-flex glass-items-start glass-justify-between glass-p-6 glass-border-b glass-border-glass-border/10 glass-flex-shrink-0">
                  <div className="glass-flex-1 glass-min-w-0">
                    {header || (
                      <>
                        {title && (
                          <h2
                            id="drawer-title"
                            className='glass-text-lg font-semibold text-primary mb-1'
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id="drawer-description"
                            className="glass-text-sm glass-text-secondary"
                          >
                            {description}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {showCloseButton && (
                    <GlassButton
                      type="button"
                      className={cn(
                        "glass-ml-4 glass-p-2 glass-radius-lg glass-text-secondary hover:text-foreground hover:bg-muted/20 transition-colors",
                        consciousness && "consciousness-close-button",
                        adaptive &&
                          drawerInsights?.urgency === "high" &&
                          "consciousness-urgent-close"
                      )}
                      onClick={handleClose}
                      aria-label="Close drawer"
                      data-consciousness-close="true"
                    >
                      <X className='w-4 h-4' />
                    </GlassButton>
                  )}
                </div>
              )}

              {/* Content */}
              {children && (
                <div
                  ref={contentRef}
                  className={cn(
                    "flex-1 overflow-y-auto glass-p-6",
                    consciousness && "consciousness-drawer-body",
                    eyeTracking && "consciousness-eye-trackable-body",
                    adaptive &&
                      drawerInsights?.urgency === "high" &&
                      "consciousness-urgent-body"
                  )}
                  tabIndex={0}
                  data-consciousness-body="true"
                  data-content-complexity={drawerInsights?.complexity}
                  data-scroll-tracking={String(!!consciousness)}
                  onScroll={(e) => {
                    if (consciousness && interactionRecorder) {
                      const scrollElement = e.target as HTMLElement;
                      const scrollDepth =
                        scrollElement.scrollTop /
                          (scrollElement.scrollHeight -
                            scrollElement.clientHeight) || 0;

                      setContentEngagement((prev: any) => ({
                        ...prev,
                        scrollDepth: Math.max(prev.scrollDepth, scrollDepth),
                        interactions: prev.interactions + 1,
                      }));

                      // Create synthetic event for scroll
                      const syntheticEvent = {
                        currentTarget: { id: "drawer-content" },
                        type: "scroll",
                      } as any;
                      interactionRecorder.recordFocus(syntheticEvent);
                    }
                  }}
                  onClick={(e) => {
                    if (consciousness && interactionRecorder) {
                      setContentEngagement((prev: any) => ({
                        ...prev,
                        interactions: prev.interactions + 1,
                      }));

                      interactionRecorder.recordClick(e);
                    }
                  }}
                >
                  {children}

                  {/* Drawer Insights Display */}
                  {predictive && drawerInsights && (
                    <div className="glass-mt-4 glass-p-3 glass-surface-primary/10 glass-radius-lg glass-border glass-border-primary/20 glass-text-xs">
                      <div className="glass-flex glass-items-center glass-justify-between">
                        <span className='text-primary'>Drawer Insights</span>
                        <div className="glass-flex glass-gap-2">
                          <span
                            className={cn(
                              "glass-px-2 glass-py-1 glass-radius-md",
                              drawerInsights.urgency === "high"
                                ? "bg-red-500/20 text-red-300"
                                : drawerInsights.urgency === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                            )}
                          >
                            {drawerInsights.urgency} urgency
                          </span>
                          {drawerInsights.userStress > 0.7 && (
                            <span className="glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 glass-text-secondary">
                              high stress
                            </span>
                          )}
                          <span className="glass-px-2 glass-py-1 glass-radius-md glass-surface-blue/20 glass-text-secondary">
                            {position} drawer
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              {footer && (
                <div className="glass-p-6 glass-border-t glass-border-glass-border/10 glass-flex-shrink-0">
                  {footer}
                </div>
              )}
            </OptimizedGlass>
          )}
        </Motion>
      </div>
    );
  }
);

GlassDrawer.displayName = "GlassDrawer";

// Compound components for easier usage
export interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    if (asChild) {
      return React.cloneElement(children as any, {
        ref,
        ...props,
      });
    }

    return (
      <GlassButton ref={ref} {...props}>
        {children}
      </GlassButton>
    );
  }
);

DrawerTrigger.displayName = "DrawerTrigger";

export interface DrawerContentProps extends GlassDrawerProps {}

export const DrawerContent = GlassDrawer;

export interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col glass-gap-1.5", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerHeader.displayName = "DrawerHeader";

export interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "glass-text-lg font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);

DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("glass-text-sm glass-text-secondary", className)}
      {...props}
    >
      {children}
    </p>
  );
});

DrawerDescription.displayName = "DrawerDescription";

export interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:glass-gap-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DrawerFooter.displayName = "DrawerFooter";

// Hook for drawer state management
export const useDrawer = (defaultOpen = false) => {
  const [open, setOpen] = useState(defaultOpen);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const toggleDrawer = () => setOpen((prev: any) => !prev);

  return {
    open,
    setOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

// Consciousness-Enhanced Drawer Variants
export const GlassPredictiveDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer {...props} consciousness={true} predictive={true} />
);

export const GlassAdaptiveDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer {...props} consciousness={true} adaptive={true} />
);

export const GlassEyeTrackingDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer {...props} consciousness={true} eyeTracking={true} />
);

export const GlassSpatialAudioDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer {...props} consciousness={true} spatialAudio={true} />
);

export const GlassAchievementDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer {...props} consciousness={true} trackAchievements={true} />
);

export const GlassConsciousnessDrawer: React.FC<GlassDrawerProps> = (props) => (
  <GlassDrawer
    {...props}
    consciousness={true}
    predictive={true}
    adaptive={true}
    eyeTracking={true}
    spatialAudio={true}
    trackAchievements={true}
  />
);

// Types are already exported via interface declarations above
