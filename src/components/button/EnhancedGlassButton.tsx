"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
/**
 * Enhanced Glass Button
 * Next-generation button component integrating all advanced systems:
 * - Physics Engine for realistic glass interactions
 * - Morphing Engine for environmental adaptation
 * - 3D Engine for immersive depth effects
 * - Organic Animation Engine for natural motion
 * - Emotional Intelligence for adaptive behavior
 * - Spatial Computing for AR/VR support
 * - AI Personalization for learned preferences
 */

import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { motion, AnimationControls, useAnimation } from "framer-motion";

// Import all our advanced engines
import GlassPhysicsEngine from "../effects/GlassPhysicsEngine";
import GlassMorphingEngine from "../effects/GlassMorphingEngine";
import Glass3DEngine from "../effects/Glass3DEngine";
import OrganicAnimationEngine, {
  COMMON_SEQUENCES,
} from "../animations/OrganicAnimationEngine";
import SpatialComputingEngine from "../spatial/SpatialComputingEngine";

// Import intelligence systems
import { useEmotionalIntelligence } from "../../utils/emotionalIntelligence";
import {
  useAIPersonalization,
  useInteractionRecording,
} from "../../utils/aiPersonalization";
import { consciousnessResourcePool } from "../../utils/consciousnessOptimization";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

// Base button props (simplified for integration)
interface BaseGlassButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

// Enhanced features configuration
interface EnhancedFeatures {
  // Core glass effects
  physics?: {
    enabled?: boolean;
    interaction?: "ripple" | "shatter" | "bend" | "melt" | "freeze" | "vibrate";
    intensity?: number;
  };

  // Environmental adaptation
  morphing?: {
    enabled?: boolean;
    environmentalAdaptation?: boolean;
    userActivityAdaptation?: boolean;
    contentTypeAdaptation?: boolean;
  };

  // 3D immersion
  spatial3D?: {
    enabled?: boolean;
    layers?: number;
    parallax?: boolean;
    depthOfField?: boolean;
    holographic?: boolean;
  };

  // Natural animations
  organicMotion?: {
    enabled?: boolean;
    patterns?: string[];
    emotionalContext?: string;
    enableMicroInteractions?: boolean;
    showDebugHud?: boolean;
  };

  // Emotional intelligence
  emotionalAdaptation?: {
    enabled?: boolean;
    biometricTracking?: boolean;
    behaviorAnalysis?: boolean;
    uiAdaptation?: boolean;
  };

  // Spatial computing (AR/VR)
  spatialComputing?: {
    enabled?: boolean;
    gestureRecognition?: boolean;
    spatialAnchoring?: boolean;
    vrOptimized?: boolean;
  };

  // AI personalization
  aiPersonalization?: {
    enabled?: boolean;
    learningMode?: "passive" | "active" | "adaptive";
    recommendationLevel?: "minimal" | "moderate" | "comprehensive";
  };
}

export interface EnhancedGlassButtonProps extends BaseGlassButtonProps {
  enhancedFeatures?: EnhancedFeatures;
  userId?: string;
  componentId?: string;
  onAdvancedInteraction?: (type: string, data: unknown) => void;
}

export const EnhancedGlassButton = forwardRef<
  HTMLButtonElement,
  EnhancedGlassButtonProps
