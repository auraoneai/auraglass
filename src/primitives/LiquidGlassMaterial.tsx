"use client";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/utilsComprehensive";
import {
  LIQUID_GLASS,
  liquidGlassUtils,
  type GlassElevation,
  type GlassIntent,
  type LiquidGlassTokens,
  type LiquidGlassMaterial as MaterialType,
  type MaterialVariant,
  type SheenIntensity,
  type TintMode,
} from "../tokens/glass";
import {
  useContrastGuard,
  type BackdropSample,
  type ContrastAdjustment,
  type ContrastLevel,
} from "../utils/contrastGuard";
import {
  useLiquidGlassBackdrop,
  type LiquidGlassBackdropSample,
} from "../hooks/useLiquidGlassBackdrop";
import { useLiquidGlassEffectGroup } from "./LiquidGlassEffectGroup";
import {
  LiquidGlassSurfaceLayer,
  useLiquidGlassLayer,
} from "./LiquidGlassLayerProvider";

export interface LiquidGlassMaterialBackdropAnalysis
  extends BackdropSample,
    LiquidGlassBackdropSample {}

// Enhanced props interface for Liquid Glass Material
export interface LiquidGlassMaterialProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Material type - standard or liquid */
  material?: MaterialType;

  /** Material variant - regular or clear transparency */
  variant?: MaterialVariant;

  /** Glass semantic intent */
  intent?: GlassIntent;

  /** Glass elevation level */
  elevation?: GlassElevation;

  /** Index of refraction (1.0-2.0) - higher values = more refraction */
  ior?: number;

  /** Visual thickness for depth perception (0-8px) */
  thickness?: number;

  /** Edge sheen intensity (0-3) */
  sheen?: SheenIntensity;

  /** Content-aware tinting mode */
  tintMode?: TintMode;

  /** Enable environmental adaptation */
  adaptToContent?: boolean;

  /** Enable motion responsiveness */
  adaptToMotion?: boolean;

  /** Target accessibility contrast level */
  contrastLevel?: ContrastLevel;

  /** Performance optimization level */
  performanceLevel?: keyof LiquidGlassTokens["performance"];

  /** Enable refraction effects */
  enableRefraction?: boolean;

  /** Enable environmental reflections */
  enableReflection?: boolean;

  /** Enable parallax depth effects */
  enableParallax?: boolean;

  /** Enable micro-interactions */
  enableMicroInteractions?: boolean;

  /** Tint color for glass material */
  tint?: { r: number; g: number; b: number; a: number };

  /** Quality level for rendering */
  quality?: "high" | "ultra" | "balanced" | "efficient";

  /** Enable environmental adaptation */
  environmentAdaptation?: boolean;

  /** Enable motion responsiveness */
  motionResponsive?: boolean;

  /** Custom CSS classes */
  className?: string;

  /** Border radius preset */
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /** Enable hover effects */
  interactive?: boolean;

  /** Disable all effects */
  disabled?: boolean;

  /** Show development-only material diagnostics */
  showDebug?: boolean;

  /** Content to render inside the glass surface */
  children?: React.ReactNode;

  /** Callback when contrast adjustment occurs */
  onContrastAdjustment?: (adjustment: ContrastAdjustment) => void;

  /** Callback when backdrop analysis completes */
  onBackdropAnalysis?: (sample: LiquidGlassMaterialBackdropAnalysis) => void;
}

/**
 * LiquidGlassMaterial - Core primitive for Apple Liquid Glass parity
 *
 * Features:
 * - IOR-based refraction physics
 * - Environmental content awareness
 * - Motion-responsive effects
 * - Automatic contrast enforcement
 * - GPU-accelerated rendering with fallbacks
 * - Performance-optimized across devices
 */
export const LiquidGlassMaterial = forwardRef<
  HTMLDivElement,
  LiquidGlassMaterialProps
