"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Motion, OptimizedGlass } from "../../primitives";
import { FocusTrap } from "../../primitives/focus/FocusTrap";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";
import {
  announceToScreenReader,
  createModalA11y,
  focusUtils,
  useA11yId,
} from "../../utils/a11y";
import { GlassButton, IconButton } from "../button/GlassButton";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";
// import { usePredictiveEngine, useInteractionRecorder } from '../advanced/GlassPredictiveEngine';
// import { useAchievements } from '../advanced/GlassAchievementSystem';
// import { useBiometricAdaptation } from '../advanced/GlassBiometricAdaptation';
// import { useEyeTracking } from '../advanced/GlassEyeTracking';
// import { useSpatialAudio } from '../advanced/GlassSpatialAudio';

export interface GlassModalProps extends ConsciousnessFeatures {
  /**
   * Whether the modal is open
   */
  open?: boolean;
  /**
   * Callback when modal should close
   */
  onClose?: () => void;
  /**
   * Modal title
   */
  title?: string;
  /**
   * Modal description
   */
  description?: string;
  /**
   * Modal size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Modal variant
   */
  variant?: "default" | "centered" | "drawer" | "fullscreen";
  /**
   * Whether modal can be closed by clicking backdrop
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether modal can be closed by pressing escape
   */
  closeOnEscape?: boolean;
  /**
   * Custom close button
   */
  closeButton?: React.ReactNode;
  /**
   * Whether to show default close button
   */
  showCloseButton?: boolean;
  /**
   * Modal footer content
   */
  footer?: React.ReactNode;
  /**
   * Modal children
   */
  children: React.ReactNode;
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
   * Custom backdrop
   */
  backdrop?: React.ReactNode;
  /**
   * Backdrop blur intensity
   */
  backdropBlur?: "none" | "sm" | "md" | "lg";
  /**
   * Animation preset
   */
  animation?: "fade" | "scale" | "slide" | "flip";
  /**
   * Whether to lock scroll when open
   */
  lockScroll?: boolean;
  /**
   * Z-index
   */
  zIndex?: number;
  className?: string;

  // Accessibility props
  /**
   * Accessible label for the modal
   */
  "aria-label"?: string;
  /**
   * ID of element that labels the modal
   */
  "aria-labelledby"?: string;
  /**
   * ID of element that describes the modal
   */
  "aria-describedby"?: string;
  /**
   * Whether this is an alert dialog that requires immediate attention
   */
  role?: "dialog" | "alertdialog";
  /**
   * Element to focus when modal opens
   */
  initialFocus?: React.RefObject<HTMLElement>;
  /**
   * Element to focus when modal closes
   */
  restoreFocus?: React.RefObject<HTMLElement>;
  /**
   * Custom className for modal content
   */
  contentClassName?: string;
  /**
   * Custom data-testid attribute
   */
  "data-testid"?: string;
}

/**
 * GlassModal component
 * A versatile modal with glassmorphism styling
 */
