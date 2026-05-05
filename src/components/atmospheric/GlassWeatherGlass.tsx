"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface WeatherCondition {
  type:
    | "clear"
    | "cloudy"
    | "rainy"
    | "stormy"
    | "snowy"
    | "foggy"
    | "windy"
    | "sunny";
  intensity: number; // 0-1
  temperature: number; // Celsius
  humidity: number; // 0-1
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees
  visibility: number; // km
  id: string;
}

export interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: [number, number, number];
  type: "rain" | "snow" | "fog" | "dust" | "leaf" | "droplet";
  lifetime: number;
  rotation: number;
  rotationSpeed: number;
  id: string;
}

export interface AtmosphericEffect {
  type: "lightning" | "rainbow" | "aurora" | "halo" | "mist" | "heatwave";
  intensity: number;
  duration: number;
  position: { x: number; y: number };
  color: [number, number, number];
  id: string;
}

export interface GlassWeatherGlassProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Current weather condition */
  weather?: WeatherCondition;
  /** Whether to auto-update weather */
  autoUpdate?: boolean;
  /** Update interval in milliseconds */
  updateInterval?: number;
  /** Particle count multiplier */
  particleDensity?: number;
  /** Whether to show atmospheric effects */
  showAtmosphericEffects?: boolean;
  /** Glass tint response to weather */
  weatherResponsive?: boolean;
  /** Temperature range for color mapping */
  temperatureRange?: [number, number];
  /** Whether to show weather info */
  showWeatherInfo?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Wind effect strength */
  windStrength?: number;
  /** Whether to show day/night cycle */
  dayNightCycle?: boolean;
  /** Current time of day (0-24) */
  timeOfDay?: number;
  /** Weather change handler */
  onWeatherChange?: (weather: WeatherCondition) => void;
  /** Atmospheric event handler */
  onAtmosphericEvent?: (effect: AtmosphericEffect) => void;
  /** Show controls */
  showControls?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassWeatherGlass = forwardRef<
  HTMLDivElement,
  GlassWeatherGlassProps