>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      enhancedFeatures = {},
      userId = "default-user",
      componentId = "enhanced-glass-button",
      onAdvancedInteraction,
      onClick,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isInteracting, setIsInteracting] = useState(false);
    const [adaptationApplied, setAdaptationApplied] = useState(false);

    // Enhanced feature flags with defaults
    const features = useMemo(
      () => ({
        physics: {
          enabled: true,
          interaction: "ripple",
          intensity: 1,
          ...enhancedFeatures.physics,
        },
        morphing: {
          enabled: true,
          environmentalAdaptation: true,
          userActivityAdaptation: true,
          contentTypeAdaptation: true,
          ...enhancedFeatures.morphing,
        },
        spatial3D: {
          enabled: true,
          layers: 4,
          parallax: true,
          depthOfField: true,
          holographic: true,
          ...enhancedFeatures.spatial3D,
        },
        organicMotion: {
          enabled: true,
          patterns: ["gentle", "interactive"],
          emotionalContext: "calm",
          enableMicroInteractions: true,
          ...enhancedFeatures.organicMotion,
        },
        emotionalAdaptation: {
          enabled: true,
          biometricTracking: true,
          behaviorAnalysis: true,
          uiAdaptation: true,
          ...enhancedFeatures.emotionalAdaptation,
        },
        spatialComputing: {
          enabled: false, // Disabled by default for compatibility
          gestureRecognition: true,
          spatialAnchoring: false,
          vrOptimized: false,
          ...enhancedFeatures.spatialComputing,
        },
        aiPersonalization: {
          enabled: true,
          learningMode: "adaptive",
          recommendationLevel: "moderate",
          ...enhancedFeatures.aiPersonalization,
        },
      }),
      [enhancedFeatures]
    );

    // Initialize intelligence systems
    const {
      currentEmotion,
      uiAdaptation,
      addBiometricData,
      addBehaviorData,
      analyzeEmotion,
    } = useEmotionalIntelligence();

    const { profile, recommendations, recordInteraction, predictBehavior } =
      useAIPersonalization(userId);

    const { startInteraction, endInteraction } = useInteractionRecording(
      componentId,
      userId
    );

    // Base button styles with glass design tokens
    const baseStyles = useMemo(() => {
      const sizeStyles = {
        xs: "glass-h-xs glass-px-xs glass-text-xs",
        sm: "glass-h-sm glass-px-sm glass-text-sm",
        md: "glass-h-md glass-px-md glass-text-sm",
        lg: "glass-h-lg glass-px-lg glass-text-base",
        xl: "glass-h-xl glass-px-xl glass-text-lg",
      };

      const variantStyles = {
        primary:
          "glass-surface-primary glass-text-primary hover:glass-surface-primary-hover",
        secondary:
          "glass-surface-secondary glass-text-secondary hover:glass-surface-secondary-hover",
        destructive:
          "glass-surface-danger glass-text-danger hover:glass-surface-danger-hover",
        ghost:
          "glass-surface-transparent hover:glass-surface-accent glass-text-secondary hover:glass-text-primary",
        outline:
          "glass-border-subtle glass-surface-background hover:glass-surface-accent glass-text-secondary hover:glass-text-primary",
      };

      return cn(
        // Base glass foundation
        "glass-foundation-complete",
        "inline-flex items-center justify-center whitespace-nowrap",
        "glass-radius-md glass-transition glass-focus",
        "font-medium cursor-pointer select-none",
        "disabled:pointer-events-none disabled:opacity-50",
        // Glass-specific utilities
        "glass-overlay-specular glass-parallax",
        "glass-magnet glass-ripple glass-press",
        sizeStyles[size],
        variantStyles[variant]
      );
    }, [size, variant]);

    // Apply AI personalization adaptations
    useEffect(() => {
      if (features.aiPersonalization.enabled && profile && !adaptationApplied) {
        // Apply learned preferences
        const buttonEl = buttonRef.current;
        if (buttonEl) {
          // Apply animation speed preference
          if (profile.uiPreferences.animationSpeed !== 1) {
            buttonEl.style.transitionDuration = `${ANIMATION.DURATION.normal / profile.uiPreferences.animationSpeed}ms`;
          }

          // Apply density preference
          if (profile.uiPreferences.density === "compact") {
            buttonEl.style.padding = "0.25rem 0.75rem";
          } else if (profile.uiPreferences.density === "spacious") {
            buttonEl.style.padding = "0.75rem 2rem";
          }

          setAdaptationApplied(true);
        }
      }
    }, [features.aiPersonalization.enabled, profile, adaptationApplied]);

    // Enhanced click handler with all intelligence systems
    const handleEnhancedClick = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsInteracting(true);

        // Start interaction recording
        const interaction = startInteraction("click", window.location.pathname);

        // Record biometric data (simulated - would use real sensors)
        if (
          features.emotionalAdaptation.enabled &&
          features.emotionalAdaptation.biometricTracking
        ) {
          addBiometricData({
            mouseVelocity: Math.sqrt(
              event.movementX ** 2 + event.movementY ** 2
            ),
            clickPressure: Math.random() * 0.5 + 0.5, // Simulated
            dwellTime: Date.now() % 5000, // Simulated
          });
        }

        // Record behavioral data
        if (
          features.emotionalAdaptation.enabled &&
          features.emotionalAdaptation.behaviorAnalysis
        ) {
          addBehaviorData({
            interactionFrequency: Math.floor(Math.random() * 20) + 5,
            decisionTime: Math.random() * 2000 + 500,
            errorRate: Math.random() * 0.1,
          });
        }

        // Analyze emotion and trigger UI adaptation
        if (features.emotionalAdaptation.enabled) {
          const emotion = analyzeEmotion();
          if (emotion) {
            onAdvancedInteraction?.("emotion-detected", emotion);
          }
        }

        // Predict next likely behavior
        if (features.aiPersonalization.enabled) {
          const predictions = predictBehavior(window.location.pathname);
          if (predictions.length > 0) {
            onAdvancedInteraction?.("behavior-predicted", predictions[0]);
          }
        }

        // Call original onClick
        onClick?.(event);

        // End interaction recording
        endInteraction(interaction, {
          x: event.clientX,
          y: event.clientY,
        });

        // Advanced interaction callback
        onAdvancedInteraction?.("enhanced-click", {
          emotion: currentEmotion,
          predictions: predictBehavior(window.location.pathname),
          adaptations: uiAdaptation,
        });

        setTimeout(() => setIsInteracting(false), ANIMATION.DURATION.normal);
      },
      [
        startInteraction,
        endInteraction,
        onClick,
        features,
        addBiometricData,
        addBehaviorData,
        analyzeEmotion,
        predictBehavior,
        currentEmotion,
        uiAdaptation,
        onAdvancedInteraction,
      ]
    );

    // Create the enhanced button with all systems
    const enhancedButton = useMemo(() => {
      let buttonElement = (
        <button
          ref={buttonRef}
          className={cn(baseStyles, className)}
          onClick={handleEnhancedClick}
          {...props}
        >
          {children}
        </button>
      );

      // Wrap with Physics Engine
      if (features.physics.enabled) {
        buttonElement = (
          <GlassPhysicsEngine
            interaction={features.physics.interaction as any}
            intensity={features.physics.intensity}
            enabled={features.physics.enabled}
          >
            {buttonElement}
          </GlassPhysicsEngine>
        );
      }

      // Wrap with Morphing Engine
      if (features.morphing.enabled) {
        buttonElement = (
          <GlassMorphingEngine
            enableRealTimeAdaptation={features.morphing.environmentalAdaptation}
            userActivity={isInteracting ? "focused" : "browsing"}
            contentType="interactive"
            intensity={features.physics.intensity || 1}
          >
            {buttonElement}
          </GlassMorphingEngine>
        );
      }

      // Wrap with 3D Engine
      if (features.spatial3D.enabled) {
        buttonElement = (
          <Glass3DEngine
            enableParallax={features.spatial3D.parallax}
            enableDepthOfField={features.spatial3D.depthOfField}
            enableHolographic={features.spatial3D.holographic}
            maxDepthLayers={features.spatial3D.layers}
          >
            {buttonElement}
          </Glass3DEngine>
        );
      }

      // Wrap with Organic Animation Engine
      if (features.organicMotion.enabled) {
        const animationSequences = features.organicMotion.patterns?.flatMap(
          (pattern) => COMMON_SEQUENCES[pattern] || []
        );

        buttonElement = (
          <OrganicAnimationEngine
            sequences={animationSequences}
            emotionalContext={
              currentEmotion?.primary ||
              (features.organicMotion.emotionalContext as any)
            }
            enableMicroInteractions={
              features.organicMotion.enableMicroInteractions
            }
            showDebugHud={features.organicMotion.showDebugHud}
          >
            {buttonElement}
          </OrganicAnimationEngine>
        );
      }

      // Wrap with Spatial Computing Engine (for AR/VR)
      if (features.spatialComputing.enabled) {
        buttonElement = (
          <SpatialComputingEngine
            enableGestures={features.spatialComputing.gestureRecognition}
            enableAnchoring={features.spatialComputing.spatialAnchoring}
            spatialId={`${componentId}-spatial`}
            onGesture={(gesture) => onAdvancedInteraction?.("gesture", gesture)}
          >
            {buttonElement}
          </SpatialComputingEngine>
        );
      }

      return buttonElement;
    }, [
      baseStyles,
      className,
      handleEnhancedClick,
      children,
      props,
      features,
      isInteracting,
      currentEmotion,
      componentId,
      onAdvancedInteraction,
    ]);

    // Forward ref to the actual button element
    useEffect(() => {
      if (typeof ref === "function") {
        ref(buttonRef.current);
      } else if (ref) {
        ref.current = buttonRef.current;
      }
    }, [ref]);

    return enhancedButton;
  }
);