export const GlassModal = forwardRef<HTMLDivElement, GlassModalProps>(
  (
    {
      open = true,
      onClose = () => {},
      title,
      description,
      size = "md",
      variant = "default",
      material = "glass",
      materialProps,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      closeButton,
      showCloseButton = true,
      footer,
      children = null,
      backdrop,
      backdropBlur = "md",
      animation = "scale",
      lockScroll = true,
      zIndex = 50,
      className,
      role = "dialog",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      initialFocus,
      restoreFocus,
      contentClassName,
      "data-testid": dataTestId,
      // Consciousness features
      consciousness,
      predictive,
      adaptive,
      eyeTracking,
      spatialAudio,
      trackAchievements,
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const previousBodyStylesRef = useRef<{
      position: string;
      top: string;
      width: string;
      overflow: string;
    } | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Consciousness state
    const [interactionCount, setInteractionCount] = useState(0);
    const [modalFocusTime, setModalFocusTime] = useState<number>(0);
    const [contentEngagement, setContentEngagement] = useState<{
      scrollDepth: number;
      timeSpent: number;
      interactions: number;
    }>({ scrollDepth: 0, timeSpent: 0, interactions: 0 });
    const [modalInsights, setModalInsights] = useState<{
      urgency: "low" | "medium" | "high";
      complexity: number;
      userStress: number;
    } | null>(null);

    // Consciousness hooks (mock implementations)
    const predictiveEngine = predictive
      ? {
          analyzeModalEngagement: async (context?: any) => ({
            urgency: "low" as const,
            complexity: 0.5,
            userStress: 0.3,
          }),
        }
      : null;
    const eyeTracker = eyeTracking
      ? {
          startTracking: (handler: any) => {},
          stopTracking: () => {},
        }
      : null;
    const biometricAdapter = adaptive
      ? {
          getCurrentBiometrics: () => ({ stressLevel: 0.3 }),
        }
      : null;
    const spatialAudioEngine = spatialAudio
      ? {
          playSound: (sound: string, config?: any) => {},
        }
      : null;
    const interactionRecorder = consciousness
      ? {
          recordInteraction: (type: string, data?: any) => {},
        }
      : null;
    const achievementTracker = trackAchievements
      ? {
          recordInteraction: (type: string, data?: any) => {},
        }
      : null;

    // Generate unique IDs for accessibility
    const modalId = useA11yId("glass-modal");
    const titleId = title ? useA11yId("glass-modal-title") : undefined;
    const descriptionId = description
      ? useA11yId("glass-modal-desc")
      : undefined;

    // Create accessibility attributes
    const baseA11yProps = createModalA11y({
      id: modalId,
      titleId: ariaLabelledBy || titleId,
      descriptionId: ariaDescribedBy || descriptionId,
      modal: true,
    });

    // Create final a11y props with role override and default label
    const a11yProps = {
      ...baseA11yProps,
      ...(role && { role }),
      // Provide aria-label if no title or labelledby is provided
      ...(!ariaLabelledBy &&
        !titleId && { "aria-label": ariaLabel || "Modal" }),
    };

    useEffect(() => {
      setMounted(true);
    }, []);

    // Focus management
    useEffect(() => {
      if (!mounted) return;

      if (open) {
        // Store the previously focused element
        previousActiveElement.current = document.activeElement as HTMLElement;

        // Focus management after modal renders
        setTimeout(() => {
          if (initialFocus?.current) {
            initialFocus.current.focus();
          } else if (contentRef.current) {
            // Focus first focusable element or the modal itself
            focusUtils.focusFirst(contentRef.current);
            if (document.activeElement === document.body) {
              contentRef.current.focus();
            }
          }
        }, 100);

        // Announce modal opening to screen readers
        if (role === "alertdialog") {
          announceToScreenReader(
            `Alert dialog opened: ${title || ariaLabel || "Dialog"}`,
            "assertive"
          );
        } else {
          announceToScreenReader(
            `Dialog opened: ${title || ariaLabel || "Dialog"}`,
            "polite"
          );
        }
      } else if (previousActiveElement.current && mounted) {
        // Restore focus when modal closes
        if (restoreFocus?.current) {
          restoreFocus.current.focus();
        } else {
          previousActiveElement.current.focus();
        }
      }
    }, [open, mounted, title, ariaLabel, role, initialFocus, restoreFocus]);

    useEffect(() => {
      if (!mounted) return;

      if (open && lockScroll) {
        const scrollY = window.scrollY;
        const body = document.body;
        previousBodyStylesRef.current = {
          position: body.style.position,
          top: body.style.top,
          width: body.style.width,
          overflow: body.style.overflow,
        };

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
          const previousStyles = previousBodyStylesRef.current;
          body.style.position = previousStyles?.position || "";
          body.style.top = previousStyles?.top || "";
          body.style.width = previousStyles?.width || "";
          body.style.overflow = previousStyles?.overflow || "";
          previousBodyStylesRef.current = null;
          // Only scroll in real browser, not jsdom
          if (typeof window !== "undefined" && window.scrollTo) {
            try {
              window.scrollTo(0, scrollY);
            } catch (e) {
              // Ignore scrollTo errors in test environment
            }
          }
        };
      }
    }, [open, lockScroll, mounted]);

    // Consciousness effects
    // Modal opening/closing tracking with spatial audio
    useEffect(() => {
      if (!mounted) return;

      if (open) {
        const openTime = Date.now();
        setModalFocusTime(openTime);
        setInteractionCount((prev: any) => prev + 1);

        // Record modal opening interaction
        if (consciousness && interactionRecorder) {
          interactionRecorder.recordInteraction("modal_open", {
            title: title || "Untitled Modal",
            size,
            variant,
            role,
            timestamp: openTime,
          });
        }

        // Track achievement for modal interaction
        if (trackAchievements && achievementTracker) {
          achievementTracker.recordInteraction("modal_opened", {
            modalType: role,
            title: title || "Modal",
            timestamp: openTime,
          });
        }

        // Play spatial audio for modal opening
        if (spatialAudio && spatialAudioEngine) {
          const audioConfig =
            role === "alertdialog"
              ? {
                  sound: "alert-modal-open",
                  volume: 0.7,
                  position: "center",
                  reverb: 0.4,
                }
              : {
                  sound: "modal-open",
                  volume: 0.5,
                  position: "center",
                  reverb: 0.3,
                };
          spatialAudioEngine.playSound(audioConfig.sound, audioConfig);
        }
      } else if (modalFocusTime > 0) {
        const closeTime = Date.now();
        const timeSpent = closeTime - modalFocusTime;

        // Record modal closing interaction
        if (consciousness && interactionRecorder) {
          interactionRecorder.recordInteraction("modal_close", {
            title: title || "Untitled Modal",
            timeSpent,
            interactions: contentEngagement.interactions,
            scrollDepth: contentEngagement.scrollDepth,
            timestamp: closeTime,
          });
        }

        // Update content engagement
        setContentEngagement((prev: any) => ({
          ...prev,
          timeSpent,
        }));

        // Play spatial audio for modal closing
        if (spatialAudio && spatialAudioEngine) {
          spatialAudioEngine.playSound("modal-close", {
            volume: 0.4,
            position: "center",
            reverb: 0.2,
          });
        }
      }
    }, [
      open,
      mounted,
      consciousness,
      interactionRecorder,
      trackAchievements,
      achievementTracker,
      spatialAudio,
      spatialAudioEngine,
      title,
      size,
      variant,
      role,
      modalFocusTime,
      contentEngagement,
    ]);

    // Eye tracking for modal engagement
    useEffect(() => {
      if (!eyeTracking || !eyeTracker || !open) return;

      const handleGazeData = (gazeData: any) => {
        // Track if user is looking at modal content
        if (contentRef.current) {
          const rect = contentRef.current.getBoundingClientRect();
          const isLookingAtModal =
            gazeData.x >= rect.left &&
            gazeData.x <= rect.right &&
            gazeData.y >= rect.top &&
            gazeData.y <= rect.bottom;

          if (isLookingAtModal && trackAchievements && achievementTracker) {
            achievementTracker.recordInteraction("modal_gaze_engagement", {
              modalTitle: title,
              gazeTime: Date.now(),
              modalArea: "content",
            });
          }
        }
      };

      eyeTracker.startTracking(handleGazeData);
      return () => eyeTracker.stopTracking();
    }, [
      eyeTracking,
      eyeTracker,
      open,
      trackAchievements,
      achievementTracker,
      title,
    ]);

    // Biometric adaptation for modal behavior
    useEffect(() => {
      if (!adaptive || !biometricAdapter || !open) return;

      const updateAdaptiveFeatures = () => {
        const biometrics = biometricAdapter.getCurrentBiometrics();

        // Analyze modal content complexity and user stress
        setModalInsights({
          urgency:
            role === "alertdialog"
              ? "high"
              : biometrics.stressLevel > 0.7
                ? "medium"
                : "low",
          complexity: (children?.toString().length || 0) > 500 ? 0.8 : 0.4,
          userStress: biometrics.stressLevel,
        });

        // Record biometric adaptation for achievements
        if (trackAchievements && achievementTracker) {
          achievementTracker.recordInteraction("modal_biometric_adaptation", {
            stressLevel: biometrics.stressLevel,
            modalComplexity:
              (children?.toString().length || 0) > 500 ? "high" : "low",
            adaptations: {
              urgencyLevel: role === "alertdialog" ? "high" : "normal",
            },
          });
        }
      };

      const interval = setInterval(
        updateAdaptiveFeatures,
        ANIMATION.DURATION.slower * 4
      );
      updateAdaptiveFeatures(); // Run immediately

      return () => clearInterval(interval);
    }, [
      adaptive,
      biometricAdapter,
      open,
      role,
      children,
      trackAchievements,
      achievementTracker,
    ]);

    // Predictive modal insights
    useEffect(() => {
      if (!predictive || !predictiveEngine || !open) return;

      const generateModalInsights = async () => {
        try {
          const modalContext = {
            title: title || "Modal",
            role,
            size,
            variant,
            hasFooter: !!footer,
            contentLength: children?.toString().length || 0,
            interactionCount,
            timeSpent: modalFocusTime ? Date.now() - modalFocusTime : 0,
          };

          const insights =
            await predictiveEngine.analyzeModalEngagement(modalContext);
          setModalInsights((prevInsights) => ({
            urgency: insights.urgency || prevInsights?.urgency || "low",
            complexity: insights.complexity || prevInsights?.complexity || 0.5,
            userStress: insights.userStress || prevInsights?.userStress || 0.3,
          }));
        } catch (error) {
          console.warn("Predictive modal analysis failed:", error);
        }
      };

      const timeoutId = setTimeout(
        generateModalInsights,
        ANIMATION.DURATION.slower * 1.4
      );
      return () => clearTimeout(timeoutId);
    }, [
      predictive,
      predictiveEngine,
      open,
      title,
      role,
      size,
      variant,
      footer,
      children,
      interactionCount,
      modalFocusTime,
    ]);

    // Enhanced handlers with consciousness tracking
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          // Record backdrop click interaction
          if (consciousness && interactionRecorder) {
            interactionRecorder.recordInteraction("modal_backdrop_click", {
              modalTitle: title,
              timestamp: Date.now(),
            });
          }

          // Play spatial audio for backdrop close
          if (spatialAudio && spatialAudioEngine) {
            spatialAudioEngine.playSound("modal-backdrop-close", {
              volume: 0.3,
              position: "left",
              reverb: 0.1,
            });
          }

          onClose();
        }
      },
      [
        closeOnBackdropClick,
        onClose,
        consciousness,
        interactionRecorder,
        title,
        spatialAudio,
        spatialAudioEngine,
      ]
    );

    const handleEscapeKey = useCallback(() => {
      if (closeOnEscape) {
        // Record escape key close
        if (consciousness && interactionRecorder) {
          interactionRecorder.recordInteraction("modal_escape_close", {
            modalTitle: title,
            timestamp: Date.now(),
          });
        }

        // Play spatial audio for escape close
        if (spatialAudio && spatialAudioEngine) {
          spatialAudioEngine.playSound("modal-escape-close", {
            volume: 0.4,
            position: "right",
            reverb: 0.2,
          });
        }

        onClose();
      }
    }, [
      closeOnEscape,
      onClose,
      consciousness,
      interactionRecorder,
      title,
      spatialAudio,
      spatialAudioEngine,
    ]);

    const sizeClasses = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-full glass-mx-4",
    };

    const variantClasses = {
      default: "items-center justify-center glass-p-4",
      centered: "items-center justify-center glass-p-4",
      drawer: "items-end justify-center pb-0",
      fullscreen: "items-center justify-center glass-p-0",
    };

    const backdropBlurClasses = {
      none: "",
      sm: "glass-backdrop-blur-md",
      md: "glass-backdrop-blur-md",
      lg: "glass-backdrop-blur-md",
    };

    const getAnimationPreset = () => {
      if (prefersReducedMotion) return "none";

      switch (animation) {
        case "fade":
          return "fadeIn";
        case "scale":
          return "scaleIn";
        case "slide":
          return variant === "drawer" ? "slideUp" : "slideDown";
        case "flip":
          return "scaleIn";
        default:
          return "scaleIn";
      }
    };

    if (!mounted || !open) {
      return null;
    }

    return (
      <div
        data-glass-component
        data-testid={dataTestId}
        className={cn(
          "fixed inset-0 flex",
          variantClasses[variant],
          backdropBlurClasses[backdropBlur],
          consciousness && "consciousness-modal-container",
          adaptive &&
            modalInsights?.urgency === "high" &&
            "consciousness-urgent-modal",
          eyeTracking && "consciousness-eye-trackable",
          className
        )}
        style={{ zIndex }}
        data-consciousness-modal="true"
        data-consciousness-active={String(!!consciousness)}
        data-modal-title={title}
        data-modal-role={role}
        data-modal-urgency={modalInsights?.urgency}
        data-user-stress={modalInsights?.userStress}
        data-interaction-count={interactionCount}
      >
        {/* Backdrop */}
        {backdrop || (
          <Motion
            preset="fadeIn"
            duration={prefersReducedMotion ? 0 : undefined}
            className="glass-absolute glass-inset-0 glass-surface-dark/50"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--glass-black) 40%, transparent)",
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}

        {/* Modal content */}
        <Motion
          preset={getAnimationPreset()}
          duration={prefersReducedMotion ? 0 : undefined}
          className={cn(
            "relative w-full",
            sizeClasses[size],
            variant === "fullscreen" ? "h-full" : "max-h-full",
            consciousness && "consciousness-modal-content",
            predictive && modalInsights && "consciousness-predictive-modal",
            adaptive &&
              modalInsights?.urgency === "high" &&
              "consciousness-urgent-content"
          )}
          data-consciousness-content="true"
          data-modal-complexity={modalInsights?.complexity}
          data-time-spent={modalFocusTime ? Date.now() - modalFocusTime : 0}
        >
          <FocusTrap
            active={open}
            onEscape={handleEscapeKey}
            lockScroll={false}
          >
            {material === "liquid" ? (
              <LiquidGlassMaterial
                ior={materialProps?.ior || 1.52}
                thickness={materialProps?.thickness || 12}
                tint={materialProps?.tint || { r: 0, g: 0, b: 0, a: 0.1 }}
                variant={materialProps?.variant || "regular"}
                quality={materialProps?.quality || "high"}
                environmentAdaptation
                motionResponsive
                ref={ref}
                tabIndex={-1}
                {...a11yProps}
                className={cn(
                  "w-full flex flex-col liquid-glass-modal-surface",
                  "focus:outline-none",
                  variant === "fullscreen"
                    ? "h-full"
                    : "max-h-full overflow-hidden",
                  consciousness && "consciousness-modal-glass",
                  eyeTracking && "consciousness-eye-trackable-content",
                  adaptive &&
                    modalInsights?.urgency === "high" &&
                    "consciousness-urgent-glass",
                  predictive &&
                    modalInsights &&
                    "consciousness-predictive-glass"
                )}
                style={{
                  ...({
                    "--liquid-glass-depth-offset":
                      variant === "drawer" ? "8px" : "12px",
                    "--liquid-glass-tint-adaptive":
                      modalInsights?.urgency === "high"
                        ? "color-mix(in srgb, var(--glass-color-danger) 15%, transparent)"
                        : "color-mix(in srgb, var(--glass-black) var(--glass-opacity-10), transparent)",
                  } as React.CSSProperties),
                }}
                data-liquid-glass-modal="true"
                data-modal-urgency={modalInsights?.urgency}
                {...props}
              >
                {/* Header */}
                {(title || description || showCloseButton) && (
                  <div className="glass-flex-shrink-0 glass-p-6 glass-border-b glass-border-glass-border/20">
                    <div className="glass-flex glass-items-start glass-justify-between">
                      <div className="glass-flex-1 glass-min-glass-w-0">
                        {title && (
                          <h2
                            id={titleId}
                            className="glass-text-lg glass-font-semibold glass-text-primary"
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id={descriptionId}
                            className="glass-text-sm glass-text-secondary-foreground glass-mt-1"
                          >
                            {description}
                          </p>
                        )}
                      </div>
                      {showCloseButton && (
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          iconOnly
                          onClick={onClose}
                          aria-label="Close modal"
                          className="glass-flex-shrink-0 glass-ml-4"
                        >
                          ×
                        </GlassButton>
                      )}
                    </div>
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
                  <div className="glass-flex-shrink-0 glass-p-6 glass-border-t glass-border-glass-border/20">
                    {footer}
                  </div>
                )}
              </LiquidGlassMaterial>
            ) : (
              <OptimizedGlass
                intent="neutral"
                elevation="level4"
                intensity="strong"
                depth={2}
                tint="neutral"
                border="subtle"
                animation="none"
                performanceMode="medium"
                ref={ref}
                tabIndex={-1}
                {...a11yProps}
                className={cn(
                  "w-full flex flex-col glass-overlay-noise glass-edge glass-overlay-specular glass-typography-reset",
                  "focus:outline-none",
                  variant === "fullscreen"
                    ? "h-full"
                    : "max-h-full overflow-hidden",
                  consciousness && "consciousness-modal-glass",
                  eyeTracking && "consciousness-eye-trackable-content",
                  adaptive &&
                    modalInsights?.urgency === "high" &&
                    "consciousness-urgent-glass",
                  predictive &&
                    modalInsights &&
                    "consciousness-predictive-glass"
                )}
                {...props}
              >
                {/* Header */}
                {(title || description || showCloseButton) && (
                  <div className="glass-flex-shrink-0 glass-p-6 glass-border-b glass-border-glass-border/20">
                    <div className="glass-flex glass-items-start glass-justify-between">
                      <div className="glass-flex-1 glass-min-glass-w-0">
                        {title && (
                          <h2
                            id={titleId}
                            className="glass-text-lg glass-font-semibold glass-text-primary"
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id={descriptionId}
                            className="glass-mt-1 glass-text-sm glass-text-secondary"
                          >
                            {description}
                          </p>
                        )}
                      </div>

                      {showCloseButton && (
                        <div className="glass-flex-shrink-0 glass-ml-4">
                          {closeButton || (
                            <IconButton
                              icon={
                                <svg
                                  className="glass-w-4 glass-h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              }
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Record close button interaction
                                if (consciousness && interactionRecorder) {
                                  interactionRecorder.recordInteraction(
                                    "modal_close_button",
                                    {
                                      modalTitle: title,
                                      timestamp: Date.now(),
                                    }
                                  );
                                }

                                // Play spatial audio for button close
                                if (spatialAudio && spatialAudioEngine) {
                                  spatialAudioEngine.playSound(
                                    "modal-button-close",
                                    {
                                      volume: 0.3,
                                      position: "right",
                                      reverb: 0.1,
                                    }
                                  );
                                }

                                onClose();
                              }}
                              aria-label="Close modal"
                              className={cn(
                                consciousness && "consciousness-close-button",
                                adaptive &&
                                  modalInsights?.urgency === "high" &&
                                  "consciousness-urgent-close"
                              )}
                              data-consciousness-close="true"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div
                  ref={contentRef}
                  className={cn(
                    "flex-1 overflow-y-auto glass-p-6",
                    consciousness && "consciousness-modal-body",
                    eyeTracking && "consciousness-eye-trackable-body",
                    adaptive &&
                      modalInsights?.urgency === "high" &&
                      "consciousness-urgent-body"
                  )}
                  tabIndex={0}
                  data-consciousness-body="true"
                  data-content-complexity={modalInsights?.complexity}
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

                      interactionRecorder.recordInteraction("modal_scroll", {
                        modalTitle: title,
                        scrollDepth,
                        timestamp: Date.now(),
                      });
                    }
                  }}
                  onClick={(e) => {
                    if (consciousness && interactionRecorder) {
                      setContentEngagement((prev: any) => ({
                        ...prev,
                        interactions: prev.interactions + 1,
                      }));

                      interactionRecorder.recordInteraction(
                        "modal_content_click",
                        {
                          modalTitle: title,
                          timestamp: Date.now(),
                        }
                      );
                    }
                  }}
                >
                  {children}

                  {/* Modal Insights Display */}
                  {predictive && modalInsights && (
                    <div className="glass-mt-4 glass-p-3 glass-surface-primary/10 glass-radius-lg glass-border glass-border-primary/20 glass-text-xs">
                      <div className="glass-flex glass-items-center glass-justify-between">
                        <span className="glass-text-primary">
                          Modal Insights
                        </span>
                        <div className="glass-flex glass-gap-2">
                          <span
                            className={cn(
                              "glass-px-2 glass-py-1 glass-radius-md",
                              modalInsights.urgency === "high"
                                ? "bg-red-500/20 text-red-300"
                                : modalInsights.urgency === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                            )}
                          >
                            {modalInsights.urgency} urgency
                          </span>
                          {modalInsights.userStress > 0.7 && (
                            <span className="glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 glass-text-secondary">
                              high stress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="glass-flex-shrink-0 glass-p-6 glass-border-t glass-border-glass-border/20">
                    {footer}
                  </div>
                )}
              </OptimizedGlass>
            )}
          </FocusTrap>
        </Motion>
      </div>
    );
  }
);

GlassModal.displayName = "GlassModal";

// Consciousness-Enhanced Modal Variants
export const GlassPredictiveModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal {...props} consciousness={true} predictive={true} />
);

export const GlassAdaptiveModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal {...props} consciousness={true} adaptive={true} />
);

export const GlassEyeTrackingModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal {...props} consciousness={true} eyeTracking={true} />
);

export const GlassSpatialAudioModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal {...props} consciousness={true} spatialAudio={true} />
);

export const GlassAchievementModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal {...props} consciousness={true} trackAchievements={true} />
);

export const GlassConsciousnessModal: React.FC<GlassModalProps> = (props) => (
  <GlassModal
    {...props}
    consciousness={true}
    predictive={true}
    adaptive={true}
    eyeTracking={true}
    spatialAudio={true}
    trackAchievements={true}
  />
);

// Re-export dialog and drawer from their dedicated modules for compatibility
export { GlassDialog } from "./GlassDialog";
export type { GlassDialogProps } from "./GlassDialog";
export { GlassDrawer } from "./GlassDrawer";
export type { GlassDrawerProps } from "./GlassDrawer";

// (Note) Dialog and Drawer live in their dedicated files.
