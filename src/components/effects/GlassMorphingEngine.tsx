/**
 * Dynamic Glass Morphing Engine
 * Real-time glass effects that adapt to environment, time, weather, and user activity
 */

import { motion, useAnimation, useSpring } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';
import './glass-morphing.css';

// Environmental adaptation types
type EnvironmentalContext = {
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  temperature: number; // Celsius
  humidity: number; // 0-100%
  lightLevel: number; // 0-100%
};

type UserActivity = 'focused' | 'browsing' | 'searching' | 'creating' | 'analyzing' | 'idle';
type ContentType = 'text' | 'data' | 'media' | 'interactive' | 'dashboard' | 'form';

interface GlassProperties {
  opacity: number;
  blur: number;
  refraction: number;
  reflection: number;
  chromatic: number;
  caustic: number;
  temperature: number; // Visual temperature effect
  viscosity: number; // Fluid-like behavior
  crystalline: number; // Crystal formation effect
  iridescence: number; // Color-shifting effect
}

interface GlassMorphingEngineProps {
  children: React.ReactNode;
  className?: string;
  environmentalContext?: Partial<EnvironmentalContext>;
  userActivity?: UserActivity;
  contentType?: ContentType;
  intensity?: number;
  adaptationSpeed?: number;
  enableRealTimeAdaptation?: boolean;
  onMorphingChange?: (properties: GlassProperties) => void;
}

// Environmental glass property mappings
const ENVIRONMENTAL_GLASS_CONFIGS: Record<string, Partial<GlassProperties>> = {
  // Time of day variations
  'timeOfDay-dawn': {
    opacity: 0.85,
    blur: 8,
    temperature: 0.3,
    iridescence: 0.7,
    chromatic: 0.4,
  },
  'timeOfDay-morning': {
    opacity: 0.9,
    blur: 6,
    temperature: 0.1,
    reflection: 0.8,
    chromatic: 0.2,
  },
  'timeOfDay-afternoon': {
    opacity: 0.75,
    blur: 4,
    temperature: -0.1,
    caustic: 0.6,
    chromatic: 0.1,
  },
  'timeOfDay-evening': {
    opacity: 0.8,
    blur: 10,
    temperature: 0.4,
    iridescence: 0.9,
    chromatic: 0.5,
  },
  'timeOfDay-night': {
    opacity: 0.95,
    blur: 12,
    temperature: 0.6,
    crystalline: 0.3,
    chromatic: 0.7,
  },

  // Weather variations
  'weather-sunny': {
    caustic: 0.8,
    reflection: 0.9,
    chromatic: 0.3,
    iridescence: 0.4,
  },
  'weather-cloudy': {
    opacity: 0.9,
    blur: 8,
    refraction: 0.6,
    chromatic: 0.2,
  },
  'weather-rainy': {
    viscosity: 0.7,
    blur: 15,
    caustic: 0.9,
    chromatic: 0.6,
  },
  'weather-stormy': {
    opacity: 0.7,
    blur: 20,
    viscosity: 0.9,
    crystalline: 0.1,
  },
  'weather-snowy': {
    crystalline: 0.8,
    opacity: 0.95,
    blur: 6,
    temperature: 1.0,
  },
  'weather-foggy': {
    blur: 25,
    opacity: 0.6,
    viscosity: 0.4,
    chromatic: 0.1,
  },

  // Seasonal variations
  'season-spring': {
    iridescence: 0.6,
    chromatic: 0.4,
    temperature: 0.2,
    viscosity: 0.3,
  },
  'season-summer': {
    caustic: 0.7,
    reflection: 0.8,
    temperature: -0.2,
    chromatic: 0.2,
  },
  'season-autumn': {
    temperature: 0.3,
    iridescence: 0.8,
    chromatic: 0.5,
    crystalline: 0.2,
  },
  'season-winter': {
    crystalline: 0.9,
    temperature: 0.8,
    opacity: 0.9,
    chromatic: 0.3,
  },

  // User activity adaptations
  'activity-focused': {
    opacity: 0.85,
    blur: 4,
    refraction: 0.3,
    chromatic: 0.1,
  },
  'activity-browsing': {
    opacity: 0.8,
    blur: 6,
    iridescence: 0.4,
    chromatic: 0.3,
  },
  'activity-searching': {
    blur: 8,
    caustic: 0.5,
    chromatic: 0.4,
    viscosity: 0.3,
  },
  'activity-creating': {
    iridescence: 0.7,
    chromatic: 0.6,
    caustic: 0.4,
    temperature: 0.2,
  },
  'activity-analyzing': {
    crystalline: 0.5,
    reflection: 0.7,
    chromatic: 0.2,
    opacity: 0.9,
  },
  'activity-idle': {
    blur: 12,
    viscosity: 0.6,
    iridescence: 0.8,
    chromatic: 0.5,
  },

  // Content type adaptations
  'content-text': {
    opacity: 0.9,
    blur: 3,
    chromatic: 0.1,
    reflection: 0.4,
  },
  'content-data': {
    crystalline: 0.6,
    reflection: 0.8,
    chromatic: 0.2,
    opacity: 0.85,
  },
  'content-media': {
    caustic: 0.7,
    iridescence: 0.6,
    chromatic: 0.5,
    refraction: 0.7,
  },
  'content-interactive': {
    viscosity: 0.4,
    caustic: 0.5,
    iridescence: 0.5,
    chromatic: 0.4,
  },
  'content-dashboard': {
    opacity: 0.8,
    blur: 5,
    crystalline: 0.4,
    reflection: 0.6,
  },
  'content-form': {
    opacity: 0.9,
    blur: 4,
    chromatic: 0.1,
    viscosity: 0.2,
  },
};

