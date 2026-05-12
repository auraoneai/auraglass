"use client";
import { cn } from "../../lib/utilsComprehensive";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Home,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassButton } from "../button";
import { CardContent, GlassCard } from "../card";

export interface ImageViewerImage {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface GlassImageViewerProps {
  /**
   * Images to display
   */
  images: ImageViewerImage[];
  /**
   * Initial image index
   */
  initialIndex?: number;
  /**
   * Enable zoom functionality
   */
  enableZoom?: boolean;
  /**
   * Enable pan functionality
   */
  enablePan?: boolean;
  /**
   * Enable rotation
   */
  enableRotation?: boolean;
  /**
   * Enable fullscreen mode
   */
  enableFullscreen?: boolean;
  /**
   * Render as a bounded embedded viewer instead of allowing viewport-fixed fullscreen.
   */
  contained?: boolean;
  /**
   * Use denser controls and hide nonessential copy for card/docs previews.
   */
  compact?: boolean;
  /**
   * Bounded viewer width.
   */
  width?: React.CSSProperties["width"];
  /**
   * Bounded viewer height.
   */
  height?: React.CSSProperties["height"];
  /**
   * Bounded viewer max-height.
   */
  maxHeight?: React.CSSProperties["maxHeight"];
  /**
   * Enable image navigation
   */
  enableNavigation?: boolean;
  /**
   * Show zoom controls
   */
  showZoomControls?: boolean;
  /**
   * Show rotation controls
   */
  showRotationControls?: boolean;
  /**
   * Show download button
   */
  showDownloadButton?: boolean;
  /**
   * Show image info
   */
  showImageInfo?: boolean;
  /**
   * Auto-play slideshow
   */
  autoPlay?: boolean;
  /**
   * Auto-play interval in milliseconds
   */
  autoPlayInterval?: number;
  /**
   * Zoom levels
   */
  zoomLevels?: number[];
  /**
   * Minimum zoom level
   */
  minZoom?: number;
  /**
   * Maximum zoom level
   */
  maxZoom?: number;
  /**
   * Image fit mode
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Image change callback
   */
  onImageChange?: (index: number) => void;
  /**
   * Zoom change callback
   */
  onZoomChange?: (zoom: number) => void;
  /**
   * Fullscreen change callback
   */
  onFullscreenChange?: (fullscreen: boolean) => void;
}

/**
 * GlassImageViewer component
 * A comprehensive image viewer with zoom, pan, rotation, and slideshow features
 */
export const GlassImageViewer: React.FC<GlassImageViewerProps> = ({
  images = [],
  initialIndex = 0,
  enableZoom = true,
  enablePan = true,
  enableRotation = true,
  enableFullscreen = true,
  contained = false,
  compact = false,
  width,
  height,
  maxHeight,
  enableNavigation = true,
  showZoomControls = true,
  showRotationControls = true,
  showDownloadButton = true,
  showImageInfo = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
  minZoom = 0.1,
  maxZoom = 5,
  objectFit = "contain",
  loading = false,
  error,
  className,
  onImageChange,
  onZoomChange,
  onFullscreenChange,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const safeImages = Array.isArray(images) ? images : [];
  const safeImageCount = safeImages.length;
  const normalizedInitialIndex = safeImageCount
    ? Math.min(Math.max(initialIndex, 0), safeImageCount - 1)
    : 0;
  const [currentIndex, setCurrentIndex] = useState(normalizedInitialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const currentImage = safeImages[currentIndex];
  const isViewportFullscreen = isFullscreen && !contained;
  const showExpandedInfo = showImageInfo && !compact;

  // Handle image change
  const handleImageChange = useCallback(
    (index: number) => {
      if (safeImageCount === 0) return;

      const clampedIndex = Math.min(Math.max(index, 0), safeImageCount - 1);

      setCurrentIndex(clampedIndex);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setImageLoading(true);
      setImageError(false);
      onImageChange?.(clampedIndex);
    },
    [onImageChange, safeImageCount]
  );

  // Handle zoom
  const handleZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
      setZoom(clampedZoom);
      onZoomChange?.(clampedZoom);
    },
    [minZoom, maxZoom, onZoomChange]
  );

  // Handle zoom in/out with levels
  const handleZoomIn = useCallback(() => {
    const currentLevelIndex = zoomLevels.findIndex((level) => level >= zoom);
    const nextLevel =
      zoomLevels[Math.min(currentLevelIndex + 1, zoomLevels.length - 1)];
    handleZoom(nextLevel);
  }, [zoom, zoomLevels, handleZoom]);

  const handleZoomOut = useCallback(() => {
    const reversedLevels = [...zoomLevels].reverse();
    const currentLevelIndex =
      zoomLevels.length -
      1 -
      reversedLevels.findIndex((level: number) => level <= zoom);
    const prevLevel = zoomLevels[Math.max(currentLevelIndex - 1, 0)];
    handleZoom(prevLevel);
  }, [zoom, zoomLevels, handleZoom]);

  // Handle rotation
  const handleRotate = useCallback((degrees: number) => {
    setRotation((prev: any) => (prev + degrees) % 360);
  }, []);

  // Handle pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enablePan || zoom <= 1) return;

      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });
    },
    [enablePan, zoom, pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !enablePan) return;

      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, enablePan, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!enableZoom) return;

      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      handleZoom(zoom * zoomFactor);
    },
    [enableZoom, zoom, handleZoom]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          if (enableNavigation) {
            handleImageChange(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (enableNavigation) {
            handleImageChange(currentIndex + 1);
          }
          break;
        case "Escape":
          if (isFullscreen) {
            handleFullscreenToggle();
          }
          break;
        case "+":
        case "=":
          if (enableZoom) {
            handleZoomIn();
          }
          break;
        case "-":
          if (enableZoom) {
            handleZoomOut();
          }
          break;
        case "0":
          handleZoom(1);
          break;
        case "r":
        case "R":
          if (enableRotation) {
            handleRotate(90);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentIndex,
    isFullscreen,
    zoom,
    enableNavigation,
    enableZoom,
    enableRotation,
    handleImageChange,
    handleZoom,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
  ]);

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    onFullscreenChange?.(newFullscreen);
  }, [isFullscreen, onFullscreenChange]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage.src;
    link.download = currentImage.title || `image-${currentIndex + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage, currentIndex]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && safeImageCount > 1 && !prefersReducedMotion) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev: any) => (prev + 1) % safeImageCount);
      }, autoPlayInterval);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, safeImageCount, autoPlayInterval, prefersReducedMotion]);

  useEffect(() => {
    setCurrentIndex((prevIndex) => {
      if (safeImageCount === 0) {
        return prevIndex === 0 ? prevIndex : 0;
      }
      const boundedIndex = Math.min(Math.max(prevIndex, 0), safeImageCount - 1);
      return boundedIndex;
    });
  }, [safeImageCount]);

  // Reset zoom and pan when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  }, [currentIndex]);

  if (!currentImage) {
    return (
      <GlassCard data-glass-component className={cn("p-8", className)}>
        <div className="glass-text-center glass-text-primary-glass-opacity-60">
          No image to display
        </div>
      </GlassCard>
    );
  }

  return (
    <Motion preset="fadeIn" className="glass-w-full">
      <GlassCard
        className={cn(
          "overflow-hidden relative",
          contained && "glass-contained",
          compact && "glass-compact",
          isViewportFullscreen && "fixed inset-0 z-50 rounded-none",
          className
        )}
        style={{
          width,
          height,
          maxHeight,
        }}
        {...props}
      >
        <CardContent className="glass-p-0">
          {/* Image Container */}
          <div
            ref={containerRef}
            className={cn(
              "relative bg-black/20 overflow-hidden",
              isViewportFullscreen
                ? "h-screen"
                : height
                  ? "h-full"
                  : "aspect-video"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{
              cursor: isDragging
                ? "grabbing"
                : enablePan && zoom > 1
                  ? "grab"
                  : "default",
            }}
          >
            {/* Loading State */}
            {imageLoading && (
              <div className="glass-absolute glass-inset-0 glass-flex glass-items-center glass-justify-center">
                <div
                  className={cn(
                    "glass-radius-full h-8 w-8 border-2 border-white/20 border-t-white/60",
                    !prefersReducedMotion && "animate-spin"
                  )}
                ></div>
              </div>
            )}

            {/* Error State */}
            {imageError && (
              <div className="glass-absolute glass-inset-0 glass-flex glass-flex-col glass-items-center glass-justify-center glass-text-primary-glass-opacity-60">
                <X className="glass-w-12 glass-h-12 glass-mb-4" />
                <p>Failed to load image</p>
              </div>
            )}

            {/* Main Image */}
            {!imageError && (
              <img
                ref={imageRef}
                src={currentImage.src}
                alt={
                  currentImage.alt ||
                  currentImage.title ||
                  `Image ${currentIndex + 1}`
                }
                className={cn(
                  "w-full h-full transition-transform duration-200",
                  objectFit === "contain" && "object-contain",
                  objectFit === "cover" && "object-cover",
                  objectFit === "fill" && "object-fill",
                  objectFit === "none" && "object-none",
                  objectFit === "scale-down" && "object-scale-down"
                )}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: "center center",
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                draggable={false}
              />
            )}

            {/* Image Info Overlay */}
            {showExpandedInfo && currentImage.title && (
              <div
                className={cn(
                  "glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-surface-dark/50 glass-backdrop-blur-md glass-contrast-guard glass-contrast-guard",
                  compact ? "glass-p-2" : "glass-p-4"
                )}
              >
                <h3 className="glass-text-primary glass-font-medium">
                  {currentImage.title}
                </h3>
                {currentImage.description && (
                  <p className="glass-text-primary-glass-opacity-80 glass-text-sm glass-mt-1">
                    {currentImage.description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Controls Overlay */}
          <div
            className={cn(
              "glass-absolute glass-flex glass-justify-between glass-items-start",
              compact
                ? "glass-top-2 glass-left-2 glass-right-2"
                : "glass-top-4 glass-left-4 glass-right-4"
            )}
            style={{ gap: 8, minWidth: 0, pointerEvents: "none" }}
          >
            {/* Left Controls */}
            <div
              className="glass-flex glass-items-center glass-gap-2"
              style={{ flex: "0 1 auto", minWidth: 0, pointerEvents: "auto" }}
            >
              {enableNavigation && safeImageCount > 1 && (
                <>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleImageChange(currentIndex - 1)}
                    disabled={currentIndex === 0 || safeImageCount === 0}
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="glass-w-4 glass-h-4" />
                  </GlassButton>

                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleImageChange(currentIndex + 1)}
                    disabled={
                      safeImageCount === 0 || currentIndex >= safeImageCount - 1
                    }
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Next image"
                  >
                    <ChevronRight className="glass-w-4 glass-h-4" />
                  </GlassButton>

                  <span
                    className={cn(
                      "glass-text-primary-glass-opacity-80 glass-text-sm",
                      compact ? "glass-px-1" : "glass-px-2"
                    )}
                  >
                    {safeImageCount > 0
                      ? `${currentIndex + 1} / ${safeImageCount}`
                      : "0 / 0"}
                  </span>
                </>
              )}
            </div>

            {/* Right Controls */}
            <div
              className="glass-flex glass-items-center glass-gap-2"
              style={{
                flex: "1 1 auto",
                minWidth: 0,
                maxWidth: "100%",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                pointerEvents: "auto",
              }}
            >
              {enableZoom && showZoomControls && (
                <>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="glass-w-4 glass-h-4" />
                  </GlassButton>

                  <span
                    className={cn(
                      "glass-text-primary-glass-opacity-80 glass-text-sm glass-text-center",
                      compact ? "glass-min-w-10 glass-px-1" : "glass-min-w-16 glass-px-2"
                    )}
                  >
                    {Math.round(zoom * 100)}%
                  </span>

                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="glass-w-4 glass-h-4" />
                  </GlassButton>
                </>
              )}

              {enableRotation && showRotationControls && (
                <>
                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleRotate(-90)}
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Rotate counter-clockwise"
                  >
                    <RotateCcw className="glass-w-4 glass-h-4" />
                  </GlassButton>

                  <GlassButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => handleRotate(90)}
                    className="glass-p-2 glass-focus glass-touch-target"
                    aria-label="Rotate clockwise"
                  >
                    <RotateCw className="glass-w-4 glass-h-4" />
                  </GlassButton>
                </>
              )}

              {showDownloadButton && (
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  className="glass-p-2 glass-focus glass-touch-target"
                  aria-label="Download image"
                >
                  <Download className="glass-w-4 glass-h-4" />
                </GlassButton>
              )}

              {enableFullscreen && !contained && (
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={handleFullscreenToggle}
                  className="glass-p-2 glass-focus glass-touch-target"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="glass-w-4 glass-h-4" />
                  ) : (
                    <Maximize2 className="glass-w-4 glass-h-4" />
                  )}
                </GlassButton>
              )}
            </div>
          </div>

          {/* Auto-play Controls */}
          {enableNavigation && safeImageCount > 1 && (
            <div className="glass-absolute glass-bottom-4 glass--left-1-2 glass-transform glass--translate-x-1-2">
              <div className="glass-flex glass-items-center glass-gap-2 glass-surface-dark/50 glass-backdrop-blur-md glass-contrast-guard glass-radius-full glass-px-4 glass-py-2 glass-contrast-guard">
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={(e) => setIsAutoPlaying(!isAutoPlaying)}
                  className="glass-p-1 glass-focus glass-touch-target"
                  aria-label={
                    isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                  }
                >
                  {isAutoPlaying ? (
                    <Pause className="glass-w-4 glass-h-4" />
                  ) : (
                    <Play className="glass-w-4 glass-h-4" />
                  )}
                </GlassButton>

                <div className="glass-flex glass-gap-1">
                  {safeImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleImageChange(index)}
                      className={cn(
                        "w-2 h-2 glass-radius-full transition-all duration-200 glass-focus glass-touch-target glass-contrast-guard",
                        index === currentIndex ? "bg-white" : "bg-white/40"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reset Controls */}
          {(zoom !== 1 || rotation !== 0 || pan.x !== 0 || pan.y !== 0) && (
            <div className="glass-absolute glass-top-1/2 glass-left-4 glass-transform glass--translate-y-1-2">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  setZoom(1);
                  setRotation(0);
                  setPan({ x: 0, y: 0 });
                }}
                className="glass-p-2 glass-focus glass-touch-target"
                aria-label="Reset view"
              >
                <Home className="glass-w-4 glass-h-4" />
              </GlassButton>
            </div>
          )}
        </CardContent>
      </GlassCard>
    </Motion>
  );
};

export default GlassImageViewer;
