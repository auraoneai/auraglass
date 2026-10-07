"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

const MIN_GLASS_ALPHA = 0.08;
const MAX_GLASS_ALPHA = 0.35;

const CANONICAL_BLUR_LEVELS = [
  { blur: 16, elevation: "level1" },
  { blur: 24, elevation: "level2" },
  { blur: 32, elevation: "level3" },
  { blur: 40, elevation: "level4" },
  { blur: 48, elevation: "level5" },
] as const;

const clampGlassAlpha = (value: number): number =>
  Math.min(MAX_GLASS_ALPHA, Math.max(MIN_GLASS_ALPHA, value));

const getCanonicalBlurLevel = (requestedBlur: number) =>
  CANONICAL_BLUR_LEVELS.reduce((closest, candidate) =>
    Math.abs(candidate.blur - requestedBlur) <
    Math.abs(closest.blur - requestedBlur)
      ? candidate
      : closest
  );

/**
 * Builds a neutral white-channel liquid-glass material. Environmental and
 * content adaptation may change its density, but never its hue.
 */
const createNeutralGlassGradient = (requestedAlpha: number): string => {
  const base = clampGlassAlpha(requestedAlpha);
  const highlight = clampGlassAlpha(base + 0.04);
  const midpoint = clampGlassAlpha(base - 0.02);

  return `linear-gradient(135deg, rgba(255, 255, 255, ${highlight.toFixed(3)}) 0%, rgba(255, 255, 255, ${midpoint.toFixed(3)}) 50%, rgba(255, 255, 255, ${base.toFixed(3)}) 100%)`;
};

const getNeutralTintAlpha = (
  tintColor: string | undefined,
  fallbackIntensity: number
): number => {
  // A supplied tint can contribute density, but not chroma. This preserves
  // the API's intensity semantics without contaminating the glass material.
  const rgbaAlpha = tintColor?.match(
    /rgba?\([^)]*(?:,|\/)\s*([0-9]*\.?[0-9]+)\s*\)$/i
  )?.[1];
  const parsedAlpha = rgbaAlpha === undefined ? NaN : Number(rgbaAlpha);

  return clampGlassAlpha(
    Number.isFinite(parsedAlpha) ? parsedAlpha : fallbackIntensity
  );
};

const withNeutralMaterial = (
  style: React.CSSProperties,
  background: string
): React.CSSProperties => {
  // Canonical styles expose both a gradient and an optional flat overlay.
  // A dynamic material replaces the complete paint layer so React never has
  // to reconcile background shorthand against a stale backgroundColor.
  const {
    background: _background,
    backgroundColor: _backgroundColor,
    ...rest
  } = style;
  return { ...rest, background };
};

const mergeGlassAndConsumerStyle = (
  glassStyle: React.CSSProperties,
  consumerStyle: React.CSSProperties | undefined
): React.CSSProperties => {
  if (!consumerStyle) return glassStyle;
  const safeConsumerStyle = { ...consumerStyle };
  const protectedMaterialKeys: Array<keyof React.CSSProperties> = [
    "background",
    "backgroundColor",
    "backgroundImage",
    "backdropFilter",
    "WebkitBackdropFilter",
    "filter",
  ];
  for (const key of protectedMaterialKeys) delete safeConsumerStyle[key];

  // Consumers may size and position the surface, but its material paint and
  // optical filters remain canonical and neutral.
  return { ...glassStyle, ...safeConsumerStyle };
};

export interface GlassEngineConfig {
  opacity: {
    base: number;
    hover: number;
    active: number;
  };
  blur: {
    base: number;
    hover: number;
    active: number;
  };
  brightness: {
    base: number;
    hover: number;
    active: number;
  };
  tinting: {
    enabled: boolean;
    intensity: number;
    adaptiveColor: boolean;
  };
  texture: {
    type: "smooth" | "frosted" | "rippled" | "crystalline" | "liquid";
    intensity: number;
    animated: boolean;
  };
  environment: {
    weatherReactive: boolean;
    timeReactive: boolean;
    temperatureReactive: boolean;
  };
}

