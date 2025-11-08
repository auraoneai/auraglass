import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

export interface FluidParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  density: number;
  pressure: number;
  color: [number, number, number, number];
  id: string;
}

export interface FluidForce {
  x: number;
  y: number;
  strength: number;
  type: 'push' | 'pull' | 'vortex' | 'wave';
  radius: number;
  id: string;
}

export interface GlassFluidSimulationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Number of fluid particles */
  particleCount?: number;
  /** Fluid viscosity (0-1) */
  viscosity?: number;
  /** Gravity strength */
  gravity?: number;
  /** Smoothing radius for SPH */
  smoothingRadius?: number;
  /** Rest density of fluid */
  restDensity?: number;
  /** Gas constant for pressure */
  gasConstant?: number;
  /** Damping factor */
  damping?: number;
  /** Whether to show particle trails */
  showTrails?: boolean;
  /** Trail length */
  trailLength?: number;
  /** Fluid color */
  fluidColor?: [number, number, number, number];
  /** Background color */
  backgroundColor?: string;
  /** Whether to enable interactive forces */
  interactive?: boolean;
  /** Force strength multiplier */
  forceStrength?: number;
  /** External forces */
  forces?: FluidForce[];
  /** Animation speed multiplier */
  timeStep?: number;
  /** Whether simulation is paused */
  paused?: boolean;
  /** Frame rate limit */
  maxFPS?: number;
  /** Debug mode */
  debug?: boolean;
  /** Show controls */
  showControls?: boolean;
  /** Fluid preset */
  preset?: 'water' | 'honey' | 'mercury' | 'gas' | 'plasma';
  /** Change handler */
  onChange?: (particles: FluidParticle[]) => void;
  /** Force change handler */
  onForceChange?: (forces: FluidForce[]) => void;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

// Stable defaults defined at module scope to avoid new identities each render
const DEFAULT_FLUID_COLOR: [number, number, number, number] = [100, 150, 255, 0.8];

