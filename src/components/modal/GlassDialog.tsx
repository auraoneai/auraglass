'use client';
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
import { GlassButton } from "../button/GlassButton";
import type { ConsciousnessFeatures } from "../layout/GlassContainer";
import { trapFocus } from "../../utils/focus";
// import { usePredictiveEngine, useInteractionRecorder } from '../advanced/GlassPredictiveEngine';
// import { useAchievements } from '../advanced/GlassAchievementSystem';
// import { useBiometricAdaptation } from '../advanced/GlassBiometricAdaptation';
// import { useEyeTracking } from '../advanced/GlassEyeTracking';
// import { useSpatialAudio } from '../advanced/GlassSpatialAudio';

export interface GlassDialogProps extends ConsciousnessFeatures {
  /**
   * Whether the dialog is open
   */
  open?: boolean;
  /**
   * Callback when dialog open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /** Optional close callback for compatibility */
  onClose?: () => void;
  /**
   * Dialog title
   */
  title?: React.ReactNode;
  /**
   * Dialog description
   */
  description?: React.ReactNode;
  /**
   * Dialog content
   */
  children?: React.ReactNode;
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
   * Dialog size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Dialog variant
   */
  variant?: "default" | "centered" | "fullscreen";
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
   * Animation preset
   */
  animation?: "fade" | "scale" | "slide" | "flip";
  /**
   * Dialog footer content
   */
  footer?: React.ReactNode;
  /**
   * Custom header content
   */
  header?: React.ReactNode;
  /**
   * Whether dialog is modal (blocks interaction with background)
   */
  modal?: boolean;
  /**
   * Custom backdrop blur
   */
  backdropBlur?: boolean;
  /**
   * Dialog elevation
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Custom z-index
   */
  zIndex?: number;
  className?: string;
  /**
   * Custom className for dialog content
   */
  contentClassName?: string;
}

/**
 * GlassDialog component
 * Modal dialog with glassmorphism styling and comprehensive functionality
 */