type GlassTextureType = GlassEngineConfig["texture"]["type"];

interface GlassEngineContextType {
  config: GlassEngineConfig;
  updateConfig: (newConfig: Partial<GlassEngineConfig>) => void;
  createGlassStyle: (
    variant?: string,
    customProps?: Partial<GlassEngineConfig>
  ) => React.CSSProperties;
  getTexturePattern: (type: string) => string;
  adaptToEnvironment: (conditions: EnvironmentalConditions) => void;
}

interface EnvironmentalConditions {
  weather: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy";
  temperature: number; // Celsius
  timeOfDay: number; // 0-23 hours
  humidity: number; // 0-100%
  season: "spring" | "summer" | "autumn" | "winter";
}

const defaultConfig: GlassEngineConfig = {
  opacity: { base: 0.1, hover: 0.15, active: 0.2 },
  blur: { base: 24, hover: 16, active: 16 },
  brightness: { base: 1, hover: 1.1, active: 1.2 },
  tinting: { enabled: true, intensity: 0.3, adaptiveColor: true },
  texture: { type: "smooth", intensity: 0.5, animated: false },
  environment: {
    weatherReactive: true,
    timeReactive: true,
    temperatureReactive: true,
  },
};

const GlassEngineContext = createContext<GlassEngineContextType | null>(null);

const defaultGlassEngineContext: GlassEngineContextType = {
  config: defaultConfig,
  updateConfig: () => {},
  createGlassStyle: (_variant, customProps) =>
    createGlassStyle({ intent: "neutral", elevation: "level2" }),
  getTexturePattern: () => "none",
  adaptToEnvironment: () => {},
};

export const useGlassEngine = () => {
  const context = useContext(GlassEngineContext);
  return context ?? defaultGlassEngineContext;
};

const generateTextureCSS = (type: string, intensity: number): string => {
  const normalizedIntensity = Math.min(1, Math.max(0, intensity));
  const subtle = clampGlassAlpha(0.08 + normalizedIntensity * 0.02);
  const sheen = clampGlassAlpha(0.1 + normalizedIntensity * 0.06);
  const clear = MIN_GLASS_ALPHA;

  // Legacy texture names remain API-compatible, but every pattern is a
  // restrained white-channel optical layer rather than matte frost or color.
  const patterns = {
    smooth: `linear-gradient(135deg, rgba(255,255,255,${sheen}), rgba(255,255,255,${clear}))`,
    frosted: `
      radial-gradient(ellipse at 20% 15%, rgba(255,255,255,${sheen}), rgba(255,255,255,${clear}) 58%),
      linear-gradient(135deg, rgba(255,255,255,${subtle}), rgba(255,255,255,${clear}))
    `,
    rippled: `
      radial-gradient(ellipse at 18% 12%, rgba(255,255,255,${sheen}), rgba(255,255,255,${clear}) 62%),
      radial-gradient(ellipse at 82% 88%, rgba(255,255,255,${subtle}), rgba(255,255,255,${clear}) 68%)
    `,
    crystalline: `
      conic-gradient(from 0deg at 50% 50%,
        rgba(255,255,255,${sheen}) 0deg,
        rgba(255,255,255,${clear}) 60deg,
        rgba(255,255,255,${subtle}) 120deg,
        rgba(255,255,255,${clear}) 180deg,
        rgba(255,255,255,${sheen}) 240deg,
        rgba(255,255,255,${clear}) 300deg
      )
    `,
    liquid: `
      radial-gradient(ellipse at top, rgba(255,255,255,${sheen}), rgba(255,255,255,${clear})),
      radial-gradient(ellipse at bottom, rgba(255,255,255,${subtle}), rgba(255,255,255,${clear}))
    `,
  };

  return patterns[type as keyof typeof patterns] || patterns.smooth;
};

