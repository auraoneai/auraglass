'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
  blur: { base: 20, hover: 15, active: 10 },
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

export const useGlassEngine = () => {
  const prefersReducedMotion = useReducedMotion();
  const context = useContext(GlassEngineContext);
  if (!context) {
    throw new Error("useGlassEngine must be used within GlassEngineProvider");
  }
  return context;
};

const generateTextureCSS = (type: string, intensity: number): string => {
  const patterns = {
    smooth: `linear-gradient(135deg, rgba(255,255,255,${0.1 * intensity}), transparent)`,
    frosted: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,${0.15 * intensity}) 1px, transparent 1px),
      radial-gradient(circle at 70% 80%, rgba(255,255,255,${0.1 * intensity}) 1px, transparent 1px),
      linear-gradient(135deg, rgba(255,255,255,${0.05 * intensity}), transparent)
    `,
    rippled: `
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,${0.08 * intensity}),
        rgba(255,255,255,${0.08 * intensity}) 2px,
        transparent 2px,
        transparent 8px
      )
    `,
    crystalline: `
      conic-gradient(from 0deg at 50% 50%,
        rgba(255,255,255,${0.2 * intensity}) 0deg,
        transparent 60deg,
        rgba(255,255,255,${0.1 * intensity}) 120deg,
        transparent 180deg,
        rgba(255,255,255,${0.15 * intensity}) 240deg,
        transparent 300deg
      )
    `,
    liquid: `
      radial-gradient(ellipse at top, rgba(255,255,255,${0.12 * intensity}), transparent),
      radial-gradient(ellipse at bottom, rgba(255,255,255,${0.08 * intensity}), transparent)
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
    setConfig((prev: any) => ({
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

      return createGlassStyle({ intent: "neutral", elevation: "level2" });
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
      setConfig((prev: any) => {
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
              next.blur.base = Math.max(10, next.blur.base - 5);
              break;
            case "foggy":
              next.opacity.base = Math.max(0.05, next.opacity.base - 0.03);
              next.blur.base = Math.min(30, next.blur.base + 8);
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
            next.blur.base = Math.min(25, next.blur.base + 3);
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

interface AdaptiveGlassProps {
  children: React.ReactNode;
  variant?: "base" | "hover" | "active";
  textureOverride?: string;
  environmentalAware?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
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

  const glassStyle = useMemo(() => {
    const customConfig = textureOverride
      ? {
          texture: { ...config.texture, type: textureOverride as any },
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
      className={`relative ${className}`}
      style={glassStyle}
      onMouseEnter={() => setCurrentVariant("hover")}
      onMouseLeave={() => setCurrentVariant(variant)}
      onMouseDown={() => setCurrentVariant("active")}
      onMouseUp={() => setCurrentVariant("hover")}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
      {...props}
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
  const { createGlassStyle, updateConfig } = useGlassEngine();
  const [opacity, setOpacity] = useState(opacityRange[0]);
  const scrollY = useMotionValue(0);
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });

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
        }, 60000);
        break;
      case "scroll":
        const handleScroll = () => {
          const scrollProgress =
            window.scrollY / (document.body.scrollHeight - window.innerHeight);
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
      className={className}
      style={{
        ...createGlassStyle("base"),
        backgroundColor: `rgba(255, 255, 255, ${springOpacity})`,
      }}
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
  const [adaptiveTint, setAdaptiveTint] = useState(
    tintColor || "var(--glass-bg-default)"
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const analyzeContent = useCallback(() => {
    if (!contentAware || !containerRef.current) return;

    // Simple content analysis - in production, would be more sophisticated
    const images = containerRef.current.querySelectorAll("img");
    if (images.length > 0) {
      // Simulate extracting dominant color from first image
      const colors = [
        "var(--glass-color-primary)",
        "var(--glass-color-danger)",
        "var(--glass-color-success)",
        "var(--glass-color-warning)",
        "#8b5cf6",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const r = parseInt(randomColor.slice(1, 3), 16);
      const g = parseInt(randomColor.slice(3, 5), 16);
      const b = parseInt(randomColor.slice(5, 7), 16);

      setAdaptiveTint(`rgba(${r}, ${g}, ${b}, ${intensity})`);
    }
  }, [contentAware, intensity]);

  useEffect(() => {
    if (contentAware) {
      analyzeContent();
    }
  }, [analyzeContent, contentAware]);

  const tintedStyle = useMemo(
    () => ({
      ...createGlassStyle("base"),
      backgroundColor: adaptiveTint,
    }),
    [createGlassStyle, adaptiveTint]
  );

  return (
    <div ref={containerRef} className={className} style={tintedStyle}>
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
  const { createGlassStyle, updateConfig } = useGlassEngine();
  const [currentTexture, setCurrentTexture] = useState<string>("smooth");

  useEffect(() => {
    if (!autoAdapt) return;

    const textureMap = {
      text: "smooth",
      image: "crystalline",
      video: "liquid",
      code: "frosted",
      data: "rippled",
    };

    const newTexture = textureMap[contentType];
    setCurrentTexture(newTexture);

    updateConfig({
      texture: {
        type: newTexture as any,
        intensity: 0.6,
        animated: contentType === "video",
      },
    });
  }, [contentType, autoAdapt, updateConfig]);

  return (
    <div className={className} style={createGlassStyle("base")}>
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
    timeOfDay: new Date().getHours(),
    humidity: 50,
    season: "spring",
  });

  useEffect(() => {
    if (timeSync) {
      const updateTime = () => {
        setConditions((prev: any) => ({
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
      className={className}
      style={createGlassStyle("base")}
      animate={{
        filter: `hue-rotate(${conditions.timeOfDay * 15}deg) brightness(${1 + (conditions.timeOfDay > 12 ? (24 - conditions.timeOfDay) / 24 : conditions.timeOfDay / 24) * 0.2})`,
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 2 }}
    >
      {children}
    </motion.div>
  );
};

export const GlassEngineDemo: React.FC = () => {
  const { config, updateConfig, createGlassStyle } = useGlassEngine();

  return (
    <div className="space-y-6 glass-p-6">
      <div className="glass-grid glass-grid-cols-2 md:grid-cols-4 glass-gap-4">
        {/* Different texture types */}
        {(["smooth", "frosted", "rippled", "crystalline"] as const).map(
          (texture) => (
            <AdaptiveGlass
              key={texture}
              textureOverride={texture}
              className="glass-p-4 text-center"
            >
              <h3
                className={cn(
                  "glass-text-primary glass-font-medium glass-capitalize glass-mb-2"
                )}
              >
                {texture}
              </h3>
              <p className={cn("glass-text-secondary glass-text-sm")}>
                Glass texture variation
              </p>
            </AdaptiveGlass>
          )
        )}
      </div>

      <div className="glass-grid glass-grid-cols-1 md:grid-cols-3 glass-gap-4">
        {/* Opacity Engine */}
        <GlassOpacityEngine trigger="hover" className="glass-p-4">
          <h3 className={cn("glass-text-primary glass-font-medium glass-mb-2")}>
            Dynamic Opacity
          </h3>
          <p className={cn("glass-text-secondary glass-text-sm")}>
            Hover to see opacity change
          </p>
        </GlassOpacityEngine>

        {/* Color Tinting */}
        <GlassColorTinting contentAware className="glass-p-4">
          <h3 className={cn("glass-text-primary glass-font-medium glass-mb-2")}>
            Content-Aware Tinting
          </h3>
          <p className={cn("glass-text-secondary glass-text-sm")}>
            Adapts to content colors
          </p>
        </GlassColorTinting>

        {/* Environmental */}
        <EnvironmentalGlass timeSync className="glass-p-4">
          <h3 className={cn("glass-text-primary glass-font-medium glass-mb-2")}>
            Environmental
          </h3>
          <p className={cn("glass-text-secondary glass-text-sm")}>
            Reacts to time and weather
          </p>
        </EnvironmentalGlass>
      </div>

      {/* Controls */}
      <div className="glass-p-4" style={createGlassStyle("base")}>
        <h3 className={cn("glass-text-primary glass-font-medium glass-mb-4")}>
          Glass Engine Controls
        </h3>

        <div className="glass-grid glass-grid-cols-1 md:grid-cols-2 glass-gap-4">
          <div>
            <label
              className={cn(
                "glass-display-block glass-text-secondary glass-text-sm glass-mb-2"
              )}
            >
              Base Opacity
            </label>
            <input
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
            />
          </div>

          <div>
            <label
              className={cn(
                "glass-display-block glass-text-secondary glass-text-sm glass-mb-2"
              )}
            >
              Blur Intensity
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={config.blur.base}
              onChange={(e) =>
                updateConfig({
                  blur: { ...config.blur, base: parseInt(e.target.value) },
                })
              }
              className="glass-w-full glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>
        </div>

        <div className="glass-flex glass-items-center glass-justify-between mt-4">
          <span className={cn("glass-text-secondary")}>
            Environmental Reactions
          </span>
          <label className="glass-flex glass-items-center space-x-2">
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
            />
            <span className={cn("glass-text-primary glass-text-sm")}>
              Weather
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};