>(
  (
    {
      material = "liquid",
      variant = "regular",
      intent = "neutral",
      elevation = "level2",
      ior,
      thickness,
      sheen,
      tintMode = "adaptive",
      adaptToContent = true,
      adaptToMotion = true,
      contrastLevel = "AA",
      performanceLevel = "high",
      enableRefraction,
      enableReflection,
      enableParallax,
      enableMicroInteractions,
      tint,
      quality,
      environmentAdaptation,
      motionResponsive,
      className,
      radius = "lg",
      interactive = false,
      disabled = false,
      showDebug = false,
      children,
      onContrastAdjustment,
      onBackdropAnalysis,
      style,
      ...props
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });
    const [backdropSample, setBackdropSample] =
      useState<LiquidGlassMaterialBackdropAnalysis | null>(null);

    const prefersReducedMotion = useReducedMotion();
    const layer = useLiquidGlassLayer();
    const effectGroup = useLiquidGlassEffectGroup();
    const backdrop = useLiquidGlassBackdrop(elementRef, {
      enabled: adaptToContent && material === "liquid",
      variant,
      minContrastRatio: variant === "clear" ? 7 : 4.5,
      throttleMs: LIQUID_GLASS.tinting.adaptive.updateThrottle,
    });

    // Merge refs
    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (elementRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && "current" in ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );

    // Get performance settings
    const performanceConfig = useMemo(
      () => LIQUID_GLASS.performance[performanceLevel],
      [performanceLevel]
    );

    // Determine effective feature flags based on performance and props
    const effectiveFlags = useMemo(
      () => ({
        refraction:
          enableRefraction ??
          (performanceConfig.enableRefraction && material === "liquid"),
        reflection:
          enableReflection ??
          (performanceConfig.enableReflection && material === "liquid"),
        parallax:
          enableParallax ??
          (performanceConfig.enableParallax && material === "liquid"),
        microInteractions:
          enableMicroInteractions ??
          (performanceConfig.enableMicroInteractions && interactive),
      }),
      [
        enableRefraction,
        enableReflection,
        enableParallax,
        enableMicroInteractions,
        performanceConfig,
        material,
        interactive,
      ]
    );

    // Get material specification
    const materialSpec = useMemo(() => {
      const spec = liquidGlassUtils.getLiquidSurface(
        intent,
        elevation,
        material,
        variant
      );

      // Apply prop overrides
      if (ior !== undefined) spec.ior = ior;
      if (thickness !== undefined) spec.thickness = thickness;
      if (sheen !== undefined) spec.sheen = sheen;
      if (tintMode !== undefined) spec.tintMode = tintMode;

      return spec;
    }, [intent, elevation, material, variant, ior, thickness, sheen, tintMode]);

    // Use contrast guard for accessibility
    const contrastAdjustment = useContrastGuard(elementRef, {
      targetLevel: contrastLevel,
      material,
      variant,
      textColor: materialSpec.text.primary,
      onAdjustment: onContrastAdjustment,
    });

    // Device orientation tracking for motion effects
    useEffect(() => {
      if (
        !adaptToMotion ||
        prefersReducedMotion ||
        !effectiveFlags.microInteractions
      ) {
        return;
      }

      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta !== null && event.gamma !== null) {
          const { sensitivity } = LIQUID_GLASS.motionFluency.tilt;
          setDeviceTilt({
            x: Math.max(-1, Math.min(1, event.gamma * sensitivity)),
            y: Math.max(-1, Math.min(1, event.beta * sensitivity)),
          });
        }
      };

      if (typeof DeviceOrientationEvent !== "undefined") {
        window.addEventListener("deviceorientation", handleOrientation);
        return () =>
          window.removeEventListener("deviceorientation", handleOrientation);
      }
    }, [adaptToMotion, prefersReducedMotion, effectiveFlags.microInteractions]);

    // Backdrop sampling for environmental adaptation
    useEffect(() => {
      if (!adaptToContent || material !== "liquid") return;
      const legacySample: LiquidGlassMaterialBackdropAnalysis = {
        averageLuminance: backdrop.luminance,
        dominantHue: 0,
        contrast: backdrop.contrastHint === "mixed" ? 4.5 : 7,
        timestamp: Date.now(),
        confidence: backdrop.source === "fallback" ? 0.4 : 0.8,
        ...backdrop,
      };
      setBackdropSample(legacySample);
      onBackdropAnalysis?.(legacySample);
    }, [adaptToContent, backdrop, material, onBackdropAnalysis]);

    // Generate dynamic styles based on current state
    const dynamicStyles = useMemo(() => {
      const baseStyles = liquidGlassUtils.buildLiquidGlassStyles(
        intent,
        elevation,
        material,
        variant,
        performanceLevel
      );

      let styles: React.CSSProperties = { ...baseStyles };

      // Apply contrast adjustments
      if (contrastAdjustment?.modifications) {
        const { modifications } = contrastAdjustment;

        if (modifications.opacity !== undefined) {
          styles.opacity = modifications.opacity;
        }

        if (modifications.tint && materialSpec.tintMode === "adaptive") {
          styles.background = `${styles.background}, ${modifications.tint}`;
        }

        if (modifications.backdropBlur !== undefined) {
          const currentBlur = materialSpec.backdropBlur.px;
          const adjustedBlur = currentBlur * modifications.backdropBlur;
          const backdropFilter =
            typeof styles.backdropFilter === "string"
              ? styles.backdropFilter.replace(
                  /blur\([\d.]+px\)/,
                  `blur(${adjustedBlur}px)`
                )
              : undefined;
          styles.backdropFilter = backdropFilter;
          styles.WebkitBackdropFilter = backdropFilter;
        }
      }

      // Apply IOR-enhanced backdrop filter
      if (effectiveFlags.refraction && materialSpec.ior > 1) {
        const iorMultiplier = 1 + (materialSpec.ior - 1) * 0.3;
        const saturation = 1.8 * iorMultiplier;
        const brightness = 1.05 + (materialSpec.ior - 1) * 0.1;
        const contrast = 1.05 + materialSpec.sheen * 0.02;

        const backdropFilter = `blur(${materialSpec.backdropBlur.px}px) saturate(${saturation}) brightness(${brightness}) contrast(${contrast})`;
        styles.backdropFilter = backdropFilter;
        styles.WebkitBackdropFilter = backdropFilter;
      }

      // Apply thickness-based enhancements
      if (materialSpec.thickness > 2) {
        const thicknessOpacity = 0.12 + materialSpec.sheen * 0.06;
        styles.boxShadow = `${styles.boxShadow}, inset 0 1px ${materialSpec.thickness}px rgba(255,255,255,${thicknessOpacity})`;
      }

      if (material === "liquid" && materialSpec.tintMode === "adaptive") {
        const adaptiveTint = liquidGlassUtils.generateAdaptiveTint(
          backdrop.luminance,
          intent
        );
        styles.background = `${styles.background}, ${adaptiveTint}`;
      }

      if (
        material === "liquid" &&
        variant === "clear" &&
        backdrop.requiresDimming
      ) {
        styles.background = `${styles.background}, linear-gradient(rgba(0,0,0,var(--liquid-glass-clear-dimming-strength,0.22)), rgba(0,0,0,var(--liquid-glass-clear-dimming-strength,0.22)))`;
      }

      // Motion responsiveness
      if (effectiveFlags.microInteractions && !prefersReducedMotion) {
        const { hover, press } = LIQUID_GLASS.motionFluency;

        if (isHovered) {
          styles.transform =
            `${styles.transform || ""} translateY(-1px) scale(1.005)`.trim();
          styles.transition = `all ${hover.duration}ms ${hover.easing}`;
        }

        if (isPressed) {
          styles.transform =
            `${styles.transform || ""} translateY(1px) scale(0.998)`.trim();
          styles.transition = `all ${press.duration}ms ${press.easing}`;
        }

        // Device tilt responsiveness
        if (Math.abs(deviceTilt.x) > 0.1 || Math.abs(deviceTilt.y) > 0.1) {
          const tiltX = deviceTilt.x * LIQUID_GLASS.motionFluency.tilt.maxTilt;
          const tiltY = deviceTilt.y * LIQUID_GLASS.motionFluency.tilt.maxTilt;
          styles.transform =
            `${styles.transform || ""} rotateX(${tiltY}deg) rotateY(${tiltX}deg)`.trim();
        }
      }

      // Parallax depth effects
      if (effectiveFlags.parallax && materialSpec.thickness > 3) {
        styles.transformStyle = "preserve-3d";
        styles.transform =
          `${styles.transform || ""} translateZ(${materialSpec.thickness * 2}px)`.trim();
      }

      // Border radius — generous rounding is part of the liquid glass look
      const radiusMap = {
        none: "0px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        full: "9999px",
      };
      styles.borderRadius = radiusMap[radius];

      // Performance optimizations
      if (effectiveFlags.microInteractions || effectiveFlags.parallax) {
        styles.willChange = "transform, opacity, backdrop-filter";
        styles.contain = "layout style paint";
      }

      return styles;
    }, [
      intent,
      elevation,
      material,
      variant,
      performanceLevel,
      materialSpec,
      contrastAdjustment,
      effectiveFlags,
      isHovered,
      isPressed,
      deviceTilt,
      prefersReducedMotion,
      radius,
      backdrop,
    ]);

    // Event handlers for micro-interactions
    const handleMouseEnter = useCallback(() => {
      if (effectiveFlags.microInteractions && !disabled) {
        setIsHovered(true);
      }
    }, [effectiveFlags.microInteractions, disabled]);

    const handleMouseLeave = useCallback(() => {
      if (effectiveFlags.microInteractions) {
        setIsHovered(false);
      }
    }, [effectiveFlags.microInteractions]);

    const handleMouseDown = useCallback(() => {
      if (effectiveFlags.microInteractions && !disabled) {
        setIsPressed(true);
      }
    }, [effectiveFlags.microInteractions, disabled]);

    const handleMouseUp = useCallback(() => {
      if (effectiveFlags.microInteractions) {
        setIsPressed(false);
      }
    }, [effectiveFlags.microInteractions]);

    // Build CSS classes
    const classes = cn(
      // Base glass foundation
      "liquid-glass-material",
      "relative",
      "overflow-hidden",

      // Material type
      material === "liquid" && "liquid-glass-advanced",

      // Variant
      `liquid-glass-variant-${variant}`,

      // Intent
      intent !== "neutral" && `liquid-glass-${intent}`,

      // Interactive states
      interactive && "cursor-pointer",
      disabled && "pointer-events-none opacity-60",

      // Accessibility
      contrastAdjustment?.modifications.fallbackMode &&
        "liquid-glass-contrast-fallback",

      // Feature flags
      effectiveFlags.refraction && "liquid-glass-refraction",
      effectiveFlags.reflection && "liquid-glass-reflection",
      effectiveFlags.parallax && "liquid-glass-parallax",
      effectiveFlags.microInteractions && "liquid-glass-interactive",

      // Reduced motion
      prefersReducedMotion && "liquid-glass-reduced-motion",
      effectGroup && "liquid-glass-grouped-surface",
      layer.insideGlass && "liquid-glass-layered-surface",

      // Custom classes
      className
    );

    // Combine custom styles
    const combinedStyles = {
      ...dynamicStyles,
      ...style,
    };

    return (
      <LiquidGlassSurfaceLayer
        variant={variant}
        performanceLevel={performanceLevel}
      >
        <div
          ref={combinedRef}
          className={classes}
          style={{ ...combinedStyles }}
          onMouseEnter={interactive ? handleMouseEnter : undefined}
          onMouseLeave={interactive ? handleMouseLeave : undefined}
          onMouseDown={interactive ? handleMouseDown : undefined}
          onMouseUp={interactive ? handleMouseUp : undefined}
          aria-disabled={disabled || undefined}
          data-liquid-glass-material="true"
          data-liquid-glass-variant={variant}
          data-liquid-glass-group-id={effectGroup?.groupId}
          data-liquid-glass-sampling={
            effectGroup?.samplingStrategy ?? "isolated"
          }
          data-liquid-glass-requires-dimming={
            backdrop.requiresDimming ? "true" : "false"
          }
          data-liquid-glass-backdrop-source={backdrop.source}
          {...props}
        >
          {/* Edge sheen layer */}
          {materialSpec.sheen > 0 && (
            <div
              className="liquid-glass-sheen glass-absolute glass-inset-0 glass-pointer-events-none"
              style={{
                background: `radial-gradient(80% 70% at 50% -15%, rgba(255,255,255,${0.14 + materialSpec.sheen * 0.06}) 0%, transparent 65%)`,
                opacity: isHovered ? 1.2 : 1,
                transition: LIQUID_GLASS.motionFluency.hover.easing,
              }}
            />
          )}

          {/* Content layer with proper z-index */}
          <div className="liquid-glass-content glass-relative glass-z-10">
            {children}
          </div>

          {/* Opt-in diagnostics for primitive development. */}
          {showDebug && process.env.NODE_ENV === "development" && (
            <div className="liquid-glass-debug glass-absolute glass-top-0 glass-right-0 glass-text-xs glass-opacity-50 glass-pointer-events-none glass-surface-dark glass-text-primary glass-p-1 glass-radius">
              <div>Material: {material}</div>
              <div>Variant: {variant}</div>
              <div>IOR: {materialSpec.ior.toFixed(2)}</div>
              <div>Thickness: {materialSpec.thickness}px</div>
              <div>Sheen: {materialSpec.sheen}</div>
              {contrastAdjustment && (
                <div>
                  Contrast: {contrastAdjustment.adjustedContrast.toFixed(1)}:1
                </div>
              )}
            </div>
          )}
        </div>
      </LiquidGlassSurfaceLayer>
    );
  }
);