export const GlassEngineProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: Partial<GlassEngineConfig>;
}> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<GlassEngineConfig>({
    ...defaultConfig,
    ...initialConfig,
  });

  const updateConfig = useCallback((newConfig: Partial<GlassEngineConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      opacity: { ...prev.opacity, ...(newConfig.opacity || {}) },
      blur: { ...prev.blur, ...(newConfig.blur || {}) },
      brightness: { ...prev.brightness, ...(newConfig.brightness || {}) },
      tinting: { ...prev.tinting, ...(newConfig.tinting || {}) },
      texture: { ...prev.texture, ...(newConfig.texture || {}) },
      environment: { ...prev.environment, ...(newConfig.environment || {}) },
    }));
  }, []);

  const buildGlassEngineStyle = useCallback(
    (
      variant: string = "base",
      customProps?: Partial<GlassEngineConfig>
    ): React.CSSProperties => {
      const effectiveConfig = customProps
        ? { ...config, ...customProps }
        : config;
      const { opacity, blur, brightness, texture } = effectiveConfig;

      const opacityValue =
        opacity[variant as keyof typeof opacity] || opacity.base;
      const blurValue = blur[variant as keyof typeof blur] || blur.base;
      const brightnessValue =
        brightness[variant as keyof typeof brightness] || brightness.base;

      const canonicalLevel = getCanonicalBlurLevel(blurValue);
      const materialAlpha = clampGlassAlpha(
        opacityValue * Math.min(1.2, Math.max(1, brightnessValue))
      );

      return withNeutralMaterial(
        createGlassStyle({
          intent: "neutral",
          elevation: canonicalLevel.elevation,
        }),
        `${generateTextureCSS(texture.type, texture.intensity)}, ${createNeutralGlassGradient(materialAlpha)}`
      );
    },
    [config]
  );

  const getTexturePattern = useCallback(
    (type: string): string => {
      return generateTextureCSS(type, config.texture.intensity);
    },
    [config.texture.intensity]
  );

  const adaptToEnvironment = useCallback(
    (conditions: EnvironmentalConditions) => {
      // Use functional update to avoid closing over `config` and to keep
      // this callback stable. Also avoid mutating nested state.
      setConfig((prev) => {
        // If none of the environment reactions are enabled, no change.
        if (
          !prev.environment.weatherReactive &&
          !prev.environment.timeReactive &&
          !prev.environment.temperatureReactive
        ) {
          return prev;
        }

        // Start from clones of nested objects to avoid mutating previous state.
        let next: GlassEngineConfig = {
          ...prev,
          opacity: { ...prev.opacity },
          blur: { ...prev.blur },
          brightness: { ...prev.brightness },
          texture: { ...prev.texture },
        };

        // Weather adaptations
        if (prev.environment.weatherReactive) {
          switch (conditions.weather) {
            case "rainy":
              next.texture = {
                ...next.texture,
                type: "rippled",
                animated: true,
              };
              next.opacity.base = Math.min(0.25, next.opacity.base + 0.05);
              next.blur.base = getCanonicalBlurLevel(next.blur.base - 8).blur;
              break;
            case "foggy":
              next.opacity.base = Math.max(0.05, next.opacity.base - 0.03);
              next.blur.base = getCanonicalBlurLevel(next.blur.base + 8).blur;
              break;
            case "snowy":
              next.texture = { ...next.texture, type: "crystalline" };
              next.brightness.base = Math.min(1.3, next.brightness.base + 0.1);
              break;
            case "sunny":
              next.brightness.base = Math.min(1.4, next.brightness.base + 0.15);
              next.opacity.base = Math.min(0.18, next.opacity.base + 0.02);
              break;
          }
        }

        // Time adaptations
        if (prev.environment.timeReactive) {
          const hour = conditions.timeOfDay;
          if (hour >= 20 || hour <= 6) {
            // Night time - more subtle effects
            next.opacity.base = Math.max(0.05, next.opacity.base - 0.02);
            next.blur.base = getCanonicalBlurLevel(next.blur.base + 8).blur;
          } else if (hour >= 12 && hour <= 16) {
            // Midday - stronger effects
            next.brightness.base = Math.min(1.2, next.brightness.base + 0.05);
          }
        }

        // Temperature adaptations
        if (prev.environment.temperatureReactive) {
          if (conditions.temperature < 0) {
            next.texture = { ...next.texture, type: "frosted" };
          } else if (conditions.temperature > 30) {
            next.texture = { ...next.texture, type: "liquid", animated: true };
          }
        }

        return next;
      });
    },
    []
  );

  const contextValue: GlassEngineContextType = {
    config,
    updateConfig,
    createGlassStyle: buildGlassEngineStyle,
    getTexturePattern,
    adaptToEnvironment,
  };

  return (
    <GlassEngineContext.Provider value={contextValue}>
      {children}
    </GlassEngineContext.Provider>
  );
};

type AdaptiveGlassHtmlProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDragExit"
  | "onDrop"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

interface AdaptiveGlassProps extends AdaptiveGlassHtmlProps {
  children: React.ReactNode;
  variant?: "base" | "hover" | "active";
  textureOverride?: GlassTextureType;
  environmentalAware?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const AdaptiveGlass: React.FC<AdaptiveGlassProps> = ({
  children,
  variant = "base",
  textureOverride,
  environmentalAware = true,
  className = "",
  as: Component = "div",
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { createGlassStyle, config, adaptToEnvironment } = useGlassEngine();
  const [currentVariant, setCurrentVariant] = useState(variant);
  const consumerStyle = props.style;
  const forwardedProps = { ...props };
  delete forwardedProps.style;

  const glassStyle = useMemo(() => {
    const customConfig = textureOverride
      ? {
          texture: { ...config.texture, type: textureOverride },
        }
      : undefined;

    return createGlassStyle(currentVariant, customConfig);
  }, [createGlassStyle, currentVariant, textureOverride, config.texture]);

  // Simulate environmental conditions (in real app, would come from APIs)
  useEffect(() => {
    if (environmentalAware) {
      const mockConditions: EnvironmentalConditions = {
        weather: "sunny",
        temperature: 20,
        timeOfDay: new Date().getHours(),
        humidity: 60,
        season: "spring",
      };

      adaptToEnvironment(mockConditions);
    }
  }, [environmentalAware, adaptToEnvironment]);

  return (
    <motion.div
      className={cn("relative glass-surface", className)}
      style={mergeGlassAndConsumerStyle(glassStyle, consumerStyle)}
      onMouseEnter={() => setCurrentVariant("hover")}
      onMouseLeave={() => setCurrentVariant(variant)}
      onMouseDown={() => setCurrentVariant("active")}
      onMouseUp={() => setCurrentVariant("hover")}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: ANIMATION.DURATION.fast / 1000 }
      }
      {...forwardedProps}
    >
      {children}
    </motion.div>
  );
};