>(
  (
    {
      width = 600,
      height = 400,
      weather = {
        type: "clear",
        intensity: 0.5,
        temperature: 20,
        humidity: 0.6,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 45,
        visibility: 10,
        id: "default-weather",
      },
      autoUpdate = false,
      updateInterval = ANIMATION.DURATION.slower * 50,
      particleDensity = 1,
      showAtmosphericEffects = true,
      weatherResponsive = true,
      temperatureRange = [-20, 40],
      showWeatherInfo = true,
      animationSpeed = 1,
      windStrength = 1,
      dayNightCycle = true,
      timeOfDay = 12,
      onWeatherChange,
      onAtmosphericEvent,
      showControls = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const weatherGlassId = useA11yId("glass-weather-glass");

    const [currentWeather, setCurrentWeather] =
      useState<WeatherCondition>(weather);
    const [particles, setParticles] = useState<WeatherParticle[]>([]);
    const [atmosphericEffects, setAtmosphericEffects] = useState<
      AtmosphericEffect[]
    >([]);
    const [animationTime, setAnimationTime] = useState(0);
    const [currentTimeOfDay, setCurrentTimeOfDay] = useState(timeOfDay);
    const [glassColor, setGlassColor] = useState<[number, number, number]>([
      255, 255, 255,
    ]);
    const [backgroundGradient, setBackgroundGradient] = useState<string[]>([
      "rgba(14, 165, 233, 0.78)",
      "rgba(59, 130, 246, 0.52)",
    ]);

    // Weather color mappings
    const weatherColors: Record<
      string,
      { sky: [string, string]; glass: [number, number, number] }
    > = {
      clear: {
        sky: ["rgba(14, 165, 233, 0.78)", "rgba(59, 130, 246, 0.52)"],
        glass: [255, 255, 255],
      },
      sunny: {
        sky: ["rgba(251, 191, 36, 0.82)", "rgba(249, 115, 22, 0.5)"],
        glass: [255, 248, 220],
      },
      cloudy: {
        sky: ["rgba(107, 114, 128, 0.72)", "rgba(156, 163, 175, 0.58)"],
        glass: [211, 211, 211],
      },
      rainy: {
        sky: ["rgba(14, 165, 233, 0.66)", "rgba(75, 85, 99, 0.64)"],
        glass: [70, 130, 180],
      },
      stormy: {
        sky: ["rgba(31, 41, 55, 0.88)", "rgba(168, 85, 247, 0.42)"],
        glass: [47, 79, 79],
      },
      snowy: {
        sky: ["rgba(255, 255, 255, 0.9)", "rgba(226, 232, 240, 0.72)"],
        glass: [240, 248, 255],
      },
      foggy: {
        sky: ["rgba(156, 163, 175, 0.68)", "rgba(229, 231, 235, 0.58)"],
        glass: [192, 192, 192],
      },
      windy: {
        sky: ["rgba(14, 165, 233, 0.62)", "rgba(168, 85, 247, 0.44)"],
        glass: [176, 196, 222],
      },
    };

    // Temperature to color mapping
    const getTemperatureColor = useCallback(
      (temp: number): [number, number, number] => {
        const [minTemp, maxTemp] = temperatureRange;
        const normalized = Math.max(
          0,
          Math.min(1, (temp - minTemp) / (maxTemp - minTemp))
        );

        if (normalized < 0.5) {
          // Cold: blue to white
          const factor = normalized * 2;
          return [
            Math.round(135 + (255 - 135) * factor), // Blue to white R
            Math.round(206 + (255 - 206) * factor), // Blue to white G
            255, // Full blue
          ];
        } else {
          // Hot: white to red
          const factor = (normalized - 0.5) * 2;
          return [
            255, // Full red
            Math.round(255 - 100 * factor), // White to red G
            Math.round(255 - 255 * factor), // White to red B
          ];
        }
      },
      [temperatureRange]
    );

    // Update weather responsiveness
    useEffect(() => {
      if (!weatherResponsive) return;

      const colors = weatherColors[currentWeather.type];
      const nextBg = colors.sky;
      if (
        backgroundGradient[0] !== nextBg[0] ||
        backgroundGradient[1] !== nextBg[1]
      ) {
        setBackgroundGradient(nextBg);
      }

      const nextGlass =
        currentWeather.type === "clear" || currentWeather.type === "sunny"
          ? getTemperatureColor(currentWeather.temperature)
          : colors.glass;
      if (
        glassColor[0] !== nextGlass[0] ||
        glassColor[1] !== nextGlass[1] ||
        glassColor[2] !== nextGlass[2]
      ) {
        setGlassColor(nextGlass);
      }
    }, [
      currentWeather,
      weatherResponsive,
      getTemperatureColor,
      backgroundGradient,
      glassColor,
    ]);

    // Day/night cycle
    useEffect(() => {
      if (!dayNightCycle) return;

      const isDaytime = currentTimeOfDay >= 6 && currentTimeOfDay <= 18;
      const cycleProgress = isDaytime
        ? (currentTimeOfDay - 6) / 12
        : currentTimeOfDay < 6
          ? (currentTimeOfDay + 6) / 12
          : (currentTimeOfDay - 18) / 12;

      // Adjust colors based on time of day
      if (!isDaytime) {
        setBackgroundGradient(["#191970", "#483D8B"]); // Night colors
        setGlassColor([25, 25, 112]); // Midnight blue
      }
    }, [currentTimeOfDay, dayNightCycle]);

    // Generate weather particles
    const generateParticles = useCallback(
      (weatherType: string, intensity: number) => {
        const particleCount = Math.floor(intensity * 100 * particleDensity);
        const newParticles: WeatherParticle[] = [];

        for (let i = 0; i < particleCount; i++) {
          let particle: Partial<WeatherParticle> = {
            x: Math.random() * width,
            y: -10,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            lifetime: Math.random() * 5000 + 2000,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 2,
            id: `particle-${weatherType}-${i}-${Date.now()}`,
          };

          switch (weatherType) {
            case "rainy":
              particle = {
                ...particle,
                type: "rain",
                vx: (Math.random() - 0.5) * currentWeather.windSpeed * 0.1,
                vy: Math.random() * 5 + 3,
                color: [100, 149, 237],
                size: Math.random() * 2 + 0.5,
              };
              break;

            case "snowy":
              particle = {
                ...particle,
                type: "snow",
                vx: (Math.random() - 0.5) * currentWeather.windSpeed * 0.05,
                vy: Math.random() * 2 + 0.5,
                color: [255, 255, 255],
                size: Math.random() * 4 + 2,
                rotationSpeed: (Math.random() - 0.5) * 1,
              };
              break;

            case "foggy":
              particle = {
                ...particle,
                type: "fog",
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.2,
                color: [220, 220, 220],
                size: Math.random() * 20 + 10,
                opacity: Math.random() * 0.3 + 0.1,
              };
              break;

            case "windy":
              particle = {
                ...particle,
                type: "leaf",
                vx: (Math.random() - 0.5) * currentWeather.windSpeed * 0.2,
                vy: Math.random() * 3 + 1,
                color: [34, 139, 34],
                size: Math.random() * 3 + 1,
                rotationSpeed: (Math.random() - 0.5) * 5,
              };
              break;

            default:
              if (currentWeather.humidity > 0.8) {
                particle = {
                  ...particle,
                  type: "droplet",
                  vx: (Math.random() - 0.5) * 0.5,
                  vy: Math.random() * 1 + 0.2,
                  color: [173, 216, 230],
                  size: Math.random() * 1.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.1,
                };
              }
              break;
          }

          if (particle.type) {
            newParticles.push(particle as WeatherParticle);
          }
        }

        return newParticles;
      },
      [
        width,
        currentWeather.windSpeed,
        currentWeather.humidity,
        particleDensity,
      ]
    );

    // Generate atmospheric effects
    const generateAtmosphericEffects = useCallback(() => {
      if (!showAtmosphericEffects) return [];

      const effects: AtmosphericEffect[] = [];

      // Lightning for stormy weather
      if (currentWeather.type === "stormy" && Math.random() < 0.02) {
        effects.push({
          type: "lightning",
          intensity: Math.random() * 0.8 + 0.2,
          duration: 200 + Math.random() * 300,
          position: {
            x: Math.random() * width,
            y: Math.random() * height * 0.3,
          },
          color: [255, 255, 255],
          id: `lightning-${Date.now()}`,
        });
      }

      // Rainbow after rain
      if (
        currentWeather.type === "rainy" &&
        currentWeather.intensity < 0.3 &&
        Math.random() < 0.01
      ) {
        effects.push({
          type: "rainbow",
          intensity: Math.random() * 0.6 + 0.4,
          duration: 5000 + Math.random() * 5000,
          position: { x: width * 0.8, y: height * 0.3 },
          color: [255, 255, 255],
          id: `rainbow-${Date.now()}`,
        });
      }

      // Mist for high humidity
      if (currentWeather.humidity > 0.8 && Math.random() < 0.1) {
        effects.push({
          type: "mist",
          intensity: currentWeather.humidity,
          duration: 3000 + Math.random() * 2000,
          position: { x: Math.random() * width, y: height * 0.8 },
          color: [230, 230, 250],
          id: `mist-${Date.now()}`,
        });
      }

      return effects;
    }, [showAtmosphericEffects, currentWeather, width, height]);

    // Update particles
    const updateParticles = useCallback(
      (deltaTime: number) => {
        setParticles((prevParticles) => {
          const updated = prevParticles
            .map((particle: any) => {
              const windInfluence =
                currentWeather.windSpeed * windStrength * 0.01;
              const windX =
                Math.cos((currentWeather.windDirection * Math.PI) / 180) *
                windInfluence;
              const windY =
                Math.sin((currentWeather.windDirection * Math.PI) / 180) *
                windInfluence;

              return {
                ...particle,
                x:
                  particle.x +
                  (particle.vx + windX) * deltaTime * animationSpeed,
                y:
                  particle.y +
                  (particle.vy + windY) * deltaTime * animationSpeed,
                rotation:
                  particle.rotation +
                  particle.rotationSpeed * deltaTime * animationSpeed,
                lifetime: particle.lifetime - deltaTime,
              };
            })
            .filter(
              (particle: any) =>
                particle.lifetime > 0 &&
                particle.x > -50 &&
                particle.x < width + 50 &&
                particle.y > -50 &&
                particle.y < height + 50
            );

          // Add new particles
          const newParticles = generateParticles(
            currentWeather.type,
            currentWeather.intensity
          );
          return [
            ...updated,
            ...newParticles.slice(0, Math.max(0, 200 - updated.length)),
          ];
        });
      },
      [
        currentWeather,
        windStrength,
        animationSpeed,
        width,
        height,
        generateParticles,
      ]
    );

    // Update atmospheric effects
    const updateAtmosphericEffects = useCallback(
      (deltaTime: number) => {
        setAtmosphericEffects((prevEffects) => {
          const updated = prevEffects
            .map((effect: any) => ({
              ...effect,
              duration: effect.duration - deltaTime,
            }))
            .filter((effect: any) => effect.duration > 0);

          // Add new effects
          const newEffects = generateAtmosphericEffects();
          return [...updated, ...newEffects];
        });
      },
      [generateAtmosphericEffects]
    );

    // Render weather
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, backgroundGradient[0]);
      gradient.addColorStop(1, backgroundGradient[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw atmospheric effects
      atmosphericEffects.forEach((effect: any) => {
        ctx.save();
        ctx.globalAlpha = effect.intensity * (effect.duration / 5000);

        switch (effect.type) {
          case "lightning":
            ctx.strokeStyle = `rgb(${effect.color[0]}, ${effect.color[1]}, ${effect.color[2]})`;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";

            // Draw lightning bolt
            ctx.beginPath();
            ctx.moveTo(effect.position.x, 0);
            ctx.lineTo(
              effect.position.x + Math.random() * 20 - 10,
              height * 0.3
            );
            ctx.lineTo(
              effect.position.x + Math.random() * 30 - 15,
              height * 0.6
            );
            ctx.lineTo(effect.position.x + Math.random() * 20 - 10, height);
            ctx.stroke();
            break;

          case "rainbow":
            const centerX = effect.position.x;
            const centerY = effect.position.y;
            const rainbowRadius = 100;

            const colors = [
              "#FF0000",
              "#FF7F00",
              "#FFFF00",
              "#00FF00",
              "#0000FF",
              "#4B0082",
              "#9400D3",
            ];
            colors.forEach((color, i) => {
              ctx.strokeStyle = color;
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.arc(
                centerX,
                centerY,
                rainbowRadius + i * 12,
                0,
                Math.PI,
                false
              );
              ctx.stroke();
            });
            break;

          case "mist":
            const mistGradient = ctx.createRadialGradient(
              effect.position.x,
              effect.position.y,
              0,
              effect.position.x,
              effect.position.y,
              100
            );
            mistGradient.addColorStop(
              0,
              `rgba(${effect.color[0]}, ${effect.color[1]}, ${effect.color[2]}, ${effect.intensity})`
            );
            mistGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = mistGradient;
            ctx.fillRect(0, 0, width, height);
            break;
        }

        ctx.restore();
      });

      // Draw particles
      particles.forEach((particle: any) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        const color = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;

        switch (particle.type) {
          case "rain":
            ctx.strokeStyle = color;
            ctx.lineWidth = particle.size;
            ctx.beginPath();
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(0, particle.size);
            ctx.stroke();
            break;

          case "snow":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();

            // Add snowflake pattern
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 6; i++) {
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(0, -particle.size);
              ctx.stroke();
              ctx.rotate(Math.PI / 3);
            }
            break;

          case "fog":
            const fogGradient = ctx.createRadialGradient(
              0,
              0,
              0,
              0,
              0,
              particle.size
            );
            fogGradient.addColorStop(
              0,
              `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${particle.opacity})`
            );
            fogGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = fogGradient;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case "leaf":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(
              0,
              0,
              particle.size,
              particle.size * 0.6,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();
            break;

          case "droplet":
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      // Glass tint overlay
      if (weatherResponsive) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = `rgb(${glassColor[0]}, ${glassColor[1]}, ${glassColor[2]})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Weather info overlay
      if (showWeatherInfo) {
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
        ctx.fillRect(10, 10, 200, 120);

        ctx.fillStyle = "white";
        ctx.font = "14px sans-serif";
        ctx.fillText(`Weather: ${currentWeather.type}`, 20, 30);
        ctx.fillText(`Temperature: ${currentWeather.temperature}°C`, 20, 50);
        ctx.fillText(
          `Humidity: ${Math.round(currentWeather.humidity * 100)}%`,
          20,
          70
        );
        ctx.fillText(
          `Wind: ${Math.round(currentWeather.windSpeed)} km/h`,
          20,
          90
        );
        ctx.fillText(`Pressure: ${currentWeather.pressure} hPa`, 20, 110);
        ctx.restore();
      }
    }, [
      width,
      height,
      backgroundGradient,
      atmosphericEffects,
      particles,
      weatherResponsive,
      glassColor,
      showWeatherInfo,
      currentWeather,
    ]);

    // Keep latest callbacks in refs to avoid effect restarts each render
    const renderRef = useRef(render);
    const updateParticlesRef = useRef(updateParticles);
    const updateAtmosphericEffectsRef = useRef(updateAtmosphericEffects);

    useEffect(() => {
      renderRef.current = render;
    }, [render]);
    useEffect(() => {
      updateParticlesRef.current = updateParticles;
    }, [updateParticles]);
    useEffect(() => {
      updateAtmosphericEffectsRef.current = updateAtmosphericEffects;
    }, [updateAtmosphericEffects]);

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion && respectMotionPreference) {
        renderRef.current();
        return;
      }

      const animate = () => {
        const deltaTime = 16; // 60fps
        setAnimationTime((prev: any) => prev + deltaTime);

        updateParticlesRef.current(deltaTime);
        updateAtmosphericEffectsRef.current(deltaTime);
        renderRef.current();

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [prefersReducedMotion, respectMotionPreference]);

    // Auto weather updates
    useEffect(() => {
      if (!autoUpdate) return;

      const interval = setInterval(() => {
        // Simulate weather changes
        const newWeather: WeatherCondition = {
          ...currentWeather,
          type: ["clear", "cloudy", "rainy", "sunny"][
            Math.floor(Math.random() * 4)
          ] as any,
          intensity: Math.random(),
          temperature: currentWeather.temperature + (Math.random() - 0.5) * 10,
          humidity: Math.random(),
          pressure: 1000 + Math.random() * 50,
          windSpeed: Math.random() * 30,
          windDirection: Math.random() * 360,
          id: `weather-${Date.now()}`,
        };

        setCurrentWeather(newWeather);
        onWeatherChange?.(newWeather);
      }, updateInterval);

      return () => clearInterval(interval);
    }, [autoUpdate, updateInterval, currentWeather, onWeatherChange]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
    }, [width, height]);

    // Controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-weather-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="weather-type" className="glass-text-sm">
              Weather:
            </label>
            <select
              id="weather-type"
              value={currentWeather.type}
              onChange={(e) => {
                const newWeather = {
                  ...currentWeather,
                  type: e.target.value as any,
                };
                setCurrentWeather(newWeather);
                onWeatherChange?.(newWeather);
              }}
              aria-label="Weather type selection"
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target"
            >
              <option value="clear">Clear</option>
              <option value="sunny">Sunny</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="stormy">Stormy</option>
              <option value="snowy">Snowy</option>
              <option value="foggy">Foggy</option>
              <option value="windy">Windy</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="weather-intensity" className="glass-text-sm">
              Intensity:
            </label>
            <input
              id="weather-intensity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentWeather.intensity}
              onChange={(e) => {
                const newWeather = {
                  ...currentWeather,
                  intensity: parseFloat(e.target.value),
                };
                setCurrentWeather(newWeather);
              }}
              aria-label="Weather intensity"
              className="glass-w-20 glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="weather-temp" className="glass-text-sm">
              Temp:
            </label>
            <input
              id="weather-temp"
              type="range"
              min="-20"
              max="40"
              value={currentWeather.temperature}
              onChange={(e) => {
                const newWeather = {
                  ...currentWeather,
                  temperature: parseInt(e.target.value),
                };
                setCurrentWeather(newWeather);
              }}
              aria-label="Temperature in Celsius"
              className="glass-w-20 glass-focus glass-touch-target glass-contrast-guard"
            />
            <span className="glass-text-sm glass-min-w-3ch">
              {currentWeather.temperature}°C
            </span>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => {}}
                aria-label="Enable auto update"
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Auto Update
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={weatherResponsive}
                onChange={(e) => {}}
                aria-label="Enable weather responsive styling"
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Responsive
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={weatherGlassId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-weather-glass relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",
          className
        )}
        data-testid={props["data-testid"]}
        role="region"
        aria-label="Weather visualization with controls"
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          <div className="glass-relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="glass-border glass-border-glass-border/20 glass-radius-md"
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassWeatherGlass.displayName = "GlassWeatherGlass";

export default GlassWeatherGlass;