const defaultGlassProperties: GlassProperties = {
  opacity: 0.8,
  blur: 6,
  refraction: 0.5,
  reflection: 0.5,
  chromatic: 0.3,
  caustic: 0.4,
  temperature: 0.0,
  viscosity: 0.3,
  crystalline: 0.2,
  iridescence: 0.4,
};

export const GlassMorphingEngine: React.FC<GlassMorphingEngineProps> = ({
  children,
  className='',
  environmentalContext = {},
  userActivity = 'browsing',
  contentType = 'text',
  intensity = 1,
  adaptationSpeed = 1000,
  enableRealTimeAdaptation = true,
  onMorphingChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProperties, setCurrentProperties] = useState<GlassProperties>(defaultGlassProperties);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const controls = useAnimation();
  
  // Motion values for smooth transitions
  const opacityMotion = useSpring(currentProperties.opacity, { stiffness: 100, damping: 30 });
  const blurMotion = useSpring(currentProperties.blur, { stiffness: 80, damping: 25 });
  const refractionMotion = useSpring(currentProperties.refraction, { stiffness: 120, damping: 35 });
  const reflectionMotion = useSpring(currentProperties.reflection, { stiffness: 110, damping: 32 });
  const chromaticMotion = useSpring(currentProperties.chromatic, { stiffness: 90, damping: 28 });
  const causticMotion = useSpring(currentProperties.caustic, { stiffness: 100, damping: 30 });
  const temperatureMotion = useSpring(currentProperties.temperature, { stiffness: 70, damping: 20 });
  const viscosityMotion = useSpring(currentProperties.viscosity, { stiffness: 85, damping: 25 });
  const crystallineMotion = useSpring(currentProperties.crystalline, { stiffness: 95, damping: 30 });
  const iridescenceMotion = useSpring(currentProperties.iridescence, { stiffness: 105, damping: 32 });

  // Calculate target glass properties based on context
  const calculateTargetProperties = useCallback((
    environmental: Partial<EnvironmentalContext>,
    activity: UserActivity,
    content: ContentType,
    intensityFactor: number
  ): GlassProperties => {
    let targetProperties = { ...defaultGlassProperties };

    // Apply environmental adaptations
    if (environmental.timeOfDay) {
      const config = ENVIRONMENTAL_GLASS_CONFIGS[`timeOfDay-${environmental.timeOfDay}`];
      targetProperties = { ...targetProperties, ...config };
    }

    if (environmental.weather) {
      const config = ENVIRONMENTAL_GLASS_CONFIGS[`weather-${environmental.weather}`];
      targetProperties = { ...targetProperties, ...config };
    }

    if (environmental.season) {
      const config = ENVIRONMENTAL_GLASS_CONFIGS[`season-${environmental.season}`];
      targetProperties = { ...targetProperties, ...config };
    }

    // Apply user activity adaptations
    const activityConfig = ENVIRONMENTAL_GLASS_CONFIGS[`activity-${activity}`];
    if (activityConfig) {
      targetProperties = { ...targetProperties, ...activityConfig };
    }

    // Apply content type adaptations
    const contentConfig = ENVIRONMENTAL_GLASS_CONFIGS[`content-${content}`];
    if (contentConfig) {
      targetProperties = { ...targetProperties, ...contentConfig };
    }

    // Apply environmental sensor data
    if (environmental.temperature !== undefined) {
      const tempFactor = (environmental.temperature - 20) / 30; // Normalize around 20°C
      targetProperties.temperature += tempFactor * 0.3;
      targetProperties.crystalline += Math.max(0, -tempFactor * 0.4);
      targetProperties.viscosity += tempFactor * 0.2;
    }

    if (environmental.humidity !== undefined) {
      const humidityFactor = environmental.humidity / 100;
      targetProperties.viscosity += humidityFactor * 0.3;
      targetProperties.blur += humidityFactor * 3;
      targetProperties.caustic += humidityFactor * 0.2;
    }

    if (environmental.lightLevel !== undefined) {
      const lightFactor = environmental.lightLevel / 100;
      targetProperties.reflection *= (0.5 + lightFactor * 0.5);
      targetProperties.caustic *= lightFactor;
      targetProperties.iridescence *= (0.3 + lightFactor * 0.7);
    }

    // Apply intensity scaling
    Object.keys(targetProperties).forEach((key: any) => {
      const prop = key as keyof GlassProperties;
      if (prop !== 'opacity') {
        targetProperties[prop] = targetProperties[prop] * intensityFactor;
      } else {
        // Opacity scaling is inverse for better visibility
        targetProperties[prop] = 1 - ((1 - targetProperties[prop]) * intensityFactor);
      }
    });

    // Clamp values to valid ranges
    targetProperties.opacity = Math.max(0.1, Math.min(1, targetProperties.opacity));
    targetProperties.blur = Math.max(0, Math.min(30, targetProperties.blur));
    targetProperties.refraction = Math.max(0, Math.min(1, targetProperties.refraction));
    targetProperties.reflection = Math.max(0, Math.min(1, targetProperties.reflection));
    targetProperties.chromatic = Math.max(0, Math.min(1, targetProperties.chromatic));
    targetProperties.caustic = Math.max(0, Math.min(1, targetProperties.caustic));
    targetProperties.temperature = Math.max(-1, Math.min(1, targetProperties.temperature));
    targetProperties.viscosity = Math.max(0, Math.min(1, targetProperties.viscosity));
    targetProperties.crystalline = Math.max(0, Math.min(1, targetProperties.crystalline));
    targetProperties.iridescence = Math.max(0, Math.min(1, targetProperties.iridescence));

    return targetProperties;
  }, []);

  // Real-time environmental data fetching
  const fetchEnvironmentalData = useCallback(async (): Promise<Partial<EnvironmentalContext>> => {
    // In a real implementation, this would fetch from weather APIs, device sensors, etc.
    const now = new Date();
    const hour = now.getHours();
    
    let timeOfDay: EnvironmentalContext['timeOfDay'] = 'morning';
    if (hour >= 5 && hour < 8) timeOfDay = 'dawn';
    else if (hour >= 8 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 20) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const month = now.getMonth();
    let season: EnvironmentalContext['season'] = 'spring';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';

    // Mock environmental data - in real app, would use actual sensors/APIs
    return {
      timeOfDay,
      season,
      weather: 'sunny', // Would come from weather API
      temperature: 22, // Would come from device sensors or location-based weather
      humidity: 45,
      lightLevel: 75,
    };
  }, []);

  // Morphing transition effect
  const performMorphingTransition = useCallback(async (targetProperties: GlassProperties) => {
    setIsTransitioning(true);

    // Animate all properties smoothly
    opacityMotion.set(targetProperties.opacity);
    blurMotion.set(targetProperties.blur);
    refractionMotion.set(targetProperties.refraction);
    reflectionMotion.set(targetProperties.reflection);
    chromaticMotion.set(targetProperties.chromatic);
    causticMotion.set(targetProperties.caustic);
    temperatureMotion.set(targetProperties.temperature);
    viscosityMotion.set(targetProperties.viscosity);
    crystallineMotion.set(targetProperties.crystalline);
    iridescenceMotion.set(targetProperties.iridescence);

    // Update state
    setCurrentProperties(targetProperties);

    // Notify parent component
    onMorphingChange?.(targetProperties);

    // End transition after animation completes
    setTimeout(() => setIsTransitioning(false), adaptationSpeed);
  }, [
    opacityMotion, blurMotion, refractionMotion, reflectionMotion,
    chromaticMotion, causticMotion, temperatureMotion, viscosityMotion,
    crystallineMotion, iridescenceMotion, adaptationSpeed, onMorphingChange
  ]);

  // Update glass properties when context changes
  useEffect(() => {
    const updateGlassProperties = async () => {
      let finalEnvironmentalContext = { ...environmentalContext };

      // Fetch real-time data if enabled
      if (enableRealTimeAdaptation) {
        const realTimeData = await fetchEnvironmentalData();
        finalEnvironmentalContext = { ...finalEnvironmentalContext, ...realTimeData };
      }

      const targetProperties = calculateTargetProperties(
        finalEnvironmentalContext,
        userActivity,
        contentType,
        intensity
      );

      performMorphingTransition(targetProperties);
    };

    updateGlassProperties();
  }, [
    environmentalContext,
    userActivity,
    contentType,
    intensity,
    enableRealTimeAdaptation,
    calculateTargetProperties,
    performMorphingTransition,
    fetchEnvironmentalData
  ]);

  // Auto-update environmental data periodically
  useEffect(() => {
    if (!enableRealTimeAdaptation) return;

    const interval = setInterval(async () => {
      const realTimeData = await fetchEnvironmentalData();
      const targetProperties = calculateTargetProperties(
        { ...environmentalContext, ...realTimeData },
        userActivity,
        contentType,
        intensity
      );
      performMorphingTransition(targetProperties);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [
    enableRealTimeAdaptation,
    environmentalContext,
    userActivity,
    contentType,
    intensity,
    calculateTargetProperties,
    performMorphingTransition,
    fetchEnvironmentalData
  ]);

  // Generate dynamic CSS for glass effects
  // Bind motion values to CSS variables on the container element
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const subs: Array<() => void> = [];
    subs.push(opacityMotion.on('change', v => el.style.setProperty('--gm-opacity', String(v))));
    subs.push(blurMotion.on('change', v => el.style.setProperty('--gm-blur', `${v}px`)));
    subs.push(refractionMotion.on('change', v => el.style.setProperty('--gm-refraction', String(v))));
    subs.push(reflectionMotion.on('change', v => el.style.setProperty('--gm-reflection', String(v))));
    subs.push(chromaticMotion.on('change', v => el.style.setProperty('--gm-chromatic', String(v))));
    subs.push(causticMotion.on('change', v => el.style.setProperty('--gm-caustic', String(v))));
    subs.push(temperatureMotion.on('change', v => {
      el.style.setProperty('--gm-temperature', String(v));
      // Map temperature [-1..1] -> hue around blue (200) to warm (+/- 60)
      const hue = Math.round(v * 60 + 200);
      el.style.setProperty('--gm-hue', String(hue));
    }));
    subs.push(viscosityMotion.on('change', v => el.style.setProperty('--gm-viscosity', String(v))));
    subs.push(crystallineMotion.on('change', v => el.style.setProperty('--gm-crystalline', String(v))));
    subs.push(iridescenceMotion.on('change', v => el.style.setProperty('--gm-iridescence', String(v))));

    // Prime initial values
    const prime = () => {
      el.style.setProperty('--gm-opacity', String(opacityMotion.get()));
      el.style.setProperty('--gm-blur', `${blurMotion.get()}px`);
      el.style.setProperty('--gm-refraction', String(refractionMotion.get()));
      el.style.setProperty('--gm-reflection', String(reflectionMotion.get()));
      el.style.setProperty('--gm-chromatic', String(chromaticMotion.get()));
      el.style.setProperty('--gm-caustic', String(causticMotion.get()));
      const t = temperatureMotion.get();
      el.style.setProperty('--gm-temperature', String(t));
      el.style.setProperty('--gm-hue', String(Math.round(t * 60 + 200)));
      el.style.setProperty('--gm-viscosity', String(viscosityMotion.get()));
      el.style.setProperty('--gm-crystalline', String(crystallineMotion.get()));
      el.style.setProperty('--gm-iridescence', String(iridescenceMotion.get()));
    };
    prime();

    return () => { subs.forEach((unsub: any) => unsub()); };
  }, [
    containerRef,
    opacityMotion, blurMotion, refractionMotion, reflectionMotion,
    chromaticMotion, causticMotion, temperatureMotion, viscosityMotion,
    crystallineMotion, iridescenceMotion
  ]);

  return (
    <motion.div
      ref={containerRef}
      className={cn('glass-morphing-container', className)}
      animate={controls}
    >
      {/* Dynamic glass layers */}
      <div className={cn('glass-morphing-effects')}> 
        {/* Base glass layer */}
        <div className={cn('glass-layer glass-base')} />

        {/* Refraction layer */}
        <div className={cn('glass-layer glass-refraction')} />

        {/* Reflection layer */}
        <div className={cn('glass-layer glass-reflection')} />

        {/* Chromatic aberration layer */}
        <div className={cn('glass-layer glass-chromatic')} />

        {/* Caustic pattern layer */}
        <div className={cn('glass-layer glass-caustic')} />

        {/* Crystalline structure layer */}
        <div className={cn('glass-layer glass-crystalline')} />

        {/* Viscosity flow layer */}
        <div className={cn('glass-layer glass-viscosity')} />
      </div>

      {/* Content */}
      <div className={cn('glass-morphing-content')}>
        {children}
      </div>

      {/* Transition indicators */}
      {isTransitioning && (
        <div className={cn("glass-morphing-transition-indicator")}>
          <div className={cn("transition-shimmer")} />
        </div>
      )}

      {/* CSS handled via glass-morphing.css */}
    </motion.div>
  );
};

// Specialized morphing components for different use cases
export const EnvironmentalGlass: React.FC<Omit<GlassMorphingEngineProps, 'enableRealTimeAdaptation'>> = (props) => (
  <GlassMorphingEngine {...props} enableRealTimeAdaptation={true} />
);

export const ContextualGlass: React.FC<GlassMorphingEngineProps> = (props) => (
  <GlassMorphingEngine {...props} adaptationSpeed={500} />
);

export const SeasonalGlass: React.FC<GlassMorphingEngineProps> = (props) => {
  const now = new Date();
  const month = now.getMonth();
  let season: EnvironmentalContext['season'] = 'spring';
  
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'autumn';
  else season = 'winter';

  return (
    <GlassMorphingEngine 
      {...props} 
      environmentalContext={{ ...props.environmentalContext, season }}
    />
  );
};

export default GlassMorphingEngine;
