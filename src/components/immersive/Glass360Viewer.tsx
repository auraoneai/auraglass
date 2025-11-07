'use client';

import React, { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { cn } from '../../lib/utilsComprehensive';
import { useA11yId } from '../../utils/a11y';
// import { useMotionPreference } from '../../contexts/MotionPreferenceContext';
// import { useSoundDesign } from '../../utils/soundDesign';

export interface Glass360ViewerMediaSource {
  type: 'image' | 'video';
  url: string;
  projection?: 'equirectangular' | 'cubemap' | 'cylindrical' | 'dome';
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
}

export interface Glass360ViewerHotspot {
  id: string;
  x: number; // -180 to 180 degrees
  y: number; // -90 to 90 degrees
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
  customContent?: React.ReactNode;
}

export interface Glass360ViewerControls {
  zoom?: boolean;
  pan?: boolean;
  autoRotate?: boolean;
  gyroscope?: boolean;
  fullscreen?: boolean;
  vr?: boolean;
  playback?: boolean;
  volume?: boolean;
}

export interface Glass360ViewerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  /** Media source */
  source: Glass360ViewerMediaSource;
  /** Alternative sources for fallback */
  sources?: Glass360ViewerMediaSource[];
  /** Interactive hotspots */
  hotspots?: Glass360ViewerHotspot[];
  /** Controls configuration */
  controls?: Glass360ViewerControls;
  /** Initial view settings */
  initialView?: {
    yaw?: number; // Horizontal rotation (-180 to 180)
    pitch?: number; // Vertical rotation (-90 to 90)
    fov?: number; // Field of view (30-120)
  };
  /** Auto-rotate speed (degrees per second) */
  autoRotateSpeed?: number;
  /** Whether auto-rotate is initially enabled */
  autoRotateEnabled?: boolean;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Minimum zoom level */
  minZoom?: number;
  /** Loading placeholder */
  loadingComponent?: React.ReactNode;
  /** Error fallback */
  errorComponent?: React.ReactNode;
  /** View change handler */
  onViewChange?: (view: { yaw: number; pitch: number; fov: number }) => void;
  /** Hotspot click handler */
  onHotspotClick?: (hotspot: Glass360ViewerHotspot) => void;
  /** Media load handler */
  onLoad?: () => void;
  /** Media error handler */
  onError?: (error: Error) => void;
  /** Custom overlay */
  overlay?: React.ReactNode;
  /** Whether to show debug info */
  debug?: boolean;
  /** Viewer quality */
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  /** Performance mode */
  performanceMode?: 'performance' | 'quality';
  /** Respect motion preferences */
  respectMotionPreference?: boolean;
}