EnhancedGlassButton.displayName = "EnhancedGlassButton";

// Predefined enhanced button variants for common use cases

export const PhysicsGlassButton: React.FC<EnhancedGlassButtonProps> = (
  props
) => (
  <EnhancedGlassButton
    {...props}
    enhancedFeatures={{
      physics: { enabled: true, interaction: "ripple", intensity: 1.2 },
      organicMotion: { enabled: true, patterns: ["interactive"] },
      aiPersonalization: { enabled: true },
    }}
  />
);

export const ImmersiveGlassButton: React.FC<EnhancedGlassButtonProps> = (
  props
) => (
  <EnhancedGlassButton
    {...props}
    enhancedFeatures={{
      physics: { enabled: true, interaction: "ripple" },
      morphing: { enabled: true, environmentalAdaptation: true },
      spatial3D: { enabled: true, holographic: true },
      organicMotion: { enabled: true, patterns: ["gentle", "interactive"] },
      emotionalAdaptation: { enabled: true },
      aiPersonalization: { enabled: true },
    }}
  />
);

export const VRGlassButton: React.FC<EnhancedGlassButtonProps> = (props) => (
  <EnhancedGlassButton
    {...props}
    enhancedFeatures={{
      spatialComputing: {
        enabled: true,
        gestureRecognition: true,
        vrOptimized: true,
      },
      spatial3D: { enabled: true, layers: 6 },
      physics: { enabled: true, interaction: "vibrate" },
      aiPersonalization: { enabled: true },
    }}
  />
);