export const GlassDialog = forwardRef<HTMLDivElement, GlassDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title,
      description,
      children,
      size = "md",
      variant = "default",
      material = "glass",
      materialProps,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      animation = "scale",
      footer,
      header,
      modal = true,
      backdropBlur = true,
      elevation = "modal",
      zIndex = 50,
      className,
      contentClassName,
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
    const [isVisible, setIsVisible] = useState(open);
    const dialogRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Consciousness state
    const [interactionCount, setInteractionCount] = useState(0);
    const [dialogEngagement, setDialogEngagement] = useState<{
      timeSpent: number;
      contentScrolled: boolean;
      interactionCount: number;
    }>({ timeSpent: 0, contentScrolled: false, interactionCount: 0 });
    const [dialogInsights, setDialogInsights] = useState<{
      urgency: "low" | "medium" | "high";
      complexity: number;
      userStress: number;
    } | null>(null);

    // Consciousness hooks (mock implementations)
    const predictiveEngine = predictive
      ? {
          analyzeModalEngagement: async () => ({
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

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape || !open) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onOpenChange?.(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [closeOnEscape, open, onOpenChange]);

    // Handle body scroll lock
    useEffect(() => {
      if (modal && open) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [modal, open]);

    // Focus management: trap focus and restore on close
    useEffect(() => {
      if (!open || !dialogRef.current) return;

      // Store previously focused element
      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      // Set up focus trap
      const releaseFocus = trapFocus(dialogRef.current, {
        returnFocus: false, // We'll handle this manually for better control
        escapeDeactivates: false, // We handle escape separately
        allowOutsideClick: true, // We handle backdrop clicks separately
      });

      return () => {
        releaseFocus();
        // Restore focus to previously focused element
        if (previouslyFocusedRef.current) {
          setTimeout(() => {
            previouslyFocusedRef.current?.focus();
          }, 0);
        }
      };
    }, [open]);

    // Handle visibility state
    useEffect(() => {
      if (open) {
        setIsVisible(true);
      } else {
        // Delay hiding to allow exit animation
        const timer = setTimeout(() => setIsVisible(false), 200);
        return () => clearTimeout(timer);
      }
    }, [open]);

    // Consciousness effects
    // Dialog lifecycle tracking with spatial audio
    useEffect(() => {
      if (open) {
        const openTime = Date.now();
        setInteractionCount((prev: any) => prev + 1);

        // Record dialog opening
        if (consciousness && interactionRecorder) {
          interactionRecorder.recordInteraction("dialog_open", {
            title: title?.toString() || "Dialog",
            size,
            variant,
            timestamp: openTime,
          });
        }

        // Track achievement for dialog interaction
        if (trackAchievements && achievementTracker) {
          achievementTracker.recordInteraction("dialog_opened", {
            dialogTitle: title?.toString() || "Dialog",
            timestamp: openTime,
          });
        }

        // Play spatial audio for dialog opening
        if (spatialAudio && spatialAudioEngine) {
          spatialAudioEngine.playSound("dialog-open", {
            volume: 0.5,
            position: "center",
            reverb: 0.3,
          });
        }

        // Start tracking time
        const timeTracker = setInterval(() => {
          setDialogEngagement((prev: any) => ({
            ...prev,
            timeSpent: Date.now() - openTime,
          }));
        }, 1000);

        return () => clearInterval(timeTracker);
      } else {
        // Record dialog closing
        if (
          consciousness &&
          interactionRecorder &&
          dialogEngagement.timeSpent > 0
        ) {
          interactionRecorder.recordInteraction("dialog_close", {
            title: title?.toString() || "Dialog",
            timeSpent: dialogEngagement.timeSpent,
            interactions: dialogEngagement.interactionCount,
            contentScrolled: dialogEngagement.contentScrolled,
            timestamp: Date.now(),
          });
        }

        // Play spatial audio for dialog closing
        if (spatialAudio && spatialAudioEngine) {
          spatialAudioEngine.playSound("dialog-close", {
            volume: 0.4,
            position: "center",
            reverb: 0.2,
          });
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
      size,
      variant,
      dialogEngagement,
    ]);

    // Eye tracking for dialog engagement
    useEffect(() => {
      if (!eyeTracking || !eyeTracker || !open) return;

      const handleGazeData = (gazeData: any) => {
        // Track if user is looking at dialog content
        const dialogElement = document.querySelector(
          '[data-consciousness-dialog="true"]'
        );
        if (dialogElement) {
          const rect = dialogElement.getBoundingClientRect();
          const isLookingAtDialog =
            gazeData.x >= rect.left &&
            gazeData.x <= rect.right &&
            gazeData.y >= rect.top &&
            gazeData.y <= rect.bottom;

          if (isLookingAtDialog && trackAchievements && achievementTracker) {
            achievementTracker.recordInteraction("dialog_gaze_engagement", {
              dialogTitle: title?.toString(),
              gazeTime: Date.now(),
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

    // Biometric adaptation for dialog behavior
    useEffect(() => {
      if (!adaptive || !biometricAdapter || !open) return;

      const updateAdaptiveFeatures = () => {
        const biometrics = biometricAdapter.getCurrentBiometrics();

        setDialogInsights({
          urgency:
            biometrics.stressLevel > 0.7
              ? "high"
              : biometrics.stressLevel > 0.4
                ? "medium"
                : "low",
          complexity: (children?.toString().length || 0) > 300 ? 0.8 : 0.4,
          userStress: biometrics.stressLevel,
        });

        if (trackAchievements && achievementTracker) {
          achievementTracker.recordInteraction("dialog_biometric_adaptation", {
            stressLevel: biometrics.stressLevel,
            dialogComplexity:
              (children?.toString().length || 0) > 300 ? "high" : "low",
          });
        }
      };

      const interval = setInterval(updateAdaptiveFeatures, 3000);
      updateAdaptiveFeatures();

      return () => clearInterval(interval);
    }, [
      adaptive,
      biometricAdapter,
      open,
      children,
      trackAchievements,
      achievementTracker,
    ]);

    // Enhanced handlers with consciousness tracking
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          // Record backdrop click interaction
          if (consciousness && interactionRecorder) {
            interactionRecorder.recordInteraction("dialog_backdrop_click", {
              dialogTitle: title?.toString(),
              timestamp: Date.now(),
            });
          }

          // Play spatial audio for backdrop close
          if (spatialAudio && spatialAudioEngine) {
            spatialAudioEngine.playSound("dialog-backdrop-close", {
              volume: 0.3,
              position: "left",
              reverb: 0.1,
            });
          }

          onOpenChange?.(false);
          (props as any).onClose?.();
        }
      },
      [
        closeOnBackdropClick,
        onOpenChange,
        props,
        consciousness,
        interactionRecorder,
        title,
        spatialAudio,
        spatialAudioEngine,
      ]
    );

    const handleClose = useCallback(() => {
      // Record close button interaction
      if (consciousness && interactionRecorder) {
        interactionRecorder.recordInteraction("dialog_close_button", {
          dialogTitle: title?.toString(),
          timestamp: Date.now(),
        });
      }

      // Play spatial audio for button close
      if (spatialAudio && spatialAudioEngine) {
        spatialAudioEngine.playSound("dialog-button-close", {
          volume: 0.3,
          position: "right",
          reverb: 0.1,
        });
      }

      onOpenChange?.(false);
      (props as any).onClose?.();
    }, [
      onOpenChange,
      props,
      consciousness,
      interactionRecorder,
      title,
      spatialAudio,
      spatialAudioEngine,
    ]);

    // Size classes
    const sizeClasses = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      full: "max-w-full glass-mx-4",
    };

    // Animation presets
    const getAnimationPreset = () => {
      switch (animation) {
        case "fade":
          return "fadeIn";
        case "scale":
          return "scaleIn";
        case "slide":
          return "slideUp";
        case "flip":
          return "rotateIn";
        default:
          return "scaleIn";
      }
    };

    if (!isVisible) return null;

    return (
      <div
        data-glass-component
        className={cn(
          "fixed inset-0 flex items-center justify-center",
          variant === "fullscreen" ? "glass-p-0" : "glass-p-4",
          `z-${zIndex}`,
          consciousness && "consciousness-dialog-container",
          adaptive &&
            dialogInsights?.urgency === "high" &&
            "consciousness-urgent-dialog",
          eyeTracking && "consciousness-eye-trackable",
          className
        )}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal={modal}
        aria-labelledby={title ? "dialog-title" : undefined}
        aria-describedby={description ? "dialog-description" : undefined}
        data-consciousness-dialog="true"
        data-consciousness-active={String(!!consciousness)}
        data-dialog-title={title?.toString()}
        data-dialog-urgency={dialogInsights?.urgency}
        data-user-stress={dialogInsights?.userStress}
        data-interaction-count={interactionCount}
        {...props}
      >
        {/* Backdrop */}
        <Motion
          preset="fadeIn"
          duration={200}
          className={cn(
            "absolute inset-0 bg-black/20",
            backdropBlur && "glass-backdrop-blur-md"
          )}
        />

        {/* Dialog Content */}
        <Motion
          ref={dialogRef}
          preset={getAnimationPreset()}
          duration={200}
          className={cn(
            "relative w-full",
            variant === "fullscreen" ? "h-full" : "glass-max-h-90vh",
            sizeClasses[size]
          )}
        >
          {material === "liquid" ? (
            <LiquidGlassMaterial
              ior={materialProps?.ior || 1.48}
              thickness={materialProps?.thickness || 10}
              tint={materialProps?.tint || { r: 0, g: 0, b: 0, a: 0.08 }}
              variant={materialProps?.variant || "regular"}
              quality={materialProps?.quality || "high"}
              environmentAdaptation
              motionResponsive
              ref={ref}
              className={cn(
                "w-full overflow-hidden liquid-glass-dialog-surface",
                variant === "fullscreen" && "h-full rounded-none",
                consciousness && "consciousness-dialog-glass",
                eyeTracking && "consciousness-eye-trackable-content",
                adaptive &&
                  dialogInsights?.urgency === "high" &&
                  "consciousness-urgent-glass",
                predictive &&
                  dialogInsights &&
                  "consciousness-predictive-glass",
                className
              )}
              style={
                {
                  "--liquid-glass-dialog-density": "0.9",
                  "--liquid-glass-adaptive-tint":
                    dialogInsights?.urgency === "high"
                      ? "rgba(220, 38, 38, 0.12)"
                      : "rgba(0, 0, 0, 0.08)",
                } as React.CSSProperties
              }
              data-liquid-glass-dialog="true"
              data-dialog-urgency={dialogInsights?.urgency}
              {...props}
            >
              {/* Header */}
              {(header || title || description || showCloseButton) && (
                <div className="glass-flex glass-items-start glass-justify-between glass-p-6 glass-border-b glass-border-glass-border/10">
                  <div className="glass-flex-1 glass-min-glass-w-0">
                    {header || (
                      <>
                        {title && (
                          <h2
                            id="dialog-title"
                            className='glass-text-lg glass-font-semibold glass-text-primary glass-mb-1'
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id="dialog-description"
                            className='glass-text-sm glass-text-secondary-foreground'
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
                      aria-label="Close dialog"
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
                <div className="glass-p-6 glass-border-t glass-border-glass-border/10">
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
                "w-full overflow-hidden border border-border/20 glass-radial-reveal",
                variant === "fullscreen" && "h-full rounded-none",
                consciousness && "consciousness-dialog-glass",
                eyeTracking && "consciousness-eye-trackable-content",
                adaptive &&
                  dialogInsights?.urgency === "high" &&
                  "consciousness-urgent-glass",
                predictive &&
                  dialogInsights &&
                  "consciousness-predictive-glass",
                className
              )}
              {...props}
            >
              {/* Header */}
              {(header || title || description || showCloseButton) && (
                <div className="glass-flex glass-items-start glass-justify-between glass-p-6 glass-border-b glass-border-glass-border/10">
                  <div className="glass-flex-1 glass-min-glass-w-0">
                    {header || (
                      <>
                        {title && (
                          <h2
                            id="dialog-title"
                            className='glass-text-lg glass-font-semibold glass-text-primary glass-mb-1'
                          >
                            {title}
                          </h2>
                        )}
                        {description && (
                          <p
                            id="dialog-description"
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
                          dialogInsights?.urgency === "high" &&
                          "consciousness-urgent-close"
                      )}
                      onClick={handleClose}
                      aria-label="Close dialog"
                      consciousness={consciousness}
                      adaptive={adaptive}
                      spatialAudio={spatialAudio}
                      trackAchievements={trackAchievements}
                      data-consciousness-close="true"
                    >
                      <X className='glass-w-4 glass-h-4' />
                    </GlassButton>
                  )}
                </div>
              )}

              {/* Content */}
              {children && (
                <div
                  className={cn(
                    "flex-1 overflow-y-auto glass-p-6",
                    consciousness && "consciousness-dialog-body",
                    eyeTracking && "consciousness-eye-trackable-body",
                    adaptive &&
                      dialogInsights?.urgency === "high" &&
                      "consciousness-urgent-body"
                  )}
                  data-consciousness-body="true"
                  data-content-complexity={dialogInsights?.complexity}
                  onScroll={(e) => {
                    setDialogEngagement((prev: any) => ({
                      ...prev,
                      contentScrolled: true,
                      interactionCount: prev.interactionCount + 1,
                    }));

                    if (consciousness && interactionRecorder) {
                      interactionRecorder.recordInteraction("dialog_scroll", {
                        dialogTitle: title?.toString(),
                        timestamp: Date.now(),
                      });
                    }
                  }}
                  onClick={(e) => {
                    setDialogEngagement((prev: any) => ({
                      ...prev,
                      interactionCount: prev.interactionCount + 1,
                    }));

                    if (consciousness && interactionRecorder) {
                      interactionRecorder.recordInteraction(
                        "dialog_content_click",
                        {
                          dialogTitle: title?.toString(),
                          timestamp: Date.now(),
                        }
                      );
                    }
                  }}
                >
                  {children}

                  {/* Dialog Insights Display */}
                  {predictive && dialogInsights && (
                    <div className="glass-mt-4 glass-p-3 glass-surface-primary/10 glass-radius-lg glass-border glass-border-primary/20 glass-text-xs">
                      <div className="glass-flex glass-items-center glass-justify-between">
                        <span className='glass-text-primary'>Dialog Insights</span>
                        <div className="glass-flex glass-gap-2">
                          <span
                            className={cn(
                              "glass-px-2 glass-py-1 glass-radius-md",
                              dialogInsights.urgency === "high"
                                ? "bg-red-500/20 text-red-300"
                                : dialogInsights.urgency === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                            )}
                          >
                            {dialogInsights.urgency} urgency
                          </span>
                          {dialogInsights.userStress > 0.7 && (
                            <span className="glass-px-2 glass-py-1 glass-radius-md glass-surface-primary/20 glass-text-secondary">
                              high stress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              {footer && (
                <div className="glass-p-6 glass-border-t glass-border-glass-border/10">
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

GlassDialog.displayName = "GlassDialog";

// Compound components for easier usage
export interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
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

DialogTrigger.displayName = "DialogTrigger";

export interface DialogContentProps extends GlassDialogProps {}

export const DialogContent = GlassDialog;

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col glass-gap-1.5 text-center sm:text-left",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogHeader.displayName = "DialogHeader";

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
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

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
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

DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
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

DialogFooter.displayName = "DialogFooter";

// Hook for dialog state management
export const useDialog = (defaultOpen = false) => {
  const [open, setOpen] = useState(defaultOpen);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const toggleDialog = () => setOpen((prev: any) => !prev);

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};

// Consciousness-Enhanced Dialog Variants
export const GlassPredictiveDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog {...props} consciousness={true} predictive={true} />
);

export const GlassAdaptiveDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog {...props} consciousness={true} adaptive={true} />
);

export const GlassEyeTrackingDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog {...props} consciousness={true} eyeTracking={true} />
);

export const GlassSpatialAudioDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog {...props} consciousness={true} spatialAudio={true} />
);

export const GlassAchievementDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog {...props} consciousness={true} trackAchievements={true} />
);

export const GlassConsciousnessDialog: React.FC<GlassDialogProps> = (props) => (
  <GlassDialog
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