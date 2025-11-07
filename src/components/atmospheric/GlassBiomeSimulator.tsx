'use client';

import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';

export interface BiomeData {
  type: 'forest' | 'ocean' | 'desert' | 'tundra' | 'grassland' | 'rainforest' | 'mountain' | 'swamp';
  temperature: number;
  humidity: number;
  windSpeed: number;
  lightLevel: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay: number; // 0-24
  id: string;
}

export interface BiomeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: [number, number, number];
  // Extended to include all particle types referenced by biome configs
  type:
    | 'leaf'
    | 'pollen'
    | 'dust'
    | 'sand'
    | 'snow'
    | 'ice'
    | 'spark'
    | 'water'
    | 'droplet'
    | 'spore'
    | 'insect'
    | 'bubble'
    | 'fog'
    | 'cloud';
  lifetime: number;
  rotation: number;
  rotationSpeed: number;
  id: string;
}

export interface BiomeLayer {
  name: string;
  depth: number;
  opacity: number;
  elements: BiomeElement[];
  parallaxSpeed: number;
  id: string;
}

export interface BiomeElement {
  type: 'tree' | 'cloud' | 'mountain' | 'grass' | 'water' | 'rock' | 'flower' | 'animal';
  x: number;
  y: number;
  width: number;
  height: number;
  size?: number;
  color: [number, number, number];
  opacity: number;
  animation?: string;
  id: string;
}