LiquidGlassMaterial.displayName = "LiquidGlassMaterial";

/**
 * Higher-order component for adding Liquid Glass material to existing components
 */
export function withLiquidGlass<P extends object>(
  Component: React.ComponentType<P>,
  defaultProps?: Partial<LiquidGlassMaterialProps>
) {
  const WrappedComponent = forwardRef<
    HTMLDivElement,
    P & LiquidGlassMaterialProps
  >((props, ref) => {
    const { children, ...materialProps } = props;

    return (
      <LiquidGlassMaterial ref={ref} {...defaultProps} {...materialProps}>
        <Component {...(props as P)}>{children}</Component>
      </LiquidGlassMaterial>
    );
  });

  WrappedComponent.displayName = `withLiquidGlass(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Utility hook for managing Liquid Glass state in custom components
 */
export function useLiquidGlassState(
  material: MaterialType = "liquid",
  options: {
    adaptToContent?: boolean;
    adaptToMotion?: boolean;
    performanceLevel?: keyof LiquidGlassTokens["performance"];
  } = {}
) {
  const {
    adaptToContent = true,
    adaptToMotion = true,
    performanceLevel = "high",
  } = options;
  const [backdropSample, setBackdropSample] =
    useState<LiquidGlassBackdropSample | null>(null);
  const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const performanceConfig = LIQUID_GLASS.performance[performanceLevel];

  return {
    backdropSample,
    deviceTilt,
    isInteracting,
    performanceConfig,
    prefersReducedMotion,
    setBackdropSample,
    setDeviceTilt,
    setIsInteracting,
  };
}

// Export types for external use
export type { MaterialType, MaterialVariant, SheenIntensity, TintMode };
