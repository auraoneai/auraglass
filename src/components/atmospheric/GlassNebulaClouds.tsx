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

export interface NebulaLayer {
  name: string;
  points: Array<{ x: number; y: number; density: number; temperature: number }>;
  color: [number, number, number];
  opacity: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;
  turbulence: number;
  id: string;
}

export interface StarCluster {
  x: number;
  y: number;
  stars: Array<{
    x: number;
    y: number;
    brightness: number;
    color: [number, number, number];
    size: number;
    twinklePhase: number;
    spectralClass: "O" | "B" | "A" | "F" | "G" | "K" | "M";
  }>;
  density: number;
  age: number; // millions of years
  id: string;
}

export interface CosmicDust {
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: [number, number, number];
    temperature: number;
    lifetime: number;
  }>;
  density: number;
  composition: "silicate" | "carbon" | "ice" | "organic";
  id: string;
}

export interface GlassNebulaCloudsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Nebula type */
  nebulaType?: "emission" | "reflection" | "dark" | "planetary" | "supernova";
  /** Overall nebula density */
  density?: number;
  /** Gas temperature (affects color) */
  temperature?: number;
  /** Stellar wind strength */
  stellarWindStrength?: number;
  /** Number of nebula layers */
  layerCount?: number;
  /** Show star clusters */
  showStarClusters?: boolean;
  /** Show cosmic dust */
  showCosmicDust?: boolean;
  /** Animation speed */
  animationSpeed?: number;
  /** Turbulence level */
  turbulenceLevel?: number;
  /** Color intensity */
  colorIntensity?: number;
  /** Camera distance (affects perspective) */
  cameraDistance?: number;
  /** Time scale (affects evolution) */
  timeScale?: number;
  /** Ionization level */
  ionizationLevel?: number;
  /** Whether to show emission lines */
  showEmissionLines?: boolean;
  /** Magnetic field visualization */
  showMagneticField?: boolean;
  /** Nebula evolution handler */
  onNebulaEvolution?: (age: number, state: string) => void;
  /** Star formation handler */
  onStarFormation?: (location: { x: number; y: number }) => void;
  /** Show controls */
  showControls?: boolean;
  /** Show nebula info */
  showNebulaInfo?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassNebulaClouds = forwardRef<
  HTMLDivElement,
  GlassNebulaCloudsProps
