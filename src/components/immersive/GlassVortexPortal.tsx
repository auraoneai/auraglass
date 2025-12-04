'use client';
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
import { useGlassSound } from "../../utils/soundDesign";

export interface VortexRing {
  radius: number;
  rotation: number;
  speed: number;
  opacity: number;
  color: [number, number, number];
  thickness: number;
  id: string;
}

export interface VortexParticle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  color: [number, number, number];
  lifetime: number;
  id: string;
}

export interface DimensionalShift {
  x: number;
  y: number;
  intensity: number;
  frequency: number;
  type: "ripple" | "spiral" | "quantum" | "void";
  id: string;
}

export interface GlassVortexPortalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Portal radius */
  radius?: number;
  /** Number of vortex rings */
  ringCount?: number;
  /** Base rotation speed */
  rotationSpeed?: number;
  /** Portal intensity (0-1) */
  intensity?: number;
  /** Portal depth effect */
  depth?: number;
  /** Portal type */
  type?: "dimensional" | "energy" | "void" | "quantum" | "temporal";
  /** Portal color scheme */
  colorScheme?: "blue" | "purple" | "green" | "red" | "gold" | "cosmic";
  /** Whether portal is active */
  active?: boolean;
  /** Whether portal is opening */
  opening?: boolean;
  /** Whether portal is closing */
  closing?: boolean;
  /** Particle count for effects */
  particleCount?: number;
  /** Whether to show dimensional distortion */
  showDistortion?: boolean;
  /** Distortion intensity */
  distortionIntensity?: number;
  /** Portal energy level */
  energyLevel?: number;
  /** Whether portal pulses */
  pulsing?: boolean;
  /** Pulse frequency */
  pulseFrequency?: number;
  /** Whether to show event horizon */
  showEventHorizon?: boolean;
  /** Whether portal is interactive */
  interactive?: boolean;
  /** Portal activation handler */
  onActivate?: () => void;
  /** Portal deactivation handler */
  onDeactivate?: () => void;
  /** Portal entry handler */
  onEntry?: (x: number, y: number) => void;
  /** Animation speed multiplier */
  timeScale?: number;
  /** Show portal controls */
  showControls?: boolean;
  /** Debug mode */
  debug?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

// Move color schemes outside component to keep reference stable across renders
const COLOR_SCHEMES = {
  blue: {
    primary: [100, 150, 255],
    secondary: [150, 200, 255],
    accent: [50, 100, 200],
  },
  purple: {
    primary: [200, 100, 255],
    secondary: [255, 150, 255],
    accent: [150, 50, 200],
  },
  green: {
    primary: [100, 255, 150],
    secondary: [150, 255, 200],
    accent: [50, 200, 100],
  },
  red: {
    primary: [255, 100, 100],
    secondary: [255, 150, 150],
    accent: [200, 50, 50],
  },
  gold: {
    primary: [255, 200, 100],
    secondary: [255, 220, 150],
    accent: [200, 150, 50],
  },
  cosmic: {
    primary: [255, 100, 200],
    secondary: [100, 200, 255],
    accent: [200, 255, 100],
  },
} as const;

export const GlassVortexPortal = forwardRef<
  HTMLDivElement,
  GlassVortexPortalProps
