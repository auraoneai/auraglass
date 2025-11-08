import React, { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreferenceContext } from '../../contexts/MotionPreferenceContext';
import { useGlassSound } from '../../utils/soundDesign';

export interface HologramLayer {
  id: string;
  type: 'image' | 'video' | 'text' | 'shape' | 'particle';
  content?: string | React.ReactNode;
  source?: string;
  opacity: number;
  depth: number; // Z-axis position
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  animation?: {
    type: 'rotate' | 'float' | 'pulse' | 'fade' | 'wave' | 'spiral';
    speed: number;
    amplitude: number;
    enabled: boolean;
  };
  glitch?: {
    enabled: boolean;
    intensity: number;
    frequency: number;
  };
  holographic?: {
    interference: boolean;
    chromatic: boolean;
    scanlines: boolean;
    noise: number;
  };
}

export interface HologramProjection {
  angle: number; // Viewing angle
  distance: number; // Distance from viewer
  height: number; // Projection height
  tilt: number; // Vertical tilt
}

export interface GlassHologramProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hologram layers */
  layers: HologramLayer[];
  /** Projection settings */
  projection?: HologramProjection;
  /** Holographic effects intensity */
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  /** Color scheme */
  colorScheme?: 'blue' | 'green' | 'red' | 'purple' | 'cyan' | 'white' | 'rainbow';
  /** Environment lighting */
  ambientLight?: number;
  /** Whether to enable auto-rotation */
  autoRotate?: boolean;
  /** Auto-rotation speed */
  rotationSpeed?: number;
  /** Whether to respond to mouse movement */
  interactive?: boolean;
  /** Hologram size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background pattern */
  background?: 'none' | 'grid' | 'circuit' | 'matrix' | 'particles';
  /** Scan line effect */
  scanLines?: boolean;
  /** Glitch effects */
  glitchEnabled?: boolean;
  /** Chromatic aberration */
  chromaticAberration?: boolean;
  /** Noise overlay */
  noiseOverlay?: boolean;
  /** Depth of field blur */
  depthOfField?: boolean;
  /** Layer selection handler */
  onLayerSelect?: (layer: HologramLayer) => void;
  /** Projection change handler */
  onProjectionChange?: (projection: HologramProjection) => void;
  /** Custom shader effects */
  customShaders?: string[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Controls overlay */
  showControls?: boolean;
  /** Debug mode */
  debug?: boolean;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassHologram = forwardRef<HTMLDivElement, GlassHologramProps>(
  (
    {
      layers,
      projection = { angle: 0, distance: 100, height: 200, tilt: 0 },
      intensity = 'medium',
      colorScheme = 'cyan',
      ambientLight = 0.3,
      autoRotate = false,
      rotationSpeed = 1,
      interactive = true,
      size = 'md',
      background = 'grid',
      scanLines = true,
      glitchEnabled = false,
      chromaticAberration = true,
      noiseOverlay = true,
      depthOfField = true,
      onLayerSelect,
      onProjectionChange,
      customShaders = [],
      loading = false,
      error,
      showControls = true,
      debug = false,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion } = useMotionPreferenceContext();
    const { play, feedback } = useGlassSound();
    const hologramId = useA11yId('glass-hologram');
    
    const [currentProjection, setCurrentProjection] = useState(projection);
    const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [animationTime, setAnimationTime] = useState(0);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const hologramRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();

    // Size configurations
    const sizeConfig = {
      sm: { width: 200, height: 150, scale: 0.8 },
      md: { width: 300, height: 225, scale: 1 },
      lg: { width: 400, height: 300, scale: 1.2 },
      xl: { width: 500, height: 375, scale: 1.5 },
    };

    const config = sizeConfig[size];

    // Color scheme configurations
    const colorSchemes = {
      blue: { primary: 'var(--glass-color-primary)', secondary: '#1E40AF', accent: 'var(--glass-color-primary-light)' },
      green: { primary: 'var(--glass-color-success)', secondary: '#047857', accent: 'var(--glass-color-success-light)' },
      red: { primary: 'var(--glass-color-danger)', secondary: '#B91C1C', accent: 'var(--glass-color-danger-light)' },
      purple: { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' },
      cyan: { primary: '#06B6D4', secondary: '#0891B2', accent: '#22D3EE' },
      white: { primary: 'var(--glass-white)', secondary: 'var(--glass-gray-200)', accent: 'var(--glass-gray-100)' },
      rainbow: { primary: '#FF0080', secondary: '#00FF80', accent: '#8000FF' },
    };

    const colors = colorSchemes[colorScheme];

    // Animation loop
    useEffect(() => {
      const animate = () => {
        setAnimationTime((prev: any) => prev + 0.016); // ~60fps

        if (autoRotate) {
          setCurrentProjection((prev: any) => ({
            ...prev,
            angle: (prev.angle + rotationSpeed * 0.5) % 360
          }));
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      if (!prefersReducedMotion && !loading) {
        animate();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [prefersReducedMotion, loading, autoRotate, rotationSpeed]);

    // Handle mouse movement for interactive projection
    const handleMouseMove = useCallback((event: React.MouseEvent) => {
      if (!interactive || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      setMousePosition({ x, y });

      if (interactive) {
        const newProjection = {
          ...currentProjection,
          angle: currentProjection.angle + x * 10,
          tilt: currentProjection.tilt + y * 5,
        };
        
        setCurrentProjection(newProjection);
        onProjectionChange?.(newProjection);
      }
    }, [interactive, currentProjection, onProjectionChange]);

    // Calculate layer transform
    const getLayerTransform = useCallback((layer: HologramLayer) => {
      let transform = '';

      // Base positioning
      const { x, y, z } = layer.position;
      const { x: scaleX, y: scaleY, z: scaleZ } = layer.scale;
      const { x: rotX, y: rotY, z: rotZ } = layer.rotation;

      // Animation transforms
      let animX = x, animY = y, animZ = z;
      let animRotX = rotX, animRotY = rotY, animRotZ = rotZ;
      let animScale = 1;

      if (layer.animation?.enabled) {
        const { type, speed, amplitude } = layer.animation;
        const time = animationTime * speed;

        switch (type) {
          case 'float':
            animY += Math.sin(time) * amplitude;
            break;
          case 'rotate':
            animRotY += time * 50;
            break;
          case 'pulse':
            animScale = 1 + Math.sin(time) * amplitude * 0.2;
            break;
          case 'wave':
            animX += Math.sin(time) * amplitude;
            animZ += Math.cos(time) * amplitude;
            break;
          case 'spiral':
            animX += Math.sin(time) * amplitude;
            animY += Math.cos(time) * amplitude;
            animRotZ += time * 30;
            break;
        }
      }

      // Projection-based transforms
      const perspective = 800;
      const projectionScale = perspective / (perspective + layer.depth);
      
      transform += `perspective(${perspective}px) `;
      transform += `translate3d(${animX}px, ${animY}px, ${animZ}px) `;
      transform += `rotateX(${animRotX + currentProjection.tilt}deg) `;
      transform += `rotateY(${animRotY + currentProjection.angle}deg) `;
      transform += `rotateZ(${animRotZ}deg) `;
      transform += `scale3d(${scaleX * animScale * projectionScale}, ${scaleY * animScale * projectionScale}, ${scaleZ * animScale}) `;

      return transform;
    }, [animationTime, currentProjection]);

    // Calculate layer style
    const getLayerStyle = useCallback((layer: HologramLayer) => {
      const style: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: getLayerTransform(layer),
        transformOrigin: 'center center',
        opacity: layer.opacity,
        zIndex: Math.round(100 - layer.depth),
        pointerEvents: selectedLayer === layer.id ? 'auto' : 'none',
      };

      // Holographic effects
      if (layer.holographic?.chromatic && chromaticAberration) {
        style.filter = `drop-shadow(2px 0 0 ${colors.primary}40) drop-shadow(-2px 0 0 ${colors.secondary}40)`;
      }

      if (layer.holographic?.interference) {
        style.background = `linear-gradient(90deg, transparent 49%, ${colors.accent}20 50%, transparent 51%)`;
        style.backgroundSize = '2px 100%';
        style.animation = !prefersReducedMotion ? 'interference 2s linear infinite' : undefined;
      }

      // Glitch effects
      if (layer.glitch?.enabled && glitchEnabled) {
        const glitchIntensity = layer.glitch.intensity;
        const offset = Math.random() * glitchIntensity;
        style.transform += ` translateX(${offset}px)`;
        
        if (Math.random() < layer.glitch.frequency) {
          style.filter = (style.filter || '') + ` hue-rotate(${Math.random() * 360}deg)`;
        }
      }

      return style;
    }, [getLayerTransform, selectedLayer, colors, chromaticAberration, glitchEnabled, prefersReducedMotion]);

    // Handle layer click
    const handleLayerClick = useCallback((layer: HologramLayer) => {
      setSelectedLayer(layer.id === selectedLayer ? null : layer.id);
      onLayerSelect?.(layer);
      feedback('tap');
    }, [selectedLayer, onLayerSelect, feedback]);

    // Render layer content
    const renderLayerContent = useCallback((layer: HologramLayer) => {
      switch (layer.type) {
        case 'text':
          return (
            <div 
              className={cn(
                'text-center font-mono whitespace-nowrap',
                'select-none pointer-events-none'
              )}
              style={{ 
                color: colors.primary,
                textShadow: `0 0 10px ${colors.primary}80`,
                fontSize: `${config.scale}rem`
              }}
            >
              {layer.content}
            </div>
          );

        case 'image':
          return (
            <img
              src={layer.source}
              alt={layer.id}
              className="max-w-full max-h-full object-contain select-none"
              style={{
                filter: `drop-shadow(0 0 20px ${colors.primary}60)`,
              }}
              draggable={false}
            />
          );

        case 'video':
          return (
            <video
              src={layer.source}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: `drop-shadow(0 0 20px ${colors.primary}60)`,
              }}
              autoPlay
              muted
              loop
              playsInline
            />
          );

        case 'shape':
          return (
            <div 
              className="w-16 h-16 border-2 glass-radius-lg"
              style={{
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}20`,
                boxShadow: `0 0 20px ${colors.primary}60, inset 0 0 10px ${colors.primary}40`,
              }}
            />
          );

        case 'particle':
          return (
            <div className="relative w-20 h-20">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 glass-radius-full"
                  style={{
                    backgroundColor: colors.accent,
                    boxShadow: `0 0 4px ${colors.accent}`,
                    left: `${Math.cos((i / 8) * Math.PI * 2) * 30 + 40}px`,
                    top: `${Math.sin((i / 8) * Math.PI * 2) * 30 + 40}px`,
                    animation: !prefersReducedMotion ? `particle-orbit ${2 + i * 0.2}s linear infinite` : undefined,
                  }}
                />
              ))}
            </div>
          );

        default:
          return layer.content;
      }
    }, [colors, config.scale, prefersReducedMotion]);

    // Render background pattern
    const renderBackground = useCallback(() => {
      switch (background) {
        case 'grid':
          return (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(${colors.primary}40 1px, transparent 1px),
                  linear-gradient(90deg, ${colors.primary}40 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />
          );

        case 'circuit':
          return (
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                {Array.from({ length: 10 }, (_, i) => (
                  <g key={i}>
                    <path
                      d={`M${i * 30} 0 L${i * 30} ${config.height} M0 ${i * 25} L${config.width} ${i * 25}`}
                      stroke={colors.primary}
                      strokeWidth="0.5"
                      fill="none"
                    />
                    <circle
                      cx={i * 30}
                      cy={i * 25}
                      r="2"
                      fill={colors.accent}
                    />
                  </g>
                ))}
              </svg>
            </div>
          );

        case 'matrix':
          return (
            <div 
              className="absolute inset-0 opacity-15 font-mono text-xs overflow-hidden"
              style={{ color: colors.primary }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute whitespace-nowrap animate-pulse"
                  style={{
                    left: `${i * 5}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  {Math.random().toString(36).substring(7)}
                </div>
              ))}
            </div>
          );

        case 'particles':
          return (
            <div className="absolute inset-0">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 glass-radius-full opacity-30"
                  style={{
                    backgroundColor: colors.accent,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: !prefersReducedMotion ? `float ${3 + Math.random() * 2}s ease-in-out infinite alternate` : undefined,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          );

        default:
          return null;
      }
    }, [background, colors, config, prefersReducedMotion]);

    // Render scan lines overlay
    const renderScanLines = () => {
      if (!scanLines) return null;

      return (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div 
            className="w-full h-full"
            ref={(el)=>{ if(!el) return; el.style.background = `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colors.primary}40 2px, ${colors.primary}40 4px)`; el.style.animation = !prefersReducedMotion ? 'scan 2s linear infinite' : ''; }}
          />
        </div>
      );
    };

    // Render noise overlay
    const renderNoiseOverlay = () => {
      if (!noiseOverlay) return null;

      return (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          ref={(el)=>{ if(!el) return; el.style.background = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"; el.style.animation = !prefersReducedMotion ? 'noise 0.2s steps(10) infinite' : ''; }}
        />
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={hologramId}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-hologram relative glass-radius-lg glass-backdrop-blur-md border border-border/20 overflow-hidden',
          className
        )}
        style={{
          width: config.width,
          height: config.height,
          background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        <Motion
          preset={!prefersReducedMotion && respectMotionPreference ? "fadeIn" : "none"}
          className="relative w-full h-full"
        >
          {/* Background Pattern */}
          {renderBackground()}

          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-12 h-12 border-4 border-t-transparent glass-radius-full animate-spin"
                  style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                />
                <div className="text-sm" style={{ color: colors.primary }}>
                  Initializing Hologram...
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="text-sm" style={{ color: colors.primary }}>
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Hologram Container */}
          {!loading && !error && (
            <div
              ref={hologramRef}
              className="relative w-full h-full"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '800px',
              }}
            >
              {/* Hologram Layers */}
              {layers.map((layer, index) => (
                <Motion
                  key={layer.id}
                  preset={!prefersReducedMotion && respectMotionPreference ? "scaleIn" : "none"}
                  delay={index * 100}
                >
                  <div
                    className={cn(
                      'hologram-layer cursor-pointer transition-all duration-200',
                      selectedLayer === layer.id && 'ring-2 ring-offset-2',
                      layer.holographic?.scanlines && 'scanning'
                    )}
                    style={{
                      ...getLayerStyle(layer),
                      '--ring-color': colors.accent,
                    } as React.CSSProperties}
                    onClick={() => handleLayerClick(layer)}
                  >
                    {renderLayerContent(layer)}
                  </div>
                </Motion>
              ))}
            </div>
          )}

          {/* Scan Lines Overlay */}
          {renderScanLines()}

          {/* Noise Overlay */}
          {renderNoiseOverlay()}

          {/* Controls */}
          {showControls && !loading && !error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <OptimizedGlass
                elevation="level3"
                intensity="strong"
                depth={2}
                tint="neutral"
                border="subtle"
                className="flex items-center gap-2 px-4 py-2 glass-radius-lg glass-glass-backdrop-blur-md border border-glass-border/20 glass-contrast-guard"
              >
                <button
                  onClick={() => setCurrentProjection((prev: any) => ({ ...prev, angle: (prev.angle + 90) % 360 }))}
                  className="p-1 glass-radius-md hover:glass-surface-overlay transition-all"
                  title="Rotate"
                  style={{ color: colors.primary }}
                >
                  🔄
                </button>
                
                <button
                  onClick={() => setCurrentProjection((prev: any) => ({ ...prev, distance: prev.distance === 100 ? 150 : 100 }))}
                  className="p-1 glass-radius-md hover:glass-surface-overlay transition-all"
                  title="Zoom"
                  style={{ color: colors.primary }}
                >
                  🔍
                </button>

                <div className="text-xs" style={{ color: colors.primary }}>
                  Layers: {layers.length}
                </div>
              </OptimizedGlass>
            </div>
          )}

          {/* Debug Info */}
          {debug && !loading && !error && (
            <OptimizedGlass
              elevation="level2"
              intensity="medium"
              depth={1}
              tint="neutral"
              border="subtle"
              className="absolute top-4 left-4 p-3 glass-radius-lg glass-glass-backdrop-blur-md border border-glass-border/20 glass-contrast-guard"
            >
              <div className="text-xs font-mono gap-1" style={{ color: colors.primary }}>
                <div>Angle: {currentProjection.angle.toFixed(1)}°</div>
                <div>Tilt: {currentProjection.tilt.toFixed(1)}°</div>
                <div>Distance: {currentProjection.distance}</div>
                <div>Layers: {layers.length}</div>
                <div>Selected: {selectedLayer || 'None'}</div>
                <div>Interactive: {interactive ? 'Yes' : 'No'}</div>
                <div>Auto-rotate: {autoRotate ? 'Yes' : 'No'}</div>
              </div>
            </OptimizedGlass>
          )}

          {/* Interaction Indicator */}
          {interactive && isHovering && (
            <div className="absolute top-4 right-4">
              <div 
                className="w-3 h-3 glass-radius-full animate-pulse"
                style={{ backgroundColor: colors.accent }}
              />
            </div>
          )}
        </Motion>

        {/* CSS Animations */}
        <style>{`
          @keyframes interference {
            0%, 100% { background-position: 0 0; }
            50% { background-position: 100% 0; }
          }
          
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          
          @keyframes noise {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.2; }
          }
          
          @keyframes particle-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(-10px); }
          }
          
          .scanning::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: ${colors.primary};
            animation: scan 2s linear infinite;
          }
        `}</style>
      </OptimizedGlass>
    );
  }
);

GlassHologram.displayName = 'GlassHologram';

export default GlassHologram;