>(
  (
    {
      width = 800,
      height = 600,
      nebulaType = "emission",
      density = 0.7,
      temperature = 10000,
      stellarWindStrength = 0.5,
      layerCount = 5,
      showStarClusters = true,
      showCosmicDust = true,
      animationSpeed = 1,
      turbulenceLevel = 0.6,
      colorIntensity = 0.8,
      cameraDistance = 1,
      timeScale = 1,
      ionizationLevel = 0.7,
      showEmissionLines = true,
      showMagneticField = false,
      onNebulaEvolution,
      onStarFormation,
      showControls = true,
      showNebulaInfo = true,
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
    const nebulaCloudsId = useA11yId("glass-nebula-clouds");

    const [nebulaLayers, setNebulaLayers] = useState<NebulaLayer[]>([]);
    const [starClusters, setStarClusters] = useState<StarCluster[]>([]);
    const [cosmicDust, setCosmicDust] = useState<CosmicDust[]>([]);
    const [animationTime, setAnimationTime] = useState(0);
    const [nebulaAge, setNebulaAge] = useState(0); // millions of years
    const [evolutionPhase, setEvolutionPhase] = useState<
      "formation" | "mature" | "dispersing"
    >("formation");

    // Nebula type configurations
    const nebulaConfigs = {
      emission: {
        colors: [
          [255, 100, 100], // H-alpha (red)
          [100, 255, 100], // OIII (green)
          [100, 100, 255], // H-beta (blue)
          [255, 255, 100], // Sodium (yellow)
        ],
        baseTemperature: 10000,
        ionizedGas: true,
      },
      reflection: {
        colors: [
          [150, 200, 255], // Blue scattered light
          [200, 220, 255], // White light reflection
          [120, 180, 255], // Rayleigh scattering
        ],
        baseTemperature: 3000,
        ionizedGas: false,
      },
      dark: {
        colors: [
          [50, 50, 50], // Dark molecular cloud
          [80, 60, 40], // Dust silhouette
          [40, 40, 60], // Cold regions
        ],
        baseTemperature: 10,
        ionizedGas: false,
      },
      planetary: {
        colors: [
          [100, 255, 255], // OIII (cyan)
          [255, 100, 255], // H-alpha (magenta)
          [255, 255, 100], // HeII (yellow)
          [100, 255, 100], // NII (green)
        ],
        baseTemperature: 50000,
        ionizedGas: true,
      },
      supernova: {
        colors: [
          [255, 255, 255], // Shock front
          [255, 200, 100], // Hot gas
          [255, 100, 100], // H-alpha
          [100, 200, 255], // Synchrotron radiation
        ],
        baseTemperature: 1000000,
        ionizedGas: true,
      },
    };

    // Temperature to color mapping
    const getTemperatureColor = useCallback(
      (temp: number): [number, number, number] => {
        // Black body radiation approximation
        if (temp < 3000) return [255, 100, 0]; // Red
        if (temp < 5000) return [255, 200, 100]; // Orange
        if (temp < 7000) return [255, 255, 200]; // Yellow-white
        if (temp < 10000) return [200, 220, 255]; // White
        if (temp < 20000) return [150, 200, 255]; // Blue-white
        return [100, 150, 255]; // Blue
      },
      []
    );

    // Generate nebula layers
    const generateNebulaLayers = useCallback(() => {
      const config = nebulaConfigs[nebulaType];
      const layers: NebulaLayer[] = [];

      for (let i = 0; i < layerCount; i++) {
        const points = [];
        const layerDensity = density * (1 - i * 0.1);
        const layerTemp = temperature * (1 + (Math.random() - 0.5) * 0.3);

        // Generate cloud structure using Perlin-like noise
        for (let x = 0; x < width; x += 20) {
          for (let y = 0; y < height; y += 20) {
            const noise =
              Math.sin(x * 0.01 + i) *
              Math.cos(y * 0.01 + i) *
              Math.sin(x * y * 0.0001 + i * 2);

            if (Math.abs(noise) > 0.3) {
              points.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                density: layerDensity * Math.abs(noise),
                temperature: layerTemp * (0.8 + Math.random() * 0.4),
              });
            }
          }
        }

        layers.push({
          name: `Layer ${i + 1}`,
          points,
          color: config.colors[i % config.colors.length] as [
            number,
            number,
            number,
          ],
          opacity: colorIntensity * (0.8 - i * 0.1),
          scale: 1 + i * 0.2,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.001,
          turbulence: turbulenceLevel * (1 + i * 0.1),
          id: `nebula-layer-${i}`,
        });
      }

      setNebulaLayers(layers);
    }, [
      nebulaType,
      layerCount,
      density,
      temperature,
      width,
      height,
      colorIntensity,
      turbulenceLevel,
    ]);

    // Generate star clusters
    const generateStarClusters = useCallback(() => {
      if (!showStarClusters) return;

      const clusters: StarCluster[] = [];
      const clusterCount = Math.floor(3 + Math.random() * 4);

      for (let i = 0; i < clusterCount; i++) {
        const clusterX = Math.random() * width;
        const clusterY = Math.random() * height;
        const clusterDensity = Math.random() * 0.8 + 0.2;
        const clusterAge = Math.random() * 100; // million years

        const stars = [];
        const starCount = Math.floor(clusterDensity * 20 + 10);

        for (let j = 0; j < starCount; j++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80;
          const spectralClass = (["O", "B", "A", "F", "G", "K", "M"] as const)[
            Math.floor(Math.random() * 7)
          ];

          // Star colors based on spectral class
          const starColors = {
            O: [150, 180, 255], // Blue
            B: [180, 200, 255], // Blue-white
            A: [220, 230, 255], // White
            F: [255, 245, 240], // Yellow-white
            G: [255, 255, 200], // Yellow (like Sun)
            K: [255, 200, 150], // Orange
            M: [255, 150, 100], // Red
          };

          stars.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            brightness: Math.random() * 0.8 + 0.2,
            color: starColors[spectralClass] as [number, number, number],
            size:
              spectralClass === "O" || spectralClass === "B"
                ? 3
                : spectralClass === "M"
                  ? 1
                  : 2,
            twinklePhase: Math.random() * Math.PI * 2,
            spectralClass,
          });
        }

        clusters.push({
          x: clusterX,
          y: clusterY,
          stars,
          density: clusterDensity,
          age: clusterAge,
          id: `cluster-${i}`,
        });
      }

      setStarClusters(clusters);
    }, [showStarClusters, width, height]);

    // Generate cosmic dust
    const generateCosmicDust = useCallback(() => {
      if (!showCosmicDust) return;

      const dustClouds: CosmicDust[] = [];
      const dustCloudCount = Math.floor(2 + Math.random() * 3);

      for (let i = 0; i < dustCloudCount; i++) {
        const particles = [];
        const particleCount = Math.floor(density * 100 + 50);
        const composition = (["silicate", "carbon", "ice", "organic"] as const)[
          Math.floor(Math.random() * 4)
        ];

        const dustColors = {
          silicate: [150, 120, 80],
          carbon: [80, 60, 40],
          ice: [200, 220, 255],
          organic: [120, 100, 60],
        };

        for (let j = 0; j < particleCount; j++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * stellarWindStrength,
            vy: (Math.random() - 0.5) * stellarWindStrength,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.3 + 0.1,
            color: dustColors[composition] as [number, number, number],
            temperature: 50 + Math.random() * 200,
            lifetime: Math.random() * 10000 + 5000,
          });
        }

        dustClouds.push({
          particles,
          density: density * (0.5 + Math.random() * 0.5),
          composition,
          id: `dust-cloud-${i}`,
        });
      }

      setCosmicDust(dustClouds);
    }, [showCosmicDust, density, width, height, stellarWindStrength]);

    // Initialize nebula
    useEffect(() => {
      generateNebulaLayers();
      generateStarClusters();
      generateCosmicDust();
    }, [generateNebulaLayers, generateStarClusters, generateCosmicDust]);

    // Update nebula layers
    const updateNebulaLayers = useCallback(
      (deltaTime: number) => {
        setNebulaLayers((prevLayers) =>
          prevLayers.map((layer: any) => ({
            ...layer,
            rotation:
              layer.rotation +
              layer.rotationSpeed * deltaTime * animationSpeed * timeScale,
            points: layer.points.map((point: any) => ({
              ...point,
              x:
                point.x +
                Math.sin(animationTime * 0.0001 + point.y * 0.01) *
                  layer.turbulence *
                  0.1,
              y:
                point.y +
                Math.cos(animationTime * 0.0001 + point.x * 0.01) *
                  layer.turbulence *
                  0.1,
              density: Math.max(
                0.1,
                point.density +
                  (Math.random() - 0.5) * 0.05 * stellarWindStrength
              ),
            })),
          }))
        );
      },
      [animationSpeed, timeScale, animationTime, stellarWindStrength]
    );

    // Update cosmic dust
    const updateCosmicDust = useCallback(
      (deltaTime: number) => {
        setCosmicDust((prevDust) =>
          prevDust.map((dustCloud: any) => ({
            ...dustCloud,
            particles: dustCloud.particles
              .map((particle: any) => ({
                ...particle,
                x: particle.x + particle.vx * deltaTime * animationSpeed,
                y: particle.y + particle.vy * deltaTime * animationSpeed,
                lifetime: particle.lifetime - deltaTime,
                opacity: Math.max(0, particle.opacity - deltaTime * 0.00005),
              }))
              .filter(
                (particle: any) =>
                  particle.lifetime > 0 &&
                  particle.x > -50 &&
                  particle.x < width + 50 &&
                  particle.y > -50 &&
                  particle.y < height + 50
              ),
          }))
        );
      },
      [animationSpeed, width, height]
    );

    // Nebula evolution simulation
    useEffect(() => {
      const evolutionInterval = setInterval(() => {
        setNebulaAge((prev: any) => {
          const newAge = prev + timeScale * 0.1;

          // Determine evolution phase
          if (newAge < 10) {
            setEvolutionPhase("formation");
          } else if (newAge < 50) {
            setEvolutionPhase("mature");
          } else {
            setEvolutionPhase("dispersing");
          }

          onNebulaEvolution?.(newAge, evolutionPhase);

          // Occasionally trigger star formation
          if (Math.random() < 0.05 * timeScale) {
            const location = {
              x: Math.random() * width,
              y: Math.random() * height,
            };
            onStarFormation?.(location);
            play("success");
          }

          return newAge;
        });
      }, 5000);

      return () => clearInterval(evolutionInterval);
    }, [
      timeScale,
      evolutionPhase,
      onNebulaEvolution,
      onStarFormation,
      width,
      height,
      play,
    ]);

    // Render nebula
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas with deep space background
      const spaceGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
      spaceGradient.addColorStop(0, "rgb(5, 5, 15)");
      spaceGradient.addColorStop(1, "rgb(0, 0, 5)");

      ctx.fillStyle = spaceGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw background stars
      ctx.fillStyle = "white";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const brightness = Math.random();
        ctx.globalAlpha = brightness * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, brightness, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw cosmic dust
      cosmicDust.forEach((dustCloud: any) => {
        dustCloud.particles.forEach((particle: any) => {
          if (particle.opacity < 0.01) return;

          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Draw nebula layers
      ctx.globalAlpha = 1;
      nebulaLayers.forEach((layer, layerIndex) => {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(layer.rotation);
        ctx.scale(layer.scale, layer.scale);
        ctx.translate(-width / 2, -height / 2);

        // Create nebula texture
        layer.points.forEach((point: any) => {
          const adjustedDensity = point.density * density;
          if (adjustedDensity < 0.1) return;

          const size = Math.max(10, (adjustedDensity * 30) / cameraDistance);
          const tempColor =
            ionizationLevel > 0.5
              ? layer.color
              : getTemperatureColor(point.temperature);

          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            size
          );

          gradient.addColorStop(
            0,
            `rgba(${tempColor[0]}, ${tempColor[1]}, ${tempColor[2]}, ${layer.opacity * adjustedDensity})`
          );
          gradient.addColorStop(
            0.5,
            `rgba(${tempColor[0]}, ${tempColor[1]}, ${tempColor[2]}, ${layer.opacity * adjustedDensity * 0.5})`
          );
          gradient.addColorStop(
            1,
            `rgba(${tempColor[0]}, ${tempColor[1]}, ${tempColor[2]}, 0)`
          );

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw emission lines
        if (showEmissionLines && nebulaConfigs[nebulaType].ionizedGas) {
          ctx.globalAlpha = ionizationLevel * 0.3;
          ctx.strokeStyle = `rgb(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]})`;
          ctx.lineWidth = 1;

          for (let i = 0; i < layer.points.length - 1; i += 10) {
            const p1 = layer.points[i];
            const p2 = layer.points[i + 1];
            if (!p1 || !p2) continue;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      // Draw magnetic field lines
      if (showMagneticField) {
        ctx.strokeStyle = "rgba(100, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;

        for (let x = 0; x < width; x += 100) {
          for (let y = 0; y < height; y += 100) {
            const fieldStrength = Math.sin(x * 0.01) * Math.cos(y * 0.01);
            if (Math.abs(fieldStrength) > 0.3) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.bezierCurveTo(
                x + 50,
                y + fieldStrength * 30,
                x + 80,
                y + fieldStrength * 20,
                x + 100,
                y
              );
              ctx.stroke();
            }
          }
        }
      }

      // Draw star clusters
      starClusters.forEach((cluster: any) => {
        cluster.stars.forEach((star: any) => {
          const twinkle =
            Math.sin(animationTime * 0.005 + star.twinklePhase) * 0.3 + 0.7;
          ctx.globalAlpha = star.brightness * twinkle;

          // Create star glow
          const starGradient = ctx.createRadialGradient(
            cluster.x + star.x,
            cluster.y + star.y,
            0,
            cluster.x + star.x,
            cluster.y + star.y,
            star.size * 3
          );
          starGradient.addColorStop(
            0,
            `rgb(${star.color[0]}, ${star.color[1]}, ${star.color[2]})`
          );
          starGradient.addColorStop(
            0.3,
            `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, 0.8)`
          );
          starGradient.addColorStop(
            1,
            `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, 0)`
          );

          ctx.fillStyle = starGradient;
          ctx.beginPath();
          ctx.arc(
            cluster.x + star.x,
            cluster.y + star.y,
            star.size * 3,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Draw star core
          ctx.fillStyle = `rgb(${star.color[0]}, ${star.color[1]}, ${star.color[2]})`;
          ctx.beginPath();
          ctx.arc(
            cluster.x + star.x,
            cluster.y + star.y,
            star.size,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });
      });

      // Nebula info overlay
      if (showNebulaInfo) {
        ctx.save();
        ctx.fillStyle = "var(--glass-text-secondary-dark)";
        ctx.fillRect(10, 10, 250, 160);

        ctx.fillStyle = "white";
        ctx.font = "14px sans-serif";
        ctx.fillText(`Nebula Type: ${nebulaType}`, 20, 30);
        ctx.fillText(`Age: ${nebulaAge.toFixed(1)} million years`, 20, 50);
        ctx.fillText(`Phase: ${evolutionPhase}`, 20, 70);
        ctx.fillText(`Temperature: ${temperature.toLocaleString()} K`, 20, 90);
        ctx.fillText(`Density: ${Math.round(density * 100)}%`, 20, 110);
        ctx.fillText(
          `Ionization: ${Math.round(ionizationLevel * 100)}%`,
          20,
          130
        );
        ctx.fillText(`Star Clusters: ${starClusters.length}`, 20, 150);
        ctx.restore();
      }
    }, [
      width,
      height,
      cosmicDust,
      nebulaLayers,
      density,
      cameraDistance,
      ionizationLevel,
      getTemperatureColor,
      showEmissionLines,
      nebulaType,
      showMagneticField,
      animationTime,
      starClusters,
      showNebulaInfo,
      nebulaAge,
      evolutionPhase,
      temperature,
    ]);

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion && respectMotionPreference) {
        render();
        return;
      }

      const animate = (currentTime: number) => {
        const deltaTime = 16; // 60fps
        setAnimationTime((prev: any) => prev + deltaTime);

        updateNebulaLayers(deltaTime);
        updateCosmicDust(deltaTime);
        render();

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [
      prefersReducedMotion,
      respectMotionPreference,
      render,
      updateNebulaLayers,
      updateCosmicDust,
    ]);

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
          className="glass-nebula-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-glass-glass-backdrop-blur-md glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">Type:</label>
            <select
              value={nebulaType}
              onChange={(e) => {}}
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-contrast-guard glass-focus glass-touch-target"
            >
              <option value="emission">Emission</option>
              <option value="reflection">Reflection</option>
              <option value="dark">Dark</option>
              <option value="planetary">Planetary</option>
              <option value="supernova">Supernova</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">Density:</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={density}
              onChange={(e) => {}}
              className="w-20 glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">Temperature:</label>
            <input
              type="range"
              min="10"
              max="100000"
              step="1000"
              value={temperature}
              onChange={(e) => {}}
              className="w-20 glass-focus glass-touch-target glass-contrast-guard"
            />
            <span className="glass-text-xs">
              {(temperature / 1000).toFixed(1)}K K
            </span>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">Time Scale:</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={timeScale}
              onChange={(e) => {}}
              className="w-20 glass-focus glass-touch-target glass-contrast-guard"
            />
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showStarClusters}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Stars
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showCosmicDust}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Dust
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showEmissionLines}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Emission
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showMagneticField}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Magnetic
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={nebulaCloudsId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-nebula-clouds relative glass-radius-lg glass-glass-backdrop-blur-md border border-border/20",
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="glass-border glass-border-glass-border/20 glass-radius-md glass-surface-dark glass-contrast-guard"
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassNebulaClouds.displayName = "GlassNebulaClouds";

export default GlassNebulaClouds;
