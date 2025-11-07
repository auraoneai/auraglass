'use client';

import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

export interface AuroraLayer {
  points: Array<{ x: number; y: number; intensity: number }>;
  color: [number, number, number];
  opacity: number;
  waveOffset: number;
  waveSpeed: number;
  height: number;
  id: string;
}

export interface SolarWindParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: [number, number, number];
  energy: number;
  lifetime: number;
  id: string;
}

export interface StarField {
  stars: Array<{ x: number; y: number; brightness: number; twinklePhase: number }>;
  shootingStars: Array<{ x: number; y: number; vx: number; vy: number; lifetime: number; trail: Array<{ x: number; y: number; opacity: number }> }>;
  id: string;
}

export interface GlassAuroraDisplayProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Aurora intensity (0-1) */
  intensity?: number;
  /** Solar wind strength */
  solarWindStrength?: number;
  /** Geomagnetic activity level */
  geomagneticActivity?: number;
  /** Aurora colors preset */
  colorPreset?: 'classic' | 'rare' | 'storm' | 'sunset' | 'cosmic';
  /** Whether to show stars */
  showStars?: boolean;
  /** Whether to show solar wind particles */
  showSolarWind?: boolean;
  /** Animation speed multiplier */
  animationSpeed?: number;
  /** Aurora wave complexity */
  waveComplexity?: number;
  /** Number of aurora layers */
  layerCount?: number;
  /** Time of observation (affects visibility) */
  observationTime?: number; // 0-24 hours
  /** Geographic latitude (affects aurora position) */
  latitude?: number; // degrees
  /** Whether to show atmospheric glow */
  showAtmosphericGlow?: boolean;
  /** Aurora activity level */
  activityLevel?: 'low' | 'moderate' | 'high' | 'storm';
  /** Real-time data mode */
  realTimeMode?: boolean;
  /** Aurora change handler */
  onAuroraChange?: (intensity: number, colors: string[]) => void;
  /** Solar event handler */
  onSolarEvent?: (eventType: 'flare' | 'wind' | 'storm') => void;
  /** Show controls */
  showControls?: boolean;
  /** Show aurora info */
  showAuroraInfo?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassAuroraDisplay = forwardRef<HTMLDivElement, GlassAuroraDisplayProps>(
  (
    {
      width = 800,
      height = 500,
      intensity = 0.7,
      solarWindStrength = 0.6,
      geomagneticActivity = 0.5,
      colorPreset = 'classic',
      showStars = true,
      showSolarWind = true,
      animationSpeed = 1,
      waveComplexity = 1,
      layerCount = 4,
      observationTime = 22,
      latitude = 65,
      showAtmosphericGlow = true,
      activityLevel = 'moderate',
      realTimeMode = false,
      onAuroraChange,
      onSolarEvent,
      showControls = true,
      showAuroraInfo = true,
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
    const auroraDisplayId = useA11yId('glass-aurora-display');
    
    const [auroraLayers, setAuroraLayers] = useState<AuroraLayer[]>([]);
    const [solarWindParticles, setSolarWindParticles] = useState<SolarWindParticle[]>([]);
    const [starField, setStarField] = useState<StarField>({ stars: [], shootingStars: [], id: 'starfield' });
    const [animationTime, setAnimationTime] = useState(0);
    const [currentIntensity, setCurrentIntensity] = useState(intensity);
    const [activeColors, setActiveColors] = useState<string[]>([]);

    // Aurora color presets
    const colorPresets = {
      classic: [
        [0, 255, 146],    // Green (oxygen 557.7nm)
        [255, 0, 255],    // Magenta (nitrogen)
        [0, 255, 255],    // Cyan (oxygen 630nm)
        [255, 255, 0]     // Yellow (sodium)
      ],
      rare: [
        [255, 0, 0],      // Red (high altitude oxygen)
        [128, 0, 128],    // Purple (nitrogen)
        [255, 165, 0],    // Orange (sodium)
        [255, 192, 203]   // Pink (nitrogen)
      ],
      storm: [
        [255, 255, 255],  // White (intense activity)
        [255, 0, 0],      // Red (storm conditions)
        [255, 100, 100],  // Light red
        [200, 200, 255]   // Blue-white
      ],
      sunset: [
        [255, 140, 0],    // Dark orange
        [255, 69, 0],     // Red-orange
        [255, 20, 147],   // Deep pink
        [138, 43, 226]    // Blue violet
      ],
      cosmic: [
        [75, 0, 130],     // Indigo
        [148, 0, 211],    // Dark violet
        [0, 191, 255],    // Deep sky blue
        [127, 255, 212]   // Aquamarine
      ]
    };

    // Initialize star field
    const initializeStarField = useCallback(() => {
      const stars = Array.from({ length: 200 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.6, // Stars in upper portion
        brightness: Math.random() * 0.8 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2
      }));

      setStarField((prev: any) => ({ ...prev, stars }));
    }, [width, height]);

    // Generate aurora layers
    const generateAuroraLayers = useCallback(() => {
      const colors = colorPresets[colorPreset];
      const layers: AuroraLayer[] = [];
      
      for (let i = 0; i < layerCount; i++) {
        const points = [];
        const baseY = height * (0.3 + i * 0.15);
        const layerHeight = 60 + i * 20;
        
        // Generate wave points
        for (let x = 0; x <= width; x += 10) {
          points.push({
            x,
            y: baseY + Math.sin(x * 0.01 + i) * (20 + waveComplexity * 10),
            intensity: Math.random() * 0.5 + 0.5
          });
        }
        
        layers.push({
          points,
          color: colors[i % colors.length] as [number, number, number],
          opacity: (currentIntensity * 0.8) * (1 - i * 0.2),
          waveOffset: i * Math.PI / 4,
          waveSpeed: 0.02 + i * 0.01,
          height: layerHeight,
          id: `aurora-layer-${i}`
        });
      }
      
      setAuroraLayers(layers);
      setActiveColors(colors.map((c: any) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`));
      onAuroraChange?.(currentIntensity, colors.map((c: any) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`));
    }, [colorPreset, layerCount, width, height, waveComplexity, currentIntensity, onAuroraChange]);

    // Generate solar wind particles
    const generateSolarWindParticles = useCallback(() => {
      if (!showSolarWind) return;

      const particleCount = Math.floor(solarWindStrength * 50);
      const particles: SolarWindParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: [255, 255, 255],
          energy: Math.random() * solarWindStrength,
          lifetime: Math.random() * 3000 + 1000,
          id: `solar-particle-${i}`
        });
      }

      setSolarWindParticles(particles);
    }, [showSolarWind, solarWindStrength, width]);

    // Initialize all components
    useEffect(() => {
      initializeStarField();
      generateAuroraLayers();
      generateSolarWindParticles();
    }, [initializeStarField, generateAuroraLayers, generateSolarWindParticles]);

    // Update aurora layers
    const updateAuroraLayers = useCallback((deltaTime: number) => {
      setAuroraLayers(prevLayers => 
        prevLayers.map((layer: any) => ({
          ...layer,
          waveOffset: layer.waveOffset + layer.waveSpeed * deltaTime * animationSpeed,
          opacity: Math.max(0, layer.opacity + (Math.random() - 0.5) * 0.02 * geomagneticActivity),
          points: layer.points.map((point: { x: number; y: number; intensity: number }, index: number) => ({
            ...point,
            y: point.y + Math.sin(layer.waveOffset + index * 0.1) * (2 + geomagneticActivity * 3),
            intensity: Math.max(0.3, Math.min(1, point.intensity + (Math.random() - 0.5) * 0.1))
          }))
        }))
      );
    }, [animationSpeed, geomagneticActivity]);

    // Update solar wind particles
    const updateSolarWindParticles = useCallback((deltaTime: number) => {
      setSolarWindParticles(prevParticles => {
        const updated = prevParticles.map((particle: any) => ({
          ...particle,
          x: particle.x + particle.vx * deltaTime * animationSpeed,
          y: particle.y + particle.vy * deltaTime * animationSpeed,
          lifetime: particle.lifetime - deltaTime,
          opacity: Math.max(0, particle.opacity - deltaTime * 0.0005)
        })).filter((particle: any) => 
          particle.lifetime > 0 && 
          particle.x > -50 && particle.x < width + 50 &&
          particle.y < height + 50
        );

        // Add new particles
        if (updated.length < solarWindStrength * 30) {
          const newParticles = Array.from({ length: Math.min(5, Math.floor(solarWindStrength * 30) - updated.length) }, (_, i) => ({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            color: [255, 255, 255] as [number, number, number],
            energy: Math.random() * solarWindStrength,
            lifetime: Math.random() * 3000 + 1000,
            id: `solar-particle-new-${i}-${Date.now()}`
          }));
          
          return [...updated, ...newParticles];
        }

        return updated;
      });
    }, [animationSpeed, solarWindStrength, width, height]);

    // Update shooting stars
    const updateShootingStars = useCallback((deltaTime: number) => {
      setStarField(prevField => {
        const updatedShootingStars = prevField.shootingStars.map((star: any) => ({
          ...star,
          x: star.x + star.vx * deltaTime * animationSpeed,
          y: star.y + star.vy * deltaTime * animationSpeed,
          lifetime: star.lifetime - deltaTime,
          trail: [
            { x: star.x, y: star.y, opacity: 1 },
            ...star.trail.map((t: { x: number; y: number; opacity: number }, i: number) => ({
              ...t,
              opacity: t.opacity * 0.95
            }))
          ].slice(0, 10)
        })).filter((star: any) => star.lifetime > 0 && star.x < width + 100);

        // Occasionally add new shooting stars
        if (Math.random() < 0.001 * animationSpeed) {
          updatedShootingStars.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.3,
            vx: Math.random() * 3 + 2,
            vy: Math.random() * 2 + 1,
            lifetime: Math.random() * 2000 + 1000,
            trail: []
          });
          play('success');
        }

        return { ...prevField, shootingStars: updatedShootingStars };
      });
    }, [animationSpeed, width, height, play]);

    // Solar activity simulation
    useEffect(() => {
      if (!realTimeMode) return;

      const interval = setInterval(() => {
        // Simulate solar events
        if (Math.random() < 0.1) {
          const eventType: 'flare' | 'wind' | 'storm' = 
            Math.random() < 0.3 ? 'flare' :
            Math.random() < 0.6 ? 'wind' : 'storm';
          
          onSolarEvent?.(eventType);
          
          // Adjust parameters based on event
          switch (eventType) {
            case 'flare':
              setCurrentIntensity((prev: any) => Math.min(1, prev + 0.3));
              break;
            case 'wind':
              // Handled in particle updates
              break;
            case 'storm':
              setCurrentIntensity(1);
              play('error');
              break;
          }
        }
      }, 10000);

      return () => clearInterval(interval);
    }, [realTimeMode, onSolarEvent, play]);

    // Render aurora display
    const render = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas with night sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      const isDarkTime = observationTime < 6 || observationTime > 18;
      
      if (isDarkTime) {
        skyGradient.addColorStop(0, 'rgb(10, 10, 30)');
        skyGradient.addColorStop(0.6, 'rgb(5, 5, 15)');
        skyGradient.addColorStop(1, 'rgb(0, 0, 5)');
      } else {
        skyGradient.addColorStop(0, 'rgb(70, 130, 180)');
        skyGradient.addColorStop(1, 'rgb(25, 25, 112)');
      }
      
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      if (showStars && isDarkTime) {
        starField.stars.forEach((star: any) => {
          const twinkle = Math.sin(animationTime * 0.003 + star.twinklePhase) * 0.3 + 0.7;
          ctx.globalAlpha = star.brightness * twinkle;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(star.x, star.y, 1, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw shooting stars
        starField.shootingStars.forEach((star: any) => {
          star.trail.forEach((point: { x: number; y: number; opacity: number }, index: number) => {
            ctx.globalAlpha = point.opacity * (1 - index * 0.1);
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2 - index * 0.2, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }

      // Draw atmospheric glow
      if (showAtmosphericGlow && isDarkTime) {
        const glowGradient = ctx.createRadialGradient(
          width / 2, height * 0.8, 0,
          width / 2, height * 0.8, width
        );
        glowGradient.addColorStop(0, 'rgba(100, 200, 100, 0.1)');
        glowGradient.addColorStop(1, 'rgba(100, 200, 100, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw aurora layers
      ctx.globalAlpha = 1;
      auroraLayers.forEach((layer: any) => {
        if (layer.opacity < 0.01) return;

        // Create gradient for aurora band
        const gradient = ctx.createLinearGradient(0, 0, 0, layer.height);
        gradient.addColorStop(0, `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, 0)`);
        gradient.addColorStop(0.5, `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, ${layer.opacity})`);
        gradient.addColorStop(1, `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Draw aurora curve
        ctx.moveTo(layer.points[0].x, layer.points[0].y + layer.height / 2);
        
        layer.points.forEach((point: { x: number; y: number; intensity: number }, index: number) => {
          if (index === 0) return;

          const prevPoint = layer.points[index - 1];
          const intensityFactor = (point.intensity + prevPoint.intensity) / 2;
          const waveY = point.y + Math.sin(animationTime * 0.001 + index * 0.1) * intensityFactor * 10;
          
          ctx.lineTo(point.x, waveY);
        });
        
        // Complete the shape
        for (let i = layer.points.length - 1; i >= 0; i--) {
          const point = layer.points[i];
          const intensityFactor = point.intensity;
          const waveY = point.y + Math.sin(animationTime * 0.001 + i * 0.1) * intensityFactor * 10;
          ctx.lineTo(point.x, waveY + layer.height);
        }
        
        ctx.closePath();
        ctx.fill();

        // Add shimmer effect
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.3;
        
        const shimmerGradient = ctx.createLinearGradient(
          animationTime * 0.1 % width, 0,
          (animationTime * 0.1 + 100) % width, 0
        );
        shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shimmerGradient.addColorStop(0.5, 'rgba(var(--glass-color-white) / var(--glass-opacity-80))');
        shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = shimmerGradient;
        ctx.fill();
        ctx.restore();
      });

      // Draw solar wind particles
      if (showSolarWind) {
        solarWindParticles.forEach((particle: any) => {
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;
          
          // Add glow effect
          ctx.shadowBlur = particle.energy * 10;
          ctx.shadowColor = `rgb(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]})`;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0;
        });
      }

      // Aurora info overlay
      if (showAuroraInfo) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 220, 160);
        
        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Aurora Intensity: ${Math.round(currentIntensity * 100)}%`, 20, 30);
        ctx.fillText(`Activity Level: ${activityLevel}`, 20, 50);
        ctx.fillText(`Solar Wind: ${Math.round(solarWindStrength * 100)}%`, 20, 70);
        ctx.fillText(`Geomagnetic: ${Math.round(geomagneticActivity * 100)}%`, 20, 90);
        ctx.fillText(`Latitude: ${latitude}°`, 20, 110);
        ctx.fillText(`Time: ${Math.floor(observationTime)}:${String(Math.floor((observationTime % 1) * 60)).padStart(2, '0')}`, 20, 130);
        ctx.fillText(`Visibility: ${isDarkTime ? 'Good' : 'Poor'}`, 20, 150);
        ctx.restore();
      }
    }, [width, height, observationTime, showStars, starField, animationTime, showAtmosphericGlow, auroraLayers, showSolarWind, solarWindParticles, showAuroraInfo, currentIntensity, activityLevel, solarWindStrength, geomagneticActivity, latitude]);

    // Animation loop
    useEffect(() => {
      if (prefersReducedMotion && respectMotionPreference) {
        render();
        return;
      }

      const animate = (currentTime: number) => {
        const deltaTime = 16; // 60fps
        setAnimationTime((prev: any) => prev + deltaTime);
        
        updateAuroraLayers(deltaTime);
        updateSolarWindParticles(deltaTime);
        updateShootingStars(deltaTime);
        render();
        
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [prefersReducedMotion, respectMotionPreference, render, updateAuroraLayers, updateSolarWindParticles, updateShootingStars]);

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
          className="glass-aurora-controls flex flex-wrap items-center gap-4 p-4 glass-radius-lg backdrop-blur-md border border-glass-border/20"
        >
          <div className="flex items-center gap-2">
            <label className="text-sm">Intensity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentIntensity}
              onChange={(e) => setCurrentIntensity(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm min-w-[3ch]">{Math.round(currentIntensity * 100)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Colors:</label>
            <select
              value={colorPreset}
              onChange={(e) => {}}
              className="px-2 py-1 glass-radius-md glass-surface-overlay border border-glass-border/20"
            >
              <option value="classic">Classic</option>
              <option value="rare">Rare</option>
              <option value="storm">Storm</option>
              <option value="sunset">Sunset</option>
              <option value="cosmic">Cosmic</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Activity:</label>
            <select
              value={activityLevel}
              onChange={(e) => {}}
              className="px-2 py-1 glass-radius-md glass-surface-overlay border border-glass-border/20"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="storm">Storm</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Time:</label>
            <input
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={observationTime}
              onChange={(e) => {}}
              className="w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={showStars}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Stars
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={showSolarWind}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Solar Wind
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={realTimeMode}
                onChange={(e) => {}}
                className="glass-mr-1"
              />
              Real-time
            </label>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={auroraDisplayId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-aurora-display relative glass-radius-lg backdrop-blur-md border border-border/20',
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
              className="border border-glass-border/20 glass-radius-md glass-surface-dark"
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassAuroraDisplay.displayName = 'GlassAuroraDisplay';

export default GlassAuroraDisplay;