'use client';

import { cn } from '../../lib/utilsComprehensive';
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
    ZoomOut
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Motion } from '../../primitives';
import { GlassButton } from '../button';
import { CardContent, GlassCard } from '../card';

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
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
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
    images,
    initialIndex = 0,
    enableZoom = true,
    enablePan = true,
    enableRotation = true,
    enableFullscreen = true,
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
    objectFit = 'contain',
    loading = false,
    error,
    className,
    onImageChange,
    onZoomChange,
    onFullscreenChange,
    ...props
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
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

    const currentImage = images[currentIndex];

    // Handle image change
    const handleImageChange = useCallback((index: number) => {
        if (index < 0 || index >= images.length) return;

        setCurrentIndex(index);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setImageLoading(true);
        setImageError(false);
        onImageChange?.(index);
    }, [images.length, onImageChange]);

    // Handle zoom
    const handleZoom = useCallback((newZoom: number) => {
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        setZoom(clampedZoom);
        onZoomChange?.(clampedZoom);
    }, [minZoom, maxZoom, onZoomChange]);

    // Handle zoom in/out with levels
    const handleZoomIn = useCallback(() => {
        const currentLevelIndex = zoomLevels.findIndex(level => level >= zoom);
        const nextLevel = zoomLevels[Math.min(currentLevelIndex + 1, zoomLevels.length - 1)];
        handleZoom(nextLevel);
    }, [zoom, zoomLevels, handleZoom]);

    const handleZoomOut = useCallback(() => {
        const reversedLevels = [...zoomLevels].reverse();
        const currentLevelIndex = zoomLevels.length - 1 - reversedLevels.findIndex((level: number) => level <= zoom);
        const prevLevel = zoomLevels[Math.max(currentLevelIndex - 1, 0)];
        handleZoom(prevLevel);
    }, [zoom, zoomLevels, handleZoom]);

    // Handle rotation
    const handleRotate = useCallback((degrees: number) => {
        setRotation((prev: any) => (prev + degrees) % 360);
    }, []);

    // Handle pan
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!enablePan || zoom <= 1) return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX - pan.x,
            y: e.clientY - pan.y
        });
    }, [enablePan, zoom, pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || !enablePan) return;

        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    }, [isDragging, enablePan, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!enableZoom) return;

        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        handleZoom(zoom * zoomFactor);
    }, [enableZoom, zoom, handleZoom]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    if (enableNavigation) {
                        handleImageChange(currentIndex - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (enableNavigation) {
                        handleImageChange(currentIndex + 1);
                    }
                    break;
                case 'Escape':
                    if (isFullscreen) {
                        handleFullscreenToggle();
                    }
                    break;
                case '+':
                case '=':
                    if (enableZoom) {
                        handleZoomIn();
                    }
                    break;
                case '-':
                    if (enableZoom) {
                        handleZoomOut();
                    }
                    break;
                case '0':
                    handleZoom(1);
                    break;
                case 'r':
                case 'R':
                    if (enableRotation) {
                        handleRotate(90);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, isFullscreen, zoom, enableNavigation, enableZoom, enableRotation, handleImageChange, handleZoom, handleZoomIn, handleZoomOut, handleRotate]);

    // Handle fullscreen toggle
    const handleFullscreenToggle = useCallback(() => {
        const newFullscreen = !isFullscreen;
        setIsFullscreen(newFullscreen);
        onFullscreenChange?.(newFullscreen);
    }, [isFullscreen, onFullscreenChange]);

    // Handle download
    const handleDownload = useCallback(() => {
        if (!currentImage) return;

        const link = document.createElement('a');
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
            if (isAutoPlaying && images && images.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev: any) => (prev + 1) % images.length);
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
    }, [isAutoPlaying, images.length, autoPlayInterval]);

    // Reset zoom and pan when image changes
    useEffect(() => {
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
    }, [currentIndex]);

    if (!currentImage) {
        return (
            <GlassCard data-glass-component className={cn('p-8', className)}>
                <div className="text-center text-primary/60">
                    No image to display
                </div>
            </GlassCard>
        );
    }

    return (
        <Motion preset="fadeIn" className="w-full">
            <GlassCard
                className={cn(
                    'overflow-hidden relative',
                    isFullscreen && 'fixed inset-0 z-50 rounded-none',
                    className
                )}
                {...props}
            >
                <CardContent className="p-0">
                    {/* Image Container */}
                    <div
                        ref={containerRef}
                        className={cn(
                            'relative bg-black/20 overflow-hidden',
                            isFullscreen ? 'h-screen' : 'aspect-video'
                        )}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        style={{ cursor: isDragging ? 'grabbing' : enablePan && zoom > 1 ? 'grab' : 'default' }}
                    >
                        {/* Loading State */}
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin glass-radius-full h-8 w-8 border-2 border-white/20 border-t-white/60"></div>
                            </div>
                        )}

                        {/* Error State */}
                        {imageError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/60">
                                <X className="w-12 h-12 mb-4" />
                                <p>Failed to load image</p>
                            </div>
                        )}

                        {/* Main Image */}
                        {!imageError && (
                            <img
                                ref={imageRef}
                                src={currentImage.src}
                                alt={currentImage.alt || currentImage.title || `Image ${currentIndex + 1}`}
                                className={cn(
                                    'w-full h-full transition-transform duration-200',
                                    objectFit === 'contain' && 'object-contain',
                                    objectFit === 'cover' && 'object-cover',
                                    objectFit === 'fill' && 'object-fill',
                                    objectFit === 'none' && 'object-none',
                                    objectFit === 'scale-down' && 'object-scale-down'
                                )}
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg) translate(${pan.x}px, ${pan.y}px)`,
                                    transformOrigin: 'center center'
                                }}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                draggable={false}
                            />
                        )}

                        {/* Image Info Overlay */}
                        {showImageInfo && currentImage.title && (
                            <div className="absolute bottom-0 left-0 right-0 glass-surface-dark/50 backdrop-blur-md p-4">
                                <h3 className="text-primary font-medium">{currentImage.title}</h3>
                                {currentImage.description && (
                                    <p className="text-primary/80 text-sm glass-mt-1">{currentImage.description}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {/* Left Controls */}
                        <div className="flex items-center gap-2">
                            {enableNavigation && images.length > 1 && (
                                <>
                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => handleImageChange(currentIndex - 1)}
                                        disabled={currentIndex === 0}
                                        className="p-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </GlassButton>

                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => handleImageChange(currentIndex + 1)}
                                        disabled={currentIndex === images.length - 1}
                                        className="p-2"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </GlassButton>

                                    <span className="text-primary/80 text-sm px-2">
                                        {currentIndex + 1} / {images.length}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-2">
                            {enableZoom && showZoomControls && (
                                <>
                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= minZoom}
                                        className="p-2"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </GlassButton>

                                    <span className="text-primary/80 text-sm px-2 min-w-16 text-center">
                                        {Math.round(zoom * 100)}%
                                    </span>

                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= maxZoom}
                                        className="p-2"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </GlassButton>
                                </>
                            )}

                            {enableRotation && showRotationControls && (
                                <>
                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => handleRotate(-90)}
                                        className="p-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </GlassButton>

                                    <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => handleRotate(90)}
                                        className="p-2"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </GlassButton>
                                </>
                            )}

                            {showDownloadButton && (
                                <GlassButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleDownload}
                                    className="p-2"
                                >
                                    <Download className="w-4 h-4" />
                                </GlassButton>
                            )}

                            {enableFullscreen && (
                                <GlassButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleFullscreenToggle}
                                    className="p-2"
                                >
                                    {isFullscreen ? (
                                        <Minimize2 className="w-4 h-4" />
                                    ) : (
                                        <Maximize2 className="w-4 h-4" />
                                    )}
                                </GlassButton>
                            )}
                        </div>
                    </div>

                    {/* Auto-play Controls */}
                    {enableNavigation && images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-2 glass-surface-dark/50 backdrop-blur-md glass-radius-full px-4 py-2">
                                <GlassButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => setIsAutoPlaying(!isAutoPlaying)}
                                    className="p-1"
                                >
                                    {isAutoPlaying ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                </GlassButton>

                                <div className="flex gap-1">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => handleImageChange(index)}
                                            className={cn(
                                                'w-2 h-2 glass-radius-full transition-all duration-200',
                                                index === currentIndex ? 'bg-white' : 'bg-white/40'
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reset Controls */}
                    {(zoom !== 1 || rotation !== 0 || pan.x !== 0 || pan.y !== 0) && (
                        <div className="absolute glass--glass--glass--glass--glassglass--glass-top-1/2 left-4 transform -translate-y-1/2">
                            <GlassButton
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    setZoom(1);
                                    setRotation(0);
                                    setPan({ x: 0, y: 0 });
                                }}
                                className="p-2"
                            >
                                <Home className="w-4 h-4" />
                            </GlassButton>
                        </div>
                    )}
                </CardContent>
            </GlassCard>
        </Motion>
    );
};

export default GlassImageViewer;