export interface GlassBiomeSimulatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Current biome data */
  biome?: BiomeData;
  /** Particle density multiplier */
  particleDensity?: number;
  /** Animation speed */
  animationSpeed?: number;
  /** Whether to show weather effects */
  showWeatherEffects?: boolean;
  /** Whether to show day/night cycle */
  dayNightCycle?: boolean;
  /** Seasonal transitions */
  seasonalTransitions?: boolean;
  /** Wildlife activity level */
  wildlifeActivity?: number;
  /** Ambient sound levels */
  ambientSoundLevel?: number;
  /** Wind effect strength */
  windStrength?: number;
  /** Whether to show atmospheric layers */
  showAtmosphericLayers?: boolean;
  /** Camera parallax enabled */
  parallaxEnabled?: boolean;
  /** Biome change handler */
  onBiomeChange?: (biome: BiomeData) => void;
  /** Season change handler */
  onSeasonChange?: (season: BiomeData['season']) => void;
  /** Time change handler */
  onTimeChange?: (timeOfDay: number) => void;
  /** Show controls */
  showControls?: boolean;
  /** Show biome info */
  showBiomeInfo?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassBiomeSimulator = forwardRef<HTMLDivElement, GlassBiomeSimulatorProps>(
  (
    {
      width = 800,
      height = 500,
      biome = {
        type: 'forest',
        temperature: 18,
        humidity: 0.7,
        windSpeed: 8,
        lightLevel: 0.8,
        season: 'spring',
        timeOfDay: 12,
        id: 'default-biome'
      },
      particleDensity = 1,
      animationSpeed = 1,
      showWeatherEffects = true,
      dayNightCycle = true,
      seasonalTransitions = true,
      wildlifeActivity = 0.5,
      ambientSoundLevel = 0.3,
      windStrength = 1,
      showAtmosphericLayers = true,
      parallaxEnabled = true,
      onBiomeChange,
      onSeasonChange,
      onTimeChange,
      showControls = true,
      showBiomeInfo = true,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const biomeSimulatorId = useA11yId('glass-biome-simulator');
    
    const [currentBiome, setCurrentBiome] = useState<BiomeData>(biome);
    const [particles, setParticles] = useState<BiomeParticle[]>([]);
    const [biomeLayers, setBiomeLayers] = useState<BiomeLayer[]>([]);
    const [animationTime, setAnimationTime] = useState(0);
    const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

    // Biome configurations (memoized to prevent re-creation each render)
    // Re-creating this object every render invalidated callbacks that depend on it
    // and caused an infinite effect loop that set state on every render.
    const biomeConfigs = React.useMemo(() => ({
      forest: {
        colors: {
          sky: ['#87CEEB', '#98FB98'],
          ground: [34, 139, 34],
          accent: [139, 69, 19]
        },
        particles: ['leaf', 'pollen', 'insect'],
        elements: ['tree', 'grass', 'flower'],
        sounds: ['birds', 'rustling', 'wind']
      },
      ocean: {
        colors: {
          sky: ['#87CEEB', '#E0F6FF'],
          ground: [25, 25, 112],
          accent: [255, 255, 255]
        },
        particles: ['water', 'droplet'],
        elements: ['water', 'cloud'],
        sounds: ['waves', 'seagulls', 'wind']
      },
      desert: {
        colors: {
          sky: ['#FFD700', '#FFA500'],
          ground: [238, 203, 173],
          accent: [160, 82, 45]
        },
        particles: ['dust', 'sand'],
        elements: ['rock', 'cactus'],
        sounds: ['wind', 'sand']
      },
      tundra: {
        colors: {
          sky: ['#B0C4DE', '#F0F8FF'],
          ground: [248, 248, 255],
          accent: [70, 130, 180]
        },
        particles: ['snow', 'ice'],
        elements: ['ice', 'rock'],
        sounds: ['wind', 'ice']
      },
      grassland: {
        colors: {
          sky: ['#87CEEB', '#98FB98'],
          ground: [124, 252, 0],
          accent: [255, 215, 0]
        },
        particles: ['pollen', 'grass'],
        elements: ['grass', 'flower'],
        sounds: ['wind', 'insects']
      },
      rainforest: {
        colors: {
          sky: ['#228B22', '#90EE90'],
          ground: [0, 100, 0],
          accent: [255, 69, 0]
        },
        particles: ['water', 'leaf', 'spore'],
        elements: ['tree', 'vine', 'flower'],
        sounds: ['rain', 'birds', 'insects']
      },
      mountain: {
        colors: {
          sky: ['#4682B4', '#E0F6FF'],
          ground: [105, 105, 105],
          accent: [255, 255, 255]
        },
        particles: ['snow', 'cloud'],
        elements: ['mountain', 'rock', 'snow'],
        sounds: ['wind', 'echo']
      },
      swamp: {
        colors: {
          sky: ['#696969', '#A9A9A9'],
          ground: [85, 107, 47],
          accent: [255, 140, 0]
        },
        particles: ['fog', 'insect', 'bubble'],
        elements: ['water', 'tree', 'fog'],
        sounds: ['frogs', 'insects', 'bubbles']
      }
    }), []);

    // Generate biome layers
    const generateBiomeLayers = useCallback((biomeType: BiomeData['type']) => {
      const config = biomeConfigs[biomeType];
      const layers: BiomeLayer[] = [];

      // Background layer
      layers.push({
        name: 'Background',
        depth: 0,
        opacity: 1,
        parallaxSpeed: 0.1,
        id: 'bg-layer',
        elements: []
      });

      // Far layer
      const farElements: BiomeElement[] = [];
      if (biomeType === 'forest') {
        for (let i = 0; i < 8; i++) {
          farElements.push({
            type: 'tree',
            x: (i * width / 8) + Math.random() * 50,
            y: height * 0.3 + Math.random() * 50,
            width: 60 + Math.random() * 40,
            height: 80 + Math.random() * 60,
            color: [34, 100, 34],
            opacity: 0.6,
            id: `far-tree-${i}`
          });
        }
      } else if (biomeType === 'mountain') {
        for (let i = 0; i < 5; i++) {
          farElements.push({
            type: 'mountain',
            x: i * width / 4,
            y: height * 0.2,
            width: width / 3,
            height: height * 0.6,
            color: [105, 105, 105],
            opacity: 0.7,
            id: `mountain-${i}`
          });
        }
      }

      layers.push({
        name: 'Far',
        depth: 1,
        opacity: 0.8,
        parallaxSpeed: 0.3,
        id: 'far-layer',
        elements: farElements
      });

      // Mid layer
      const midElements: BiomeElement[] = [];
      if (biomeType === 'grassland') {
        for (let i = 0; i < 20; i++) {
          midElements.push({
            type: 'grass',
            x: Math.random() * width,
            y: height * 0.7 + Math.random() * height * 0.2,
            width: 10 + Math.random() * 20,
            height: 20 + Math.random() * 30,
            color: [124, 252, 0],
            opacity: 0.8,
            id: `grass-${i}`
          });
        }
      } else if (biomeType === 'ocean') {
        midElements.push({
          type: 'water',
          x: 0,
          y: height * 0.6,
          width: width,
          height: height * 0.4,
          color: [25, 25, 112],
          opacity: 0.8,
          animation: 'wave',
          id: 'ocean-water'
        });
      }

      layers.push({
        name: 'Mid',
        depth: 2,
        opacity: 0.9,
        parallaxSpeed: 0.6,
        id: 'mid-layer',
        elements: midElements
      });

      // Near layer
      const nearElements: BiomeElement[] = [];
      if (biomeType === 'forest') {
        for (let i = 0; i < 3; i++) {
          nearElements.push({
            type: 'tree',
            x: (i * width / 3) + Math.random() * 100,
            y: height * 0.2,
            width: 80 + Math.random() * 60,
            height: 120 + Math.random() * 80,
            color: [34, 139, 34],
            opacity: 1,
            id: `near-tree-${i}`
          });
        }
      }

      layers.push({
        name: 'Near',
        depth: 3,
        opacity: 1,
        parallaxSpeed: 1,
        id: 'near-layer',
        elements: nearElements
      });

      return layers;
    }, [width, height, biomeConfigs]);

    // Generate particles
    const generateParticles = useCallback((biomeType: BiomeData['type'], count: number) => {
      const config = biomeConfigs[biomeType];
      const newParticles: BiomeParticle[] = [];

      for (let i = 0; i < count; i++) {
        const particleType = config.particles[Math.floor(Math.random() * config.particles.length)] as BiomeParticle['type'];
        
        let particle: Partial<BiomeParticle> = {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 2,
          opacity: Math.random() * 0.8 + 0.2,
          lifetime: Math.random() * 10000 + 5000,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          type: particleType,
          id: `particle-${particleType}-${i}-${Date.now()}`
        };

        switch (particleType) {
          case 'leaf':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 2,
              vy: Math.random() * 1 + 0.5,
              color: [34, 139, 34],
              size: Math.random() * 8 + 4,
              rotationSpeed: (Math.random() - 0.5) * 0.2
            };
            break;

          case 'pollen':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 0.5,
              color: [255, 215, 0],
              size: Math.random() * 3 + 1
            };
            break;

          case 'water':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.5,
              vy: Math.random() * 3 + 2,
              color: [173, 216, 230],
              size: Math.random() * 4 + 2
            };
            break;

          case 'droplet':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.4,
              vy: Math.random() * 2.5 + 1.5,
              color: [173, 216, 230], // light blue
              size: Math.random() * 3 + 1
            };
            break;

          case 'dust':
            particle = {
              ...particle,
              vx: currentBiome.windSpeed * 0.1 + (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 0.5,
              color: [238, 203, 173],
              size: Math.random() * 2 + 1,
              opacity: Math.random() * 0.5 + 0.1
            };
            break;

          case 'sand':
            particle = {
              ...particle,
              vx: currentBiome.windSpeed * 0.15 + (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 0.3,
              color: [237, 201, 175], // sandy color
              size: Math.random() * 2 + 0.5,
              opacity: Math.random() * 0.4 + 0.1
            };
            break;

          case 'snow':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * currentBiome.windSpeed * 0.1,
              vy: Math.random() * 2 + 1,
              color: [255, 255, 255],
              size: Math.random() * 6 + 3,
              rotationSpeed: (Math.random() - 0.5) * 0.1
            };
            break;

          case 'ice':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * currentBiome.windSpeed * 0.08,
              vy: Math.random() * 1.5 + 0.5,
              color: [200, 230, 255], // icy blue
              size: Math.random() * 4 + 2,
              rotationSpeed: (Math.random() - 0.5) * 0.08
            };
            break;

          case 'insect':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              color: [0, 0, 0],
              size: Math.random() * 2 + 1
            };
            break;

          case 'spore':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -Math.random() * 0.5,
              color: [144, 238, 144],
              size: Math.random() * 3 + 1,
              opacity: Math.random() * 0.6 + 0.2
            };
            break;

          case 'fog':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.1,
              color: [210, 210, 220],
              size: Math.random() * 20 + 10,
              opacity: Math.random() * 0.2 + 0.05
            };
            break;

          case 'bubble':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.3,
              vy: -Math.random() * 0.8,
              color: [180, 220, 255],
              size: Math.random() * 5 + 2,
              opacity: Math.random() * 0.5 + 0.2
            };
            break;

          case 'cloud':
            particle = {
              ...particle,
              vx: (Math.random() - 0.5) * 0.2,
              vy: (Math.random() - 0.5) * 0.1,
              color: [220, 220, 230],
              size: Math.random() * 30 + 20,
              opacity: Math.random() * 0.25 + 0.1
            };
            break;
        }

        newParticles.push(particle as BiomeParticle);
      }

      return newParticles;
    }, [width, height, biomeConfigs, currentBiome.windSpeed]);

    // Initialize biome
    useEffect(() => {
      const layers = generateBiomeLayers(currentBiome.type);
      setBiomeLayers(layers);
      
      const particleCount = Math.floor(50 * particleDensity);
      const newParticles = generateParticles(currentBiome.type, particleCount);
      setParticles(newParticles);
    }, [currentBiome.type, generateBiomeLayers, generateParticles, particleDensity]);

    // Update particles
    const updateParticles = useCallback((deltaTime: number) => {
      setParticles(prevParticles => {
        const updated = prevParticles.map(particle => {
          const windEffect = currentBiome.windSpeed * windStrength * 0.01;
          
          return {
            ...particle,
            x: particle.x + (particle.vx + windEffect) * deltaTime * animationSpeed,
            y: particle.y + particle.vy * deltaTime * animationSpeed,
            rotation: particle.rotation + particle.rotationSpeed * deltaTime * animationSpeed,
            lifetime: particle.lifetime - deltaTime
          };
        }).filter(particle => 
          particle.lifetime > 0 &&
          particle.x > -50 && particle.x < width + 50 &&
          particle.y > -50 && particle.y < height + 50
        );

        // Add new particles to maintain count
        if (updated.length < 50 * particleDensity) {
          const needed = Math.min(5, Math.floor(50 * particleDensity) - updated.length);
          const newParticles = generateParticles(currentBiome.type, needed);
          return [...updated, ...newParticles];
        }

        return updated;
      });
    }, [currentBiome, windStrength, animationSpeed, width, height, generateParticles, particleDensity]);

    // Get day/night colors
    const getDayNightColors = useCallback((timeOfDay: number, baseColors: string[]) => {
      if (!dayNightCycle) return baseColors;
      
      const isDay = timeOfDay >= 6 && timeOfDay <= 18;
      const lightIntensity = isDay 
        ? Math.sin(((timeOfDay - 6) / 12) * Math.PI)
        : 0.2;

      return baseColors.map(color => {
        // Parse hex color
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // Apply light intensity
        const newR = Math.round(r * lightIntensity);
        const newG = Math.round(g * lightIntensity);
        const newB = Math.round(b * lightIntensity + (isDay ? 0 : 50));
        
        return `rgb(${newR}, ${newG}, ${newB})`;
      });
    }, [dayNightCycle]);

    // Render biome
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const config = biomeConfigs[currentBiome.type];
      const skyColors = getDayNightColors(currentBiome.timeOfDay, config.colors.sky);

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, skyColors[0]);
      gradient.addColorStop(1, skyColors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw atmospheric layers
      if (showAtmosphericLayers) {
        biomeLayers.forEach(layer => {
          ctx.save();
          ctx.globalAlpha = layer.opacity;
          
          const parallaxOffset = parallaxEnabled ? cameraOffset.x * layer.parallaxSpeed : 0;
          
          layer.elements.forEach(element => {
            ctx.save();
            ctx.translate(element.x + parallaxOffset, element.y);
            ctx.globalAlpha = element.opacity;

            const color = `rgb(${element.color[0]}, ${element.color[1]}, ${element.color[2]})`;

            switch (element.type) {
              case 'tree':
                // Draw simple tree
                ctx.fillStyle = color;
                ctx.fillRect(-element.width * 0.1, 0, element.width * 0.2, element.height * 0.3); // trunk
                ctx.beginPath();
                ctx.ellipse(0, -element.height * 0.3, element.width * 0.5, element.height * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                break;

              case 'mountain':
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(-element.width * 0.5, element.height);
                ctx.lineTo(0, 0);
                ctx.lineTo(element.width * 0.5, element.height);
                ctx.closePath();
                ctx.fill();
                break;

              case 'grass':
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, element.height);
                ctx.quadraticCurveTo(element.width * 0.5, 0, 0, -element.height * 0.5);
                ctx.stroke();
                break;

              case 'cloud':
                // Soft cloud made of overlapping circles
                ctx.fillStyle = color;
                ctx.globalAlpha = element.opacity * 0.6;
                ctx.beginPath();
                const radius = Math.max(10, Math.min(element.width, element.height) * 0.3);
                for (let i = -2; i <= 2; i++) {
                  ctx.moveTo(i * radius * 0.8, 0);
                  ctx.arc(i * radius * 0.8, 0, radius * (1 - Math.abs(i) * 0.1), 0, Math.PI * 2);
                }
                ctx.fill();
                ctx.globalAlpha = element.opacity;
                break;

              case 'water':
                ctx.fillStyle = color;
                ctx.fillRect(-element.width * 0.5, 0, element.width, element.height);
                
                // Add wave effect
                if (element.animation === 'wave') {
                  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                  ctx.lineWidth = 1;
                  const waveOffset = animationTime * 0.002;
                  for (let i = 0; i < element.width; i += 10) {
                    const waveY = Math.sin((i + waveOffset * 100) * 0.02) * 5;
                    ctx.beginPath();
                    ctx.moveTo(i - element.width * 0.5, waveY);
                    ctx.lineTo(i + 5 - element.width * 0.5, waveY);
                    ctx.stroke();
                  }
                }
                break;

              case 'rock':
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(0, 0, element.width * 0.5, element.height * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;

              case 'flower':
                // Draw flower
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, element.size || 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Petals
                ctx.fillStyle = 'rgba(255, 100, 150, 0.8)';
                for (let i = 0; i < 5; i++) {
                  ctx.save();
                  ctx.rotate((i / 5) * Math.PI * 2);
                  ctx.beginPath();
                  ctx.ellipse(0, -8, 3, 6, 0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();
                }
                break;
            }

            ctx.restore();
          });
          
          ctx.restore();
        });
      }

      // Draw particles (guard against malformed data)
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        // Fallback color guard in case a particle was created without a color
        const color = Array.isArray(particle.color)
          ? `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`
          : 'rgb(255, 255, 255)';

        switch (particle.type) {
          case 'leaf':
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size, particle.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'pollen':
          case 'dust':
          case 'sand':
          case 'spore':
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'snow':
          case 'ice':
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Snowflake pattern
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

          case 'water':
          case 'droplet':
          case 'bubble':
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'fog':
          case 'cloud':
            // Render as a soft blurred circle
            const fogGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
            fogGradient.addColorStop(0, `rgba(${Array.isArray(particle.color) ? `${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}` : '255, 255, 255'}, ${Math.min(0.5, particle.opacity)})`);
            fogGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = fogGradient;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'insect':
            ctx.fillStyle = color;
            ctx.fillRect(-particle.size * 0.5, -particle.size * 0.2, particle.size, particle.size * 0.4);
            break;
        }

        ctx.restore();
      });

      // Weather overlay effects
      if (showWeatherEffects) {
        if (currentBiome.humidity > 0.8) {
          ctx.save();
          ctx.globalAlpha = (currentBiome.humidity - 0.8) * 0.5;
          ctx.fillStyle = 'rgba(200, 200, 220, 0.1)';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        if (currentBiome.temperature < 0) {
          ctx.save();
          ctx.globalAlpha = Math.abs(currentBiome.temperature) * 0.01;
          ctx.fillStyle = 'rgba(173, 216, 230, 0.1)';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }

      // Biome info overlay
      if (showBiomeInfo) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 250, 140);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Biome: ${currentBiome.type}`, 20, 30);
        ctx.fillText(`Season: ${currentBiome.season}`, 20, 50);
        ctx.fillText(`Temperature: ${currentBiome.temperature}°C`, 20, 70);
        ctx.fillText(`Humidity: ${Math.round(currentBiome.humidity * 100)}%`, 20, 90);
        ctx.fillText(`Wind: ${Math.round(currentBiome.windSpeed)} km/h`, 20, 110);
        ctx.fillText(`Time: ${Math.floor(currentBiome.timeOfDay)}:${String(Math.floor((currentBiome.timeOfDay % 1) * 60)).padStart(2, '0')}`, 20, 130);
        ctx.restore();
      }
    }, [width, height, biomeConfigs, currentBiome, getDayNightColors, showAtmosphericLayers, biomeLayers, parallaxEnabled, cameraOffset, animationTime, particles, showWeatherEffects, showBiomeInfo]);

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion && respectMotionPreference) {
        render();
        return;
      }

      const animate = (currentTime: number) => {
        const deltaTime = 16; // 60fps
        setAnimationTime(prev => prev + deltaTime);
        
        updateParticles(deltaTime);
        render();
        
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [prefersReducedMotion, respectMotionPreference, render, updateParticles]);

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
          className="glass-biome-controls flex flex-wrap items-center gap-4 p-4 glass-radius-lg backdrop-blur-md border border-glass-border/20"
        >
          <div className="flex items-center gap-2">
            <label className="text-sm">Biome:</label>
            <select
              value={currentBiome.type}
              onChange={(e) => {
                const newBiome = { ...currentBiome, type: e.target.value as any };
                setCurrentBiome(newBiome);
                onBiomeChange?.(newBiome);
              }}
              className="px-2 py-1 glass-radius-md glass-surface-overlay border border-glass-border/20"
            >
              <option value="forest">Forest</option>
              <option value="ocean">Ocean</option>
              <option value="desert">Desert</option>
              <option value="tundra">Tundra</option>
              <option value="grassland">Grassland</option>
              <option value="rainforest">Rainforest</option>
              <option value="mountain">Mountain</option>
              <option value="swamp">Swamp</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Season:</label>
            <select
              value={currentBiome.season}
              onChange={(e) => {
                const newBiome = { ...currentBiome, season: e.target.value as any };
                setCurrentBiome(newBiome);
                onSeasonChange?.(e.target.value as any);
              }}
              className="px-2 py-1 glass-radius-md glass-surface-overlay border border-glass-border/20"
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Time:</label>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={currentBiome.timeOfDay}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentBiome(prev => ({ ...prev, timeOfDay: newTime }));
                onTimeChange?.(newTime);
              }}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={dayNightCycle}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Day/Night
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={parallaxEnabled}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Parallax
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={biomeSimulatorId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-biome-simulator relative glass-radius-lg backdrop-blur-md border border-border/20',
          className
        )}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="flex flex-col gap-4 p-4"
        >
          {renderControls()}
          
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border border-glass-border/20 glass-radius-md"
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassBiomeSimulator.displayName = 'GlassBiomeSimulator';

export default GlassBiomeSimulator;