export const GlassOpacityEngine: React.FC<{
  children: React.ReactNode;
  dynamicOpacity?: boolean;
  opacityRange?: [number, number];
  trigger?: "hover" | "scroll" | "time" | "content";
  className?: string;
}> = ({
  children,
  dynamicOpacity = true,
  opacityRange = [0.05, 0.3],
  trigger = "hover",
  className = "",
}) => {
  const { createGlassStyle } = useGlassEngine();
  const [opacity, setOpacity] = useState(opacityRange[0]);

  useEffect(() => {
    if (!dynamicOpacity) return;

    let interval: NodeJS.Timeout | undefined;

    switch (trigger) {
      case "time":
        interval = setInterval(() => {
          const hour = new Date().getHours();
          const timeOpacity =
            0.1 + (Math.sin((hour / 24) * Math.PI * 2) + 1) * 0.1;
          setOpacity(
            Math.max(opacityRange[0], Math.min(opacityRange[1], timeOpacity))
          );
        }, ANIMATION.DURATION.slower * 85);
        break;
      case "scroll":
        const handleScroll = () => {
          const scrollableHeight = Math.max(
            1,
            document.body.scrollHeight - window.innerHeight
          );
          const scrollProgress = Math.min(
            1,
            Math.max(0, window.scrollY / scrollableHeight)
          );
          const scrollOpacity =
            opacityRange[0] +
            scrollProgress * (opacityRange[1] - opacityRange[0]);
          setOpacity(scrollOpacity);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dynamicOpacity, trigger, opacityRange]);

  return (
    <motion.div
      className={cn("glass-surface", className)}
      style={withNeutralMaterial(
        createGlassStyle("base"),
        createNeutralGlassGradient(opacity)
      )}
      onMouseEnter={
        trigger === "hover" ? () => setOpacity(opacityRange[1]) : undefined
      }
      onMouseLeave={
        trigger === "hover" ? () => setOpacity(opacityRange[0]) : undefined
      }
    >
      {children}
    </motion.div>
  );
};

export const GlassColorTinting: React.FC<{
  children: React.ReactNode;
  contentAware?: boolean;
  tintColor?: string;
  intensity?: number;
  className?: string;
}> = ({
  children,
  contentAware = true,
  tintColor,
  intensity = 0.3,
  className = "",
}) => {
  const { createGlassStyle } = useGlassEngine();
  const [materialAlpha, setMaterialAlpha] = useState(() =>
    getNeutralTintAlpha(tintColor, intensity)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const analyzeContent = useCallback(() => {
    const baseAlpha = getNeutralTintAlpha(tintColor, intensity);
    if (!contentAware || !containerRef.current) {
      setMaterialAlpha(baseAlpha);
      return;
    }

    // Content density increases neutral refraction slightly. Chroma from
    // images is intentionally never sampled into the material surface.
    const images = containerRef.current.querySelectorAll("img");
    setMaterialAlpha(baseAlpha + Math.min(images.length, 3) * 0.02);
  }, [contentAware, intensity, tintColor]);

  useEffect(() => {
    analyzeContent();
  }, [analyzeContent]);

  const tintedStyle = useMemo(
    () =>
      withNeutralMaterial(
        createGlassStyle("base"),
        createNeutralGlassGradient(materialAlpha)
      ),
    [createGlassStyle, materialAlpha]
  );

  return (
    <div
      ref={containerRef}
      className={cn("glass-surface", className)}
      style={{ ...tintedStyle }}
    >
      {children}
    </div>
  );
};

export const GlassTextureVariations: React.FC<{
  children: React.ReactNode;
  contentType?: "text" | "image" | "video" | "code" | "data";
  autoAdapt?: boolean;
  className?: string;
}> = ({ children, contentType = "text", autoAdapt = true, className = "" }) => {
  const { config, createGlassStyle, updateConfig } = useGlassEngine();
  const [currentTexture, setCurrentTexture] =
    useState<GlassTextureType>("smooth");

  useEffect(() => {
    if (!autoAdapt) return;

    const textureMap = {
      text: "smooth",
      image: "crystalline",
      video: "liquid",
      code: "frosted",
      data: "rippled",
    } satisfies Record<
      NonNullable<Parameters<typeof GlassTextureVariations>[0]["contentType"]>,
      GlassTextureType
    >;

    const newTexture = textureMap[contentType];
    setCurrentTexture(newTexture);

    updateConfig({
      texture: {
        type: newTexture,
        intensity: 0.6,
        animated: contentType === "video",
      },
    });
  }, [contentType, autoAdapt, updateConfig]);

  return (
    <div
      className={cn("glass-surface", className)}
      style={{
        ...createGlassStyle("base", {
          texture: { ...config.texture, type: currentTexture },
        }),
      }}
    >
      {children}
    </div>
  );
};

export const EnvironmentalGlass: React.FC<{
  children: React.ReactNode;
  weatherAPI?: boolean;
  timeSync?: boolean;
  className?: string;
}> = ({ children, weatherAPI = false, timeSync = true, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const { adaptToEnvironment, createGlassStyle } = useGlassEngine();
  const [conditions, setConditions] = useState<EnvironmentalConditions>({
    weather: "sunny",
    temperature: 20,
    timeOfDay: timeSync ? new Date().getHours() : 12,
    humidity: 50,
    season: "spring",
  });

  useEffect(() => {
    if (timeSync) {
      const updateTime = () => {
        setConditions((prev) => ({
          ...prev,
          timeOfDay: new Date().getHours(),
        }));
      };

      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [timeSync]);

  useEffect(() => {
    if (weatherAPI) {
      // Simulate weather API call
      const mockWeatherConditions = {
        ...conditions,
        weather: (["sunny", "cloudy", "rainy"] as const)[
          Math.floor(Math.random() * 3)
        ],
        temperature: Math.random() * 30 + 5,
        humidity: Math.random() * 80 + 20,
      };

      setConditions(mockWeatherConditions);
    }
  }, [weatherAPI]);

  useEffect(() => {
    adaptToEnvironment(conditions);
  }, [conditions, adaptToEnvironment]);

  return (
    <motion.div
      className={cn("glass-surface", className)}
      style={{ ...createGlassStyle("base") }}
      animate={{
        // Preserve a restrained, neutral time-of-day response without
        // rotating the surface hue or tinting the material/content.
        filter: `brightness(${1 + (conditions.timeOfDay > 12 ? (24 - conditions.timeOfDay) / 24 : conditions.timeOfDay / 24) * 0.12})`,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: ANIMATION.DURATION.slower / 1000 }
      }
    >
      {children}
    </motion.div>
  );
};

export const GlassEngineDemo: React.FC = () => {
  const { config, updateConfig, createGlassStyle } = useGlassEngine();

  return (
    <div className="glass-space-y-6 glass-p-6">
      <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4">
        {/* Different texture types */}
        {(["smooth", "frosted", "rippled", "crystalline"] as const).map(
          (texture) => (
            <AdaptiveGlass
              key={texture}
              textureOverride={texture}
              className="glass-min-w-0 glass-p-3 sm:glass-p-4 glass-text-center glass-overflow-hidden"
            >
              <ContrastGuard>
                <h3
                  className={cn(
                    "glass-text-primary glass-font-medium glass-capitalize glass-mb-2 glass-text-sm sm:glass-text-base glass-break-words"
                  )}
                >
                  {texture}
                </h3>
                <p className={cn("glass-text-secondary glass-text-sm")}>
                  Glass texture variation
                </p>
              </ContrastGuard>
            </AdaptiveGlass>
          )
        )}
      </div>

      <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-4">
        {/* Opacity Engine */}
        <GlassOpacityEngine
          trigger="hover"
          className="glass-p-4"
          aria-label="Dynamic opacity demonstration"
        >
          <ContrastGuard>
            <h3
              className={cn("glass-text-primary glass-font-medium glass-mb-2")}
            >
              Dynamic Opacity
            </h3>
            <p className={cn("glass-text-secondary glass-text-sm")}>
              Hover to see opacity change
            </p>
          </ContrastGuard>
        </GlassOpacityEngine>

        {/* Color Tinting */}
        <GlassColorTinting
          contentAware
          className="glass-p-4"
          aria-label="Content-aware tinting demonstration"
        >
          <ContrastGuard>
            <h3
              className={cn("glass-text-primary glass-font-medium glass-mb-2")}
            >
              Content-Aware Tinting
            </h3>
            <p className={cn("glass-text-secondary glass-text-sm")}>
              Adapts to content colors
            </p>
          </ContrastGuard>
        </GlassColorTinting>

        {/* Environmental */}
        <EnvironmentalGlass
          timeSync
          className="glass-p-4"
          aria-label="Environmental adaptation demonstration"
        >
          <ContrastGuard>
            <h3
              className={cn("glass-text-primary glass-font-medium glass-mb-2")}
            >
              Environmental
            </h3>
            <p className={cn("glass-text-secondary glass-text-sm")}>
              Reacts to time and weather
            </p>
          </ContrastGuard>
        </EnvironmentalGlass>
      </div>

      {/* Controls */}
      <div
        className="glass-surface glass-p-4"
        style={{ ...createGlassStyle("base") }}
        role="region"
        aria-label="Glass engine controls"
      >
        <ContrastGuard>
          <h3 className={cn("glass-text-primary glass-font-medium glass-mb-4")}>
            Glass Engine Controls
          </h3>
        </ContrastGuard>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4">
          <div>
            <label
              htmlFor="base-opacity-slider"
              className={cn(
                "glass-display-block glass-text-secondary glass-text-sm glass-mb-2"
              )}
            >
              <ContrastGuard>Base Opacity</ContrastGuard>
            </label>
            <input
              id="base-opacity-slider"
              type="range"
              min="0.05"
              max="0.3"
              step="0.01"
              value={config.opacity.base}
              onChange={(e) =>
                updateConfig({
                  opacity: {
                    ...config.opacity,
                    base: parseFloat(e.target.value),
                  },
                })
              }
              className="glass-w-full glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Base opacity slider"
              aria-valuemin={0.05}
              aria-valuemax={0.3}
              aria-valuenow={config.opacity.base}
            />
          </div>

          <div>
            <label
              htmlFor="blur-intensity-slider"
              className={cn(
                "glass-display-block glass-text-secondary glass-text-sm glass-mb-2"
              )}
            >
              <ContrastGuard>Blur Intensity</ContrastGuard>
            </label>
            <input
              id="blur-intensity-slider"
              type="range"
              min="16"
              max="48"
              step="8"
              value={config.blur.base}
              onChange={(e) =>
                updateConfig({
                  blur: {
                    ...config.blur,
                    base: getCanonicalBlurLevel(
                      Number.parseInt(e.target.value, 10)
                    ).blur,
                  },
                })
              }
              className="glass-w-full glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Blur intensity slider"
              aria-valuemin={16}
              aria-valuemax={48}
              aria-valuenow={config.blur.base}
            />
          </div>
        </div>

        <div className="glass-flex glass-items-center glass-justify-between glass-mt-4">
          <ContrastGuard>
            <span className={cn("glass-text-secondary")}>
              Environmental Reactions
            </span>
          </ContrastGuard>
          <label className="glass-flex glass-items-center glass-space-x-2">
            <input
              type="checkbox"
              checked={config.environment.weatherReactive}
              onChange={(e) =>
                updateConfig({
                  environment: {
                    ...config.environment,
                    weatherReactive: e.target.checked,
                  },
                })
              }
              className="glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Enable weather reactive effects"
            />
            <ContrastGuard>
              <span className={cn("glass-text-primary glass-text-sm")}>
                Weather
              </span>
            </ContrastGuard>
          </label>
        </div>
      </div>
    </div>
  );
};

export interface GlassEngineProps extends React.HTMLAttributes<HTMLDivElement> {
  initialConfig?: Partial<GlassEngineConfig>;
  renderDemo?: boolean;
  children?: React.ReactNode;
}

export const GlassEngine: React.FC<GlassEngineProps> = ({
  initialConfig,
  renderDemo = true,
  children,
  className,
  ...rest
}) => {
  return (
    <GlassEngineProvider initialConfig={initialConfig}>
      <div
        className={cn("glass-engine-wrapper glass-space-y-6", className)}
        role="main"
        aria-label="Glass engine"
        {...rest}
      >
        {children ?? (renderDemo ? <GlassEngineDemo /> : null)}
      </div>
    </GlassEngineProvider>
  );
};

export default GlassEngine;