>(
  (
    {
      width = 600,
      height = 600,
      radius = 150,
      ringCount = 8,
      rotationSpeed = 1,
      intensity = 0.8,
      depth = 10,
      type = "dimensional",
      colorScheme = "blue",
      active = true,
      opening = false,
      closing = false,
      particleCount = 100,
      showDistortion = true,
      distortionIntensity = 0.5,
      energyLevel = 1,
      pulsing = true,
      pulseFrequency = 2,
      showEventHorizon = true,
      interactive = true,
      onActivate,
      onDeactivate,
      onEntry,
      timeScale = 1,
      showControls = true,
      debug = false,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const portalId = useA11yId("glass-vortex-portal");

    const [rings, setRings] = useState<VortexRing[]>([]);
    const [particles, setParticles] = useState<VortexParticle[]>([]);
    const [distortions, setDistortions] = useState<DimensionalShift[]>([]);
    const [currentIntensity, setCurrentIntensity] = useState(intensity);
    const [currentRadius, setCurrentRadius] = useState(radius);
    const [portalActive, setPortalActive] = useState(active);
    const [animationTime, setAnimationTime] = useState(0);
    // Use stable color scheme map so callbacks don't churn every render
    const currentColors = COLOR_SCHEMES[colorScheme];

    // Initialize portal rings
    const initializeRings = useCallback(() => {
      const newRings: VortexRing[] = [];

      for (let i = 0; i < ringCount; i++) {
        const ringRadius = (radius / ringCount) * (i + 1);
        const speed = (1 + i * 0.2) * rotationSpeed;
        const opacity = Math.max(0.1, 1 - (i / ringCount) * 0.8);

        newRings.push({
          radius: ringRadius,
          rotation: Math.random() * Math.PI * 2,
          speed,
          opacity,
          color: (i % 2 === 0
            ? currentColors.primary
            : currentColors.secondary) as [number, number, number],
          thickness: Math.max(1, 5 - i),
          id: `ring-${i}`,
        });
      }

      setRings(newRings);
    }, [ringCount, radius, rotationSpeed, colorScheme]);

    // Initialize particles
    const initializeParticles = useCallback(() => {
      const newParticles: VortexParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const particleRadius = Math.random() * radius * 1.5;

        newParticles.push({
          x: width / 2 + Math.cos(angle) * particleRadius,
          y: height / 2 + Math.sin(angle) * particleRadius,
          angle,
          radius: particleRadius,
          speed: (Math.random() * 2 + 1) * rotationSpeed,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: [
            currentColors.accent[0] + Math.random() * 50,
            currentColors.accent[1] + Math.random() * 50,
            currentColors.accent[2] + Math.random() * 50,
          ],
          lifetime: Math.random() * 5000 + 2000,
          id: `particle-${i}`,
        });
      }

      setParticles(newParticles);
    }, [particleCount, radius, width, height, rotationSpeed, colorScheme]);

    // Initialize distortions
    const initializeDistortions = useCallback(() => {
      if (!showDistortion) return;

      const newDistortions: DimensionalShift[] = [];
      const distortionCount = Math.floor(distortionIntensity * 10);

      for (let i = 0; i < distortionCount; i++) {
        newDistortions.push({
          x: Math.random() * width,
          y: Math.random() * height,
          intensity: Math.random() * distortionIntensity,
          frequency: Math.random() * 0.02 + 0.01,
          type: ["ripple", "spiral", "quantum", "void"][
            Math.floor(Math.random() * 4)
          ] as any,
          id: `distortion-${i}`,
        });
      }

      setDistortions(newDistortions);
    }, [showDistortion, distortionIntensity, width, height]);

    // Initialize portal
    useEffect(() => {
      initializeRings();
      initializeParticles();
      initializeDistortions();
    }, [initializeRings, initializeParticles, initializeDistortions]);

    // Update portal state
    useEffect(() => {
      if (opening) {
        setCurrentIntensity(0);
        setCurrentRadius(0);
        const interval = setInterval(() => {
          setCurrentIntensity((prev: any) => Math.min(intensity, prev + 0.02));
          setCurrentRadius((prev: any) => Math.min(radius, prev + 3));
        }, 16);

        setTimeout(() => {
          clearInterval(interval);
          play("success");
        }, 2000);

        return () => clearInterval(interval);
      }

      if (closing) {
        const interval = setInterval(() => {
          setCurrentIntensity((prev: any) => Math.max(0, prev - 0.02));
          setCurrentRadius((prev: any) => Math.max(0, prev - 3));
        }, 16);

        setTimeout(() => {
          clearInterval(interval);
          setPortalActive(false);
          play("error");
        }, 2000);

        return () => clearInterval(interval);
      }
    }, [opening, closing, intensity, radius, play]);

    // Update rings animation
    const updateRings = useCallback(
      (deltaTime: number) => {
        setRings((prevRings) =>
          prevRings.map((ring: any) => ({
            ...ring,
            rotation:
              ring.rotation +
              ring.speed * deltaTime * timeScale * (portalActive ? 1 : 0.1),
            opacity: ring.opacity * currentIntensity,
            radius: (ring.radius / radius) * currentRadius,
          }))
        );
      },
      [timeScale, portalActive, currentIntensity, currentRadius, radius]
    );

    // Update particles
    const updateParticles = useCallback(
      (deltaTime: number) => {
        setParticles((prevParticles) =>
          prevParticles
            .map((particle: any) => {
              const centerX = width / 2;
              const centerY = height / 2;

              // Spiral motion towards center
              const newAngle =
                particle.angle + particle.speed * deltaTime * timeScale;
              let newRadius = particle.radius;

              if (portalActive) {
                newRadius = Math.max(
                  5,
                  particle.radius - 20 * deltaTime * timeScale
                );

                // Respawn particle at edge when it reaches center
                if (newRadius < 10) {
                  newRadius = radius * 1.5;
                  particle.lifetime = Math.random() * 5000 + 2000;
                }
              }

              const newX = centerX + Math.cos(newAngle) * newRadius;
              const newY = centerY + Math.sin(newAngle) * newRadius;

              return {
                ...particle,
                x: newX,
                y: newY,
                angle: newAngle,
                radius: newRadius,
                opacity: particle.opacity * currentIntensity,
                lifetime: particle.lifetime - deltaTime,
              };
            })
            .filter((p: any) => p.lifetime > 0)
        );

        // Add new particles if needed
        if (particles.length < particleCount && portalActive) {
          const newParticles: VortexParticle[] = [];
          const needed = Math.min(5, particleCount - particles.length);

          for (let i = 0; i < needed; i++) {
            const angle = Math.random() * Math.PI * 2;
            const particleRadius = radius * 1.5;

            newParticles.push({
              x: width / 2 + Math.cos(angle) * particleRadius,
              y: height / 2 + Math.sin(angle) * particleRadius,
              angle,
              radius: particleRadius,
              speed: (Math.random() * 2 + 1) * rotationSpeed,
              size: Math.random() * 3 + 1,
              opacity: Math.random() * 0.8 + 0.2,
              color: [
                currentColors.accent[0] + Math.random() * 50,
                currentColors.accent[1] + Math.random() * 50,
                currentColors.accent[2] + Math.random() * 50,
              ],
              lifetime: Math.random() * 5000 + 2000,
              id: `particle-${Date.now()}-${i}`,
            });
          }

          setParticles((prev: any) => [...prev, ...newParticles]);
        }
      },
      [
        width,
        height,
        radius,
        timeScale,
        portalActive,
        currentIntensity,
        particles.length,
        particleCount,
        rotationSpeed,
        colorScheme,
      ]
    );

    // Render portal
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas
      ctx.fillStyle =
        "rgba(var(--glass-color-black) / var(--glass-opacity-10))";
      ctx.fillRect(0, 0, width, height);

      // Apply distortion effects
      if (showDistortion && portalActive) {
        distortions.forEach((distortion: any) => {
          const distortionRadius = 50 * distortion.intensity;
          const gradient = ctx.createRadialGradient(
            distortion.x,
            distortion.y,
            0,
            distortion.x,
            distortion.y,
            distortionRadius
          );

          gradient.addColorStop(0, "rgba(255, 255, 255, 0.02)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
        });
      }

      // Draw event horizon
      if (showEventHorizon && portalActive) {
        const horizonGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          currentRadius * 0.1,
          centerX,
          centerY,
          currentRadius
        );

        horizonGradient.addColorStop(
          0,
          `rgba(${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, 0.8)`
        );
        horizonGradient.addColorStop(
          0.7,
          `rgba(${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, 0.3)`
        );
        horizonGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = horizonGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw vortex rings
      rings.forEach((ring, index) => {
        if (ring.opacity < 0.01) return;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.rotation);

        // Create ring gradient
        const ringGradient = ctx.createLinearGradient(
          -ring.radius,
          0,
          ring.radius,
          0
        );
        ringGradient.addColorStop(
          0,
          `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, 0)`
        );
        ringGradient.addColorStop(
          0.5,
          `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, ${ring.opacity})`
        );
        ringGradient.addColorStop(
          1,
          `rgba(${ring.color[0]}, ${ring.color[1]}, ${ring.color[2]}, 0)`
        );

        ctx.strokeStyle = ringGradient;
        ctx.lineWidth = ring.thickness;
        ctx.globalAlpha = ring.opacity * currentIntensity;

        // Draw multiple concentric lines for depth
        for (let i = 0; i < depth; i++) {
          const layerRadius = ring.radius + i * 2;
          const layerOpacity = (1 - i / depth) * ring.opacity;

          ctx.globalAlpha = layerOpacity * currentIntensity;
          ctx.beginPath();
          ctx.arc(0, 0, layerRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw particles
      particles.forEach((particle: any) => {
        if (particle.opacity < 0.01) return;

        const particleGradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );

        particleGradient.addColorStop(
          0,
          `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${particle.opacity})`
        );
        particleGradient.addColorStop(
          1,
          `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, 0)`
        );

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw portal center void
      if (portalActive && currentRadius > 10) {
        const voidGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          currentRadius * 0.3
        );

        voidGradient.addColorStop(0, "var(--glass-black)");
        voidGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = voidGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulse effect
      if (pulsing && portalActive) {
        const pulseIntensity =
          Math.sin(animationTime * pulseFrequency) * 0.3 + 0.7;
        const pulseGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          currentRadius * 0.8,
          centerX,
          centerY,
          currentRadius * 1.2
        );

        pulseGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        pulseGradient.addColorStop(
          1,
          `rgba(255, 255, 255, ${pulseIntensity * 0.1})`
        );

        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Debug info
      if (debug) {
        ctx.fillStyle = "white";
        ctx.font = "12px monospace";
        ctx.fillText(`Intensity: ${currentIntensity.toFixed(2)}`, 10, 20);
        ctx.fillText(`Radius: ${currentRadius.toFixed(0)}`, 10, 35);
        ctx.fillText(`Rings: ${rings.length}`, 10, 50);
        ctx.fillText(`Particles: ${particles.length}`, 10, 65);
        ctx.fillText(`Active: ${portalActive}`, 10, 80);
      }
    }, [
      width,
      height,
      currentRadius,
      currentIntensity,
      showDistortion,
      distortions,
      portalActive,
      showEventHorizon,
      colorScheme,
      rings,
      depth,
      particles,
      pulsing,
      animationTime,
      pulseFrequency,
      debug,
    ]);

    // Animation loop
    const animate = useCallback(
      (currentTime: number) => {
        if (prefersReducedMotion && respectMotionPreference) {
          render();
          return;
        }

        const deltaTime = 0.016; // 60fps
        setAnimationTime((prev: any) => prev + deltaTime);

        updateRings(deltaTime);
        updateParticles(deltaTime);
        render();

        animationRef.current = requestAnimationFrame(animate);
      },
      [
        prefersReducedMotion,
        respectMotionPreference,
        render,
        updateRings,
        updateParticles,
      ]
    );

    // Start animation
    useEffect(() => {
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [animate]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
    }, [width, height]);

    // Handle portal interaction
    const handleCanvasClick = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!interactive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = width / 2;
        const centerY = height / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        // Check if click is within portal
        if (distance < currentRadius && portalActive) {
          onEntry?.(x, y);
          play("success");
        }
      },
      [interactive, width, height, currentRadius, portalActive, onEntry, play]
    );

    // Portal controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-portal-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <button
              onClick={() => {
                setPortalActive(!portalActive);
                portalActive ? onDeactivate?.() : onActivate?.();
                play("tap");
              }}
              className={cn(
                "glass-px-3 glass-py-1 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard",
                portalActive
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
              )}
            >
              {portalActive ? "Deactivate" : "Activate"}
            </button>

            <button
              onClick={() => {
                initializeRings();
                initializeParticles();
                initializeDistortions();
                play("success");
              }}
              className='glass-px-3 glass-py-1 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard'
            >
              Reset
            </button>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm" htmlFor="vortex-type-select">Type:</label>
            <select
              id="vortex-type-select"
              value={type}
              onChange={(e) => {}}
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20"
              aria-label="Select vortex type"
            >
              <option value="dimensional">Dimensional</option>
              <option value="energy">Energy</option>
              <option value="void">Void</option>
              <option value="quantum">Quantum</option>
              <option value="temporal">Temporal</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm" htmlFor="vortex-color-select">Color:</label>
            <select
              id="vortex-color-select"
              value={colorScheme}
              onChange={(e) => {}}
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20"
              aria-label="Select color scheme"
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="gold">Gold</option>
              <option value="cosmic">Cosmic</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm" htmlFor="vortex-intensity-range">Intensity:</label>
            <input
              id="vortex-intensity-range"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentIntensity}
              onChange={(e) => setCurrentIntensity(parseFloat(e.target.value))}
              className='glass-w-20 glass-focus glass-touch-target glass-contrast-guard'
              aria-label="Adjust vortex intensity"
            />
            <span className='glass-text-sm glass-min-w-3ch'>
              {(currentIntensity * 100).toFixed(0)}%
            </span>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={pulsing}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Pulse
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showDistortion}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Distortion
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Debug
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={portalId}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-vortex-portal relative glass-radius-lg glass-backdrop-blur-md border border-border/20",
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          <div className='glass-relative'>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "border border-border/20 glass-radius-md bg-black",
                interactive && "cursor-pointer"
              )}
              onClick={handleCanvasClick}
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassVortexPortal.displayName = "GlassVortexPortal";

export default GlassVortexPortal;