export const GlassFluidSimulation = forwardRef<HTMLDivElement, GlassFluidSimulationProps>(
  (
    {
      width = 800,
      height = 600,
      particleCount = 200,
      viscosity = 0.1,
      gravity = 0.5,
      smoothingRadius = 25,
      restDensity = 1000,
      gasConstant = 200,
      damping = 0.99,
      showTrails = true,
      trailLength = 10,
      fluidColor = DEFAULT_FLUID_COLOR,
      backgroundColor = 'rgba(var(--glass-color-black) / var(--glass-opacity-10))',
      interactive = true,
      forceStrength = 1,
      forces = [],
      timeStep = 0.016,
      paused = false,
      maxFPS = 60,
      debug = false,
      showControls = true,
      preset = 'water',
      onChange,
      onForceChange,
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
    const lastTimeRef = useRef<number>(0);
    const simulationId = useA11yId('glass-fluid-simulation');
    
    const [particles, setParticles] = useState<FluidParticle[]>([]);
    const [particleHistory, setParticleHistory] = useState<FluidParticle[][]>([]);
    const [currentForces, setCurrentForces] = useState<FluidForce[]>(forces);
    const [isRunning, setIsRunning] = useState(!paused);
    const [fps, setFps] = useState(60);
    const [currentPreset, setCurrentPreset] = useState(preset);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState(false);

    // Stable refs to avoid re-creating callbacks on each render
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    const onForceChangeRef = useRef(onForceChange);
    useEffect(() => {
      onForceChangeRef.current = onForceChange;
    }, [onForceChange]);
    const particlesRef = useRef<FluidParticle[]>(particles);
    useEffect(() => {
      particlesRef.current = particles;
    }, [particles]);


    // Fluid presets
    const fluidPresets = {
      water: {
        viscosity: 0.1,
        gravity: 0.5,
        gasConstant: 200,
        damping: 0.99,
        color: [100, 150, 255, 0.8] as [number, number, number, number]
      },
      honey: {
        viscosity: 0.8,
        gravity: 0.3,
        gasConstant: 150,
        damping: 0.95,
        color: [255, 200, 50, 0.9] as [number, number, number, number]
      },
      mercury: {
        viscosity: 0.2,
        gravity: 0.8,
        gasConstant: 400,
        damping: 0.98,
        color: [192, 192, 192, 0.95] as [number, number, number, number]
      },
      gas: {
        viscosity: 0.05,
        gravity: -0.1,
        gasConstant: 100,
        damping: 0.999,
        color: [200, 255, 200, 0.3] as [number, number, number, number]
      },
      plasma: {
        viscosity: 0.01,
        gravity: 0.1,
        gasConstant: 300,
        damping: 0.997,
        color: [255, 100, 255, 0.7] as [number, number, number, number]
      }
    };

    // Initialize particles
    const initializeParticles = useCallback(() => {
      const newParticles: FluidParticle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.8 + height * 0.1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          density: restDensity,
          pressure: 0,
          color: [...fluidColor],
          id: `particle-${i}`
        });
      }
      
      setParticles(newParticles);
      setParticleHistory([newParticles]);
      onChangeRef.current?.(newParticles);
    }, [particleCount, width, height, restDensity]);

    // Initialize on mount
    useEffect(() => {
      // Initialize on mount and when core dimensions change.
      initializeParticles();
      // Intentionally avoid `fluidColor` here to prevent an update loop
      // when a new array instance is created each render.
    }, [particleCount, width, height, restDensity, initializeParticles]);

    // Apply preset changes
    useEffect(() => {
      const presetConfig = fluidPresets[currentPreset];
      // Update fluid properties based on preset
      // This would typically update the simulation parameters
    }, [currentPreset]);

    // SPH density calculation
    const calculateDensity = useCallback((particles: FluidParticle[]) => {
      const h = smoothingRadius;
      const h2 = h * h;
      
      particles.forEach((particle: any) => {
        let density = 0;
        
        particles.forEach((neighbor: any) => {
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distance2 = dx * dx + dy * dy;
          
          if (distance2 < h2) {
            const distance = Math.sqrt(distance2);
            const influence = Math.max(0, h - distance);
            density += influence * influence;
          }
        });
        
        particle.density = Math.max(density, restDensity);
        particle.pressure = gasConstant * (particle.density - restDensity);
      });
    }, [smoothingRadius, restDensity, gasConstant]);

    // SPH force calculation
    const calculateForces = useCallback((particles: FluidParticle[]) => {
      const h = smoothingRadius;
      
      particles.forEach((particle: any) => {
        let fx = 0, fy = 0;
        
        // Pressure and viscosity forces
        particles.forEach((neighbor: any) => {
          if (particle.id === neighbor.id) return;
          
          const dx = particle.x - neighbor.x;
          const dy = particle.y - neighbor.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < h && distance > 0) {
            const influence = (h - distance) / h;
            
            // Pressure force
            const pressureForce = (particle.pressure + neighbor.pressure) / (2 * neighbor.density) * influence;
            fx += (dx / distance) * pressureForce;
            fy += (dy / distance) * pressureForce;
            
            // Viscosity force
            const viscosityForce = viscosity * influence / neighbor.density;
            fx += (neighbor.vx - particle.vx) * viscosityForce;
            fy += (neighbor.vy - particle.vy) * viscosityForce;
          }
        });
        
        // Apply external forces
        currentForces.forEach((force: any) => {
          const dx = particle.x - force.x;
          const dy = particle.y - force.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < force.radius) {
            const influence = (force.radius - distance) / force.radius;
            const forceAmount = force.strength * influence * forceStrength;
            
            switch (force.type) {
              case 'push':
                if (distance > 0) {
                  fx += (dx / distance) * forceAmount;
                  fy += (dy / distance) * forceAmount;
                }
                break;
              case 'pull':
                if (distance > 0) {
                  fx -= (dx / distance) * forceAmount;
                  fy -= (dy / distance) * forceAmount;
                }
                break;
              case 'vortex':
                fx += -dy * forceAmount * 0.01;
                fy += dx * forceAmount * 0.01;
                break;
              case 'wave':
                fx += Math.sin(Date.now() * 0.001) * forceAmount;
                fy += Math.cos(Date.now() * 0.001) * forceAmount;
                break;
            }
          }
        });
        
        // Interactive mouse force
        if (interactive && isMouseDown) {
          const dx = particle.x - mousePos.x;
          const dy = particle.y - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100 && distance > 0) {
            const influence = (100 - distance) / 100;
            const mouseForce = 50 * influence * forceStrength;
            fx -= (dx / distance) * mouseForce;
            fy -= (dy / distance) * mouseForce;
          }
        }
        
        // Gravity
        fy += gravity;
        
        // Update velocity
        particle.vx += fx * timeStep;
        particle.vy += fy * timeStep;
        
        // Apply damping
        particle.vx *= damping;
        particle.vy *= damping;
      });
    }, [smoothingRadius, viscosity, currentForces, forceStrength, interactive, isMouseDown, mousePos, gravity, timeStep, damping]);

    // Update particle positions
    const updatePositions = useCallback((particles: FluidParticle[]) => {
      particles.forEach((particle: any) => {
        // Update position
        particle.x += particle.vx * timeStep;
        particle.y += particle.vy * timeStep;
        
        // Boundary collisions
        if (particle.x < 10) {
          particle.x = 10;
          particle.vx = Math.abs(particle.vx) * 0.5;
        }
        if (particle.x > width - 10) {
          particle.x = width - 10;
          particle.vx = -Math.abs(particle.vx) * 0.5;
        }
        if (particle.y < 10) {
          particle.y = 10;
          particle.vy = Math.abs(particle.vy) * 0.5;
        }
        if (particle.y > height - 10) {
          particle.y = height - 10;
          particle.vy = -Math.abs(particle.vy) * 0.5;
        }
        
        // Update particle color based on velocity
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const speedNormalized = Math.min(speed / 10, 1);
        particle.color[0] = fluidColor[0] + speedNormalized * 100;
        particle.color[1] = fluidColor[1];
        particle.color[2] = fluidColor[2] + speedNormalized * 50;
      });
    }, [timeStep, width, height, fluidColor]);

    // Render simulation
    const render = useCallback((particles: FluidParticle[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Draw trails
      if (showTrails && particleHistory.length > 1) {
        particleHistory.forEach((historyParticles, historyIndex) => {
          const alpha = (historyIndex / particleHistory.length) * 0.3;
          
          historyParticles.forEach((particle: any) => {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }
      
      // Draw particles
      ctx.globalAlpha = 1;
      particles.forEach((particle: any) => {
        const size = Math.max(2, particle.density / restDensity * 4);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size
        );
        gradient.addColorStop(0, `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${particle.color[3]})`);
        gradient.addColorStop(1, `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw forces
      currentForces.forEach((force: any) => {
        ctx.strokeStyle = force.type === 'push' ? 'red' : 
                         force.type === 'pull' ? 'blue' : 
                         force.type === 'vortex' ? 'purple' : 'green';
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(force.x, force.y, force.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Draw debug info
      if (debug) {
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.globalAlpha = 1;
        ctx.fillText(`FPS: ${fps}`, 10, 20);
        ctx.fillText(`Particles: ${particles.length}`, 10, 40);
        ctx.fillText(`Forces: ${currentForces.length}`, 10, 60);
      }
      
      // Draw interactive mouse force
      if (interactive && isMouseDown) {
        ctx.strokeStyle = 'yellow';
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 100, 0, Math.PI * 2);
        ctx.stroke();
      }
    }, [backgroundColor, width, height, showTrails, particleHistory, restDensity, currentForces, debug, fps, interactive, isMouseDown, mousePos]);

    // Animation loop
    const animate = useCallback((currentTime: number) => {
      if (prefersReducedMotion && respectMotionPreference) {
        return;
      }
      
      if (!isRunning) return;
      
      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime < 1000 / maxFPS) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = currentTime;
      setFps(Math.round(1000 / deltaTime));
      
      setParticles(prevParticles => {
        const newParticles = [...prevParticles];
        
        // SPH simulation steps
        calculateDensity(newParticles);
        calculateForces(newParticles);
        updatePositions(newParticles);
        
        // Update history for trails
        if (showTrails) {
          setParticleHistory(prevHistory => {
            const newHistory = [...prevHistory, [...newParticles]];
            return newHistory.slice(-trailLength);
          });
        }
        
        onChangeRef.current?.(newParticles);
        // keep ref in sync for rendering
        particlesRef.current = newParticles;
        return newParticles;
      });
      
      render(particlesRef.current);
      animationRef.current = requestAnimationFrame(animate);
    }, [prefersReducedMotion, respectMotionPreference, isRunning, maxFPS, calculateDensity, calculateForces, updatePositions, showTrails, trailLength, render]);

    // Start animation
    useEffect(() => {
      if (isRunning && !prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [animate, isRunning, prefersReducedMotion]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
      }
    }, [width, height]);

    // Mouse event handlers
    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }, []);

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsMouseDown(true);
      play('tap');
    }, [play]);

    const handleMouseUp = useCallback(() => {
      setIsMouseDown(false);
    }, []);

    // Add force
    const addForce = useCallback((force: Omit<FluidForce, 'id'>) => {
      const newForce: FluidForce = {
        ...force,
        id: `force-${Date.now()}-${Math.random()}`
      };
      
      setCurrentForces((prev: any) => {
        const updated = [...prev, newForce];
        onForceChangeRef.current?.(updated);
        return updated;
      });
      play('success');
    }, [play]);

    // Remove force
    const removeForce = useCallback((forceId: string) => {
      setCurrentForces((prev: any) => {
        const updated = prev.filter((f: any) => f.id !== forceId);
        onForceChangeRef.current?.(updated);
        return updated;
      });
      play('error');
    }, [play]);

    // Control panel
    const renderControls = () => {
      if (!showControls) return null;
      
      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-fluid-controls flex flex-wrap items-center gap-4 p-4 glass-radius-lg glass-glass-backdrop-blur-md border border-glass-border/20 glass-contrast-guard"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 text-primary"
            >
              {isRunning ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={initializeParticles}
              className="px-3 py-1 glass-radius-md bg-secondary/20 hover:bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              Reset
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Preset:</label>
            <select
              value={currentPreset}
              onChange={(e) => setCurrentPreset(e.target.value as any)}
              className="px-2 py-1 glass-radius-md glass-surface-overlay border border-glass-border/20"
            >
              {Object.keys(fluidPresets).map((preset: any) => (
                <option key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => addForce({ x: width/2, y: height/2, strength: 10, type: 'push', radius: 50 })}
              className="px-2 py-1 glass-radius-md glass-surface-red/20 hover:glass-surface-red/30 text-primary text-sm"
            >
              Add Push
            </button>
            <button
              onClick={() => addForce({ x: width/2, y: height/2, strength: 10, type: 'pull', radius: 50 })}
              className="px-2 py-1 glass-radius-md glass-surface-blue/20 hover:glass-surface-blue/30 text-primary text-sm"
            >
              Add Pull
            </button>
            <button
              onClick={() => addForce({ x: width/2, y: height/2, strength: 10, type: 'vortex', radius: 100 })}
              className="px-2 py-1 glass-radius-md glass-surface-primary/20 hover:glass-surface-primary/30 text-primary text-sm"
            >
              Add Vortex
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={showTrails}
                onChange={(e) => setParticleHistory([])}
                className="glass-mr-1"
              />
              Trails
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => {}}
                className="glass-mr-1"
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
        id={simulationId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-fluid-simulation relative glass-radius-lg glass-backdrop-blur-md border border-border/20',
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
              className={cn(
                'border border-border/20 glass-radius-md bg-black/10',
                interactive && 'cursor-crosshair'
              )}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width, height }}
            />
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassFluidSimulation.displayName = 'GlassFluidSimulation';

export default GlassFluidSimulation;
