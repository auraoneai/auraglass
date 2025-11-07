'use client';

import React, { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
import { useMotionPreference } from '../../hooks/useMotionPreference';

export interface ARObject {
  id: string;
  name: string;
  modelUrl?: string;
  thumbnail?: string;
  scale: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  visible: boolean;
  opacity: number;
  material?: {
    color?: string;
    metalness?: number;
    roughness?: number;
    emissive?: string;
    texture?: string;
  };
  animation?: {
    type: 'rotate' | 'float' | 'pulse' | 'bounce';
    speed: number;
    enabled: boolean;
  };
  metadata?: Record<string, any>;
}

export interface ARMarker {
  id: string;
  type: 'qr' | 'image' | 'nft' | 'barcode';
  source: string;
  size?: number;
  confident?: number;
}

export interface ARCamera {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

export interface ARLighting {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
    castShadow: boolean;
  };
  environment?: string;
}

export interface GlassARPreviewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** AR objects to display */
  objects: ARObject[];
  /** AR markers for tracking */
  markers?: ARMarker[];
  /** Camera configuration */
  camera?: ARCamera;
  /** Lighting setup */
  lighting?: ARLighting;
  /** Background mode */
  background?: 'transparent' | 'camera' | 'environment' | 'color';
  /** Background color if mode is 'color' */
  backgroundColor?: string;
  /** Environment map URL */
  environmentMap?: string;
  /** Whether to enable camera feed */
  enableCamera?: boolean;
  /** Whether to show debug info */
  debug?: boolean;
  /** AR session state */
  sessionActive?: boolean;
  /** WebXR support level */
  xrMode?: 'immersive-ar' | 'inline' | 'viewer';
  /** Performance settings */
  quality?: 'low' | 'medium' | 'high';
  /** Object interaction handlers */
  onObjectSelect?: (object: ARObject) => void;
  onObjectMove?: (objectId: string, position: { x: number; y: number; z: number }) => void;
  onObjectRotate?: (objectId: string, rotation: { x: number; y: number; z: number }) => void;
  onObjectScale?: (objectId: string, scale: { x: number; y: number; z: number }) => void;
  /** Marker tracking handlers */
  onMarkerFound?: (marker: ARMarker) => void;
  onMarkerLost?: (marker: ARMarker) => void;
  /** Session handlers */
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  onError?: (error: Error) => void;
  /** Custom object renderer */
  renderObject?: (object: ARObject) => React.ReactNode;
  /** Loading component */
  loadingComponent?: React.ReactNode;
  /** Error component */
  errorComponent?: React.ReactNode;
  /** Controls overlay */
  controlsOverlay?: React.ReactNode;
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const GlassARPreview = forwardRef<HTMLDivElement, GlassARPreviewProps>(
  (
    {
      objects,
      markers = [],
      camera = {
        position: { x: 0, y: 0, z: 5 },
        target: { x: 0, y: 0, z: 0 },
        fov: 75,
        near: 0.1,
        far: 1000,
      },
      lighting = {
        ambient: { color: 'var(--glass-white)', intensity: 0.6 },
        directional: {
          color: 'var(--glass-white)',
          intensity: 0.8,
          position: { x: 1, y: 1, z: 1 },
          castShadow: true,
        },
      },
      background = 'transparent',
      backgroundColor = 'var(--glass-black)',
      environmentMap,
      enableCamera = true,
      debug = false,
      sessionActive = false,
      xrMode = 'inline',
      quality = 'medium',
      onObjectSelect,
      onObjectMove,
      onObjectRotate,
      onObjectScale,
      onMarkerFound,
      onMarkerLost,
      onSessionStart,
      onSessionEnd,
      onError,
      renderObject,
      loadingComponent,
      errorComponent,
      controlsOverlay,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const { shouldAnimate } = useMotionPreference();
    const arPreviewId = useA11yId('glass-ar-preview');
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [foundMarkers, setFoundMarkers] = useState<Set<string>>(new Set());
    const [xrSupported, setXrSupported] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<any>(null);
    const sceneRef = useRef<any>(null);
    const animationFrameRef = useRef<number>();

    // Quality settings
    const qualityConfig = {
      low: { resolution: 0.5, shadowMapSize: 512, antialias: false },
      medium: { resolution: 0.75, shadowMapSize: 1024, antialias: true },
      high: { resolution: 1, shadowMapSize: 2048, antialias: true },
    };

    const config = qualityConfig[quality];

    // Check WebXR support
    useEffect(() => {
      if ('xr' in navigator) {
        (navigator as any).xr?.isSessionSupported?.(xrMode).then((supported: boolean) => {
          setXrSupported(supported);
        }).catch(() => {
          setXrSupported(false);
        });
      }
    }, [xrMode]);

    // Initialize camera stream
    useEffect(() => {
      if (enableCamera && background === 'camera') {
        navigator.mediaDevices?.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(error => {
          console.warn('Camera access denied:', error);
          onError?.(new Error('Camera access required for AR preview'));
        });

        return () => {
          if (cameraStream) {
            cameraStream.getTracks().forEach((track: any) => track.stop());
          }
        };
      }
    }, [enableCamera, background, cameraStream, onError]);

    // Initialize AR renderer (simplified simulation)
    useEffect(() => {
      const initializeRenderer = () => {
        setIsLoading(true);
        
        try {
          // In a real implementation, this would initialize Three.js or WebGL
          // For this simulation, we'll use canvas 2D rendering
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = canvas.offsetWidth * window.devicePixelRatio;
          canvas.height = canvas.offsetHeight * window.devicePixelRatio;
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

          rendererRef.current = ctx;
          sceneRef.current = { objects: [], markers: [] };

          setIsLoading(false);
        } catch (error) {
          setHasError(true);
          setIsLoading(false);
          onError?.(error as Error);
        }
      };

      initializeRenderer();
    }, [onError]);

    // Render AR scene
    const renderScene = useCallback(() => {
      const ctx = rendererRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (background === 'color') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background === 'camera' && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Render objects (simplified 3D to 2D projection)
      objects.forEach((object: any) => {
        if (!object.visible) return;

        const screenPos = project3DToScreen(
          object.position,
          camera,
          canvas.width,
          canvas.height
        );

        if (renderObject) {
          // Custom rendering would go here in a real implementation
        } else {
          renderDefaultObject(ctx, object, screenPos);
        }
      });

      // Render markers
      markers.forEach((marker: any) => {
        if (foundMarkers.has(marker.id)) {
          renderMarker(ctx, marker);
        }
      });

      // Render debug info
      if (debug) {
        renderDebugInfo(ctx);
      }
    }, [objects, markers, camera, background, backgroundColor, foundMarkers, debug, renderObject]);

    // Simplified 3D to 2D projection
    const project3DToScreen = useCallback((
      position: { x: number; y: number; z: number },
      camera: ARCamera,
      width: number,
      height: number
    ) => {
      // Simplified perspective projection
      const distance = Math.sqrt(
        Math.pow(position.x - camera.position.x, 2) +
        Math.pow(position.y - camera.position.y, 2) +
        Math.pow(position.z - camera.position.z, 2)
      );

      const scale = 100 / (distance || 1);
      const x = (width / 2) + (position.x - camera.position.x) * scale;
      const y = (height / 2) - (position.y - camera.position.y) * scale;

      return { x, y, scale, distance };
    }, []);

    // Render default object representation
    const renderDefaultObject = useCallback((
      ctx: CanvasRenderingContext2D,
      object: ARObject,
      screenPos: { x: number; y: number; scale: number; distance: number }
    ) => {
      ctx.save();
      ctx.globalAlpha = object.opacity;

      const size = 40 * screenPos.scale * object.scale.x;
      const isSelected = selectedObject === object.id;

      // Draw object shadow
      ctx.beginPath();
      ctx.arc(screenPos.x + 2, screenPos.y + size/2 + 2, size/2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(var(--glass-color-black) / var(--glass-opacity-20))';
      ctx.fill();

      // Draw object
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, size/2, 0, 2 * Math.PI);
      ctx.fillStyle = object.material?.color || 'var(--glass-color-primary)';
      ctx.fill();

      // Draw selection ring
      if (isSelected) {
        ctx.strokeStyle = 'var(--glass-color-success)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw object label
      ctx.fillStyle = 'var(--glass-white)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(object.name, screenPos.x, screenPos.y + size/2 + 20);

      // Animation effects
      if (object.animation?.enabled) {
        const time = Date.now() * 0.001 * object.animation.speed;
        switch (object.animation.type) {
          case 'pulse':
            const pulseScale = 1 + Math.sin(time) * 0.2;
            ctx.scale(pulseScale, pulseScale);
            break;
          case 'rotate':
            ctx.rotate(time);
            break;
        }
      }

      ctx.restore();
    }, [selectedObject]);

    // Render AR marker
    const renderMarker = useCallback((
      ctx: CanvasRenderingContext2D,
      marker: ARMarker
    ) => {
      // Simplified marker representation
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      const size = marker.size || 50;

      ctx.save();
      ctx.strokeStyle = 'var(--glass-color-success)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // Draw marker outline
      ctx.strokeRect(x - size/2, y - size/2, size, size);

      // Draw marker type indicator
      ctx.fillStyle = 'var(--glass-color-success)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(marker.type.toUpperCase(), x, y + size/2 + 15);

      ctx.restore();
    }, []);

    // Render debug information
    const renderDebugInfo = useCallback((ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.fillStyle = 'var(--glass-text-secondary-dark)';
      ctx.fillRect(10, 10, 200, 120);

      ctx.fillStyle = 'var(--glass-white)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';

      let y = 30;
      ctx.fillText(`Objects: ${objects.length}`, 15, y);
      y += 15;
      ctx.fillText(`Markers: ${foundMarkers.size}/${markers.length}`, 15, y);
      y += 15;
      ctx.fillText(`Tracking: ${isTracking ? 'Active' : 'Inactive'}`, 15, y);
      y += 15;
      ctx.fillText(`XR Support: ${xrSupported ? 'Yes' : 'No'}`, 15, y);
      y += 15;
      ctx.fillText(`Quality: ${quality}`, 15, y);
      y += 15;
      ctx.fillText(`Mode: ${xrMode}`, 15, y);

      ctx.restore();
    }, [objects.length, foundMarkers.size, markers.length, isTracking, xrSupported, quality, xrMode]);

    // Animation loop
    useEffect(() => {
      const animate = () => {
        renderScene();
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      if (!isLoading && !hasError) {
        animate();
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isLoading, hasError, renderScene]);

    // Handle canvas interactions
    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if click intersects with any object
      for (const object of objects) {
        if (!object.visible) continue;

        const screenPos = project3DToScreen(
          object.position,
          camera,
          canvas.width,
          canvas.height
        );

        const distance = Math.sqrt(
          Math.pow(x - screenPos.x, 2) + Math.pow(y - screenPos.y, 2)
        );

        const objectSize = 40 * screenPos.scale * object.scale.x;
        if (distance <= objectSize / 2) {
          setSelectedObject(object.id);
          onObjectSelect?.(object);
          return;
        }
      }

      // Click on empty space deselects
      setSelectedObject(null);
    }, [objects, camera, project3DToScreen, onObjectSelect]);

    // Start AR session
    const startARSession = useCallback(async () => {
      try {
        if (xrSupported && xrMode === 'immersive-ar') {
          // In a real implementation, this would start WebXR session
          setIsTracking(true);
          onSessionStart?.();
        } else {
          // Fallback to inline mode
          setIsTracking(true);
          onSessionStart?.();
        }
      } catch (error) {
        onError?.(error as Error);
      }
    }, [xrSupported, xrMode, onSessionStart, onError]);

    // End AR session
    const endARSession = useCallback(() => {
      setIsTracking(false);
      onSessionEnd?.();
    }, [onSessionEnd]);

    // Simulate marker detection
    useEffect(() => {
      if (isTracking && markers.length > 0) {
        const interval = setInterval(() => {
          const randomMarker = markers[Math.floor(Math.random() * markers.length)];
          const wasFound = foundMarkers.has(randomMarker.id);
          
          if (Math.random() > 0.7) {
            if (!wasFound) {
              setFoundMarkers((prev: any) => new Set([...prev, randomMarker.id]));
              onMarkerFound?.(randomMarker);
            }
          } else if (wasFound && Math.random() > 0.8) {
            setFoundMarkers((prev: any) => {
              const newSet = new Set(prev);
              newSet.delete(randomMarker.id);
              return newSet;
            });
            onMarkerLost?.(randomMarker);
          }
        }, 2000);

        return () => clearInterval(interval);
      }
    }, [isTracking, markers, foundMarkers, onMarkerFound, onMarkerLost]);

    return (
      <OptimizedGlass
        ref={ref}
        id={arPreviewId}
        elevation="level1"
        intensity="medium"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-ar-preview relative glass-radius-lg backdrop-blur-md border border-border/20 overflow-hidden',
          className
        )}
        {...props}
      >
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className="relative w-full h-full"
        >
          {/* Camera Feed */}
          {background === 'camera' && enableCamera && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          )}

          {/* AR Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={handleCanvasClick}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              {loadingComponent || (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent glass-radius-full animate-spin" />
                  <div className="text-sm glass-text-secondary">Initializing AR...</div>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              {errorComponent || (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-4xl">🔴</div>
                  <div className="text-sm glass-text-secondary">
                    AR initialization failed
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls Overlay */}
          {controlsOverlay && (
            <div className="absolute inset-0 pointer-events-none">
              {controlsOverlay}
            </div>
          )}

          {/* Default Controls */}
          {!isLoading && !hasError && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <OptimizedGlass
                elevation="level3"
                intensity="strong"
                depth={2}
                tint="neutral"
                border="subtle"
                className="flex items-center gap-2 px-4 py-2 glass-radius-lg backdrop-blur-md border border-glass-border/20"
              >
                <button
                  onClick={isTracking ? endARSession : startARSession}
                  className={cn(
                    'glass-px-4 glass-py-2 glass-radius-md transition-all glass-text-sm font-medium',
                    isTracking
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-primary/20 text-primary hover:bg-primary/30'
                  )}
                >
                  {isTracking ? 'Stop AR' : 'Start AR'}
                </button>

                {xrSupported && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <div className="w-2 h-2 glass-surface-green glass-radius-full" />
                    <span>XR Ready</span>
                  </div>
                )}

                <div className="text-xs glass-text-secondary">
                  Objects: {objects.filter((o: any) => o.visible).length}
                </div>
              </OptimizedGlass>
            </div>
          )}

          {/* Object Info Panel */}
          {selectedObject && (
            <Motion
              preset={shouldAnimate && respectMotionPreference ? "slideUp" : "none"}
            >
              <OptimizedGlass
                elevation="level2"
                intensity="medium"
                depth={1}
                tint="neutral"
                border="subtle"
                className="absolute top-4 right-4 p-4 glass-radius-lg backdrop-blur-md border border-glass-border/20 max-w-xs"
              >
                {(() => {
                  const object = objects.find(o => o.id === selectedObject);
                  if (!object) return null;

                  return (
                    <div className="gap-2">
                      <h3 className="font-semibold text-primary">{object.name}</h3>
                      <div className="text-xs gap-1 glass-text-secondary">
                        <div>Position: ({object.position.x.toFixed(1)}, {object.position.y.toFixed(1)}, {object.position.z.toFixed(1)})</div>
                        <div>Scale: {object.scale.x.toFixed(2)}</div>
                        <div>Opacity: {(object.opacity * 100).toFixed(0)}%</div>
                        {object.animation?.enabled && (
                          <div>Animation: {object.animation.type}</div>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedObject(null)}
                        className="text-xs glass-text-secondary hover:text-primary transition-colors"
                      >
                        Close ×
                      </button>
                    </div>
                  );
                })()}
              </OptimizedGlass>
            </Motion>
          )}

          {/* Tracking Status */}
          {!isLoading && !hasError && (
            <div className="absolute top-4 left-4">
              <OptimizedGlass
                elevation="level2"
                intensity="medium"
                depth={1}
                tint="neutral"
                border="subtle"
                className="px-3 py-2 glass-radius-lg backdrop-blur-md border border-glass-border/20"
              >
                <div className="flex items-center gap-2 text-xs">
                  <div className={cn(
                    'w-2 h-2 glass-radius-full',
                    isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  )} />
                  <span className="glass-text-secondary">
                    {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                  </span>
                </div>
              </OptimizedGlass>
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassARPreview.displayName = 'GlassARPreview';

export default GlassARPreview;