export const Glass360Viewer = forwardRef<HTMLDivElement, Glass360ViewerProps>(
  (
    {
      source,
      sources = [],
      hotspots = [],
      controls = {
        zoom: true,
        pan: true,
        autoRotate: true,
        gyroscope: true,
        fullscreen: true,
        vr: false,
        playback: true,
        volume: true,
      },
      initialView = {
        yaw: 0,
        pitch: 0,
        fov: 75,
      },
      autoRotateSpeed = 2,
      autoRotateEnabled = false,
      maxZoom = 3,
      minZoom = 0.5,
      loadingComponent,
      errorComponent,
      onViewChange,
      onHotspotClick,
      onLoad,
      onError,
      overlay,
      debug = false,
      quality = 'high',
      performanceMode = 'quality',
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const shouldAnimate = true; // TODO: Replace with actual motion preference hook
    const playSound = (soundKey: string) => {}; // TODO: Replace with actual sound design hook
    const viewerId = useA11yId('glass-360-viewer');
    
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentView, setCurrentView] = useState({
      yaw: initialView.yaw ?? 0,
      pitch: initialView.pitch ?? 0,
      fov: initialView.fov ?? 75,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, yaw: 0, pitch: 0 });
    const [isAutoRotating, setIsAutoRotating] = useState(autoRotateEnabled);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [mediaElement, setMediaElement] = useState<HTMLImageElement | HTMLVideoElement | null>(null);
    const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const lastGyroscopeRef = useRef({ alpha: 0, beta: 0, gamma: 0 });

    // Quality settings
    const qualityConfig = {
      low: { resolution: 512, samples: 1 },
      medium: { resolution: 1024, samples: 2 },
      high: { resolution: 2048, samples: 4 },
      ultra: { resolution: 4096, samples: 8 },
    };

    const config = qualityConfig[quality];

    // Initialize viewer
    useEffect(() => {
      const initializeViewer = async () => {
        try {
          setIsLoading(true);
          setHasError(false);

          if (source.type === 'image') {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              setMediaElement(img);
              setIsLoading(false);
              onLoad?.();
              playSound('media_load');
            };
            img.onerror = () => {
              const error = new Error('Failed to load 360° image');
              setHasError(true);
              setIsLoading(false);
              onError?.(error);
            };
            img.src = source.url;
          } else if (source.type === 'video') {
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              setMediaElement(video);
              setIsLoading(false);
              onLoad?.();
              playSound('media_load');
            };
            video.onerror = () => {
              const error = new Error('Failed to load 360° video');
              setHasError(true);
              setIsLoading(false);
              onError?.(error);
            };
            video.src = source.url;
          }
        } catch (error) {
          setHasError(true);
          setIsLoading(false);
          onError?.(error as Error);
        }
      };

      initializeViewer();
    }, [source, onLoad, onError, playSound]);

    // Render 360° view on canvas
    useEffect(() => {
      if (!mediaElement || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const render = () => {
        if (!mediaElement || !ctx) return;

        const { yaw, pitch, fov } = currentView;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate projection based on source projection type
        const projectionMatrix = calculateProjectionMatrix(
          source.projection || 'equirectangular',
          yaw,
          pitch,
          fov,
          canvas.width,
          canvas.height
        );

        // Render the media with projection
        if (mediaElement instanceof HTMLImageElement) {
          renderImageProjection(ctx, mediaElement, projectionMatrix, canvas.width, canvas.height);
        } else if (mediaElement instanceof HTMLVideoElement) {
          renderVideoProjection(ctx, mediaElement, projectionMatrix, canvas.width, canvas.height);
        }

        // Render hotspots
        renderHotspots(ctx, canvas.width, canvas.height);
      };

      const animate = () => {
        render();
        if (isAutoRotating) {
          setCurrentView((prev: any) => ({
            ...prev,
            yaw: ((prev.yaw ?? 0) + autoRotateSpeed / 60) % 360
          }));
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [mediaElement, currentView, isAutoRotating, autoRotateSpeed, hotspots, source.projection]);

    // Calculate projection matrix (simplified implementation)
    const calculateProjectionMatrix = useCallback((
      projection: string,
      yaw: number,
      pitch: number,
      fov: number,
      width: number,
      height: number
    ) => {
      // This is a simplified projection calculation
      // In a real implementation, you would use a proper 3D math library
      const yawRad = (yaw * Math.PI) / 180;
      const pitchRad = (pitch * Math.PI) / 180;
      const fovRad = (fov * Math.PI) / 180;

      return {
        yawRad,
        pitchRad,
        fovRad,
        aspect: width / height,
      };
    }, []);

    // Render image with projection
    const renderImageProjection = useCallback((
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      matrix: any,
      width: number,
      height: number
    ) => {
      // Simplified equirectangular projection rendering
      // In a real implementation, this would be much more complex
      const { yawRad, pitchRad } = matrix;
      
      const sourceX = ((yawRad + Math.PI) / (2 * Math.PI)) * img.width;
      const sourceY = ((pitchRad + Math.PI / 2) / Math.PI) * img.height;
      const sourceWidth = img.width / 4; // Simplified view window
      const sourceHeight = img.height / 4;

      ctx.drawImage(
        img,
        sourceX - sourceWidth / 2,
        sourceY - sourceHeight / 2,
        sourceWidth,
        sourceHeight,
        0,
        0,
        width,
        height
      );
    }, []);

    // Render video with projection
    const renderVideoProjection = useCallback((
      ctx: CanvasRenderingContext2D,
      video: HTMLVideoElement,
      matrix: any,
      width: number,
      height: number
    ) => {
      // Similar to image projection but for video
      const { yawRad, pitchRad } = matrix;
      
      const sourceX = ((yawRad + Math.PI) / (2 * Math.PI)) * video.videoWidth;
      const sourceY = ((pitchRad + Math.PI / 2) / Math.PI) * video.videoHeight;
      const sourceWidth = video.videoWidth / 4;
      const sourceHeight = video.videoHeight / 4;

      ctx.drawImage(
        video,
        sourceX - sourceWidth / 2,
        sourceY - sourceHeight / 2,
        sourceWidth,
        sourceHeight,
        0,
        0,
        width,
        height
      );
    }, []);

    // Render hotspots
    const renderHotspots = useCallback((
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      hotspots.forEach((hotspot, index) => {
        // Convert hotspot 3D position to 2D screen coordinates
        const { x, y } = project3DTo2D(hotspot.x, hotspot.y, currentView, width, height);
        
        // Only render if hotspot is in view
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          ctx.save();
          ctx.fillStyle = hotspot.color || 'var(--glass-color-primary)';
          ctx.strokeStyle = 'var(--glass-white)';
          ctx.lineWidth = 2;
          
          // Draw hotspot circle
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          
          // Pulse animation
          if (shouldAnimate) {
            const pulseScale = 1 + Math.sin(Date.now() * 0.01 + index) * 0.2;
            ctx.beginPath();
            ctx.arc(x, y, 8 * pulseScale, 0, 2 * Math.PI);
            ctx.strokeStyle = hotspot.color || 'var(--glass-color-primary)';
            ctx.globalAlpha = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          
          ctx.restore();
        }
      });
    }, [hotspots, currentView, shouldAnimate]);

    // Convert 3D spherical coordinates to 2D screen coordinates
    const project3DTo2D = useCallback((
      longitude: number,
      latitude: number,
      view: { yaw: number; pitch: number; fov: number },
      width: number,
      height: number
    ) => {
      const { yaw, pitch, fov } = view;
      const adjustedLon = longitude - yaw;
      const adjustedLat = latitude - pitch;
      
      // Simplified projection
      const x = (width / 2) + (adjustedLon / 90) * (width / 4);
      const y = (height / 2) + (adjustedLat / 90) * (height / 4);
      
      return { x, y };
    }, []);

    // Handle mouse interactions
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
      if (!controls.pan) return;

      setIsDragging(true);
      setIsAutoRotating(false);
      setDragStart({
        x: event.clientX,
        y: event.clientY,
        yaw: currentView.yaw ?? 0,
        pitch: currentView.pitch ?? 0,
      });
      playSound('drag_start');
    }, [controls.pan, currentView, playSound]);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
      if (!isDragging || !controls.pan) return;

      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      
      const sensitivity = 0.5;
      const newYaw = dragStart.yaw - deltaX * sensitivity;
      const newPitch = Math.max(-90, Math.min(90, dragStart.pitch + deltaY * sensitivity));

      const newView = {
        ...currentView,
        yaw: newYaw,
        pitch: newPitch,
      };

      setCurrentView(newView);
      onViewChange?.({
        yaw: newView.yaw ?? 0,
        pitch: newView.pitch ?? 0,
        fov: newView.fov ?? 75,
      });
    }, [isDragging, controls.pan, dragStart, currentView, onViewChange]);

    const handleMouseUp = useCallback(() => {
      if (isDragging) {
        setIsDragging(false);
        playSound('drag_end');
      }
    }, [isDragging, playSound]);

    // Handle zoom
    const handleWheel = useCallback((event: React.WheelEvent) => {
      if (!controls.zoom) return;

      event.preventDefault();
      const delta = event.deltaY * 0.1;
      const newFov = Math.max(30, Math.min(120, currentView.fov + delta));

      const newView = {
        ...currentView,
        fov: newFov,
      };

      setCurrentView(newView);
      onViewChange?.({
        yaw: newView.yaw ?? 0,
        pitch: newView.pitch ?? 0,
        fov: newView.fov ?? 75,
      });
      playSound('zoom');
    }, [controls.zoom, currentView, onViewChange, playSound]);

    // Handle hotspot clicks
    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if click is on a hotspot
      for (const hotspot of hotspots) {
        const hotspotPos = project3DTo2D(hotspot.x, hotspot.y, currentView, canvas.width, canvas.height);
        const distance = Math.sqrt(
          Math.pow(x - hotspotPos.x, 2) + Math.pow(y - hotspotPos.y, 2)
        );

        if (distance <= 16) { // Hotspot click radius
          hotspot.onClick?.();
          onHotspotClick?.(hotspot);
          playSound('hotspot_click');
          return;
        }
      }
    }, [hotspots, currentView, project3DTo2D, onHotspotClick, playSound]);

    // Gyroscope support
    useEffect(() => {
      if (!gyroscopeEnabled || !controls.gyroscope) return;

      const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
          const alpha = event.alpha;
          const beta = event.beta;
          const gamma = event.gamma;

          // Convert device orientation to view angles
          const yaw = alpha - lastGyroscopeRef.current.alpha;
          const pitch = beta - lastGyroscopeRef.current.beta;

          setCurrentView((prev: any) => ({
            ...prev,
            yaw: (prev.yaw ?? 0) + yaw * 0.1,
            pitch: Math.max(-90, Math.min(90, (prev.pitch ?? 0) + pitch * 0.1)),
          }));

          lastGyroscopeRef.current = { alpha, beta, gamma };
        }
      };

      window.addEventListener('deviceorientation', handleDeviceOrientation);
      return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
    }, [gyroscopeEnabled, controls.gyroscope]);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
      if (!controls.fullscreen) return;

      if (!isFullscreen) {
        containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
      playSound('fullscreen_toggle');
    }, [controls.fullscreen, isFullscreen, playSound]);

    // Control panel
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level3"
          intensity="strong"
          depth={2}
          tint="neutral"
          border="subtle"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 glass-radius-lg backdrop-blur-md border border-glass-border/20"
        >
          {controls.autoRotate && (
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={cn(
                'glass-p-2 glass-radius-md transition-all',
                isAutoRotating ? 'bg-primary/20 text-primary' : 'hover:bg-background/20'
              )}
              title="Auto Rotate"
            >
              🔄
            </button>
          )}

          {controls.gyroscope && (
            <button
              onClick={() => setGyroscopeEnabled(!gyroscopeEnabled)}
              className={cn(
                'glass-p-2 glass-radius-md transition-all',
                gyroscopeEnabled ? 'bg-primary/20 text-primary' : 'hover:bg-background/20'
              )}
              title="Gyroscope"
            >
              📱
            </button>
          )}

          {controls.fullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2 glass-radius-md hover:glass-surface-overlay transition-all"
              title="Fullscreen"
            >
              {isFullscreen ? '🗗' : '🗖'}
            </button>
          )}

          {source.type === 'video' && controls.playback && mediaElement instanceof HTMLVideoElement && (
            <button
              onClick={() => {
                if (mediaElement.paused) {
                  mediaElement.play();
                } else {
                  mediaElement.pause();
                }
              }}
              className="p-2 glass-radius-md hover:glass-surface-overlay transition-all"
              title={mediaElement.paused ? "Play" : "Pause"}
            >
              {mediaElement.paused ? '▶' : '⏸'}
            </button>
          )}

          <div className="text-xs glass-text-secondary">
            {Math.round(currentView.yaw ?? 0)}° / {Math.round(currentView.pitch ?? 0)}° / {Math.round(currentView.fov ?? 75)}°
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={viewerId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          'glass-360-viewer relative glass-radius-lg backdrop-blur-md border border-border/20 overflow-hidden',
          className
        )}
        {...props}
      >
        <Motion
          preset={shouldAnimate && respectMotionPreference ? "fadeIn" : "none"}
          className="relative w-full h-full"
        >
          <div
            ref={containerRef}
            className="relative w-full h-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                {loadingComponent || (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent glass-radius-full animate-spin" />
                    <div className="text-sm glass-text-secondary">Loading 360° media...</div>
                  </div>
                )}
              </div>
            )}

            {/* Error State */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center">
                {errorComponent || (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="text-4xl">❌</div>
                    <div className="text-sm glass-text-secondary">
                      Failed to load 360° media
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Canvas */}
            {!isLoading && !hasError && (
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                onClick={handleCanvasClick}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
            )}

            {/* Overlay */}
            {overlay && (
              <div className="absolute inset-0 pointer-events-none">
                {overlay}
              </div>
            )}

            {/* Controls */}
            {!isLoading && !hasError && renderControls()}

            {/* Debug Info */}
            {debug && !isLoading && !hasError && (
              <OptimizedGlass
                elevation="level2"
                intensity="medium"
                depth={1}
                tint="neutral"
                border="subtle"
                className="absolute top-4 left-4 p-3 glass-radius-lg backdrop-blur-md border border-glass-border/20"
              >
                <div className="text-xs font-mono gap-1">
                  <div>Yaw: {(currentView.yaw ?? 0).toFixed(1)}°</div>
                  <div>Pitch: {(currentView.pitch ?? 0).toFixed(1)}°</div>
                  <div>FOV: {(currentView.fov ?? 75).toFixed(1)}°</div>
                  <div>Auto: {isAutoRotating ? 'On' : 'Off'}</div>
                  <div>Type: {source.type}</div>
                  <div>Projection: {source.projection || 'equirectangular'}</div>
                  <div>Hotspots: {hotspots.length}</div>
                </div>
              </OptimizedGlass>
            )}

            {/* Controls Toggle */}
            <button
              onClick={() => setShowControls(!showControls)}
              className="absolute top-4 right-4 p-2 glass-radius-full glass-surface-overlay hover:glass-surface-overlay transition-all"
              title="Toggle Controls"
            >
              {showControls ? '🎛' : '⚙'}
            </button>
          </div>
        </Motion>
      </OptimizedGlass>
    );
  }
);

Glass360Viewer.displayName = 'Glass360Viewer';

export default Glass360Viewer;