export const SmartAdaptiveButton: React.FC<EnhancedGlassButtonProps> = (
  props
) => (
  <EnhancedGlassButton
    {...props}
    enhancedFeatures={{
      emotionalAdaptation: {
        enabled: true,
        biometricTracking: true,
        behaviorAnalysis: true,
        uiAdaptation: true,
      },
      aiPersonalization: {
        enabled: true,
        learningMode: "adaptive",
        recommendationLevel: "comprehensive",
      },
      morphing: { enabled: true, userActivityAdaptation: true },
      organicMotion: { enabled: true, enableMicroInteractions: true },
    }}
  />
);

export const UltraEnhancedButton: React.FC<EnhancedGlassButtonProps> = (
  props
) => (
  <EnhancedGlassButton
    {...props}
    enhancedFeatures={{
      physics: { enabled: true, interaction: "ripple", intensity: 1.5 },
      morphing: {
        enabled: true,
        environmentalAdaptation: true,
        userActivityAdaptation: true,
        contentTypeAdaptation: true,
      },
      spatial3D: {
        enabled: true,
        layers: 6,
        parallax: true,
        depthOfField: true,
        holographic: true,
      },
      organicMotion: {
        enabled: true,
        patterns: ["gentle", "energetic", "interactive"],
        enableMicroInteractions: true,
      },
      emotionalAdaptation: {
        enabled: true,
        biometricTracking: true,
        behaviorAnalysis: true,
        uiAdaptation: true,
      },
      spatialComputing: { enabled: false }, // Disabled for web compatibility
      aiPersonalization: {
        enabled: true,
        learningMode: "adaptive",
        recommendationLevel: "comprehensive",
      },
    }}
  />
);

export default EnhancedGlassButton;
